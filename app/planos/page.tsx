import Link from "next/link";

type Plan = {
  name: string;
  slug: string;
  price: string;
  badge?: string;
  description: string;
  features: string[];
  buttonText: string;
  highlight?: boolean;
  href: string;
  external?: boolean;
};

const influencerCheckoutUrl =
  "https://www.asaas.com/paymentCampaign/show/3605974";

const proCheckoutUrl =
  "https://www.asaas.com/paymentCampaign/show/3605974";

const plans: Plan[] = [
  {
    name: "FREE",
    slug: "free",
    price: "R$ 0",
    badge: "Entrada",
    description: "Para conhecer a Aurora IA e começar a testar.",
    features: [
      "Chat básico",
      "Até 3 imagens por dia",
      "Acesso inicial à plataforma",
      "Ideal para primeiros testes",
    ],
    buttonText: "Começar grátis",
    href: "/chat?plan=free",
  },
  {
    name: "INFLUENCER",
    slug: "influencer",
    price: "R$ 9,90/mês",
    badge: "Novo",
    description:
      "Perfeito para criadores, divulgação rápida e presença digital frequente.",
    features: [
      "Até 20 imagens por dia",
      "Chat liberado para uso frequente",
      "Ótimo para posts e redes sociais",
      "Mais velocidade para criar campanhas",
    ],
    buttonText: "Assinar Influencer",
    href: influencerCheckoutUrl,
    external: true,
  },
  {
    name: "PRO",
    slug: "pro",
    price: "R$ 29,90/mês",
    badge: "Mais usado",
    description:
      "Plano completo para quem quer usar a Aurora IA com força total.",
    features: [
      "Imagens ilimitadas",
      "Chat liberado",
      "Uso intensivo da plataforma",
      "Ideal para negócios, marketing e produção diária",
    ],
    buttonText: "Assinar PRO",
    href: proCheckoutUrl,
    external: true,
    highlight: true,
  },
];

export default function PlanosPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #12213e 0%, #070c1b 45%, #02040a 100%)",
        color: "#fff",
        fontFamily: "Arial, sans-serif",
        padding: 24,
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ marginBottom: 24 }}>
          <Link href="/" style={{ color: "#9ecbff", textDecoration: "none" }}>
            Voltar
          </Link>
        </div>

        <header style={{ textAlign: "center", marginBottom: 40 }}>
          <p
            style={{
              margin: 0,
              color: "#78d7ff",
              fontWeight: 700,
              letterSpacing: 0.5,
            }}
          >
            AURORA IA
          </p>

          <h1
            style={{
              fontSize: 40,
              marginTop: 10,
              marginBottom: 12,
            }}
          >
            Escolha o plano ideal
          </h1>

          <p
            style={{
              maxWidth: 760,
              margin: "0 auto",
              color: "#b7c4ee",
              lineHeight: 1.6,
              fontSize: 17,
            }}
          >
            Mais imagens, mais alcance e mais velocidade para criar campanhas,
            divulgar sua marca e crescer com a Aurora IA.
          </p>
        </header>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 20,
          }}
        >
          {plans.map((plan) => (
            <article
              key={plan.name}
              style={{
                background: plan.highlight
                  ? "linear-gradient(180deg, #1a2850 0%, #101a34 100%)"
                  : "#11182d",
                borderRadius: 20,
                padding: 24,
                border: plan.highlight
                  ? "1px solid rgba(120, 215, 255, 0.45)"
                  : "1px solid rgba(255,255,255,0.08)",
                boxShadow: plan.highlight
                  ? "0 0 30px rgba(52, 143, 255, 0.18)"
                  : "none",
              }}
            >
              <div style={{ minHeight: 34 }}>
                {plan.badge ? (
                  <span
                    style={{
                      display: "inline-block",
                      padding: "6px 10px",
                      borderRadius: 999,
                      background: plan.highlight ? "#2b7fff" : "#16203d",
                      color: "#fff",
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    {plan.badge}
                  </span>
                ) : null}
              </div>

              <h2
                style={{
                  fontSize: 28,
                  marginTop: 14,
                  marginBottom: 8,
                }}
              >
                {plan.name}
              </h2>

              <p
                style={{
                  fontSize: 30,
                  fontWeight: 800,
                  marginTop: 0,
                  marginBottom: 16,
                  color: plan.highlight ? "#8fdcff" : "#ffffff",
                }}
              >
                {plan.price}
              </p>

              <p
                style={{
                  color: "#c7d3f5",
                  lineHeight: 1.6,
                  minHeight: 72,
                }}
              >
                {plan.description}
              </p>

              <div style={{ marginTop: 20, marginBottom: 24 }}>
                {plan.features.map((feature) => (
                  <div
                    key={feature}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                      marginBottom: 12,
                      color: "#e8eeff",
                      lineHeight: 1.5,
                    }}
                  >
                    <span style={{ color: "#78d7ff", fontWeight: 700 }}>✓</span>
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
                    display: "inline-block",
                    width: "100%",
                    textAlign: "center",
                    padding: "14px 18px",
                    borderRadius: 12,
                    textDecoration: "none",
                    background: plan.highlight ? "#2b7fff" : "#16203d",
                    color: "#fff",
                    fontWeight: 700,
                    border: plan.highlight
                      ? "none"
                      : "1px solid rgba(255,255,255,0.08)",
                    boxSizing: "border-box",
                  }}
                >
                  {plan.buttonText}
                </a>
              ) : (
                <Link
                  href={plan.href}
                  style={{
                    display: "inline-block",
                    width: "100%",
                    textAlign: "center",
                    padding: "14px 18px",
                    borderRadius: 12,
                    textDecoration: "none",
                    background: plan.highlight ? "#2b7fff" : "#16203d",
                    color: "#fff",
                    fontWeight: 700,
                    border: plan.highlight
                      ? "none"
                      : "1px solid rgba(255,255,255,0.08)",
                    boxSizing: "border-box",
                  }}
                >
                  {plan.buttonText}
                </Link>
              )}
            </article>
          ))}
        </section>

        <section
          style={{
            marginTop: 34,
            background: "#10182f",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 18,
            padding: 22,
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: 10 }}>
            Comparativo rápido
          </h3>

          <div style={{ color: "#c7d3f5", lineHeight: 1.8 }}>
            <div>FREE → até 3 imagens por dia</div>
            <div>INFLUENCER → até 20 imagens por dia</div>
            <div>PRO → imagens ilimitadas</div>
          </div>
        </section>
      </div>
    </main>
  );
}