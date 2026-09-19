import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Kitchen iPad app loads the deployed Next.js admin UI.
 * Override at sync/build time with CAPACITOR_SERVER_URL (no staff URL entry).
 */
function resolveAdminServerUrl(): string {
  const explicit = process.env.CAPACITOR_SERVER_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");

  const appOrigin = (
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    "https://sushi-ro-ordering.vercel.app"
  ).replace(/\/$/, "");

  return `${appOrigin}/admin`;
}

const serverUrl = resolveAdminServerUrl();
const serverHost = new URL(serverUrl).hostname;

const config: CapacitorConfig = {
  appId: "com.sushiro.ordering.admin",
  appName: "Sushi-Ro Admin",
  webDir: "native-shell/www",
  backgroundColor: "#f5f5f4",
  server: {
    // First-party production admin — baked in; staff never type a URL.
    url: serverUrl,
    cleartext: false,
    allowNavigation: [serverHost, "*.vercel.app"],
    errorPath: "offline.html",
  },
  ios: {
    contentInset: "automatic",
    preferredContentMode: "mobile",
    scheme: "Sushi Ro Admin",
    // Limits scroll bounce chrome; admin UI manages its own scrolling.
    scrollEnabled: true,
  },
};

export default config;
