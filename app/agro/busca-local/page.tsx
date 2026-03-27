import Link from "next/link";
import {
  buildListingWhatsAppUrl,
  resolveListingContact,
} from "@/lib/company-contacts";
import {
  calculateLocationScore,
  compareListingsByLocationScore,
} from "@/lib/aurora-location";
import { getAgroListings } from "@/lib/server/get-agro-listings";

const SEARCH_LOCATION = {
  city: "Belo Horizonte",
  state: "MG",
  latitude: -19.9167,
  longitude: -43.9345,
};

export default async function AgroBuscaLocalPage() {
  const dbListings = await getAgroListings();

  const agroListings = dbListings
    .map((listing) => {
      const locationScore = calculateLocationScore(
        listing.location,
        listing.coverage,
        SEARCH_LOCATION
      );

      const resolvedContact = resolveListingContact({
        company: listing.company,
        contacts: listing.contacts,
        contactId: listing.contactId,
        whatsappOverride: listing.whatsappOverride,
      });

      const whatsappHref = buildListingWhatsAppUrl(
        {
          company: listing.company,
          contacts: listing.contacts,
          contactId: listing.contactId,
          whatsappOverride: listing.whatsappOverride,
        },
        `Olá, tenho interesse no anúncio "${listing.title}" no AGRO.`
      );

      return {
        listing,
        locationScore,
        resolvedContact,
        whatsappHref,
      };
    })
    .sort((a, b) =>
      compareListingsByLocationScore(a.locationScore, b.locationScore)
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
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 24,
            alignItems: "center",
            marginBottom: 28,
          }}
        >
          <div>
            <span style={topBadge}>Aurora AGRO • Busca local</span>

            <h1
              style={{
                margin: "0 0 14px 0",
                fontSize: "clamp(30px, 5vw, 56px)",
                lineHeight: 1.04,
                fontWeight: 900,
              }}
            >
              Busca por proximidade, cobertura e relevância
            </h1>

            <p
              style={{
                margin: 0,
                maxWidth: 820,
                color: "rgba(255,255,255,0.78)",
                fontSize: 18,
                lineHeight: 1.65,
              }}
            >
              Esta página agora lê dados reais do banco do AGRO, priorizando
              cidade e estado, mas sem perder fornecedores com boa cobertura,
              entrega e atendimento nacional.
            </p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
                marginTop: 24,
              }}
            >
              <Link href="/agro" style={secondaryButton}>
                Voltar ao AGRO
              </Link>

              <Link href="/agro/demo-contatos" style={secondaryButton}>
                Ver demo de contatos
              </Link>
            </div>
          </div>

          <div style={heroCard}>
            <div style={heroBadge}>Busca real</div>

            <h2
              style={{
                margin: "0 0 12px 0",
                fontSize: 26,
                fontWeight: 800,
              }}
            >
              Resultado ordenado a partir de Belo Horizonte - MG
            </h2>

            <p
              style={{
                margin: 0,
                color: "rgba(255,255,255,0.74)",
                lineHeight: 1.7,
              }}
            >
              A lógica abaixo usa cidade, estado, raio, cobertura, entrega e
              retirada para organizar os resultados reais do banco do mais
              relevante para o menos relevante.
            </p>

            <div style={statsGrid}>
              <div style={statCard}>
                <strong style={statNumber}>{SEARCH_LOCATION.city}</strong>
                <span style={statLabel}>cidade base</span>
              </div>

              <div style={statCard}>
                <strong style={statNumber}>{SEARCH_LOCATION.state}</strong>
                <span style={statLabel}>estado base</span>
              </div>

              <div style={statCard}>
                <strong style={statNumber}>Brasil</strong>
                <span style={statLabel}>cobertura possível</span>
              </div>

              <div style={statCard}>
                <strong style={statNumber}>{agroListings.length}</strong>
                <span style={statLabel}>resultados reais</span>
              </div>
            </div>
          </div>
        </section>

        <section style={sectionStyle}>
          <div style={sectionHeader}>
            <h2 style={sectionTitle}>Resultados ordenados</h2>
            <p style={sectionText}>
              O ranking mistura proximidade, cobertura e capacidade de atender.
            </p>
          </div>

          {agroListings.length === 0 ? (
            <div style={emptyState}>
              Nenhum anúncio ativo do AGRO foi encontrado no banco ainda.
            </div>
          ) : (
            <div style={cardsGrid}>
              {agroListings.map((item, index) => {
                const { listing, locationScore, resolvedContact, whatsappHref } =
                  item;

                return (
                  <article key={listing.id} style={listingCard}>
                    <div style={listingTopRow}>
                      <div
                        style={{ display: "flex", gap: 10, flexWrap: "wrap" }}
                      >
                        <span style={positionBadge}>#{index + 1}</span>
                        <span style={categoryBadge}>{listing.category}</span>
                        <span style={coverageBadge}>
                          {translateCoverage(listing.coverage.coverageType)}
                        </span>
                      </div>

                      <span style={scoreBadge}>
                        score: {locationScore.score}
                      </span>
                    </div>

                    <h3 style={listingTitle}>{listing.title}</h3>

                    <p style={listingText}>
                      {listing.description ?? "Sem descrição informada."}
                    </p>

                    <div style={metaGrid}>
                      <div style={metaCard}>
                        <strong style={metaLabel}>Empresa</strong>
                        <span style={metaValue}>
                          {listing.company?.name ?? "Não informada"}
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
                        <strong style={metaLabel}>Distância estimada</strong>
                        <span style={metaValue}>
                          {typeof locationScore.distanceKm === "number"
                            ? `${locationScore.distanceKm} km`
                            : "Não calculada"}
                        </span>
                      </div>

                      <div style={metaCard}>
                        <strong style={metaLabel}>Origem do contato</strong>
                        <span style={metaValue}>
                          {translateContactSource(resolvedContact.source)}
                        </span>
                      </div>
                    </div>

                    <div style={logicBox}>
                      <strong style={logicTitle}>Leitura da busca</strong>
                      <p style={logicText}>
                        {buildRankingExplanation({
                          sameCity: locationScore.sameCity,
                          sameState: locationScore.sameState,
                          coverageMatch: locationScore.coverageMatch,
                          distanceKm: locationScore.distanceKm,
                          coverageType: listing.coverage.coverageType,
                          deliveryAvailable:
                            listing.coverage.deliveryAvailable ?? false,
                          pickupAvailable:
                            listing.coverage.pickupAvailable ?? false,
                        })}
                      </p>
                    </div>

                    <div style={featureRow}>
                      <span style={featureChip}>
                        entrega:{" "}
                        {listing.coverage.deliveryAvailable ? "sim" : "não"}
                      </span>
                      <span style={featureChip}>
                        retirada:{" "}
                        {listing.coverage.pickupAvailable ? "sim" : "não"}
                      </span>
                      <span style={featureChip}>
                        contato:{" "}
                        {resolvedContact.contact?.name ?? "empresa/override"}
                      </span>
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
                          Chamar no WhatsApp
                        </a>
                      ) : (
                        <span style={disabledButton}>
                          Contato indisponível
                        </span>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section style={sectionStyle}>
          <div style={sectionHeader}>
            <h2 style={sectionTitle}>Leitura estratégica por módulo</h2>
            <p style={sectionText}>
              A mesma base pode servir AGRO, locadoras e imóveis com pesos
              diferentes.
            </p>
          </div>

          <div style={cardsGrid}>
            <article style={infoCard}>
              <div style={infoIcon}>1</div>
              <h3 style={infoTitle}>AGRO</h3>
              <p style={infoText}>
                Pode operar em nível Brasil, priorizando proximidade, mas ainda
                aceitando entrega e cobertura nacional.
              </p>
            </article>

            <article style={infoCard}>
              <div style={infoIcon}>2</div>
              <h3 style={infoTitle}>Locadoras</h3>
              <p style={infoText}>
                Mais foco em cidade, região e estado, com expansão controlada
                para compras, frota e seminovos.
              </p>
            </article>

            <article style={infoCard}>
              <div style={infoIcon}>3</div>
              <h3 style={infoTitle}>Imóveis</h3>
              <p style={infoText}>
                Muito mais localizados, com peso forte em cidade, bairro e raio
                próximo do interessado.
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

function translateCoverage(
  coverageType: "local" | "regional" | "state" | "national"
) {
  if (coverageType === "local") return "local";
  if (coverageType === "regional") return "regional";
  if (coverageType === "state") return "estadual";
  return "nacional";
}

function translateContactSource(
  source: "override" | "contact" | "company" | "none"
) {
  if (source === "override") return "override do anúncio";
  if (source === "contact") return "contato específico";
  if (source === "company") return "WhatsApp da empresa";
  return "sem contato";
}

function buildRankingExplanation(input: {
  sameCity: boolean;
  sameState: boolean;
  coverageMatch: boolean;
  distanceKm: number | null;
  coverageType: "local" | "regional" | "state" | "national";
  deliveryAvailable: boolean;
  pickupAvailable: boolean;
}) {
  const parts: string[] = [];

  if (input.sameCity) {
    parts.push("Está na mesma cidade da busca.");
  } else if (input.sameState) {
    parts.push("Está no mesmo estado da busca.");
  } else {
    parts.push("Está fora da base local imediata.");
  }

  if (typeof input.distanceKm === "number") {
    parts.push(`Distância estimada de ${input.distanceKm} km.`);
  }

  if (input.coverageMatch) {
    parts.push(
      `A cobertura ${translateCoverage(input.coverageType)} atende a busca.`
    );
  } else {
    parts.push(
      `A cobertura ${translateCoverage(
        input.coverageType
      )} tem aderência menor para esta busca.`
    );
  }

  if (input.deliveryAvailable) {
    parts.push("Possui entrega disponível.");
  }

  if (input.pickupAvailable) {
    parts.push("Permite retirada.");
  }

  return parts.join(" ");
}

const topBadge: React.CSSProperties = {
  display: "inline-flex",
  width: "fit-content",
  padding: "8px 14px",
  borderRadius: 999,
  background: "rgba(34,197,94,0.14)",
  border: "1px solid rgba(34,197,94,0.35)",
  color: "#bbf7d0",
  fontSize: 13,
  fontWeight: 700,
};

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

const heroCard: React.CSSProperties = {
  padding: 24,
  borderRadius: 24,
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04))",
  border: "1px solid rgba(255,255,255,0.10)",
  boxShadow: "0 18px 40px rgba(0,0,0,0.22)",
};

const heroBadge: React.CSSProperties = {
  display: "inline-flex",
  marginBottom: 14,
  padding: "8px 12px",
  borderRadius: 999,
  background: "rgba(34,197,94,0.12)",
  border: "1px solid rgba(34,197,94,0.28)",
  color: "#bbf7d0",
  fontSize: 12,
  fontWeight: 700,
};

const statsGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 12,
  marginTop: 20,
};

const statCard: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
  padding: 14,
  borderRadius: 16,
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.08)",
};

const statNumber: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 800,
};

const statLabel: React.CSSProperties = {
  color: "rgba(255,255,255,0.68)",
  fontSize: 13,
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

const emptyState: React.CSSProperties = {
  padding: 20,
  borderRadius: 18,
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "rgba(255,255,255,0.72)",
};

const cardsGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
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

const positionBadge: React.CSSProperties = {
  display: "inline-flex",
  padding: "8px 12px",
  borderRadius: 999,
  background: "rgba(250,204,21,0.14)",
  border: "1px solid rgba(250,204,21,0.28)",
  color: "#fde68a",
  fontSize: 12,
  fontWeight: 800,
};

const categoryBadge: React.CSSProperties = {
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

const coverageBadge: React.CSSProperties = {
  display: "inline-flex",
  padding: "8px 12px",
  borderRadius: 999,
  background: "rgba(59,130,246,0.12)",
  border: "1px solid rgba(59,130,246,0.28)",
  color: "#bfdbfe",
  fontSize: 12,
  fontWeight: 700,
};

const scoreBadge: React.CSSProperties = {
  display: "inline-flex",
  padding: "8px 12px",
  borderRadius: 999,
  background: "rgba(168,85,247,0.12)",
  border: "1px solid rgba(168,85,247,0.28)",
  color: "#ddd6fe",
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

const featureRow: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 10,
  marginTop: 16,
};

const featureChip: React.CSSProperties = {
  display: "inline-flex",
  padding: "8px 12px",
  borderRadius: 999,
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "rgba(255,255,255,0.78)",
  fontSize: 12,
  fontWeight: 700,
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