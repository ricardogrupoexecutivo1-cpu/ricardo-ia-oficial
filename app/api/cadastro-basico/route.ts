import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getEnv(name: string) {
  const value = process.env[name];
  return typeof value === "string" && value.trim() ? value.trim() : "";
}

function getSupabaseAdmin() {
  const url =
    getEnv("SUPABASE_URL") || getEnv("NEXT_PUBLIC_SUPABASE_URL");
  const key = getEnv("SUPABASE_SERVICE_ROLE_KEY");

  if (!url || !key) {
    throw new Error(
      "Supabase admin não configurado. Verifique SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function normalizeEmail(value: unknown) {
  return String(value ?? "").trim().toLowerCase();
}

function normalizeText(value: unknown) {
  return String(value ?? "").trim();
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      nome?: unknown;
      email?: unknown;
      whatsapp?: unknown;
      cidade?: unknown;
      estado?: unknown;
      segmento?: unknown;
    };

    const nome = normalizeText(body.nome);
    const email = normalizeEmail(body.email);
    const whatsapp = normalizeText(body.whatsapp);
    const cidade = normalizeText(body.cidade);
    const estado = normalizeText(body.estado);
    const segmento = normalizeText(body.segmento);

    if (!nome && !email) {
      return Response.json(
        {
          ok: false,
          error: "Informe pelo menos nome ou e-mail.",
        },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    let cadastroExistenteId: string | null = null;

    if (email) {
      const { data: principal, error: principalError } = await supabase
        .from("vw_cadastro_principal_por_email")
        .select("id")
        .eq("email", email)
        .limit(1)
        .maybeSingle();

      if (principalError) {
        throw new Error(
          `Erro ao consultar cadastro principal por e-mail: ${principalError.message}`
        );
      }

      cadastroExistenteId = principal?.id ?? null;
    }

    const payload = {
      nome_responsavel: nome || null,
      email: email || null,
      whatsapp: whatsapp || null,
      cidade_base: cidade || null,
      estado_base: estado || null,
      coverage_type: "brasil",
      atendimento_tipo: "todos",
      status: "rascunho",
      is_public: false,
      origem: "cadastro_basico",
      cadastro_tipo: "basico",
      cadastro_completo: false,
      updated_at: new Date().toISOString(),
    };

    let cadastroId: string | null = null;

    if (cadastroExistenteId) {
      const { data, error } = await supabase
        .from("cadastros_gerais")
        .update(payload)
        .eq("id", cadastroExistenteId)
        .select("id")
        .single();

      if (error) {
        throw new Error(`Erro ao atualizar cadastro básico existente: ${error.message}`);
      }

      cadastroId = data?.id ?? cadastroExistenteId;
    } else {
      const { data, error } = await supabase
        .from("cadastros_gerais")
        .insert(payload)
        .select("id")
        .single();

      if (error) {
        throw new Error(`Erro ao criar cadastro básico: ${error.message}`);
      }

      cadastroId = data?.id ?? null;
    }

    if (!cadastroId) {
      throw new Error("Não foi possível identificar o cadastro salvo.");
    }

    if (segmento) {
      const { error: segmentoError } = await supabase
        .from("cadastro_segmentos")
        .insert({
          cadastro_id: cadastroId,
          nome: segmento,
        });

      if (segmentoError) {
        console.warn(
          "[cadastro-basico] aviso ao inserir segmento:",
          segmentoError.message
        );
      }
    }

    return Response.json({
      ok: true,
      id: cadastroId,
      reused: Boolean(cadastroExistenteId),
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Falha ao salvar cadastro básico.";

    return Response.json(
      {
        ok: false,
        error: message,
      },
      { status: 500 }
    );
  }
}