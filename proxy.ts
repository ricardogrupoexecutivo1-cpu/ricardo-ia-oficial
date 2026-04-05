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

  "/banco": "/bancos",
  "/banco/": "/bancos",

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

function safeRedirect(
  request: NextRequest,
  targetPath: string,
  currentNormalizedPath: string
) {
  const normalizedTarget = normalizePath(targetPath);

  if (!normalizedTarget || normalizedTarget === currentNormalizedPath) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = normalizedTarget;

  return NextResponse.redirect(url, 308);
}

export function proxy(request: NextRequest) {
  const { nextUrl } = request;
  const pathname = nextUrl.pathname;

  if (shouldIgnorePath(pathname)) {
    return NextResponse.next();
  }

  const normalizedPath = normalizePath(pathname);

  const directRedirect = REDIRECTS[normalizedPath];
  if (directRedirect) {
    return safeRedirect(request, directRedirect, normalizedPath);
  }

  if (normalizedPath.startsWith("/locadoras")) {
    return safeRedirect(
      request,
      normalizedPath.replace("/locadoras", "/locadora"),
      normalizedPath
    );
  }

  if (normalizedPath.startsWith("/imobiliária")) {
    return safeRedirect(
      request,
      normalizedPath.replace("/imobiliária", "/imobiliarias"),
      normalizedPath
    );
  }

  if (normalizedPath.startsWith("/veiculos")) {
    return safeRedirect(
      request,
      "/locadora/cadastros/veiculos",
      normalizedPath
    );
  }

  if (normalizedPath.startsWith("/clientes")) {
    return safeRedirect(
      request,
      "/locadora/cadastros/clientes",
      normalizedPath
    );
  }

  if (normalizedPath.startsWith("/motoristas")) {
    return safeRedirect(
      request,
      "/locadora/cadastros/motoristas",
      normalizedPath
    );
  }

  if (normalizedPath.startsWith("/condutores")) {
    return safeRedirect(
      request,
      "/locadora/cadastros/motoristas",
      normalizedPath
    );
  }

  if (normalizedPath.startsWith("/parceiros")) {
    return safeRedirect(
      request,
      "/locadora/cadastros/parceiros",
      normalizedPath
    );
  }

  if (normalizedPath.startsWith("/agricultura")) {
    return safeRedirect(request, "/agro", normalizedPath);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};