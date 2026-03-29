import Link from "next/link";

export default function AgroBuscaPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(34,197,94,0.18), transparent 30%), #050816",
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
            href="/agro"
            style={{
              color: "#86efac",
              textDecoration: "none",
              border: "1px solid rgba(134,239,172,0.25)",
              borderRadius: 999,
              padding: "10px 14px",
            }}
          >
            Ir para AGRO
          </Link>

          <Link
            href="/agro/cadastrar"
            style={{
              color: "#facc15",
              textDecoration: "none",
              border: "1px solid rgba(250,204,21,0.25)",
              borderRadius: 999,
              padding: "10px 14px",
            }}
          >
            Ir para Cadastro AGRO
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
              background: "rgba(34,197,94,0.14)",
              border: "1px solid rgba(34,197,94,0.25)",
              color: "#86efac",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: 0.3,
              marginBottom: 14,
            }}
          >
            Busca AGRO
          </div>

          <h1
            style={{
              fontSize: 36,
              lineHeight: 1.05,
              margin: 0,
            }}
          >
            Busca AGRO em atualização
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
            Esta rota foi ativada para eliminar erros 404 e preparar a busca
            real do AGRO com produtores, empresas, fornecedores, compradores,
            oportunidades e operação comercial. Estamos em constante atualização
            e pode haver momentos de instabilidade.
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
              Busca ativa
            </div>
            <p style={{ color: "#cbd5e1", marginTop: 10, marginBottom: 0 }}>
              O 404 desta rota foi eliminado e a base da busca já está pronta.
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
              Busca comercial
            </div>
            <p style={{ color: "#cbd5e1", marginTop: 10, marginBottom: 0 }}>
              Reunir participantes do setor e facilitar encontro de oportunidades.
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
              Busca real no banco
            </div>
            <p style={{ color: "#cbd5e1", marginTop: 10, marginBottom: 0 }}>
              Ligar filtros, categorias e resultados ao Supabase de forma real.
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
          <h2 style={{ fontSize: 24, marginTop: 0 }}>Filtros previstos</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 14,
              marginTop: 18,
            }}
          >
            {[
              "Produtores",
              "Empresas",
              "Fornecedores",
              "Compradores",
              "Oportunidades",
              "Localização",
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