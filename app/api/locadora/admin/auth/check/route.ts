import { NextResponse } from "next/server";
import { isLocadoraAdminAuthenticated } from "@/lib/locadora-admin-auth";

export async function GET() {
  try {
    const authenticated = await isLocadoraAdminAuthenticated();

    return NextResponse.json({
      authenticated,
    });
  } catch (error) {
    console.error("Erro ao verificar autenticação do admin:", error);

    return NextResponse.json(
      { authenticated: false },
      { status: 500 }
    );
  }
}