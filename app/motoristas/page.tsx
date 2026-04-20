import Link from "next/link";

export const metadata = {
  title: "Aurora Motoristas | Gestão global de motoristas",
  description:
    "Super App Aurora Motoristas para gestão completa de motoristas, serviços, despesas, pagamentos, GPS, auditoria e automações com Robô Aurora.",
};

const featureGroups = [
  {
    title: "Base operacional",
    description:
      "Estrutura principal para motoristas, empresas, documentos, fotos, login e cadastro global com padrão profissional.",
    items: [
      "Cadastro via CPF/CNPJ",
      "Foto obrigatória do motorista",
      "Login Google e e-mail",
      "Cadastro de empresas e contratantes",
      "Campos totalmente editáveis",
      "Estrutura multiempresa",
    ],
  },
  {
    title: "Serviços e atendimento",
    description:
      "Controle do ciclo completo do serviço, desde a criação até o encerramento com rastreabilidade.",
    items: [
      "Serviços por diária",
      "Serviços por hora",
      "Serviços por km",
      "Serviços por valor fechado",
      "Aceite, recusa e cancelamento",
      "Confirmação de início e conclusão",
    ],
  },
  {
    title: "Financeiro e despesas",
    description:
      "Gestão prática e auditável para custos, repasses, pagamentos e acompanhamento de resultados.",
    items: [
      "Combustível",
      "Pedágio",
      "Alimentação",
      "Estacionamento",
      "Manutenção",
      "Pagamentos ao motorista",
    ],
  },
  {
    title: "Inteligência e controle",
    description:
      "Camada avançada para auditoria, rastreio, análise e apoio inteligente do Robô Aurora.",
    items: [
      "Rastreamento GPS",
      "Histórico operacional",
      "Auditoria de ações",
      "Relatórios exportáveis",
      "Sugestão de rotas",
      "Robô Aurora operacional",
    ],
  },
];

const moduleCards = [
  {
    title: "Motoristas",
    href: "/motoristas/motoristas",
    description:
      "Cadastre motoristas com foto, dados principais, status, documentos, observações e vínculo operacional.",
    badge: "Núcleo",
  },
  {
    title: "Empresas e clientes",
    href: "/motoristas/empresas",
    description:
      "Cadastre locadoras, empresas, parceiros e tomadores de serviço com estrutura escalável.",
    badge: "Base comercial",
  },
  {
    title: "Serviços",
    href: "/motoristas/servicos",
    description:
      "Abra, distribua, acompanhe, cancele e conclua serviços por hora, diária, km ou valor fechado.",
    badge: "Operação",
  },
  {
    title: "Despesas",
    href: "/motoristas/despesas",
    description:
      "Controle combustível, pedágio, alimentação, apoio, manutenção e qualquer outro custo customizado.",
    badge: "Financeiro",
  },
  {
    title: "Pagamentos",
    href: "/motoristas/pagamentos",
    description:
      "Gerencie repasses, comprovantes, baixa de pagamentos e histórico protegido para auditoria.",
    badge: "Controle",
  },
  {
    title: "Relatórios",
    href: "/motoristas/relatorios",
    description:
      "Visão diária, semanal, mensal e por motorista, empresa, serviço, região, custo e produtividade.",
    badge: "Gestão",
  },
  {
    title: "GPS e rotas",
    href: "/motoristas/gps",
    description:
      "Área futura para rastreamento, rotas sugeridas, mapa operacional e histórico de deslocamento.",
    badge: "Expansão",
  },
  {
    title: "Robô Aurora",
    href: "/motoristas/robo-aurora",
    description:
      "Assistente operacional para criar serviços, confirmar operações, alertar riscos e sugerir decisões.",
    badge: "IA",
  },
];

const highlights = [
  {
    title: "Global e editável",
    text: "Pronto para empresas, locadoras, operações privadas, transporte executivo, apoio logístico e serviços dedicados.",
  },
  {
    title: "Operação com rastreio",
    text: "Tudo fica organizado com trilha operacional para reduzir erro, retrabalho e perda de informação.",
  },
  {
    title: "Financeiro real",
    text: "Despesas, consumo, pagamentos e relatórios com base flexível para cada empresa personalizar.",
  },
  {
    title: "Aurora IA integrada",
    text: "O Robô Aurora vai apoiar criação de serviços, decisões operacionais e leitura da operação em tempo real.",
  },
];

export default function AuroraMotoristasPage() {
  return (
    <main style={styles.page}>
      <section style={styles.heroSection}>
        <div style={styles.heroGlowLeft} />
        <div style={styles.heroGlowRight} />

        <div style={styles.heroContent}>
          <div style={styles.eyebrow}>AURORA IA • SUPER APP MOTORISTAS</div>

          <h1 style={styles.heroTitle}>
            Gestão global de motoristas para empresas, locadoras e operações
            profissionais
          </h1>

          <p style={styles.heroText}>
            Estrutura completa para cadastro de motoristas, serviços por
            diária/hora/km, despesas, pagamentos, relatórios, GPS, auditoria e
            inteligência operacional com o Robô Aurora.
          </p>

          <div style={styles.heroActions}>
            <Link href="/motoristas/motoristas" style={styles.primaryButton}>
              Entrar no módulo Motoristas
            </Link>

            <Link href="/cadastro-geral" style={styles.secondaryButton}>
              Ir para cadastro geral
            </Link>
          </div>

          <div style={styles.warningBox}>
            Sistema em constante atualização. Algumas áreas deste módulo podem
            estar em implantação ou melhoria enquanto evoluímos a operação.
          </div>
        </div>
      </section>

      <section style={styles.highlightsSection}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionKicker}>VISÃO DO PROJETO</span>
          <h2 style={styles.sectionTitle}>
            Uma base mundial para operação de motoristas
          </h2>
          <p style={styles.sectionText}>
            Este módulo foi desenhado para crescer com segurança e permitir uso
            em operações pequenas, médias e grandes, com total liberdade de
            adaptação por empresa.
          </p>
        </div>

        <div style={styles.highlightsGrid}>
          {highlights.map((item) => (
            <article key={item.title} style={styles.highlightCard}>
              <h3 style={styles.highlightTitle}>{item.title}</h3>
              <p style={styles.highlightText}>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section style={styles.modulesSection}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionKicker}>MÓDULOS PRINCIPAIS</span>
          <h2 style={styles.sectionTitle}>Estrutura pronta para expansão</h2>
          <p style={styles.sectionText}>
            Cada área abaixo representa um bloco real do sistema. Vamos subir
            uma por uma com base sólida, mantendo o padrão premium da Aurora.
          </p>
        </div>

        <div style={styles.modulesGrid}>
          {moduleCards.map((card) => (
            <Link key={card.title} href={card.href} style={styles.moduleCard}>
              <div style={styles.moduleBadge}>{card.badge}</div>
              <h3 style={styles.moduleTitle}>{card.title}</h3>
              <p style={styles.moduleText}>{card.description}</p>
              <span style={styles.moduleLink}>Abrir área</span>
            </Link>
          ))}
        </div>
      </section>

      <section style={styles.featuresSection}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionKicker}>ESCOPO ESTRATÉGICO</span>
          <h2 style={styles.sectionTitle}>Tudo o que o app precisa sustentar</h2>
          <p style={styles.sectionText}>
            A base já está organizada para suportar operação, financeiro,
            inteligência e auditoria sem perder flexibilidade.
          </p>
        </div>

        <div style={styles.featureGrid}>
          {featureGroups.map((group) => (
            <article key={group.title} style={styles.featureCard}>
              <h3 style={styles.featureTitle}>{group.title}</h3>
              <p style={styles.featureDescription}>{group.description}</p>
              <ul style={styles.featureList}>
                {group.items.map((item) => (
                  <li key={item} style={styles.featureItem}>
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section style={styles.roboSection}>
        <div style={styles.roboCard}>
          <div style={styles.roboEyebrow}>ROBÔ AURORA</div>
          <h2 style={styles.roboTitle}>
            Inteligência prática para apoiar a operação
          </h2>
          <p style={styles.roboText}>
            O Robô Aurora será o assistente interno do módulo. Ele vai ajudar a
            criar serviços, confirmar ações, sugerir rotas, sinalizar risco,
            apontar inconsistências, recomendar decisões e facilitar o uso do
            sistema por quem está na operação do dia a dia.
          </p>

          <div style={styles.roboGrid}>
            <div style={styles.roboMiniCard}>
              <strong style={styles.roboMiniTitle}>Criação assistida</strong>
              <span style={styles.roboMiniText}>
                Abre serviço com menos cliques e mais padrão.
              </span>
            </div>

            <div style={styles.roboMiniCard}>
              <strong style={styles.roboMiniTitle}>Validação operacional</strong>
              <span style={styles.roboMiniText}>
                Ajuda a evitar erros antes da execução.
              </span>
            </div>

            <div style={styles.roboMiniCard}>
              <strong style={styles.roboMiniTitle}>Leitura da operação</strong>
              <span style={styles.roboMiniText}>
                Sinaliza atrasos, custos e desvios relevantes.
              </span>
            </div>

            <div style={styles.roboMiniCard}>
              <strong style={styles.roboMiniTitle}>Sugestões inteligentes</strong>
              <span style={styles.roboMiniText}>
                Rotas, decisões e próximos passos com base no contexto.
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #eef6ff 0%, #f8fbff 45%, #ffffff 100%)",
    color: "#0f172a",
    paddingBottom: 64,
  },

  heroSection: {
    position: "relative",
    overflow: "hidden",
    padding: "64px 20px 32px",
  },

  heroGlowLeft: {
    position: "absolute",
    top: -120,
    left: -120,
    width: 280,
    height: 280,
    borderRadius: "50%",
    background: "rgba(0, 157, 255, 0.18)",
    filter: "blur(40px)",
    pointerEvents: "none",
  },

  heroGlowRight: {
    position: "absolute",
    top: -80,
    right: -80,
    width: 260,
    height: 260,
    borderRadius: "50%",
    background: "rgba(59, 130, 246, 0.16)",
    filter: "blur(42px)",
    pointerEvents: "none",
  },

  heroContent: {
    position: "relative",
    maxWidth: 1180,
    margin: "0 auto",
    background: "rgba(255,255,255,0.82)",
    border: "1px solid rgba(148, 163, 184, 0.22)",
    borderRadius: 28,
    padding: "32px 24px",
    boxShadow: "0 20px 60px rgba(15, 23, 42, 0.08)",
    backdropFilter: "blur(10px)",
  },

  eyebrow: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 14px",
    borderRadius: 999,
    background: "rgba(2, 132, 199, 0.10)",
    color: "#0369a1",
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: "0.08em",
    marginBottom: 18,
  },

  heroTitle: {
    margin: 0,
    fontSize: "clamp(2rem, 4vw, 4rem)",
    lineHeight: 1.04,
    fontWeight: 900,
    maxWidth: 980,
    letterSpacing: "-0.04em",
  },

  heroText: {
    marginTop: 18,
    marginBottom: 0,
    fontSize: "1.08rem",
    lineHeight: 1.75,
    color: "#334155",
    maxWidth: 920,
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
    minHeight: 52,
    padding: "0 22px",
    borderRadius: 16,
    background: "linear-gradient(135deg, #0284c7 0%, #2563eb 100%)",
    color: "#ffffff",
    textDecoration: "none",
    fontWeight: 800,
    boxShadow: "0 14px 30px rgba(37, 99, 235, 0.24)",
  },

  secondaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
    padding: "0 22px",
    borderRadius: 16,
    background: "#ffffff",
    color: "#0f172a",
    textDecoration: "none",
    fontWeight: 800,
    border: "1px solid rgba(148, 163, 184, 0.35)",
  },

  warningBox: {
    marginTop: 22,
    padding: "14px 16px",
    borderRadius: 16,
    background: "rgba(14, 165, 233, 0.08)",
    border: "1px solid rgba(14, 165, 233, 0.18)",
    color: "#0f172a",
    lineHeight: 1.6,
    fontSize: 14,
    fontWeight: 600,
  },

  highlightsSection: {
    maxWidth: 1180,
    margin: "0 auto",
    padding: "18px 20px 8px",
  },

  sectionHeader: {
    maxWidth: 860,
    marginBottom: 22,
  },

  sectionKicker: {
    display: "inline-block",
    marginBottom: 8,
    color: "#0284c7",
    fontWeight: 800,
    letterSpacing: "0.08em",
    fontSize: 12,
  },

  sectionTitle: {
    margin: 0,
    fontSize: "clamp(1.7rem, 3vw, 2.6rem)",
    lineHeight: 1.1,
    fontWeight: 900,
    letterSpacing: "-0.03em",
  },

  sectionText: {
    marginTop: 12,
    marginBottom: 0,
    color: "#475569",
    lineHeight: 1.75,
    fontSize: 16,
  },

  highlightsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 16,
  },

  highlightCard: {
    background: "#ffffff",
    borderRadius: 22,
    border: "1px solid rgba(148, 163, 184, 0.20)",
    padding: 20,
    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.05)",
  },

  highlightTitle: {
    margin: 0,
    fontSize: 18,
    fontWeight: 800,
  },

  highlightText: {
    marginTop: 10,
    marginBottom: 0,
    color: "#475569",
    lineHeight: 1.7,
    fontSize: 15,
  },

  modulesSection: {
    maxWidth: 1180,
    margin: "0 auto",
    padding: "28px 20px 8px",
  },

  modulesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 16,
  },

  moduleCard: {
    display: "block",
    textDecoration: "none",
    color: "inherit",
    background: "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
    borderRadius: 22,
    border: "1px solid rgba(148, 163, 184, 0.22)",
    padding: 20,
    boxShadow: "0 12px 34px rgba(15, 23, 42, 0.06)",
    transition: "transform 0.18s ease, box-shadow 0.18s ease",
  },

  moduleBadge: {
    display: "inline-flex",
    alignItems: "center",
    minHeight: 28,
    padding: "0 10px",
    borderRadius: 999,
    background: "rgba(37, 99, 235, 0.10)",
    color: "#1d4ed8",
    fontSize: 12,
    fontWeight: 800,
    marginBottom: 12,
  },

  moduleTitle: {
    margin: 0,
    fontSize: 19,
    fontWeight: 850,
  },

  moduleText: {
    marginTop: 10,
    marginBottom: 0,
    color: "#475569",
    lineHeight: 1.7,
    fontSize: 15,
  },

  moduleLink: {
    display: "inline-block",
    marginTop: 16,
    color: "#0284c7",
    fontWeight: 800,
  },

  featuresSection: {
    maxWidth: 1180,
    margin: "0 auto",
    padding: "28px 20px 8px",
  },

  featureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 16,
  },

  featureCard: {
    background: "#ffffff",
    borderRadius: 22,
    border: "1px solid rgba(148, 163, 184, 0.20)",
    padding: 22,
    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.05)",
  },

  featureTitle: {
    margin: 0,
    fontSize: 20,
    fontWeight: 850,
  },

  featureDescription: {
    marginTop: 10,
    marginBottom: 14,
    color: "#475569",
    lineHeight: 1.7,
    fontSize: 15,
  },

  featureList: {
    margin: 0,
    paddingLeft: 18,
    color: "#0f172a",
  },

  featureItem: {
    marginBottom: 8,
    lineHeight: 1.6,
    fontSize: 15,
  },

  roboSection: {
    maxWidth: 1180,
    margin: "0 auto",
    padding: "28px 20px 0",
  },

  roboCard: {
    background: "linear-gradient(135deg, #082f49 0%, #0f172a 60%, #172554 100%)",
    color: "#e2e8f0",
    borderRadius: 28,
    padding: "28px 22px",
    boxShadow: "0 24px 60px rgba(2, 6, 23, 0.28)",
  },

  roboEyebrow: {
    display: "inline-block",
    color: "#7dd3fc",
    fontWeight: 800,
    letterSpacing: "0.08em",
    fontSize: 12,
    marginBottom: 10,
  },

  roboTitle: {
    margin: 0,
    fontSize: "clamp(1.6rem, 3vw, 2.5rem)",
    lineHeight: 1.08,
    fontWeight: 900,
    letterSpacing: "-0.03em",
  },

  roboText: {
    marginTop: 14,
    marginBottom: 0,
    color: "#cbd5e1",
    lineHeight: 1.75,
    maxWidth: 950,
    fontSize: 16,
  },

  roboGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 14,
    marginTop: 22,
  },

  roboMiniCard: {
    borderRadius: 18,
    padding: 18,
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(125, 211, 252, 0.16)",
  },

  roboMiniTitle: {
    display: "block",
    fontSize: 16,
    fontWeight: 800,
    color: "#ffffff",
    marginBottom: 8,
  },

  roboMiniText: {
    display: "block",
    color: "#cbd5e1",
    lineHeight: 1.65,
    fontSize: 14,
  },
};