import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { logRouteError, logRouteInfo } from "@/lib/aurora-guard";

export const runtime = "nodejs";

type AppBuilderProject = {
  id: string;
  owner_email: string | null;
  app_name: string;
  app_type: string;
  business_goal: string | null;
  target_audience: string | null;
  main_color: string | null;
  secondary_color: string | null;
  pages_text: string | null;
  features_text: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  brand_description: string | null;
  generated_prompt: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};

function getSupabaseAdmin() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

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

function sanitizeText(value: unknown) {
  return String(value || "").trim();
}

function normalizeText(value: unknown) {
  return sanitizeText(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function toSlug(value: string) {
  return normalizeText(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function splitCommaText(value: string | null | undefined) {
  return sanitizeText(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function uniqueStrings(items: string[]) {
  return Array.from(new Set(items.map((item) => item.trim()).filter(Boolean)));
}

function suggestPages(project: AppBuilderProject) {
  const basePages = splitCommaText(project.pages_text);

  const normalizedGoal = normalizeText(project.business_goal);
  const normalizedType = normalizeText(project.app_type);

  const suggestions = [...basePages];

  if (!suggestions.some((item) => normalizeText(item) === "home")) {
    suggestions.unshift("Home");
  }

  if (
    normalizedType.includes("personalizado") ||
    normalizedGoal.includes("financeir") ||
    normalizedGoal.includes("motorista") ||
    normalizedGoal.includes("locadora")
  ) {
    suggestions.push(
      "Motoristas",
      "Locadoras",
      "Viagens",
      "Adiantamentos",
      "Cobranças",
      "Acertos",
      "Relatórios"
    );
  }

  if (normalizedType.includes("locadora")) {
    suggestions.push("Veículos", "Propostas");
  }

  if (normalizedType.includes("imobili")) {
    suggestions.push("Imóveis", "Corretores", "Leads");
  }

  if (normalizedType.includes("mineracao")) {
    suggestions.push("Fornecedores", "Oportunidades", "Serviços");
  }

  return uniqueStrings(suggestions);
}

function suggestModules(project: AppBuilderProject) {
  const baseFeatures = splitCommaText(project.features_text);
  const normalizedGoal = normalizeText(project.business_goal);
  const normalizedType = normalizeText(project.app_type);

  const modules = [
    ...baseFeatures,
    "Autenticação",
    "Painel administrativo",
    "Cadastro geral",
    "WhatsApp",
    "Relatórios",
  ];

  if (
    normalizedGoal.includes("financeir") ||
    normalizedGoal.includes("cobranca") ||
    normalizedGoal.includes("cobrança") ||
    normalizedGoal.includes("lucro") ||
    normalizedGoal.includes("acerto")
  ) {
    modules.push(
      "Lançamentos financeiros",
      "Cálculo de lucro",
      "Resumo por viagem",
      "Fechamento financeiro"
    );
  }

  if (normalizedGoal.includes("motorista")) {
    modules.push(
      "Cadastro de motoristas",
      "Gestão de adiantamentos",
      "Acerto do motorista"
    );
  }

  if (normalizedGoal.includes("locadora")) {
    modules.push(
      "Cadastro de locadoras",
      "Cobrança por locadora",
      "Resumo por cliente"
    );
  }

  if (normalizedType.includes("locadora")) {
    modules.push("Gestão de veículos", "Propostas", "Atendimento comercial");
  }

  if (normalizedType.includes("imobili")) {
    modules.push("Captação de leads", "Gestão de imóveis", "Corretores");
  }

  if (normalizedType.includes("mineracao")) {
    modules.push("Fornecedores", "Exploração", "Propostas comerciais");
  }

  return uniqueStrings(modules);
}

function suggestEntities(project: AppBuilderProject) {
  const normalizedGoal = normalizeText(project.business_goal);
  const normalizedType = normalizeText(project.app_type);

  const entities = ["profiles", "settings", "audit_logs"];

  if (
    normalizedGoal.includes("financeir") ||
    normalizedGoal.includes("motorista") ||
    normalizedGoal.includes("locadora")
  ) {
    entities.push(
      "motoristas",
      "locadoras",
      "viagens",
      "adiantamentos",
      "cobrancas",
      "acertos_financeiros"
    );
  }

  if (normalizedGoal.includes("lucro")) {
    entities.push("resumos_financeiros");
  }

  if (normalizedType.includes("locadora")) {
    entities.push("veiculos", "propostas");
  }

  if (normalizedType.includes("imobili")) {
    entities.push("imoveis", "corretores", "leads");
  }

  if (normalizedType.includes("mineracao")) {
    entities.push("fornecedores", "servicos_mineracao", "oportunidades");
  }

  return uniqueStrings(entities);
}

function suggestRoutes(pages: string[]) {
  return pages.map((page) => {
    const slug = toSlug(page);
    return {
      label: page,
      path: slug === "home" ? "/" : `/${slug}`,
    };
  });
}

function suggestTechnicalStructure(project: AppBuilderProject) {
  const pages = suggestPages(project);
  const modules = suggestModules(project);
  const entities = suggestEntities(project);
  const routes = suggestRoutes(pages);

  const appSlug = toSlug(project.app_name || "novo-app");

  return {
    projectId: project.id,
    appName: project.app_name,
    appSlug,
    ownerEmail: project.owner_email,
    appType: project.app_type,
    status: project.status,
    visual: {
      mainColor: project.main_color || "#00d084",
      secondaryColor: project.secondary_color || "#0b1220",
    },
    recommendedPages: pages,
    recommendedModules: modules,
    recommendedEntities: entities,
    recommendedRoutes: routes,
    technicalNotes: [
      "Usar Next.js App Router",
      "Estrutura mobile-first",
      "Supabase para banco e autenticação",
      "RBAC/RLS para áreas sensíveis",
      "Painel administrativo protegido",
      "Preparar integração com WhatsApp quando necessário",
    ],
    initialBuildPlan: [
      "Criar layout e navegação principal",
      "Criar páginas públicas principais",
      "Criar autenticação e perfis",
      "Criar entidades principais no banco",
      "Criar CRUD dos módulos críticos",
      "Criar painel administrativo",
      "Criar relatórios e filtros",
    ],
    technicalPrompt: `Gerar estrutura técnica inicial para o app "${project.app_name}" com base nestes elementos:
- Tipo: ${project.app_type}
- Objetivo: ${project.business_goal || "não informado"}
- Público-alvo: ${project.target_audience || "não informado"}
- Páginas: ${pages.join(", ")}
- Módulos: ${modules.join(", ")}
- Entidades: ${entities.join(", ")}
- Cor principal: ${project.main_color || "#00d084"}
- Cor secundária: ${project.secondary_color || "#0b1220"}

Direção:
- app moderno
- mobile-first
- visual premium
- operação real
- pronto para expansão futura
- preparado para painel e cadastros`,
  };
}

export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabaseAdmin();

    if (!supabase) {
      await logRouteError({
        route: "/api/app-builder/generate-from-project",
        message: "Supabase não configurado no generate-from-project.",
      });

      return NextResponse.json(
        {
          ok: false,
          error: "Supabase não configurado.",
        },
        { status: 500 }
      );
    }

    const projectId = sanitizeText(req.nextUrl.searchParams.get("projectId"));

    if (!projectId) {
      return NextResponse.json(
        {
          ok: false,
          error: "projectId é obrigatório.",
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("app_builder_projects")
      .select("*")
      .eq("id", projectId)
      .single();

    if (error || !data) {
      await logRouteError({
        route: "/api/app-builder/generate-from-project",
        message: "Projeto não encontrado para geração técnica.",
        details: {
          projectId,
          error: error?.message || null,
        },
      });

      return NextResponse.json(
        {
          ok: false,
          error: "Projeto não encontrado.",
        },
        { status: 404 }
      );
    }

    const project = data as AppBuilderProject;
    const generated = suggestTechnicalStructure(project);

    await logRouteInfo({
      route: "/api/app-builder/generate-from-project",
      message: "Estrutura técnica gerada com sucesso a partir do projeto salvo.",
      details: {
        projectId: project.id,
        appName: project.app_name,
        appType: project.app_type,
      },
    });

    return NextResponse.json({
      ok: true,
      project,
      generated,
    });
  } catch (error) {
    await logRouteError({
      route: "/api/app-builder/generate-from-project",
      message: "Falha inesperada no generate-from-project.",
      details: {
        error: error instanceof Error ? error.message : "Erro desconhecido",
      },
    });

    return NextResponse.json(
      {
        ok: false,
        error: "Erro interno ao gerar estrutura técnica.",
      },
      { status: 500 }
    );
  }
}