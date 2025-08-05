# 🌐 DNS Configuration Guide for www.pulsenews.publicvm.com

## 🚨 **Current Issue**
**Error**: `www.pulsenews.publicvm.com is improperly configured - Domain's DNS record could not be retrieved (InvalidDNSError)`

## 🔍 **Problem Analysis**
The domain `www.pulsenews.publicvm.com` does not have proper DNS records configured. This means:
- No A record pointing to an IP address
- No CNAME record pointing to another domain
- DNS servers cannot resolve the domain

## ✅ **Solution Options**

### **Option 1: Configure DNS Records (Recommended)**

#### **If using GitHub Pages:**
1. **Go to your repository settings**
   - Navigate to `Settings` → `Pages`
   - Set custom domain to: `www.pulsenews.publicvm.com`
   - Wait for DNS check to complete

2. **Configure DNS at your domain provider:**
   ```
   Type: CNAME
   Name: www
   Value: yourusername.github.io
   TTL: 3600
   ```

#### **If using other hosting (Netlify, Vercel, etc.):**
1. **For Netlify:**
   ```
   Type: CNAME
   Name: www
   Value: your-site-name.netlify.app
   ```

2. **For Vercel:**
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

3. **For custom hosting:**
   ```
   Type: A
   Name: www
   Value: YOUR_SERVER_IP_ADDRESS
   ```

### **Option 2: Use Domain Without WWW**

If you cannot configure DNS for the www subdomain, update the code to use `pulsenews.publicvm.com` instead.

## 🛠️ **DNS Configuration Steps**

### **Step 1: Identify Your Domain Provider**
- Check where `publicvm.com` is registered
- Access the DNS management panel

### **Step 2: Add DNS Records**
Add one of these record types:

#### **For GitHub Pages:**
```
Type: CNAME
Name: www
Target: yourusername.github.io
TTL: 3600 (1 hour)
```

#### **For Direct IP:**
```
Type: A
Name: www
Target: YOUR_SERVER_IP
TTL: 3600 (1 hour)
```

### **Step 3: Verify DNS Propagation**
1. Wait 5-60 minutes for DNS propagation
2. Test using online tools:
   - https://dnschecker.org
   - https://whatsmydns.net
3. Check with command line:
   ```bash
   nslookup www.pulsenews.publicvm.com
   dig www.pulsenews.publicvm.com
   ```

## 🔧 **Alternative: Update Code to Use Non-WWW Domain**

If DNS configuration is not possible, update the codebase to use `pulsenews.publicvm.com`:

### **Files to Update:**
1. `src/app/layout.tsx`
2. `src/app/robots.ts`
3. `src/app/sitemap.ts`
4. `src/app/page.tsx`
5. `src/app/article/[slug]/page.tsx`
6. `src/app/category/[slug]/page.tsx`
7. `src/app/about/page.tsx`
8. `src/app/editorial-policy/page.tsx`
9. `public/rss.xml`
10. `next-seo.config.js`

### **Global Find & Replace:**
```bash
# Find: https://www.pulsenews.publicvm.com
# Replace: https://pulsenews.publicvm.com
```

## 📋 **Troubleshooting Checklist**

### **DNS Issues:**
- [ ] DNS records are properly configured
- [ ] TTL has expired (wait for propagation)
- [ ] No conflicting DNS records exist
- [ ] Domain is not expired or suspended

### **GitHub Pages Issues:**
- [ ] Custom domain is set in repository settings
- [ ] CNAME file exists in repository root
- [ ] DNS records point to correct GitHub Pages URL
- [ ] SSL certificate is provisioned (can take 24 hours)

### **Hosting Issues:**
- [ ] Hosting service supports custom domains
- [ ] Domain is properly configured in hosting dashboard
- [ ] SSL certificate is active
- [ ] No conflicting redirects

## 🚀 **Quick Fix Commands**

### **Option A: Fix DNS (Recommended)**
1. Configure DNS records as shown above
2. Wait for propagation (5-60 minutes)
3. Test the domain

### **Option B: Update Code to Non-WWW**
```bash
cd "c:\Users\Administrator\Documents\Web Dev\automated_news\pulse-website"

# Update all files to use non-www domain
# This requires manual editing of each file
```

## 📞 **Next Steps**

1. **Choose your preferred option:**
   - Fix DNS configuration (recommended)
   - Update code to use non-www domain

2. **If fixing DNS:**
   - Access your domain provider's DNS settings
   - Add the appropriate CNAME or A record
   - Wait for propagation

3. **If updating code:**
   - I can help update all the files to use `pulsenews.publicvm.com`
   - Then commit and push the changes

**Which option would you prefer to proceed with?**