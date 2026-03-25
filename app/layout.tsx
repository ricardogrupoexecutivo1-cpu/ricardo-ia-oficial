import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import AuroraClientBoot from "../components/AuroraClientBoot";
import AuroraLanguageBoot from "../components/AuroraLanguageBoot";
import LanguageSwitcher from "../components/LanguageSwitcher";

export const metadata: Metadata = {
  title: "Aurora IA",
  description:
    "Aurora IA - converse, crie imagens, campanhas, ideias de negócio e experiências visuais com IA.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body suppressHydrationWarning style={{ margin: 0 }}>
        <AuroraClientBoot />
        <AuroraLanguageBoot />
        <LanguageSwitcher />

        <Link
          href="/livro"
          style={{
            position: "fixed",
            right: 16,
            bottom: 16,
            zIndex: 9999,
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "12px 16px",
            borderRadius: 999,
            textDecoration: "none",
            fontWeight: 800,
            fontSize: 14,
            color: "#04110a",
            background: "linear-gradient(135deg, #22c55e, #86efac)",
            boxShadow: "0 16px 40px rgba(0,0,0,0.35)",
            border: "1px solid rgba(255,255,255,0.18)",
          }}
        >
          <span aria-hidden="true">📘</span>
          <span>Livro</span>
        </Link>

        {children}
      </body>
    </html>
  );
}