import { createClient } from "@supabase/supabase-js";

type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type CadastroContextResult = {
  ok: boolean;
  error?: string;
  authUserId: string | null;
  authEmail: string | null;
  profileId: string | null;
  profileEmail: string | null;
  cadastroId: string | null;
  cadastroUserId: string | null;
  cadastroEmail: string | null;
  companyId: string | null;
  profile: Record<string, Json> | null;
  cadastro: Record<string, Json> | null;
};

function getSupabaseAdmin() {
  const url =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  if (!url) {
    throw new Error("SUPABASE_URL não configurada.");
  }

  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY não configurada.");
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export async function getAuthenticatedCadastroContext(params: {
  accessToken?: string | null;
  emailHint?: string | null;
}): Promise<CadastroContextResult> {
  try {
    const supabase = getSupabaseAdmin();

    const accessToken = params.accessToken?.trim() || null;
    const emailHint = params.emailHint?.trim().toLowerCase() || null;

    let authUserId: string | null = null;
    let authEmail: string | null = null;

    if (accessToken) {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser(accessToken);

      if (authError) {
        return {
          ok: false,
          error: `Falha ao validar sessão do usuário: ${authError.message}`,
          authUserId: null,
          authEmail: null,
          profileId: null,
          profileEmail: null,
          cadastroId: null,
          cadastroUserId: null,
          cadastroEmail: null,
          companyId: null,
          profile: null,
          cadastro: null,
        };
      }

      authUserId = user?.id ?? null;
      authEmail = user?.email?.trim().toLowerCase() ?? null;
    }

    const effectiveEmail = authEmail || emailHint || null;

    let profile: Record<string, Json> | null = null;

    if (authUserId) {
      const { data: profileById, error: profileByIdError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUserId)
        .maybeSingle();

      if (profileByIdError) {
        return {
          ok: false,
          error: `Falha ao buscar profile por id: ${profileByIdError.message}`,
          authUserId,
          authEmail,
          profileId: null,
          profileEmail: null,
          cadastroId: null,
          cadastroUserId: null,
          cadastroEmail: null,
          companyId: null,
          profile: null,
          cadastro: null,
        };
      }

      if (profileById) {
        profile = profileById as Record<string, Json>;
      }
    }

    if (!profile && effectiveEmail) {
      const { data: profileByEmail, error: profileByEmailError } = await supabase
        .from("profiles")
        .select("*")
        .ilike("email", effectiveEmail)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (profileByEmailError) {
        return {
          ok: false,
          error: `Falha ao buscar profile por e-mail: ${profileByEmailError.message}`,
          authUserId,
          authEmail,
          profileId: null,
          profileEmail: null,
          cadastroId: null,
          cadastroUserId: null,
          cadastroEmail: null,
          companyId: null,
          profile: null,
          cadastro: null,
        };
      }

      if (profileByEmail) {
        profile = profileByEmail as Record<string, Json>;
      }
    }

    let cadastro: Record<string, Json> | null = null;

    if (authUserId) {
      const { data: cadastroByUserId, error: cadastroByUserIdError } = await supabase
        .from("cadastros_gerais")
        .select("*")
        .eq("user_id", authUserId)
        .order("updated_at", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (cadastroByUserIdError) {
        return {
          ok: false,
          error: `Falha ao buscar cadastro por user_id: ${cadastroByUserIdError.message}`,
          authUserId,
          authEmail,
          profileId: (profile?.id as string) ?? null,
          profileEmail: (profile?.email as string) ?? null,
          cadastroId: null,
          cadastroUserId: null,
          cadastroEmail: null,
          companyId: (profile?.company_id as string) ?? null,
          profile,
          cadastro: null,
        };
      }

      if (cadastroByUserId) {
        cadastro = cadastroByUserId as Record<string, Json>;
      }
    }

    if (!cadastro && effectiveEmail) {
      const { data: cadastroByEmail, error: cadastroByEmailError } = await supabase
        .from("cadastros_gerais")
        .select("*")
        .ilike("email", effectiveEmail)
        .order("updated_at", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (cadastroByEmailError) {
        return {
          ok: false,
          error: `Falha ao buscar cadastro por e-mail: ${cadastroByEmailError.message}`,
          authUserId,
          authEmail,
          profileId: (profile?.id as string) ?? null,
          profileEmail: (profile?.email as string) ?? null,
          cadastroId: null,
          cadastroUserId: null,
          cadastroEmail: null,
          companyId: (profile?.company_id as string) ?? null,
          profile,
          cadastro: null,
        };
      }

      if (cadastroByEmail) {
        cadastro = cadastroByEmail as Record<string, Json>;
      }
    }

    return {
      ok: true,
      authUserId,
      authEmail,
      profileId: (profile?.id as string) ?? null,
      profileEmail: (profile?.email as string) ?? null,
      cadastroId: (cadastro?.id as string) ?? null,
      cadastroUserId: (cadastro?.user_id as string) ?? null,
      cadastroEmail: (cadastro?.email as string) ?? null,
      companyId:
        ((profile?.company_id as string) ?? (cadastro?.company_id as string) ?? null),
      profile,
      cadastro,
    };
  } catch (error: any) {
    return {
      ok: false,
      error: error?.message || "Erro inesperado ao montar contexto do cadastro.",
      authUserId: null,
      authEmail: null,
      profileId: null,
      profileEmail: null,
      cadastroId: null,
      cadastroUserId: null,
      cadastroEmail: null,
      companyId: null,
      profile: null,
      cadastro: null,
    };
  }
}