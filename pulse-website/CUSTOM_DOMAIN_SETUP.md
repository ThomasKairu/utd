# Custom Domain Setup Guide: pulse.utdnews.com

## ✅ **Current Status**
- **CNAME file**: ✅ Created and deployed
- **Next.js config**: ✅ Updated for custom domain
- **GitHub Actions**: ✅ Configured for custom domain builds
- **GitHub Pages**: ✅ Ready for custom domain

## 🌐 **DNS Configuration Required**

To complete the setup of **pulse.utdnews.com**, you need to configure DNS records with your domain provider.

### **Step 1: DNS Records Setup**

Add the following DNS records in your domain provider's control panel:

#### **Option A: CNAME Record (Recommended)**
```
Type: CNAME
Name: pulse
Value: thomaskairu.github.io
TTL: 3600 (or default)
```

#### **Option B: A Records (Alternative)**
```
Type: A
Name: pulse
Value: 185.199.108.153
TTL: 3600

Type: A
Name: pulse
Value: 185.199.109.153
TTL: 3600

Type: A
Name: pulse
Value: 185.199.110.153
TTL: 3600

Type: A
Name: pulse
Value: 185.199.111.153
TTL: 3600
```

### **Step 2: GitHub Pages Configuration**

1. Go to your GitHub repository: https://github.com/ThomasKairu/utd
2. Navigate to **Settings** → **Pages**
3. In the **Custom domain** field, enter: `pulse.utdnews.com`
4. Click **Save**
5. Wait for DNS check to complete (may take a few minutes)
6. Enable **Enforce HTTPS** once DNS propagates

### **Step 3: Verification**

After DNS propagation (usually 5-60 minutes), verify:

1. **DNS Propagation**: Use https://dnschecker.org to check if `pulse.utdnews.com` resolves correctly
2. **Site Access**: Visit https://pulse.utdnews.com to confirm it loads
3. **HTTPS**: Ensure the site loads with SSL certificate

## 🔧 **Technical Details**

### **Current Configuration**
- **Repository**: https://github.com/ThomasKairu/utd
- **GitHub Pages Source**: `gh-pages` branch (auto-deployed)
- **Build Process**: Automated via GitHub Actions
- **CNAME File**: Automatically included in deployments

### **Asset Path Configuration**
The site is configured to work with both:
- **Custom Domain**: https://pulse.utdnews.com (no path prefix)
- **GitHub Pages**: https://thomaskairu.github.io/utd (with /utd prefix)

### **Environment Variables**
```bash
CUSTOM_DOMAIN=true                    # Enables custom domain mode
NEXT_PUBLIC_SITE_URL=https://pulse.utdnews.com
NEXT_PUBLIC_SITE_NAME=Pulse UTD News
```

## 🚀 **Deployment Process**

1. **Code Changes** → Push to `main` branch
2. **GitHub Actions** → Automatically builds with custom domain settings
3. **GitHub Pages** → Deploys to `gh-pages` branch
4. **Custom Domain** → Serves content at pulse.utdnews.com

## 📋 **Troubleshooting**

### **Common Issues**

1. **DNS Not Propagating**
   - Wait up to 24 hours for full propagation
   - Use different DNS checker tools
   - Clear browser cache

2. **GitHub Pages Not Recognizing Domain**
   - Ensure CNAME file is in repository root
   - Check GitHub Pages settings
   - Verify DNS records are correct

3. **SSL Certificate Issues**
   - Wait for GitHub to provision certificate (can take up to 24 hours)
   - Ensure DNS is properly configured
   - Try disabling and re-enabling HTTPS

### **Verification Commands**
```bash
# Check DNS resolution
nslookup pulse.utdnews.com

# Check CNAME record
dig pulse.utdnews.com CNAME

# Test HTTP response
curl -I https://pulse.utdnews.com
```

## 🎯 **Expected Timeline**

- **DNS Configuration**: 5 minutes
- **DNS Propagation**: 5-60 minutes
- **GitHub Pages Recognition**: 5-15 minutes
- **SSL Certificate**: 1-24 hours
- **Full Functionality**: 1-24 hours

## ✅ **Success Criteria**

When setup is complete, you should be able to:
- ✅ Access https://pulse.utdnews.com
- ✅ See valid SSL certificate
- ✅ Navigate all pages without errors
- ✅ Search functionality works
- ✅ All assets load correctly

## 📞 **Next Steps**

1. **Configure DNS** with your domain provider
2. **Set custom domain** in GitHub Pages settings
3. **Wait for propagation** and SSL provisioning
4. **Test the site** thoroughly
5. **Deploy Cloudflare Worker** for automation (next phase)

---

**Note**: The site will continue to work at https://thomaskairu.github.io/utd until the custom domain is fully configured.