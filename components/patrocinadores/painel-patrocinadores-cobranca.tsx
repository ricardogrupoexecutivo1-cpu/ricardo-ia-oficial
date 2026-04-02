"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  buildMensagemWhatsappPatrocinador,
  buildPatrocinadorCobrancaResumo,
  getPatrocinadorNome,
  getPatrocinadorStatusOptions,
  getPatrocinadorWhatsapp,
  normalizePatrocinadorStatus,
  type PatrocinadorLike,
  type PatrocinadorStatus,
} from "@/lib/patrocinadores";

type SaveStatusFn = (
  item: PatrocinadorLike,
  nextStatus: PatrocinadorStatus,
) => Promise<void> | void;

type SaveAsaasLinkFn = (
  item: PatrocinadorLike,
  link: string,
) => Promise<void> | void;

type OpenEmailFn = (item: PatrocinadorLike) => void;

type Props = {
  items: PatrocinadorLike[];
  loading?: boolean;
  savingId?: string | null;
  onSaveStatus?: SaveStatusFn;
  onSaveAsaasLink?: SaveAsaasLinkFn;
  onOpenEmail?: OpenEmailFn;
  emptyMessage?: string;
  title?: string;
  description?: string;
};

function formatDateBR(value: unknown): string {
  const raw = String(value ?? "").trim();
  if (!raw) return "-";

  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) {
    return raw;
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

function getItemId(item: PatrocinadorLike, index: number): string {
  const raw = String(item.id ?? "").trim();
  return raw || `patrocinador-${index}`;
}

function getItemEmail(item: PatrocinadorLike): string {
  return String(item.email ?? "").trim();
}

function getCampaign(item: PatrocinadorLike): string {
  return String(item.campaign_description ?? item.campanha ?? "").trim();
}

function getObservacoes(item: PatrocinadorLike): string {
  return String(item.observacoes ?? "").trim();
}

function getSegmento(item: PatrocinadorLike): string {
  return String(item.segmento ?? "").trim();
}

function copyToClipboard(text: string): Promise<void> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text);
  }

  return Promise.reject(new Error("Clipboard não disponível"));
}

function buildMailTo(item: PatrocinadorLike): string | null {
  const email = getItemEmail(item);
  if (!email) return null;

  const nome = getPatrocinadorNome(item);
  const campanha = getCampaign(item);
  const assunto = encodeURIComponent(
    `Aurora | avanço comercial do patrocínio${campanha ? ` - ${campanha}` : ""}`,
  );

  const corpo = encodeURIComponent(
    [
      `Olá, ${nome}.`,
      "",
      "Aqui é da Aurora.",
      "Seu cadastro de patrocínio avançou para a próxima etapa comercial.",
      "",
      campanha ? `Campanha: ${campanha}` : "",
      "Seguimos à disposição para alinhamento e ativação.",
      "",
      "Equipe Aurora",
    ]
      .filter(Boolean)
      .join("\n"),
  );

  return `mailto:${email}?subject=${assunto}&body=${corpo}`;
}

function getBadgeStyles(kind: "status" | "payment" | "success" | "neutral") {
  if (kind === "status") {
    return {
      color: "#b45309",
      background: "rgba(245,158,11,0.10)",
      border: "1px solid rgba(245,158,11,0.20)",
    };
  }

  if (kind === "payment") {
    return {
      color: "#0369a1",
      background: "rgba(14,165,233,0.10)",
      border: "1px solid rgba(14,165,233,0.20)",
    };
  }

  if (kind === "success") {
    return {
      color: "#166534",
      background: "rgba(34,197,94,0.10)",
      border: "1px solid rgba(34,197,94,0.20)",
    };
  }

  return {
    color: "#475569",
    background: "rgba(148,163,184,0.10)",
    border: "1px solid rgba(148,163,184,0.18)",
  };
}

export default function PainelPatrocinadoresCobranca({
  items,
  loading = false,
  savingId = null,
  onSaveStatus,
  onSaveAsaasLink,
  onOpenEmail,
  emptyMessage = "Nenhum lead comercial encontrado no momento.",
  title = "Painel comercial",
  description = "Controle de aceite, evolução de status e cobrança do patrocinador. Sistema em constante atualização e pode haver momentos de instabilidade durante melhorias.",
}: Props) {
  const statusOptions = useMemo(() => getPatrocinadorStatusOptions(), []);
  const [selectedStatusMap, setSelectedStatusMap] = useState<
    Record<string, PatrocinadorStatus>
  >({});
  const [feedbackMap, setFeedbackMap] = useState<Record<string, string>>({});
  const [asaasLinkMap, setAsaasLinkMap] = useState<Record<string, string>>({});

  async function handleSaveStatus(
    item: PatrocinadorLike,
    itemId: string,
    fallbackStatus: PatrocinadorStatus,
  ) {
    const nextStatus = selectedStatusMap[itemId] ?? fallbackStatus;

    if (!onSaveStatus) {
      setFeedbackMap((current) => ({
        ...current,
        [itemId]: "Ação de salvar ainda não ligada nesta tela.",
      }));
      return;
    }

    try {
      setFeedbackMap((current) => ({
        ...current,
        [itemId]: "Salvando status comercial...",
      }));

      await onSaveStatus(item, nextStatus);

      setFeedbackMap((current) => ({
        ...current,
        [itemId]: "Status comercial salvo com sucesso.",
      }));
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível salvar o status comercial.";

      setFeedbackMap((current) => ({
        ...current,
        [itemId]: message,
      }));
    }
  }

  async function handleSaveAsaas(
    item: PatrocinadorLike,
    itemId: string,
  ) {
    const link =
      String(
        asaasLinkMap[itemId] ??
          item.asaas_payment_link ??
          item.payment_link ??
          "",
      ).trim();

    if (!link) {
      setFeedbackMap((current) => ({
        ...current,
        [itemId]: "Informe o link da cobrança antes de salvar.",
      }));
      return;
    }

    if (!onSaveAsaasLink) {
      setFeedbackMap((current) => ({
        ...current,
        [itemId]: "Função de salvar cobrança ainda não conectada.",
      }));
      return;
    }

    try {
      setFeedbackMap((current) => ({
        ...current,
        [itemId]: "Salvando link da cobrança...",
      }));

      await onSaveAsaasLink(item, link);

      setFeedbackMap((current) => ({
        ...current,
        [itemId]: "Link de cobrança salvo com sucesso.",
      }));
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível salvar o link da cobrança.";

      setFeedbackMap((current) => ({
        ...current,
        [itemId]: message,
      }));
    }
  }

  async function handleCopyMessage(item: PatrocinadorLike, itemId: string) {
    try {
      const message = buildMensagemWhatsappPatrocinador(item);
      await copyToClipboard(message);

      setFeedbackMap((current) => ({
        ...current,
        [itemId]: "Mensagem copiada. Agora é só colar no WhatsApp.",
      }));
    } catch {
      setFeedbackMap((current) => ({
        ...current,
        [itemId]:
          "Não consegui copiar automaticamente. Você ainda pode usar o WhatsApp manualmente.",
      }));
    }
  }

  async function handleCopyLink(link: string, itemId: string) {
    try {
      await copyToClipboard(link);
      setFeedbackMap((current) => ({
        ...current,
        [itemId]: "Link de cobrança copiado com sucesso.",
      }));
    } catch {
      setFeedbackMap((current) => ({
        ...current,
        [itemId]: "Não consegui copiar o link automaticamente.",
      }));
    }
  }

  function handleOpenWhatsapp(item: PatrocinadorLike, itemId: string) {
    const phone = getPatrocinadorWhatsapp(item);
    const message = buildMensagemWhatsappPatrocinador(item);

    if (!phone) {
      setFeedbackMap((current) => ({
        ...current,
        [itemId]: "Este lead ainda não possui WhatsApp válido.",
      }));
      return;
    }

    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${phone}?text=${encoded}`;

    if (typeof window !== "undefined") {
      window.open(url, "_blank", "noopener,noreferrer");
    }

    setFeedbackMap((current) => ({
      ...current,
      [itemId]:
        "WhatsApp aberto. A melhor prática é conferir e colar a mensagem manualmente se necessário.",
    }));
  }

  function handleOpenEmailInternal(item: PatrocinadorLike, itemId: string) {
    if (onOpenEmail) {
      onOpenEmail(item);
      return;
    }

    const mailto = buildMailTo(item);

    if (!mailto) {
      setFeedbackMap((current) => ({
        ...current,
        [itemId]: "Este lead ainda não possui e-mail válido.",
      }));
      return;
    }

    if (typeof window !== "undefined") {
      window.location.href = mailto;
    }
  }

  if (loading) {
    return (
      <section style={styles.mainSection}>
        <div style={styles.headerWrap}>
          <div style={styles.kicker}>{title}</div>
          <h2 style={styles.title}>Carregando patrocinadores...</h2>
          <p style={styles.description}>
            A Aurora está organizando os dados comerciais do painel.
          </p>
        </div>
      </section>
    );
  }

  if (!items.length) {
    return (
      <section style={styles.mainSection}>
        <div style={styles.headerWrap}>
          <div style={styles.kicker}>{title}</div>
          <h2 style={styles.title}>Painel sem leads no momento</h2>
          <p style={styles.description}>{emptyMessage}</p>
        </div>
      </section>
    );
  }

  return (
    <section style={styles.mainSection}>
      <div style={styles.headerWrap}>
        <div style={styles.kicker}>{title}</div>
        <h2 style={styles.title}>
          Cobrança e evolução comercial dos patrocinadores
        </h2>
        <p style={styles.description}>{description}</p>
      </div>

      <div style={styles.listWrap}>
        {items.map((item, index) => {
          const itemId = getItemId(item, index);
          const nome = getPatrocinadorNome(item);
          const email = getItemEmail(item);
          const whatsapp = getPatrocinadorWhatsapp(item);
          const campaign = getCampaign(item);
          const observacoes = getObservacoes(item);
          const segmento = getSegmento(item);
          const resumo = buildPatrocinadorCobrancaResumo(item);
          const currentStatus = normalizePatrocinadorStatus(
            item.commercial_status ?? item.status,
          );
          const selectedStatus = selectedStatusMap[itemId] ?? currentStatus;
          const isSaving =
            savingId === itemId || savingId === String(item.id ?? "");
          const feedback = feedbackMap[itemId] ?? "";
          const createdAt = formatDateBR(
            (item as Record<string, unknown>).created_at,
          );
          const updatedAt = formatDateBR(
            (item as Record<string, unknown>).updated_at,
          );

          const statusBadge = getBadgeStyles("status");
          const paymentBadge = getBadgeStyles("payment");
          const linkBadge = resumo.possuiLinkAsaas
            ? getBadgeStyles("success")
            : getBadgeStyles("neutral");

          const inputValue =
            asaasLinkMap[itemId] ??
            String(item.asaas_payment_link ?? item.payment_link ?? "");

          return (
            <article key={itemId} style={styles.card}>
              <div style={styles.cardTop}>
                <div style={styles.cardTitleWrap}>
                  <div style={styles.cardMiniTitle}>Lead comercial</div>
                  <h3 style={styles.cardTitle}>{nome}</h3>

                  <div style={styles.badgesRow}>
                    <span
                      style={{
                        ...styles.badge,
                        color: statusBadge.color,
                        background: statusBadge.background,
                        border: statusBadge.border,
                      }}
                    >
                      {resumo.statusLabel}
                    </span>

                    <span
                      style={{
                        ...styles.badge,
                        color: paymentBadge.color,
                        background: paymentBadge.background,
                        border: paymentBadge.border,
                      }}
                    >
                      {resumo.paymentStatusLabel}
                    </span>

                    <span
                      style={{
                        ...styles.badge,
                        color: linkBadge.color,
                        background: linkBadge.background,
                        border: linkBadge.border,
                      }}
                    >
                      {resumo.possuiLinkAsaas
                        ? "Cobrança vinculada"
                        : "Sem cobrança vinculada"}
                    </span>
                  </div>
                </div>

                <div style={styles.summaryBox}>
                  <SummaryLine
                    label="Plano / valor"
                    value={resumo.valorFormatado}
                  />
                  <SummaryLine label="Criado em" value={createdAt} />
                  <SummaryLine label="Atualizado em" value={updatedAt} />
                </div>
              </div>

              <div style={styles.separator} />

              <div style={styles.columns}>
                <div style={styles.infoBlock}>
                  <div style={styles.blockTitle}>Dados do lead</div>

                  <div style={styles.infoGrid}>
                    <InfoField label="ID" value={String(item.id ?? "-")} />
                    <InfoField label="E-mail" value={email || "-"} />
                    <InfoField label="WhatsApp" value={whatsapp || "-"} />
                    <InfoField label="Segmento" value={segmento || "-"} />
                    <InfoField
                      label="Campanha / descrição"
                      value={campaign || "-"}
                    />
                    <InfoField
                      label="Observações"
                      value={observacoes || "-"}
                    />
                  </div>
                </div>

                <div style={styles.infoBlock}>
                  <div style={styles.blockTitle}>Ações comerciais</div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Status comercial</label>

                    <select
                      value={selectedStatus}
                      onChange={(event) => {
                        const value = event.target.value as PatrocinadorStatus;
                        setSelectedStatusMap((current) => ({
                          ...current,
                          [itemId]: value,
                        }));
                      }}
                      style={styles.select}
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() =>
                        handleSaveStatus(item, itemId, selectedStatus)
                      }
                      disabled={isSaving}
                      style={{
                        ...styles.primaryAction,
                        opacity: isSaving ? 0.65 : 1,
                        cursor: isSaving ? "not-allowed" : "pointer",
                      }}
                    >
                      {isSaving ? "Salvando..." : "Salvar status comercial"}
                    </button>
                  </div>

                  <div style={styles.actionsGrid}>
                    <ActionButton
                      label="Abrir WhatsApp pronto"
                      onClick={() => handleOpenWhatsapp(item, itemId)}
                    />
                    <ActionButton
                      label="Copiar mensagem"
                      onClick={() => handleCopyMessage(item, itemId)}
                    />
                    <ActionButton
                      label="Enviar e-mail"
                      onClick={() => handleOpenEmailInternal(item, itemId)}
                    />
                    <ActionButton
                      label="Abrir cobrança Asaas"
                      onClick={() => {
                        if (!resumo.linkAsaas) {
                          setFeedbackMap((current) => ({
                            ...current,
                            [itemId]:
                              "Ainda não existe link Asaas vinculado para este lead.",
                          }));
                          return;
                        }

                        if (typeof window !== "undefined") {
                          window.open(
                            resumo.linkAsaas,
                            "_blank",
                            "noopener,noreferrer",
                          );
                        }

                        setFeedbackMap((current) => ({
                          ...current,
                          [itemId]: "Cobrança aberta em nova aba.",
                        }));
                      }}
                      disabled={!resumo.podeAbrirCobranca}
                      variant="info"
                    />
                    <ActionButton
                      label="Copiar link da cobrança"
                      onClick={() => {
                        if (!resumo.linkAsaas) {
                          setFeedbackMap((current) => ({
                            ...current,
                            [itemId]:
                              "Ainda não existe link de cobrança para copiar.",
                          }));
                          return;
                        }

                        handleCopyLink(resumo.linkAsaas, itemId);
                      }}
                      disabled={!resumo.possuiLinkAsaas}
                    />
                    <ActionButton
                      label="Marcar como pago"
                      onClick={() => handleSaveStatus(item, itemId, "pago")}
                      disabled={!resumo.podeMarcarPago || isSaving}
                      variant="warning"
                    />
                    <ActionButton
                      label="Ativar patrocinador"
                      onClick={() => handleSaveStatus(item, itemId, "ativo")}
                      disabled={!resumo.podeAtivar || isSaving}
                      variant="success"
                    />
                    <ActionButton
                      label="Salvar como aguardando pagamento"
                      onClick={() =>
                        handleSaveStatus(item, itemId, "aguardando_pagamento")
                      }
                      disabled={
                        !resumo.podeSalvarComoAguardandoPagamento || isSaving
                      }
                      variant="success"
                      fullWidth
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Link de cobrança Asaas</label>

                    <input
                      type="text"
                      placeholder="https://..."
                      value={inputValue}
                      onChange={(event) => {
                        const value = event.target.value;
                        setAsaasLinkMap((current) => ({
                          ...current,
                          [itemId]: value,
                        }));
                      }}
                      style={styles.input}
                    />

                    <button
                      type="button"
                      onClick={() => handleSaveAsaas(item, itemId)}
                      disabled={isSaving}
                      style={{
                        ...styles.successAction,
                        opacity: isSaving ? 0.65 : 1,
                        cursor: isSaving ? "not-allowed" : "pointer",
                      }}
                    >
                      {isSaving ? "Salvando..." : "Salvar link da cobrança"}
                    </button>
                  </div>

                  <div style={styles.statusBox}>
                    <SummaryLine label="Status atual" value={resumo.statusLabel} />
                    <SummaryLine
                      label="Pagamento"
                      value={resumo.paymentStatusLabel}
                    />
                    <SummaryLine
                      label="Cobrança vinculada"
                      value={resumo.possuiLinkAsaas ? "Sim" : "Não"}
                    />

                    {feedback ? (
                      <div style={styles.feedbackBox}>{feedback}</div>
                    ) : null}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function SummaryLine({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div style={styles.summaryLine}>
      <span style={styles.summaryLabel}>{label}</span>
      <strong style={styles.summaryValue}>{value}</strong>
    </div>
  );
}

function InfoField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div style={styles.infoField}>
      <div style={styles.infoFieldLabel}>{label}</div>
      <div style={styles.infoFieldValue}>{value}</div>
    </div>
  );
}

function ActionButton({
  label,
  onClick,
  disabled = false,
  variant = "default",
  fullWidth = false,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: "default" | "info" | "warning" | "success";
  fullWidth?: boolean;
}) {
  let background = "rgba(255,255,255,0.78)";
  let color = "#0f172a";
  let border = "1px solid rgba(15,23,42,0.08)";

  if (variant === "info") {
    background = "rgba(14,165,233,0.10)";
    color = "#0369a1";
    border = "1px solid rgba(14,165,233,0.20)";
  }

  if (variant === "warning") {
    background = "rgba(245,158,11,0.10)";
    color = "#b45309";
    border = "1px solid rgba(245,158,11,0.20)";
  }

  if (variant === "success") {
    background = "rgba(34,197,94,0.10)";
    color = "#166534";
    border = "1px solid rgba(34,197,94,0.20)";
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        ...styles.actionButton,
        background,
        color,
        border,
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
        gridColumn: fullWidth ? "1 / -1" : undefined,
      }}
    >
      {label}
    </button>
  );
}

const styles: Record<string, CSSProperties> = {
  mainSection: {
    border: "1px solid rgba(15,23,42,0.08)",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.88), rgba(255,255,255,0.74))",
    borderRadius: 28,
    padding: "26px 22px",
    boxShadow: "0 18px 60px rgba(15,23,42,0.08)",
    display: "grid",
    gap: 18,
  },
  headerWrap: {
    display: "grid",
    gap: 10,
  },
  kicker: {
    display: "inline-flex",
    width: "fit-content",
    alignItems: "center",
    padding: "8px 12px",
    borderRadius: 999,
    background: "rgba(37,99,235,0.08)",
    border: "1px solid rgba(37,99,235,0.16)",
    color: "#2563eb",
    fontSize: 13,
    fontWeight: 800,
  },
  title: {
    margin: 0,
    fontSize: "clamp(28px, 4vw, 38px)",
    lineHeight: 1.05,
    letterSpacing: "-0.03em",
    color: "#0f172a",
  },
  description: {
    margin: 0,
    color: "rgba(15,23,42,0.74)",
    fontSize: 16,
    lineHeight: 1.7,
    maxWidth: 980,
    fontWeight: 700,
  },
  listWrap: {
    display: "grid",
    gap: 16,
  },
  card: {
    border: "1px solid rgba(15,23,42,0.08)",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,255,255,0.80))",
    borderRadius: 24,
    padding: "22px 18px",
    boxShadow: "0 18px 60px rgba(15,23,42,0.06)",
    display: "grid",
    gap: 18,
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    flexWrap: "wrap",
    alignItems: "flex-start",
  },
  cardTitleWrap: {
    display: "grid",
    gap: 8,
    flex: "1 1 520px",
  },
  cardMiniTitle: {
    fontSize: 12,
    fontWeight: 900,
    color: "#2563eb",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  cardTitle: {
    margin: 0,
    fontSize: "clamp(22px, 3vw, 30px)",
    lineHeight: 1.05,
    color: "#0f172a",
    fontWeight: 900,
  },
  badgesRow: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    minHeight: 34,
    padding: "0 12px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
  },
  summaryBox: {
    minWidth: 260,
    flex: "0 0 260px",
    borderRadius: 18,
    padding: 16,
    background: "rgba(248,250,252,0.9)",
    border: "1px solid rgba(15,23,42,0.06)",
    display: "grid",
    gap: 10,
  },
  summaryLine: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "center",
  },
  summaryLabel: {
    color: "rgba(15,23,42,0.62)",
    fontSize: 14,
    fontWeight: 700,
  },
  summaryValue: {
    color: "#0f172a",
    fontSize: 14,
    textAlign: "right",
  },
  separator: {
    height: 1,
    background:
      "linear-gradient(90deg, rgba(37,99,235,0.14), rgba(15,23,42,0.06), transparent)",
  },
  columns: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: 16,
  },
  infoBlock: {
    borderRadius: 18,
    padding: "16px",
    background: "rgba(248,250,252,0.9)",
    border: "1px solid rgba(15,23,42,0.06)",
    display: "grid",
    gap: 14,
  },
  blockTitle: {
    fontSize: 12,
    fontWeight: 900,
    color: "#2563eb",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  infoGrid: {
    display: "grid",
    gap: 12,
  },
  infoField: {
    display: "grid",
    gap: 6,
  },
  infoFieldLabel: {
    fontSize: 12,
    fontWeight: 900,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  infoFieldValue: {
    color: "#0f172a",
    fontSize: 14,
    lineHeight: 1.7,
    fontWeight: 700,
    wordBreak: "break-word",
    whiteSpace: "pre-wrap",
  },
  formGroup: {
    display: "grid",
    gap: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: 800,
    color: "rgba(15,23,42,0.72)",
  },
  select: {
    borderRadius: 16,
    border: "1px solid rgba(15,23,42,0.10)",
    background: "#ffffff",
    color: "#0f172a",
    padding: "14px 16px",
    fontSize: 14,
    fontWeight: 700,
    outline: "none",
  },
  input: {
    borderRadius: 14,
    padding: "12px 14px",
    border: "1px solid rgba(15,23,42,0.10)",
    fontSize: 14,
    fontWeight: 600,
    outline: "none",
    background: "#ffffff",
    color: "#0f172a",
  },
  primaryAction: {
    cursor: "pointer",
    borderRadius: 16,
    border: "1px solid rgba(37,99,235,0.16)",
    background: "linear-gradient(135deg, #2563eb, #3b82f6)",
    color: "#ffffff",
    padding: "14px 18px",
    fontWeight: 900,
    boxShadow: "0 12px 28px rgba(37,99,235,0.16)",
  },
  successAction: {
    cursor: "pointer",
    borderRadius: 14,
    border: "none",
    background: "linear-gradient(135deg, #16a34a, #22c55e)",
    color: "#ffffff",
    padding: "12px 14px",
    fontWeight: 800,
    boxShadow: "0 12px 28px rgba(34,197,94,0.16)",
  },
  actionsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 10,
  },
  actionButton: {
    cursor: "pointer",
    borderRadius: 16,
    padding: "14px 16px",
    fontWeight: 800,
    boxShadow: "0 8px 18px rgba(15,23,42,0.04)",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
  },
  statusBox: {
    borderRadius: 18,
    padding: 16,
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.80), rgba(255,255,255,0.64))",
    border: "1px solid rgba(15,23,42,0.08)",
    display: "grid",
    gap: 10,
  },
  feedbackBox: {
    marginTop: 8,
    borderRadius: 16,
    padding: "14px 16px",
    background: "rgba(34,197,94,0.10)",
    border: "1px solid rgba(34,197,94,0.20)",
    color: "#166534",
    fontSize: 14,
    lineHeight: 1.6,
    fontWeight: 800,
  },
};