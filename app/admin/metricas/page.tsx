import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

function getSupabaseServerClient() {
  const url =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;

  return createClient(url, key);
}

export const dynamic = "force-dynamic";

export default async function AdminMetricasPage() {
  const supabase = getSupabaseServerClient();

  let totalCadastros = 0;
  let totalPublicos = 0;
  let totalRascunhos = 0;
  let totalOrigemBasico = 0;
  let totalOrigemGeral = 0;
  let ultimosCadastros: Array<{
    id: string;
    nome_responsavel: string | null;
    nome_empresa: string | null;
    email: string | null;
    origem: string | null;
    status: string | null;
    created_at?: string | null;
  }> = [];

  let erroConfig = "";

  if (!supabase) {
    erroConfig =
      "Variáveis do Supabase não configuradas para leitura de métricas.";
  } else {
    const [
      totalRes,
      publicosRes,
      rascunhosRes,
      basicoRes,
      geralRes,
      recentesRes,
    ] = await Promise.all([
      supabase.from("cadastros_gerais").select("*", { count: "exact", head: true }),
      supabase
        .from("cadastros_gerais")
        .select("*", { count: "exact", head: true })
        .eq("is_public", true),
      supabase
        .from("cadastros_gerais")
        .select("*", { count: "exact", head: true })
        .eq("status", "rascunho"),
      supabase
        .from("cadastros_gerais")
        .select("*", { count: "exact", head: true })
        .eq("origem", "cadastro_basico"),
      supabase
        .from("cadastros_gerais")
        .select("*", { count: "exact", head: true })
        .eq("origem", "cadastro_geral"),
      supabase
        .from("cadastros_gerais")
        .select("id,nome_responsavel,nome_empresa,email,origem,status,created_at")
        .order("created_at", { ascending: false })
        .limit(20),
    ]);

    totalCadastros = totalRes.count || 0;
    totalPublicos = publicosRes.count || 0;
    totalRascunhos = rascunhosRes.count || 0;
    totalOrigemBasico = basicoRes.count || 0;
    totalOrigemGeral = geralRes.count || 0;
    ultimosCadastros = recentesRes.data || [];
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(59,130,246,0.14), transparent 25%), #050816",
        color: "#e5eef8",
        padding: "32px 16px 80px",
      }}
    >
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
          <Link href="/" style={navStyle("#93c5fd")}>
            Voltar à Home
          </Link>
          <Link href="/cadastro-basico" style={navStyle("#86efac")}>
            Cadastro básico
          </Link>
          <Link href="/cadastro" style={navStyle("#facc15")}>
            Cadastro completo
          </Link>
          <Link href="/guardiao" style={navStyle("#c4b5fd")}>
            Guardião
          </Link>
        </div>

        <section style={heroCard}>
          <div style={badge}>Admin • Métricas do projeto</div>
          <h1 style={heroTitle}>Painel administrativo Aurora IA</h1>
          <p style={heroText}>
            Esta área mostra métricas internas da base de cadastros do projeto.
            O tráfego externo continua sendo acompanhado por Google Analytics e Vercel.
          </p>
        </section>

        {erroConfig ? (
          <div style={errorBox}>{erroConfig}</div>
        ) : (
          <>
            <section style={cardsGrid}>
              <MetricCard title="Total de cadastros" value={totalCadastros} />
              <MetricCard title="Cadastros públicos" value={totalPublicos} />
              <MetricCard title="Cadastros em rascunho" value={totalRascunhos} />
              <MetricCard title="Origem cadastro básico" value={totalOrigemBasico} />
              <MetricCard title="Origem cadastro completo" value={totalOrigemGeral} />
            </section>

            <section style={tableWrap}>
              <h2 style={{ marginTop: 0 }}>Últimos cadastros</h2>

              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    minWidth: 840,
                  }}
                >
                  <thead>
                    <tr>
                      <Th>ID</Th>
                      <Th>Nome</Th>
                      <Th>Empresa</Th>
                      <Th>E-mail</Th>
                      <Th>Origem</Th>
                      <Th>Status</Th>
                      <Th>Criado em</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {ultimosCadastros.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={tdStyle}>
                          Nenhum cadastro encontrado.
                        </td>
                      </tr>
                    ) : (
                      ultimosCadastros.map((item) => (
                        <tr key={item.id}>
                          <td style={tdStyle}>{item.id}</td>
                          <td style={tdStyle}>{item.nome_responsavel || "-"}</td>
                          <td style={tdStyle}>{item.nome_empresa || "-"}</td>
                          <td style={tdStyle}>{item.email || "-"}</td>
                          <td style={tdStyle}>{item.origem || "-"}</td>
                          <td style={tdStyle}>{item.status || "-"}</td>
                          <td style={tdStyle}>
                            {item.created_at
                              ? new Date(item.created_at).toLocaleString("pt-BR")
                              : "-"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}

function MetricCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div
      style={{
        borderRadius: 20,
        padding: 20,
        background: "rgba(15,23,42,0.72)",
        border: "1px solid rgba(148,163,184,0.15)",
      }}
    >
      <div style={{ color: "#94a3b8", fontSize: 13 }}>{title}</div>
      <div
        style={{
          marginTop: 10,
          fontSize: 32,
          fontWeight: 900,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th
      style={{
        textAlign: "left",
        padding: "12px 10px",
        borderBottom: "1px solid rgba(148,163,184,0.16)",
        color: "#93c5fd",
        fontSize: 13,
      }}
    >
      {children}
    </th>
  );
}

function navStyle(color: string): React.CSSProperties {
  return {
    color,
    textDecoration: "none",
    border: `1px solid ${color}33`,
    borderRadius: 999,
    padding: "10px 14px",
    fontWeight: 700,
    background: "rgba(15,23,42,0.45)",
  };
}

const tdStyle: React.CSSProperties = {
  padding: "12px 10px",
  borderBottom: "1px solid rgba(148,163,184,0.10)",
  color: "#e2e8f0",
  fontSize: 14,
  verticalAlign: "top",
};

const heroCard: React.CSSProperties = {
  border: "1px solid rgba(148,163,184,0.18)",
  background: "rgba(15,23,42,0.72)",
  borderRadius: 24,
  padding: 24,
  boxShadow: "0 20px 80px rgba(0,0,0,0.35)",
  marginBottom: 24,
};

const badge: React.CSSProperties = {
  display: "inline-flex",
  padding: "8px 12px",
  borderRadius: 999,
  background: "rgba(59,130,246,0.14)",
  border: "1px solid rgba(59,130,246,0.25)",
  color: "#93c5fd",
  fontSize: 13,
  fontWeight: 700,
  marginBottom: 14,
};

const heroTitle: React.CSSProperties = {
  fontSize: 36,
  lineHeight: 1.05,
  margin: 0,
};

const heroText: React.CSSProperties = {
  color: "#94a3b8",
  marginTop: 14,
  maxWidth: 940,
  fontSize: 16,
  lineHeight: 1.7,
};

const cardsGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 16,
  marginBottom: 24,
};

const tableWrap: React.CSSProperties = {
  borderRadius: 24,
  padding: 24,
  background: "rgba(15,23,42,0.72)",
  border: "1px solid rgba(148,163,184,0.15)",
};

const errorBox: React.CSSProperties = {
  borderRadius: 18,
  padding: 18,
  background: "rgba(239,68,68,0.10)",
  border: "1px solid rgba(239,68,68,0.30)",
  color: "#fecaca",
  lineHeight: 1.7,
};