# ============================================================
#  BizSoft Solutions — GitHub Setup & Push Script
#  Double-click or run in PowerShell
#  This script will:
#    1. Initialize git repo
#    2. Set your name & email
#    3. Add all website files
#    4. Create the first commit
#    5. Push to GitHub
# ============================================================

$projectPath = "C:\Users\tarun\Documents\Claude\Projects\Bizsoftsolution"
$githubUser  = "tarunchettam"
$repoName    = "bizsoftsolutions.in"
$remoteURL   = "https://github.com/$githubUser/$repoName.git"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  BizSoft Solutions — GitHub Push" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Go to project folder
Set-Location $projectPath

# Remove any broken .git and reinitialize
Write-Host "Step 1: Initializing git repository..." -ForegroundColor Yellow
if (Test-Path ".git") { Remove-Item -Recurse -Force ".git" }
git init
git checkout -b main

# Set identity
Write-Host "Step 2: Setting git identity..." -ForegroundColor Yellow
git config user.name  "Tarun Chettam"
git config user.email "tarunchettam@gmail.com"

# Create .gitignore (exclude Apps Script file from public repo)
Write-Host "Step 3: Creating .gitignore..." -ForegroundColor Yellow
@"
# Exclude Apps Script backend file (keep locally only)
Code.gs
SETUP-GUIDE.md
github-push.ps1
*.lock
"@ | Out-File -Encoding UTF8 .gitignore

# Stage all website files
Write-Host "Step 4: Adding all website files..." -ForegroundColor Yellow
git add index.html
git add form.js
git add vyapar/
git add biz-analyst/
git add bill-touch/
git add blog/
git add .gitignore
git status

# First commit
Write-Host "Step 5: Creating first commit..." -ForegroundColor Yellow
git commit -m "Initial commit — BizSoft Solutions website

Pages included:
- Homepage (index.html) with lead form + WhatsApp
- Vyapar landing page
- Biz Analyst landing page
- Bill Touch landing page
- 4 SEO blog posts
- Shared form handler (form.js)

Lead flow: Form → Google Sheet (Apps Script) + WhatsApp (wa.me)"

# Set remote and push
Write-Host ""
Write-Host "Step 6: Connecting to GitHub..." -ForegroundColor Yellow
Write-Host "Remote URL: $remoteURL" -ForegroundColor Gray

git remote add origin $remoteURL

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  READY TO PUSH!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "BEFORE pushing, make sure you have:" -ForegroundColor White
Write-Host "  1. Created the repo on GitHub:" -ForegroundColor White
Write-Host "     https://github.com/new" -ForegroundColor Cyan
Write-Host "     Name: bizsoftsolutions.in" -ForegroundColor Cyan
Write-Host "     Visibility: Public" -ForegroundColor Cyan
Write-Host "     DO NOT tick 'Add README'" -ForegroundColor Red
Write-Host ""
Write-Host "  2. Once repo is created, press Enter below to push..." -ForegroundColor White
Read-Host "Press Enter when GitHub repo is ready"

Write-Host ""
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push -u origin main

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  DONE! Your site is on GitHub!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next step — Enable GitHub Pages:" -ForegroundColor White
Write-Host "  1. Go to: https://github.com/$githubUser/$repoName/settings/pages" -ForegroundColor Cyan
Write-Host "  2. Source: Deploy from branch" -ForegroundColor White
Write-Host "  3. Branch: main / root" -ForegroundColor White
Write-Host "  4. Click Save" -ForegroundColor White
Write-Host ""
Write-Host "Your site will be live at:" -ForegroundColor Green
Write-Host "  https://$githubUser.github.io/$repoName/" -ForegroundColor Cyan
Write-Host ""
Read-Host "Press Enter to exit"
