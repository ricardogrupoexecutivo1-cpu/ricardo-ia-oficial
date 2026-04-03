"use client";

import Link from "next/link";

export default function LocadoraSeminovosPage() {
  return (
    <main style={mainStyle}>
      <section style={container}>
        {/* HEADER */}
        <header style={header}>
          <Link href="/locadora" style={navBtn}>
            ← Voltar para Locadora
          </Link>

          <div style={badge}>
            🚗 Seminovos Aurora
          </div>
        </header>

        {/* HERO */}
        <section style={hero}>
          <div style={chip}>Aurora Locadora</div>

          <h1 style={title}>
            Seminovos de locadoras com alta visibilidade e conversão
          </h1>

          <p style={text}>
            Publique veículos seminovos com acesso direto, integração com WhatsApp
            e navegação dentro do ecossistema Aurora para aumentar tráfego,
            contato e fechamento comercial.
          </p>

          <div style={pillWrap}>
            <div style={pill}>Venda direta</div>
            <div style={pill}>WhatsApp integrado</div>
            <div style={pill}>Link compartilhável</div>
            <div style={pill}>Tráfego interno</div>
          </div>
        </section>

        {/* AÇÕES */}
        <section style={actions}>
          <a
            href="https://wa.me/5531997490074"
            target="_blank"
            style={primaryBtn}
          >
            📲 Falar com comercial
          </a>

          <Link href="/anunciar/cadastro" style={secondaryBtn}>
            ✍️ Publicar seminovo
          </Link>

          <Link href="/locadora/cadastros" style={secondaryBtn}>
            Central de cadastros
          </Link>
        </section>

        {/* LISTA */}
        <section style={grid}>
          <Card
            title="Toyota Hilux 2023"
            meta="Diesel • Automática • BH"
          />
          <Card
            title="Corolla 2022"
            meta="Flex • Automático • SP"
          />
          <Card
            title="Fiat Strada 2023"
            meta="Manual • MG"
          />
        </section>

        {/* ESTRATÉGIA */}
        <section style={strategy}>
          <div style={strategyTitle}>Estratégia</div>
          <div style={strategyText}>
            Os seminovos devem gerar entrada direta e ao mesmo tempo manter o
            usuário navegando dentro da Aurora, aumentando retenção e descoberta
            de novos negócios.
          </div>
        </section>
      </section>
    </main>
  );
}

/* COMPONENTE */
function Card({ title, meta }: any) {
  return (
    <div style={card}>
      <div style={image}>Veículo</div>
      <div style={body}>
        <div style={cardTitle}>{title}</div>
        <div style={cardMeta}>{meta}</div>
        <div style={price}>R$ 000.000</div>

        <a
          href="https://wa.me/5531997490074"
          target="_blank"
          style={whats}
        >
          Tenho interesse
        </a>
      </div>
    </div>
  );
}

/* ESTILOS */
const mainStyle = {
  minHeight: "100vh",
  background:
    "linear-gradient(180deg, #eef6ff 0%, #f7fbff 40%, #edf7f3 100%)",
  color: "#0f172a",
};

const container = {
  maxWidth: 1200,
  margin: "0 auto",
  padding: 20,
  display: "grid",
  gap: 20,
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const navBtn = {
  padding: "10px 14px",
  borderRadius: 999,
  background: "#fff",
  border: "1px solid #e5e7eb",
  textDecoration: "none",
};

const badge = {
  background: "#e0ecff",
  color: "#2563eb",
  padding: "6px 12px",
  borderRadius: 999,
  fontWeight: 800,
};

const hero = {
  background: "#fff",
  padding: 20,
  borderRadius: 20,
  border: "1px solid #e5e7eb",
};

const chip = {
  background: "#e0ecff",
  padding: "6px 10px",
  borderRadius: 999,
  color: "#2563eb",
};

const title = {
  fontSize: 28,
  fontWeight: 900,
};

const text = {
  color: "#475569",
};

const pillWrap = {
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
};

const pill = {
  background: "#f1f5f9",
  padding: "6px 10px",
  borderRadius: 999,
};

const actions = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
};

const primaryBtn = {
  background: "#2563eb",
  color: "#fff",
  padding: "12px 16px",
  borderRadius: 12,
};

const secondaryBtn = {
  background: "#fff",
  border: "1px solid #e5e7eb",
  padding: "12px 16px",
  borderRadius: 12,
};

const grid = {
  display: "grid",
  gap: 16,
};

const card = {
  background: "#fff",
  borderRadius: 20,
  border: "1px solid #e5e7eb",
};

const image = {
  height: 150,
  background: "#e2e8f0",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const body = {
  padding: 16,
};

const cardTitle = {
  fontWeight: 900,
};

const cardMeta = {
  color: "#64748b",
};

const price = {
  fontWeight: 900,
  fontSize: 20,
};

const whats = {
  marginTop: 10,
  display: "inline-block",
  background: "#22c55e",
  color: "#fff",
  padding: "8px 12px",
  borderRadius: 10,
};

const strategy = {
  background: "#fff",
  padding: 20,
  borderRadius: 20,
  border: "1px solid #e5e7eb",
};

const strategyTitle = {
  fontWeight: 900,
};

const strategyText = {
  color: "#475569",
};