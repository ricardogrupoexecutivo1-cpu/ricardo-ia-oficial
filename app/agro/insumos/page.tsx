"use client";

export default function AgroInsumosPage() {
  const whatsappHref =
    "https://wa.me/5531997490074?text=Ol%C3%A1%2C%20quero%20anunciar%20ou%20buscar%20insumos%20no%20m%C3%B3dulo%20Aurora%20AGRO.";

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #06110a 0%, #0d1b12 42%, #081226 100%)",
        color: "#ffffff",
        padding: "24px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 24,
            alignItems: "center",
            marginBottom: 28,
          }}
        >
          <div>
            <span
              style={{
                display: "inline-flex",
                padding: "8px 14px",
                borderRadius: 999,
                background: "rgba(163,230,53,0.14)",
                border: "1px solid rgba(163,230,53,0.35)",
                color: "#d9f99d",
                fontSize: 13,
                fontWeight: 700,
                marginBottom: 16,
              }}
            >
              Aurora AGRO • Insumos
            </span>

            <h1
              style={{
                margin: "0 0 14px 0",
                fontSize: "clamp(30px, 5vw, 54px)",
                lineHeight: 1.04,
                fontWeight: 900,
              }}
            >
              Insumos organizados para compra, oferta e expansão comercial
            </h1>

            <p
              style={{
                margin: 0,
                color: "rgba(255,255,255,0.78)",
                fontSize: 18,
                lineHeight: 1.65,
                maxWidth: 760,
              }}
            >
              Estrutura para reunir sementes, fertilizantes, defensivos,
              acessórios, peças e demais insumos do agro em uma área clara,
              profissional e pronta para crescer.
            </p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
                marginTop: 24,
              }}
            >
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                style={primaryButton}
              >
                Falar no WhatsApp
              </a>

              <a href="/agro" style={secondaryButton}>
                Voltar ao AGRO
              </a>
            </div>
          </div>

          <div style={heroCard}>
            <div style={heroBadge}>Catálogo escalável</div>

            <h2
              style={{
                margin: "0 0 12px 0",
                fontSize: 26,
                fontWeight: 800,
              }}
            >
              Base pronta para catálogo, busca e geração de leads
            </h2>

            <p
              style={{
                margin: 0,
                color: "rgba(255,255,255,0.74)",
                lineHeight: 1.7,
              }}
            >
              Esta área do AGRO foi pensada para receber anúncios e demandas de
              insumos com organização por categoria, visão comercial e contato
              rápido.
            </p>

            <div style={statsGrid}>
              <div style={statCard}>
                <strong style={statNumber}>Catálogo</strong>
                <span style={statLabel}>por categorias</span>
              </div>

              <div style={statCard}>
                <strong style={statNumber}>Contato</strong>
                <span style={statLabel}>WhatsApp direto</span>
              </div>

              <div style={statCard}>
                <strong style={statNumber}>Expansão</strong>
                <span style={statLabel}>mais linhas de produto</span>
              </div>

              <div style={statCard}>
                <strong style={statNumber}>Aurora</strong>
                <span style={statLabel}>padrão premium</span>
              </div>
            </div>
          </div>
        </section>

        <section style={sectionStyle}>
          <div style={sectionHeader}>
            <h2 style={sectionTitle}>Como funciona</h2>
            <p style={sectionText}>
              Fluxo simples para conectar oferta e procura de insumos.
            </p>
          </div>

          <div style={cardsGrid}>
            <article style={infoCard}>
              <div style={infoIcon}>1</div>
              <h3 style={infoTitle}>Publique ou busque</h3>
              <p style={infoText}>
                O fornecedor pode anunciar e o comprador pode localizar o item
                com mais rapidez.
              </p>
            </article>

            <article style={infoCard}>
              <div style={infoIcon}>2</div>
              <h3 style={infoTitle}>Organize por segmento</h3>
              <p style={infoText}>
                Separe os insumos por categoria para melhorar navegação,
                entendimento e conversão.
              </p>
            </article>

            <article style={infoCard}>
              <div style={infoIcon}>3</div>
              <h3 style={infoTitle}>Feche no contato direto</h3>
              <p style={infoText}>
                Use o atendimento rápido para acelerar negociação, orçamento e
                relacionamento comercial.
              </p>
            </article>
          </div>
        </section>

        <section style={sectionStyle}>
          <div style={sectionHeader}>
            <h2 style={sectionTitle}>Linhas iniciais de insumos</h2>
            <p style={sectionText}>
              Estrutura pronta para crescer com mais categorias depois.
            </p>
          </div>

          <div style={cardsGrid}>
            <article style={categoryCard}>
              <h3 style={categoryTitle}>Sementes e fertilizantes</h3>
              <p style={categoryText}>
                Itens essenciais para plantio, nutrição e desempenho produtivo.
              </p>
            </article>

            <article style={categoryCard}>
              <h3 style={categoryTitle}>Defensivos e proteção</h3>
              <p style={categoryText}>
                Soluções para manejo, proteção da produção e apoio técnico.
              </p>
            </article>

            <article style={categoryCard}>
              <h3 style={categoryTitle}>Peças e acessórios</h3>
              <p style={categoryText}>
                Componentes, complementos e materiais de apoio para operação no
                campo.
              </p>
            </article>
          </div>
        </section>

        <section
          style={{
            marginTop: 26,
            padding: 18,
            borderRadius: 18,
            border: "1px solid rgba(255,255,255,0.10)",
            background: "rgba(255,255,255,0.05)",
            color: "rgba(255,255,255,0.72)",
            lineHeight: 1.6,
          }}
        >
          Sistema em constante atualização e expansão. Podem ocorrer momentos de
          instabilidade durante melhorias, ajustes e novos lançamentos.
        </section>
      </div>
    </main>
  );
}

const primaryButton: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 48,
  padding: "0 18px",
  borderRadius: 14,
  textDecoration: "none",
  fontWeight: 800,
  color: "#1a2e05",
  background: "#bef264",
  border: "1px solid rgba(190,242,100,0.7)",
};

const secondaryButton: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 48,
  padding: "0 18px",
  borderRadius: 14,
  textDecoration: "none",
  fontWeight: 700,
  color: "#ffffff",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.12)",
};

const heroCard: React.CSSProperties = {
  padding: 24,
  borderRadius: 24,
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04))",
  border: "1px solid rgba(255,255,255,0.10)",
  boxShadow: "0 18px 40px rgba(0,0,0,0.22)",
};

const heroBadge: React.CSSProperties = {
  display: "inline-flex",
  marginBottom: 14,
  padding: "8px 12px",
  borderRadius: 999,
  background: "rgba(163,230,53,0.12)",
  border: "1px solid rgba(163,230,53,0.28)",
  color: "#d9f99d",
  fontSize: 12,
  fontWeight: 700,
};

const statsGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 12,
  marginTop: 20,
};

const statCard: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
  padding: 14,
  borderRadius: 16,
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.08)",
};

const statNumber: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 800,
};

const statLabel: React.CSSProperties = {
  color: "rgba(255,255,255,0.68)",
  fontSize: 13,
};

const sectionStyle: React.CSSProperties = {
  marginTop: 22,
  padding: 22,
  borderRadius: 24,
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
};

const sectionHeader: React.CSSProperties = {
  marginBottom: 18,
};

const sectionTitle: React.CSSProperties = {
  margin: "0 0 8px 0",
  fontSize: 28,
  fontWeight: 800,
};

const sectionText: React.CSSProperties = {
  margin: 0,
  color: "rgba(255,255,255,0.72)",
  lineHeight: 1.6,
};

const cardsGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: 16,
};

const infoCard: React.CSSProperties = {
  padding: 20,
  borderRadius: 20,
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.08)",
};

const infoIcon: React.CSSProperties = {
  width: 42,
  height: 42,
  borderRadius: 12,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 12,
  background: "rgba(163,230,53,0.14)",
  border: "1px solid rgba(163,230,53,0.28)",
  color: "#d9f99d",
  fontWeight: 800,
};

const infoTitle: React.CSSProperties = {
  margin: "0 0 8px 0",
  fontSize: 20,
  fontWeight: 800,
};

const infoText: React.CSSProperties = {
  margin: 0,
  color: "rgba(255,255,255,0.72)",
  lineHeight: 1.6,
};

const categoryCard: React.CSSProperties = {
  padding: 20,
  borderRadius: 20,
  background:
    "linear-gradient(180deg, rgba(190,242,100,0.09), rgba(255,255,255,0.03))",
  border: "1px solid rgba(190,242,100,0.16)",
};

const categoryTitle: React.CSSProperties = {
  margin: "0 0 8px 0",
  fontSize: 20,
  fontWeight: 800,
};

const categoryText: React.CSSProperties = {
  margin: 0,
  color: "rgba(255,255,255,0.74)",
  lineHeight: 1.6,
};