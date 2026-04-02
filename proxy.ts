import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PREFIXOS_VALIDOS = [
  '/',
  '/chat',
  '/explorar',
  '/planos',
  '/agro',
  '/imoveis',
  '/imobiliarias',
  '/app-builder',
  '/empresa',
  '/locadora',
  '/guardiao',
  '/livro',
  '/afiliado',
  '/afiliados',
  '/viral',
  '/categorias',
  '/i',
  '/mineracao',
  '/cadastro-geral',
  '/cadastro',
  '/cadastro-basico',
  '/cadastros',
]

const REDIRECTS_EXATOS: Record<string, string> = {
  '/builder': '/app-builder',
  '/imobiliaria': '/imobiliarias',
  '/imovel': '/imoveis',
}

function isStaticOrInternal(pathname: string) {
  return (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/robots.txt') ||
    pathname.startsWith('/sitemap') ||
    pathname.includes('.')
  )
}

function isAllowedPath(pathname: string) {
  if (pathname === '/') return true

  return PREFIXOS_VALIDOS.some((prefixo) => {
    if (prefixo === '/') return false
    return pathname === prefixo || pathname.startsWith(prefixo + '/')
  })
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  if (isStaticOrInternal(pathname)) {
    return NextResponse.next()
  }

  const redirectExato = REDIRECTS_EXATOS[pathname]
  if (redirectExato) {
    const url = request.nextUrl.clone()
    url.pathname = redirectExato
    url.search = search
    return NextResponse.redirect(url)
  }

  if (isAllowedPath(pathname)) {
    return NextResponse.next()
  }

  const url = request.nextUrl.clone()
  url.pathname = '/'
  url.search = ''
  url.searchParams.set('from', pathname)

  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|api|favicon.ico).*)'],
}