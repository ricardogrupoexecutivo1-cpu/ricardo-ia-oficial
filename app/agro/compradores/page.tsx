"use client";

import Link from "next/link";
import { buildListingWhatsAppUrl } from "@/lib/company-contacts";
import {
  demoListings,
  getDemoCompanyById,
  getDemoContactsByCompanyId,
} from "@/lib/company-contacts-demo";

export default function AgroCompradoresPage() {
  const buyerListings = demoListings.filter(
    (listing) =>
      listing.module === "agro" &&
      listing.category === "compradores" &&
      listing.isActive
  );

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #04110a 0%, #081226 52%, #0a1628 100%)",
        color: "#ffffff",
        padding: "24px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
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
            <span
              style={{
                display: "inline-flex",
                padding: "8px 14px",
                borderRadius: 999,
                background: "rgba(34,197,94,0.14)",
                border: "1px solid rgba(34,197,94,0.35)",
                color: "#bbf7d0",
                fontSize: 13,
                fontWeight: 700,
                marginBottom: 16,
              }}
            >
              Aurora AGRO • Compradores
            </span>

            <h1
              style={{
                margin: "0 0 14px 0",
                fontSize: "clamp(30px, 5vw, 54px)",
                lineHeight: 1.04,
                fontWeight: 900,
              }}
            >
              Compradores do agro em uma área profissional e pronta para negócio
            </h1>

            <p
              style={{
                margin: 0,
                color: "rgba(255,255,255,0.78)",
                fontSize: 18,
                lineHeight: 1.65,
                maxWidth: 760,
              }}
            >
              Agora esta área já está preparada para usar contato por empresa e
              por anúncio, sem depender de número fixo no código.
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
            <div style={heroBadge}>Nova lógica ativa</div>

            <h2
              style={{
                margin: "0 0 12px 0",
                fontSize: 26,
                fontWeight: 800,
              }}
            >
              Página preparada para WhatsApp por anúncio
            </h2>

            <p
              style={{
                margin: 0,
                color: "rgba(255,255,255,0.74)",
                lineHeight: 1.7,
              }}
            >
              Cada card abaixo pode usar um contato diferente conforme a empresa,
              o responsável e a regra definida no anúncio.
            </p>

            <div style={statsGrid}>
              <div style={statCard}>
                <strong style={statNumber}>Sem fixo</strong>
                <span style={statLabel}>no código</span>
              </div>

              <div style={statCard}>
                <strong style={statNumber}>Contato</strong>
                <span style={statLabel}>por anúncio</span>
              </div>

              <div style={statCard}>
                <strong style={statNumber}>Empresa</strong>
                <span style={statLabel}>com vários contatos</span>
              </div>

              <div style={statCard}>
                <strong style={statNumber}>Escala</strong>
                <span style={statLabel}>pronta para banco</span>
              </div>
            </div>
          </div>
        </section>

        <section style={sectionStyle}>
          <div style={sectionHeader}>
            <h2 style={sectionTitle}>Oportunidades para compradores</h2>
            <p style={sectionText}>
              Estes cards já usam a nova base de contatos da plataforma.
            </p>
          </div>

          <div style={cardsGrid}>
            {buyerListings.map((listing) => {
              const company = getDemoCompanyById(listing.companyId);
              const contacts = getDemoContactsByCompanyId(listing.companyId);

              const whatsappHref = buildListingWhatsAppUrl(
                {
                  company,
                  contacts,
                  contactId: listing.contactId,
                  whatsappOverride: listing.whatsappOverride,
                },
                `Olá, tenho interesse no anúncio "${listing.title}" na área de compradores do Aurora AGRO.`
              );

              return (
                <article key={listing.id} style={listingCard}>
                  <div style={listingBadgeRow}>
                    <span style={listingBadge}>{listing.category}</span>
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
        </section>

        <section style={sectionStyle}>
          <div style={sectionHeader}>
            <h2 style={sectionTitle}>Como essa área vai evoluir</h2>
            <p style={sectionText}>
              Esta página já está pronta para receber banco e cadastro real.
            </p>
          </div>

          <div style={cardsGrid}>
            <article style={infoCard}>
              <div style={infoIcon}>1</div>
              <h3 style={infoTitle}>Cadastro por empresa</h3>
              <p style={infoText}>
                Cada empresa vai informar seus próprios contatos e responsáveis.
              </p>
            </article>

            <article style={infoCard}>
              <div style={infoIcon}>2</div>
              <h3 style={infoTitle}>Anúncios independentes</h3>
              <p style={infoText}>
                Cada anúncio poderá apontar para um vendedor, comprador ou
                contato principal.
              </p>
            </article>

            <article style={infoCard}>
              <div style={infoIcon}>3</div>
              <h3 style={infoTitle}>Integração real</h3>
              <p style={infoText}>
                O próximo passo é sair do demo e conectar no Supabase com
                formulários e salvamento real.
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
  minHeight: 48,
  padding: "0 18px",
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

const listingBadgeRow: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
  flexWrap: "wrap",
  marginBottom: 14,
};

const listingBadge: React.CSSProperties = {
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