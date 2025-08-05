#!/bin/bash

# Pulse News Worker Deployment Script
# Automates the complete deployment process

set -e

echo "🚀 Pulse News Worker Deployment"
echo "================================"

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler CLI not found. Installing..."
    npm install -g wrangler
fi

# Check if we're logged in to Cloudflare
echo "🔐 Checking Cloudflare authentication..."
if ! wrangler whoami &> /dev/null; then
    echo "❌ Not logged in to Cloudflare. Please run: wrangler login"
    exit 1
fi

echo "✅ Cloudflare authentication verified"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if secrets are configured
echo "🔑 Checking required secrets..."
REQUIRED_SECRETS=("SUPABASE_SERVICE_KEY" "OPENROUTER_API_KEY")
MISSING_SECRETS=()

for secret in "${REQUIRED_SECRETS[@]}"; do
    if ! wrangler secret list | grep -q "$secret"; then
        MISSING_SECRETS+=("$secret")
    fi
done

if [ ${#MISSING_SECRETS[@]} -ne 0 ]; then
    echo "❌ Missing required secrets:"
    for secret in "${MISSING_SECRETS[@]}"; do
        echo "   - $secret"
    done
    echo ""
    echo "Please set secrets using:"
    for secret in "${MISSING_SECRETS[@]}"; do
        echo "   wrangler secret put $secret"
    done
    exit 1
fi

echo "✅ All required secrets configured"

# Check KV namespace
echo "🗄️ Checking KV namespace..."
if ! wrangler kv:namespace list | grep -q "KV_NAMESPACE"; then
    echo "⚠️ KV namespace not found. Creating..."
    wrangler kv:namespace create KV_NAMESPACE
    echo "📝 Please update wrangler.toml with the new namespace ID"
    echo "   Then run this script again"
    exit 1
fi

echo "✅ KV namespace configured"

# Validate TypeScript
echo "🔍 Validating TypeScript..."
npx tsc --noEmit

echo "✅ TypeScript validation passed"

# Deploy to development first
echo "🚀 Deploying to development environment..."
wrangler deploy --env development

echo "✅ Development deployment successful"

# Ask for production deployment
read -p "🤔 Deploy to production? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Deploying to production environment..."
    wrangler deploy --env production
    echo "✅ Production deployment successful"
else
    echo "⏭️ Skipping production deployment"
fi

# Test the deployment
echo "🧪 Testing deployment..."
WORKER_URL=$(wrangler subdomain | grep -o 'https://[^/]*')

if [ -n "$WORKER_URL" ]; then
    echo "🔍 Testing health endpoint..."
    if curl -s "$WORKER_URL/health" | grep -q "healthy"; then
        echo "✅ Health check passed"
    else
        echo "⚠️ Health check failed - worker may still be starting"
    fi
else
    echo "⚠️ Could not determine worker URL for testing"
fi

echo ""
echo "🎉 Deployment Complete!"
echo "======================"
echo ""
echo "📊 Monitor your worker:"
echo "   wrangler tail"
echo ""
echo "🔍 Check health:"
echo "   curl $WORKER_URL/health"
echo ""
echo "📈 View stats:"
echo "   curl $WORKER_URL/stats"
echo ""
echo "🔄 Manual trigger:"
echo "   curl -X POST $WORKER_URL/trigger"
echo ""
echo "📝 Next steps:"
echo "   1. Monitor logs: wrangler tail"
echo "   2. Check processing stats in 15 minutes"
echo "   3. Verify articles appear in Supabase database"
echo "   4. Test frontend updates automatically"
echo ""