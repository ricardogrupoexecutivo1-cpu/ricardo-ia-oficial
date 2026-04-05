import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";

export const runtime = "nodejs";

type ModuleRow = {
  id: string;
  module_name?: string | null;
  module_slug?: string | null;
  route_path?: string | null;
  payload?: unknown;
  project_id?: string | null;
  owner_email?: string | null;
};

function getSupabaseAdmin() {
  const supabaseUrl =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE;

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function text(value: unknown) {
  if (typeof value !== "string") return "";
  return value.trim();
}

function prettyTitle(value: string) {
  return value
    .split("-")
    .filter(Boolean)
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
    .join(" ");
}

async function getModuleBySlug(slug: string): Promise<ModuleRow | null> {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("app_builder_modules")
    .select("*")
    .eq("module_slug", slug)
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as ModuleRow;
}

function isProtectedSlug(slug: string) {
  const rotasProtegidas = new Set([
    "",
    "cadastro-geral",
    "cadastro",
    "cadastro-basico",
    "cadastro-veiculos",
    "cadastros",
    "chat",
    "planos",
    "explorar",
    "guardiao",
    "app-builder",
    "locadora",
    "imoveis",
    "imobiliarias",
    "agro",
    "bancos",
    "financeiro",
    "mineracao",
    "aurora-responde",
    "afiliado",
    "afiliados",
    "livro",
  ]);

  return rotasProtegidas.has(slug);
}

export default async function DynamicModulePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const slug = text(resolvedParams?.slug).toLowerCase();

  if (!slug) {
    notFound();
  }

  if (isProtectedSlug(slug)) {
    notFound();
  }

  const moduleData = await getModuleBySlug(slug);

  if (!moduleData) {
    notFound();
  }

  const moduleName =
    text(moduleData.module_name) || prettyTitle(text(moduleData.module_slug));
  const routePath = text(moduleData.route_path) || `/${slug}`;

  return (
    <main style={pageStyle}>
      <section style={cardStyle}>
        <div style={badgeStyle}>Módulo do App Builder</div>

        <h1 style={titleStyle}>{moduleName}</h1>

        <p style={textStyle}>
          Módulo carregado com sucesso dentro da Aurora.
        </p>

        <div style={metaStyle}>
          <strong>Rota:</strong> {routePath}
        </div>

        <div style={actionsStyle}>
          <Link href="/" style={primaryLinkStyle}>
            Voltar para Home
          </Link>

          <Link href="/app-builder" style={secondaryLinkStyle}>
            Ir para App Builder
          </Link>
        </div>
      </section>
    </main>
  );
}

const pageStyle = {
  minHeight: "100vh",
  background:
    "linear-gradient(180deg, #eef6ff 0%, #f8fbff 40%, #eef9f2 100%)",
  padding: "32px 16px 80px",
};

const cardStyle = {
  maxWidth: 900,
  margin: "0 auto",
  background: "#ffffff",
  border: "1px solid rgba(15,23,42,0.08)",
  borderRadius: 24,
  padding: 28,
  boxShadow: "0 20px 60px rgba(15,23,42,0.08)",
};

const badgeStyle = {
  display: "inline-flex",
  padding: "8px 12px",
  borderRadius: 999,
  background: "rgba(37,99,235,0.08)",
  border: "1px solid rgba(37,99,235,0.16)",
  color: "#2563eb",
  fontWeight: 800,
  fontSize: 13,
};

const titleStyle = {
  marginTop: 16,
  marginBottom: 0,
  fontSize: 36,
  lineHeight: 1.1,
  color: "#0f172a",
  fontWeight: 900,
};

const textStyle = {
  marginTop: 14,
  marginBottom: 0,
  fontSize: 16,
  lineHeight: 1.7,
  color: "#475569",
};

const metaStyle = {
  marginTop: 18,
  padding: "12px 14px",
  borderRadius: 14,
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  color: "#334155",
};

const actionsStyle = {
  marginTop: 22,
  display: "flex",
  gap: 12,
  flexWrap: "wrap" as const,
};

const primaryLinkStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
  borderRadius: 14,
  padding: "12px 16px",
  background: "#2563eb",
  color: "#ffffff",
  fontWeight: 800,
};

const secondaryLinkStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
  borderRadius: 14,
  padding: "12px 16px",
  background: "#ffffff",
  color: "#0f172a",
  border: "1px solid #e2e8f0",
  fontWeight: 700,
};