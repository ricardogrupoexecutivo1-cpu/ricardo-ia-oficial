"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type LocadoraItem = {
  id: string;
  created_at?: string | null;

  name?: string | null;
  logo_text?: string | null;
  tagline?: string | null;

  company_name?: string | null;
  company_whatsapp?: string | null;
  company_city?: string | null;
  company_state?: string | null;
  company_email?: string | null;

  business_name?: string | null;
  title?: string | null;
  description?: string | null;
  category?: string | null;
  categories?: string[];

  contact_name?: string | null;
  contact_phone?: string | null;
  contact_whatsapp?: string | null;
  contact_email?: string | null;

  whatsapp?: string | null;
  email?: string | null;

  city?: string | null;
  state?: string | null;
  neighborhood?: string | null;
  address?: string | null;
  zipcode?: string | null;

  coverage_type?: string | null;
  coverage_radius_km?: number | string | null;

  latitude?: number | null;
  longitude?: number | null;

  delivery_available?: boolean | null;
  pickup_available?: boolean | null;

  logo_url?: string | null;
  image_url?: string | null;
};

type ApiResponse = {
  ok: boolean;
  total: number;
  filters?: {
    category?: string;
    q?: string;
    city?: string;
    state?: string;
    limit?: number;
  };
  items: LocadoraItem[];
  message?: string;
  error?: string;
};

const categories = [
  { label: "Todos", value: "" },
  { label: "Seminovos", value: "seminovos" },
  { label: "Motoristas", value: "motoristas" },
  { label: "Cegonheiros", value: "cegonheiros" },
  { label: "Compradores", value: "compradores" },
  { label: "Fornecedores", value: "fornecedores" },
];

function normalizeWhatsApp(value?: string | null) {
  const digits = String(value ?? "").replace(/\D/g, "");
  return digits || "";
}

function buildWhatsAppLink(value?: string | null) {
  const digits = normalizeWhatsApp(value);
  if (!digits) return "";
  return `https://wa.me/${digits}`;
}

function asNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const clean = value.trim().replace(",", ".");
    if (!clean) return null;
    const n = Number(clean);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function buildMapsLink(item: {
  latitude?: number | null;
  longitude?: number | null;
  address?: string | null;
  neighborhood?: string | null;
  city?: string | null;
  state?: string | null;
  zipcode?: string | null;
}) {
  if (
    typeof item.latitude === "number" &&
    Number.isFinite(item.latitude) &&
    typeof item.longitude === "number" &&
    Number.isFinite(item.longitude)
  ) {
    return `https://www.google.com/maps?q=${item.latitude},${item.longitude}`;
  }

  const address = [
    item.address,
    item.neighborhood,
    item.city,
    item.state,
    item.zipcode,
  ]
    .filter(Boolean)
    .join(", ")
    .trim();

  if (!address) return "";
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    address
  )}`;
}

function cardName(item: LocadoraItem) {
  return (
    item.company_name ||
    item.name ||
    item.title ||
    item.business_name ||
    "Registro sem nome"
  );
}

function cardCity(item: LocadoraItem) {
  return item.company_city || item.city || "";
}

function cardState(item: LocadoraItem) {
  return item.company_state || item.state || "";
}

function cardEmail(item: LocadoraItem) {
  return item.contact_email || item.company_email || item.email || "";
}

function cardWhatsapp(item: LocadoraItem) {
  return (
    item.contact_whatsapp ||
    item.company_whatsapp ||
    item.whatsapp ||
    item.contact_phone ||
    ""
  );
}

function cardDescription(item: LocadoraItem) {
  return item.description || item.tagline || "";
}

function cardCoverage(item: LocadoraItem) {
  return item.coverage_type || "";
}

function cardRadius(item: LocadoraItem) {
  return asNumber(item.coverage_radius_km);
}

function cardMapsLink(item: LocadoraItem) {
  return buildMapsLink({
    latitude: item.latitude,
    longitude: item.longitude,
    address: item.address,
    neighborhood: item.neighborhood,
    city: cardCity(item),
    state: cardState(item),
    zipcode: item.zipcode,
  });
}

function badgeStyle(background: string, color: string) {
  return {
    padding: "8px 10px",
    borderRadius: 999,
    background,
    color,
    fontWeight: 700,
    fontSize: 12,
    border: "1px solid rgba(255,255,255,0.10)",
  };
}

export default function LocadoraBuscarPage() {
  const [category, setCategory] = useState("");
  const [q, setQ] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [items, setItems] = useState<LocadoraItem[]>([]);

  const apiUrl = useMemo(() => {
    const params = new URLSearchParams();

    if (category) params.set("category", category);
    if (q.trim()) params.set("q", q.trim());
    if (city.trim()) params.set("city", city.trim());
    if (state.trim()) params.set("state", state.trim());
    params.set("limit", "60");

    const query = params.toString();
    return query ? `/api/locadora/buscar?${query}` : `/api/locadora/buscar`;
  }, [category, q, city, state]);

  async function loadData(customUrl?: string) {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(customUrl ?? apiUrl, {
        cache: "no-store",
      });

      const data = (await response.json()) as ApiResponse;

      if (!response.ok || !data.ok) {
        setItems([]);
        setMessage("");
        setError(data.error || "Erro ao buscar resultados da locadora.");
        setLoaded(true);
        return;
      }

      setItems(Array.isArray(data.items) ? data.items : []);
      setMessage(data.message || "");
      setLoaded(true);
    } catch (err) {
      setItems([]);
      setMessage("");
      setError(
        err instanceof Error
          ? err.message
          : "Falha inesperada ao carregar a busca da locadora."
      );
      setLoaded(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    loadData();
  }

  function handleClear() {
    setCategory("");
    setQ("");
    setCity("");
    setState("");
    loadData("/api/locadora/buscar");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(16,185,129,0.16), transparent 24%), #050816",
        color: "#e5eef8",
        padding: "32px 16px 80px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1180,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(7,12,28,0.88)",
            borderRadius: 24,
            padding: 24,
            boxShadow: "0 18px 60px rgba(0,0,0,0.35)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 18,
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
                  background: "rgba(16,185,129,0.12)",
                  border: "1px solid rgba(16,185,129,0.26)",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                  color: "#86efac",
                  marginBottom: 14,
                }}
              >
                Busca real da Locadora
              </div>

              <h1
                style={{
                  margin: 0,
                  fontSize: "clamp(28px, 5vw, 44px)",
                  lineHeight: 1.05,
                }}
              >
                Encontre oportunidades na Aurora Locadora
              </h1>

              <p
                style={{
                  marginTop: 12,
                  marginBottom: 0,
                  color: "#9fb0c7",
                  fontSize: 16,
                  maxWidth: 820,
                  lineHeight: 1.65,
                }}
              >
                Busque em categorias como seminovos, motoristas, cegonheiros,
                compradores e fornecedores, lendo direto da base real do
                Supabase.
              </p>
            </div>

            <div
              style={{
                minWidth: 210,
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
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 0.4,
                  marginBottom: 8,
                }}
              >
                Status
              </div>
              <div style={{ fontSize: 22, fontWeight: 800 }}>
                {loading ? "Buscando..." : `${items.length} resultado(s)`}
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

          <form
            onSubmit={handleSubmit}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
              gap: 14,
              marginTop: 24,
            }}
          >
            <div style={{ gridColumn: "span 12" }}>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 700,
                  marginBottom: 8,
                  color: "#cfe3ff",
                }}
              >
                Categoria
              </label>
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap",
                }}
              >
                {categories.map((item) => {
                  const active = category === item.value;
                  return (
                    <button
                      key={item.value || "todos"}
                      type="button"
                      onClick={() => setCategory(item.value)}
                      style={{
                        padding: "12px 16px",
                        borderRadius: 999,
                        border: active
                          ? "1px solid rgba(52,211,153,0.5)"
                          : "1px solid rgba(255,255,255,0.12)",
                        background: active
                          ? "rgba(16,185,129,0.16)"
                          : "rgba(255,255,255,0.03)",
                        color: active ? "#d1fae5" : "#dbe7f5",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ gridColumn: "span 12" }}>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 700,
                  marginBottom: 8,
                  color: "#cfe3ff",
                }}
              >
                Busca geral
              </label>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Ex.: motorista, seminovo, fornecedor, Vespasiano, peças, frete..."
                style={{
                  width: "100%",
                  height: 50,
                  borderRadius: 14,
                  border: "1px solid rgba(255,255,255,0.10)",
                  background: "rgba(255,255,255,0.04)",
                  color: "#ecf4ff",
                  padding: "0 16px",
                  outline: "none",
                  fontSize: 15,
                }}
              />
            </div>

            <div style={{ gridColumn: "span 12 / span 12" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
                  gap: 14,
                }}
              >
                <div style={{ gridColumn: "span 6" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 13,
                      fontWeight: 700,
                      marginBottom: 8,
                      color: "#cfe3ff",
                    }}
                  >
                    Cidade
                  </label>
                  <input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Ex.: Belo Horizonte"
                    style={{
                      width: "100%",
                      height: 50,
                      borderRadius: 14,
                      border: "1px solid rgba(255,255,255,0.10)",
                      background: "rgba(255,255,255,0.04)",
                      color: "#ecf4ff",
                      padding: "0 16px",
                      outline: "none",
                      fontSize: 15,
                    }}
                  />
                </div>

                <div style={{ gridColumn: "span 3" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 13,
                      fontWeight: 700,
                      marginBottom: 8,
                      color: "#cfe3ff",
                    }}
                  >
                    Estado
                  </label>
                  <input
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Ex.: MG"
                    style={{
                      width: "100%",
                      height: 50,
                      borderRadius: 14,
                      border: "1px solid rgba(255,255,255,0.10)",
                      background: "rgba(255,255,255,0.04)",
                      color: "#ecf4ff",
                      padding: "0 16px",
                      outline: "none",
                      fontSize: 15,
                    }}
                  />
                </div>

                <div
                  style={{
                    gridColumn: "span 3",
                    display: "flex",
                    gap: 10,
                    alignItems: "flex-end",
                  }}
                >
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      flex: 1,
                      height: 50,
                      borderRadius: 14,
                      border: "1px solid rgba(52,211,153,0.45)",
                      background:
                        "linear-gradient(135deg, rgba(16,185,129,0.95), rgba(6,182,212,0.95))",
                      color: "#04121d",
                      fontWeight: 900,
                      cursor: "pointer",
                    }}
                  >
                    {loading ? "Buscando..." : "Buscar agora"}
                  </button>

                  <button
                    type="button"
                    onClick={handleClear}
                    disabled={loading}
                    style={{
                      flex: 1,
                      height: 50,
                      borderRadius: 14,
                      border: "1px solid rgba(255,255,255,0.12)",
                      background: "rgba(255,255,255,0.04)",
                      color: "#e5eef8",
                      fontWeight: 800,
                      cursor: "pointer",
                    }}
                  >
                    Limpar
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {message ? (
          <div
            style={{
              marginTop: 18,
              borderRadius: 18,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.04)",
              padding: 16,
              color: "#a9bbd3",
              lineHeight: 1.6,
            }}
          >
            {message}
          </div>
        ) : null}

        {error ? (
          <div
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
          </div>
        ) : null}

        <section
          style={{
            marginTop: 24,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 18,
          }}
        >
          {!loading && loaded && items.length === 0 ? (
            <article
              style={{
                gridColumn: "1 / -1",
                borderRadius: 22,
                padding: 26,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(7,12,28,0.85)",
              }}
            >
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  marginBottom: 10,
                }}
              >
                Nenhum resultado encontrado no momento
              </div>
              <div
                style={{
                  color: "#9fb0c7",
                  lineHeight: 1.7,
                  fontSize: 15,
                  maxWidth: 760,
                }}
              >
                A busca real já está conectada à base. Agora precisamos cadastrar
                mais registros visíveis no banco ou ajustar os status dos
                registros existentes para eles aparecerem publicamente.
              </div>
            </article>
          ) : null}

          {items.map((item) => {
            const name = cardName(item);
            const description = cardDescription(item);
            const cityName = cardCity(item);
            const stateName = cardState(item);
            const email = cardEmail(item);
            const whatsapp = cardWhatsapp(item);
            const whatsLink = buildWhatsAppLink(whatsapp);
            const mapsLink = cardMapsLink(item);
            const coverage = cardCoverage(item);
            const radius = cardRadius(item);

            return (
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
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <div style={{ flex: 1 }}>
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
                      {item.category || "Cadastro Aurora"}
                    </div>

                    <h2
                      style={{
                        margin: 0,
                        fontSize: 22,
                        lineHeight: 1.15,
                      }}
                    >
                      {name}
                    </h2>

                    {item.title && item.title !== name ? (
                      <div
                        style={{
                          marginTop: 8,
                          color: "#9fb0c7",
                          fontSize: 14,
                          fontWeight: 700,
                        }}
                      >
                        Oferta: {item.title}
                      </div>
                    ) : null}
                  </div>

                  {(item.logo_url || item.image_url) && (
                    <img
                      src={item.logo_url || item.image_url || ""}
                      alt={name}
                      style={{
                        width: 72,
                        height: 72,
                        objectFit: "cover",
                        borderRadius: 16,
                        border: "1px solid rgba(255,255,255,0.12)",
                        background: "rgba(255,255,255,0.04)",
                      }}
                    />
                  )}
                </div>

                {description ? (
                  <p
                    style={{
                      marginTop: 14,
                      marginBottom: 0,
                      color: "#a9bbd3",
                      lineHeight: 1.7,
                      fontSize: 15,
                    }}
                  >
                    {description}
                  </p>
                ) : null}

                <div
                  style={{
                    marginTop: 16,
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

                  {whatsapp ? (
                    <div>
                      <strong>WhatsApp:</strong> {whatsapp}
                    </div>
                  ) : null}

                  {email ? (
                    <div>
                      <strong>E-mail:</strong> {email}
                    </div>
                  ) : null}

                  {cityName || stateName || item.neighborhood ? (
                    <div>
                      <strong>Região:</strong>{" "}
                      {[item.neighborhood, cityName, stateName]
                        .filter(Boolean)
                        .join(" - ")}
                    </div>
                  ) : null}

                  {coverage ? (
                    <div>
                      <strong>Cobertura:</strong> {coverage}
                      {radius !== null ? ` • raio de ${radius} km` : ""}
                    </div>
                  ) : null}

                  {item.address ? (
                    <div>
                      <strong>Endereço:</strong> {item.address}
                    </div>
                  ) : null}
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    flexWrap: "wrap",
                    marginTop: 14,
                  }}
                >
                  {item.delivery_available ? (
                    <span
                      style={badgeStyle(
                        "rgba(34,197,94,0.12)",
                        "#bbf7d0"
                      )}
                    >
                      Entrega disponível
                    </span>
                  ) : null}

                  {item.pickup_available ? (
                    <span
                      style={badgeStyle(
                        "rgba(59,130,246,0.12)",
                        "#bfdbfe"
                      )}
                    >
                      Retirada disponível
                    </span>
                  ) : null}

                  {coverage ? (
                    <span
                      style={badgeStyle(
                        "rgba(168,85,247,0.14)",
                        "#e9d5ff"
                      )}
                    >
                      {coverage}
                    </span>
                  ) : null}

                  {radius !== null ? (
                    <span
                      style={badgeStyle(
                        "rgba(245,158,11,0.14)",
                        "#fde68a"
                      )}
                    >
                      {radius} km
                    </span>
                  ) : null}

                  {Array.isArray(item.categories) && item.categories.length > 0
                    ? item.categories.slice(0, 3).map((cat) => (
                        <span
                          key={`${item.id}-${cat}`}
                          style={badgeStyle(
                            "rgba(255,255,255,0.05)",
                            "#dbe7f5"
                          )}
                        >
                          {cat}
                        </span>
                      ))
                    : null}
                </div>

                <div
                  style={{
                    marginTop: 18,
                    display: "flex",
                    gap: 10,
                    flexWrap: "wrap",
                  }}
                >
                  {whatsLink ? (
                    <a
                      href={whatsLink}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: 46,
                        padding: "0 16px",
                        borderRadius: 12,
                        textDecoration: "none",
                        border: "1px solid rgba(34,197,94,0.30)",
                        background: "rgba(34,197,94,0.14)",
                        color: "#dcfce7",
                        fontWeight: 900,
                        flex: 1,
                        minWidth: 150,
                      }}
                    >
                      Chamar no WhatsApp
                    </a>
                  ) : null}

                  {mapsLink ? (
                    <a
                      href={mapsLink}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: 46,
                        padding: "0 16px",
                        borderRadius: 12,
                        textDecoration: "none",
                        border: "1px solid rgba(59,130,246,0.28)",
                        background: "rgba(59,130,246,0.12)",
                        color: "#dbeafe",
                        fontWeight: 900,
                        flex: 1,
                        minWidth: 130,
                      }}
                    >
                      Ver no mapa
                    </a>
                  ) : null}
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}