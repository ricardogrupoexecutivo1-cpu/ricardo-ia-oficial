import Link from "next/link";

const quickLinks = [
  {
    title: "Painel de Bancos",
    description:
      "Área para parceiros financeiros, análise de propostas, resposta comercial e integração com a Aurora.",
    href: "#painel-bancos",
    cta: "Abrir painel de bancos",
  },
  {
    title: "Propostas e respostas",
    description:
      "Fluxo para acompanhar propostas, aprovações, recusas e retorno comercial ao cliente.",
    href: "#propostas-respostas",
    cta: "Ver fluxo comercial",
  },
  {
    title: "Comissões e operação",
    description:
      "Estrutura para comissão da plataforma sem perder o controle da venda e do financiamento.",
    href: "#comissoes-operacao",
    cta: "Ver operação financeira",
  },
];

const pillars = [
  "Financiamento",
  "Resposta de proposta",
  "Seguros",
  "Parcerias",
  "Comissões",
  "Operação integrada",
];

function sectionCardStyle() {
  return {
    borderRadius: 24,
    padding: 24,
    border: "1px solid rgba(255,255,255,0.08)",
    background:
      "linear-gradient(180deg, rgba(10,15,34,0.95), rgba(6,10,24,0.92))",
    boxShadow: "0 16px 40px rgba(0,0,0,0.26)",
  } as const;
}

export default function BancosPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(245,158,11,0.16), transparent 24%), #050816",
        color: "#e5eef8",
        padding: "28px 16px 80px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1220,
          margin: "0 auto",
        }}
      >
        <section
          style={{
            borderRadius: 28,
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(7,12,28,0.88)",
            boxShadow: "0 18px 60px rgba(0,0,0,0.35)",
            padding: "32px 24px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
              gap: 20,
              alignItems: "center",
            }}
          >
            <div style={{ gridColumn: "span 8" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 12px",
                  borderRadius: 999,
                  background: "rgba(245,158,11,0.12)",
                  border: "1px solid rgba(245,158,11,0.26)",
                  fontSize: 12,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  color: "#fcd34d",
                  marginBottom: 16,
                }}
              >
                Aurora Bancos
              </div>

              <h1
                style={{
                  margin: 0,
                  fontSize: "clamp(32px, 6vw, 52px)",
                  lineHeight: 1.04,
                }}
              >
                Integração financeira para aprovação, resposta e comissão
              </h1>

              <p
                style={{
                  marginTop: 16,
                  color: "#9fb0c7",
                  fontSize: 17,
                  lineHeight: 1.7,
                  maxWidth: 850,
                }}
              >
                Estrutura para bancos e parceiros financeiros atuarem dentro da
                Aurora, respondendo propostas, oferecendo financiamento, seguro
                e gerando comissão sem perder o controle comercial.
              </p>

              <div
                style={{
                  display: "flex",
                  gap: 12,
                  flexWrap: "wrap",
                  marginTop: 22,
                }}
              >
                <a
                  href="#painel-bancos"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 48,
                    padding: "0 18px",
                    borderRadius: 14,
                    background: "#f59e0b",
                    color: "#04121d",
                    fontWeight: 900,
                    textDecoration: "none",
                  }}
                >
                  Entrar em Bancos
                </a>

                <a
                  href="#propostas-respostas"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 48,
                    padding: "0 18px",
                    borderRadius: 14,
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "rgba(255,255,255,0.04)",
                    color: "#fff",
                    textDecoration: "none",
                    fontWeight: 800,
                  }}
                >
                  Ver propostas
                </a>

                <Link
                  href="/"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 48,
                    padding: "0 18px",
                    borderRadius: 14,
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "rgba(255,255,255,0.04)",
                    color: "#fff",
                    textDecoration: "none",
                    fontWeight: 800,
                  }}
                >
                  Voltar à Home
                </Link>
              </div>
            </div>

            <div style={{ gridColumn: "span 4" }}>
              <div
                style={{
                  borderRadius: 24,
                  border: "1px solid rgba(255,255,255,0.08)",
                  background:
                    "linear-gradient(180deg, rgba(12,18,40,0.95), rgba(7,12,28,0.92))",
                  padding: 20,
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    color: "#fcd34d",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    marginBottom: 12,
                  }}
                >
                  Pilares do módulo
                </div>

                {pillars.map((item) => (
                  <div
                    key={item}
                    style={{
                      marginBottom: 8,
                      borderRadius: 12,
                      padding: "10px 12px",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      fontWeight: 800,
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          style={{
            marginTop: 24,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 18,
          }}
        >
          {quickLinks.map((item) => (
            <article
              key={item.title}
              style={{
                borderRadius: 24,
                padding: 20,
                border: "1px solid rgba(255,255,255,0.08)",
                background:
                  "linear-gradient(180deg, rgba(10,15,34,0.95), rgba(6,10,24,0.92))",
              }}
            >
              <h2 style={{ marginTop: 0 }}>{item.title}</h2>
              <p style={{ color: "#9fb0c7", lineHeight: 1.7 }}>
                {item.description}
              </p>

              <a
                href={item.href}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 44,
                  padding: "0 16px",
                  borderRadius: 12,
                  textDecoration: "none",
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.04)",
                  color: "#fff",
                  fontWeight: 900,
                  width: "100%",
                }}
              >
                {item.cta}
              </a>
            </article>
          ))}
        </section>

        <section
          id="painel-bancos"
          style={{
            ...sectionCardStyle(),
            marginTop: 24,
            scrollMarginTop: 90,
          }}
        >
          <div
            style={{
              fontSize: 13,
              color: "#fcd34d",
              fontWeight: 800,
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            Painel de bancos
          </div>

          <h2
            style={{
              marginTop: 0,
              marginBottom: 12,
              fontSize: 30,
            }}
          >
            Parceiros financeiros dentro da operação Aurora
          </h2>

          <p
            style={{
              color: "#9fb0c7",
              lineHeight: 1.8,
              fontSize: 16,
              maxWidth: 980,
            }}
          >
            Este módulo foi pensado para que bancos e parceiros financeiros
            recebam propostas diretamente pela plataforma, analisem o perfil,
            respondam no mesmo ambiente e evitem fuga da comissão e da venda.
          </p>
        </section>

        <section
          id="propostas-respostas"
          style={{
            ...sectionCardStyle(),
            marginTop: 20,
            scrollMarginTop: 90,
          }}
        >
          <div
            style={{
              fontSize: 13,
              color: "#fcd34d",
              fontWeight: 800,
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            Propostas e respostas
          </div>

          <h2
            style={{
              marginTop: 0,
              marginBottom: 12,
              fontSize: 30,
            }}
          >
            Fluxo comercial para aprovação, recusa e retorno ao cliente
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 14,
              marginTop: 18,
            }}
          >
            {[
              "Receber proposta pela plataforma",
              "Analisar perfil e documentação",
              "Responder com aprovação ou recusa",
              "Gerar retorno rápido ao cliente",
            ].map((step, index) => (
              <div
                key={step}
                style={{
                  borderRadius: 18,
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.03)",
                  padding: 18,
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 900,
                    color: "#fcd34d",
                    marginBottom: 8,
                  }}
                >
                  ETAPA {index + 1}
                </div>
                <div
                  style={{
                    fontWeight: 800,
                    lineHeight: 1.5,
                  }}
                >
                  {step}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section
          id="comissoes-operacao"
          style={{
            ...sectionCardStyle(),
            marginTop: 20,
            scrollMarginTop: 90,
          }}
        >
          <div
            style={{
              fontSize: 13,
              color: "#fcd34d",
              fontWeight: 800,
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            Comissões e operação
          </div>

          <h2
            style={{
              marginTop: 0,
              marginBottom: 12,
              fontSize: 30,
            }}
          >
            Operação financeira integrada sem perder o controle da plataforma
          </h2>

          <p
            style={{
              color: "#9fb0c7",
              lineHeight: 1.8,
              fontSize: 16,
              maxWidth: 980,
            }}
          >
            A proposta deste módulo é permitir que o parceiro financeiro atenda
            dentro da Aurora, responda as oportunidades no próprio ambiente e
            mantenha o fluxo de comissão e conversão sob controle da
            plataforma.
          </p>

          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              marginTop: 18,
            }}
          >
            {[
              "Financiamento no local",
              "Seguro integrado",
              "Comissão protegida",
              "Retorno comercial rápido",
            ].map((tag) => (
              <span
                key={tag}
                style={{
                  padding: "10px 12px",
                  borderRadius: 999,
                  background: "rgba(245,158,11,0.12)",
                  border: "1px solid rgba(245,158,11,0.24)",
                  color: "#fde68a",
                  fontWeight: 800,
                  fontSize: 13,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}