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
      <section style={{ maxWidth: 1220, margin: "0 auto" }}>
        
        <h1
          style={{
            fontSize: 42,
            fontWeight: 900,
            marginBottom: 10,
          }}
        >
          Escolha o plano ideal para crescer com a Aurora IA
        </h1>

        <p style={{ opacity: 0.8 }}>
          Plataforma completa de criação, campanhas e monetização com IA.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 20,
            marginTop: 30,
          }}
        >
          {plans.map((plan) => (
            <div
              key={plan.name}
              style={{
                padding: 20,
                borderRadius: 20,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <h2>{plan.name}</h2>
              <strong>{plan.price}</strong>

              <p style={{ marginTop: 10 }}>{plan.description}</p>

              <ul style={{ marginTop: 10 }}>
                {plan.features.map((f) => (
                  <li key={f}>✓ {f}</li>
                ))}
              </ul>

              <a
                href={plan.href}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "block",
                  marginTop: 15,
                  padding: 10,
                  borderRadius: 10,
                  background: "#00d084",
                  color: "#000",
                  textAlign: "center",
                  fontWeight: 800,
                  textDecoration: "none",
                }}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}