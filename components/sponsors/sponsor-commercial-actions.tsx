"use client";

import { useMemo, useState } from "react";

type SponsorStatus = "lead" | "em_analise" | "aprovado" | "ativo" | "cancelado";

type SponsorCommercialActionsProps = {
  sponsorId: string;
  sponsorName?: string | null;
  responsibleName?: string | null;
  sponsorEmail?: string | null;
  sponsorWhatsapp?: string | null;
  currentStatus?: string | null;
  termsAccepted?: boolean | null;
  className?: string;
};

const STATUS_OPTIONS: Array<{
  value: SponsorStatus;
  label: string;
}> = [
  { value: "lead", label: "Lead" },
  { value: "em_analise", label: "Em análise" },
  { value: "aprovado", label: "Aprovado" },
  { value: "ativo", label: "Ativo" },
  { value: "cancelado", label: "Cancelado" },
];

function normalizeStatus(value: string | null | undefined): SponsorStatus {
  const normalized = String(value || "").trim().toLowerCase();

  if (
    normalized === "lead" ||
    normalized === "em_analise" ||
    normalized === "aprovado" ||
    normalized === "ativo" ||
    normalized === "cancelado"
  ) {
    return normalized;
  }

  return "lead";
}

function normalizeWhatsapp(raw: string | null | undefined) {
  return String(raw || "").replace(/\D/g, "");
}

function buildWhatsappMessage(params: {
  responsibleName?: string | null;
  currentStatusLabel: string;
}) {
  const responsible = params.responsibleName?.trim() || "Olá";

  if (params.currentStatusLabel === "Aprovado") {
    return [
      `Olá, ${responsible}!`,
      ``,
      `Aqui é da Aurora 🚀`,
      ``,
      `Seu patrocínio foi aprovado.`,
      `Valor: R$ 1.500`,
      ``,
      `Posso te enviar os dados para pagamento agora?`,
    ].join("\n");
  }

  return [
    `Olá, ${responsible}!`,
    ``,
    `Aqui é da Aurora 🚀`,
    ``,
    `Recebemos seu interesse no patrocínio.`,
    `Status atual: ${params.currentStatusLabel}`,
    `Plano: Premium`,
    `Valor: R$ 1.500`,
    ``,
    `A ativação é imediata após confirmação.`,
    ``,
    `Se estiver tudo certo, posso te enviar os dados para pagamento agora.`,
  ].join("\n");
}

export default function SponsorCommercialActions({
  sponsorId,
  responsibleName,
  sponsorWhatsapp,
  currentStatus,
  termsAccepted,
  className,
}: SponsorCommercialActionsProps) {
  const [selectedStatus, setSelectedStatus] = useState<SponsorStatus>(
    normalizeStatus(currentStatus),
  );
  const [accepted, setAccepted] = useState(Boolean(termsAccepted));
  const [loadingAccept, setLoadingAccept] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [loadingWhatsapp, setLoadingWhatsapp] = useState(false);
  const [feedback, setFeedback] = useState<string>("");
  const [error, setError] = useState<string>("");

  const currentStatusLabel = useMemo(() => {
    return (
      STATUS_OPTIONS.find((option) => option.value === selectedStatus)?.label ||
      "Lead"
    );
  }, [selectedStatus]);

  async function handleAcceptRules() {
    setLoadingAccept(true);
    setFeedback("");
    setError("");

    try {
      const response = await fetch(`/api/sponsors/${sponsorId}/accept-rules`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accepted: true,
          acceptedByName: responsibleName || "",
          acceptedByWhatsapp: sponsorWhatsapp || "",
          notes:
            "Aceite registrado pela área comercial da Aurora. Sistema em constante atualização e pode haver momentos de instabilidade durante melhorias.",
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.ok) {
        throw new Error(
          data?.error || "Não foi possível registrar o aceite das regras.",
        );
      }

      setAccepted(true);
      setFeedback(
        data?.message ||
          "Aceite das regras comerciais registrado com sucesso.",
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro inesperado ao registrar o aceite.",
      );
    } finally {
      setLoadingAccept(false);
    }
  }

  async function handleUpdateStatus(nextStatus?: SponsorStatus) {
    const statusToSend = nextStatus || selectedStatus;

    setLoadingStatus(true);
    setFeedback("");
    setError("");

    try {
      const response = await fetch(`/api/sponsors/${sponsorId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: statusToSend,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.ok) {
        throw new Error(
          data?.error || "Não foi possível atualizar o status comercial.",
        );
      }

      setSelectedStatus(statusToSend);
      setFeedback(
        data?.message || "Status comercial atualizado com sucesso.",
      );

      return true;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro inesperado ao atualizar o status.",
      );
      return false;
    } finally {
      setLoadingStatus(false);
    }
  }

  async function handleOpenWhatsapp() {
    const phone = normalizeWhatsapp(sponsorWhatsapp);

    if (!phone) {
      setError("WhatsApp do patrocinador não encontrado.");
      setFeedback("");
      return;
    }

    setLoadingWhatsapp(true);
    setFeedback("");
    setError("");

    let finalStatus = selectedStatus;

    if (selectedStatus === "lead") {
      const updated = await handleUpdateStatus("em_analise");
      if (updated) {
        finalStatus = "em_analise";
      }
    }

    const finalStatusLabel =
      STATUS_OPTIONS.find((option) => option.value === finalStatus)?.label ||
      "Lead";

    const message = buildWhatsappMessage({
      responsibleName,
      currentStatusLabel: finalStatusLabel,
    });

    try {
      await navigator.clipboard.writeText(message);
      setFeedback("Mensagem copiada! Cole no WhatsApp com CTRL + V 🚀");
    } catch {
      setFeedback(
        "Não foi possível copiar automaticamente. Copie a mensagem manualmente.",
      );
    }

    window.open(`https://wa.me/${phone}`, "_blank");

    setLoadingWhatsapp(false);
  }

  return (
    <div
      className={className}
      style={{
        display: "grid",
        gap: 12,
        padding: 16,
        borderRadius: 18,
        border: "1px solid rgba(255,255,255,0.10)",
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
      }}
    >
      <div style={{ display: "grid", gap: 6 }}>
        <strong style={{ fontSize: 16 }}>Ações comerciais</strong>
        <span style={{ opacity: 0.78, fontSize: 13 }}>
          Controle de aceite, evolução de status e contato rápido do
          patrocinador. Sistema em constante atualização e pode haver momentos
          de instabilidade durante melhorias.
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gap: 10,
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        }}
      >
        <div style={{ display: "grid", gap: 8 }}>
          <label
            htmlFor={`sponsor-status-${sponsorId}`}
            style={{ fontSize: 13, opacity: 0.82 }}
          >
            Status comercial
          </label>
          <select
            id={`sponsor-status-${sponsorId}`}
            value={selectedStatus}
            onChange={(event) =>
              setSelectedStatus(event.target.value as SponsorStatus)
            }
            style={{
              minHeight: 46,
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(10,14,22,0.82)",
              color: "white",
              padding: "0 12px",
            }}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          <span style={{ fontSize: 13, opacity: 0.82 }}>Aceite das regras</span>
          <div
            style={{
              minHeight: 46,
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.12)",
              display: "flex",
              alignItems: "center",
              padding: "0 12px",
              background: accepted
                ? "rgba(16,185,129,0.12)"
                : "rgba(245,158,11,0.10)",
            }}
          >
            {accepted ? "✅ Aceito e registrado" : "⏳ Pendente de aceite"}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <button
          type="button"
          onClick={handleAcceptRules}
          disabled={loadingAccept || accepted}
          style={{
            minHeight: 44,
            padding: "0 16px",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.12)",
            background: accepted ? "rgba(16,185,129,0.14)" : "white",
            color: accepted ? "white" : "black",
            cursor: accepted ? "default" : "pointer",
            fontWeight: 700,
          }}
        >
          {loadingAccept
            ? "Registrando aceite..."
            : accepted
              ? "Aceite já registrado"
              : "Aceitar regras comerciais"}
        </button>

        <button
          type="button"
          onClick={() => handleUpdateStatus()}
          disabled={loadingStatus}
          style={{
            minHeight: 44,
            padding: "0 16px",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(59,130,246,0.18)",
            color: "white",
            cursor: loadingStatus ? "wait" : "pointer",
            fontWeight: 700,
          }}
        >
          {loadingStatus ? "Atualizando status..." : "Salvar status comercial"}
        </button>

        <button
          type="button"
          onClick={handleOpenWhatsapp}
          disabled={loadingWhatsapp}
          style={{
            minHeight: 44,
            padding: "0 16px",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(16,185,129,0.16)",
            color: "white",
            cursor: loadingWhatsapp ? "wait" : "pointer",
            fontWeight: 700,
          }}
        >
          {loadingWhatsapp ? "Abrindo WhatsApp..." : "Abrir WhatsApp pronto"}
        </button>
      </div>

      {feedback ? (
        <div
          style={{
            borderRadius: 12,
            padding: 12,
            background: "rgba(16,185,129,0.14)",
            border: "1px solid rgba(16,185,129,0.20)",
            fontSize: 13,
          }}
        >
          {feedback}
        </div>
      ) : null}

      {error ? (
        <div
          style={{
            borderRadius: 12,
            padding: 12,
            background: "rgba(239,68,68,0.12)",
            border: "1px solid rgba(239,68,68,0.18)",
            fontSize: 13,
          }}
        >
          {error}
        </div>
      ) : null}
    </div>
  );
}