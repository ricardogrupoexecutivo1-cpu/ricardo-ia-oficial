import Link from "next/link";

export default function ImobiliariasBuscaPage() {
  return (
    <main style={main()}>
      <div style={container()}>
        <div style={nav()}>
          <Link href="/" style={btn("#93c5fd")}>Home</Link>
          <Link href="/imobiliarias" style={btn("#86efac")}>Imobiliárias</Link>
          <Link href="/imoveis" style={btn("#facc15")}>Imóveis</Link>
        </div>

        <section style={card()}>
          <div style={badge()}>Busca Imobiliárias</div>
          <h1>Busca de imobiliárias em atualização</h1>
          <p style={desc()}>
            Esta rota foi ativada para eliminar erros 404 e preparar busca real de imobiliárias e corretores.
          </p>
        </section>

        <div style={grid()}>
          <Mini title="Status" value="Ativo" />
          <Mini title="Objetivo" value="Captar empresas" />
          <Mini title="Próximo" value="Banco real" />
        </div>

        <section style={card()}>
          <h2>Filtros previstos</h2>
          <div style={grid()}>
            {["Cidade", "Especialidade", "Corretores", "Tipo de imóvel", "Avaliação"].map((f) => (
              <div key={f} style={mini()}>{f}</div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

/* estilos simples */

const main = () => ({ minHeight: "100vh", background: "#050816", color: "#fff", padding: 30 });
const container = () => ({ maxWidth: 1100, margin: "0 auto" });
const nav = () => ({ display: "flex", gap: 10, marginBottom: 20 });
const btn = (c: string) => ({ color: c, border: `1px solid ${c}30`, padding: 10, borderRadius: 999 });
const card = () => ({ background: "#111", padding: 20, borderRadius: 20, marginBottom: 20 });
const grid = () => ({ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))" });
const mini = () => ({ background: "#0b1220", padding: 12, borderRadius: 12 });
const badge = () => ({ marginBottom: 10, color: "#c7d2fe" });
const desc = () => ({ color: "#94a3b8" });

function Mini({ title, value }: any) {
  return (
    <div style={mini()}>
      <div>{title}</div>
      <strong>{value}</strong>
    </div>
  );
}