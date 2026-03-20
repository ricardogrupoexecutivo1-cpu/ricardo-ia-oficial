import { NextRequest, NextResponse } from "next/server";
import {
  isLocadoraAdminPasswordValid,
  LOCADORA_ADMIN_COOKIE,
} from "@/lib/locadora-admin-auth";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { password?: string };
    const password = (body.password || "").trim();

    if (!password) {
      return NextResponse.json(
        { error: "Informe a senha do admin." },
        { status: 400 }
      );
    }

    if (!isLocadoraAdminPasswordValid(password)) {
      return NextResponse.json(
        { error: "Senha inválida." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ success: true });

    response.cookies.set({
      name: LOCADORA_ADMIN_COOKIE,
      value: password,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 12,
    });

    return response;
  } catch (error) {
    console.error("Erro no login do admin da locadora:", error);

    return NextResponse.json(
      { error: "Erro interno no login." },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });

  response.cookies.set({
    name: LOCADORA_ADMIN_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return response;
}