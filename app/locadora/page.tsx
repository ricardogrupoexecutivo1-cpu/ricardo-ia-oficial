import Link from "next/link";

export default function LocadoraPage() {
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
            border: "1px solid rgba(34,197,94,0.35)",
            color: "#86efac",
            fontWeight: 800,
            fontSize: 14,
            marginBottom: 20,
          }}
        >
          Aurora Locadoras
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
          <span style={{ color: "#22c55e" }}> Aurora Locadoras</span>
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
          Cadastre veículos, clientes, parceiros, bancos e acompanhe propostas
          dentro de uma estrutura pronta para operação e conversão. Estamos em
          constante atualização e pode haver momentos de instabilidade.
        </p>

        {/* BOTÕES PRINCIPAIS */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 14,
            marginTop: 28,
          }}
        >
          <Link href="/locadora/cadastros" style={primaryButton}>
            Abrir central de cadastros
          </Link>

          <Link href="/locadora/clientes" style={primaryButton}>
            📋 Ver clientes cadastrados
          </Link>

          <Link href="/locadora/admin" style={secondaryButton}>
            Painel da locadora
          </Link>

          <Link href="/" style={secondaryButton}>
            Voltar para home
          </Link>
        </div>

        {/* AÇÕES RÁPIDAS */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 14,
            marginTop: 16,
          }}
        >
          <Link href="/locadora/seminovos" style={primaryButton}>
            🚗 Ver Seminovos
          </Link>

          <a
            href="https://wa.me/5531997490074"
            target="_blank"
            rel="noreferrer"
            style={whatsButton}
          >
            📲 Locação / Comercial
          </a>

          <Link href="/locadora/transporte" style={secondaryButton}>
            🚛 Transporte
          </Link>
        </div>

        {/* CARDS */}
        <section style={{ marginTop: 42 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 18,
            }}
          >
            <Link href="/locadora/cadastros?tipo=veiculos" style={cardLink}>
              <article style={card}>
                <div style={emojiBox}>🚗</div>
                <h2 style={title}>Cadastrar veículos</h2>
                <p style={text}>
                  Entradas de carros, utilitários, preços e disponibilidade.
                </p>
                <span style={actionGreen}>Abrir cadastro de veículos</span>
              </article>
            </Link>

            <Link href="/locadora/cadastros?tipo=clientes" style={card}>
              <article style={card}>
                <div style={emojiBox}>👤</div>
                <h2 style={title}>Cadastrar clientes</h2>
                <p style={text}>
                  Cadastro de clientes, contatos e histórico.
                </p>
                <span style={actionGreen}>Abrir cadastro de clientes</span>
              </article>
            </Link>

            <Link href="/locadora/cadastros?tipo=bancos" style={cardLink}>
              <article style={card}>
                <div style={emojiBox}>🏦</div>
                <h2 style={title}>Cadastrar bancos</h2>
                <p style={text}>
                  Integração com bancos para financiamento.
                </p>
                <span style={actionGreen}>Abrir cadastro de bancos</span>
              </article>
            </Link>

            <Link href="/locadora/cadastros?tipo=parceiros" style={cardLink}>
              <article style={card}>
                <div style={emojiBox}>🤝</div>
                <h2 style={title}>Cadastrar parceiros</h2>
                <p style={text}>
                  Parceiros comerciais e origens de negócio.
                </p>
                <span style={actionGreen}>Abrir cadastro de parceiros</span>
              </article>
            </Link>
          </div>
        </section>

        {/* FLUXO */}
        <section
          style={{
            marginTop: 46,
            padding: 22,
            borderRadius: 22,
            background: "rgba(15,23,42,0.72)",
            border: "1px solid rgba(148,163,184,0.16)",
          }}
        >
          <h3 style={{ margin: "0 0 12px", fontSize: 22, fontWeight: 800 }}>
            Fluxo da locadora
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 14,
            }}
          >
            <div style={stepBox}>
              <strong>1. Cadastrar veículos</strong>
            </div>

            <div style={stepBox}>
              <strong>2. Cadastrar cliente</strong>
            </div>

            <div style={stepBox}>
              <strong>3. Gerar proposta</strong>
            </div>

            <div style={stepBox}>
              <strong>4. Fechar venda</strong>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

const primaryButton = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 48,
  padding: "0 18px",
  borderRadius: 14,
  textDecoration: "none",
  fontWeight: 800,
  fontSize: 15,
  color: "#02140a",
  background: "linear-gradient(135deg, #22c55e, #4ade80)",
};

const secondaryButton = {
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

const whatsButton = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 48,
  padding: "0 18px",
  borderRadius: 14,
  textDecoration: "none",
  fontWeight: 800,
  fontSize: 15,
  color: "#04110a",
  background: "#25D366",
};

const cardLink = {
  textDecoration: "none",
  color: "inherit",
};

const card = {
  padding: 22,
  borderRadius: 22,
  background: "rgba(15,23,42,0.92)",
};

const emojiBox = {
  fontSize: 28,
  marginBottom: 10,
};

const title = {
  fontSize: 22,
  fontWeight: 800,
};

const text = {
  color: "#cbd5e1",
};

const actionGreen = {
  color: "#86efac",
  fontWeight: 800,
};

const stepBox = {
  padding: 16,
  borderRadius: 16,
  background: "rgba(2,6,23,0.72)",
};