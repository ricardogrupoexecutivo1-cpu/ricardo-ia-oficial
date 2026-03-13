import type { Metadata } from "next";
import "./globals.css";
import LanguageSwitcher from "./components/LanguageSwitcher";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "Aurora IA",
  description:
    "Inteligência artificial para atendimento, produtividade, marketing e crescimento empresarial.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <div
          style={{
            width: "100%",
            background: "#facc15",
            color: "#111827",
            textAlign: "center",
            fontSize: "14px",
            fontWeight: 700,
            padding: "10px 12px",
            lineHeight: 1.5,
          }}
        >
          🚀 Aurora IA Beta — novas funções sendo lançadas diariamente.
        </div>

        <LanguageSwitcher />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
