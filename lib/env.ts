type EnvValue = string | undefined;

function readRequired(name: string): string {
  const value: EnvValue = process.env[name];

  if (!value || !value.trim()) {
    throw new Error(`Variável de ambiente obrigatória ausente: ${name}`);
  }

  return value.trim();
}

function readOptional(name: string): string | null {
  const value: EnvValue = process.env[name];

  if (!value || !value.trim()) {
    return null;
  }

  return value.trim();
}

function firstAvailableRequired(names: string[]): string {
  for (const name of names) {
    const value = process.env[name];
    if (value && value.trim()) {
      return value.trim();
    }
  }

  throw new Error(
    `Nenhuma das variáveis obrigatórias foi encontrada: ${names.join(", ")}`
  );
}

function firstAvailableOptional(names: string[]): string | null {
  for (const name of names) {
    const value = process.env[name];
    if (value && value.trim()) {
      return value.trim();
    }
  }

  return null;
}

export const env = {
  appUrl: firstAvailableOptional(["NEXT_PUBLIC_APP_URL", "NEXT_PUBLIC_SITE_URL"]),
  siteUrl: firstAvailableOptional(["NEXT_PUBLIC_SITE_URL", "NEXT_PUBLIC_APP_URL"]),

  supabaseUrl: firstAvailableRequired([
    "SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_URL",
  ]),

  supabaseAnonKey: firstAvailableRequired([
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  ]),

  supabaseServiceRoleKey: firstAvailableOptional([
    "SUPABASE_SERVICE_ROLE_KEY",
  ]),

  openAiApiKey: firstAvailableOptional([
    "OPENAI_API_KEY",
  ]),
};

export function hasServiceRole() {
  return Boolean(env.supabaseServiceRoleKey);
}

export function hasOpenAi() {
  return Boolean(env.openAiApiKey);
}