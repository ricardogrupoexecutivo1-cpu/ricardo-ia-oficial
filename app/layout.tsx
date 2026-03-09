import './globals.css'
import { Analytics } from '@vercel/analytics/next'

export const metadata = {
  title: 'Aurora IA',
  description: 'Aurora IA - Inteligência Artificial aberta para o mundo.',
  metadataBase: new URL('https://ricardoiaoficial.com'),

  openGraph: {
    title: 'Aurora IA',
    description: 'Aurora IA - Inteligência Artificial aberta para o mundo.',
    url: 'https://ricardoiaoficial.com',
    siteName: 'Aurora IA',
    images: [
      {
        url: '/aurora-icon-512.png',
        width: 512,
        height: 512,
        alt: 'Aurora IA',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Aurora IA',
    description: 'Aurora IA - Inteligência Artificial aberta para o mundo.',
    images: ['/aurora-icon-512.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <meta
          name="google-site-verification"
          content="0uT9i8gslJnvaJp_r8qNAqzIgMXR748bwAqv8v6lFag"
        />

        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#111111" />
        <link rel="apple-touch-icon" href="/aurora-icon-192.png" />
      </head>

      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}