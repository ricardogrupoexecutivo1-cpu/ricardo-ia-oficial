"use client";

import Link from "next/link";

export default function LocadoraSeminovosPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(34,197,94,0.14), transparent 0%, transparent 28%), radial-gradient(circle at right top, rgba(20,184,166,0.12), transparent 0%, transparent 22%), linear-gradient(180deg, #041018 0%, #02060d 100%)",
        color: "#eef6ff",
        overflowX: "hidden",
      }}
    >
      <section
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "24px 16px 88px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 20,
          }}
        >
          <Link href="/locadora" style={secondaryButton}>
            ← Voltar para Locadora
          </Link>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 14px",
              borderRadius: 999,
              background: "rgba(34,197,94,0.10)",
              border: "1px solid rgba(34,197,94,0.24)",
              color: "#b9f7cf",
              fontWeight: 800,
              fontSize: 13,
            }}
          >
            <span aria-hidden="true">🚗</span>
            <span>Seminovos Aurora</span>
          </div>
        </div>

        <div
          className="aurora-seminovos-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(320px, 420px)",
            gap: 22,
          }}
        >
          <article style={heroCard}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 12px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.07)",
                color: "#b8d7ff",
                fontWeight: 800,
                fontSize: 12,
                marginBottom: 18,
              }}
            >
              <span aria-hidden="true">🚘</span>
              <span>Aurora Locadoras</span>
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: "clamp(34px, 7vw, 62px)",
                lineHeight: 1.02,
                letterSpacing: "-0.04em",
                fontWeight: 900,
                maxWidth: 780,
              }}
            >
              Seminovos de locadoras com acesso rápido e tráfego forte
            </h1>

            <p
              style={{
                marginTop: 18,
                marginBottom: 0,
                color: "#d5e5f7",
                fontSize: "clamp(17px, 3.6vw, 21px)",
                lineHeight: 1.72,
                maxWidth: 760,
              }}
            >
              Área pensada para locadoras publicarem veículos seminovos com
              acesso direto, contato comercial rápido e navegação pelo site
              inteiro para aumentar visibilidade e conversão.
            </p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
                marginTop: 26,
              }}
            >
              <div style={pillStyle}>Venda de seminovos</div>
              <div style={pillStyle}>Link direto</div>
              <div style={pillStyle}>WhatsApp comercial</div>
              <div style={pillStyle}>Tráfego pelo site</div>
            </div>

            <div style={infoBox}>
              <div style={infoLabel}>PLANO FUNDADORES</div>
              <div style={infoText}>
                Uso gratuito por tempo limitado durante a fase inicial da
                plataforma. No futuro, novos planos e recursos premium serão
                ativados.
              </div>
            </div>
          </article>

          <aside style={sideCard}>
            <div
              style={{
                display: "grid",
                gap: 12,
              }}
            >
              <a
                href="https://wa.me/5531997490074"
                target="_blank"
                rel="noreferrer"
                style={whatsButton}
              >
                📲 Falar com Comercial
              </a>

              <Link href="/anunciar/cadastro" style={greenButton}>
                ✍️ Publicar meu seminovo
              </Link>

              <Link href="/locadora/cadastros" style={secondaryButton}>
                Abrir central de cadastros
              </Link>
            </div>

            <div style={sideInfoBox}>
              <div style={sideInfoTitle}>Importante</div>
              <div style={sideInfoText}>
                A locadora pode divulgar o link direto da sua área e ao mesmo
                tempo manter o usuário navegando por outras páginas da Aurora,
                aumentando alcance e tráfego.
              </div>
            </div>
          </aside>
        </div>

        <section style={{ marginTop: 28 }}>
          <div
            style={{
              display: "flex",
              alignItems: "end",
              justifyContent: "space-between",
              gap: 16,
              flexWrap: "wrap",
              marginBottom: 16,
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 30,
                  fontWeight: 900,
                  letterSpacing: "-0.03em",
                }}
              >
                Vitrine inicial de seminovos
              </h2>
              <p
                style={{
                  margin: "8px 0 0",
                  color: "#bcd3ea",
                  fontSize: 15,
                  lineHeight: 1.6,
                }}
              >
                Estrutura visual pronta para receber anúncios reais da locadora.
              </p>
            </div>
          </div>

          <div
            className="aurora-seminovos-cards"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 16,
            }}
          >
            <article style={vehicleCard}>
              <div style={vehicleImageMock}>SUV / Pickup</div>
              <div style={vehicleBody}>
                <h3 style={vehicleTitle}>Toyota Hilux 2023</h3>
                <div style={vehicleMeta}>Automática • Diesel • Belo Horizonte</div>
                <div style={vehiclePrice}>R$ 000.000</div>
                <a
                  href="https://wa.me/5531997490074"
                  target="_blank"
                  rel="noreferrer"
                  style={vehicleWhats}
                >
                  📲 Tenho interesse
                </a>
              </div>
            </article>

            <article style={vehicleCard}>
              <div style={vehicleImageMock}>Sedan / Executivo</div>
              <div style={vehicleBody}>
                <h3 style={vehicleTitle}>Toyota Corolla 2022</h3>
                <div style={vehicleMeta}>Automático • Flex • São Paulo</div>
                <div style={vehiclePrice}>R$ 000.000</div>
                <a
                  href="https://wa.me/5531997490074"
                  target="_blank"
                  rel="noreferrer"
                  style={vehicleWhats}
                >
                  📲 Tenho interesse
                </a>
              </div>
            </article>

            <article style={vehicleCard}>
              <div style={vehicleImageMock}>Utilitário / Frota</div>
              <div style={vehicleBody}>
                <h3 style={vehicleTitle}>Fiat Strada 2023</h3>
                <div style={vehicleMeta}>Manual • Flex • Minas Gerais</div>
                <div style={vehiclePrice}>R$ 000.000</div>
                <a
                  href="https://wa.me/5531997490074"
                  target="_blank"
                  rel="noreferrer"
                  style={vehicleWhats}
                >
                  📲 Tenho interesse
                </a>
              </div>
            </article>
          </div>
        </section>

        <section
          style={{
            marginTop: 28,
            padding: 20,
            borderRadius: 24,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: "0.2em",
              color: "#8db5d9",
              marginBottom: 12,
            }}
          >
            ESTRATÉGIA
          </div>

          <div
            style={{
              color: "#f2f8ff",
              fontSize: 15,
              lineHeight: 1.7,
            }}
          >
            A publicação de seminovos deve gerar acesso direto para a área da
            locadora dentro da Aurora, mantendo navegação livre pelo restante do
            site para impulsionar tráfego, retenção e descoberta de novos
            serviços.
          </div>
        </section>
      </section>

      <style jsx global>{`
        @media (max-width: 980px) {
          .aurora-seminovos-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}

const secondaryButton: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 48,
  padding: "0 18px",
  borderRadius: 14,
  textDecoration: "none",
  fontWeight: 700,
  fontSize: 15,
  color: "#e5e7eb",
  border: "1px solid rgba(148,163,184,0.28)",
  background: "rgba(15,23,42,0.62)",
};

const greenButton: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 50,
  padding: "0 18px",
  borderRadius: 14,
  textDecoration: "none",
  fontWeight: 800,
  fontSize: 15,
  color: "#04110a",
  background: "linear-gradient(135deg, #22c55e, #86efac)",
  boxShadow: "0 12px 30px rgba(34,197,94,0.25)",
};

const whatsButton: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 50,
  padding: "0 18px",
  borderRadius: 14,
  textDecoration: "none",
  fontWeight: 800,
  fontSize: 15,
  color: "#04110a",
  background: "#25D366",
  boxShadow: "0 12px 30px rgba(37,211,102,0.25)",
};

const heroCard: React.CSSProperties = {
  position: "relative",
  overflow: "hidden",
  borderRadius: 30,
  border: "1px solid rgba(255,255,255,0.08)",
  background:
    "linear-gradient(180deg, rgba(10,24,36,0.92) 0%, rgba(5,11,18,0.98) 100%)",
  boxShadow: "0 30px 80px rgba(0,0,0,0.38)",
  padding: "28px 22px 24px",
  minWidth: 0,
};

const sideCard: React.CSSProperties = {
  borderRadius: 30,
  border: "1px solid rgba(255,255,255,0.08)",
  background:
    "linear-gradient(180deg, rgba(10,18,30,0.96) 0%, rgba(4,8,14,0.99) 100%)",
  boxShadow: "0 26px 70px rgba(0,0,0,0.34)",
  padding: 22,
  minWidth: 0,
  alignSelf: "start",
};

const pillStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 42,
  padding: "0 16px",
  borderRadius: 999,
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "#e5f0fb",
  fontWeight: 700,
  fontSize: 14,
};

const infoBox: React.CSSProperties = {
  marginTop: 28,
  padding: 18,
  borderRadius: 22,
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.07)",
};

const infoLabel: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: "0.2em",
  color: "#8db5d9",
  marginBottom: 12,
};

const infoText: React.CSSProperties = {
  color: "#f2f8ff",
  fontSize: 16,
  lineHeight: 1.7,
};

const sideInfoBox: React.CSSProperties = {
  marginTop: 18,
  padding: 16,
  borderRadius: 18,
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.07)",
};

const sideInfoTitle: React.CSSProperties = {
  color: "#f3f8ff",
  fontSize: 16,
  fontWeight: 800,
  marginBottom: 8,
};

const sideInfoText: React.CSSProperties = {
  color: "#b8cde3",
  fontSize: 14,
  lineHeight: 1.65,
};

const vehicleCard: React.CSSProperties = {
  minWidth: 0,
  borderRadius: 24,
  overflow: "hidden",
  background:
    "linear-gradient(180deg, rgba(10,24,36,0.92), rgba(5,11,18,0.98))",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 22px 60px rgba(0,0,0,0.28)",
};

const vehicleImageMock: React.CSSProperties = {
  minHeight: 180,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 900,
  fontSize: 22,
  letterSpacing: "-0.03em",
  color: "#d9fbe8",
  background:
    "linear-gradient(135deg, rgba(34,197,94,0.22), rgba(20,184,166,0.18))",
};

const vehicleBody: React.CSSProperties = {
  padding: 18,
};

const vehicleTitle: React.CSSProperties = {
  margin: 0,
  fontSize: 22,
  fontWeight: 800,
};

const vehicleMeta: React.CSSProperties = {
  marginTop: 8,
  color: "#cbd5e1",
  fontSize: 14,
  lineHeight: 1.6,
};

const vehiclePrice: React.CSSProperties = {
  marginTop: 12,
  color: "#b9f7cf",
  fontSize: 22,
  fontWeight: 900,
};

const vehicleWhats: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  marginTop: 14,
  minHeight: 44,
  padding: "0 14px",
  borderRadius: 12,
  textDecoration: "none",
  fontWeight: 800,
  fontSize: 14,
  color: "#04110a",
  background: "#25D366",
};