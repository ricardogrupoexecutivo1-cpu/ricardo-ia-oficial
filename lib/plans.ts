export type PlanKey = "FREE" | "PRO" | "SCALE";

export type Plan = {
  key: PlanKey;
  name: string;
  badge?: string;
  highlight: boolean;
  priceLabel: string;
  priceValue: number;
  description: string;
  features: string[];
  checkoutHref: string;
  ctaLabel: string;
};

export const PLAN_ORDER: PlanKey[] = ["FREE", "PRO", "SCALE"];

export const PLANS: Record<PlanKey, Plan> = {
  FREE: {
    key: "FREE",
    name: "FREE",
    badge: "Grátis",
    highlight: false,
    priceLabel: "Grátis",
    priceValue: 0,
    description:
      "Para começar a conhecer a Aurora IA e testar os primeiros recursos.",
    features: [
      "Uso básico do chat",
      "Geração inicial de imagens",
      "Entrada rápida na plataforma",
    ],
    checkoutHref: "/chat",
    ctaLabel: "Começar grátis",
  },

  PRO: {
    key: "PRO",
    name: "PRO",
    badge: "Profissional",
    highlight: false,
    priceLabel: "R$ 19,90/mês",
    priceValue: 19.9,
    description:
      "Plano ideal para quem quer usar a Aurora IA com mais força e frequência.",
    features: [
      "Mais geração de imagens",
      "Uso mais liberado do chat",
      "Melhor desempenho geral",
    ],
    checkoutHref:
      process.env.NEXT_PUBLIC_PRO_PLAN_URL || "/checkout?plan=pro",
    ctaLabel: "Assinar PRO",
  },

  SCALE: {
    key: "SCALE",
    name: "SCALE",
    badge: "Crescimento",
    highlight: true,
    priceLabel: "R$ 29,90/mês",
    priceValue: 29.9,
    description:
      "Plano completo para quem quer usar mais recursos, vender mais e escalar com a Aurora IA.",
    features: [
      "Tudo do plano PRO",
      "Prioridade de uso",
      "Mais poder de criação",
      "Estrutura ideal para operação comercial",
      "Melhor plano para fechar clientes",
    ],
    checkoutHref:
      process.env.NEXT_PUBLIC_SCALE_PLAN_URL || "/checkout?plan=scale",
    ctaLabel: "Assinar SCALE",
  },
};