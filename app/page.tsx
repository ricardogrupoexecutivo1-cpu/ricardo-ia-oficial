"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Language = "pt" | "en" | "es";
type Phase = "intro" | "platform";

const translations = {
  pt: {
    welcome: "Bem-vindos à Aurora IA",
    title: "Plataforma Aurora IA",
    subtitle: "Chat • Imagens • Marketing • Explorar • Planilha grátis",
    chatTitle: "Chat inteligente",
    chatDesc: "Converse com a Aurora IA.",
    imageTitle: "Gerar imagens",
    imageDesc: "Crie imagens com IA.",
    marketingTitle: "Marketing",
    marketingDesc: "Crie campanhas.",
    exploreTitle: "Explorar",
    exploreDesc: "Veja imagens públicas.",
    plansTitle: "Planos",
    plansDesc: "Conheça os planos.",
    loginTitle: "Entrar",
    loginDesc: "Acesse sua conta.",
    sheetTitle: "Criar sua planilha gratuitamente",
    sheetDesc: "Controle contas a pagar e receber sem custo.",
    language: "Idioma",
    ctaTitle: "Sua plataforma de IA para conversar, criar e crescer.",
    ctaDesc:
      "Use a Aurora IA para conversar, gerar imagens, criar campanhas, explorar criações públicas e organizar seu financeiro.",
  },
  en: {
    welcome: "Welcome to Aurora AI",
    title: "Aurora AI Platform",
    subtitle: "Chat • Images • Marketing • Explore • Free spreadsheet",
    chatTitle: "Smart chat",
    chatDesc: "Talk to Aurora AI.",
    imageTitle: "Generate images",
    imageDesc: "Create AI images.",
    marketingTitle: "Marketing",
    marketingDesc: "Create campaigns.",
    exploreTitle: "Explore",
    exploreDesc: "See public images.",
    plansTitle: "Plans",
    plansDesc: "See available plans.",
    loginTitle: "Sign in",
    loginDesc: "Access your account.",
    sheetTitle: "Create your spreadsheet for free",
    sheetDesc: "Track payables and receivables at no cost.",
    language: "Language",
    ctaTitle: "Your AI platform to chat, create and grow.",
    ctaDesc:
      "Use Aurora AI to chat, generate images, create campaigns, explore public creations and organize your finances.",
  },
  es: {
    welcome: "Bienvenidos a Aurora IA",
    title: "Plataforma Aurora IA",
    subtitle: "Chat • Imágenes • Marketing • Explorar • Planilla gratis",
    chatTitle: "Chat inteligente",
    chatDesc: "Habla con Aurora IA.",
    imageTitle: "Generar imágenes",
    imageDesc: "Crea imágenes con IA.",
    marketingTitle: "Marketing",
    marketingDesc: "Crea campañas.",
    exploreTitle: "Explorar",
    exploreDesc: "Mira imágenes públicas.",
    plansTitle: "Planes",
    plansDesc: "Conoce los planes.",
    loginTitle: "Entrar",
    loginDesc: "Accede a tu cuenta.",
    sheetTitle: "Crea tu planilla gratis",
    sheetDesc: "Controla cuentas por pagar y por cobrar sin costo.",
    language: "Idioma",
    ctaTitle: "Tu plataforma de IA para conversar, crear y crecer.",
    ctaDesc:
      "Usa Aurora IA para conversar, generar imágenes, crear campañas, explorar creaciones públicas y organizar tus finanzas.",
  },
} as const;

function detectBrowserLanguage(): Language {
  if (typeof navigator === "undefined") return "pt";

  const value = (navigator.language || "pt").toLowerCase();

  if (value.startsWith("en")) return "en";
  if (value.startsWith("es")) return "es";
  return "pt";
}

export default function HomePage() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [language, setLanguage] = useState<Language>("pt");

  useEffect(() => {
    const browserLanguage = detectBrowserLanguage();
    setLanguage(browserLanguage);

    const timer = window.setTimeout(() => {
      setPhase("platform");
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const t = useMemo(() => translations[language], [language]);

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at center,#12213e 0%,#070c1b 40%,#02040a 100%)",
        color: "#fff",
        fontFamily: "Arial, sans-serif",
        overflow: "hidden",
      }}
    >
      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        .line {
          position: absolute;
          height: 3px;
          background: linear-gradient(90deg, #00ffaa, #0099ff);
          box-shadow: 0 0 20px #00ffaa;
        }

        .l1 {
          top: 0;
          left: 0;
          width: 300px;
          transform: rotate(45deg);
          animation: l1 1.2s forwards;
        }

        .l2 {
          top: 0;
          right: 0;
          width: 300px;
          transform: rotate(-45deg);
          animation: l2 1.2s forwards;
        }

        .l3 {
          bottom: 0;
          left: 0;
          width: 300px;
          transform: rotate(-45deg);
          animation: l3 1.2s forwards;
        }

        .l4 {
          bottom: 0;
          right: 0;
          width: 300px;
          transform: rotate(45deg);
          animation: l4 1.2s forwards;
        }

        @keyframes l1 {
          from {
            transform: translate(-200px, -200px) rotate(45deg);
          }
          to {
            transform: translate(400px, 300px) rotate(45deg);
          }
        }

        @keyframes l2 {
          from {
            transform: translate(200px, -200px) rotate(-45deg);
          }
          to {
            transform: translate(-400px, 300px) rotate(-45deg);
          }
        }

        @keyframes l3 {
          from {
            transform: translate(-200px, 200px) rotate(-45deg);
          }
          to {
            transform: translate(400px, -300px) rotate(-45deg);
          }
        }

        @keyframes l4 {
          from {
            transform: translate(200px, 200px) rotate(45deg);
          }
          to {
            transform: translate(-400px, -300px) rotate(45deg);
          }
        }
      `}</style>

      {phase === "intro" && (
        <section
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            zIndex: 10,
            padding: 20,
            textAlign: "center",
          }}
        >
          <div className="line l1" />
          <div className="line l2" />
          <div className="line l3" />
          <div className="line l4" />

          <img
            src="/aurora-robot.png"
            alt="Aurora"
            style={{
              width: "min(220px, 62vw)",
              marginBottom: 20,
              filter: "drop-shadow(0 0 40px rgba(0,255,200,0.5))",
            }}
          />

          <h1
            style={{
              fontSize: "clamp(28px, 5vw, 42px)",
              margin: 0,
            }}
          >
            {t.welcome}
          </h1>
        </section>
      )}

      {phase === "platform" && (
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "20px 16px 40px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 16,
              flexWrap: "wrap",
              marginBottom: 24,
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "clamp(30px, 5vw, 42px)",
                  marginBottom: 10,
                  marginTop: 0,
                }}
              >
                {t.title}
              </h1>

              <p
                style={{
                  color: "#a9b4d0",
                  marginTop: 0,
                  marginBottom: 0,
                  fontSize: 16,
                }}
              >
                {t.subtitle}
              </p>
            </div>

            <div style={{ minWidth: 160 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: 8,
                  color: "#c7d2f2",
                  fontSize: 14,
                }}
              >
                {t.language}
              </label>

              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                style={{
                  width: "100%",
                  padding: 12,
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "#0f1730",
                  color: "#fff",
                  outline: "none",
                }}
              >
                <option value="pt">Português</option>
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
            </div>
          </div>

          <section
            style={{
              background: "rgba(17,24,45,0.78)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 20,
              padding: 22,
              marginBottom: 24,
              boxShadow: "0 10px 40px rgba(0,0,0,0.25)",
            }}
          >
            <h2
              style={{
                marginTop: 0,
                marginBottom: 10,
                fontSize: "clamp(24px, 4vw, 34px)",
              }}
            >
              {t.ctaTitle}
            </h2>

            <p
              style={{
                marginTop: 0,
                marginBottom: 0,
                color: "#c0cae4",
                lineHeight: 1.6,
                fontSize: 16,
              }}
            >
              {t.ctaDesc}
            </p>
          </section>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
              gap: 16,
            }}
          >
            <Link href="/chat" style={card}>
              <h3 style={cardTitle}>{t.chatTitle}</h3>
              <p style={cardText}>{t.chatDesc}</p>
            </Link>

            <Link href="/chat" style={card}>
              <h3 style={cardTitle}>{t.imageTitle}</h3>
              <p style={cardText}>{t.imageDesc}</p>
            </Link>

            <Link href="/chat" style={card}>
              <h3 style={cardTitle}>{t.marketingTitle}</h3>
              <p style={cardText}>{t.marketingDesc}</p>
            </Link>

            <Link href="/explorar" style={card}>
              <h3 style={cardTitle}>{t.exploreTitle}</h3>
              <p style={cardText}>{t.exploreDesc}</p>
            </Link>

            <Link href="/planilha" style={cardHighlight}>
              <h3 style={cardTitle}>{t.sheetTitle}</h3>
              <p style={cardText}>{t.sheetDesc}</p>
            </Link>

            <Link href="/planos" style={card}>
              <h3 style={cardTitle}>{t.plansTitle}</h3>
              <p style={cardText}>{t.plansDesc}</p>
            </Link>

            <Link href="/login" style={card}>
              <h3 style={cardTitle}>{t.loginTitle}</h3>
              <p style={cardText}>{t.loginDesc}</p>
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}

const card: React.CSSProperties = {
  background: "#11182d",
  padding: 20,
  borderRadius: 16,
  textDecoration: "none",
  color: "#fff",
  border: "1px solid rgba(255,255,255,0.1)",
  minHeight: 140,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
};

const cardHighlight: React.CSSProperties = {
  ...card,
  background: "linear-gradient(135deg, #15366d 0%, #10264a 100%)",
  border: "1px solid rgba(43,127,255,0.6)",
  boxShadow: "0 0 24px rgba(43,127,255,0.18)",
};

const cardTitle: React.CSSProperties = {
  marginTop: 0,
  marginBottom: 8,
  fontSize: 22,
};

const cardText: React.CSSProperties = {
  margin: 0,
  color: "#aab4d6",
  lineHeight: 1.5,
};