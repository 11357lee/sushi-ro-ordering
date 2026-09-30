# Sushi-Ro Admin — native iPad app

Real **iPadOS application** (SwiftUI) for kitchen order management. It is **not** Safari and **not** a web page — it talks to your existing Admin API over HTTPS.

Designed for:

- **iPad mini** (portrait + landscape)
- **iPad 7th gen / 10.2"** (iPadOS 16)

## What it does

- Login with `ADMIN_API_KEY` (optional remember-this-iPad via Keychain)
- Live order board with polling
- Waiting time controls (15 / 30 / 60 / 120)
- Review popup: prep minutes, Accept / Reject
- Cancel accepted orders
- Test mode + pause service
- Native looping order sounds (same MP3s as the site) — works without Safari unlock hacks
- Screen stays awake while the app is open

## Install on your iPads (Mac + Xcode required)

1. On a Mac, clone this repo and open:

   ```bash
   open ios/SushiRoAdmin/SushiRoAdmin.xcodeproj
   ```

2. In Xcode:
   - Select the **SushiRoAdmin** target
   - **Signing & Capabilities** → choose your Apple Developer **Team**
   - Bundle ID defaults to `com.sushi-ro.admin` (change if needed)

3. Plug in the iPad (or use wireless debugging), trust the computer, select the iPad as the run destination.

4. Press **Run**. First launch may ask you to trust the developer on the iPad:  
   **Settings → General → VPN & Device Management → Developer App → Trust**

5. In the app login screen:
   - **Server**: your Vercel URL (example `https://sushi-ro-ordering.vercel.app`)
   - **Admin key**: same `ADMIN_API_KEY` as in Vercel

## Requirements

| Item | Notes |
|------|--------|
| Mac with Xcode 15+ | Needed to build/install |
| Apple ID / Developer account | Free account works for your own iPads; paid team for TestFlight |
| iPadOS 16+ | Covers iPad 7th gen max OS and newer minis |
| Deployed ordering site | App calls `/api/admin` and `/api/settings` |

## Not Safari

This app uses `URLSession` + SwiftUI. There is no `WKWebView` and no dependency on the Safari tab staying open for sound.
