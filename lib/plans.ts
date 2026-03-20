export type PlanKey = "free" | "pro" | "total";

export type PlanDefinition = {
  key: PlanKey;
  name: string;
  priceLabel: string;
  priceValue: number;
  periodLabel: string;
  badge?: string;
  description: string;
  features: string[];
  ctaLabel: string;
  checkoutHref: string;
  highlight?: boolean;
};

const PRO_CHECKOUT_URL =
  process.env.NEXT_PUBLIC_CHECKOUT_PRO_URL?.trim() ||
  "https://www.asaas.com/paymentCampaign/show/3605974";

const TOTAL_CHECKOUT_URL =
  process.env.NEXT_PUBLIC_CHECKOUT_TOTAL_URL?.trim() || "#";

const TOTAL_PRICE = 29.9;

export const PLANS: Record<PlanKey, PlanDefinition> = {
  free: {
    key: "free",
    name: "FREE",
    priceLabel: "Grátis",
    priceValue: 0,
    periodLabel: "",
    badge: "Entrada",
    description:
      "Para conhecer a Aurora IA, testar o chat e validar o valor da plataforma.",
    features: [
      "Acesso inicial à Aurora IA",
      "Uso básico para testes",
      "Entrada rápida na plataforma",
      "Ideal para conhecer a ferramenta",
    ],
    ctaLabel: "Começar grátis",
    checkoutHref: "/chat",
  },
  pro: {
    key: "pro",
    name: "PRO",
    priceLabel: "R$ 9,90/mês",
    priceValue: 9.9,
    periodLabel: "/mês",
    badge: "Mais vendido",
    description:
      "Para quem quer usar a Aurora IA no dia a dia para criar, divulgar e vender mais.",
    features: [
      "Chat com uso ampliado",
      "Criação de campanhas",
      "Geração de imagens",
      "Uso comercial liberado",
      "Mais velocidade para vender",
    ],
    ctaLabel: "Assinar PRO",
    checkoutHref: PRO_CHECKOUT_URL,
    highlight: true,
  },
  total: {
    key: "total",
    name: "SCALE",
    priceLabel: `R$ ${TOTAL_PRICE.toFixed(2).replace(".", ",")}/mês`,
    priceValue: TOTAL_PRICE,
    periodLabel: "/mês",
    badge: "Crescimento",
    description:
      "Plano completo para quem quer usar mais recursos, vender mais e escalar com a Aurora IA.",
    features: [
      "Tudo do plano PRO",
      "Prioridade de uso",
      "Mais poder de criação",
      "Estrutura ideal para operação comercial",
      "Melhor plano para fechar clientes",
    ],
    ctaLabel:
      TOTAL_CHECKOUT_URL === "#" ? "Configurar SCALE" : "Assinar SCALE",
    checkoutHref: TOTAL_CHECKOUT_URL,
    highlight: false,
  },
};

export const PLAN_ORDER: PlanKey[] = ["free", "pro", "total"];

export function getPlanByKey(plan: string | null | undefined): PlanDefinition {
  if (!plan) return PLANS.free;

  const normalized = String(plan).trim().toLowerCase();

  if (normalized === "pro") return PLANS.pro;
  if (normalized === "total") return PLANS.total;

  return PLANS.free;
}