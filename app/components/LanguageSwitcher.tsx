"use client";

import { useEffect, useState } from "react";

type Lang = "pt" | "en" | "es";

export default function LanguageSwitcher() {
  const [lang, setLang] = useState<Lang>("pt");

  useEffect(() => {
    const saved = localStorage.getItem("aurora_lang") as Lang | null;

    if (saved === "pt" || saved === "en" || saved === "es") {
      setLang(saved);
      return;
    }

    const browserLang = (navigator.language || "").toLowerCase();

    if (browserLang.startsWith("en")) {
      localStorage.setItem("aurora_lang", "en");
      setLang("en");
      return;
    }

    if (browserLang.startsWith("es")) {
      localStorage.setItem("aurora_lang", "es");
      setLang("es");
      return;
    }

    localStorage.setItem("aurora_lang", "pt");
    setLang("pt");
  }, []);

  function changeLanguage(newLang: string) {
    const value = (newLang as Lang) || "pt";
    localStorage.setItem("aurora_lang", value);
    setLang(value);
    window.location.reload();
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 16,
        right: 16,
        zIndex: 9999,
        background: "rgba(15, 23, 42, 0.92)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 12,
        padding: 8,
        boxShadow: "0 10px 24px rgba(0,0,0,0.25)",
        backdropFilter: "blur(8px)",
      }}
    >
      <select
        value={lang}
        onChange={(e) => changeLanguage(e.target.value)}
        style={{
          border: "none",
          background: "transparent",
          color: "white",
          fontSize: 14,
          outline: "none",
          cursor: "pointer",
        }}
        aria-label="Selecionar idioma"
      >
        <option value="pt" style={{ color: "black" }}>🇧🇷 Português</option>
        <option value="en" style={{ color: "black" }}>🇺🇸 English</option>
        <option value="es" style={{ color: "black" }}>🇪🇸 Español</option>
      </select>
    </div>
  );
}