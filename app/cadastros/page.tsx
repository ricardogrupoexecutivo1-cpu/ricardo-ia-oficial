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
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(34,197,94,0.16), transparent 20%), linear-gradient(180deg, #03110d 0%, #071712 38%, #030504 100%)",
        color: "#ecfdf5",
        padding: "24px 16px 80px",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gap: 18,
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          <Link href="/" style={navLinkStyle}>
            Voltar à Home
          </Link>
          <Link href="/guardiao" style={navLinkStyle}>
            Ir para o Guardião
          </Link>
          <Link href="/cadastro" style={navLinkStyle}>
            Novo cadastro
          </Link>
          <Link href="/mineracao" style={navLinkStyle}>
            Mineração
          </Link>
        </div>

        <section style={heroCardStyle}>
          <div style={badgeStyle}>Busca pública segura</div>

          <h1
            style={{
              margin: 0,
              fontSize: "clamp(28px, 4vw, 42px)",
              lineHeight: 1.08,
            }}
          >
            Cadastros públicos da Aurora
          </h1>

          <p
            style={{
              margin: 0,
              color: "rgba(236,253,245,0.78)",
              lineHeight: 1.7,
              maxWidth: 980,
            }}
          >
            Esta vitrine mostra apenas cadastros ativos e públicos, com exibição
            segura. Dados pessoais, dados internos e informações sensíveis não são
            expostos nesta área. Estamos em constante atualização e pode haver
            momentos de instabilidade.
          </p>

          <form
            action="/cadastros"
            method="get"
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              marginTop: 4,
            }}
          >
            <input
              type="text"
              name="q"
              defaultValue={rawQuery}
              placeholder="Buscar por empresa, cidade, segmento, produto ou cobertura"
              style={searchInputStyle}
            />

            <button type="submit" style={primaryButtonStyle}>
              Atualizar busca
            </button>
          </form>

          <div
            style={{
              borderRadius: 18,
              padding: "14px 16px",
              background: "rgba(34,197,94,0.10)",
              border: "1px solid rgba(34,197,94,0.20)",
              color: "#d1fae5",
              lineHeight: 1.6,
            }}
          >
            Busca pública segura carregada com sucesso. Apenas dados públicos estão
            sendo exibidos.
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 12,
            }}
          >
            <MiniInfo
              title="Cadastros públicos"
              value={String(companies.length)}
              text="Quantidade total pública carregada."
            />
            <MiniInfo
              title="Resultado da busca"
              value={String(filtered.length)}
              text="Quantidade encontrada com o filtro atual."
            />
            <MiniInfo
              title="Privacidade"
              value="Protegida"
              text="Apenas informações públicas liberadas aparecem aqui."
            />
          </div>
        </section>

        {filtered.length === 0 ? (
          <section style={emptyCardStyle}>
            Nenhum cadastro público encontrado para esta busca.
          </section>
        ) : (
          <section
            style={{
              display: "grid",
              gap: 16,
            }}
          >
            {filtered.map((company) => {
              const publicUrl = `/empresa/${company.slug}`;

              return (
                <article key={company.id} style={cardStyle}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 16,
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ display: "grid", gap: 8 }}>
                      <div
                        style={{
                          fontSize: 24,
                          fontWeight: 900,
                          lineHeight: 1.1,
                        }}
                      >
                        {company.publicName}
                      </div>

                      <div
                        style={{
                          color: "rgba(236,253,245,0.74)",
                          fontWeight: 700,
                        }}
                      >
                        {[company.city, company.state].filter(Boolean).join(" • ") ||
                          "Localidade não informada"}
                      </div>
                    </div>

                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        height: "fit-content",
                        borderRadius: 999,
                        padding: "8px 12px",
                        background: "rgba(34,197,94,0.10)",
                        border: "1px solid rgba(34,197,94,0.20)",
                        color: "#86efac",
                        fontWeight: 800,
                      }}
                    >
                      Público
                    </div>
                  </div>

                  <div style={metaGridStyle}>
                    <InfoBox label="Cobertura" value={company.coverage || "Não informado"} />
                    <InfoBox label="Atendimento" value={company.serviceMode || "Não informado"} />
                    <InfoBox label="Estado-base" value={company.state || "-"} />
                    <InfoBox label="Cidade-base" value={company.city || "-"} />
                    <InfoBox label="Segmentos" value={company.segment || "Não informado"} />
                    <InfoBox
                      label="Descrição pública"
                      value={
                        company.publicDescription ||
                        "Sem descrição pública ainda."
                      }
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      flexWrap: "wrap",
                      marginTop: 4,
                    }}
                  >
                    <Link href={publicUrl} style={primaryLinkButtonStyle}>
                      Ver perfil público
                    </Link>

                    <a
                      href={publicUrl}
                      style={secondaryLinkButtonStyle}
                    >
                      Copiar/abrir link
                    </a>

                    {company.whatsapp ? (
                      <a
                        href={`https://wa.me/${company.whatsapp.replace(/\D+/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        style={secondaryLinkButtonStyle}
                      >
                        Falar no WhatsApp
                      </a>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}

function MiniInfo({
  title,
  value,
  text,
}: {
  title: string;
  value: string;
  text: string;
}) {
  return (
    <div
      style={{
        borderRadius: 18,
        padding: 16,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div style={{ fontSize: 12, color: "rgba(236,253,245,0.62)" }}>{title}</div>
      <div
        style={{
          marginTop: 8,
          fontSize: 24,
          fontWeight: 900,
          color: "#ecfdf5",
        }}
      >
        {value}
      </div>
      <div
        style={{
          marginTop: 8,
          color: "rgba(236,253,245,0.70)",
          lineHeight: 1.6,
          fontSize: 14,
        }}
      >
        {text}
      </div>
    </div>
  );
}

function InfoBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        borderRadius: 16,
        padding: 14,
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
        display: "grid",
        gap: 8,
      }}
    >
      <div
        style={{
          fontSize: 12,
          color: "rgba(236,253,245,0.62)",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontWeight: 800,
          lineHeight: 1.6,
          color: "#ecfdf5",
          whiteSpace: "pre-wrap",
        }}
      >
        {value}
      </div>
    </div>
  );
}

const navLinkStyle: React.CSSProperties = {
  textDecoration: "none",
  color: "#ecfdf5",
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.04)",
  borderRadius: 12,
  padding: "10px 14px",
  fontWeight: 700,
};

const heroCardStyle: React.CSSProperties = {
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(7,18,13,0.82)",
  borderRadius: 28,
  padding: "24px 20px",
  boxShadow: "0 18px 60px rgba(0,0,0,0.20)",
  display: "grid",
  gap: 16,
};

const badgeStyle: React.CSSProperties = {
  display: "inline-flex",
  width: "fit-content",
  alignItems: "center",
  gap: 8,
  padding: "8px 12px",
  borderRadius: 999,
  background: "rgba(34,197,94,0.10)",
  border: "1px solid rgba(34,197,94,0.26)",
  color: "#86efac",
  fontSize: 13,
  fontWeight: 800,
};

const searchInputStyle: React.CSSProperties = {
  flex: 1,
  minWidth: 260,
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.04)",
  color: "#ecfdf5",
  padding: "14px 16px",
  fontSize: 15,
  outline: "none",
};

const primaryButtonStyle: React.CSSProperties = {
  borderRadius: 16,
  border: "1px solid rgba(34,197,94,0.28)",
  background: "linear-gradient(135deg, #22c55e, #4ade80)",
  color: "#04110a",
  padding: "14px 18px",
  fontWeight: 900,
  cursor: "pointer",
};

const emptyCardStyle: React.CSSProperties = {
  borderRadius: 24,
  padding: 22,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(7,18,13,0.78)",
  color: "rgba(236,253,245,0.82)",
};

const cardStyle: React.CSSProperties = {
  borderRadius: 24,
  padding: 22,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(7,18,13,0.78)",
  boxShadow: "0 18px 60px rgba(0,0,0,0.16)",
  display: "grid",
  gap: 16,
};

const metaGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 12,
};

const primaryLinkButtonStyle: React.CSSProperties = {
  textDecoration: "none",
  color: "#04110a",
  background: "linear-gradient(135deg, #22c55e, #4ade80)",
  border: "1px solid rgba(34,197,94,0.28)",
  borderRadius: 16,
  padding: "14px 18px",
  fontWeight: 900,
  display: "inline-flex",
  justifyContent: "center",
  alignItems: "center",
};

const secondaryLinkButtonStyle: React.CSSProperties = {
  textDecoration: "none",
  color: "#ecfdf5",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.10)",
  borderRadius: 16,
  padding: "14px 18px",
  fontWeight: 800,
  display: "inline-flex",
  justifyContent: "center",
  alignItems: "center",
};