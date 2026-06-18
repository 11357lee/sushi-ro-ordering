<<<<<<< HEAD
# Sushi-Ro Online Ordering System

Responsive pickup-only online ordering for [Sushi-Ro](https://www.sushi-ro.com), built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Features

### Customer
- **Menu page** — restaurant banner, open/closed status, waiting time banner (color-coded), featured items, search, Menu + Gluten Free sections
- **Cart** — quantity editing, cutlery options, wasabi/ginger/soy extras, special instructions
- **Checkout** — ASAP or scheduled pickup (15-min slots from 1 hour ahead until 8:45 PM), customer info, allergy notes
- **Waiting screen** — realtime polling for ASAP orders until staff accepts
- **Confirmation** — pickup time, email notice, optional 60-second cancel window when wait > 1 hour
- **Login** — first name + phone for reorder/history
- **Tracking** — lookup orders by phone number

### Admin API (iOS-ready)
Protected by `x-admin-key` header. Endpoints at `/api/admin`:
- List pending/accepted orders
- Accept / reject / complete orders
- Update waiting time (15 / 30 / 60 / 120 min)
- Toggle open/closed status

Web admin panel for development: `/admin`

## Tech Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS 4
- Supabase (PostgreSQL + Realtime)
- Resend (confirmation emails)
- Zustand (cart + customer state)
- Vercel-ready deployment

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env.local` and configure:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (server only) |
| `RESEND_API_KEY` | Resend API key for emails |
| `FROM_EMAIL` | Sender email (sushi-ro@sushi-ro.com) |
| `ADMIN_API_KEY` | Admin API authentication |
| `NEXT_PUBLIC_APP_URL` | Public app URL |

**Demo mode:** Without Supabase configured, the app runs with in-memory mock data and demo order storage.

### 3. Supabase setup

1. Create a project at [supabase.com](https://supabase.com)
2. Run `supabase/migrations/001_initial_schema.sql` in the SQL editor
3. Run `supabase/seed.sql` to populate menu data
4. Enable Realtime on the `orders` table (included in migration)

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

Admin panel: [http://localhost:3000/admin](http://localhost:3000/admin) (use `ADMIN_API_KEY` from `.env.local`)

### 5. Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

## Database Schema

| Table | Purpose |
|-------|---------|
| `menu_sections` | Menu vs Gluten Free |
| `categories` | Menu categories (~12 regular + GF) |
| `menu_items` | Items with price, description, roll options flag |
| `menu_options` | Deep-fried, Soy Sheet, Spicy modifiers |
| `labels` | Vegetarian, Egg, Cheese, Popular |
| `featured_items` | Top featured menu items |
| `customers` | Login info + contact |
| `orders` | Order header, pickup, extras |
| `order_items` | Line items with options snapshot |
| `restaurant_settings` | Open/closed, banner, closing time |
| `waiting_time` | Current wait time banner |

## Order Flow

```
Menu → Cart → Checkout → [Waiting (ASAP)] → Confirmation
                      ↘ Confirmation (Scheduled)
```

Pay in store at pickup. No online payment.

## Project Structure

```
src/
├── app/              # Pages and API routes
├── components/       # UI components
├── lib/              # Supabase, cart, utils, data
└── types/            # TypeScript types
supabase/
├── migrations/       # Database schema
└── seed.sql          # Menu seed data
```
=======
# sushi-ro-ordering
Online Ordering System for Sushi-ro
>>>>>>> 535c305f9645873e984de2a37bc220b21ef98da6
