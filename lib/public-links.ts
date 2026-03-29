import { buildCompanySlug } from "@/lib/public-company";

export type PublicLinkInput = {
  publicName?: string | null;
  city?: string | null;
  state?: string | null;
  customSlug?: string | null;
};

function cleanText(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const cleaned = value.trim();
  if (!cleaned) return null;
  return cleaned;
}

function normalizeOrigin(origin?: string | null): string {
  const raw =
    cleanText(origin) ||
    cleanText(process.env.NEXT_PUBLIC_SITE_URL) ||
    cleanText(process.env.NEXT_PUBLIC_APP_URL) ||
    "https://ricardoiaoficial.com";

  const normalized = raw.replace(/\/+$/, "");

  if (
    normalized.includes("localhost") ||
    normalized.includes("127.0.0.1") ||
    normalized.includes("0.0.0.0")
  ) {
    return "https://ricardoiaoficial.com";
  }

  return normalized;
}

export function getPublicCompanySlug(input: PublicLinkInput): string {
  const customSlug = cleanText(input.customSlug);

  if (customSlug) {
    return customSlug;
  }

  return buildCompanySlug({
    publicName: cleanText(input.publicName),
    city: cleanText(input.city),
    state: cleanText(input.state),
  });
}

export function getPublicCompanyPath(input: PublicLinkInput): string {
  const slug = getPublicCompanySlug(input);
  return `/empresa/${slug}`;
}

export function getPublicCompanyUrl(
  input: PublicLinkInput,
  origin?: string | null,
): string {
  const path = getPublicCompanyPath(input);
  const base = normalizeOrigin(origin);

  return `${base}${path}`;
}

export function getPublicCompanyShareText(input: PublicLinkInput): string {
  const name = cleanText(input.publicName) || "Meu perfil público na Aurora";
  return `${name} já está com perfil público na Aurora. Confira meu link público:`;
}