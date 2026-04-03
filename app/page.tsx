"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import HomePatrocinadoresHighlight from "@/components/home/home-patrocinadores-highlight";

const GENERAL_SIGNUP_HREF = "/cadastro-geral";
const SEARCH_COMPANIES_HREF = "/cadastros";

type Lang = "pt" | "en" | "es";

const orbitItems = [
  { label: "Empresas", top: "12%", left: "50%" },
  { label: "Fornecedores", top: "24%", left: "77%" },
  { label: "AGRO", top: "47%", left: "88%" },
  { label: "Locadoras", top: "72%", left: "76%" },
  { label: "Imóveis", top: "86%", left: "50%" },
  { label: "Bancos", top: "72%", left: "24%" },
  { label: "Mineração", top: "47%", left: "12%" },
  { label: "Financeiro", top: "24%", left: "23%" },
];

const mainAccessLinks = [
  { href: "/locadora", label: "Locadoras" },
  { href: "/imoveis", label: "Imóveis" },
  { href: "/bancos", label: "Bancos" },
  { href: "/agro", label: "AGRO" },
  { href: "/mineracao", label: "Mineração" },
  { href: "/financeiro", label: "Financeiro" },
  { href: "/app-builder", label: "App Builder" },
  { href: "/guardiao", label: "Guardião" },
  { href: "/chat", label: "Chat Aurora" },
  { href: SEARCH_COMPANIES_HREF, label: "Buscar empresas" },
  { href: "/planos", label: "Planos" },
  { href: GENERAL_SIGNUP_HREF, label: "Cadastro" },
];

const heroQuickLinks = [
  { href: "/locadora", label: "Locadoras" },
  { href: "/imoveis", label: "Imóveis" },
  { href: "/bancos", label: "Bancos" },
  { href: "/agro", label: "AGRO" },
  { href: "/mineracao", label: "Mineração" },
  { href: "/financeiro", label: "Financeiro" },
  { href: SEARCH_COMPANIES_HREF, label: "Buscar empresas" },
  { href: "/app-builder", label: "App Builder" },
];

const copyByLang = {
  pt: {
    badge: "Ecossistema empresarial com IA",
    title: "Cadastre, pesquise e gere negócios reais",
    subtitle:
      "Locadoras, imóveis, bancos, agro, mineração, fornecedores, empresas e operação empresarial em uma entrada premium, clara e forte.",
    ctaPrimary: "Cadastro geral grátis",
    ctaSecondary: "Buscar empresas",
    ctaThird: "Abrir Aurora IA",
    quickTitle: "Entradas principais da plataforma",
    quickText:
      "Acesse rapidamente os módulos principais da Aurora no topo da home e também no centro visual da plataforma.",
    footerTitle: "Entrada forte • descoberta rápida • navegação comercial",
    footerText:
      "A Aurora está em constante atualização. Pode haver momentos de instabilidade durante melhorias, mas a estrutura principal da home foi organizada para facilitar acesso, entendimento e conversão.",
    footerPrimary: "Cadastrar agora",
    footerSecondary: "Explorar empresas",
  },
  en: {
    badge: "Business ecosystem with AI",
    title: "Register, search and generate real business",
    subtitle:
      "Rentals, real estate, banks, agribusiness, mining, suppliers, companies and business operations in a premium, clear and strong entry point.",
    ctaPrimary: "Free general registration",
    ctaSecondary: "Search companies",
    ctaThird: "Open Aurora IA",
    quickTitle: "Main platform entries",
    quickText:
      "Access Aurora's main modules quickly from the top navigation and also from the platform visual core.",
    footerTitle: "Strong entry • quick discovery • commercial navigation",
    footerText:
      "Aurora is constantly evolving. There may be moments of instability during improvements, but the home structure was organized to improve access, understanding and conversion.",
    footerPrimary: "Register now",
    footerSecondary: "Explore companies",
  },
  es: {
    badge: "Ecosistema empresarial con IA",
    title: "Registra, busca y genera negocios reales",
    subtitle:
      "Locadoras, inmuebles, bancos, agro, minería, proveedores, empresas y operación empresarial en una entrada premium, clara y fuerte.",
    ctaPrimary: "Registro general gratis",
    ctaSecondary: "Buscar empresas",
    ctaThird: "Abrir Aurora IA",
    quickTitle: "Entradas principales de la plataforma",
    quickText:
      "Accede rápidamente a los módulos principales de Aurora desde la navegación superior y también desde el núcleo visual de la plataforma.",
    footerTitle: "Entrada fuerte • descubrimiento rápido • navegación comercial",
    footerText:
      "Aurora está en constante actualización. Puede haber momentos de inestabilidad durante mejoras, pero la estructura principal fue organizada para facilitar acceso, comprensión y conversión.",
    footerPrimary: "Registrar ahora",
    footerSecondary: "Explorar empresas",
  },
} satisfies Record<
  Lang,
  {
    badge: string;
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    ctaThird: string;
    quickTitle: string;
    quickText: string;
    footerTitle: string;
    footerText: string;
    footerPrimary: string;
    footerSecondary: string;
  }
>;

export default function HomePage() {
  const [lang, setLang] = useState<Lang>("pt");
  const t = useMemo(() => copyByLang[lang], [lang]);

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(59,130,246,0.10), transparent 18%), radial-gradient(circle at left, rgba(34,197,94,0.10), transparent 24%), linear-gradient(180deg, #eef6ff 0%, #f7fbff 36%, #edf7f3 100%)",
        color: "#0f172a",
        overflow: "hidden",
      }}
    >
      <section
        style={{
          maxWidth: 1320,
          margin: "0 auto",
          padding: "18px 16px 64px",
          display: "grid",
          gap: 18,
        }}
      >
        <header
          style={{
            display: "grid",
            gap: 14,
            border: "1px solid rgba(15,23,42,0.08)",
            background: "rgba(255,255,255,0.78)",
            backdropFilter: "blur(14px)",
            borderRadius: 24,
            padding: "14px",
            boxShadow: "0 18px 42px rgba(15,23,42,0.07)",
            position: "relative",
            zIndex: 3,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 14,
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                display: "grid",
                gap: 3,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 900,
                  letterSpacing: "0.08em",
                  color: "#2563eb",
                  textTransform: "uppercase",
                }}
              >
                ricardoiaoficial.com
              </div>
              <div
                style={{
                  fontSize: 17,
                  fontWeight: 900,
                  lineHeight: 1.2,
                  color: "#0f172a",
                }}
              >
                Aurora IA • Plataforma internacional de negócios
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: 6,
                flexWrap: "wrap",
              }}
            >
              <LanguageButton
                label="PT"
                active={lang === "pt"}
                onClick={() => setLang("pt")}
              />
              <LanguageButton
                label="EN"
                active={lang === "en"}
                onClick={() => setLang("en")}
              />
              <LanguageButton
                label="ES"
                active={lang === "es"}
                onClick={() => setLang("es")}
              />
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gap: 8,
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 900,
                color: "rgba(15,23,42,0.62)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Acessos principais
            </div>

            <nav
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              {mainAccessLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  style={
                    item.href === GENERAL_SIGNUP_HREF
                      ? ctaSmallStyle
                      : topAccessLinkStyle
                  }
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        <section
          style={{
            position: "relative",
            border: "1px solid rgba(15,23,42,0.08)",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.86), rgba(255,255,255,0.72))",
            borderRadius: 32,
            padding: "24px 18px 20px",
            boxShadow: "0 22px 70px rgba(15,23,42,0.09)",
            overflow: "hidden",
            minHeight: 700,
            display: "grid",
            alignItems: "center",
          }}
        >
          <div style={heroGlowBlueStyle} />
          <div style={heroGlowGreenStyle} />
          <div style={heroGridStyle} />

          <div
            style={{
              position: "relative",
              zIndex: 2,
              display: "grid",
              gap: 18,
            }}
          >
            <div
              style={{
                display: "grid",
                gap: 14,
                justifyItems: "center",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  width: "fit-content",
                  alignItems: "center",
                  gap: 8,
                  padding: "7px 11px",
                  borderRadius: 999,
                  background: "rgba(37,99,235,0.08)",
                  border: "1px solid rgba(37,99,235,0.16)",
                  color: "#2563eb",
                  fontSize: 12,
                  fontWeight: 800,
                  boxShadow: "0 0 16px rgba(37,99,235,0.06)",
                }}
              >
                {t.badge}
              </div>

              <h1
                style={{
                  margin: 0,
                  fontSize: "clamp(34px, 5.8vw, 62px)",
                  lineHeight: 0.97,
                  letterSpacing: "-0.05em",
                  maxWidth: 980,
                  color: "#0f172a",
                }}
              >
                {t.title}
              </h1>

              <p
                style={{
                  margin: 0,
                  color: "rgba(15,23,42,0.74)",
                  fontSize: 18,
                  lineHeight: 1.6,
                  maxWidth: 980,
                  fontWeight: 700,
                }}
              >
                {t.subtitle}
              </p>

              <div
                style={{
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                <Link href={GENERAL_SIGNUP_HREF} style={primaryBigButtonStyle}>
                  {t.ctaPrimary}
                </Link>

                <Link href={SEARCH_COMPANIES_HREF} style={secondaryBigButtonStyle}>
                  {t.ctaSecondary}
                </Link>

                <Link href="/chat" style={secondaryBigButtonStyle}>
                  {t.ctaThird}
                </Link>
              </div>
            </div>

            <section
              style={{
                display: "grid",
                gap: 10,
                justifyItems: "center",
                textAlign: "center",
                padding: "8px 4px 0",
              }}
            >
              <div
                style={{
                  fontSize: "clamp(18px, 3vw, 24px)",
                  fontWeight: 900,
                  color: "#0f172a",
                  lineHeight: 1.08,
                }}
              >
                {t.quickTitle}
              </div>

              <div
                style={{
                  maxWidth: 860,
                  color: "rgba(15,23,42,0.66)",
                  lineHeight: 1.65,
                  fontSize: 15,
                  fontWeight: 700,
                }}
              >
                {t.quickText}
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                {heroQuickLinks.map((item) => (
                  <Link key={item.href} href={item.href} style={heroMiniLinkStyle}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </section>

            <div
              style={{
                position: "relative",
                minHeight: 500,
                marginTop: 6,
                borderRadius: 30,
                border: "1px solid rgba(15,23,42,0.06)",
                background:
                  "radial-gradient(circle at center, rgba(59,130,246,0.08), rgba(255,255,255,0.10) 42%, rgba(255,255,255,0.32) 100%)",
                overflow: "hidden",
                boxShadow: "inset 0 0 50px rgba(59,130,246,0.05)",
              }}
            >
              <div style={orbitRingOuterStyle} />
              <div style={orbitRingMidStyle} />
              <div style={orbitRingInnerStyle} />
              <div style={coreGlowStyle} />
              <div style={coreGlowGreenStyle} />

              <div style={coreStyle}>
                <div style={coreInnerStyle}>
                  <div style={coreLabelStyle}>Aurora IA</div>
                  <div style={coreTitleStyle}>Núcleo global</div>
                  <div style={coreTextStyle}>IA • negócios • conexão</div>
                </div>
              </div>

              {orbitItems.map((item) => (
                <div
                  key={item.label}
                  style={{
                    position: "absolute",
                    top: item.top,
                    left: item.left,
                    transform: "translate(-50%, -50%)",
                    display: "grid",
                    justifyItems: "center",
                    gap: 6,
                  }}
                >
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 999,
                      background:
                        "radial-gradient(circle, #ffffff 0%, #93c5fd 40%, #2563eb 75%, rgba(37,99,235,0.16) 100%)",
                      boxShadow:
                        "0 0 0 4px rgba(37,99,235,0.08), 0 0 16px rgba(37,99,235,0.28)",
                    }}
                  />
                  <div
                    style={{
                      minHeight: 30,
                      padding: "5px 9px",
                      borderRadius: 999,
                      background: "rgba(255,255,255,0.74)",
                      border: "1px solid rgba(15,23,42,0.08)",
                      color: "#0f172a",
                      fontSize: 11,
                      fontWeight: 800,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 8px 20px rgba(15,23,42,0.07)",
                      whiteSpace: "nowrap",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    {item.label}
                  </div>
                </div>
              ))}

              {orbitItems.map((item, index) => (
                <div
                  key={`line-${item.label}`}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    width: index % 2 === 0 ? "28%" : "31%",
                    height: 1,
                    background:
                      "linear-gradient(90deg, rgba(37,99,235,0.05), rgba(37,99,235,0.26), rgba(37,99,235,0.03))",
                    transform: buildConnectionTransform(item.top, item.left),
                    transformOrigin: "left center",
                    opacity: 0.72,
                  }}
                />
              ))}
            </div>
          </div>
        </section>

        <HomePatrocinadoresHighlight />

        <section style={tutorialHomeStyle}>
          <div style={tutorialContentStyle}>
            <div style={tutorialBadgeStyle}>Guia rápido</div>

            <h2 style={tutorialTitleStyle}>
              Não sabe por onde começar na Aurora?
            </h2>

            <p style={tutorialTextStyle}>
              A Aurora possui várias áreas e possibilidades. Para evitar erros,
              entender melhor a plataforma e aumentar suas chances de gerar
              negócios, siga o passo a passo oficial.
            </p>

            <div style={tutorialActionsStyle}>
              <Link href="/como-usar" style={tutorialPrimaryButton}>
                Ver como usar a Aurora
              </Link>

              <Link href="/cadastro-geral" style={tutorialSecondaryButton}>
                Fazer cadastro agora
              </Link>
            </div>
          </div>
        </section>

        <section
          style={{
            border: "1px solid rgba(15,23,42,0.08)",
            background:
              "linear-gradient(135deg, rgba(37,99,235,0.06), rgba(16,185,129,0.06))",
            borderRadius: 24,
            padding: "18px 16px",
            display: "grid",
            gap: 10,
            boxShadow: "0 14px 34px rgba(15,23,42,0.05)",
          }}
        >
          <div
            style={{
              fontSize: "clamp(20px, 4vw, 28px)",
              fontWeight: 900,
              lineHeight: 1.08,
              color: "#0f172a",
              textAlign: "center",
            }}
          >
            {t.footerTitle}
          </div>

          <div
            style={{
              color: "rgba(15,23,42,0.68)",
              lineHeight: 1.68,
              fontSize: 15,
              maxWidth: 920,
              textAlign: "center",
              margin: "0 auto",
            }}
          >
            {t.footerText}
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <Link href={GENERAL_SIGNUP_HREF} style={primaryBigButtonStyle}>
              {t.footerPrimary}
            </Link>
            <Link href={SEARCH_COMPANIES_HREF} style={secondaryBigButtonStyle}>
              {t.footerSecondary}
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}

function LanguageButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        minHeight: 32,
        padding: "0 11px",
        borderRadius: 999,
        border: active
          ? "1px solid rgba(37,99,235,0.24)"
          : "1px solid rgba(15,23,42,0.08)",
        background: active
          ? "linear-gradient(135deg, rgba(37,99,235,0.10), rgba(59,130,246,0.04))"
          : "rgba(255,255,255,0.66)",
        color: active ? "#1d4ed8" : "#0f172a",
        fontWeight: 900,
        cursor: "pointer",
        boxShadow: active ? "0 0 14px rgba(37,99,235,0.06)" : "none",
        fontSize: 12,
      }}
    >
      {label}
    </button>
  );
}

function buildConnectionTransform(top: string, left: string) {
  const topNum = Number(top.replace("%", ""));
  const leftNum = Number(left.replace("%", ""));

  const centerX = 50;
  const centerY = 50;
  const dx = leftNum - centerX;
  const dy = topNum - centerY;
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

  return `translate(-50%, -50%) rotate(${angle}deg)`;
}

const heroGlowBlueStyle: React.CSSProperties = {
  position: "absolute",
  width: 520,
  height: 520,
  borderRadius: 999,
  background:
    "radial-gradient(circle, rgba(59,130,246,0.12) 0%, rgba(59,130,246,0.04) 44%, transparent 72%)",
  top: -160,
  left: -120,
  filter: "blur(24px)",
  pointerEvents: "none",
};

const heroGlowGreenStyle: React.CSSProperties = {
  position: "absolute",
  width: 420,
  height: 420,
  borderRadius: 999,
  background:
    "radial-gradient(circle, rgba(16,185,129,0.10) 0%, rgba(16,185,129,0.03) 45%, transparent 72%)",
  bottom: -100,
  right: -60,
  filter: "blur(20px)",
  pointerEvents: "none",
};

const heroGridStyle: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  backgroundImage:
    "linear-gradient(rgba(15,23,42,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.022) 1px, transparent 1px)",
  backgroundSize: "42px 42px",
  opacity: 0.26,
  pointerEvents: "none",
};

const orbitRingOuterStyle: React.CSSProperties = {
  position: "absolute",
  top: "50%",
  left: "50%",
  width: 360,
  height: 360,
  transform: "translate(-50%, -50%)",
  borderRadius: 999,
  border: "1px solid rgba(37,99,235,0.12)",
  boxShadow: "0 0 26px rgba(37,99,235,0.04)",
};

const orbitRingMidStyle: React.CSSProperties = {
  position: "absolute",
  top: "50%",
  left: "50%",
  width: 280,
  height: 280,
  transform: "translate(-50%, -50%)",
  borderRadius: 999,
  border: "1px solid rgba(16,185,129,0.10)",
};

const orbitRingInnerStyle: React.CSSProperties = {
  position: "absolute",
  top: "50%",
  left: "50%",
  width: 180,
  height: 180,
  transform: "translate(-50%, -50%)",
  borderRadius: 999,
  border: "1px solid rgba(37,99,235,0.08)",
};

const coreGlowStyle: React.CSSProperties = {
  position: "absolute",
  top: "50%",
  left: "50%",
  width: 190,
  height: 190,
  transform: "translate(-50%, -50%)",
  borderRadius: 999,
  background:
    "radial-gradient(circle, rgba(59,130,246,0.22) 0%, rgba(59,130,246,0.08) 42%, rgba(59,130,246,0.02) 68%, transparent 78%)",
  filter: "blur(12px)",
};

const coreGlowGreenStyle: React.CSSProperties = {
  position: "absolute",
  top: "50%",
  left: "50%",
  width: 138,
  height: 138,
  transform: "translate(-50%, -50%)",
  borderRadius: 999,
  background:
    "radial-gradient(circle, rgba(16,185,129,0.14) 0%, rgba(16,185,129,0.04) 50%, transparent 74%)",
};

const coreStyle: React.CSSProperties = {
  position: "absolute",
  top: "50%",
  left: "50%",
  width: 156,
  height: 156,
  transform: "translate(-50%, -50%)",
  borderRadius: 999,
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.94), rgba(241,245,249,0.88))",
  border: "1px solid rgba(15,23,42,0.08)",
  boxShadow: "0 18px 44px rgba(15,23,42,0.10)",
  display: "grid",
  placeItems: "center",
};

const coreInnerStyle: React.CSSProperties = {
  width: 112,
  height: 112,
  borderRadius: 999,
  background:
    "radial-gradient(circle, rgba(59,130,246,0.12) 0%, rgba(255,255,255,0.92) 58%, rgba(255,255,255,0.88) 100%)",
  border: "1px solid rgba(37,99,235,0.10)",
  display: "grid",
  alignContent: "center",
  justifyItems: "center",
  textAlign: "center",
  gap: 4,
};

const coreLabelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 900,
  color: "#2563eb",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
};

const coreTitleStyle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 900,
  color: "#0f172a",
  lineHeight: 1.05,
};

const coreTextStyle: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 800,
  color: "rgba(15,23,42,0.62)",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

const topAccessLinkStyle: React.CSSProperties = {
  textDecoration: "none",
  color: "#0f172a",
  border: "1px solid rgba(15,23,42,0.08)",
  background: "rgba(255,255,255,0.72)",
  borderRadius: 999,
  padding: "10px 14px",
  fontWeight: 800,
  boxShadow: "0 8px 16px rgba(15,23,42,0.04)",
  fontSize: 13,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};

const heroMiniLinkStyle: React.CSSProperties = {
  textDecoration: "none",
  color: "#0f172a",
  border: "1px solid rgba(15,23,42,0.08)",
  background: "rgba(255,255,255,0.74)",
  borderRadius: 999,
  padding: "9px 12px",
  fontWeight: 800,
  boxShadow: "0 8px 16px rgba(15,23,42,0.04)",
  fontSize: 13,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};

const ctaSmallStyle: React.CSSProperties = {
  textDecoration: "none",
  color: "#ffffff",
  border: "1px solid rgba(37,99,235,0.16)",
  background: "linear-gradient(135deg, #2563eb, #3b82f6)",
  borderRadius: 999,
  padding: "10px 14px",
  fontWeight: 900,
  boxShadow: "0 10px 24px rgba(37,99,235,0.16)",
  fontSize: 13,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};

const primaryBigButtonStyle: React.CSSProperties = {
  textDecoration: "none",
  color: "#ffffff",
  background: "linear-gradient(135deg, #2563eb, #3b82f6)",
  border: "1px solid rgba(37,99,235,0.16)",
  borderRadius: 15,
  padding: "13px 16px",
  fontWeight: 900,
  display: "inline-flex",
  justifyContent: "center",
  alignItems: "center",
  boxShadow: "0 14px 30px rgba(37,99,235,0.16)",
  fontSize: 14,
};

const secondaryBigButtonStyle: React.CSSProperties = {
  textDecoration: "none",
  color: "#0f172a",
  background: "rgba(255,255,255,0.74)",
  border: "1px solid rgba(15,23,42,0.08)",
  borderRadius: 15,
  padding: "13px 16px",
  fontWeight: 800,
  display: "inline-flex",
  justifyContent: "center",
  alignItems: "center",
  boxShadow: "0 10px 22px rgba(15,23,42,0.05)",
  fontSize: 14,
};

const tutorialHomeStyle: React.CSSProperties = {
  border: "1px solid rgba(15,23,42,0.08)",
  background:
    "linear-gradient(135deg, rgba(37,99,235,0.06), rgba(16,185,129,0.06))",
  borderRadius: 24,
  padding: "22px 18px",
  display: "grid",
  gap: 10,
  boxShadow: "0 14px 34px rgba(15,23,42,0.05)",
};

const tutorialContentStyle: React.CSSProperties = {
  maxWidth: 900,
  margin: "0 auto",
  textAlign: "center",
};

const tutorialBadgeStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 900,
  color: "#16a34a",
  textTransform: "uppercase",
  marginBottom: 6,
};

const tutorialTitleStyle: React.CSSProperties = {
  fontSize: "clamp(20px, 4vw, 28px)",
  fontWeight: 900,
  margin: 0,
  color: "#0f172a",
};

const tutorialTextStyle: React.CSSProperties = {
  marginTop: 8,
  color: "rgba(15,23,42,0.68)",
  lineHeight: 1.7,
  fontSize: 15,
};

const tutorialActionsStyle: React.CSSProperties = {
  marginTop: 14,
  display: "flex",
  gap: 10,
  justifyContent: "center",
  flexWrap: "wrap",
};

const tutorialPrimaryButton: React.CSSProperties = {
  padding: "12px 18px",
  borderRadius: 12,
  background: "#2563eb",
  color: "#fff",
  textDecoration: "none",
  fontWeight: 900,
};

const tutorialSecondaryButton: React.CSSProperties = {
  padding: "12px 18px",
  borderRadius: 12,
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  color: "#0f172a",
  textDecoration: "none",
  fontWeight: 800,
};