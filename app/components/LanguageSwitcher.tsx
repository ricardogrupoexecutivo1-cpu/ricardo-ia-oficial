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
    const langValue = (newLang as Lang) || "pt";
    localStorage.setItem("aurora_lang", langValue);
    setLang(langValue);
    window.location.reload();
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 16,
        right: 16,
        zIndex: 9999,
        background: "rgba(255,255,255,0.96)",
        border: "1px solid #ddd",
        borderRadius: 12,
        padding: 8,
        boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
      }}
    >
      <select
        value={lang}
        onChange={(e) => changeLanguage(e.target.value)}
        style={{
          border: "none",
          background: "transparent",
          fontSize: 14,
          outline: "none",
          cursor: "pointer",
        }}
        aria-label="Select language"
      >
        <option value="pt">🇧🇷 Português</option>
        <option value="en">🇺🇸 English</option>
        <option value="es">🇪🇸 Español</option>
      </select>
    </div>
  );
}