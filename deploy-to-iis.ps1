# PowerShell Script for IIS Deployment
# Run as Administrator

param(
    [Parameter(Mandatory=$false)]
    [string]$IISPath = "C:\inetpub\wwwroot",
    
    [Parameter(Mandatory=$false)]
    [switch]$BackupExisting
)

Write-Host "🚀 Starting IIS Deployment for Sistema de Controle de Estoque" -ForegroundColor Green

# Check if running as administrator
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "❌ This script requires Administrator privileges." -ForegroundColor Red
    Write-Host "Please run PowerShell as Administrator and try again." -ForegroundColor Yellow
    exit 1
}

# Build the application
Write-Host "📦 Building React application..." -ForegroundColor Blue
try {
    npm run build
    if ($LASTEXITCODE -ne 0) {
        throw "Build failed"
    }
    Write-Host "✅ Build successful" -ForegroundColor Green
} catch {
    Write-Host "❌ Build failed. Please check your Node.js installation and try again." -ForegroundColor Red
    exit 1
}

# Check if dist folder exists
if (!(Test-Path "dist")) {
    Write-Host "❌ Dist folder not found. Build may have failed." -ForegroundColor Red
    exit 1
}

# Backup existing files if requested
if ($BackupExisting -and (Test-Path $IISPath)) {
    $backupPath = "${IISPath}_backup_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
    Write-Host "💾 Creating backup at: $backupPath" -ForegroundColor Yellow
    Copy-Item -Path $IISPath -Destination $backupPath -Recurse -Force
}

# Create IIS directory if it doesn't exist
if (!(Test-Path $IISPath)) {
    Write-Host "📁 Creating IIS directory: $IISPath" -ForegroundColor Blue
    New-Item -Path $IISPath -ItemType Directory -Force
}

# Copy files to IIS
Write-Host "📂 Copying files to IIS directory..." -ForegroundColor Blue
try {
    # Remove existing files except web.config (to preserve IIS settings)
    Get-ChildItem -Path $IISPath -Exclude "web.config" | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
    
    # Copy new files
    Copy-Item -Path "dist\*" -Destination $IISPath -Recurse -Force
    Write-Host "✅ Files copied successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to copy files: $_" -ForegroundColor Red
    exit 1
}

# Verify deployment
Write-Host "🔍 Verifying deployment..." -ForegroundColor Blue
if (Test-Path "$IISPath\index.html") {
    Write-Host "✅ index.html found" -ForegroundColor Green
} else {
    Write-Host "❌ index.html not found!" -ForegroundColor Red
}

if (Test-Path "$IISPath\web.config") {
    Write-Host "✅ web.config found" -ForegroundColor Green
} else {
    Write-Host "⚠️  web.config not found - SPA routing may not work" -ForegroundColor Yellow
}

# Check IIS status
Write-Host "🌐 Checking IIS status..." -ForegroundColor Blue
try {
    $iisService = Get-Service -Name "W3SVC" -ErrorAction Stop
    if ($iisService.Status -eq "Running") {
        Write-Host "✅ IIS is running" -ForegroundColor Green
    } else {
        Write-Host "⚠️  IIS is not running. Starting IIS..." -ForegroundColor Yellow
        Start-Service -Name "W3SVC"
        Write-Host "✅ IIS started" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Could not check IIS status. Please verify manually." -ForegroundColor Yellow
}

Write-Host "`n🎉 Deployment Complete!" -ForegroundColor Green
Write-Host "📋 Summary:" -ForegroundColor White
Write-Host "   • Files deployed to: $IISPath" -ForegroundColor Gray
Write-Host "   • Access your app at: http://192.168.0.192:85/" -ForegroundColor Gray
Write-Host "   • Login: admin@estoque.com / admin123" -ForegroundColor Gray

Write-Host "`n💡 Tips:" -ForegroundColor Cyan
Write-Host "   • Check browser console for any issues" -ForegroundColor Gray
Write-Host "   • App will use static data if no API is available" -ForegroundColor Gray
Write-Host "   • See IIS_DEPLOYMENT_GUIDE.md for troubleshooting" -ForegroundColor Gray

# Open browser (optional)
$openBrowser = Read-Host "`nOpen browser to test? (y/N)"
if ($openBrowser -eq 'y' -or $openBrowser -eq 'Y') {
    Start-Process "http://192.168.0.192:85/"
}

Write-Host "`n✨ Deployment script completed successfully!" -ForegroundColor Green