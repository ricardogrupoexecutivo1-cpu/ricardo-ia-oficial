import type { Metadata } from "next";
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
      <body suppressHydrationWarning>
        <AuroraClientBoot />
        {children}
      </body>
    </html>
  );
}