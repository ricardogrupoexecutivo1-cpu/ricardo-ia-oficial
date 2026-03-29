import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

type AppProjectRow = {
  id: string;
  project_id?: string | null;
  owner_email?: string | null;
  name?: string | null;
  app_name?: string | null;
  slug?: string | null;
  app_type?: string | null;
  target_audience?: string | null;
  main_goal?: string | null;
  primary_color?: string | null;
  secondary_color?: string | null;
  desired_pages?: string[] | string | null;
  desired_features?: string[] | string | null;
  contact_phone?: string | null;
  contact_email?: string | null;
  brand_description?: string | null;
  technical_structure?: Json | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type GenerateModuleBody = {
  projectId?: string;
  id?: string;
  project_id?: string;
  ownerEmail?: string;
  owner_email?: string;
  moduleName?: string;
  moduleSlug?: string;
  moduleType?: string;
  category?: string;
  prompt?: string;
};

type GeneratedFile = {
  path: string;
  type: string;
  language: string;
  description: string;
  code: string;
};

type GeneratedModulePayload = {
  moduleName: string;
  moduleSlug: string;
  moduleType: string;
  category: string;
  prompt: string;
  generatedAt: string;
  routePath: string;
  files: GeneratedFile[];
  summary: {
    appName: string;
    ownerEmail: string | null;
    pages: string[];
    features: string[];
  };
};

function getEnv(name: string) {
  return process.env[name]?.trim() || "";
}

function getSupabaseAdmin() {
  const supabaseUrl =
    getEnv("SUPABASE_URL") || getEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRole =
    getEnv("SUPABASE_SERVICE_ROLE_KEY") || getEnv("SUPABASE_SERVICE_ROLE");

  if (!supabaseUrl || !serviceRole) {
    throw new Error(
      "Variáveis do Supabase não configuradas: SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  return createClient(supabaseUrl, serviceRole, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function normalizeText(value: unknown) {
  if (typeof value !== "string") return "";
  return value.trim();
}

function normalizeSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function toArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item ?? "").trim())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function safeJson(value: unknown): Json {
  try {
    return JSON.parse(JSON.stringify(value ?? null)) as Json;
  } catch {
    return null;
  }
}

async function findProject(
  supabase: any,
  body: GenerateModuleBody
): Promise<AppProjectRow | null> {
  const projectId =
    normalizeText(body.projectId) ||
    normalizeText(body.id) ||
    normalizeText(body.project_id);

  const ownerEmail =
    normalizeText(body.ownerEmail) || normalizeText(body.owner_email);

  if (projectId) {
    const byId = await supabase
      .from("app_builder_projects")
      .select("*")
      .eq("id", projectId)
      .maybeSingle();

    if (byId.data) return byId.data as AppProjectRow;

    const byProjectId = await supabase
      .from("app_builder_projects")
      .select("*")
      .eq("project_id", projectId)
      .maybeSingle();

    if (byProjectId.data) return byProjectId.data as AppProjectRow;
  }

  if (ownerEmail) {
    const byOwner = await supabase
      .from("app_builder_projects")
      .select("*")
      .eq("owner_email", ownerEmail)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (byOwner.data) return byOwner.data as AppProjectRow;
  }

  return null;
}

function buildLocadoraModule(
  project: AppProjectRow,
  body: GenerateModuleBody
): GeneratedModulePayload {
  const appName =
    project.app_name?.trim() ||
    project.name?.trim() ||
    "Aurora Locadora Pro";

  const moduleName =
    normalizeText(body.moduleName) ||
    normalizeText(body.category) ||
    "Cadastro de Veículos";

  const moduleSlug =
    normalizeSlug(
      normalizeText(body.moduleSlug) ||
        normalizeText(body.moduleName) ||
        normalizeText(body.category) ||
        "cadastro-veiculos"
    ) || "cadastro-veiculos";

  const pages = toArray(project.desired_pages);
  const features = toArray(project.desired_features);

  const componentName =
    moduleSlug
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("") + "Page";

  const pagePath = `app/${moduleSlug}/page.tsx`;

  const pageCode = `"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type VehicleForm = {
  titulo: string;
  marca: string;
  modelo: string;
  ano: string;
  cor: string;
  placa: string;
  valorDiaria: string;
  status: string;
  observacoes: string;
};

const initialState: VehicleForm = {
  titulo: "",
  marca: "",
  modelo: "",
  ano: "",
  cor: "",
  placa: "",
  valorDiaria: "",
  status: "disponivel",
  observacoes: "",
};

export default function ${componentName}() {
  const [form, setForm] = useState<VehicleForm>(initialState);

  const pageTitle = useMemo(() => "${moduleName}", []);
  const appTitle = useMemo(() => "${appName}", []);

  function updateField<K extends keyof VehicleForm>(field: K, value: VehicleForm[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    alert("Primeira tela do módulo criada com sucesso. Próximo passo: ligar no Supabase.");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(34,197,94,0.18), transparent 30%), #050816",
        color: "#e5eef8",
        padding: "32px 16px 80px",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: 16,
          }}
        >
          <Link
            href="/"
            style={{
              color: "#93c5fd",
              textDecoration: "none",
              border: "1px solid rgba(147,197,253,0.25)",
              borderRadius: 999,
              padding: "10px 14px",
            }}
          >
            Voltar à Home
          </Link>

          <Link
            href="/guardiao"
            style={{
              color: "#86efac",
              textDecoration: "none",
              border: "1px solid rgba(134,239,172,0.25)",
              borderRadius: 999,
              padding: "10px 14px",
            }}
          >
            Ir para o Guardião
          </Link>
        </div>

        <section
          style={{
            border: "1px solid rgba(148,163,184,0.18)",
            background: "rgba(15,23,42,0.72)",
            backdropFilter: "blur(10px)",
            borderRadius: 24,
            padding: 24,
            boxShadow: "0 20px 80px rgba(0,0,0,0.35)",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              padding: "8px 12px",
              borderRadius: 999,
              background: "rgba(34,197,94,0.14)",
              border: "1px solid rgba(34,197,94,0.25)",
              color: "#86efac",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: 0.3,
              marginBottom: 14,
            }}
          >
            Módulo real inicial
          </div>

          <h1 style={{ fontSize: 32, lineHeight: 1.1, margin: 0 }}>
            {pageTitle}
          </h1>

          <p style={{ color: "#94a3b8", marginTop: 12, maxWidth: 820 }}>
            Primeiro arquivo real do módulo do projeto <strong style={{ color: "#fff" }}>{appTitle}</strong>.
            Estamos em constante atualização e pode haver momentos de instabilidade.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 14,
              marginTop: 18,
            }}
          >
            <div
              style={{
                borderRadius: 18,
                padding: 16,
                background: "rgba(15,23,42,0.72)",
                border: "1px solid rgba(148,163,184,0.16)",
              }}
            >
              <div style={{ fontSize: 12, color: "#94a3b8" }}>Páginas desejadas</div>
              <div style={{ fontWeight: 700, marginTop: 8 }}>
                ${pages.length ? pages.join(" • ") : "Não informado"}
              </div>
            </div>

            <div
              style={{
                borderRadius: 18,
                padding: 16,
                background: "rgba(15,23,42,0.72)",
                border: "1px solid rgba(148,163,184,0.16)",
              }}
            >
              <div style={{ fontSize: 12, color: "#94a3b8" }}>Funcionalidades desejadas</div>
              <div style={{ fontWeight: 700, marginTop: 8 }}>
                ${features.length ? features.join(" • ") : "Não informado"}
              </div>
            </div>

            <div
              style={{
                borderRadius: 18,
                padding: 16,
                background: "rgba(15,23,42,0.72)",
                border: "1px solid rgba(148,163,184,0.16)",
              }}
            >
              <div style={{ fontSize: 12, color: "#94a3b8" }}>Contato</div>
              <div style={{ fontWeight: 700, marginTop: 8 }}>
                ${project.contact_email?.trim() || project.owner_email?.trim() || "Não informado"}
              </div>
            </div>
          </div>
        </section>

        <section
          style={{
            border: "1px solid rgba(148,163,184,0.18)",
            background: "rgba(15,23,42,0.72)",
            backdropFilter: "blur(10px)",
            borderRadius: 24,
            padding: 24,
            boxShadow: "0 20px 80px rgba(0,0,0,0.35)",
          }}
        >
          <h2 style={{ fontSize: 24, marginTop: 0 }}>Cadastro inicial de veículo</h2>
          <p style={{ color: "#94a3b8", marginTop: 10 }}>
            Esta é a primeira tela real do módulo. No próximo passo, ligaremos este formulário ao banco.
          </p>

          <form
            onSubmit={handleSubmit}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 14,
              marginTop: 20,
            }}
          >
            {[
              ["titulo", "Título do veículo"],
              ["marca", "Marca"],
              ["modelo", "Modelo"],
              ["ano", "Ano"],
              ["cor", "Cor"],
              ["placa", "Placa"],
              ["valorDiaria", "Valor da diária"],
            ].map(([field, label]) => (
              <label
                key={field}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <span style={{ fontSize: 14, color: "#cbd5e1" }}>{label}</span>
                <input
                  value={form[field as keyof VehicleForm] as string}
                  onChange={(e) =>
                    updateField(field as keyof VehicleForm, e.target.value as never)
                  }
                  style={{
                    borderRadius: 14,
                    border: "1px solid rgba(148,163,184,0.2)",
                    background: "rgba(2,6,23,0.65)",
                    color: "#fff",
                    padding: "14px 16px",
                    outline: "none",
                  }}
                />
              </label>
            ))}

            <label
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <span style={{ fontSize: 14, color: "#cbd5e1" }}>Status</span>
              <select
                value={form.status}
                onChange={(e) => updateField("status", e.target.value)}
                style={{
                  borderRadius: 14,
                  border: "1px solid rgba(148,163,184,0.2)",
                  background: "rgba(2,6,23,0.65)",
                  color: "#fff",
                  padding: "14px 16px",
                  outline: "none",
                }}
              >
                <option value="disponivel">Disponível</option>
                <option value="alugado">Alugado</option>
                <option value="manutencao">Manutenção</option>
                <option value="reservado">Reservado</option>
              </select>
            </label>

            <label
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                gridColumn: "1 / -1",
              }}
            >
              <span style={{ fontSize: 14, color: "#cbd5e1" }}>Observações</span>
              <textarea
                value={form.observacoes}
                onChange={(e) => updateField("observacoes", e.target.value)}
                rows={5}
                style={{
                  borderRadius: 14,
                  border: "1px solid rgba(148,163,184,0.2)",
                  background: "rgba(2,6,23,0.65)",
                  color: "#fff",
                  padding: "14px 16px",
                  outline: "none",
                  resize: "vertical",
                }}
              />
            </label>

            <div
              style={{
                gridColumn: "1 / -1",
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                marginTop: 8,
              }}
            >
              <button
                type="submit"
                style={{
                  border: 0,
                  borderRadius: 999,
                  padding: "14px 22px",
                  background:
                    "linear-gradient(90deg, rgba(34,197,94,1) 0%, rgba(59,130,246,1) 100%)",
                  color: "#04111f",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                Salvar rascunho
              </button>

              <button
                type="button"
                onClick={() => setForm(initialState)}
                style={{
                  borderRadius: 999,
                  padding: "14px 22px",
                  background: "transparent",
                  border: "1px solid rgba(148,163,184,0.25)",
                  color: "#e5eef8",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Limpar
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
`;

  return {
    moduleName,
    moduleSlug,
    moduleType:
      normalizeText(body.moduleType) || normalizeText(body.category) || "custom",
    category:
      normalizeText(body.category) || normalizeText(body.moduleType) || "custom",
    prompt: normalizeText(body.prompt),
    generatedAt: new Date().toISOString(),
    routePath: `/${moduleSlug}`,
    files: [
      {
        path: pagePath,
        type: "page",
        language: "tsx",
        description: "Primeiro arquivo real do módulo gerado automaticamente.",
        code: pageCode,
      },
    ],
    summary: {
      appName,
      ownerEmail: project.owner_email || null,
      pages,
      features,
    },
  };
}

async function trySaveModule(
  supabase: any,
  project: AppProjectRow,
  modulePayload: GeneratedModulePayload,
  incomingOwnerEmail: string
) {
  const candidates: Array<Record<string, Json>> = [
    {
      project_id: project.id,
      owner_email: project.owner_email || incomingOwnerEmail || null,
      module_name: modulePayload.moduleName,
      module_slug: modulePayload.moduleSlug,
      module_type: modulePayload.moduleType,
      category: modulePayload.category,
      route_path: modulePayload.routePath,
      payload: safeJson(modulePayload),
      status: "generated",
    },
    {
      project_id: project.id,
      owner_email: project.owner_email || incomingOwnerEmail || null,
      name: modulePayload.moduleName,
      slug: modulePayload.moduleSlug,
      type: modulePayload.moduleType,
      category: modulePayload.category,
      route_path: modulePayload.routePath,
      structure: safeJson(modulePayload),
      status: "generated",
    },
    {
      project_id: project.id,
      owner_email: project.owner_email || incomingOwnerEmail || null,
      name: modulePayload.moduleName,
      slug: modulePayload.moduleSlug,
      type: modulePayload.moduleType,
      payload: safeJson(modulePayload),
    },
  ];

  const errors: string[] = [];

  for (const insertPayload of candidates) {
    const result = await (supabase as any)
      .from("app_builder_modules")
      .insert(insertPayload as any)
      .select("*")
      .maybeSingle();

    if (!result.error && result.data) {
      return {
        saved: true,
        data: result.data,
        saveError: null,
      };
    }

    if (result.error) {
      errors.push(result.error.message);
    }
  }

  return {
    saved: false,
    data: null,
    saveError: errors.join(" | ") || "Falha ao salvar em app_builder_modules.",
  };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as GenerateModuleBody;
    const supabase = getSupabaseAdmin();

    const incomingProjectId =
      normalizeText(body.projectId) ||
      normalizeText(body.id) ||
      normalizeText(body.project_id);

    const incomingOwnerEmail =
      normalizeText(body.ownerEmail) || normalizeText(body.owner_email);

    if (!incomingProjectId && !incomingOwnerEmail) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Informe projectId/id/project_id ou ownerEmail/owner_email para gerar o módulo.",
        },
        { status: 400 }
      );
    }

    const project = await findProject(supabase, body);

    if (!project) {
      return NextResponse.json(
        {
          ok: false,
          error: "Projeto não encontrado.",
          debug: {
            receivedProjectId: incomingProjectId || null,
            receivedOwnerEmail: incomingOwnerEmail || null,
            searchedTable: "app_builder_projects",
          },
        },
        { status: 404 }
      );
    }

    const modulePayload = buildLocadoraModule(project, body);
    const saveResult = await trySaveModule(
      supabase,
      project,
      modulePayload,
      incomingOwnerEmail
    );

    return NextResponse.json({
      ok: true,
      message: saveResult.saved
        ? "Módulo gerado e salvo com sucesso."
        : "Módulo gerado com sucesso, mas o salvamento no banco falhou.",
      project: {
        id: project.id,
        owner_email: project.owner_email || null,
        name: project.name || project.app_name || null,
      },
      moduleSaved: saveResult.saved,
      moduleRecord: saveResult.data,
      generatedModule: modulePayload,
      saveWarning: saveResult.saved ? null : saveResult.saveError,
    });
  } catch (error) {
    console.error("generate-module POST error:", error);

    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Erro interno ao gerar módulo.",
      },
      { status: 500 }
    );
  }
}