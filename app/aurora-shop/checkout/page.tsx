export default function AuroraShopCheckoutPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(34, 211, 238, 0.16), transparent 24%), radial-gradient(circle at 85% 12%, rgba(14, 165, 233, 0.18), transparent 22%), radial-gradient(circle at 20% 100%, rgba(8, 47, 73, 0.30), transparent 18%), linear-gradient(180deg, #082032 0%, #0b2239 40%, #081c30 100%)",
        color: "#ffffff",
        fontFamily: "Arial, Helvetica, sans-serif",
        padding: "24px 14px 40px",
      }}
    >
      <div style={{ width: "min(1100px, 100%)", margin: "0 auto" }}>
        <section style={heroBox}>
          <p style={eyebrow}>Aurora Shop • Checkout</p>

          <h1 style={heroTitle}>
            CHECKOUT COMERCIAL ISOLADO PRONTO PARA RECEBER PIX REAL
          </h1>

          <p style={heroText}>
            Esta página foi criada em camada separada para preparar a venda com
            segurança. Primeiro organizamos apresentação, oferta e fluxo visual.
            Depois ligamos o checkout real com PIX sem bagunçar a vitrine.
          </p>

          <div style={heroActions}>
            <a href="/aurora-shop" style={btnPrimary}>
              Voltar ao Aurora Shop
            </a>
            <a href="/aurora-shop/monetizacao" style={btnOutline}>
              Monetização
            </a>
          </div>
        </section>

        <section style={sectionGrid}>
          <div style={cardLarge}>
            <p style={eyebrow}>Oferta principal</p>
            <h2 style={sectionTitle}>Chave Mestra Aurora</h2>

            <p style={text}>
              Entrada estratégica no ecossistema Aurora com posicionamento
              comercial pronto para expansão futura.
            </p>

            <div style={priceBox}>
              <span style={priceLabel}>Valor atual</span>
              <strong style={priceValue}>R$ 97,00</strong>
            </div>

            <div style={bulletList}>
              <div style={bullet}>✅ Oferta pronta para venda</div>
              <div style={bullet}>✅ Página separada da vitrine principal</div>
              <div style={bullet}>✅ Estrutura preparada para PIX depois</div>
              <div style={bullet}>✅ Base futura para afiliados e comissões</div>
            </div>

            <div style={{ marginTop: 20, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <a href="/cadastro" style={btnPrimary}>
                Quero comprar
              </a>
              <a href="/planos" style={btnOutline}>
                Ver planos
              </a>
            </div>
          </div>

          <div style={cardSide}>
            <p style={miniKicker}>STATUS DO CHECKOUT</p>
            <div style={statusBadge}>PRONTO PARA EVOLUIR</div>

            <p style={sideText}>
              Nesta etapa o checkout está visualmente organizado, mas ainda sem
              cobrança real conectada.
            </p>

            <div style={quickList}>
              <div style={quickItem}>Botão de compra provisório</div>
              <div style={quickItem}>PIX real entra na próxima fase</div>
              <div style={quickItem}>Checkout pode virar Asaas depois</div>
              <div style={quickItem}>Fluxo comercial já protegido</div>
            </div>
          </div>
        </section>

        <section style={sectionBlock}>
          <div style={sectionHeader}>
            <div>
              <p style={eyebrow}>COMO ESTA PÁGINA VAI CRESCER</p>
              <h2 style={sectionTitle}>ORDEM SEGURA DA MONETIZAÇÃO</h2>
            </div>
          </div>

          <div style={grid4}>
            <div style={smallCard}>
              <div style={icon}>1</div>
              <h3 style={smallTitle}>Checkout visual</h3>
              <p style={smallText}>
                Página pronta sem depender de integração externa.
              </p>
            </div>

            <div style={smallCard}>
              <div style={icon}>2</div>
              <h3 style={smallTitle}>Link real</h3>
              <p style={smallText}>
                Botão de compra poderá apontar para cobrança definida.
              </p>
            </div>

            <div style={smallCard}>
              <div style={icon}>3</div>
              <h3 style={smallTitle}>PIX</h3>
              <p style={smallText}>
                Entrada de cobrança por PIX em camada controlada.
              </p>
            </div>

            <div style={smallCard}>
              <div style={icon}>4</div>
              <h3 style={smallTitle}>Afiliados</h3>
              <p style={smallText}>
                Rastreamento e comissão vêm depois sem risco ao restante.
              </p>
            </div>
          </div>
        </section>

        <section style={ctaBox}>
          <div>
            <p style={eyebrow}>PRÓXIMO PASSO CONTROLADO</p>
            <h2 style={sectionTitle}>DEPOIS LIGAMOS O BOTÃO COM COBRANÇA REAL</h2>
            <p style={text}>
              Quando esta página estiver aprovada, o próximo ajuste pequeno será
              trocar o botão “Quero comprar” por um link comercial real.
            </p>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a href="/aurora-shop/checkout" style={btnPrimary}>
              Atualizar checkout
            </a>
            <a href="/aurora-shop" style={btnOutline}>
              Voltar à vitrine
            </a>
          </div>
        </section>

        <section style={footerNote}>
          Sistema em constante atualização. Algumas funcionalidades podem evoluir
          conforme melhorias.
        </section>
      </div>
    </main>
  );
}

const heroBox = {
  borderRadius: 22,
  padding: 20,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.055)",
  backdropFilter: "blur(16px)",
  boxShadow: "0 18px 40px rgba(0,0,0,0.18)",
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
  fontSize: "clamp(28px, 4vw, 44px)",
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
  background: "linear-gradient(135deg, #67e8f9 0%, #22d3ee 45%, #0ea5e9 100%)",
  color: "#082032",
  padding: "12px 20px",
  borderRadius: 10,
  fontWeight: "800",
  textDecoration: "none",
  boxShadow: "0 10px 24px rgba(34, 211, 238, 0.22)",
};

const btnOutline = {
  border: "1px solid rgba(34, 211, 238, 0.30)",
  background: "rgba(34, 211, 238, 0.08)",
  padding: "12px 20px",
  borderRadius: 10,
  fontWeight: "800",
  textDecoration: "none",
  color: "#effcff",
};

const sectionGrid = {
  marginTop: 16,
  display: "grid",
  gridTemplateColumns: "1.15fr 0.85fr",
  gap: 16,
};

const cardLarge = {
  borderRadius: 20,
  padding: 20,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.055)",
  backdropFilter: "blur(16px)",
  boxShadow: "0 18px 40px rgba(0,0,0,0.18)",
};

const cardSide = {
  borderRadius: 20,
  padding: 20,
  border: "1px solid rgba(255,255,255,0.10)",
  background:
    "linear-gradient(180deg, rgba(34,211,238,0.10), rgba(255,255,255,0.03)), rgba(255,255,255,0.055)",
  backdropFilter: "blur(16px)",
  boxShadow: "0 18px 40px rgba(0,0,0,0.18)",
};

const sectionTitle = {
  margin: "4px 0 0 0",
  fontSize: "clamp(20px, 2vw, 28px)",
  lineHeight: 1.02,
  fontWeight: 900,
  letterSpacing: "-0.03em",
  textTransform: "uppercase" as const,
};

const text = {
  marginTop: 12,
  fontSize: 14,
  lineHeight: 1.6,
  color: "rgba(235, 244, 252, 0.84)",
};

const priceBox = {
  marginTop: 18,
  display: "inline-flex",
  flexDirection: "column" as const,
  gap: 4,
  padding: "14px 16px",
  borderRadius: 16,
  border: "1px solid rgba(34,211,238,0.24)",
  background: "rgba(34,211,238,0.10)",
};

const priceLabel = {
  fontSize: 11,
  letterSpacing: "0.16em",
  textTransform: "uppercase" as const,
  fontWeight: 900,
  color: "#b6f3ff",
};

const priceValue = {
  fontSize: 28,
  lineHeight: 1,
  fontWeight: 900,
  color: "#ffffff",
};

const bulletList = {
  display: "grid",
  gap: 8,
  marginTop: 18,
};

const bullet = {
  fontSize: 13,
  lineHeight: 1.5,
  color: "rgba(235, 244, 252, 0.88)",
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

const sideText = {
  margin: "12px 0 0 0",
  fontSize: 13,
  lineHeight: 1.55,
  color: "rgba(235,244,252,0.84)",
};

const quickList = {
  display: "grid",
  gap: 8,
  marginTop: 16,
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

const sectionBlock = {
  marginTop: 16,
  borderRadius: 20,
  padding: 20,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.055)",
  backdropFilter: "blur(16px)",
  boxShadow: "0 18px 40px rgba(0,0,0,0.18)",
};

const sectionHeader = {
  marginBottom: 12,
};

const grid4 = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: 12,
};

const smallCard = {
  borderRadius: 16,
  padding: 16,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.04)",
};

const icon = {
  width: 34,
  height: 34,
  borderRadius: 10,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 14,
  marginBottom: 10,
  border: "1px solid rgba(34,211,238,0.24)",
  background: "rgba(34,211,238,0.11)",
  fontWeight: 900,
};

const smallTitle = {
  margin: 0,
  fontSize: 14,
  fontWeight: 900,
  textTransform: "uppercase" as const,
};

const smallText = {
  margin: "8px 0 0 0",
  fontSize: 12,
  lineHeight: 1.55,
  color: "rgba(235,244,252,0.84)",
  textTransform: "uppercase" as const,
};

const ctaBox = {
  marginTop: 16,
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