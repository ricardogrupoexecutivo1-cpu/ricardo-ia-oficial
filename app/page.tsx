import Link from "next/link";

export const dynamic = "force-dynamic";

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top, rgba(59, 130, 246, 0.20) 0%, rgba(9, 18, 34, 1) 45%, rgba(5, 10, 20, 1) 100%)",
    color: "#f8fafc",
    padding: "32px 16px 48px",
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  wrap: {
    width: "100%",
    maxWidth: 1240,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: 24,
  },
  hero: {
    background: "rgba(15, 23, 42, 0.82)",
    border: "1px solid rgba(148, 163, 184, 0.18)",
    borderRadius: 28,
    boxShadow: "0 24px 80px rgba(0,0,0,0.35)",
    backdropFilter: "blur(18px)",
    padding: 32,
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 14px",
    borderRadius: 999,
    background: "rgba(34, 197, 94, 0.12)",
    border: "1px solid rgba(34, 197, 94, 0.28)",
    color: "#bbf7d0",
    fontSize: 13,
    fontWeight: 700,
    width: "fit-content",
    letterSpacing: 0.3,
  },
  title: {
    fontSize: "clamp(34px, 5vw, 62px)",
    lineHeight: 1.02,
    fontWeight: 900,
    margin: "18px 0 16px",
    letterSpacing: -1.6,
  },
  subtitle: {
    fontSize: 18,
    lineHeight: 1.7,
    color: "rgba(226, 232, 240, 0.88)",
    maxWidth: 900,
    margin: 0,
  },
  heroActions: {
    display: "flex",
    flexWrap: "wrap",
    gap: 14,
    marginTop: 28,
  },
  primaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 56,
    padding: "0 22px",
    borderRadius: 16,
    textDecoration: "none",
    fontWeight: 800,
    fontSize: 16,
    background:
      "linear-gradient(135deg, #22c55e 0%, #16a34a 45%, #15803d 100%)",
    color: "#ffffff",
    boxShadow: "0 16px 40px rgba(34, 197, 94, 0.28)",
    border: "1px solid rgba(255,255,255,0.12)",
  },
  secondaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 56,
    padding: "0 22px",
    borderRadius: 16,
    textDecoration: "none",
    fontWeight: 800,
    fontSize: 16,
    background: "rgba(255,255,255,0.04)",
    color: "#f8fafc",
    border: "1px solid rgba(148, 163, 184, 0.22)",
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 900,
    margin: "8px 0 0",
  },
  sectionText: {
    margin: "8px 0 0",
    color: "rgba(226, 232, 240, 0.82)",
    fontSize: 15,
    lineHeight: 1.7,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 18,
  },
  card: {
    background: "rgba(15, 23, 42, 0.82)",
    border: "1px solid rgba(148, 163, 184, 0.18)",
    borderRadius: 24,
    padding: 22,
    boxShadow: "0 18px 50px rgba(0,0,0,0.22)",
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  cardTitle: {
    margin: 0,
    fontSize: 20,
    fontWeight: 900,
    color: "#f8fafc",
  },
  cardText: {
    margin: 0,
    color: "rgba(226, 232, 240, 0.82)",
    fontSize: 14,
    lineHeight: 1.7,
  },
  cardActions: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginTop: "auto",
  },
  linkButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    padding: "0 14px",
    borderRadius: 14,
    textDecoration: "none",
    fontWeight: 700,
    fontSize: 14,
    background: "rgba(255,255,255,0.04)",
    color: "#e2e8f0",
    border: "1px solid rgba(148, 163, 184, 0.16)",
  },
  notice: {
    background: "rgba(249, 115, 22, 0.08)",
    border: "1px solid rgba(249, 115, 22, 0.22)",
    color: "#fdba74",
    borderRadius: 20,
    padding: 18,
    fontSize: 14,
    lineHeight: 1.7,
  },
};

type HubCard = {
  title: string;
  description: string;
  links: { href: string; label: string }[];
};

const cards: HubCard[] = [
  {
    title: "Aurora IA",
    description:
      "Entrada principal para conversar, criar campanhas, gerar imagens, textos de vendas e ideias.",
    links: [
      { href: "/chat", label: "Abrir chat" },
      { href: "/entrar", label: "Login" },
      { href: "/planos", label: "Ver planos" },
    ],
  },
  {
    title: "Imóveis",
    description:
      "Acesse imóveis, busca, cadastro e área administrativa da frente imobiliária.",
    links: [
      { href: "/imoveis", label: "Abrir imóveis" },
      { href: "/imoveis/busca", label: "Buscar imóveis" },
      { href: "/imoveis/cadastrar", label: "Cadastrar imóvel" },
    ],
  },
  {
    title: "Imobiliárias",
    description:
      "Central para cadastro, busca e área própria de imobiliárias dentro da plataforma.",
    links: [
      { href: "/imobiliarias", label: "Abrir imobiliárias" },
      { href: "/imobiliarias/busca", label: "Buscar imobiliárias" },
      { href: "/imobiliarias/cadastrar", label: "Cadastrar imobiliária" },
    ],
  },
  {
    title: "Locadora",
    description:
      "Módulo de locadora com cadastros, propostas, clientes, motoristas e operação.",
    links: [
      { href: "/locadora", label: "Abrir locadora" },
      { href: "/locadora/cadastros", label: "Cadastros" },
      { href: "/locadora/propostas", label: "Propostas" },
    ],
  },
  {
    title: "Mineração",
    description:
      "Área dedicada à frente de mineração, com navegação isolada e pronta para evolução.",
    links: [{ href: "/mineracao", label: "Abrir mineração" }],
  },
  {
    title: "Bancos",
    description:
      "Camada financeira e de instituições bancárias para apoio da estrutura do sistema.",
    links: [{ href: "/bancos", label: "Abrir bancos" }],
  },
  {
    title: "Cadastro geral",
    description:
      "Entrada institucional para novos registros, expansão da base e continuidade do ecossistema.",
    links: [
      { href: "/cadastro-geral", label: "Abrir cadastro geral" },
      { href: "/cadastro-basico", label: "Cadastro básico" },
    ],
  },
  {
    title: "Explorar e negócios",
    description:
      "Áreas de exploração, editor, negócios e expansão geral da Aurora.",
    links: [
      { href: "/explorar", label: "Explorar" },
      { href: "/editor", label: "Editor" },
      { href: "/developers", label: "Developers" },
    ],
  },
];

export default function RootPage() {
  return (
    <main style={styles.page}>
      <div style={styles.wrap}>
        <section style={styles.hero}>
          <div style={styles.badge}>Ricardo IA Oficial • Home principal</div>

          <h1 style={styles.title}>
            Aurora oficial com navegação central, estável e sem loop
          </h1>

          <p style={styles.subtitle}>
            Esta é a home principal da Ricardo IA oficial. Aqui você volta a ter
            acesso aos módulos importantes da plataforma sem cair direto no chat
            e sem prender o sistema entre <strong>/</strong>,{" "}
            <strong>/entrada</strong> e <strong>/home</strong>.
          </p>

          <div style={styles.heroActions}>
            <Link href="/chat" style={styles.primaryButton}>
              Abrir chat
            </Link>

            <Link href="/entrar" style={styles.secondaryButton}>
              Ir para login
            </Link>

            <Link href="/planos" style={styles.secondaryButton}>
              Ver planos
            </Link>
          </div>

          <h2 style={styles.sectionTitle}>Centrais principais</h2>
          <p style={styles.sectionText}>
            Escolha abaixo o módulo certo da plataforma. Este ajuste é isolado,
            focado apenas na Ricardo IA oficial, sem bagunçar as outras frentes
            do projeto.
          </p>
        </section>

        <section style={styles.grid}>
          {cards.map((card) => (
            <article key={card.title} style={styles.card}>
              <h3 style={styles.cardTitle}>{card.title}</h3>
              <p style={styles.cardText}>{card.description}</p>

              <div style={styles.cardActions}>
                {card.links.map((link) => (
                  <Link key={link.href + link.label} href={link.href} style={styles.linkButton}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </section>

        <section style={styles.notice}>
          Sistema em constante atualização. Algumas áreas podem passar por
          melhorias visuais e operacionais. Esta home foi ajustada para manter a
          navegação principal funcionando sem redirecionamento quebrado.
        </section>
      </div>
    </main>
  );
}