export type PlanKey = "free" | "pro" | "premium";

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

const PREMIUM_PRICE = 29.9;

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
    checkoutHref: "/checkout?plan=pro",
    highlight: true,
  },
  premium: {
    key: "premium",
    name: "PREMIUM",
    priceLabel: `R$ ${PREMIUM_PRICE.toFixed(2).replace(".", ",")}/mês`,
    priceValue: PREMIUM_PRICE,
    periodLabel: "/mês",
    badge: "Escala",
    description:
      "Plano completo para quem quer escalar, automatizar e vender com força total usando a Aurora IA.",
    features: [
      "Tudo do plano PRO",
      "Prioridade máxima de uso",
      "Mais poder de geração de imagens",
      "Ideal para negócios e operações",
      "Melhor plano para monetização",
    ],
    ctaLabel: "Assinar PREMIUM",
    checkoutHref: "/checkout?plan=premium",
    highlight: false,
  },
};

export const PLAN_ORDER: PlanKey[] = ["free", "pro", "premium"];

export function getPlanByKey(plan: string | null | undefined): PlanDefinition {
  if (!plan) return PLANS.free;

  const normalized = String(plan).trim().toLowerCase();

  if (normalized === "pro") return PLANS.pro;
  if (normalized === "premium") return PLANS.premium;

  return PLANS.free;
}