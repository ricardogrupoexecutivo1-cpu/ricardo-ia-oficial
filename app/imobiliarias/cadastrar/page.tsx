"use client";

import Link from "next/link";

export default function CadastroImobiliariasPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(16,185,129,0.14), transparent 24%), linear-gradient(180deg, #07111f 0%, #08101a 35%, #05080f 100%)",
        color: "#f8fafc",
        padding: "32px 18px 80px",
      }}
    >
      <div
        style={{
          maxWidth: 980,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            marginBottom: 18,
          }}
        >
          <Link href="/" style={navStyle("#93c5fd")}>
            Voltar à Home
          </Link>

          <Link href="/imobiliarias" style={navStyle("#c4b5fd")}>
            Ir para Imobiliárias
          </Link>

          <Link href="/cadastro" style={navStyle("#facc15")}>
            Ir para o Cadastro Geral
          </Link>
        </div>

        <section
          style={{
            borderRadius: 28,
            padding: 28,
            background: "rgba(8,15,28,0.88)",
            border: "1px solid rgba(148,163,184,0.16)",
            boxShadow: "0 25px 70px rgba(0,0,0,0.25)",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 14px",
              borderRadius: 999,
              background: "rgba(34,197,94,0.12)",
              border: "1px solid rgba(34,197,94,0.26)",
              color: "#bbf7d0",
              fontWeight: 800,
              fontSize: 13,
              marginBottom: 16,
            }}
          >
            🏡 CADASTRO IMOBILIÁRIAS • AURORA
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "clamp(2rem, 5vw, 3.3rem)",
              lineHeight: 1.05,
              fontWeight: 900,
            }}
          >
            Cadastro de imobiliárias integrado ao cadastro geral
          </h1>

          <p
            style={{
              marginTop: 18,
              color: "#cbd5e1",
              fontSize: 17,
              lineHeight: 1.8,
              maxWidth: 820,
            }}
          >
            A Aurora está sendo estruturada com um cadastro principal único.
            Isso evita retrabalho, fluxos duplicados e perda de dados.
            Imobiliárias, corretores, parceiros e outros segmentos entram pela
            base central e depois o sistema usa essas informações conforme a
            área necessária.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 14,
              marginTop: 24,
            }}
          >
            <div style={infoCard}>
              <div style={infoTitle}>Base única</div>
              <div style={infoText}>
                O cadastro principal fica centralizado para toda a plataforma.
              </div>
            </div>

            <div style={infoCard}>
              <div style={infoTitle}>Sem duplicidade</div>
              <div style={infoText}>
                O segmento imobiliário não precisa criar uma base paralela agora.
              </div>
            </div>

            <div style={infoCard}>
              <div style={infoTitle}>Expansão segura</div>
              <div style={infoText}>
                Depois a Aurora puxa os dados para imóveis, leads e operação comercial.
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: 26,
              padding: 18,
              borderRadius: 18,
              background: "rgba(59,130,246,0.10)",
              border: "1px solid rgba(59,130,246,0.22)",
            }}
          >
            <div
              style={{
                fontSize: 15,
                fontWeight: 800,
                color: "#bfdbfe",
                marginBottom: 8,
              }}
            >
              Como funciona agora
            </div>

            <div
              style={{
                color: "#dbeafe",
                lineHeight: 1.75,
                fontSize: 14,
              }}
            >
              1. A empresa entra pelo cadastro geral. <br />
              2. O cadastro fica salvo na base principal da Aurora. <br />
              3. Depois o sistema usa esses dados no segmento de imóveis quando necessário.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 14,
              marginTop: 26,
            }}
          >
            <Link href="/cadastro" style={primaryButton}>
              🚀 IR PARA O CADASTRO GERAL
            </Link>

            <Link href="/imobiliarias" style={secondaryButton}>
              Voltar para Imobiliárias
            </Link>
          </div>

          <div
            style={{
              marginTop: 22,
              fontSize: 14,
              color: "#86efac",
              fontWeight: 700,
            }}
          >
            🔒 Sistema em constante atualização. Podem ocorrer instabilidades durante ajustes de integração.
          </div>
        </section>
      </div>
    </main>
  );
}

function navStyle(color: string): React.CSSProperties {
  return {
    color,
    textDecoration: "none",
    border: `1px solid ${color}33`,
    borderRadius: 999,
    padding: "10px 14px",
    fontWeight: 700,
    background: "rgba(15,23,42,0.45)",
  };
}

const infoCard: React.CSSProperties = {
  borderRadius: 18,
  padding: 18,
  background: "rgba(15,23,42,0.72)",
  border: "1px solid rgba(148,163,184,0.14)",
};

const infoTitle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 800,
  marginBottom: 8,
  color: "#f8fafc",
};

const infoText: React.CSSProperties = {
  fontSize: 14,
  lineHeight: 1.7,
  color: "#cbd5e1",
};

const primaryButton: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 54,
  padding: "0 22px",
  borderRadius: 16,
  background: "linear-gradient(135deg, #22c55e 0%, #14b8a6 100%)",
  color: "#03130d",
  textDecoration: "none",
  fontWeight: 900,
  border: "none",
};

const secondaryButton: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 54,
  padding: "0 22px",
  borderRadius: 16,
  background: "rgba(15,23,42,0.72)",
  color: "#f8fafc",
  textDecoration: "none",
  fontWeight: 900,
  border: "1px solid rgba(148,163,184,0.18)",
};