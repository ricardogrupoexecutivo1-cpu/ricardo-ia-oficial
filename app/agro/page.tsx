import Link from "next/link";

export const metadata = {
  title: "AGRO | Aurora IA",
  description:
    "Área AGRO da Aurora IA com entrada comercial, cadastro, negócios, vitrine e conexão para produtores, fornecedores, compradores e parceiros.",
};

export default function AgroPage() {
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
                color: "#16a34a",
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
              AGRO • negócios • conexão • operação rural
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
            <Link href="/chat" style={secondaryButtonStyle}>
              Ir para o Chat
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
              background: "rgba(22,163,74,0.08)",
              border: "1px solid rgba(22,163,74,0.16)",
              color: "#15803d",
              fontSize: 12,
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Área AGRO Aurora
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
            Aurora AGRO com visual premium e entrada comercial forte
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
            Cadastro, vitrine, negócios e conexão para produtores, compradores,
            fornecedores, prestadores de serviço e parceiros do agro brasileiro
            dentro da Aurora IA.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 12,
            }}
          >
            <div style={cardStyle}>
              <div style={cardLabelStyle}>Objetivo</div>
              <div style={cardTitleStyle}>Atrair operação real</div>
              <div style={cardTextStyle}>
                Estrutura preparada para conectar produtores, fornecedores,
                compradores e parceiros com mais clareza dentro da plataforma.
              </div>
            </div>

            <div style={cardStyle}>
              <div style={cardLabelStyle}>Entrada rápida</div>
              <div style={cardTitleStyle}>Cadastro sem travar o acesso</div>
              <div style={cardTextStyle}>
                A pessoa pode entrar agora, registrar a base principal e
                completar os detalhes depois sem perder continuidade.
              </div>
            </div>

            <div style={cardStyle}>
              <div style={cardLabelStyle}>Expansão</div>
              <div style={cardTitleStyle}>Pronta para crescer por região</div>
              <div style={cardTextStyle}>
                Base pensada para evolução por segmento, estado, cidade,
                cobertura e relacionamento comercial.
              </div>
            </div>
          </div>

          <div
            style={{
              borderRadius: 20,
              padding: "16px 18px",
              background:
                "linear-gradient(135deg, rgba(22,163,74,0.08), rgba(37,99,235,0.08))",
              border: "1px solid rgba(22,163,74,0.14)",
              color: "#0f172a",
              fontSize: 14,
              lineHeight: 1.75,
              fontWeight: 700,
            }}
          >
            Sistema em constante atualização. Pode haver momentos de
            instabilidade durante melhorias. A Aurora está evoluindo a área
            AGRO para oferecer uma entrada mais clara, segura, regionalizável e
            comercialmente forte.
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
            }}
          >
            <Link href="/cadastro-geral" style={primaryButtonStyle}>
              Entrar no AGRO agora
            </Link>

            <Link href="/chat" style={secondaryButtonStyle}>
              Falar com a Aurora
            </Link>

            <Link href="/agro/fornecedores" style={secondaryButtonStyle}>
              Ver fornecedores
            </Link>

            <Link href="/agro/compradores" style={secondaryButtonStyle}>
              Ver compradores
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
  background: "linear-gradient(135deg, #16a34a, #22c55e)",
  border: "1px solid rgba(22,163,74,0.16)",
  borderRadius: 14,
  padding: "12px 16px",
  fontWeight: 900,
  display: "inline-flex",
  justifyContent: "center",
  alignItems: "center",
  boxShadow: "0 14px 30px rgba(22,163,74,0.16)",
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
  color: "#16a34a",
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