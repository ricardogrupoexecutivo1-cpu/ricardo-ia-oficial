"use client";

import Link from "next/link";
import {
  buildListingWhatsAppUrl,
  resolveListingContact,
} from "@/lib/company-contacts";
import {
  demoListings,
  getDemoCompanyById,
  getDemoContactsByCompanyId,
} from "@/lib/company-contacts-demo";

export default function AgroDemoContatosPage() {
  const agroListings = demoListings.filter(
    (listing) => listing.module === "agro" && listing.isActive
  );

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #04110a 0%, #081226 45%, #101828 100%)",
        color: "#ffffff",
        padding: "24px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <section
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
            marginBottom: 28,
          }}
        >
          <span
            style={{
              display: "inline-flex",
              width: "fit-content",
              padding: "8px 14px",
              borderRadius: 999,
              background: "rgba(34,197,94,0.14)",
              border: "1px solid rgba(34,197,94,0.35)",
              color: "#bbf7d0",
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            Aurora AGRO • Demo de contatos
          </span>

          <h1
            style={{
              margin: 0,
              fontSize: "clamp(30px, 5vw, 56px)",
              lineHeight: 1.04,
              fontWeight: 900,
            }}
          >
            Teste visual da lógica de WhatsApp por empresa e por anúncio
          </h1>

          <p
            style={{
              margin: 0,
              maxWidth: 860,
              color: "rgba(255,255,255,0.78)",
              fontSize: 18,
              lineHeight: 1.65,
            }}
          >
            Esta página mostra qual contato está sendo usado em cada anúncio do
            AGRO, sem número fixo no código. A prioridade segue a regra da
            plataforma: override do anúncio, contato do anúncio, contato
            principal e WhatsApp da empresa.
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              marginTop: 8,
            }}
          >
            <Link href="/agro" style={secondaryButton}>
              Voltar ao AGRO
            </Link>

            <Link href="/agro/tutorial" style={secondaryButton}>
              Ver tutorial
            </Link>
          </div>
        </section>

        <section style={sectionStyle}>
          <div style={sectionHeader}>
            <h2 style={sectionTitle}>Listagens demo do AGRO</h2>
            <p style={sectionText}>
              Aqui você vê na prática quem receberia o contato de cada anúncio.
            </p>
          </div>

          <div style={cardsGrid}>
            {agroListings.map((listing) => {
              const company = getDemoCompanyById(listing.companyId);
              const contacts = getDemoContactsByCompanyId(listing.companyId);

              const contactInput = {
                company,
                contacts,
                contactId: listing.contactId,
                whatsappOverride: listing.whatsappOverride,
              };

              const resolved = resolveListingContact(contactInput);

              const whatsappHref = buildListingWhatsAppUrl(
                contactInput,
                `Olá, tenho interesse no anúncio "${listing.title}" no módulo AGRO.`
              );

              return (
                <article key={listing.id} style={listingCard}>
                  <div style={listingTopRow}>
                    <span style={moduleBadge}>{listing.category}</span>
                    <span style={statusBadge}>
                      origem: {translateSource(resolved.source)}
                    </span>
                  </div>

                  <h3 style={listingTitle}>{listing.title}</h3>

                  <p style={listingText}>{listing.description}</p>

                  <div style={metaGrid}>
                    <div style={metaCard}>
                      <strong style={metaLabel}>Empresa</strong>
                      <span style={metaValue}>
                        {company?.name ?? "Não informada"}
                      </span>
                    </div>

                    <div style={metaCard}>
                      <strong style={metaLabel}>Cidade</strong>
                      <span style={metaValue}>
                        {listing.city ?? "-"}
                        {listing.state ? ` - ${listing.state}` : ""}
                      </span>
                    </div>

                    <div style={metaCard}>
                      <strong style={metaLabel}>Contato do anúncio</strong>
                      <span style={metaValue}>
                        {resolved.contact?.name ?? "Sem contato específico"}
                      </span>
                    </div>

                    <div style={metaCard}>
                      <strong style={metaLabel}>WhatsApp resolvido</strong>
                      <span style={metaValue}>
                        {resolved.whatsapp ?? "Indisponível"}
                      </span>
                    </div>
                  </div>

                  <div style={logicBox}>
                    <strong style={logicTitle}>Regra aplicada</strong>
                    <p style={logicText}>
                      {getExplanationText(resolved.source, {
                        companyName: company?.name ?? "empresa",
                        contactName: resolved.contact?.name ?? null,
                      })}
                    </p>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 12,
                      marginTop: 18,
                    }}
                  >
                    {whatsappHref ? (
                      <a
                        href={whatsappHref}
                        target="_blank"
                        rel="noreferrer"
                        style={primaryButton}
                      >
                        Testar WhatsApp deste anúncio
                      </a>
                    ) : (
                      <span style={disabledButton}>
                        Sem WhatsApp disponível
                      </span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section style={sectionStyle}>
          <div style={sectionHeader}>
            <h2 style={sectionTitle}>O que essa base resolve</h2>
            <p style={sectionText}>
              Agora a plataforma já está preparada para crescer sem jogar tudo no
              seu número.
            </p>
          </div>

          <div style={cardsGrid}>
            <article style={infoCard}>
              <div style={infoIcon}>1</div>
              <h3 style={infoTitle}>Empresa com vários contatos</h3>
              <p style={infoText}>
                Cada empresa pode ter vendedor, comprador, gerente, suporte ou
                outro responsável.
              </p>
            </article>

            <article style={infoCard}>
              <div style={infoIcon}>2</div>
              <h3 style={infoTitle}>Anúncio com responsável próprio</h3>
              <p style={infoText}>
                Um anúncio pode usar um contato específico ou um WhatsApp
                exclusivo daquele caso.
              </p>
            </article>

            <article style={infoCard}>
              <div style={infoIcon}>3</div>
              <h3 style={infoTitle}>Sem número fixo no código</h3>
              <p style={infoText}>
                A regra deixa a Aurora pronta para operar em múltiplos módulos,
                empresas e equipes.
              </p>
            </article>
          </div>
        </section>

        <section
          style={{
            marginTop: 26,
            padding: 18,
            borderRadius: 18,
            border: "1px solid rgba(255,255,255,0.10)",
            background: "rgba(255,255,255,0.05)",
            color: "rgba(255,255,255,0.72)",
            lineHeight: 1.6,
          }}
        >
          Sistema em constante atualização e expansão. Podem ocorrer momentos de
          instabilidade durante melhorias, ajustes e novos lançamentos.
        </section>
      </div>
    </main>
  );
}

function translateSource(source: "override" | "contact" | "company" | "none") {
  if (source === "override") return "override do anúncio";
  if (source === "contact") return "contato";
  if (source === "company") return "empresa";
  return "sem contato";
}

function getExplanationText(
  source: "override" | "contact" | "company" | "none",
  input: {
    companyName: string;
    contactName: string | null;
  }
) {
  if (source === "override") {
    return "Este anúncio está usando um WhatsApp próprio definido diretamente no anúncio, com prioridade máxima.";
  }

  if (source === "contact") {
    return `Este anúncio está usando o contato ${
      input.contactName ?? "selecionado"
    } da empresa ${input.companyName}.`;
  }

  if (source === "company") {
    return `Este anúncio não tem contato específico, então está usando o WhatsApp principal da empresa ${input.companyName}.`;
  }

  return "Este anúncio não possui contato válido disponível no momento.";
}

const primaryButton: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 48,
  padding: "0 18px",
  borderRadius: 14,
  textDecoration: "none",
  fontWeight: 800,
  color: "#052e16",
  background: "#86efac",
  border: "1px solid rgba(134,239,172,0.7)",
};

const secondaryButton: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 46,
  padding: "0 16px",
  borderRadius: 14,
  textDecoration: "none",
  fontWeight: 700,
  color: "#ffffff",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.12)",
};

const disabledButton: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 48,
  padding: "0 18px",
  borderRadius: 14,
  fontWeight: 700,
  color: "rgba(255,255,255,0.58)",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
};

const sectionStyle: React.CSSProperties = {
  marginTop: 22,
  padding: 22,
  borderRadius: 24,
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
};

const sectionHeader: React.CSSProperties = {
  marginBottom: 18,
};

const sectionTitle: React.CSSProperties = {
  margin: "0 0 8px 0",
  fontSize: 28,
  fontWeight: 800,
};

const sectionText: React.CSSProperties = {
  margin: 0,
  color: "rgba(255,255,255,0.72)",
  lineHeight: 1.6,
};

const cardsGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: 16,
};

const listingCard: React.CSSProperties = {
  padding: 20,
  borderRadius: 22,
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))",
  border: "1px solid rgba(255,255,255,0.10)",
  boxShadow: "0 18px 40px rgba(0,0,0,0.18)",
};

const listingTopRow: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
  flexWrap: "wrap",
  marginBottom: 14,
};

const moduleBadge: React.CSSProperties = {
  display: "inline-flex",
  padding: "8px 12px",
  borderRadius: 999,
  background: "rgba(34,197,94,0.12)",
  border: "1px solid rgba(34,197,94,0.28)",
  color: "#bbf7d0",
  fontSize: 12,
  fontWeight: 700,
  textTransform: "capitalize",
};

const statusBadge: React.CSSProperties = {
  display: "inline-flex",
  padding: "8px 12px",
  borderRadius: 999,
  background: "rgba(59,130,246,0.12)",
  border: "1px solid rgba(59,130,246,0.28)",
  color: "#bfdbfe",
  fontSize: 12,
  fontWeight: 700,
};

const listingTitle: React.CSSProperties = {
  margin: "0 0 10px 0",
  fontSize: 24,
  fontWeight: 800,
  lineHeight: 1.2,
};

const listingText: React.CSSProperties = {
  margin: 0,
  color: "rgba(255,255,255,0.76)",
  lineHeight: 1.65,
};

const metaGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 12,
  marginTop: 18,
};

const metaCard: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
  padding: 14,
  borderRadius: 16,
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.08)",
};

const metaLabel: React.CSSProperties = {
  fontSize: 13,
  color: "rgba(255,255,255,0.64)",
};

const metaValue: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 700,
  color: "#ffffff",
  lineHeight: 1.4,
  wordBreak: "break-word",
};

const logicBox: React.CSSProperties = {
  marginTop: 16,
  padding: 16,
  borderRadius: 18,
  background: "rgba(134,239,172,0.08)",
  border: "1px solid rgba(134,239,172,0.14)",
};

const logicTitle: React.CSSProperties = {
  display: "block",
  marginBottom: 8,
  fontSize: 15,
};

const logicText: React.CSSProperties = {
  margin: 0,
  color: "rgba(255,255,255,0.74)",
  lineHeight: 1.6,
};

const infoCard: React.CSSProperties = {
  padding: 20,
  borderRadius: 20,
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.08)",
};

const infoIcon: React.CSSProperties = {
  width: 42,
  height: 42,
  borderRadius: 12,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 12,
  background: "rgba(34,197,94,0.14)",
  border: "1px solid rgba(34,197,94,0.28)",
  color: "#bbf7d0",
  fontWeight: 800,
};

const infoTitle: React.CSSProperties = {
  margin: "0 0 8px 0",
  fontSize: 20,
  fontWeight: 800,
};

const infoText: React.CSSProperties = {
  margin: 0,
  color: "rgba(255,255,255,0.72)",
  lineHeight: 1.6,
};