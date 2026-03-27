"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type ClienteItem = {
  id: string;
  created_at?: string | null;
  nome?: string | null;
  cpf_cnpj?: string | null;
  telefone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  cidade?: string | null;
  estado?: string | null;
  endereco?: string | null;
  observacoes?: string | null;
  active?: boolean | null;
  published?: boolean | null;
  approved?: boolean | null;
};

type ApiResponse = {
  ok: boolean;
  items?: ClienteItem[];
  error?: string;
};

function formatDate(value?: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("pt-BR");
}

function normalizeText(value?: string | null) {
  return (value || "").toLowerCase().trim();
}

function boolLabel(value?: boolean | null) {
  if (value === true) return "SIM";
  if (value === false) return "NÃO";
  return "NULO";
}

function badgeStyle(value?: boolean | null): React.CSSProperties {
  if (value === true) {
    return {
      border: "1px solid rgba(34,197,94,0.28)",
      background: "rgba(34,197,94,0.12)",
      color: "#bbf7d0",
    };
  }

  if (value === false) {
    return {
      border: "1px solid rgba(248,113,113,0.28)",
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

export default function LocadoraClientesPage() {
  const [items, setItems] = useState<ClienteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/locadora/clientes", {
          cache: "no-store",
        });

        const data = (await response.json()) as ApiResponse;

        if (!response.ok || !data.ok) {
          if (!active) return;
          setError(data.error || "Erro ao carregar clientes.");
          setItems([]);
          return;
        }

        if (!active) return;
        setItems(Array.isArray(data.items) ? data.items : []);
      } catch (err) {
        if (!active) return;
        setError(
          err instanceof Error
            ? err.message
            : "Falha inesperada ao carregar clientes."
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

  const filteredItems = useMemo(() => {
    const term = normalizeText(query);

    if (!term) return items;

    return items.filter((item) => {
      const haystack = [
        item.nome,
        item.cpf_cnpj,
        item.telefone,
        item.whatsapp,
        item.email,
        item.cidade,
        item.estado,
        item.endereco,
        item.observacoes,
      ]
        .map((value) => normalizeText(value))
        .join(" ");

      return haystack.includes(term);
    });
  }, [items, query]);

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(34,197,94,0.14), transparent 0%, transparent 28%), radial-gradient(circle at right top, rgba(20,184,166,0.12), transparent 0%, transparent 22%), linear-gradient(180deg, #041018 0%, #02060d 100%)",
        color: "#eef6ff",
      }}
    >
      <section
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "24px 16px 88px",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 14px",
            borderRadius: 999,
            background: "rgba(34,197,94,0.10)",
            border: "1px solid rgba(34,197,94,0.24)",
            color: "#b9f7cf",
            fontWeight: 800,
            fontSize: 13,
            marginBottom: 20,
          }}
        >
          <span aria-hidden="true">📋</span>
          <span>Clientes cadastrados · Aurora Locadora</span>
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: "clamp(34px, 8vw, 62px)",
            lineHeight: 1.02,
            letterSpacing: "-0.04em",
            fontWeight: 900,
            maxWidth: 920,
          }}
        >
          Listagem real dos clientes cadastrados
        </h1>

        <p
          style={{
            marginTop: 18,
            marginBottom: 0,
            maxWidth: 900,
            color: "#d5e5f7",
            fontSize: "clamp(16px, 3.6vw, 21px)",
            lineHeight: 1.72,
          }}
        >
          Visualize, procure e acompanhe os clientes já gravados no banco da
          locadora. Sistema em constante atualização e pode haver momentos de
          instabilidade durante melhorias e expansão da plataforma.
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            marginTop: 26,
          }}
        >
          <Link href="/locadora/cadastros/clientes" style={primaryButton}>
            Novo cadastro de cliente
          </Link>

          <Link href="/locadora/cadastros" style={secondaryButton}>
            Voltar para central
          </Link>

          <Link href="/locadora" style={secondaryButton}>
            Voltar para locadora
          </Link>
        </div>

        <section style={topPanel}>
          <div style={panelStat}>
            <div style={statLabel}>TOTAL NO BANCO</div>
            <div style={statValue}>
              {loading ? "Lendo..." : String(items.length)}
            </div>
          </div>

          <div style={{ flex: 1, minWidth: 260 }}>
            <div style={statLabel}>BUSCA RÁPIDA</div>
            <input
              style={searchInput}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nome, cidade, telefone, WhatsApp, e-mail..."
            />
          </div>
        </section>

        {error ? (
          <section style={errorBox}>
            {error}
          </section>
        ) : null}

        {!loading && filteredItems.length === 0 ? (
          <section style={emptyBox}>
            <div style={{ fontSize: 24, fontWeight: 900, marginBottom: 10 }}>
              Nenhum cliente encontrado
            </div>
            <div style={{ color: "#9fb0c7", lineHeight: 1.7 }}>
              {items.length === 0
                ? "Ainda não existe cliente salvo no banco. Cadastre o primeiro cliente para iniciar a operação real."
                : "Nenhum cliente corresponde ao filtro digitado."}
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
          {filteredItems.map((item) => {
            const whatsappDigits = (item.whatsapp || "").replace(/\D/g, "");
            const whatsappHref = whatsappDigits
              ? `https://wa.me/${whatsappDigits}`
              : "";

            return (
              <article key={item.id} style={card}>
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
                  Cliente
                </div>

                <h2
                  style={{
                    margin: 0,
                    fontSize: 24,
                    lineHeight: 1.15,
                  }}
                >
                  {item.nome || "Sem nome"}
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
                  {item.cpf_cnpj ? (
                    <div>
                      <strong>CPF/CNPJ:</strong> {item.cpf_cnpj}
                    </div>
                  ) : null}

                  {item.telefone ? (
                    <div>
                      <strong>Telefone:</strong> {item.telefone}
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

                  {(item.cidade || item.estado) ? (
                    <div>
                      <strong>Local:</strong> {[item.cidade, item.estado]
                        .filter(Boolean)
                        .join(" - ")}
                    </div>
                  ) : null}

                  {item.endereco ? (
                    <div>
                      <strong>Endereço:</strong> {item.endereco}
                    </div>
                  ) : null}

                  {item.observacoes ? (
                    <div>
                      <strong>Observações:</strong> {item.observacoes}
                    </div>
                  ) : null}

                  <div>
                    <strong>Criado em:</strong> {formatDate(item.created_at)}
                  </div>
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
                      ...badgeStyle(item.active),
                      padding: "8px 10px",
                      borderRadius: 999,
                      fontWeight: 800,
                      fontSize: 12,
                    }}
                  >
                    active: {boolLabel(item.active)}
                  </span>

                  <span
                    style={{
                      ...badgeStyle(item.published),
                      padding: "8px 10px",
                      borderRadius: 999,
                      fontWeight: 800,
                      fontSize: 12,
                    }}
                  >
                    published: {boolLabel(item.published)}
                  </span>

                  <span
                    style={{
                      ...badgeStyle(item.approved),
                      padding: "8px 10px",
                      borderRadius: 999,
                      fontWeight: 800,
                      fontSize: 12,
                    }}
                  >
                    approved: {boolLabel(item.approved)}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 10,
                    marginTop: 18,
                  }}
                >
                  {whatsappHref ? (
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noreferrer"
                      style={whatsButton}
                    >
                      Chamar no WhatsApp
                    </a>
                  ) : null}
                </div>
              </article>
            );
          })}
        </section>
      </section>
    </main>
  );
}

const topPanel: React.CSSProperties = {
  marginTop: 28,
  display: "flex",
  flexWrap: "wrap",
  gap: 16,
  alignItems: "end",
  padding: 20,
  borderRadius: 22,
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.07)",
};

const panelStat: React.CSSProperties = {
  minWidth: 220,
};

const statLabel: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: "0.16em",
  color: "#8db5d9",
  marginBottom: 10,
};

const statValue: React.CSSProperties = {
  fontSize: 32,
  fontWeight: 900,
  lineHeight: 1,
};

const searchInput: React.CSSProperties = {
  width: "100%",
  minHeight: 50,
  borderRadius: 14,
  border: "1px solid rgba(148,163,184,0.22)",
  background: "rgba(15,23,42,0.78)",
  color: "#eef6ff",
  padding: "0 14px",
  fontSize: 15,
  outline: "none",
};

const card: React.CSSProperties = {
  borderRadius: 22,
  padding: 20,
  border: "1px solid rgba(255,255,255,0.08)",
  background:
    "linear-gradient(180deg, rgba(10,15,34,0.95), rgba(6,10,24,0.92))",
  boxShadow: "0 16px 40px rgba(0,0,0,0.26)",
};

const emptyBox: React.CSSProperties = {
  marginTop: 18,
  borderRadius: 22,
  padding: 24,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(7,12,28,0.85)",
};

const errorBox: React.CSSProperties = {
  marginTop: 18,
  borderRadius: 18,
  border: "1px solid rgba(248,113,113,0.34)",
  background: "rgba(127,29,29,0.18)",
  padding: 18,
  color: "#fecaca",
  fontWeight: 700,
};

const primaryButton: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 48,
  padding: "0 18px",
  borderRadius: 14,
  textDecoration: "none",
  fontWeight: 800,
  fontSize: 15,
  color: "#04110a",
  background: "linear-gradient(135deg, #22c55e, #86efac)",
  boxShadow: "0 18px 40px rgba(34,197,94,0.25)",
};

const secondaryButton: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 48,
  padding: "0 18px",
  borderRadius: 14,
  textDecoration: "none",
  fontWeight: 700,
  fontSize: 15,
  color: "#e5e7eb",
  border: "1px solid rgba(148,163,184,0.28)",
  background: "rgba(15,23,42,0.62)",
};

const whatsButton: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 42,
  padding: "0 14px",
  borderRadius: 12,
  textDecoration: "none",
  fontWeight: 800,
  fontSize: 14,
  color: "#04110a",
  background: "#25D366",
  boxShadow: "0 10px 30px rgba(37,211,102,0.25)",
};