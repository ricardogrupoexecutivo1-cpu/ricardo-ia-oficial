import './globals.css'
import { Analytics } from '@vercel/analytics/next'

export const metadata = {
  title: 'Aurora IA',
  description: 'Aurora IA - Inteligência Artificial aberta para o mundo.',
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>

        <meta name="google-site-verification" content="0uT9i8gslJnvaJp_r8qNAqzIgMXR748bwAqv8v6lFag" />

        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#111111" />

        <link rel="apple-touch-icon" href="/aurora-icon-192.png" />

        <title>Aurora IA</title>

      </head>

      <body>
        {children}
        <Analytics />
      </body>

    </html>
  )
}