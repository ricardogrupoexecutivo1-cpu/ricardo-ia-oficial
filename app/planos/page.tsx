"use client";

import Link from "next/link";
import { CSSProperties } from "react";
import { PLAN_ORDER, PLANS } from "@/lib/plans";

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  padding: "24px 16px 110px",
  color: "#ecfff5",
  background:
    "radial-gradient(circle at top, rgba(0,208,132,0.12), transparent 32%), linear-gradient(180deg, #04110d 0%, #071a14 52%, #04110d 100%)",
};

const shellStyle: CSSProperties = {
  width: "100%",
  maxWidth: "1120px",
  margin: "0 auto",
};

const heroStyle: CSSProperties = {
  borderRadius: "28px",
  border: "1px solid rgba(0,208,132,0.16)",
  padding: "28px",
  background:
    "radial-gradient(circle at top right, rgba(0,208,132,0.12), transparent 30%), radial-gradient(circle at bottom left, rgba(48,194,255,0.10), transparent 28%), linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.03))",
  boxShadow:
    "0 24px 60px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.04)",
};

const badgeStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  minHeight: "34px",
  padding: "0 14px",
  borderRadius: "999px",
  border: "1px solid rgba(0,208,132,0.28)",
  background: "rgba(0,208,132,0.08)",
  color: "#9effcf",
  fontSize: "0.82rem",
  fontWeight: 800,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
};

const heroGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1.2fr 0.8fr",
  gap: "20px",
  marginTop: "20px",
  alignItems: "end",
};

const titleStyle: CSSProperties = {
  margin: 0,
  maxWidth: "760px",
  fontSize: "clamp(2rem, 5vw, 4.2rem)",
  lineHeight: 0.98,
  letterSpacing: "-0.04em",
  fontWeight: 800,
};

const subtitleStyle: CSSProperties = {
  margin: "16px 0 0",
  maxWidth: "760px",
  color: "rgba(236,255,245,0.74)",
  fontSize: "1.02rem",
  lineHeight: 1.75,
};

const ctaRowStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "12px",
  marginTop: "24px",
};

const primaryButtonStyle: CSSProperties = {
  minHeight: "52px",
  padding: "0 18px",
  borderRadius: "18px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 800,
  textDecoration: "none",
  color: "#04110d",
  background: "linear-gradient(135deg, #75ffbf 0%, #00d084 100%)",
  boxShadow: "0 18px 40px rgba(0,208,132,0.2)",
};

const secondaryButtonStyle: CSSProperties = {
  minHeight: "52px",
  padding: "0 18px",
  borderRadius: "18px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 800,
  textDecoration: "none",
  color: "#ecfff5",
  border: "1px solid rgba(0,208,132,0.22)",
  background: "rgba(255,255,255,0.04)",
};

const sideCardsStyle: CSSProperties = {
  display: "grid",
  gap: "12px",
};

const miniCardStyle: CSSProperties = {
  padding: "16px",
  borderRadius: "22px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(0,208,132,0.12)",
  boxShadow:
    "0 20px 40px rgba(0,0,0,0.16), inset 0 1px 0 rgba(255,255,255,0.03)",
};

const miniCardTitleStyle: CSSProperties = {
  color: "#9effcf",
  fontSize: "0.92rem",
  fontWeight: 800,
};

const miniCardTextStyle: CSSProperties = {
  margin: "8px 0 0",
  color: "rgba(236,255,245,0.7)",
  fontSize: "0.94rem",
  lineHeight: 1.65,
};

const cardsGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: "16px",
  marginTop: "26px",
};

const cardBaseStyle: CSSProperties = {
  borderRadius: "28px",
  padding: "22px",
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))",
  border: "1px solid rgba(0,208,132,0.14)",
  boxShadow:
    "0 20px 50px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.03)",
};

const featuredCardStyle: CSSProperties = {
  borderColor: "rgba(0,208,132,0.34)",
  background:
    "radial-gradient(circle at top, rgba(0,208,132,0.14), transparent 40%), linear-gradient(180deg, rgba(0,208,132,0.10), rgba(255,255,255,0.03))",
  boxShadow:
    "0 22px 56px rgba(0,0,0,0.22), 0 0 40px rgba(0,208,132,0.12), inset 0 1px 0 rgba(255,255,255,0.04)",
};

const cardTopStyle: CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: "12px",
};

const cardLabelStyle: CSSProperties = {
  margin: 0,
  color: "rgba(236,255,245,0.48)",
  fontSize: "0.76rem",
  fontWeight: 800,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
};

const cardNameStyle: CSSProperties = {
  margin: "10px 0 0",
  fontSize: "2rem",
  fontWeight: 800,
  letterSpacing: "-0.03em",
};

const pillBaseStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  minHeight: "30px",
  padding: "0 12px",
  borderRadius: "999px",
  fontSize: "0.72rem",
  fontWeight: 800,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(255,255,255,0.08)",
};

const pillFeaturedStyle: CSSProperties = {
  color: "#04110d",
  background: "linear-gradient(135deg, #75ffbf 0%, #00d084 100%)",
  border: "none",
};

const priceStyle: CSSProperties = {
  marginTop: "24px",
  fontSize: "2.4rem",
  fontWeight: 800,
  letterSpacing: "-0.04em",
};

const priceHintStyle: CSSProperties = {
  marginTop: "8px",
  color: "rgba(236,255,245,0.58)",
  fontSize: "0.92rem",
};

const descriptionStyle: CSSProperties = {
  margin: "18px 0 0",
  color: "rgba(236,255,245,0.74)",
  lineHeight: 1.75,
  fontSize: "0.96rem",
};

const dividerStyle: CSSProperties = {
  height: "1px",
  margin: "18px 0",
  background:
    "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)",
};

const featuresStyle: CSSProperties = {
  listStyle: "none",
  padding: 0,
  margin: 0,
};

const featureItemStyle: CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: "10px",
  marginTop: "12px",
  color: "rgba(236,255,245,0.88)",
  lineHeight: 1.6,
};

const dotBaseStyle: CSSProperties = {
  width: "10px",
  height: "10px",
  borderRadius: "999px",
  marginTop: "7px",
  background: "rgba(255,255,255,0.7)",
  flex: "0 0 auto",
};

const dotFeaturedStyle: CSSProperties = {
  background: "#75ffbf",
};

const cardButtonBaseStyle: CSSProperties = {
  width: "100%",
  marginTop: "22px",
  minHeight: "52px",
  padding: "0 18px",
  borderRadius: "18px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 800,
  textDecoration: "none",
  color: "#ecfff5",
  border: "1px solid rgba(0,208,132,0.22)",
  background: "rgba(255,255,255,0.05)",
  boxSizing: "border-box",
};

const cardButtonFeaturedStyle: CSSProperties = {
  color: "#04110d",
  border: "none",
  background: "linear-gradient(135deg, #75ffbf 0%, #00d084 100%)",
  boxShadow: "0 18px 40px rgba(0,208,132,0.2)",
};

const bottomStyle: CSSProperties = {
  marginTop: "26px",
  padding: "22px",
  borderRadius: "26px",
  border: "1px solid rgba(0,208,132,0.14)",
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.03))",
  boxShadow:
    "0 22px 56px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.04)",
};

const bottomGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "20px",
};

const bottomTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: "1.3rem",
  fontWeight: 800,
};

const bottomTextStyle: CSSProperties = {
  margin: "12px 0 0",
  color: "rgba(236,255,245,0.72)",
  lineHeight: 1.75,
};

const smallButtonStyle: CSSProperties = {
  marginTop: "16px",
  minHeight: "52px",
  padding: "0 18px",
  borderRadius: "18px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 800,
  textDecoration: "none",
  color: "#cffff0",
  border: "1px solid rgba(0,208,132,0.22)",
  background: "rgba(0,208,132,0.08)",
};

export default function PlanosPage() {
  return (
    <main style={pageStyle}>
      <section style={shellStyle}>
        <div style={heroStyle}>
          <div style={badgeStyle}>Aurora IA Planos</div>

          <div
            style={{
              ...heroGridStyle,
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            }}
          >
            <div>
              <h1 style={titleStyle}>
                Escolha o plano ideal para crescer com a Aurora IA
              </h1>

              <p style={subtitleStyle}>
                Crie imagens, campanhas, ideias de negocio e acelere sua
                operacao com uma estrutura pensada para conversao, uso
                comercial e crescimento real.
              </p>

              <div style={ctaRowStyle}>
                <Link href="/chat" style={primaryButtonStyle}>
                  Testar agora
                </Link>

                <Link href="/afiliados" style={secondaryButtonStyle}>
                  Programa de afiliados
                </Link>
              </div>
            </div>

            <div style={sideCardsStyle}>
              <div style={miniCardStyle}>
                <div style={miniCardTitleStyle}>Conversao</div>
                <p style={miniCardTextStyle}>
                  Planos claros, oferta simples e caminho direto para vender.
                </p>
              </div>

              <div style={miniCardStyle}>
                <div style={miniCardTitleStyle}>Uso comercial</div>
                <p style={miniCardTextStyle}>
                  Ideal para criadores, vendedores, agencias e operacoes reais.
                </p>
              </div>

              <div style={miniCardStyle}>
                <div style={miniCardTitleStyle}>Escala</div>
                <p style={miniCardTextStyle}>
                  Entre no PRO ou va direto para o SCALE e acelere sua subida.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            ...cardsGridStyle,
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          }}
        >
          {PLAN_ORDER.map((key) => {
            const plan = PLANS[key];
            const featured = Boolean(plan.highlight);

            return (
              <article
                key={plan.key}
                style={{
                  ...cardBaseStyle,
                  ...(featured ? featuredCardStyle : {}),
                }}
              >
                <div style={cardTopStyle}>
                  <div>
                    <p style={cardLabelStyle}>Plano Aurora</p>
                    <h2 style={cardNameStyle}>{plan.name}</h2>
                  </div>

                  {plan.badge ? (
                    <span
                      style={{
                        ...pillBaseStyle,
                        ...(featured ? pillFeaturedStyle : {}),
                      }}
                    >
                      {plan.badge}
                    </span>
                  ) : null}
                </div>

                <div style={priceStyle}>{plan.priceLabel}</div>

                <div style={priceHintStyle}>
                  {plan.priceValue > 0
                    ? "Cobranca recorrente mensal"
                    : "Entrada livre para conhecer"}
                </div>

                <p style={descriptionStyle}>{plan.description}</p>

                <div style={dividerStyle} />

                <ul style={featuresStyle}>
                  {plan.features.map((feature) => (
                    <li key={feature} style={featureItemStyle}>
                      <span
                        style={{
                          ...dotBaseStyle,
                          ...(featured ? dotFeaturedStyle : {}),
                        }}
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.checkoutHref}
                  style={{
                    ...cardButtonBaseStyle,
                    ...(featured ? cardButtonFeaturedStyle : {}),
                  }}
                >
                  {plan.ctaLabel}
                </Link>
              </article>
            );
          })}
        </div>

        <div style={bottomStyle}>
          <div
            style={{
              ...bottomGridStyle,
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            }}
          >
            <div>
              <h3 style={bottomTitleStyle}>Qual escolher?</h3>
              <p style={bottomTextStyle}>
                O plano PRO e ideal para quem quer comecar a usar a Aurora IA de
                forma seria. O SCALE e a escolha para quem quer mais forca,
                operacao mais completa e melhor estrutura para fechar clientes.
              </p>
            </div>

            <div>
              <h3 style={bottomTitleStyle}>Programa de afiliados</h3>
              <p style={bottomTextStyle}>
                Se voce quer divulgar a Aurora IA e ganhar comissoes por venda,
                entre na area de afiliados e pegue seu link de indicacao.
              </p>

              <Link href="/afiliados" style={smallButtonStyle}>
                Ir para afiliados
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}