import Link from "next/link";

type ModuleCard = {
  icon: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  highlight: string;
  accent: string;
  accentSoft: string;
  accentText: string;
  border: string;
};

const modules: ModuleCard[] = [
  {
    icon: "🚗",
    title: "Aurora Locadora",
    description:
      "Área para locadoras, veículos, propostas, atendimento, cadastros e gestão comercial.",
    href: "/locadora",
    cta: "Entrar em Locadora",
    highlight: "Venda, frota e seminovos",
    accent: "linear-gradient(135deg, rgba(16,185,129,0.24), rgba(6,182,212,0.20))",
    accentSoft: "rgba(16,185,129,0.12)",
    accentText: "#34d399",
    border: "1px solid rgba(16,185,129,0.26)",
  },
  {
    icon: "🌾",
    title: "Aurora AGRO",
    description:
      "Espaço para negócios do agro, produtores, fornecedores, insumos, oportunidades e conexão comercial real.",
    href: "/agro",
    cta: "Entrar em AGRO",
    highlight: "Produtores e fornecedores",
    accent: "linear-gradient(135deg, rgba(34,197,94,0.24), rgba(16,185,129,0.20))",
    accentSoft: "rgba(34,197,94,0.12)",
    accentText: "#22c55e",
    border: "1px solid rgba(34,197,94,0.26)",
  },
  {
    icon: "🏠",
    title: "Aurora Imóveis",
    description:
      "Espaço para imóveis, captação, vitrine comercial, cadastros e fluxo de atendimento.",
    href: "/imoveis",
    cta: "Entrar em Imóveis",
    highlight: "Venda, locação e captação",
    accent: "linear-gradient(135deg, rgba(59,130,246,0.24), rgba(37,99,235,0.20))",
    accentSoft: "rgba(59,130,246,0.12)",
    accentText: "#60a5fa",
    border: "1px solid rgba(59,130,246,0.26)",
  },
  {
    icon: "🏦",
    title: "Aurora Bancos",
    description:
      "Integração com parceiros financeiros para financiamento, análise, resposta de propostas e geração de comissão.",
    href: "/bancos",
    cta: "Entrar em Bancos",
    highlight: "Financiamento e resposta comercial",
    accent: "linear-gradient(135deg, rgba(245,158,11,0.24), rgba(234,179,8,0.20))",
    accentSoft: "rgba(245,158,11,0.12)",
    accentText: "#fbbf24",
    border: "1px solid rgba(245,158,11,0.26)",
  },
];

const highlights = [
  {
    title: "Entrada comercial mais forte",
    description:
      "Os módulos principais ficam logo na Home para reduzir perda de tráfego e aumentar ação do visitante.",
  },
  {
    title: "Estrutura pronta para expansão",
    description:
      "A Aurora já consegue crescer por módulos sem bagunçar a navegação principal da plataforma.",
  },
  {
    title: "Operação com cara de plataforma real",
    description:
      "Home, módulos e caminhos comerciais já aparecem de forma mais profissional para usuário e parceiro.",
  },
  {
    title: "Atualização contínua",
    description:
      "Sistema em constante atualização. Pode haver momentos de instabilidade durante melhorias, segurança e novos lançamentos.",
  },
];

const metrics = [
  { value: "4", label: "módulos centrais" },
  { value: "100%", label: "entrada visível" },
  { value: "24h", label: "plataforma ativa" },
];

function primaryButtonStyle() {
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
    padding: "0 20px",
    borderRadius: 14,
    textDecoration: "none",
    fontWeight: 900,
    border: "1px solid rgba(52,211,153,0.45)",
    background:
      "linear-gradient(135deg, rgba(16,185,129,0.95), rgba(6,182,212,0.95))",
    color: "#04121d",
  } as const;
}

function secondaryButtonStyle() {
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
    padding: "0 20px",
    borderRadius: 14,
    textDecoration: "none",
    fontWeight: 800,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.04)",
    color: "#e5eef8",
  } as const;
}

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(16,185,129,0.16), transparent 24%), #050816",
        color: "#e5eef8",
        padding: "28px 16px 80px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1240,
          margin: "0 auto",
        }}
      >
        <section
          style={{
            borderRadius: 28,
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(7,12,28,0.88)",
            boxShadow: "0 18px 60px rgba(0,0,0,0.35)",
            padding: "34px 24px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
              gap: 22,
              alignItems: "center",
            }}
          >
            <div
              style={{
                gridColumn: "span 8",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 12px",
                  borderRadius: 999,
                  background: "rgba(16,185,129,0.12)",
                  border: "1px solid rgba(16,185,129,0.26)",
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                  color: "#86efac",
                  marginBottom: 16,
                }}
              >
                Aurora IA
              </div>

              <div
                style={{
                  color: "#8fb7ff",
                  fontWeight: 800,
                  fontSize: 14,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  marginBottom: 10,
                }}
              >
                Plataforma em expansão comercial
              </div>

              <h1
                style={{
                  margin: 0,
                  fontSize: "clamp(34px, 6vw, 58px)",
                  lineHeight: 1.08,
                  maxWidth: 940,
                }}
              >
                Aurora IA com acesso direto para{" "}
                <span
                  style={{
                    color: "#34d399",
                    fontWeight: 900,
                    textShadow: "0 0 18px rgba(52,211,153,0.22)",
                  }}
                >
                  Locadora
                </span>
                ,{" "}
                <span
                  style={{
                    color: "#22c55e",
                    fontWeight: 900,
                    textShadow: "0 0 18px rgba(34,197,94,0.22)",
                  }}
                >
                  AGRO
                </span>
                ,{" "}
                <span
                  style={{
                    color: "#60a5fa",
                    fontWeight: 900,
                    textShadow: "0 0 18px rgba(96,165,250,0.22)",
                  }}
                >
                  Imóveis
                </span>{" "}
                e{" "}
                <span
                  style={{
                    color: "#fbbf24",
                    fontWeight: 900,
                    textShadow: "0 0 18px rgba(251,191,36,0.22)",
                  }}
                >
                  Bancos
                </span>
              </h1>

              <p
                style={{
                  marginTop: 16,
                  marginBottom: 0,
                  color: "#9fb0c7",
                  fontSize: 18,
                  lineHeight: 1.8,
                  maxWidth: 930,
                }}
              >
                Converse, gere campanhas, cadastre oportunidades e acesse módulos
                comerciais da Aurora em um só ambiente. A estrutura principal já
                está pronta para atrair tráfego, distribuir interesse e acelerar
                entrada comercial.
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: 12,
                  marginTop: 24,
                  maxWidth: 930,
                }}
              >
                {modules.map((module) => (
                  <div
                    key={`top-${module.title}`}
                    style={{
                      borderRadius: 18,
                      padding: 14,
                      background: module.accent,
                      border: module.border,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 900,
                        color: module.accentText,
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                        marginBottom: 6,
                      }}
                    >
                      {module.title}
                    </div>
                    <div
                      style={{
                        color: "#dbe7f5",
                        fontSize: 13,
                        lineHeight: 1.55,
                        fontWeight: 700,
                      }}
                    >
                      {module.highlight}
                    </div>
                  </div>
                ))}
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 12,
                  flexWrap: "wrap",
                  marginTop: 24,
                }}
              >
                <Link href="/chat" style={primaryButtonStyle()}>
                  Abrir chat da Aurora
                </Link>

                <Link href="/locadora" style={secondaryButtonStyle()}>
                  Entrar na Locadora
                </Link>

                <Link href="/planos" style={secondaryButtonStyle()}>
                  Ver planos
                </Link>

                <Link href="/explorar" style={secondaryButtonStyle()}>
                  Explorar plataforma
                </Link>
              </div>
            </div>

            <div
              style={{
                gridColumn: "span 4",
              }}
            >
              <div
                style={{
                  borderRadius: 24,
                  border: "1px solid rgba(255,255,255,0.08)",
                  background:
                    "linear-gradient(180deg, rgba(12,18,40,0.95), rgba(7,12,28,0.92))",
                  padding: 22,
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    color: "#8fb7ff",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: 0.4,
                    marginBottom: 10,
                  }}
                >
                  Entrada estratégica
                </div>

                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 900,
                    lineHeight: 1.12,
                    marginBottom: 12,
                  }}
                >
                  Uma Home pronta para venda, navegação e expansão
                </div>

                <div
                  style={{
                    color: "#9fb0c7",
                    lineHeight: 1.7,
                    fontSize: 15,
                  }}
                >
                  Os módulos principais ficam visíveis logo de cara para reduzir
                  perda de tráfego e aumentar acesso comercial.
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                    gap: 10,
                    marginTop: 18,
                  }}
                >
                  {metrics.map((metric) => (
                    <div
                      key={metric.label}
                      style={{
                        borderRadius: 16,
                        padding: "14px 10px",
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 24,
                          fontWeight: 900,
                        }}
                      >
                        {metric.value}
                      </div>
                      <div
                        style={{
                          marginTop: 6,
                          fontSize: 12,
                          color: "#9fb0c7",
                          lineHeight: 1.4,
                        }}
                      >
                        {metric.label}
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    display: "grid",
                    gap: 10,
                    marginTop: 18,
                  }}
                >
                  {modules.map((module) => (
                    <div
                      key={`side-${module.title}`}
                      style={{
                        borderRadius: 14,
                        padding: "10px 12px",
                        background: module.accentSoft,
                        border: module.border,
                        color: module.accentText,
                        fontWeight: 900,
                      }}
                    >
                      {module.title.replace("Aurora ", "")}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          style={{
            marginTop: 24,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
            gap: 18,
          }}
        >
          {modules.map((module) => (
            <article
              key={module.title}
              style={{
                borderRadius: 24,
                border: module.border,
                background:
                  "linear-gradient(180deg, rgba(10,15,34,0.95), rgba(6,10,24,0.92))",
                boxShadow: "0 16px 40px rgba(0,0,0,0.26)",
                padding: 22,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 56,
                  height: 56,
                  borderRadius: 18,
                  background: module.accent,
                  border: module.border,
                  fontSize: 28,
                  marginBottom: 16,
                }}
              >
                {module.icon}
              </div>

              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "6px 10px",
                  borderRadius: 999,
                  background: module.accentSoft,
                  border: module.border,
                  color: module.accentText,
                  fontSize: 12,
                  fontWeight: 800,
                  marginBottom: 12,
                  width: "fit-content",
                }}
              >
                {module.highlight}
              </div>

              <h2
                style={{
                  margin: 0,
                  fontSize: 25,
                  lineHeight: 1.1,
                }}
              >
                {module.title}
              </h2>

              <p
                style={{
                  marginTop: 12,
                  marginBottom: 0,
                  color: "#9fb0c7",
                  fontSize: 15,
                  lineHeight: 1.75,
                  flex: 1,
                  minHeight: 105,
                }}
              >
                {module.description}
              </p>

              <div style={{ marginTop: 18 }}>
                <Link
                  href={module.href}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 48,
                    padding: "0 16px",
                    borderRadius: 14,
                    textDecoration: "none",
                    border: module.border,
                    background: module.accentSoft,
                    color: module.accentText,
                    fontWeight: 900,
                    width: "100%",
                  }}
                >
                  {module.cta}
                </Link>
              </div>
            </article>
          ))}
        </section>

        <section
          style={{
            marginTop: 24,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 16,
          }}
        >
          {highlights.map((item) => (
            <article
              key={item.title}
              style={{
                borderRadius: 22,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.03)",
                padding: 20,
              }}
            >
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 900,
                  marginBottom: 10,
                }}
              >
                {item.title}
              </div>

              <div
                style={{
                  color: "#9fb0c7",
                  lineHeight: 1.75,
                  fontSize: 15,
                }}
              >
                {item.description}
              </div>
            </article>
          ))}
        </section>

        <section
          style={{
            marginTop: 24,
            borderRadius: 24,
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.03)",
            padding: 22,
            display: "flex",
            gap: 16,
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div style={{ maxWidth: 760 }}>
            <div
              style={{
                fontSize: 22,
                fontWeight: 900,
                marginBottom: 8,
              }}
            >
              A Aurora já está distribuindo tráfego para os módulos
            </div>

            <div
              style={{
                color: "#9fb0c7",
                lineHeight: 1.75,
                fontSize: 15,
              }}
            >
              O Analytics já mostra acessos na Home, AGRO, Bancos, Imóveis e
              Locadora. O momento agora é fortalecer a entrada e continuar a
              divulgação com a plataforma mais organizada.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <Link href="/agro" style={secondaryButtonStyle()}>
              Ir para AGRO
            </Link>
            <Link href="/imoveis" style={secondaryButtonStyle()}>
              Ir para Imóveis
            </Link>
            <Link href="/bancos" style={secondaryButtonStyle()}>
              Ir para Bancos
            </Link>
            <Link href="/locadora" style={primaryButtonStyle()}>
              Ir para Locadora
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}