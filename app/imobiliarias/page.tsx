import Link from "next/link";

export default function ImobiliariasPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(99,102,241,0.18), transparent 30%), #050816",
        color: "#e5eef8",
        padding: "32px 16px 80px",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: 16,
          }}
        >
          <Link
            href="/"
            style={{
              color: "#93c5fd",
              textDecoration: "none",
              border: "1px solid rgba(147,197,253,0.25)",
              borderRadius: 999,
              padding: "10px 14px",
            }}
          >
            Voltar à Home
          </Link>

          <Link
            href="/imoveis"
            style={{
              color: "#86efac",
              textDecoration: "none",
              border: "1px solid rgba(134,239,172,0.25)",
              borderRadius: 999,
              padding: "10px 14px",
            }}
          >
            Ir para Imóveis
          </Link>

          <Link
            href="/app-builder"
            style={{
              color: "#facc15",
              textDecoration: "none",
              border: "1px solid rgba(250,204,21,0.25)",
              borderRadius: 999,
              padding: "10px 14px",
            }}
          >
            Ir para o App Builder
          </Link>
        </div>

        <section
          style={{
            border: "1px solid rgba(148,163,184,0.18)",
            background: "rgba(15,23,42,0.72)",
            backdropFilter: "blur(10px)",
            borderRadius: 24,
            padding: 24,
            boxShadow: "0 20px 80px rgba(0,0,0,0.35)",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              padding: "8px 12px",
              borderRadius: 999,
              background: "rgba(99,102,241,0.14)",
              border: "1px solid rgba(99,102,241,0.25)",
              color: "#c7d2fe",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: 0.3,
              marginBottom: 14,
            }}
          >
            Aurora Imobiliárias
          </div>

          <h1
            style={{
              fontSize: 36,
              lineHeight: 1.05,
              margin: 0,
            }}
          >
            Área de imobiliárias em atualização
          </h1>

          <p
            style={{
              color: "#94a3b8",
              marginTop: 14,
              maxWidth: 820,
              fontSize: 16,
              lineHeight: 1.7,
            }}
          >
            Esta página foi ativada para eliminar erros 404 e preparar a entrada
            de imobiliárias, corretores, parceiros e operação comercial no
            ecossistema da Aurora. Estamos em constante atualização e pode haver
            momentos de instabilidade.
          </p>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              borderRadius: 20,
              padding: 18,
              background: "rgba(15,23,42,0.72)",
              border: "1px solid rgba(148,163,184,0.16)",
            }}
          >
            <div style={{ fontSize: 12, color: "#94a3b8" }}>Status atual</div>
            <div style={{ fontWeight: 800, fontSize: 20, marginTop: 8 }}>
              Página ativa
            </div>
            <p style={{ color: "#cbd5e1", marginTop: 10, marginBottom: 0 }}>
              A rota foi ativada e já não deve mais gerar erro 404.
            </p>
          </div>

          <div
            style={{
              borderRadius: 20,
              padding: 18,
              background: "rgba(15,23,42,0.72)",
              border: "1px solid rgba(148,163,184,0.16)",
            }}
          >
            <div style={{ fontSize: 12, color: "#94a3b8" }}>Objetivo</div>
            <div style={{ fontWeight: 800, fontSize: 20, marginTop: 8 }}>
              Entrada profissional
            </div>
            <p style={{ color: "#cbd5e1", marginTop: 10, marginBottom: 0 }}>
              Receber imobiliárias, corretores e empresas com estrutura própria.
            </p>
          </div>

          <div
            style={{
              borderRadius: 20,
              padding: 18,
              background: "rgba(15,23,42,0.72)",
              border: "1px solid rgba(148,163,184,0.16)",
            }}
          >
            <div style={{ fontSize: 12, color: "#94a3b8" }}>Próximo passo</div>
            <div style={{ fontWeight: 800, fontSize: 20, marginTop: 8 }}>
              Cadastro e busca
            </div>
            <p style={{ color: "#cbd5e1", marginTop: 10, marginBottom: 0 }}>
              Criar cadastro real, busca pública e painel administrativo do setor.
            </p>
          </div>
        </section>

        <section
          style={{
            borderRadius: 24,
            padding: 24,
            background: "rgba(15,23,42,0.72)",
            border: "1px solid rgba(148,163,184,0.18)",
            boxShadow: "0 20px 80px rgba(0,0,0,0.35)",
          }}
        >
          <h2 style={{ fontSize: 24, marginTop: 0 }}>Estrutura prevista</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 14,
              marginTop: 18,
            }}
          >
            {[
              "Cadastro de imobiliárias",
              "Cadastro de corretores",
              "Captação de imóveis",
              "Leads e propostas",
              "Painel administrativo",
              "Contato comercial",
            ].map((item) => (
              <div
                key={item}
                style={{
                  borderRadius: 16,
                  padding: 16,
                  background: "rgba(2,6,23,0.45)",
                  border: "1px solid rgba(148,163,184,0.14)",
                  color: "#e2e8f0",
                  fontWeight: 700,
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}