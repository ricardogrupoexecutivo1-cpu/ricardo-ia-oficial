import type { Metadata } from "next";
import "./globals.css";
import LanguageSwitcher from "./components/LanguageSwitcher";

export const metadata: Metadata = {
  title: "Aurora IA",
  description:
    "A plataforma de IA brasileira para chat, marketing, imagens e produtividade.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <LanguageSwitcher />
        {children}
      </body>
    </html>
  );
}