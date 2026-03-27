import type {
  AuroraCoverageRecord,
  AuroraLocationRecord,
} from "./aurora-location";
import type {
  AuroraModule,
  CompanyContactRecord,
  CompanyRecord,
} from "./company-contacts";

export type DemoListingRecord = {
  id: string;
  module: AuroraModule;
  category: string;
  title: string;
  description: string;
  city?: string | null;
  state?: string | null;
  companyId: string;
  contactId?: string | null;
  whatsappOverride?: string | null;
  isActive: boolean;
  location: AuroraLocationRecord;
  coverage: AuroraCoverageRecord;
};

export const demoCompanies: CompanyRecord[] = [
  {
    id: "company-agro-001",
    name: "Agro Forte Minas",
    slug: "agro-forte-minas",
    city: "Belo Horizonte",
    state: "MG",
    whatsapp: "5531991111111",
    phone: "3133330001",
    email: "contato@agroforteminas.com",
    logoUrl: null,
    isActive: true,
  },
  {
    id: "company-locadora-001",
    name: "Raja Aluguel de Veículos",
    slug: "raja-aluguel-de-veiculos",
    city: "Belo Horizonte",
    state: "MG",
    whatsapp: "5531992222222",
    phone: "3133330002",
    email: "comercial@rajaaluguel.com",
    logoUrl: null,
    isActive: true,
  },
  {
    id: "company-imoveis-001",
    name: "Aurora Imóveis Prime",
    slug: "aurora-imoveis-prime",
    city: "Lagoa Santa",
    state: "MG",
    whatsapp: "5531993333333",
    phone: "3133330003",
    email: "atendimento@auroraimoveisprime.com",
    logoUrl: null,
    isActive: true,
  },
];

export const demoCompanyContacts: CompanyContactRecord[] = [
  {
    id: "contact-agro-001",
    companyId: "company-agro-001",
    name: "Marcos Agro",
    role: "sales",
    whatsapp: "5531994444444",
    phone: null,
    email: "marcos@agroforteminas.com",
    isPrimary: true,
    isActive: true,
  },
  {
    id: "contact-agro-002",
    companyId: "company-agro-001",
    name: "Paula Insumos",
    role: "sales",
    whatsapp: "5531995555555",
    phone: null,
    email: "paula@agroforteminas.com",
    isPrimary: false,
    isActive: true,
  },
  {
    id: "contact-locadora-001",
    companyId: "company-locadora-001",
    name: "Ana Seminovos",
    role: "sales",
    whatsapp: "5531996666666",
    phone: null,
    email: "ana@rajaaluguel.com",
    isPrimary: true,
    isActive: true,
  },
  {
    id: "contact-locadora-002",
    companyId: "company-locadora-001",
    name: "Carlos Frotas",
    role: "buyer",
    whatsapp: "5531997777777",
    phone: null,
    email: "carlos@rajaaluguel.com",
    isPrimary: false,
    isActive: true,
  },
  {
    id: "contact-imoveis-001",
    companyId: "company-imoveis-001",
    name: "Juliana Imóveis",
    role: "sales",
    whatsapp: "5531998888888",
    phone: null,
    email: "juliana@auroraimoveisprime.com",
    isPrimary: true,
    isActive: true,
  },
];

export const demoListings: DemoListingRecord[] = [
  {
    id: "listing-agro-001",
    module: "agro",
    category: "compradores",
    title: "Compra de sementes e fertilizantes",
    description:
      "Empresa busca fornecedores para sementes, fertilizantes e itens de apoio operacional.",
    city: "Belo Horizonte",
    state: "MG",
    companyId: "company-agro-001",
    contactId: "contact-agro-001",
    whatsappOverride: null,
    isActive: true,
    location: {
      country: "Brasil",
      state: "MG",
      city: "Belo Horizonte",
      latitude: -19.9167,
      longitude: -43.9345,
    },
    coverage: {
      coverageType: "state",
      maxRadiusKm: 250,
      servesCities: ["Belo Horizonte", "Contagem", "Betim"],
      servesStates: ["MG"],
      servesNationally: false,
      deliveryAvailable: true,
      pickupAvailable: true,
    },
  },
  {
    id: "listing-agro-002",
    module: "agro",
    category: "insumos",
    title: "Venda de insumos agrícolas",
    description:
      "Linha de sementes, fertilizantes e acessórios com atendimento regional.",
    city: "Sete Lagoas",
    state: "MG",
    companyId: "company-agro-001",
    contactId: "contact-agro-002",
    whatsappOverride: null,
    isActive: true,
    location: {
      country: "Brasil",
      state: "MG",
      city: "Sete Lagoas",
      latitude: -19.4583,
      longitude: -44.2467,
    },
    coverage: {
      coverageType: "regional",
      maxRadiusKm: 180,
      servesCities: ["Sete Lagoas", "Pará de Minas", "Curvelo"],
      servesStates: ["MG"],
      servesNationally: false,
      deliveryAvailable: true,
      pickupAvailable: true,
    },
  },
  {
    id: "listing-locadora-001",
    module: "locadora",
    category: "seminovos",
    title: "Hilux seminova com atendimento dedicado",
    description:
      "Anúncio de seminovos com responsável próprio para negociação e atendimento comercial.",
    city: "Belo Horizonte",
    state: "MG",
    companyId: "company-locadora-001",
    contactId: "contact-locadora-001",
    whatsappOverride: null,
    isActive: true,
    location: {
      country: "Brasil",
      state: "MG",
      city: "Belo Horizonte",
      latitude: -19.9167,
      longitude: -43.9345,
    },
    coverage: {
      coverageType: "regional",
      maxRadiusKm: 120,
      servesCities: ["Belo Horizonte", "Contagem", "Nova Lima"],
      servesStates: ["MG"],
      servesNationally: false,
      deliveryAvailable: false,
      pickupAvailable: true,
    },
  },
  {
    id: "listing-locadora-002",
    module: "locadora",
    category: "compras",
    title: "Compra de veículos para renovação de frota",
    description:
      "Área de compras da locadora com contato específico para negociação de veículos.",
    city: "Belo Horizonte",
    state: "MG",
    companyId: "company-locadora-001",
    contactId: "contact-locadora-002",
    whatsappOverride: null,
    isActive: true,
    location: {
      country: "Brasil",
      state: "MG",
      city: "Belo Horizonte",
      latitude: -19.9167,
      longitude: -43.9345,
    },
    coverage: {
      coverageType: "state",
      maxRadiusKm: 350,
      servesCities: ["Belo Horizonte", "Uberlândia", "Juiz de Fora"],
      servesStates: ["MG"],
      servesNationally: false,
      deliveryAvailable: false,
      pickupAvailable: true,
    },
  },
  {
    id: "listing-imoveis-001",
    module: "imoveis",
    category: "venda",
    title: "Casa em condomínio com corretora responsável",
    description:
      "Anúncio imobiliário com atendimento feito pela corretora principal da operação.",
    city: "Lagoa Santa",
    state: "MG",
    companyId: "company-imoveis-001",
    contactId: "contact-imoveis-001",
    whatsappOverride: null,
    isActive: true,
    location: {
      country: "Brasil",
      state: "MG",
      city: "Lagoa Santa",
      latitude: -19.6276,
      longitude: -43.8894,
    },
    coverage: {
      coverageType: "local",
      maxRadiusKm: 35,
      servesCities: ["Lagoa Santa", "Vespasiano", "Confins"],
      servesStates: ["MG"],
      servesNationally: false,
      deliveryAvailable: false,
      pickupAvailable: false,
    },
  },
  {
    id: "listing-agro-003",
    module: "agro",
    category: "servicos",
    title: "Serviço de manutenção agrícola com contato direto",
    description:
      "Prestação de serviço com contato prioritário via anúncio para atendimento rápido.",
    city: "Pará de Minas",
    state: "MG",
    companyId: "company-agro-001",
    contactId: null,
    whatsappOverride: "5531999999999",
    isActive: true,
    location: {
      country: "Brasil",
      state: "MG",
      city: "Pará de Minas",
      latitude: -19.8606,
      longitude: -44.6083,
    },
    coverage: {
      coverageType: "national",
      maxRadiusKm: null,
      servesCities: null,
      servesStates: ["MG", "GO", "SP"],
      servesNationally: true,
      deliveryAvailable: true,
      pickupAvailable: false,
    },
  },
];

export function getDemoCompanyById(companyId?: string | null) {
  if (!companyId) return null;
  return demoCompanies.find((company) => company.id === companyId) ?? null;
}

export function getDemoContactsByCompanyId(companyId?: string | null) {
  if (!companyId) return [];
  return demoCompanyContacts.filter((contact) => contact.companyId === companyId);
}

export function getDemoContactById(contactId?: string | null) {
  if (!contactId) return null;
  return demoCompanyContacts.find((contact) => contact.id === contactId) ?? null;
}

export function getDemoListingById(listingId?: string | null) {
  if (!listingId) return null;
  return demoListings.find((listing) => listing.id === listingId) ?? null;
}

export function getDemoListingsByModule(module: AuroraModule) {
  return demoListings.filter((listing) => listing.module === module);
}