"use client";

export default function AgroServicosPage() {
  const whatsappHref =
    "https://wa.me/5531997490074?text=Ol%C3%A1%2C%20quero%20anunciar%20ou%20contratar%20servi%C3%A7os%20no%20m%C3%B3dulo%20Aurora%20AGRO.";

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #081226 0%, #0b172a 40%, #2a1808 100%)",
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
                background: "rgba(251,191,36,0.14)",
                border: "1px solid rgba(251,191,36,0.35)",
                color: "#fde68a",
                fontSize: 13,
                fontWeight: 700,
                marginBottom: 16,
              }}
            >
              Aurora AGRO • Serviços
            </span>

            <h1
              style={{
                margin: "0 0 14px 0",
                fontSize: "clamp(30px, 5vw, 54px)",
                lineHeight: 1.04,
                fontWeight: 900,
              }}
            >
              Serviços do agro com foco em contato rápido e geração de negócio
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
              Estrutura para reunir transporte, máquinas, manutenção,
              consultoria, assistência técnica e outros serviços essenciais do
              campo em uma área comercial organizada.
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
                Chamar no WhatsApp
              </a>

              <a href="/agro" style={secondaryButton}>
                Voltar ao AGRO
              </a>
            </div>
          </div>

          <div style={heroCard}>
            <div style={heroBadge}>Serviços organizados</div>

            <h2
              style={{
                margin: "0 0 12px 0",
                fontSize: 26,
                fontWeight: 800,
              }}
            >
              Área pronta para conectar demanda e operação
            </h2>

            <p
              style={{
                margin: 0,
                color: "rgba(255,255,255,0.74)",
                lineHeight: 1.7,
              }}
            >
              O módulo foi pensado para facilitar a exposição de serviços e a
              contratação com mais clareza, presença digital e velocidade no
              atendimento.
            </p>

            <div style={statsGrid}>
              <div style={statCard}>
                <strong style={statNumber}>Operação</strong>
                <span style={statLabel}>mais organizada</span>
              </div>

              <div style={statCard}>
                <strong style={statNumber}>Contato</strong>
                <span style={statLabel}>direto e rápido</span>
              </div>

              <div style={statCard}>
                <strong style={statNumber}>Categorias</strong>
                <span style={statLabel}>fácil navegação</span>
              </div>

              <div style={statCard}>
                <strong style={statNumber}>Escala</strong>
                <span style={statLabel}>pronto para crescer</span>
              </div>
            </div>
          </div>
        </section>

        <section style={sectionStyle}>
          <div style={sectionHeader}>
            <h2 style={sectionTitle}>Como funciona</h2>
            <p style={sectionText}>
              Estrutura simples para quem quer anunciar ou contratar.
            </p>
          </div>

          <div style={cardsGrid}>
            <article style={infoCard}>
              <div style={infoIcon}>1</div>
              <h3 style={infoTitle}>Escolha o tipo de serviço</h3>
              <p style={infoText}>
                Identifique a demanda ou a oferta dentro da categoria correta
                para facilitar a conexão.
              </p>
            </article>

            <article style={infoCard}>
              <div style={infoIcon}>2</div>
              <h3 style={infoTitle}>Apresente a operação</h3>
              <p style={infoText}>
                Mostre região de atendimento, capacidade, especialidade e forma
                de contato.
              </p>
            </article>

            <article style={infoCard}>
              <div style={infoIcon}>3</div>
              <h3 style={infoTitle}>Avance na negociação</h3>
              <p style={infoText}>
                Use o contato rápido para gerar orçamento, fechamento e expansão
                comercial.
              </p>
            </article>
          </div>
        </section>

        <section style={sectionStyle}>
          <div style={sectionHeader}>
            <h2 style={sectionTitle}>Serviços iniciais</h2>
            <p style={sectionText}>
              Base inicial pronta para ampliação por subcategorias.
            </p>
          </div>

          <div style={cardsGrid}>
            <article style={categoryCard}>
              <h3 style={categoryTitle}>Transporte e logística</h3>
              <p style={categoryText}>
                Frete, deslocamento, apoio logístico e atendimento regional.
              </p>
            </article>

            <article style={categoryCard}>
              <h3 style={categoryTitle}>Máquinas e manutenção</h3>
              <p style={categoryText}>
                Operação de equipamentos, suporte técnico, reparos e assistência.
              </p>
            </article>

            <article style={categoryCard}>
              <h3 style={categoryTitle}>Consultoria e suporte</h3>
              <p style={categoryText}>
                Apoio especializado para decisões, planejamento e execução no
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
  color: "#3b2200",
  background: "#fcd34d",
  border: "1px solid rgba(252,211,77,0.7)",
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
  background: "rgba(251,191,36,0.12)",
  border: "1px solid rgba(251,191,36,0.28)",
  color: "#fde68a",
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
  background: "rgba(251,191,36,0.14)",
  border: "1px solid rgba(251,191,36,0.28)",
  color: "#fde68a",
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
    "linear-gradient(180deg, rgba(252,211,77,0.09), rgba(255,255,255,0.03))",
  border: "1px solid rgba(252,211,77,0.16)",
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