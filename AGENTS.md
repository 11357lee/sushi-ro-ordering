<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cloud Agent notes

- Install: `npm ci`. If `.env.local` is missing, copy `.env.example` to `.env.local`.
- Dev server: `npm run dev` at http://localhost:3000. Lint: `npm run lint`.
- Without real Supabase credentials the app runs in **demo mode** (mock menu, in-memory orders). Do not require hosted Supabase for local work.
- Admin panel `/admin` authenticates with `ADMIN_API_KEY` from `.env.local` (demo value is in `.env.example`).
- Ordering is blocked from 8:45 PM to 6:00 AM in `America/Toronto`, including demo mode. Menu, cart, and admin still work.
