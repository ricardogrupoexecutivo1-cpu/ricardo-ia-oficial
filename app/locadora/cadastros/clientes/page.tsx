"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

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
          maxWidth: 1180,
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
          <span aria-hidden="true">👤</span>
          <span>Cadastro de Clientes · Aurora Locadora</span>
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: "clamp(34px, 8vw, 62px)",
            lineHeight: 1.02,
            letterSpacing: "-0.04em",
            fontWeight: 900,
            maxWidth: 860,
          }}
        >
          Cadastro de clientes da locadora
        </h1>

        <p
          style={{
            marginTop: 18,
            marginBottom: 0,
            maxWidth: 860,
            color: "#d5e5f7",
            fontSize: "clamp(16px, 3.6vw, 21px)",
            lineHeight: 1.72,
          }}
        >
          Registre clientes, contato principal, localização e observações
          comerciais em uma área pronta para operação real. Sistema em constante
          atualização e pode haver momentos de instabilidade.
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            marginTop: 26,
          }}
        >
          <Link href="/locadora/cadastros" style={secondaryButton}>
            Voltar para central de cadastros
          </Link>

          <Link href="/locadora" style={secondaryButton}>
            Voltar para locadora
          </Link>

          <Link href="/locadora/admin" style={secondaryButton}>
            Área protegida
          </Link>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.5fr) minmax(280px, 0.9fr)",
            gap: 18,
            marginTop: 32,
          }}
        >
          <section style={panel}>
            <div style={sectionHeader}>
              <div>
                <div style={eyebrow}>FORMULÁRIO PRINCIPAL</div>
                <h2 style={panelTitle}>Dados do cliente</h2>
              </div>
            </div>

            <div style={grid}>
              <label style={fieldBlock}>
                <span style={labelStyle}>Nome do cliente</span>
                <input
                  style={inputStyle}
                  value={form.nome}
                  onChange={(e) => updateField("nome", e.target.value)}
                  placeholder="Ex.: Ricardo Leonardo Moreira"
                />
              </label>

              <label style={fieldBlock}>
                <span style={labelStyle}>CPF / CNPJ</span>
                <input
                  style={inputStyle}
                  value={form.cpfCnpj}
                  onChange={(e) => updateField("cpfCnpj", e.target.value)}
                  placeholder="Ex.: 607.953.446-00"
                />
              </label>

              <label style={fieldBlock}>
                <span style={labelStyle}>Telefone</span>
                <input
                  style={inputStyle}
                  value={form.telefone}
                  onChange={(e) => updateField("telefone", e.target.value)}
                  placeholder="Ex.: (31) 3333-0000"
                />
              </label>

              <label style={fieldBlock}>
                <span style={labelStyle}>WhatsApp</span>
                <input
                  style={inputStyle}
                  value={form.whatsapp}
                  onChange={(e) => updateField("whatsapp", e.target.value)}
                  placeholder="Ex.: (31) 99749-0074"
                />
              </label>

              <label style={fieldBlock}>
                <span style={labelStyle}>E-mail</span>
                <input
                  type="email"
                  style={inputStyle}
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  placeholder="Ex.: contato@empresa.com"
                />
              </label>

              <label style={fieldBlock}>
                <span style={labelStyle}>Cidade</span>
                <input
                  style={inputStyle}
                  value={form.cidade}
                  onChange={(e) => updateField("cidade", e.target.value)}
                  placeholder="Ex.: Lagoa Santa"
                />
              </label>

              <label style={fieldBlock}>
                <span style={labelStyle}>Estado</span>
                <input
                  style={inputStyle}
                  value={form.estado}
                  onChange={(e) => updateField("estado", e.target.value)}
                  placeholder="Ex.: MG"
                  maxLength={2}
                />
              </label>

              <label style={{ ...fieldBlock, gridColumn: "1 / -1" }}>
                <span style={labelStyle}>Endereço</span>
                <input
                  style={inputStyle}
                  value={form.endereco}
                  onChange={(e) => updateField("endereco", e.target.value)}
                  placeholder="Ex.: Rua Exemplo, 123 - Centro"
                />
              </label>

              <label style={{ ...fieldBlock, gridColumn: "1 / -1" }}>
                <span style={labelStyle}>Observações comerciais</span>
                <textarea
                  style={textareaStyle}
                  value={form.observacoes}
                  onChange={(e) => updateField("observacoes", e.target.value)}
                  placeholder="Ex.: cliente interessado em locação mensal, compra futura, documentação pendente..."
                />
              </label>
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
                marginTop: 22,
              }}
            >
              <button type="button" style={primaryButton} onClick={handleSaveDraft}>
                Salvar rascunho no navegador
              </button>

              <button
                type="button"
                style={primaryButton}
                onClick={handleSaveToDatabase}
                disabled={savingDb}
              >
                {savingDb ? "Salvando no banco..." : "Salvar cliente no banco"}
              </button>

              <button type="button" style={ghostButton} onClick={handleLoadDraft}>
                Carregar rascunho
              </button>

              <button type="button" style={ghostButton} onClick={handleClear}>
                Limpar formulário
              </button>

              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                style={whatsButton}
              >
                Enviar para WhatsApp comercial
              </a>
            </div>

            {saved ? (
              <div style={successBox}>
                Rascunho salvo com sucesso neste navegador.
              </div>
            ) : null}

            {dbMessage ? (
              <div style={successBox}>{dbMessage}</div>
            ) : null}

            {dbError ? (
              <div style={errorBox}>{dbError}</div>
            ) : null}
          </section>

          <aside style={panel}>
            <div style={eyebrow}>RESUMO RÁPIDO</div>
            <h2 style={panelTitle}>Pré-visualização do cadastro</h2>

            <div style={summaryBox}>
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
              <div style={eyebrow}>DADOS ÚTEIS</div>
              <div style={infoCard}>
                <div style={infoLine}>
                  <strong>WhatsApp limpo:</strong>{" "}
                  {onlyDigits(form.whatsapp) || "-"}
                </div>
                <div style={infoLine}>
                  <strong>Telefone limpo:</strong>{" "}
                  {onlyDigits(form.telefone) || "-"}
                </div>
                <div style={infoLine}>
                  <strong>UF:</strong> {form.estado.toUpperCase() || "-"}
                </div>
              </div>
            </div>

            <div style={{ marginTop: 18 }}>
              <div style={eyebrow}>PRÓXIMO PASSO</div>
              <div style={infoCard}>
                Depois disso, podemos criar a listagem real dos clientes
                cadastrados dentro da área da locadora e conectar com propostas,
                bancos e operação comercial.
              </div>
            </div>
          </aside>
        </div>
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
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "110px 1fr",
        gap: 10,
        padding: "10px 0",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div style={{ color: "#93a9bf", fontWeight: 700 }}>{label}</div>
      <div style={{ color: "#eef6ff", wordBreak: "break-word" }}>
        {value || "-"}
      </div>
    </div>
  );
}

const panel: React.CSSProperties = {
  borderRadius: 24,
  padding: 22,
  background: "linear-gradient(180deg, rgba(10,24,36,0.92), rgba(5,11,18,0.98))",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 22px 60px rgba(0,0,0,0.28)",
};

const sectionHeader: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  marginBottom: 18,
};

const eyebrow: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: "0.18em",
  color: "#8db5d9",
  marginBottom: 10,
};

const panelTitle: React.CSSProperties = {
  margin: 0,
  fontSize: 28,
  fontWeight: 900,
  lineHeight: 1.1,
};

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 16,
};

const fieldBlock: React.CSSProperties = {
  display: "grid",
  gap: 8,
};

const labelStyle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 700,
  color: "#d5e5f7",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 48,
  borderRadius: 14,
  border: "1px solid rgba(148,163,184,0.22)",
  background: "rgba(15,23,42,0.78)",
  color: "#eef6ff",
  padding: "0 14px",
  fontSize: 15,
  outline: "none",
};

const textareaStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 140,
  borderRadius: 14,
  border: "1px solid rgba(148,163,184,0.22)",
  background: "rgba(15,23,42,0.78)",
  color: "#eef6ff",
  padding: 14,
  fontSize: 15,
  outline: "none",
  resize: "vertical",
  fontFamily: "inherit",
};

const primaryButton: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 48,
  padding: "0 18px",
  borderRadius: 14,
  border: "none",
  textDecoration: "none",
  fontWeight: 800,
  fontSize: 15,
  cursor: "pointer",
  color: "#04110a",
  background: "linear-gradient(135deg, #22c55e, #86efac)",
  boxShadow: "0 18px 40px rgba(34,197,94,0.25)",
};

const ghostButton: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 48,
  padding: "0 18px",
  borderRadius: 14,
  border: "1px solid rgba(148,163,184,0.28)",
  textDecoration: "none",
  fontWeight: 700,
  fontSize: 15,
  cursor: "pointer",
  color: "#e5e7eb",
  background: "rgba(15,23,42,0.62)",
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
  minHeight: 48,
  padding: "0 18px",
  borderRadius: 14,
  textDecoration: "none",
  fontWeight: 800,
  fontSize: 15,
  color: "#04110a",
  background: "#25D366",
  boxShadow: "0 10px 30px rgba(37,211,102,0.25)",
};

const successBox: React.CSSProperties = {
  marginTop: 16,
  padding: "14px 16px",
  borderRadius: 16,
  border: "1px solid rgba(34,197,94,0.24)",
  background: "rgba(34,197,94,0.10)",
  color: "#b9f7cf",
  fontWeight: 700,
};

const errorBox: React.CSSProperties = {
  marginTop: 16,
  padding: "14px 16px",
  borderRadius: 16,
  border: "1px solid rgba(248,113,113,0.28)",
  background: "rgba(127,29,29,0.18)",
  color: "#fecaca",
  fontWeight: 700,
};

const summaryBox: React.CSSProperties = {
  marginTop: 12,
  borderRadius: 18,
  padding: 16,
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.07)",
};

const infoCard: React.CSSProperties = {
  borderRadius: 18,
  padding: 16,
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.07)",
  color: "#d5e5f7",
  lineHeight: 1.7,
  fontSize: 15,
};

const infoLine: React.CSSProperties = {
  marginBottom: 8,
};