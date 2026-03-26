import { cookies } from "next/headers";
import { createHash, timingSafeEqual } from "crypto";

export const LOCADORA_ADMIN_COOKIE = "locadora_admin_session";

function readEnv(name: string) {
  const value = process.env[name]?.trim();
  return value && value.length > 0 ? value : "";
}

function getExpectedPassword() {
  return readEnv("LOCADORA_ADMIN_PASSWORD");
}

function getSessionSecret() {
  return (
    readEnv("LOCADORA_ADMIN_SESSION_SECRET") ||
    readEnv("SUPABASE_SERVICE_ROLE_KEY") ||
    "aurora-locadora-dev-secret"
  );
}

function hashValue(value: string) {
  return createHash("sha256")
    .update(`${getSessionSecret()}::${value}`)
    .digest("hex");
}

function safeCompare(a: string, b: string) {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);

  if (aBuffer.length !== bBuffer.length) {
    return false;
  }

  return timingSafeEqual(aBuffer, bBuffer);
}

export function isLocadoraAdminPasswordValid(password: string) {
  const expected = getExpectedPassword();

  if (!expected || !password) {
    return false;
  }

  return safeCompare(hashValue(password), hashValue(expected));
}

export function createLocadoraAdminSessionValue() {
  const expected = getExpectedPassword();

  if (!expected) {
    throw new Error(
      "LOCADORA_ADMIN_PASSWORD não configurada nas variáveis de ambiente."
    );
  }

  return hashValue(expected);
}

export async function isLocadoraAdminAuthenticated() {
  const cookieStore = await cookies();
  const session = cookieStore.get(LOCADORA_ADMIN_COOKIE)?.value || "";
  const expected = getExpectedPassword();

  if (!expected || !session) {
    return false;
  }

  const expectedSession = hashValue(expected);

  return safeCompare(session, expectedSession);
}