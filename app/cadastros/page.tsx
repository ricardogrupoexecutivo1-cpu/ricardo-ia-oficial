import Link from "next/link";
import type { CSSProperties } from "react";
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
        <header style={headerStyle}>
          <div style={{ display: "grid", gap: 4 }}>
            <div style={logoStyle}>ricardoiaoficial.com</div>
            <div style={titleStyle}>
              Buscar empresas • vitrine pública da Aurora
            </div>
          </div>

          <div style={badgeStyle}>Sistema em evolução</div>
        </header>

        <div style={navWrap}>
          <Link href="/" style={navLinkStyle}>
            Home
          </Link>
          <Link href="/guardiao" style={navLinkStyle}>
            Guardião
          </Link>
          <Link href="/cadastro-geral" style={navLinkStyle}>
            Cadastrar
          </Link>
          <Link href="/financeiro" style={navLinkStyle}>
            Financeiro
          </Link>
        </div>

        <section style={heroCard}>
          <div style={chipStyle}>Busca pública segura</div>

          <h1 style={heroTitle}>
            Encontre empresas, fornecedores e oportunidades reais
          </h1>

          <p style={heroText}>
            Esta vitrine mostra apenas dados públicos autorizados. Informações
            sensíveis permanecem protegidas. A Aurora está em constante evolução
            e pode haver instabilidade durante melhorias.
          </p>

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

          <div style={statsGrid}>
            <MiniInfo title="Cadastros" value={String(companies.length)} />
            <MiniInfo title="Resultados" value={String(filtered.length)} />
            <MiniInfo title="Privacidade" value="Ativa" />
          </div>
        </section>

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
                    <div style={{ display: "grid", gap: 6 }}>
                      <div style={companyName}>{company.publicName}</div>
                      <div style={companyLocation}>
                        {[company.city, company.state]
                          .filter(Boolean)
                          .join(" • ") || "Localidade não informada"}
                      </div>
                    </div>

                    <div style={publicBadge}>Público</div>
                  </div>

                  <div style={metaGrid}>
                    <Info label="Segmento" value={company.segment} />
                    <Info label="Cobertura" value={company.coverage} />
                    <Info
                      label="Descrição"
                      value={company.publicDescription}
                    />
                  </div>

                  <div style={cardActions}>
                    <Link href={url} style={primaryLinkStyle}>
                      Ver empresa
                    </Link>

                    <a href={url} style={secondaryLinkStyle}>
                      Abrir link
                    </a>

                    {company.whatsapp ? (
                      <a
                        href={`https://wa.me/${company.whatsapp.replace(
                          /\D+/g,
                          ""
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        style={secondaryLinkStyle}
                      >
                        WhatsApp
                      </a>
                    ) : null}
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

function MiniInfo({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div style={miniCard}>
      <div style={miniTitle}>{title}</div>
      <div style={miniValue}>{value}</div>
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div style={infoBox}>
      <div style={infoLabel}>{label}</div>
      <div style={infoValue}>{value || "-"}</div>
    </div>
  );
}

const mainStyle: CSSProperties = {
  minHeight: "100vh",
  background:
    "radial-gradient(circle at top, rgba(59,130,246,0.10), transparent 18%), radial-gradient(circle at left, rgba(16,185,129,0.10), transparent 24%), linear-gradient(180deg, #eef6ff 0%, #f7fbff 40%, #edf7f3 100%)",
  color: "#0f172a",
  overflow: "hidden",
};

const containerStyle: CSSProperties = {
  maxWidth: 1200,
  margin: "0 auto",
  padding: "18px 16px 72px",
  display: "grid",
  gap: 18,
};

const headerStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
  flexWrap: "wrap",
  border: "1px solid rgba(15,23,42,0.08)",
  background: "rgba(255,255,255,0.78)",
  backdropFilter: "blur(14px)",
  borderRadius: 24,
  padding: "14px",
  boxShadow: "0 18px 42px rgba(15,23,42,0.07)",
};

const logoStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 900,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#2563eb",
};

const titleStyle: CSSProperties = {
  fontSize: 18,
  fontWeight: 900,
  lineHeight: 1.2,
  color: "#0f172a",
};

const badgeStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 36,
  padding: "0 12px",
  borderRadius: 999,
  background: "rgba(37,99,235,0.08)",
  border: "1px solid rgba(37,99,235,0.16)",
  color: "#2563eb",
  fontSize: 12,
  fontWeight: 900,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};

const navWrap: CSSProperties = {
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
};

const navLinkStyle: CSSProperties = {
  textDecoration: "none",
  color: "#0f172a",
  border: "1px solid rgba(15,23,42,0.08)",
  background: "rgba(255,255,255,0.68)",
  borderRadius: 999,
  padding: "10px 14px",
  fontWeight: 800,
  fontSize: 13,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 8px 16px rgba(15,23,42,0.04)",
};

const heroCard: CSSProperties = {
  borderRadius: 32,
  border: "1px solid rgba(15,23,42,0.08)",
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.88), rgba(255,255,255,0.74))",
  boxShadow: "0 22px 70px rgba(15,23,42,0.09)",
  padding: "28px 20px 22px",
  display: "grid",
  gap: 16,
};

const chipStyle: CSSProperties = {
  display: "inline-flex",
  width: "fit-content",
  alignItems: "center",
  gap: 8,
  padding: "8px 12px",
  borderRadius: 999,
  background: "rgba(37,99,235,0.08)",
  border: "1px solid rgba(37,99,235,0.16)",
  color: "#2563eb",
  fontSize: 12,
  fontWeight: 900,
  boxShadow: "0 0 16px rgba(37,99,235,0.06)",
};

const heroTitle: CSSProperties = {
  margin: 0,
  fontSize: "clamp(28px, 4vw, 44px)",
  lineHeight: 1.04,
  letterSpacing: "-0.04em",
  color: "#0f172a",
};

const heroText: CSSProperties = {
  margin: 0,
  color: "rgba(15,23,42,0.72)",
  lineHeight: 1.7,
  maxWidth: 980,
  fontSize: 16,
  fontWeight: 700,
};

const searchWrap: CSSProperties = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
  marginTop: 4,
};

const inputStyle: CSSProperties = {
  flex: 1,
  minWidth: 260,
  borderRadius: 16,
  border: "1px solid rgba(15,23,42,0.10)",
  background: "rgba(255,255,255,0.96)",
  color: "#0f172a",
  padding: "14px 16px",
  fontSize: 15,
  outline: "none",
  boxShadow: "0 8px 20px rgba(15,23,42,0.03)",
};

const primaryButton: CSSProperties = {
  borderRadius: 16,
  border: "1px solid rgba(37,99,235,0.16)",
  background: "linear-gradient(135deg, #2563eb, #3b82f6)",
  color: "#ffffff",
  padding: "14px 18px",
  fontWeight: 900,
  cursor: "pointer",
  boxShadow: "0 14px 30px rgba(37,99,235,0.16)",
};

const statsGrid: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 12,
};

const miniCard: CSSProperties = {
  borderRadius: 18,
  padding: 16,
  background: "rgba(255,255,255,0.76)",
  border: "1px solid rgba(15,23,42,0.08)",
  boxShadow: "0 14px 30px rgba(15,23,42,0.05)",
};

const miniTitle: CSSProperties = {
  fontSize: 12,
  color: "rgba(15,23,42,0.62)",
  fontWeight: 700,
};

const miniValue: CSSProperties = {
  marginTop: 8,
  fontSize: 24,
  fontWeight: 900,
  color: "#0f172a",
};

const emptyCard: CSSProperties = {
  borderRadius: 24,
  padding: 22,
  border: "1px solid rgba(15,23,42,0.08)",
  background: "rgba(255,255,255,0.80)",
  color: "rgba(15,23,42,0.82)",
  boxShadow: "0 18px 42px rgba(15,23,42,0.06)",
};

const grid: CSSProperties = {
  display: "grid",
  gap: 16,
};

const card: CSSProperties = {
  borderRadius: 24,
  padding: 22,
  border: "1px solid rgba(15,23,42,0.08)",
  background: "rgba(255,255,255,0.80)",
  boxShadow: "0 18px 42px rgba(15,23,42,0.06)",
  display: "grid",
  gap: 16,
};

const cardHeader: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 16,
  flexWrap: "wrap",
};

const companyName: CSSProperties = {
  fontSize: 24,
  fontWeight: 900,
  lineHeight: 1.1,
  color: "#0f172a",
};

const companyLocation: CSSProperties = {
  color: "rgba(15,23,42,0.66)",
  fontWeight: 700,
};

const publicBadge: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  height: "fit-content",
  borderRadius: 999,
  padding: "8px 12px",
  background: "rgba(16,185,129,0.10)",
  border: "1px solid rgba(16,185,129,0.18)",
  color: "#059669",
  fontWeight: 800,
};

const metaGrid: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 12,
};

const infoBox: CSSProperties = {
  borderRadius: 16,
  padding: 14,
  background: "rgba(255,255,255,0.86)",
  border: "1px solid rgba(15,23,42,0.08)",
  display: "grid",
  gap: 8,
  boxShadow: "0 10px 24px rgba(15,23,42,0.04)",
};

const infoLabel: CSSProperties = {
  fontSize: 12,
  color: "rgba(15,23,42,0.62)",
  fontWeight: 700,
};

const infoValue: CSSProperties = {
  fontWeight: 800,
  lineHeight: 1.6,
  color: "#0f172a",
  whiteSpace: "pre-wrap",
};

const cardActions: CSSProperties = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
  marginTop: 4,
};

const primaryLinkStyle: CSSProperties = {
  textDecoration: "none",
  color: "#ffffff",
  background: "linear-gradient(135deg, #2563eb, #3b82f6)",
  border: "1px solid rgba(37,99,235,0.16)",
  borderRadius: 16,
  padding: "14px 18px",
  fontWeight: 900,
  display: "inline-flex",
  justifyContent: "center",
  alignItems: "center",
  boxShadow: "0 14px 30px rgba(37,99,235,0.16)",
};

const secondaryLinkStyle: CSSProperties = {
  textDecoration: "none",
  color: "#0f172a",
  background: "rgba(255,255,255,0.78)",
  border: "1px solid rgba(15,23,42,0.08)",
  borderRadius: 16,
  padding: "14px 18px",
  fontWeight: 800,
  display: "inline-flex",
  justifyContent: "center",
  alignItems: "center",
  boxShadow: "0 10px 22px rgba(15,23,42,0.05)",
};