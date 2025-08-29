# PowerShell Script to Fix IIS Error 500.19
# Run as Administrator

Write-Host "Fixing IIS Error 500.19 for React App" -ForegroundColor Red

# Check if running as administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")

if (-not $isAdmin) {
    Write-Host "ERROR: This script requires Administrator privileges!" -ForegroundColor Red
    Write-Host "Right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "Running with Administrator privileges" -ForegroundColor Green

# Step 1: Stop IIS
Write-Host "Step 1: Stopping IIS..." -ForegroundColor Blue
try {
    iisreset /stop
    Write-Host "IIS stopped successfully" -ForegroundColor Green
}
catch {
    Write-Host "Warning: Could not stop IIS cleanly" -ForegroundColor Yellow
}

# Step 2: Clean wwwroot directory
Write-Host "Step 2: Cleaning IIS directory..." -ForegroundColor Blue
$wwwroot = "C:\inetpub\wwwroot"

if (Test-Path $wwwroot) {
    try {
        if (Test-Path "$wwwroot\web.config") {
            Copy-Item "$wwwroot\web.config" "$wwwroot\web.config.backup" -Force
            Write-Host "Backed up existing web.config" -ForegroundColor Yellow
        }
        
        Get-ChildItem -Path $wwwroot | Remove-Item -Recurse -Force
        Write-Host "Cleaned IIS directory" -ForegroundColor Green
    }
    catch {
        Write-Host "Failed to clean directory: $_" -ForegroundColor Red
        exit 1
    }
}
else {
    Write-Host "Creating IIS directory..." -ForegroundColor Yellow
    New-Item -Path $wwwroot -ItemType Directory -Force
}

# Step 3: Check if build exists
Write-Host "Step 3: Checking build files..." -ForegroundColor Blue
if (!(Test-Path "dist")) {
    Write-Host "Build directory not found. Building now..." -ForegroundColor Yellow
    try {
        npm run build
        Write-Host "Build completed" -ForegroundColor Green
    }
    catch {
        Write-Host "Build failed. Please check Node.js installation." -ForegroundColor Red
        exit 1
    }
}
else {
    Write-Host "Build directory found" -ForegroundColor Green
}

# Step 4: Deploy new files
Write-Host "Step 4: Deploying React app..." -ForegroundColor Blue
try {
    Copy-Item -Path "dist\*" -Destination $wwwroot -Recurse -Force
    Write-Host "Files deployed successfully" -ForegroundColor Green
}
catch {
    Write-Host "Failed to deploy files: $_" -ForegroundColor Red
    exit 1
}

# Step 5: Verify critical files
Write-Host "Step 5: Verifying deployment..." -ForegroundColor Blue
$criticalFiles = @("index.html", "web.config")
foreach ($file in $criticalFiles) {
    if (Test-Path "$wwwroot\$file") {
        Write-Host "$file found" -ForegroundColor Green
    }
    else {
        Write-Host "$file missing!" -ForegroundColor Red
    }
}

# Step 6: Start IIS
Write-Host "Step 6: Starting IIS..." -ForegroundColor Blue
try {
    iisreset /start
    Write-Host "IIS started successfully" -ForegroundColor Green
}
catch {
    Write-Host "Failed to start IIS: $_" -ForegroundColor Red
    exit 1
}

# Step 7: Test basic connectivity
Write-Host "Step 7: Testing connectivity..." -ForegroundColor Blue
Start-Sleep -Seconds 3

try {
    $response = Invoke-WebRequest -Uri "http://192.168.0.192:85/" -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "Website is responding!" -ForegroundColor Green
    }
    else {
        Write-Host "Website returned status: $($response.StatusCode)" -ForegroundColor Yellow
    }
}
catch {
    Write-Host "Could not test connectivity automatically" -ForegroundColor Yellow
    Write-Host "Manual test: Open http://192.168.0.192:85/ in browser" -ForegroundColor Cyan
}

# Summary
Write-Host "DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "URL: http://192.168.0.192:85/" -ForegroundColor White
Write-Host "Login: admin@estoque.com / admin123" -ForegroundColor White

$openBrowser = Read-Host "Open browser to test the site? (Y/n)"
if ($openBrowser -ne 'n' -and $openBrowser -ne 'N') {
    Start-Process "http://192.168.0.192:85/"
}

Write-Host "Script completed! Your React app should now work in IIS." -ForegroundColor Green
Read-Host "Press Enter to exit"