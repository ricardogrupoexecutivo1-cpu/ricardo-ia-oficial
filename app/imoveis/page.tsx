import Link from "next/link";

export default function ImoveisPage() {
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
          padding: "40px 20px 80px",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
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
          Aurora Imóveis
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: "clamp(34px, 5vw, 58px)",
            lineHeight: 1.05,
            fontWeight: 900,
            letterSpacing: "-0.03em",
          }}
        >
          Gestão comercial e cadastros da
          <span style={{ color: "#38bdf8" }}> Aurora Imóveis</span>
        </h1>

        <p
          style={{
            maxWidth: 900,
            marginTop: 18,
            color: "#cbd5e1",
            fontSize: 18,
            lineHeight: 1.7,
          }}
        >
          Cadastre imóveis, clientes, corretores e parceiros para estruturar
          captação, vitrine e fluxo comercial em uma experiência clara e pronta
          para crescer.
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 14,
            marginTop: 28,
          }}
        >
          <Link href="/imoveis/cadastros" style={primaryButton}>
            Abrir central de cadastros
          </Link>

          <Link href="/imoveis/admin" style={secondaryButton}>
            Painel imobiliário
          </Link>

          <Link href="/" style={secondaryButton}>
            Voltar para home
          </Link>
        </div>

        <section style={{ marginTop: 42 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 18,
            }}
          >
            <Link href="/imoveis/cadastros?tipo=imoveis" style={cardLink}>
              <article style={card}>
                <div style={emojiBox}>🏠</div>
                <h2 style={title}>Cadastrar imóveis</h2>
                <p style={text}>
                  Cadastro de casas, apartamentos, lotes, aluguel, venda e
                  vitrine comercial.
                </p>
                <span style={actionBlue}>Abrir cadastro de imóveis</span>
              </article>
            </Link>

            <Link href="/imoveis/cadastros?tipo=clientes" style={cardLink}>
              <article style={card}>
                <div style={emojiBox}>👤</div>
                <h2 style={title}>Cadastrar clientes</h2>
                <p style={text}>
                  Cadastro de compradores, locatários, proprietários e contatos
                  de atendimento.
                </p>
                <span style={actionBlue}>Abrir cadastro de clientes</span>
              </article>
            </Link>

            <Link href="/imoveis/cadastros?tipo=corretores" style={cardLink}>
              <article style={card}>
                <div style={emojiBox}>🧑‍💼</div>
                <h2 style={title}>Cadastrar corretores</h2>
                <p style={text}>
                  Corretores, captadores e equipe comercial para operação do
                  módulo.
                </p>
                <span style={actionBlue}>Abrir cadastro de corretores</span>
              </article>
            </Link>

            <Link href="/imoveis/cadastros?tipo=parceiros" style={cardLink}>
              <article style={card}>
                <div style={emojiBox}>🤝</div>
                <h2 style={title}>Cadastrar parceiros</h2>
                <p style={text}>
                  Construtoras, correspondentes, captadores e parceiros de
                  negócio.
                </p>
                <span style={actionBlue}>Abrir cadastro de parceiros</span>
              </article>
            </Link>
          </div>
        </section>

        <section
          style={{
            marginTop: 46,
            padding: 22,
            borderRadius: 22,
            background: "rgba(15,23,42,0.72)",
            border: "1px solid rgba(148,163,184,0.16)",
          }}
        >
          <h3
            style={{
              margin: "0 0 12px",
              fontSize: 22,
              fontWeight: 800,
            }}
          >
            Fluxo recomendado do módulo imobiliário
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 14,
            }}
          >
            <div style={stepBox}>
              <strong>1. Cadastrar imóvel</strong>
              <p style={stepText}>Entrada de produto e vitrine.</p>
            </div>

            <div style={stepBox}>
              <strong>2. Cadastrar cliente</strong>
              <p style={stepText}>Comprador, locatário ou proprietário.</p>
            </div>

            <div style={stepBox}>
              <strong>3. Vincular corretor</strong>
              <p style={stepText}>Responsável comercial pelo atendimento.</p>
            </div>

            <div style={stepBox}>
              <strong>4. Fechar negociação</strong>
              <p style={stepText}>Acompanhar proposta e comissão.</p>
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
  minHeight: 48,
  padding: "0 18px",
  borderRadius: 14,
  textDecoration: "none",
  fontWeight: 800,
  fontSize: 15,
  color: "#03111a",
  background: "linear-gradient(135deg, #38bdf8, #7dd3fc)",
  boxShadow: "0 10px 30px rgba(56,189,248,0.25)",
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

const cardLink: React.CSSProperties = {
  textDecoration: "none",
  color: "inherit",
};

const card: React.CSSProperties = {
  height: "100%",
  padding: 22,
  borderRadius: 22,
  background: "linear-gradient(180deg, rgba(15,23,42,0.92), rgba(2,6,23,0.96))",
  border: "1px solid rgba(148,163,184,0.18)",
  boxShadow: "0 14px 40px rgba(0,0,0,0.28)",
};

const emojiBox: React.CSSProperties = {
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

const actionBlue: React.CSSProperties = {
  display: "inline-block",
  marginTop: 18,
  color: "#7dd3fc",
  fontWeight: 800,
  fontSize: 15,
};

const stepBox: React.CSSProperties = {
  padding: 16,
  borderRadius: 16,
  background: "rgba(2,6,23,0.72)",
  border: "1px solid rgba(148,163,184,0.14)",
};

const stepText: React.CSSProperties = {
  margin: "8px 0 0",
  color: "#cbd5e1",
  lineHeight: 1.55,
  fontSize: 14,
};