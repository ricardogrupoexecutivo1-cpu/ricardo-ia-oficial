"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Props = {
  plan: "pro" | "premium";
};

export default function CheckoutClient({ plan }: Props) {
  const [email, setEmail] = useState("");

  const planData = useMemo(() => {
    if (plan === "pro") {
      return {
        name: "PRO",
        price: "R$ 9,90/mês",
        url:
          process.env.NEXT_PUBLIC_CHECKOUT_PRO_URL ||
          "https://www.asaas.com/paymentCampaign/show/3605974",
      };
    }

    return {
      name: "PREMIUM",
      price: "R$ 29,90/mês",
      url:
        process.env.NEXT_PUBLIC_CHECKOUT_PREMIUM_URL ||
        "https://www.asaas.com/c/nw6ccxaqx9dck48z",
    };
  }, [plan]);

  function handleCheckout() {
    if (!email.trim()) {
      alert("Digite seu e-mail");
      return;
    }

    window.open(planData.url, "_blank");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(circle at top, rgba(0,208,132,0.15), transparent 40%), #020617",
        color: "#fff",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          borderRadius: "24px",
          padding: "28px",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(0,208,132,0.2)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
        }}
      >
        <h1 style={{ fontSize: "1.8rem", marginBottom: "10px" }}>
          Finalizar assinatura
        </h1>

        <p style={{ opacity: 0.7 }}>
          Plano: <strong>{planData.name}</strong>
        </p>

        <p style={{ color: "#00d084", marginBottom: "20px" }}>
          {planData.price}
        </p>

        <input
          type="email"
          placeholder="Seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.05)",
            color: "#fff",
            marginBottom: "16px",
          }}
        />

        <button
          onClick={handleCheckout}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "12px",
            border: "none",
            fontWeight: "bold",
            cursor: "pointer",
            background: "linear-gradient(135deg, #00d084, #75ffbf)",
            color: "#000",
          }}
        >
          Ir para pagamento
        </button>

        <div style={{ marginTop: "16px", display: "flex", gap: "10px" }}>
          <Link href="/planos" style={{ color: "#00d084" }}>
            Planos
          </Link>

          <Link href="/chat" style={{ color: "#aaa" }}>
            Chat
          </Link>
        </div>
      </div>
    </main>
  );
}