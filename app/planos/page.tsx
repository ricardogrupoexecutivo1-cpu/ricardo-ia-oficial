import ShareButtons from "@/components/share-buttons";
import Link from "next/link";

type PlanCard = {
  badge: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  highlight?: boolean;
};

const plans: PlanCard[] = [
  {
    badge: "Plano Aurora",
    name: "FREE",
    price: "Grátis",
    description:
      "Para começar a conhecer a Aurora IA e testar o chat, a geração de imagens e os primeiros recursos da plataforma.",
    features: [
      "3 imagens por dia",
      "Acesso inicial à Aurora IA",
      "Uso básico para testes",
      "Entrada rápida na plataforma",
    ],
    cta: "Começar grátis",
    href: "/chat",
  },
  {
    badge: "Plano Aurora",
    name: "PRO",
    price: "R$29/mês",
    description:
      "Para quem quer usar a Aurora com mais frequência no dia a dia, com mais liberdade de criação e produtividade.",
    features: [
      "100 imagens por dia",
      "Mais liberdade de uso",
      "Ideal para criadores frequentes",
      "Ótimo passo após o FREE",
    ],
    cta: "Quero PRO",
    href: "/chat",
    highlight: true,
  },
  {
    badge: "Plano Aurora",
    name: "CREATOR",
    price: "R$79/mês",
    description:
      "Pensado para empreendedores, criadores digitais e pequenos negócios que querem produzir mais conteúdo e validar ideias.",
    features: [
      "300 imagens por dia",
      "Mais força para marketing",
      "Conteúdo e validação de ideias",
      "Base ideal para expansão comercial",
    ],
    cta: "Quero CREATOR",
    href: "/chat",
  },
  {
    badge: "Developer",
    name: "Developer Starter",
    price: "R$49/mês",
    description:
      "Ideal para quem está começando e quer criar os primeiros produtos, landing pages, páginas comerciais e testes reais.",
    features: [
      "200 imagens por dia",
      "Projetos com foco em aprendizado",
      "Base para apps e páginas simples",
      "Uso comercial permitido",
    ],
    cta: "Quero começar",
    href: "/developers",
  },
  {
    badge: "Developer",
    name: "Developer Pro",
    price: "R$149/mês",
    description:
      "Feito para profissionais, agências técnicas e criadores de software que querem vender, escalar e entregar mais rápido.",
    features: [
      "1000 imagens por dia",
      "Criação acelerada de apps e sistemas",
      "Base para SaaS e projetos de cliente",
      "Plano ideal para operação comercial",
    ],
    cta: "Quero escalar",
    href: "/developers",
    highlight: true,
  },
  {
    badge: "Escala",
    name: "AGENCY",
    price: "R$299/mês",
    description:
      "Para equipes, empresas e operações comerciais que precisam de produção forte, volume e futuro uso avançado da Aurora.",
    features: [
      "Imagens ilimitadas",
      "Melhor para times e agências",
      "Escala de produção",
      "Base premium para uso intenso",
    ],
    cta: "Quero AGENCY",
    href: "/developers",
  },
];

function sectionCardStyle() {
  return {
    borderRadius: 22,
    border: "1px solid rgba(34,197,94,0.14)",
    background: "rgba(255,255,255,0.03)",
    boxShadow: "0 12px 40px rgba(0,0,0,0.16)",
  } as const;
}

function smallPillStyle() {
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "8px 12px",
    borderRadius: 999,
    border: "1px solid rgba(34,197,94,0.22)",
    background: "rgba(34,197,94,0.08)",
    color: "#d1fae5",
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 0.3,
  } as const;
}

function planCardStyle(highlight?: boolean) {
  return {
    borderRadius: 24,
    border: highlight
      ? "1px solid rgba(34,197,94,0.38)"
      : "1px solid rgba(34,197,94,0.18)",
    background: highlight
      ? "linear-gradient(180deg, rgba(16,185,129,0.08), rgba(255,255,255,0.03))"
      : "rgba(255,255,255,0.03)",
    boxShadow: highlight
      ? "0 0 0 1px rgba(34,197,94,0.12), 0 18px 50px rgba(0,0,0,0.24)"
      : "0 12px 36px rgba(0,0,0,0.14)",
    padding: 18,
    display: "flex",
    flexDirection: "column" as const,
    minHeight: 100,
    minWidth: 0,
    overflow: "hidden" as const,
  };
}

function ctaStyle(highlight?: boolean) {
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    minHeight: 48,
    padding: "14px 18px",
    borderRadius: 14,
    textDecoration: "none",
    fontWeight: 800,
    background: highlight ? "#10b981" : "rgba(255,255,255,0.05)",
    color: highlight ? "#052e16" : "#f8fafc",
    border: highlight
      ? "1px solid rgba(16,185,129,0.28)"
      : "1px solid rgba(255,255,255,0.12)",
    boxShadow: highlight ? "0 10px 30px rgba(16,185,129,0.22)" : "none",
  } as const;
}

export default function PlanosPage() {
  return (
    <main style={{ width: "100%", maxWidth: 1240, margin: "0 auto" }}>
      <section
        style={{
          ...sectionCardStyle(),
          padding: 18,
          marginBottom: 18,
          background:
            "linear-gradient(135deg, rgba(34,197,94,0.10), rgba(15,23,42,0.96))",
          textAlign: "center",
        }}
      >
        <p style={{ margin: 0, marginBottom: 10, opacity: 0.78 }}>
          Aurora IA Planos
        </p>

        <h1
          style={{
            margin: 0,
            marginBottom: 14,
            fontSize: "clamp(1.7rem, 6vw, 3rem)",
            fontWeight: 900,
            lineHeight: 1.08,
          }}
        >
          Escolha o plano ideal para crescer com a Aurora IA
        </h1>

        <p
          style={{
            margin: "0 auto 18px",
            maxWidth: 900,
            lineHeight: 1.65,
            opacity: 0.9,
            fontSize: 15,
          }}
        >
          A Aurora IA está evoluindo para virar uma plataforma completa de criação
          de imagens, marketing, negócios e aplicativos. Aqui você escolhe o plano
          certo para sua fase e prepara sua subida de nível.
        </p>

        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Link
            href="/chat"
            style={{
              padding: "14px 18px",
              borderRadius: 14,
              background: "#10b981",
              color: "#052e16",
              fontWeight: 800,
              textDecoration: "none",
              boxShadow: "0 10px 30px rgba(16,185,129,0.24)",
            }}
          >
            Abrir Aurora
          </Link>

          <Link
            href="/developers"
            style={{
              padding: "14px 18px",
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.14)",
              color: "inherit",
              textDecoration: "none",
              fontWeight: 700,
              background: "rgba(255,255,255,0.04)",
            }}
          >
            Ver Developers
          </Link>
        </div>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: 12,
          marginBottom: 20,
        }}
      >
        {[
          ["Uso", "Pessoal e profissional"],
          ["Caminho", "Do iniciante ao avançado"],
          ["Foco", "Criação e monetização"],
          ["Evolução", "Escada de crescimento"],
        ].map(([label, value]) => (
          <div
            key={label}
            style={{
              ...sectionCardStyle(),
              padding: 14,
              border: "1px solid rgba(34,197,94,0.16)",
              minWidth: 0,
            }}
          >
            <p style={{ margin: 0, opacity: 0.72, marginBottom: 8 }}>{label}</p>
            <h3
              style={{
                margin: 0,
                fontSize: "0.98rem",
                fontWeight: 800,
                lineHeight: 1.35,
              }}
            >
              {value}
            </h3>
          </div>
        ))}
      </section>

      <section style={{ marginBottom: 14 }}>
        <p style={{ margin: 0, opacity: 0.72, marginBottom: 8 }}>
          Planos da plataforma
        </p>
        <h2 style={{ margin: 0, fontSize: "1.55rem", fontWeight: 900, marginBottom: 10 }}>
          Da entrada gratuita até a operação em escala
        </h2>
        <p style={{ margin: 0, lineHeight: 1.65, opacity: 0.88, maxWidth: 920 }}>
          A estrutura abaixo foi pensada para permitir entrada fácil, evolução natural
          e crescimento comercial dentro da própria Aurora IA.
        </p>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 14,
          marginTop: 18,
          marginBottom: 24,
        }}
      >
        {plans.map((plan) => (
          <article key={plan.name} style={planCardStyle(plan.highlight)}>
            <div style={{ marginBottom: 14 }}>
              <span style={smallPillStyle()}>{plan.badge}</span>
            </div>

            <h3
              style={{
                margin: 0,
                marginBottom: 8,
                fontSize: "1.3rem",
                fontWeight: 900,
                lineHeight: 1.2,
              }}
            >
              {plan.name}
            </h3>

            <p
              style={{
                margin: 0,
                marginBottom: 14,
                fontSize: "1.15rem",
                fontWeight: 900,
                color: plan.highlight ? "#6ee7b7" : "#f8fafc",
              }}
            >
              {plan.price}
            </p>

            <p
              style={{
                margin: 0,
                marginBottom: 18,
                lineHeight: 1.6,
                opacity: 0.9,
                fontSize: 14,
              }}
            >
              {plan.description}
            </p>

            <div
              style={{
                marginBottom: 20,
                paddingTop: 10,
                borderTop: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {plan.features.map((feature) => (
                <div
                  key={feature}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    marginBottom: 10,
                  }}
                >
                  <span style={{ color: "#34d399", fontWeight: 900 }}>✓</span>
                  <span style={{ lineHeight: 1.45, opacity: 0.94, fontSize: 14 }}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "auto" }}>
              <Link href={plan.href} style={ctaStyle(plan.highlight)}>
                {plan.cta}
              </Link>
            </div>
          </article>
        ))}
      </section>

      <section
        style={{
          ...sectionCardStyle(),
          padding: 18,
          marginBottom: 18,
        }}
      >
        <p style={{ margin: 0, opacity: 0.72, marginBottom: 8 }}>Visão comercial</p>
        <h2 style={{ margin: 0, marginBottom: 12, fontSize: "1.35rem", fontWeight: 900 }}>
          Cada plano prepara o próximo passo do usuário
        </h2>
        <p style={{ margin: 0, lineHeight: 1.65, opacity: 0.9 }}>
          O FREE atrai. O PRO converte. O CREATOR impulsiona negócios. Os planos
          Developer trazem programadores e criadores de software. O AGENCY abre
          espaço para operação profissional e escala.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: 12,
            marginTop: 18,
          }}
        >
          {[
            ["FREE", "Entrada e descoberta"],
            ["PRO", "Uso recorrente"],
            ["CREATOR", "Conteúdo e negócio"],
            ["DEVELOPER", "Apps e software"],
            ["AGENCY", "Escala e operação"],
          ].map(([title, desc]) => (
            <div
              key={title}
              style={{
                borderRadius: 16,
                border: "1px solid rgba(34,197,94,0.14)",
                background: "rgba(255,255,255,0.02)",
                padding: 14,
                minWidth: 0,
              }}
            >
              <h3 style={{ margin: 0, marginBottom: 8, fontSize: "0.98rem", fontWeight: 900 }}>
                {title}
              </h3>
              <p style={{ margin: 0, opacity: 0.84, lineHeight: 1.5, fontSize: 14 }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        style={{
          ...sectionCardStyle(),
          padding: 18,
          marginBottom: 8,
          background:
            "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(255,255,255,0.03))",
        }}
      >
        <p style={{ margin: 0, opacity: 0.72, marginBottom: 8 }}>Próximo passo</p>
        <h2 style={{ margin: 0, marginBottom: 10, fontSize: "1.35rem", fontWeight: 900 }}>
          Deixe a página pronta para vender
        </h2>
        <p style={{ margin: 0, lineHeight: 1.65, opacity: 0.9, marginBottom: 16 }}>
          Agora que a Aurora já tem escada de planos e página de developers, o
          próximo movimento forte é ligar isso com upgrade real, checkout ou
          atendimento comercial.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          <Link href="/developers" style={ctaStyle(false)}>
            Ver Developers
          </Link>
          <Link href="/chat" style={ctaStyle(true)}>
            Testar a Aurora
          </Link>
          <Link href="/explorar" style={ctaStyle(false)}>
            Ver vitrine pública
          </Link>
          <a href="https://wa.me/" style={ctaStyle(false)}>
            Falar no WhatsApp
          </a>
        </div>
      </section>
    </main>
  );
}<section
  style={{
    borderRadius: 22,
    border: "1px solid rgba(34,197,94,0.14)",
    background: "rgba(255,255,255,0.03)",
    boxShadow: "0 12px 40px rgba(0,0,0,0.16)",
    padding: 18,
    marginTop: 18,
  }}
>
  <p style={{ margin: 0, opacity: 0.72, marginBottom: 8 }}>Compartilhe a Aurora</p>
  <h2 style={{ margin: 0, marginBottom: 10, fontSize: "1.35rem", fontWeight: 900 }}>
    Leve a Aurora IA para mais pessoas
  </h2>
  <p style={{ margin: 0, lineHeight: 1.65, opacity: 0.9, marginBottom: 16 }}>
    Compartilhe a Aurora IA nas redes sociais e ajude mais pessoas a conhecerem o chat,
    as imagens e os planos da plataforma.
  </p>

  <ShareButtons
    title="Aurora IA"
    text="Conheça a Aurora IA e veja os planos da plataforma"
    url="/planos"
  />
</section>