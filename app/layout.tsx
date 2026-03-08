import './globals.css'
import { Analytics } from '@vercel/analytics/next'

export const metadata = {
  title: 'Aurora IA Beta | Inteligência Artificial Online - RicardoIA',
  description:
    'Converse com Aurora IA Beta, a inteligência artificial da RicardoIA. Faça perguntas, peça ideias de negócios, receitas, conhecimento e muito mais. Teste gratuitamente.',
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