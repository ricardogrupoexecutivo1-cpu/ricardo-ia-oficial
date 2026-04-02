import Link from "next/link";

const primaryActions = [
  { href: "/cadastro-geral", label: "Cadastrar operação" },
  { href: "/cadastros", label: "Buscar empresas" },
  { href: "/financeiro", label: "Financeiro" },
  { href: "/chat", label: "Chat Aurora" },
];

const operationActions = [
  {
    href: "/cadastro-geral",
    title: "Cadastrar empresa ou operação",
    text: "Estruture empresas, operações, fornecedores e serviços da mineração com mais clareza comercial.",
  },
  {
    href: "/cadastros",
    title: "Buscar empresas",
    text: "Encontre parceiros, fornecedores, compradores e operações com leitura simples dentro do ecossistema Aurora.",
  },
  {
    href: "/agro",
    title: "Conectar setores",
    text: "A Aurora cresce mais forte quando mineração conversa com outros segmentos e amplia oportunidades.",
  },
  {
    href: "/financeiro",
    title: "Financeiro Aurora",
    text: "Leve a operação para uma base privada, editável e preparada para crescer com mais controle empresarial.",
  },
  {
    href: "/app-builder",
    title: "App Builder",
    text: "Estruture módulos e ferramentas para apoiar operação, formulários, inspeções e fluxos do setor.",
  },
  {
    href: "/chat",
    title: "Chat Aurora",
    text: "Use a Aurora para criar apresentações, campanhas, propostas e textos comerciais para mineração.",
  },
];

const highlightStats = [
  {
    value: "Operações",
    label: "Entrada estratégica",
    text: "A mineração precisa entrar com clareza para gerar confiança, presença e mais leitura comercial.",
  },
  {
    value: "Conexões",
    label: "Ecossistema real",
    text: "Empresas, fornecedores, compradores e parceiros precisam se encontrar com menos atrito.",
  },
  {
    value: "Expansão",
    label: "Base para crescer",
    text: "A estrutura foi pensada para crescer sem perder organização, força e visão empresarial.",
  },
];

export default function MineracaoPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(59,130,246,0.10), transparent 18%), radial-gradient(circle at left, rgba(16,185,129,0.10), transparent 24%), linear-gradient(180deg, #eef6ff 0%, #f7fbff 36%, #edf7f3 100%)",
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
                Aurora Mineração • operações, conexões e negócios
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
            <Link href="/guardiao" style={topLinkStyle}>
              Guardião
            </Link>
            <Link href="/cadastro-geral" style={topLinkStyle}>
              Cadastro geral
            </Link>
            <Link href="/chat" style={topLinkStyle}>
              Chat Aurora
            </Link>
            <Link href="/financeiro" style={topLinkStyle}>
              Financeiro global
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
              Aurora Mineração
            </div>

            <div style={{ display: "grid", gap: 12, maxWidth: 920 }}>
              <h1
                style={{
                  margin: 0,
                  fontSize: "clamp(34px, 6vw, 68px)",
                  lineHeight: 0.95,
                  letterSpacing: "-0.05em",
                  color: "#0f172a",
                }}
              >
                Plataforma para conectar mineração, empresas e oportunidades reais
              </h1>

              <p
                style={{
                  margin: 0,
                  color: "rgba(15,23,42,0.74)",
                  fontSize: 18,
                  lineHeight: 1.7,
                  fontWeight: 700,
                  maxWidth: 940,
                }}
              >
                Estruture a presença de empresas, operações, fornecedores,
                compradores e parceiros da mineração dentro do ecossistema Aurora
                com uma experiência mais clara, forte e preparada para crescer.
                Sistema em constante atualização e pode haver momentos de
                instabilidade durante melhorias.
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
            {highlightStats.map((item) => (
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
            <div style={sectionBadgeStyle}>Entrada comercial</div>

            <h2
              style={{
                margin: 0,
                fontSize: "clamp(26px, 4vw, 42px)",
                lineHeight: 1.02,
                color: "#0f172a",
                letterSpacing: "-0.04em",
              }}
            >
              Faça a mineração entrar com mais clareza, força e valor percebido
            </h2>

            <p style={sectionTextStyle}>
              A Aurora foi preparada para aproximar mineração, exploração,
              fornecedores, serviços, empresas compradoras e parceiros em uma
              estrutura mais clara. A entrada precisa ser simples para quem busca
              oportunidade e forte para quem quer gerar negócio real.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 12,
              }}
            >
              <div style={infoCardStyle}>
                <div style={infoTitleStyle}>Presença profissional</div>
                <div style={infoTextStyle}>
                  A operação precisa aparecer com mais clareza para transmitir
                  organização, confiança e força comercial.
                </div>
              </div>

              <div style={infoCardStyle}>
                <div style={infoTitleStyle}>Conexão entre agentes</div>
                <div style={infoTextStyle}>
                  Empresas, compradores, fornecedores e serviços ganham mais valor
                  quando se encontram com menos ruído.
                </div>
              </div>

              <div style={infoCardStyle}>
                <div style={infoTitleStyle}>Fluxo para negócios</div>
                <div style={infoTextStyle}>
                  O ambiente foi pensado para aproximar cadastro, descoberta,
                  contato e expansão comercial.
                </div>
              </div>

              <div style={infoCardStyle}>
                <div style={infoTitleStyle}>Base para escala</div>
                <div style={infoTextStyle}>
                  A estrutura foi pensada para crescer com mais operações,
                  parceiros e módulos sem perder clareza.
                </div>
              </div>
            </div>
          </div>

          <div style={panelStyle}>
            <div style={sectionBadgeStyle}>Acesso rápido</div>

            <h3
              style={{
                margin: 0,
                fontSize: 24,
                lineHeight: 1.08,
                color: "#0f172a",
              }}
            >
              Operação e conexão do setor
            </h3>

            <div
              style={{
                display: "grid",
                gap: 10,
              }}
            >
              {operationActions.map((item) => (
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
            Mineração pronta para ganhar mais presença, conexão e escala
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
            de instabilidade durante melhorias. Mesmo assim, esta área já foi
            estruturada para melhorar descoberta, entrada comercial e conexão com
            negócios reais dentro do ecossistema Aurora.
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <Link href="/cadastro-geral" style={primaryButtonStyle}>
              Cadastrar operação
            </Link>
            <Link href="/cadastros" style={secondaryButtonStyle}>
              Explorar empresas
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

const infoCardStyle: React.CSSProperties = {
  borderRadius: 22,
  border: "1px solid rgba(15,23,42,0.08)",
  background: "rgba(255,255,255,0.86)",
  padding: "16px 14px",
  display: "grid",
  gap: 8,
  boxShadow: "0 10px 24px rgba(15,23,42,0.04)",
};

const infoTitleStyle: React.CSSProperties = {
  color: "#0f172a",
  fontSize: 16,
  fontWeight: 900,
  lineHeight: 1.1,
};

const infoTextStyle: React.CSSProperties = {
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