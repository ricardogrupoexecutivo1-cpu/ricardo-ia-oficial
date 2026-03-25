import Link from "next/link";

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(34,197,94,0.14), transparent 22%), radial-gradient(circle at right top, rgba(59,130,246,0.12), transparent 20%), #07111a",
        color: "#eef6ff",
      }}
    >
      <section
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "32px 16px 80px",
          display: "grid",
          gap: 24,
        }}
      >
        <div
          style={{
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(8,16,24,0.86)",
            borderRadius: 32,
            padding: "28px 20px",
            boxShadow: "0 30px 100px rgba(0,0,0,0.34)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(circle at top left, rgba(34,197,94,0.10), transparent 28%), radial-gradient(circle at bottom right, rgba(59,130,246,0.10), transparent 24%)",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 1,
              display: "grid",
              gap: 20,
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
                background: "rgba(126,231,184,0.12)",
                border: "1px solid rgba(126,231,184,0.24)",
                color: "#baf7d3",
                fontSize: 12,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              Aurora IA
            </div>

            <div
              style={{
                display: "grid",
                gap: 14,
                maxWidth: 860,
              }}
            >
              <h1
                style={{
                  margin: 0,
                  fontSize: "clamp(32px, 6vw, 64px)",
                  lineHeight: 1.02,
                  color: "#ffffff",
                  fontWeight: 900,
                }}
              >
                Crie imagens, campanhas e ideias com IA
              </h1>

              <p
                style={{
                  margin: 0,
                  fontSize: "clamp(16px, 2vw, 21px)",
                  lineHeight: 1.6,
                  color: "rgba(238,246,255,0.78)",
                  maxWidth: 760,
                }}
              >
                Uma IA brasileira pronta para vender, atrair atenção e ajudar
                você a crescer com mais velocidade.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <Link href="/chat" style={primaryButton}>
                Abrir chat agora
              </Link>

              <Link href="/planos" style={secondaryButton}>
                Ver planos
              </Link>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 16,
          }}
        >
          <Link href="/chat" style={quickCard}>
            <span style={cardLabel}>Ação rápida</span>
            <strong style={cardTitle}>Gerar imagem</strong>
            <span style={cardText}>
              Peça uma imagem impactante para anúncio, post ou campanha.
            </span>
          </Link>

          <Link href="/chat" style={quickCard}>
            <span style={cardLabel}>Ação rápida</span>
            <strong style={cardTitle}>Criar campanha</strong>
            <span style={cardText}>
              Gere copy, CTA, legenda, hashtags e direção de venda.
            </span>
          </Link>

          <Link href="/chat" style={quickCard}>
            <span style={cardLabel}>Ação rápida</span>
            <strong style={cardTitle}>Ideia de negócio</strong>
            <span style={cardText}>
              Transforme uma ideia em oferta, funil e produto mais rápido.
            </span>
          </Link>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 16,
          }}
        >
          <div style={infoCard}>
            <span style={miniLabel}>Imagem</span>
            <h2 style={miniTitle}>Visual com impacto</h2>
            <p style={miniText}>
              Crie imagens para Instagram, anúncios, campanhas e divulgação.
            </p>
          </div>

          <div style={infoCard}>
            <span style={miniLabel}>Marketing</span>
            <h2 style={miniTitle}>Textos que vendem</h2>
            <p style={miniText}>
              Gere campanhas, criativos, legendas, ofertas e chamadas de ação.
            </p>
          </div>

          <div style={infoCard}>
            <span style={miniLabel}>Negócio</span>
            <h2 style={miniTitle}>IA para crescer</h2>
            <p style={miniText}>
              Use a Aurora para vender melhor, ganhar tempo e escalar sua
              operação.
            </p>
          </div>
        </div>

        <div
          style={{
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(8,16,24,0.72)",
            borderRadius: 24,
            padding: "16px 18px",
            color: "rgba(238,246,255,0.72)",
            fontSize: 14,
            lineHeight: 1.6,
          }}
        >
          Estamos em constante atualização e pode haver momentos de
          instabilidade.
        </div>
      </section>
    </main>
  );
}

const primaryButton: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
  padding: "14px 20px",
  borderRadius: 16,
  fontWeight: 900,
  fontSize: 15,
  color: "#04110a",
  background: "linear-gradient(135deg, #22c55e, #86efac)",
  boxShadow: "0 18px 40px rgba(0,0,0,0.28)",
};

const secondaryButton: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
  padding: "14px 20px",
  borderRadius: 16,
  fontWeight: 900,
  fontSize: 15,
  color: "#eef6ff",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.10)",
};

const quickCard: React.CSSProperties = {
  display: "grid",
  gap: 10,
  textDecoration: "none",
  borderRadius: 24,
  padding: 20,
  background: "rgba(8,16,24,0.86)",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "#eef6ff",
  boxShadow: "0 16px 40px rgba(0,0,0,0.22)",
};

const infoCard: React.CSSProperties = {
  borderRadius: 24,
  padding: 20,
  background: "rgba(8,16,24,0.70)",
  border: "1px solid rgba(255,255,255,0.08)",
};

const cardLabel: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 800,
  textTransform: "uppercase",
  letterSpacing: 1,
  color: "#7ee7b8",
};

const cardTitle: React.CSSProperties = {
  fontSize: 22,
  lineHeight: 1.2,
  color: "#ffffff",
};

const cardText: React.CSSProperties = {
  fontSize: 15,
  lineHeight: 1.6,
  color: "rgba(238,246,255,0.72)",
};

const miniLabel: React.CSSProperties = {
  display: "inline-block",
  marginBottom: 10,
  fontSize: 11,
  fontWeight: 800,
  textTransform: "uppercase",
  letterSpacing: 1,
  color: "#7ee7b8",
};

const miniTitle: React.CSSProperties = {
  margin: "0 0 10px",
  fontSize: 22,
  lineHeight: 1.2,
  color: "#ffffff",
};

const miniText: React.CSSProperties = {
  margin: 0,
  fontSize: 15,
  lineHeight: 1.6,
  color: "rgba(238,246,255,0.72)",
};