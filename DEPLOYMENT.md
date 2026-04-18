# FintechFlow - Deployment Guide

Complete step-by-step guide for deploying FintechFlow to production.

## Prerequisites

- [ ] GitHub account
- [ ] Vercel account (for frontend) - https://vercel.com
- [ ] Render account (for backend) - https://render.com
- [ ] Code pushed to a public GitHub repository

## Part 1: Deploy Backend to Render

### Step 1: Create Render Account
1. Go to https://render.com
2. Sign up with GitHub
3. Authorize Render to access your repositories

### Step 2: Create New Web Service
1. Click "New +" button
2. Select "Web Service"
3. Connect your GitHub repository
4. Select your FintechFlow repository

### Step 3: Configure Web Service
Fill in the following settings:

- **Name:** `fintechflow-backend` (or any name you prefer)
- **Region:** Choose closest to you
- **Branch:** `main` (or your default branch)
- **Root Directory:** `backend`
- **Runtime:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Instance Type:** `Free`

### Step 4: Environment Variables
No environment variables needed for this project!

### Step 5: Deploy
1. Click "Create Web Service"
2. Wait for deployment (usually 2-3 minutes)
3. Copy your backend URL (e.g., `https://fintechflow-backend.onrender.com`)

### Step 6: Test Backend
Test your backend is working:
```
https://your-backend-url.onrender.com/api/wallet
```

You should see:
```json
{
  "balance": 10000,
  "currency": "PKR",
  "owner": "User"
}
```

## Part 2: Deploy Frontend to Vercel

### Step 1: Update API URL
**IMPORTANT:** Before deploying frontend, update the API URL:

1. Open `src/app/services/api.ts`
2. Change this line:
```typescript
const API_BASE_URL = 'http://localhost:5000/api';
```

To:
```typescript
const API_BASE_URL = 'https://your-backend-url.onrender.com/api';
```

3. Save and commit the change:
```bash
git add .
git commit -m "Update API URL for production"
git push
```

### Step 2: Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub
3. Authorize Vercel

### Step 3: Import Project
1. Click "Add New..." → "Project"
2. Import your FintechFlow repository
3. Vercel will auto-detect it's a Vite project

### Step 4: Configure Project
- **Framework Preset:** Vite (auto-detected)
- **Root Directory:** `./` (leave as root)
- **Build Command:** `pnpm build` (auto-detected)
- **Output Directory:** `dist` (auto-detected)

No environment variables needed!

### Step 5: Deploy
1. Click "Deploy"
2. Wait for deployment (usually 1-2 minutes)
3. Copy your frontend URL (e.g., `https://fintechflow.vercel.app`)

### Step 6: Test Frontend
1. Open your frontend URL in browser
2. Try all features:
   - Deposit/Withdraw money
   - View transactions
   - Apply for loan
   - Calculate EMI
3. Check browser console (F12) for any errors

## Part 3: Verify Everything Works

### Test Checklist
- [ ] Backend health check works (`/api/wallet`)
- [ ] Frontend loads without errors
- [ ] Wallet deposit works
- [ ] Wallet withdraw works
- [ ] Transactions page shows deposits/withdrawals
- [ ] Loan application form works (all 3 steps)
- [ ] Loan status page loads
- [ ] EMI calculator returns results
- [ ] Dark/Light mode toggle works
- [ ] All animations work smoothly

## Part 4: Update README with URLs

Update your README.md with the actual URLs:

```markdown
## Submission Links

**GitHub Repository URL:** https://github.com/yourusername/fintechflow
**Frontend Live URL:** https://fintechflow.vercel.app
**Backend Live URL:** https://fintechflow-backend.onrender.com
```

Commit and push:
```bash
git add README.md
git commit -m "Add deployment URLs"
git push
```

## Troubleshooting

### Backend Issues

**Issue:** Backend not responding
- Check Render logs in dashboard
- Verify build succeeded
- Check start command is correct

**Issue:** CORS errors
- Backend already has CORS enabled
- If still issues, check Render logs

**Issue:** 502 Bad Gateway
- Backend might be sleeping (Render free tier)
- Wait 30 seconds and refresh
- Make a request to wake it up

### Frontend Issues

**Issue:** API calls failing
- Verify API_BASE_URL is correct in `api.ts`
- Check backend is deployed and responding
- Open browser console for error details

**Issue:** Build fails on Vercel
- Check Vercel build logs
- Verify all dependencies are in package.json
- Try building locally first: `pnpm build`

**Issue:** Page not found (404)
- Vercel auto-handles React Router
- If issues persist, check Vercel settings

### General Tips

1. **Free tier limitations:**
   - Render: Backend sleeps after 15 min of inactivity
   - First request may take 30s to wake up
   - This is normal behavior

2. **Debugging:**
   - Always check browser console (F12)
   - Check Render logs for backend errors
   - Check Vercel deployment logs for build errors

3. **API URL:**
   - Must use HTTPS in production
   - Must include /api at the end
   - No trailing slash

## Alternative Backends

Instead of Render, you can also use:

### Railway.app
- Similar to Render
- Sign up at https://railway.app
- Click "New Project" → "Deploy from GitHub repo"
- Select backend folder
- Set start command: `npm start`

### Heroku (Paid)
- Create new app
- Add buildpack: `heroku/nodejs`
- Set root to `backend` folder
- Deploy from GitHub

## Final Checklist

Before submitting:
- [ ] Backend deployed and responding
- [ ] Frontend deployed and working
- [ ] All 5 pages functional
- [ ] Dark/Light mode working
- [ ] All animations working
- [ ] GitHub repository is PUBLIC
- [ ] README.md has all URLs
- [ ] Tested on mobile browser
- [ ] No console errors

## Submission

Submit these links:
1. **GitHub URL:** Your public repository
2. **Frontend URL:** Your Vercel deployment
3. **Backend URL:** Your Render deployment

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs
- Check deployment logs for errors
- All code is beginner-friendly, issues are usually in configuration

Good luck with your deployment! 🚀
