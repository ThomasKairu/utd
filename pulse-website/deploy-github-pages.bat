@echo off
setlocal enabledelayedexpansion

echo 🚀 Starting GitHub Pages deployment for www.pulsenews.publicvm.com
echo ==================================================

REM 1. Clean previous builds
echo 🧹 Cleaning previous builds...
if exist out rmdir /s /q out
if exist .next rmdir /s /q .next

REM 2. Build and Export Next.js site with custom domain configuration
echo 🔨 Building and exporting Next.js site for custom domain...
set NODE_ENV=production
set CUSTOM_DOMAIN=true
set GITHUB_PAGES=false

call npm run build
if errorlevel 1 (
    echo ❌ Build failed!
    exit /b 1
)

REM 3. Add .nojekyll to prevent GitHub Pages from ignoring _next folder
echo 📂 Adding .nojekyll to prevent Jekyll processing...
echo. > out\.nojekyll

REM 4. Add CNAME file for custom domain
echo 🌐 Setting custom domain...
echo www.pulsenews.publicvm.com > out\CNAME

REM 5. Add fallback 404.html redirect for client-side routing
echo 🔁 Adding 404.html redirect for SPA routing...
(
echo ^<!DOCTYPE html^>
echo ^<html lang="en"^>
echo ^<head^>
echo     ^<meta charset="utf-8"^>
echo     ^<title^>Redirecting...^</title^>
echo     ^<meta http-equiv="refresh" content="0; url=/" /^>
echo     ^<link rel="canonical" href="/" /^>
echo     ^<script^>
echo         // Redirect to home page for client-side routing
echo         window.location.href = '/';
echo     ^</script^>
echo ^</head^>
echo ^<body^>
echo     ^<p^>Redirecting to ^<a href="/"^>homepage^</a^>...^</p^>
echo ^</body^>
echo ^</html^>
) > out\404.html

REM 6. Add robots.txt for SEO
echo 🤖 Adding robots.txt...
(
echo User-agent: *
echo Allow: /
echo.
echo Sitemap: https://www.pulsenews.publicvm.com/sitemap.xml
) > out\robots.txt

REM 7. Add sitemap.xml placeholder
echo 🗺️ Adding sitemap.xml...
for /f "tokens=1-4 delims=/ " %%a in ('date /t') do set mydate=%%d-%%b-%%c
for /f "tokens=1-2 delims=: " %%a in ('time /t') do set mytime=%%a:%%b
(
echo ^<?xml version="1.0" encoding="UTF-8"?^>
echo ^<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"^>
echo     ^<url^>
echo         ^<loc^>https://www.pulsenews.publicvm.com/^</loc^>
echo         ^<lastmod^>%mydate%T%mytime%+00:00^</lastmod^>
echo         ^<changefreq^>daily^</changefreq^>
echo         ^<priority^>1.0^</priority^>
echo     ^</url^>
echo     ^<url^>
echo         ^<loc^>https://www.pulsenews.publicvm.com/about/^</loc^>
echo         ^<lastmod^>%mydate%T%mytime%+00:00^</lastmod^>
echo         ^<changefreq^>weekly^</changefreq^>
echo         ^<priority^>0.8^</priority^>
echo     ^</url^>
echo ^</urlset^>
) > out\sitemap.xml

REM 8. Verify build output
echo 🔍 Verifying build output...
if not exist out\index.html (
    echo ❌ Error: index.html not found in out\ directory
    exit /b 1
)

echo ✅ Build verification completed

REM 9. Check if we're in a git repository
git rev-parse --git-dir >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Not in a git repository. Please run 'git init' first.
    exit /b 1
)

REM 10. Get current branch
for /f "tokens=*" %%i in ('git branch --show-current') do set CURRENT_BRANCH=%%i
echo Current branch: %CURRENT_BRANCH%

REM 11. Check if gh-pages branch exists and handle accordingly
echo 🌿 Preparing gh-pages branch...

git show-ref --verify --quiet refs/heads/gh-pages
if errorlevel 1 (
    echo Creating new orphan gh-pages branch...
    git checkout --orphan gh-pages
    git rm -rf . 2>nul
) else (
    echo gh-pages branch exists, switching to it...
    git checkout gh-pages
    
    REM Clear existing content but keep .git
    for /f "tokens=*" %%i in ('dir /b /a-h') do (
        if not "%%i"==".git" (
            if exist "%%i\" (
                rmdir /s /q "%%i"
            ) else (
                del /q "%%i"
            )
        )
    )
)

REM 12. Copy build output to gh-pages branch
echo 📋 Copying build output to gh-pages branch...
xcopy out\* . /e /h /y

REM 13. Add all files and commit
echo 📝 Committing changes...
git add --all

REM Check if there are changes to commit
git diff --staged --quiet
if errorlevel 1 (
    git commit -m "Deploy Next.js site to GitHub Pages - %date% %time%"
) else (
    echo ⚠️ No changes to commit. Build output might be identical to previous deployment.
)

REM 14. Deploy to gh-pages branch
echo 🚀 Deploying to gh-pages branch...
git push origin gh-pages --force

REM 15. Switch back to original branch
echo 🔄 Switching back to %CURRENT_BRANCH% branch...
git checkout %CURRENT_BRANCH%

REM 16. Final verification and instructions
echo.
echo ✅ Deployment completed successfully!
echo ==================================================
echo 🌐 Your site will be available at: https://www.pulsenews.publicvm.com
echo.
echo 📋 Next steps:
echo 1. Verify GitHub Pages is configured to use gh-pages branch
echo 2. Ensure custom domain is set to: www.pulsenews.publicvm.com
echo 3. Check DNS settings point to GitHub Pages
echo 4. Wait 5-10 minutes for deployment to propagate
echo.
echo 🔧 GitHub Pages Settings:
echo    - Source: Deploy from a branch
echo    - Branch: gh-pages / (root)
echo    - Custom domain: www.pulsenews.publicvm.com
echo.
echo 🎉 Deployment script completed!

pause