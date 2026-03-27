"use client";

import { useState } from "react";
import Link from "next/link";

type FormState = {
  companyName: string;
  companyCity: string;
  companyState: string;
  companyWhatsapp: string;
  companyEmail: string;

  contactName: string;
  contactRole: string;
  contactWhatsapp: string;
  contactEmail: string;

  category: string;
  title: string;
  description: string;
  listingCity: string;
  listingState: string;

  coverageType: "local" | "regional" | "state" | "national";
  maxRadiusKm: string;
  deliveryAvailable: boolean;
  pickupAvailable: boolean;

  latitude: string;
  longitude: string;
};

const INITIAL_FORM: FormState = {
  companyName: "",
  companyCity: "",
  companyState: "",
  companyWhatsapp: "",
  companyEmail: "",

  contactName: "",
  contactRole: "sales",
  contactWhatsapp: "",
  contactEmail: "",

  category: "compradores",
  title: "",
  description: "",
  listingCity: "",
  listingState: "",

  coverageType: "state",
  maxRadiusKm: "250",
  deliveryAvailable: true,
  pickupAvailable: true,

  latitude: "",
  longitude: "",
};

export default function AgroCadastrarPage() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/agro/cadastrar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Não foi possível cadastrar agora.");
      }

      setMessage("Cadastro realizado com sucesso no AGRO.");
      setForm(INITIAL_FORM);
    } catch (err) {
      const text =
        err instanceof Error ? err.message : "Erro inesperado ao cadastrar.";
      setError(text);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #04110a 0%, #081226 45%, #101828 100%)",
        color: "#ffffff",
        padding: "24px",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 24,
            alignItems: "center",
            marginBottom: 28,
          }}
        >
          <div>
            <span style={topBadge}>Aurora AGRO • Cadastrar</span>

            <h1
              style={{
                margin: "14px 0 14px 0",
                fontSize: "clamp(30px, 5vw, 56px)",
                lineHeight: 1.04,
                fontWeight: 900,
              }}
            >
              Cadastro real de empresa, contato e anúncio do AGRO
            </h1>

            <p
              style={{
                margin: 0,
                color: "rgba(255,255,255,0.78)",
                fontSize: 18,
                lineHeight: 1.65,
                maxWidth: 760,
              }}
            >
              Esta página prepara a entrada real de dados no Supabase para o
              AGRO, sem depender de SQL manual, com empresa, contato principal,
              anúncio e cobertura de atendimento.
            </p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
                marginTop: 24,
              }}
            >
              <Link href="/agro" style={secondaryButton}>
                Voltar ao AGRO
              </Link>

              <Link href="/agro/busca-local" style={secondaryButton}>
                Ver busca local
              </Link>
            </div>
          </div>

          <div style={heroCard}>
            <div style={heroBadge}>Entrada profissional</div>

            <h2
              style={{
                margin: "0 0 12px 0",
                fontSize: 26,
                fontWeight: 800,
              }}
            >
              Formulário preparado para banco real
            </h2>

            <p
              style={{
                margin: 0,
                color: "rgba(255,255,255,0.74)",
                lineHeight: 1.7,
              }}
            >
              Neste fluxo, cada empresa cadastra seus próprios dados, seu
              contato principal e seu anúncio. Depois a plataforma resolve o
              WhatsApp certo automaticamente.
            </p>

            <div style={statsGrid}>
              <div style={statCard}>
                <strong style={statNumber}>Empresa</strong>
                <span style={statLabel}>dados principais</span>
              </div>

              <div style={statCard}>
                <strong style={statNumber}>Contato</strong>
                <span style={statLabel}>responsável</span>
              </div>

              <div style={statCard}>
                <strong style={statNumber}>Anúncio</strong>
                <span style={statLabel}>categoria e oferta</span>
              </div>

              <div style={statCard}>
                <strong style={statNumber}>Cobertura</strong>
                <span style={statLabel}>local ao nacional</span>
              </div>
            </div>
          </div>
        </section>

        <form onSubmit={handleSubmit} style={formCard}>
          <section style={sectionStyle}>
            <h2 style={sectionTitle}>1. Empresa</h2>

            <div style={grid2}>
              <label style={fieldStyle}>
                <span style={labelStyle}>Nome da empresa</span>
                <input
                  value={form.companyName}
                  onChange={(e) => updateField("companyName", e.target.value)}
                  style={inputStyle}
                  placeholder="Ex.: Agro Forte Minas"
                  required
                />
              </label>

              <label style={fieldStyle}>
                <span style={labelStyle}>WhatsApp da empresa</span>
                <input
                  value={form.companyWhatsapp}
                  onChange={(e) =>
                    updateField("companyWhatsapp", e.target.value)
                  }
                  style={inputStyle}
                  placeholder="Ex.: 5531999999999"
                  required
                />
              </label>

              <label style={fieldStyle}>
                <span style={labelStyle}>Cidade da empresa</span>
                <input
                  value={form.companyCity}
                  onChange={(e) => updateField("companyCity", e.target.value)}
                  style={inputStyle}
                  placeholder="Ex.: Belo Horizonte"
                  required
                />
              </label>

              <label style={fieldStyle}>
                <span style={labelStyle}>Estado da empresa</span>
                <input
                  value={form.companyState}
                  onChange={(e) => updateField("companyState", e.target.value)}
                  style={inputStyle}
                  placeholder="Ex.: MG"
                  required
                />
              </label>

              <label style={fieldStyleWide}>
                <span style={labelStyle}>E-mail da empresa</span>
                <input
                  value={form.companyEmail}
                  onChange={(e) => updateField("companyEmail", e.target.value)}
                  style={inputStyle}
                  placeholder="Ex.: contato@empresa.com"
                />
              </label>
            </div>
          </section>

          <section style={sectionStyle}>
            <h2 style={sectionTitle}>2. Contato principal</h2>

            <div style={grid2}>
              <label style={fieldStyle}>
                <span style={labelStyle}>Nome do contato</span>
                <input
                  value={form.contactName}
                  onChange={(e) => updateField("contactName", e.target.value)}
                  style={inputStyle}
                  placeholder="Ex.: Marcos Agro"
                  required
                />
              </label>

              <label style={fieldStyle}>
                <span style={labelStyle}>Função</span>
                <select
                  value={form.contactRole}
                  onChange={(e) => updateField("contactRole", e.target.value)}
                  style={inputStyle}
                >
                  <option value="sales">Vendas</option>
                  <option value="buyer">Compras</option>
                  <option value="manager">Gerente</option>
                  <option value="support">Suporte</option>
                  <option value="owner">Proprietário</option>
                  <option value="finance">Financeiro</option>
                  <option value="custom">Outro</option>
                </select>
              </label>

              <label style={fieldStyle}>
                <span style={labelStyle}>WhatsApp do contato</span>
                <input
                  value={form.contactWhatsapp}
                  onChange={(e) =>
                    updateField("contactWhatsapp", e.target.value)
                  }
                  style={inputStyle}
                  placeholder="Ex.: 5531988888888"
                  required
                />
              </label>

              <label style={fieldStyle}>
                <span style={labelStyle}>E-mail do contato</span>
                <input
                  value={form.contactEmail}
                  onChange={(e) => updateField("contactEmail", e.target.value)}
                  style={inputStyle}
                  placeholder="Ex.: contato@empresa.com"
                />
              </label>
            </div>
          </section>

          <section style={sectionStyle}>
            <h2 style={sectionTitle}>3. Anúncio AGRO</h2>

            <div style={grid2}>
              <label style={fieldStyle}>
                <span style={labelStyle}>Categoria</span>
                <select
                  value={form.category}
                  onChange={(e) => updateField("category", e.target.value)}
                  style={inputStyle}
                >
                  <option value="compradores">Compradores</option>
                  <option value="fornecedores">Fornecedores</option>
                  <option value="insumos">Insumos</option>
                  <option value="servicos">Serviços</option>
                </select>
              </label>

              <label style={fieldStyle}>
                <span style={labelStyle}>Título do anúncio</span>
                <input
                  value={form.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  style={inputStyle}
                  placeholder="Ex.: Compra de sementes e fertilizantes"
                  required
                />
              </label>

              <label style={fieldStyleWide}>
                <span style={labelStyle}>Descrição</span>
                <textarea
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  style={textareaStyle}
                  placeholder="Descreva a oferta, a necessidade ou o serviço."
                  required
                />
              </label>

              <label style={fieldStyle}>
                <span style={labelStyle}>Cidade do anúncio</span>
                <input
                  value={form.listingCity}
                  onChange={(e) => updateField("listingCity", e.target.value)}
                  style={inputStyle}
                  placeholder="Ex.: Belo Horizonte"
                  required
                />
              </label>

              <label style={fieldStyle}>
                <span style={labelStyle}>Estado do anúncio</span>
                <input
                  value={form.listingState}
                  onChange={(e) => updateField("listingState", e.target.value)}
                  style={inputStyle}
                  placeholder="Ex.: MG"
                  required
                />
              </label>
            </div>
          </section>

          <section style={sectionStyle}>
            <h2 style={sectionTitle}>4. Cobertura e localização</h2>

            <div style={grid2}>
              <label style={fieldStyle}>
                <span style={labelStyle}>Tipo de cobertura</span>
                <select
                  value={form.coverageType}
                  onChange={(e) =>
                    updateField(
                      "coverageType",
                      e.target.value as FormState["coverageType"]
                    )
                  }
                  style={inputStyle}
                >
                  <option value="local">Local</option>
                  <option value="regional">Regional</option>
                  <option value="state">Estadual</option>
                  <option value="national">Nacional</option>
                </select>
              </label>

              <label style={fieldStyle}>
                <span style={labelStyle}>Raio máximo em KM</span>
                <input
                  value={form.maxRadiusKm}
                  onChange={(e) => updateField("maxRadiusKm", e.target.value)}
                  style={inputStyle}
                  placeholder="Ex.: 250"
                />
              </label>

              <label style={fieldStyle}>
                <span style={labelStyle}>Latitude</span>
                <input
                  value={form.latitude}
                  onChange={(e) => updateField("latitude", e.target.value)}
                  style={inputStyle}
                  placeholder="Ex.: -19.9167"
                />
              </label>

              <label style={fieldStyle}>
                <span style={labelStyle}>Longitude</span>
                <input
                  value={form.longitude}
                  onChange={(e) => updateField("longitude", e.target.value)}
                  style={inputStyle}
                  placeholder="Ex.: -43.9345"
                />
              </label>

              <label style={checkboxField}>
                <input
                  type="checkbox"
                  checked={form.deliveryAvailable}
                  onChange={(e) =>
                    updateField("deliveryAvailable", e.target.checked)
                  }
                />
                <span>Entrega disponível</span>
              </label>

              <label style={checkboxField}>
                <input
                  type="checkbox"
                  checked={form.pickupAvailable}
                  onChange={(e) =>
                    updateField("pickupAvailable", e.target.checked)
                  }
                />
                <span>Retirada disponível</span>
              </label>
            </div>
          </section>

          {(message || error) && (
            <section
              style={{
                ...feedbackBox,
                borderColor: error
                  ? "rgba(248,113,113,0.35)"
                  : "rgba(134,239,172,0.30)",
                color: error ? "#fecaca" : "#bbf7d0",
              }}
            >
              {error || message}
            </section>
          )}

          <section
            style={{
              marginTop: 22,
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <button type="submit" style={primaryButton} disabled={loading}>
              {loading ? "Salvando..." : "Cadastrar no AGRO"}
            </button>

            <button
              type="button"
              style={secondaryButtonAsButton}
              onClick={() => {
                setForm(INITIAL_FORM);
                setMessage("");
                setError("");
              }}
              disabled={loading}
            >
              Limpar formulário
            </button>
          </section>
        </form>

        <section style={noticeBox}>
          Sistema em constante atualização e expansão. Podem ocorrer momentos de
          instabilidade durante melhorias, ajustes e novos lançamentos.
        </section>
      </div>
    </main>
  );
}

const topBadge: React.CSSProperties = {
  display: "inline-flex",
  width: "fit-content",
  padding: "8px 14px",
  borderRadius: 999,
  background: "rgba(34,197,94,0.14)",
  border: "1px solid rgba(34,197,94,0.35)",
  color: "#bbf7d0",
  fontSize: 13,
  fontWeight: 700,
};

const heroCard: React.CSSProperties = {
  padding: 24,
  borderRadius: 24,
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04))",
  border: "1px solid rgba(255,255,255,0.10)",
  boxShadow: "0 18px 40px rgba(0,0,0,0.22)",
};

const heroBadge: React.CSSProperties = {
  display: "inline-flex",
  marginBottom: 14,
  padding: "8px 12px",
  borderRadius: 999,
  background: "rgba(34,197,94,0.12)",
  border: "1px solid rgba(34,197,94,0.28)",
  color: "#bbf7d0",
  fontSize: 12,
  fontWeight: 700,
};

const statsGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 12,
  marginTop: 20,
};

const statCard: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
  padding: 14,
  borderRadius: 16,
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.08)",
};

const statNumber: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 800,
};

const statLabel: React.CSSProperties = {
  color: "rgba(255,255,255,0.68)",
  fontSize: 13,
};

const formCard: React.CSSProperties = {
  padding: 22,
  borderRadius: 24,
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
};

const sectionStyle: React.CSSProperties = {
  marginTop: 18,
  padding: 20,
  borderRadius: 20,
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.08)",
};

const sectionTitle: React.CSSProperties = {
  margin: "0 0 16px 0",
  fontSize: 24,
  fontWeight: 800,
};

const grid2: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: 16,
};

const fieldStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

const fieldStyleWide: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
  gridColumn: "1 / -1",
};

const labelStyle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 700,
  color: "rgba(255,255,255,0.86)",
};

const inputStyle: React.CSSProperties = {
  minHeight: 48,
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.06)",
  color: "#ffffff",
  padding: "0 14px",
  outline: "none",
};

const textareaStyle: React.CSSProperties = {
  minHeight: 120,
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.06)",
  color: "#ffffff",
  padding: "14px",
  outline: "none",
  resize: "vertical",
};

const checkboxField: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  minHeight: 48,
  padding: "0 14px",
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.06)",
};

const primaryButton: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 50,
  padding: "0 20px",
  borderRadius: 14,
  border: "1px solid rgba(134,239,172,0.7)",
  background: "#86efac",
  color: "#052e16",
  fontWeight: 800,
  cursor: "pointer",
};

const secondaryButton: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 46,
  padding: "0 16px",
  borderRadius: 14,
  textDecoration: "none",
  fontWeight: 700,
  color: "#ffffff",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.12)",
};

const secondaryButtonAsButton: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 50,
  padding: "0 20px",
  borderRadius: 14,
  fontWeight: 700,
  color: "#ffffff",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.12)",
  cursor: "pointer",
};

const feedbackBox: React.CSSProperties = {
  marginTop: 20,
  padding: 16,
  borderRadius: 16,
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.10)",
  lineHeight: 1.6,
};

const noticeBox: React.CSSProperties = {
  marginTop: 26,
  padding: 18,
  borderRadius: 18,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.05)",
  color: "rgba(255,255,255,0.72)",
  lineHeight: 1.6,
};