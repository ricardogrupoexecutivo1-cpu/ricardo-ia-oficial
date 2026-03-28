import "./globals.css";
import type { Metadata } from "next";
import PwaInstallPrompt from "../components/PwaInstallPrompt";

export const metadata: Metadata = {
  title: "Aurora IA",
  description: "Aurora IA em constante evolução.",
  applicationName: "Aurora IA",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Aurora IA",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <PwaInstallPrompt />
      </body>
    </html>
  );
}