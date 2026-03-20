import { cookies } from "next/headers";

export const LOCADORA_ADMIN_COOKIE = "locadora_admin_session";

function getExpectedPassword() {
  return process.env.LOCADORA_ADMIN_PASSWORD || "";
}

export function isLocadoraAdminPasswordValid(password: string) {
  const expected = getExpectedPassword();

  if (!expected) {
    return false;
  }

  return password === expected;
}

export async function isLocadoraAdminAuthenticated() {
  const cookieStore = await cookies();
  const session = cookieStore.get(LOCADORA_ADMIN_COOKIE)?.value || "";
  const expected = getExpectedPassword();

  if (!expected) {
    return false;
  }

  return session === expected;
}