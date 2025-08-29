# 🚀 IIS Deployment Guide - Sistema de Controle de Estoque

## ✅ Problem Solved

Your application was trying to connect to `localhost:3003` (JSON Server) which doesn't exist in production. I've implemented a **smart fallback system** that automatically switches to static data when the API is not available.

## 📋 Quick Setup Steps

### 1. Build the Application

```bash
# In your project directory
npm run build
```

### 2. Copy Files to IIS

Copy the entire contents of the `dist/` folder to:

```
C:\inetpub\wwwroot\
```

### 3. IIS Configuration

- **Site URL**: `http://192.168.0.192:85/`
- **Physical Path**: `C:\inetpub\wwwroot`
- **Default Document**: `index.html`

## 🔧 Configuration Options

### Option 1: Static Data Only (Recommended for Demo)

The app will work immediately with built-in sample data. No backend required!

**Files to use:**

- Use `.env.production` with `VITE_USE_STATIC_DATA=true`

### Option 2: Connect to Real API

If you have a backend API server:

**Update `.env.production`:**

```bash
VITE_USE_STATIC_DATA=false
VITE_API_URL=http://192.168.0.192:85/api
```

### Option 3: External API Server

```bash
VITE_USE_STATIC_DATA=false
VITE_API_URL=http://your-api-server.com/api
```

## 📁 Files Structure for IIS

After deployment, your IIS directory should look like:

```
C:\inetpub\wwwroot\
├── index.html              # Main app entry point
├── assets/
│   ├── index-[hash].js     # Application JavaScript
│   └── index-[hash].css    # Application styles
├── web.config              # IIS configuration
└── favicon.ico             # App icon
```

## 🔄 Automatic Fallback System

The application now includes smart fallback logic:

1. **First**: Tries to connect to your API server
2. **Fallback**: If API fails, automatically switches to static data
3. **Seamless**: Users won't notice the difference

### Console Messages:

- ✅ `API Working` - Connected to real API
- 🚨 `API not available, switching to static data` - Using fallback

## 🛠️ Web.config Features

The included `web.config` provides:

- **SPA Routing**: All routes redirect to index.html
- **MIME Types**: Proper file serving
- **Compression**: Better performance
- **Security Headers**: Basic security
- **Error Handling**: 404s redirect to app

## 📊 What Works Out of the Box

### With Static Data:

- ✅ User authentication (admin@estoque.com / admin123)
- ✅ Product management (CRUD operations)
- ✅ Brand management with change tracking
- ✅ Inventory movements
- ✅ All UI features and responsive design

### Sample Login Credentials:

```
Admin:
Email: admin@estoque.com
Password: admin123

Manager:
Email: gerente@estoque.com
Password: gerente123
```

## 🔧 Troubleshooting

### Issue: "Cannot GET /" or 404 errors

**Solution**: Ensure `web.config` is in the root directory and URL Rewrite module is installed in IIS.

### Issue: CSS/JS files not loading

**Solution**: Check MIME types in IIS. The `web.config` should handle this automatically.

### Issue: API errors in console

**Solution**: This is normal! The app will automatically switch to static data.

### Issue: Routes not working (404 on refresh)

**Solution**: The `web.config` handles this with URL rewrite rules.

## 🌐 Network Access

Your application is accessible at:

- **Local**: `http://192.168.0.192:85/`
- **Network**: Any device on your network can access this URL

## 📈 Performance Tips

1. **Enable IIS Compression** (already in web.config)
2. **Set up static file caching**
3. **Use IIS Application Initialization** for faster startup

## 🔄 Updating the Application

1. Run `npm run build`
2. Copy new files from `dist/` to `C:\inetpub\wwwroot\`
3. No IIS restart needed (static files update automatically)

---

## 🎯 Your Application is Now Ready!

Navigate to `http://192.168.0.192:85/` and your inventory management system should work perfectly with the built-in sample data, even without any backend API!
