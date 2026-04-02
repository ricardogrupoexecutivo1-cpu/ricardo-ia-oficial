"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  AURORA_CURRENCIES,
  AURORA_LANGUAGES,
  AuroraCurrency,
  AuroraLocale,
  getAuroraTexts,
  getCurrencyOption,
  getDefaultCurrency,
  getDefaultLocale,
  isAuroraCurrency,
  isAuroraLocale,
  normalizeAuroraCurrency,
  normalizeAuroraLocale,
} from "@/lib/aurora-global";

const STORAGE_KEYS = {
  locale: "aurora.locale",
  currency: "aurora.currency",
} as const;

type AuroraGlobalContextValue = {
  locale: AuroraLocale;
  currency: AuroraCurrency;
  texts: ReturnType<typeof getAuroraTexts>;
  languages: typeof AURORA_LANGUAGES;
  currencies: typeof AURORA_CURRENCIES;
  hydrated: boolean;
  setLocale: (locale: AuroraLocale) => void;
  setCurrency: (currency: AuroraCurrency) => void;
  applyLocale: (locale: string) => void;
  applyCurrency: (currency: string) => void;
  resetGlobalPreferences: () => void;
  currencySymbol: string;
  currencyLabel: string;
};

const AuroraGlobalContext = createContext<AuroraGlobalContextValue | null>(null);

type AuroraGlobalProviderProps = {
  children: React.ReactNode;
  initialLocale?: string | null;
  initialCurrency?: string | null;
};

function buildFallbackContext(): AuroraGlobalContextValue {
  const locale = getDefaultLocale();
  const currency = getDefaultCurrency();
  const texts = getAuroraTexts(locale);
  const currencyOption = getCurrencyOption(currency);

  return {
    locale,
    currency,
    texts,
    languages: AURORA_LANGUAGES,
    currencies: AURORA_CURRENCIES,
    hydrated: false,
    setLocale: () => {},
    setCurrency: () => {},
    applyLocale: () => {},
    applyCurrency: () => {},
    resetGlobalPreferences: () => {},
    currencySymbol: currencyOption.symbol,
    currencyLabel: currencyOption.label,
  };
}

export function AuroraGlobalProvider({
  children,
  initialLocale,
  initialCurrency,
}: AuroraGlobalProviderProps) {
  const [locale, setLocaleState] = useState<AuroraLocale>(() =>
    normalizeAuroraLocale(initialLocale)
  );

  const [currency, setCurrencyState] = useState<AuroraCurrency>(() =>
    normalizeAuroraCurrency(initialCurrency)
  );

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const browserLocale =
      typeof window !== "undefined"
        ? window.localStorage.getItem(STORAGE_KEYS.locale)
        : null;

    const browserCurrency =
      typeof window !== "undefined"
        ? window.localStorage.getItem(STORAGE_KEYS.currency)
        : null;

    const normalizedLocale = isAuroraLocale(browserLocale)
      ? browserLocale
      : normalizeAuroraLocale(initialLocale);

    const normalizedCurrency = isAuroraCurrency(browserCurrency)
      ? browserCurrency
      : normalizeAuroraCurrency(initialCurrency);

    setLocaleState(normalizedLocale);
    setCurrencyState(normalizedCurrency);
    setHydrated(true);
  }, [initialCurrency, initialLocale]);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(STORAGE_KEYS.locale, locale);
    document.documentElement.lang = locale;
  }, [hydrated, locale]);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(STORAGE_KEYS.currency, currency);
  }, [hydrated, currency]);

  const setLocale = useCallback((nextLocale: AuroraLocale) => {
    setLocaleState(nextLocale);
  }, []);

  const setCurrency = useCallback((nextCurrency: AuroraCurrency) => {
    setCurrencyState(nextCurrency);
  }, []);

  const applyLocale = useCallback((nextLocale: string) => {
    if (!isAuroraLocale(nextLocale)) {
      return;
    }

    setLocaleState(nextLocale);
  }, []);

  const applyCurrency = useCallback((nextCurrency: string) => {
    if (!isAuroraCurrency(nextCurrency)) {
      return;
    }

    setCurrencyState(nextCurrency);
  }, []);

  const resetGlobalPreferences = useCallback(() => {
    const defaultLocale = getDefaultLocale();
    const defaultCurrency = getDefaultCurrency();

    setLocaleState(defaultLocale);
    setCurrencyState(defaultCurrency);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEYS.locale, defaultLocale);
      window.localStorage.setItem(STORAGE_KEYS.currency, defaultCurrency);
    }
  }, []);

  const texts = useMemo(() => getAuroraTexts(locale), [locale]);
  const currencyOption = useMemo(() => getCurrencyOption(currency), [currency]);

  const value = useMemo<AuroraGlobalContextValue>(
    () => ({
      locale,
      currency,
      texts,
      languages: AURORA_LANGUAGES,
      currencies: AURORA_CURRENCIES,
      hydrated,
      setLocale,
      setCurrency,
      applyLocale,
      applyCurrency,
      resetGlobalPreferences,
      currencySymbol: currencyOption.symbol,
      currencyLabel: currencyOption.label,
    }),
    [
      locale,
      currency,
      texts,
      hydrated,
      setLocale,
      setCurrency,
      applyLocale,
      applyCurrency,
      resetGlobalPreferences,
      currencyOption.symbol,
      currencyOption.label,
    ]
  );

  return (
    <AuroraGlobalContext.Provider value={value}>
      {children}
    </AuroraGlobalContext.Provider>
  );
}

export function useAuroraGlobal() {
  const context = useContext(AuroraGlobalContext);

  if (!context) {
    return buildFallbackContext();
  }

  return context;
}

export function useAuroraTexts() {
  return useAuroraGlobal().texts;
}

export function useAuroraLocale() {
  const { locale, setLocale, applyLocale, languages } = useAuroraGlobal();

  return {
    locale,
    setLocale,
    applyLocale,
    languages,
  };
}

export function useAuroraCurrency() {
  const {
    currency,
    setCurrency,
    applyCurrency,
    currencies,
    currencyLabel,
    currencySymbol,
  } = useAuroraGlobal();

  return {
    currency,
    setCurrency,
    applyCurrency,
    currencies,
    currencyLabel,
    currencySymbol,
  };
}