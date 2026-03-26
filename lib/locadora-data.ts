export type VehicleCategory =
  | "SUV"
  | "Pickup"
  | "Sedan"
  | "Hatch"
  | "Van"
  | "Utilitário";

export type VehicleFuel =
  | "Flex"
  | "Diesel"
  | "Gasolina"
  | "Elétrico"
  | "Híbrido";

export type VehicleTransmission = "Manual" | "Automático";

export type VehicleMode = "venda" | "aluguel";

export type VehicleStatus =
  | "disponivel"
  | "reservado"
  | "vendido"
  | "alugado"
  | "inativo";

export type SellerType = "locadora" | "revenda" | "parceiro";

export type SellerItem = {
  id: string;
  tenantSlug: string;
  companyName: string;
  tradeName: string;
  type: SellerType;
  tagline?: string;
  phone: string;
  whatsapp?: string;
  logoText: string;
  city: string;
  state: string;
  active: boolean;
  featured?: boolean;
};

export type VehicleItem = {
  id: string;
  tenantSlug: string;
  sellerId: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  category: VehicleCategory;
  fuel: VehicleFuel;
  transmission: VehicleTransmission;
  mode: VehicleMode[];
  status: VehicleStatus;
  priceSale?: number | null;
  priceRentDaily?: number | null;
  location: string;
  city: string;
  state: string;
  image: string;
  featured?: boolean;
  description: string;
  sellerName: string;
  sellerLogo: string;
  sellerTagline?: string;
  sellerPhone: string;
  badge?: string;
  platformCommissionPercent?: number | null;
};

export const locadoraSellers: SellerItem[] = [
  {
    id: "seller-raja",
    tenantSlug: "raja-seminovos",
    companyName: "Raja Seminovos Ltda",
    tradeName: "Raja Seminovos",
    type: "locadora",
    tagline: "Locadora e seminovos premium",
    phone: "5531999991111",
    whatsapp: "5531999991111",
    logoText: "RS",
    city: "Belo Horizonte",
    state: "MG",
    active: true,
    featured: true,
  },
  {
    id: "seller-bh-fleet",
    tenantSlug: "bh-fleet",
    companyName: "BH Fleet Mobilidade Ltda",
    tradeName: "BH Fleet",
    type: "locadora",
    tagline: "Frotas, aluguel e utilitários",
    phone: "5531999992222",
    whatsapp: "5531999992222",
    logoText: "BH",
    city: "Contagem",
    state: "MG",
    active: true,
  },
  {
    id: "seller-aurora-motors",
    tenantSlug: "aurora-motors",
    companyName: "Aurora Motors",
    tradeName: "Aurora Motors",
    type: "revenda",
    tagline: "Mobilidade com presença",
    phone: "5531999993333",
    whatsapp: "5531999993333",
    logoText: "AM",
    city: "Vespasiano",
    state: "MG",
    active: true,
  },
  {
    id: "seller-loccar-prime",
    tenantSlug: "loccar-prime",
    companyName: "Loccar Prime Veículos",
    tradeName: "Loccar Prime",
    type: "revenda",
    tagline: "Seminovos selecionados",
    phone: "5531999994444",
    whatsapp: "5531999994444",
    logoText: "LP",
    city: "Belo Horizonte",
    state: "MG",
    active: true,
  },
  {
    id: "seller-carga-facil",
    tenantSlug: "carga-facil",
    companyName: "Carga Fácil Utilitários",
    tradeName: "Carga Fácil",
    type: "locadora",
    tagline: "Utilitários para operação",
    phone: "5531999995555",
    whatsapp: "5531999995555",
    logoText: "CF",
    city: "Betim",
    state: "MG",
    active: true,
  },
  {
    id: "seller-minas-veiculos",
    tenantSlug: "minas-veiculos",
    companyName: "Minas Veículos Regional",
    tradeName: "Minas Veículos",
    type: "locadora",
    tagline: "Locação e venda regional",
    phone: "5531999996666",
    whatsapp: "5531999996666",
    logoText: "MV",
    city: "Lagoa Santa",
    state: "MG",
    active: true,
  },
];

export const locadoraVehicles: VehicleItem[] = [
  {
    id: "hilux-srx-2023",
    tenantSlug: "raja-seminovos",
    sellerId: "seller-raja",
    title: "Toyota Hilux SRX 2023",
    brand: "Toyota",
    model: "Hilux SRX",
    year: 2023,
    category: "Pickup",
    fuel: "Diesel",
    transmission: "Automático",
    mode: ["venda", "aluguel"],
    status: "disponivel",
    priceSale: 259900,
    priceRentDaily: 390,
    location: "Belo Horizonte - MG",
    city: "Belo Horizonte",
    state: "MG",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=80",
    featured: true,
    description:
      "Pickup premium pronta para trabalho pesado, locação executiva e operações comerciais com presença forte.",
    sellerName: "Raja Seminovos",
    sellerLogo: "RS",
    sellerTagline: "Locadora e seminovos premium",
    sellerPhone: "5531999991111",
    badge: "Premium",
    platformCommissionPercent: 8,
  },
  {
    id: "tracker-premier-2024",
    tenantSlug: "bh-fleet",
    sellerId: "seller-bh-fleet",
    title: "Chevrolet Tracker Premier 2024",
    brand: "Chevrolet",
    model: "Tracker Premier",
    year: 2024,
    category: "SUV",
    fuel: "Flex",
    transmission: "Automático",
    mode: ["venda", "aluguel"],
    status: "disponivel",
    priceSale: 149900,
    priceRentDaily: 240,
    location: "Contagem - MG",
    city: "Contagem",
    state: "MG",
    image:
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1400&q=80",
    featured: true,
    description:
      "SUV moderno, confortável e excelente para família, executivos e uso urbano com ótimo giro comercial.",
    sellerName: "BH Fleet",
    sellerLogo: "BH",
    sellerTagline: "Frotas, aluguel e utilitários",
    sellerPhone: "5531999992222",
    badge: "Destaque",
    platformCommissionPercent: 7,
  },
  {
    id: "onix-lt-2024",
    tenantSlug: "aurora-motors",
    sellerId: "seller-aurora-motors",
    title: "Chevrolet Onix LT 2024",
    brand: "Chevrolet",
    model: "Onix LT",
    year: 2024,
    category: "Hatch",
    fuel: "Flex",
    transmission: "Automático",
    mode: ["venda", "aluguel"],
    status: "disponivel",
    priceSale: 89900,
    priceRentDaily: 139,
    location: "Vespasiano - MG",
    city: "Vespasiano",
    state: "MG",
    image:
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=1400&q=80",
    description:
      "Veículo econômico, ideal para locação recorrente, motoristas de app, operação urbana e alta procura.",
    sellerName: "Aurora Motors",
    sellerLogo: "AM",
    sellerTagline: "Mobilidade com presença",
    sellerPhone: "5531999993333",
    badge: "Oferta",
    platformCommissionPercent: 6,
  },
  {
    id: "corolla-xei-2023",
    tenantSlug: "loccar-prime",
    sellerId: "seller-loccar-prime",
    title: "Toyota Corolla XEi 2023",
    brand: "Toyota",
    model: "Corolla XEi",
    year: 2023,
    category: "Sedan",
    fuel: "Flex",
    transmission: "Automático",
    mode: ["venda"],
    status: "disponivel",
    priceSale: 154900,
    priceRentDaily: null,
    location: "Belo Horizonte - MG",
    city: "Belo Horizonte",
    state: "MG",
    image:
      "https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1400&q=80",
    description:
      "Sedan confiável, elegante e muito procurado por clientes que querem conforto com revenda forte.",
    sellerName: "Loccar Prime",
    sellerLogo: "LP",
    sellerTagline: "Seminovos selecionados",
    sellerPhone: "5531999994444",
    badge: "Executivo",
    platformCommissionPercent: 7,
  },
  {
    id: "master-furgao-2022",
    tenantSlug: "carga-facil",
    sellerId: "seller-carga-facil",
    title: "Renault Master Furgão 2022",
    brand: "Renault",
    model: "Master",
    year: 2022,
    category: "Van",
    fuel: "Diesel",
    transmission: "Manual",
    mode: ["aluguel", "venda"],
    status: "disponivel",
    priceSale: 189900,
    priceRentDaily: 320,
    location: "Betim - MG",
    city: "Betim",
    state: "MG",
    image:
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1400&q=80",
    description:
      "Excelente para operações logísticas, entregas, suporte técnico e pequenas frotas empresariais.",
    sellerName: "Carga Fácil",
    sellerLogo: "CF",
    sellerTagline: "Utilitários para operação",
    sellerPhone: "5531999995555",
    badge: "Empresarial",
    platformCommissionPercent: 9,
  },
  {
    id: "strada-freedom-2024",
    tenantSlug: "minas-veiculos",
    sellerId: "seller-minas-veiculos",
    title: "Fiat Strada Freedom 2024",
    brand: "Fiat",
    model: "Strada Freedom",
    year: 2024,
    category: "Utilitário",
    fuel: "Flex",
    transmission: "Manual",
    mode: ["venda", "aluguel"],
    status: "disponivel",
    priceSale: 109900,
    priceRentDaily: 180,
    location: "Lagoa Santa - MG",
    city: "Lagoa Santa",
    state: "MG",
    image:
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1400&q=80",
    description:
      "Utilitário leve de excelente aceitação no mercado, ótimo para pequenos negócios e uso profissional.",
    sellerName: "Minas Veículos",
    sellerLogo: "MV",
    sellerTagline: "Locação e venda regional",
    sellerPhone: "5531999996666",
    badge: "Giro Rápido",
    platformCommissionPercent: 8,
  },
];

export function formatCurrencyBRL(value?: number | null) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return null;
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

export function normalizePhoneBR(value?: string | null) {
  return (value || "").replace(/\D/g, "");
}

export function buildVehicleWhatsappLink(vehicle: {
  title?: string;
  sellerPhone?: string;
}) {
  const phone = normalizePhoneBR(vehicle?.sellerPhone);

  if (!phone) {
    return "#";
  }

  const message = encodeURIComponent(
    `Olá! Tenho interesse no veículo: ${vehicle.title || "veículo"}`
  );

  return `https://wa.me/${phone}?text=${message}`;
}

export function getSellerById(sellerId: string) {
  return locadoraSellers.find((seller) => seller.id === sellerId) || null;
}

export function getSellerBySlug(slug: string) {
  return locadoraSellers.find((seller) => seller.tenantSlug === slug) || null;
}

export function getVehiclesBySellerId(sellerId: string) {
  return locadoraVehicles.filter((vehicle) => vehicle.sellerId === sellerId);
}

export function getVehiclesByTenantSlug(slug: string) {
  return locadoraVehicles.filter((vehicle) => vehicle.tenantSlug === slug);
}

export function getFeaturedVehicles() {
  return locadoraVehicles.filter(
    (vehicle) => vehicle.featured && vehicle.status === "disponivel"
  );
}