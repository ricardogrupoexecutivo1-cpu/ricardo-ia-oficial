import { NextRequest, NextResponse } from "next/server";

type CheckoutBody = {
  email?: string;
  plan?: string;
  name?: string;
};

function getPublicCheckoutUrl(plan: string) {
  const normalized = String(plan || "").trim().toLowerCase();

  if (normalized === "pro") {
    return (
      process.env.NEXT_PUBLIC_CHECKOUT_PRO_URL?.trim() ||
      "https://www.asaas.com/paymentCampaign/show/3605974"
    );
  }

  if (normalized === "premium") {
    return process.env.NEXT_PUBLIC_CHECKOUT_PREMIUM_URL?.trim() || "";
  }

  return "";
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CheckoutBody;
    const plan = String(body.plan || "").trim().toLowerCase();

    if (!plan) {
      return NextResponse.json(
        { error: "Plano não informado." },
        { status: 400 }
      );
    }

    const checkoutUrl = getPublicCheckoutUrl(plan);

    if (!checkoutUrl) {
      return NextResponse.json(
        {
          error:
            plan === "premium"
              ? "O link do plano PREMIUM ainda não foi configurado."
              : "Link de checkout não configurado.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      ok: true,
      checkoutUrl,
      mode: "public-link",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Erro interno ao gerar pagamento.",
        details: error instanceof Error ? error.message : "Erro desconhecido.",
      },
      { status: 500 }
    );
  }
}