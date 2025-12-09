# 🚀 Deployment Guide

Complete step-by-step guide to deploy your Bachelorette Party Scheduler to production.

## Prerequisites Checklist

- [ ] GitHub account
- [ ] Supabase account (free)
- [ ] Vercel account (free)
- [ ] Project code ready

## Part 1: Set Up Supabase (5 minutes)

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in with GitHub
4. Click "New Project"
5. Fill in:
   - **Name**: `bachelorette-scheduler` (or your preferred name)
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is perfect
6. Click "Create new project"
7. Wait 2-3 minutes for setup to complete

### Step 2: Run Database Schema

1. In your Supabase dashboard, click "SQL Editor" in the left sidebar
2. Click "New query"
3. Open `supabase-schema.sql` from your project
4. Copy ALL the contents
5. Paste into the SQL editor
6. Click "Run" (or press Cmd/Ctrl + Enter)
7. You should see "Success. No rows returned"

### Step 3: Get Your API Credentials

1. Click "Settings" (gear icon) in the left sidebar
2. Click "API" under Project Settings
3. Copy these two values (you'll need them soon):
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys")

## Part 2: Prepare Your Code (2 minutes)

### Step 1: Update Environment Variables

1. Create a file called `.env.local` in your project root
2. Add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_ADMIN_PASSWORD=ChooseASecurePassword123!
```

Replace with your actual values!

### Step 2: Test Locally (Optional but Recommended)

```bash
npm install
npm run dev
```

Visit http://localhost:3000 and test:
- Creating a participant
- Selecting dates
- Viewing the admin dashboard (use your password from .env.local)

## Part 3: Deploy to Vercel (3 minutes)

### Option A: Deploy via GitHub (Recommended)

#### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Bachelorette scheduler"
gh repo create bachelorette-scheduler --public --source=. --push
```

Or create a repo manually and push:
```bash
git remote add origin https://github.com/YOUR-USERNAME/bachelorette-scheduler.git
git branch -M main
git push -u origin main
```

#### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New..." → "Project"
4. Find your `bachelorette-scheduler` repository
5. Click "Import"

#### Step 3: Configure Environment Variables

In the "Configure Project" screen:

1. Expand "Environment Variables"
2. Add three variables:

   **Variable 1:**
   - Name: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: Your Supabase Project URL

   **Variable 2:**
   - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Value: Your Supabase anon key

   **Variable 3:**
   - Name: `NEXT_PUBLIC_ADMIN_PASSWORD`
   - Value: Your chosen admin password

3. Click "Deploy"

#### Step 4: Wait for Deployment

- Vercel will build and deploy your app (takes 1-2 minutes)
- You'll see a success screen with your live URL!
- Example: `https://bachelorette-scheduler.vercel.app`

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts and add environment variables when asked
```

## Part 4: Verify Deployment (2 minutes)

### Test Your Live Site

1. Visit your Vercel URL
2. Enter a test name → you should get redirected to the calendar
3. Select some dates and submit
4. Visit `your-url.vercel.app/admin`
5. Enter your admin password
6. Verify you can see the test participant

### If Something Doesn't Work

1. Check Vercel deployment logs:
   - Go to your project in Vercel
   - Click "Deployments"
   - Click on the latest deployment
   - Check "Building" and "Runtime Logs"

2. Verify environment variables:
   - Vercel Dashboard → Your Project → Settings → Environment Variables
   - Make sure all three variables are set correctly
   - If you change them, redeploy

3. Check Supabase:
   - Go to Supabase Dashboard → Table Editor
   - Verify the tables exist
   - Check that data is being created when you test

## Part 5: Share With Participants (1 minute)

### Send the Link

Share your deployed URL with participants:

```
Hey everyone! 🎉

Please fill out your availability for the bachelorette party:
https://your-app.vercel.app

Dates: March 6-22, 2025

You'll get a unique link after submitting so you can edit your responses anytime!
```

### For Your Own Reference

Save these important links:
- **Public URL**: `https://your-app.vercel.app`
- **Admin Dashboard**: `https://your-app.vercel.app/admin`
- **Admin Password**: (whatever you set in env variables)
- **Supabase Dashboard**: `https://app.supabase.com/project/your-project-id`

## 🎯 Post-Deployment Tips

### Custom Domain (Optional)

1. In Vercel: Settings → Domains
2. Add your custom domain (e.g., `bachelorette.yourdomain.com`)
3. Follow DNS configuration instructions
4. Vercel provides free SSL certificates!

### Monitor Usage

- **Vercel**: Check analytics in your project dashboard
- **Supabase**: Monitor database usage in the Supabase dashboard
- Both free tiers are generous and should handle your needs

### Update the App

To push updates:
```bash
git add .
git commit -m "Description of changes"
git push
```

Vercel will automatically redeploy!

### Backup Your Data

1. Go to Supabase → Table Editor
2. Select a table → click "..." → Export as CSV
3. Do this for both `participants` and `availability` tables

## 🆘 Common Issues

### "Error: Invalid Supabase URL"
- Check environment variables in Vercel settings
- Make sure there are no extra spaces
- Redeploy after fixing

### "Failed to create participant"
- Check Supabase SQL editor for errors
- Verify RLS policies are enabled
- Check Supabase logs

### "Admin password not working"
- Verify `NEXT_PUBLIC_ADMIN_PASSWORD` in Vercel
- Password is case-sensitive
- After changing, trigger a new deployment

### Build fails on Vercel
- Check the build logs for specific errors
- Most common: missing dependencies or TypeScript errors
- Try building locally first: `npm run build`

## 📞 Need Help?

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)

---

🎉 **Congratulations!** Your bachelorette party scheduler is now live!
