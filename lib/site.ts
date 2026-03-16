export const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/+$/, "") ||
  "https://ricardoiaoficial.com";

export const SITE_NAME = "Aurora IA";
export const SITE_TITLE = "Aurora IA | Criação de imagens, campanhas e ideias";
export const SITE_DESCRIPTION =
  "Aurora IA: converse, gere imagens, crie campanhas, descubra ideias de negócio e publique imagens com página pública otimizada para SEO.";

export function absoluteUrl(path = "") {
  if (!path) return SITE_URL;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}