"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type FormState = {
  companyName: string;
  responsibleName: string;
  whatsapp: string;
  email: string;
  segment: string;
  planName: string;
  siteUrl: string;
  logoUrl: string;
  campaignDescription: string;
  notes: string;
  termsAccepted: boolean;
};

const INITIAL_STATE: FormState = {
  companyName: "",
  responsibleName: "",
  whatsapp: "",
  email: "",
  segment: "",
  planName: "",
  siteUrl: "",
  logoUrl: "",
  campaignDescription: "",
  notes: "",
  termsAccepted: false,
};

function normalizeWhatsapp(value: string) {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("55")) return digits;
  return `55${digits}`;
}

export default function PatrocinadorCadastroPage() {
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const canSubmit = useMemo(() => {
    return (
      form.companyName.trim().length > 0 &&
      form.responsibleName.trim().length > 0 &&
      form.email.trim().length > 0 &&
      form.segment.trim().length > 0 &&
      form.planName.trim().length > 0 &&
      form.termsAccepted
    );
  }, [form]);

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const payload = {
        company_name: form.companyName.trim(),
        contact_name: form.responsibleName.trim(),
        responsible_name: form.responsibleName.trim(),
        whatsapp: normalizeWhatsapp(form.whatsapp),
        email: form.email.trim(),
        segment: form.segment.trim(),
        plan: form.planName.trim(),
        plan_name: form.planName.trim(),
        website: form.siteUrl.trim() || null,
        site_url: form.siteUrl.trim() || null,
        logo_url: form.logoUrl.trim() || null,
        campaign_description: form.campaignDescription.trim() || null,
        notes: form.notes.trim() || null,
        observations: form.notes.trim() || null,
        accepted_terms: form.termsAccepted,
        terms_accepted: form.termsAccepted,
      };

      const response = await fetch("/api/patrocinador", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.ok) {
        throw new Error(
          data?.error ||
            data?.details ||
            "Não foi possível salvar o cadastro do patrocinador.",
        );
      }

      setSuccessMessage(
        "Cadastro comercial enviado com sucesso. A Aurora está em constante atualização e pode haver momentos de instabilidade durante melhorias.",
      );
      setForm(INITIAL_STATE);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Erro inesperado ao enviar o cadastro.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "24px 16px 80px",
        background:
          "radial-gradient(circle at top, rgba(59,130,246,0.10), transparent 18%), radial-gradient(circle at left, rgba(34,197,94,0.10), transparent 24%), linear-gradient(180deg, #eef6ff 0%, #f7fbff 36%, #edf7f3 100%)",
      }}
    >
      <div
        style={{
          maxWidth: 980,
          margin: "0 auto",
          display: "grid",
          gap: 18,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <TopLink href="/" label="Voltar à Home" color="#2563eb" />
          <TopLink href="/patrocinadores" label="Ver patrocinadores" color="#0f766e" />
          <TopLink
            href="/patrocinadores-painel"
            label="Painel comercial"
            color="#2563eb"
          />
          <TopLink
            href="/patrocinadores-termos"
            label="Regras comerciais"
            color="#0f766e"
          />
        </div>

        <section
          style={{
            border: "1px solid rgba(15,23,42,0.08)",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.88), rgba(255,255,255,0.74))",
            borderRadius: 28,
            padding: "26px 22px",
            boxShadow: "0 18px 60px rgba(15,23,42,0.08)",
            display: "grid",
            gap: 18,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              width: "fit-content",
              alignItems: "center",
              gap: 8,
              padding: "8px 12px",
              borderRadius: 999,
              background: "rgba(37,99,235,0.08)",
              border: "1px solid rgba(37,99,235,0.16)",
              color: "#2563eb",
              fontSize: 13,
              fontWeight: 800,
            }}
          >
            💼 Novo patrocinador Aurora
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "clamp(30px, 6vw, 48px)",
              lineHeight: 1.02,
              letterSpacing: "-0.03em",
              color: "#0f172a",
            }}
          >
            Cadastro comercial de patrocinador
          </h1>

          <p
            style={{
              margin: 0,
              color: "rgba(15,23,42,0.74)",
              fontSize: 18,
              lineHeight: 1.7,
              maxWidth: 860,
              fontWeight: 700,
            }}
          >
            Preencha os dados da empresa interessada em patrocinar a Aurora.
            Este formulário foi preparado para registrar lead comercial com
            clareza, segurança e transparência. Sistema em constante atualização
            e pode haver momentos de instabilidade durante melhorias.
          </p>
        </section>

        <form
          onSubmit={handleSubmit}
          style={{
            border: "1px solid rgba(15,23,42,0.08)",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.88), rgba(255,255,255,0.74))",
            borderRadius: 28,
            padding: "24px 18px",
            boxShadow: "0 18px 60px rgba(15,23,42,0.06)",
            display: "grid",
            gap: 18,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 14,
            }}
          >
            <Field
              label="Empresa / marca"
              value={form.companyName}
              onChange={(value) => updateField("companyName", value)}
              placeholder="Ex.: Santiago Chile"
              required
            />

            <Field
              label="Responsável"
              value={form.responsibleName}
              onChange={(value) => updateField("responsibleName", value)}
              placeholder="Ex.: Rubens Januário"
              required
            />

            <Field
              label="WhatsApp"
              value={form.whatsapp}
              onChange={(value) => updateField("whatsapp", value)}
              placeholder="Ex.: 5531998765432"
            />

            <Field
              label="E-mail"
              value={form.email}
              onChange={(value) => updateField("email", value)}
              placeholder="Ex.: contato@empresa.com"
              type="email"
              required
            />

            <Field
              label="Segmento"
              value={form.segment}
              onChange={(value) => updateField("segment", value)}
              placeholder="Ex.: Serviços"
              required
            />

            <Field
              label="Plano"
              value={form.planName}
              onChange={(value) => updateField("planName", value)}
              placeholder="Ex.: R$ 1500 - Premium segmento"
              required
            />

            <Field
              label="Site"
              value={form.siteUrl}
              onChange={(value) => updateField("siteUrl", value)}
              placeholder="Ex.: https://ricardoiaoficial.com"
            />

            <Field
              label="Logo"
              value={form.logoUrl}
              onChange={(value) => updateField("logoUrl", value)}
              placeholder="Ex.: https://ricardoiaoficial.com/logo"
            />
          </div>

          <TextAreaField
            label="Campanha / descrição"
            value={form.campaignDescription}
            onChange={(value) => updateField("campaignDescription", value)}
            placeholder="Ex.: IA de inteligência artificial multifuncional ecossistema mundial"
            rows={5}
          />

          <TextAreaField
            label="Observações comerciais"
            value={form.notes}
            onChange={(value) => updateField("notes", value)}
            placeholder="Informações adicionais, detalhes do lead ou observações internas."
            rows={4}
          />

          <label
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              padding: 14,
              borderRadius: 18,
              background: "rgba(248,250,252,0.9)",
              border: "1px solid rgba(15,23,42,0.06)",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={form.termsAccepted}
              onChange={(event) =>
                updateField("termsAccepted", event.target.checked)
              }
              style={{ marginTop: 3 }}
            />
            <span
              style={{
                color: "#0f172a",
                lineHeight: 1.7,
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              Confirmo o aceite das regras comerciais da Aurora para análise,
              proposta, contrato, pagamento e ativação quando aplicável.
            </span>
          </label>

          {successMessage ? (
            <div
              style={{
                borderRadius: 16,
                padding: "14px 16px",
                background: "rgba(34,197,94,0.10)",
                border: "1px solid rgba(34,197,94,0.20)",
                color: "#166534",
                fontWeight: 800,
                lineHeight: 1.6,
              }}
            >
              {successMessage}
            </div>
          ) : null}

          {errorMessage ? (
            <div
              style={{
                borderRadius: 16,
                padding: "14px 16px",
                background: "rgba(239,68,68,0.10)",
                border: "1px solid rgba(239,68,68,0.20)",
                color: "#b91c1c",
                fontWeight: 800,
                lineHeight: 1.6,
              }}
            >
              {errorMessage}
            </div>
          ) : null}

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <button
              type="submit"
              disabled={!canSubmit || submitting}
              style={{
                cursor: !canSubmit || submitting ? "not-allowed" : "pointer",
                borderRadius: 16,
                border: "1px solid rgba(37,99,235,0.16)",
                background:
                  !canSubmit || submitting
                    ? "rgba(148,163,184,0.55)"
                    : "linear-gradient(135deg, #2563eb, #3b82f6)",
                color: "#ffffff",
                padding: "14px 18px",
                fontWeight: 900,
                boxShadow: "0 12px 28px rgba(37,99,235,0.16)",
              }}
            >
              {submitting ? "Enviando cadastro..." : "Enviar cadastro comercial"}
            </button>

            <Link href="/patrocinadores-painel" style={styles.secondaryButton}>
              Ver painel comercial
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}

function TopLink({
  href,
  label,
  color,
}: {
  href: string;
  label: string;
  color: string;
}) {
  return (
    <Link
      href={href}
      style={{
        ...styles.topLink,
        borderColor: color,
        color,
      }}
    >
      {label}
    </Link>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  required,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <label style={{ display: "grid", gap: 8 }}>
      <span
        style={{
          fontSize: 13,
          fontWeight: 900,
          color: "#334155",
          textTransform: "uppercase",
          letterSpacing: "0.04em",
        }}
      >
        {label} {required ? "*" : ""}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        style={{
          minHeight: 48,
          borderRadius: 16,
          border: "1px solid rgba(15,23,42,0.10)",
          background: "rgba(255,255,255,0.92)",
          padding: "0 14px",
          color: "#0f172a",
          fontWeight: 700,
          outline: "none",
        }}
      />
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  rows,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <label style={{ display: "grid", gap: 8 }}>
      <span
        style={{
          fontSize: 13,
          fontWeight: 900,
          color: "#334155",
          textTransform: "uppercase",
          letterSpacing: "0.04em",
        }}
      >
        {label}
      </span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows || 4}
        style={{
          borderRadius: 16,
          border: "1px solid rgba(15,23,42,0.10)",
          background: "rgba(255,255,255,0.92)",
          padding: "14px",
          color: "#0f172a",
          fontWeight: 700,
          outline: "none",
          resize: "vertical",
        }}
      />
    </label>
  );
}

const styles: Record<string, React.CSSProperties> = {
  topLink: {
    textDecoration: "none",
    border: "1px solid rgba(15,23,42,0.08)",
    background: "rgba(255,255,255,0.76)",
    borderRadius: 14,
    padding: "10px 14px",
    fontWeight: 800,
    boxShadow: "0 8px 18px rgba(15,23,42,0.04)",
  },
  secondaryButton: {
    cursor: "pointer",
    borderRadius: 16,
    border: "1px solid rgba(15,23,42,0.08)",
    background: "rgba(255,255,255,0.78)",
    color: "#0f172a",
    padding: "14px 18px",
    fontWeight: 800,
    boxShadow: "0 8px 18px rgba(15,23,42,0.04)",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  },
};