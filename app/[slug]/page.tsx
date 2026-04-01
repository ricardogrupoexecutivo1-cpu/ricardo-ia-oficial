import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";

export const runtime = "nodejs";

type ModuleRow = {
  id: string;
  module_name?: string | null;
  module_slug?: string | null;
  route_path?: string | null;
  payload?: any;
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
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("app_builder_modules")
    .select("*")
    .eq("module_slug", slug)
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;
  return data as ModuleRow;
}

export default async function DynamicModulePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const slug = text(resolvedParams?.slug);

  // 🔥 BLOQUEIO DE ROTAS CRÍTICAS (AQUI ESTÁ A CORREÇÃO)
  const rotasProtegidas = [
    "cadastro-geral",
    "cadastro",
    "cadastro-basico",
    "cadastro-veiculos",
    "cadastros",
  ];

  if (rotasProtegidas.includes(slug)) {
    return notFound();
  }

  const moduleData = await getModuleBySlug(slug);

  if (!moduleData) {
    return (
      <main style={{ padding: 40 }}>
        <h1>Módulo não encontrado</h1>
        <p>Essa rota não pertence ao App Builder.</p>

        <div style={{ marginTop: 20 }}>
          <Link href="/">Voltar para Home</Link>
        </div>
      </main>
    );
  }

  const payload = moduleData.payload || {};
  const moduleName =
    text(moduleData.module_name) || prettyTitle(text(moduleData.module_slug));
  const routePath = text(moduleData.route_path) || `/${slug}`;

  return (
    <main style={{ padding: 40 }}>
      <h1>{moduleName}</h1>

      <p style={{ marginTop: 10 }}>
        Módulo carregado com sucesso.
      </p>

      <div style={{ marginTop: 20 }}>
        <Link href="/">Home</Link>
      </div>
    </main>
  );
}