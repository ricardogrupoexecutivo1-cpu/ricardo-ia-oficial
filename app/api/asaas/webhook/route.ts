import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log("Webhook recebido:", body);

    const event = body.event;
    const payment = body.payment;

    // 👉 só processa quando pagamento for confirmado
    if (event !== "PAYMENT_CONFIRMED") {
      return NextResponse.json({ ok: true });
    }

    const email = payment.customerEmail;
    const value = Number(payment.value);

    if (!email) {
      console.error("Email não encontrado no webhook");
      return NextResponse.json({ ok: false });
    }

    // 👉 definir plano baseado no valor
    let plan = "free";

    if (value >= 29.9) {
      plan = "total";
    } else if (value >= 9.9) {
      plan = "pro";
    }

    console.log("Atualizando plano:", email, plan);

    // 👉 atualizar usuário
    await supabase
      .from("profiles")
      .update({
        plan,
      })
      .eq("email", email);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erro webhook:", error);

    return NextResponse.json(
      { error: "Erro no webhook" },
      { status: 500 }
    );
  }
}