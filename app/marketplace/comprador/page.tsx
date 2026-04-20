import Link from "next/link";

export default function MarketplaceCompradorPage() {
  return (
    <main style={styles.page}>
      <div style={styles.bgGlowTop} />
      <div style={styles.bgGlowBottom} />

      <section style={styles.heroCard}>
        <div style={styles.heroHeader}>
          <div>
            <span style={styles.kicker}>Aurora Marketplace • Área do comprador</span>
            <h1 style={styles.title}>PAINEL DO COMPRADOR</h1>
            <p style={styles.lead}>
              Área central do comprador para explorar vitrines, acompanhar interesses,
              preparar entrega e seguir o fluxo comercial do Marketplace Aurora com
              clareza, leveza e padrão visual premium.
            </p>
          </div>

          <div style={styles.heroActions}>
            <Link href="/marketplace" style={styles.linkGhost}>
              Voltar ao Marketplace
            </Link>
            <Link href="/marketplace/vendedor/vitrine" style={styles.linkPrimary}>
              Explorar vitrine
            </Link>
          </div>
        </div>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Fluxo atual</span>
            <strong style={styles.statValueSmall}>Comprador local</strong>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Busca</span>
            <strong style={styles.statValueSmall}>Manual</strong>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Entrega</span>
            <strong style={styles.statValueSmall}>Página isolada</strong>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Próxima camada</span>
            <strong style={styles.statValueSmall}>Histórico do comprador</strong>
          </div>
        </div>
      </section>

      <section style={styles.grid}>
        <article style={styles.card}>
          <span style={styles.cardKicker}>Explorar</span>
          <h2 style={styles.cardTitle}>Ver vitrines e produtos</h2>
          <p style={styles.cardText}>
            Entrada principal para o comprador navegar pelos produtos disponíveis
            e encontrar oportunidades reais publicadas pelos vendedores.
          </p>
          <Link href="/marketplace/vendedor/vitrine" style={styles.blockPrimary}>
            Abrir vitrine pública
          </Link>
        </article>

        <article style={styles.card}>
          <span style={styles.cardKicker}>Entrega</span>
          <h2 style={styles.cardTitle}>Cadastrar endereço de entrega</h2>
          <p style={styles.cardText}>
            Aqui o comprador registra nome de recebimento, telefone, CEP, endereço,
            número, bairro, cidade, estado e observações para preparar a compra real.
          </p>
          <Link href="/marketplace/comprador/entrega" style={styles.blockPrimary}>
            Abrir endereço de entrega
          </Link>
        </article>

        <article style={styles.card}>
          <span style={styles.cardKicker}>Interesse</span>
          <h2 style={styles.cardTitle}>Fluxo comercial inicial</h2>
          <p style={styles.cardText}>
            Nesta fase, o comprador usa o botão de interesse da vitrine como porta
            inicial do contato. Depois ligaremos histórico, pedidos e acompanhamento.
          </p>
          <div style={styles.badgeBox}>
            <span style={styles.badge}>Tenho interesse</span>
            <span style={styles.badgeText}>
              Botão já preparado como base comercial inicial.
            </span>
          </div>
        </article>

        <article style={styles.card}>
          <span style={styles.cardKicker}>Evolução</span>
          <h2 style={styles.cardTitle}>Próximos passos do comprador</h2>
          <p style={styles.cardText}>
            Depois desta blindagem visual, o caminho natural é criar histórico do
            comprador, página própria de acompanhamento e vínculo com a loja pública.
          </p>
          <div style={styles.stepList}>
            <div style={styles.stepItem}>
              <strong>1.</strong>
              <span>Explorar produtos reais</span>
            </div>
            <div style={styles.stepItem}>
              <strong>2.</strong>
              <span>Registrar interesse</span>
            </div>
            <div style={styles.stepItem}>
              <strong>3.</strong>
              <span>Salvar entrega</span>
            </div>
            <div style={styles.stepItem}>
              <strong>4.</strong>
              <span>Acompanhar histórico</span>
            </div>
          </div>
        </article>
      </section>

      <section style={styles.infoCard}>
        <span style={styles.cardKicker}>Regra oficial desta fase</span>
        <h3 style={styles.infoTitle}>Marketplace separado, fluxo mais claro</h3>
        <p style={styles.infoText}>
          O comprador entra por uma área própria, sem confundir com o vendedor,
          mantendo a organização do Marketplace Aurora e preparando a expansão
          futura com entrega, histórico, acompanhamento e páginas individuais.
        </p>

        <div style={styles.infoActions}>
          <Link href="/marketplace" style={styles.linkGhostBlock}>
            Voltar ao Marketplace
          </Link>
          <Link href="/marketplace/comprador/entrega" style={styles.linkPrimaryBlock}>
            Ir para entrega
          </Link>
        </div>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    padding: "32px 20px 56px",
    background: "linear-gradient(180deg, #eef8ff 0%, #f7fbff 40%, #ffffff 100%)",
    position: "relative",
    overflow: "hidden",
  },
  bgGlowTop: {
    position: "absolute",
    top: -120,
    right: -120,
    width: 320,
    height: 320,
    borderRadius: "50%",
    background: "rgba(0, 191, 255, 0.14)",
    filter: "blur(60px)",
    pointerEvents: "none",
  },
  bgGlowBottom: {
    position: "absolute",
    bottom: -160,
    left: -120,
    width: 360,
    height: 360,
    borderRadius: "50%",
    background: "rgba(0, 153, 255, 0.12)",
    filter: "blur(70px)",
    pointerEvents: "none",
  },
  heroCard: {
    position: "relative",
    zIndex: 1,
    maxWidth: 1280,
    margin: "0 auto 24px",
    borderRadius: 28,
    border: "1px solid rgba(120, 170, 220, 0.22)",
    background: "rgba(255,255,255,0.82)",
    boxShadow: "0 22px 60px rgba(31, 80, 140, 0.10)",
    backdropFilter: "blur(14px)",
    padding: 28,
  },
  heroHeader: {
    display: "flex",
    gap: 20,
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  kicker: {
    display: "inline-block",
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: 1.1,
    textTransform: "uppercase",
    color: "#0b74c7",
    marginBottom: 10,
  },
  title: {
    margin: 0,
    fontSize: "clamp(2rem, 4vw, 3.2rem)",
    lineHeight: 1.02,
    color: "#082849",
  },
  lead: {
    margin: "12px 0 0",
    maxWidth: 760,
    fontSize: 16,
    lineHeight: 1.7,
    color: "#42627f",
  },
  heroActions: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
  },
  linkPrimary: {
    textDecoration: "none",
    background: "linear-gradient(135deg, #0aa2ff 0%, #0b7ed6 100%)",
    color: "#fff",
    padding: "14px 18px",
    borderRadius: 16,
    fontWeight: 800,
    boxShadow: "0 18px 40px rgba(0, 122, 204, 0.22)",
  },
  linkGhost: {
    textDecoration: "none",
    background: "#f4fbff",
    color: "#0c5d96",
    padding: "14px 18px",
    borderRadius: 16,
    fontWeight: 700,
    border: "1px solid rgba(99, 163, 214, 0.24)",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 14,
    marginTop: 22,
  },
  statCard: {
    background: "linear-gradient(180deg, #fafdff 0%, #eff7ff 100%)",
    borderRadius: 20,
    padding: 18,
    border: "1px solid rgba(121, 178, 224, 0.20)",
  },
  statLabel: {
    display: "block",
    fontSize: 13,
    color: "#55738d",
    marginBottom: 8,
    fontWeight: 700,
  },
  statValueSmall: {
    fontSize: 20,
    color: "#0a2946",
  },
  grid: {
    position: "relative",
    zIndex: 1,
    maxWidth: 1280,
    margin: "0 auto 24px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 20,
  },
  card: {
    borderRadius: 24,
    border: "1px solid rgba(120, 170, 220, 0.18)",
    background: "linear-gradient(180deg, #ffffff 0%, #f7fbff 100%)",
    boxShadow: "0 16px 36px rgba(31, 80, 140, 0.07)",
    padding: 24,
  },
  cardKicker: {
    display: "inline-block",
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: "#1292ec",
    marginBottom: 8,
  },
  cardTitle: {
    margin: 0,
    fontSize: 24,
    color: "#0c2b49",
  },
  cardText: {
    margin: "12px 0 18px",
    fontSize: 15,
    lineHeight: 1.7,
    color: "#4b6781",
  },
  blockPrimary: {
    display: "inline-block",
    textDecoration: "none",
    background: "linear-gradient(135deg, #0aa2ff 0%, #0b7ed6 100%)",
    color: "#fff",
    padding: "14px 18px",
    borderRadius: 16,
    fontWeight: 800,
  },
  badgeBox: {
    borderRadius: 18,
    border: "1px solid rgba(120, 170, 220, 0.18)",
    background: "#f8fbff",
    padding: 16,
    display: "grid",
    gap: 10,
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "fit-content",
    minHeight: 38,
    padding: "0 14px",
    borderRadius: 999,
    background: "linear-gradient(135deg, #08a2ff 0%, #0a76cf 100%)",
    color: "#fff",
    fontWeight: 800,
    fontSize: 14,
  },
  badgeText: {
    color: "#4b6781",
    lineHeight: 1.6,
    fontSize: 14,
  },
  stepList: {
    display: "grid",
    gap: 12,
  },
  stepItem: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    padding: "12px 14px",
    borderRadius: 16,
    background: "#f8fbff",
    border: "1px solid rgba(120, 170, 220, 0.16)",
    color: "#234764",
  },
  infoCard: {
    position: "relative",
    zIndex: 1,
    maxWidth: 1280,
    margin: "0 auto",
    borderRadius: 28,
    border: "1px solid rgba(120, 170, 220, 0.22)",
    background: "rgba(255,255,255,0.90)",
    boxShadow: "0 22px 60px rgba(31, 80, 140, 0.08)",
    padding: 28,
  },
  infoTitle: {
    margin: 0,
    fontSize: 26,
    color: "#0c2b49",
  },
  infoText: {
    margin: "12px 0 0",
    fontSize: 15,
    lineHeight: 1.7,
    color: "#4b6781",
  },
  infoActions: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    marginTop: 20,
  },
  linkPrimaryBlock: {
    textDecoration: "none",
    textAlign: "center",
    background: "linear-gradient(135deg, #0aa2ff 0%, #0b7ed6 100%)",
    color: "#fff",
    padding: "14px 18px",
    borderRadius: 16,
    fontWeight: 800,
  },
  linkGhostBlock: {
    textDecoration: "none",
    textAlign: "center",
    background: "#f4fbff",
    color: "#0c5d96",
    padding: "14px 18px",
    borderRadius: 16,
    fontWeight: 800,
    border: "1px solid rgba(99, 163, 214, 0.24)",
  },
};