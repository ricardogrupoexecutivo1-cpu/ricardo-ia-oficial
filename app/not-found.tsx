import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(59,130,246,0.14), transparent 28%), #050816",
        color: "#e5eef8",
        padding: "32px 16px 80px",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto", width: "100%" }}>
        <section
          style={{
            border: "1px solid rgba(148,163,184,0.18)",
            background: "rgba(15,23,42,0.72)",
            backdropFilter: "blur(10px)",
            borderRadius: 24,
            padding: 32,
            boxShadow: "0 20px 80px rgba(0,0,0,0.35)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              padding: "8px 12px",
              borderRadius: 999,
              background: "rgba(239,68,68,0.14)",
              border: "1px solid rgba(239,68,68,0.25)",
              color: "#fca5a5",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: 0.3,
              marginBottom: 16,
            }}
          >
            Página não encontrada
          </div>

          <h1
            style={{
              fontSize: 42,
              lineHeight: 1.05,
              margin: 0,
            }}
          >
            404 — esta página não foi encontrada
          </h1>

          <p
            style={{
              color: "#94a3b8",
              marginTop: 16,
              maxWidth: 760,
              marginLeft: "auto",
              marginRight: "auto",
              fontSize: 16,
              lineHeight: 1.7,
            }}
          >
            A rota acessada não existe ou está em atualização. Estamos em
            constante atualização e pode haver momentos de instabilidade.
            Enquanto isso, você pode seguir para as áreas principais da Aurora
            abaixo.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 16,
              marginTop: 28,
            }}
          >
            {[
              {
                title: "Home",
                description: "Voltar para a página principal da Aurora.",
                href: "/",
                color: "#93c5fd",
                border: "rgba(147,197,253,0.25)",
              },
              {
                title: "Chat",
                description: "Abrir a área principal de uso da Aurora IA.",
                href: "/chat",
                color: "#86efac",
                border: "rgba(134,239,172,0.25)",
              },
              {
                title: "Explorar",
                description: "Ver páginas públicas, imagens e conteúdos da plataforma.",
                href: "/explorar",
                color: "#facc15",
                border: "rgba(250,204,21,0.25)",
              },
              {
                title: "Planos",
                description: "Ir para a área comercial e de monetização.",
                href: "/planos",
                color: "#c4b5fd",
                border: "rgba(196,181,253,0.25)",
              },
              {
                title: "AGRO",
                description: "Abrir a área AGRO ativada para eliminar 404.",
                href: "/agro",
                color: "#86efac",
                border: "rgba(134,239,172,0.25)",
              },
              {
                title: "Imóveis",
                description: "Abrir a área de imóveis ativada para eliminar 404.",
                href: "/imoveis",
                color: "#93c5fd",
                border: "rgba(147,197,253,0.25)",
              },
              {
                title: "Imobiliárias",
                description: "Abrir a área de imobiliárias da plataforma.",
                href: "/imobiliarias",
                color: "#c7d2fe",
                border: "rgba(199,210,254,0.25)",
              },
              {
                title: "App Builder",
                description: "Voltar ao construtor de apps e módulos da Aurora.",
                href: "/app-builder",
                color: "#f9a8d4",
                border: "rgba(249,168,212,0.25)",
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "block",
                  textDecoration: "none",
                  borderRadius: 20,
                  padding: 18,
                  background: "rgba(2,6,23,0.45)",
                  border: `1px solid ${item.border}`,
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: 18,
                    color: item.color,
                  }}
                >
                  {item.title}
                </div>

                <p
                  style={{
                    color: "#cbd5e1",
                    marginTop: 10,
                    marginBottom: 0,
                    lineHeight: 1.6,
                  }}
                >
                  {item.description}
                </p>
              </Link>
            ))}
          </div>

          <div
            style={{
              marginTop: 28,
              borderRadius: 18,
              padding: 18,
              background: "rgba(2,6,23,0.45)",
              border: "1px solid rgba(148,163,184,0.14)",
            }}
          >
            <div
              style={{
                fontSize: 12,
                color: "#94a3b8",
                textTransform: "uppercase",
                letterSpacing: 0.4,
              }}
            >
              Próximo passo recomendado
            </div>

            <p
              style={{
                marginTop: 10,
                marginBottom: 0,
                color: "#e2e8f0",
                lineHeight: 1.7,
              }}
            >
              Continue a varredura nas rotas mais acessadas do Analytics e,
              quando alguma rota inexistente aparecer, criamos ou redirecionamos
              imediatamente para proteger SEO, retenção e experiência do usuário.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}