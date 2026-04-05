import { NextRequest, NextResponse } from "next/server";

const REDIRECTS: Record<string, string> = {
  "/builder": "/app-builder",
  "/appbuilder": "/app-builder",
  "/app-builder/": "/app-builder",

  "/imobiliaria": "/imobiliarias",
  "/imobiliaria/": "/imobiliarias",
  "/imobiliarias/": "/imobiliarias",

  "/imovel": "/imoveis",
  "/imovel/": "/imoveis",
  "/imoveis/": "/imoveis",

  "/locadora/veiculos": "/locadora/cadastros/veiculos",
  "/locadora/veiculo": "/locadora/cadastros/veiculos",
  "/locadora/clientes": "/locadora/cadastros/clientes",
  "/locadora/motoristas": "/locadora/cadastros/motoristas",
  "/locadora/condutores": "/locadora/cadastros/motoristas",
  "/locadora/parceiros": "/locadora/cadastros/parceiros",
  "/locadora/bancos": "/bancos",

  "/cadastro": "/",
  "/cadastrar": "/",
  "/cadastros": "/",
  "/registro": "/",

  "/explore": "/explorar",
  "/plans": "/planos",
  "/pricing": "/planos",
  "/book": "/livro",
  "/books": "/livro",

  "/home": "/",
  "/inicio": "/",
};

function normalizePath(pathname: string) {
  if (!pathname) return "/";

  let normalized = pathname.trim();

  if (normalized.length > 1 && normalized.endsWith("/")) {
    normalized = normalized.slice(0, -1);
  }

  normalized = normalized.toLowerCase();

  return normalized || "/";
}

function shouldIgnorePath(pathname: string) {
  return (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/sitemap") ||
    pathname.startsWith("/robots") ||
    pathname.startsWith("/manifest") ||
    pathname.startsWith("/icon") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/fonts") ||
    pathname.startsWith("/assets") ||
    pathname.startsWith("/public") ||
    pathname.includes(".")
  );
}

export function proxy(request: NextRequest) {
  const { nextUrl } = request;
  const pathname = nextUrl.pathname;

  if (shouldIgnorePath(pathname)) {
    return NextResponse.next();
  }

  const normalizedPath = normalizePath(pathname);

  const directRedirect = REDIRECTS[normalizedPath];
  if (directRedirect && directRedirect !== normalizedPath) {
    const url = nextUrl.clone();
    url.pathname = directRedirect;
    return NextResponse.redirect(url, 308);
  }

  if (normalizedPath.startsWith("/locadoras")) {
    const url = nextUrl.clone();
    url.pathname = normalizedPath.replace("/locadoras", "/locadora");
    return NextResponse.redirect(url, 308);
  }

  if (normalizedPath.startsWith("/imobiliária")) {
    const url = nextUrl.clone();
    url.pathname = normalizedPath.replace("/imobiliária", "/imobiliarias");
    return NextResponse.redirect(url, 308);
  }

  if (normalizedPath.startsWith("/veiculos")) {
    const url = nextUrl.clone();
    url.pathname = "/locadora/cadastros/veiculos";
    return NextResponse.redirect(url, 308);
  }

  if (normalizedPath.startsWith("/clientes")) {
    const url = nextUrl.clone();
    url.pathname = "/locadora/cadastros/clientes";
    return NextResponse.redirect(url, 308);
  }

  if (normalizedPath.startsWith("/motoristas")) {
    const url = nextUrl.clone();
    url.pathname = "/locadora/cadastros/motoristas";
    return NextResponse.redirect(url, 308);
  }

  if (normalizedPath.startsWith("/condutores")) {
    const url = nextUrl.clone();
    url.pathname = "/locadora/cadastros/motoristas";
    return NextResponse.redirect(url, 308);
  }

  if (normalizedPath.startsWith("/parceiros")) {
    const url = nextUrl.clone();
    url.pathname = "/locadora/cadastros/parceiros";
    return NextResponse.redirect(url, 308);
  }

  if (normalizedPath.startsWith("/banco")) {
    const url = nextUrl.clone();
    url.pathname = "/bancos";
    return NextResponse.redirect(url, 308);
  }

  if (normalizedPath.startsWith("/agricultura")) {
    const url = nextUrl.clone();
    url.pathname = "/agro";
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};