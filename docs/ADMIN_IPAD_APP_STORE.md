# Sushi-Ro Admin — iPad App Store (Capacitor)

Native shell for the existing web admin at `/admin`. Staff install from the App
Store (or TestFlight); the app opens the kitchen board directly — **no URL to
type**.

## Architecture

- **Binary:** Capacitor iOS app (`com.sushiro.ordering.admin`)
- **UI:** Deployed Next.js page at `CAPACITOR_SERVER_URL` (default
  `https://sushi-ro-ordering.vercel.app/admin`)
- **API:** Same-origin `/api/admin` on that deploy; auth remains `ADMIN_API_KEY`
- **Orientation:** Portrait only (including iPad via `UIRequiresFullScreen`)
- **Offline:** Not supported — local `offline.html` asks staff to reconnect

## Prerequisites (you must do these — cannot be done from CI alone)

1. **Apple Developer Program** enrollment  
   https://developer.apple.com/programs/
2. A **Mac** with current **Xcode** (iOS SDK) and CocoaPods (`sudo gem install cocoapods` or Homebrew)
3. Access to the production Vercel deploy (or custom domain) that serves `/admin`
4. The live **`ADMIN_API_KEY`** (from Vercel env) for first login on the iPad

## One-time Apple setup (manual)

### A. Identifiers

1. [Certificates, Identifiers & Profiles](https://developer.apple.com/account/resources/identifiers/list)
2. **+** → App IDs → App
3. Description: `Sushi-Ro Admin`
4. Bundle ID (Explicit): `com.sushiro.ordering.admin`  
   (Must match `capacitor.config.ts` → `appId`. Change both if this ID is taken.)
5. Capabilities: none required for the first WebView slice (add Push later if needed)

### B. App Store Connect

1. https://appstoreconnect.apple.com → **My Apps** → **+**
2. Bundle ID: select `com.sushiro.ordering.admin`
3. Name: `Sushi-Ro Admin` (or shorter if taken)
4. SKU: e.g. `sushi-ro-admin-001`
5. Decide distribution:
   - **Public App Store** — review required
   - **Unlisted** — discoverable only by link (often better for a single restaurant)
   - **Custom App** (Apple Business Manager) — private to your org

### C. Signing

1. In Xcode: open `ios/App/App.xcworkspace` (after `npx cap sync ios`)
2. Select target **App** → **Signing & Capabilities**
3. Team: your Apple Developer team
4. Enable **Automatically manage signing** (simplest for first ship)
5. Archive → Distribute → App Store Connect / TestFlight

## Local / CI repo commands

```bash
npm install

# Optional: point at a non-default deploy before sync
export CAPACITOR_SERVER_URL="https://sushi-ro-ordering.vercel.app/admin"
# or derive from existing web env:
# export NEXT_PUBLIC_APP_URL="https://your-custom-domain.com"

npm run cap:sync
npm run cap:open   # opens Xcode on a Mac
```

`capacitor.config.ts` bakes the server URL at sync time. Staff never see a URL
field in the app.

### Portrait lock

`ios/App/App/Info.plist` is set to **portrait only** for iPhone and iPad, with
`UIRequiresFullScreen=true` so iPad multitasking cannot rotate the shell.

After regenerating the iOS project, re-check those keys (or re-apply the patch
documented in the PR).

## First launch on iPad Mini

1. Install TestFlight / App Store build
2. Connect restaurant Wi‑Fi
3. Open **Sushi-Ro Admin** (lands on `/admin`)
4. Enter `ADMIN_API_KEY` → enable **Remember this iPad**
5. Tap once to unlock order alert sounds

## Remaining blockers checklist

| Item | Owner |
|------|--------|
| Apple Developer membership | User |
| Bundle ID uniqueness / registration | User |
| Distribution certificate + profile (Xcode) | User (Mac) |
| App icons (1024×1024) + screenshots for Connect | User / design |
| Privacy Nutrition Labels + support URL | User |
| App Review (remote WebView policy) | Apple — prefer Unlisted/Custom if rejected |
| Confirm production hostname if leaving `*.vercel.app` | User |

## Out of scope for this slice

- Android
- Offline order queue
- Staff-facing server URL settings
- Push notifications / background audio entitlements
