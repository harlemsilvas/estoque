# 🚀 Vercel Deployment Guide - Estoque App

## Overview

This guide covers deploying the React Estoque inventory management application to Vercel with static data fallback.

## 📋 Prerequisites

- Vercel account (free tier works)
- GitHub repository with your code
- Node.js 18+ installed locally

## 🔧 Environment Configuration

### Production Environment Variables

The app is configured to use static data in Vercel deployment:

```env
VITE_USE_STATIC_DATA=true
VITE_API_URL=
NODE_ENV=production
VITE_BUILD_TARGET=vercel
```

### Vercel Dashboard Configuration

In your Vercel project settings, add these environment variables:

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add the following variables:

| Variable               | Value        | Environment |
| ---------------------- | ------------ | ----------- |
| `VITE_USE_STATIC_DATA` | `true`       | Production  |
| `NODE_ENV`             | `production` | Production  |
| `VITE_BUILD_TARGET`    | `vercel`     | Production  |

## 🚀 Deployment Steps

### Method 1: GitHub Integration (Recommended)

1. **Push to GitHub**:

   ```bash
   git add .
   git commit -m "Configure for Vercel deployment"
   git push origin main
   ```

2. **Connect to Vercel**:

   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure project settings:
     - Framework Preset: `Vite`
     - Build Command: `npm run build`
     - Output Directory: `dist`
     - Install Command: `npm install`

3. **Deploy**:
   - Click "Deploy"
   - Vercel will automatically build and deploy your app

### Method 2: Vercel CLI

1. **Install Vercel CLI**:

   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:

   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel --prod
   ```

## 🔧 Build Configuration

The app uses Vite with the following configuration:

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Framework**: Vite/React
- **Node Version**: 18.x

## 📊 Static Data Configuration

The app automatically uses static data when deployed to Vercel:

- ✅ **Products**: Sample products with different stock levels
- ✅ **Brands**: Pre-configured brand data
- ✅ **Movements**: Sample inventory movements
- ✅ **Users**: Test users for authentication

### Default Login Credentials

- **Email**: `admin@estoque.com`
- **Password**: `admin123`

## 🌐 Expected Behavior

After deployment:

1. **Homepage**: React app loads successfully
2. **Navigation**: All routes work without 404 errors
3. **Authentication**: Login system works with test users
4. **Data**: App displays sample inventory data
5. **Console**: Shows "API not available, switching to static data" message (normal)

## 🔍 Troubleshooting

### Common Issues

1. **Build Fails**:

   ```bash
   # Locally test the build
   npm run build
   npm run preview
   ```

2. **404 on Routes**:

   - Verify `vercel.json` routing configuration
   - Check SPA routing is properly configured

3. **Environment Variables Not Working**:

   - Verify variables are set in Vercel dashboard
   - Check variable names match exactly (case-sensitive)
   - Redeploy after adding variables

4. **Static Data Not Loading**:
   - Check browser console for errors
   - Verify `VITE_USE_STATIC_DATA=true` is set

### Debug Commands

```bash
# Test build locally
npm run build && npm run preview

# Check environment variables
echo $VITE_USE_STATIC_DATA

# Verify Vercel configuration
vercel --debug
```

## 📱 Performance Optimizations

The deployment includes:

- ✅ **Static asset caching**: 1 year cache for assets
- ✅ **Gzip compression**: Automatic by Vercel
- ✅ **Global CDN**: Vercel Edge Network
- ✅ **Lazy loading**: React components load on demand

## 📞 Support

If you encounter issues:

1. Check Vercel deployment logs
2. Test build locally first
3. Verify environment variables
4. Check browser console for errors

## 🎉 Success Metrics

Your deployment is successful when:

- ✅ App loads at your Vercel URL
- ✅ All navigation works
- ✅ Login functionality works
- ✅ Inventory data displays
- ✅ No console errors (except expected API warnings)

---

**Vercel URL**: Will be provided after deployment
**Login**: admin@estoque.com / admin123
**Status**: Ready for production use with static data
