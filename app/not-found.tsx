import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main style={pageStyle}>
      <section style={containerStyle}>
        {/* HERO */}
        <div style={heroStyle}>
          <div style={badgeStyle}>⚠️ Rota não encontrada</div>

          <h1 style={titleStyle}>
            Você chegou em uma área que está em atualização
          </h1>

          <p style={descriptionStyle}>
            A Aurora está evoluindo constantemente. Algumas rotas podem ser
            ajustadas durante melhorias. Mas você pode continuar agora mesmo
            pelos caminhos principais abaixo.
          </p>

          <div style={actionsStyle}>
            <Link href="/" style={primaryButtonStyle}>
              Ir para a Home
            </Link>

            <Link href="/chat" style={secondaryButtonStyle}>
              Abrir Chat da Aurora
            </Link>
          </div>
        </div>

        {/* CAMINHOS PRINCIPAIS */}
        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Escolha seu caminho na Aurora</h2>

          <div style={gridStyle}>
            <Card
              title="Locadora"
              text="Cadastre veículos, motoristas, clientes e feche negócios."
              href="/locadora"
            />

            <Card
              title="AGRO"
              text="Conecte compradores, fornecedores e oportunidades."
              href="/agro"
            />

            <Card
              title="Imóveis"
              text="Cadastre imóveis e gere negócios imobiliários."
              href="/imoveis"
            />

            <Card
              title="Explorar"
              text="Veja conteúdos, imagens e empresas na plataforma."
              href="/explorar"
            />

            <Card
              title="Planos"
              text="Conheça os planos e monetização da Aurora."
              href="/planos"
            />

            <Card
              title="App Builder"
              text="Crie sistemas, módulos e aplicações com IA."
              href="/app-builder"
            />
          </div>
        </section>

        {/* CTA FINAL */}
        <section style={ctaBoxStyle}>
          <h3 style={ctaTitleStyle}>Comece agora dentro da Aurora</h3>

          <p style={ctaTextStyle}>
            A melhor forma de aproveitar a plataforma é entrando por uma área
            principal e seguindo o fluxo. O sistema está em constante evolução.
          </p>

          <Link href="/" style={ctaButtonStyle}>
            Criar cadastro e começar
          </Link>
        </section>
      </section>
    </main>
  );
}

/* COMPONENTE CARD */
function Card({
  title,
  text,
  href,
}: {
  title: string;
  text: string;
  href: string;
}) {
  return (
    <Link href={href} style={cardLinkStyle}>
      <article style={cardStyle}>
        <h3 style={cardTitleStyle}>{title}</h3>
        <p style={cardTextStyle}>{text}</p>
        <span style={cardActionStyle}>Acessar</span>
      </article>
    </Link>
  );
}

/* ESTILOS */

const pageStyle = {
  minHeight: "100vh",
  background:
    "linear-gradient(180deg, #eef6ff 0%, #f8fbff 40%, #eef9f2 100%)",
  color: "#0f172a",
};

const containerStyle = {
  maxWidth: 1100,
  margin: "0 auto",
  padding: 20,
  display: "grid",
  gap: 24,
};

const heroStyle = {
  background: "#ffffff",
  borderRadius: 24,
  padding: 24,
  border: "1px solid #e5e7eb",
  boxShadow: "0 20px 60px rgba(0,0,0,0.05)",
  textAlign: "center" as const,
};

const badgeStyle = {
  display: "inline-block",
  padding: "6px 12px",
  borderRadius: 999,
  background: "#fff7ed",
  border: "1px solid #fed7aa",
  color: "#c2410c",
  fontWeight: 700,
  fontSize: 12,
};

const titleStyle = {
  fontSize: 32,
  fontWeight: 900,
  marginTop: 12,
};

const descriptionStyle = {
  marginTop: 12,
  color: "#475569",
  maxWidth: 700,
  marginLeft: "auto",
  marginRight: "auto",
};

const actionsStyle = {
  marginTop: 20,
  display: "flex",
  gap: 10,
  justifyContent: "center",
  flexWrap: "wrap" as const,
};

const primaryButtonStyle = {
  background: "#2563eb",
  color: "#fff",
  padding: "12px 16px",
  borderRadius: 12,
  textDecoration: "none",
  fontWeight: 700,
};

const secondaryButtonStyle = {
  background: "#fff",
  border: "1px solid #e5e7eb",
  padding: "12px 16px",
  borderRadius: 12,
  textDecoration: "none",
};

const sectionStyle = {
  background: "#ffffff",
  borderRadius: 24,
  padding: 24,
  border: "1px solid #e5e7eb",
};

const sectionTitleStyle = {
  fontSize: 20,
  fontWeight: 800,
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 16,
  marginTop: 16,
};

const cardLinkStyle = {
  textDecoration: "none",
  color: "inherit",
};

const cardStyle = {
  background: "#f8fafc",
  padding: 16,
  borderRadius: 16,
  border: "1px solid #e5e7eb",
};

const cardTitleStyle = {
  fontWeight: 800,
};

const cardTextStyle = {
  color: "#64748b",
  marginTop: 8,
};

const cardActionStyle = {
  marginTop: 10,
  display: "inline-block",
  color: "#2563eb",
  fontWeight: 700,
};

const ctaBoxStyle = {
  background: "#0f172a",
  color: "#fff",
  borderRadius: 24,
  padding: 24,
  textAlign: "center" as const,
};

const ctaTitleStyle = {
  fontSize: 20,
  fontWeight: 900,
};

const ctaTextStyle = {
  marginTop: 10,
  color: "#cbd5e1",
};

const ctaButtonStyle = {
  marginTop: 16,
  display: "inline-block",
  background: "#22c55e",
  color: "#04110a",
  padding: "12px 16px",
  borderRadius: 12,
  fontWeight: 800,
  textDecoration: "none",
};