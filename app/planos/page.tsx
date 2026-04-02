import Link from "next/link";

const plans = [
  {
    name: "FREE",
    badge: "Entrada",
    price: "Grátis",
    subtitle: "Entrada livre para conhecer",
    description:
      "Para conhecer a Aurora IA, testar o chat e validar o valor da plataforma.",
    features: [
      "Acesso inicial à Aurora IA",
      "Uso básico para testes",
      "Entrada rápida na plataforma",
      "Ideal para conhecer a ferramenta",
    ],
    cta: "Começar grátis",
    href: "/chat",
    highlight: false,
    external: false,
  },
  {
    name: "PRO",
    badge: "Entrada paga",
    price: "R$ 9,90/mês",
    subtitle: "Cobrança recorrente mensal",
    description:
      "Plano inicial para quem quer começar a usar a Aurora IA para criar e vender.",
    features: [
      "Chat com uso ampliado",
      "Criação de campanhas",
      "Geração de imagens",
      "Uso comercial liberado",
      "Ideal para começar",
    ],
    cta: "Assinar PRO",
    href: "https://www.asaas.com/c/ej715gfx5qpvlh1v",
    highlight: true,
    external: true,
  },
  {
    name: "PLUS",
    badge: "Crescimento",
    price: "R$ 29,90/mês",
    subtitle: "Cobrança recorrente mensal",
    description:
      "Plano intermediário para quem quer mais consistência, volume e performance.",
    features: [
      "Tudo do plano PRO",
      "Mais uso diário",
      "Mais velocidade de geração",
      "Melhor consistência",
      "Ideal para quem já começou a vender",
    ],
    cta: "Assinar PLUS",
    href: "https://www.asaas.com/c/7jhiilct1ztpsvws",
    highlight: false,
    external: true,
  },
  {
    name: "MAX",
    badge: "Premium",
    price: "R$ 49,90/mês",
    subtitle: "Cobrança recorrente mensal",
    description:
      "Plano premium para quem quer mais poder, prioridade e crescimento acelerado.",
    features: [
      "Tudo do plano PLUS",
      "Prioridade de uso",
      "Mais poder de criação",
      "Recursos premium em expansão",
      "Ideal para escala",
    ],
    cta: "Assinar MAX",
    href: "https://www.asaas.com/c/m2co5t8qj55fvn2d",
    highlight: false,
    external: true,
  },
  {
    name: "SCALE",
    badge: "Escala",
    price: "Sob consulta",
    subtitle: "Plano personalizado",
    description:
      "Para quem quer escalar com mais força, estrutura e soluções personalizadas.",
    features: [
      "Estrutura avançada",
      "Suporte prioritário",
      "Possível personalização",
      "Foco em crescimento",
      "Ideal para empresas",
    ],
    cta: "Falar sobre SCALE",
    href: "https://wa.me/5531997490074?text=Quero%20saber%20sobre%20o%20plano%20SCALE%20da%20Aurora%20IA%20para%20aumentar%20minhas%20vendas%20com%20IA",
    highlight: false,
    external: true,
  },
];

const highlights = [
  {
    title: "Conversão",
    text: "Planos claros, oferta simples e caminho direto para vender.",
  },
  {
    title: "Uso comercial",
    text: "Ideal para criadores, vendedores, agências e operações reais.",
  },
  {
    title: "Escala",
    text: "Entre no PRO ou suba para PLUS, MAX ou SCALE conforme sua fase.",
  },
];

export default function PlanosPage() {
  return (
    <main style={styles.main}>
      <section style={styles.container}>
        <header style={styles.topbar}>
          <div style={styles.brandWrap}>
            <div style={styles.brandMini}>ricardoiaoficial.com</div>
            <div style={styles.brandTitle}>Aurora IA • Planos</div>
          </div>

          <div style={styles.topActions}>
            <Link href="/" style={styles.navButton}>
              Home
            </Link>
            <Link href="/chat" style={styles.navButton}>
              Chat
            </Link>
            <Link href="/afiliados" style={styles.primaryNavButton}>
              Afiliados
            </Link>
          </div>
        </header>

        <section style={styles.heroCard}>
          <div style={styles.badge}>Aurora IA Planos</div>

          <h1 style={styles.heroTitle}>
            Escolha seu plano e cresça com a Aurora IA
          </h1>

          <p style={styles.heroText}>
            Crie imagens, campanhas, ideias de negócio e acelere sua operação com
            uma estrutura pensada para conversão, uso comercial e crescimento real.
          </p>

          <div style={styles.heroActions}>
            <Link href="/chat" style={styles.primaryButton}>
              Testar agora
            </Link>

            <Link href="/afiliados" style={styles.secondaryButton}>
              Programa de afiliados
            </Link>
          </div>

          <div style={styles.highlightsGrid}>
            {highlights.map((item) => (
              <div key={item.title} style={styles.highlightCard}>
                <div style={styles.highlightTitle}>{item.title}</div>
                <div style={styles.highlightText}>{item.text}</div>
              </div>
            ))}
          </div>
        </section>

        <section style={styles.plansGrid}>
          {plans.map((plan) => {
            const isHighlight = plan.highlight;

            return (
              <article
                key={plan.name}
                style={{
                  ...styles.planCard,
                  ...(isHighlight ? styles.planCardHighlight : null),
                }}
              >
                <div style={styles.planTop}>
                  <div style={styles.planMiniLabel}>Plano Aurora</div>

                  <h2 style={styles.planName}>{plan.name}</h2>

                  <div
                    style={{
                      ...styles.planBadge,
                      ...(isHighlight ? styles.planBadgeHighlight : null),
                    }}
                  >
                    {plan.badge}
                  </div>
                </div>

                <div
                  style={{
                    ...styles.planPrice,
                    ...(isHighlight ? styles.planPriceHighlight : null),
                  }}
                >
                  {plan.price}
                </div>

                <div style={styles.planSubtitle}>{plan.subtitle}</div>

                <p style={styles.planDescription}>{plan.description}</p>

                <div style={styles.featuresWrap}>
                  {plan.features.map((feature) => (
                    <div key={feature} style={styles.featureRow}>
                      <span style={styles.featureCheck}>✓</span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {plan.external ? (
                  <a
                    href={plan.href}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      ...styles.planButton,
                      ...(isHighlight ? styles.planButtonHighlight : styles.planButtonSoft),
                    }}
                  >
                    {plan.cta}
                  </a>
                ) : (
                  <Link
                    href={plan.href}
                    style={{
                      ...styles.planButton,
                      ...(isHighlight ? styles.planButtonHighlight : styles.planButtonSoft),
                    }}
                  >
                    {plan.cta}
                  </Link>
                )}
              </article>
            );
          })}
        </section>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top, rgba(59,130,246,0.12), transparent 18%), radial-gradient(circle at right top, rgba(37,99,235,0.08), transparent 22%), radial-gradient(circle at left, rgba(34,197,94,0.08), transparent 28%), linear-gradient(180deg, #eef6ff 0%, #f7fbff 36%, #edf7f3 100%)",
    color: "#0f172a",
    padding: "24px 20px 60px",
  },
  container: {
    maxWidth: 1220,
    margin: "0 auto",
    display: "grid",
    gap: 18,
  },
  topbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 14,
    flexWrap: "wrap",
    border: "1px solid rgba(15,23,42,0.08)",
    background: "rgba(255,255,255,0.78)",
    backdropFilter: "blur(14px)",
    borderRadius: 22,
    padding: "12px 14px",
    boxShadow: "0 18px 42px rgba(15,23,42,0.07)",
  },
  brandWrap: {
    display: "grid",
    gap: 3,
  },
  brandMini: {
    fontSize: 11,
    fontWeight: 900,
    letterSpacing: "0.08em",
    color: "#2563eb",
    textTransform: "uppercase",
  },
  brandTitle: {
    fontSize: 17,
    fontWeight: 900,
    lineHeight: 1.2,
    color: "#0f172a",
  },
  topActions: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
  },
  navButton: {
    textDecoration: "none",
    color: "#0f172a",
    border: "1px solid rgba(15,23,42,0.08)",
    background: "rgba(255,255,255,0.72)",
    borderRadius: 11,
    padding: "9px 12px",
    fontWeight: 800,
    boxShadow: "0 8px 16px rgba(15,23,42,0.04)",
    fontSize: 13,
  },
  primaryNavButton: {
    textDecoration: "none",
    color: "#ffffff",
    border: "1px solid rgba(37,99,235,0.18)",
    background: "linear-gradient(135deg, #2563eb, #3b82f6)",
    borderRadius: 11,
    padding: "9px 12px",
    fontWeight: 900,
    boxShadow: "0 0 0 1px rgba(59,130,246,0.08), 0 10px 24px rgba(37,99,235,0.16)",
    fontSize: 13,
  },
  heroCard: {
    border: "1px solid rgba(15,23,42,0.08)",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.90), rgba(255,255,255,0.76))",
    borderRadius: 28,
    padding: "26px 22px",
    boxShadow: "0 18px 60px rgba(15,23,42,0.08)",
    display: "grid",
    gap: 18,
  },
  badge: {
    display: "inline-flex",
    width: "fit-content",
    alignItems: "center",
    gap: 8,
    padding: "8px 12px",
    borderRadius: 999,
    background: "rgba(37,99,235,0.08)",
    border: "1px solid rgba(37,99,235,0.18)",
    color: "#2563eb",
    fontWeight: 800,
    fontSize: 13,
    boxShadow: "0 0 0 1px rgba(59,130,246,0.03), 0 0 20px rgba(59,130,246,0.05)",
  },
  heroTitle: {
    margin: 0,
    fontSize: "clamp(30px, 5.2vw, 52px)",
    lineHeight: 1.04,
    fontWeight: 900,
    letterSpacing: "-0.03em",
    maxWidth: 920,
    color: "#0f172a",
  },
  heroText: {
    margin: 0,
    maxWidth: 860,
    fontSize: 18,
    lineHeight: 1.7,
    color: "rgba(15,23,42,0.74)",
    fontWeight: 700,
  },
  heroActions: {
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
  },
  primaryButton: {
    minHeight: 46,
    padding: "0 18px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    background: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
    color: "#ffffff",
    fontWeight: 900,
    textDecoration: "none",
    boxShadow: "0 0 0 1px rgba(59,130,246,0.08), 0 12px 30px rgba(37,99,235,0.18)",
    border: "1px solid rgba(37,99,235,0.18)",
    fontSize: 14,
  },
  secondaryButton: {
    minHeight: 46,
    padding: "0 18px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    background: "rgba(255,255,255,0.76)",
    border: "1px solid rgba(15,23,42,0.08)",
    color: "#0f172a",
    fontWeight: 800,
    textDecoration: "none",
    boxShadow: "0 8px 18px rgba(15,23,42,0.04)",
    fontSize: 14,
  },
  highlightsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 12,
    maxWidth: 980,
  },
  highlightCard: {
    padding: "14px 16px",
    borderRadius: 18,
    border: "1px solid rgba(37,99,235,0.10)",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.82), rgba(255,255,255,0.68))",
    boxShadow: "0 8px 18px rgba(15,23,42,0.04)",
  },
  highlightTitle: {
    fontWeight: 900,
    marginBottom: 6,
    color: "#2563eb",
  },
  highlightText: {
    color: "rgba(15,23,42,0.70)",
    lineHeight: 1.6,
    fontSize: 14,
  },
  plansGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
    gap: 20,
  },
  planCard: {
    borderRadius: 24,
    padding: 24,
    border: "1px solid rgba(15,23,42,0.08)",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.88), rgba(255,255,255,0.74))",
    boxShadow: "0 18px 40px rgba(15,23,42,0.06)",
    display: "flex",
    flexDirection: "column",
  },
  planCardHighlight: {
    border: "1px solid rgba(37,99,235,0.20)",
    background:
      "linear-gradient(180deg, rgba(37,99,235,0.10), rgba(255,255,255,0.82))",
    boxShadow:
      "0 0 0 1px rgba(59,130,246,0.05), 0 0 32px rgba(59,130,246,0.10), 0 22px 48px rgba(15,23,42,0.08)",
  },
  planTop: {
    display: "grid",
    gap: 10,
  },
  planMiniLabel: {
    fontSize: 12,
    color: "#2563eb",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  planName: {
    margin: 0,
    fontSize: 30,
    fontWeight: 900,
    color: "#0f172a",
  },
  planBadge: {
    display: "inline-flex",
    width: "fit-content",
    padding: "6px 10px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.72)",
    border: "1px solid rgba(15,23,42,0.08)",
    color: "rgba(15,23,42,0.74)",
    fontSize: 12,
    fontWeight: 900,
  },
  planBadgeHighlight: {
    background: "rgba(37,99,235,0.10)",
    border: "1px solid rgba(37,99,235,0.18)",
    color: "#2563eb",
    boxShadow: "0 0 18px rgba(59,130,246,0.06)",
  },
  planPrice: {
    marginTop: 14,
    fontSize: 28,
    fontWeight: 900,
    color: "#0f172a",
  },
  planPriceHighlight: {
    color: "#2563eb",
    textShadow: "0 0 18px rgba(59,130,246,0.12)",
  },
  planSubtitle: {
    marginTop: 6,
    fontSize: 13,
    color: "rgba(15,23,42,0.54)",
    fontWeight: 700,
  },
  planDescription: {
    marginTop: 14,
    marginBottom: 0,
    fontSize: 15,
    lineHeight: 1.7,
    color: "rgba(15,23,42,0.74)",
    minHeight: 88,
  },
  featuresWrap: {
    marginTop: 18,
    display: "grid",
    gap: 10,
  },
  featureRow: {
    display: "flex",
    gap: 10,
    color: "rgba(15,23,42,0.82)",
    lineHeight: 1.5,
    fontSize: 14,
  },
  featureCheck: {
    color: "#2563eb",
    fontWeight: 900,
  },
  planButton: {
    marginTop: 22,
    minHeight: 48,
    padding: "0 18px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    fontWeight: 900,
    textDecoration: "none",
    width: "100%",
    boxSizing: "border-box",
    fontSize: 14,
  },
  planButtonHighlight: {
    background: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
    border: "1px solid rgba(37,99,235,0.18)",
    color: "#ffffff",
    boxShadow: "0 0 0 1px rgba(59,130,246,0.08), 0 12px 30px rgba(37,99,235,0.18)",
  },
  planButtonSoft: {
    background: "rgba(255,255,255,0.78)",
    border: "1px solid rgba(15,23,42,0.08)",
    color: "#0f172a",
    boxShadow: "0 8px 18px rgba(15,23,42,0.04)",
  },
};