import { NextRequest, NextResponse } from "next/server";
import { searchVehicles } from "@/lib/locadora-search";

function normalizePositiveNumber(value: string | null, fallback = 1) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }
  return Math.floor(parsed);
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const brand = (searchParams.get("brand") || "").trim();
    const model = (searchParams.get("model") || "").trim();
    const city = (searchParams.get("city") || "").trim();
    const state = (searchParams.get("state") || "").trim().toUpperCase();
    const quantity = normalizePositiveNumber(searchParams.get("quantity"), 1);

    if (!brand && !model) {
      return NextResponse.json(
        {
          error: "Informe pelo menos marca ou modelo para buscar.",
        },
        { status: 400 }
      );
    }

    const result = await searchVehicles({
      brand: brand || undefined,
      model: model || undefined,
      city: city || undefined,
      state: state || undefined,
      quantity,
    });

    return NextResponse.json({
      success: true,
      stage: result.stage,
      total: result.vehicles.length,
      vehicles: result.vehicles,
    });
  } catch (error) {
    console.error("[locadora-search-api] erro:", error);

    return NextResponse.json(
      {
        error: "Erro interno ao buscar veículos.",
      },
      { status: 500 }
    );
  }
}