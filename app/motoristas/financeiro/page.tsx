import Link from "next/link";

export const metadata = {
  title: "Financeiro | Aurora Motoristas",
  description:
    "Controle financeiro premium do Super App Aurora Motoristas com receitas, despesas, resultado por locadora, cliente, motorista e serviço.",
};

const summaryCards = [
  {
    label: "Receita total",
    value: "R$ 86.450,00",
    detail: "Serviços faturados no período",
  },
  {
    label: "Despesas totais",
    value: "R$ 24.980,00",
    detail: "Custos operacionais lançados",
  },
  {
    label: "Resultado operacional",
    value: "R$ 61.470,00",
    detail: "Margem parcial consolidada",
  },
  {
    label: "Pagamentos pendentes",
    value: "R$ 11.920,00",
    detail: "Motoristas e repasses aguardando baixa",
  },
];

const receitas = [
  {
    id: "REC-0001",
    origem: "Locadora Horizonte",
    cliente: "Cliente Executivo BH",
    motorista: "Carlos Henrique Almeida",
    servico: "Transfer executivo aeroporto",
    tipo: "Receita por cliente",
    valor: "R$ 2.450,00",
    data: "10/04/2026",
    status: "Recebido",
  },
  {
    id: "REC-0002",
    origem: "Aurora Locadoras Premium",
    cliente: "Operação Eventos SP",
    motorista: "Rogério Matos Silva",
    servico: "Diária corporativa",
    tipo: "Receita por locadora",
    valor: "R$ 4.800,00",
    data: "09/04/2026",
    status: "A receber",
  },
  {
    id: "REC-0003",
    origem: "Grupo Executivo Mobilidade",
    cliente: "Contrato Corporativo Nacional",
    motorista: "Transporte Águia Executiva LTDA",
    servico: "Operação mensal dedicada",
    tipo: "Receita por contrato",
    valor: "R$ 18.900,00",
    data: "08/04/2026",
    status: "Recebido parcial",
  },
];

const despesas = [
  {
    id: "DES-0001",
    grupo: "Combustível",
    locadora: "Locadora Horizonte",
    cliente: "Cliente Executivo BH",
    motorista: "Carlos Henrique Almeida",
    servico: "Transfer executivo aeroporto",
    valor: "R$ 320,00",
    data: "10/04/2026",
    status: "Pago",
  },
  {
    id: "DES-0002",
    grupo: "Pedágio",
    locadora: "Aurora Locadoras Premium",
    cliente: "Operação Eventos SP",
    motorista: "Rogério Matos Silva",
    servico: "Diária corporativa",
    valor: "R$ 86,40",
    data: "09/04/2026",
    status: "Pago",
  },
  {
    id: "DES-0003",
    grupo: "Repasse motorista",
    locadora: "Grupo Executivo Mobilidade",
    cliente: "Contrato Corporativo Nacional",
    motorista: "Transporte Águia Executiva LTDA",
    servico: "Operação mensal dedicada",
    valor: "R$ 6.500,00",
    data: "08/04/2026",
    status: "Pendente",
  },
];

const visoes = [
  {
    title: "Por locadora",
    description:
      "Fechamento de receita, despesa, margem, repasse e saldo por empresa locadora.",
    items: [
      "Locadora Horizonte",
      "Aurora Locadoras Premium",
      "Grupo Executivo Mobilidade",
    ],
  },
  {
    title: "Por cliente",
    description:
      "Leitura financeira isolada de cada cliente, contrato ou centro de operação.",
    items: [
      "Cliente Executivo BH",
      "Operação Eventos SP",
      "Contrato Corporativo Nacional",
    ],
  },
  {
    title: "Por motorista",
    description:
      "Resultado individual com foco em produção, custo, repasse e eficiência.",
    items: [
      "Carlos Henrique Almeida",
      "Rogério Matos Silva",
      "Transporte Águia Executiva LTDA",
    ],
  },
  {
    title: "Por serviço",
    description:
      "Comparação entre tipos de serviço, rotas, diárias, horas, km e pacotes fechados.",
    items: [
      "Transfer executivo aeroporto",
      "Diária corporativa",
      "Operação mensal dedicada",
    ],
  },
];

const indicadores = [
  {
    title: "Receita por locadora",
    value: "R$ 43.200,00",
    note: "Consolidado das empresas locadoras vinculadas",
  },
  {
    title: "Receita por cliente",
    value: "R$ 29.540,00",
    note: "Contratos e demandas do cliente final",
  },
  {
    title: "Despesa por motorista",
    value: "R$ 12.780,00",
    note: "Custos e repasses diretamente atribuídos",
  },
  {
    title: "Resultado por serviço",
    value: "R$ 18.960,00",
    note: "Margem operacional apurada por execução",
  },
];

function getStatusStyle(status: string): React.CSSProperties {
  if (status === "Recebido" || status === "Pago") {
    return {
      background: "rgba(16, 185, 129, 0.12)",
      color: "#047857",
      border: "1px solid rgba(16, 185, 129, 0.22)",
    };
  }

  if (status === "A receber" || status === "Pendente") {
    return {
      background: "rgba(245, 158, 11, 0.12)",
      color: "#b45309",
      border: "1px solid rgba(245, 158, 11, 0.22)",
    };
  }

  return {
    background: "rgba(37, 99, 235, 0.10)",
    color: "#1d4ed8",
    border: "1px solid rgba(37, 99, 235, 0.18)",
  };
}

export default function FinanceiroMotoristasPage() {
  return (
    <main style={styles.page}>
      <section style={styles.heroSection}>
        <div style={styles.heroGlowLeft} />
        <div style={styles.heroGlowRight} />

        <div style={styles.heroCard}>
          <div style={styles.heroTop}>
            <div style={styles.heroTextBlock}>
              <div style={styles.eyebrow}>AURORA MOTORISTAS • FINANCEIRO</div>
              <h1 style={styles.heroTitle}>
                Controle financeiro impecável por locadora, cliente, motorista e
                serviço
              </h1>
              <p style={styles.heroText}>
                Esta área organiza receitas, despesas, margens, repasses,
                pagamentos pendentes e leitura operacional para que a gestão do
                motorista seja realmente profissional, escalável e segura.
              </p>
            </div>

            <div style={styles.heroActions}>
              <Link href="/motoristas/motoristas" style={styles.secondaryButton}>
                Ver motoristas
              </Link>
              <Link href="/motoristas/motoristas/novo" style={styles.primaryButton}>
                Novo cadastro
              </Link>
            </div>
          </div>

          <div style={styles.noticeBox}>
            Sistema em constante atualização. A base visual foi preparada para
            receber integração real com banco, exportação, filtros avançados e
            auditoria sem quebrar a produção.
          </div>
        </div>
      </section>

      <section style={styles.summarySection}>
        <div style={styles.summaryGrid}>
          {summaryCards.map((card) => (
            <article key={card.label} style={styles.summaryCard}>
              <span style={styles.summaryLabel}>{card.label}</span>
              <strong style={styles.summaryValue}>{card.value}</strong>
              <span style={styles.summaryDetail}>{card.detail}</span>
            </article>
          ))}
        </div>
      </section>

      <section style={styles.contentSection}>
        <div style={styles.mainGrid}>
          <div style={styles.leftColumn}>
            <div style={styles.panelCard}>
              <div style={styles.sectionHeader}>
                <div>
                  <span style={styles.sectionKicker}>VISÃO ESTRATÉGICA</span>
                  <h2 style={styles.sectionTitle}>Fechamento por camada</h2>
                </div>
              </div>

              <div style={styles.visionGrid}>
                {visoes.map((visao) => (
                  <article key={visao.title} style={styles.visionCard}>
                    <h3 style={styles.visionTitle}>{visao.title}</h3>
                    <p style={styles.visionDescription}>{visao.description}</p>
                    <ul style={styles.visionList}>
                      {visao.items.map((item) => (
                        <li key={item} style={styles.visionItem}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </div>

            <div style={styles.panelCard}>
              <div style={styles.sectionHeader}>
                <div>
                  <span style={styles.sectionKicker}>RECEITAS</span>
                  <h2 style={styles.sectionTitle}>Lançamentos de entrada</h2>
                </div>
              </div>

              <div style={styles.tableLikeList}>
                {receitas.map((item) => (
                  <article key={item.id} style={styles.financeCard}>
                    <div style={styles.financeTop}>
                      <div>
                        <h3 style={styles.financeTitle}>{item.servico}</h3>
                        <p style={styles.financeSubline}>
                          {item.id} • {item.tipo} • {item.data}
                        </p>
                      </div>

                      <div style={styles.financeTopRight}>
                        <strong style={styles.moneyValuePositive}>{item.valor}</strong>
                        <span style={{ ...styles.badge, ...getStatusStyle(item.status) }}>
                          {item.status}
                        </span>
                      </div>
                    </div>

                    <div style={styles.financeGrid}>
                      <div style={styles.dataItem}>
                        <span style={styles.dataLabel}>Locadora / origem</span>
                        <strong style={styles.dataValue}>{item.origem}</strong>
                      </div>

                      <div style={styles.dataItem}>
                        <span style={styles.dataLabel}>Cliente</span>
                        <strong style={styles.dataValue}>{item.cliente}</strong>
                      </div>

                      <div style={styles.dataItemWide}>
                        <span style={styles.dataLabel}>Motorista</span>
                        <strong style={styles.dataValue}>{item.motorista}</strong>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div style={styles.panelCard}>
              <div style={styles.sectionHeader}>
                <div>
                  <span style={styles.sectionKicker}>DESPESAS</span>
                  <h2 style={styles.sectionTitle}>Saídas e custos operacionais</h2>
                </div>
              </div>

              <div style={styles.tableLikeList}>
                {despesas.map((item) => (
                  <article key={item.id} style={styles.financeCard}>
                    <div style={styles.financeTop}>
                      <div>
                        <h3 style={styles.financeTitle}>{item.grupo}</h3>
                        <p style={styles.financeSubline}>
                          {item.id} • {item.servico} • {item.data}
                        </p>
                      </div>

                      <div style={styles.financeTopRight}>
                        <strong style={styles.moneyValueNegative}>{item.valor}</strong>
                        <span style={{ ...styles.badge, ...getStatusStyle(item.status) }}>
                          {item.status}
                        </span>
                      </div>
                    </div>

                    <div style={styles.financeGrid}>
                      <div style={styles.dataItem}>
                        <span style={styles.dataLabel}>Locadora</span>
                        <strong style={styles.dataValue}>{item.locadora}</strong>
                      </div>

                      <div style={styles.dataItem}>
                        <span style={styles.dataLabel}>Cliente</span>
                        <strong style={styles.dataValue}>{item.cliente}</strong>
                      </div>

                      <div style={styles.dataItem}>
                        <span style={styles.dataLabel}>Motorista</span>
                        <strong style={styles.dataValue}>{item.motorista}</strong>
                      </div>

                      <div style={styles.dataItem}>
                        <span style={styles.dataLabel}>Status</span>
                        <strong style={styles.dataValue}>{item.status}</strong>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <aside style={styles.rightColumn}>
            <div style={styles.sidebarCard}>
              <span style={styles.sectionKicker}>INDICADORES</span>
              <h2 style={styles.sidebarTitle}>Leitura premium da operação</h2>

              <div style={styles.indicatorList}>
                {indicadores.map((item) => (
                  <div key={item.title} style={styles.indicatorCard}>
                    <strong style={styles.indicatorTitle}>{item.title}</strong>
                    <span style={styles.indicatorValue}>{item.value}</span>
                    <span style={styles.indicatorNote}>{item.note}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.sidebarCard}>
              <span style={styles.sectionKicker}>REGRAS DE CONTROLE</span>
              <h2 style={styles.sidebarTitle}>Base obrigatória do financeiro</h2>

              <ul style={styles.ruleList}>
                <li style={styles.ruleItem}>Receita deve poder ser lida por locadora e cliente.</li>
                <li style={styles.ruleItem}>Despesa deve poder ser atribuída por serviço.</li>
                <li style={styles.ruleItem}>Repasse ao motorista precisa ficar auditável.</li>
                <li style={styles.ruleItem}>Pagamentos concluídos saem da visão operacional ativa.</li>
                <li style={styles.ruleItem}>Resultado por motorista deve ser comparável no período.</li>
                <li style={styles.ruleItem}>Campos financeiros precisam ser editáveis por empresa.</li>
              </ul>
            </div>

            <div style={styles.sidebarCardDark}>
              <div style={styles.robotTag}>ROBÔ AURORA</div>
              <h2 style={styles.sidebarTitleDark}>Apoio inteligente ao fechamento</h2>
              <p style={styles.sidebarTextDark}>
                O Robô Aurora vai ajudar a identificar serviços com margem baixa,
                repasses pendentes, despesas acima do padrão e oportunidades de
                melhoria operacional por locadora, cliente ou motorista.
              </p>

              <div style={styles.robotMiniList}>
                <div style={styles.robotMiniItem}>Ler margem por serviço</div>
                <div style={styles.robotMiniItem}>Apontar despesa fora do padrão</div>
                <div style={styles.robotMiniItem}>Sugerir correção de preço</div>
                <div style={styles.robotMiniItem}>Alertar repasse pendente</div>
              </div>
            </div>

            <div style={styles.sidebarCard}>
              <span style={styles.sectionKicker}>NAVEGAÇÃO</span>
              <h2 style={styles.sidebarTitle}>Próximos blocos</h2>

              <div style={styles.navList}>
                <Link href="/motoristas/servicos" style={styles.navItem}>
                  Abrir serviços
                </Link>
                <Link href="/motoristas/pagamentos" style={styles.navItem}>
                  Abrir pagamentos
                </Link>
                <Link href="/motoristas/relatorios" style={styles.navItem}>
                  Abrir relatórios
                </Link>
                <Link href="/motoristas/robo-aurora" style={styles.navItem}>
                  Abrir Robô Aurora
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #eef6ff 0%, #f8fbff 36%, #ffffff 100%)",
    color: "#0f172a",
    paddingBottom: 56,
  },

  heroSection: {
    position: "relative",
    overflow: "hidden",
    padding: "34px 20px 16px",
  },

  heroGlowLeft: {
    position: "absolute",
    top: -120,
    left: -100,
    width: 260,
    height: 260,
    borderRadius: "50%",
    background: "rgba(14, 165, 233, 0.16)",
    filter: "blur(42px)",
    pointerEvents: "none",
  },

  heroGlowRight: {
    position: "absolute",
    top: -100,
    right: -100,
    width: 260,
    height: 260,
    borderRadius: "50%",
    background: "rgba(37, 99, 235, 0.16)",
    filter: "blur(44px)",
    pointerEvents: "none",
  },

  heroCard: {
    position: "relative",
    maxWidth: 1280,
    margin: "0 auto",
    background: "rgba(255,255,255,0.86)",
    border: "1px solid rgba(148, 163, 184, 0.22)",
    borderRadius: 28,
    padding: "28px 22px",
    boxShadow: "0 22px 60px rgba(15, 23, 42, 0.08)",
    backdropFilter: "blur(10px)",
  },

  heroTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: 18,
    flexWrap: "wrap",
    alignItems: "flex-start",
  },

  heroTextBlock: {
    maxWidth: 900,
  },

  eyebrow: {
    display: "inline-flex",
    alignItems: "center",
    minHeight: 30,
    padding: "0 14px",
    borderRadius: 999,
    background: "rgba(2, 132, 199, 0.10)",
    color: "#0369a1",
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: "0.08em",
    marginBottom: 16,
  },

  heroTitle: {
    margin: 0,
    fontSize: "clamp(1.9rem, 3.5vw, 3.2rem)",
    lineHeight: 1.06,
    fontWeight: 900,
    letterSpacing: "-0.04em",
    maxWidth: 940,
  },

  heroText: {
    marginTop: 16,
    marginBottom: 0,
    maxWidth: 920,
    color: "#475569",
    fontSize: 16,
    lineHeight: 1.8,
  },

  heroActions: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    minWidth: 220,
  },

  primaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
    padding: "0 18px",
    borderRadius: 16,
    textDecoration: "none",
    fontWeight: 800,
    color: "#ffffff",
    background: "linear-gradient(135deg, #0284c7 0%, #2563eb 100%)",
    boxShadow: "0 14px 30px rgba(37, 99, 235, 0.22)",
  },

  secondaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
    padding: "0 18px",
    borderRadius: 16,
    textDecoration: "none",
    fontWeight: 800,
    color: "#0f172a",
    background: "#ffffff",
    border: "1px solid rgba(148, 163, 184, 0.28)",
  },

  noticeBox: {
    marginTop: 20,
    padding: "14px 16px",
    borderRadius: 16,
    background: "rgba(14, 165, 233, 0.08)",
    border: "1px solid rgba(14, 165, 233, 0.18)",
    color: "#0f172a",
    lineHeight: 1.7,
    fontSize: 14,
    fontWeight: 600,
  },

  summarySection: {
    maxWidth: 1280,
    margin: "0 auto",
    padding: "8px 20px 4px",
  },

  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 14,
  },

  summaryCard: {
    background: "#ffffff",
    borderRadius: 22,
    border: "1px solid rgba(148, 163, 184, 0.18)",
    padding: 18,
    boxShadow: "0 10px 28px rgba(15, 23, 42, 0.05)",
  },

  summaryLabel: {
    display: "block",
    color: "#475569",
    fontSize: 14,
    fontWeight: 700,
  },

  summaryValue: {
    display: "block",
    marginTop: 8,
    fontSize: 30,
    lineHeight: 1,
    fontWeight: 900,
    letterSpacing: "-0.04em",
  },

  summaryDetail: {
    display: "block",
    marginTop: 8,
    color: "#0284c7",
    fontSize: 13,
    fontWeight: 700,
  },

  contentSection: {
    maxWidth: 1280,
    margin: "0 auto",
    padding: "16px 20px 0",
  },

  mainGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.6fr) minmax(320px, 0.85fr)",
    gap: 18,
  },

  leftColumn: {
    display: "flex",
    flexDirection: "column",
    gap: 18,
    minWidth: 0,
  },

  rightColumn: {
    display: "flex",
    flexDirection: "column",
    gap: 18,
    minWidth: 0,
  },

  panelCard: {
    background: "#ffffff",
    borderRadius: 24,
    border: "1px solid rgba(148, 163, 184, 0.18)",
    padding: 22,
    boxShadow: "0 12px 34px rgba(15, 23, 42, 0.05)",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 18,
    flexWrap: "wrap",
  },

  sectionKicker: {
    display: "inline-block",
    marginBottom: 8,
    color: "#0284c7",
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: "0.08em",
  },

  sectionTitle: {
    margin: 0,
    fontSize: 26,
    lineHeight: 1.08,
    fontWeight: 900,
    letterSpacing: "-0.03em",
  },

  visionGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
    gap: 14,
  },

  visionCard: {
    borderRadius: 18,
    padding: 16,
    background: "linear-gradient(180deg, #f8fbff 0%, #ffffff 100%)",
    border: "1px solid rgba(148, 163, 184, 0.16)",
  },

  visionTitle: {
    margin: 0,
    fontSize: 18,
    fontWeight: 850,
  },

  visionDescription: {
    marginTop: 10,
    marginBottom: 12,
    color: "#475569",
    lineHeight: 1.7,
    fontSize: 14,
  },

  visionList: {
    margin: 0,
    paddingLeft: 18,
    color: "#0f172a",
  },

  visionItem: {
    marginBottom: 8,
    lineHeight: 1.6,
    fontSize: 14,
  },

  tableLikeList: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },

  financeCard: {
    borderRadius: 22,
    padding: 18,
    background: "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
    border: "1px solid rgba(148, 163, 184, 0.18)",
    boxShadow: "0 10px 28px rgba(15, 23, 42, 0.04)",
  },

  financeTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
    alignItems: "flex-start",
  },

  financeTitle: {
    margin: 0,
    fontSize: 20,
    fontWeight: 900,
  },

  financeSubline: {
    marginTop: 8,
    marginBottom: 0,
    color: "#475569",
    lineHeight: 1.6,
    fontSize: 14,
    fontWeight: 600,
  },

  financeTopRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 8,
  },

  moneyValuePositive: {
    fontSize: 24,
    lineHeight: 1,
    fontWeight: 900,
    color: "#047857",
  },

  moneyValueNegative: {
    fontSize: 24,
    lineHeight: 1,
    fontWeight: 900,
    color: "#b91c1c",
  },

  badge: {
    display: "inline-flex",
    alignItems: "center",
    minHeight: 28,
    padding: "0 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
  },

  financeGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 12,
    marginTop: 16,
  },

  dataItem: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    padding: 14,
    borderRadius: 16,
    background: "#ffffff",
    border: "1px solid rgba(148, 163, 184, 0.16)",
  },

  dataItemWide: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    padding: 14,
    borderRadius: 16,
    background: "#ffffff",
    border: "1px solid rgba(148, 163, 184, 0.16)",
    gridColumn: "1 / -1",
  },

  dataLabel: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  },

  dataValue: {
    color: "#0f172a",
    fontSize: 15,
    lineHeight: 1.5,
    fontWeight: 800,
  },

  sidebarCard: {
    background: "#ffffff",
    borderRadius: 24,
    border: "1px solid rgba(148, 163, 184, 0.18)",
    padding: 20,
    boxShadow: "0 12px 34px rgba(15, 23, 42, 0.05)",
  },

  sidebarCardDark: {
    background: "linear-gradient(135deg, #082f49 0%, #0f172a 58%, #172554 100%)",
    borderRadius: 24,
    padding: 20,
    boxShadow: "0 20px 50px rgba(2, 6, 23, 0.24)",
  },

  sidebarTitle: {
    margin: 0,
    fontSize: 24,
    lineHeight: 1.08,
    fontWeight: 900,
    letterSpacing: "-0.03em",
    color: "#0f172a",
  },

  sidebarTitleDark: {
    margin: 0,
    fontSize: 24,
    lineHeight: 1.08,
    fontWeight: 900,
    letterSpacing: "-0.03em",
    color: "#ffffff",
  },

  indicatorList: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    marginTop: 16,
  },

  indicatorCard: {
    borderRadius: 18,
    padding: 16,
    background: "linear-gradient(180deg, #f8fbff 0%, #ffffff 100%)",
    border: "1px solid rgba(148, 163, 184, 0.16)",
  },

  indicatorTitle: {
    display: "block",
    fontSize: 15,
    fontWeight: 850,
    color: "#0f172a",
  },

  indicatorValue: {
    display: "block",
    marginTop: 8,
    fontSize: 22,
    lineHeight: 1.1,
    fontWeight: 900,
    color: "#0284c7",
  },

  indicatorNote: {
    display: "block",
    marginTop: 8,
    color: "#475569",
    fontSize: 13,
    lineHeight: 1.55,
  },

  ruleList: {
    margin: "16px 0 0",
    paddingLeft: 18,
    color: "#0f172a",
  },

  ruleItem: {
    marginBottom: 10,
    lineHeight: 1.7,
    fontSize: 14,
  },

  robotTag: {
    display: "inline-block",
    marginBottom: 10,
    color: "#7dd3fc",
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: "0.08em",
  },

  sidebarTextDark: {
    marginTop: 12,
    marginBottom: 0,
    color: "#cbd5e1",
    lineHeight: 1.75,
    fontSize: 15,
  },

  robotMiniList: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
    marginTop: 18,
  },

  robotMiniItem: {
    padding: "12px 14px",
    borderRadius: 14,
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(125, 211, 252, 0.16)",
    color: "#e2e8f0",
    fontSize: 13,
    fontWeight: 700,
    lineHeight: 1.5,
  },

  navList: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginTop: 16,
  },

  navItem: {
    display: "block",
    textDecoration: "none",
    color: "#0f172a",
    fontWeight: 800,
    padding: "12px 14px",
    borderRadius: 14,
    background: "linear-gradient(180deg, #f8fbff 0%, #ffffff 100%)",
    border: "1px solid rgba(148, 163, 184, 0.16)",
  },
};