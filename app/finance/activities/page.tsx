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

type ActivityItem = {
  id: string;
  company_id: string;
  category_id: string | null;
  name: string;
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
  items?: CategoryItem[];
};

type ActivitiesResponse = {
  ok: boolean;
  error?: string;
  email?: string;
  companyId?: string;
  strategy?: string | null;
  items?: ActivityItem[];
  message?: string;
};

const FALLBACK_EMAIL = "grupoexecutivoservice1@gmail.com";

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

export default function FinanceActivitiesPage() {
  const [email, setEmail] = useState(FALLBACK_EMAIL);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [items, setItems] = useState<ActivityItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [companyId, setCompanyId] = useState("");
  const [strategy, setStrategy] = useState("");
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [color, setColor] = useState("#38bdf8");
  const [description, setDescription] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [isActive, setIsActive] = useState(true);

  const categoryMap = useMemo(() => {
    return new Map(categories.map((category) => [category.id, category]));
  }, [categories]);

  const totals = useMemo(() => {
    const total = items.length;
    const active = items.filter((item) => item.is_active !== false).length;
    const linked = items.filter((item) => item.category_id).length;
    const unlinked = items.filter((item) => !item.category_id).length;

    return { total, active, linked, unlinked };
  }, [items]);

  async function loadAll(mode: "initial" | "refresh" = "initial") {
    try {
      if (mode === "initial") setLoading(true);
      if (mode === "refresh") setRefreshing(true);

      setError("");
      setFeedback("");

      const resolvedEmail = getStoredEmail();
      setEmail(resolvedEmail);

      const [activitiesResponse, categoriesResponse] = await Promise.all([
        fetch(
          `${getBaseUrl()}/api/finance/activities?email=${encodeURIComponent(resolvedEmail)}`,
          {
            method: "GET",
            cache: "no-store",
          },
        ),
        fetch(
          `${getBaseUrl()}/api/finance/categories?email=${encodeURIComponent(resolvedEmail)}`,
          {
            method: "GET",
            cache: "no-store",
          },
        ),
      ]);

      const activitiesData = (await activitiesResponse.json()) as ActivitiesResponse;
      const categoriesData = (await categoriesResponse.json()) as CategoriesResponse;

      if (!activitiesResponse.ok || !activitiesData.ok) {
        throw new Error(
          activitiesData.error || "Não foi possível carregar as atividades.",
        );
      }

      if (!categoriesResponse.ok || !categoriesData.ok) {
        throw new Error(
          categoriesData.error || "Não foi possível carregar as categorias.",
        );
      }

      setItems(Array.isArray(activitiesData.items) ? activitiesData.items : []);
      setCategories(Array.isArray(categoriesData.items) ? categoriesData.items : []);
      setCompanyId(activitiesData.companyId || "");
      setStrategy(activitiesData.strategy || "");
      setFeedback(
        activitiesData.message ||
          "Atividades carregadas com sucesso. Sistema em constante atualização e pode haver momentos de instabilidade durante melhorias.",
      );
    } catch (loadError) {
      setItems([]);
      setCategories([]);
      setCompanyId("");
      setStrategy("");
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Erro ao carregar atividades.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadAll("initial");
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim()) {
      setError("Informe o nome da atividade.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setFeedback("");

      const resolvedEmail = getStoredEmail();
      setEmail(resolvedEmail);

      const response = await fetch(`${getBaseUrl()}/api/finance/activities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: resolvedEmail,
          category_id: categoryId || null,
          name: name.trim(),
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
        throw new Error(data.error || "Não foi possível criar a atividade.");
      }

      setName("");
      setCategoryId("");
      setColor("#38bdf8");
      setDescription("");
      setSortOrder("0");
      setIsActive(true);
      setFeedback(
        data.message ||
          "Atividade criada com sucesso. Sistema em constante atualização e pode haver momentos de instabilidade durante melhorias.",
      );

      await loadAll("refresh");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Erro ao criar atividade.",
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
          "radial-gradient(circle at top, rgba(56,189,248,0.14), transparent 22%), linear-gradient(180deg, #051018 0%, #07131a 38%, #030506 100%)",
        color: "#eaf6ff",
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
            background: "rgba(7, 17, 24, 0.84)",
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
                  background: "rgba(56,189,248,0.10)",
                  border: "1px solid rgba(56,189,248,0.28)",
                  color: "#7dd3fc",
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
                Atividades financeiras editáveis por empresa
              </h1>

              <p
                style={{
                  margin: 0,
                  color: "rgba(234,246,255,0.82)",
                  fontSize: 16,
                  lineHeight: 1.65,
                }}
              >
                Estruture atividades como vendas, aluguel, manutenção, marketing,
                cobrança, operação e qualquer outra nomenclatura real da empresa.
                Sistema em constante atualização e pode haver momentos de
                instabilidade durante melhorias.
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
                  color: "#ecfeff",
                  border: "1px solid rgba(255,255,255,0.10)",
                  background: "rgba(255,255,255,0.04)",
                  borderRadius: 14,
                  padding: "12px 16px",
                  fontWeight: 700,
                }}
              >
                Voltar ao financeiro
              </Link>

              <Link
                href="/finance/categories"
                style={{
                  textDecoration: "none",
                  color: "#ecfeff",
                  border: "1px solid rgba(255,255,255,0.10)",
                  background: "rgba(255,255,255,0.04)",
                  borderRadius: 14,
                  padding: "12px 16px",
                  fontWeight: 700,
                }}
              >
                Ver categorias
              </Link>

              <button
                type="button"
                onClick={() => loadAll("refresh")}
                disabled={refreshing || loading}
                style={{
                  cursor: refreshing || loading ? "not-allowed" : "pointer",
                  opacity: refreshing || loading ? 0.7 : 1,
                  border: "1px solid rgba(56,189,248,0.28)",
                  background: "linear-gradient(135deg, #0ea5e9, #38bdf8)",
                  color: "#041019",
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
              label: "Atividades",
              value: String(totals.total),
              note: "Total carregado do backend real",
            },
            {
              label: "Ativas",
              value: String(totals.active),
              note: "Atividades disponíveis para uso",
            },
            {
              label: "Com categoria",
              value: String(totals.linked),
              note: "Atividades vinculadas a categorias",
            },
            {
              label: "Sem categoria",
              value: String(totals.unlinked),
              note: "Atividades ainda livres para organizar",
            },
          ].map((card) => (
            <div
              key={card.label}
              style={{
                borderRadius: 22,
                padding: 20,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(8, 18, 24, 0.88)",
              }}
            >
              <div
                style={{
                  color: "rgba(234,246,255,0.72)",
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
                  color: "rgba(234,246,255,0.62)",
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
              background: "rgba(8, 18, 24, 0.90)",
            }}
          >
            <h2
              style={{
                marginTop: 0,
                marginBottom: 8,
                fontSize: 24,
              }}
            >
              Nova atividade
            </h2>

            <p
              style={{
                marginTop: 0,
                color: "rgba(234,246,255,0.74)",
                lineHeight: 1.6,
                fontSize: 14,
              }}
            >
              Crie atividades reais por empresa e conecte com categorias quando
              fizer sentido. Isso prepara a base para lançamentos e relatórios.
            </p>

            <form
              onSubmit={handleSubmit}
              style={{
                display: "grid",
                gap: 14,
              }}
            >
              <label style={{ display: "grid", gap: 8 }}>
                <span style={{ fontWeight: 700 }}>Nome da atividade</span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Ex.: Venda de Veículos"
                  style={{
                    width: "100%",
                    borderRadius: 14,
                    border: "1px solid rgba(255,255,255,0.10)",
                    background: "rgba(255,255,255,0.04)",
                    color: "#ecfeff",
                    padding: "14px 14px",
                    outline: "none",
                  }}
                />
              </label>

              <label style={{ display: "grid", gap: 8 }}>
                <span style={{ fontWeight: 700 }}>Categoria vinculada</span>
                <select
                  value={categoryId}
                  onChange={(event) => setCategoryId(event.target.value)}
                  style={{
                    width: "100%",
                    borderRadius: 14,
                    border: "1px solid rgba(255,255,255,0.10)",
                    background: "rgba(255,255,255,0.04)",
                    color: "#ecfeff",
                    padding: "14px 14px",
                    outline: "none",
                  }}
                >
                  <option value="" style={{ color: "#081018" }}>
                    Sem categoria por enquanto
                  </option>
                  {categories.map((category) => (
                    <option
                      key={category.id}
                      value={category.id}
                      style={{ color: "#081018" }}
                    >
                      {category.name}
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
                      color: "#ecfeff",
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
                  placeholder="Ex.: Atividade financeira ligada à operação de vendas"
                  rows={4}
                  style={{
                    width: "100%",
                    borderRadius: 14,
                    border: "1px solid rgba(255,255,255,0.10)",
                    background: "rgba(255,255,255,0.04)",
                    color: "#ecfeff",
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
                Atividade ativa
              </label>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  marginTop: 4,
                  cursor: submitting ? "not-allowed" : "pointer",
                  opacity: submitting ? 0.72 : 1,
                  border: "1px solid rgba(56,189,248,0.28)",
                  background: "linear-gradient(135deg, #0ea5e9, #38bdf8)",
                  color: "#041019",
                  borderRadius: 16,
                  padding: "14px 16px",
                  fontWeight: 900,
                  fontSize: 15,
                }}
              >
                {submitting ? "Salvando atividade..." : "Salvar atividade"}
              </button>
            </form>
          </div>

          <div
            style={{
              borderRadius: 24,
              padding: 22,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(8, 18, 24, 0.90)",
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
                  Atividades cadastradas
                </h2>
                <p
                  style={{
                    margin: "8px 0 0",
                    color: "rgba(234,246,255,0.72)",
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
                  color: "rgba(234,246,255,0.72)",
                  fontSize: 13,
                  lineHeight: 1.6,
                }}
              >
                <div>Company ID: {companyId || "-"}</div>
                <div>Estratégia: {strategy || "-"}</div>
                <div>Categorias carregadas: {categories.length}</div>
              </div>
            </div>

            {feedback ? (
              <div
                style={{
                  marginBottom: 14,
                  borderRadius: 14,
                  padding: "12px 14px",
                  background: "rgba(56,189,248,0.12)",
                  border: "1px solid rgba(56,189,248,0.22)",
                  color: "#bae6fd",
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
                  color: "rgba(234,246,255,0.74)",
                }}
              >
                Carregando atividades...
              </div>
            ) : items.length === 0 ? (
              <div
                style={{
                  borderRadius: 18,
                  padding: 24,
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.03)",
                  color: "rgba(234,246,255,0.74)",
                  lineHeight: 1.7,
                }}
              >
                Nenhuma atividade cadastrada ainda. Crie a primeira atividade da
                empresa para estruturar melhor o financeiro editável e preparar
                relatórios mais avançados.
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gap: 12,
                }}
              >
                {items.map((item) => {
                  const linkedCategory = item.category_id
                    ? categoryMap.get(item.category_id)
                    : null;

                  return (
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
                                background: item.color || "#38bdf8",
                                display: "inline-block",
                                boxShadow: `0 0 0 4px ${item.color || "#38bdf8"}22`,
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
                                background:
                                  linkedCategory
                                    ? "rgba(34,197,94,0.10)"
                                    : "rgba(255,255,255,0.06)",
                                border:
                                  linkedCategory
                                    ? "1px solid rgba(34,197,94,0.20)"
                                    : "1px solid rgba(255,255,255,0.08)",
                                color:
                                  linkedCategory ? "#bbf7d0" : "#eaf6ff",
                              }}
                            >
                              {linkedCategory
                                ? `Categoria: ${linkedCategory.name}`
                                : "Sem categoria"}
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
                                    : "rgba(56,189,248,0.10)",
                                border:
                                  item.is_active === false
                                    ? "1px solid rgba(239,68,68,0.22)"
                                    : "1px solid rgba(56,189,248,0.20)",
                                color:
                                  item.is_active === false
                                    ? "#fecaca"
                                    : "#bae6fd",
                              }}
                            >
                              {item.is_active === false ? "Inativa" : "Ativa"}
                            </span>
                          </div>

                          <div
                            style={{
                              color: "rgba(234,246,255,0.72)",
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
                            color: "rgba(234,246,255,0.68)",
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
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}