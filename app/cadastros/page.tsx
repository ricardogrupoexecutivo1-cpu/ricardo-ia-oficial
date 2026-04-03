import Link from "next/link";
import { getPublicCompanies } from "@/lib/public-company";

type SearchParams = Promise<{
  q?: string;
}>;

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function matchesQuery(value: string | null | undefined, query: string) {
  if (!value) return false;
  return normalizeText(value).includes(query);
}

export default async function CadastrosPublicosPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const rawQuery = resolvedSearchParams?.q || "";
  const query = normalizeText(rawQuery);

  const companies = await getPublicCompanies();

  const filtered = !query
    ? companies
    : companies.filter((company) => {
        return (
          matchesQuery(company.publicName, query) ||
          matchesQuery(company.city, query) ||
          matchesQuery(company.state, query) ||
          matchesQuery(company.coverage, query) ||
          matchesQuery(company.segment, query) ||
          matchesQuery(company.publicDescription, query)
        );
      });

  return (
    <main style={mainStyle}>
      <section style={containerStyle}>
        {/* HEADER */}
        <header style={headerStyle}>
          <div>
            <div style={logoStyle}>ricardoiaoficial.com</div>
            <div style={titleStyle}>
              Buscar empresas • vitrine pública da Aurora
            </div>
          </div>

          <div style={badgeStyle}>Sistema em evolução</div>
        </header>

        {/* NAV */}
        <div style={navWrap}>
          <Link href="/" style={navLinkStyle}>Home</Link>
          <Link href="/guardiao" style={navLinkStyle}>Guardião</Link>
          <Link href="/cadastro-geral" style={navLinkStyle}>Cadastrar</Link>
          <Link href="/financeiro" style={navLinkStyle}>Financeiro</Link>
        </div>

        {/* HERO */}
        <section style={heroCard}>
          <div style={chipStyle}>Busca pública segura</div>

          <h1 style={heroTitle}>
            Encontre empresas, fornecedores e oportunidades reais
          </h1>

          <p style={heroText}>
            Esta vitrine mostra apenas dados públicos autorizados. Informações
            sensíveis permanecem protegidas. A Aurora está em constante
            evolução e pode haver instabilidade durante melhorias.
          </p>

          {/* BUSCA */}
          <form action="/cadastros" method="get" style={searchWrap}>
            <input
              type="text"
              name="q"
              defaultValue={rawQuery}
              placeholder="Buscar empresa, cidade, segmento..."
              style={inputStyle}
            />

            <button type="submit" style={primaryButton}>
              Buscar
            </button>
          </form>

          {/* STATS */}
          <div style={statsGrid}>
            <MiniInfo title="Cadastros" value={String(companies.length)} />
            <MiniInfo title="Resultados" value={String(filtered.length)} />
            <MiniInfo title="Privacidade" value="Ativa" />
          </div>
        </section>

        {/* RESULTADOS */}
        {filtered.length === 0 ? (
          <div style={emptyCard}>
            Nenhum resultado encontrado para sua busca.
          </div>
        ) : (
          <section style={grid}>
            {filtered.map((company) => {
              const url = `/empresa/${company.slug}`;

              return (
                <article key={company.id} style={card}>
                  <div style={cardHeader}>
                    <div>
                      <div style={companyName}>
                        {company.publicName}
                      </div>
                      <div style={companyLocation}>
                        {[company.city, company.state].filter(Boolean).join(" • ")}
                      </div>
                    </div>

                    <div style={publicBadge}>Público</div>
                  </div>

                  <div style={metaGrid}>
                    <Info label="Segmento" value={company.segment} />
                    <Info label="Cobertura" value={company.coverage} />
                    <Info label="Descrição" value={company.publicDescription} />
                  </div>

                  <div style={cardActions}>
                    <Link href={url} style={primaryButton}>
                      Ver empresa
                    </Link>

                    {company.whatsapp && (
                      <a
                        href={`https://wa.me/${company.whatsapp.replace(/\D+/g, "")}`}
                        target="_blank"
                        style={secondaryButton}
                      >
                        WhatsApp
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </section>
    </main>
  );
}

/* COMPONENTES */
function MiniInfo({ title, value }: any) {
  return (
    <div style={miniCard}>
      <div style={miniTitle}>{title}</div>
      <div style={miniValue}>{value}</div>
    </div>
  );
}

function Info({ label, value }: any) {
  return (
    <div style={infoBox}>
      <div style={infoLabel}>{label}</div>
      <div style={infoValue}>{value || "-"}</div>
    </div>
  );
}

/* ESTILOS */
const mainStyle = {
  minHeight: "100vh",
  background:
    "linear-gradient(180deg, #eef6ff 0%, #f7fbff 40%, #edf7f3 100%)",
  color: "#0f172a",
};

const containerStyle = {
  maxWidth: 1200,
  margin: "0 auto",
  padding: 20,
  display: "grid",
  gap: 20,
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const logoStyle = { fontSize: 12, fontWeight: 900, color: "#2563eb" };
const titleStyle = { fontSize: 18, fontWeight: 900 };

const badgeStyle = {
  padding: "6px 12px",
  borderRadius: 999,
  background: "#e0ecff",
  color: "#2563eb",
  fontWeight: 800,
};

const navWrap = { display: "flex", gap: 8, flexWrap: "wrap" };

const navLinkStyle = {
  padding: "8px 12px",
  borderRadius: 999,
  background: "#fff",
  border: "1px solid #e5e7eb",
  textDecoration: "none",
  color: "#0f172a",
  fontWeight: 700,
};

const heroCard = {
  background: "#fff",
  borderRadius: 24,
  padding: 20,
  border: "1px solid #e5e7eb",
  display: "grid",
  gap: 16,
};

const chipStyle = {
  background: "#e0ecff",
  color: "#2563eb",
  padding: "6px 10px",
  borderRadius: 999,
  fontWeight: 800,
  width: "fit-content",
};

const heroTitle = { fontSize: 28, fontWeight: 900 };
const heroText = { color: "#475569", lineHeight: 1.6 };

const searchWrap = { display: "flex", gap: 10, flexWrap: "wrap" };

const inputStyle = {
  flex: 1,
  padding: 14,
  borderRadius: 12,
  border: "1px solid #e5e7eb",
};

const primaryButton = {
  background: "#2563eb",
  color: "#fff",
  padding: "12px 16px",
  borderRadius: 12,
  border: "none",
  fontWeight: 900,
};

const secondaryButton = {
  background: "#fff",
  border: "1px solid #e5e7eb",
  padding: "12px 16px",
  borderRadius: 12,
};

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(120px,1fr))",
  gap: 10,
};

const miniCard = {
  background: "#f8fafc",
  padding: 14,
  borderRadius: 12,
};

const miniTitle = { fontSize: 12, color: "#64748b" };
const miniValue = { fontSize: 20, fontWeight: 900 };

const emptyCard = {
  background: "#fff",
  padding: 20,
  borderRadius: 20,
  border: "1px solid #e5e7eb",
};

const grid = {
  display: "grid",
  gap: 16,
};

const card = {
  background: "#fff",
  padding: 20,
  borderRadius: 20,
  border: "1px solid #e5e7eb",
  display: "grid",
  gap: 12,
};

const cardHeader = {
  display: "flex",
  justifyContent: "space-between",
};

const companyName = { fontSize: 20, fontWeight: 900 };
const companyLocation = { color: "#64748b" };

const publicBadge = {
  background: "#dcfce7",
  padding: "4px 10px",
  borderRadius: 999,
  fontWeight: 800,
};

const metaGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))",
  gap: 10,
};

const infoBox = {
  background: "#f8fafc",
  padding: 12,
  borderRadius: 12,
};

const infoLabel = { fontSize: 12, color: "#64748b" };
const infoValue = { fontWeight: 800 };

const cardActions = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
};