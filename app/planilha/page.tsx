"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function PlanilhaPage() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 900);
    }

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #0b1020 0%, #121a33 42%, #f5f7fb 42%, #f5f7fb 100%)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <section
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: isMobile ? "20px 14px 26px" : "30px 16px 30px",
          color: "#fff",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: isMobile ? "flex-start" : "center",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: 24,
          }}
        >
          <div>
            <div style={{ fontSize: isMobile ? 24 : 28, fontWeight: 800 }}>
              Planilha Gratuita Aurora IA
            </div>
            <div style={{ marginTop: 8, color: "rgba(255,255,255,0.82)" }}>
              Contas a pagar e contas a receber sem custo.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              width: isMobile ? "100%" : "auto",
            }}
          >
            <Link href="/" style={topButtonLight}>
              Home
            </Link>

            <Link href="/chat" style={topButtonDark}>
              Abrir Chat
            </Link>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1.15fr 0.85fr",
            gap: 16,
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 22,
              padding: isMobile ? 18 : 26,
              backdropFilter: "blur(8px)",
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "8px 12px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.12)",
                fontSize: 13,
                marginBottom: 16,
              }}
            >
              Benefício gratuito
            </div>

            <h1
              style={{
                margin: "0 0 14px 0",
                fontSize: isMobile ? 30 : 42,
                lineHeight: 1.08,
              }}
            >
              Crie sua planilha gratuitamente na Aurora IA.
            </h1>

            <p
              style={{
                margin: 0,
                fontSize: isMobile ? 16 : 18,
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.88)",
                maxWidth: 760,
              }}
            >
              Organize suas contas a pagar e contas a receber de forma simples,
              rápida e gratuita. Depois, evolua para relatórios e automações com IA.
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                gap: 12,
                flexWrap: "wrap",
                marginTop: 24,
              }}
            >
              <a href="#payables" style={primaryButton}>
                Contas a pagar
              </a>

              <a href="#receivables" style={secondaryButtonLight}>
                Contas a receber
              </a>
            </div>

            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                marginTop: 18,
                color: "rgba(255,255,255,0.82)",
                fontSize: 14,
              }}
            >
              <span>✔ Gratuito</span>
              <span>✔ Simples</span>
              <span>✔ Mobile</span>
              <span>✔ Pronto para crescer</span>
            </div>
          </div>

          <div
            style={{
              background: "#ffffff",
              border: "1px solid #dbe2ee",
              borderRadius: 20,
              padding: isMobile ? 18 : 24,
              boxShadow: "0 10px 30px rgba(0,0,0,0.10)",
              color: "#111827",
            }}
          >
            <div
              style={{
                fontSize: 14,
                color: "#475569",
                marginBottom: 10,
                fontWeight: 700,
              }}
            >
              Ideal para autônomos e empresas
            </div>

            <div
              style={{
                fontSize: isMobile ? 28 : 32,
                fontWeight: 800,
                marginBottom: 10,
                color: "#0f172a",
              }}
            >
              Controle financeiro simples
            </div>

            <div
              style={{
                fontSize: isMobile ? 16 : 17,
                lineHeight: 1.7,
                color: "#1e293b",
                fontWeight: 600,
              }}
            >
              Comece grátis agora e depois use a Aurora IA para gerar relatórios,
              organizar cobranças e automatizar seu crescimento.
            </div>

            <div
              style={{
                marginTop: 16,
                padding: 14,
                borderRadius: 14,
                background: "#f8fafc",
                lineHeight: 1.8,
                color: "#0f172a",
                fontSize: isMobile ? 15 : 16,
                border: "1px solid #e2e8f0",
              }}
            >
              ✅ contas a pagar
              <br />
              ✅ contas a receber
              <br />
              ✅ estrutura gratuita
              <br />
              ✅ expansão futura com IA
            </div>

            <Link href="/chat" style={openAuroraButton}>
              Abrir Aurora agora
            </Link>
          </div>
        </div>
      </section>

      <section
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: isMobile ? "18px 14px 40px" : "24px 16px 50px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: 16,
          }}
        >
          <div id="payables" style={whiteCard}>
            <h2 style={sectionTitle}>Contas a pagar</h2>
            <p style={sectionText}>
              Registre despesas, vencimentos, fornecedores e acompanhe o que sua
              operação precisa pagar com clareza.
            </p>

            <div style={featureBox}>
              ✔ lançamentos simples
              <br />
              ✔ organização por data
              <br />
              ✔ visão prática
              <br />
              ✔ gratuito
            </div>
          </div>

          <div id="receivables" style={whiteCard}>
            <h2 style={sectionTitle}>Contas a receber</h2>
            <p style={sectionText}>
              Controle entradas, clientes, previsões e acompanhe valores a receber
              em uma estrutura simples e útil.
            </p>

            <div style={featureBox}>
              ✔ controle de recebimentos
              <br />
              ✔ visão por cliente
              <br />
              ✔ organização fácil
              <br />
              ✔ gratuito
            </div>
          </div>
        </div>

        <div style={{ ...whiteCard, marginTop: 18 }}>
          <h2 style={sectionTitle}>Próxima evolução</h2>
          <p style={sectionText}>
            Depois da planilha gratuita, a Aurora IA poderá ajudar com relatórios,
            análise financeira, cobranças e insights automáticos para o seu negócio.
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: 12,
              flexWrap: "wrap",
              marginTop: 18,
            }}
          >
            <Link href="/planos" style={primaryDarkButton}>
              Ver planos
            </Link>

            <Link href="/chat" style={secondarySoftButton}>
              Falar com a Aurora
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

const topButtonLight: React.CSSProperties = {
  textAlign: "center",
  padding: "10px 16px",
  borderRadius: 10,
  textDecoration: "none",
  background: "#fff",
  color: "#111",
  fontWeight: 700,
};

const topButtonDark: React.CSSProperties = {
  textAlign: "center",
  padding: "10px 16px",
  borderRadius: 10,
  textDecoration: "none",
  border: "1px solid rgba(255,255,255,0.35)",
  color: "#fff",
  fontWeight: 700,
};

const primaryButton: React.CSSProperties = {
  textAlign: "center",
  padding: "14px 20px",
  borderRadius: 12,
  textDecoration: "none",
  background: "#7c5cff",
  color: "#fff",
  fontWeight: 700,
};

const secondaryButtonLight: React.CSSProperties = {
  textAlign: "center",
  padding: "14px 20px",
  borderRadius: 12,
  textDecoration: "none",
  background: "#fff",
  color: "#111",
  fontWeight: 700,
};

const openAuroraButton: React.CSSProperties = {
  marginTop: 18,
  display: "block",
  textAlign: "center",
  padding: "14px 20px",
  borderRadius: 12,
  textDecoration: "none",
  background: "#00d084",
  color: "#04130c",
  fontWeight: 800,
};

const whiteCard: React.CSSProperties = {
  background: "#fff",
  borderRadius: 18,
  padding: 22,
  border: "1px solid #e8edf5",
  boxShadow: "0 6px 20px rgba(10,18,35,0.05)",
};

const sectionTitle: React.CSSProperties = {
  margin: "0 0 12px 0",
  fontSize: 28,
  color: "#111",
};

const sectionText: React.CSSProperties = {
  margin: 0,
  color: "#444",
  lineHeight: 1.7,
  fontSize: 16,
};

const featureBox: React.CSSProperties = {
  marginTop: 16,
  padding: 14,
  borderRadius: 14,
  background: "#f8fafc",
  lineHeight: 1.8,
  color: "#0f172a",
  fontSize: 16,
  border: "1px solid #e2e8f0",
};

const primaryDarkButton: React.CSSProperties = {
  textAlign: "center",
  padding: "12px 18px",
  borderRadius: 10,
  textDecoration: "none",
  background: "#7c5cff",
  color: "#fff",
  fontWeight: 700,
};

const secondarySoftButton: React.CSSProperties = {
  textAlign: "center",
  padding: "12px 18px",
  borderRadius: 10,
  textDecoration: "none",
  background: "#f3f5fa",
  color: "#111",
  fontWeight: 700,
  border: "1px solid #dbe2ee",
};