import Link from "next/link";

const plans = [
  {
    name: "FREE",
    badge: "Entrada",
    price: "Grátis",
    subtitle: "Entrada livre para conhecer",
    description:
      "Para conhecer a Aurora IA, testar o chat e validar o valor da plataforma.",
    features: [
      "Acesso inicial à Aurora IA",
      "Uso básico para testes",
      "Entrada rápida na plataforma",
      "Ideal para conhecer a ferramenta",
    ],
    cta: "Começar grátis",
    href: "/chat",
    highlight: false,
    external: false,
  },
  {
    name: "PRO",
    badge: "Entrada paga",
    price: "R$ 9,90/mês",
    subtitle: "Cobrança recorrente mensal",
    description:
      "Plano inicial para quem quer começar a usar a Aurora IA para criar e vender.",
    features: [
      "Chat com uso ampliado",
      "Criação de campanhas",
      "Geração de imagens",
      "Uso comercial liberado",
      "Ideal para começar",
    ],
    cta: "Assinar PRO",
    href: "https://www.asaas.com/c/ej715gfx5qpvlh1v",
    highlight: true,
    external: true,
  },
  {
    name: "PLUS",
    badge: "Crescimento",
    price: "R$ 29,90/mês",
    subtitle: "Cobrança recorrente mensal",
    description:
      "Plano intermediário para quem quer mais consistência, volume e performance.",
    features: [
      "Tudo do plano PRO",
      "Mais uso diário",
      "Mais velocidade de geração",
      "Melhor consistência",
      "Ideal para quem já começou a vender",
    ],
    cta: "Assinar PLUS",
    href: "https://www.asaas.com/c/7jhiilct1ztpsvws",
    highlight: false,
    external: true,
  },
  {
    name: "MAX",
    badge: "Premium",
    price: "R$ 49,90/mês",
    subtitle: "Cobrança recorrente mensal",
    description:
      "Plano premium para quem quer mais poder, prioridade e crescimento acelerado.",
    features: [
      "Tudo do plano PLUS",
      "Prioridade de uso",
      "Mais poder de criação",
      "Recursos premium em expansão",
      "Ideal para escala",
    ],
    cta: "Assinar MAX",
    href: "https://www.asaas.com/c/m2co5t8qj55fvn2d",
    highlight: false,
    external: true,
  },
  {
    name: "SCALE",
    badge: "Escala",
    price: "Sob consulta",
    subtitle: "Plano personalizado",
    description:
      "Para quem quer escalar com mais força, estrutura e soluções personalizadas.",
    features: [
      "Estrutura avançada",
      "Suporte prioritário",
      "Possível personalização",
      "Foco em crescimento",
      "Ideal para empresas",
    ],
    cta: "Falar sobre SCALE",
    href: "https://wa.me/5531997490074?text=Quero%20saber%20sobre%20o%20plano%20SCALE%20da%20Aurora%20IA%20para%20aumentar%20minhas%20vendas%20com%20IA",
    highlight: false,
    external: true,
  },
];

export default function PlanosPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(0,208,132,0.14), transparent 34%), linear-gradient(180deg, #07110d 0%, #0b1720 100%)",
        color: "#ecfff5",
        padding: "32px 20px 60px",
      }}
    >
      <section
        style={{
          maxWidth: 1220,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 14px",
            borderRadius: 999,
            border: "1px solid rgba(0,208,132,0.25)",
            background: "rgba(255,255,255,0.04)",
            color: "#9effcf",
            fontWeight: 800,
            fontSize: 13,
            marginBottom: 18,
          }}
        >
          Aurora IA Planos
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: "clamp(32px, 6vw, 58px)",
            lineHeight: 1.02,
            fontWeight: 900,
            letterSpacing: "-0.03em",
            maxWidth: 920,
          }}
        >
          Escolha o plano ideal para crescer com a Aurora IA
        </h1>

        <p
          style={{
            marginTop: 18,
            marginBottom: 0,
            maxWidth: 860,
            fontSize: 18,
            lineHeight: 1.7,
            color: "rgba(236,255,245,0.78)",
          }}
        >
          Crie imagens, campanhas, ideias de negócio e acelere sua operação com
          uma estrutura pensada para conversão, uso comercial e crescimento real.
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            marginTop: 24,
          }}
        >
          <Link
            href="/chat"
            style={{
              minHeight: 48,
              padding: "0 18px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 14,
              background: "linear-gradient(135deg, #75ffbf 0%, #00d084 100%)",
              color: "#04110d",
              fontWeight: 900,
              textDecoration: "none",
              boxShadow: "0 12px 30px rgba(0,208,132,0.18)",
            }}
          >
            Testar agora
          </Link>

          <Link
            href="/afiliados"
            style={{
              minHeight: 48,
              padding: "0 18px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 14,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "#ecfff5",
              fontWeight: 800,
              textDecoration: "none",
            }}
          >
            Programa de afiliados
          </Link>
        </div>

        <div
          style={{
            marginTop: 18,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 12,
            maxWidth: 980,
          }}
        >
          {[
            {
              title: "Conversão",
              text: "Planos claros, oferta simples e caminho direto para vender.",
            },
            {
              title: "Uso comercial",
              text: "Ideal para criadores, vendedores, agências e operações reais.",
            },
            {
              title: "Escala",
              text: "Entre no PRO ou suba para PLUS, MAX ou SCALE conforme sua fase.",
            },
          ].map((item) => (
            <div
              key={item.title}
              style={{
                padding: "14px 16px",
                borderRadius: 16,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.04)",
              }}
            >
              <div style={{ fontWeight: 900, marginBottom: 6 }}>{item.title}</div>
              <div style={{ color: "rgba(236,255,245,0.76)", lineHeight: 1.6 }}>
                {item.text}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 30,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
            gap: 20,
          }}
        >
          {plans.map((plan) => {
            const isHighlight = plan.highlight;

            return (
              <article
                key={plan.name}
                style={{
                  borderRadius: 24,
                  padding: 24,
                  border: isHighlight
                    ? "1px solid rgba(0,208,132,0.34)"
                    : "1px solid rgba(255,255,255,0.08)",
                  background: isHighlight
                    ? "linear-gradient(180deg, rgba(0,208,132,0.10), rgba(255,255,255,0.04))"
                    : "rgba(255,255,255,0.04)",
                  boxShadow: isHighlight
                    ? "0 24px 60px rgba(0,208,132,0.10)"
                    : "0 18px 40px rgba(0,0,0,0.18)",
                }}
              >
                <div style={{ fontSize: 13, color: "#9effcf", fontWeight: 800 }}>
                  Plano Aurora
                </div>

                <h2
                  style={{
                    margin: "10px 0 0",
                    fontSize: 30,
                    fontWeight: 900,
                    color: "#ecfff5",
                  }}
                >
                  {plan.name}
                </h2>

                <div
                  style={{
                    marginTop: 10,
                    display: "inline-flex",
                    padding: "6px 10px",
                    borderRadius: 999,
                    background: isHighlight
                      ? "rgba(0,208,132,0.16)"
                      : "rgba(255,255,255,0.06)",
                    border: isHighlight
                      ? "1px solid rgba(0,208,132,0.26)"
                      : "1px solid rgba(255,255,255,0.10)",
                    color: isHighlight ? "#9effcf" : "rgba(236,255,245,0.82)",
                    fontSize: 12,
                    fontWeight: 900,
                  }}
                >
                  {plan.badge}
                </div>

                <div
                  style={{
                    marginTop: 14,
                    fontSize: 28,
                    fontWeight: 900,
                    color: isHighlight ? "#75ffbf" : "#ffffff",
                  }}
                >
                  {plan.price}
                </div>

                <div
                  style={{
                    marginTop: 6,
                    fontSize: 13,
                    color: "rgba(236,255,245,0.58)",
                    fontWeight: 700,
                  }}
                >
                  {plan.subtitle}
                </div>

                <p
                  style={{
                    marginTop: 14,
                    marginBottom: 0,
                    fontSize: 15,
                    lineHeight: 1.7,
                    color: "rgba(236,255,245,0.76)",
                    minHeight: 88,
                  }}
                >
                  {plan.description}
                </p>

                <div style={{ marginTop: 18, display: "grid", gap: 10 }}>
                  {plan.features.map((feature) => (
                    <div
                      key={feature}
                      style={{
                        display: "flex",
                        gap: 10,
                        color: "rgba(236,255,245,0.82)",
                        lineHeight: 1.5,
                      }}
                    >
                      <span style={{ color: "#75ffbf", fontWeight: 900 }}>✓</span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {plan.external ? (
                  <a
                    href={plan.href}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      marginTop: 22,
                      minHeight: 50,
                      padding: "0 18px",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 14,
                      background: isHighlight
                        ? "linear-gradient(135deg, #75ffbf 0%, #00d084 100%)"
                        : "rgba(255,255,255,0.06)",
                      border: isHighlight
                        ? "none"
                        : "1px solid rgba(255,255,255,0.12)",
                      color: isHighlight ? "#04110d" : "#ecfff5",
                      fontWeight: 900,
                      textDecoration: "none",
                      width: "100%",
                      boxSizing: "border-box",
                    }}
                  >
                    {plan.cta}
                  </a>
                ) : (
                  <Link
                    href={plan.href}
                    style={{
                      marginTop: 22,
                      minHeight: 50,
                      padding: "0 18px",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 14,
                      background: isHighlight
                        ? "linear-gradient(135deg, #75ffbf 0%, #00d084 100%)"
                        : "rgba(255,255,255,0.06)",
                      border: isHighlight
                        ? "none"
                        : "1px solid rgba(255,255,255,0.12)",
                      color: isHighlight ? "#04110d" : "#ecfff5",
                      fontWeight: 900,
                      textDecoration: "none",
                      width: "100%",
                      boxSizing: "border-box",
                    }}
                  >
                    {plan.cta}
                  </Link>
                )}
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}