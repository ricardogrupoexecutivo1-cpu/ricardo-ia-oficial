export default function AuroraShopPage() {
  return (
    <main
      style={{
        background:
          "radial-gradient(circle at top, rgba(34, 211, 238, 0.16), transparent 24%), radial-gradient(circle at 85% 12%, rgba(14, 165, 233, 0.18), transparent 22%), radial-gradient(circle at 20% 100%, rgba(8, 47, 73, 0.30), transparent 18%), linear-gradient(180deg, #082032 0%, #0b2239 40%, #081c30 100%)",
        minHeight: "100vh",
        fontFamily: "Arial, Helvetica, sans-serif",
        color: "#ffffff",
      }}
    >
      {/* HERO */}
      <section style={{ padding: "40px 20px", textAlign: "center" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "900", margin: 0 }}>
          🚀 Aurora Shop
        </h1>

        <p style={{ marginTop: 10, fontSize: 14, color: "rgba(236, 246, 255, 0.82)" }}>
          Marketplace do ecossistema RicardoIAOficial.com
        </p>

        <p
          style={{
            marginTop: 20,
            fontSize: 14,
            maxWidth: 600,
            marginInline: "auto",
            color: "rgba(236, 246, 255, 0.88)",
            lineHeight: 1.6,
          }}
        >
          Venda produtos, divulgue soluções e participe de uma nova camada comercial
          preparada para crescer com tecnologia e posicionamento premium.
        </p>

        <div
          style={{
            marginTop: 25,
            display: "flex",
            gap: 10,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <a href="/cadastro" style={btnPrimary}>
            Quero vender
          </a>
          <a href="/planos" style={btnOutline}>
            Ver planos
          </a>
          <a href="/aurora-shop/monetizacao" style={btnOutline}>
            Monetização
          </a>
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section style={{ padding: 20 }}>
        <div style={grid}>
          <div style={card}>
            <h3 style={title}>💰 Estrutura de Venda</h3>
            <p style={text}>
              Publique produtos e organize sua vitrine com base pronta para expansão.
            </p>
          </div>

          <div style={card}>
            <h3 style={title}>🌐 Presença Digital</h3>
            <p style={text}>
              Prepare sua empresa para aparecer e ser encontrada online.
            </p>
          </div>

          <div style={card}>
            <h3 style={title}>⚙️ Ecossistema</h3>
            <p style={text}>
              Integração com Aurora Motoristas, Condomínios e demais soluções.
            </p>
          </div>

          <div style={card}>
            <h3 style={title}>📈 Crescimento</h3>
            <p style={text}>
              Base pronta para vendas recorrentes e monetização futura.
            </p>
          </div>
        </div>
      </section>

      {/* PRODUTOS */}
      <section style={{ padding: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: "800", marginBottom: 15, marginTop: 0 }}>
          🔥 Produtos do Ecossistema
        </h2>

        <div style={grid}>
          <div style={card}>
            <h4 style={title}>Chave Mestra Aurora</h4>
            <p style={text}>Acesso inicial ao sistema</p>
            <p style={price}>R$ 97,00</p>
            <a href="/checkout" style={btnPrimarySmall}>
              Comprar
            </a>
          </div>

          <div style={card}>
            <h4 style={title}>App Motoristas</h4>
            <p style={text}>Gestão completa de operações</p>
            <p style={price}>R$ 197,00</p>
            <a href="/aurora-motoristas" style={btnPrimarySmall}>
              Acessar
            </a>
          </div>

          <div style={card}>
            <h4 style={title}>Aurora Condomínios</h4>
            <p style={text}>Controle financeiro e gestão</p>
            <a href="/condominios" style={btnPrimarySmall}>
              Ver
            </a>
          </div>

          <div style={card}>
            <h4 style={title}>Seminovos Locadoras</h4>
            <p style={text}>Venda e gestão de veículos</p>
            <a href="/locadora" style={btnPrimarySmall}>
              Explorar
            </a>
          </div>
        </div>
      </section>

      {/* MONETIZAÇÃO */}
      <section style={{ padding: 20 }}>
        <div style={highlightBox}>
          <h2 style={{ fontSize: 20, fontWeight: "800", margin: 0 }}>
            💳 Monetização Aurora
          </h2>

          <p
            style={{
              marginTop: 10,
              fontSize: 13,
              color: "rgba(235, 244, 252, 0.84)",
              maxWidth: 760,
              lineHeight: 1.6,
            }}
          >
            Camada comercial isolada para preparar checkout, afiliados, comissões e
            crescimento de receita sem mexer na estrutura principal da vitrine.
          </p>

          <div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a href="/aurora-shop/monetizacao" style={btnPrimary}>
              Abrir monetização
            </a>
            <a href="/planos" style={btnOutline}>
              Ver planos
            </a>
          </div>
        </div>
      </section>

      {/* PARCERIA */}
      <section style={{ padding: 20, textAlign: "center" }}>
        <h2 style={{ fontSize: 20, fontWeight: "800", margin: 0 }}>
          🤝 Programa de Parceiros
        </h2>

        <p style={{ marginTop: 10, fontSize: 13, color: "rgba(236, 246, 255, 0.82)" }}>
          Participe da expansão comercial do ecossistema Aurora.
        </p>

        <div style={{ marginTop: 20 }}>
          <a href="/contato" style={btnPrimary}>
            Quero ser parceiro
          </a>
        </div>
      </section>

      {/* AVISO */}
      <section
        style={{
          padding: 20,
          textAlign: "center",
          fontSize: 11,
          color: "rgba(255,255,255,0.72)",
        }}
      >
        Sistema em constante atualização. Algumas funcionalidades podem evoluir conforme melhorias.
      </section>
    </main>
  );
}

/* ESTILOS */

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 15,
};

const card = {
  background: "rgba(255,255,255,0.055)",
  padding: 20,
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.10)",
  backdropFilter: "blur(16px)",
  boxShadow: "0 18px 40px rgba(0,0,0,0.18)",
};

const highlightBox = {
  background:
    "linear-gradient(180deg, rgba(34,211,238,0.10), rgba(255,255,255,0.03)), rgba(255,255,255,0.055)",
  padding: 20,
  borderRadius: 16,
  border: "1px solid rgba(34,211,238,0.22)",
  boxShadow: "0 18px 40px rgba(0,0,0,0.18)",
  backdropFilter: "blur(16px)",
};

const title = {
  fontWeight: "800",
  marginBottom: 8,
  color: "#ffffff",
};

const text = {
  fontSize: 13,
  color: "rgba(235, 244, 252, 0.84)",
  lineHeight: 1.55,
};

const price = {
  fontWeight: "900",
  marginTop: 10,
  color: "#9be7ff",
};

const btnPrimary = {
  background: "linear-gradient(135deg, #67e8f9 0%, #22d3ee 45%, #0ea5e9 100%)",
  color: "#082032",
  padding: "12px 20px",
  borderRadius: 10,
  fontWeight: "800",
  textDecoration: "none",
  boxShadow: "0 10px 24px rgba(34, 211, 238, 0.22)",
};

const btnPrimarySmall = {
  ...btnPrimary,
  display: "inline-block",
  marginTop: 10,
  fontSize: 12,
};

const btnOutline = {
  border: "1px solid rgba(34, 211, 238, 0.30)",
  background: "rgba(34, 211, 238, 0.08)",
  padding: "12px 20px",
  borderRadius: 10,
  fontWeight: "800",
  textDecoration: "none",
  color: "#effcff",
};