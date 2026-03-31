import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function getSupabase() {
  const url =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;

  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.error("Supabase não configurado");
    return null;
  }

  return createClient(url, key);
}

export default async function ExplorarPage() {
  const supabase = getSupabase();

  let cadastros: any[] = [];

  if (supabase) {
    const { data, error } = await supabase
      .from("cadastros")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar cadastros:", error.message);
    }

    cadastros = data || [];
  }

  return (
    <main style={{ padding: "24px 12px 60px", color: "#fff" }}>
      
      {/* HEADER */}
      <section style={{ textAlign: "center", marginBottom: 24 }}>
        <h1 style={{
          fontSize: "clamp(24px,5vw,32px)",
          fontWeight: 800
        }}>
          Empresas na Aurora
        </h1>

        <p style={{ opacity: 0.7, marginTop: 8 }}>
          Encontre empresas, fornecedores e oportunidades
          <br />
          <span style={{ fontSize: 12 }}>
            Find companies and opportunities worldwide
          </span>
        </p>
      </section>

      {/* GRID */}
      <div style={grid}>
        {cadastros.map((item) => (
          <div key={item.id} style={card}>

            {/* EMPRESA */}
            <div style={{ fontWeight: 800, fontSize: 18 }}>
              {item.empresa || "Empresa não informada"}
            </div>

            {/* SEGMENTOS */}
            {item.area && (
              <div style={tag}>
                📊 {item.area}
              </div>
            )}

            {/* ATIVIDADES */}
            {(item.atividade || item.atividade_personalizada) && (
              <div style={text}>
                <strong>Atuação:</strong>{" "}
                {[item.atividade, item.atividade_personalizada]
                  .filter(Boolean)
                  .join(" • ")}
              </div>
            )}

            {/* ABRANGÊNCIA */}
            {item.abrangencia && (
              <div style={text}>
                🌍 {item.abrangencia}
              </div>
            )}

            {/* DESCRIÇÃO */}
            {item.descricao && (
              <p style={desc}>
                {item.descricao}
              </p>
            )}

            {/* CONTATO */}
            {item.whatsapp && (
              <a
                href={`https://wa.me/${item.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                style={btn}
              >
                📞 WhatsApp
              </a>
            )}

          </div>
        ))}
      </div>

      {/* VAZIO */}
      {cadastros.length === 0 && (
        <div style={{ textAlign: "center", opacity: 0.6 }}>
          Nenhuma empresa cadastrada ainda.
        </div>
      )}
    </main>
  );
}

/* ESTILOS MOBILE FIRST */

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: 14,
};

const card = {
  background: "#12182b",
  padding: 16,
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.08)",
  display: "flex",
  flexDirection: "column" as const,
  gap: 10,
};

const tag = {
  fontSize: 12,
  background: "rgba(0,255,136,0.1)",
  border: "1px solid rgba(0,255,136,0.2)",
  padding: "6px 10px",
  borderRadius: 8,
};

const text = {
  fontSize: 13,
  opacity: 0.8,
  lineHeight: 1.4,
};

const desc = {
  fontSize: 14,
  lineHeight: 1.6,
};

const btn = {
  marginTop: 8,
  padding: "10px",
  borderRadius: 10,
  background: "#00ff88",
  color: "#04110b",
  textAlign: "center" as const,
  textDecoration: "none",
  fontWeight: 700,
};