"use client";

import Link from "next/link";

export default function EntrarPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(59,130,246,0.10), transparent 18%), radial-gradient(circle at left, rgba(34,197,94,0.10), transparent 24%), linear-gradient(180deg, #eef6ff 0%, #f7fbff 36%, #edf7f3 100%)",
        color: "#0f172a",
        padding: "24px 16px 80px",
        display: "flex",
        alignItems: "center",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: 1180,
          margin: "0 auto",
          display: "grid",
          gap: 18,
        }}
      >
        <header
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
              Entrada oficial • login • continuidade de acesso
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
        </header>

        <section
          style={{
            border: "1px solid rgba(15,23,42,0.08)",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,255,255,0.78))",
            borderRadius: 30,
            padding: "28px 20px",
            boxShadow: "0 22px 70px rgba(15,23,42,0.09)",
            display: "grid",
            gap: 22,
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
            Acesso Aurora
          </div>

          <div style={heroGridStyle}>
            <div style={{ display: "grid", gap: 12 }}>
              <h1
                style={{
                  margin: 0,
                  fontSize: "clamp(32px, 5vw, 58px)",
                  lineHeight: 0.98,
                  letterSpacing: "-0.04em",
                  color: "#0f172a",
                  maxWidth: 820,
                }}
              >
                Entre na Aurora com uma base forte para login real e expansão
              </h1>

              <p
                style={{
                  margin: 0,
                  maxWidth: 900,
                  color: "rgba(15,23,42,0.72)",
                  fontSize: 18,
                  lineHeight: 1.7,
                  fontWeight: 600,
                }}
              >
                Esta área foi criada para receber entrada por Google, Apple e
                e-mail em um fluxo oficial da Aurora. Nesta primeira etapa,
                deixamos a interface pronta, organizada e alinhada com a
                identidade da plataforma para ativar a autenticação real no
                próximo passo.
              </p>

              <div
                style={{
                  borderRadius: 18,
                  padding: "14px 16px",
                  background:
                    "linear-gradient(135deg, rgba(37,99,235,0.08), rgba(16,185,129,0.08))",
                  border: "1px solid rgba(37,99,235,0.14)",
                  color: "#0f172a",
                  fontSize: 14,
                  lineHeight: 1.75,
                  fontWeight: 700,
                  maxWidth: 860,
                }}
              >
                Sistema em constante atualização. Pode haver momentos de
                instabilidade durante melhorias. Os botões abaixo já representam
                a entrada oficial da Aurora e serão ligados ao fluxo real de
                autenticação na próxima etapa.
              </div>
            </div>

            <aside style={loginPanelStyle}>
              <div style={panelHeaderStyle}>
                <div style={panelBadgeStyle}>Acesso rápido</div>
                <h2 style={panelTitleStyle}>Escolha como entrar</h2>
                <p style={panelTextStyle}>
                  A Aurora está preparada para concentrar entrada, continuidade
                  de acesso e lembrete de cadastro em um único ponto.
                </p>
              </div>

              <div style={buttonsWrapStyle}>
                <button type="button" style={oauthButtonStyle}>
                  <span style={iconCircleStyle}>G</span>
                  <span>Entrar com Google</span>
                  <span style={comingSoonStyle}>em ativação</span>
                </button>

                <button type="button" style={oauthButtonStyle}>
                  <span style={iconCircleStyle}></span>
                  <span>Entrar com Apple</span>
                  <span style={comingSoonStyle}>em ativação</span>
                </button>

                <button type="button" style={oauthButtonStyle}>
                  <span style={iconCircleStyle}>@</span>
                  <span>Entrar com e-mail</span>
                  <span style={comingSoonStyle}>em ativação</span>
                </button>
              </div>

              <div style={dividerStyle}>
                <span style={dividerLineStyle} />
                <span style={dividerTextStyle}>Enquanto isso</span>
                <span style={dividerLineStyle} />
              </div>

              <div style={actionsGridStyle}>
                <Link href="/cadastro-geral" style={primaryButtonStyle}>
                  Criar cadastro geral
                </Link>

                <Link href="/chat" style={secondaryButtonStyle}>
                  Abrir Chat Aurora
                </Link>

                <Link href="/" style={secondaryButtonStyle}>
                  Voltar para a Home
                </Link>
              </div>
            </aside>
          </div>

          <div style={featuresGridStyle}>
            <div style={featureCardStyle}>
              <div style={featureLabelStyle}>Google</div>
              <div style={featureTitleStyle}>Entrada rápida para escala</div>
              <div style={featureTextStyle}>
                Ideal para reduzir atrito e facilitar retenção de quem chega
                pela primeira vez na Aurora.
              </div>
            </div>

            <div style={featureCardStyle}>
              <div style={featureLabelStyle}>Apple</div>
              <div style={featureTitleStyle}>Experiência premium</div>
              <div style={featureTextStyle}>
                Importante para reforçar percepção internacional, mobile e
                entrada mais elegante no ecossistema.
              </div>
            </div>

            <div style={featureCardStyle}>
              <div style={featureLabelStyle}>E-mail</div>
              <div style={featureTitleStyle}>Base universal</div>
              <div style={featureTextStyle}>
                Mantém a Aurora acessível para qualquer usuário, com fallback
                forte para cadastro, plano e continuidade.
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

const heroGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1.2fr) minmax(320px, 420px)",
  gap: 18,
  alignItems: "start",
};

const loginPanelStyle: React.CSSProperties = {
  borderRadius: 24,
  padding: "18px",
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.90), rgba(248,250,252,0.94))",
  border: "1px solid rgba(15,23,42,0.08)",
  boxShadow: "0 16px 40px rgba(15,23,42,0.06)",
  display: "grid",
  gap: 16,
};

const panelHeaderStyle: React.CSSProperties = {
  display: "grid",
  gap: 8,
};

const panelBadgeStyle: React.CSSProperties = {
  display: "inline-flex",
  width: "fit-content",
  alignItems: "center",
  justifyContent: "center",
  padding: "7px 11px",
  borderRadius: 999,
  background: "rgba(16,185,129,0.08)",
  border: "1px solid rgba(16,185,129,0.16)",
  color: "#15803d",
  fontSize: 12,
  fontWeight: 900,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};

const panelTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 28,
  lineHeight: 1.04,
  color: "#0f172a",
  fontWeight: 900,
};

const panelTextStyle: React.CSSProperties = {
  margin: 0,
  color: "rgba(15,23,42,0.68)",
  fontSize: 14,
  lineHeight: 1.7,
  fontWeight: 700,
};

const buttonsWrapStyle: React.CSSProperties = {
  display: "grid",
  gap: 10,
};

const oauthButtonStyle: React.CSSProperties = {
  minHeight: 58,
  borderRadius: 16,
  border: "1px solid rgba(15,23,42,0.08)",
  background: "rgba(255,255,255,0.90)",
  color: "#0f172a",
  padding: "12px 14px",
  fontWeight: 800,
  display: "grid",
  gridTemplateColumns: "40px 1fr auto",
  alignItems: "center",
  gap: 12,
  boxShadow: "0 10px 22px rgba(15,23,42,0.05)",
  cursor: "default",
};

const iconCircleStyle: React.CSSProperties = {
  width: 32,
  height: 32,
  borderRadius: 999,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(135deg, #eff6ff, #ecfeff)",
  border: "1px solid rgba(37,99,235,0.12)",
  color: "#2563eb",
  fontSize: 16,
  fontWeight: 900,
};

const comingSoonStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 900,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: "#2563eb",
  background: "rgba(37,99,235,0.08)",
  border: "1px solid rgba(37,99,235,0.14)",
  borderRadius: 999,
  padding: "6px 8px",
};

const dividerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
};

const dividerLineStyle: React.CSSProperties = {
  flex: 1,
  height: 1,
  background: "rgba(15,23,42,0.08)",
};

const dividerTextStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 900,
  color: "rgba(15,23,42,0.52)",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};

const actionsGridStyle: React.CSSProperties = {
  display: "grid",
  gap: 10,
};

const featuresGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 12,
};

const featureCardStyle: React.CSSProperties = {
  borderRadius: 22,
  padding: "18px",
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.86), rgba(255,255,255,0.72))",
  border: "1px solid rgba(15,23,42,0.08)",
  boxShadow: "0 12px 28px rgba(15,23,42,0.05)",
  display: "grid",
  gap: 8,
};

const featureLabelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 900,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#2563eb",
};

const featureTitleStyle: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 900,
  lineHeight: 1.1,
  color: "#0f172a",
};

const featureTextStyle: React.CSSProperties = {
  fontSize: 14,
  lineHeight: 1.7,
  fontWeight: 700,
  color: "rgba(15,23,42,0.72)",
};

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