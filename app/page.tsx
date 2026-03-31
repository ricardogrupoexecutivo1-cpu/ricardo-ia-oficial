"use client";

import Link from "next/link";
import AuroraGlobalBar from "@/components/aurora-global-bar";
import { useAuroraTexts } from "@/components/aurora-global-provider";

type HomeCard = {
  title: string;
  description: string;
  href: string;
  icon: string;
  badge: string;
};

export default function HomePage() {
  const texts = useAuroraTexts();

  const cards: HomeCard[] = [
    {
      title: texts.chat,
      description:
        texts.language === "Language"
          ? "Talk to Aurora, generate ideas, campaigns, apps and premium responses."
          : texts.language === "Idioma" && texts.home === "Inicio"
            ? "Habla con Aurora, genera ideas, campañas, apps y respuestas premium."
            : "Converse com a Aurora, gere ideias, campanhas, apps e respostas premium.",
      href: "/chat",
      icon: "💬",
      badge: texts.premiumExperience,
    },
    {
      title: texts.explore,
      description:
        texts.language === "Language"
          ? "Explore public content, images, creations and growth opportunities."
          : texts.language === "Idioma" && texts.home === "Inicio"
            ? "Explora contenidos públicos, imágenes, creaciones y oportunidades de crecimiento."
            : "Explore conteúdos públicos, imagens, criações e oportunidades de crescimento.",
      href: "/explorar",
      icon: "🌍",
      badge: texts.flexibleStructure,
    },
    {
      title: texts.globalRegistration,
      description:
        texts.language === "Language"
          ? "Register companies, professionals and operations with a global-ready structure."
          : texts.language === "Idioma" && texts.home === "Inicio"
            ? "Registra empresas, profesionales y operaciones con estructura global."
            : "Cadastre empresas, profissionais e operações com estrutura global.",
      href: "/cadastro",
      icon: "🧾",
      badge: texts.openNomenclatures,
    },
    {
      title: texts.finance,
      description:
        texts.language === "Language"
          ? "Private finance by company, editable categories, activities and nomenclatures."
          : texts.language === "Idioma" && texts.home === "Inicio"
            ? "Finanzas privadas por empresa, con categorías, actividades y nomenclaturas editables."
            : "Financeiro privado por empresa, com categorias, atividades e nomenclaturas editáveis.",
      href: "/financeiro",
      icon: "💰",
      badge: texts.privateByCompany,
    },
  ];

  const highlights = [
    {
      title: texts.privateByCompany,
      value:
        texts.language === "Language"
          ? "Secure multi-company private area"
          : texts.language === "Idioma" && texts.home === "Inicio"
            ? "Área privada segura por empresa"
            : "Área privada segura por empresa",
    },
    {
      title: texts.customizableFinancial,
      value:
        texts.language === "Language"
          ? "Open categories and custom names"
          : texts.language === "Idioma" && texts.home === "Inicio"
            ? "Categorías abiertas y nombres personalizados"
            : "Categorias abertas e nomes personalizados",
    },
    {
      title: texts.mobileExperience,
      value:
        texts.language === "Language"
          ? "Built to impress on mobile"
          : texts.language === "Idioma" && texts.home === "Inicio"
            ? "Hecho para impresionar en móvil"
            : "Feito para impressionar no mobile",
    },
    {
      title: texts.currency,
      value:
        texts.language === "Language"
          ? "Global currency-ready foundation"
          : texts.language === "Idioma" && texts.home === "Inicio"
            ? "Base lista para monedas globales"
            : "Base pronta para moedas globais",
    },
  ];

  const heroTitle =
    texts.language === "Language"
      ? "A global platform ready to scale with intelligence, trust and premium experience."
      : texts.language === "Idioma" && texts.home === "Inicio"
        ? "Una plataforma global lista para escalar con inteligencia, confianza y experiencia premium."
        : "Uma plataforma global pronta para escalar com inteligência, confiança e experiência premium.";

  const heroDescription =
    texts.language === "Language"
      ? "Aurora connects chat, images, operations, registration and editable business finance in one international mobile-first structure."
      : texts.language === "Idioma" && texts.home === "Inicio"
        ? "Aurora conecta chat, imágenes, operaciones, registro y finanzas empresariales editables en una sola estructura internacional mobile-first."
        : "A Aurora conecta chat, imagens, operações, cadastro e financeiro empresarial editável em uma única estrutura internacional mobile-first.";

  const ctaPrimary =
    texts.language === "Language"
      ? "Enter chat"
      : texts.language === "Idioma" && texts.home === "Inicio"
        ? "Entrar al chat"
        : "Entrar no chat";

  const ctaSecondary =
    texts.language === "Language"
      ? "Open plans"
      : texts.language === "Idioma" && texts.home === "Inicio"
        ? "Ver planes"
        : "Ver planos";

  const modulesTitle =
    texts.language === "Language"
      ? "Global modules in evolution"
      : texts.language === "Idioma" && texts.home === "Inicio"
        ? "Módulos globales en evolución"
        : "Módulos globais em evolução";

  const modulesDescription =
    texts.language === "Language"
      ? "Aurora is being prepared to serve multiple sectors with strong visual identity, internal flow and a scalable business structure."
      : texts.language === "Idioma" && texts.home === "Inicio"
        ? "Aurora se está preparando para atender múltiples sectores con identidad visual fuerte, flujo interno y estructura escalable."
        : "A Aurora está sendo preparada para atender múltiplos setores com identidade visual forte, fluxo interno e estrutura escalável.";

  const internalLinks = [
    {
      href: "/agro",
      label: texts.agribusiness,
      description:
        texts.language === "Language"
          ? "Agribusiness structure and growth"
          : texts.language === "Idioma" && texts.home === "Inicio"
            ? "Estructura y crecimiento agro"
            : "Estrutura e crescimento AGRO",
    },
    {
      href: "/imoveis",
      label: texts.realEstate,
      description:
        texts.language === "Language"
          ? "Real estate operations and visibility"
          : texts.language === "Idioma" && texts.home === "Inicio"
            ? "Operación y visibilidad inmobiliaria"
            : "Operação e visibilidade imobiliária",
    },
    {
      href: "/locadora",
      label:
        texts.language === "Language"
          ? "Rental"
          : texts.language === "Idioma" && texts.home === "Inicio"
            ? "Alquiler"
            : "Locadora",
      description:
        texts.language === "Language"
          ? "Vehicles, drivers and opportunities"
          : texts.language === "Idioma" && texts.home === "Inicio"
            ? "Vehículos, conductores y oportunidades"
            : "Veículos, motoristas e oportunidades",
    },
    {
      href: "/app-builder",
      label:
        texts.language === "Language"
          ? "App Builder"
          : texts.language === "Idioma" && texts.home === "Inicio"
            ? "Creador de Apps"
            : "App Builder",
      description:
        texts.language === "Language"
          ? "Build apps with commercial focus"
          : texts.language === "Idioma" && texts.home === "Inicio"
            ? "Crear apps con foco comercial"
            : "Criar apps com foco comercial",
    },
  ];

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(34,197,94,0.10) 0%, rgba(10,14,24,0.98) 28%, #050816 62%, #030712 100%)",
        color: "#f8fafc",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1240,
          margin: "0 auto",
          padding: "20px 16px 80px",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <AuroraGlobalBar
          title="Aurora IA"
          subtitle={heroDescription}
          showNotice
        />

        <section
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: 32,
            border: "1px solid rgba(110, 231, 255, 0.14)",
            background:
              "linear-gradient(135deg, rgba(6,10,20,0.98) 0%, rgba(10,18,33,0.96) 50%, rgba(7,12,24,0.98) 100%)",
            padding: "28px 18px",
            boxShadow: "0 25px 90px rgba(0,0,0,0.35)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -120,
              right: -80,
              width: 260,
              height: 260,
              borderRadius: "50%",
              background: "rgba(34,197,94,0.12)",
              filter: "blur(50px)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -120,
              left: -70,
              width: 250,
              height: 250,
              borderRadius: "50%",
              background: "rgba(59,130,246,0.14)",
              filter: "blur(50px)",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 1,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 18,
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  width: "fit-content",
                  padding: "8px 12px",
                  borderRadius: 999,
                  background: "rgba(34,197,94,0.10)",
                  border: "1px solid rgba(34,197,94,0.22)",
                  color: "#bbf7d0",
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: 0.4,
                }}
              >
                🌍 {texts.premiumExperience}
              </div>

              <h1
                style={{
                  margin: 0,
                  fontSize: "clamp(32px, 5vw, 56px)",
                  lineHeight: 1.02,
                  fontWeight: 900,
                  letterSpacing: -1.6,
                  maxWidth: 780,
                }}
              >
                {heroTitle}
              </h1>

              <p
                style={{
                  margin: 0,
                  maxWidth: 760,
                  color: "rgba(226,232,240,0.82)",
                  fontSize: 16,
                  lineHeight: 1.7,
                }}
              >
                {heroDescription}
              </p>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 12,
                  marginTop: 4,
                }}
              >
                <Link
                  href="/chat"
                  style={{
                    minHeight: 48,
                    padding: "0 18px",
                    borderRadius: 14,
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: 14,
                    color: "#03111f",
                    background:
                      "linear-gradient(135deg, #67e8f9 0%, #22c55e 100%)",
                    boxShadow: "0 18px 40px rgba(34,197,94,0.22)",
                  }}
                >
                  {ctaPrimary}
                </Link>

                <Link
                  href="/planos"
                  style={{
                    minHeight: 48,
                    padding: "0 18px",
                    borderRadius: 14,
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: 14,
                    color: "#e2e8f0",
                    border: "1px solid rgba(148,163,184,0.24)",
                    background: "rgba(15,23,42,0.72)",
                  }}
                >
                  {ctaSecondary}
                </Link>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: 12,
              }}
            >
              {highlights.map((item) => (
                <div
                  key={item.title}
                  style={{
                    borderRadius: 22,
                    border: "1px solid rgba(148,163,184,0.14)",
                    background: "rgba(15,23,42,0.62)",
                    padding: "16px 14px",
                    minHeight: 118,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      color: "#93c5fd",
                      fontSize: 12,
                      fontWeight: 800,
                      letterSpacing: 0.4,
                      textTransform: "uppercase",
                    }}
                  >
                    {item.title}
                  </div>
                  <div
                    style={{
                      color: "#f8fafc",
                      fontSize: 16,
                      lineHeight: 1.35,
                      fontWeight: 800,
                    }}
                  >
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 16,
          }}
        >
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              style={{
                textDecoration: "none",
                color: "inherit",
                borderRadius: 28,
                border: "1px solid rgba(148,163,184,0.14)",
                background:
                  "linear-gradient(180deg, rgba(8,12,24,0.95) 0%, rgba(6,10,19,0.98) 100%)",
                padding: "20px 18px",
                boxShadow: "0 18px 60px rgba(0,0,0,0.26)",
                display: "flex",
                flexDirection: "column",
                gap: 14,
                minHeight: 240,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <span
                  style={{
                    width: 54,
                    height: 54,
                    borderRadius: 16,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(34,197,94,0.12)",
                    border: "1px solid rgba(34,197,94,0.22)",
                    fontSize: 24,
                  }}
                >
                  {card.icon}
                </span>

                <span
                  style={{
                    padding: "7px 10px",
                    borderRadius: 999,
                    background: "rgba(59,130,246,0.10)",
                    border: "1px solid rgba(59,130,246,0.18)",
                    color: "#bfdbfe",
                    fontSize: 11,
                    fontWeight: 800,
                    letterSpacing: 0.4,
                    textTransform: "uppercase",
                  }}
                >
                  {card.badge}
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <h2
                  style={{
                    margin: 0,
                    fontSize: 22,
                    lineHeight: 1.1,
                    fontWeight: 900,
                    color: "#f8fafc",
                  }}
                >
                  {card.title}
                </h2>

                <p
                  style={{
                    margin: 0,
                    color: "rgba(226,232,240,0.78)",
                    fontSize: 14,
                    lineHeight: 1.65,
                  }}
                >
                  {card.description}
                </p>
              </div>

              <div
                style={{
                  marginTop: "auto",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  color: "#86efac",
                  fontWeight: 800,
                  fontSize: 14,
                }}
              >
                <span>
                  {texts.continue}
                </span>
                <span aria-hidden="true">→</span>
              </div>
            </Link>
          ))}
        </section>

        <section
          style={{
            borderRadius: 30,
            border: "1px solid rgba(148,163,184,0.14)",
            background:
              "linear-gradient(180deg, rgba(8,12,24,0.95) 0%, rgba(5,9,18,0.98) 100%)",
            padding: "22px 18px",
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <span
              style={{
                color: "#93c5fd",
                fontSize: 12,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: 0.4,
              }}
            >
              {texts.internalModules}
            </span>

            <h2
              style={{
                margin: 0,
                fontSize: "clamp(24px, 4vw, 34px)",
                lineHeight: 1.08,
                fontWeight: 900,
              }}
            >
              {modulesTitle}
            </h2>

            <p
              style={{
                margin: 0,
                color: "rgba(226,232,240,0.78)",
                fontSize: 15,
                lineHeight: 1.7,
                maxWidth: 900,
              }}
            >
              {modulesDescription}
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 14,
            }}
          >
            {internalLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  borderRadius: 22,
                  border: "1px solid rgba(148,163,184,0.12)",
                  background: "rgba(15,23,42,0.52)",
                  padding: "16px 14px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  minHeight: 122,
                }}
              >
                <div
                  style={{
                    color: "#f8fafc",
                    fontSize: 18,
                    fontWeight: 900,
                    lineHeight: 1.1,
                  }}
                >
                  {item.label}
                </div>

                <div
                  style={{
                    color: "rgba(226,232,240,0.76)",
                    fontSize: 14,
                    lineHeight: 1.6,
                  }}
                >
                  {item.description}
                </div>

                <div
                  style={{
                    marginTop: "auto",
                    color: "#67e8f9",
                    fontSize: 13,
                    fontWeight: 800,
                  }}
                >
                  {texts.continue} →
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}