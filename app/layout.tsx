import './globals.css'
import { Analytics } from '@vercel/analytics/next'

export const metadata = {
  title: 'Aurora IA',
  description: 'Aurora - Inteligência artificial do RicardoIA',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}