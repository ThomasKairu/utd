# GitHub Pages Deployment Script

This repository includes automated deployment scripts to deploy your Next.js application to GitHub Pages with the custom domain `www.pulsenews.publicvm.com`.

## 🚀 Quick Deployment

### For Windows Users (Recommended)
```bash
npm run deploy:github-pages-win
```

### For Linux/Mac Users
```bash
npm run deploy:github-pages
```

### Manual Execution
```bash
# Windows
./deploy-github-pages.bat

# Linux/Mac
chmod +x deploy-github-pages.sh
./deploy-github-pages.sh
```

## 🔧 What the Script Does

### 1. **Build Optimization**
- Cleans previous builds (`out/` and `.next/`)
- Builds with custom domain configuration (`CUSTOM_DOMAIN=true`)
- Exports static files optimized for GitHub Pages

### 2. **GitHub Pages Configuration**
- Adds `.nojekyll` file to prevent Jekyll processing
- Creates `CNAME` file with your custom domain
- Generates `404.html` for client-side routing support

### 3. **SEO Enhancements**
- Creates `robots.txt` for search engine crawling
- Generates basic `sitemap.xml` with main pages
- Optimizes meta tags and structured data

### 4. **Git Deployment**
- Creates or switches to `gh-pages` branch
- Commits and pushes build output
- Returns to original branch after deployment

## 📋 Prerequisites

### 1. Git Repository Setup
```bash
# Initialize git if not already done
git init

# Add remote origin (replace with your repo URL)
git remote add origin https://github.com/ThomasKairu/utd.git

# Ensure you're on main branch
git checkout main
```

### 2. GitHub Pages Configuration
1. Go to your repository settings on GitHub
2. Navigate to "Pages" section
3. Set source to "Deploy from a branch"
4. Select `gh-pages` branch and `/ (root)` folder
5. Add custom domain: `www.pulsenews.publicvm.com`

### 3. DNS Configuration
Ensure your DNS provider has these records:
```
Type: CNAME
Name: www
Value: thomaskairu.github.io
```

## 🛠️ Troubleshooting

### Common Issues

#### 1. **Build Fails**
```bash
# Check Node.js version (should be 18+)
node --version

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### 2. **CSS Not Loading**
The script automatically configures paths for custom domains. If CSS still doesn't load:
- Check browser developer tools for 404 errors
- Verify the `next.config.ts` has correct `basePath` settings
- Ensure `CUSTOM_DOMAIN=true` environment variable is set

#### 3. **404 Errors on Page Refresh**
The script creates a `404.html` that redirects to home page. For better routing:
- Consider implementing proper client-side routing
- Use Next.js `trailingSlash: true` configuration (already set)

#### 4. **Git Permission Issues**
```bash
# Set git credentials
git config user.name "Your Name"
git config user.email "your.email@example.com"

# If using SSH, ensure key is added
ssh-add ~/.ssh/id_rsa
```

#### 5. **Custom Domain Not Working**
- Wait 24-48 hours for DNS propagation
- Check DNS settings with: `nslookup www.pulsenews.publicvm.com`
- Verify CNAME file exists in deployed site
- Check GitHub Pages settings show custom domain

## 📊 Deployment Verification

After running the script, verify deployment:

### 1. **Check Build Output**
```bash
# Verify files were created
ls -la out/

# Check for required files
ls out/index.html out/CNAME out/.nojekyll out/404.html
```

### 2. **Test Local Build**
```bash
# Serve locally to test
npx serve out/
# Visit http://localhost:3000
```

### 3. **Verify GitHub Pages**
1. Check repository's Actions tab for deployment status
2. Visit `https://www.pulsenews.publicvm.com` (may take 5-10 minutes)
3. Test navigation and CSS loading
4. Check mobile responsiveness

## 🔄 Continuous Deployment

### GitHub Actions (Optional)
Create `.github/workflows/deploy.yml` for automatic deployment:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run deployment script
        run: |
          chmod +x deploy-github-pages.sh
          ./deploy-github-pages.sh
```

## 📈 Performance Optimization

The deployment script includes several optimizations:

### 1. **Static Export**
- Generates static HTML files for better performance
- Optimizes images and assets
- Minimizes JavaScript bundles

### 2. **CDN Benefits**
- GitHub Pages provides global CDN
- Automatic HTTPS with custom domain
- Caching headers for static assets

### 3. **SEO Ready**
- Proper meta tags and structured data
- Sitemap for search engine indexing
- Robots.txt for crawler guidance

## 🔒 Security Considerations

### 1. **Environment Variables**
- Never commit `.env.local` files
- Use GitHub Secrets for sensitive data
- Rotate API keys regularly

### 2. **Content Security**
- Validate all user inputs
- Sanitize content before rendering
- Use HTTPS everywhere

## 📞 Support

If you encounter issues:

1. **Check the logs** - The script provides detailed output
2. **Verify prerequisites** - Ensure all requirements are met
3. **Test locally first** - Build and serve locally before deploying
4. **Check GitHub status** - Verify GitHub Pages service is operational

## 🎯 Next Steps

After successful deployment:

1. **Set up monitoring** - Use Google Analytics, Search Console
2. **Configure CDN** - Consider Cloudflare for additional optimization
3. **Implement CI/CD** - Automate deployments with GitHub Actions
4. **Add content** - Start publishing articles and content
5. **SEO optimization** - Submit sitemap to search engines

---

**Happy Deploying! 🚀**

Your site will be live at: https://www.pulsenews.publicvm.com