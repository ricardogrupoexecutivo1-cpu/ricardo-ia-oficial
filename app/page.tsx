import Link from "next/link";

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #0f172a 0%, #020617 45%, #000000 100%)",
        color: "#ffffff",
      }}
    >
      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "48px 20px 80px",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 14px",
            border: "1px solid rgba(34,197,94,0.35)",
            borderRadius: "999px",
            background: "rgba(15,23,42,0.65)",
            color: "#86efac",
            fontSize: "14px",
            fontWeight: 700,
            marginBottom: "20px",
          }}
        >
          Aurora IA
          <span style={{ color: "#cbd5e1", fontWeight: 500 }}>
            Plataforma em expansão
          </span>
        </div>

        <h1
          style={{
            fontSize: "clamp(32px, 5vw, 64px)",
            lineHeight: 1.05,
            fontWeight: 900,
            margin: 0,
            letterSpacing: "-0.03em",
            maxWidth: "900px",
          }}
        >
          Aurora IA com acesso direto para
          <span style={{ color: "#22c55e" }}> Locadora</span>,
          <span style={{ color: "#38bdf8" }}> Imóveis</span> e
          <span style={{ color: "#f59e0b" }}> Bancos</span>
        </h1>

        <p
          style={{
            marginTop: "18px",
            maxWidth: "860px",
            fontSize: "18px",
            lineHeight: 1.7,
            color: "#cbd5e1",
          }}
        >
          Converse, gere campanhas, cadastre oportunidades e acesse módulos
          comerciais da Aurora em um só ambiente. Estamos em constante
          atualização e pode haver momentos de instabilidade.
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "14px",
            marginTop: "28px",
          }}
        >
          <Link href="/chat" style={primaryButton}>
            Abrir chat
          </Link>

          <Link href="/planos" style={secondaryButton}>
            Ver planos
          </Link>

          <Link href="/explorar" style={secondaryButton}>
            Explorar
          </Link>
        </div>

        <section style={{ marginTop: "44px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "18px",
            }}
          >
            <Link href="/locadora" style={cardLink}>
              <article style={cardBase}>
                <div style={iconWrap}>🚗</div>
                <h2 style={cardTitle}>Aurora Locadoras</h2>
                <p style={cardText}>
                  Área para locadoras, veículos, propostas, atendimento,
                  cadastros e gestão comercial.
                </p>
                <span style={cardActionGreen}>Entrar em Locadoras</span>
              </article>
            </Link>

            <Link href="/imoveis" style={cardLink}>
              <article style={cardBase}>
                <div style={iconWrap}>🏠</div>
                <h2 style={cardTitle}>Aurora Imóveis</h2>
                <p style={cardText}>
                  Espaço para imóveis, captação, vitrine comercial, cadastros e
                  fluxo de atendimento.
                </p>
                <span style={cardActionBlue}>Entrar em Imóveis</span>
              </article>
            </Link>

            <Link href="/bancos" style={cardLink}>
              <article style={cardBase}>
                <div style={iconWrap}>🏦</div>
                <h2 style={cardTitle}>Aurora Bancos</h2>
                <p style={cardText}>
                  Integração com parceiros financeiros para financiamento,
                  análise, resposta de propostas e geração de comissão.
                </p>
                <span style={cardActionGold}>Entrar em Bancos</span>
              </article>
            </Link>
          </div>
        </section>

        <section
          style={{
            marginTop: "52px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "16px",
          }}
        >
          <div style={infoBox}>
            <div style={infoTitle}>Acesso mais claro</div>
            <div style={infoText}>
              O cliente passa a ver os módulos principais já na entrada do site.
            </div>
          </div>

          <div style={infoBox}>
            <div style={infoTitle}>Fluxo comercial mais forte</div>
            <div style={infoText}>
              Menos perda de tráfego por falta de botão ou rota escondida.
            </div>
          </div>

          <div style={infoBox}>
            <div style={infoTitle}>Preparado para expansão</div>
            <div style={infoText}>
              Estrutura pronta para receber novos módulos na Home sem bagunça.
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

const primaryButton: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "48px",
  padding: "0 18px",
  borderRadius: "14px",
  textDecoration: "none",
  fontWeight: 800,
  fontSize: "15px",
  color: "#02140a",
  background: "linear-gradient(135deg, #22c55e, #4ade80)",
  boxShadow: "0 10px 30px rgba(34,197,94,0.25)",
};

const secondaryButton: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "48px",
  padding: "0 18px",
  borderRadius: "14px",
  textDecoration: "none",
  fontWeight: 700,
  fontSize: "15px",
  color: "#e5e7eb",
  border: "1px solid rgba(148,163,184,0.28)",
  background: "rgba(15,23,42,0.62)",
};

const cardLink: React.CSSProperties = {
  textDecoration: "none",
  color: "inherit",
};

const cardBase: React.CSSProperties = {
  height: "100%",
  borderRadius: "22px",
  padding: "22px",
  background: "linear-gradient(180deg, rgba(15,23,42,0.92), rgba(2,6,23,0.96))",
  border: "1px solid rgba(148,163,184,0.18)",
  boxShadow: "0 14px 40px rgba(0,0,0,0.28)",
};

const iconWrap: React.CSSProperties = {
  width: "58px",
  height: "58px",
  borderRadius: "16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "28px",
  background: "rgba(255,255,255,0.05)",
  marginBottom: "16px",
};

const cardTitle: React.CSSProperties = {
  fontSize: "24px",
  fontWeight: 800,
  margin: "0 0 10px",
};

const cardText: React.CSSProperties = {
  margin: 0,
  color: "#cbd5e1",
  lineHeight: 1.65,
  fontSize: "15px",
};

const cardActionGreen: React.CSSProperties = {
  display: "inline-block",
  marginTop: "18px",
  color: "#86efac",
  fontWeight: 800,
  fontSize: "15px",
};

const cardActionBlue: React.CSSProperties = {
  display: "inline-block",
  marginTop: "18px",
  color: "#7dd3fc",
  fontWeight: 800,
  fontSize: "15px",
};

const cardActionGold: React.CSSProperties = {
  display: "inline-block",
  marginTop: "18px",
  color: "#fcd34d",
  fontWeight: 800,
  fontSize: "15px",
};

const infoBox: React.CSSProperties = {
  borderRadius: "18px",
  padding: "18px",
  background: "rgba(15,23,42,0.72)",
  border: "1px solid rgba(148,163,184,0.16)",
};

const infoTitle: React.CSSProperties = {
  fontWeight: 800,
  fontSize: "16px",
  marginBottom: "8px",
  color: "#ffffff",
};

const infoText: React.CSSProperties = {
  color: "#cbd5e1",
  fontSize: "14px",
  lineHeight: 1.6,
};