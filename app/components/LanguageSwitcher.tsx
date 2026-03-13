"use client";

import { useEffect, useState } from "react";

export default function LanguageSwitcher() {
  const [lang, setLang] = useState("pt");

  useEffect(() => {
    const saved = localStorage.getItem("aurora_lang");
    if (saved) {
      setLang(saved);
      return;
    }

    const browserLang = (navigator.language || "").toLowerCase();

    if (browserLang.startsWith("en")) {
      setLang("en");
      localStorage.setItem("aurora_lang", "en");
      return;
    }

    if (browserLang.startsWith("es")) {
      setLang("es");
      localStorage.setItem("aurora_lang", "es");
      return;
    }

    setLang("pt");
    localStorage.setItem("aurora_lang", "pt");
  }, []);

  function changeLanguage(newLang: string) {
    setLang(newLang);
    localStorage.setItem("aurora_lang", newLang);
    window.location.reload();
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 16,
        right: 16,
        zIndex: 9999,
        background: "rgba(255,255,255,0.95)",
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
        aria-label="Selecionar idioma"
      >
        <option value="pt">🇧🇷 Português</option>
        <option value="en">🇺🇸 English</option>
        <option value="es">🇪🇸 Español</option>
      </select>
    </div>
  );
}