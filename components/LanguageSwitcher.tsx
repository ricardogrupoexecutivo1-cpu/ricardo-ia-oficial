"use client";

import { useEffect, useState } from "react";

type LocaleCode = "pt-BR" | "en" | "es";

const STORAGE_KEY = "aurora_locale";

const LANGUAGES: Array<{
  code: LocaleCode;
  short: string;
  label: string;
  flag: string;
}> = [
  { code: "pt-BR", short: "PT", label: "Português", flag: "🇧🇷" },
  { code: "en", short: "EN", label: "English", flag: "🇺🇸" },
  { code: "es", short: "ES", label: "Español", flag: "🇪🇸" },
];

function setDocumentLanguage(locale: LocaleCode) {
  if (typeof document === "undefined") return;
  document.documentElement.lang = locale;
}

export default function LanguageSwitcher() {
  const [locale, setLocale] = useState<LocaleCode>("pt-BR");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY) as LocaleCode | null;
      if (saved && LANGUAGES.some((item) => item.code === saved)) {
        setLocale(saved);
        setDocumentLanguage(saved);
      }
    } catch (error) {
      console.error("Aurora IA: erro ao ler idioma salvo.", error);
    }
  }, []);

  function handleChange(nextLocale: LocaleCode) {
    setLocale(nextLocale);
    setDocumentLanguage(nextLocale);

    try {
      window.localStorage.setItem(STORAGE_KEY, nextLocale);
      window.dispatchEvent(
        new CustomEvent("aurora-language-change", {
          detail: { locale: nextLocale },
        })
      );
    } catch (error) {
      console.error("Aurora IA: erro ao salvar idioma.", error);
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 12,
        left: 12,
        zIndex: 9999,
        display: "grid",
        gap: 8,
        maxWidth: 320,
      }}
    >
      <div
        style={{
          background: "rgba(5,10,16,0.82)",
          border: "1px solid rgba(255,255,255,0.10)",
          borderRadius: 16,
          padding: "10px 12px",
          boxShadow: "0 16px 40px rgba(0,0,0,0.30)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: 1,
            textTransform: "uppercase",
            color: "#7ee7b8",
            marginBottom: 8,
          }}
        >
          Aurora Global
        </div>

        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          {LANGUAGES.map((item) => {
            const active = locale === item.code;

            return (
              <button
                key={item.code}
                type="button"
                onClick={() => handleChange(item.code)}
                title={item.label}
                aria-label={item.label}
                style={{
                  border: active
                    ? "1px solid rgba(126,231,184,0.65)"
                    : "1px solid rgba(255,255,255,0.12)",
                  background: active
                    ? "rgba(126,231,184,0.18)"
                    : "rgba(255,255,255,0.05)",
                  color: "#f5fbff",
                  borderRadius: 12,
                  padding: "8px 10px",
                  fontWeight: 800,
                  fontSize: 12,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span aria-hidden="true">{item.flag}</span>
                <span>{item.short}</span>
              </button>
            );
          })}
        </div>

        <p
          style={{
            margin: "10px 0 0",
            fontSize: 12,
            lineHeight: 1.45,
            color: "rgba(235,242,250,0.78)",
          }}
        >
          Aurora speaks Portuguese, English and Spanish.
        </p>
      </div>
    </div>
  );
}