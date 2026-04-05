import Link from "next/link";

export const metadata = {
  title: "Bancos | Aurora IA",
  description:
    "Área de bancos e parceiros financeiros da Aurora IA. Entrada institucional para financiamento, seguros, crédito, análise e integração comercial.",
};

export default function BancosPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(59,130,246,0.10), transparent 18%), radial-gradient(circle at left, rgba(34,197,94,0.10), transparent 24%), linear-gradient(180deg, #eef6ff 0%, #f7fbff 36%, #edf7f3 100%)",
        color: "#0f172a",
        padding: "24px 16px 80px",
      }}
    >
      <section
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          display: "grid",
          gap: 18,
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            alignItems: "center",
            justifyContent: "space-between",
            border: "1px solid rgba(15,23,42,0.08)",
            background: "rgba(255,255,255,0.78)",
            backdropFilter: "blur(14px)",
            borderRadius: 24,
            padding: "14px 16px",
            boxShadow: "0 18px 42px rgba(15,23,42,0.07)",
          }}
        >
          <div style={{ display: "grid", gap: 4 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 900,
                letterSpacing: "0.08em",
                color: "#2563eb",
                textTransform: "uppercase",
              }}
            >
              Aurora IA
            </div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 900,
                lineHeight: 1.2,
                color: "#0f172a",
              }}
            >
              Bancos • parceiros financeiros • operações integradas
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            <Link href="/" style={secondaryButtonStyle}>
              Voltar à Home
            </Link>
            <Link href="/locadora" style={secondaryButtonStyle}>
              Ir para Locadoras
            </Link>
            <Link href="/cadastro-geral" style={primaryButtonStyle}>
              Fazer cadastro geral
            </Link>
          </div>
        </div>

        <section
          style={{
            border: "1px solid rgba(15,23,42,0.08)",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,255,255,0.78))",
            borderRadius: 30,
            padding: "28px 20px",
            boxShadow: "0 22px 70px rgba(15,23,42,0.09)",
            display: "grid",
            gap: 18,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              width: "fit-content",
              alignItems: "center",
              gap: 8,
              padding: "8px 12px",
              borderRadius: 999,
              background: "rgba(37,99,235,0.08)",
              border: "1px solid rgba(37,99,235,0.16)",
              color: "#2563eb",
              fontSize: 12,
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Área bancária Aurora
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "clamp(32px, 5vw, 58px)",
              lineHeight: 0.98,
              letterSpacing: "-0.04em",
              color: "#0f172a",
            }}
          >
            Bancos e parceiros financeiros dentro do ecossistema Aurora
          </h1>

          <p
            style={{
              margin: 0,
              maxWidth: 980,
              color: "rgba(15,23,42,0.72)",
              fontSize: 18,
              lineHeight: 1.7,
              fontWeight: 600,
            }}
          >
            Esta área foi preparada para receber bancos, financeiras,
            seguradoras e parceiros que desejam operar com mais clareza,
            velocidade e integração comercial dentro da Aurora IA.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 12,
            }}
          >
            <div style={cardStyle}>
              <div style={cardLabelStyle}>Financiamento</div>
              <div style={cardTitleStyle}>Análise mais próxima da operação</div>
              <div style={cardTextStyle}>
                Bancos e parceiros podem receber propostas e analisar negócios
                com mais contexto dentro da plataforma.
              </div>
            </div>

            <div style={cardStyle}>
              <div style={cardLabelStyle}>Seguros</div>
              <div style={cardTitleStyle}>Resposta integrada</div>
              <div style={cardTextStyle}>
                Estrutura para cotação, apoio comercial e resposta ao cliente
                sem quebrar a jornada dentro da Aurora.
              </div>
            </div>

            <div style={cardStyle}>
              <div style={cardLabelStyle}>Comercial</div>
              <div style={cardTitleStyle}>Presença institucional forte</div>
              <div style={cardTextStyle}>
                Área pensada para escalar relacionamento com empresas,
                locadoras, compradores, fornecedores e operação financeira.
              </div>
            </div>
          </div>

          <div
            style={{
              borderRadius: 20,
              padding: "16px 18px",
              background:
                "linear-gradient(135deg, rgba(37,99,235,0.08), rgba(16,185,129,0.08))",
              border: "1px solid rgba(37,99,235,0.14)",
              color: "#0f172a",
              fontSize: 14,
              lineHeight: 1.75,
              fontWeight: 700,
            }}
          >
            Sistema em constante atualização. Pode haver momentos de
            instabilidade durante melhorias. A Aurora está evoluindo esta área
            para permitir entrada comercial, integração com parceiros
            financeiros, análise de propostas e novas frentes de monetização.
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
            }}
          >
            <Link href="/cadastro-geral" style={primaryButtonStyle}>
              Entrar na Aurora
            </Link>

            <Link href="/locadora" style={secondaryButtonStyle}>
              Ver operação de locadoras
            </Link>

            <Link href="/chat" style={secondaryButtonStyle}>
              Abrir Chat Aurora
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}

const primaryButtonStyle: React.CSSProperties = {
  textDecoration: "none",
  color: "#ffffff",
  background: "linear-gradient(135deg, #2563eb, #3b82f6)",
  border: "1px solid rgba(37,99,235,0.16)",
  borderRadius: 14,
  padding: "12px 16px",
  fontWeight: 900,
  display: "inline-flex",
  justifyContent: "center",
  alignItems: "center",
  boxShadow: "0 14px 30px rgba(37,99,235,0.16)",
  fontSize: 14,
};

const secondaryButtonStyle: React.CSSProperties = {
  textDecoration: "none",
  color: "#0f172a",
  background: "rgba(255,255,255,0.82)",
  border: "1px solid rgba(15,23,42,0.08)",
  borderRadius: 14,
  padding: "12px 16px",
  fontWeight: 800,
  display: "inline-flex",
  justifyContent: "center",
  alignItems: "center",
  boxShadow: "0 10px 22px rgba(15,23,42,0.05)",
  fontSize: 14,
};

const cardStyle: React.CSSProperties = {
  borderRadius: 22,
  padding: "18px",
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.86), rgba(255,255,255,0.72))",
  border: "1px solid rgba(15,23,42,0.08)",
  boxShadow: "0 12px 28px rgba(15,23,42,0.05)",
  display: "grid",
  gap: 8,
};

const cardLabelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 900,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#2563eb",
};

const cardTitleStyle: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 900,
  lineHeight: 1.1,
  color: "#0f172a",
};

const cardTextStyle: React.CSSProperties = {
  fontSize: 14,
  lineHeight: 1.7,
  fontWeight: 700,
  color: "rgba(15,23,42,0.72)",
};