"use client";

const setores = [
  {
    icon: "🚗",
    title: "Aurora Locadora",
    description:
      "Operação completa: motoristas, veículos, propostas e fornecedores.",
    href: "/locadora",
    ctaPt: "Entrar na Locadora",
    ctaEn: "Open Rental Area",
  },
  {
    icon: "🌾",
    title: "Aurora AGRO",
    description:
      "Produtores, insumos, máquinas e oportunidades do agro.",
    href: "/agro",
    ctaPt: "Entrar no AGRO",
    ctaEn: "Open AGRO Area",
  },
  {
    icon: "⛏️",
    title: "Aurora Mineração",
    description:
      "Exploração, fornecedores e operação técnica do setor.",
    href: "/mineracao",
    ctaPt: "Entrar na Mineração",
    ctaEn: "Open Mining Area",
  },
  {
    icon: "🏠",
    title: "Aurora Imóveis",
    description:
      "Cadastro de imóveis, compradores e oportunidades.",
    href: "/imoveis",
    ctaPt: "Entrar em Imóveis",
    ctaEn: "Open Real Estate",
  },
  {
    icon: "🏦",
    title: "Aurora Financeiro",
    description:
      "Bancos, seguros, crédito e gestão financeira da plataforma.",
    href: "/financeiro",
    ctaPt: "Entrar no Financeiro",
    ctaEn: "Open Finance Area",
  },
];

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#08111f",
        color: "#fff",
        overflowX: "hidden",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 16px",
        }}
      >
        {/* HERO */}
        <section style={{ padding: "40px 0", textAlign: "center" }}>
          <h1
            style={{
              fontSize: "clamp(26px, 6vw, 42px)",
              marginBottom: 12,
              fontWeight: 800,
            }}
          >
            Aurora IA
          </h1>

          <p
            style={{
              fontSize: "clamp(14px, 3.5vw, 18px)",
              opacity: 0.8,
              marginBottom: 24,
            }}
          >
            Crie negócios, cadastre sua empresa e use IA para crescer
            <br />
            <span style={{ fontSize: 13, opacity: 0.6 }}>
              Create business, register and grow with AI
            </span>
          </p>

          <div
            style={{
              display: "grid",
              gap: 10,
              maxWidth: 400,
              margin: "0 auto",
            }}
          >
            <a
              href="/cadastro"
              style={{
                padding: "14px",
                background: "#00ff88",
                color: "#000",
                borderRadius: 10,
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Criar cadastro grátis
              <div style={{ fontSize: 12, opacity: 0.7 }}>
                Create free account
              </div>
            </a>

            <a
              href="/chat"
              style={{
                padding: "14px",
                border: "1px solid #00ff88",
                borderRadius: 10,
                textDecoration: "none",
                color: "#00ff88",
              }}
            >
              Abrir chat da Aurora
              <div style={{ fontSize: 12, opacity: 0.7 }}>
                Open Aurora Chat
              </div>
            </a>
          </div>
        </section>

        {/* SETORES */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 14,
            paddingBottom: 40,
          }}
        >
          {setores.map((item, i) => (
            <a
              key={i}
              href={item.href}
              style={{
                background: "#12182b",
                padding: 16,
                borderRadius: 14,
                textDecoration: "none",
                color: "#fff",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ fontSize: 22, marginBottom: 8 }}>
                {item.icon}
              </div>

              <div
                style={{
                  fontWeight: 700,
                  fontSize: 16,
                  marginBottom: 6,
                }}
              >
                {item.title}
              </div>

              <div
                style={{
                  fontSize: 13,
                  opacity: 0.7,
                  marginBottom: 10,
                }}
              >
                {item.description}
              </div>

              <div
                style={{
                  marginTop: "auto",
                  fontWeight: 600,
                  fontSize: 13,
                  color: "#00ff88",
                }}
              >
                {item.ctaPt}
                <div style={{ fontSize: 11, opacity: 0.6 }}>
                  {item.ctaEn}
                </div>
              </div>
            </a>
          ))}
        </section>

        {/* CTA FINAL */}
        <section style={{ textAlign: "center", paddingBottom: 60 }}>
          <a
            href="/cadastro"
            style={{
              display: "inline-block",
              padding: "14px 20px",
              background: "#00ff88",
              color: "#000",
              borderRadius: 12,
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Criar cadastro gratuito
            <div style={{ fontSize: 12, opacity: 0.7 }}>
              Create free account
            </div>
          </a>
        </section>
      </div>
    </main>
  );
}