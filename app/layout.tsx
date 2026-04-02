import type { Metadata } from "next";
import "./globals.css";
import { AuroraGlobalProvider } from "@/components/aurora-global-provider";
import { AuroraThemeStyle } from "@/components/aurora-theme-style";

export const metadata: Metadata = {
  title: "Aurora IA | Plataforma global",
  description:
    "Aurora IA é uma plataforma global para chat, imagens, cadastros, operações e financeiro empresarial editável por empresa.",
  applicationName: "Aurora IA",
  keywords: [
    "Aurora IA",
    "financeiro empresarial",
    "ERP editável",
    "cadastro global",
    "plataforma multilíngue",
    "multimoeda",
    "chat com IA",
    "gerador de imagens",
    "Aurora Finance",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <AuroraThemeStyle />
      </head>
      <body suppressHydrationWarning className="aurora-page-shell">
        <AuroraGlobalProvider>{children}</AuroraGlobalProvider>
      </body>
    </html>
  );
}