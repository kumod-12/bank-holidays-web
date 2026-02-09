# Quick Deployment Guide

**Estimated time: 30-45 minutes**

## Step 1: Set Up MongoDB (5 minutes)

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up → Create Free Cluster (M0)
3. Create database user:
   - Username: `admin`
   - Password: Generate and save it
4. Whitelist all IPs: `0.0.0.0/0`
5. Get connection string:
   ```
   mongodb+srv://admin:PASSWORD@cluster0.xxxxx.mongodb.net/bank-holidays?retryWrites=true&w=majority
   ```

## Step 2: Export Local Data (2 minutes)

```bash
cd /Users/kumudmehta/claude-projects/bank-holidays-payload
npm run export-data
```

Data saved to `data-export/` folder.

## Step 3: Deploy Backend (10 minutes)

### Option 1: Railway (Recommended)

1. **Push to GitHub**
   ```bash
   cd /Users/kumudmehta/claude-projects/bank-holidays-payload
   git init
   git add .
   git commit -m "Initial commit"
   # Create repo on GitHub first, then:
   git remote add origin https://github.com/YOUR_USERNAME/bank-holidays-payload.git
   git push -u origin main
   ```

2. **Deploy on Railway**
   - Go to https://railway.app
   - New Project → Deploy from GitHub repo
   - Select `bank-holidays-payload`

3. **Add Environment Variables**
   ```
   MONGODB_URI=mongodb+srv://admin:PASSWORD@cluster0.xxxxx.mongodb.net/bank-holidays?retryWrites=true&w=majority
   PAYLOAD_SECRET=run: openssl rand -base64 32
   PAYLOAD_PUBLIC_SERVER_URL=https://your-app.up.railway.app
   NODE_ENV=production
   ```

4. **Get your backend URL**
   - Copy from Railway dashboard: `https://your-app.up.railway.app`

## Step 4: Import Data to Production (3 minutes)

```bash
# Update .env with production MongoDB URL
MONGODB_URI=mongodb+srv://admin:PASSWORD@cluster0.xxxxx.mongodb.net/bank-holidays

# Import data
npm run import-data

# Create indexes
npm run add-indexes
```

## Step 5: Deploy Frontend (10 minutes)

1. **Update Environment**

   Create `bank-holidays-web/.env.production`:
   ```env
   NEXT_PUBLIC_API_URL=https://your-backend.up.railway.app/api
   NEXT_PUBLIC_SITE_URL=https://myholidaycalendar.com
   ```

2. **Push to GitHub**
   ```bash
   cd /Users/kumudmehta/claude-projects/bank-holidays-web
   git init
   git add .
   git commit -m "Initial commit"
   # Create repo on GitHub first, then:
   git remote add origin https://github.com/YOUR_USERNAME/bank-holidays-web.git
   git push -u origin main
   ```

3. **Deploy on Vercel**
   - Go to https://vercel.com
   - New Project → Import from GitHub
   - Select `bank-holidays-web`
   - Add environment variables:
     ```
     NEXT_PUBLIC_API_URL=https://your-backend.up.railway.app/api
     NEXT_PUBLIC_SITE_URL=https://your-site.vercel.app
     ```
   - Deploy!

## Step 6: Configure Domain (Optional, 5 minutes)

1. **In Vercel**
   - Go to Settings → Domains
   - Add: `myholidaycalendar.com`
   - Add DNS records (provided by Vercel)

2. **Update Backend CORS**

   Edit `bank-holidays-payload/src/payload.config.ts`:
   ```typescript
   cors: [
     'https://myholidaycalendar.com',
     'https://www.myholidaycalendar.com',
   ],
   ```

   Push changes → Railway auto-deploys

## Step 7: Verify Everything Works

Test these URLs:

✅ **Backend API**
```bash
curl https://your-backend.up.railway.app/api/holidays
```

✅ **Admin Panel**
```
https://your-backend.up.railway.app/admin
```

✅ **Frontend**
```
https://your-site.vercel.app
https://your-site.vercel.app/india/republic-day
https://your-site.vercel.app/about-us
```

## Common Issues

### Backend not accessible
- Check Railway logs
- Verify MongoDB connection string
- Ensure PORT is set to 4000

### Frontend can't connect to backend
- Check NEXT_PUBLIC_API_URL is correct
- Update CORS in backend config
- Redeploy both after changes

### Data not showing
- Verify import ran successfully
- Check MongoDB Atlas → Browse Collections
- Run `npm run add-indexes`

## Post-Deployment Checklist

- [ ] Backend API responding
- [ ] Admin panel accessible
- [ ] Frontend loading
- [ ] Holiday pages working
- [ ] Legal pages working
- [ ] Images loading
- [ ] Footer links correct
- [ ] Search engines can access (check robots.txt)

## Costs

- MongoDB Atlas M0: **Free**
- Railway: **$5/month credit** (usually enough)
- Vercel: **Free**

**Total**: $0-5/month to start!

## Need Help?

See the full guide: [DEPLOYMENT.md](./DEPLOYMENT.md)

## Your Live URLs

After deployment, update these:

- **Frontend**: https://_________________________.vercel.app
- **Backend API**: https://_________________________.up.railway.app
- **Admin Panel**: https://_________________________.up.railway.app/admin
- **Custom Domain**: https://_________________________

---

**That's it! Your site is live! 🚀**
