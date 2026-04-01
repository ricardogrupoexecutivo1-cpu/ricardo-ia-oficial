import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicCompanyBySlug, getPublicCompanies } from "@/lib/public-company";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function buildTitle(name: string, city?: string | null, state?: string | null) {
  const location = [city, state].filter(Boolean).join(" - ");
  return location ? `${name} em ${location} | Aurora` : `${name} | Aurora`;
}

function buildDescription(input: {
  publicName: string;
  publicDescription?: string | null;
  city?: string | null;
  state?: string | null;
  coverage?: string | null;
  segment?: string | null;
}) {
  const parts = [
    input.publicDescription?.trim(),
    input.segment ? `Segmento: ${input.segment}.` : null,
    input.city || input.state
      ? `Localização: ${[input.city, input.state].filter(Boolean).join(" - ")}.`
      : null,
    input.coverage ? `Cobertura: ${input.coverage}.` : null,
  ].filter(Boolean);

  const fallback = `${input.publicName} na Aurora. Perfil público com informações seguras para apresentação, contato e divulgação.`;

  return parts.length ? parts.join(" ") : fallback;
}

function normalizeUrl(url: string | null) {
  if (!url) return null;

  const trimmed = url.trim();
  if (!trimmed) return null;

  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("mailto:") ||
    trimmed.startsWith("tel:")
  ) {
    return trimmed;
  }

  if (trimmed.startsWith("@")) {
    return `https://instagram.com/${trimmed.replace(/^@/, "")}`;
  }

  if (trimmed.includes(".") && !trimmed.includes(" ")) {
    return `https://${trimmed}`;
  }

  return trimmed;
}

function formatWhatsappLink(value: string | null) {
  if (!value) return null;

  const digits = value.replace(/\D+/g, "");
  if (!digits) return null;

  return `https://wa.me/${digits}`;
}

function formatInstagramLabel(value: string | null) {
  if (!value) return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  return trimmed.startsWith("@") ? trimmed : `@${trimmed}`;
}

function getDisplayDescription(company: {
  publicDescription?: string | null;
  segment?: string | null;
  coverage?: string | null;
  city?: string | null;
  state?: string | null;
}) {
  if (company.publicDescription?.trim()) {
    return company.publicDescription.trim();
  }

  const details = [
    company.segment ? `segmento ${company.segment}` : null,
    company.coverage ? `cobertura ${company.coverage}` : null,
    company.city || company.state
      ? `base em ${[company.city, company.state].filter(Boolean).join(" - ")}`
      : null,
  ].filter(Boolean);

  if (details.length) {
    return `Perfil público publicado na Aurora com ${details.join(", ")}.`;
  }

  return "Este perfil público foi publicado na Aurora com foco em apresentação profissional, contato e divulgação segura.";
}

export async function generateStaticParams() {
  try {
    const companies = await getPublicCompanies();

    return companies.map((company) => ({
      slug: company.slug,
    }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const company = await getPublicCompanyBySlug(resolvedParams.slug);

  if (!company) {
    return {
      title: "Empresa não encontrada | Aurora",
      description: "A página pública solicitada não foi encontrada.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = buildTitle(company.publicName, company.city, company.state);
  const description = buildDescription(company);

  return {
    title,
    description,
    alternates: {
      canonical: `/empresa/${company.slug}`,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `/empresa/${company.slug}`,
      images: company.heroImageUrl
        ? [
            {
              url: company.heroImageUrl,
              alt: company.publicName,
            },
          ]
        : company.logoUrl
          ? [
              {
                url: company.logoUrl,
                alt: company.publicName,
              },
            ]
          : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: company.heroImageUrl
        ? [company.heroImageUrl]
        : company.logoUrl
          ? [company.logoUrl]
          : [],
    },
  };
}

export default async function PublicCompanyPage({ params }: PageProps) {
  const resolvedParams = await params;
  const company = await getPublicCompanyBySlug(resolvedParams.slug);

  if (!company) {
    notFound();
  }

  const title = buildTitle(company.publicName, company.city, company.state);
  const description = buildDescription(company);
  const displayDescription = getDisplayDescription(company);
  const websiteHref = normalizeUrl(company.website);
  const instagramHref = normalizeUrl(company.instagram);
  const whatsappHref = formatWhatsappLink(company.whatsapp);
  const instagramLabel = formatInstagramLabel(company.instagram);

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(34,197,94,0.16), transparent 26%), #050816",
        color: "#e5eef8",
        padding: "32px 16px 80px",
      }}
    >
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            marginBottom: 18,
          }}
        >
          <Link
            href="/"
            style={{
              textDecoration: "none",
              color: "#93c5fd",
              border: "1px solid rgba(147,197,253,0.24)",
              borderRadius: 999,
              padding: "10px 14px",
            }}
          >
            Voltar à Home
          </Link>

          <Link
            href="/cadastros"
            style={{
              textDecoration: "none",
              color: "#86efac",
              border: "1px solid rgba(134,239,172,0.24)",
              borderRadius: 999,
              padding: "10px 14px",
            }}
          >
            Ver cadastros
          </Link>
        </div>

        <section
          style={{
            borderRadius: 28,
            overflow: "hidden",
            border: "1px solid rgba(148,163,184,0.18)",
            background: "rgba(15,23,42,0.82)",
            boxShadow: "0 20px 80px rgba(0,0,0,0.34)",
          }}
        >
          <div
            style={{
              minHeight: 220,
              padding: 28,
              background: company.heroImageUrl
                ? `linear-gradient(rgba(2,6,23,0.55), rgba(2,6,23,0.85)), url(${company.heroImageUrl}) center/cover`
                : "linear-gradient(135deg, rgba(34,197,94,0.18), rgba(59,130,246,0.22), rgba(15,23,42,1))",
              display: "flex",
              alignItems: "flex-end",
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  borderRadius: 999,
                  padding: "8px 12px",
                  background: "rgba(15,23,42,0.55)",
                  border: "1px solid rgba(148,163,184,0.22)",
                  color: "#86efac",
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: 0.3,
                  marginBottom: 14,
                }}
              >
                Perfil público Aurora
              </div>

              <h1
                style={{
                  fontSize: "clamp(32px, 5vw, 48px)",
                  lineHeight: 1.05,
                  margin: 0,
                }}
              >
                {company.publicName}
              </h1>

              <p
                style={{
                  color: "#dbeafe",
                  marginTop: 12,
                  marginBottom: 0,
                  maxWidth: 840,
                  fontSize: 16,
                  lineHeight: 1.6,
                }}
              >
                {description}
              </p>
            </div>
          </div>

          <div
            style={{
              padding: 24,
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.2fr) minmax(300px, 0.8fr)",
              gap: 20,
            }}
          >
            <div
              style={{
                display: "grid",
                gap: 18,
              }}
            >
              <article
                style={{
                  borderRadius: 22,
                  border: "1px solid rgba(148,163,184,0.16)",
                  background: "rgba(15,23,42,0.72)",
                  padding: 22,
                }}
              >
                <h2 style={{ marginTop: 0, fontSize: 22 }}>Apresentação</h2>

                <p
                  style={{
                    margin: 0,
                    color: "#cbd5e1",
                    fontSize: 16,
                    lineHeight: 1.7,
                  }}
                >
                  {displayDescription}
                </p>
              </article>

              <article
                style={{
                  borderRadius: 22,
                  border: "1px solid rgba(148,163,184,0.16)",
                  background: "rgba(15,23,42,0.72)",
                  padding: 22,
                }}
              >
                <h2 style={{ marginTop: 0, fontSize: 22 }}>Informações públicas</h2>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: 14,
                  }}
                >
                  <InfoCard label="Cidade" value={company.city || "Não informado"} />
                  <InfoCard label="Estado" value={company.state || "Não informado"} />
                  <InfoCard label="Cobertura" value={company.coverage || "Não informado"} />
                  <InfoCard label="Segmento" value={company.segment || "Não informado"} />
                  <InfoCard label="Atendimento" value={company.serviceMode || "Não informado"} />
                  <InfoCard
                    label="Atualizado em"
                    value={
                      company.updatedAt
                        ? new Date(company.updatedAt).toLocaleDateString("pt-BR")
                        : "Não informado"
                    }
                  />
                </div>
              </article>
            </div>

            <aside
              style={{
                display: "grid",
                gap: 18,
                alignContent: "start",
              }}
            >
              <article
                style={{
                  borderRadius: 22,
                  border: "1px solid rgba(148,163,184,0.16)",
                  background: "rgba(15,23,42,0.72)",
                  padding: 22,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    marginBottom: 18,
                  }}
                >
                  <div
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: 20,
                      overflow: "hidden",
                      background: "rgba(2,6,23,0.6)",
                      border: "1px solid rgba(148,163,184,0.16)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {company.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={company.logoUrl}
                        alt={company.publicName}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <span style={{ fontWeight: 800, fontSize: 24 }}>
                        {company.publicName.slice(0, 1).toUpperCase()}
                      </span>
                    )}
                  </div>

                  <div>
                    <div style={{ fontSize: 12, color: "#94a3b8" }}>
                      Perfil público
                    </div>
                    <div
                      style={{
                        marginTop: 4,
                        fontWeight: 800,
                        fontSize: 20,
                      }}
                    >
                      {company.publicName}
                    </div>
                    <div style={{ marginTop: 6, color: "#cbd5e1", fontSize: 14 }}>
                      {title}
                    </div>
                  </div>
                </div>

                <div style={{ display: "grid", gap: 12 }}>
                  {whatsappHref ? (
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        textDecoration: "none",
                        borderRadius: 999,
                        padding: "14px 18px",
                        textAlign: "center",
                        fontWeight: 900,
                        background:
                          "linear-gradient(90deg, rgba(34,197,94,1) 0%, rgba(59,130,246,1) 100%)",
                        color: "#04111f",
                      }}
                    >
                      Falar no WhatsApp
                    </a>
                  ) : null}

                  {websiteHref ? (
                    <a
                      href={websiteHref}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        textDecoration: "none",
                        borderRadius: 999,
                        padding: "14px 18px",
                        textAlign: "center",
                        fontWeight: 800,
                        background: "transparent",
                        border: "1px solid rgba(148,163,184,0.24)",
                        color: "#e5eef8",
                      }}
                    >
                      Acessar site
                    </a>
                  ) : null}

                  {instagramHref ? (
                    <a
                      href={instagramHref}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        textDecoration: "none",
                        borderRadius: 999,
                        padding: "14px 18px",
                        textAlign: "center",
                        fontWeight: 800,
                        background: "transparent",
                        border: "1px solid rgba(148,163,184,0.24)",
                        color: "#e5eef8",
                      }}
                    >
                      Instagram {instagramLabel ? `• ${instagramLabel}` : ""}
                    </a>
                  ) : null}
                </div>
              </article>

              <article
                style={{
                  borderRadius: 22,
                  border: "1px solid rgba(148,163,184,0.16)",
                  background: "rgba(15,23,42,0.72)",
                  padding: 22,
                }}
              >
                <h2 style={{ marginTop: 0, fontSize: 20 }}>Privacidade por padrão</h2>

                <p
                  style={{
                    marginBottom: 0,
                    color: "#cbd5e1",
                    lineHeight: 1.7,
                  }}
                >
                  Esta página exibe apenas informações públicas liberadas no
                  cadastro. Dados pessoais e dados sensíveis permanecem protegidos.
                </p>
              </article>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        borderRadius: 18,
        padding: 16,
        background: "rgba(2,6,23,0.45)",
        border: "1px solid rgba(148,163,184,0.12)",
      }}
    >
      <div style={{ fontSize: 12, color: "#94a3b8" }}>{label}</div>
      <div style={{ marginTop: 6, fontWeight: 700 }}>{value}</div>
    </div>
  );
}