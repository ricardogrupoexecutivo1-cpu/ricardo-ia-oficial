import Link from "next/link";

type QuickLink = {
  href: string;
  title: string;
  subtitle: string;
  icon: string;
};

const quickLinks: QuickLink[] = [
  {
    href: "/chat",
    title: "Aurora Responde",
    subtitle: "Converse, peça ideias, campanhas, imagens e apoio comercial.",
    icon: "💬",
  },
  {
    href: "/app-builder",
    title: "App Builder",
    subtitle: "Monte novos apps, estruturas e páginas para clientes ou uso interno.",
    icon: "🛠️",
  },
  {
    href: "/cadastro",
    title: "Cadastro Geral",
    subtitle: "Base principal para empresas, profissionais, parceiros e operações.",
    icon: "📋",
  },
  {
    href: "/guardiao",
    title: "Guardião",
    subtitle: "Leitura, controle e edição da camada pública dos cadastros reais.",
    icon: "🛡️",
  },
  {
    href: "/agro",
    title: "AGRO",
    subtitle: "Área para produtores, fornecedores, compradores, serviços e operação do agro.",
    icon: "🌱",
  },
  {
    href: "/imobiliarias",
    title: "Imobiliárias",
    subtitle: "Área comercial para imobiliárias, corretores, anúncios e operação imobiliária.",
    icon: "🏢",
  },
  {
    href: "/imoveis",
    title: "Imóveis",
    subtitle: "Área pública de imóveis, busca, cadastros e expansão do setor imobiliário.",
    icon: "🏠",
  },
  {
    href: "/mineracao",
    title: "Mineração",
    subtitle: "Área dedicada ao setor mineral, fornecedores e oportunidades.",
    icon: "⛏️",
  },
  {
    href: "/locadora",
    title: "Aurora Locadora",
    subtitle: "Área comercial para locadoras, veículos, clientes e operação.",
    icon: "🚗",
  },
  {
    href: "/cadastro-veiculos",
    title: "Cadastro de Veículos",
    subtitle: "Módulo real para cadastrar, listar e organizar veículos.",
    icon: "📄",
  },
  {
    href: "/viral",
    title: "Viral",
    subtitle: "Área visível para tráfego, crescimento, compartilhamento e divulgação.",
    icon: "🚀",
  },
];

const pillars = [
  {
    title: "Cadastro sério e completo",
    text: "Estrutura preparada para nível Brasil, estadual, regional, municipal, local ou multilocal, com espaço para crescer junto com a plataforma.",
  },
  {
    title: "Sistema super editável",
    text: "Segmentos, profissões, produtos e serviços precisam poder evoluir sem travar a operação nem obrigar retrabalho.",
  },
  {
    title: "Privacidade por padrão",
    text: "Dados pessoais e dados sensíveis não devem ficar públicos. A camada pública mostra apenas o que for seguro e publicável.",
  },
  {
    title: "Mobile-first real",
    text: "A navegação principal foi organizada para funcionar bem no celular, que é onde boa parte do tráfego já acontece.",
  },
];

const highlights = [
  "Home reorganizada para acesso rápido às áreas estratégicas.",
  "Botão Viral visível logo na entrada da plataforma.",
  "Atalhos diretos para AGRO, Imobiliárias, Mineração, App Builder, Cadastro Geral, Guardião e Locadora.",
  "Blocos claros para reduzir confusão e acelerar operação.",
];

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(22,163,74,0.18), transparent 28%), linear-gradient(180deg, #06110b 0%, #08140f 35%, #07110c 100%)",
        color: "#e5fff1",
      }}
    >
      <section
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "20px 16px 48px",
        }}
      >
        <header
          style={{
            position: "relative",
            overflow: "hidden",
            border: "1px solid rgba(74, 222, 128, 0.18)",
            background:
              "linear-gradient(180deg, rgba(11, 26, 18, 0.96) 0%, rgba(8, 19, 13, 0.98) 100%)",
            borderRadius: 24,
            padding: "18px 16px 24px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background:
                "linear-gradient(135deg, rgba(34,197,94,0.10), transparent 28%, transparent 72%, rgba(59,130,246,0.10))",
            }}
          />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              position: "relative",
              zIndex: 1,
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
                border: "1px solid rgba(74, 222, 128, 0.25)",
                background: "rgba(20, 40, 29, 0.72)",
                color: "#b8ffd2",
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              <span>⚡</span>
              <span>Aurora IA Beta — novas funções sendo lançadas diariamente</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <h1
                style={{
                  margin: 0,
                  fontSize: "clamp(32px, 7vw, 64px)",
                  lineHeight: 1.02,
                  fontWeight: 900,
                  letterSpacing: "-0.03em",
                  color: "#f3fff8",
                }}
              >
                Aurora IA
              </h1>

              <p
                style={{
                  margin: 0,
                  maxWidth: 820,
                  fontSize: "clamp(15px, 3.4vw, 20px)",
                  lineHeight: 1.6,
                  color: "rgba(229,255,241,0.82)",
                }}
              >
                Plataforma em expansão para cadastro geral, operação real, app
                builder, leitura pública protegida, agro, imobiliárias,
                imóveis, mineração, locadora, crescimento e divulgação.
                Estamos em constante atualização e pode haver momentos de
                instabilidade.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 12,
                marginTop: 6,
              }}
            >
              <Link href="/cadastro" style={ctaGreen}>
                Entrar no Cadastro Geral
              </Link>

              <Link href="/agro" style={ctaBlue}>
                Abrir AGRO
              </Link>

              <Link href="/imobiliarias" style={ctaBlue}>
                Abrir Imobiliárias
              </Link>

              <Link href="/locadora" style={ctaBlue}>
                Abrir Locadora
              </Link>

              <Link href="/guardiao" style={ctaDark}>
                Abrir Guardião
              </Link>

              <Link href="/app-builder" style={ctaDark}>
                Abrir App Builder
              </Link>

              <Link href="/viral" style={ctaBlue}>
                VIRAL
              </Link>
            </div>
          </div>
        </header>

        <section style={{ marginTop: 18 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 14,
            }}
          >
            {quickLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  borderRadius: 22,
                  padding: 18,
                  border: "1px solid rgba(74, 222, 128, 0.15)",
                  background:
                    "linear-gradient(180deg, rgba(10, 20, 14, 0.96) 0%, rgba(7, 14, 10, 0.98) 100%)",
                  boxShadow: "0 12px 30px rgba(0,0,0,0.20)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 46,
                      height: 46,
                      borderRadius: 14,
                      background: "rgba(22, 163, 74, 0.14)",
                      border: "1px solid rgba(74, 222, 128, 0.18)",
                      fontSize: 24,
                    }}
                  >
                    <span aria-hidden="true">{item.icon}</span>
                  </div>

                  <div>
                    <h2
                      style={{
                        margin: 0,
                        fontSize: 20,
                        lineHeight: 1.2,
                        fontWeight: 800,
                        color: "#f4fff8",
                      }}
                    >
                      {item.title}
                    </h2>

                    <p
                      style={{
                        margin: "8px 0 0",
                        fontSize: 14,
                        lineHeight: 1.6,
                        color: "rgba(229,255,241,0.72)",
                      }}
                    >
                      {item.subtitle}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section
          style={{
            marginTop: 18,
            display: "grid",
            gridTemplateColumns: "1.2fr 0.8fr",
            gap: 16,
          }}
        >
          <div
            style={{
              borderRadius: 24,
              padding: 18,
              border: "1px solid rgba(74, 222, 128, 0.15)",
              background:
                "linear-gradient(180deg, rgba(10, 20, 14, 0.96) 0%, rgba(7, 14, 10, 0.98) 100%)",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 12px",
                borderRadius: 999,
                background: "rgba(22,163,74,0.10)",
                border: "1px solid rgba(74, 222, 128, 0.18)",
                color: "#b8ffd2",
                fontSize: 13,
                fontWeight: 800,
              }}
            >
              <span>📌</span>
              <span>Direção principal da plataforma</span>
            </div>

            <h3
              style={{
                margin: "14px 0 10px",
                fontSize: "clamp(22px, 4vw, 32px)",
                lineHeight: 1.15,
                color: "#f4fff8",
              }}
            >
              Base definitiva para operação séria, editável e escalável
            </h3>

            <p
              style={{
                margin: 0,
                color: "rgba(229,255,241,0.78)",
                fontSize: 15,
                lineHeight: 1.7,
              }}
            >
              A Aurora precisa aceitar empresas, profissionais, fornecedores,
              compradores, parceiros e operações em vários níveis de cobertura,
              sem engessar categorias. O sistema deve permitir crescimento real
              de produtos, serviços e segmentos, com leitura pública protegida,
              edição segura e módulos comerciais prontos para expansão.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 12,
                marginTop: 16,
              }}
            >
              {pillars.map((item) => (
                <div
                  key={item.title}
                  style={{
                    borderRadius: 18,
                    padding: 14,
                    border: "1px solid rgba(74, 222, 128, 0.12)",
                    background: "rgba(255,255,255,0.02)",
                  }}
                >
                  <strong
                    style={{
                      display: "block",
                      fontSize: 15,
                      color: "#f3fff8",
                      marginBottom: 8,
                    }}
                  >
                    {item.title}
                  </strong>
                  <span
                    style={{
                      fontSize: 14,
                      lineHeight: 1.6,
                      color: "rgba(229,255,241,0.72)",
                    }}
                  >
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <aside
            style={{
              borderRadius: 24,
              padding: 18,
              border: "1px solid rgba(74, 222, 128, 0.15)",
              background:
                "linear-gradient(180deg, rgba(10, 20, 14, 0.96) 0%, rgba(7, 14, 10, 0.98) 100%)",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 12px",
                borderRadius: 999,
                background: "rgba(59,130,246,0.12)",
                border: "1px solid rgba(96,165,250,0.18)",
                color: "#dcecff",
                fontSize: 13,
                fontWeight: 800,
              }}
            >
              <span>🚦</span>
              <span>Status atual</span>
            </div>

            <h3
              style={{
                margin: "14px 0 10px",
                fontSize: 24,
                lineHeight: 1.2,
                color: "#f4fff8",
              }}
            >
              O que esta Home já resolve
            </h3>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {highlights.map((text) => (
                <div
                  key={text}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    borderRadius: 16,
                    padding: "12px 12px",
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(74, 222, 128, 0.10)",
                  }}
                >
                  <span style={{ fontSize: 18, lineHeight: 1 }}>✓</span>
                  <span
                    style={{
                      fontSize: 14,
                      lineHeight: 1.6,
                      color: "rgba(229,255,241,0.78)",
                    }}
                  >
                    {text}
                  </span>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: 16,
                display: "grid",
                gap: 10,
              }}
            >
              <Link href="/explorar" style={ctaGreenSoft}>
                Explorar plataforma
              </Link>

              <Link href="/planos" style={ctaDarkSoft}>
                Ver planos
              </Link>

              <Link href="/agro" style={ctaBlueSoft}>
                Entrar no AGRO
              </Link>

              <Link href="/imobiliarias" style={ctaBlueSoft}>
                Entrar em Imobiliárias
              </Link>

              <Link href="/locadora" style={ctaBlueSoft}>
                Entrar na Locadora
              </Link>
            </div>
          </aside>
        </section>
      </section>
    </main>
  );
}

const ctaGreen = {
  textDecoration: "none",
  borderRadius: 18,
  padding: "14px 16px",
  background:
    "linear-gradient(180deg, rgba(22,163,74,0.22), rgba(22,163,74,0.10))",
  border: "1px solid rgba(74, 222, 128, 0.28)",
  color: "#f4fff8",
  fontWeight: 800,
  textAlign: "center" as const,
};

const ctaBlue = {
  textDecoration: "none",
  borderRadius: 18,
  padding: "14px 16px",
  background:
    "linear-gradient(180deg, rgba(59,130,246,0.22), rgba(59,130,246,0.10))",
  border: "1px solid rgba(96, 165, 250, 0.28)",
  color: "#eef6ff",
  fontWeight: 900,
  textAlign: "center" as const,
};

const ctaDark = {
  textDecoration: "none",
  borderRadius: 18,
  padding: "14px 16px",
  background: "rgba(12, 25, 18, 0.95)",
  border: "1px solid rgba(74, 222, 128, 0.22)",
  color: "#d7ffe6",
  fontWeight: 800,
  textAlign: "center" as const,
};

const ctaGreenSoft = {
  textDecoration: "none",
  padding: "14px 16px",
  borderRadius: 16,
  textAlign: "center" as const,
  fontWeight: 800,
  color: "#f4fff8",
  background: "rgba(22,163,74,0.16)",
  border: "1px solid rgba(74, 222, 128, 0.18)",
};

const ctaBlueSoft = {
  textDecoration: "none",
  padding: "14px 16px",
  borderRadius: 16,
  textAlign: "center" as const,
  fontWeight: 800,
  color: "#eef6ff",
  background: "rgba(59,130,246,0.14)",
  border: "1px solid rgba(96,165,250,0.18)",
};

const ctaDarkSoft = {
  textDecoration: "none",
  padding: "14px 16px",
  borderRadius: 16,
  textAlign: "center" as const,
  fontWeight: 800,
  color: "#d7ffe6",
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(74, 222, 128, 0.12)",
};