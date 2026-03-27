"use client";

export default function AgroTutorialPage() {
  const whatsappHref =
    "https://wa.me/5531997490074?text=Ol%C3%A1%2C%20quero%20saber%20mais%20sobre%20o%20m%C3%B3dulo%20Aurora%20AGRO%20e%20como%20anunciar%20ou%20usar%20a%20plataforma.";

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #04110a 0%, #081226 45%, #101828 100%)",
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
                background: "rgba(34,197,94,0.14)",
                border: "1px solid rgba(34,197,94,0.35)",
                color: "#bbf7d0",
                fontSize: 13,
                fontWeight: 700,
                marginBottom: 16,
              }}
            >
              Aurora AGRO • Tutorial
            </span>

            <h1
              style={{
                margin: "0 0 14px 0",
                fontSize: "clamp(30px, 5vw, 54px)",
                lineHeight: 1.04,
                fontWeight: 900,
              }}
            >
              Como funciona o módulo AGRO da Aurora
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
              Entenda como usar a plataforma, anunciar por categoria, encontrar
              oportunidades e gerar negócios com mais organização e presença
              digital.
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
                Tirar dúvidas no WhatsApp
              </a>

              <a href="/agro" style={secondaryButton}>
                Voltar ao AGRO
              </a>
            </div>
          </div>

          <div style={heroCard}>
            <div style={heroBadge}>Guia rápido</div>

            <h2
              style={{
                margin: "0 0 12px 0",
                fontSize: 26,
                fontWeight: 800,
              }}
            >
              Estrutura separada por categoria para facilitar conversão
            </h2>

            <p
              style={{
                margin: 0,
                color: "rgba(255,255,255,0.74)",
                lineHeight: 1.7,
              }}
            >
              O módulo AGRO foi organizado para atender compradores,
              fornecedores, insumos e serviços em áreas independentes, permitindo
              expansão comercial sem perder clareza na navegação.
            </p>

            <div style={statsGrid}>
              <div style={statCard}>
                <strong style={statNumber}>4 áreas</strong>
                <span style={statLabel}>já organizadas</span>
              </div>

              <div style={statCard}>
                <strong style={statNumber}>Contato rápido</strong>
                <span style={statLabel}>via WhatsApp</span>
              </div>

              <div style={statCard}>
                <strong style={statNumber}>Escalável</strong>
                <span style={statLabel}>por categoria</span>
              </div>

              <div style={statCard}>
                <strong style={statNumber}>Aurora</strong>
                <span style={statLabel}>visual premium</span>
              </div>
            </div>
          </div>
        </section>

        <section style={sectionStyle}>
          <div style={sectionHeader}>
            <h2 style={sectionTitle}>Passo a passo</h2>
            <p style={sectionText}>
              Fluxo simples para usar o AGRO com clareza.
            </p>
          </div>

          <div style={cardsGrid}>
            <article style={infoCard}>
              <div style={infoIcon}>1</div>
              <h3 style={infoTitle}>Escolha sua área</h3>
              <p style={infoText}>
                Acesse compradores, fornecedores, insumos ou serviços conforme
                sua necessidade comercial.
              </p>
            </article>

            <article style={infoCard}>
              <div style={infoIcon}>2</div>
              <h3 style={infoTitle}>Entre na categoria certa</h3>
              <p style={infoText}>
                Cada área foi criada para organizar melhor a demanda e facilitar
                a conexão com o público correto.
              </p>
            </article>

            <article style={infoCard}>
              <div style={infoIcon}>3</div>
              <h3 style={infoTitle}>Faça contato</h3>
              <p style={infoText}>
                Use o botão de WhatsApp para iniciar atendimento, apresentar sua
                necessidade ou divulgar sua operação.
              </p>
            </article>

            <article style={infoCard}>
              <div style={infoIcon}>4</div>
              <h3 style={infoTitle}>Expanda sua presença</h3>
              <p style={infoText}>
                O módulo está pronto para crescer com anúncios, filtros,
                subcategorias, cadastros e estrutura comercial mais robusta.
              </p>
            </article>
          </div>
        </section>

        <section style={sectionStyle}>
          <div style={sectionHeader}>
            <h2 style={sectionTitle}>Áreas disponíveis</h2>
            <p style={sectionText}>
              Base já ativa dentro do módulo AGRO.
            </p>
          </div>

          <div style={cardsGrid}>
            <article style={categoryCard}>
              <h3 style={categoryTitle}>Compradores</h3>
              <p style={categoryText}>
                Para quem busca produtos, soluções, parceiros e oportunidades de
                negócio no agro.
              </p>
            </article>

            <article style={categoryCard}>
              <h3 style={categoryTitle}>Fornecedores</h3>
              <p style={categoryText}>
                Para empresas, distribuidores e prestadores que querem anunciar
                e ganhar visibilidade.
              </p>
            </article>

            <article style={categoryCard}>
              <h3 style={categoryTitle}>Insumos</h3>
              <p style={categoryText}>
                Para organizar anúncios e buscas de sementes, fertilizantes,
                defensivos, peças e acessórios.
              </p>
            </article>

            <article style={categoryCard}>
              <h3 style={categoryTitle}>Serviços</h3>
              <p style={categoryText}>
                Para transporte, máquinas, manutenção, suporte técnico e
                consultoria especializada.
              </p>
            </article>
          </div>
        </section>

        <section style={sectionStyle}>
          <div style={sectionHeader}>
            <h2 style={sectionTitle}>Próxima evolução do módulo</h2>
            <p style={sectionText}>
              Estrutura já pronta para receber as próximas camadas.
            </p>
          </div>

          <div style={cardsGrid}>
            <article style={nextCard}>
              <h3 style={nextTitle}>Cadastro estruturado</h3>
              <p style={nextText}>
                Formulários para anúncio com nome, cidade, telefone, categoria,
                descrição e imagem.
              </p>
            </article>

            <article style={nextCard}>
              <h3 style={nextTitle}>Banco de dados</h3>
              <p style={nextText}>
                Integração com Supabase para salvar registros e permitir gestão
                real da operação.
              </p>
            </article>

            <article style={nextCard}>
              <h3 style={nextTitle}>Tutoriais por módulo</h3>
              <p style={nextText}>
                Páginas explicativas para AGRO, locadora, imóveis e Aurora IA
                como carro-chefe.
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
  color: "#052e16",
  background: "#86efac",
  border: "1px solid rgba(134,239,172,0.7)",
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
  background: "rgba(34,197,94,0.12)",
  border: "1px solid rgba(34,197,94,0.28)",
  color: "#bbf7d0",
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
  background: "rgba(34,197,94,0.14)",
  border: "1px solid rgba(34,197,94,0.28)",
  color: "#bbf7d0",
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
    "linear-gradient(180deg, rgba(134,239,172,0.09), rgba(255,255,255,0.03))",
  border: "1px solid rgba(134,239,172,0.16)",
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

const nextCard: React.CSSProperties = {
  padding: 20,
  borderRadius: 20,
  background:
    "linear-gradient(180deg, rgba(59,130,246,0.08), rgba(255,255,255,0.03))",
  border: "1px solid rgba(59,130,246,0.16)",
};

const nextTitle: React.CSSProperties = {
  margin: "0 0 8px 0",
  fontSize: 20,
  fontWeight: 800,
};

const nextText: React.CSSProperties = {
  margin: 0,
  color: "rgba(255,255,255,0.74)",
  lineHeight: 1.6,
};