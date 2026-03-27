import Link from "next/link";

const quickLinks = [
  {
    title: "Cadastrar no AGRO",
    description:
      "Entrada real para produtores, fornecedores, compradores e oportunidades do agro.",
    href: "/agro/cadastrar",
    cta: "Abrir cadastro AGRO",
  },
  {
    title: "Buscar no AGRO",
    description:
      "Busca comercial para localizar anúncios, negócios e parceiros do setor.",
    href: "/agro/buscar",
    cta: "Abrir busca AGRO",
  },
  {
    title: "Admin AGRO",
    description:
      "Área de diagnóstico e controle para acompanhar registros e validar a operação.",
    href: "/agro/admin",
    cta: "Abrir admin AGRO",
  },
];

const pillars = [
  "Produtores",
  "Fornecedores",
  "Compradores",
  "Insumos",
  "Oportunidades",
  "Expansão comercial",
];

export default function AgroPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(34,197,94,0.16), transparent 24%), #050816",
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
                  background: "rgba(34,197,94,0.12)",
                  border: "1px solid rgba(34,197,94,0.26)",
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                  color: "#86efac",
                  marginBottom: 16,
                }}
              >
                Aurora AGRO
              </div>

              <div
                style={{
                  color: "#86efac",
                  fontWeight: 800,
                  fontSize: 14,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  marginBottom: 10,
                }}
              >
                Plataforma em expansão
              </div>

              <h1
                style={{
                  margin: 0,
                  fontSize: "clamp(32px, 6vw, 52px)",
                  lineHeight: 1.02,
                  maxWidth: 920,
                }}
              >
                Aurora AGRO para negócios, conexão comercial e escala real
              </h1>

              <p
                style={{
                  marginTop: 16,
                  marginBottom: 0,
                  color: "#9fb0c7",
                  fontSize: 17,
                  lineHeight: 1.75,
                  maxWidth: 920,
                }}
              >
                Estrutura para produtores, fornecedores, compradores, insumos,
                oportunidades e relacionamento comercial do agro dentro da
                Aurora. Estamos em constante atualização e pode haver momentos
                de instabilidade.
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
                  href="/agro/cadastrar"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 48,
                    padding: "0 18px",
                    borderRadius: 14,
                    textDecoration: "none",
                    fontWeight: 900,
                    border: "1px solid rgba(34,197,94,0.45)",
                    background:
                      "linear-gradient(135deg, rgba(34,197,94,0.95), rgba(16,185,129,0.95))",
                    color: "#04121d",
                  }}
                >
                  Cadastrar no AGRO
                </Link>

                <Link
                  href="/agro/buscar"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 48,
                    padding: "0 18px",
                    borderRadius: 14,
                    textDecoration: "none",
                    fontWeight: 800,
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "rgba(255,255,255,0.04)",
                    color: "#e5eef8",
                  }}
                >
                  Buscar no AGRO
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
                    textDecoration: "none",
                    fontWeight: 800,
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "rgba(255,255,255,0.04)",
                    color: "#e5eef8",
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
                  padding: 22,
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    color: "#86efac",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: 0.4,
                    marginBottom: 10,
                  }}
                >
                  Pilares do módulo
                </div>

                <div
                  style={{
                    display: "grid",
                    gap: 10,
                  }}
                >
                  {pillars.map((item) => (
                    <div
                      key={item}
                      style={{
                        borderRadius: 14,
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
                border: "1px solid rgba(255,255,255,0.08)",
                background:
                  "linear-gradient(180deg, rgba(10,15,34,0.95), rgba(6,10,24,0.92))",
                boxShadow: "0 16px 40px rgba(0,0,0,0.26)",
                padding: 22,
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: 24,
                  lineHeight: 1.1,
                }}
              >
                {item.title}
              </h2>

              <p
                style={{
                  marginTop: 12,
                  marginBottom: 0,
                  color: "#9fb0c7",
                  fontSize: 15,
                  lineHeight: 1.7,
                  minHeight: 96,
                }}
              >
                {item.description}
              </p>

              <div style={{ marginTop: 18 }}>
                <Link
                  href={item.href}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 46,
                    padding: "0 16px",
                    borderRadius: 14,
                    textDecoration: "none",
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "rgba(255,255,255,0.04)",
                    color: "#e5eef8",
                    fontWeight: 900,
                    width: "100%",
                  }}
                >
                  {item.cta}
                </Link>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}