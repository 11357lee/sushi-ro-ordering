import type { Metadata, Viewport } from "next";

/**
 * Admin is also loaded inside the Capacitor iPad shell (App Store).
 * Keep metadata focused on the kitchen board — no customer marketing chrome.
 */
export const metadata: Metadata = {
  title: "Sushi-Ro Admin",
  description: "Kitchen order management for Sushi-Ro.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f5f5f4",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
