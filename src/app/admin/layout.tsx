import type { Metadata, Viewport } from "next";

/**
 * Tuned for kitchen iPads kept on /admin:
 * - iPad mini (portrait ~744–768 CSS px, landscape ~1024–1133)
 * - iPad 7th gen 10.2" (portrait 810×1080, landscape 1080×810)
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#f5f5f4",
};

export const metadata: Metadata = {
  title: "Sushi-Ro Admin",
  description: "Kitchen order management for Sushi-Ro pickup orders.",
  applicationName: "Sushi-Ro Admin",
  manifest: "/admin.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Sushi-Ro Admin",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    apple: [{ url: "/admin-apple-touch-icon.png", sizes: "180x180" }],
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
