import Link from "next/link";

const quickLinks = [
  {
    title: "Cadastrar Imobiliária",
    description:
      "Entrada para imobiliárias, corretores, captação comercial e presença dentro da Aurora.",
    href: "/imobiliarias/cadastrar",
    cta: "Abrir cadastro de imobiliária",
  },
  {
    title: "Buscar Imóveis",
    description:
      "Busca comercial por imóveis disponíveis, oportunidades e regiões.",
    href: "/imoveis",
    cta: "Abrir busca de imóveis",
  },
  {
    title: "Admin Imóveis",
    description:
      "Diagnóstico, validação e controle da base de imóveis cadastrados.",
    href: "/imoveis/admin",
    cta: "Abrir admin imóveis",
  },
];

const pillars = [
  "Venda",
  "Locação",
  "Captação",
  "Corretores",
  "Imobiliárias",
  "Expansão comercial",
];

export default function ImoveisPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(59,130,246,0.16), transparent 24%), #050816",
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
                  background: "rgba(59,130,246,0.12)",
                  border: "1px solid rgba(59,130,246,0.26)",
                  fontSize: 12,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  color: "#93c5fd",
                  marginBottom: 16,
                }}
              >
                Aurora Imóveis
              </div>

              <h1
                style={{
                  margin: 0,
                  fontSize: "clamp(32px, 6vw, 52px)",
                  lineHeight: 1.04,
                }}
              >
                Plataforma de imóveis para venda, locação e captação
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
                Estrutura para imóveis, corretores, proprietários e negócios
                imobiliários dentro da Aurora IA. Estamos em constante
                atualização e pode haver momentos de instabilidade.
              </p>

              <div
                style={{
                  display: "flex",
                  gap: 12,
                  flexWrap: "wrap",
                  marginTop: 22,
                }}
              >
                <Link
                  href="/imobiliarias/cadastrar"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 48,
                    padding: "0 18px",
                    borderRadius: 14,
                    background: "#3b82f6",
                    color: "#fff",
                    fontWeight: 900,
                    textDecoration: "none",
                  }}
                >
                  Cadastrar imobiliária
                </Link>

                <Link
                  href="/imoveis"
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
                  Buscar imóveis
                </Link>

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
                    color: "#93c5fd",
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

              <Link
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
              </Link>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}