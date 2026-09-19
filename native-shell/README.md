# native-shell

Local Capacitor `webDir` assets for the Sushi-Ro Admin iPad app.

In production the WKWebView loads `CAPACITOR_SERVER_URL` (the deployed
`/admin` page). These files are fallbacks:

- `www/index.html` — brief loading placeholder if the remote URL is delayed
- `www/offline.html` — shown via Capacitor `server.errorPath` when the
  remote admin cannot be reached

Do not put staff-facing URL configuration here; the origin is baked in
`capacitor.config.ts` at sync/build time.
