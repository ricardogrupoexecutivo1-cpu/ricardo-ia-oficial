import type { Metadata, Viewport } from "next";
import "./globals.css";
import ServiceWorkerRegister from "./service-worker-register";
import MobileBottomNav from "@/components/mobile-bottom-nav";

export const metadata: Metadata = {
  title: "Aurora IA",
  description:
    "Aurora IA - conversa inteligente, geração de imagens, campanhas e ideias para negócios.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Aurora IA",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }]
  }
};

export const viewport: Viewport = {
  themeColor: "#00d084",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <ServiceWorkerRegister />
        {children}
        <MobileBottomNav />
      </body>
    </html>
  );
}