"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

type CoverageType =
  | "brasil"
  | "estadual"
  | "regional"
  | "municipal"
  | "multilocal";

type AttendanceType = "todos" | "especificos";

type FormState = {
  nomeResponsavel: string;
  nomeEmpresa: string;
  whatsapp: string;
  email: string;
  site: string;
  instagram: string;
  perfisSelecionados: string[];
  coverageType: CoverageType;
  estadoBase: string;
  regiaoBase: string;
  cidadeBase: string;
  observacaoCobertura: string;
  atendimentoTipo: AttendanceType;
  descricao: string;
  segmentos: string[];
  produtos: string[];
  segmentosEspecificos: string[];
  nomePublico: string;
  descricaoPublicaCurta: string;
  cidadePublica: string;
  estadoPublico: string;
  mostrarNomePublico: boolean;
  mostrarDescricaoPublica: boolean;
  mostrarCidadePublica: boolean;
  mostrarEstadoPublico: boolean;
  mostrarSegmentosPublicos: boolean;
  mostrarProdutosPublicos: boolean;
};

type AuthDebugState = {
  storageKeys: string[];
  storageTokenKey: string;
  storageTokenPreview: string;
  sessionFound: boolean;
  sessionEmail: string;
  sessionUserId: string;
};

type FetchJsonResult = {
  ok: boolean;
  status: number;
  data: any;
  rawText: string;
};

const STORAGE_KEY = "aurora_cadastro_geral_rascunho_v4";
const REQUEST_TIMEOUT_MS = 45000;
const LOAD_UI_FAILSAFE_MS = 50000;
const SAVE_UI_FAILSAFE_MS = 50000;

const PERFIS_SUGERIDOS = [
  "Empresa",
  "Profissional",
  "Fornecedor",
  "Prestador de serviço",
  "Comprador",
  "Parceiro",
  "Operação",
];

const SEGMENTOS_SUGERIDOS = [
  "Locadoras",
  "Imóveis",
  "Bancos",
  "AGRO",
  "Mineração",
  "Financeiro",
  "Tecnologia",
  "Transporte",
  "Indústria",
  "Comércio",
  "Serviços",
];

const PRODUTOS_SUGERIDOS = [
  "Consultoria",
  "Locação",
  "Venda",
  "Financiamento",
  "Seguro",
  "Transporte",
  "Manutenção",
  "Marketing",
  "Software",
  "Treinamento",
];

const ESTADOS_BR = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
];

const INITIAL_FORM: FormState = {
  nomeResponsavel: "",
  nomeEmpresa: "",
  whatsapp: "",
  email: "",
  site: "",
  instagram: "",
  perfisSelecionados: [],
  coverageType: "brasil",
  estadoBase: "",
  regiaoBase: "",
  cidadeBase: "",
  observacaoCobertura: "",
  atendimentoTipo: "todos",
  descricao: "",
  segmentos: [],
  produtos: [],
  segmentosEspecificos: [],
  nomePublico: "",
  descricaoPublicaCurta: "",
  cidadePublica: "",
  estadoPublico: "",
  mostrarNomePublico: true,
  mostrarDescricaoPublica: true,
  mostrarCidadePublica: true,
  mostrarEstadoPublico: true,
  mostrarSegmentosPublicos: true,
  mostrarProdutosPublicos: true,
};

function normalizeText(value: string) {
  return value.trim();
}

function parseCsvInput(value: string) {
  return Array.from(
    new Set(
      value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    )
  );
}

function toCsv(items: string[]) {
  return items.join(", ");
}

function pickString(obj: any, ...keys: string[]) {
  for (const key of keys) {
    const value = obj?.[key];
    if (typeof value === "string") return value;
  }
  return "";
}

function pickBoolean(obj: any, key: string, fallback: boolean) {
  const value = obj?.[key];
  return typeof value === "boolean" ? value : fallback;
}

function pickArray(obj: any, key: string) {
  const value = obj?.[key];
  if (!Array.isArray(value)) return [];
  return value.filter((item) => typeof item === "string");
}

function normalizeCoverageType(value: string): CoverageType {
  const raw = String(value || "")
    .trim()
    .toLowerCase();

  if (
    raw === "estadual" ||
    raw === "regional" ||
    raw === "municipal" ||
    raw === "multilocal"
  ) {
    return raw;
  }

  return "brasil";
}

function normalizeAttendanceType(value: string): AttendanceType {
  return value === "especificos" ? "especificos" : "todos";
}

function mapCadastroToForm(cadastro: any): FormState {
  return {
    nomeResponsavel: pickString(cadastro, "nomeResponsavel", "nome_responsavel"),
    nomeEmpresa: pickString(cadastro, "nomeEmpresa", "nome_empresa"),
    whatsapp: pickString(cadastro, "whatsapp"),
    email: pickString(cadastro, "email"),
    site: pickString(cadastro, "site"),
    instagram: pickString(cadastro, "instagram"),
    perfisSelecionados:
      pickArray(cadastro, "perfisSelecionados").length > 0
        ? pickArray(cadastro, "perfisSelecionados")
        : [
            ...(cadastro?.perfil_empresa ? ["Empresa"] : []),
            ...(cadastro?.perfil_profissional ? ["Profissional"] : []),
            ...(cadastro?.perfil_fornecedor ? ["Fornecedor"] : []),
            ...(cadastro?.perfil_prestador ? ["Prestador de serviço"] : []),
            ...(cadastro?.perfil_comprador ? ["Comprador"] : []),
            ...(cadastro?.perfil_parceiro ? ["Parceiro"] : []),
            ...(cadastro?.perfil_operacao ? ["Operação"] : []),
          ],
    coverageType: normalizeCoverageType(
      pickString(cadastro, "coverageType", "coverage_type", "tipo_cobertura")
    ),
    estadoBase: pickString(cadastro, "estadoBase", "estado_base"),
    regiaoBase: pickString(cadastro, "regiaoBase", "regiao_base"),
    cidadeBase: pickString(cadastro, "cidadeBase", "cidade_base"),
    observacaoCobertura: pickString(
      cadastro,
      "observacaoCobertura",
      "observacao_cobertura"
    ),
    atendimentoTipo: normalizeAttendanceType(
      pickString(
        cadastro,
        "atendimentoTipo",
        "atendimento_tipo",
        "tipo_atendimento"
      )
    ),
    descricao: pickString(
      cadastro,
      "descricao",
      "descricao_principal",
      "descricao_publica_interna"
    ),
    segmentos:
      pickArray(cadastro, "segmentos").length > 0
        ? pickArray(cadastro, "segmentos")
        : pickArray(cadastro, "segmentos_extras"),
    produtos:
      pickArray(cadastro, "produtos").length > 0
        ? pickArray(cadastro, "produtos")
        : pickArray(cadastro, "produtos_servicos"),
    segmentosEspecificos:
      pickArray(cadastro, "segmentosEspecificos").length > 0
        ? pickArray(cadastro, "segmentosEspecificos")
        : pickArray(cadastro, "segmentos_especificos"),
    nomePublico: pickString(cadastro, "nomePublico", "nome_publico"),
    descricaoPublicaCurta: pickString(
      cadastro,
      "descricaoPublicaCurta",
      "descricao_publica_curta"
    ),
    cidadePublica: pickString(cadastro, "cidadePublica", "cidade_publica"),
    estadoPublico: pickString(cadastro, "estadoPublico", "estado_publico"),
    mostrarNomePublico: pickBoolean(cadastro, "mostrar_nome_publico", true),
    mostrarDescricaoPublica: pickBoolean(
      cadastro,
      "mostrar_descricao_publica",
      true
    ),
    mostrarCidadePublica: pickBoolean(cadastro, "mostrar_cidade_publica", true),
    mostrarEstadoPublico: pickBoolean(cadastro, "mostrar_estado_publico", true),
    mostrarSegmentosPublicos: pickBoolean(
      cadastro,
      "mostrar_segmentos_publicos",
      true
    ),
    mostrarProdutosPublicos: pickBoolean(
      cadastro,
      "mostrar_produtos_publicos",
      true
    ),
  };
}

function mergeWithInitial(partial?: Partial<FormState> | null): FormState {
  return {
    ...INITIAL_FORM,
    ...(partial || {}),
    perfisSelecionados: partial?.perfisSelecionados || [],
    segmentos: partial?.segmentos || [],
    produtos: partial?.produtos || [],
    segmentosEspecificos: partial?.segmentosEspecificos || [],
  };
}

function getAuthDebugFromStorage(session: Session | null): AuthDebugState {
  if (typeof window === "undefined") {
    return {
      storageKeys: [],
      storageTokenKey: "",
      storageTokenPreview: "",
      sessionFound: !!session,
      sessionEmail: session?.user?.email || "",
      sessionUserId: session?.user?.id || "",
    };
  }

  const allKeys = [
    ...Object.keys(localStorage),
    ...Object.keys(sessionStorage),
  ];

  const tokenKeys = allKeys.filter(
    (key) =>
      key.includes("supabase") ||
      key.includes("sb-") ||
      key.toLowerCase().includes("auth-token")
  );

  let storageTokenKey = "";
  let storageTokenPreview = "";

  for (const key of tokenKeys) {
    const raw =
      localStorage.getItem(key) ||
      sessionStorage.getItem(key) ||
      "";

    if (!raw) continue;

    storageTokenKey = key;
    storageTokenPreview = raw.length > 140 ? `${raw.slice(0, 140)}...` : raw;
    break;
  }

  return {
    storageKeys: tokenKeys,
    storageTokenKey,
    storageTokenPreview,
    sessionFound: !!session,
    sessionEmail: session?.user?.email || "",
    sessionUserId: session?.user?.id || "",
  };
}

function getTimeoutErrorMessage() {
  return "A requisição demorou demais para responder. O cadastro pode até ter sido salvo no banco, mas a resposta da API não voltou a tempo. Confira no Guardião antes de tentar salvar novamente.";
}

async function fetchJsonWithTimeout(
  input: RequestInfo | URL,
  init?: RequestInit,
  timeoutMs = REQUEST_TIMEOUT_MS
): Promise<FetchJsonResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(input, {
      ...init,
      signal: controller.signal,
    });

    const rawText = await response.text();
    let data: any = null;

    if (rawText) {
      try {
        data = JSON.parse(rawText);
      } catch {
        data = { rawText };
      }
    }

    return {
      ok: response.ok,
      status: response.status,
      data,
      rawText,
    };
  } catch (error: any) {
    if (error?.name === "AbortError") {
      throw new Error(getTimeoutErrorMessage());
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

export default function CadastroGeralPage() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [loadingCadastro, setLoadingCadastro] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info">(
    "info"
  );
  const [sessionEmail, setSessionEmail] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [lastAuthCheck, setLastAuthCheck] = useState("");
  const [sessionUserId, setSessionUserId] = useState("");
  const [authDebug, setAuthDebug] = useState<AuthDebugState>({
    storageKeys: [],
    storageTokenKey: "",
    storageTokenPreview: "",
    sessionFound: false,
    sessionEmail: "",
    sessionUserId: "",
  });

  const authChangeBooted = useRef(false);
  const submitLockRef = useRef(false);
  const loadLockRef = useRef(false);
  const mountedRef = useRef(true);
  const currentLoadIdRef = useRef(0);
  const currentSaveIdRef = useRef(0);
  const loadFailsafeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveFailsafeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const progresso = useMemo(() => {
    const checks = [
      !!form.nomeResponsavel,
      !!form.nomeEmpresa,
      !!form.whatsapp,
      !!form.email,
      !!form.cidadeBase,
      !!form.estadoBase,
      !!form.regiaoBase,
      !!form.descricao,
      !!form.nomePublico,
      !!form.descricaoPublicaCurta,
      !!form.cidadePublica,
      !!form.estadoPublico,
    ];

    const total = checks.length;
    const done = checks.filter(Boolean).length;
    return Math.round((done / total) * 100);
  }, [form]);

  function clearLoadFailsafe() {
    if (loadFailsafeTimerRef.current) {
      clearTimeout(loadFailsafeTimerRef.current);
      loadFailsafeTimerRef.current = null;
    }
  }

  function clearSaveFailsafe() {
    if (saveFailsafeTimerRef.current) {
      clearTimeout(saveFailsafeTimerRef.current);
      saveFailsafeTimerRef.current = null;
    }
  }

  function startLoadFailsafe(loadId: number) {
    clearLoadFailsafe();

    loadFailsafeTimerRef.current = setTimeout(() => {
      if (!mountedRef.current) return;
      if (currentLoadIdRef.current !== loadId) return;

      loadLockRef.current = false;
      setLoadingCadastro(false);
      setMessage(
        "A recarga está demorando mais do que o normal. Aguarde a resposta final da API. O sistema está em constante atualização e pode haver momentos de instabilidade."
      );
      setMessageType("info");
    }, LOAD_UI_FAILSAFE_MS);
  }

  function startSaveFailsafe(saveId: number) {
    clearSaveFailsafe();

    saveFailsafeTimerRef.current = setTimeout(() => {
      if (!mountedRef.current) return;
      if (currentSaveIdRef.current !== saveId) return;

      setMessage(
        "O salvamento está demorando mais do que o normal. Aguarde a resposta final da API. O sistema está em constante atualização e pode haver momentos de instabilidade."
      );
      setMessageType("info");
    }, SAVE_UI_FAILSAFE_MS);
  }

  function saveDraft(nextForm: FormState) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextForm));
    } catch {}
  }

  function setField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      saveDraft(next);
      return next;
    });
  }

  function replaceForm(nextForm: FormState) {
    const merged = mergeWithInitial(nextForm);
    setForm(merged);
    saveDraft(merged);
  }

  function toggleInArray(
    field: "perfisSelecionados" | "segmentos" | "produtos",
    value: string
  ) {
    setForm((prev) => {
      const exists = prev[field].includes(value);
      const next = {
        ...prev,
        [field]: exists
          ? prev[field].filter((item) => item !== value)
          : [...prev[field], value],
      };
      saveDraft(next as FormState);
      return next as FormState;
    });
  }

  async function getAuthState() {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      throw new Error(`Falha ao obter sessão: ${sessionError.message}`);
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.warn("Aviso ao obter usuário autenticado:", userError.message);
    }

    const accessToken = session?.access_token || null;
    const email =
      session?.user?.email?.trim().toLowerCase() ||
      user?.email?.trim().toLowerCase() ||
      "";
    const userId = session?.user?.id || user?.id || "";

    return {
      accessToken,
      email,
      authenticated: !!accessToken,
      userId,
      session,
    };
  }

  async function refreshAuthStatus(options?: { preserveMessage?: boolean }) {
    try {
      const auth = await getAuthState();

      if (!mountedRef.current) return auth;

      setSessionEmail(auth.email);
      setIsAuthenticated(auth.authenticated);
      setSessionUserId(auth.userId);
      setLastAuthCheck(new Date().toLocaleString("pt-BR"));
      setAuthReady(true);
      setAuthDebug(getAuthDebugFromStorage(auth.session));

      if (auth.email && !form.email) {
        setForm((prev) => {
          const next = { ...prev, email: auth.email };
          saveDraft(next);
          return next;
        });
      }

      if (!options?.preserveMessage) {
        if (auth.authenticated) {
          setMessage(
            "Sessão ativa detectada. O próximo salvar já tenta amarrar o cadastro ao user_id."
          );
          setMessageType("success");
        } else {
          setMessage(
            "Sem sessão ativa no momento. Você ainda pode operar por fallback de e-mail."
          );
          setMessageType("info");
        }
      }

      return auth;
    } catch (error: any) {
      if (!mountedRef.current) {
        return {
          accessToken: null,
          email: "",
          authenticated: false,
          userId: "",
          session: null,
        };
      }

      setAuthReady(true);
      setIsAuthenticated(false);
      setSessionEmail("");
      setSessionUserId("");
      setLastAuthCheck(new Date().toLocaleString("pt-BR"));
      setAuthDebug(getAuthDebugFromStorage(null));

      if (!options?.preserveMessage) {
        setMessage(error?.message || "Erro ao validar autenticação.");
        setMessageType("error");
      }

      return {
        accessToken: null,
        email: "",
        authenticated: false,
        userId: "",
        session: null,
      };
    }
  }

  async function loadCadastro(options?: {
    preserveMessage?: boolean;
    force?: boolean;
  }) {
    if (loadLockRef.current && !options?.force) {
      return;
    }

    const loadId = Date.now();
    currentLoadIdRef.current = loadId;
    loadLockRef.current = true;

    try {
      if (mountedRef.current) {
        setLoadingCadastro(true);
      }

      startLoadFailsafe(loadId);

      if (!options?.preserveMessage && mountedRef.current) {
        setMessage("Carregando cadastro real...");
        setMessageType("info");
      }

      const auth = await refreshAuthStatus({ preserveMessage: true });
      const emailHint = normalizeText(form.email || auth.email).toLowerCase();

      if (!emailHint && !auth.accessToken) {
        if (!options?.preserveMessage && mountedRef.current) {
          setMessage(
            "Sem sessão ativa no momento. Preencha os campos e salvaremos por fallback controlado via e-mail."
          );
          setMessageType("info");
        }
        return;
      }

      const result = await fetchJsonWithTimeout(
        `/api/cadastro-geral${
          emailHint ? `?email=${encodeURIComponent(emailHint)}` : ""
        }`,
        {
          method: "GET",
          headers: {
            ...(auth.accessToken
              ? { Authorization: `Bearer ${auth.accessToken}` }
              : {}),
            ...(emailHint ? { "x-cadastro-email-hint": emailHint } : {}),
          },
          cache: "no-store",
        }
      );

      if (!result.ok) {
        throw new Error(result.data?.error || "Erro ao carregar cadastro.");
      }

      const cadastro = result.data?.cadastro;

      if (!cadastro) {
        if (!options?.preserveMessage && mountedRef.current) {
          setMessage(
            auth.authenticated
              ? "Nenhum cadastro anterior encontrado. Preencha e salve sua base real."
              : "Sem sessão ativa no momento. Preencha os campos e salvaremos por fallback controlado via e-mail."
          );
          setMessageType("info");
        }
        return;
      }

      if (mountedRef.current && currentLoadIdRef.current === loadId) {
        replaceForm(mapCadastroToForm(cadastro));
      }

      if (!options?.preserveMessage && mountedRef.current) {
        setMessage(
          auth.authenticated
            ? "Cadastro carregado com sucesso em modo logado."
            : "Cadastro localizado por fallback controlado."
        );
        setMessageType("success");
      }
    } catch (error: any) {
      console.error("ERRO AO CARREGAR CADASTRO GERAL:", error);

      if (mountedRef.current && currentLoadIdRef.current === loadId) {
        setMessage(error?.message || "Erro inesperado ao carregar cadastro.");
        setMessageType("error");
      }
    } finally {
      if (currentLoadIdRef.current === loadId) {
        clearLoadFailsafe();
        loadLockRef.current = false;

        if (mountedRef.current) {
          setLoadingCadastro(false);
        }
      }
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (submitLockRef.current || loading) {
      return;
    }

    const saveId = Date.now();
    currentSaveIdRef.current = saveId;
    submitLockRef.current = true;

    try {
      if (mountedRef.current) {
        setLoading(true);
        setMessage("Salvando cadastro real...");
        setMessageType("info");
      }

      startSaveFailsafe(saveId);

      const auth = await refreshAuthStatus({ preserveMessage: true });
      const finalEmail = normalizeText(form.email || auth.email).toLowerCase();

      if (!auth.accessToken && !finalEmail) {
        throw new Error(
          "Sem login ativo e sem e-mail preenchido. Informe o e-mail ou faça login antes de salvar."
        );
      }

      const payload = {
        nomeResponsavel: normalizeText(form.nomeResponsavel),
        nomeEmpresa: normalizeText(form.nomeEmpresa),
        whatsapp: normalizeText(form.whatsapp),
        email: finalEmail,
        site: normalizeText(form.site),
        instagram: normalizeText(form.instagram),
        perfisSelecionados: form.perfisSelecionados,
        coverageType: form.coverageType,
        estadoBase: normalizeText(form.estadoBase),
        regiaoBase: normalizeText(form.regiaoBase),
        cidadeBase: normalizeText(form.cidadeBase),
        observacaoCobertura: normalizeText(form.observacaoCobertura),
        atendimentoTipo: form.atendimentoTipo,
        descricao: normalizeText(form.descricao),
        segmentos: form.segmentos,
        produtos: form.produtos,
        segmentosEspecificos: form.segmentosEspecificos,
        nomePublico: normalizeText(form.nomePublico),
        descricaoPublicaCurta: normalizeText(form.descricaoPublicaCurta),
        cidadePublica: normalizeText(form.cidadePublica),
        estadoPublico: normalizeText(form.estadoPublico),
        mostrarNomePublico: form.mostrarNomePublico,
        mostrarDescricaoPublica: form.mostrarDescricaoPublica,
        mostrarCidadePublica: form.mostrarCidadePublica,
        mostrarEstadoPublico: form.mostrarEstadoPublico,
        mostrarSegmentosPublicos: form.mostrarSegmentosPublicos,
        mostrarProdutosPublicos: form.mostrarProdutosPublicos,
      };

      const result = await fetchJsonWithTimeout("/api/cadastro-geral", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(auth.accessToken
            ? { Authorization: `Bearer ${auth.accessToken}` }
            : {}),
          ...(finalEmail ? { "x-cadastro-email-hint": finalEmail } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!result.ok) {
        throw new Error(result.data?.error || "Erro ao salvar cadastro geral.");
      }

      if (result.data?.cadastro && mountedRef.current) {
        replaceForm(mapCadastroToForm(result.data.cadastro));
      }

      if (mountedRef.current && currentSaveIdRef.current === saveId) {
        setMessage(
          auth.authenticated
            ? `Cadastro salvo com sucesso em modo logado. Modo: ${
                result.data?.mode || "update"
              }. Se este e-mail já existia, o vínculo com user_id foi tentado automaticamente.`
            : `Cadastro salvo com sucesso por fallback de e-mail. Modo: ${
                result.data?.mode || "update"
              }.`
        );
        setMessageType("success");
      }
    } catch (error: any) {
      console.error("ERRO REAL CADASTRO GERAL:", error);

      const errorMessage =
        error?.message || "Erro inesperado ao salvar cadastro.";

      if (mountedRef.current && currentSaveIdRef.current === saveId) {
        setMessage(errorMessage);
        setMessageType("error");
      }
    } finally {
      if (currentSaveIdRef.current === saveId) {
        clearSaveFailsafe();
        submitLockRef.current = false;

        if (mountedRef.current) {
          setLoading(false);
        }
      }
    }
  }

  useEffect(() => {
    mountedRef.current = true;

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        replaceForm(mergeWithInitial(parsed));
      }
    } catch {}

    setDraftLoaded(true);

    return () => {
      mountedRef.current = false;
      clearLoadFailsafe();
      clearSaveFailsafe();
    };
  }, []);

  useEffect(() => {
    if (!draftLoaded) return;
    loadCadastro({ preserveMessage: true, force: true });
  }, [draftLoaded]);

  useEffect(() => {
    if (authChangeBooted.current) return;
    authChangeBooted.current = true;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async () => {
      if (submitLockRef.current || loadLockRef.current) return;
      await refreshAuthStatus({ preserveMessage: true });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <section style={styles.hero}>
          <div style={styles.heroTop}>
            <div>
              <div style={styles.badge}>Cadastro geral definitivo</div>
              <h1 style={styles.title}>Cadastro geral real da Aurora</h1>
              <p style={styles.subtitle}>
                Base principal de entrada da plataforma para empresas,
                profissionais, fornecedores, compradores, parceiros e operações.
                Sistema em constante atualização e pode haver momentos de
                instabilidade.
              </p>
            </div>

            <div style={styles.heroActions}>
              <a href="/" style={styles.linkButton}>
                Voltar à Home
              </a>
              <a href="/guardiao" style={styles.linkButtonSecondary}>
                Ir para o Guardião
              </a>
              <a href="/app-builder" style={styles.linkButtonSecondary}>
                Ir para App Builder
              </a>
            </div>
          </div>

          <div style={styles.progressWrap}>
            <div style={styles.progressHeader}>
              <span>Progresso do cadastro</span>
              <strong>{progresso}%</strong>
            </div>
            <div style={styles.progressBar}>
              <div
                style={{ ...styles.progressFill, width: `${progresso}%` }}
              />
            </div>
          </div>

          <div style={styles.infoGrid}>
            <div style={styles.infoCard}>
              <div style={styles.infoLabel}>Objetivo</div>
              <div style={styles.infoValue}>Base definitiva</div>
            </div>
            <div style={styles.infoCard}>
              <div style={styles.infoLabel}>Estratégia</div>
              <div style={styles.infoValue}>Multi-tenant real</div>
            </div>
            <div style={styles.infoCard}>
              <div style={styles.infoLabel}>Privacidade</div>
              <div style={styles.infoValue}>Camada pública segura</div>
            </div>
            <div style={styles.infoCard}>
              <div style={styles.infoLabel}>Autenticação</div>
              <div style={styles.infoValue}>
                {isAuthenticated ? "Logado" : "Fallback por e-mail"}
              </div>
            </div>
          </div>

          <div style={styles.authBox}>
            <div style={styles.authTitle}>Validação de autenticação</div>
            <div style={styles.authLine}>
              <strong>Status:</strong>{" "}
              {authReady
                ? isAuthenticated
                  ? "Sessão ativa"
                  : "Sem sessão ativa"
                : "Verificando..."}
            </div>
            <div style={styles.authLine}>
              <strong>E-mail da sessão:</strong>{" "}
              {sessionEmail || "não encontrado"}
            </div>
            <div style={styles.authLine}>
              <strong>User ID:</strong> {sessionUserId || "não encontrado"}
            </div>
            <div style={styles.authLine}>
              <strong>Última checagem:</strong>{" "}
              {lastAuthCheck || "ainda não validado"}
            </div>
            <div style={styles.authLine}>
              <strong>Chave auth no localStorage:</strong>{" "}
              {authDebug.storageTokenKey || "não encontrada"}
            </div>
            <div style={styles.authLine}>
              <strong>Quantidade de chaves auth detectadas:</strong>{" "}
              {authDebug.storageKeys.length}
            </div>
            <div style={styles.authPreview}>
              <strong>Prévia do token/storage:</strong>
              <div style={styles.codeBox}>
                {authDebug.storageTokenPreview ||
                  "nenhum token/localStorage de auth encontrado"}
              </div>
            </div>

            <div style={styles.authActions}>
              <button
                type="button"
                onClick={() => refreshAuthStatus()}
                style={styles.secondaryButton}
                disabled={loading || loadingCadastro}
              >
                Validar login agora
              </button>

              <button
                type="button"
                onClick={() => loadCadastro({ force: true })}
                style={styles.secondaryButton}
                disabled={loading || loadingCadastro}
                title="Recarrega do banco e pode substituir alterações não salvas"
              >
                {loadingCadastro ? "Recarregando..." : "Recarregar do banco"}
              </button>
            </div>
          </div>
        </section>

        <section
          style={{
            ...styles.messageBox,
            ...(messageType === "success"
              ? styles.messageSuccess
              : messageType === "error"
              ? styles.messageError
              : styles.messageInfo),
          }}
        >
          {message ||
            "Sistema em constante atualização e pode haver momentos de instabilidade."}
        </section>

        <form onSubmit={handleSubmit} style={styles.form}>
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>1. Identificação principal</h2>

            <div style={styles.grid2}>
              <Field
                label="Nome do responsável"
                value={form.nomeResponsavel}
                onChange={(value) => setField("nomeResponsavel", value)}
                placeholder="Ex.: Ricardo Leonardo Moreira"
              />
              <Field
                label="Nome da empresa ou marca"
                value={form.nomeEmpresa}
                onChange={(value) => setField("nomeEmpresa", value)}
                placeholder="Ex.: Aurora IA"
              />
              <Field
                label="WhatsApp"
                value={form.whatsapp}
                onChange={(value) => setField("whatsapp", value)}
                placeholder="Ex.: (31) 99999-9999"
              />
              <Field
                label="E-mail"
                value={form.email}
                onChange={(value) => setField("email", value)}
                placeholder="Ex.: contato@empresa.com"
                type="email"
              />
              <Field
                label="Site"
                value={form.site}
                onChange={(value) => setField("site", value)}
                placeholder="Ex.: https://ricardoiaoficial.com"
              />
              <Field
                label="Instagram"
                value={form.instagram}
                onChange={(value) => setField("instagram", value)}
                placeholder="Ex.: @auroraia"
              />
            </div>
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>2. Perfis e posicionamento</h2>
            <div style={styles.chipsWrap}>
              {PERFIS_SUGERIDOS.map((item) => {
                const active = form.perfisSelecionados.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleInArray("perfisSelecionados", item)}
                    style={{ ...styles.chip, ...(active ? styles.chipActive : {}) }}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>3. Cobertura e operação</h2>

            <div style={styles.grid2}>
              <SelectField
                label="Tipo de cobertura"
                value={form.coverageType}
                onChange={(value) =>
                  setField("coverageType", value as CoverageType)
                }
                options={[
                  { value: "brasil", label: "Brasil" },
                  { value: "estadual", label: "Estadual" },
                  { value: "regional", label: "Regional" },
                  { value: "municipal", label: "Municipal" },
                  { value: "multilocal", label: "Multilocal" },
                ]}
              />
              <SelectField
                label="Estado base"
                value={form.estadoBase}
                onChange={(value) => setField("estadoBase", value)}
                options={[
                  { value: "", label: "Selecione" },
                  ...ESTADOS_BR.map((uf) => ({ value: uf, label: uf })),
                ]}
              />
              <Field
                label="Região base"
                value={form.regiaoBase}
                onChange={(value) => setField("regiaoBase", value)}
                placeholder="Ex.: Metropolitana de BH"
              />
              <Field
                label="Cidade base"
                value={form.cidadeBase}
                onChange={(value) => setField("cidadeBase", value)}
                placeholder="Ex.: Vespasiano"
              />
              <SelectField
                label="Tipo de atendimento"
                value={form.atendimentoTipo}
                onChange={(value) =>
                  setField("atendimentoTipo", value as AttendanceType)
                }
                options={[
                  { value: "todos", label: "Todos os segmentos" },
                  { value: "especificos", label: "Somente segmentos específicos" },
                ]}
              />
            </div>

            <TextAreaField
              label="Observação de cobertura"
              value={form.observacaoCobertura}
              onChange={(value) => setField("observacaoCobertura", value)}
              placeholder="Explique raio, cidades, regiões ou observações da operação."
              rows={3}
            />

            {form.atendimentoTipo === "especificos" && (
              <TextAreaField
                label="Segmentos específicos atendidos"
                value={toCsv(form.segmentosEspecificos)}
                onChange={(value) =>
                  setField("segmentosEspecificos", parseCsvInput(value))
                }
                placeholder="Ex.: locadoras, mineração, fornecedores"
                rows={3}
              />
            )}
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>4. Segmentos e produtos/serviços</h2>

            <div style={styles.blockLabel}>Segmentos</div>
            <div style={styles.chipsWrap}>
              {SEGMENTOS_SUGERIDOS.map((item) => {
                const active = form.segmentos.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleInArray("segmentos", item)}
                    style={{ ...styles.chip, ...(active ? styles.chipActive : {}) }}
                  >
                    {item}
                  </button>
                );
              })}
            </div>

            <TextAreaField
              label="Adicionar segmentos extras"
              value={toCsv(form.segmentos)}
              onChange={(value) => setField("segmentos", parseCsvInput(value))}
              placeholder="Ex.: Agro, tecnologia, bancos, serviços..."
              rows={3}
            />

            <div style={{ ...styles.blockLabel, marginTop: 18 }}>
              Produtos e serviços
            </div>
            <div style={styles.chipsWrap}>
              {PRODUTOS_SUGERIDOS.map((item) => {
                const active = form.produtos.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleInArray("produtos", item)}
                    style={{ ...styles.chip, ...(active ? styles.chipActive : {}) }}
                  >
                    {item}
                  </button>
                );
              })}
            </div>

            <TextAreaField
              label="Adicionar produtos/serviços extras"
              value={toCsv(form.produtos)}
              onChange={(value) => setField("produtos", parseCsvInput(value))}
              placeholder="Ex.: consultoria, intermediação, software, seguros..."
              rows={3}
            />
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>5. Descrição estratégica</h2>
            <TextAreaField
              label="Descrição principal"
              value={form.descricao}
              onChange={(value) => setField("descricao", value)}
              placeholder="Descreva sua operação, proposta de valor e força comercial."
              rows={5}
            />
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>6. Camada pública segura</h2>

            <div style={styles.grid2}>
              <Field
                label="Nome público"
                value={form.nomePublico}
                onChange={(value) => setField("nomePublico", value)}
                placeholder="Ex.: Aurora IA"
              />
              <Field
                label="Cidade pública"
                value={form.cidadePublica}
                onChange={(value) => setField("cidadePublica", value)}
                placeholder="Ex.: Belo Horizonte"
              />
              <Field
                label="Estado público"
                value={form.estadoPublico}
                onChange={(value) => setField("estadoPublico", value)}
                placeholder="Ex.: MG"
              />
            </div>

            <TextAreaField
              label="Descrição pública curta"
              value={form.descricaoPublicaCurta}
              onChange={(value) => setField("descricaoPublicaCurta", value)}
              placeholder="Resumo público seguro para exibição."
              rows={3}
            />

            <div style={styles.checkboxGrid}>
              <CheckboxField
                label="Mostrar nome público"
                checked={form.mostrarNomePublico}
                onChange={(value) => setField("mostrarNomePublico", value)}
              />
              <CheckboxField
                label="Mostrar descrição pública"
                checked={form.mostrarDescricaoPublica}
                onChange={(value) => setField("mostrarDescricaoPublica", value)}
              />
              <CheckboxField
                label="Mostrar cidade pública"
                checked={form.mostrarCidadePublica}
                onChange={(value) => setField("mostrarCidadePublica", value)}
              />
              <CheckboxField
                label="Mostrar estado público"
                checked={form.mostrarEstadoPublico}
                onChange={(value) => setField("mostrarEstadoPublico", value)}
              />
              <CheckboxField
                label="Mostrar segmentos públicos"
                checked={form.mostrarSegmentosPublicos}
                onChange={(value) => setField("mostrarSegmentosPublicos", value)}
              />
              <CheckboxField
                label="Mostrar produtos públicos"
                checked={form.mostrarProdutosPublicos}
                onChange={(value) => setField("mostrarProdutosPublicos", value)}
              />
            </div>
          </section>

          <div style={styles.actions}>
            <button
              type="submit"
              style={styles.primaryButton}
              disabled={loading || loadingCadastro}
            >
              {loading ? "Salvando..." : "Salvar cadastro geral"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label style={styles.fieldWrap}>
      <span style={styles.label}>{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={styles.input}
      />
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <label style={styles.fieldWrap}>
      <span style={styles.label}>{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        style={styles.textarea}
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label style={styles.fieldWrap}>
      <span style={styles.label}>{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={styles.select}
      >
        {options.map((option) => (
          <option value={option.value} key={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function CheckboxField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label style={styles.checkboxItem}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>{label}</span>
    </label>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #f8fbff 0%, #eef5ff 100%)",
    padding: "24px 16px 64px",
    color: "#142033",
  },
  container: {
    maxWidth: 1180,
    margin: "0 auto",
  },
  hero: {
    background: "linear-gradient(135deg, #ffffff 0%, #f6fbff 100%)",
    border: "1px solid #d7e6f7",
    borderRadius: 28,
    padding: 28,
    boxShadow: "0 20px 60px rgba(19, 44, 74, 0.08)",
    marginBottom: 18,
  },
  heroTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: 18,
    flexWrap: "wrap",
    alignItems: "flex-start",
  },
  heroActions: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
  },
  badge: {
    display: "inline-flex",
    padding: "8px 12px",
    borderRadius: 999,
    background: "#e8f7ec",
    border: "1px solid #bfe7c8",
    color: "#18794e",
    fontWeight: 800,
    fontSize: 12,
    letterSpacing: 0.3,
    marginBottom: 14,
  },
  title: {
    fontSize: "clamp(30px, 5vw, 48px)",
    lineHeight: 1.04,
    margin: "0 0 12px",
    fontWeight: 900,
    color: "#0f1f35",
  },
  subtitle: {
    margin: 0,
    color: "#52637a",
    fontSize: 16,
    lineHeight: 1.7,
    maxWidth: 860,
  },
  authBox: {
    marginTop: 18,
    padding: 18,
    borderRadius: 20,
    background: "#ffffff",
    border: "1px solid #dde9f5",
    boxShadow: "0 10px 25px rgba(20, 32, 51, 0.04)",
  },
  authTitle: {
    fontWeight: 900,
    color: "#13263f",
    marginBottom: 10,
  },
  authLine: {
    color: "#27415d",
    marginBottom: 6,
    wordBreak: "break-word",
  },
  authPreview: {
    marginTop: 8,
  },
  codeBox: {
    marginTop: 6,
    padding: 12,
    borderRadius: 12,
    background: "#f8fbff",
    border: "1px solid #dde9f5",
    color: "#27415d",
    fontFamily: "monospace",
    fontSize: 12,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
  authActions: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    marginTop: 12,
  },
  linkButton: {
    textDecoration: "none",
    padding: "11px 15px",
    borderRadius: 14,
    background: "#0f6fff",
    color: "#ffffff",
    border: "1px solid #0f6fff",
    fontWeight: 800,
  },
  linkButtonSecondary: {
    textDecoration: "none",
    padding: "11px 15px",
    borderRadius: 14,
    background: "#ffffff",
    color: "#22415f",
    border: "1px solid #d6e4f2",
    fontWeight: 800,
  },
  progressWrap: {
    marginTop: 24,
  },
  progressHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 8,
    color: "#264766",
    fontWeight: 800,
  },
  progressBar: {
    height: 12,
    borderRadius: 999,
    background: "#e5eef8",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    background: "linear-gradient(90deg, #22c55e 0%, #0f6fff 100%)",
  },
  infoGrid: {
    marginTop: 22,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
    gap: 12,
  },
  infoCard: {
    padding: 18,
    borderRadius: 20,
    background: "#ffffff",
    border: "1px solid #dde9f5",
    boxShadow: "0 10px 25px rgba(20, 32, 51, 0.04)",
  },
  infoLabel: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: "#6c819a",
    marginBottom: 8,
    fontWeight: 800,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 900,
    color: "#13263f",
  },
  messageBox: {
    marginTop: 18,
    marginBottom: 18,
    borderRadius: 18,
    padding: "15px 16px",
    fontWeight: 800,
  },
  messageSuccess: {
    background: "#edf9f0",
    border: "1px solid #c8ead0",
    color: "#18794e",
  },
  messageError: {
    background: "#fff1f1",
    border: "1px solid #f3c6c6",
    color: "#b42318",
  },
  messageInfo: {
    background: "#eef6ff",
    border: "1px solid #cfe3fb",
    color: "#1e5fae",
  },
  form: {
    display: "grid",
    gap: 18,
  },
  section: {
    background: "#ffffff",
    border: "1px solid #dde9f5",
    borderRadius: 24,
    padding: 24,
    boxShadow: "0 14px 34px rgba(19, 44, 74, 0.05)",
  },
  sectionTitle: {
    margin: "0 0 16px",
    fontSize: 22,
    fontWeight: 900,
    color: "#13263f",
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 14,
  },
  fieldWrap: {
    display: "grid",
    gap: 8,
  },
  label: {
    color: "#27415d",
    fontWeight: 800,
    fontSize: 14,
  },
  input: {
    width: "100%",
    minHeight: 50,
    borderRadius: 16,
    border: "1px solid #d8e5f1",
    background: "#fbfdff",
    color: "#142033",
    padding: "12px 14px",
    outline: "none",
  },
  textarea: {
    width: "100%",
    borderRadius: 16,
    border: "1px solid #d8e5f1",
    background: "#fbfdff",
    color: "#142033",
    padding: "12px 14px",
    outline: "none",
    resize: "vertical",
  },
  select: {
    width: "100%",
    minHeight: 50,
    borderRadius: 16,
    border: "1px solid #d8e5f1",
    background: "#fbfdff",
    color: "#142033",
    padding: "12px 14px",
    outline: "none",
  },
  chipsWrap: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
  },
  chip: {
    borderRadius: 999,
    border: "1px solid #d6e4f2",
    background: "#f8fbff",
    color: "#27415d",
    padding: "10px 14px",
    fontWeight: 800,
    cursor: "pointer",
  },
  chipActive: {
    background: "#eaf3ff",
    border: "1px solid #b8d4fb",
    color: "#0f6fff",
  },
  blockLabel: {
    fontWeight: 800,
    marginBottom: 10,
    color: "#27415d",
  },
  checkboxGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 12,
    marginTop: 14,
  },
  checkboxItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "12px 14px",
    borderRadius: 16,
    border: "1px solid #dde9f5",
    background: "#fbfdff",
    color: "#27415d",
    fontWeight: 700,
  },
  actions: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },
  primaryButton: {
    border: 0,
    borderRadius: 16,
    padding: "14px 20px",
    fontWeight: 900,
    cursor: "pointer",
    background: "linear-gradient(90deg, #0f6fff 0%, #22c55e 100%)",
    color: "#ffffff",
  },
  secondaryButton: {
    borderRadius: 16,
    padding: "14px 20px",
    fontWeight: 900,
    cursor: "pointer",
    background: "#ffffff",
    color: "#22415f",
    border: "1px solid #d6e4f2",
  },
};