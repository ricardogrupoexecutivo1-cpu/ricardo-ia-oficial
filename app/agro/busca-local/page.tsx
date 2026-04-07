export const dynamic = "force-dynamic";

export default function AgroBuscaLocalPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8fbff",
        padding: 24,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 720,
          background: "#ffffff",
          border: "1px solid rgba(15,23,42,0.08)",
          borderRadius: 24,
          padding: 24,
          boxShadow: "0 18px 42px rgba(15,23,42,0.08)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 12,
            fontWeight: 900,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#2563eb",
            marginBottom: 10,
          }}
        >
          Aurora AGRO
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: "clamp(26px, 4vw, 38px)",
            lineHeight: 1.05,
            color: "#0f172a",
          }}
        >
          Busca local temporariamente em estabilização
        </h1>

        <p
          style={{
            margin: "14px 0 0",
            color: "rgba(15,23,42,0.72)",
            lineHeight: 1.7,
            fontSize: 16,
          }}
        >
          Esta página foi temporariamente simplificada nesta branch de teste
          para estabilizar o preview sem afetar a produção.
        </p>

        <div
          style={{
            marginTop: 22,
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <a
            href="/agro"
            style={{
              padding: "12px 18px",
              borderRadius: 12,
              background: "#2563eb",
              color: "#fff",
              textDecoration: "none",
              fontWeight: 900,
            }}
          >
            Voltar para AGRO
          </a>

          <a
            href="/"
            style={{
              padding: "12px 18px",
              borderRadius: 12,
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              color: "#0f172a",
              textDecoration: "none",
              fontWeight: 800,
            }}
          >
            Ir para Home
          </a>
        </div>
      </div>
    </main>
  );
}