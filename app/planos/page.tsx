"use client";

import Link from "next/link";

export default function PlanosPage() {
  function abrirPagamento() {
    window.open("https://www.asaas.com/c/ayfhkldtnk1osf37", "_blank");
  }

  return (
    <main
      style={{
        maxWidth: 800,
        margin: "0 auto",
        padding: "40px 20px",
        fontFamily: "system-ui",
      }}
    >
      <h1
        style={{
          fontSize: "34px",
          fontWeight: 800,
          color: "#111827",
        }}
      >
        Planos Aurora IA
      </h1>

      <p
        style={{
          marginTop: "12px",
          color: "#374151",
          lineHeight: 1.6,
        }}
      >
        Escolha o plano inicial da Aurora IA e tenha acesso completo à
        plataforma.
      </p>

      <div
        style={{
          marginTop: "20px",
          padding: "14px 16px",
          borderRadius: "14px",
          border: "1px solid #fde68a",
          background: "#fef9c3",
          color: "#92400e",
          fontWeight: 600,
          lineHeight: 1.6,
        }}
      >
        🚀 Aurora IA está em fase de evolução. Novas funções e melhorias estão
        sendo lançadas constantemente.
      </div>

      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: "18px",
          padding: "32px",
          marginTop: "30px",
          background: "#ffffff",
          boxShadow: "0 12px 30px rgba(0,0,0,0.06)",
        }}
      >
        <div
          style={{
            display: "inline-block",
            padding: "6px 12px",
            borderRadius: "8px",
            background: "#facc15",
            color: "#111827",
            fontWeight: 700,
            fontSize: "13px",
            marginBottom: "10px",
          }}
        >
          PRIMEIROS USUÁRIOS
        </div>

        <h2
          style={{
            fontSize: "28px",
            fontWeight: 800,
            color: "#111827",
          }}
        >
          Founders Aurora
        </h2>

        <p
          style={{
            fontSize: "28px",
            marginTop: "10px",
            fontWeight: 800,
            color: "#111827",
          }}
        >
          R$ 29,90 / mês
        </p>

        <p
          style={{
            marginTop: "10px",
            color: "#374151",
            lineHeight: 1.6,
          }}
        >
          Preço garantido por até <strong>24 meses</strong> para os primeiros
          usuários da Aurora IA.
        </p>

        <div
          style={{
            marginTop: "16px",
            padding: "12px 14px",
            borderRadius: "12px",
            background: "#ecfdf5",
            border: "1px solid #86efac",
            color: "#166534",
            fontWeight: 700,
            lineHeight: 1.5,
          }}
        >
          Oferta especial para primeiros usuários com acesso antecipado às novas
          funções da plataforma.
        </div>

        <ul
          style={{
            marginTop: "22px",
            lineHeight: "30px",
            color: "#111827",
            fontWeight: 500,
            paddingLeft: "18px",
          }}
        >
          <li>✔ acesso à Aurora IA</li>
          <li>✔ chat inteligente com memória</li>
          <li>✔ geração de imagens com IA</li>
          <li>✔ criação de campanhas de marketing</li>
          <li>✔ suporte na fase inicial</li>
          <li>✔ uso de chat, imagens e marketing no mesmo lugar</li>
        </ul>

        <button
          onClick={abrirPagamento}
          style={{
            marginTop: "30px",
            width: "100%",
            padding: "16px",
            fontSize: "18px",
            fontWeight: 800,
            borderRadius: "12px",
            border: "none",
            background: "linear-gradient(135deg,#facc15,#f59e0b)",
            color: "#111827",
            cursor: "pointer",
            boxShadow: "0 10px 30px rgba(250,204,21,0.35)",
          }}
        >
          Assinar Plano Founders
        </button>

        <Link
          href="/chat"
          style={{
            display: "block",
            width: "100%",
            marginTop: "14px",
            padding: "14px",
            textAlign: "center",
            textDecoration: "none",
            borderRadius: "12px",
            background: "#111827",
            color: "#ffffff",
            fontWeight: 700,
          }}
        >
          Testar Aurora grátis
        </Link>

        <p
          style={{
            marginTop: "18px",
            fontSize: "14px",
            color: "#6b7280",
            lineHeight: 1.6,
          }}
        >
          Pagamento seguro via Asaas. Pix • Cartão • Boleto • Assinatura mensal.
        </p>
      </div>

      <div
        style={{
          marginTop: "40px",
          textAlign: "center",
          fontSize: "13px",
          color: "#6b7280",
          lineHeight: 1.6,
        }}
      >
        Você está utilizando uma plataforma de inteligência artificial em
        evolução. Algumas funcionalidades podem mudar ou melhorar rapidamente
        durante esta fase.
      </div>
    </main>
  );
}
