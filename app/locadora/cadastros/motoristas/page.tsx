"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Condutor = {
  id: string;
  nome: string;
  cidade_residencia: string;
  estado?: string | null;
  cnh_numero?: string | null;
  cnh_categoria?: string | null;
  cnh_validade?: string | null;
  telefone?: string | null;
  email?: string | null;
  filial?: string | null;
  status?: string | null;
  observacoes?: string | null;
  created_at?: string | null;
};

type ApiListResponse = {
  ok: boolean;
  items?: Condutor[];
  error?: string;
};

type ApiCreateResponse = {
  ok: boolean;
  item?: Condutor;
  error?: string;
  message?: string;
};

const initialForm = {
  nome: "",
  cidade_residencia: "",
  estado: "",
  cnh_numero: "",
  cnh_categoria: "",
  cnh_validade: "",
  telefone: "",
  email: "",
  filial: "",
  status: "ativo",
  observacoes: "",
};

export default function LocadoraCondutoresPage() {
  const [form, setForm] = useState(initialForm);
  const [items, setItems] = useState<Condutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");

  const [searchNome, setSearchNome] = useState("");
  const [searchCidade, setSearchCidade] = useState("");
  const [searchEstado, setSearchEstado] = useState("");
  const [searchArea, setSearchArea] = useState("");

  const canSubmit = useMemo(() => {
    return form.nome.trim().length > 0 && form.cidade_residencia.trim().length > 0;
  }, [form]);

  const filteredItems = useMemo(() => {
    const nome = searchNome.trim().toLowerCase();
    const cidade = searchCidade.trim().toLowerCase();
    const estado = searchEstado.trim().toLowerCase();
    const area = searchArea.trim().toLowerCase();

    return items.filter((item) => {
      const itemNome = (item.nome || "").toLowerCase();
      const itemCidade = (item.cidade_residencia || "").toLowerCase();
      const itemEstado = (item.estado || "").toLowerCase();
      const itemArea = (item.filial || "").toLowerCase();

      const matchNome = !nome || itemNome.includes(nome);
      const matchCidade = !cidade || itemCidade.includes(cidade);
      const matchEstado = !estado || itemEstado.includes(estado);
      const matchArea = !area || itemArea.includes(area);

      return matchNome && matchCidade && matchEstado && matchArea;
    });
  }, [items, searchNome, searchCidade, searchEstado, searchArea]);

  async function loadCondutores() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/locadora/motoristas", {
        cache: "no-store",
      });

      const data = (await response.json()) as ApiListResponse;

      if (!response.ok || !data.ok) {
        setError(data.error || "Não foi possível carregar os condutores.");
        return;
      }

      setItems(Array.isArray(data.items) ? data.items : []);
    } catch {
      setError("Falha ao carregar condutores.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCondutores();
  }, []);

  function updateField(field: keyof typeof initialForm, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function clearFilters() {
    setSearchNome("");
    setSearchCidade("");
    setSearchEstado("");
    setSearchArea("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) {
      setError("Preencha nome e cidade de residência.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setFeedback("");

      const response = await fetch("/api/locadora/motoristas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = (await response.json()) as ApiCreateResponse;

      if (!response.ok || !data.ok || !data.item) {
        setError(data.error || "Não foi possível salvar o condutor.");
        return;
      }

      setItems((current) => [data.item as Condutor, ...current]);
      setForm(initialForm);
      setFeedback("Condutor cadastrado com sucesso.");
    } catch {
      setError("Falha de conexão ao salvar o condutor.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(34,197,94,0.14), transparent 0%, transparent 28%), radial-gradient(circle at right top, rgba(20,184,166,0.14), transparent 0%, transparent 22%), linear-gradient(180deg, #041018 0%, #02060d 100%)",
        color: "#eef6ff",
        overflowX: "hidden",
      }}
    >
      <section
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "24px 16px 88px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 20,
          }}
        >
          <Link href="/locadora/cadastros" style={secondaryButton}>
            ← Voltar para cadastros
          </Link>

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
            }}
          >
            <span aria-hidden="true">🪪</span>
            <span>Cadastro nacional de condutores</span>
          </div>
        </div>

        <div
          className="aurora-condutores-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 0.95fr) minmax(0, 1.05fr)",
            gap: 22,
          }}
        >
          <article style={heroCard}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 12px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.07)",
                color: "#b8d7ff",
                fontWeight: 800,
                fontSize: 12,
                marginBottom: 18,
              }}
            >
              <span aria-hidden="true">🚗</span>
              <span>Aurora Locadoras</span>
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: "clamp(34px, 7vw, 62px)",
                lineHeight: 1.02,
                letterSpacing: "-0.04em",
                fontWeight: 900,
              }}
            >
              Condutores disponíveis em todo o Brasil
            </h1>

            <p
              style={{
                marginTop: 18,
                marginBottom: 0,
                color: "#d5e5f7",
                fontSize: "clamp(17px, 3.7vw, 21px)",
                lineHeight: 1.72,
                maxWidth: 760,
              }}
            >
              Cadastre condutores com cidade de residência, CNH, contato,
              disponibilidade e área de atuação para conectar empresas,
              locadoras e parceiros em todo o Brasil.
            </p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
                marginTop: 26,
              }}
            >
              <div style={pillStyle}>Cidade de residência</div>
              <div style={pillStyle}>Área de atuação</div>
              <div style={pillStyle}>CNH e categoria</div>
              <div style={pillStyle}>WhatsApp direto</div>
            </div>

            <div style={infoBox}>
              <div style={infoLabel}>AVISO</div>
              <div style={infoText}>
                Sistema em constante atualização. Pode haver momentos de
                instabilidade durante ajustes de performance, segurança e
                expansão comercial.
              </div>
            </div>
          </article>

          <aside style={formCard}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 12px",
                borderRadius: 999,
                background: "rgba(34,197,94,0.10)",
                border: "1px solid rgba(34,197,94,0.24)",
                color: "#9ff3c4",
                fontWeight: 800,
                fontSize: 12,
                marginBottom: 14,
              }}
            >
              <span aria-hidden="true">✍️</span>
              <span>Novo condutor</span>
            </div>

            <h2
              style={{
                margin: "0 0 10px",
                fontSize: 28,
                lineHeight: 1.1,
                fontWeight: 900,
                letterSpacing: "-0.03em",
              }}
            >
              Cadastrar condutor
            </h2>

            <p
              style={{
                margin: "0 0 20px",
                color: "#bcd3ea",
                fontSize: 15,
                lineHeight: 1.65,
              }}
            >
              Preencha os dados principais para salvar um novo condutor no
              sistema.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="aurora-form-grid" style={formGrid}>
                <Field
                  label="Nome completo *"
                  value={form.nome}
                  onChange={(value) => updateField("nome", value)}
                  placeholder="Nome do condutor"
                />

                <Field
                  label="Cidade de residência *"
                  value={form.cidade_residencia}
                  onChange={(value) => updateField("cidade_residencia", value)}
                  placeholder="Ex.: Belo Horizonte"
                />

                <Field
                  label="Estado"
                  value={form.estado}
                  onChange={(value) => updateField("estado", value)}
                  placeholder="Ex.: MG"
                />

                <Field
                  label="Área de atuação"
                  value={form.filial}
                  onChange={(value) => updateField("filial", value)}
                  placeholder="Ex.: BH, região metropolitana, viagens"
                />

                <Field
                  label="WhatsApp"
                  value={form.telefone}
                  onChange={(value) => updateField("telefone", value)}
                  placeholder="(31) 99999-0000"
                />

                <Field
                  label="E-mail"
                  value={form.email}
                  onChange={(value) => updateField("email", value)}
                  placeholder="email@exemplo.com"
                />

                <Field
                  label="Número da CNH"
                  value={form.cnh_numero}
                  onChange={(value) => updateField("cnh_numero", value)}
                  placeholder="Número da habilitação"
                />

                <Field
                  label="Categoria da CNH"
                  value={form.cnh_categoria}
                  onChange={(value) => updateField("cnh_categoria", value)}
                  placeholder="Ex.: B"
                />

                <Field
                  label="Validade da CNH"
                  value={form.cnh_validade}
                  onChange={(value) => updateField("cnh_validade", value)}
                  placeholder="AAAA-MM-DD"
                  type="date"
                />

                <Field
                  label="Status"
                  value={form.status}
                  onChange={(value) => updateField("status", value)}
                  placeholder="ativo"
                />
              </div>

              <div style={{ marginTop: 14 }}>
                <label style={labelStyle}>Observações</label>
                <textarea
                  value={form.observacoes}
                  onChange={(event) => updateField("observacoes", event.target.value)}
                  placeholder="Observações do condutor"
                  style={textareaStyle}
                  rows={4}
                />
              </div>

              {error ? <div style={errorBox}>{error}</div> : null}
              {feedback ? <div style={successBox}>{feedback}</div> : null}

              <button
                type="submit"
                disabled={!canSubmit || saving}
                style={{
                  width: "100%",
                  height: 54,
                  border: 0,
                  borderRadius: 16,
                  marginTop: 16,
                  cursor: canSubmit && !saving ? "pointer" : "not-allowed",
                  fontWeight: 900,
                  fontSize: 17,
                  color: "#04110a",
                  background:
                    canSubmit && !saving
                      ? "linear-gradient(135deg, #22c55e, #86efac)"
                      : "linear-gradient(135deg, #6b7280, #9ca3af)",
                  boxShadow:
                    canSubmit && !saving
                      ? "0 18px 40px rgba(34,197,94,0.25)"
                      : "none",
                }}
              >
                {saving ? "Salvando..." : "Salvar condutor"}
              </button>
            </form>
          </aside>
        </div>

        <section
          style={{
            marginTop: 24,
            padding: 20,
            borderRadius: 24,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: "0.2em",
              color: "#8db5d9",
              marginBottom: 12,
            }}
          >
            RESPONSABILIDADE
          </div>

          <div
            style={{
              color: "#f2f8ff",
              fontSize: 15,
              lineHeight: 1.7,
            }}
          >
            A Aurora IA atua como elo virtual entre empresas, locadoras e
            condutores. A verificação de documentos, idoneidade, experiência,
            contratação, pagamento e responsabilidade operacional são de total
            responsabilidade da empresa contratante. Sempre conferir
            documentação e idoneidade do condutor cadastrado antes de qualquer
            serviço.
          </div>
        </section>

        <section
          style={{
            marginTop: 24,
            padding: 20,
            borderRadius: 24,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              marginBottom: 16,
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 30,
                  fontWeight: 900,
                  letterSpacing: "-0.03em",
                }}
              >
                Buscar condutores
              </h2>
              <p
                style={{
                  margin: "8px 0 0",
                  color: "#bcd3ea",
                  fontSize: 15,
                  lineHeight: 1.6,
                }}
              >
                Filtre por nome, cidade, estado e área de atuação.
              </p>
            </div>

            <button type="button" onClick={clearFilters} style={secondaryButton}>
              Limpar filtros
            </button>
          </div>

          <div className="aurora-filters-grid" style={filtersGrid}>
            <Field
              label="Nome"
              value={searchNome}
              onChange={setSearchNome}
              placeholder="Ex.: Ricardo"
            />
            <Field
              label="Cidade"
              value={searchCidade}
              onChange={setSearchCidade}
              placeholder="Ex.: Belo Horizonte"
            />
            <Field
              label="Estado"
              value={searchEstado}
              onChange={setSearchEstado}
              placeholder="Ex.: MG"
            />
            <Field
              label="Área de atuação"
              value={searchArea}
              onChange={setSearchArea}
              placeholder="Ex.: viagens"
            />
          </div>
        </section>

        <section style={{ marginTop: 24 }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              marginBottom: 16,
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 30,
                  fontWeight: 900,
                  letterSpacing: "-0.03em",
                }}
              >
                Condutores cadastrados
              </h2>
              <p
                style={{
                  margin: "8px 0 0",
                  color: "#bcd3ea",
                  fontSize: 15,
                  lineHeight: 1.6,
                }}
              >
                Lista atualizada diretamente do Supabase.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              <button type="button" onClick={loadCondutores} style={secondaryButton}>
                Atualizar lista
              </button>

              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 46,
                  padding: "0 16px",
                  borderRadius: 14,
                  color: "#b9f7cf",
                  border: "1px solid rgba(34,197,94,0.24)",
                  background: "rgba(34,197,94,0.10)",
                  fontWeight: 800,
                  fontSize: 14,
                }}
              >
                {filteredItems.length} resultado(s)
              </div>
            </div>
          </div>

          {loading ? (
            <div style={emptyBox}>Carregando condutores...</div>
          ) : filteredItems.length === 0 ? (
            <div style={emptyBox}>Nenhum condutor encontrado com esses filtros.</div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 16,
              }}
            >
              {filteredItems.map((item) => {
                const whatsapp = (item.telefone || "").replace(/\D/g, "");

                return (
                  <article key={item.id} style={listCard}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 10,
                        marginBottom: 10,
                      }}
                    >
                      <h3
                        style={{
                          margin: 0,
                          fontSize: 22,
                          fontWeight: 800,
                          lineHeight: 1.2,
                        }}
                      >
                        {item.nome}
                      </h3>

                      <span style={statusBadge}>{item.status || "ativo"}</span>
                    </div>

                    <div style={listText}>
                      <strong>Cidade:</strong> {item.cidade_residencia || "-"}
                    </div>
                    <div style={listText}>
                      <strong>Estado:</strong> {item.estado || "-"}
                    </div>
                    <div style={listText}>
                      <strong>Área de atuação:</strong> {item.filial || "-"}
                    </div>
                    <div style={listText}>
                      <strong>WhatsApp:</strong> {item.telefone || "-"}
                    </div>
                    <div style={listText}>
                      <strong>E-mail:</strong> {item.email || "-"}
                    </div>
                    <div style={listText}>
                      <strong>CNH:</strong> {item.cnh_numero || "-"}
                    </div>
                    <div style={listText}>
                      <strong>Categoria:</strong> {item.cnh_categoria || "-"}
                    </div>
                    <div style={listText}>
                      <strong>Validade:</strong> {item.cnh_validade || "-"}
                    </div>
                    <div style={listText}>
                      <strong>Observações:</strong> {item.observacoes || "-"}
                    </div>

                    {whatsapp ? (
                      <a
                        href={`https://wa.me/${whatsapp}`}
                        target="_blank"
                        rel="noreferrer"
                        style={whatsButton}
                      >
                        📲 Chamar no WhatsApp
                      </a>
                    ) : null}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </section>

      <style jsx global>{`
        @media (max-width: 980px) {
          .aurora-condutores-grid {
            grid-template-columns: 1fr !important;
          }

          .aurora-form-grid {
            grid-template-columns: 1fr !important;
          }

          .aurora-filters-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        style={inputStyle}
      />
    </div>
  );
}

const secondaryButton: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 46,
  padding: "0 16px",
  borderRadius: 14,
  textDecoration: "none",
  fontWeight: 700,
  fontSize: 14,
  color: "#e5e7eb",
  border: "1px solid rgba(148,163,184,0.28)",
  background: "rgba(15,23,42,0.62)",
  cursor: "pointer",
};

const heroCard: React.CSSProperties = {
  position: "relative",
  overflow: "hidden",
  borderRadius: 30,
  border: "1px solid rgba(255,255,255,0.08)",
  background:
    "linear-gradient(180deg, rgba(10,24,36,0.92) 0%, rgba(5,11,18,0.98) 100%)",
  boxShadow: "0 30px 80px rgba(0,0,0,0.38)",
  padding: "28px 22px 24px",
  minWidth: 0,
};

const formCard: React.CSSProperties = {
  borderRadius: 30,
  border: "1px solid rgba(255,255,255,0.08)",
  background:
    "linear-gradient(180deg, rgba(10,18,30,0.96) 0%, rgba(4,8,14,0.99) 100%)",
  boxShadow: "0 26px 70px rgba(0,0,0,0.34)",
  padding: 22,
  minWidth: 0,
  alignSelf: "start",
};

const formGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 14,
};

const filtersGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
  gap: 14,
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: 8,
  color: "#dcecff",
  fontWeight: 800,
  fontSize: 14,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 52,
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.06)",
  color: "#ffffff",
  outline: "none",
  padding: "0 16px",
  fontSize: 15,
  boxSizing: "border-box",
};

const textareaStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.06)",
  color: "#ffffff",
  outline: "none",
  padding: "14px 16px",
  fontSize: 15,
  boxSizing: "border-box",
  resize: "vertical",
};

const pillStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 42,
  padding: "0 16px",
  borderRadius: 999,
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "#e5f0fb",
  fontWeight: 700,
  fontSize: 14,
};

const infoBox: React.CSSProperties = {
  marginTop: 28,
  padding: 18,
  borderRadius: 22,
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.07)",
};

const infoLabel: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: "0.2em",
  color: "#8db5d9",
  marginBottom: 12,
};

const infoText: React.CSSProperties = {
  color: "#f2f8ff",
  fontSize: 16,
  lineHeight: 1.7,
};

const errorBox: React.CSSProperties = {
  marginTop: 14,
  padding: "12px 14px",
  borderRadius: 14,
  background: "rgba(239,68,68,0.10)",
  border: "1px solid rgba(239,68,68,0.24)",
  color: "#ffd1d1",
  fontSize: 14,
  lineHeight: 1.5,
};

const successBox: React.CSSProperties = {
  marginTop: 14,
  padding: "12px 14px",
  borderRadius: 14,
  background: "rgba(34,197,94,0.10)",
  border: "1px solid rgba(34,197,94,0.24)",
  color: "#cffff0",
  fontSize: 14,
  lineHeight: 1.5,
};

const emptyBox: React.CSSProperties = {
  padding: 22,
  borderRadius: 22,
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.07)",
  color: "#dbe9f7",
  fontSize: 15,
  lineHeight: 1.6,
};

const listCard: React.CSSProperties = {
  minWidth: 0,
  borderRadius: 24,
  padding: 20,
  background: "linear-gradient(180deg, rgba(10,24,36,0.92), rgba(5,11,18,0.98))",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 22px 60px rgba(0,0,0,0.28)",
};

const listText: React.CSSProperties = {
  color: "#cbd5e1",
  fontSize: 14,
  lineHeight: 1.7,
  marginBottom: 4,
};

const statusBadge: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 30,
  padding: "0 10px",
  borderRadius: 999,
  background: "rgba(34,197,94,0.12)",
  border: "1px solid rgba(34,197,94,0.24)",
  color: "#b9f7cf",
  fontWeight: 800,
  fontSize: 12,
};

const whatsButton: React.CSSProperties = {
  display: "inline-block",
  marginTop: 12,
  padding: "10px 14px",
  borderRadius: 10,
  background: "#25D366",
  color: "#04110a",
  fontWeight: 800,
  textDecoration: "none",
  fontSize: 14,
};