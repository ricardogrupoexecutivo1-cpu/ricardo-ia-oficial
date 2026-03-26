export type AdvertiserType =
  | "locadora"
  | "imobiliaria"
  | "corretor"
  | "banco"
  | "seguradora";

export type AdvertiserStatus =
  | "active"
  | "inactive"
  | "pending";

export type AdvertiserPlan =
  | "free"
  | "pro"
  | "premium"
  | "enterprise";

export type AdvertiserRecord = {
  id: string;
  type: AdvertiserType;
  status: AdvertiserStatus;
  plan: AdvertiserPlan;
  name: string;
  slug: string;
  contactName?: string;
  email?: string;
  whatsapp?: string;
  phone?: string;
  country: string;
  state: string;
  city: string;
  municipality?: string;
  neighborhood?: string;
  postalCode?: string;
  logoUrl?: string;
  coverUrl?: string;
  description?: string;
  verified?: boolean;
  createdAt: string;
  updatedAt: string;
};

export function normalizeAdvertiserSlug(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export const seedAdvertisers: AdvertiserRecord[] = [
  {
    id: "adv-1",
    type: "locadora",
    status: "active",
    plan: "pro",
    name: "Seminovos Raja",
    slug: "seminovos-raja",
    contactName: "Equipe Comercial",
    email: "contato@seminovosraja.com",
    whatsapp: "55319997490074",
    country: "Brasil",
    state: "Minas Gerais",
    city: "Belo Horizonte",
    municipality: "Belo Horizonte",
    verified: true,
    description: "Loja parceira para venda e divulgação de veículos.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "adv-2",
    type: "imobiliaria",
    status: "active",
    plan: "premium",
    name: "Aurora Imóveis BH",
    slug: "aurora-imoveis-bh",
    contactName: "Equipe Aurora Imóveis",
    email: "contato@auroraimoveisbh.com",
    whatsapp: "55319997490074",
    country: "Brasil",
    state: "Minas Gerais",
    city: "Belo Horizonte",
    municipality: "Belo Horizonte",
    verified: true,
    description: "Imobiliária parceira com foco em venda e locação.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];