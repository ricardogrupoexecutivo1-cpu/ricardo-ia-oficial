import Link from "next/link";

export default function AgroPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(34,197,94,0.18), transparent 24%), linear-gradient(180deg, #07111f 0%, #08101a 35%, #05080f 100%)",
        color: "#f8fafc",
        padding: "32px 18px 80px",
      }}
    >
      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            marginBottom: 18,
          }}
        >
          <Link href="/" style={navStyle("#93c5fd")}>
            Voltar à Home
          </Link>
          <Link href="/cadastro-basico" style={navStyle("#86efac")}>
            Cadastro básico
          </Link>
          <Link href="/chat" style={navStyle("#c4b5fd")}>
            Ir para o Chat
          </Link>
        </div>

        <section
          style={{
            borderRadius: 28,
            padding: 28,
            background: "rgba(8,15,28,0.88)",
            border: "1px solid rgba(148,163,184,0.16)",
            boxShadow: "0 25px 70px rgba(0,0,0,0.25)",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 14px",
              borderRadius: 999,
              background: "rgba(34,197,94,0.12)",
              border: "1px solid rgba(34,197,94,0.26)",
              color: "#bbf7d0",
              fontWeight: 800,
              fontSize: 13,
              marginBottom: 16,
            }}
          >
            🌱 AGRO • AURORA IA
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "clamp(2rem, 5vw, 4rem)",
              lineHeight: 1.05,
              fontWeight: 900,
              letterSpacing: "-0.04em",
            }}
          >
            Aurora AGRO
          </h1>

          <p
            style={{
              marginTop: 18,
              maxWidth: 860,
              color: "#cbd5e1",
              fontSize: 17,
              lineHeight: 1.8,
            }}
          >
            Cadastro, negócios, vitrine e conexão do agro brasileiro.
            Esta área foi colocada no ar para eliminar rota quebrada,
            abrir entrada comercial e permitir crescimento com segurança.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 16,
              marginTop: 24,
            }}
          >
            <InfoCard
              title="Objetivo"
              text="Atrair produtores, fornecedores, compradores e parceiros do AGRO."
            />
            <InfoCard
              title="Entrada rápida"
              text="Comece pelo cadastro básico e complete o resto depois."
            />
            <InfoCard
              title="Expansão"
              text="Área em constante atualização, pronta para crescer por região e segmento."
            />
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 14,
              marginTop: 28,
            }}
          >
            <Link href="/cadastro-basico" style={primaryButton}>
              🚀 ENTRAR NO AGRO AGORA
            </Link>

            <Link href="/chat" style={secondaryButton}>
              💬 FALAR COM A AURORA
            </Link>
          </div>

          <div
            style={{
              marginTop: 22,
              fontSize: 14,
              color: "#86efac",
              fontWeight: 700,
            }}
          >
            🔒 Plataforma protegida com bloqueio de atividades maliciosas e ações suspeitas.
          </div>
        </section>
      </div>
    </main>
  );
}

function InfoCard({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div
      style={{
        borderRadius: 20,
        padding: 18,
        background: "rgba(15,23,42,0.72)",
        border: "1px solid rgba(148,163,184,0.14)",
      }}
    >
      <div
        style={{
          fontWeight: 800,
          fontSize: 17,
          marginBottom: 10,
        }}
      >
        {title}
      </div>
      <div
        style={{
          color: "#cbd5e1",
          lineHeight: 1.7,
          fontSize: 15,
        }}
      >
        {text}
      </div>
    </div>
  );
}

function navStyle(color: string): React.CSSProperties {
  return {
    color,
    textDecoration: "none",
    border: `1px solid ${color}33`,
    borderRadius: 999,
    padding: "10px 14px",
    fontWeight: 700,
    background: "rgba(15,23,42,0.45)",
  };
}

const primaryButton: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 54,
  padding: "0 22px",
  borderRadius: 16,
  background: "linear-gradient(135deg, #22c55e 0%, #14b8a6 100%)",
  color: "#03130d",
  textDecoration: "none",
  fontWeight: 900,
};

const secondaryButton: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 54,
  padding: "0 22px",
  borderRadius: 16,
  background: "rgba(15,23,42,0.72)",
  color: "#f8fafc",
  textDecoration: "none",
  fontWeight: 900,
  border: "1px solid rgba(148,163,184,0.18)",
};