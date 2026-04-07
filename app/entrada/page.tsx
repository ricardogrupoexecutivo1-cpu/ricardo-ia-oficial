export const dynamic = "force-dynamic";

export default function EntradaPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(circle at top, rgba(59,130,246,0.10), transparent 18%), radial-gradient(circle at left, rgba(34,197,94,0.10), transparent 24%), linear-gradient(180deg, #eef6ff 0%, #f7fbff 36%, #edf7f3 100%)",
        padding: 24,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 860,
          background: "rgba(255,255,255,0.92)",
          border: "1px solid rgba(15,23,42,0.08)",
          borderRadius: 28,
          padding: 28,
          boxShadow: "0 18px 42px rgba(15,23,42,0.08)",
          textAlign: "center",
          display: "grid",
          gap: 16,
        }}
      >
        <div
          style={{
            fontSize: 12,
            fontWeight: 900,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#2563eb",
          }}
        >
          Aurora Entrada
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: "clamp(28px, 4.6vw, 44px)",
            lineHeight: 1.04,
            color: "#0f172a",
          }}
        >
          Entre na Aurora e siga para a home oficial
        </h1>

        <p
          style={{
            margin: 0,
            color: "rgba(15,23,42,0.74)",
            lineHeight: 1.8,
            fontSize: 17,
            maxWidth: 700,
            marginInline: "auto",
          }}
        >
          Esta é a nova porta de entrada da Aurora. Aqui o usuário pode ouvir a
          explicação, entrar com Google e continuar para a home real da
          plataforma sem alterar a estrutura principal já publicada.
        </p>

        <div
          style={{
            borderRadius: 18,
            padding: "16px 18px",
            background:
              "linear-gradient(135deg, rgba(37,99,235,0.08), rgba(16,185,129,0.08))",
            border: "1px solid rgba(37,99,235,0.14)",
            color: "#0f172a",
            fontSize: 14,
            lineHeight: 1.8,
            fontWeight: 700,
            maxWidth: 740,
            marginInline: "auto",
          }}
        >
          Entrada leve, login rápido e continuidade de acesso. O cadastro pode
          ser concluído depois, sem bloquear a navegação. O sistema está em
          constante evolução e algumas funcionalidades podem estar em melhoria.
        </div>

        <div
          style={{
            borderRadius: 20,
            border: "1px solid rgba(15,23,42,0.08)",
            background: "#f8fbff",
            padding: 18,
            display: "grid",
            gap: 10,
            maxWidth: 720,
            marginInline: "auto",
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 900,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#2563eb",
            }}
          >
            Áudio explicativo
          </div>

          <p
            style={{
              margin: 0,
              color: "rgba(15,23,42,0.70)",
              lineHeight: 1.7,
              fontSize: 15,
            }}
          >
            Ouça a explicação da Aurora antes do login.
          </p>

          <audio controls style={{ width: "100%" }}>
            <source src="/audio/entrada-aurora.ogg" type="audio/ogg" />
            Seu navegador não suporta áudio.
          </audio>
        </div>

        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
            marginTop: 6,
          }}
        >
          <a
            href="/entrar"
            style={{
              padding: "14px 20px",
              borderRadius: 14,
              background: "linear-gradient(135deg, #2563eb, #3b82f6)",
              color: "#fff",
              textDecoration: "none",
              fontWeight: 900,
              boxShadow: "0 14px 30px rgba(37,99,235,0.16)",
            }}
          >
            Entrar agora
          </a>

          <a
            href="/"
            style={{
              padding: "14px 20px",
              borderRadius: 14,
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              color: "#0f172a",
              textDecoration: "none",
              fontWeight: 800,
            }}
          >
            Ver home oficial
          </a>
        </div>
      </div>
    </main>
  );
}