# Deployment Guide - Production Setup

This guide covers deploying your bank holidays website to production.

## Architecture Overview

Your application consists of two parts:
1. **Backend**: Payload CMS + MongoDB (Node.js API)
2. **Frontend**: Next.js website (static + server-rendered pages)

## Prerequisites

- [ ] GitHub account
- [ ] MongoDB Atlas account (free tier available)
- [ ] Vercel account (free tier available)
- [ ] Railway/Render account (for backend, free tier available)

---

## Part 1: Deploy MongoDB Database

### Option A: MongoDB Atlas (Recommended)

1. **Create Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for free tier (512MB storage)

2. **Create Cluster**
   - Click "Build a Database"
   - Choose "M0 FREE" tier
   - Select region closest to your users
   - Click "Create Cluster"

3. **Create Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Username: `admin`
   - Password: Generate secure password (save it!)
   - Database User Privileges: "Atlas admin"
   - Click "Add User"

4. **Whitelist IP Addresses**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy connection string:
     ```
     mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```
   - Replace `<password>` with your actual password
   - Add database name: `mongodb+srv://admin:password@cluster0.xxxxx.mongodb.net/bank-holidays?retryWrites=true&w=majority`

6. **Migrate Data to Production**

   Create script: `bank-holidays-payload/scripts/export-data.ts`
   ```typescript
   // Export local data to JSON files
   import dotenv from 'dotenv';
   import mongoose from 'mongoose';
   import fs from 'fs';

   dotenv.config();

   async function exportData() {
     const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/bank-holidays';
     await mongoose.connect(mongoUri);

     const db = mongoose.connection.db;
     if (!db) throw new Error('No database connection');

     const collections = ['countries', 'regions', 'holidays', 'sources', 'pages', 'footer'];

     for (const collectionName of collections) {
       const data = await db.collection(collectionName).find({}).toArray();
       fs.writeFileSync(`./data-export/${collectionName}.json`, JSON.stringify(data, null, 2));
       console.log(`✅ Exported ${data.length} ${collectionName}`);
     }

     await mongoose.disconnect();
     console.log('✨ Export complete!');
   }

   exportData();
   ```

   Run:
   ```bash
   mkdir data-export
   npx ts-node scripts/export-data.ts
   ```

   Then import to production MongoDB:
   ```bash
   # Update MONGODB_URI in .env to production connection string
   npx ts-node scripts/import-data.ts
   ```

---

## Part 2: Deploy Backend (Payload CMS)

### Option A: Railway (Recommended)

1. **Push Code to GitHub**
   ```bash
   cd /Users/kumudmehta/claude-projects/bank-holidays-payload
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/bank-holidays-payload.git
   git push -u origin main
   ```

2. **Deploy to Railway**
   - Go to https://railway.app
   - Click "Start a New Project"
   - Choose "Deploy from GitHub repo"
   - Select `bank-holidays-payload` repository
   - Railway will auto-detect Node.js

3. **Configure Environment Variables**
   - Go to project → Variables
   - Add these variables:

   ```env
   MONGODB_URI=mongodb+srv://admin:PASSWORD@cluster0.xxxxx.mongodb.net/bank-holidays?retryWrites=true&w=majority
   PAYLOAD_SECRET=YOUR_SECURE_SECRET_MIN_32_CHARACTERS_LONG
   PAYLOAD_PUBLIC_SERVER_URL=https://your-app-name.up.railway.app
   NODE_ENV=production
   PORT=4000
   ```

   Generate secure secret:
   ```bash
   openssl rand -base64 32
   ```

4. **Deploy**
   - Railway will automatically deploy
   - Wait for build to complete
   - Your API will be at: `https://your-app-name.up.railway.app`

5. **Verify Deployment**
   ```bash
   curl https://your-app-name.up.railway.app/api/holidays
   ```

6. **Access Admin Panel**
   - Go to: `https://your-app-name.up.railway.app/admin`
   - Login with your admin credentials

### Option B: Render

1. **Create `render.yaml`** in `bank-holidays-payload/`:
   ```yaml
   services:
     - type: web
       name: bank-holidays-api
       env: node
       buildCommand: npm install && npm run build
       startCommand: npm start
       envVars:
         - key: MONGODB_URI
           sync: false
         - key: PAYLOAD_SECRET
           generateValue: true
         - key: NODE_ENV
           value: production
   ```

2. **Deploy**
   - Go to https://render.com
   - Click "New +" → "Blueprint"
   - Connect GitHub repository
   - Render will deploy using render.yaml

---

## Part 3: Deploy Frontend (Next.js)

### Option A: Vercel (Recommended - Made by Next.js creators)

1. **Update Environment Variables**

   Create `bank-holidays-web/.env.production`:
   ```env
   NEXT_PUBLIC_API_URL=https://your-backend.up.railway.app/api
   NEXT_PUBLIC_SITE_URL=https://myholidaycalendar.com
   ```

2. **Update `next.config.ts`** - Add production domain:
   ```typescript
   images: {
     remotePatterns: [
       {
         protocol: 'https',
         hostname: 'your-backend.up.railway.app',
       },
       {
         protocol: 'https',
         hostname: '**',
       },
     ],
   },
   ```

3. **Push to GitHub**
   ```bash
   cd /Users/kumudmehta/claude-projects/bank-holidays-web
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/bank-holidays-web.git
   git push -u origin main
   ```

4. **Deploy to Vercel**
   - Go to https://vercel.com
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Configure:
     - **Framework Preset**: Next.js
     - **Root Directory**: `./`
     - **Build Command**: `npm run build`
     - **Output Directory**: `.next`

5. **Add Environment Variables**
   - In Vercel project settings → Environment Variables
   - Add:

   ```
   NEXT_PUBLIC_API_URL=https://your-backend.up.railway.app/api
   NEXT_PUBLIC_SITE_URL=https://your-site.vercel.app
   ```

6. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy
   - Your site will be at: `https://your-site.vercel.app`

7. **Custom Domain (Optional)**
   - Go to project Settings → Domains
   - Add your custom domain (e.g., myholidaycalendar.com)
   - Follow DNS configuration instructions
   - Vercel provides free SSL certificate

---

## Part 4: Post-Deployment Configuration

### 1. Update CORS Settings

In `bank-holidays-payload/src/payload.config.ts`:
```typescript
cors: [
  'https://your-site.vercel.app',
  'https://myholidaycalendar.com',
  'https://www.myholidaycalendar.com',
],
```

Push changes and redeploy backend.

### 2. Set Up Admin User

If you need to create admin user in production:
```bash
# SSH into Railway (if available) or use their web terminal
npm run create-admin
```

Or use MongoDB Compass to connect directly to production DB and insert user.

### 3. Update Footer Links

1. Go to: `https://your-backend.up.railway.app/admin/collections/footer`
2. Update all URLs to production URLs
3. Save changes

### 4. Run Database Indexes

SSH into backend or use Railway's web terminal:
```bash
npm run add-indexes
```

---

## Environment Variables Summary

### Backend (Payload CMS)
```env
MONGODB_URI=mongodb+srv://...
PAYLOAD_SECRET=your-secret-32-chars-minimum
PAYLOAD_PUBLIC_SERVER_URL=https://your-backend.up.railway.app
NODE_ENV=production
PORT=4000
```

### Frontend (Next.js)
```env
NEXT_PUBLIC_API_URL=https://your-backend.up.railway.app/api
NEXT_PUBLIC_SITE_URL=https://myholidaycalendar.com
```

---

## Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Production database user created
- [ ] IP whitelist configured (0.0.0.0/0)
- [ ] Local data exported
- [ ] Data imported to production MongoDB
- [ ] Backend code pushed to GitHub
- [ ] Backend deployed to Railway/Render
- [ ] Backend environment variables configured
- [ ] Backend deployment verified (API works)
- [ ] Admin panel accessible
- [ ] Frontend code pushed to GitHub
- [ ] Frontend deployed to Vercel
- [ ] Frontend environment variables configured
- [ ] Custom domain configured (optional)
- [ ] CORS updated in backend
- [ ] Database indexes created
- [ ] SSL certificate active (automatic on Vercel)
- [ ] Test all pages (homepage, holiday pages, legal pages)
- [ ] Test admin panel in production

---

## Continuous Deployment (CI/CD)

Once set up, deployments are automatic:

### Backend (Railway)
- Push to `main` branch → Railway automatically builds and deploys

### Frontend (Vercel)
- Push to `main` branch → Vercel automatically builds and deploys
- Preview deployments for pull requests

---

## Monitoring & Maintenance

### Backend Monitoring (Railway)
- Go to project → Metrics
- Monitor CPU, memory, requests
- View logs in real-time

### Frontend Monitoring (Vercel)
- Go to project → Analytics
- Monitor page views, performance
- Check build logs

### Database Monitoring (MongoDB Atlas)
- Go to Clusters → Metrics
- Monitor connections, operations
- Set up alerts for quota limits

---

## Rollback Strategy

### If deployment fails:

**Backend (Railway)**:
- Go to project → Deployments
- Click "Redeploy" on previous successful deployment

**Frontend (Vercel)**:
- Go to project → Deployments
- Click "..." on previous deployment → "Promote to Production"

---

## Cost Estimate

**Free Tier (Perfect for starting)**:
- MongoDB Atlas M0: Free (512MB)
- Railway: $5/month credit (usually enough)
- Vercel: Free (hobby plan)
- **Total**: ~$0-5/month

**Production Scale (100K+ monthly users)**:
- MongoDB Atlas M10: $57/month (2GB RAM, 10GB storage)
- Railway: $20-40/month (scaled)
- Vercel Pro: $20/month (priority builds, analytics)
- **Total**: ~$100-120/month

---

## Troubleshooting

### Backend not responding
1. Check Railway logs
2. Verify MONGODB_URI connection string
3. Check if MongoDB Atlas IP whitelist is set to 0.0.0.0/0

### Frontend can't reach backend
1. Verify NEXT_PUBLIC_API_URL is correct
2. Check CORS settings in backend
3. Test API directly: `curl https://your-backend.up.railway.app/api/holidays`

### Admin panel 404
1. Ensure `/admin` route is accessible
2. Check backend logs for errors
3. Verify Payload build completed successfully

### Database connection errors
1. Check MongoDB Atlas user credentials
2. Verify database name in connection string
3. Test connection with MongoDB Compass

---

## Support

- Railway: https://railway.app/help
- Vercel: https://vercel.com/support
- MongoDB Atlas: https://www.mongodb.com/docs/atlas/
- Next.js: https://nextjs.org/docs
- Payload CMS: https://payloadcms.com/docs

---

## Next Steps After Deployment

1. Set up Google Analytics (optional)
2. Configure SEO tools (Google Search Console, Bing Webmaster)
3. Set up monitoring alerts
4. Create backup strategy for MongoDB
5. Set up staging environment
6. Configure CDN for images (Cloudinary, AWS S3)

**Your site is now live!** 🎉
