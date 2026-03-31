"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";

type CategoryItem = {
  id: string;
  company_id: string;
  name: string;
  type: string;
  color: string | null;
  description: string | null;
  is_active: boolean | null;
  sort_order: number | null;
  created_at: string | null;
  updated_at?: string | null;
};

type CategoriesResponse = {
  ok: boolean;
  error?: string;
  email?: string;
  companyId?: string;
  strategy?: string | null;
  items?: CategoryItem[];
  message?: string;
};

const FALLBACK_EMAIL = "grupoexecutivoservice1@gmail.com";

const typeOptions = [
  { value: "income", label: "Receita" },
  { value: "expense", label: "Despesa" },
  { value: "investment", label: "Investimento" },
  { value: "transfer", label: "Transferência" },
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

function formatTypeLabel(type: string): string {
  if (type === "income") return "Receita";
  if (type === "expense") return "Despesa";
  if (type === "investment") return "Investimento";
  if (type === "transfer") return "Transferência";
  return type || "-";
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

export default function FinanceCategoriesPage() {
  const [email, setEmail] = useState(FALLBACK_EMAIL);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [items, setItems] = useState<CategoryItem[]>([]);
  const [companyId, setCompanyId] = useState("");
  const [strategy, setStrategy] = useState("");
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [type, setType] = useState("expense");
  const [color, setColor] = useState("#22c55e");
  const [description, setDescription] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [isActive, setIsActive] = useState(true);

  const totals = useMemo(() => {
    const total = items.length;
    const active = items.filter((item) => item.is_active !== false).length;
    const income = items.filter((item) => item.type === "income").length;
    const expense = items.filter((item) => item.type === "expense").length;

    return { total, active, income, expense };
  }, [items]);

  async function loadCategories(mode: "initial" | "refresh" = "initial") {
    try {
      if (mode === "initial") setLoading(true);
      if (mode === "refresh") setRefreshing(true);

      setError("");
      setFeedback("");

      const resolvedEmail = getStoredEmail();
      setEmail(resolvedEmail);

      const response = await fetch(
        `${getBaseUrl()}/api/finance/categories?email=${encodeURIComponent(resolvedEmail)}`,
        {
          method: "GET",
          cache: "no-store",
        },
      );

      const data = (await response.json()) as CategoriesResponse;

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Não foi possível carregar as categorias.");
      }

      setItems(Array.isArray(data.items) ? data.items : []);
      setCompanyId(data.companyId || "");
      setStrategy(data.strategy || "");
      setFeedback(
        data.message ||
          "Categorias carregadas com sucesso. Sistema em constante atualização e pode haver momentos de instabilidade durante melhorias.",
      );
    } catch (loadError) {
      setItems([]);
      setCompanyId("");
      setStrategy("");
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Erro ao carregar categorias.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadCategories("initial");
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim()) {
      setError("Informe o nome da categoria.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setFeedback("");

      const resolvedEmail = getStoredEmail();
      setEmail(resolvedEmail);

      const response = await fetch(`${getBaseUrl()}/api/finance/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: resolvedEmail,
          name: name.trim(),
          type,
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
        throw new Error(data.error || "Não foi possível criar a categoria.");
      }

      setName("");
      setType("expense");
      setColor("#22c55e");
      setDescription("");
      setSortOrder("0");
      setIsActive(true);
      setFeedback(
        data.message ||
          "Categoria criada com sucesso. Sistema em constante atualização e pode haver momentos de instabilidade durante melhorias.",
      );

      await loadCategories("refresh");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Erro ao criar categoria.",
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
          "radial-gradient(circle at top, rgba(34,197,94,0.14), transparent 22%), linear-gradient(180deg, #06110c 0%, #08130f 38%, #030504 100%)",
        color: "#eaf7ee",
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
            background: "rgba(7, 18, 13, 0.82)",
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
                  background: "rgba(34,197,94,0.10)",
                  border: "1px solid rgba(34,197,94,0.28)",
                  color: "#86efac",
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
                Categorias financeiras editáveis por empresa
              </h1>

              <p
                style={{
                  margin: 0,
                  color: "rgba(234,247,238,0.82)",
                  fontSize: 16,
                  lineHeight: 1.65,
                }}
              >
                Estruture as categorias reais da empresa com liberdade para crescer
                sem travar nomenclaturas. Esta área faz parte da evolução do
                financeiro empresarial editável da Aurora. Sistema em constante
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
                  color: "#ecfdf5",
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
                onClick={() => loadCategories("refresh")}
                disabled={refreshing || loading}
                style={{
                  cursor: refreshing || loading ? "not-allowed" : "pointer",
                  opacity: refreshing || loading ? 0.7 : 1,
                  border: "1px solid rgba(34,197,94,0.28)",
                  background: "linear-gradient(135deg, #16a34a, #22c55e)",
                  color: "#04110a",
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
              label: "Categorias",
              value: String(totals.total),
              note: "Total carregado do backend real",
            },
            {
              label: "Ativas",
              value: String(totals.active),
              note: "Categorias disponíveis para uso",
            },
            {
              label: "Receitas",
              value: String(totals.income),
              note: "Estrutura de entradas da empresa",
            },
            {
              label: "Despesas",
              value: String(totals.expense),
              note: "Estrutura de saídas da empresa",
            },
          ].map((card) => (
            <div
              key={card.label}
              style={{
                borderRadius: 22,
                padding: 20,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(8, 19, 15, 0.88)",
              }}
            >
              <div
                style={{
                  color: "rgba(234,247,238,0.72)",
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
                  color: "rgba(234,247,238,0.62)",
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
              background: "rgba(8, 19, 15, 0.90)",
            }}
          >
            <h2
              style={{
                marginTop: 0,
                marginBottom: 8,
                fontSize: 24,
              }}
            >
              Nova categoria
            </h2>

            <p
              style={{
                marginTop: 0,
                color: "rgba(234,247,238,0.74)",
                lineHeight: 1.6,
                fontSize: 14,
              }}
            >
              Crie categorias flexíveis por empresa. Isso será a base para
              lançamentos, relatórios, atividades e centros de custo.
            </p>

            <form
              onSubmit={handleSubmit}
              style={{
                display: "grid",
                gap: 14,
              }}
            >
              <label style={{ display: "grid", gap: 8 }}>
                <span style={{ fontWeight: 700 }}>Nome da categoria</span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Ex.: Receitas Operacionais"
                  style={{
                    width: "100%",
                    borderRadius: 14,
                    border: "1px solid rgba(255,255,255,0.10)",
                    background: "rgba(255,255,255,0.04)",
                    color: "#ecfdf5",
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
                    color: "#ecfdf5",
                    padding: "14px 14px",
                    outline: "none",
                  }}
                >
                  {typeOptions.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      style={{ color: "#08130f" }}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "110px 1fr",
                  gap: 12,
                }}
              >
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
                      color: "#ecfdf5",
                      padding: "14px 14px",
                      outline: "none",
                    }}
                  />
                </label>
              </div>

              <label style={{ display: "grid", gap: 8 }}>
                <span style={{ fontWeight: 700 }}>Descrição</span>
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Ex.: Categoria base para entradas operacionais da empresa"
                  rows={4}
                  style={{
                    width: "100%",
                    borderRadius: 14,
                    border: "1px solid rgba(255,255,255,0.10)",
                    background: "rgba(255,255,255,0.04)",
                    color: "#ecfdf5",
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
                Categoria ativa
              </label>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  marginTop: 4,
                  cursor: submitting ? "not-allowed" : "pointer",
                  opacity: submitting ? 0.72 : 1,
                  border: "1px solid rgba(34,197,94,0.28)",
                  background: "linear-gradient(135deg, #16a34a, #22c55e)",
                  color: "#04110a",
                  borderRadius: 16,
                  padding: "14px 16px",
                  fontWeight: 900,
                  fontSize: 15,
                }}
              >
                {submitting ? "Salvando categoria..." : "Salvar categoria"}
              </button>
            </form>
          </div>

          <div
            style={{
              borderRadius: 24,
              padding: 22,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(8, 19, 15, 0.90)",
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
                  Categorias cadastradas
                </h2>
                <p
                  style={{
                    margin: "8px 0 0",
                    color: "rgba(234,247,238,0.72)",
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
                  color: "rgba(234,247,238,0.72)",
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
                  background: "rgba(34,197,94,0.12)",
                  border: "1px solid rgba(34,197,94,0.22)",
                  color: "#bbf7d0",
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
                  color: "rgba(234,247,238,0.74)",
                }}
              >
                Carregando categorias...
              </div>
            ) : items.length === 0 ? (
              <div
                style={{
                  borderRadius: 18,
                  padding: 24,
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.03)",
                  color: "rgba(234,247,238,0.74)",
                  lineHeight: 1.7,
                }}
              >
                Nenhuma categoria cadastrada ainda. Crie a primeira estrutura
                financeira editável da empresa para começar a organizar receitas,
                despesas, investimentos e futuras atividades.
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
                              background: item.color || "#22c55e",
                              display: "inline-block",
                              boxShadow: `0 0 0 4px ${item.color || "#22c55e"}22`,
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
                              background: "rgba(34,197,94,0.10)",
                              border: "1px solid rgba(34,197,94,0.20)",
                              color: "#bbf7d0",
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
                                  : "#eaf7ee",
                            }}
                          >
                            {item.is_active === false ? "Inativa" : "Ativa"}
                          </span>
                        </div>

                        <div
                          style={{
                            color: "rgba(234,247,238,0.72)",
                            lineHeight: 1.65,
                            fontSize: 14,
                          }}
                        >
                          {item.description || "Sem descrição informada."}
                        </div>
                      </div>

                      <div
                        style={{
                          minWidth: 220,
                          color: "rgba(234,247,238,0.68)",
                          fontSize: 13,
                          lineHeight: 1.7,
                        }}
                      >
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