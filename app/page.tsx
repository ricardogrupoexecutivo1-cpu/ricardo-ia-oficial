import Link from "next/link";

const products = [
  {
    title: "Chat",
    icon: "💬",
    href: "/chat",
    description: "Converse, peça campanhas, ideias, imagens e respostas rápidas.",
    badge: "Aurora IA",
  },
  {
    title: "Locadora",
    icon: "🚗",
    href: "/locadora",
    description: "Cadastros, clientes, veículos e operação comercial da locadora.",
    badge: "Operação real",
  },
  {
    title: "Agro",
    icon: "🌾",
    href: "/agro",
    description: "Entrada para produtores, fornecedores e negócios do agro.",
    badge: "Expansão",
  },
  {
    title: "Imóveis",
    icon: "🏠",
    href: "/imoveis",
    description: "Imobiliárias, imóveis e operação de captação e venda.",
    badge: "Mercado imobiliário",
  },
  {
    title: "Bancos",
    icon: "🏦",
    href: "/bancos",
    description: "Fluxo com bancos e parceiros financeiros dentro da plataforma.",
    badge: "Financeiro",
  },
  {
    title: "Livro",
    icon: "📘",
    href: "/livro",
    description: "Área do livro com acesso rápido para leitura, divulgação e conversão.",
    badge: "Conteúdo",
  },
];

const cadastros = [
  {
    title: "Cadastro de clientes",
    icon: "👤",
    href: "/locadora/cadastros/clientes",
    description: "Cadastre clientes e siga direto para o fluxo comercial.",
  },
  {
    title: "Clientes cadastrados",
    icon: "📋",
    href: "/locadora/clientes",
    description: "Veja os clientes já gravados no banco e chame no WhatsApp.",
  },
  {
    title: "Central de cadastros",
    icon: "🧩",
    href: "/locadora/cadastros",
    description: "Entre na área de cadastros e escolha o que quer operar.",
  },
];

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(34,197,94,0.12), transparent 0%, transparent 24%), radial-gradient(circle at right top, rgba(59,130,246,0.12), transparent 0%, transparent 20%), linear-gradient(180deg, #030712 0%, #06111c 54%, #02060d 100%)",
        color: "#eef6ff",
      }}
    >
      <section
        style={{
          maxWidth: 1220,
          margin: "0 auto",
          padding: "18px 14px 88px",
        }}
      >
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 20,
            paddingBottom: 14,
            background:
              "linear-gradient(180deg, rgba(3,7,18,0.96), rgba(3,7,18,0.86), rgba(3,7,18,0))",
            backdropFilter: "blur(10px)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
              paddingTop: 8,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <div>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "7px 12px",
                    borderRadius: 999,
                    background: "rgba(34,197,94,0.10)",
                    border: "1px solid rgba(34,197,94,0.22)",
                    color: "#b9f7cf",
                    fontWeight: 800,
                    fontSize: 12,
                    marginBottom: 10,
                  }}
                >
                  <span>Aurora IA</span>
                  <span>•</span>
                  <span>Entrada inteligente</span>
                </div>

                <h1
                  style={{
                    margin: 0,
                    fontSize: "clamp(28px, 7vw, 56px)",
                    lineHeight: 1.02,
                    letterSpacing: "-0.04em",
                    fontWeight: 900,
                    maxWidth: 760,
                  }}
                >
                  Tudo em um só lugar, com entrada simples para celular
                </h1>

                <p
                  style={{
                    margin: "14px 0 0",
                    maxWidth: 860,
                    color: "#cbd5e1",
                    fontSize: "clamp(15px, 3.5vw, 19px)",
                    lineHeight: 1.65,
                  }}
                >
                  Escolha o produto, entre direto no que precisa e navegue sem
                  confusão. Sistema em constante atualização e pode haver
                  momentos de instabilidade durante melhorias e novos
                  lançamentos.
                </p>
              </div>

              <div
                style={{
                  minWidth: 220,
                  maxWidth: 280,
                  width: "100%",
                  borderRadius: 22,
                  padding: 16,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: "0 18px 50px rgba(0,0,0,0.24)",
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 800,
                    letterSpacing: "0.18em",
                    color: "#8db5d9",
                    marginBottom: 10,
                  }}
                >
                  ACESSO RÁPIDO
                </div>

                <div style={{ display: "grid", gap: 10 }}>
                  <Link href="/chat" style={primaryButton}>
                    Entrar no Chat
                  </Link>

                  <Link href="/locadora" style={secondaryButton}>
                    Entrar na Locadora
                  </Link>
                </div>
              </div>
            </div>

            <nav
              aria-label="Produtos principais"
              style={{
                display: "flex",
                gap: 10,
                overflowX: "auto",
                paddingBottom: 4,
                scrollbarWidth: "thin",
              }}
            >
              {products.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  style={topNavChip}
                >
                  <span aria-hidden="true">{item.icon}</span>
                  <span>{item.title}</span>
                </Link>
              ))}
            </nav>
          </div>
        </header>

        <section style={{ marginTop: 20 }}>
          <div style={sectionHeader}>
            <div>
              <div style={eyebrow}>PRODUTOS</div>
              <h2 style={sectionTitle}>Escolha onde quer entrar</h2>
            </div>
          </div>

          <div style={gridProducts}>
            {products.map((item) => (
              <Link key={item.title} href={item.href} style={cardLink}>
                <article style={mainCard}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: 14,
                    }}
                  >
                    <div style={iconBox}>{item.icon}</div>

                    <div style={badge}>{item.badge}</div>
                  </div>

                  <h3 style={cardTitle}>{item.title}</h3>

                  <p style={cardText}>{item.description}</p>

                  <div style={cardAction}>Entrar agora</div>
                </article>
              </Link>
            ))}
          </div>
        </section>

        <section style={{ marginTop: 28 }}>
          <div style={sectionHeader}>
            <div>
              <div style={eyebrow}>CADASTROS</div>
              <h2 style={sectionTitle}>Entre, cadastre e siga</h2>
            </div>
          </div>

          <div style={gridCadastros}>
            {cadastros.map((item) => (
              <Link key={item.title} href={item.href} style={cardLink}>
                <article style={cadastroCard}>
                  <div style={iconBoxSmall}>{item.icon}</div>
                  <div>
                    <h3 style={cadastroTitle}>{item.title}</h3>
                    <p style={cadastroText}>{item.description}</p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>

        <section style={{ marginTop: 28 }}>
          <div style={sectionHeader}>
            <div>
              <div style={eyebrow}>DESTAQUE</div>
              <h2 style={sectionTitle}>Livro e conteúdo estratégico</h2>
            </div>
          </div>

          <div style={bookWrap}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={bookBadge}>📘 LIVRO</div>

              <h3
                style={{
                  margin: "12px 0 10px",
                  fontSize: "clamp(24px, 5vw, 38px)",
                  lineHeight: 1.08,
                  fontWeight: 900,
                }}
              >
                Acesse o livro com entrada clara e visível na home
              </h3>

              <p
                style={{
                  margin: 0,
                  color: "#d5e5f7",
                  fontSize: 16,
                  lineHeight: 1.75,
                  maxWidth: 760,
                }}
              >
                O livro não pode ficar escondido. Ele precisa aparecer como
                produto principal para gerar retenção, autoridade e mais tempo
                de permanência dentro da Aurora.
              </p>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 12,
                  marginTop: 18,
                }}
              >
                <Link href="/livro" style={primaryButton}>
                  Abrir livro
                </Link>

                <Link href="/explorar" style={secondaryButton}>
                  Explorar conteúdos
                </Link>
              </div>
            </div>

            <div style={bookSideCard}>
              <div style={statMiniLabel}>OBJETIVO</div>
              <div style={statMiniText}>
                Facilitar entrada, melhorar retenção e reduzir confusão no
                mobile.
              </div>
            </div>
          </div>
        </section>

        <section style={{ marginTop: 28 }}>
          <div style={sectionHeader}>
            <div>
              <div style={eyebrow}>HOME INTERNA</div>
              <h2 style={sectionTitle}>Depois a pessoa aprofunda</h2>
            </div>
          </div>

          <div style={infoPanel}>
            <p style={infoText}>
              Esta nova entrada funciona como uma home simples de decisão. Depois
              que a pessoa escolhe o produto, ela cai na área específica e navega
              com mais profundidade. Isso melhora entendimento, retenção e
              conversão no celular.
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}

const sectionHeader: React.CSSProperties = {
  marginBottom: 14,
};

const eyebrow: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: "0.18em",
  color: "#8db5d9",
  marginBottom: 8,
};

const sectionTitle: React.CSSProperties = {
  margin: 0,
  fontSize: "clamp(22px, 5vw, 34px)",
  lineHeight: 1.08,
  fontWeight: 900,
};

const gridProducts: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 14,
};

const gridCadastros: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: 12,
};

const cardLink: React.CSSProperties = {
  textDecoration: "none",
  color: "inherit",
};

const topNavChip: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  whiteSpace: "nowrap",
  textDecoration: "none",
  color: "#e5eef8",
  padding: "10px 14px",
  borderRadius: 999,
  border: "1px solid rgba(148,163,184,0.22)",
  background: "rgba(15,23,42,0.72)",
  fontWeight: 800,
  fontSize: 14,
};

const primaryButton: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 46,
  padding: "0 18px",
  borderRadius: 14,
  textDecoration: "none",
  fontWeight: 800,
  fontSize: 15,
  color: "#04110a",
  background: "linear-gradient(135deg, #22c55e, #86efac)",
  boxShadow: "0 16px 40px rgba(34,197,94,0.22)",
};

const secondaryButton: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 46,
  padding: "0 18px",
  borderRadius: 14,
  textDecoration: "none",
  fontWeight: 700,
  fontSize: 15,
  color: "#e5e7eb",
  border: "1px solid rgba(148,163,184,0.28)",
  background: "rgba(15,23,42,0.62)",
};

const mainCard: React.CSSProperties = {
  height: "100%",
  borderRadius: 22,
  padding: 18,
  background:
    "linear-gradient(180deg, rgba(10,24,36,0.92), rgba(5,11,18,0.98))",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 18px 50px rgba(0,0,0,0.24)",
};

const cadastroCard: React.CSSProperties = {
  height: "100%",
  borderRadius: 20,
  padding: 16,
  display: "flex",
  gap: 12,
  alignItems: "flex-start",
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.08)",
};

const iconBox: React.CSSProperties = {
  width: 52,
  height: 52,
  borderRadius: 16,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 24,
  background: "rgba(255,255,255,0.05)",
};

const iconBoxSmall: React.CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: 14,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 20,
  background: "rgba(255,255,255,0.05)",
  flexShrink: 0,
};

const badge: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 28,
  padding: "0 10px",
  borderRadius: 999,
  background: "rgba(34,197,94,0.10)",
  border: "1px solid rgba(34,197,94,0.20)",
  color: "#b9f7cf",
  fontSize: 12,
  fontWeight: 800,
  textAlign: "center",
};

const cardTitle: React.CSSProperties = {
  margin: "16px 0 8px",
  fontSize: 22,
  lineHeight: 1.1,
  fontWeight: 900,
};

const cardText: React.CSSProperties = {
  margin: 0,
  color: "#cbd5e1",
  lineHeight: 1.65,
  fontSize: 15,
};

const cardAction: React.CSSProperties = {
  marginTop: 16,
  color: "#86efac",
  fontWeight: 800,
  fontSize: 15,
};

const cadastroTitle: React.CSSProperties = {
  margin: "2px 0 8px",
  fontSize: 18,
  lineHeight: 1.1,
  fontWeight: 800,
};

const cadastroText: React.CSSProperties = {
  margin: 0,
  color: "#cbd5e1",
  lineHeight: 1.6,
  fontSize: 14,
};

const bookWrap: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 16,
  borderRadius: 24,
  padding: 20,
  background:
    "linear-gradient(180deg, rgba(14,25,40,0.92), rgba(7,12,28,0.98))",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
};

const bookBadge: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 30,
  padding: "0 12px",
  borderRadius: 999,
  background: "rgba(59,130,246,0.12)",
  border: "1px solid rgba(59,130,246,0.22)",
  color: "#bfdbfe",
  fontSize: 12,
  fontWeight: 800,
};

const bookSideCard: React.CSSProperties = {
  width: 280,
  maxWidth: "100%",
  borderRadius: 20,
  padding: 16,
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
};

const statMiniLabel: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: "0.16em",
  color: "#8db5d9",
  marginBottom: 10,
};

const statMiniText: React.CSSProperties = {
  color: "#e5eef8",
  lineHeight: 1.7,
  fontSize: 15,
};

const infoPanel: React.CSSProperties = {
  borderRadius: 22,
  padding: 20,
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.07)",
};

const infoText: React.CSSProperties = {
  margin: 0,
  color: "#d5e5f7",
  lineHeight: 1.8,
  fontSize: 16,
};