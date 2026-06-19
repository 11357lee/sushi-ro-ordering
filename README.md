# Sushi-Ro Online Ordering System

Responsive pickup-only online ordering for [Sushi-Ro](https://www.sushi-ro.com), built with Next.js, TypeScript, Tailwind CSS, and Supabase.

**Production setup:** follow **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)** for Supabase, Resend, and Vercel.

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

Web admin panel: `/admin`

## Tech Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS 4
- Supabase (PostgreSQL + Realtime)
- Zustand (cart + customer state)
- Vercel deployment

## Quick Start (Local)

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Without Supabase configured, the app runs in **demo mode** with mock menu data.

Generate a secure admin key:

```bash
npm run generate:admin-key
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (server only) |
| `ADMIN_API_KEY` | Admin API authentication |
| `NEXT_PUBLIC_APP_URL` | Public app URL (production domain) |

## Database

Run `supabase/setup.sql` once in the Supabase SQL Editor (schema + seed data).

| Table | Purpose |
|-------|---------|
| `menu_sections` | Menu vs Gluten Free |
| `categories` | Menu categories |
| `menu_items` | Items with price, description, roll options |
| `menu_options` | Deep-fried, Soy Sheet, Spicy modifiers |
| `labels` | Vegetarian, Egg, Cheese, Popular |
| `featured_items` | Featured menu items |
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
├── seed.sql          # Menu seed data
└── setup.sql         # One-file setup (schema + seed)
docs/
└── DEPLOYMENT.md     # Supabase + Resend + Vercel guide
```
