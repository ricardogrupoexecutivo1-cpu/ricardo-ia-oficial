"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";

type CostCenterItem = {
  id: string;
  company_id: string;
  name: string;
  code: string | null;
  color: string | null;
  description: string | null;
  is_active: boolean | null;
  sort_order: number | null;
  created_at: string | null;
  updated_at?: string | null;
};

type CostCentersResponse = {
  ok: boolean;
  error?: string;
  email?: string;
  companyId?: string;
  strategy?: string | null;
  items?: CostCenterItem[];
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

export default function FinanceCostCentersPage() {
  const [email, setEmail] = useState(FALLBACK_EMAIL);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [items, setItems] = useState<CostCenterItem[]>([]);
  const [companyId, setCompanyId] = useState("");
  const [strategy, setStrategy] = useState("");
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [color, setColor] = useState("#a855f7");
  const [description, setDescription] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [isActive, setIsActive] = useState(true);

  const totals = useMemo(() => {
    const total = items.length;
    const active = items.filter((item) => item.is_active !== false).length;
    const withCode = items.filter((item) => String(item.code || "").trim()).length;
    const withoutCode = items.filter((item) => !String(item.code || "").trim()).length;

    return { total, active, withCode, withoutCode };
  }, [items]);

  async function loadCostCenters(mode: "initial" | "refresh" = "initial") {
    try {
      if (mode === "initial") setLoading(true);
      if (mode === "refresh") setRefreshing(true);

      setError("");
      setFeedback("");

      const resolvedEmail = getStoredEmail();
      setEmail(resolvedEmail);

      const response = await fetch(
        `${getBaseUrl()}/api/finance/cost-centers?email=${encodeURIComponent(resolvedEmail)}`,
        {
          method: "GET",
          cache: "no-store",
        },
      );

      const data = (await response.json()) as CostCentersResponse;

      if (!response.ok || !data.ok) {
        throw new Error(
          data.error || "Não foi possível carregar os centros de custo.",
        );
      }

      setItems(Array.isArray(data.items) ? data.items : []);
      setCompanyId(data.companyId || "");
      setStrategy(data.strategy || "");
      setFeedback(
        data.message ||
          "Centros de custo carregados com sucesso. Sistema em constante atualização e pode haver momentos de instabilidade durante melhorias.",
      );
    } catch (loadError) {
      setItems([]);
      setCompanyId("");
      setStrategy("");
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Erro ao carregar centros de custo.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadCostCenters("initial");
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim()) {
      setError("Informe o nome do centro de custo.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setFeedback("");

      const resolvedEmail = getStoredEmail();
      setEmail(resolvedEmail);

      const response = await fetch(`${getBaseUrl()}/api/finance/cost-centers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: resolvedEmail,
          name: name.trim(),
          code: code.trim(),
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
        throw new Error(
          data.error || "Não foi possível criar o centro de custo.",
        );
      }

      setName("");
      setCode("");
      setColor("#a855f7");
      setDescription("");
      setSortOrder("0");
      setIsActive(true);
      setFeedback(
        data.message ||
          "Centro de custo criado com sucesso. Sistema em constante atualização e pode haver momentos de instabilidade durante melhorias.",
      );

      await loadCostCenters("refresh");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Erro ao criar centro de custo.",
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
          "radial-gradient(circle at top, rgba(168,85,247,0.14), transparent 22%), linear-gradient(180deg, #100615 0%, #130819 38%, #040205 100%)",
        color: "#f8efff",
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
            background: "rgba(19, 8, 25, 0.84)",
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
                  background: "rgba(168,85,247,0.10)",
                  border: "1px solid rgba(168,85,247,0.28)",
                  color: "#d8b4fe",
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
                Centros de custo editáveis por empresa
              </h1>

              <p
                style={{
                  margin: 0,
                  color: "rgba(248,239,255,0.82)",
                  fontSize: 16,
                  lineHeight: 1.65,
                }}
              >
                Estruture áreas como administrativo, marketing, operação, comercial,
                filial, frota e qualquer outra organização real da empresa. Sistema
                em constante atualização e pode haver momentos de instabilidade
                durante melhorias.
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
                  color: "#f8efff",
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
                onClick={() => loadCostCenters("refresh")}
                disabled={refreshing || loading}
                style={{
                  cursor: refreshing || loading ? "not-allowed" : "pointer",
                  opacity: refreshing || loading ? 0.7 : 1,
                  border: "1px solid rgba(168,85,247,0.28)",
                  background: "linear-gradient(135deg, #9333ea, #a855f7)",
                  color: "#14071b",
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
              label: "Centros de custo",
              value: String(totals.total),
              note: "Total carregado do backend real",
            },
            {
              label: "Ativos",
              value: String(totals.active),
              note: "Estruturas disponíveis para uso",
            },
            {
              label: "Com código",
              value: String(totals.withCode),
              note: "Centros organizados com identificação",
            },
            {
              label: "Sem código",
              value: String(totals.withoutCode),
              note: "Centros ainda livres para padronizar",
            },
          ].map((card) => (
            <div
              key={card.label}
              style={{
                borderRadius: 22,
                padding: 20,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(20, 9, 26, 0.88)",
              }}
            >
              <div
                style={{
                  color: "rgba(248,239,255,0.72)",
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
                  color: "rgba(248,239,255,0.62)",
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
              background: "rgba(20, 9, 26, 0.90)",
            }}
          >
            <h2
              style={{
                marginTop: 0,
                marginBottom: 8,
                fontSize: 24,
              }}
            >
              Novo centro de custo
            </h2>

            <p
              style={{
                marginTop: 0,
                color: "rgba(248,239,255,0.74)",
                lineHeight: 1.6,
                fontSize: 14,
              }}
            >
              Crie centros de custo reais por empresa para separar melhor a gestão
              financeira por área, unidade, operação ou objetivo interno.
            </p>

            <form
              onSubmit={handleSubmit}
              style={{
                display: "grid",
                gap: 14,
              }}
            >
              <label style={{ display: "grid", gap: 8 }}>
                <span style={{ fontWeight: 700 }}>Nome do centro de custo</span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Ex.: Administrativo"
                  style={{
                    width: "100%",
                    borderRadius: 14,
                    border: "1px solid rgba(255,255,255,0.10)",
                    background: "rgba(255,255,255,0.04)",
                    color: "#f8efff",
                    padding: "14px 14px",
                    outline: "none",
                  }}
                />
              </label>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 110px",
                  gap: 12,
                }}
              >
                <label style={{ display: "grid", gap: 8 }}>
                  <span style={{ fontWeight: 700 }}>Código</span>
                  <input
                    value={code}
                    onChange={(event) => setCode(event.target.value.toUpperCase())}
                    placeholder="Ex.: ADM"
                    style={{
                      width: "100%",
                      borderRadius: 14,
                      border: "1px solid rgba(255,255,255,0.10)",
                      background: "rgba(255,255,255,0.04)",
                      color: "#f8efff",
                      padding: "14px 14px",
                      outline: "none",
                    }}
                  />
                </label>

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
              </div>

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
                    color: "#f8efff",
                    padding: "14px 14px",
                    outline: "none",
                  }}
                />
              </label>

              <label style={{ display: "grid", gap: 8 }}>
                <span style={{ fontWeight: 700 }}>Descrição</span>
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Ex.: Centro de custo administrativo da empresa"
                  rows={4}
                  style={{
                    width: "100%",
                    borderRadius: 14,
                    border: "1px solid rgba(255,255,255,0.10)",
                    background: "rgba(255,255,255,0.04)",
                    color: "#f8efff",
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
                Centro de custo ativo
              </label>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  marginTop: 4,
                  cursor: submitting ? "not-allowed" : "pointer",
                  opacity: submitting ? 0.72 : 1,
                  border: "1px solid rgba(168,85,247,0.28)",
                  background: "linear-gradient(135deg, #9333ea, #a855f7)",
                  color: "#14071b",
                  borderRadius: 16,
                  padding: "14px 16px",
                  fontWeight: 900,
                  fontSize: 15,
                }}
              >
                {submitting ? "Salvando centro..." : "Salvar centro de custo"}
              </button>
            </form>
          </div>

          <div
            style={{
              borderRadius: 24,
              padding: 22,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(20, 9, 26, 0.90)",
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
                  Centros cadastrados
                </h2>
                <p
                  style={{
                    margin: "8px 0 0",
                    color: "rgba(248,239,255,0.72)",
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
                  color: "rgba(248,239,255,0.72)",
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
                  background: "rgba(168,85,247,0.12)",
                  border: "1px solid rgba(168,85,247,0.22)",
                  color: "#e9d5ff",
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
                  color: "rgba(248,239,255,0.74)",
                }}
              >
                Carregando centros de custo...
              </div>
            ) : items.length === 0 ? (
              <div
                style={{
                  borderRadius: 18,
                  padding: 24,
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.03)",
                  color: "rgba(248,239,255,0.74)",
                  lineHeight: 1.7,
                }}
              >
                Nenhum centro de custo cadastrado ainda. Crie a primeira estrutura
                para organizar melhor as áreas da empresa.
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
                              background: item.color || "#a855f7",
                              display: "inline-block",
                              boxShadow: `0 0 0 4px ${item.color || "#a855f7"}22`,
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
                              background: "rgba(168,85,247,0.10)",
                              border: "1px solid rgba(168,85,247,0.20)",
                              color: "#e9d5ff",
                            }}
                          >
                            Código: {item.code || "-"}
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
                                  : "#f8efff",
                            }}
                          >
                            {item.is_active === false ? "Inativo" : "Ativo"}
                          </span>
                        </div>

                        <div
                          style={{
                            color: "rgba(248,239,255,0.72)",
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
                          color: "rgba(248,239,255,0.68)",
                          fontSize: 13,
                          lineHeight: 1.7,
                        }}
                      >
                        <div>Ordem: {item.sort_order ?? 0}</div>
                        <div>Criado em: {formatDate(item.created_at)}</div>
                        <div>Atualizado em: {formatDate(item.updated_at)}</div>
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