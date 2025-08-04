# 🌐 Complete DNS Setup Guide for www.pulsenews.publicvm.com

## 🔧 **Issue Fixed: CNAME File Updated**
✅ **Updated**: `public/CNAME` now contains `www.pulsenews.publicvm.com`
✅ **Previous**: File contained old domain `pulse.utdnews.com`

## 📋 **DNS Configuration Steps**

### **Step 1: Configure DNS Records at Your Domain Provider**

You need to add DNS records for `publicvm.com` domain. Access your domain provider's DNS management panel and add:

#### **Required DNS Records:**

```dns
# For the www subdomain (required)
Type: CNAME
Name: www
Target: thomaskairu.github.io
TTL: 3600

# For the root domain (optional but recommended)
Type: A
Name: @
Target: 185.199.108.153
TTL: 3600

Type: A
Name: @
Target: 185.199.109.153
TTL: 3600

Type: A
Name: @
Target: 185.199.110.153
TTL: 3600

Type: A
Name: @
Target: 185.199.111.153
TTL: 3600
```

### **Step 2: GitHub Pages Configuration**

1. **Go to your GitHub repository**: https://github.com/ThomasKairu/utd
2. **Navigate to Settings** → **Pages**
3. **Set Custom Domain**: Enter `www.pulsenews.publicvm.com`
4. **Enable "Enforce HTTPS"** (after DNS propagates)

### **Step 3: Verify DNS Propagation**

After adding DNS records, wait 5-60 minutes and check:

#### **Online Tools:**
- https://dnschecker.org - Enter `www.pulsenews.publicvm.com`
- https://whatsmydns.net - Check global DNS propagation

#### **Command Line:**
```bash
# Check CNAME record
nslookup www.pulsenews.publicvm.com

# Check if it resolves to GitHub Pages
dig www.pulsenews.publicvm.com CNAME

# Expected result should show: thomaskairu.github.io
```

## 🏢 **Domain Provider Specific Instructions**

### **If using Cloudflare:**
1. Login to Cloudflare dashboard
2. Select `publicvm.com` domain
3. Go to **DNS** → **Records**
4. Add CNAME record:
   - **Type**: CNAME
   - **Name**: www
   - **Target**: thomaskairu.github.io
   - **Proxy status**: DNS only (gray cloud)

### **If using Namecheap:**
1. Login to Namecheap account
2. Go to **Domain List** → **Manage** for publicvm.com
3. Go to **Advanced DNS**
4. Add CNAME record:
   - **Type**: CNAME Record
   - **Host**: www
   - **Value**: thomaskairu.github.io
   - **TTL**: 1 hour

### **If using GoDaddy:**
1. Login to GoDaddy account
2. Go to **My Products** → **DNS**
3. Select publicvm.com
4. Add CNAME record:
   - **Type**: CNAME
   - **Name**: www
   - **Value**: thomaskairu.github.io
   - **TTL**: 1 hour

### **If using Google Domains:**
1. Login to Google Domains
2. Select publicvm.com
3. Go to **DNS**
4. Add custom resource record:
   - **Name**: www
   - **Type**: CNAME
   - **TTL**: 1H
   - **Data**: thomaskairu.github.io

## 🚀 **Deployment Process**

### **Current Status:**
✅ CNAME file updated
✅ GitHub Actions configured
✅ Code ready for deployment

### **Next Steps:**
1. **Commit and push the CNAME file change**
2. **Configure DNS records** (as shown above)
3. **Wait for DNS propagation** (5-60 minutes)
4. **Set custom domain in GitHub Pages**
5. **Enable HTTPS enforcement**

## 📊 **Verification Checklist**

### **DNS Configuration:**
- [ ] CNAME record added for www subdomain
- [ ] DNS propagation completed (check with dnschecker.org)
- [ ] Domain resolves to thomaskairu.github.io

### **GitHub Pages:**
- [ ] Custom domain set to www.pulsenews.publicvm.com
- [ ] CNAME file exists in repository
- [ ] SSL certificate provisioned (may take 24 hours)
- [ ] HTTPS enforcement enabled

### **Website Access:**
- [ ] https://www.pulsenews.publicvm.com loads successfully
- [ ] SSL certificate is valid
- [ ] All pages and assets load correctly

## 🔍 **Troubleshooting**

### **Common Issues:**

#### **"Domain's DNS record could not be retrieved"**
- **Cause**: DNS records not configured or not propagated
- **Solution**: Add CNAME record and wait for propagation

#### **"Domain is not properly configured"**
- **Cause**: CNAME record points to wrong target
- **Solution**: Ensure CNAME points to `thomaskairu.github.io`

#### **SSL Certificate Issues**
- **Cause**: GitHub needs time to provision certificate
- **Solution**: Wait up to 24 hours after DNS configuration

#### **404 Errors**
- **Cause**: CNAME file missing or incorrect
- **Solution**: Ensure CNAME file contains correct domain

## 📞 **Support Resources**

### **GitHub Pages Documentation:**
- https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site

### **DNS Checker Tools:**
- https://dnschecker.org
- https://whatsmydns.net
- https://mxtoolbox.com/DNSLookup.aspx

### **GitHub Pages IP Addresses (for A records):**
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

## 🎯 **Expected Timeline**

- **DNS Configuration**: 5 minutes
- **DNS Propagation**: 5-60 minutes
- **GitHub Pages Recognition**: 5-15 minutes
- **SSL Certificate**: Up to 24 hours

**Total Setup Time**: 1-24 hours (mostly waiting for propagation)

---

## 🚀 **Ready to Deploy!**

1. **Commit the CNAME file change** (already done)
2. **Configure DNS records** at your domain provider
3. **Push changes** to trigger GitHub Actions deployment
4. **Set custom domain** in GitHub Pages settings
5. **Wait for DNS propagation** and SSL provisioning

Your website will be live at **https://www.pulsenews.publicvm.com** once DNS is configured!