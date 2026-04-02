export const PATROCINADOR_STATUS = [
  "lead",
  "em_analise",
  "aprovado",
  "aguardando_pagamento",
  "pago",
  "ativo",
  "recusado",
  "inativo",
] as const;

export type PatrocinadorStatus = (typeof PATROCINADOR_STATUS)[number];

export type PatrocinadorPlanoValor =
  | number
  | string
  | null
  | undefined;

export type PatrocinadorLike = {
  id?: string | null;
  nome?: string | null;
  responsavel?: string | null;
  company_name?: string | null;
  empresa?: string | null;
  email?: string | null;
  whatsapp?: string | null;
  phone?: string | null;
  status?: string | null;
  commercial_status?: string | null;
  payment_status?: string | null;
  plano?: string | number | null;
  plan?: string | number | null;
  valor?: number | string | null;
  amount?: number | string | null;
  asaas_payment_link?: string | null;
  payment_link?: string | null;
  observacoes?: string | null;
  campaign_description?: string | null;
  campanha?: string | null;
  segmento?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type PatrocinadorCobrancaResumo = {
  status: PatrocinadorStatus;
  statusLabel: string;
  paymentStatusLabel: string;
  valorFormatado: string;
  possuiLinkAsaas: boolean;
  linkAsaas: string | null;
  podeAbrirCobranca: boolean;
  podeCopiarLink: boolean;
  podeMarcarPago: boolean;
  podeAtivar: boolean;
  podeSalvarComoAguardandoPagamento: boolean;
};

export const PATROCINADOR_STATUS_LABEL: Record<PatrocinadorStatus, string> = {
  lead: "Lead",
  em_analise: "Em análise",
  aprovado: "Aprovado",
  aguardando_pagamento: "Aguardando pagamento",
  pago: "Pago",
  ativo: "Ativo",
  recusado: "Recusado",
  inativo: "Inativo",
};

export const PATROCINADOR_PAYMENT_STATUS_LABEL: Record<string, string> = {
  pending: "Pendente",
  waiting: "Aguardando pagamento",
  paid: "Pago",
  overdue: "Vencido",
  cancelled: "Cancelado",
  none: "Sem cobrança",
  linked: "Cobrança criada",
};

const STATUS_NORMALIZATION_MAP: Record<string, PatrocinadorStatus> = {
  lead: "lead",
  novo: "lead",

  analise: "em_analise",
  em_analise: "em_analise",
  "em análise": "em_analise",
  emanalise: "em_analise",

  aprovado: "aprovado",
  approved: "aprovado",

  aguardando_pagamento: "aguardando_pagamento",
  "aguardando pagamento": "aguardando_pagamento",
  waiting_payment: "aguardando_pagamento",
  waitingpayment: "aguardando_pagamento",
  pending_payment: "aguardando_pagamento",
  pendingpayment: "aguardando_pagamento",

  pago: "pago",
  paid: "pago",

  ativo: "ativo",
  active: "ativo",

  recusado: "recusado",
  rejeitado: "recusado",
  denied: "recusado",

  inativo: "inativo",
  inactive: "inativo",
};

function normalizeText(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function normalizePatrocinadorStatus(
  value: unknown,
): PatrocinadorStatus {
  const normalized = normalizeText(value);

  if (STATUS_NORMALIZATION_MAP[normalized]) {
    return STATUS_NORMALIZATION_MAP[normalized];
  }

  return "lead";
}

export function getPatrocinadorStatusLabel(
  value: unknown,
): string {
  const status = normalizePatrocinadorStatus(value);
  return PATROCINADOR_STATUS_LABEL[status];
}

export function getPatrocinadorPaymentStatusLabel(
  value: unknown,
  hasLink = false,
): string {
  const normalized = normalizeText(value);

  if (!normalized) {
    return hasLink
      ? PATROCINADOR_PAYMENT_STATUS_LABEL.linked
      : PATROCINADOR_PAYMENT_STATUS_LABEL.none;
  }

  return (
    PATROCINADOR_PAYMENT_STATUS_LABEL[normalized] ??
    "Status de pagamento desconhecido"
  );
}

export function parsePatrocinadorValor(
  value: PatrocinadorPlanoValor,
): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  const raw = String(value ?? "").trim();
  if (!raw) return 0;

  const cleaned = raw
    .replace(/[^\d,.-]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");

  const parsed = Number(cleaned);

  return Number.isFinite(parsed) ? parsed : 0;
}

export function formatCurrencyBRL(
  value: PatrocinadorPlanoValor,
): string {
  const amount = parsePatrocinadorValor(value);

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount);
}

export function getPatrocinadorNome(
  item: PatrocinadorLike | null | undefined,
): string {
  return (
    item?.nome?.trim() ||
    item?.responsavel?.trim() ||
    item?.company_name?.trim() ||
    item?.empresa?.trim() ||
    "Patrocinador"
  );
}

export function getPatrocinadorWhatsapp(
  item: PatrocinadorLike | null | undefined,
): string {
  const raw = item?.whatsapp || item?.phone || "";
  return String(raw).replace(/\D/g, "");
}

export function getPatrocinadorPlanoOuValor(
  item: PatrocinadorLike | null | undefined,
): string {
  const valorDireto = parsePatrocinadorValor(item?.valor ?? item?.amount);

  if (valorDireto > 0) {
    return formatCurrencyBRL(valorDireto);
  }

  const plano = item?.plano ?? item?.plan ?? "";
  const planoTexto = String(plano).trim();

  if (!planoTexto) {
    return formatCurrencyBRL(0);
  }

  const valorPlano = parsePatrocinadorValor(planoTexto);
  if (valorPlano > 0) {
    return formatCurrencyBRL(valorPlano);
  }

  return planoTexto;
}

export function getPatrocinadorLinkAsaas(
  item: PatrocinadorLike | null | undefined,
): string | null {
  const raw = item?.asaas_payment_link || item?.payment_link || "";
  const link = String(raw).trim();

  if (!link) return null;

  if (link.startsWith("http://") || link.startsWith("https://")) {
    return link;
  }

  return null;
}

export function hasPatrocinadorLinkAsaas(
  item: PatrocinadorLike | null | undefined,
): boolean {
  return Boolean(getPatrocinadorLinkAsaas(item));
}

export function canOpenPatrocinadorCobranca(
  item: PatrocinadorLike | null | undefined,
): boolean {
  const status = normalizePatrocinadorStatus(
    item?.commercial_status ?? item?.status,
  );

  if (status === "recusado" || status === "inativo") {
    return false;
  }

  return hasPatrocinadorLinkAsaas(item);
}

export function canMarkPatrocinadorAsPaid(
  item: PatrocinadorLike | null | undefined,
): boolean {
  const status = normalizePatrocinadorStatus(
    item?.commercial_status ?? item?.status,
  );

  return status === "aprovado" || status === "aguardando_pagamento";
}

export function canActivatePatrocinador(
  item: PatrocinadorLike | null | undefined,
): boolean {
  const status = normalizePatrocinadorStatus(
    item?.commercial_status ?? item?.status,
  );

  return status === "pago";
}

export function canMovePatrocinadorToWaitingPayment(
  item: PatrocinadorLike | null | undefined,
): boolean {
  const status = normalizePatrocinadorStatus(
    item?.commercial_status ?? item?.status,
  );

  return status === "aprovado";
}

export function buildPatrocinadorCobrancaResumo(
  item: PatrocinadorLike | null | undefined,
): PatrocinadorCobrancaResumo {
  const status = normalizePatrocinadorStatus(
    item?.commercial_status ?? item?.status,
  );

  const linkAsaas = getPatrocinadorLinkAsaas(item);
  const valorFormatado = getPatrocinadorPlanoOuValor(item);
  const hasLink = Boolean(linkAsaas);

  const paymentStatusLabel = getPatrocinadorPaymentStatusLabel(
    item?.payment_status,
    hasLink,
  );

  return {
    status,
    statusLabel: PATROCINADOR_STATUS_LABEL[status],
    paymentStatusLabel,
    valorFormatado,
    possuiLinkAsaas: hasLink,
    linkAsaas,
    podeAbrirCobranca: canOpenPatrocinadorCobranca(item),
    podeCopiarLink: hasLink,
    podeMarcarPago: canMarkPatrocinadorAsPaid(item),
    podeAtivar: canActivatePatrocinador(item),
    podeSalvarComoAguardandoPagamento:
      canMovePatrocinadorToWaitingPayment(item),
  };
}

export function getPatrocinadorStatusOptions(): Array<{
  value: PatrocinadorStatus;
  label: string;
}> {
  return PATROCINADOR_STATUS.map((status) => ({
    value: status,
    label: PATROCINADOR_STATUS_LABEL[status],
  }));
}

export function buildMensagemWhatsappPatrocinador(
  item: PatrocinadorLike | null | undefined,
): string {
  const nome = getPatrocinadorNome(item);
  const valor = getPatrocinadorPlanoOuValor(item);
  const segmento = String(item?.segmento ?? "").trim();
  const campanha =
    String(item?.campaign_description ?? item?.campanha ?? "").trim();

  const linhas = [
    `Olá, ${nome}. Tudo bem?`,
    "",
    "Aqui é da Aurora.",
    "Seu interesse em patrocínio foi analisado e seguimos com o fluxo comercial.",
    "",
    segmento ? `Segmento: ${segmento}` : null,
    campanha ? `Campanha: ${campanha}` : null,
    valor ? `Valor do plano: ${valor}` : null,
    "",
    "Vamos encaminhar a cobrança para avanço da ativação.",
    "Qualquer dúvida, seguimos à disposição.",
  ].filter(Boolean);

  return linhas.join("\n");
}

export function buildPatrocinadorStatusPayload(
  nextStatus: PatrocinadorStatus,
): Record<string, unknown> {
  const base: Record<string, unknown> = {
    commercial_status: nextStatus,
    status: nextStatus,
    updated_at: new Date().toISOString(),
  };

  if (nextStatus === "aguardando_pagamento") {
    base.payment_status = "waiting";
  }

  if (nextStatus === "pago") {
    base.payment_status = "paid";
    base.paid_at = new Date().toISOString();
  }

  if (nextStatus === "ativo") {
    base.payment_status = "paid";
    base.activated_at = new Date().toISOString();
  }

  return base;
}