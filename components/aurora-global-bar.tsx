"use client";

import { useMemo } from "react";
import { useAuroraGlobal } from "@/components/aurora-global-provider";

type AuroraGlobalBarProps = {
  title?: string;
  subtitle?: string;
  showNotice?: boolean;
  compact?: boolean;
};

export default function AuroraGlobalBar({
  title,
  subtitle,
  showNotice = true,
  compact = false,
}: AuroraGlobalBarProps) {
  const {
    locale,
    currency,
    texts,
    languages,
    currencies,
    applyLocale,
    applyCurrency,
    hydrated,
  } = useAuroraGlobal();

  const selectedLanguageLabel = useMemo(() => {
    return (
      languages.find((item) => item.code === locale)?.nativeLabel ??
      languages[0]?.nativeLabel ??
      "Português (Brasil)"
    );
  }, [languages, locale]);

  const selectedCurrencyLabel = useMemo(() => {
    const current = currencies.find((item) => item.code === currency);
    if (!current) return "BRL";
    return `${current.code} • ${current.symbol}`;
  }, [currencies, currency]);

  return (
    <section
      style={{
        width: "100%",
        border: "1px solid rgba(110, 231, 255, 0.16)",
        background:
          "linear-gradient(180deg, rgba(8,12,24,0.96) 0%, rgba(7,10,19,0.94) 100%)",
        boxShadow: "0 18px 60px rgba(0, 0, 0, 0.35)",
        borderRadius: compact ? 20 : 28,
        padding: compact ? "14px" : "18px",
        display: "flex",
        flexDirection: "column",
        gap: compact ? 12 : 16,
        backdropFilter: "blur(14px)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 14,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 220 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: 90,
                padding: "6px 10px",
                borderRadius: 999,
                background: "rgba(16, 185, 129, 0.12)",
                border: "1px solid rgba(16, 185, 129, 0.28)",
                color: "#a7f3d0",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 0.4,
              }}
            >
              {texts.betaLabel}
            </span>

            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "6px 10px",
                borderRadius: 999,
                background: "rgba(56, 189, 248, 0.1)",
                border: "1px solid rgba(56, 189, 248, 0.24)",
                color: "#bae6fd",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 0.4,
              }}
            >
              {texts.premiumExperience}
            </span>
          </div>

          <div>
            <h2
              style={{
                margin: 0,
                color: "#f8fafc",
                fontSize: compact ? 18 : 22,
                lineHeight: 1.15,
                fontWeight: 800,
              }}
            >
              {title ?? texts.appName}
            </h2>

            <p
              style={{
                margin: "6px 0 0",
                color: "rgba(226, 232, 240, 0.82)",
                fontSize: compact ? 13 : 14,
                lineHeight: 1.5,
              }}
            >
              {subtitle ??
                `${texts.privateByCompany} • ${texts.flexibleStructure} • ${texts.openNomenclatures}`}
            </p>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 12,
            width: "100%",
            maxWidth: compact ? "100%" : 520,
          }}
        >
          <label
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <span
              style={{
                color: "rgba(191, 219, 254, 0.92)",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 0.3,
              }}
            >
              {texts.selectLanguage}
            </span>

            <select
              aria-label={texts.selectLanguage}
              value={locale}
              onChange={(event) => applyLocale(event.target.value)}
              style={{
                width: "100%",
                minHeight: 46,
                borderRadius: 14,
                border: "1px solid rgba(148, 163, 184, 0.22)",
                background: "rgba(15, 23, 42, 0.92)",
                color: "#f8fafc",
                padding: "0 14px",
                fontSize: 14,
                fontWeight: 600,
                outline: "none",
              }}
            >
              {languages.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.shortLabel} • {item.nativeLabel}
                </option>
              ))}
            </select>
          </label>

          <label
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <span
              style={{
                color: "rgba(191, 219, 254, 0.92)",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 0.3,
              }}
            >
              {texts.selectCurrency}
            </span>

            <select
              aria-label={texts.selectCurrency}
              value={currency}
              onChange={(event) => applyCurrency(event.target.value)}
              style={{
                width: "100%",
                minHeight: 46,
                borderRadius: 14,
                border: "1px solid rgba(148, 163, 184, 0.22)",
                background: "rgba(15, 23, 42, 0.92)",
                color: "#f8fafc",
                padding: "0 14px",
                fontSize: 14,
                fontWeight: 600,
                outline: "none",
              }}
            >
              {currencies.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.code} • {item.symbol} • {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 10,
        }}
      >
        <div
          style={{
            borderRadius: 18,
            border: "1px solid rgba(148, 163, 184, 0.14)",
            background: "rgba(15, 23, 42, 0.58)",
            padding: "12px 14px",
          }}
        >
          <div
            style={{
              color: "rgba(148, 163, 184, 0.9)",
              fontSize: 12,
              fontWeight: 700,
              marginBottom: 4,
            }}
          >
            {texts.currentLanguage}
          </div>
          <div
            style={{
              color: "#f8fafc",
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            {hydrated ? selectedLanguageLabel : texts.loading}
          </div>
        </div>

        <div
          style={{
            borderRadius: 18,
            border: "1px solid rgba(148, 163, 184, 0.14)",
            background: "rgba(15, 23, 42, 0.58)",
            padding: "12px 14px",
          }}
        >
          <div
            style={{
              color: "rgba(148, 163, 184, 0.9)",
              fontSize: 12,
              fontWeight: 700,
              marginBottom: 4,
            }}
          >
            {texts.currentCurrency}
          </div>
          <div
            style={{
              color: "#f8fafc",
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            {hydrated ? selectedCurrencyLabel : texts.loading}
          </div>
        </div>

        <div
          style={{
            borderRadius: 18,
            border: "1px solid rgba(148, 163, 184, 0.14)",
            background: "rgba(15, 23, 42, 0.58)",
            padding: "12px 14px",
          }}
        >
          <div
            style={{
              color: "rgba(148, 163, 184, 0.9)",
              fontSize: 12,
              fontWeight: 700,
              marginBottom: 4,
            }}
          >
            {texts.customizableFinancial}
          </div>
          <div
            style={{
              color: "#86efac",
              fontSize: 14,
              fontWeight: 800,
            }}
          >
            {texts.flexibleStructure}
          </div>
        </div>
      </div>

      {showNotice ? (
        <div
          style={{
            borderRadius: 18,
            border: "1px solid rgba(250, 204, 21, 0.16)",
            background: "rgba(120, 53, 15, 0.16)",
            padding: "12px 14px",
            color: "#fde68a",
            fontSize: 13,
            lineHeight: 1.55,
            fontWeight: 600,
          }}
        >
          {texts.systemNotice}
        </div>
      ) : null}
    </section>
  );
}