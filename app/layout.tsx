import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

import AuroraClientBoot from "../components/AuroraClientBoot";
import AuroraLanguageBoot from "../components/AuroraLanguageBoot";
import LanguageSwitcher from "../components/LanguageSwitcher";
import AuroraVoiceDock from "../components/AuroraVoiceDock";
import AuroraReferenceUploadDock from "../components/AuroraReferenceUploadDock";
import PwaInstallButton from "../components/PwaInstallButton";

export const metadata: Metadata = {
  title: "Aurora IA",
  description:
    "Aurora IA - converse, crie imagens, campanhas, ideias de negócio e experiências visuais com IA.",
};

const navLinkStyle: React.CSSProperties = {
  textDecoration: "none",
  color: "#eef6ff",
  fontWeight: 800,
  fontSize: 14,
  padding: "10px 14px",
  borderRadius: 12,
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.08)",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        style={{
          margin: 0,
          background: "#07111a",
          color: "#eef6ff",
        }}
      >
        {/* CORE SYSTEM */}
        <AuroraClientBoot />
        <AuroraLanguageBoot />
        <LanguageSwitcher />

        {/* FEATURES */}
        <AuroraVoiceDock />
        <AuroraReferenceUploadDock />
        <PwaInstallButton />

        {/* HEADER */}
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 9998,
            backdropFilter: "blur(10px)",
            background: "rgba(7,17,26,0.82)",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div
            style={{
              maxWidth: 1280,
              margin: "0 auto",
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/"
              style={{
                textDecoration: "none",
                color: "#ffffff",
                fontWeight: 900,
                fontSize: 18,
                letterSpacing: 0.3,
              }}
            >
              Aurora IA
            </Link>

            <nav
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <Link href="/" style={navLinkStyle}>
                Home
              </Link>

              <Link href="/chat" style={navLinkStyle}>
                Chat
              </Link>

              <Link href="/planos" style={navLinkStyle}>
                Planos
              </Link>

              <Link href="/explorar" style={navLinkStyle}>
                Explorar
              </Link>
            </nav>
          </div>
        </header>

        {/* MAIN */}
        <main>{children}</main>

        {/* BOTÃO LIVRO */}
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
      </body>
    </html>
  );
}