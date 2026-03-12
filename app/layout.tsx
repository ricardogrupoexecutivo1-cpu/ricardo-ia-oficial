import './globals.css'
import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'Aurora IA',
  description: 'Aurora IA - Inteligência Artificial aberta para o mundo.',
  metadataBase: new URL('https://ricardoiaoficial.com'),
  applicationName: 'Aurora IA',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Aurora IA',
  },
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
  icons: {
    icon: [
      { url: '/aurora-icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/aurora-icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/aurora-icon-192.png', sizes: '192x192', type: 'image/png' }],
    shortcut: ['/aurora-icon-192.png'],
  },
}

export const viewport: Viewport = {
  themeColor: '#0b1020',
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
      </head>

      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}