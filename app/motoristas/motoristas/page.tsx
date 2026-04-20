import Link from "next/link";

export const metadata = {
  title: "Motoristas | Aurora Motoristas",
  description:
    "Cadastro e gestão de motoristas com foto obrigatória, documentos, status operacional, vínculo, financeiro e histórico dentro do Super App Aurora Motoristas.",
};

const quickStats = [
  {
    label: "Motoristas ativos",
    value: "128",
    detail: "Base operacional online",
  },
  {
    label: "Com foto validada",
    value: "121",
    detail: "Identificação reforçada",
  },
  {
    label: "Em análise",
    value: "9",
    detail: "Aguardando conferência",
  },
  {
    label: "Disponíveis hoje",
    value: "84",
    detail: "Prontos para operação",
  },
];

const drivers = [
  {
    id: "MOT-0001",
    nome: "Carlos Henrique Almeida",
    empresa: "Locadora Horizonte",
    cliente: "Cliente Executivo BH",
    tipoCadastro: "CPF",
    documento: "CPF informado",
    status: "Ativo",
    disponibilidade: "Disponível",
    categoria: "Executivo / Diária",
    cidade: "Belo Horizonte - MG",
    telefone: "(31) 99888-1101",
    email: "carlos.henrique@aurora.local",
    foto: "Obrigatória",
    veiculo: "Toyota Corolla 2023",
    financeiro: "Receita e despesa por cliente",
  },
  {
    id: "MOT-0002",
    nome: "Rogério Matos Silva",
    empresa: "Aurora Locadoras Premium",
    cliente: "Operação Aeroporto Confins",
    tipoCadastro: "CPF",
    documento: "CPF informado",
    status: "Em análise",
    disponibilidade: "Parcial",
    categoria: "Hora / Transfer",
    cidade: "Lagoa Santa - MG",
    telefone: "(31) 99777-2202",
    email: "rogerio.matos@aurora.local",
    foto: "Pendente",
    veiculo: "Spin LT 2022",
    financeiro: "Receita por locadora",
  },
  {
    id: "MOT-0003",
    nome: "Transporte Águia Executiva LTDA",
    empresa: "Grupo Executivo Mobilidade",
    cliente: "Contrato Corporativo",
    tipoCadastro: "CNPJ",
    documento: "CNPJ informado",
    status: "Ativo",
    disponibilidade: "Em serviço",
    categoria: "KM / Atendimento empresarial",
    cidade: "São Paulo - SP",
    telefone: "(11) 98888-3303",
    email: "operacao@aguiaexecutiva.local",
    foto: "Obrigatória",
    veiculo: "Van Mercedes Sprinter",
    financeiro: "Receita e despesa por contrato",
  },
];

const sections = [
  {
    title: "Identificação principal",
    text: "Nome, CPF/CNPJ, foto obrigatória, telefone, e-mail, documentos e status geral do motorista ou empresa de motoristas.",
  },
  {
    title: "Operação e disponibilidade",
    text: "Situação operacional, tipo de serviço aceito, escala, região de atendimento, turnos, disponibilidade e vínculo com locadora ou cliente.",
  },
  {
    title: "Financeiro por relação",
    text: "Receitas e despesas separadas por locadora, cliente, contrato, serviço e motorista para um controle impecável da operação.",
  },
  {
    title: "Auditoria e histórico",
    text: "Toda alteração importante poderá ser auditada depois: cadastro, confirmação, cancelamento, pagamento, baixa e observações internas.",
  },
];

const actions = [
  {
    title: "Novo motorista",
    href: "/motoristas/motoristas/novo",
    description:
      "Abrir formulário completo com foto obrigatória, CPF/CNPJ, contato, vínculo, documentos e status.",
  },
  {
    title: "Ver serviços",
    href: "/motoristas/servicos",
    description:
      "Acompanhar serviços criados, aceitos, em andamento, cancelados ou concluídos.",
  },
  {
    title: "Financeiro",
    href: "/motoristas/financeiro",
    description:
      "Abrir a visão de receitas e despesas por locadora, cliente, serviço e motorista.",
  },
  {
    title: "Robô Aurora",
    href: "/motoristas/robo-aurora",
    description:
      "Usar a camada inteligente para apoiar decisões e automatizar rotinas operacionais.",
  },
];

function getStatusStyle(status: string): React.CSSProperties {
  if (status === "Ativo") {
    return {
      background: "rgba(16, 185, 129, 0.12)",
      color: "#047857",
      border: "1px solid rgba(16, 185, 129, 0.22)",
    };
  }

  if (status === "Em análise") {
    return {
      background: "rgba(245, 158, 11, 0.12)",
      color: "#b45309",
      border: "1px solid rgba(245, 158, 11, 0.22)",
    };
  }

  return {
    background: "rgba(148, 163, 184, 0.12)",
    color: "#475569",
    border: "1px solid rgba(148, 163, 184, 0.22)",
  };
}

function getAvailabilityStyle(value: string): React.CSSProperties {
  if (value === "Disponível") {
    return {
      background: "rgba(37, 99, 235, 0.10)",
      color: "#1d4ed8",
      border: "1px solid rgba(37, 99, 235, 0.18)",
    };
  }

  if (value === "Em serviço") {
    return {
      background: "rgba(139, 92, 246, 0.10)",
      color: "#6d28d9",
      border: "1px solid rgba(139, 92, 246, 0.18)",
    };
  }

  return {
    background: "rgba(14, 165, 233, 0.10)",
    color: "#0369a1",
    border: "1px solid rgba(14, 165, 233, 0.18)",
  };
}

export default function MotoristasPage() {
  return (
    <main style={styles.page}>
      <section style={styles.heroSection}>
        <div style={styles.heroGlowLeft} />
        <div style={styles.heroGlowRight} />

        <div style={styles.heroCard}>
          <div style={styles.heroTop}>
            <div>
              <div style={styles.eyebrow}>AURORA MOTORISTAS • CADASTRO CENTRAL</div>
              <h1 style={styles.heroTitle}>
                Gestão de motoristas com foto obrigatória, vínculo operacional e
                controle financeiro completo
              </h1>
              <p style={styles.heroText}>
                Esta área organiza motoristas, empresas, documentos,
                disponibilidade, rastreio operacional e futuro fechamento
                financeiro por locadora, cliente, serviço e período.
              </p>
            </div>

            <div style={styles.heroActions}>
              <Link href="/motoristas/motoristas/novo" style={styles.primaryButton}>
                Cadastrar motorista
              </Link>

              <Link href="/motoristas" style={styles.secondaryButton}>
                Voltar ao módulo
              </Link>
            </div>
          </div>

          <div style={styles.noticeBox}>
            Foto obrigatória, trilha operacional e estrutura financeira por
            locadora/cliente fazem parte da base oficial deste sistema. O app
            está em constante atualização e pode ter momentos de instabilidade
            durante melhorias.
          </div>
        </div>
      </section>

      <section style={styles.statsSection}>
        <div style={styles.statsGrid}>
          {quickStats.map((item) => (
            <article key={item.label} style={styles.statCard}>
              <span style={styles.statLabel}>{item.label}</span>
              <strong style={styles.statValue}>{item.value}</strong>
              <span style={styles.statDetail}>{item.detail}</span>
            </article>
          ))}
        </div>
      </section>

      <section style={styles.contentSection}>
        <div style={styles.mainGrid}>
          <div style={styles.leftColumn}>
            <div style={styles.sectionCard}>
              <div style={styles.sectionHeader}>
                <div>
                  <span style={styles.sectionKicker}>VISTA GERAL</span>
                  <h2 style={styles.sectionTitle}>Estrutura do cadastro de motoristas</h2>
                </div>
              </div>

              <div style={styles.sectionList}>
                {sections.map((section) => (
                  <article key={section.title} style={styles.infoCard}>
                    <h3 style={styles.infoTitle}>{section.title}</h3>
                    <p style={styles.infoText}>{section.text}</p>
                  </article>
                ))}
              </div>
            </div>

            <div style={styles.sectionCard}>
              <div style={styles.sectionHeader}>
                <div>
                  <span style={styles.sectionKicker}>BASE OPERACIONAL</span>
                  <h2 style={styles.sectionTitle}>Motoristas cadastrados</h2>
                </div>
              </div>

              <div style={styles.driverList}>
                {drivers.map((driver) => (
                  <article key={driver.id} style={styles.driverCard}>
                    <div style={styles.driverTop}>
                      <div style={styles.avatarCircle}>
                        {driver.nome.slice(0, 1).toUpperCase()}
                      </div>

                      <div style={styles.driverTopText}>
                        <div style={styles.driverNameRow}>
                          <h3 style={styles.driverName}>{driver.nome}</h3>
                          <span style={{ ...styles.badge, ...getStatusStyle(driver.status) }}>
                            {driver.status}
                          </span>
                          <span
                            style={{
                              ...styles.badge,
                              ...getAvailabilityStyle(driver.disponibilidade),
                            }}
                          >
                            {driver.disponibilidade}
                          </span>
                        </div>

                        <p style={styles.driverSubline}>
                          {driver.id} • {driver.tipoCadastro} • {driver.categoria}
                        </p>
                      </div>
                    </div>

                    <div style={styles.driverGrid}>
                      <div style={styles.dataItem}>
                        <span style={styles.dataLabel}>Locadora / empresa</span>
                        <strong style={styles.dataValue}>{driver.empresa}</strong>
                      </div>

                      <div style={styles.dataItem}>
                        <span style={styles.dataLabel}>Cliente principal</span>
                        <strong style={styles.dataValue}>{driver.cliente}</strong>
                      </div>

                      <div style={styles.dataItem}>
                        <span style={styles.dataLabel}>Documento</span>
                        <strong style={styles.dataValue}>{driver.documento}</strong>
                      </div>

                      <div style={styles.dataItem}>
                        <span style={styles.dataLabel}>Telefone</span>
                        <strong style={styles.dataValue}>{driver.telefone}</strong>
                      </div>

                      <div style={styles.dataItem}>
                        <span style={styles.dataLabel}>E-mail</span>
                        <strong style={styles.dataValue}>{driver.email}</strong>
                      </div>

                      <div style={styles.dataItem}>
                        <span style={styles.dataLabel}>Cidade</span>
                        <strong style={styles.dataValue}>{driver.cidade}</strong>
                      </div>

                      <div style={styles.dataItem}>
                        <span style={styles.dataLabel}>Foto</span>
                        <strong style={styles.dataValue}>{driver.foto}</strong>
                      </div>

                      <div style={styles.dataItem}>
                        <span style={styles.dataLabel}>Veículo / apoio</span>
                        <strong style={styles.dataValue}>{driver.veiculo}</strong>
                      </div>

                      <div style={styles.dataItemWide}>
                        <span style={styles.dataLabel}>Controle financeiro</span>
                        <strong style={styles.dataValue}>{driver.financeiro}</strong>
                      </div>
                    </div>

                    <div style={styles.driverActions}>
                      <Link href="/motoristas/motoristas/novo" style={styles.inlineActionPrimary}>
                        Editar cadastro
                      </Link>

                      <Link href="/motoristas/servicos" style={styles.inlineActionSecondary}>
                        Ver serviços
                      </Link>

                      <Link href="/motoristas/financeiro" style={styles.inlineActionSecondary}>
                        Ver financeiro
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <aside style={styles.rightColumn}>
            <div style={styles.sidebarCard}>
              <span style={styles.sectionKicker}>AÇÕES RÁPIDAS</span>
              <h2 style={styles.sidebarTitle}>Navegação da operação</h2>

              <div style={styles.actionList}>
                {actions.map((action) => (
                  <Link key={action.title} href={action.href} style={styles.actionCard}>
                    <strong style={styles.actionTitle}>{action.title}</strong>
                    <span style={styles.actionText}>{action.description}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div style={styles.sidebarCard}>
              <span style={styles.sectionKicker}>REGRAS-CHAVE</span>
              <h2 style={styles.sidebarTitle}>Pontos obrigatórios do sistema</h2>

              <ul style={styles.ruleList}>
                <li style={styles.ruleItem}>Foto do motorista deve ser obrigatória no fluxo real.</li>
                <li style={styles.ruleItem}>CPF/CNPJ será aceito conforme perfil operacional.</li>
                <li style={styles.ruleItem}>Campos devem permanecer totalmente editáveis.</li>
                <li style={styles.ruleItem}>
                  Receitas e despesas terão leitura por locadora e/ou cliente.
                </li>
                <li style={styles.ruleItem}>
                  Pagamentos concluídos devem sair da visão operacional do motorista e ficar protegidos no histórico interno.
                </li>
                <li style={styles.ruleItem}>
                  Auditoria precisa registrar alterações relevantes da operação.
                </li>
              </ul>
            </div>

            <div style={styles.sidebarCardDark}>
              <div style={styles.robotTag}>ROBÔ AURORA</div>
              <h2 style={styles.sidebarTitleDark}>Apoio inteligente da operação</h2>
              <p style={styles.sidebarTextDark}>
                O Robô Aurora vai ajudar o operador a cadastrar serviços,
                confirmar aceite, alertar inconsistências, sugerir rotas e apoiar
                decisões com base no contexto da operação.
              </p>

              <div style={styles.robotMiniList}>
                <div style={styles.robotMiniItem}>Criar serviço assistido</div>
                <div style={styles.robotMiniItem}>Confirmar operação</div>
                <div style={styles.robotMiniItem}>Sugerir rota</div>
                <div style={styles.robotMiniItem}>Ler riscos e atrasos</div>
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
      "linear-gradient(180deg, #eef6ff 0%, #f8fbff 38%, #ffffff 100%)",
    color: "#0f172a",
    paddingBottom: 56,
  },

  heroSection: {
    position: "relative",
    overflow: "hidden",
    padding: "36px 20px 16px",
  },

  heroGlowLeft: {
    position: "absolute",
    top: -100,
    left: -120,
    width: 260,
    height: 260,
    borderRadius: "50%",
    background: "rgba(14, 165, 233, 0.16)",
    filter: "blur(42px)",
    pointerEvents: "none",
  },

  heroGlowRight: {
    position: "absolute",
    top: -80,
    right: -110,
    width: 260,
    height: 260,
    borderRadius: "50%",
    background: "rgba(37, 99, 235, 0.16)",
    filter: "blur(44px)",
    pointerEvents: "none",
  },

  heroCard: {
    position: "relative",
    maxWidth: 1220,
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
    fontSize: "clamp(1.9rem, 3.5vw, 3.4rem)",
    lineHeight: 1.06,
    fontWeight: 900,
    letterSpacing: "-0.04em",
    maxWidth: 860,
  },

  heroText: {
    marginTop: 16,
    marginBottom: 0,
    maxWidth: 880,
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

  statsSection: {
    maxWidth: 1220,
    margin: "0 auto",
    padding: "8px 20px 6px",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 14,
  },

  statCard: {
    background: "#ffffff",
    borderRadius: 22,
    border: "1px solid rgba(148, 163, 184, 0.18)",
    padding: 18,
    boxShadow: "0 10px 28px rgba(15, 23, 42, 0.05)",
  },

  statLabel: {
    display: "block",
    color: "#475569",
    fontSize: 14,
    fontWeight: 700,
  },

  statValue: {
    display: "block",
    marginTop: 8,
    fontSize: 32,
    lineHeight: 1,
    fontWeight: 900,
    letterSpacing: "-0.04em",
  },

  statDetail: {
    display: "block",
    marginTop: 8,
    color: "#0284c7",
    fontSize: 13,
    fontWeight: 700,
  },

  contentSection: {
    maxWidth: 1220,
    margin: "0 auto",
    padding: "16px 20px 0",
  },

  mainGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.5fr) minmax(300px, 0.8fr)",
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

  sectionCard: {
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

  sectionList: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 14,
  },

  infoCard: {
    borderRadius: 18,
    padding: 16,
    background: "linear-gradient(180deg, #f8fbff 0%, #ffffff 100%)",
    border: "1px solid rgba(148, 163, 184, 0.16)",
  },

  infoTitle: {
    margin: 0,
    fontSize: 17,
    fontWeight: 850,
  },

  infoText: {
    marginTop: 10,
    marginBottom: 0,
    color: "#475569",
    lineHeight: 1.7,
    fontSize: 14,
  },

  driverList: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },

  driverCard: {
    borderRadius: 22,
    padding: 18,
    background: "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
    border: "1px solid rgba(148, 163, 184, 0.18)",
    boxShadow: "0 10px 28px rgba(15, 23, 42, 0.04)",
  },

  driverTop: {
    display: "flex",
    alignItems: "flex-start",
    gap: 14,
  },

  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #0284c7 0%, #2563eb 100%)",
    color: "#ffffff",
    fontWeight: 900,
    fontSize: 22,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    boxShadow: "0 12px 26px rgba(37, 99, 235, 0.22)",
  },

  driverTopText: {
    flex: 1,
    minWidth: 0,
  },

  driverNameRow: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8,
  },

  driverName: {
    margin: 0,
    fontSize: 21,
    lineHeight: 1.15,
    fontWeight: 900,
  },

  driverSubline: {
    marginTop: 8,
    marginBottom: 0,
    color: "#475569",
    lineHeight: 1.6,
    fontSize: 14,
    fontWeight: 600,
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

  driverGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 12,
    marginTop: 18,
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

  driverActions: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 16,
  },

  inlineActionPrimary: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 42,
    padding: "0 16px",
    borderRadius: 14,
    textDecoration: "none",
    fontWeight: 800,
    color: "#ffffff",
    background: "linear-gradient(135deg, #0284c7 0%, #2563eb 100%)",
  },

  inlineActionSecondary: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 42,
    padding: "0 16px",
    borderRadius: 14,
    textDecoration: "none",
    fontWeight: 800,
    color: "#0f172a",
    background: "#ffffff",
    border: "1px solid rgba(148, 163, 184, 0.24)",
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

  actionList: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    marginTop: 16,
  },

  actionCard: {
    display: "block",
    textDecoration: "none",
    color: "inherit",
    borderRadius: 18,
    padding: 16,
    background: "linear-gradient(180deg, #f8fbff 0%, #ffffff 100%)",
    border: "1px solid rgba(148, 163, 184, 0.16)",
  },

  actionTitle: {
    display: "block",
    fontSize: 16,
    fontWeight: 850,
    color: "#0f172a",
  },

  actionText: {
    display: "block",
    marginTop: 8,
    color: "#475569",
    lineHeight: 1.6,
    fontSize: 14,
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
};