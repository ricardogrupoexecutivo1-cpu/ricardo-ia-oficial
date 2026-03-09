import './globals.css'
import { Analytics } from '@vercel/analytics/next'

export const metadata = {
  title: 'Aurora IA Beta | Inteligência Artificial Online - RicardoIA',
  description:
    'Converse com Aurora IA Beta, a inteligência artificial da RicardoIA. Faça perguntas, peça ideias de negócios, receitas, conhecimento e muito mais. Teste gratuitamente.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
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