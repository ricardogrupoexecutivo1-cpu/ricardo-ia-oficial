import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type PublicCompanyProfile = {
  id: string;
  slug: string;
  publicName: string;
  publicDescription: string | null;
  city: string | null;
  state: string | null;
  coverage: string | null;
  segment: string | null;
  serviceMode: string | null;
  website: string | null;
  whatsapp: string | null;
  instagram: string | null;
  logoUrl: string | null;
  heroImageUrl: string | null;
  updatedAt: string | null;
};

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";

const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

const REGISTRATIONS_TABLE_CANDIDATES = [
  process.env.NEXT_PUBLIC_AURORA_REGISTRATIONS_TABLE || "",
  "vw_cadastros_gerais_resumo",
  "cadastros",
  "cadastro",
  "general_registrations",
  "aurora_registrations",
  "public_profiles",
  "registrations",
]
  .map((item) => item.trim())
  .filter(Boolean);

type RegistrationRow = {
  [key: string]: Json | undefined;
};

function getSupabaseAdmin(): SupabaseClient {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error("Variáveis do Supabase não configuradas.");
  }

  return createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function normalizeCandidateText(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const cleaned = value.trim();
  if (!cleaned) return null;

  const normalized = cleaned.toLowerCase();

  const blockedValues = new Set([
    "null",
    "undefined",
    "n/a",
    "na",
    "não informado",
    "nao informado",
    "sem informação",
    "sem informacao",
    "empresa",
    "empresa aurora",
    "-",
    "--",
    ".",
  ]);

  if (blockedValues.has(normalized)) {
    return null;
  }

  return cleaned;
}

function pickFirstString(
  row: RegistrationRow,
  candidates: string[],
): string | null {
  for (const key of candidates) {
    const value = normalizeCandidateText(row[key]);
    if (value) return value;
  }
  return null;
}

function pickBoolean(row: RegistrationRow, candidates: string[]): boolean {
  for (const key of candidates) {
    const value = row[key];
    if (typeof value === "boolean") return value;
  }
  return false;
}

function normalizeSlugPart(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " e ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function normalizeKey(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function findStringByKeyHints(
  row: RegistrationRow,
  includeHints: string[],
  excludeHints: string[] = [],
): string | null {
  for (const [rawKey, rawValue] of Object.entries(row)) {
    const key = normalizeKey(rawKey);

    const hasInclude = includeHints.some((hint) => key.includes(normalizeKey(hint)));
    const hasExclude = excludeHints.some((hint) => key.includes(normalizeKey(hint)));

    if (!hasInclude || hasExclude) continue;

    const value = normalizeCandidateText(rawValue);
    if (value) return value;
  }

  return null;
}

export function buildCompanySlug(input: {
  publicName?: string | null;
  city?: string | null;
  state?: string | null;
}): string {
  const base = [
    input.publicName ? normalizeSlugPart(input.publicName) : "",
    input.city ? normalizeSlugPart(input.city) : "",
    input.state ? normalizeSlugPart(input.state) : "",
  ]
    .filter(Boolean)
    .join("-");

  return base || "empresa";
}

function hasPublicVisibility(row: RegistrationRow): boolean {
  const isPublic = pickBoolean(row, [
    "is_public",
    "public_enabled",
    "public_visible",
    "show_public_page",
    "allow_public_page",
  ]);

  const status = (
    pickFirstString(row, ["status", "situacao", "situation"]) || ""
  ).toLowerCase();

  const isBlocked = pickBoolean(row, [
    "is_blocked",
    "blocked",
    "public_blocked",
    "access_blocked",
  ]);

  const isInactive =
    pickBoolean(row, ["is_inactive", "inactive", "disabled", "archived"]) ||
    status === "inativo" ||
    status === "bloqueado" ||
    status === "arquivado";

  return isPublic && !isBlocked && !isInactive;
}

function resolvePublicName(row: RegistrationRow): string {
  const exact =
    pickFirstString(row, [
      "public_name",
      "display_name",
      "company_name",
      "business_name",
      "trade_name",
      "nome_empresa",
      "nome_fantasia",
      "razao_social",
      "responsavel",
      "responsável",
      "name",
      "nome",
      "empresa",
    ]) ||
    findStringByKeyHints(row, ["nome_empresa", "nome fantasia", "razao", "razão"]) ||
    findStringByKeyHints(row, ["responsavel", "responsável", "responsible"]) ||
    findStringByKeyHints(row, ["empresa", "company", "business"], [
      "tipo",
      "categoria",
      "origem",
    ]) ||
    findStringByKeyHints(row, ["nome"], [
      "arquivo",
      "imagem",
      "slug",
      "origem",
      "segment",
      "categoria",
    ]);

  return exact || "Empresa Aurora";
}

function sanitizePublicCompany(row: RegistrationRow): PublicCompanyProfile | null {
  if (!row || typeof row !== "object") return null;

  if (!hasPublicVisibility(row)) {
    return null;
  }

  const id = normalizeCandidateText(row.id);
  if (!id) return null;

  const publicName = resolvePublicName(row);

  const publicDescription =
    pickFirstString(row, [
      "public_description",
      "description",
      "bio",
      "about",
      "summary",
      "descricao_publica",
      "descricao",
      "observacao",
      "observação",
    ]) ||
    findStringByKeyHints(row, ["observacao", "observação", "descricao", "descrição"]);

  const city =
    pickFirstString(row, [
      "public_city",
      "city",
      "base_city",
      "cidade",
      "cidade_base",
    ]) || findStringByKeyHints(row, ["cidade"]);

  const state =
    pickFirstString(row, [
      "public_state",
      "state",
      "base_state",
      "estado",
      "estado_base",
      "uf",
    ]) || findStringByKeyHints(row, ["estado", "uf"]);

  const coverage =
    pickFirstString(row, [
      "coverage",
      "coverage_area",
      "service_area",
      "public_coverage",
      "coverage_scope",
      "abrangencia",
      "cobertura",
      "coverage_type",
    ]) || findStringByKeyHints(row, ["coverage", "cobertura", "abrangencia"]);

  const segment =
    pickFirstString(row, [
      "segment",
      "main_segment",
      "category",
      "public_segment",
      "segmento",
      "categoria",
      "origem",
    ]) || findStringByKeyHints(row, ["segment", "categoria", "origem"]);

  const serviceMode =
    pickFirstString(row, [
      "service_mode",
      "attendance_mode",
      "service_type",
      "public_service_mode",
      "atendimento",
      "modo_atendimento",
    ]) || findStringByKeyHints(row, ["atendimento"]);

  const website =
    pickFirstString(row, [
      "website",
      "site",
      "public_website",
      "url",
      "site_url",
    ]) || findStringByKeyHints(row, ["site", "website", "url"]);

  const whatsapp =
    pickFirstString(row, [
      "whatsapp",
      "phone_whatsapp",
      "public_whatsapp",
      "contact_whatsapp",
      "telefone",
      "telefone_whatsapp",
      "watzap",
    ]) || findStringByKeyHints(row, ["whatsapp", "telefone", "watzap"]);

  const instagram =
    pickFirstString(row, [
      "instagram",
      "social_instagram",
      "public_instagram",
      "main_social",
      "rede_principal",
    ]) || findStringByKeyHints(row, ["instagram"]);

  const logoUrl =
    pickFirstString(row, [
      "logo_url",
      "public_logo_url",
      "avatar_url",
      "image_url",
      "foto_url",
    ]) || findStringByKeyHints(row, ["logo", "avatar", "foto"], ["capa", "banner"]);

  const heroImageUrl =
    pickFirstString(row, [
      "hero_image_url",
      "cover_image_url",
      "banner_url",
      "public_banner_url",
      "capa_url",
    ]) || findStringByKeyHints(row, ["hero", "cover", "banner", "capa"]);

  const updatedAt = pickFirstString(row, [
    "updated_at",
    "modified_at",
    "created_at",
  ]);

  const slug =
    pickFirstString(row, ["public_slug", "slug"]) ||
    buildCompanySlug({
      publicName,
      city,
      state,
    });

  return {
    id,
    slug,
    publicName,
    publicDescription,
    city,
    state,
    coverage,
    segment,
    serviceMode,
    website,
    whatsapp,
    instagram,
    logoUrl,
    heroImageUrl,
    updatedAt,
  };
}

async function loadRowsFromFirstAvailableTable(): Promise<{
  tableName: string;
  rows: RegistrationRow[];
}> {
  const supabase = getSupabaseAdmin();
  const errors: string[] = [];

  for (const tableName of REGISTRATIONS_TABLE_CANDIDATES) {
    const result = await supabase.from(tableName).select("*").limit(500);

    if (!result.error) {
      return {
        tableName,
        rows: Array.isArray(result.data) ? (result.data as RegistrationRow[]) : [],
      };
    }

    errors.push(`${tableName}: ${result.error.message}`);
  }

  throw new Error(
    `Nenhuma tabela de cadastro público foi encontrada. Tentativas: ${errors.join(" | ")}`,
  );
}

export async function getPublicCompanyBySlug(
  slug: string,
): Promise<PublicCompanyProfile | null> {
  const normalizedSlug = normalizeSlugPart(slug);

  if (!normalizedSlug) {
    return null;
  }

  const { rows } = await loadRowsFromFirstAvailableTable();

  for (const row of rows) {
    const sanitized = sanitizePublicCompany(row);
    if (!sanitized) continue;

    if (sanitized.slug === normalizedSlug) {
      return sanitized;
    }
  }

  return null;
}

export async function getPublicCompanies(): Promise<PublicCompanyProfile[]> {
  const { rows } = await loadRowsFromFirstAvailableTable();

  return rows
    .map((row) => sanitizePublicCompany(row))
    .filter((item): item is PublicCompanyProfile => Boolean(item));
}