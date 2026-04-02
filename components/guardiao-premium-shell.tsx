import Link from "next/link";

type GuardStatusTone = "ok" | "warning" | "danger" | "info";

type GuardStatusItem = {
  label: string;
  value: string;
  tone: GuardStatusTone;
  description: string;
};

type GuardMetricItem = {
  label: string;
  value: string;
  helper: string;
};

type GuardActionItem = {
  href: string;
  label: string;
  variant?: "primary" | "secondary";
};

type GuardiaoPremiumShellProps = {
  badge?: string;
  title?: string;
  subtitle?: string;
  emailLabel?: string;
  emailValue?: string;
  statusItems?: GuardStatusItem[];
  metricItems?: GuardMetricItem[];
  actionItems?: GuardActionItem[];
  notice?: string;
};

function getToneStyle(tone: GuardStatusTone) {
  switch (tone) {
    case "ok":
      return {
        color: "#bbf7d0",
        background: "rgba(34,197,94,0.10)",
        border: "1px solid rgba(34,197,94,0.22)",
        dot: "#22c55e",
        label: "OK",
      };
    case "warning":
      return {
        color: "#fde68a",
        background: "rgba(245,158,11,0.10)",
        border: "1px solid rgba(245,158,11,0.22)",
        dot: "#f59e0b",
        label: "Atenção",
      };
    case "danger":
      return {
        color: "#fecaca",
        background: "rgba(239,68,68,0.10)",
        border: "1px solid rgba(239,68,68,0.22)",
        dot: "#ef4444",
        label: "Crítico",
      };
    case "info":
    default:
      return {
        color: "#bfdbfe",
        background: "rgba(59,130,246,0.10)",
        border: "1px solid rgba(59,130,246,0.22)",
        dot: "#3b82f6",
        label: "Info",
      };
  }
}

export function GuardiaoPremiumShell({
  badge = "Guardião da Aurora",
  title = "Guardião real",
  subtitle = "Painel premium de leitura, controle, proteção e evolução da camada pública dos cadastros reais da Aurora. Sistema em constante atualização e pode haver momentos de instabilidade durante melhorias e novas liberações.",
  emailLabel = "Usuário atual",
  emailValue = "Sessão não encontrada no momento",
  statusItems = [
    {
      label: "Guardião real",
      value: "Painel premium ativo",
      tone: "ok",
      description:
        "Camada visual principal aplicada no padrão operacional escuro premium da Aurora.",
    },
    {
      label: "Autenticação",
      value: "Sessão não encontrada",
      tone: "warning",
      description:
        "Quando não houver sessão ativa, o painel informa com clareza sem quebrar a experiência visual.",
    },
    {
      label: "Cadastros",
      value: "Monitorando",
      tone: "info",
      description:
        "Estrutura pronta para exibir rascunhos, públicos e leitura protegida assim que a conexão real estiver ativa.",
    },
    {
      label: "Próxima etapa",
      value: "Reconectar Supabase",
      tone: "warning",
      description:
        "A próxima atualização vai religar autenticação e leitura real mantendo o novo padrão visual.",
    },
  ],
  metricItems = [
    {
      label: "Cadastros",
      value: "0",
      helper:
        "Quantidade atual antes da reconexão completa da leitura autenticada.",
    },
    {
      label: "Rascunhos",
      value: "0",
      helper:
        "Cadastros não publicados aparecerão aqui com sessão e backend conectados.",
    },
    {
      label: "Públicos",
      value: "0",
      helper:
        "Cadastros públicos serão carregados nesta área assim que a leitura real for retomada.",
    },
  ],
  actionItems = [
    { href: "/", label: "Voltar à Home", variant: "secondary" },
    { href: "/cadastro", label: "Ir para Cadastro", variant: "secondary" },
    { href: "/explorar", label: "Busca pública", variant: "secondary" },
    { href: "/mineracao", label: "Mineração", variant: "primary" },
  ],
  notice = "O Guardião é a camada estratégica de percepção, proteção e estabilidade da Aurora. Ele existe para reduzir ruído, mostrar sinais críticos e proteger a confiança visual da plataforma.",
}: GuardiaoPremiumShellProps) {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(34,197,94,0.08) 0%, rgba(8,12,22,0.98) 30%, #040816 65%, #020617 100%)",
        color: "#f8fafc",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: 1240,
          margin: "0 auto",
          padding: "20px 16px 80px",
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        <section
          style={{
            borderRadius: 32,
            border: "1px solid rgba(110, 231, 255, 0.14)",
            background:
              "linear-gradient(135deg, rgba(6,10,20,0.98) 0%, rgba(8,14,26,0.96) 50%, rgba(7,12,24,0.98) 100%)",
            padding: "26px 18px",
            boxShadow: "0 25px 90px rgba(0,0,0,0.35)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 18,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                width: "fit-content",
                padding: "8px 12px",
                borderRadius: 999,
                background: "rgba(34,197,94,0.10)",
                border: "1px solid rgba(34,197,94,0.22)",
                color: "#bbf7d0",
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: 0.4,
              }}
            >
              🛡️ {badge}
            </span>

            <h1
              style={{
                margin: 0,
                fontSize: "clamp(30px, 4vw, 48px)",
                lineHeight: 1.04,
                fontWeight: 900,
                letterSpacing: -1.2,
              }}
            >
              {title}
            </h1>

            <p
              style={{
                margin: 0,
                color: "rgba(226,232,240,0.82)",
                fontSize: 15,
                lineHeight: 1.7,
                maxWidth: 760,
              }}
            >
              {subtitle}
            </p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
                marginTop: 2,
              }}
            >
              {actionItems.map((action) => (
                <Link
                  key={`${action.href}-${action.label}`}
                  href={action.href}
                  style={
                    action.variant === "primary"
                      ? {
                          minHeight: 46,
                          padding: "0 16px",
                          borderRadius: 14,
                          textDecoration: "none",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 800,
                          fontSize: 14,
                          color: "#04111d",
                          background:
                            "linear-gradient(135deg, #67e8f9 0%, #22c55e 100%)",
                          boxShadow: "0 18px 40px rgba(34,197,94,0.22)",
                          border: "none",
                        }
                      : {
                          minHeight: 46,
                          padding: "0 16px",
                          borderRadius: 14,
                          textDecoration: "none",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 800,
                          fontSize: 14,
                          color: "#e2e8f0",
                          border: "1px solid rgba(148,163,184,0.24)",
                          background: "rgba(15,23,42,0.72)",
                          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
                        }
                  }
                >
                  {action.label}
                </Link>
              ))}
            </div>

            <div
              style={{
                borderRadius: 18,
                border: "1px solid rgba(34,197,94,0.18)",
                background: "rgba(20,83,45,0.22)",
                padding: "14px",
                color: "#bbf7d0",
                fontSize: 14,
                lineHeight: 1.6,
                fontWeight: 700,
              }}
            >
              {emailLabel}: {emailValue}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 12,
            }}
          >
            {[
              {
                title: "Status operacional",
                value:
                  "Leitura visual segmentada com blocos fortes, bordas visíveis e contraste premium.",
              },
              {
                title: "Proteção de UX",
                value:
                  "A experiência não quebra mais mesmo quando a sessão ainda não estiver presente.",
              },
              {
                title: "Camada pública",
                value:
                  "O Guardião foi preparado para leitura real de rascunhos, públicos e estado dos cadastros.",
              },
              {
                title: "Direção do módulo",
                value:
                  "Padrão escuro premium alinhado ao Financeiro Aurora para aumentar autoridade visual.",
              },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  borderRadius: 22,
                  border: "1px solid rgba(148,163,184,0.14)",
                  background: "rgba(15,23,42,0.62)",
                  padding: "16px 14px",
                  minHeight: 130,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    color: "#93c5fd",
                    fontSize: 12,
                    fontWeight: 800,
                    letterSpacing: 0.4,
                    textTransform: "uppercase",
                  }}
                >
                  {item.title}
                </div>
                <div
                  style={{
                    color: "#f8fafc",
                    fontSize: 15,
                    lineHeight: 1.5,
                    fontWeight: 700,
                  }}
                >
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 14,
          }}
        >
          {statusItems.map((item) => {
            const tone = getToneStyle(item.tone);

            return (
              <article
                key={`${item.label}-${item.value}`}
                style={{
                  borderRadius: 24,
                  border: "1px solid rgba(148,163,184,0.14)",
                  background:
                    "linear-gradient(180deg, rgba(8,12,24,0.95) 0%, rgba(6,10,19,0.98) 100%)",
                  padding: "18px 16px",
                  boxShadow: "0 18px 60px rgba(0,0,0,0.26)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  minHeight: 180,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <div
                      style={{
                        color: "#93c5fd",
                        fontSize: 12,
                        fontWeight: 800,
                        letterSpacing: 0.4,
                        textTransform: "uppercase",
                      }}
                    >
                      {item.label}
                    </div>

                    <h3
                      style={{
                        margin: 0,
                        color: "#f8fafc",
                        fontSize: 22,
                        lineHeight: 1.08,
                        fontWeight: 900,
                        letterSpacing: -0.6,
                      }}
                    >
                      {item.value}
                    </h3>
                  </div>

                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      minHeight: 34,
                      padding: "0 12px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 800,
                      whiteSpace: "nowrap",
                      color: tone.color,
                      background: tone.background,
                      border: tone.border,
                    }}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 999,
                        background: tone.dot,
                        boxShadow: `0 0 12px ${tone.dot}`,
                      }}
                    />
                    {tone.label}
                  </span>
                </div>

                <div
                  style={{
                    height: 1,
                    background:
                      "linear-gradient(90deg, rgba(59,130,246,0.22), rgba(148,163,184,0.08), transparent)",
                  }}
                />

                <p
                  style={{
                    margin: 0,
                    color: "rgba(226,232,240,0.78)",
                    fontSize: 14,
                    lineHeight: 1.7,
                    fontWeight: 600,
                  }}
                >
                  {item.description}
                </p>
              </article>
            );
          })}
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 0.9fr)",
            gap: 16,
          }}
        >
          <div
            style={{
              borderRadius: 28,
              border: "1px solid rgba(148,163,184,0.14)",
              background:
                "linear-gradient(180deg, rgba(8,12,24,0.95) 0%, rgba(5,9,18,0.98) 100%)",
              padding: "20px 18px",
              display: "flex",
              flexDirection: "column",
              gap: 16,
              boxShadow: "0 18px 60px rgba(0,0,0,0.26)",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <span
                style={{
                  color: "#93c5fd",
                  fontSize: 12,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: 0.4,
                }}
              >
                Camada estratégica
              </span>

              <h2
                style={{
                  margin: 0,
                  fontSize: 26,
                  lineHeight: 1.08,
                  fontWeight: 900,
                }}
              >
                Guardião da percepção
              </h2>

              <p
                style={{
                  margin: 0,
                  color: "rgba(226,232,240,0.78)",
                  fontSize: 14,
                  lineHeight: 1.7,
                }}
              >
                {notice}
              </p>
            </div>

            <div
              style={{
                borderRadius: 18,
                border: "1px solid rgba(59,130,246,0.16)",
                background: "rgba(15,23,42,0.58)",
                padding: "14px",
                color: "#bfdbfe",
                fontSize: 14,
                lineHeight: 1.65,
                fontWeight: 700,
              }}
            >
              O Guardião deve proteger navegação, leitura dos sinais críticos,
              estabilidade percebida e reputação da plataforma em produção.
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 12,
              }}
            >
              {[
                {
                  label: "Objetivo",
                  value:
                    "Proteger a experiência e a reputação da plataforma.",
                },
                {
                  label: "Leitura inteligente",
                  value:
                    "Priorizar rotas críticas, sinais de erro e percepção do usuário.",
                },
                {
                  label: "Visão premium",
                  value:
                    "Interface forte, confiável e pronta para escala global.",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    borderRadius: 18,
                    border: "1px solid rgba(148,163,184,0.14)",
                    background: "rgba(15,23,42,0.62)",
                    padding: "14px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      color: "#93c5fd",
                      fontSize: 12,
                      fontWeight: 800,
                      letterSpacing: 0.4,
                      textTransform: "uppercase",
                    }}
                  >
                    {item.label}
                  </div>
                  <div
                    style={{
                      color: "#f8fafc",
                      fontSize: 14,
                      lineHeight: 1.6,
                      fontWeight: 700,
                    }}
                  >
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: 14,
            }}
          >
            {metricItems.map((metric) => (
              <article
                key={metric.label}
                style={{
                  borderRadius: 24,
                  border: "1px solid rgba(148,163,184,0.14)",
                  background:
                    "linear-gradient(180deg, rgba(8,12,24,0.95) 0%, rgba(6,10,19,0.98) 100%)",
                  padding: "18px 16px",
                  boxShadow: "0 18px 60px rgba(0,0,0,0.26)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  minHeight: 145,
                }}
              >
                <div
                  style={{
                    color: "#93c5fd",
                    fontSize: 12,
                    fontWeight: 800,
                    letterSpacing: 0.4,
                    textTransform: "uppercase",
                  }}
                >
                  {metric.label}
                </div>

                <div
                  style={{
                    color: "#f8fafc",
                    fontSize: 34,
                    lineHeight: 1,
                    fontWeight: 900,
                    letterSpacing: -1,
                  }}
                >
                  {metric.value}
                </div>

                <div
                  style={{
                    height: 1,
                    background:
                      "linear-gradient(90deg, rgba(59,130,246,0.22), rgba(148,163,184,0.08), transparent)",
                  }}
                />

                <p
                  style={{
                    margin: 0,
                    color: "rgba(226,232,240,0.78)",
                    fontSize: 14,
                    lineHeight: 1.7,
                    fontWeight: 600,
                  }}
                >
                  {metric.helper}
                </p>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}