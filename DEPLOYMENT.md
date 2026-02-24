# APEX Infrastructure - Deployment Guide

## Quick Deploy to Vercel

### Option 1: Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
cd apex-signal-sovereign
vercel --prod
```

### Option 2: GitHub Integration (Easiest)

1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Add New Project"
4. Select "apex-signal-sovereign"
5. Click "Deploy"

### Option 3: Manual Upload

1. Build: `npm run build`
2. Upload `dist/` folder to any static host

---

## Domain Setup

### apex-infrastructure.com

After deployment:
1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add `apex-infrastructure.com`
3. Update DNS at your domain registrar:
   - If using Vercel DNS: Follow the instructions
   - If using existing DNS: Add CNAME record pointing to `cname.vercel-dns.com`

---

## Environment Variables

Create `.env.production`:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

---

## API Endpoints

The following Supabase Edge Functions need to be deployed:

```bash
# Deploy all functions
supabase functions deploy apex-verdict
supabase functions deploy apex-oracle
supabase functions deploy apex-scheduler
supabase functions deploy apex-classifier
```

---

## Automation Backend

The automation scripts in `/automation/` need to run on a server:
- Option 1: Your Mac (cron jobs)
- Option 2: VPS/server (DigitalOcean, AWS, etc.)
- Option 3: Cloud Functions

---

## Current Status

| Component | Status |
|-----------|--------|
| Frontend Build | ✅ Ready |
| Vercel Config | ✅ Ready |
| Supabase Functions | ✅ Ready |
| Domain | apex-infrastructure.com |
| Automation Backend | Built, needs credentials |
| Deployment | Needs Vercel login |
