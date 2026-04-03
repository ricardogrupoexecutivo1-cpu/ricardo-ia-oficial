"use client";

import Link from "next/link";
import type { CSSProperties } from "react";

export default function LocadoraSeminovosPage() {
  return (
    <main style={mainStyle}>
      <section style={containerStyle}>
        <header style={headerStyle}>
          <Link href="/locadora" style={navBtnStyle}>
            ← Voltar para Locadora
          </Link>

          <div style={badgeStyle}>🚗 Seminovos Aurora</div>
        </header>

        <section style={heroStyle}>
          <div style={chipStyle}>Aurora Locadora</div>

          <h1 style={titleStyle}>
            Seminovos de locadoras com alta visibilidade e conversão
          </h1>

          <p style={textStyle}>
            Publique veículos seminovos com acesso direto, integração com
            WhatsApp e navegação dentro do ecossistema Aurora para aumentar
            tráfego, contato e fechamento comercial.
          </p>

          <div style={pillWrapStyle}>
            <div style={pillStyle}>Venda direta</div>
            <div style={pillStyle}>WhatsApp integrado</div>
            <div style={pillStyle}>Link compartilhável</div>
            <div style={pillStyle}>Tráfego interno</div>
          </div>
        </section>

        <section style={actionsStyle}>
          <a
            href="https://wa.me/5531997490074"
            target="_blank"
            rel="noreferrer"
            style={primaryBtnStyle}
          >
            📲 Falar com comercial
          </a>

          <Link href="/anunciar/cadastro" style={secondaryBtnStyle}>
            ✍️ Publicar seminovo
          </Link>

          <Link href="/locadora/cadastros" style={secondaryBtnStyle}>
            Central de cadastros
          </Link>
        </section>

        <section style={gridStyle}>
          <Card title="Toyota Hilux 2023" meta="Diesel • Automática • BH" />
          <Card title="Corolla 2022" meta="Flex • Automático • SP" />
          <Card title="Fiat Strada 2023" meta="Manual • MG" />
        </section>

        <section style={strategyStyle}>
          <div style={strategyTitleStyle}>Estratégia</div>
          <div style={strategyTextStyle}>
            Os seminovos devem gerar entrada direta e ao mesmo tempo manter o
            usuário navegando dentro da Aurora, aumentando retenção e descoberta
            de novos negócios.
          </div>
        </section>
      </section>
    </main>
  );
}

function Card({
  title,
  meta,
}: {
  title: string;
  meta: string;
}) {
  return (
    <div style={cardStyle}>
      <div style={imageStyle}>Veículo</div>
      <div style={bodyStyle}>
        <div style={cardTitleStyle}>{title}</div>
        <div style={cardMetaStyle}>{meta}</div>
        <div style={priceStyle}>R$ 000.000</div>

        <a
          href="https://wa.me/5531997490074"
          target="_blank"
          rel="noreferrer"
          style={whatsStyle}
        >
          Tenho interesse
        </a>
      </div>
    </div>
  );
}

const mainStyle: CSSProperties = {
  minHeight: "100vh",
  background:
    "radial-gradient(circle at top, rgba(59,130,246,0.10), transparent 18%), radial-gradient(circle at right, rgba(16,185,129,0.10), transparent 24%), linear-gradient(180deg, #eef6ff 0%, #f7fbff 40%, #edf7f3 100%)",
  color: "#0f172a",
  overflow: "hidden",
};

const containerStyle: CSSProperties = {
  maxWidth: 1200,
  margin: "0 auto",
  padding: "18px 16px 72px",
  display: "grid",
  gap: 20,
};

const headerStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
  flexWrap: "wrap",
};

const navBtnStyle: CSSProperties = {
  padding: "10px 14px",
  borderRadius: 999,
  background: "rgba(255,255,255,0.78)",
  border: "1px solid rgba(15,23,42,0.08)",
  textDecoration: "none",
  color: "#0f172a",
  fontWeight: 800,
  boxShadow: "0 8px 16px rgba(15,23,42,0.04)",
};

const badgeStyle: CSSProperties = {
  background: "rgba(37,99,235,0.08)",
  color: "#2563eb",
  padding: "8px 12px",
  borderRadius: 999,
  fontWeight: 800,
  border: "1px solid rgba(37,99,235,0.16)",
};

const heroStyle: CSSProperties = {
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.88), rgba(255,255,255,0.74))",
  padding: 24,
  borderRadius: 24,
  border: "1px solid rgba(15,23,42,0.08)",
  boxShadow: "0 22px 70px rgba(15,23,42,0.09)",
  display: "grid",
  gap: 16,
};

const chipStyle: CSSProperties = {
  background: "rgba(37,99,235,0.08)",
  padding: "8px 12px",
  borderRadius: 999,
  color: "#2563eb",
  fontWeight: 800,
  width: "fit-content",
  border: "1px solid rgba(37,99,235,0.16)",
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: "clamp(32px, 6vw, 52px)",
  fontWeight: 900,
  lineHeight: 1.02,
  letterSpacing: "-0.04em",
  color: "#0f172a",
};

const textStyle: CSSProperties = {
  margin: 0,
  color: "rgba(15,23,42,0.72)",
  lineHeight: 1.7,
  fontSize: 16,
  fontWeight: 700,
  maxWidth: 880,
};

const pillWrapStyle: CSSProperties = {
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
};

const pillStyle: CSSProperties = {
  background: "rgba(255,255,255,0.86)",
  padding: "8px 12px",
  borderRadius: 999,
  border: "1px solid rgba(15,23,42,0.08)",
  color: "#0f172a",
  fontWeight: 700,
  boxShadow: "0 8px 16px rgba(15,23,42,0.04)",
};

const actionsStyle: CSSProperties = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
};

const primaryBtnStyle: CSSProperties = {
  background: "linear-gradient(135deg, #2563eb, #3b82f6)",
  color: "#fff",
  padding: "12px 16px",
  borderRadius: 12,
  textDecoration: "none",
  fontWeight: 900,
  border: "1px solid rgba(37,99,235,0.16)",
  boxShadow: "0 14px 30px rgba(37,99,235,0.16)",
};

const secondaryBtnStyle: CSSProperties = {
  background: "rgba(255,255,255,0.78)",
  border: "1px solid rgba(15,23,42,0.08)",
  padding: "12px 16px",
  borderRadius: 12,
  textDecoration: "none",
  color: "#0f172a",
  fontWeight: 800,
  boxShadow: "0 10px 22px rgba(15,23,42,0.05)",
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: 16,
};

const cardStyle: CSSProperties = {
  background: "rgba(255,255,255,0.82)",
  borderRadius: 20,
  border: "1px solid rgba(15,23,42,0.08)",
  overflow: "hidden",
  boxShadow: "0 18px 42px rgba(15,23,42,0.06)",
};

const imageStyle: CSSProperties = {
  height: 150,
  background: "linear-gradient(135deg, #dbeafe, #dcfce7)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#0f172a",
  fontWeight: 900,
  fontSize: 22,
};

const bodyStyle: CSSProperties = {
  padding: 16,
  display: "grid",
  gap: 8,
};

const cardTitleStyle: CSSProperties = {
  fontWeight: 900,
  fontSize: 18,
  color: "#0f172a",
};

const cardMetaStyle: CSSProperties = {
  color: "#64748b",
  fontWeight: 700,
};

const priceStyle: CSSProperties = {
  fontWeight: 900,
  fontSize: 20,
  color: "#0f172a",
};

const whatsStyle: CSSProperties = {
  marginTop: 10,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#22c55e",
  color: "#fff",
  padding: "10px 12px",
  borderRadius: 10,
  textDecoration: "none",
  fontWeight: 800,
  width: "fit-content",
};

const strategyStyle: CSSProperties = {
  background: "rgba(255,255,255,0.82)",
  padding: 20,
  borderRadius: 20,
  border: "1px solid rgba(15,23,42,0.08)",
  boxShadow: "0 18px 42px rgba(15,23,42,0.06)",
};

const strategyTitleStyle: CSSProperties = {
  fontWeight: 900,
  fontSize: 18,
  color: "#0f172a",
  marginBottom: 8,
};

const strategyTextStyle: CSSProperties = {
  color: "#475569",
  lineHeight: 1.7,
  fontWeight: 700,
};