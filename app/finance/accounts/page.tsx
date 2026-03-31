"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";

type AccountItem = {
  id: string;
  company_id: string;
  name: string;
  type: string;
  currency: string | null;
  initial_balance: number | null;
  current_balance: number | null;
  color: string | null;
  description: string | null;
  is_active: boolean | null;
  sort_order: number | null;
  created_at: string | null;
  updated_at?: string | null;
};

type AccountsResponse = {
  ok: boolean;
  error?: string;
  email?: string;
  companyId?: string;
  strategy?: string | null;
  items?: AccountItem[];
  message?: string;
};

const FALLBACK_EMAIL = "grupoexecutivoservice1@gmail.com";

const typeOptions = [
  { value: "cash", label: "Caixa" },
  { value: "bank", label: "Banco" },
  { value: "pix", label: "PIX" },
  { value: "card", label: "Cartão" },
  { value: "digital", label: "Digital" },
  { value: "investment", label: "Investimento" },
  { value: "other", label: "Outros" },
];

function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

function getStoredEmail(): string {
  if (typeof window === "undefined") {
    return FALLBACK_EMAIL;
  }

  const candidates = [
    localStorage.getItem("aurora_user_email"),
    localStorage.getItem("userEmail"),
    localStorage.getItem("email"),
    localStorage.getItem("aurora_email"),
  ];

  const found = candidates.find((value) => String(value || "").trim());
  return String(found || FALLBACK_EMAIL).trim().toLowerCase();
}

function formatDate(value?: string | null): string {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

function formatMoney(value?: number | null, currency = "BRL"): string {
  const amount = Number(value || 0);

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: currency || "BRL",
  }).format(amount);
}

function formatTypeLabel(type: string): string {
  if (type === "cash") return "Caixa";
  if (type === "bank") return "Banco";
  if (type === "pix") return "PIX";
  if (type === "card") return "Cartão";
  if (type === "digital") return "Digital";
  if (type === "investment") return "Investimento";
  if (type === "other") return "Outros";
  return type || "-";
}

export default function FinanceAccountsPage() {
  const [email, setEmail] = useState(FALLBACK_EMAIL);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [items, setItems] = useState<AccountItem[]>([]);
  const [companyId, setCompanyId] = useState("");
  const [strategy, setStrategy] = useState("");
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [type, setType] = useState("cash");
  const [currency, setCurrency] = useState("BRL");
  const [initialBalance, setInitialBalance] = useState("0");
  const [currentBalance, setCurrentBalance] = useState("0");
  const [color, setColor] = useState("#f59e0b");
  const [description, setDescription] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [isActive, setIsActive] = useState(true);

  const totals = useMemo(() => {
    const total = items.length;
    const active = items.filter((item) => item.is_active !== false).length;
    const totalInitial = items.reduce(
      (acc, item) => acc + Number(item.initial_balance || 0),
      0,
    );
    const totalCurrent = items.reduce(
      (acc, item) => acc + Number(item.current_balance || 0),
      0,
    );

    return { total, active, totalInitial, totalCurrent };
  }, [items]);

  async function loadAccounts(mode: "initial" | "refresh" = "initial") {
    try {
      if (mode === "initial") setLoading(true);
      if (mode === "refresh") setRefreshing(true);

      setError("");
      setFeedback("");

      const resolvedEmail = getStoredEmail();
      setEmail(resolvedEmail);

      const response = await fetch(
        `${getBaseUrl()}/api/finance/accounts?email=${encodeURIComponent(resolvedEmail)}`,
        {
          method: "GET",
          cache: "no-store",
        },
      );

      const data = (await response.json()) as AccountsResponse;

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Não foi possível carregar as contas.");
      }

      setItems(Array.isArray(data.items) ? data.items : []);
      setCompanyId(data.companyId || "");
      setStrategy(data.strategy || "");
      setFeedback(
        data.message ||
          "Contas carregadas com sucesso. Sistema em constante atualização e pode haver momentos de instabilidade durante melhorias.",
      );
    } catch (loadError) {
      setItems([]);
      setCompanyId("");
      setStrategy("");
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Erro ao carregar contas.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadAccounts("initial");
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim()) {
      setError("Informe o nome da conta.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setFeedback("");

      const resolvedEmail = getStoredEmail();
      setEmail(resolvedEmail);

      const response = await fetch(`${getBaseUrl()}/api/finance/accounts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: resolvedEmail,
          name: name.trim(),
          type,
          currency,
          initial_balance: Number(initialBalance) || 0,
          current_balance: Number(currentBalance) || 0,
          color,
          description: description.trim(),
          sort_order: Number(sortOrder) || 0,
          is_active: isActive,
        }),
      });

      const data = (await response.json()) as {
        ok: boolean;
        error?: string;
        message?: string;
      };

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Não foi possível criar a conta.");
      }

      setName("");
      setType("cash");
      setCurrency("BRL");
      setInitialBalance("0");
      setCurrentBalance("0");
      setColor("#f59e0b");
      setDescription("");
      setSortOrder("0");
      setIsActive(true);
      setFeedback(
        data.message ||
          "Conta criada com sucesso. Sistema em constante atualização e pode haver momentos de instabilidade durante melhorias.",
      );

      await loadAccounts("refresh");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Erro ao criar conta.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(245,158,11,0.12), transparent 22%), linear-gradient(180deg, #140d03 0%, #171004 38%, #040302 100%)",
        color: "#fff8eb",
        padding: "32px 16px 80px",
      }}
    >
      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          display: "grid",
          gap: 18,
        }}
      >
        <section
          style={{
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(24, 16, 5, 0.84)",
            backdropFilter: "blur(12px)",
            borderRadius: 28,
            padding: 24,
            boxShadow: "0 18px 60px rgba(0,0,0,0.28)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              gap: 16,
              alignItems: "center",
            }}
          >
            <div style={{ maxWidth: 760 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 12px",
                  borderRadius: 999,
                  background: "rgba(245,158,11,0.10)",
                  border: "1px solid rgba(245,158,11,0.28)",
                  color: "#fcd34d",
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: 0.3,
                }}
              >
                Financeiro Aurora
              </div>

              <h1
                style={{
                  margin: "16px 0 10px",
                  fontSize: "clamp(28px, 5vw, 44px)",
                  lineHeight: 1.05,
                }}
              >
                Contas financeiras editáveis por empresa
              </h1>

              <p
                style={{
                  margin: 0,
                  color: "rgba(255,248,235,0.82)",
                  fontSize: 16,
                  lineHeight: 1.65,
                }}
              >
                Estruture caixa, banco, PIX, cartão, contas digitais, investimento
                e outras nomenclaturas reais da empresa. Sistema em constante
                atualização e pode haver momentos de instabilidade durante melhorias.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              <Link
                href="/finance"
                style={{
                  textDecoration: "none",
                  color: "#fff8eb",
                  border: "1px solid rgba(255,255,255,0.10)",
                  background: "rgba(255,255,255,0.04)",
                  borderRadius: 14,
                  padding: "12px 16px",
                  fontWeight: 700,
                }}
              >
                Voltar ao financeiro
              </Link>

              <button
                type="button"
                onClick={() => loadAccounts("refresh")}
                disabled={refreshing || loading}
                style={{
                  cursor: refreshing || loading ? "not-allowed" : "pointer",
                  opacity: refreshing || loading ? 0.7 : 1,
                  border: "1px solid rgba(245,158,11,0.28)",
                  background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
                  color: "#1a1103",
                  borderRadius: 14,
                  padding: "12px 16px",
                  fontWeight: 800,
                }}
              >
                {refreshing ? "Atualizando..." : "Atualizar"}
              </button>
            </div>
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 14,
          }}
        >
          {[
            {
              label: "Contas",
              value: String(totals.total),
              note: "Total carregado do backend real",
            },
            {
              label: "Ativas",
              value: String(totals.active),
              note: "Contas disponíveis para uso",
            },
            {
              label: "Saldo inicial",
              value: formatMoney(totals.totalInitial, "BRL"),
              note: "Soma base cadastrada",
            },
            {
              label: "Saldo atual",
              value: formatMoney(totals.totalCurrent, "BRL"),
              note: "Soma atual das contas",
            },
          ].map((card) => (
            <div
              key={card.label}
              style={{
                borderRadius: 22,
                padding: 20,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(23, 15, 4, 0.88)",
              }}
            >
              <div
                style={{
                  color: "rgba(255,248,235,0.72)",
                  fontSize: 13,
                  marginBottom: 10,
                }}
              >
                {card.label}
              </div>
              <div
                style={{
                  fontSize: 30,
                  fontWeight: 800,
                  marginBottom: 8,
                }}
              >
                {card.value}
              </div>
              <div
                style={{
                  color: "rgba(255,248,235,0.62)",
                  fontSize: 13,
                  lineHeight: 1.5,
                }}
              >
                {card.note}
              </div>
            </div>
          ))}
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(320px, 420px) minmax(0, 1fr)",
            gap: 18,
          }}
        >
          <div
            style={{
              borderRadius: 24,
              padding: 22,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(23, 15, 4, 0.90)",
            }}
          >
            <h2
              style={{
                marginTop: 0,
                marginBottom: 8,
                fontSize: 24,
              }}
            >
              Nova conta
            </h2>

            <p
              style={{
                marginTop: 0,
                color: "rgba(255,248,235,0.74)",
                lineHeight: 1.6,
                fontSize: 14,
              }}
            >
              Crie contas reais por empresa para sustentar os lançamentos
              financeiros com mais precisão.
            </p>

            <form
              onSubmit={handleSubmit}
              style={{
                display: "grid",
                gap: 14,
              }}
            >
              <label style={{ display: "grid", gap: 8 }}>
                <span style={{ fontWeight: 700 }}>Nome da conta</span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Ex.: Caixa Principal"
                  style={{
                    width: "100%",
                    borderRadius: 14,
                    border: "1px solid rgba(255,255,255,0.10)",
                    background: "rgba(255,255,255,0.04)",
                    color: "#fff8eb",
                    padding: "14px 14px",
                    outline: "none",
                  }}
                />
              </label>

              <label style={{ display: "grid", gap: 8 }}>
                <span style={{ fontWeight: 700 }}>Tipo</span>
                <select
                  value={type}
                  onChange={(event) => setType(event.target.value)}
                  style={{
                    width: "100%",
                    borderRadius: 14,
                    border: "1px solid rgba(255,255,255,0.10)",
                    background: "rgba(255,255,255,0.04)",
                    color: "#fff8eb",
                    padding: "14px 14px",
                    outline: "none",
                  }}
                >
                  {typeOptions.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      style={{ color: "#1a1103" }}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <label style={{ display: "grid", gap: 8 }}>
                  <span style={{ fontWeight: 700 }}>Moeda</span>
                  <input
                    value={currency}
                    onChange={(event) => setCurrency(event.target.value.toUpperCase())}
                    placeholder="BRL"
                    maxLength={5}
                    style={{
                      width: "100%",
                      borderRadius: 14,
                      border: "1px solid rgba(255,255,255,0.10)",
                      background: "rgba(255,255,255,0.04)",
                      color: "#fff8eb",
                      padding: "14px 14px",
                      outline: "none",
                    }}
                  />
                </label>

                <label style={{ display: "grid", gap: 8 }}>
                  <span style={{ fontWeight: 700 }}>Ordem</span>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(event) => setSortOrder(event.target.value)}
                    placeholder="0"
                    style={{
                      width: "100%",
                      borderRadius: 14,
                      border: "1px solid rgba(255,255,255,0.10)",
                      background: "rgba(255,255,255,0.04)",
                      color: "#fff8eb",
                      padding: "14px 14px",
                      outline: "none",
                    }}
                  />
                </label>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <label style={{ display: "grid", gap: 8 }}>
                  <span style={{ fontWeight: 700 }}>Saldo inicial</span>
                  <input
                    type="number"
                    step="0.01"
                    value={initialBalance}
                    onChange={(event) => setInitialBalance(event.target.value)}
                    placeholder="0"
                    style={{
                      width: "100%",
                      borderRadius: 14,
                      border: "1px solid rgba(255,255,255,0.10)",
                      background: "rgba(255,255,255,0.04)",
                      color: "#fff8eb",
                      padding: "14px 14px",
                      outline: "none",
                    }}
                  />
                </label>

                <label style={{ display: "grid", gap: 8 }}>
                  <span style={{ fontWeight: 700 }}>Saldo atual</span>
                  <input
                    type="number"
                    step="0.01"
                    value={currentBalance}
                    onChange={(event) => setCurrentBalance(event.target.value)}
                    placeholder="0"
                    style={{
                      width: "100%",
                      borderRadius: 14,
                      border: "1px solid rgba(255,255,255,0.10)",
                      background: "rgba(255,255,255,0.04)",
                      color: "#fff8eb",
                      padding: "14px 14px",
                      outline: "none",
                    }}
                  />
                </label>
              </div>

              <label style={{ display: "grid", gap: 8 }}>
                <span style={{ fontWeight: 700 }}>Cor</span>
                <input
                  type="color"
                  value={color}
                  onChange={(event) => setColor(event.target.value)}
                  style={{
                    width: "100%",
                    height: 48,
                    borderRadius: 14,
                    border: "1px solid rgba(255,255,255,0.10)",
                    background: "rgba(255,255,255,0.04)",
                    padding: 4,
                  }}
                />
              </label>

              <label style={{ display: "grid", gap: 8 }}>
                <span style={{ fontWeight: 700 }}>Descrição</span>
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Ex.: Conta principal de caixa da empresa"
                  rows={4}
                  style={{
                    width: "100%",
                    borderRadius: 14,
                    border: "1px solid rgba(255,255,255,0.10)",
                    background: "rgba(255,255,255,0.04)",
                    color: "#fff8eb",
                    padding: "14px 14px",
                    outline: "none",
                    resize: "vertical",
                  }}
                />
              </label>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  fontWeight: 700,
                }}
              >
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(event) => setIsActive(event.target.checked)}
                />
                Conta ativa
              </label>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  marginTop: 4,
                  cursor: submitting ? "not-allowed" : "pointer",
                  opacity: submitting ? 0.72 : 1,
                  border: "1px solid rgba(245,158,11,0.28)",
                  background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
                  color: "#1a1103",
                  borderRadius: 16,
                  padding: "14px 16px",
                  fontWeight: 900,
                  fontSize: 15,
                }}
              >
                {submitting ? "Salvando conta..." : "Salvar conta"}
              </button>
            </form>
          </div>

          <div
            style={{
              borderRadius: 24,
              padding: 22,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(23, 15, 4, 0.90)",
            }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 14,
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 14,
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: 24,
                  }}
                >
                  Contas cadastradas
                </h2>
                <p
                  style={{
                    margin: "8px 0 0",
                    color: "rgba(255,248,235,0.72)",
                    fontSize: 14,
                    lineHeight: 1.6,
                  }}
                >
                  E-mail em uso no fallback: {email || FALLBACK_EMAIL}
                </p>
              </div>

              <div
                style={{
                  textAlign: "right",
                  color: "rgba(255,248,235,0.72)",
                  fontSize: 13,
                  lineHeight: 1.6,
                }}
              >
                <div>Company ID: {companyId || "-"}</div>
                <div>Estratégia: {strategy || "-"}</div>
              </div>
            </div>

            {feedback ? (
              <div
                style={{
                  marginBottom: 14,
                  borderRadius: 14,
                  padding: "12px 14px",
                  background: "rgba(245,158,11,0.12)",
                  border: "1px solid rgba(245,158,11,0.22)",
                  color: "#fde68a",
                  lineHeight: 1.55,
                }}
              >
                {feedback}
              </div>
            ) : null}

            {error ? (
              <div
                style={{
                  marginBottom: 14,
                  borderRadius: 14,
                  padding: "12px 14px",
                  background: "rgba(239,68,68,0.12)",
                  border: "1px solid rgba(239,68,68,0.24)",
                  color: "#fecaca",
                  lineHeight: 1.55,
                }}
              >
                {error}
              </div>
            ) : null}

            {loading ? (
              <div
                style={{
                  borderRadius: 18,
                  padding: 24,
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.03)",
                  color: "rgba(255,248,235,0.74)",
                }}
              >
                Carregando contas...
              </div>
            ) : items.length === 0 ? (
              <div
                style={{
                  borderRadius: 18,
                  padding: 24,
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.03)",
                  color: "rgba(255,248,235,0.74)",
                  lineHeight: 1.7,
                }}
              >
                Nenhuma conta cadastrada ainda. Crie a primeira conta da empresa
                para organizar caixa, banco, PIX e outras entradas e saídas.
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gap: 12,
                }}
              >
                {items.map((item) => (
                  <article
                    key={item.id}
                    style={{
                      borderRadius: 18,
                      padding: 16,
                      border: "1px solid rgba(255,255,255,0.08)",
                      background: "rgba(255,255,255,0.03)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                        gap: 12,
                        alignItems: "flex-start",
                      }}
                    >
                      <div style={{ minWidth: 220, flex: 1 }}>
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                            gap: 10,
                            marginBottom: 10,
                          }}
                        >
                          <span
                            aria-hidden="true"
                            style={{
                              width: 14,
                              height: 14,
                              borderRadius: 999,
                              background: item.color || "#f59e0b",
                              display: "inline-block",
                              boxShadow: `0 0 0 4px ${item.color || "#f59e0b"}22`,
                            }}
                          />
                          <strong style={{ fontSize: 18 }}>
                            {item.name}
                          </strong>

                          <span
                            style={{
                              borderRadius: 999,
                              padding: "6px 10px",
                              fontSize: 12,
                              fontWeight: 800,
                              background: "rgba(245,158,11,0.10)",
                              border: "1px solid rgba(245,158,11,0.20)",
                              color: "#fde68a",
                            }}
                          >
                            {formatTypeLabel(item.type)}
                          </span>

                          <span
                            style={{
                              borderRadius: 999,
                              padding: "6px 10px",
                              fontSize: 12,
                              fontWeight: 800,
                              background:
                                item.is_active === false
                                  ? "rgba(239,68,68,0.10)"
                                  : "rgba(255,255,255,0.06)",
                              border:
                                item.is_active === false
                                  ? "1px solid rgba(239,68,68,0.22)"
                                  : "1px solid rgba(255,255,255,0.08)",
                              color:
                                item.is_active === false
                                  ? "#fecaca"
                                  : "#fff8eb",
                            }}
                          >
                            {item.is_active === false ? "Inativa" : "Ativa"}
                          </span>
                        </div>

                        <div
                          style={{
                            color: "rgba(255,248,235,0.72)",
                            lineHeight: 1.65,
                            fontSize: 14,
                            marginBottom: 12,
                          }}
                        >
                          {item.description || "Sem descrição informada."}
                        </div>

                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns:
                              "repeat(auto-fit, minmax(180px, 1fr))",
                            gap: 10,
                          }}
                        >
                          <div
                            style={{
                              borderRadius: 14,
                              padding: 12,
                              background: "rgba(255,255,255,0.03)",
                              border: "1px solid rgba(255,255,255,0.06)",
                            }}
                          >
                            <div
                              style={{
                                fontSize: 12,
                                color: "rgba(255,248,235,0.62)",
                                marginBottom: 6,
                              }}
                            >
                              Saldo inicial
                            </div>
                            <div
                              style={{
                                fontWeight: 800,
                                fontSize: 18,
                              }}
                            >
                              {formatMoney(item.initial_balance, item.currency || "BRL")}
                            </div>
                          </div>

                          <div
                            style={{
                              borderRadius: 14,
                              padding: 12,
                              background: "rgba(255,255,255,0.03)",
                              border: "1px solid rgba(255,255,255,0.06)",
                            }}
                          >
                            <div
                              style={{
                                fontSize: 12,
                                color: "rgba(255,248,235,0.62)",
                                marginBottom: 6,
                              }}
                            >
                              Saldo atual
                            </div>
                            <div
                              style={{
                                fontWeight: 800,
                                fontSize: 18,
                              }}
                            >
                              {formatMoney(item.current_balance, item.currency || "BRL")}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div
                        style={{
                          minWidth: 220,
                          color: "rgba(255,248,235,0.68)",
                          fontSize: 13,
                          lineHeight: 1.7,
                        }}
                      >
                        <div>Moeda: {item.currency || "BRL"}</div>
                        <div>Ordem: {item.sort_order ?? 0}</div>
                        <div>Criada em: {formatDate(item.created_at)}</div>
                        <div>Atualizada em: {formatDate(item.updated_at)}</div>
                        <div
                          style={{
                            wordBreak: "break-word",
                          }}
                        >
                          ID: {item.id}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}