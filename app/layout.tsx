import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL, absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: {
    canonical: "/",
  },
  keywords: [
    "Aurora IA",
    "inteligência artificial",
    "gerador de imagens",
    "campanhas de marketing",
    "ideias de negócio",
    "IA no Brasil",
    "editor de imagens",
    "editor visual",
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: absoluteUrl("/icons/icon-512.png"),
        width: 512,
        height: 512,
        alt: "Aurora IA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [absoluteUrl("/icons/icon-512.png")],
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon.ico"],
  },
};

function navLinkStyle(isHighlight = false) {
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px 12px",
    borderRadius: 999,
    textDecoration: "none",
    color: isHighlight ? "#052e16" : "inherit",
    border: isHighlight
      ? "1px solid rgba(34,197,94,0.35)"
      : "1px solid rgba(255,255,255,0.10)",
    background: isHighlight ? "rgba(34,197,94,0.92)" : "rgba(255,255,255,0.04)",
    fontWeight: 700,
    fontSize: 13,
    whiteSpace: "nowrap" as const,
    minHeight: 40,
    boxShadow: isHighlight ? "0 0 18px rgba(34,197,94,0.22)" : "none",
  } as const;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        style={{
          margin: 0,
          background:
            "radial-gradient(circle at top, rgba(16,185,129,0.10), rgba(3,7,18,1) 42%, rgba(2,6,23,1) 100%)",
          color: "#f8fafc",
          minHeight: "100vh",
        }}
      >
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 50,
            backdropFilter: "blur(14px)",
            background: "rgba(3,7,18,0.82)",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div
            style={{
              maxWidth: 1240,
              margin: "0 auto",
              padding: "12px 14px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <Link
                href="/"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  fontWeight: 900,
                  fontSize: 20,
                  letterSpacing: 0.3,
                }}
              >
                Aurora IA
              </Link>

              <nav
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  justifyContent: "flex-end",
                }}
              >
                <Link href="/" style={navLinkStyle()}>
                  Home
                </Link>
                <Link href="/chat" style={navLinkStyle()}>
                  Chat
                </Link>
                <Link href="/editor" style={navLinkStyle(true)}>
                  Editor
                </Link>
                <Link href="/planos" style={navLinkStyle()}>
                  Planos
                </Link>
                <Link href="/explorar" style={navLinkStyle()}>
                  Explorar
                </Link>
                <Link href="/explorar/prompts" style={navLinkStyle()}>
                  Prompts
                </Link>
              </nav>
            </div>
          </div>
        </header>

        <div
          style={{
            width: "100%",
            maxWidth: 1240,
            margin: "0 auto",
            padding: "16px 12px 24px",
          }}
        >
          {children}
        </div>
      </body>
    </html>
  );
}