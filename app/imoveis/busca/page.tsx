import Link from "next/link";

export default function ImoveisBuscaPage() {
  return (
    <main style={main()}>
      <div style={container()}>
        <Nav />

        <Section
          badge="Busca Imóveis"
          title="Busca de imóveis em atualização"
          desc="Esta rota foi ativada para eliminar erros 404 e preparar a busca real de imóveis, corretores e oportunidades imobiliárias."
        />

        <Grid>
          <Card title="Status" value="Busca ativa" text="404 eliminado" />
          <Card title="Objetivo" value="Busca comercial" text="Conectar compradores e imóveis" />
          <Card title="Próximo passo" value="Banco real" text="Ligar Supabase" />
        </Grid>

        <Box title="Filtros previstos">
          {["Tipo", "Cidade", "Preço", "Quartos", "Finalidade", "Corretor"]}
        </Box>
      </div>
    </main>
  );
}

/* COMPONENTES */

function Nav() {
  return (
    <div style={nav()}>
      <Link href="/" style={btn("#93c5fd")}>Home</Link>
      <Link href="/imoveis" style={btn("#86efac")}>Imóveis</Link>
      <Link href="/imobiliarias" style={btn("#facc15")}>Imobiliárias</Link>
    </div>
  );
}

function Section({ badge, title, desc }: any) {
  return (
    <section style={card()}>
      <div style={badgeStyle()}>{badge}</div>
      <h1>{title}</h1>
      <p style={descStyle()}>{desc}</p>
    </section>
  );
}

function Card({ title, value, text }: any) {
  return (
    <div style={miniCard()}>
      <div style={{ fontSize: 12 }}>{title}</div>
      <div style={{ fontWeight: 800 }}>{value}</div>
      <p>{text}</p>
    </div>
  );
}

function Grid({ children }: any) {
  return <div style={grid()}>{children}</div>;
}

function Box({ title, children }: any) {
  return (
    <section style={card()}>
      <h2>{title}</h2>
      <div style={grid()}>
        {children.map((i: string) => (
          <div key={i} style={miniCard()}>{i}</div>
        ))}
      </div>
    </section>
  );
}

/* ESTILOS */

function main() { return { minHeight: "100vh", background: "#050816", color: "#fff", padding: 30 }; }
function container() { return { maxWidth: 1100, margin: "0 auto" }; }
function nav() { return { display: "flex", gap: 10, marginBottom: 20 }; }
function btn(color: string) { return { color, border: `1px solid ${color}30`, padding: 10, borderRadius: 999 }; }
function card() { return { background: "#111", padding: 20, borderRadius: 20, marginBottom: 20 }; }
function grid() { return { display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))" }; }
function miniCard() { return { background: "#0b1220", padding: 12, borderRadius: 12 }; }
function badgeStyle() { return { marginBottom: 10, color: "#86efac" }; }
function descStyle() { return { color: "#94a3b8" }; }