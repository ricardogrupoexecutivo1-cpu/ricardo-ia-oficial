import Link from "next/link";

export default function ImoveisCadastrosPage() {
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
          maxWidth: 1100,
          margin: "0 auto",
          padding: "40px 20px 80px",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            padding: "8px 14px",
            borderRadius: 999,
            background: "rgba(15,23,42,0.7)",
            border: "1px solid rgba(56,189,248,0.35)",
            color: "#7dd3fc",
            fontWeight: 800,
            fontSize: 14,
            marginBottom: 20,
          }}
        >
          Central de cadastros · Imóveis
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: "clamp(32px, 5vw, 54px)",
            lineHeight: 1.05,
            fontWeight: 900,
          }}
        >
          Escolha o tipo de cadastro da
          <span style={{ color: "#38bdf8" }}> Aurora Imóveis</span>
        </h1>

        <p
          style={{
            marginTop: 18,
            maxWidth: 850,
            color: "#cbd5e1",
            fontSize: 18,
            lineHeight: 1.7,
          }}
        >
          Aqui ficam os acessos principais para iniciar o módulo imobiliário com
          clareza e navegação correta.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 18,
            marginTop: 32,
          }}
        >
          <Link href="/imoveis/admin" style={cardLink}>
            <article style={card}>
              <h2 style={title}>Imóveis</h2>
              <p style={text}>Cadastrar imóveis e organizar vitrine.</p>
            </article>
          </Link>

          <Link href="/imoveis/admin" style={cardLink}>
            <article style={card}>
              <h2 style={title}>Clientes</h2>
              <p style={text}>Cadastrar compradores, locatários e proprietários.</p>
            </article>
          </Link>

          <Link href="/imoveis/admin" style={cardLink}>
            <article style={card}>
              <h2 style={title}>Corretores</h2>
              <p style={text}>Gerenciar equipe e responsáveis comerciais.</p>
            </article>
          </Link>

          <Link href="/imoveis/admin" style={cardLink}>
            <article style={card}>
              <h2 style={title}>Parceiros</h2>
              <p style={text}>Construtoras, captadores e parceiros de negócio.</p>
            </article>
          </Link>
        </div>

        <div style={{ marginTop: 28 }}>
          <Link href="/imoveis" style={buttonBack}>
            Voltar para Aurora Imóveis
          </Link>
        </div>
      </section>
    </main>
  );
}

const cardLink: React.CSSProperties = {
  textDecoration: "none",
  color: "inherit",
};

const card: React.CSSProperties = {
  padding: 22,
  borderRadius: 22,
  background: "linear-gradient(180deg, rgba(15,23,42,0.92), rgba(2,6,23,0.96))",
  border: "1px solid rgba(148,163,184,0.18)",
  boxShadow: "0 14px 40px rgba(0,0,0,0.28)",
};

const title: React.CSSProperties = {
  margin: "0 0 10px",
  fontSize: 24,
  fontWeight: 800,
};

const text: React.CSSProperties = {
  margin: 0,
  color: "#cbd5e1",
  lineHeight: 1.65,
  fontSize: 15,
};

const buttonBack: React.CSSProperties = {
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