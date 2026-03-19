import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function addDays(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log("Webhook recebido:", JSON.stringify(body));

    if (body.event === "PAYMENT_RECEIVED") {
      const payment = body.payment;

      const email =
        payment?.customer?.email ||
        payment?.billingCustomerEmail ||
        null;

      const value = Number(payment?.value || 0);

      if (!email) {
        console.log("Email não encontrado no pagamento");
        return NextResponse.json({ ok: false });
      }

      // 🔥 definição de plano por valor
      let plan = "free";

      if (value >= 79) {
        plan = "total";
      } else if (value >= 9.9) {
        plan = "pro";
      }

      const now = new Date().toISOString();
      const expires = addDays(30); // 🔥 recorrência mensal

      console.log("Atualizando plano:", email, plan);

      const { error } = await supabase
        .from("profiles")
        .update({
          plan,
          plan_status: "active",
          last_payment_at: now,
          plan_expires_at: expires,
          updated_at: now,
        })
        .eq("email", email);

      if (error) {
        console.log("Erro ao atualizar plano:", error);
      } else {
        console.log("Plano atualizado com sucesso:", email);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.log("Erro webhook:", err);
    return NextResponse.json({ error: "erro" }, { status: 500 });
  }
}