"use client";

import Link from "next/link";

export default function GanhePage() {
  return (
    <main
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: "40px 20px",
        fontFamily: "system-ui",
      }}
    >
      <h1 style={{ fontSize: "34px", fontWeight: 800, color: "#111827" }}>
        Ganhe divulgando a Aurora IA
      </h1>

      <p
        style={{
          marginTop: 10,
          lineHeight: 1.6,
          color: "#374151",
        }}
      >
        Indique a Aurora IA para outras pessoas e ganhe comissão por cada
        assinatura realizada através do seu link.
      </p>

      <div
        style={{
          marginTop: 30,
          padding: 24,
          borderRadius: 16,
          border: "1px solid #e5e7eb",
          background: "#ffffff",
          boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
        }}
      >
        <h2
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: "#111827",
          }}
        >
          Comissões
        </h2>

        <ul
          style={{
            marginTop: 20,
            lineHeight: "30px",
            color: "#111827",
            paddingLeft: 18,
          }}
        >
          <li>💰 Plano PRO → R$ 10 por venda</li>
          <li>💰 Plano Influencer → R$ 3 por venda</li>
        </ul>

        <p
          style={{
            marginTop: 20,
            color: "#374151",
            lineHeight: 1.6,
          }}
        >
          Compartilhe seu link e acompanhe o crescimento da Aurora IA.
        </p>

        <Link
          href="/chat"
          style={{
            display: "block",
            marginTop: 20,
            textAlign: "center",
            padding: "14px 16px",
            borderRadius: 12,
            background: "#111827",
            color: "#fff",
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          Começar agora
        </Link>
      </div>
    </main>
  );
}
