"use client";

import { useEffect } from "react";

type LocaleCode = "pt-BR" | "en" | "es";

const STORAGE_KEY = "aurora_locale";

function normalizeBrowserLanguage(language?: string | null): LocaleCode {
  const value = (language || "").toLowerCase();

  if (value.startsWith("en")) return "en";
  if (value.startsWith("es")) return "es";
  return "pt-BR";
}

function applyLocale(locale: LocaleCode) {
  if (typeof document === "undefined") return;
  document.documentElement.lang = locale;
}

export default function AuroraLanguageBoot() {
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY) as LocaleCode | null;

      if (saved === "pt-BR" || saved === "en" || saved === "es") {
        applyLocale(saved);
        return;
      }

      const detected = normalizeBrowserLanguage(navigator.language);
      window.localStorage.setItem(STORAGE_KEY, detected);
      applyLocale(detected);

      window.dispatchEvent(
        new CustomEvent("aurora-language-change", {
          detail: { locale: detected },
        })
      );
    } catch (error) {
      console.error("Aurora IA: erro ao detectar idioma automático.", error);
    }
  }, []);

  return null;
}