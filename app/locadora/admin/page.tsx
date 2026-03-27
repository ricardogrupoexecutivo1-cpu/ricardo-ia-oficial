"use client";

import { useEffect, useState } from "react";

type DebugItem = {
  id: string;
  company_name?: string | null;
  title?: string | null;
  category?: string | null;
  city?: string | null;
  state?: string | null;
  active?: boolean | null;
  published?: boolean | null;
  approved?: boolean | null;
  contact_name?: string | null;
  contact_phone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  raw?: Record<string, unknown>;
};

type ApiResponse = {
  ok: boolean;
  items?: Array<Record<string, unknown>>;
  error?: string;
};

function asString(value: unknown) {
  if (value === null || value === undefined) return "";
  return String(value);
}

function asBoolean(value: unknown): boolean | null {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") {
    if (value === 1) return true;
    if (value === 0) return false;
  }
  if (typeof value === "string") {
    const v = value.trim().toLowerCase();
    if (["true", "1", "sim", "yes"].includes(v)) return true;
    if (["false", "0", "nao", "não", "no"].includes(v)) return false;
  }
  return null;
}

function pickString(row: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = asString(row[key]).trim();
    if (value) return value;
  }
  return "";
}

function pickBoolean(row: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = asBoolean(row[key]);
    if (value !== null) return value;
  }
  return null;
}

function normalizeRow(row: Record<string, unknown>): DebugItem {
  return {
    id: pickString(row, ["id"]) || crypto.randomUUID(),
    company_name: pickString(row, ["company_name", "empresa", "business_name", "name", "nome"]),
    title: pickString(row, ["title", "titulo"]),
    category: pickString(row, ["category", "categoria", "tipo", "segment", "seller_type"]),
    city: pickString(row, ["city", "cidade"]),
    state: pickString(row, ["state", "estado", "uf"]),
    active: pickBoolean(row, ["active", "ativo"]),
    published: pickBoolean(row, ["published", "publicado"]),
    approved: pickBoolean(row, ["approved", "aprovado"]),
    contact_name: pickString(row, ["contact_name", "responsavel", "responsável", "owner_name", "nome_contato"]),
    contact_phone: pickString(row, ["contact_phone", "phone", "telefone", "celular"]),
    whatsapp: pickString(row, ["whatsapp"]),
    email: pickString(row, ["email"]),
    raw: row,
  };
}

function boolLabel(value: boolean | null) {
  if (value === true) return "SIM";
  if (value === false) return "NÃO";
  return "NULO";
}

function boolStyle(value: boolean | null) {
  if (value === true) {
    return {
      border: "1px solid rgba(34,197,94,0.30)",
      background: "rgba(34,197,94,0.12)",
      color: "#bbf7d0",
    };
  }

  if (value === false) {
    return {
      border: "1px solid rgba(248,113,113,0.30)",
      background: "rgba(248,113,113,0.12)",
      color: "#fecaca",
    };
  }

  return {
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.05)",
    color: "#e5eef8",
  };
}

export default function LocadoraAdminPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [items, setItems] = useState<DebugItem[]>([]);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/locadora/buscar?limit=200", {
          cache: "no-store",
        });

        const data = (await response.json()) as ApiResponse;

        if (!response.ok || !data.ok) {
          if (!active) return;
          setError(data.error || "Erro ao carregar diagnóstico da locadora.");
          setItems([]);
          return;
        }

        const rawItems = Array.isArray(data.items) ? data.items : [];
        const normalized = rawItems.map(normalizeRow);

        if (!active) return;
        setItems(normalized);
      } catch (err) {
        if (!active) return;
        setError(
          err instanceof Error
            ? err.message
            : "Falha inesperada ao carregar o admin da locadora."
        );
        setItems([]);
      } finally {
        if (active) setLoading(false);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(59,130,246,0.16), transparent 24%), #050816",
        color: "#e5eef8",
        padding: "32px 16px 80px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1240,
          margin: "0 auto",
        }}
      >
        <section
          style={{
            borderRadius: 24,
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(7,12,28,0.88)",
            padding: 24,
            boxShadow: "0 18px 60px rgba(0,0,0,0.35)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 16,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 12px",
                  borderRadius: 999,
                  background: "rgba(59,130,246,0.12)",
                  border: "1px solid rgba(59,130,246,0.24)",
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                  color: "#93c5fd",
                  marginBottom: 14,
                }}
              >
                Admin diagnóstico da Locadora
              </div>

              <h1
                style={{
                  margin: 0,
                  fontSize: "clamp(28px, 5vw, 42px)",
                  lineHeight: 1.05,
                }}
              >
                Diagnóstico dos registros visíveis
              </h1>

              <p
                style={{
                  marginTop: 12,
                  marginBottom: 0,
                  color: "#9fb0c7",
                  fontSize: 16,
                  lineHeight: 1.65,
                  maxWidth: 860,
                }}
              >
                Esta tela ajuda a enxergar o que a busca pública está recebendo
                hoje e quais campos/status podem estar impedindo a exibição.
              </p>
            </div>

            <div
              style={{
                minWidth: 220,
                padding: 16,
                borderRadius: 18,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.03)",
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  color: "#8fb7ff",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: 0.4,
                  marginBottom: 8,
                }}
              >
                Status geral
              </div>
              <div style={{ fontSize: 24, fontWeight: 900 }}>
                {loading ? "Lendo..." : `${items.length} item(ns)`}
              </div>
              <div
                style={{
                  marginTop: 8,
                  color: "#9fb0c7",
                  fontSize: 13,
                  lineHeight: 1.5,
                }}
              >
                Sistema em constante atualização e expansão. Podem ocorrer
                momentos de instabilidade durante melhorias, ajustes e novos
                lançamentos.
              </div>
            </div>
          </div>
        </section>

        {error ? (
          <section
            style={{
              marginTop: 18,
              borderRadius: 18,
              border: "1px solid rgba(248,113,113,0.34)",
              background: "rgba(127,29,29,0.18)",
              padding: 18,
              color: "#fecaca",
              fontWeight: 700,
            }}
          >
            {error}
          </section>
        ) : null}

        {!loading && items.length === 0 ? (
          <section
            style={{
              marginTop: 18,
              borderRadius: 22,
              padding: 24,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(7,12,28,0.85)",
            }}
          >
            <div
              style={{
                fontSize: 22,
                fontWeight: 900,
                marginBottom: 10,
              }}
            >
              Nenhum registro visível retornado pela busca
            </div>
            <div
              style={{
                color: "#9fb0c7",
                lineHeight: 1.7,
                fontSize: 15,
                maxWidth: 820,
              }}
            >
              Isso normalmente significa uma destas situações: a tabela ainda
              está vazia, os registros foram salvos em outra tabela, ou existem
              status/campos impedindo a exibição pública.
            </div>
          </section>
        ) : null}

        <section
          style={{
            marginTop: 22,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 18,
          }}
        >
          {items.map((item) => (
            <article
              key={item.id}
              style={{
                borderRadius: 22,
                padding: 20,
                border: "1px solid rgba(255,255,255,0.08)",
                background:
                  "linear-gradient(180deg, rgba(10,15,34,0.95), rgba(6,10,24,0.92))",
                boxShadow: "0 16px 40px rgba(0,0,0,0.26)",
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  color: "#7dd3fc",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  marginBottom: 8,
                }}
              >
                {item.category || "Sem categoria"}
              </div>

              <h2
                style={{
                  margin: 0,
                  fontSize: 22,
                  lineHeight: 1.15,
                }}
              >
                {item.company_name || item.title || "Registro sem nome"}
              </h2>

              <div
                style={{
                  marginTop: 14,
                  display: "grid",
                  gap: 10,
                  color: "#dce9f8",
                  fontSize: 14,
                }}
              >
                {item.contact_name ? (
                  <div>
                    <strong>Contato:</strong> {item.contact_name}
                  </div>
                ) : null}

                {item.contact_phone ? (
                  <div>
                    <strong>Telefone:</strong> {item.contact_phone}
                  </div>
                ) : null}

                {item.whatsapp ? (
                  <div>
                    <strong>WhatsApp:</strong> {item.whatsapp}
                  </div>
                ) : null}

                {item.email ? (
                  <div>
                    <strong>E-mail:</strong> {item.email}
                  </div>
                ) : null}

                {(item.city || item.state) ? (
                  <div>
                    <strong>Local:</strong> {[item.city, item.state]
                      .filter(Boolean)
                      .join(" - ")}
                  </div>
                ) : null}
              </div>

              <div
                style={{
                  marginTop: 16,
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    ...boolStyle(item.active ?? null),
                    padding: "8px 10px",
                    borderRadius: 999,
                    fontWeight: 800,
                    fontSize: 12,
                  }}
                >
                  active: {boolLabel(item.active ?? null)}
                </span>

                <span
                  style={{
                    ...boolStyle(item.published ?? null),
                    padding: "8px 10px",
                    borderRadius: 999,
                    fontWeight: 800,
                    fontSize: 12,
                  }}
                >
                  published: {boolLabel(item.published ?? null)}
                </span>

                <span
                  style={{
                    ...boolStyle(item.approved ?? null),
                    padding: "8px 10px",
                    borderRadius: 999,
                    fontWeight: 800,
                    fontSize: 12,
                  }}
                >
                  approved: {boolLabel(item.approved ?? null)}
                </span>
              </div>

              <details
                style={{
                  marginTop: 16,
                  borderRadius: 14,
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.03)",
                  padding: 14,
                }}
              >
                <summary
                  style={{
                    cursor: "pointer",
                    fontWeight: 800,
                    color: "#dbeafe",
                  }}
                >
                  Ver dados brutos do registro
                </summary>

                <pre
                  style={{
                    marginTop: 14,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    color: "#cfe3ff",
                    fontSize: 12,
                    lineHeight: 1.6,
                  }}
                >
                  {JSON.stringify(item.raw, null, 2)}
                </pre>
              </details>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}