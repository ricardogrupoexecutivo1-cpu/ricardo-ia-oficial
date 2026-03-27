import Link from "next/link";

export default function LocadoraCadastrosPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(34,197,94,0.14), transparent 0%, transparent 28%), radial-gradient(circle at right top, rgba(20,184,166,0.14), transparent 0%, transparent 22%), linear-gradient(180deg, #041018 0%, #02060d 100%)",
        color: "#eef6ff",
        overflowX: "hidden",
      }}
    >
      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "24px 16px 88px",
        }}
      >
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
            marginBottom: 20,
          }}
        >
          <span aria-hidden="true">🚗</span>
          <span>Central de Cadastros · Locadora</span>
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: "clamp(34px, 8vw, 66px)",
            lineHeight: 1.02,
            letterSpacing: "-0.04em",
            fontWeight: 900,
            maxWidth: 860,
          }}
        >
          Cadastros principais da operação da locadora
        </h1>

        <p
          style={{
            marginTop: 18,
            marginBottom: 0,
            maxWidth: 840,
            color: "#d5e5f7",
            fontSize: "clamp(17px, 3.8vw, 22px)",
            lineHeight: 1.72,
          }}
        >
          Organize veículos, clientes, motoristas, parceiros e bancos em uma
          área clara, bonita e pronta para operação real dentro da Aurora.
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            marginTop: 26,
          }}
        >
          <Link href="/locadora" style={secondaryButton}>
            Voltar para locadora
          </Link>

          <Link href="/locadora/admin" style={secondaryButton}>
            Área protegida
          </Link>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 18,
            marginTop: 32,
          }}
        >
          <Link href="/locadora/cadastros/veiculos" style={cardLink}>
            <article style={card}>
              <div style={iconWrap}>🚘</div>
              <h2 style={cardTitle}>Veículos</h2>
              <p style={cardText}>
                Cadastro e gestão do estoque de veículos da operação.
              </p>
              <span style={cardAction}>Abrir cadastro de veículos</span>
            </article>
          </Link>

          <Link href="/locadora/cadastros/clientes" style={cardLink}>
            <article style={cardFeatured}>
              <div style={iconWrap}>👤</div>
              <h2 style={cardTitle}>Clientes</h2>
              <p style={cardText}>
                Cadastro de clientes, contato e dados comerciais.
              </p>
              <span style={cardAction}>Abrir cadastro de clientes</span>
            </article>
          </Link>

          <Link href="/locadora/cadastros/motoristas" style={cardLink}>
            <article style={card}>
              <div style={iconWrap}>🪪</div>
              <h2 style={cardTitle}>Motoristas</h2>
              <p style={cardText}>
                Cadastre motoristas e organize documentos, categoria e situação.
              </p>
              <span style={cardAction}>Abrir cadastro de motoristas</span>
            </article>
          </Link>

          <Link href="/bancos" style={cardLink}>
            <article style={card}>
              <div style={iconWrap}>🏦</div>
              <h2 style={cardTitle}>Bancos</h2>
              <p style={cardText}>
                Integração com parceiros financeiros e fluxo comercial.
              </p>
              <span style={cardAction}>Abrir bancos parceiros</span>
            </article>
          </Link>

          <Link href="/locadora/cadastros/parceiros" style={cardLink}>
            <article style={card}>
              <div style={iconWrap}>🤝</div>
              <h2 style={cardTitle}>Parceiros</h2>
              <p style={cardText}>
                Cadastro de parceiros e origens de negócio.
              </p>
              <span style={cardAction}>Abrir cadastro de parceiros</span>
            </article>
          </Link>
        </div>

        <section
          style={{
            marginTop: 30,
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
            AVISO
          </div>

          <div
            style={{
              color: "#f2f8ff",
              fontSize: 16,
              lineHeight: 1.7,
            }}
          >
            Sistema em constante atualização. Pode haver momentos de
            instabilidade durante ajustes de performance, segurança, expansão
            comercial e evolução da plataforma.
          </div>
        </section>
      </section>
    </main>
  );
}

const cardLink: React.CSSProperties = {
  textDecoration: "none",
  color: "inherit",
};

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

const card: React.CSSProperties = {
  minWidth: 0,
  borderRadius: 24,
  padding: 22,
  background: "linear-gradient(180deg, rgba(10,24,36,0.92), rgba(5,11,18,0.98))",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 22px 60px rgba(0,0,0,0.28)",
};

const cardFeatured: React.CSSProperties = {
  minWidth: 0,
  borderRadius: 24,
  padding: 22,
  background:
    "linear-gradient(180deg, rgba(20,38,32,0.98), rgba(5,11,18,0.98))",
  border: "1px solid rgba(34,197,94,0.24)",
  boxShadow: "0 22px 60px rgba(0,0,0,0.28)",
};

const iconWrap: React.CSSProperties = {
  width: 58,
  height: 58,
  borderRadius: 16,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 28,
  background: "rgba(255,255,255,0.05)",
  marginBottom: 16,
};

const cardTitle: React.CSSProperties = {
  margin: "0 0 10px",
  fontSize: 24,
  fontWeight: 800,
};

const cardText: React.CSSProperties = {
  margin: 0,
  color: "#cbd5e1",
  lineHeight: 1.65,
  fontSize: 15,
};

const cardAction: React.CSSProperties = {
  display: "inline-block",
  marginTop: 18,
  color: "#b9f7cf",
  fontWeight: 800,
  fontSize: 15,
};