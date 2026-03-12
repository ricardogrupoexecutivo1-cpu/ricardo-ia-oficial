import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Aurora IA',
    short_name: 'Aurora IA',
    description: 'Aurora IA - Inteligência Artificial brasileira com chat, imagens e marketing automático.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0b1020',
    theme_color: '#0b1020',
    orientation: 'portrait',
    lang: 'pt-BR',
    icons: [
      {
        src: '/aurora-icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/aurora-icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}