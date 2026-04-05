"use client";

import Link from "next/link";
import type { CSSProperties } from "react";

export default function LocadoraCadastrosPage() {
  return (
    <main style={mainStyle}>
      <section style={containerStyle}>
        {/* HEADER */}
        <div style={headerStyle}>
          <div>
            <div style={logoStyle}>ricardoiaoficial.com</div>
            <h1 style={titleStyle}>
              Central de cadastros da locadora
            </h1>
          </div>

          <div style={badgeStyle}>🚗 Aurora Locadora</div>
        </div>

        <p style={textStyle}>
          Organize veículos, clientes, motoristas, parceiros e bancos em uma
          área clara, moderna e pronta para operação real dentro da Aurora.
        </p>

        {/* AÇÕES */}
        <div style={actionsStyle}>
          <Link href="/locadora" style={secondaryBtnStyle}>
            Voltar para locadora
          </Link>

          <Link href="/locadora/admin" style={secondaryBtnStyle}>
            Área protegida
          </Link>
        </div>

        {/* CARDS */}
        <div style={gridStyle}>
          <Card
            icon="🚘"
            title="Veículos"
            text="Cadastro e gestão do estoque da locadora."
            href="/locadora/cadastros/veiculos"
          />

          <Card
            icon="👤"
            title="Clientes"
            text="Cadastro completo de clientes e contato."
            href="/locadora/cadastros/clientes"
            highlight
          />

          <Card
            icon="🪪"
            title="Motoristas"
            text="Controle de condutores e documentação."
            href="/locadora/cadastros/motoristas"
          />

          <Card
            icon="🏦"
            title="Bancos"
            text="Integração com financiadoras."
            href="/bancos"
          />

          <Card
            icon="🤝"
            title="Parceiros"
            text="Origem de negócios e parcerias."
            href="/locadora/cadastros/parceiros"
          />
        </div>

        {/* AVISO */}
        <section style={warningBoxStyle}>
          Sistema em constante atualização. Pode haver momentos de instabilidade
          durante melhorias e evolução da plataforma.
        </section>
      </section>
    </main>
  );
}

/* COMPONENTE CARD */
function Card({
  icon,
  title,
  text,
  href,
  highlight,
}: {
  icon: string;
  title: string;
  text: string;
  href: string;
  highlight?: boolean;
}) {
  return (
    <Link href={href} style={cardLinkStyle}>
      <article style={highlight ? cardHighlightStyle : cardStyle}>
        <div style={iconStyle}>{icon}</div>
        <h2 style={cardTitleStyle}>{title}</h2>
        <p style={cardTextStyle}>{text}</p>
        <span style={cardActionStyle}>Abrir</span>
      </article>
    </Link>
  );
}

/* ESTILOS */
const mainStyle: CSSProperties = {
  minHeight: "100vh",
  background:
    "linear-gradient(180deg, #eef6ff 0%, #f7fbff 40%, #edf7f3 100%)",
  color: "#0f172a",
};

const containerStyle: CSSProperties = {
  maxWidth: 1200,
  margin: "0 auto",
  padding: 20,
  display: "grid",
  gap: 20,
};

const headerStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
};

const logoStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 900,
  color: "#2563eb",
};

const titleStyle: CSSProperties = {
  fontSize: 28,
  fontWeight: 900,
};

const badgeStyle: CSSProperties = {
  background: "#e0ecff",
  padding: "6px 12px",
  borderRadius: 999,
};

const textStyle: CSSProperties = {
  color: "#475569",
};

const actionsStyle: CSSProperties = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
};

const secondaryBtnStyle: CSSProperties = {
  background: "#fff",
  border: "1px solid #e5e7eb",
  padding: "10px 14px",
  borderRadius: 12,
  textDecoration: "none",
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: 16,
};

const cardLinkStyle: CSSProperties = {
  textDecoration: "none",
  color: "inherit",
};

const cardStyle: CSSProperties = {
  background: "#fff",
  padding: 20,
  borderRadius: 20,
  border: "1px solid #e5e7eb",
};

const cardHighlightStyle: CSSProperties = {
  ...cardStyle,
  border: "2px solid #22c55e",
};

const iconStyle: CSSProperties = {
  fontSize: 28,
};

const cardTitleStyle: CSSProperties = {
  fontWeight: 900,
};

const cardTextStyle: CSSProperties = {
  color: "#64748b",
};

const cardActionStyle: CSSProperties = {
  marginTop: 10,
  color: "#22c55e",
  fontWeight: 700,
};

const warningBoxStyle: CSSProperties = {
  padding: 16,
  borderRadius: 12,
  background: "#f1f5f9",
};