import Link from "next/link";

export default function LocadoraMotoristasPage() {
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
          <span aria-hidden="true">🪪</span>
          <span>Cadastro de Motoristas</span>
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
          Motoristas e filiais em todo o Brasil
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
          Área pensada para cadastro de motoristas com dados principais,
          documentos, categoria, validade, cidade de residência e controle
          mais profissional para operações nacionais.
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            marginTop: 26,
          }}
        >
          <Link href="/locadora/cadastros" style={secondaryButton}>
            Voltar para cadastros
          </Link>

          <Link href="/locadora/admin" style={secondaryButton}>
            Área protegida
          </Link>
        </div>

        <div
          style={{
            marginTop: 32,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 18,
          }}
        >
          <article style={card}>
            <h2 style={cardTitle}>Nome completo</h2>
            <p style={cardText}>
              Cadastro do motorista com identificação principal.
            </p>
          </article>

          <article style={card}>
            <h2 style={cardTitle}>CNH e categoria</h2>
            <p style={cardText}>
              Controle de categoria, número e validade da habilitação.
            </p>
          </article>

          <article style={cardFeatured}>
            <h2 style={cardTitle}>Cidade de residência</h2>
            <p style={cardText}>
              Campo essencial para organizar motoristas por cidade, região e
              filial de atendimento.
            </p>
          </article>

          <article style={card}>
            <h2 style={cardTitle}>Contato</h2>
            <p style={cardText}>
              Telefone, e-mail e dados básicos para operação.
            </p>
          </article>

          <article style={card}>
            <h2 style={cardTitle}>Situação</h2>
            <p style={cardText}>
              Ativo, pendente, bloqueado ou aguardando documentação.
            </p>
          </article>

          <article style={card}>
            <h2 style={cardTitle}>Filial vinculada</h2>
            <p style={cardText}>
              Relacione o motorista com a filial correta da locadora.
            </p>
          </article>
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
            PRÓXIMO PASSO
          </div>

          <div
            style={{
              color: "#f2f8ff",
              fontSize: 16,
              lineHeight: 1.7,
            }}
          >
            Depois desta etapa visual, vamos ligar esse cadastro ao banco para
            gravação real de motoristas com cidade, filial e documentação.
          </div>
        </section>
      </section>
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