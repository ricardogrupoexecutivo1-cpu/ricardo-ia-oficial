"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type ReportRow = {
  label: string;
  value: string;
  detail: string;
};

const summaryCards: ReportRow[] = [
  {
    label: "Resultado",
    value: "Visão executiva",
    detail:
      "Leitura estratégica da operação para apoiar decisão, conferência e crescimento com mais clareza.",
  },
  {
    label: "Agrupamentos",
    value: "Análise organizada",
    detail:
      "Categorias, atividades, contas e centros de custo ajudam a enxergar melhor a realidade empresarial.",
  },
  {
    label: "Relatórios",
    value: "Base premium",
    detail:
      "A estrutura foi pensada para evoluir com mais inteligência financeira, filtros e leitura gerencial.",
  },
];

const supportCards: ReportRow[] = [
  {
    label: "Lançamentos",
    value: "Conferência operacional",
    detail:
      "Acompanhe a origem dos números com mais segurança ao navegar pelos lançamentos reais da empresa.",
  },
  {
    label: "Hub financeiro",
    value: "Navegação central",
    detail:
      "Volte ao hub para acessar categorias, atividades, contas e demais estruturas do financeiro privado.",
  },
  {
    label: "Exportação",
    value: "Leitura externa",
    detail:
      "A exportação ajuda a levar o relatório para auditoria, compartilhamento interno e análise complementar.",
  },
];

export default function FinanceReportsPage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [emailFallback] = useState("grupoexecutivoservice1@gmail.com");

  const currentRangeLabel = useMemo(() => {
    if (startDate && endDate) return `${startDate} até ${endDate}`;
    if (startDate) return `A partir de ${startDate}`;
    if (endDate) return `Até ${endDate}`;
    return "Período completo";
  }, [startDate, endDate]);

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(59,130,246,0.10), transparent 18%), radial-gradient(circle at right, rgba(16,185,129,0.10), transparent 24%), linear-gradient(180deg, #eef6ff 0%, #f7fbff 36%, #edf7f3 100%)",
        color: "#0f172a",
        overflow: "hidden",
      }}
    >
      <section
        style={{
          maxWidth: 1320,
          margin: "0 auto",
          padding: "18px 16px 72px",
          display: "grid",
          gap: 18,
        }}
      >
        <header
          style={{
            display: "grid",
            gap: 12,
            border: "1px solid rgba(15,23,42,0.08)",
            background: "rgba(255,255,255,0.78)",
            backdropFilter: "blur(14px)",
            borderRadius: 24,
            padding: "14px",
            boxShadow: "0 18px 42px rgba(15,23,42,0.07)",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "grid", gap: 4 }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 900,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#2563eb",
                }}
              >
                ricardoiaoficial.com
              </div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 900,
                  lineHeight: 1.2,
                  color: "#0f172a",
                }}
              >
                Financeiro Aurora • Relatórios
              </div>
            </div>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 36,
                padding: "0 12px",
                borderRadius: 999,
                background: "rgba(37,99,235,0.08)",
                border: "1px solid rgba(37,99,235,0.16)",
                color: "#2563eb",
                fontSize: 12,
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Sistema em evolução
            </div>
          </div>

          <nav
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <Link href="/" style={topLinkStyle}>
              Home
            </Link>
            <Link href="/finance" style={topLinkStyle}>
              Hub financeiro
            </Link>
            <Link href="/finance/entries" style={topLinkStyle}>
              Lançamentos
            </Link>
            <Link href="/financeiro" style={topLinkStyle}>
              Financeiro Aurora
            </Link>
            <Link href="/chat" style={topLinkStyle}>
              Chat Aurora
            </Link>
          </nav>
        </header>

        <section
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: 32,
            border: "1px solid rgba(15,23,42,0.08)",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.88), rgba(255,255,255,0.74))",
            boxShadow: "0 22px 70px rgba(15,23,42,0.09)",
            padding: "28px 20px 22px",
            display: "grid",
            gap: 22,
          }}
        >
          <div style={heroGlowBlue} />
          <div style={heroGlowGreen} />
          <div style={heroGridStyle} />

          <div
            style={{
              position: "relative",
              zIndex: 1,
              display: "grid",
              gap: 16,
              justifyItems: "start",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                width: "fit-content",
                alignItems: "center",
                gap: 8,
                padding: "8px 12px",
                borderRadius: 999,
                background: "rgba(37,99,235,0.08)",
                border: "1px solid rgba(37,99,235,0.16)",
                color: "#2563eb",
                fontSize: 12,
                fontWeight: 900,
                boxShadow: "0 0 16px rgba(37,99,235,0.06)",
              }}
            >
              Relatórios premium do financeiro
            </div>

            <div style={{ display: "grid", gap: 12, maxWidth: 960 }}>
              <h1
                style={{
                  margin: 0,
                  fontSize: "clamp(34px, 6vw, 68px)",
                  lineHeight: 0.95,
                  letterSpacing: "-0.05em",
                  color: "#0f172a",
                }}
              >
                Painel executivo com leitura mais clara, estratégica e empresarial
              </h1>

              <p
                style={{
                  margin: 0,
                  color: "rgba(15,23,42,0.74)",
                  fontSize: 18,
                  lineHeight: 1.7,
                  fontWeight: 700,
                  maxWidth: 980,
                }}
              >
                Esta tela foi criada para apoiar decisão, conferência e expansão
                premium do Financeiro Aurora. O objetivo é transformar os
                lançamentos reais da empresa em leitura mais clara para gestão.
                Sistema em constante atualização e pode haver momentos de
                instabilidade durante melhorias.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <Link href="/finance" style={primaryButtonStyle}>
                Voltar ao hub
              </Link>
              <Link href="/finance/entries" style={secondaryButtonStyle}>
                Ver lançamentos
              </Link>
              <button type="button" style={secondaryButtonStyleButton}>
                Exportar CSV
              </button>
              <button type="button" style={secondaryButtonStyleButton}>
                Atualizar relatórios
              </button>
            </div>
          </div>

          <div
            style={{
              position: "relative",
              zIndex: 1,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 12,
            }}
          >
            {summaryCards.map((item) => (
              <div key={item.label} style={statCardStyle}>
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 900,
                    color: "#0f172a",
                    lineHeight: 1,
                  }}
                >
                  {item.value}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 900,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: "#2563eb",
                  }}
                >
                  {item.label}
                </div>
                <div
                  style={{
                    color: "rgba(15,23,42,0.68)",
                    lineHeight: 1.7,
                    fontSize: 14,
                  }}
                >
                  {item.detail}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 18,
          }}
        >
          <div style={panelStyle}>
            <div style={sectionBadgeStyle}>Filtros do relatório</div>

            <h2
              style={{
                margin: 0,
                fontSize: "clamp(26px, 4vw, 42px)",
                lineHeight: 1.02,
                color: "#0f172a",
                letterSpacing: "-0.04em",
              }}
            >
              Ajuste o período e refine a leitura da operação
            </h2>

            <p style={sectionTextStyle}>
              Os filtros ajudam a transformar a leitura do financeiro em visão
              mais útil para conferência, acompanhamento e tomada de decisão.
            </p>

            <div
              style={{
                borderRadius: 22,
                border: "1px solid rgba(15,23,42,0.08)",
                background: "rgba(255,255,255,0.86)",
                padding: "16px 14px",
                display: "grid",
                gap: 12,
                boxShadow: "0 10px 24px rgba(15,23,42,0.04)",
              }}
            >
              <div
                style={{
                  color: "rgba(15,23,42,0.70)",
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                E-mail em uso no fallback:{" "}
                <span style={{ color: "#0f172a", fontWeight: 900 }}>
                  {emailFallback}
                </span>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 12,
                }}
              >
                <label style={fieldWrapStyle}>
                  <span style={fieldLabelStyle}>Data inicial</span>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(event) => setStartDate(event.target.value)}
                    style={inputStyle}
                  />
                </label>

                <label style={fieldWrapStyle}>
                  <span style={fieldLabelStyle}>Data final</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(event) => setEndDate(event.target.value)}
                    style={inputStyle}
                  />
                </label>
              </div>

              <div style={periodCardStyle}>
                <div style={periodTitleStyle}>Período em análise</div>
                <div style={periodValueStyle}>{currentRangeLabel}</div>
                <div style={periodTextStyle}>
                  Use essa faixa para apoiar leitura executiva, comparação e
                  conferência do financeiro empresarial.
                </div>
              </div>
            </div>
          </div>

          <div style={panelStyle}>
            <div style={sectionBadgeStyle}>Apoio executivo</div>

            <h3
              style={{
                margin: 0,
                fontSize: 24,
                lineHeight: 1.08,
                color: "#0f172a",
              }}
            >
              Navegação complementar dos relatórios
            </h3>

            <div
              style={{
                display: "grid",
                gap: 10,
              }}
            >
              {supportCards.map((item) => (
                <div key={item.label} style={quickCardStaticStyle}>
                  <div style={quickCardTitleStyle}>{item.value}</div>
                  <div
                    style={{
                      ...quickCardTextStyle,
                      fontWeight: 900,
                      color: "#2563eb",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      fontSize: 12,
                    }}
                  >
                    {item.label}
                  </div>
                  <div style={quickCardTextStyle}>{item.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          style={{
            borderRadius: 28,
            border: "1px solid rgba(15,23,42,0.08)",
            background:
              "linear-gradient(135deg, rgba(37,99,235,0.06), rgba(16,185,129,0.06))",
            boxShadow: "0 18px 44px rgba(15,23,42,0.07)",
            padding: "22px 18px",
            display: "grid",
            gap: 12,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "clamp(22px, 4vw, 30px)",
              fontWeight: 900,
              lineHeight: 1.08,
              color: "#0f172a",
            }}
          >
            Relatórios prontos para apoiar decisão com mais clareza e valor
          </div>

          <div
            style={{
              maxWidth: 920,
              margin: "0 auto",
              color: "rgba(15,23,42,0.68)",
              lineHeight: 1.7,
              fontSize: 15,
            }}
          >
            A plataforma está em constante atualização e pode passar por
            momentos de instabilidade durante melhorias. Mesmo assim, a tela de
            relatórios já foi reorganizada no padrão claro oficial Aurora para
            fortalecer leitura executiva e gestão financeira.
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <Link href="/finance" style={primaryButtonStyle}>
              Voltar ao hub
            </Link>
            <Link href="/finance/entries" style={secondaryButtonStyle}>
              Abrir lançamentos
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}

const heroGlowBlue: React.CSSProperties = {
  position: "absolute",
  top: -140,
  right: -100,
  width: 420,
  height: 420,
  borderRadius: 999,
  background:
    "radial-gradient(circle, rgba(59,130,246,0.12) 0%, rgba(59,130,246,0.04) 44%, transparent 72%)",
  filter: "blur(24px)",
  pointerEvents: "none",
};

const heroGlowGreen: React.CSSProperties = {
  position: "absolute",
  bottom: -120,
  left: -90,
  width: 380,
  height: 380,
  borderRadius: 999,
  background:
    "radial-gradient(circle, rgba(16,185,129,0.10) 0%, rgba(16,185,129,0.03) 45%, transparent 72%)",
  filter: "blur(22px)",
  pointerEvents: "none",
};

const heroGridStyle: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  backgroundImage:
    "linear-gradient(rgba(15,23,42,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.022) 1px, transparent 1px)",
  backgroundSize: "42px 42px",
  opacity: 0.24,
  pointerEvents: "none",
};

const topLinkStyle: React.CSSProperties = {
  textDecoration: "none",
  color: "#0f172a",
  border: "1px solid rgba(15,23,42,0.08)",
  background: "rgba(255,255,255,0.68)",
  borderRadius: 999,
  padding: "10px 14px",
  fontWeight: 800,
  fontSize: 13,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 8px 16px rgba(15,23,42,0.04)",
};

const primaryButtonStyle: React.CSSProperties = {
  textDecoration: "none",
  color: "#ffffff",
  background: "linear-gradient(135deg, #2563eb, #3b82f6)",
  border: "1px solid rgba(37,99,235,0.16)",
  borderRadius: 16,
  padding: "13px 16px",
  fontWeight: 900,
  fontSize: 14,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 14px 30px rgba(37,99,235,0.16)",
};

const secondaryButtonStyle: React.CSSProperties = {
  textDecoration: "none",
  color: "#0f172a",
  background: "rgba(255,255,255,0.78)",
  border: "1px solid rgba(15,23,42,0.08)",
  borderRadius: 16,
  padding: "13px 16px",
  fontWeight: 800,
  fontSize: 14,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 10px 22px rgba(15,23,42,0.05)",
};

const secondaryButtonStyleButton: React.CSSProperties = {
  color: "#0f172a",
  background: "rgba(255,255,255,0.78)",
  border: "1px solid rgba(15,23,42,0.08)",
  borderRadius: 16,
  padding: "13px 16px",
  fontWeight: 800,
  fontSize: 14,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 10px 22px rgba(15,23,42,0.05)",
  cursor: "pointer",
};

const statCardStyle: React.CSSProperties = {
  borderRadius: 24,
  padding: "18px 16px",
  border: "1px solid rgba(15,23,42,0.08)",
  background: "rgba(255,255,255,0.76)",
  display: "grid",
  gap: 8,
  boxShadow: "0 14px 30px rgba(15,23,42,0.05)",
};

const panelStyle: React.CSSProperties = {
  borderRadius: 28,
  border: "1px solid rgba(15,23,42,0.08)",
  background: "rgba(255,255,255,0.80)",
  boxShadow: "0 18px 42px rgba(15,23,42,0.06)",
  padding: "22px 18px",
  display: "grid",
  gap: 14,
};

const sectionBadgeStyle: React.CSSProperties = {
  display: "inline-flex",
  width: "fit-content",
  minHeight: 34,
  alignItems: "center",
  justifyContent: "center",
  padding: "0 12px",
  borderRadius: 999,
  background: "rgba(37,99,235,0.08)",
  border: "1px solid rgba(37,99,235,0.16)",
  color: "#2563eb",
  fontSize: 12,
  fontWeight: 900,
};

const sectionTextStyle: React.CSSProperties = {
  margin: 0,
  color: "rgba(15,23,42,0.70)",
  lineHeight: 1.75,
  fontSize: 15,
};

const fieldWrapStyle: React.CSSProperties = {
  display: "grid",
  gap: 6,
};

const fieldLabelStyle: React.CSSProperties = {
  color: "#0f172a",
  fontSize: 14,
  fontWeight: 800,
};

const inputStyle: React.CSSProperties = {
  minHeight: 48,
  borderRadius: 14,
  border: "1px solid rgba(15,23,42,0.10)",
  background: "rgba(255,255,255,0.96)",
  padding: "0 14px",
  fontSize: 14,
  color: "#0f172a",
  outline: "none",
  boxShadow: "0 8px 20px rgba(15,23,42,0.03)",
};

const periodCardStyle: React.CSSProperties = {
  borderRadius: 18,
  border: "1px solid rgba(15,23,42,0.08)",
  background: "linear-gradient(135deg, rgba(37,99,235,0.05), rgba(16,185,129,0.05))",
  padding: "16px 14px",
  display: "grid",
  gap: 6,
};

const periodTitleStyle: React.CSSProperties = {
  color: "#2563eb",
  fontSize: 12,
  fontWeight: 900,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const periodValueStyle: React.CSSProperties = {
  color: "#0f172a",
  fontSize: 22,
  fontWeight: 900,
  lineHeight: 1.1,
};

const periodTextStyle: React.CSSProperties = {
  color: "rgba(15,23,42,0.68)",
  lineHeight: 1.7,
  fontSize: 14,
};

const quickCardStaticStyle: React.CSSProperties = {
  borderRadius: 22,
  border: "1px solid rgba(15,23,42,0.08)",
  background: "rgba(255,255,255,0.86)",
  padding: "16px 14px",
  display: "grid",
  gap: 8,
  boxShadow: "0 10px 24px rgba(15,23,42,0.04)",
};

const quickCardTitleStyle: React.CSSProperties = {
  color: "#0f172a",
  fontSize: 16,
  fontWeight: 900,
  lineHeight: 1.1,
};

const quickCardTextStyle: React.CSSProperties = {
  color: "rgba(15,23,42,0.68)",
  lineHeight: 1.7,
  fontSize: 14,
};