import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import AuroraClientBoot from "../components/AuroraClientBoot";

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

        {/* 🌍 Idiomas no topo */}
        <div
          style={{
            position: "fixed",
            top: 10,
            left: 10,
            zIndex: 9999,
            display: "flex",
            gap: 8,
            background: "rgba(0,0,0,0.6)",
            padding: "6px 10px",
            borderRadius: 12,
            fontSize: 12,
            backdropFilter: "blur(6px)",
          }}
        >
          <span>🇧🇷 PT</span>
          <span>🇺🇸 EN</span>
          <span>🇪🇸 ES</span>
        </div>

        {/* 📘 Botão livro */}
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
          }}
        >
          📘 Livro
        </Link>

        {children}
      </body>
    </html>
  );
}