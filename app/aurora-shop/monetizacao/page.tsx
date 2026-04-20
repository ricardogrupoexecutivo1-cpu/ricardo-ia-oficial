export default function AuroraShopMonetizacaoPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(34, 211, 238, 0.16), transparent 24%), radial-gradient(circle at 85% 12%, rgba(14, 165, 233, 0.18), transparent 22%), radial-gradient(circle at 20% 100%, rgba(8, 47, 73, 0.3), transparent 18%), linear-gradient(180deg, #082032 0%, #0b2239 40%, #081c30 100%)",
        color: "#ffffff",
        fontFamily: "Arial, Helvetica, sans-serif",
        padding: "24px 14px 40px",
      }}
    >
      <div style={{ width: "min(1180px, 100%)", margin: "0 auto" }}>
        <section style={heroBox}>
          <div style={heroGrid}>
            <div>
              <p style={eyebrow}>Aurora Shop • Monetização</p>

              <h1 style={heroTitle}>
                CAMADA COMERCIAL ISOLADA PARA TRANSFORMAR TRÁFEGO EM RECEITA
              </h1>

              <p style={heroText}>
                Esta página nasce separada da vitrine principal para permitir
                crescimento seguro. Aqui organizamos checkout, afiliados,
                comissões, planos e vendas futuras sem mexer na home comercial
                que já está funcionando.
              </p>

              <div style={heroActions}>
                <a href="/aurora-shop" style={btnPrimary}>
                  Voltar ao Aurora Shop
                </a>
                <a href="/planos" style={btnGhost}>
                  Ver planos
                </a>
                <a href="/cadastro" style={btnGhost}>
                  Quero vender
                </a>
              </div>
            </div>

            <div style={statusCard}>
              <p style={miniKicker}>STATUS ATUAL</p>
              <div style={statusBadge}>ETAPA SEGURA</div>
              <p style={miniText}>
                Página isolada criada para preparar monetização sem encostar no
                fluxo principal já aberto.
              </p>

              <div style={quickList}>
                <div style={quickItem}>Checkout PIX será ligado depois</div>
                <div style={quickItem}>Afiliados serão rastreados depois</div>
                <div style={quickItem}>Comissões automáticas virão na próxima fase</div>
                <div style={quickItem}>Painel de ganhos entra em camada própria</div>
              </div>
            </div>
          </div>
        </section>

        <section style={section}>
          <div style={sectionHead}>
            <div>
              <p style={eyebrow}>BASE COMERCIAL</p>
              <h2 style={sectionTitle}>O QUE ESTA CAMADA JÁ ORGANIZA</h2>
            </div>
          </div>

          <div style={grid4}>
            <div style={card}>
              <div style={icon}>💳</div>
              <h3 style={cardTitle}>Checkout</h3>
              <p style={cardText}>
                Estrutura pronta para receber checkout real por PIX em etapa
                posterior, sem improviso.
              </p>
            </div>

            <div style={card}>
              <div style={icon}>🤝</div>
              <h3 style={cardTitle}>Afiliados</h3>
              <p style={cardText}>
                Base comercial organizada para links rastreáveis e expansão por
                indicação.
              </p>
            </div>

            <div style={card}>
              <div style={icon}>💰</div>
              <h3 style={cardTitle}>Comissões</h3>
              <p style={cardText}>
                Estrutura pensada para comissão automática sem bagunçar o fluxo
                principal.
              </p>
            </div>

            <div style={card}>
              <div style={icon}>📊</div>
              <h3 style={cardTitle}>Ganhos</h3>
              <p style={cardText}>
                Futuro painel de leitura simples para acompanhar vendas,
                parceiros e desempenho.
              </p>
            </div>
          </div>
        </section>

        <section style={section}>
          <div style={sectionHead}>
            <div>
              <p style={eyebrow}>PRIORIDADE CERTA</p>
              <h2 style={sectionTitle}>ORDEM SEGURA DE IMPLEMENTAÇÃO</h2>
            </div>
          </div>

          <div style={grid2}>
            <div style={panel}>
              <p style={miniKicker}>FASE 1</p>
              <h3 style={panelTitle}>Página de monetização isolada</h3>
              <p style={panelText}>
                Já criada agora para separar o comercial da vitrine.
              </p>
            </div>

            <div style={panel}>
              <p style={miniKicker}>FASE 2</p>
              <h3 style={panelTitle}>Botões reais de compra</h3>
              <p style={panelText}>
                Próximo passo seguro: trocar ações genéricas por links comerciais
                definidos.
              </p>
            </div>

            <div style={panel}>
              <p style={miniKicker}>FASE 3</p>
              <h3 style={panelTitle}>Checkout PIX</h3>
              <p style={panelText}>
                Integração posterior com cobrança real, preferencialmente em
                rota isolada.
              </p>
            </div>

            <div style={panel}>
              <p style={miniKicker}>FASE 4</p>
              <h3 style={panelTitle}>Afiliados e comissões</h3>
              <p style={panelText}>
                Rastreamento, links e painel entram depois, sem correr risco de
                quebrar a loja.
              </p>
            </div>
          </div>
        </section>

        <section style={section}>
          <div style={ctaBox}>
            <div>
              <p style={eyebrow}>PRÓXIMO PASSO CONTROLADO</p>
              <h2 style={sectionTitle}>LIGAR A ENTRADA DA VITRINE A ESTA CAMADA</h2>
              <p style={heroText}>
                Depois desta página pronta, o próximo ajuste seguro é colocar um
                botão dentro do Aurora Shop apontando para
                <strong> /aurora-shop/monetizacao</strong>.
              </p>
            </div>

            <div style={heroActions}>
              <a href="/aurora-shop" style={btnPrimary}>
                Voltar à vitrine
              </a>
              <a href="/aurora-shop/monetizacao" style={btnWhite}>
                Atualizar esta etapa
              </a>
            </div>
          </div>
        </section>

        <section style={footerNote}>
          Sistema em constante atualização. Algumas funcionalidades podem
          evoluir conforme melhorias.
        </section>
      </div>
    </main>
  );
}

const heroBox = {
  borderRadius: 24,
  padding: 20,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.06)",
  backdropFilter: "blur(16px)",
  boxShadow: "0 18px 40px rgba(0,0,0,0.18)",
};

const heroGrid = {
  display: "grid",
  gridTemplateColumns: "1.2fr 0.8fr",
  gap: 16,
};

const eyebrow = {
  margin: 0,
  fontSize: 11,
  letterSpacing: "0.22em",
  textTransform: "uppercase" as const,
  fontWeight: 900,
  color: "#9be7ff",
};

const heroTitle = {
  margin: "10px 0 0 0",
  fontSize: "clamp(28px, 4vw, 48px)",
  lineHeight: 0.95,
  fontWeight: 900,
  letterSpacing: "-0.04em",
};

const heroText = {
  margin: "12px 0 0 0",
  fontSize: 14,
  lineHeight: 1.6,
  color: "rgba(236, 246, 255, 0.88)",
  maxWidth: 760,
};

const heroActions = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap" as const,
  marginTop: 18,
};

const btnPrimary = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 42,
  padding: "0 16px",
  borderRadius: 999,
  textDecoration: "none",
  background: "linear-gradient(135deg, #67e8f9 0%, #22d3ee 45%, #0ea5e9 100%)",
  color: "#082032",
  fontWeight: 900,
  fontSize: 12,
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
};

const btnGhost = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 42,
  padding: "0 16px",
  borderRadius: 999,
  textDecoration: "none",
  border: "1px solid rgba(34, 211, 238, 0.30)",
  background: "rgba(34, 211, 238, 0.08)",
  color: "#effcff",
  fontWeight: 900,
  fontSize: 12,
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
};

const btnWhite = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 42,
  padding: "0 16px",
  borderRadius: 999,
  textDecoration: "none",
  background: "#ffffff",
  color: "#082032",
  fontWeight: 900,
  fontSize: 12,
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
};

const statusCard = {
  borderRadius: 18,
  padding: 16,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.05)",
};

const miniKicker = {
  margin: 0,
  fontSize: 10,
  fontWeight: 900,
  letterSpacing: "0.16em",
  textTransform: "uppercase" as const,
  color: "#dcc8ff",
};

const statusBadge = {
  display: "inline-flex",
  marginTop: 10,
  padding: "5px 10px",
  borderRadius: 999,
  background: "rgba(16,185,129,0.14)",
  color: "#d4ffec",
  fontSize: 10,
  fontWeight: 900,
  textTransform: "uppercase" as const,
  letterSpacing: "0.12em",
};

const miniText = {
  margin: "10px 0 0 0",
  fontSize: 13,
  lineHeight: 1.5,
  color: "rgba(235,244,252,0.84)",
};

const quickList = {
  display: "grid",
  gap: 8,
  marginTop: 14,
};

const quickItem = {
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(0,0,0,0.18)",
  padding: "9px 10px",
  fontSize: 11,
  fontWeight: 900,
  color: "#f3fbff",
  textTransform: "uppercase" as const,
};

const section = {
  marginTop: 16,
};

const sectionHead = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "end",
  gap: 8,
  flexWrap: "wrap" as const,
  marginBottom: 8,
};

const sectionTitle = {
  margin: "4px 0 0 0",
  fontSize: "clamp(18px, 2vw, 26px)",
  lineHeight: 1.02,
  fontWeight: 900,
  letterSpacing: "-0.03em",
  textTransform: "uppercase" as const,
};

const grid4 = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 12,
};

const grid2 = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: 12,
};

const card = {
  borderRadius: 18,
  padding: 16,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.055)",
  backdropFilter: "blur(16px)",
};

const icon = {
  width: 40,
  height: 40,
  borderRadius: 12,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 20,
  marginBottom: 10,
  border: "1px solid rgba(34,211,238,0.24)",
  background: "rgba(34,211,238,0.11)",
};

const cardTitle = {
  margin: 0,
  fontSize: 16,
  fontWeight: 900,
  textTransform: "uppercase" as const,
};

const cardText = {
  margin: "8px 0 0 0",
  fontSize: 13,
  lineHeight: 1.55,
  color: "rgba(235,244,252,0.84)",
  textTransform: "uppercase" as const,
};

const panel = {
  borderRadius: 16,
  padding: 16,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.05)",
};

const panelTitle = {
  margin: "8px 0 0 0",
  fontSize: 16,
  fontWeight: 900,
  textTransform: "uppercase" as const,
};

const panelText = {
  margin: "8px 0 0 0",
  fontSize: 13,
  lineHeight: 1.55,
  color: "rgba(235,244,252,0.84)",
  textTransform: "uppercase" as const,
};

const ctaBox = {
  borderRadius: 22,
  padding: 18,
  border: "1px solid rgba(255,255,255,0.10)",
  background:
    "linear-gradient(180deg, rgba(16,185,129,0.10), rgba(255,255,255,0.02)), rgba(255,255,255,0.05)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 14,
  flexWrap: "wrap" as const,
};

const footerNote = {
  textAlign: "center" as const,
  padding: "18px 8px 4px",
  fontSize: 11,
  color: "rgba(255,255,255,0.72)",
};