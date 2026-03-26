"use client";

import { useEffect, useMemo, useState } from "react";

type AdvertiserType =
  | "locadora"
  | "imobiliaria"
  | "corretor"
  | "banco"
  | "seguradora"
  | "correspondente"
  | "despachante";

type FormState = {
  advertiserType: AdvertiserType;
  companyName: string;
  contactName: string;
  email: string;
  whatsapp: string;
  phone: string;
  country: string;
  state: string;
  city: string;
  municipality: string;
  neighborhood: string;
  postalCode: string;
  description: string;
};

type SubmitStatus = "idle" | "saving" | "success" | "error";

const advertiserOptions: { value: AdvertiserType; label: string }[] = [
  { value: "locadora", label: "Locadora / Loja de veículos" },
  { value: "imobiliaria", label: "Imobiliária" },
  { value: "corretor", label: "Corretor" },
  { value: "banco", label: "Banco / Financeira" },
  { value: "seguradora", label: "Seguradora" },
  { value: "correspondente", label: "Correspondente bancário" },
  { value: "despachante", label: "Despachante" },
];

const initialState: FormState = {
  advertiserType: "locadora",
  companyName: "",
  contactName: "",
  email: "",
  whatsapp: "",
  phone: "",
  country: "Brasil",
  state: "",
  city: "",
  municipality: "",
  neighborhood: "",
  postalCode: "",
  description: "",
};

function normalizePhone(value: string) {
  return value.replace(/\D/g, "");
}

function buildWhatsAppLink(phone: string, companyName: string) {
  const digits = normalizePhone(phone);
  if (!digits) return "";

  const message = encodeURIComponent(
    `Olá! Quero falar sobre o cadastro do anunciante ${companyName || "na Aurora"}.`
  );

  return `https://wa.me/${digits}?text=${message}`;
}

function isAdvertiserType(value: string): value is AdvertiserType {
  return [
    "locadora",
    "imobiliaria",
    "corretor",
    "banco",
    "seguradora",
    "correspondente",
    "despachante",
  ].includes(value);
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top, rgba(34,197,94,0.10), transparent 20%), radial-gradient(circle at top right, rgba(59,130,246,0.08), transparent 24%), linear-gradient(180deg, #050505 0%, #0b0b0b 100%)",
    color: "#ffffff",
    padding: "32px 16px",
  } as React.CSSProperties,
  container: {
    maxWidth: "1280px",
    margin: "0 auto",
  } as React.CSSProperties,
  hero: {
    display: "grid",
    gridTemplateColumns: "1.15fr 0.85fr",
    gap: "20px",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: "28px",
    background: "rgba(255,255,255,0.04)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
    overflow: "hidden",
    marginBottom: "28px",
  } as React.CSSProperties,
  heroLeft: {
    padding: "28px",
    background:
      "linear-gradient(135deg, rgba(34,197,94,0.10), rgba(59,130,246,0.06), rgba(255,255,255,0.01))",
    borderRight: "1px solid rgba(255,255,255,0.08)",
  } as React.CSSProperties,
  heroRight: {
    padding: "28px",
    display: "grid",
    gap: "14px",
  } as React.CSSProperties,
  badge: {
    display: "inline-block",
    padding: "8px 14px",
    borderRadius: "999px",
    border: "1px solid rgba(34,197,94,0.25)",
    background: "rgba(34,197,94,0.10)",
    color: "#86efac",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.2em",
    textTransform: "uppercase" as const,
  },
  pillWrap: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "10px",
    marginTop: "20px",
  },
  pill: {
    padding: "8px 14px",
    borderRadius: "999px",
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.04)",
    color: "#e5e7eb",
    fontSize: "12px",
  },
  miniCard: {
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(0,0,0,0.3)",
    borderRadius: "20px",
    padding: "18px",
  } as React.CSSProperties,
  sectionGrid: {
    display: "grid",
    gridTemplateColumns: "1.08fr 0.92fr",
    gap: "24px",
  } as React.CSSProperties,
  mainCard: {
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.04)",
    borderRadius: "28px",
    padding: "24px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
  } as React.CSSProperties,
  innerHeader: {
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(0,0,0,0.22)",
    borderRadius: "24px",
    padding: "18px",
    marginBottom: "18px",
  } as React.CSSProperties,
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  } as React.CSSProperties,
  fieldCard: {
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(0,0,0,0.22)",
    borderRadius: "24px",
    padding: "16px",
  } as React.CSSProperties,
  fullSpan: {
    gridColumn: "1 / -1",
  } as React.CSSProperties,
  label: {
    display: "block",
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: 600,
    color: "#ffffff",
  } as React.CSSProperties,
  input: {
    width: "100%",
    borderRadius: "18px",
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(0,0,0,0.35)",
    color: "#ffffff",
    padding: "14px 16px",
    fontSize: "14px",
    outline: "none",
  } as React.CSSProperties,
  textarea: {
    width: "100%",
    borderRadius: "18px",
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(0,0,0,0.35)",
    color: "#ffffff",
    padding: "14px 16px",
    fontSize: "14px",
    outline: "none",
    resize: "vertical" as const,
  } as React.CSSProperties,
  buttonWrap: {
    marginTop: "18px",
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(0,0,0,0.22)",
    borderRadius: "24px",
    padding: "16px",
  } as React.CSSProperties,
  button: {
    width: "100%",
    border: "none",
    borderRadius: "18px",
    background: "#22c55e",
    color: "#000000",
    padding: "14px 16px",
    fontWeight: 700,
    fontSize: "15px",
    cursor: "pointer",
  } as React.CSSProperties,
  buttonDisabled: {
    opacity: 0.7,
    cursor: "not-allowed",
  } as React.CSSProperties,
  sideColumn: {
    display: "grid",
    gap: "24px",
  } as React.CSSProperties,
  infoBox: {
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(0,0,0,0.25)",
    borderRadius: "20px",
    padding: "14px 16px",
    color: "#e5e7eb",
    fontSize: "14px",
  } as React.CSSProperties,
  whatsappButton: {
    marginTop: "16px",
    display: "block",
    width: "100%",
    textAlign: "center" as const,
    textDecoration: "none",
    borderRadius: "18px",
    background: "#22c55e",
    color: "#000000",
    padding: "14px 16px",
    fontWeight: 700,
  } as React.CSSProperties,
  statusSuccess: {
    border: "1px solid rgba(34,197,94,0.25)",
    background: "rgba(34,197,94,0.10)",
    color: "#bbf7d0",
    borderRadius: "18px",
    padding: "14px 16px",
    marginBottom: "16px",
    lineHeight: 1.6,
  } as React.CSSProperties,
  statusError: {
    border: "1px solid rgba(239,68,68,0.25)",
    background: "rgba(239,68,68,0.10)",
    color: "#fecaca",
    borderRadius: "18px",
    padding: "14px 16px",
    marginBottom: "16px",
    lineHeight: 1.6,
  } as React.CSSProperties,
};

export default function CadastroAnunciantePage() {
  const [form, setForm] = useState<FormState>(initialState);
  const [submitted, setSubmitted] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [submitMessage, setSubmitMessage] = useState("");
  const [createdId, setCreatedId] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const tipo = params.get("tipo")?.trim().toLowerCase() ?? "";

    if (isAdvertiserType(tipo)) {
      setForm((current) => ({
        ...current,
        advertiserType: tipo,
      }));
    }
  }, []);

  const whatsappPreview = useMemo(
    () => buildWhatsAppLink(form.whatsapp, form.companyName),
    [form.whatsapp, form.companyName]
  );

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSubmitted(false);
    setSubmitStatus("saving");
    setSubmitMessage("");
    setCreatedId("");

    try {
      const response = await fetch("/api/advertisers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = (await response.json()) as {
        ok?: boolean;
        error?: string;
        message?: string;
        advertiser?: {
          id?: string;
          advertiser_type?: string;
          company_name?: string;
          created_at?: string;
        };
      };

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Não foi possível salvar o cadastro.");
      }

      setSubmitted(true);
      setSubmitStatus("success");
      setSubmitMessage(
        result.message || "Cadastro salvo com sucesso no banco."
      );
      setCreatedId(result.advertiser?.id || "");

      setForm((current) => ({
        ...initialState,
        advertiserType: current.advertiserType,
      }));
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Erro ao enviar cadastro.";

      setSubmitStatus("error");
      setSubmitMessage(message);
    }
  }

  const typeLabel =
    advertiserOptions.find((item) => item.value === form.advertiserType)?.label ??
    "Tipo não informado";

  const locationLabel =
    [form.neighborhood, form.municipality, form.city, form.state, form.country]
      .filter(Boolean)
      .join(", ") || "-";

  const isSaving = submitStatus === "saving";

  return (
    <main style={styles.page}>
      <section style={styles.container}>
        <div style={styles.hero}>
          <div style={styles.heroLeft}>
            <div style={styles.badge}>Aurora Anúncios</div>

            <h1 style={{ fontSize: "38px", marginTop: "18px", marginBottom: "0", lineHeight: 1.1 }}>
              Cadastro do anunciante
            </h1>

            <p style={{ marginTop: "18px", fontSize: "16px", lineHeight: 1.8, color: "#d4d4d8", maxWidth: "700px" }}>
              Entrada profissional para locadoras, imobiliárias, corretores,
              bancos, seguradoras, correspondentes e despachantes dentro do ecossistema Aurora.
            </p>

            <div style={styles.pillWrap}>
              <span style={styles.pill}>Cadastro comercial</span>
              <span style={styles.pill}>Base escalável</span>
              <span style={styles.pill}>Veículos + Imóveis + Financeiro</span>
            </div>
          </div>

          <div style={styles.heroRight}>
            <div style={styles.miniCard}>
              <div style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#71717a" }}>
                Objetivo
              </div>
              <div style={{ marginTop: "8px", fontSize: "15px", fontWeight: 700 }}>
                Cadastrar anunciantes reais
              </div>
            </div>

            <div style={styles.miniCard}>
              <div style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#71717a" }}>
                Rede de apoio
              </div>
              <div style={{ marginTop: "8px", fontSize: "15px", fontWeight: 700 }}>
                Bancos, correspondentes e despachantes
              </div>
            </div>

            <div style={styles.miniCard}>
              <div style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#71717a" }}>
                Aviso
              </div>
              <div style={{ marginTop: "8px", fontSize: "15px", fontWeight: 700 }}>
                Sistema em constante atualização
              </div>
            </div>
          </div>
        </div>

        <div style={styles.sectionGrid}>
          <div style={styles.mainCard}>
            <div style={styles.innerHeader}>
              <h2 style={{ margin: 0, fontSize: "28px" }}>Dados do anunciante</h2>
              <p style={{ marginTop: "8px", marginBottom: 0, color: "#a1a1aa", lineHeight: 1.7 }}>
                Preencha os dados comerciais para iniciar a entrada no ecossistema Aurora.
              </p>
            </div>

            {submitStatus === "success" ? (
              <div style={styles.statusSuccess}>
                <strong>Cadastro salvo com sucesso.</strong>
                <div style={{ marginTop: "6px" }}>{submitMessage}</div>
                {createdId ? (
                  <div style={{ marginTop: "6px" }}>
                    <strong>ID:</strong> {createdId}
                  </div>
                ) : null}
              </div>
            ) : null}

            {submitStatus === "error" ? (
              <div style={styles.statusError}>
                <strong>Erro ao salvar cadastro.</strong>
                <div style={{ marginTop: "6px" }}>{submitMessage}</div>
              </div>
            ) : null}

            <form onSubmit={handleSubmit}>
              <div style={{ ...styles.fieldCard, marginBottom: "16px" }}>
                <label style={styles.label}>Tipo do anunciante</label>
                <select
                  value={form.advertiserType}
                  onChange={(event) =>
                    updateField("advertiserType", event.target.value as AdvertiserType)
                  }
                  style={styles.input}
                  disabled={isSaving}
                >
                  {advertiserOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div style={styles.formGrid}>
                <div style={styles.fieldCard}>
                  <label style={styles.label}>Nome da empresa</label>
                  <input
                    value={form.companyName}
                    onChange={(e) => updateField("companyName", e.target.value)}
                    placeholder="Ex.: Aurora Imóveis BH"
                    style={styles.input}
                    disabled={isSaving}
                  />
                </div>

                <div style={styles.fieldCard}>
                  <label style={styles.label}>Responsável</label>
                  <input
                    value={form.contactName}
                    onChange={(e) => updateField("contactName", e.target.value)}
                    placeholder="Ex.: Ricardo Leonardo"
                    style={styles.input}
                    disabled={isSaving}
                  />
                </div>

                <div style={styles.fieldCard}>
                  <label style={styles.label}>E-mail</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="contato@empresa.com"
                    style={styles.input}
                    disabled={isSaving}
                  />
                </div>

                <div style={styles.fieldCard}>
                  <label style={styles.label}>WhatsApp</label>
                  <input
                    value={form.whatsapp}
                    onChange={(e) => updateField("whatsapp", e.target.value)}
                    placeholder="5531999999999"
                    style={styles.input}
                    disabled={isSaving}
                  />
                </div>

                <div style={styles.fieldCard}>
                  <label style={styles.label}>Telefone</label>
                  <input
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="(31) 0000-0000"
                    style={styles.input}
                    disabled={isSaving}
                  />
                </div>

                <div style={styles.fieldCard}>
                  <label style={styles.label}>País</label>
                  <input
                    value={form.country}
                    onChange={(e) => updateField("country", e.target.value)}
                    placeholder="Brasil"
                    style={styles.input}
                    disabled={isSaving}
                  />
                </div>

                <div style={styles.fieldCard}>
                  <label style={styles.label}>Estado</label>
                  <input
                    value={form.state}
                    onChange={(e) => updateField("state", e.target.value)}
                    placeholder="Minas Gerais"
                    style={styles.input}
                    disabled={isSaving}
                  />
                </div>

                <div style={styles.fieldCard}>
                  <label style={styles.label}>Cidade</label>
                  <input
                    value={form.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    placeholder="Belo Horizonte"
                    style={styles.input}
                    disabled={isSaving}
                  />
                </div>

                <div style={styles.fieldCard}>
                  <label style={styles.label}>Município</label>
                  <input
                    value={form.municipality}
                    onChange={(e) => updateField("municipality", e.target.value)}
                    placeholder="Belo Horizonte"
                    style={styles.input}
                    disabled={isSaving}
                  />
                </div>

                <div style={styles.fieldCard}>
                  <label style={styles.label}>Bairro</label>
                  <input
                    value={form.neighborhood}
                    onChange={(e) => updateField("neighborhood", e.target.value)}
                    placeholder="Centro"
                    style={styles.input}
                    disabled={isSaving}
                  />
                </div>

                <div style={styles.fieldCard}>
                  <label style={styles.label}>CEP</label>
                  <input
                    value={form.postalCode}
                    onChange={(e) => updateField("postalCode", e.target.value)}
                    placeholder="00000-000"
                    style={styles.input}
                    disabled={isSaving}
                  />
                </div>

                <div style={{ ...styles.fieldCard, ...styles.fullSpan }}>
                  <label style={styles.label}>Descrição</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    placeholder="Descreva a empresa, atuação e região atendida."
                    rows={5}
                    style={styles.textarea}
                    disabled={isSaving}
                  />
                </div>
              </div>

              <div style={styles.buttonWrap}>
                <button
                  type="submit"
                  style={{
                    ...styles.button,
                    ...(isSaving ? styles.buttonDisabled : {}),
                  }}
                  disabled={isSaving}
                >
                  {isSaving ? "Salvando cadastro..." : "Salvar cadastro"}
                </button>
              </div>
            </form>
          </div>

          <div style={styles.sideColumn}>
            <div style={styles.mainCard}>
              <div style={styles.innerHeader}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#71717a" }}>
                      Prévia do cadastro
                    </div>
                    <h3 style={{ marginTop: "14px", marginBottom: "0", fontSize: "28px" }}>
                      {form.companyName || "Nome da empresa"}
                    </h3>
                    <p style={{ marginTop: "8px", color: "#a1a1aa" }}>{typeLabel}</p>
                  </div>

                  <span style={styles.badge}>Prévia</span>
                </div>

                <div style={{ display: "grid", gap: "10px", marginTop: "18px" }}>
                  <div style={styles.infoBox}><strong>Responsável:</strong> {form.contactName || "-"}</div>
                  <div style={styles.infoBox}><strong>E-mail:</strong> {form.email || "-"}</div>
                  <div style={styles.infoBox}><strong>WhatsApp:</strong> {form.whatsapp || "-"}</div>
                  <div style={styles.infoBox}><strong>Telefone:</strong> {form.phone || "-"}</div>
                  <div style={styles.infoBox}><strong>Localização:</strong> {locationLabel}</div>
                </div>

                <div style={{ ...styles.infoBox, marginTop: "14px" }}>
                  <div style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#71717a", marginBottom: "10px" }}>
                    Descrição
                  </div>
                  {form.description || "A descrição da empresa aparecerá aqui."}
                </div>

                {whatsappPreview ? (
                  <a href={whatsappPreview} target="_blank" rel="noreferrer" style={styles.whatsappButton}>
                    Testar contato no WhatsApp
                  </a>
                ) : null}
              </div>
            </div>

            <div style={styles.mainCard}>
              <div style={styles.innerHeader}>
                <div style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#71717a" }}>
                  Status atual
                </div>
                <p style={{ marginTop: "14px", color: "#d4d4d8", lineHeight: 1.8 }}>
                  {submitted
                    ? "Cadastro salvo no banco com sucesso. Próximo passo: vincular aos módulos e gerar página própria."
                    : "Formulário pronto para salvar cadastro real no banco."}
                </p>
              </div>
            </div>

            <div style={styles.mainCard}>
              <div style={styles.innerHeader}>
                <div style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#71717a" }}>
                  Futuro de retenção
                </div>
                <p style={{ marginTop: "14px", color: "#d4d4d8", lineHeight: 1.8 }}>
                  Podemos avisar o vendedor sobre visitas, cliques no WhatsApp, interesse real e leads gerados para trazer ele de volta à plataforma.
                </p>
              </div>
            </div>

            <div style={styles.mainCard}>
              <div style={styles.innerHeader}>
                <div style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#71717a" }}>
                  Observação
                </div>
                <p style={{ marginTop: "14px", color: "#a1a1aa", lineHeight: 1.8 }}>
                  Sistema em constante atualização e pode haver momentos de instabilidade.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}