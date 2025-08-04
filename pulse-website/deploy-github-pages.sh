#!/bin/bash

# Stop on error
set -e

echo "🚀 Starting GitHub Pages deployment for www.pulsenews.publicvm.com"
echo "=================================================="

# 1. Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf out/
rm -rf .next/

# 2. Build and Export Next.js site with custom domain configuration
echo "🔨 Building and exporting Next.js site for custom domain..."
export NODE_ENV=production
export CUSTOM_DOMAIN=true
export GITHUB_PAGES=false

npm run build

# 3. Add .nojekyll to prevent GitHub Pages from ignoring _next folder
echo "📂 Adding .nojekyll to prevent Jekyll processing..."
touch out/.nojekyll

# 4. Add CNAME file for custom domain
echo "🌐 Setting custom domain..."
echo "www.pulsenews.publicvm.com" > out/CNAME

# 5. Add fallback 404.html redirect for client-side routing
echo "🔁 Adding 404.html redirect for SPA routing..."
cat <<EOL > out/404.html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Redirecting...</title>
    <meta http-equiv="refresh" content="0; url=/" />
    <link rel="canonical" href="/" />
    <script>
        // Redirect to home page for client-side routing
        window.location.href = '/';
    </script>
</head>
<body>
    <p>Redirecting to <a href="/">homepage</a>...</p>
</body>
</html>
EOL

# 6. Fix CSS and asset paths for custom domain
echo "🎨 Fixing CSS and asset paths..."
# Since we're using a custom domain, paths should be absolute from root
# The Next.js config should handle this, but let's ensure no issues

# 7. Add robots.txt for SEO
echo "🤖 Adding robots.txt..."
cat <<EOL > out/robots.txt
User-agent: *
Allow: /

Sitemap: https://www.pulsenews.publicvm.com/sitemap.xml
EOL

# 8. Add sitemap.xml placeholder
echo "🗺️ Adding sitemap.xml..."
cat <<EOL > out/sitemap.xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://www.pulsenews.publicvm.com/</loc>
        <lastmod>$(date -u +%Y-%m-%dT%H:%M:%S+00:00)</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>https://www.pulsenews.publicvm.com/about/</loc>
        <lastmod>$(date -u +%Y-%m-%dT%H:%M:%S+00:00)</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
</urlset>
EOL

# 9. Verify build output
echo "🔍 Verifying build output..."
if [ ! -f "out/index.html" ]; then
    echo "❌ Error: index.html not found in out/ directory"
    exit 1
fi

if [ ! -f "out/_next/static/css/"*.css ]; then
    echo "⚠️ Warning: CSS files not found in expected location"
    echo "Checking for CSS files..."
    find out/ -name "*.css" -type f | head -5
fi

echo "✅ Build verification completed"

# 10. Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a git repository. Please run 'git init' first."
    exit 1
fi

# 11. Check if gh-pages branch exists and handle accordingly
echo "🌿 Preparing gh-pages branch..."

# Store current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "Current branch: $CURRENT_BRANCH"

# Check if gh-pages branch exists
if git show-ref --verify --quiet refs/heads/gh-pages; then
    echo "gh-pages branch exists, switching to it..."
    git checkout gh-pages
    
    # Clear existing content but keep .git
    find . -maxdepth 1 ! -name '.git' ! -name '.' ! -name '..' -exec rm -rf {} +
else
    echo "Creating new orphan gh-pages branch..."
    git checkout --orphan gh-pages
    
    # Remove all files from the new orphan branch
    git rm -rf . 2>/dev/null || true
fi

# 12. Copy build output to gh-pages branch
echo "📋 Copying build output to gh-pages branch..."
cp -r out/* .

# 13. Add all files and commit
echo "📝 Committing changes..."
git add --all

# Check if there are changes to commit
if git diff --staged --quiet; then
    echo "⚠️ No changes to commit. Build output might be identical to previous deployment."
else
    git commit -m "Deploy Next.js site to GitHub Pages - $(date -u +%Y-%m-%d\ %H:%M:%S\ UTC)"
fi

# 14. Deploy to gh-pages branch
echo "🚀 Deploying to gh-pages branch..."
git push origin gh-pages --force

# 15. Switch back to original branch
echo "🔄 Switching back to $CURRENT_BRANCH branch..."
git checkout "$CURRENT_BRANCH"

# 16. Final verification and instructions
echo ""
echo "✅ Deployment completed successfully!"
echo "=================================================="
echo "🌐 Your site will be available at: https://www.pulsenews.publicvm.com"
echo ""
echo "📋 Next steps:"
echo "1. Verify GitHub Pages is configured to use gh-pages branch"
echo "2. Ensure custom domain is set to: www.pulsenews.publicvm.com"
echo "3. Check DNS settings point to GitHub Pages"
echo "4. Wait 5-10 minutes for deployment to propagate"
echo ""
echo "🔧 GitHub Pages Settings:"
echo "   - Source: Deploy from a branch"
echo "   - Branch: gh-pages / (root)"
echo "   - Custom domain: www.pulsenews.publicvm.com"
echo ""
echo "📊 Build Summary:"
echo "   - Build output: $(du -sh out/ 2>/dev/null | cut -f1 || echo 'N/A')"
echo "   - Files deployed: $(find out/ -type f | wc -l 2>/dev/null || echo 'N/A')"
echo "   - Deployment time: $(date)"
echo ""
echo "🎉 Deployment script completed!"