export type PlanKey = "FREE" | "PRO" | "TOTAL";

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

export const PLAN_ORDER: PlanKey[] = ["FREE", "PRO", "TOTAL"];

export const PLANS: Record<PlanKey, Plan> = {
  FREE: {
    key: "FREE",
    name: "FREE",
    badge: "Ideal para começar",
    highlight: false,
    priceLabel: "Grátis",
    priceValue: 0,
    description:
      "Plano de entrada para conhecer a Aurora IA e testar os primeiros recursos da plataforma.",
    features: [
      "3 imagens por dia",
      "Chat básico",
      "Testes iniciais",
    ],
    checkoutHref: "/chat",
    ctaLabel: "Plano atual",
  },

  PRO: {
    key: "PRO",
    name: "PRO",
    badge: "Para quem quer acelerar",
    highlight: false,
    priceLabel: "R$ 19,90/mês",
    priceValue: 19.9,
    description:
      "Plano para quem quer usar a Aurora IA com mais força, mais constância e melhor desempenho.",
    features: [
      "Mais imagens por dia",
      "Prioridade no sistema",
      "Recursos avançados",
    ],
    checkoutHref:
      process.env.NEXT_PUBLIC_PRO_PLAN_URL || "/checkout?plan=pro",
    ctaLabel: "🚀 Assinar PRO",
  },

  TOTAL: {
    key: "TOTAL",
    name: "TOTAL",
    badge: "Liberação completa + Veículos",
    highlight: true,
    priceLabel: "R$ 49,90/mês",
    priceValue: 49.9,
    description:
      "Plano premium para quem quer uso total da Aurora IA, operação comercial mais forte e apoio para compra, venda e aluguel de veículos.",
    features: [
      "Imagens ilimitadas",
      "Acesso total",
      "Futuras funções liberadas",
      "Estrutura para compra e venda de veículos",
      "Apoio para aluguel e operação de locadoras",
      "Plano ideal para uso comercial mais pesado",
    ],
    checkoutHref:
      process.env.NEXT_PUBLIC_TOTAL_PLAN_URL || "/checkout?plan=total",
    ctaLabel: "🚗 Assinar TOTAL + Veículos",
  },
};