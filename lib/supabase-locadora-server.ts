import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cachedClient: SupabaseClient | null = null;

function readEnv(name: string) {
  const value = process.env[name]?.trim();
  return value && value.length > 0 ? value : "";
}

function getSupabaseUrl() {
  return (
    readEnv("NEXT_PUBLIC_SUPABASE_URL") ||
    readEnv("SUPABASE_URL") ||
    ""
  );
}

function getSupabaseServiceRoleKey() {
  return readEnv("SUPABASE_SERVICE_ROLE_KEY");
}

function isValidHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function getLocadoraServerClient() {
  if (cachedClient) {
    return cachedClient;
  }

  const url = getSupabaseUrl();
  const serviceRoleKey = getSupabaseServiceRoleKey();

  if (!url || !serviceRoleKey) {
    console.error(
      "[locadora] Supabase não configurado. Verifique NEXT_PUBLIC_SUPABASE_URL/SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY."
    );
    return null;
  }

  if (!isValidHttpUrl(url)) {
    console.error("[locadora] SUPABASE_URL inválida.");
    return null;
  }

  cachedClient = createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: {
        "X-Client-Info": "aurora-locadora-server",
      },
    },
  });

  return cachedClient;
}

export function requireLocadoraServerClient() {
  const client = getLocadoraServerClient();

  if (!client) {
    throw new Error(
      "Supabase da locadora não configurado. Ajuste as variáveis de ambiente do projeto."
    );
  }

  return client;
}