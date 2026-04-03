"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { CSSProperties } from "react";

type FormState = {
  nome: string;
  cpfCnpj: string;
  telefone: string;
  whatsapp: string;
  email: string;
  cidade: string;
  estado: string;
  endereco: string;
  observacoes: string;
};

const initialState: FormState = {
  nome: "",
  cpfCnpj: "",
  telefone: "",
  whatsapp: "",
  email: "",
  cidade: "",
  estado: "",
  endereco: "",
  observacoes: "",
};

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

function buildWhatsAppMessage(form: FormState) {
  return [
    "Olá, equipe Aurora Locadora.",
    "",
    "Novo cadastro de cliente:",
    `Nome: ${form.nome || "-"}`,
    `CPF/CNPJ: ${form.cpfCnpj || "-"}`,
    `Telefone: ${form.telefone || "-"}`,
    `WhatsApp: ${form.whatsapp || "-"}`,
    `E-mail: ${form.email || "-"}`,
    `Cidade: ${form.cidade || "-"}`,
    `Estado: ${form.estado || "-"}`,
    `Endereço: ${form.endereco || "-"}`,
    `Observações: ${form.observacoes || "-"}`,
    "",
    "Enviado pela área de cadastro da locadora.",
    "Sistema em constante atualização e pode haver momentos de instabilidade.",
  ].join("\n");
}

export default function LocadoraCadastroClientesPage() {
  const [form, setForm] = useState<FormState>(initialState);
  const [saved, setSaved] = useState(false);
  const [savingDb, setSavingDb] = useState(false);
  const [dbMessage, setDbMessage] = useState("");
  const [dbError, setDbError] = useState("");

  const whatsappHref = useMemo(() => {
    const phone = "5531997490074";
    const text = encodeURIComponent(buildWhatsAppMessage(form));
    return `https://wa.me/${phone}?text=${text}`;
  }, [form]);

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setSaved(false);
    setDbMessage("");
    setDbError("");
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSaveDraft() {
    try {
      localStorage.setItem(
        "aurora-locadora-cadastro-cliente",
        JSON.stringify(form)
      );
      setSaved(true);
    } catch {
      setSaved(false);
      alert("Não foi possível salvar o rascunho neste navegador.");
    }
  }

  function handleLoadDraft() {
    try {
      const raw = localStorage.getItem("aurora-locadora-cadastro-cliente");
      if (!raw) {
        alert("Nenhum rascunho encontrado.");
        return;
      }

      const parsed = JSON.parse(raw) as Partial<FormState>;
      setForm({
        nome: parsed.nome ?? "",
        cpfCnpj: parsed.cpfCnpj ?? "",
        telefone: parsed.telefone ?? "",
        whatsapp: parsed.whatsapp ?? "",
        email: parsed.email ?? "",
        cidade: parsed.cidade ?? "",
        estado: parsed.estado ?? "",
        endereco: parsed.endereco ?? "",
        observacoes: parsed.observacoes ?? "",
      });
      setSaved(false);
      setDbMessage("");
      setDbError("");
    } catch {
      alert("Não foi possível carregar o rascunho.");
    }
  }

  function handleClear() {
    const ok = window.confirm("Deseja limpar o formulário de cliente?");
    if (!ok) return;
    setForm(initialState);
    setSaved(false);
    setDbMessage("");
    setDbError("");
  }

  async function handleSaveToDatabase() {
    setSavingDb(true);
    setDbMessage("");
    setDbError("");

    try {
      const response = await fetch("/api/locadora/clientes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = (await response.json()) as {
        ok?: boolean;
        message?: string;
        error?: string;
      };

      if (!response.ok || !data.ok) {
        setDbError(data.error || "Erro ao salvar cliente no banco.");
        return;
      }

      setDbMessage(data.message || "Cliente cadastrado com sucesso.");
      setSaved(false);
      setForm(initialState);
      localStorage.removeItem("aurora-locadora-cadastro-cliente");
    } catch (error) {
      setDbError(
        error instanceof Error
          ? error.message
          : "Falha inesperada ao salvar cliente."
      );
    } finally {
      setSavingDb(false);
    }
  }

  return (
    <main style={mainStyle}>
      <section style={containerStyle}>
        <header style={headerStyle}>
          <div style={{ display: "grid", gap: 4 }}>
            <div style={logoStyle}>ricardoiaoficial.com</div>
            <div style={titleStyle}>Aurora Locadora • cadastro de clientes</div>
          </div>

          <div style={badgeStyle}>Sistema em evolução</div>
        </header>

        <div style={topActionsStyle}>
          <Link href="/locadora/cadastros" style={topLinkStyle}>
            Voltar para central de cadastros
          </Link>

          <Link href="/locadora" style={topLinkStyle}>
            Voltar para locadora
          </Link>

          <Link href="/locadora/admin" style={topLinkStyle}>
            Área protegida
          </Link>
        </div>

        <section style={heroCardStyle}>
          <div style={pillBlueStyle}>
            <span>👤</span>
            <span>Cadastro de Clientes · Aurora Locadora</span>
          </div>

          <h1 style={heroTitleStyle}>Cadastro de clientes da locadora</h1>

          <p style={heroTextStyle}>
            Registre clientes, contato principal, localização e observações
            comerciais em uma área pronta para operação real. Sistema em constante
            atualização e pode haver momentos de instabilidade.
          </p>
        </section>

        <section style={mainGridStyle}>
          <section style={panelStyle}>
            <div style={sectionHeaderStyle}>
              <div>
                <div style={eyebrowStyle}>FORMULÁRIO PRINCIPAL</div>
                <h2 style={panelTitleStyle}>Dados do cliente</h2>
              </div>
            </div>

            <div style={formGridStyle}>
              <label style={fieldBlockStyle}>
                <span style={labelStyle}>Nome do cliente</span>
                <input
                  style={inputStyle}
                  value={form.nome}
                  onChange={(e) => updateField("nome", e.target.value)}
                  placeholder="Ex.: Ricardo Leonardo Moreira"
                />
              </label>

              <label style={fieldBlockStyle}>
                <span style={labelStyle}>CPF / CNPJ</span>
                <input
                  style={inputStyle}
                  value={form.cpfCnpj}
                  onChange={(e) => updateField("cpfCnpj", e.target.value)}
                  placeholder="Ex.: 607.953.446-00"
                />
              </label>

              <label style={fieldBlockStyle}>
                <span style={labelStyle}>Telefone</span>
                <input
                  style={inputStyle}
                  value={form.telefone}
                  onChange={(e) => updateField("telefone", e.target.value)}
                  placeholder="Ex.: (31) 3333-0000"
                />
              </label>

              <label style={fieldBlockStyle}>
                <span style={labelStyle}>WhatsApp</span>
                <input
                  style={inputStyle}
                  value={form.whatsapp}
                  onChange={(e) => updateField("whatsapp", e.target.value)}
                  placeholder="Ex.: (31) 99749-0074"
                />
              </label>

              <label style={fieldBlockStyle}>
                <span style={labelStyle}>E-mail</span>
                <input
                  type="email"
                  style={inputStyle}
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  placeholder="Ex.: contato@empresa.com"
                />
              </label>

              <label style={fieldBlockStyle}>
                <span style={labelStyle}>Cidade</span>
                <input
                  style={inputStyle}
                  value={form.cidade}
                  onChange={(e) => updateField("cidade", e.target.value)}
                  placeholder="Ex.: Lagoa Santa"
                />
              </label>

              <label style={fieldBlockStyle}>
                <span style={labelStyle}>Estado</span>
                <input
                  style={inputStyle}
                  value={form.estado}
                  onChange={(e) => updateField("estado", e.target.value)}
                  placeholder="Ex.: MG"
                  maxLength={2}
                />
              </label>

              <label style={{ ...fieldBlockStyle, gridColumn: "1 / -1" }}>
                <span style={labelStyle}>Endereço</span>
                <input
                  style={inputStyle}
                  value={form.endereco}
                  onChange={(e) => updateField("endereco", e.target.value)}
                  placeholder="Ex.: Rua Exemplo, 123 - Centro"
                />
              </label>

              <label style={{ ...fieldBlockStyle, gridColumn: "1 / -1" }}>
                <span style={labelStyle}>Observações comerciais</span>
                <textarea
                  style={textareaStyle}
                  value={form.observacoes}
                  onChange={(e) => updateField("observacoes", e.target.value)}
                  placeholder="Ex.: cliente interessado em locação mensal, compra futura, documentação pendente..."
                />
              </label>
            </div>

            <div style={buttonRowStyle}>
              <button type="button" style={buttonPrimaryStyle} onClick={handleSaveDraft}>
                Salvar rascunho no navegador
              </button>

              <button
                type="button"
                style={buttonPrimaryStyle}
                onClick={handleSaveToDatabase}
                disabled={savingDb}
              >
                {savingDb ? "Salvando no banco..." : "Salvar cliente no banco"}
              </button>

              <button type="button" style={buttonSecondaryStyle} onClick={handleLoadDraft}>
                Carregar rascunho
              </button>

              <button type="button" style={buttonSecondaryStyle} onClick={handleClear}>
                Limpar formulário
              </button>

              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                style={whatsButtonStyle}
              >
                Enviar para WhatsApp comercial
              </a>
            </div>

            {saved ? <div style={successBoxStyle}>Rascunho salvo com sucesso neste navegador.</div> : null}
            {dbMessage ? <div style={successBoxStyle}>{dbMessage}</div> : null}
            {dbError ? <div style={errorBoxStyle}>{dbError}</div> : null}
          </section>

          <aside style={panelStyle}>
            <div style={eyebrowStyle}>RESUMO RÁPIDO</div>
            <h2 style={panelTitleStyle}>Pré-visualização do cadastro</h2>

            <div style={summaryBoxStyle}>
              <SummaryRow label="Nome" value={form.nome} />
              <SummaryRow label="CPF/CNPJ" value={form.cpfCnpj} />
              <SummaryRow label="Telefone" value={form.telefone} />
              <SummaryRow label="WhatsApp" value={form.whatsapp} />
              <SummaryRow label="E-mail" value={form.email} />
              <SummaryRow label="Cidade" value={form.cidade} />
              <SummaryRow label="Estado" value={form.estado.toUpperCase()} />
              <SummaryRow label="Endereço" value={form.endereco} />
            </div>

            <div style={{ marginTop: 18 }}>
              <div style={eyebrowStyle}>DADOS ÚTEIS</div>
              <div style={infoCardStyle}>
                <div style={infoLineStyle}>
                  <strong>WhatsApp limpo:</strong> {onlyDigits(form.whatsapp) || "-"}
                </div>
                <div style={infoLineStyle}>
                  <strong>Telefone limpo:</strong> {onlyDigits(form.telefone) || "-"}
                </div>
                <div style={infoLineStyle}>
                  <strong>UF:</strong> {form.estado.toUpperCase() || "-"}
                </div>
              </div>
            </div>

            <div style={{ marginTop: 18 }}>
              <div style={eyebrowStyle}>PRÓXIMO PASSO</div>
              <div style={infoCardStyle}>
                Depois disso, podemos criar a listagem real dos clientes
                cadastrados dentro da área da locadora e conectar com propostas,
                bancos e operação comercial.
              </div>
            </div>
          </aside>
        </section>
      </section>
    </main>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div style={summaryRowStyle}>
      <div style={summaryLabelStyle}>{label}</div>
      <div style={summaryValueStyle}>{value || "-"}</div>
    </div>
  );
}

const mainStyle: CSSProperties = {
  minHeight: "100vh",
  background:
    "radial-gradient(circle at top, rgba(59,130,246,0.10), transparent 18%), radial-gradient(circle at right, rgba(16,185,129,0.10), transparent 24%), linear-gradient(180deg, #eef6ff 0%, #f7fbff 40%, #edf7f3 100%)",
  color: "#0f172a",
};

const containerStyle: CSSProperties = {
  maxWidth: 1180,
  margin: "0 auto",
  padding: "24px 16px 88px",
  display: "grid",
  gap: 18,
};

const headerStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
  flexWrap: "wrap",
  border: "1px solid rgba(15,23,42,0.08)",
  background: "rgba(255,255,255,0.78)",
  backdropFilter: "blur(14px)",
  borderRadius: 24,
  padding: "14px",
  boxShadow: "0 18px 42px rgba(15,23,42,0.07)",
};

const logoStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 900,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#2563eb",
};

const titleStyle: CSSProperties = {
  fontSize: 18,
  fontWeight: 900,
  lineHeight: 1.2,
  color: "#0f172a",
};

const badgeStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 36,
  padding: "0 12px",
  borderRadius: 999,
  background: "rgba(37,99,235,0.08)",
  border: "1px solid rgba(37,99,235,0.16)",
  color: "#2563eb",
  fontSize: 12,
  fontWeight: 900,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};

const topActionsStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 12,
};

const topLinkStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 48,
  padding: "0 18px",
  borderRadius: 14,
  textDecoration: "none",
  fontWeight: 700,
  fontSize: 15,
  color: "#0f172a",
  border: "1px solid rgba(15,23,42,0.08)",
  background: "rgba(255,255,255,0.78)",
  boxShadow: "0 10px 22px rgba(15,23,42,0.05)",
};

const heroCardStyle: CSSProperties = {
  borderRadius: 24,
  padding: 22,
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,255,255,0.82))",
  border: "1px solid rgba(15,23,42,0.08)",
  boxShadow: "0 22px 60px rgba(15,23,42,0.08)",
  display: "grid",
  gap: 14,
};

const pillBlueStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 10,
  padding: "8px 14px",
  borderRadius: 999,
  background: "rgba(37,99,235,0.08)",
  border: "1px solid rgba(37,99,235,0.16)",
  color: "#2563eb",
  fontWeight: 800,
  fontSize: 13,
  width: "fit-content",
};

const heroTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: "clamp(34px, 8vw, 62px)",
  lineHeight: 1.02,
  letterSpacing: "-0.04em",
  fontWeight: 900,
  maxWidth: 860,
  color: "#0f172a",
};

const heroTextStyle: CSSProperties = {
  marginTop: 0,
  marginBottom: 0,
  maxWidth: 860,
  color: "rgba(15,23,42,0.72)",
  fontSize: "clamp(16px, 3.6vw, 21px)",
  lineHeight: 1.72,
  fontWeight: 700,
};

const mainGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1.5fr) minmax(280px, 0.9fr)",
  gap: 18,
};

const panelStyle: CSSProperties = {
  borderRadius: 24,
  padding: 22,
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,255,255,0.82))",
  border: "1px solid rgba(15,23,42,0.08)",
  boxShadow: "0 22px 60px rgba(15,23,42,0.08)",
};

const sectionHeaderStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  marginBottom: 18,
};

const eyebrowStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: "0.18em",
  color: "#2563eb",
  marginBottom: 10,
};

const panelTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 28,
  fontWeight: 900,
  lineHeight: 1.1,
  color: "#0f172a",
};

const formGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 16,
};

const fieldBlockStyle: CSSProperties = {
  display: "grid",
  gap: 8,
};

const labelStyle: CSSProperties = {
  fontSize: 14,
  fontWeight: 700,
  color: "#334155",
};

const inputStyle: CSSProperties = {
  width: "100%",
  minHeight: 48,
  borderRadius: 14,
  border: "1px solid rgba(15,23,42,0.10)",
  background: "rgba(255,255,255,0.96)",
  color: "#0f172a",
  padding: "0 14px",
  fontSize: 15,
  outline: "none",
  boxShadow: "0 8px 20px rgba(15,23,42,0.03)",
};

const textareaStyle: CSSProperties = {
  width: "100%",
  minHeight: 140,
  borderRadius: 14,
  border: "1px solid rgba(15,23,42,0.10)",
  background: "rgba(255,255,255,0.96)",
  color: "#0f172a",
  padding: 14,
  fontSize: 15,
  outline: "none",
  resize: "vertical",
  fontFamily: "inherit",
  boxShadow: "0 8px 20px rgba(15,23,42,0.03)",
};

const buttonRowStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 12,
  marginTop: 22,
};

const buttonPrimaryStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 48,
  padding: "0 18px",
  borderRadius: 14,
  border: "1px solid rgba(37,99,235,0.16)",
  textDecoration: "none",
  fontWeight: 800,
  fontSize: 15,
  cursor: "pointer",
  color: "#ffffff",
  background: "linear-gradient(135deg, #2563eb, #3b82f6)",
  boxShadow: "0 14px 30px rgba(37,99,235,0.16)",
};

const buttonSecondaryStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 48,
  padding: "0 18px",
  borderRadius: 14,
  border: "1px solid rgba(15,23,42,0.08)",
  textDecoration: "none",
  fontWeight: 700,
  fontSize: 15,
  cursor: "pointer",
  color: "#0f172a",
  background: "rgba(255,255,255,0.78)",
  boxShadow: "0 10px 22px rgba(15,23,42,0.05)",
};

const whatsButtonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 48,
  padding: "0 18px",
  borderRadius: 14,
  textDecoration: "none",
  fontWeight: 800,
  fontSize: 15,
  color: "#ffffff",
  background: "#25D366",
  boxShadow: "0 10px 30px rgba(37,211,102,0.20)",
};

const successBoxStyle: CSSProperties = {
  marginTop: 16,
  padding: "14px 16px",
  borderRadius: 16,
  border: "1px solid rgba(34,197,94,0.18)",
  background: "rgba(34,197,94,0.08)",
  color: "#166534",
  fontWeight: 700,
};

const errorBoxStyle: CSSProperties = {
  marginTop: 16,
  padding: "14px 16px",
  borderRadius: 16,
  border: "1px solid rgba(239,68,68,0.18)",
  background: "rgba(239,68,68,0.08)",
  color: "#b91c1c",
  fontWeight: 700,
};

const summaryBoxStyle: CSSProperties = {
  marginTop: 12,
  borderRadius: 18,
  padding: 16,
  background: "rgba(255,255,255,0.86)",
  border: "1px solid rgba(15,23,42,0.08)",
  boxShadow: "0 10px 24px rgba(15,23,42,0.04)",
};

const summaryRowStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "110px 1fr",
  gap: 10,
  padding: "10px 0",
  borderBottom: "1px solid rgba(15,23,42,0.08)",
};

const summaryLabelStyle: CSSProperties = {
  color: "#64748b",
  fontWeight: 700,
};

const summaryValueStyle: CSSProperties = {
  color: "#0f172a",
  wordBreak: "break-word",
};

const infoCardStyle: CSSProperties = {
  borderRadius: 18,
  padding: 16,
  background: "rgba(255,255,255,0.86)",
  border: "1px solid rgba(15,23,42,0.08)",
  color: "#334155",
  lineHeight: 1.7,
  fontSize: 15,
  boxShadow: "0 10px 24px rgba(15,23,42,0.04)",
};

const infoLineStyle: CSSProperties = {
  marginBottom: 8,
};