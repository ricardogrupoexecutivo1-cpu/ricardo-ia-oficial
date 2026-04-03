import Link from "next/link";

const primaryActions = [
  { href: "/finance/categories", label: "Categorias" },
  { href: "/finance/activities", label: "Atividades" },
  { href: "/finance/accounts", label: "Contas" },
  { href: "/finance/entries", label: "Lançamentos" },
];

const moduleCards = [
  {
    href: "/finance/categories",
    badge: "Estrutura base",
    title: "Categorias editáveis",
    text: "Monte receitas, despesas, investimentos, transferências e nomenclaturas livres para refletir a realidade de cada empresa.",
  },
  {
    href: "/finance/activities",
    badge: "Operação real",
    title: "Atividades empresariais",
    text: "Organize vendas, aluguel, produção, marketing, apoio de campo, comissões e outras operações sem travar o cliente em um modelo rígido.",
  },
  {
    href: "/finance/accounts",
    badge: "Base privada",
    title: "Contas e saldos",
    text: "Centralize caixa, bancos, contas internas e leitura de saldo em uma estrutura protegida e mais clara.",
  },
  {
    href: "/finance/cost-centers",
    badge: "Leitura gerencial",
    title: "Centros de custo",
    text: "Separe unidades, equipes, frentes de trabalho, filiais e projetos para fortalecer a leitura administrativa.",
  },
  {
    href: "/finance/entries",
    badge: "Movimentação",
    title: "Lançamentos reais",
    text: "Registre entradas, saídas, transferências, ajustes e movimentações da empresa com organização operacional.",
  },
  {
    href: "/finance/reports",
    badge: "Análise premium",
    title: "Relatórios",
    text: "Transforme a operação financeira em leitura gerencial para tomada de decisão, crescimento e controle.",
  },
];

const highlightCards = [
  {
    value: "Privado",
    label: "Financeiro por empresa",
    text: "A base financeira foi pensada para ser protegida, organizada e separada da camada pública da plataforma.",
  },
  {
    value: "Editável",
    label: "Nomenclatura livre",
    text: "Cada cliente pode adaptar o financeiro ao seu jeito real de trabalhar, sem engessar a operação.",
  },
  {
    value: "Escalável",
    label: "Base para crescimento",
    text: "A estrutura foi desenhada para crescer com novas contas, atividades, relatórios e módulos empresariais.",
  },
];

const supportLinks = [
  {
    href: "/chat",
    title: "Chat Aurora",
    text: "Use a Aurora para criar ideias, textos, campanhas e apoio estratégico para sua operação financeira e empresarial.",
  },
  {
    href: "/cadastro-geral",
    title: "Cadastro geral",
    text: "Conecte a empresa ao ecossistema da Aurora e fortaleça a operação com presença mais completa.",
  },
  {
    href: "/guardiao",
    title: "Guardião",
    text: "Acompanhe a evolução da plataforma e proteja a leitura do que já está ativo no sistema.",
  },
  {
    href: "/financeiro",
    title: "Página institucional do financeiro",
    text: "Abra a área institucional do Financeiro Aurora em visual claro e alinhado ao restante da plataforma.",
  },
];

export default function FinanceHubPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(59,130,246,0.10), transparent 18%), radial-gradient(circle at right, rgba(16,185,129,0.10), transparent 24%), linear-gradient(180deg, #eef6ff 0%, #f7fbff 36%, #edf7f3 100%)",
        color: "#0f172a",
        overflow: "hidden",
      }}
    >
      <section
        style={{
          maxWidth: 1320,
          margin: "0 auto",
          padding: "18px 16px 72px",
          display: "grid",
          gap: 18,
        }}
      >
        <header
          style={{
            display: "grid",
            gap: 12,
            border: "1px solid rgba(15,23,42,0.08)",
            background: "rgba(255,255,255,0.78)",
            backdropFilter: "blur(14px)",
            borderRadius: 24,
            padding: "14px",
            boxShadow: "0 18px 42px rgba(15,23,42,0.07)",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "grid", gap: 4 }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 900,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#2563eb",
                }}
              >
                ricardoiaoficial.com
              </div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 900,
                  lineHeight: 1.2,
                  color: "#0f172a",
                }}
              >
                Hub Financeiro Aurora • gestão privada, editável e premium
              </div>
            </div>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 36,
                padding: "0 12px",
                borderRadius: 999,
                background: "rgba(37,99,235,0.08)",
                border: "1px solid rgba(37,99,235,0.16)",
                color: "#2563eb",
                fontSize: 12,
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Sistema em evolução
            </div>
          </div>

          <nav
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <Link href="/" style={topLinkStyle}>
              Home
            </Link>
            <Link href="/financeiro" style={topLinkStyle}>
              Financeiro Aurora
            </Link>
            <Link href="/guardiao" style={topLinkStyle}>
              Guardião
            </Link>
            <Link href="/cadastro-geral" style={topLinkStyle}>
              Cadastro geral
            </Link>
            <Link href="/chat" style={topLinkStyle}>
              Chat Aurora
            </Link>
          </nav>
        </header>

        <section
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: 32,
            border: "1px solid rgba(15,23,42,0.08)",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.88), rgba(255,255,255,0.74))",
            boxShadow: "0 22px 70px rgba(15,23,42,0.09)",
            padding: "28px 20px 22px",
            display: "grid",
            gap: 22,
          }}
        >
          <div style={heroGlowBlue} />
          <div style={heroGlowGreen} />
          <div style={heroGridStyle} />

          <div
            style={{
              position: "relative",
              zIndex: 1,
              display: "grid",
              gap: 16,
              justifyItems: "start",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                width: "fit-content",
                alignItems: "center",
                gap: 8,
                padding: "8px 12px",
                borderRadius: 999,
                background: "rgba(37,99,235,0.08)",
                border: "1px solid rgba(37,99,235,0.16)",
                color: "#2563eb",
                fontSize: 12,
                fontWeight: 900,
                boxShadow: "0 0 16px rgba(37,99,235,0.06)",
              }}
            >
              Hub Financeiro
            </div>

            <div style={{ display: "grid", gap: 12, maxWidth: 960 }}>
              <h1
                style={{
                  margin: 0,
                  fontSize: "clamp(34px, 6vw, 68px)",
                  lineHeight: 0.95,
                  letterSpacing: "-0.05em",
                  color: "#0f172a",
                }}
              >
                Organize o financeiro da empresa com liberdade, clareza e estrutura real
              </h1>

              <p
                style={{
                  margin: 0,
                  color: "rgba(15,23,42,0.74)",
                  fontSize: 18,
                  lineHeight: 1.7,
                  fontWeight: 700,
                  maxWidth: 980,
                }}
              >
                Esta é a base principal do financeiro empresarial da Aurora.
                Categorias, atividades, contas, centros de custo, lançamentos e
                relatórios foram pensados para dar liberdade real de operação
                para cada empresa. Sistema em constante atualização e pode haver
                momentos de instabilidade durante melhorias.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              {primaryActions.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  style={index === 0 ? primaryButtonStyle : secondaryButtonStyle}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div
            style={{
              position: "relative",
              zIndex: 1,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 12,
            }}
          >
            {highlightCards.map((item) => (
              <div key={item.label} style={statCardStyle}>
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 900,
                    color: "#0f172a",
                    lineHeight: 1,
                  }}
                >
                  {item.value}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 900,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: "#2563eb",
                  }}
                >
                  {item.label}
                </div>
                <div
                  style={{
                    color: "rgba(15,23,42,0.68)",
                    lineHeight: 1.7,
                    fontSize: 14,
                  }}
                >
                  {item.text}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 18,
          }}
        >
          <div style={panelStyle}>
            <div style={sectionBadgeStyle}>Estrutura financeira</div>

            <h2
              style={{
                margin: 0,
                fontSize: "clamp(26px, 4vw, 42px)",
                lineHeight: 1.02,
                color: "#0f172a",
                letterSpacing: "-0.04em",
              }}
            >
              Um financeiro empresarial que se adapta à empresa, e não o contrário
            </h2>

            <p style={sectionTextStyle}>
              O grande diferencial da Aurora está em permitir um financeiro
              privado, configurável e com nomenclaturas abertas. Cada empresa
              pode nomear suas operações do jeito que realmente usa no dia a dia,
              criando um diferencial forte, encantador e muito mais útil na prática.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 12,
              }}
            >
              {moduleCards.map((item) => (
                <Link key={item.href} href={item.href} style={moduleCardStyle}>
                  <div style={moduleBadgeStyle}>{item.badge}</div>
                  <div style={moduleTitleStyle}>{item.title}</div>
                  <div style={moduleTextStyle}>{item.text}</div>
                </Link>
              ))}
            </div>
          </div>

          <div style={panelStyle}>
            <div style={sectionBadgeStyle}>Apoio e navegação</div>

            <h3
              style={{
                margin: 0,
                fontSize: 24,
                lineHeight: 1.08,
                color: "#0f172a",
              }}
            >
              Entradas complementares do hub
            </h3>

            <div
              style={{
                display: "grid",
                gap: 10,
              }}
            >
              {supportLinks.map((item) => (
                <Link key={item.href} href={item.href} style={quickCardLinkStyle}>
                  <div style={quickCardTitleStyle}>{item.title}</div>
                  <div style={quickCardTextStyle}>{item.text}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section
          style={{
            borderRadius: 28,
            border: "1px solid rgba(15,23,42,0.08)",
            background:
              "linear-gradient(135deg, rgba(37,99,235,0.06), rgba(16,185,129,0.06))",
            boxShadow: "0 18px 44px rgba(15,23,42,0.07)",
            padding: "22px 18px",
            display: "grid",
            gap: 12,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "clamp(22px, 4vw, 30px)",
              fontWeight: 900,
              lineHeight: 1.08,
              color: "#0f172a",
            }}
          >
            Hub financeiro pronto para dar mais clareza, controle e valor à operação
          </div>

          <div
            style={{
              maxWidth: 920,
              margin: "0 auto",
              color: "rgba(15,23,42,0.68)",
              lineHeight: 1.7,
              fontSize: 15,
            }}
          >
            A plataforma está em constante atualização e pode passar por momentos
            de instabilidade durante melhorias. Mesmo assim, o hub já foi
            reorganizado no padrão claro oficial Aurora para fortalecer leitura,
            gestão privada e crescimento empresarial.
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <Link href="/finance/entries" style={primaryButtonStyle}>
              Abrir lançamentos
            </Link>
            <Link href="/finance/reports" style={secondaryButtonStyle}>
              Ver relatórios
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}

const heroGlowBlue: React.CSSProperties = {
  position: "absolute",
  top: -140,
  right: -100,
  width: 420,
  height: 420,
  borderRadius: 999,
  background:
    "radial-gradient(circle, rgba(59,130,246,0.12) 0%, rgba(59,130,246,0.04) 44%, transparent 72%)",
  filter: "blur(24px)",
  pointerEvents: "none",
};

const heroGlowGreen: React.CSSProperties = {
  position: "absolute",
  bottom: -120,
  left: -90,
  width: 380,
  height: 380,
  borderRadius: 999,
  background:
    "radial-gradient(circle, rgba(16,185,129,0.10) 0%, rgba(16,185,129,0.03) 45%, transparent 72%)",
  filter: "blur(22px)",
  pointerEvents: "none",
};

const heroGridStyle: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  backgroundImage:
    "linear-gradient(rgba(15,23,42,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.022) 1px, transparent 1px)",
  backgroundSize: "42px 42px",
  opacity: 0.24,
  pointerEvents: "none",
};

const topLinkStyle: React.CSSProperties = {
  textDecoration: "none",
  color: "#0f172a",
  border: "1px solid rgba(15,23,42,0.08)",
  background: "rgba(255,255,255,0.68)",
  borderRadius: 999,
  padding: "10px 14px",
  fontWeight: 800,
  fontSize: 13,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 8px 16px rgba(15,23,42,0.04)",
};

const primaryButtonStyle: React.CSSProperties = {
  textDecoration: "none",
  color: "#ffffff",
  background: "linear-gradient(135deg, #2563eb, #3b82f6)",
  border: "1px solid rgba(37,99,235,0.16)",
  borderRadius: 16,
  padding: "13px 16px",
  fontWeight: 900,
  fontSize: 14,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 14px 30px rgba(37,99,235,0.16)",
};

const secondaryButtonStyle: React.CSSProperties = {
  textDecoration: "none",
  color: "#0f172a",
  background: "rgba(255,255,255,0.78)",
  border: "1px solid rgba(15,23,42,0.08)",
  borderRadius: 16,
  padding: "13px 16px",
  fontWeight: 800,
  fontSize: 14,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 10px 22px rgba(15,23,42,0.05)",
};

const statCardStyle: React.CSSProperties = {
  borderRadius: 24,
  padding: "18px 16px",
  border: "1px solid rgba(15,23,42,0.08)",
  background: "rgba(255,255,255,0.76)",
  display: "grid",
  gap: 8,
  boxShadow: "0 14px 30px rgba(15,23,42,0.05)",
};

const panelStyle: React.CSSProperties = {
  borderRadius: 28,
  border: "1px solid rgba(15,23,42,0.08)",
  background: "rgba(255,255,255,0.80)",
  boxShadow: "0 18px 42px rgba(15,23,42,0.06)",
  padding: "22px 18px",
  display: "grid",
  gap: 14,
};

const sectionBadgeStyle: React.CSSProperties = {
  display: "inline-flex",
  width: "fit-content",
  minHeight: 34,
  alignItems: "center",
  justifyContent: "center",
  padding: "0 12px",
  borderRadius: 999,
  background: "rgba(37,99,235,0.08)",
  border: "1px solid rgba(37,99,235,0.16)",
  color: "#2563eb",
  fontSize: 12,
  fontWeight: 900,
};

const sectionTextStyle: React.CSSProperties = {
  margin: 0,
  color: "rgba(15,23,42,0.70)",
  lineHeight: 1.75,
  fontSize: 15,
};

const moduleCardStyle: React.CSSProperties = {
  textDecoration: "none",
  borderRadius: 22,
  border: "1px solid rgba(15,23,42,0.08)",
  background: "rgba(255,255,255,0.86)",
  padding: "16px 14px",
  display: "grid",
  gap: 8,
  boxShadow: "0 10px 24px rgba(15,23,42,0.04)",
};

const moduleBadgeStyle: React.CSSProperties = {
  display: "inline-flex",
  width: "fit-content",
  minHeight: 28,
  alignItems: "center",
  justifyContent: "center",
  padding: "0 10px",
  borderRadius: 999,
  background: "rgba(37,99,235,0.08)",
  border: "1px solid rgba(37,99,235,0.14)",
  color: "#2563eb",
  fontSize: 11,
  fontWeight: 900,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const moduleTitleStyle: React.CSSProperties = {
  color: "#0f172a",
  fontSize: 16,
  fontWeight: 900,
  lineHeight: 1.1,
};

const moduleTextStyle: React.CSSProperties = {
  color: "rgba(15,23,42,0.68)",
  lineHeight: 1.7,
  fontSize: 14,
};

const quickCardLinkStyle: React.CSSProperties = {
  textDecoration: "none",
  borderRadius: 22,
  border: "1px solid rgba(15,23,42,0.08)",
  background: "rgba(255,255,255,0.86)",
  padding: "16px 14px",
  display: "grid",
  gap: 8,
  boxShadow: "0 10px 24px rgba(15,23,42,0.04)",
};

const quickCardTitleStyle: React.CSSProperties = {
  color: "#0f172a",
  fontSize: 16,
  fontWeight: 900,
  lineHeight: 1.1,
};

const quickCardTextStyle: React.CSSProperties = {
  color: "rgba(15,23,42,0.68)",
  lineHeight: 1.7,
  fontSize: 14,
};