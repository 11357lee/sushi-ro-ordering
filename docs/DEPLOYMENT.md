# Production Deployment Guide

Setup for **Supabase** and **Vercel** for Sushi-Ro online ordering.

Estimated time: **20–30 minutes**

---

## Overview

| Service | Purpose | Cost |
|---------|---------|------|
| Supabase | Database + realtime orders | Free tier OK for 300–700 orders/mo |
| Vercel | Host Next.js app | Free hobby tier |

No email service is required — customers see confirmation on the website only.

---

## Step 1 — Supabase (Database)

### 1.1 Create project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. **New project** → name: `sushi-ro-ordering`
3. Save the database password
4. Pick a region close to your customers

### 1.2 Run database setup

1. **SQL Editor** → **New query**
2. Paste all of [`supabase/seed-remaining.sql`](../supabase/seed-remaining.sql) (if schema already exists)
   - Or full [`supabase/setup.sql`](../supabase/setup.sql) on a fresh project
3. Click **Run**

### 1.3 Copy API keys

**Project Settings** → **API**:

| Supabase field | Env variable |
|----------------|--------------|
| Project URL | `NEXT_PUBLIC_SUPABASE_URL` |
| anon public | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| service_role (secret) | `SUPABASE_SERVICE_ROLE_KEY` |

---

## Step 2 — Generate admin key

```bash
cd /Users/lee00665/sushi-ro-ordering
npm run generate:admin-key
```

Copy the output → `ADMIN_API_KEY`

---

## Step 3 — Vercel (Deploy)

### 3.1 Import GitHub repo

1. [vercel.com/new](https://vercel.com/new)
2. Import **`11357lee/sushi-ro-ordering`**
3. Framework: **Next.js** (auto-detected)

### 3.2 Add environment variables

**Settings** → **Environment Variables** — add these **5** (enable Production, Preview, Development for each):

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | From Supabase (e.g. `https://xxxx.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | From Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | From Supabase service_role key |
| `ADMIN_API_KEY` | From `npm run generate:admin-key` |
| `NEXT_PUBLIC_APP_URL` | Placeholder first: `https://sushi-ro-ordering.vercel.app` |

You do **not** need `RESEND_API_KEY` or `FROM_EMAIL`.

### 3.3 Deploy

Click **Deploy** (~2 min).

### 3.4 Update app URL

1. Copy your real live URL from Vercel
2. Edit `NEXT_PUBLIC_APP_URL` to that URL
3. **Deployments** → **⋯** → **Redeploy**

---

## Step 4 — Local `.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
ADMIN_API_KEY=your-generated-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

```bash
npm run dev
```

---

## Step 5 — Verify

- [ ] Live site menu loads from Supabase
- [ ] Place ASAP order → waiting page → admin accepts → confirmation
- [ ] `/admin` works with your `ADMIN_API_KEY`
- [ ] `/tracking` finds order by phone

---

## Quick links

- GitHub: https://github.com/11357lee/sushi-ro-ordering
- Supabase: https://supabase.com/dashboard
- Vercel: https://vercel.com/dashboard
