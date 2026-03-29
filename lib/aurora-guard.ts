import { createClient, SupabaseClient } from "@supabase/supabase-js";

type GuardLogLevel = "info" | "warning" | "error";

type GuardLogInput = {
  level?: GuardLogLevel;
  source?: string;
  route?: string | null;
  message: string;
  details?: Record<string, unknown> | null;
};

type HealthCheckInput = {
  service: string;
  status: "healthy" | "warning" | "critical" | "unknown";
  latencyMs?: number | null;
  details?: Record<string, unknown> | null;
};

type GuardActionInput = {
  actionType: string;
  target?: string | null;
  status?: "pending" | "done" | "failed";
  details?: Record<string, unknown> | null;
};

let cachedAdmin: SupabaseClient | null = null;

function getSupabaseAdmin(): SupabaseClient | null {
  if (cachedAdmin) {
    return cachedAdmin;
  }

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.warn(
      "[Aurora Guardião] Supabase não configurado para logs do sistema."
    );
    return null;
  }

  cachedAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return cachedAdmin;
}

export async function logSystemEvent(input: GuardLogInput) {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return { ok: false, reason: "supabase_not_configured" as const };
    }

    const payload = {
      level: input.level ?? "info",
      source: input.source ?? "aurora-guard",
      route: input.route ?? null,
      message: input.message,
      details: input.details ?? null,
    };

    const { error } = await supabase.from("system_logs").insert(payload);

    if (error) {
      console.error("[Aurora Guardião] Erro ao salvar log:", error.message);
      return { ok: false, reason: error.message as string };
    }

    return { ok: true };
  } catch (error) {
    console.error("[Aurora Guardião] Falha inesperada ao salvar log:", error);
    return { ok: false, reason: "unexpected_error" as const };
  }
}

export async function saveHealthCheck(input: HealthCheckInput) {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return { ok: false, reason: "supabase_not_configured" as const };
    }

    const payload = {
      service: input.service,
      status: input.status,
      latency_ms: input.latencyMs ?? null,
      details: input.details ?? null,
      checked_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("system_health_checks")
      .insert(payload);

    if (error) {
      console.error(
        "[Aurora Guardião] Erro ao salvar health check:",
        error.message
      );
      return { ok: false, reason: error.message as string };
    }

    return { ok: true };
  } catch (error) {
    console.error(
      "[Aurora Guardião] Falha inesperada ao salvar health check:",
      error
    );
    return { ok: false, reason: "unexpected_error" as const };
  }
}

export async function saveSystemAction(input: GuardActionInput) {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return { ok: false, reason: "supabase_not_configured" as const };
    }

    const payload = {
      action_type: input.actionType,
      target: input.target ?? null,
      status: input.status ?? "pending",
      details: input.details ?? null,
    };

    const { error } = await supabase.from("system_actions").insert(payload);

    if (error) {
      console.error(
        "[Aurora Guardião] Erro ao salvar ação do sistema:",
        error.message
      );
      return { ok: false, reason: error.message as string };
    }

    return { ok: true };
  } catch (error) {
    console.error(
      "[Aurora Guardião] Falha inesperada ao salvar ação do sistema:",
      error
    );
    return { ok: false, reason: "unexpected_error" as const };
  }
}

export async function logRouteError(params: {
  route: string;
  message: string;
  details?: Record<string, unknown> | null;
}) {
  return logSystemEvent({
    level: "error",
    source: "route",
    route: params.route,
    message: params.message,
    details: params.details ?? null,
  });
}

export async function logRouteWarning(params: {
  route: string;
  message: string;
  details?: Record<string, unknown> | null;
}) {
  return logSystemEvent({
    level: "warning",
    source: "route",
    route: params.route,
    message: params.message,
    details: params.details ?? null,
  });
}

export async function logRouteInfo(params: {
  route: string;
  message: string;
  details?: Record<string, unknown> | null;
}) {
  return logSystemEvent({
    level: "info",
    source: "route",
    route: params.route,
    message: params.message,
    details: params.details ?? null,
  });
}