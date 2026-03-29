import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function normalizePath(pathname: string) {
  if (!pathname) return "/";
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }
  return pathname.toLowerCase();
}

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const pathname = normalizePath(url.pathname);

  const redirectMap: Record<string, string> = {
    "/home": "/",
    "/inicio": "/",
    "/principal": "/",
    "/index": "/",

    "/builder": "/app-builder",
    "/appbuilder": "/app-builder",
    "/app-builder-interno": "/app-builder",
    "/criador-de-apps": "/app-builder",

    "/guardiao-interno": "/guardiao",
    "/guardian": "/guardiao",

    "/imobiliaria": "/imobiliarias",
    "/imobiliaria/cadastrar": "/imobiliarias/cadastrar",
    "/imobiliarias/cadastro": "/imobiliarias/cadastrar",

    "/imovel": "/imoveis",
    "/imovel/cadastrar": "/imobiliarias/cadastrar",
    "/imoveis/cadastrar": "/imobiliarias/cadastrar",

    "/agros": "/agro",
    "/agroo": "/agro",
    "/agro/cadastro": "/agro/cadastrar",
    "/agro/imoveis": "/agro",

    "/locadora": "/cadastro-veiculos",
    "/locadora/veiculos": "/cadastro-veiculos",
    "/locadora/cadastro-veiculos": "/cadastro-veiculos",
    "/veiculos": "/cadastro-veiculos",
    "/veiculo": "/cadastro-veiculos",
    "/cadastro-veiculo": "/cadastro-veiculos",

    "/imagens": "/explorar",
    "/galeria": "/explorar",
    "/explore": "/explorar",

    "/precos": "/planos",
    "/pricing": "/planos",

    "/conversa": "/chat",
    "/ia": "/chat",

    "/livros": "/livro",
  };

  const directMatch = redirectMap[pathname];
  if (directMatch) {
    url.pathname = directMatch;
    return NextResponse.redirect(url, 308);
  }

  if (pathname.startsWith("/imobiliaria/") && !pathname.startsWith("/imobiliarias/")) {
    url.pathname = pathname.replace("/imobiliaria/", "/imobiliarias/");
    return NextResponse.redirect(url, 308);
  }

  if (pathname.startsWith("/imovel/") && !pathname.startsWith("/imoveis/")) {
    url.pathname = pathname.replace("/imovel/", "/imoveis/");
    return NextResponse.redirect(url, 308);
  }

  if (pathname.startsWith("/agros/") && !pathname.startsWith("/agro/")) {
    url.pathname = pathname.replace("/agros/", "/agro/");
    return NextResponse.redirect(url, 308);
  }

  if (pathname.startsWith("/builder/") && !pathname.startsWith("/app-builder/")) {
    url.pathname = pathname.replace("/builder/", "/app-builder/");
    return NextResponse.redirect(url, 308);
  }

  if (pathname.startsWith("/appbuilder/") && !pathname.startsWith("/app-builder/")) {
    url.pathname = pathname.replace("/appbuilder/", "/app-builder/");
    return NextResponse.redirect(url, 308);
  }

  if (pathname.startsWith("/veiculo/") && !pathname.startsWith("/cadastro-veiculos/")) {
    url.pathname = pathname.replace("/veiculo/", "/cadastro-veiculos/");
    return NextResponse.redirect(url, 308);
  }

  if (pathname.startsWith("/veiculos/") && !pathname.startsWith("/cadastro-veiculos/")) {
    url.pathname = pathname.replace("/veiculos/", "/cadastro-veiculos/");
    return NextResponse.redirect(url, 308);
  }

  if (pathname.startsWith("/locadora/") && pathname !== "/locadora/veiculos") {
    url.pathname = "/cadastro-veiculos";
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|manifest.webmanifest|sw.js).*)",
  ],
};