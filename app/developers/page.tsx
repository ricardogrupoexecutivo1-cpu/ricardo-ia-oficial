import ShareButtons from "@/components/share-buttons";
import Link from "next/link";

const WHATSAPP_NUMBER = "5531999999999";

type DeveloperPlan = {
  name: string;
  priceMonthly: string;
  description: string;
  features: string[];
  highlight?: boolean;
};

function buildWhatsAppLink(planName: string, price: string) {
  const text = `Olá! Quero saber mais sobre o plano ${planName} da Aurora IA (${price}).`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

const plans: DeveloperPlan[] = [
  {
    name: "Developer Starter",
    priceMonthly: "R$49/mês",
    description:
      "Para quem está começando e quer criar landing pages, automações, MVPs e páginas comerciais com apoio da Aurora IA.",
    features: [
      "Base para páginas e protótipos",
      "Uso comercial permitido",
      "Ideal para iniciar portfólio",
      "Mais velocidade para tirar ideias do papel",
    ],
  },
  {
    name: "Developer Pro",
    priceMonthly: "R$149/mês",
    description:
      "Para profissionais e agências técnicas que precisam criar, vender e escalar projetos com mais rapidez.",
    features: [
      "Estrutura para apps e sistemas",
      "Fluxo acelerado para clientes",
      "Melhor para freelancers e agências",
      "Plano ideal para produção recorrente",
    ],
    highlight: true,
  },
  {
    name: "Developer Scale",
    priceMonthly: "Sob consulta",
    description:
      "Para operações com maior volume, equipes e projetos que exigem acompanhamento comercial e arquitetura mais forte.",
    features: [
      "Atendimento mais próximo",
      "Projetos sob demanda",
      "Escala para times e empresas",
      "Caminho premium da Aurora IA",
    ],
  },
];

function sectionStyle() {
  return {
    borderRadius: 28,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.03)",
    boxShadow: "0 18px 50px rgba(0,0,0,0.18)",
  } as const;
}

function buttonStyle(primary?: boolean) {
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
    padding: "14px 18px",
    borderRadius: 16,
    textDecoration: "none",
    fontWeight: 800,
    border: primary
      ? "1px solid rgba(16,185,129,0.30)"
      : "1px solid rgba(255,255,255,0.12)",
    background: primary ? "#10b981" : "rgba(255,255,255,0.05)",
    color: primary ? "#052e16" : "#f8fafc",
    boxShadow: primary ? "0 10px 30px rgba(16,185,129,0.24)" : "none",
  } as const;
}

export default function DevelopersPage() {
  const generalWhatsAppLink = buildWhatsAppLink("Developer", "Sob consulta");

  return (
    <main style={{ width: "100%", maxWidth: 1240, margin: "0 auto" }}>
      <section
        style={{
          ...sectionStyle(),
          padding: 22,
          marginBottom: 18,
          background:
            "linear-gradient(135deg, rgba(16,185,129,0.12), rgba(15,23,42,0.96))",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 18,
            alignItems: "center",
          }}
        >
          <div style={{ minWidth: 0 }}>
            <p style={{ margin: 0, opacity: 0.78, marginBottom: 10 }}>
              Aurora Developers
            </p>

            <h1
              style={{
                margin: 0,
                marginBottom: 14,
                fontSize: "clamp(1.9rem, 6vw, 3.3rem)",
                lineHeight: 1.06,
                fontWeight: 900,
              }}
            >
              Crie páginas, apps, sistemas e projetos com apoio da Aurora IA
            </h1>

            <p
              style={{
                margin: 0,
                maxWidth: 780,
                lineHeight: 1.7,
                opacity: 0.92,
                fontSize: 15,
              }}
            >
              A área Developers foi pensada para criadores, freelancers, agências,
              empreendedores e equipes que querem sair do rascunho para a execução
              com mais velocidade, visual forte e foco comercial.
            </p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
                marginTop: 18,
              }}
            >
              <a href={generalWhatsAppLink} style={buttonStyle(true)}>
                Falar no WhatsApp
              </a>

              <Link href="/chat" style={buttonStyle(false)}>
                Abrir Aurora
              </Link>

              <Link href="/planos" style={buttonStyle(false)}>
                Ver planos gerais
              </Link>
            </div>
          </div>

          <div
            style={{
              ...sectionStyle(),
              padding: 18,
              background: "rgba(2,6,23,0.55)",
            }}
          >
            <p style={{ margin: 0, opacity: 0.72, marginBottom: 10 }}>
              Para quem é
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                gap: 10,
              }}
            >
              {[
                "Freelancers",
                "Agências",
                "Criadores de SaaS",
                "Empreendedores",
                "Times de produto",
                "Negócios locais",
              ].map((item) => (
                <div
                  key={item}
                  style={{
                    borderRadius: 18,
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "rgba(255,255,255,0.03)",
                    padding: 14,
                    fontWeight: 700,
                    fontSize: 14,
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
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 12,
          marginBottom: 18,
        }}
      >
        {[
          ["Foco", "Criação e monetização"],
          ["Entrega", "Páginas, apps e sistemas"],
          ["Perfil", "Do iniciante ao profissional"],
          ["Objetivo", "Acelerar produção real"],
        ].map(([title, value]) => (
          <div
            key={title}
            style={{
              ...sectionStyle(),
              padding: 16,
            }}
          >
            <p style={{ margin: 0, opacity: 0.68, marginBottom: 8 }}>{title}</p>
            <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 900 }}>{value}</h3>
          </div>
        ))}
      </section>

      <section style={{ marginBottom: 14 }}>
        <p style={{ margin: 0, opacity: 0.72, marginBottom: 8 }}>Planos developers</p>
        <h2 style={{ margin: 0, fontSize: "1.7rem", fontWeight: 900, marginBottom: 10 }}>
          Escolha o nível certo para construir mais rápido
        </h2>
        <p style={{ margin: 0, lineHeight: 1.7, opacity: 0.88, maxWidth: 920 }}>
          A Aurora pode apoiar desde testes simples até operações mais fortes com foco
          em venda, entrega técnica e expansão comercial.
        </p>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 16,
          marginBottom: 22,
        }}
      >
        {plans.map((plan) => {
          const whatsappLink = buildWhatsAppLink(plan.name, plan.priceMonthly);

          return (
            <article
              key={plan.name}
              style={{
                ...sectionStyle(),
                padding: 18,
                minWidth: 0,
                border: plan.highlight
                  ? "1px solid rgba(16,185,129,0.34)"
                  : "1px solid rgba(255,255,255,0.08)",
                background: plan.highlight
                  ? "linear-gradient(180deg, rgba(16,185,129,0.08), rgba(255,255,255,0.03))"
                  : "rgba(255,255,255,0.03)",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  padding: "8px 12px",
                  borderRadius: 999,
                  background: "rgba(16,185,129,0.10)",
                  border: "1px solid rgba(16,185,129,0.20)",
                  color: "#d1fae5",
                  fontSize: 12,
                  fontWeight: 800,
                  marginBottom: 14,
                }}
              >
                {plan.highlight ? "Mais forte" : "Developer"}
              </div>

              <h3
                style={{
                  margin: 0,
                  marginBottom: 8,
                  fontSize: "1.35rem",
                  fontWeight: 900,
                }}
              >
                {plan.name}
              </h3>

              <p
                style={{
                  margin: 0,
                  marginBottom: 14,
                  fontSize: "1.1rem",
                  fontWeight: 900,
                  color: plan.highlight ? "#6ee7b7" : "#f8fafc",
                }}
              >
                {plan.priceMonthly}
              </p>

              <p
                style={{
                  margin: 0,
                  marginBottom: 16,
                  lineHeight: 1.65,
                  opacity: 0.9,
                  fontSize: 14,
                }}
              >
                {plan.description}
              </p>

              <div
                style={{
                  borderTop: "1px solid rgba(255,255,255,0.08)",
                  paddingTop: 12,
                  marginBottom: 18,
                }}
              >
                {plan.features.map((feature) => (
                  <div
                    key={feature}
                    style={{
                      display: "flex",
                      gap: 10,
                      alignItems: "flex-start",
                      marginBottom: 10,
                    }}
                  >
                    <span style={{ color: "#34d399", fontWeight: 900 }}>✓</span>
                    <span style={{ lineHeight: 1.5, fontSize: 14 }}>{feature}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: "grid", gap: 10 }}>
                <a href={whatsappLink} style={buttonStyle(true)}>
                  Falar no WhatsApp
                </a>

                <Link href="/chat" style={buttonStyle(false)}>
                  Testar Aurora
                </Link>
              </div>
            </article>
          );
        })}
      </section>

      <section
        style={{
          ...sectionStyle(),
          padding: 20,
          marginBottom: 18,
        }}
      >
        <p style={{ margin: 0, opacity: 0.72, marginBottom: 8 }}>O que você pode criar</p>
        <h2 style={{ margin: 0, marginBottom: 12, fontSize: "1.45rem", fontWeight: 900 }}>
          Projetos reais com cara de produto
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 12,
          }}
        >
          {[
            "Landing pages",
            "Páginas comerciais",
            "Painéis internos",
            "Sistemas simples",
            "MVPs",
            "Apps sob demanda",
            "Automação comercial",
            "Fluxos de atendimento",
          ].map((item) => (
            <div
              key={item}
              style={{
                borderRadius: 18,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.02)",
                padding: 14,
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </section>

      <section
        style={{
          ...sectionStyle(),
          padding: 20,
          background:
            "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(255,255,255,0.03))",
        }}
      >
        <p style={{ margin: 0, opacity: 0.72, marginBottom: 8 }}>Próximo passo</p>
        <h2 style={{ margin: 0, marginBottom: 12, fontSize: "1.45rem", fontWeight: 900 }}>
          Deixe a Aurora vender mais forte para developers
        </h2>
        <p style={{ margin: 0, lineHeight: 1.7, opacity: 0.9, marginBottom: 16 }}>
          Depois de acertar o visual mobile, o próximo passo é ligar esta página com
          atendimento real, checkout, WhatsApp correto e prova comercial.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          <a href={generalWhatsAppLink} style={buttonStyle(true)}>
            Chamar no WhatsApp
          </a>

          <Link href="/planos" style={buttonStyle(false)}>
            Ver planos gerais
          </Link>

          <Link href="/explorar" style={buttonStyle(false)}>
            Ver vitrine pública
          </Link>
        </div>
      </section><section
  style={{
    borderRadius: 22,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.03)",
    boxShadow: "0 12px 40px rgba(0,0,0,0.16)",
    padding: 18,
    marginTop: 18,
  }}
>
  <p style={{ margin: 0, opacity: 0.72, marginBottom: 8 }}>Compartilhe</p>
  <h2 style={{ margin: 0, marginBottom: 10, fontSize: "1.35rem", fontWeight: 900 }}>
    Mostre a Aurora Developers para outras pessoas
  </h2>
  <p style={{ margin: 0, lineHeight: 1.65, opacity: 0.9, marginBottom: 16 }}>
    Compartilhe a área Developers da Aurora IA com criadores, freelancers, agências e
    empreendedores.
  </p>

  <ShareButtons
    title="Aurora Developers"
    text="Veja a área Developers da Aurora IA"
    url="/developers"
  />
</section>
    </main>
  );
}