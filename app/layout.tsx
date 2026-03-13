import type { Metadata } from "next";
import "./globals.css";
import LanguageSwitcher from "./components/LanguageSwitcher";

export const metadata: Metadata = {
  title: "RicardoIA",
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
      </body>
    </html>
  );
}