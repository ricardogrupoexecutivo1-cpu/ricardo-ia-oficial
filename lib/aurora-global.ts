export type AuroraLocale = "pt-BR" | "en-US" | "es-ES";

export type AuroraCurrency =
  | "BRL"
  | "USD"
  | "EUR"
  | "GBP"
  | "MXN"
  | "ARS"
  | "CLP"
  | "COP"
  | "PYG"
  | "UYU"
  | "BOB"
  | "PEN";

export type AuroraLanguageOption = {
  code: AuroraLocale;
  label: string;
  nativeLabel: string;
  shortLabel: string;
};

export type AuroraCurrencyOption = {
  code: AuroraCurrency;
  label: string;
  symbol: string;
  locale: AuroraLocale;
};

export const AURORA_LANGUAGES: AuroraLanguageOption[] = [
  {
    code: "pt-BR",
    label: "Portuguese (Brazil)",
    nativeLabel: "Português (Brasil)",
    shortLabel: "PT",
  },
  {
    code: "en-US",
    label: "English (US)",
    nativeLabel: "English (US)",
    shortLabel: "EN",
  },
  {
    code: "es-ES",
    label: "Spanish",
    nativeLabel: "Español",
    shortLabel: "ES",
  },
];

export const AURORA_CURRENCIES: AuroraCurrencyOption[] = [
  { code: "BRL", label: "Real brasileiro", symbol: "R$", locale: "pt-BR" },
  { code: "USD", label: "US Dollar", symbol: "$", locale: "en-US" },
  { code: "EUR", label: "Euro", symbol: "€", locale: "es-ES" },
  { code: "GBP", label: "British Pound", symbol: "£", locale: "en-US" },
  { code: "MXN", label: "Peso mexicano", symbol: "$", locale: "es-ES" },
  { code: "ARS", label: "Peso argentino", symbol: "$", locale: "es-ES" },
  { code: "CLP", label: "Peso chileno", symbol: "$", locale: "es-ES" },
  { code: "COP", label: "Peso colombiano", symbol: "$", locale: "es-ES" },
  { code: "PYG", label: "Guarani paraguaio", symbol: "₲", locale: "es-ES" },
  { code: "UYU", label: "Peso uruguaio", symbol: "$U", locale: "es-ES" },
  { code: "BOB", label: "Boliviano", symbol: "Bs", locale: "es-ES" },
  { code: "PEN", label: "Sol peruano", symbol: "S/", locale: "es-ES" },
];

type TranslationTree = {
  appName: string;
  betaLabel: string;
  systemNotice: string;
  language: string;
  currency: string;
  save: string;
  cancel: string;
  edit: string;
  delete: string;
  back: string;
  continue: string;
  home: string;
  chat: string;
  plans: string;
  explore: string;
  finance: string;
  agribusiness: string;
  realEstate: string;
  register: string;
  login: string;
  businessDashboard: string;
  internalModules: string;
  globalRegistration: string;
  privateArea: string;
  reports: string;
  settings: string;
  company: string;
  categories: string;
  activities: string;
  customizableFinancial: string;
  premiumExperience: string;
  selectLanguage: string;
  selectCurrency: string;
  currentLanguage: string;
  currentCurrency: string;
  loading: string;
  success: string;
  error: string;
  privateByCompany: string;
  flexibleStructure: string;
  mobileExperience: string;
  openNomenclatures: string;
};

export const AURORA_TEXTS: Record<AuroraLocale, TranslationTree> = {
  "pt-BR": {
    appName: "Aurora",
    betaLabel: "Aurora em evolução",
    systemNotice:
      "Sistema em constante atualização. Pode haver momentos de instabilidade durante melhorias e novas liberações.",
    language: "Idioma",
    currency: "Moeda",
    save: "Salvar",
    cancel: "Cancelar",
    edit: "Editar",
    delete: "Excluir",
    back: "Voltar",
    continue: "Continuar",
    home: "Home",
    chat: "Chat",
    plans: "Planos",
    explore: "Explorar",
    finance: "Financeiro",
    agribusiness: "AGRO",
    realEstate: "Imóveis",
    register: "Cadastrar",
    login: "Entrar",
    businessDashboard: "Painel empresarial",
    internalModules: "Módulos internos",
    globalRegistration: "Cadastro global",
    privateArea: "Área privada",
    reports: "Relatórios",
    settings: "Configurações",
    company: "Empresa",
    categories: "Categorias",
    activities: "Atividades",
    customizableFinancial: "Financeiro editável",
    premiumExperience: "Experiência premium",
    selectLanguage: "Selecionar idioma",
    selectCurrency: "Selecionar moeda",
    currentLanguage: "Idioma atual",
    currentCurrency: "Moeda atual",
    loading: "Carregando",
    success: "Sucesso",
    error: "Erro",
    privateByCompany: "Privado por empresa",
    flexibleStructure: "Estrutura flexível",
    mobileExperience: "Experiência mobile forte",
    openNomenclatures: "Nomenclaturas abertas",
  },
  "en-US": {
    appName: "Aurora",
    betaLabel: "Aurora evolving",
    systemNotice:
      "System under constant updates. There may be moments of instability during improvements and new feature releases.",
    language: "Language",
    currency: "Currency",
    save: "Save",
    cancel: "Cancel",
    edit: "Edit",
    delete: "Delete",
    back: "Back",
    continue: "Continue",
    home: "Home",
    chat: "Chat",
    plans: "Plans",
    explore: "Explore",
    finance: "Finance",
    agribusiness: "AGRO",
    realEstate: "Real Estate",
    register: "Register",
    login: "Login",
    businessDashboard: "Business dashboard",
    internalModules: "Internal modules",
    globalRegistration: "Global registration",
    privateArea: "Private area",
    reports: "Reports",
    settings: "Settings",
    company: "Company",
    categories: "Categories",
    activities: "Activities",
    customizableFinancial: "Editable finance",
    premiumExperience: "Premium experience",
    selectLanguage: "Select language",
    selectCurrency: "Select currency",
    currentLanguage: "Current language",
    currentCurrency: "Current currency",
    loading: "Loading",
    success: "Success",
    error: "Error",
    privateByCompany: "Private by company",
    flexibleStructure: "Flexible structure",
    mobileExperience: "Strong mobile experience",
    openNomenclatures: "Open nomenclatures",
  },
  "es-ES": {
    appName: "Aurora",
    betaLabel: "Aurora en evolución",
    systemNotice:
      "Sistema en actualización constante. Puede haber momentos de inestabilidad durante mejoras y nuevas liberaciones.",
    language: "Idioma",
    currency: "Moneda",
    save: "Guardar",
    cancel: "Cancelar",
    edit: "Editar",
    delete: "Eliminar",
    back: "Volver",
    continue: "Continuar",
    home: "Inicio",
    chat: "Chat",
    plans: "Planes",
    explore: "Explorar",
    finance: "Finanzas",
    agribusiness: "AGRO",
    realEstate: "Inmuebles",
    register: "Registrar",
    login: "Entrar",
    businessDashboard: "Panel empresarial",
    internalModules: "Módulos internos",
    globalRegistration: "Registro global",
    privateArea: "Área privada",
    reports: "Informes",
    settings: "Configuraciones",
    company: "Empresa",
    categories: "Categorías",
    activities: "Actividades",
    customizableFinancial: "Finanzas editables",
    premiumExperience: "Experiencia premium",
    selectLanguage: "Seleccionar idioma",
    selectCurrency: "Seleccionar moneda",
    currentLanguage: "Idioma actual",
    currentCurrency: "Moneda actual",
    loading: "Cargando",
    success: "Éxito",
    error: "Error",
    privateByCompany: "Privado por empresa",
    flexibleStructure: "Estructura flexible",
    mobileExperience: "Experiencia móvil fuerte",
    openNomenclatures: "Nomenclaturas abiertas",
  },
};

export function isAuroraLocale(value: string | null | undefined): value is AuroraLocale {
  return value === "pt-BR" || value === "en-US" || value === "es-ES";
}

export function isAuroraCurrency(value: string | null | undefined): value is AuroraCurrency {
  return AURORA_CURRENCIES.some((item) => item.code === value);
}

export function getDefaultLocale(): AuroraLocale {
  return "pt-BR";
}

export function getDefaultCurrency(): AuroraCurrency {
  return "BRL";
}

export function getAuroraTexts(locale?: string | null): TranslationTree {
  if (isAuroraLocale(locale)) {
    return AURORA_TEXTS[locale];
  }
  return AURORA_TEXTS[getDefaultLocale()];
}

export function getAuroraLanguageOptions(): AuroraLanguageOption[] {
  return AURORA_LANGUAGES;
}

export function getAuroraCurrencyOptions(): AuroraCurrencyOption[] {
  return AURORA_CURRENCIES;
}

export function getCurrencyOption(
  currency?: string | null,
): AuroraCurrencyOption {
  const found = AURORA_CURRENCIES.find((item) => item.code === currency);
  return found ?? AURORA_CURRENCIES[0];
}

export function formatAuroraMoney(params: {
  amount: number;
  currency?: string | null;
  locale?: string | null;
}): string {
  const safeAmount = Number.isFinite(params.amount) ? params.amount : 0;
  const currencyOption = getCurrencyOption(params.currency);
  const safeLocale = isAuroraLocale(params.locale)
    ? params.locale
    : currencyOption.locale;

  return new Intl.NumberFormat(safeLocale, {
    style: "currency",
    currency: currencyOption.code,
    maximumFractionDigits: 2,
  }).format(safeAmount);
}

export function normalizeAuroraLocale(locale?: string | null): AuroraLocale {
  if (isAuroraLocale(locale)) {
    return locale;
  }
  return getDefaultLocale();
}

export function normalizeAuroraCurrency(currency?: string | null): AuroraCurrency {
  if (isAuroraCurrency(currency)) {
    return currency;
  }
  return getDefaultCurrency();
}