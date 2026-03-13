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
        <LanguageSwitcher />
        {children}
        <Analytics />
      </body>
    </html>
  );
}