export type VehicleItem = {
  id: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  category: "SUV" | "Pickup" | "Sedan" | "Hatch" | "Van" | "Utilitário";
  fuel: "Flex" | "Diesel" | "Gasolina" | "Elétrico" | "Híbrido";
  transmission: "Manual" | "Automático";
  mode: ("venda" | "aluguel")[];
  priceSale?: number | null;
  priceRentDaily?: number | null;
  location: string;
  image: string;
  featured?: boolean;
  description: string;
  sellerName: string;
  sellerLogo: string;
  sellerTagline?: string;
  badge?: string;
};

export const locadoraVehicles: VehicleItem[] = [
  {
    id: "hilux-srx-2023",
    title: "Toyota Hilux SRX 2023",
    brand: "Toyota",
    model: "Hilux SRX",
    year: 2023,
    category: "Pickup",
    fuel: "Diesel",
    transmission: "Automático",
    mode: ["venda", "aluguel"],
    priceSale: 259900,
    priceRentDaily: 390,
    location: "Belo Horizonte - MG",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=80",
    featured: true,
    description:
      "Pickup premium pronta para trabalho pesado, locação executiva e operações comerciais com presença forte.",
    sellerName: "Raja Seminovos",
    sellerLogo: "RS",
    sellerTagline: "Locadora e seminovos premium",
    badge: "Premium",
  },
  {
    id: "tracker-premier-2024",
    title: "Chevrolet Tracker Premier 2024",
    brand: "Chevrolet",
    model: "Tracker Premier",
    year: 2024,
    category: "SUV",
    fuel: "Flex",
    transmission: "Automático",
    mode: ["venda", "aluguel"],
    priceSale: 149900,
    priceRentDaily: 240,
    location: "Contagem - MG",
    image:
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1400&q=80",
    featured: true,
    description:
      "SUV moderno, confortável e excelente para família, executivos e uso urbano com ótimo giro comercial.",
    sellerName: "BH Fleet",
    sellerLogo: "BH",
    sellerTagline: "Frotas, aluguel e utilitários",
    badge: "Destaque",
  },
  {
    id: "onix-lt-2024",
    title: "Chevrolet Onix LT 2024",
    brand: "Chevrolet",
    model: "Onix LT",
    year: 2024,
    category: "Hatch",
    fuel: "Flex",
    transmission: "Automático",
    mode: ["venda", "aluguel"],
    priceSale: 89900,
    priceRentDaily: 139,
    location: "Vespasiano - MG",
    image:
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=1400&q=80",
    description:
      "Veículo econômico, ideal para locação recorrente, motoristas de app, operação urbana e alta procura.",
    sellerName: "Aurora Motors",
    sellerLogo: "AM",
    sellerTagline: "Mobilidade com presença",
    badge: "Oferta",
  },
  {
    id: "corolla-xei-2023",
    title: "Toyota Corolla XEi 2023",
    brand: "Toyota",
    model: "Corolla XEi",
    year: 2023,
    category: "Sedan",
    fuel: "Flex",
    transmission: "Automático",
    mode: ["venda"],
    priceSale: 154900,
    priceRentDaily: null,
    location: "Belo Horizonte - MG",
    image:
      "https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1400&q=80",
    description:
      "Sedan confiável, elegante e muito procurado por clientes que querem conforto com revenda forte.",
    sellerName: "Loccar Prime",
    sellerLogo: "LP",
    sellerTagline: "Seminovos selecionados",
    badge: "Executivo",
  },
  {
    id: "master-furgao-2022",
    title: "Renault Master Furgão 2022",
    brand: "Renault",
    model: "Master",
    year: 2022,
    category: "Van",
    fuel: "Diesel",
    transmission: "Manual",
    mode: ["aluguel", "venda"],
    priceSale: 189900,
    priceRentDaily: 320,
    location: "Betim - MG",
    image:
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1400&q=80",
    description:
      "Excelente para operações logísticas, entregas, suporte técnico e pequenas frotas empresariais.",
    sellerName: "Carga Fácil",
    sellerLogo: "CF",
    sellerTagline: "Utilitários para operação",
    badge: "Empresarial",
  },
  {
    id: "strada-freedom-2024",
    title: "Fiat Strada Freedom 2024",
    brand: "Fiat",
    model: "Strada Freedom",
    year: 2024,
    category: "Utilitário",
    fuel: "Flex",
    transmission: "Manual",
    mode: ["venda", "aluguel"],
    priceSale: 109900,
    priceRentDaily: 180,
    location: "Lagoa Santa - MG",
    image:
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1400&q=80",
    description:
      "Utilitário leve de excelente aceitação no mercado, ótimo para pequenos negócios e uso profissional.",
    sellerName: "Minas Veículos",
    sellerLogo: "MV",
    sellerTagline: "Locação e venda regional",
    badge: "Giro Rápido",
  },
];

export function formatCurrencyBRL(value?: number | null) {
  if (typeof value !== "number") {
    return null;
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}