# 🚨 IIS Error 500.19 Troubleshooting Guide

## ❌ Error Analysis

Your error `500,19,0x8007000d` indicates:

- **500**: Internal Server Error
- **19**: Configuration Error
- **0x8007000d**: Invalid data (malformed XML in web.config)

## 🔧 Immediate Fix Steps

### Step 1: Rebuild with Fixed web.config

```bash
# Build the application with corrected web.config
npm run build
```

### Step 2: Clean IIS Directory

```powershell
# Run as Administrator
Remove-Item "C:\inetpub\wwwroot\*" -Recurse -Force
```

### Step 3: Deploy Clean Files

```powershell
# Copy new build files
Copy-Item "dist\*" "C:\inetpub\wwwroot\" -Recurse -Force
```

### Step 4: Verify web.config

Ensure `C:\inetpub\wwwroot\web.config` contains only:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <!-- URL Rewrite for SPA -->
    <rewrite>
      <rules>
        <rule name="ReactRouter" stopProcessing="true">
          <match url=".*" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
          </conditions>
          <action type="Rewrite" url="/index.html" />
        </rule>
      </rules>
    </rewrite>

    <defaultDocument>
      <files>
        <clear />
        <add value="index.html" />
      </files>
    </defaultDocument>

    <staticContent>
      <mimeMap fileExtension=".js" mimeType="application/javascript" />
      <mimeMap fileExtension=".css" mimeType="text/css" />
      <mimeMap fileExtension=".json" mimeType="application/json" />
    </staticContent>

    <httpErrors errorMode="Custom">
      <remove statusCode="404" subStatusCode="-1" />
      <error statusCode="404" path="/index.html" responseMode="ExecuteURL" />
    </httpErrors>
  </system.webServer>
</configuration>
```

## 🔍 IIS Requirements Check

### Required IIS Features:

1. **URL Rewrite Module** - Download from Microsoft if missing
2. **Default Document** - Should be enabled
3. **Static Content** - Should be enabled
4. **HTTP Errors** - Should be enabled

### Enable Features (PowerShell as Admin):

```powershell
# Enable IIS features
Enable-WindowsOptionalFeature -Online -FeatureName IIS-WebServerRole
Enable-WindowsOptionalFeature -Online -FeatureName IIS-WebServer
Enable-WindowsOptionalFeature -Online -FeatureName IIS-CommonHttpFeatures
Enable-WindowsOptionalFeature -Online -FeatureName IIS-StaticContent
Enable-WindowsOptionalFeature -Online -FeatureName IIS-DefaultDocument
```

### Install URL Rewrite Module:

1. Download from: https://www.iis.net/downloads/microsoft/url-rewrite
2. Or use Web Platform Installer
3. Restart IIS after installation

## 📂 Correct File Structure

Your `C:\inetpub\wwwroot\` should contain:

```
C:\inetpub\wwwroot\
├── index.html              ✅ Main app entry
├── web.config              ✅ IIS configuration
├── vite.svg                ✅ Favicon
└── assets/
    ├── index-[hash].js     ✅ Application code
    └── index-[hash].css    ✅ Styles
```

## 🧪 Testing Steps

### Step 1: Test Static Files

1. Open: `http://192.168.0.192:85/index.html`
2. Should load the React app

### Step 2: Test SPA Routing

1. Navigate to: `http://192.168.0.192:85/produtos`
2. Should show products page (not 404)

### Step 3: Test API Fallback

1. Open browser console (F12)
2. Look for: `🚨 API not available, switching to static data`
3. App should still work with sample data

## 🚨 Common Issues & Solutions

### Issue: "HTTP Error 404.3 - Not Found"

**Cause**: URL Rewrite module not installed
**Solution**: Install URL Rewrite module and restart IIS

### Issue: "HTTP Error 500.19 - Internal Server Error"

**Cause**: Invalid web.config syntax
**Solution**: Use the simplified web.config above

### Issue: CSS/JS files return 404

**Cause**: MIME types not configured
**Solution**: MIME types are included in the new web.config

### Issue: Blank page after navigation

**Cause**: SPA routing not working
**Solution**: Ensure URL Rewrite rules are active

## 🔄 Reset IIS Completely

If problems persist:

```powershell
# Stop IIS
iisreset /stop

# Clear all files
Remove-Item "C:\inetpub\wwwroot\*" -Recurse -Force

# Copy fresh files
Copy-Item "dist\*" "C:\inetpub\wwwroot\" -Recurse -Force

# Start IIS
iisreset /start
```

## ✅ Success Indicators

When working correctly, you should see:

1. **Browser**: React app loads at `http://192.168.0.192:85/`
2. **Console**: API fallback message (normal behavior)
3. **Navigation**: All routes work without 404 errors
4. **Login**: Can login with `admin@estoque.com` / `admin123`

## 📞 Emergency Fallback

If all else fails, create minimal `index.html`:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Test</title>
  </head>
  <body>
    <h1>IIS is working!</h1>
  </body>
</html>
```

Place this in `C:\inetpub\wwwroot\` to verify basic IIS functionality.

---

## 🎯 Next Steps

1. Follow the steps above
2. Test at `http://192.168.0.192:85/`
3. Check browser console for any remaining errors
4. Your React app should now work perfectly!
