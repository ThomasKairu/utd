#!/bin/bash

# Pulse UTD News Deployment Script
# This script handles the complete deployment process

set -e

echo "🚀 Starting Pulse UTD News deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required environment variables are set
check_env_vars() {
    print_status "Checking environment variables..."
    
    required_vars=(
        "NEXT_PUBLIC_SUPABASE_URL"
        "NEXT_PUBLIC_SUPABASE_ANON_KEY"
        "SUPABASE_SERVICE_ROLE_KEY"
        "OPENROUTER_API_KEY"
        "SCRAPER_API_KEY"
    )
    
    missing_vars=()
    
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            missing_vars+=("$var")
        fi
    done
    
    if [ ${#missing_vars[@]} -ne 0 ]; then
        print_error "Missing required environment variables:"
        for var in "${missing_vars[@]}"; do
            echo "  - $var"
        done
        print_error "Please set these variables in your .env.local file"
        exit 1
    fi
    
    print_status "All required environment variables are set ✅"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    npm ci
    print_status "Dependencies installed ✅"
}

# Run tests
run_tests() {
    print_status "Running tests..."
    npm run test
    print_status "Tests passed ✅"
}

# Build the application
build_app() {
    print_status "Building Next.js application..."
    npm run build
    print_status "Build completed ✅"
}

# Deploy Cloudflare Worker
deploy_worker() {
    print_status "Deploying Cloudflare Worker..."
    
    if [ ! -d "worker" ]; then
        print_warning "Worker directory not found, skipping worker deployment"
        return
    fi
    
    cd worker
    
    # Install worker dependencies
    if [ ! -d "node_modules" ]; then
        print_status "Installing worker dependencies..."
        npm install
    fi
    
    # Deploy worker
    print_status "Deploying worker to Cloudflare..."
    npm run deploy
    
    cd ..
    print_status "Worker deployed ✅"
}

# Deploy to GitHub Pages
deploy_to_github_pages() {
    print_status "Deploying to GitHub Pages..."
    
    # Check if gh-pages branch exists
    if git show-ref --verify --quiet refs/heads/gh-pages; then
        print_status "gh-pages branch exists"
    else
        print_status "Creating gh-pages branch..."
        git checkout --orphan gh-pages
        git rm -rf .
        git commit --allow-empty -m "Initial gh-pages commit"
        git checkout main
    fi
    
    # Deploy using gh-pages package
    if command -v npx &> /dev/null; then
        npx gh-pages -d out -b gh-pages
        print_status "Deployed to GitHub Pages ✅"
    else
        print_error "npx not found. Please install Node.js"
        exit 1
    fi
}

# Setup database
setup_database() {
    print_status "Setting up database..."
    
    if [ -f "database/schema.sql" ]; then
        print_status "Database schema found. Please run the schema.sql file in your Supabase dashboard."
        print_warning "Manual step required: Execute database/schema.sql in Supabase SQL Editor"
    else
        print_warning "Database schema not found"
    fi
}

# Main deployment function
main() {
    print_status "Starting deployment process..."
    
    # Check if we're in the right directory
    if [ ! -f "package.json" ]; then
        print_error "package.json not found. Please run this script from the project root."
        exit 1
    fi
    
    # Check environment variables
    check_env_vars
    
    # Install dependencies
    install_dependencies
    
    # Run tests
    run_tests
    
    # Build application
    build_app
    
    # Setup database (manual step)
    setup_database
    
    # Deploy worker
    deploy_worker
    
    # Deploy to GitHub Pages
    deploy_to_github_pages
    
    print_status "🎉 Deployment completed successfully!"
    print_status "Your site should be available at: https://yourusername.github.io/utd"
    print_warning "Don't forget to:"
    echo "  1. Set up your custom domain in GitHub Pages settings"
    echo "  2. Configure Cloudflare DNS for pulse.utdnews.com"
    echo "  3. Run the database schema in Supabase"
    echo "  4. Set up your Cloudflare Worker KV namespace"
}

# Handle script arguments
case "${1:-}" in
    "worker")
        deploy_worker
        ;;
    "site")
        check_env_vars
        install_dependencies
        run_tests
        build_app
        deploy_to_github_pages
        ;;
    "db")
        setup_database
        ;;
    *)
        main
        ;;
esac