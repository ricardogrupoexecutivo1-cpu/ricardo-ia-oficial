"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

type ApiResponse = {
  ok: boolean;
  message?: string;
  error?: string;
  item?: Record<string, unknown> | null;
  payload?: Record<string, unknown>;
};

type FormState = {
  company_name: string;
  company_whatsapp: string;
  company_city: string;
  company_state: string;
  company_email: string;

  contact_name: string;
  contact_role: string;
  contact_whatsapp: string;
  contact_email: string;

  category: string;
  title: string;
  description: string;
  city: string;
  state: string;

  coverage_type: string;
  coverage_radius_km: string;
  latitude: string;
  longitude: string;

  delivery_available: boolean;
  pickup_available: boolean;
};

const initialState: FormState = {
  company_name: "",
  company_whatsapp: "",
  company_city: "",
  company_state: "",
  company_email: "",

  contact_name: "",
  contact_role: "Vendas",
  contact_whatsapp: "",
  contact_email: "",

  category: "seminovos",
  title: "",
  description: "",
  city: "",
  state: "",

  coverage_type: "Regional",
  coverage_radius_km: "120",
  latitude: "",
  longitude: "",

  delivery_available: false,
  pickup_available: false,
};

const categoryOptions = [
  { label: "Seminovos", value: "seminovos" },
  { label: "Motoristas", value: "motoristas" },
  { label: "Cegonheiros", value: "cegonheiros" },
  { label: "Compradores", value: "compradores" },
  { label: "Fornecedores", value: "fornecedores" },
];

const coverageOptions = [
  { label: "Local", value: "Local" },
  { label: "Regional", value: "Regional" },
  { label: "Estadual", value: "Estadual" },
  { label: "Nacional", value: "Nacional" },
];

function sanitizePhone(value: string) {
  return value.replace(/\D/g, "");
}

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function toNullableString(value: string) {
  const clean = value.trim();
  return clean.length ? clean : null;
}

function toNullableNumber(value: string) {
  const clean = value.trim().replace(",", ".");
  if (!clean) return null;
  const n = Number(clean);
  return Number.isFinite(n) ? n : null;
}

function labelStyle() {
  return {
    display: "block",
    fontSize: 13,
    fontWeight: 800 as const,
    marginBottom: 8,
    color: "#cfe3ff",
  };
}

function inputStyle() {
  return {
    width: "100%",
    height: 52,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.04)",
    color: "#ecf4ff",
    padding: "0 16px",
    outline: "none",
    fontSize: 15,
  };
}

function textareaStyle() {
  return {
    width: "100%",
    minHeight: 140,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.04)",
    color: "#ecf4ff",
    padding: "14px 16px",
    outline: "none",
    fontSize: 15,
    resize: "vertical" as const,
  };
}

function selectStyle() {
  return {
    width: "100%",
    height: 52,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "#0c1327",
    color: "#ecf4ff",
    padding: "0 16px",
    outline: "none",
    fontSize: 15,
  };
}

function cardStyle() {
  return {
    borderRadius: 24,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(7,12,28,0.88)",
    padding: 22,
    boxShadow: "0 18px 60px rgba(0,0,0,0.35)",
  };
}

export default function LocadoraCadastrarPage() {
  const [form, setForm] = useState<FormState>(initialState);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [lastSaved, setLastSaved] = useState<Record<string, unknown> | null>(
    null
  );

  const previewRegion = useMemo(() => {
    return [form.city.trim(), form.state.trim()].filter(Boolean).join(" - ");
  }, [form.city, form.state]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function resetForm() {
    setForm(initialState);
    setSuccess("");
    setError("");
    setLastSaved(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const payload = {
        company_name: toNullableString(form.company_name),
        company_whatsapp: toNullableString(sanitizePhone(form.company_whatsapp)),
        company_city: toNullableString(form.company_city),
        company_state: toNullableString(form.company_state),
        company_email: toNullableString(normalizeEmail(form.company_email)),

        contact_name: toNullableString(form.contact_name),
        contact_role: toNullableString(form.contact_role),
        contact_whatsapp: toNullableString(sanitizePhone(form.contact_whatsapp)),
        contact_email: toNullableString(normalizeEmail(form.contact_email)),

        category: toNullableString(form.category),
        title: toNullableString(form.title),
        description: toNullableString(form.description),
        city: toNullableString(form.city),
        state: toNullableString(form.state),

        coverage_type: toNullableString(form.coverage_type),
        coverage_radius_km: toNullableNumber(form.coverage_radius_km),
        latitude: toNullableNumber(form.latitude),
        longitude: toNullableNumber(form.longitude),

        delivery_available: Boolean(form.delivery_available),
        pickup_available: Boolean(form.pickup_available),
      };

      const response = await fetch("/api/locadora/cadastrar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as ApiResponse;

      if (!response.ok || !data.ok) {
        setError(data.error || "Falha ao cadastrar na locadora.");
        setLastSaved(data.payload ?? null);
        return;
      }

      setSuccess(
        data.message || "Cadastro realizado com sucesso na Locadora."
      );
      setLastSaved(data.item ?? payload);
      setForm(initialState);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro inesperado ao enviar cadastro."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(16,185,129,0.16), transparent 24%), #050816",
        color: "#e5eef8",
        padding: "28px 16px 80px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1180,
          margin: "0 auto",
        }}
      >
        <section
          style={{
            ...cardStyle(),
            marginBottom: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 16,
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
            }}
          >
            <div style={{ maxWidth: 800 }}>
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
                  fontWeight: 800,
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                  color: "#86efac",
                  marginBottom: 14,
                }}
              >
                Aurora Locadora • Cadastrar
              </div>

              <h1
                style={{
                  margin: 0,
                  fontSize: "clamp(28px, 5vw, 42px)",
                  lineHeight: 1.05,
                }}
              >
                Cadastro real de empresa, contato e anúncio da locadora
              </h1>

              <p
                style={{
                  marginTop: 12,
                  marginBottom: 0,
                  color: "#9fb0c7",
                  fontSize: 16,
                  lineHeight: 1.7,
                }}
              >
                Esta página prepara a entrada real de dados da locadora no
                Supabase, com empresa, contato principal, anúncio e cobertura de
                atendimento, no mesmo padrão validado do AGRO.
              </p>
            </div>

            <div
              style={{
                minWidth: 250,
                display: "grid",
                gap: 10,
              }}
            >
              <Link
                href="/locadora"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 46,
                  padding: "0 16px",
                  borderRadius: 14,
                  textDecoration: "none",
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.04)",
                  color: "#e5eef8",
                  fontWeight: 800,
                }}
              >
                Voltar à Locadora
              </Link>

              <Link
                href="/"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 46,
                  padding: "0 16px",
                  borderRadius: 14,
                  textDecoration: "none",
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.04)",
                  color: "#e5eef8",
                  fontWeight: 800,
                }}
              >
                Voltar à Home
              </Link>
            </div>
          </div>

          <div
            style={{
              marginTop: 20,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 12,
            }}
          >
            {[
              ["Empresa", "dados principais"],
              ["Contato", "responsável"],
              ["Anúncio", "categoria e oferta"],
              ["Cobertura", "local ao nacional"],
            ].map(([title, text]) => (
              <div
                key={title}
                style={{
                  borderRadius: 18,
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.03)",
                  padding: 16,
                }}
              >
                <div
                  style={{
                    fontWeight: 900,
                    fontSize: 18,
                  }}
                >
                  {title}
                </div>
                <div
                  style={{
                    marginTop: 4,
                    color: "#9fb0c7",
                    fontSize: 14,
                  }}
                >
                  {text}
                </div>
              </div>
            ))}
          </div>
        </section>

        {success ? (
          <section
            style={{
              marginBottom: 18,
              borderRadius: 18,
              border: "1px solid rgba(34,197,94,0.32)",
              background: "rgba(34,197,94,0.12)",
              padding: 18,
              color: "#dcfce7",
              fontWeight: 800,
            }}
          >
            {success}
          </section>
        ) : null}

        {error ? (
          <section
            style={{
              marginBottom: 18,
              borderRadius: 18,
              border: "1px solid rgba(248,113,113,0.34)",
              background: "rgba(127,29,29,0.18)",
              padding: 18,
              color: "#fecaca",
              fontWeight: 800,
              whiteSpace: "pre-wrap",
            }}
          >
            {error}
          </section>
        ) : null}

        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
              gap: 18,
            }}
          >
            <section
              style={{
                ...cardStyle(),
                gridColumn: "span 12",
              }}
            >
              <h2
                style={{
                  marginTop: 0,
                  marginBottom: 18,
                  fontSize: 24,
                }}
              >
                1. Empresa
              </h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
                  gap: 14,
                }}
              >
                <div style={{ gridColumn: "span 6" }}>
                  <label style={labelStyle()}>Nome da empresa</label>
                  <input
                    value={form.company_name}
                    onChange={(e) =>
                      updateField("company_name", e.target.value)
                    }
                    placeholder="Ex.: Raja Aluguel de Veículos"
                    style={inputStyle()}
                  />
                </div>

                <div style={{ gridColumn: "span 6" }}>
                  <label style={labelStyle()}>WhatsApp da empresa</label>
                  <input
                    value={form.company_whatsapp}
                    onChange={(e) =>
                      updateField("company_whatsapp", e.target.value)
                    }
                    placeholder="Ex.: 5531999999999"
                    style={inputStyle()}
                  />
                </div>

                <div style={{ gridColumn: "span 4" }}>
                  <label style={labelStyle()}>Cidade da empresa</label>
                  <input
                    value={form.company_city}
                    onChange={(e) =>
                      updateField("company_city", e.target.value)
                    }
                    placeholder="Ex.: Belo Horizonte"
                    style={inputStyle()}
                  />
                </div>

                <div style={{ gridColumn: "span 2" }}>
                  <label style={labelStyle()}>Estado da empresa</label>
                  <input
                    value={form.company_state}
                    onChange={(e) =>
                      updateField("company_state", e.target.value)
                    }
                    placeholder="Ex.: MG"
                    style={inputStyle()}
                  />
                </div>

                <div style={{ gridColumn: "span 6" }}>
                  <label style={labelStyle()}>E-mail da empresa</label>
                  <input
                    value={form.company_email}
                    onChange={(e) =>
                      updateField("company_email", e.target.value)
                    }
                    placeholder="Ex.: contato@locadora.com"
                    style={inputStyle()}
                  />
                </div>
              </div>
            </section>

            <section
              style={{
                ...cardStyle(),
                gridColumn: "span 12",
              }}
            >
              <h2
                style={{
                  marginTop: 0,
                  marginBottom: 18,
                  fontSize: 24,
                }}
              >
                2. Contato principal
              </h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
                  gap: 14,
                }}
              >
                <div style={{ gridColumn: "span 4" }}>
                  <label style={labelStyle()}>Nome do contato</label>
                  <input
                    value={form.contact_name}
                    onChange={(e) =>
                      updateField("contact_name", e.target.value)
                    }
                    placeholder="Ex.: Ana Seminovos"
                    style={inputStyle()}
                  />
                </div>

                <div style={{ gridColumn: "span 4" }}>
                  <label style={labelStyle()}>Função</label>
                  <input
                    value={form.contact_role}
                    onChange={(e) =>
                      updateField("contact_role", e.target.value)
                    }
                    placeholder="Ex.: Vendas"
                    style={inputStyle()}
                  />
                </div>

                <div style={{ gridColumn: "span 4" }}>
                  <label style={labelStyle()}>WhatsApp do contato</label>
                  <input
                    value={form.contact_whatsapp}
                    onChange={(e) =>
                      updateField("contact_whatsapp", e.target.value)
                    }
                    placeholder="Ex.: 5531988888888"
                    style={inputStyle()}
                  />
                </div>

                <div style={{ gridColumn: "span 6" }}>
                  <label style={labelStyle()}>E-mail do contato</label>
                  <input
                    value={form.contact_email}
                    onChange={(e) =>
                      updateField("contact_email", e.target.value)
                    }
                    placeholder="Ex.: contato@locadora.com"
                    style={inputStyle()}
                  />
                </div>
              </div>
            </section>

            <section
              style={{
                ...cardStyle(),
                gridColumn: "span 12",
              }}
            >
              <h2
                style={{
                  marginTop: 0,
                  marginBottom: 18,
                  fontSize: 24,
                }}
              >
                3. Anúncio da locadora
              </h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
                  gap: 14,
                }}
              >
                <div style={{ gridColumn: "span 4" }}>
                  <label style={labelStyle()}>Categoria</label>
                  <select
                    value={form.category}
                    onChange={(e) => updateField("category", e.target.value)}
                    style={selectStyle()}
                  >
                    {categoryOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ gridColumn: "span 8" }}>
                  <label style={labelStyle()}>Título do anúncio</label>
                  <input
                    value={form.title}
                    onChange={(e) => updateField("title", e.target.value)}
                    placeholder="Ex.: Hilux seminova pronta para negociação"
                    style={inputStyle()}
                  />
                </div>

                <div style={{ gridColumn: "span 12" }}>
                  <label style={labelStyle()}>Descrição</label>
                  <textarea
                    value={form.description}
                    onChange={(e) =>
                      updateField("description", e.target.value)
                    }
                    placeholder="Descreva a oferta, a necessidade ou o serviço."
                    style={textareaStyle()}
                  />
                </div>

                <div style={{ gridColumn: "span 4" }}>
                  <label style={labelStyle()}>Cidade do anúncio</label>
                  <input
                    value={form.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    placeholder="Ex.: Belo Horizonte"
                    style={inputStyle()}
                  />
                </div>

                <div style={{ gridColumn: "span 2" }}>
                  <label style={labelStyle()}>Estado do anúncio</label>
                  <input
                    value={form.state}
                    onChange={(e) => updateField("state", e.target.value)}
                    placeholder="Ex.: MG"
                    style={inputStyle()}
                  />
                </div>

                <div style={{ gridColumn: "span 6" }}>
                  <label style={labelStyle()}>Prévia da região</label>
                  <div
                    style={{
                      ...inputStyle(),
                      display: "flex",
                      alignItems: "center",
                      color: "#9fb0c7",
                    }}
                  >
                    {previewRegion || "Ex.: Belo Horizonte - MG"}
                  </div>
                </div>
              </div>
            </section>

            <section
              style={{
                ...cardStyle(),
                gridColumn: "span 12",
              }}
            >
              <h2
                style={{
                  marginTop: 0,
                  marginBottom: 18,
                  fontSize: 24,
                }}
              >
                4. Cobertura e localização
              </h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
                  gap: 14,
                }}
              >
                <div style={{ gridColumn: "span 4" }}>
                  <label style={labelStyle()}>Tipo de cobertura</label>
                  <select
                    value={form.coverage_type}
                    onChange={(e) =>
                      updateField("coverage_type", e.target.value)
                    }
                    style={selectStyle()}
                  >
                    {coverageOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ gridColumn: "span 4" }}>
                  <label style={labelStyle()}>Raio máximo em KM</label>
                  <input
                    value={form.coverage_radius_km}
                    onChange={(e) =>
                      updateField("coverage_radius_km", e.target.value)
                    }
                    placeholder="120"
                    style={inputStyle()}
                  />
                </div>

                <div style={{ gridColumn: "span 2" }}>
                  <label style={labelStyle()}>Latitude</label>
                  <input
                    value={form.latitude}
                    onChange={(e) => updateField("latitude", e.target.value)}
                    placeholder="Ex.: -19.9167"
                    style={inputStyle()}
                  />
                </div>

                <div style={{ gridColumn: "span 2" }}>
                  <label style={labelStyle()}>Longitude</label>
                  <input
                    value={form.longitude}
                    onChange={(e) => updateField("longitude", e.target.value)}
                    placeholder="Ex.: -43.9345"
                    style={inputStyle()}
                  />
                </div>

                <div
                  style={{
                    gridColumn: "span 12",
                    display: "flex",
                    gap: 18,
                    flexWrap: "wrap",
                    marginTop: 4,
                  }}
                >
                  <label
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 10,
                      cursor: "pointer",
                      fontWeight: 800,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={form.delivery_available}
                      onChange={(e) =>
                        updateField("delivery_available", e.target.checked)
                      }
                    />
                    Entrega disponível
                  </label>

                  <label
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 10,
                      cursor: "pointer",
                      fontWeight: 800,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={form.pickup_available}
                      onChange={(e) =>
                        updateField("pickup_available", e.target.checked)
                      }
                    />
                    Retirada disponível
                  </label>
                </div>
              </div>
            </section>
          </div>

          <section
            style={{
              ...cardStyle(),
              marginTop: 18,
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  color: "#9fb0c7",
                  lineHeight: 1.6,
                  maxWidth: 760,
                }}
              >
                Sistema em constante atualização e expansão. Podem ocorrer
                momentos de instabilidade durante melhorias, ajustes e novos
                lançamentos.
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap",
                }}
              >
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    minHeight: 50,
                    padding: "0 18px",
                    borderRadius: 14,
                    border: "1px solid rgba(52,211,153,0.45)",
                    background:
                      "linear-gradient(135deg, rgba(16,185,129,0.95), rgba(6,182,212,0.95))",
                    color: "#04121d",
                    fontWeight: 900,
                    cursor: "pointer",
                  }}
                >
                  {loading ? "Cadastrando..." : "Cadastrar na Locadora"}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  disabled={loading}
                  style={{
                    minHeight: 50,
                    padding: "0 18px",
                    borderRadius: 14,
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "rgba(255,255,255,0.04)",
                    color: "#e5eef8",
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                >
                  Limpar formulário
                </button>
              </div>
            </div>
          </section>
        </form>

        {lastSaved ? (
          <section
            style={{
              ...cardStyle(),
              marginTop: 18,
            }}
          >
            <h3
              style={{
                marginTop: 0,
                marginBottom: 12,
                fontSize: 20,
              }}
            >
              Último envio processado
            </h3>

            <pre
              style={{
                margin: 0,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                color: "#cfe3ff",
                fontSize: 12,
                lineHeight: 1.7,
              }}
            >
              {JSON.stringify(lastSaved, null, 2)}
            </pre>
          </section>
        ) : null}
      </div>
    </main>
  );
}