"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AuroraGlobalBar from "@/components/aurora-global-bar";
import { useAuroraGlobal } from "@/components/aurora-global-provider";
import { formatAuroraMoney } from "@/lib/aurora-global";

type FinanceEntryType = "income" | "expense";
type FinanceDocumentType =
  | "invoice"
  | "receipt"
  | "service_order"
  | "contract"
  | "internal_note"
  | "other";

type FinanceEntryStatus =
  | "open"
  | "pending"
  | "approved"
  | "received"
  | "paid"
  | "cancelled";

type FinanceCategoryRow = {
  id: string;
  company_id: string;
  name: string;
  description: string | null;
  color: string | null;
  icon: string | null;
  is_active: boolean;
};

type FinanceActivityRow = {
  id: string;
  company_id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  is_active: boolean;
};

type FinanceCostCenterRow = {
  id: string;
  company_id: string;
  name: string;
  description: string | null;
  code: string | null;
  is_active: boolean;
};

type FinanceAccountRow = {
  id: string;
  company_id: string;
  name: string;
  description: string | null;
  account_type: string;
  currency_code: string;
  opening_balance: number;
  current_balance: number;
  is_active: boolean;
};

type FinanceCompanySettingsRow = {
  id: string;
  company_id: string;
  default_currency: string;
  default_locale: string;
  fiscal_document_label: string | null;
  income_label: string;
  expense_label: string;
  category_label: string;
  activity_label: string;
  cost_center_label: string;
  account_label: string;
  allow_custom_categories: boolean;
  allow_custom_activities: boolean;
  allow_custom_cost_centers: boolean;
};

type FinanceEntryViewRow = {
  id: string;
  company_id: string;
  account_id: string | null;
  category_id: string | null;
  activity_id: string | null;
  cost_center_id: string | null;
  entry_type: FinanceEntryType;
  title: string;
  description: string | null;
  document_type: FinanceDocumentType;
  document_number: string | null;
  amount: number;
  currency_code: string;
  status: FinanceEntryStatus;
  payment_method: string | null;
  issue_date: string | null;
  due_date: string | null;
  settlement_date: string | null;
  competence_date: string | null;
  company_unit: string | null;
  vendor_name: string | null;
  customer_name: string | null;
  tags: string[];
  metadata: Record<string, unknown>;
  account_name: string | null;
  category_name: string | null;
  activity_name: string | null;
  cost_center_name: string | null;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
};

type FinanceDashboardResponse = {
  ok: true;
  companyId: string;
  userId: string;
  profile: {
    id: string;
    email: string | null;
    role: string | null;
  };
  dashboard: {
    settings: FinanceCompanySettingsRow | null;
    categories: FinanceCategoryRow[];
    activities: FinanceActivityRow[];
    costCenters: FinanceCostCenterRow[];
    accounts: FinanceAccountRow[];
    entries: FinanceEntryViewRow[];
    summary: {
      income: number;
      expense: number;
      balance: number;
      openCount: number;
      pendingCount: number;
      settledCount: number;
      categoriesCount: number;
      activitiesCount: number;
      costCentersCount: number;
      accountsCount: number;
    };
  };
};

type FinanceApiError = {
  ok: false;
  error: string;
  details?: unknown;
};

function getStoredUserEmail() {
  if (typeof window === "undefined") return "";
  return (
    localStorage.getItem("user_email") ||
    localStorage.getItem("aurora_user_email") ||
    localStorage.getItem("email") ||
    ""
  ).trim();
}

function getFinanceContent(locale: string) {
  const isEnglish = locale === "en-US";
  const isSpanish = locale === "es-ES";

  if (isEnglish) {
    return {
      pageTitle: "Aurora Finance",
      pageSubtitle:
        "Private company finance with editable categories, activities, real documents and premium control.",
      heroTitle: "Editable business finance with real backend.",
      heroDescription:
        "This screen is now connected to Aurora's real finance API and can load the logged-in company's financial data.",
      newEntry: "New entry",
      businessArea: "Business area",
      financialVision: "Real financial vision",
      privateByCompanyDesc:
        "Private company environment with authenticated access and protected data.",
      editableCategories: "Editable categories",
      editableCategoriesDesc:
        "Company data is loaded from the real backend whenever categories exist.",
      editableActivities: "Editable activities",
      editableActivitiesDesc:
        "Activities and structures can grow by company without locking the client.",
      premiumReports: "Premium reports",
      premiumReportsDesc:
        "Strong visual layout with real dashboard, entries and future reports.",
      monthlyRevenue: "Monthly revenue",
      monthlyExpenses: "Monthly expenses",
      monthlyBalance: "Monthly balance",
      activeCategories: "Active categories",
      activeActivities: "Active activities",
      openEntries: "Open entries",
      pendingEntries: "Pending entries",
      settledEntries: "Received / paid",
      quickCreateTitle: "Real creation",
      quickCreateDescription:
        "Create a real entry for the logged-in company using the finance API.",
      entryName: "Entry name",
      entryType: "Type",
      income: "Income",
      expense: "Expense",
      category: "Category",
      activity: "Activity",
      amount: "Amount",
      note: "Internal note",
      saveEntry: "Save entry",
      recentEntries: "Recent entries",
      status: "Status",
      company: "Company",
      internalBack: "Back to home",
      documentType: "Document type",
      documentNumber: "Document number",
      issueDate: "Issue date",
      dueDate: "Due date",
      settlementDate: "Received / paid date",
      competenceDate: "Competence date",
      paymentMethod: "Payment method",
      unit: "Unit / branch",
      costCenter: "Cost center",
      account: "Account",
      loading: "Loading financial data...",
      loadingAuth:
        "If this stays blocked, enter your email on Aurora and open /financeiro again.",
      authError:
        "User not authenticated or without fallback email. Enter your email first in Aurora.",
      genericError: "Could not load the finance module.",
      successCreated: "Real entry created successfully.",
      noCategories: "No categories registered yet.",
      noActivities: "No activities registered yet.",
      noCostCenters: "No cost centers registered yet.",
      noAccounts: "No accounts registered yet.",
      noEntries: "No financial entries found for this company yet.",
      refresh: "Refresh",
      companyId: "Company ID",
      userId: "User ID",
      profileRole: "Role",
      connectedBackend: "Connected backend",
      connectedBackendDesc: "This page is loading data from /api/financeiro.",
      chooseOption: "Select",
      saving: "Saving...",
    };
  }

  if (isSpanish) {
    return {
      pageTitle: "Aurora Finanzas",
      pageSubtitle:
        "Finanzas privadas por empresa con categorías editables, actividades, documentos reales y control premium.",
      heroTitle: "Finanzas empresariales editables con backend real.",
      heroDescription:
        "Esta pantalla ahora está conectada a la API financiera real de Aurora y puede cargar los datos financieros de la empresa identificada.",
      newEntry: "Nuevo registro",
      businessArea: "Área empresarial",
      financialVision: "Visión financiera real",
      privateByCompanyDesc:
        "Entorno privado por empresa con acceso protegido y datos organizados.",
      editableCategories: "Categorías editables",
      editableCategoriesDesc:
        "Los datos de la empresa se cargan desde el backend real cuando existan categorías.",
      editableActivities: "Actividades editables",
      editableActivitiesDesc:
        "Las actividades y estructuras pueden crecer por empresa sin bloquear al cliente.",
      premiumReports: "Informes premium",
      premiumReportsDesc:
        "Visual fuerte con dashboard real, registros e informes futuros.",
      monthlyRevenue: "Ingresos del mes",
      monthlyExpenses: "Gastos del mes",
      monthlyBalance: "Saldo del mes",
      activeCategories: "Categorías activas",
      activeActivities: "Actividades activas",
      openEntries: "Registros abiertos",
      pendingEntries: "Registros pendientes",
      settledEntries: "Cobrado / pagado",
      quickCreateTitle: "Creación real",
      quickCreateDescription:
        "Crea un registro real para la empresa identificada usando la API financiera.",
      entryName: "Nombre del registro",
      entryType: "Tipo",
      income: "Ingreso",
      expense: "Gasto",
      category: "Categoría",
      activity: "Actividad",
      amount: "Valor",
      note: "Nota interna",
      saveEntry: "Guardar registro",
      recentEntries: "Registros recientes",
      status: "Estado",
      company: "Empresa",
      internalBack: "Volver al inicio",
      documentType: "Tipo de documento",
      documentNumber: "Número del documento",
      issueDate: "Fecha de emisión",
      dueDate: "Fecha de vencimiento",
      settlementDate: "Fecha de cobro / pago",
      competenceDate: "Fecha de competencia",
      paymentMethod: "Forma de pago",
      unit: "Unidad / filial",
      costCenter: "Centro de costo",
      account: "Cuenta",
      loading: "Cargando datos financieros...",
      loadingAuth:
        "Si esto se bloquea, informa tu correo en Aurora y vuelve a abrir /financeiro.",
      authError:
        "Usuario no autenticado o sin correo de respaldo. Informa tu correo primero en Aurora.",
      genericError: "No fue posible cargar el módulo financiero.",
      successCreated: "Registro real creado con éxito.",
      noCategories: "Aún no hay categorías registradas.",
      noActivities: "Aún no hay actividades registradas.",
      noCostCenters: "Aún no hay centros de costo registrados.",
      noAccounts: "Aún no hay cuentas registradas.",
      noEntries: "Aún no hay registros financieros para esta empresa.",
      refresh: "Actualizar",
      companyId: "ID de empresa",
      userId: "ID de usuario",
      profileRole: "Rol",
      connectedBackend: "Backend conectado",
      connectedBackendDesc: "Esta página está cargando datos desde /api/financeiro.",
      chooseOption: "Seleccionar",
      saving: "Guardando...",
    };
  }

  return {
    pageTitle: "Financeiro Aurora",
    pageSubtitle:
      "Financeiro privado por empresa com categorias editáveis, atividades, documentos reais e controle premium.",
    heroTitle: "Financeiro empresarial editável com backend real.",
    heroDescription:
      "Esta tela agora está conectada à API financeira real da Aurora e pode carregar os dados financeiros da empresa identificada.",
    newEntry: "Novo lançamento",
    businessArea: "Área empresarial",
    financialVision: "Visão financeira real",
    privateByCompanyDesc:
      "Ambiente privado por empresa com acesso protegido e dados organizados.",
    editableCategories: "Categorias editáveis",
    editableCategoriesDesc:
      "Os dados da empresa são carregados do backend real quando existirem categorias.",
    editableActivities: "Atividades editáveis",
    editableActivitiesDesc:
      "As atividades e estruturas podem crescer por empresa sem travar o cliente.",
    premiumReports: "Relatórios premium",
    premiumReportsDesc:
      "Visual forte com dashboard real, lançamentos e futuros relatórios.",
    monthlyRevenue: "Receitas do mês",
    monthlyExpenses: "Despesas do mês",
    monthlyBalance: "Saldo do mês",
    activeCategories: "Categorias ativas",
    activeActivities: "Atividades ativas",
    openEntries: "Lançamentos abertos",
    pendingEntries: "Lançamentos pendentes",
    settledEntries: "Recebido / pago",
    quickCreateTitle: "Criação real",
    quickCreateDescription:
      "Crie um lançamento real para a empresa identificada usando a API financeira.",
    entryName: "Nome do lançamento",
    entryType: "Tipo",
    income: "Entrada",
    expense: "Saída",
    category: "Categoria",
    activity: "Atividade",
    amount: "Valor",
    note: "Observação interna",
    saveEntry: "Salvar lançamento",
    recentEntries: "Lançamentos recentes",
    status: "Status",
    company: "Empresa",
    internalBack: "Voltar para home",
    documentType: "Tipo de documento",
    documentNumber: "Número do documento",
    issueDate: "Data de emissão",
    dueDate: "Data de vencimento",
    settlementDate: "Data de recebimento / pagamento",
    competenceDate: "Data de competência",
    paymentMethod: "Forma de pagamento",
    unit: "Unidade / filial",
    costCenter: "Centro de custo",
    account: "Conta",
    loading: "Carregando dados financeiros...",
    loadingAuth:
      "Se isso ficar travado, informe seu e-mail na Aurora e abra /financeiro novamente.",
    authError:
      "Usuário não autenticado ou sem e-mail de fallback. Informe o e-mail primeiro na Aurora.",
    genericError: "Não foi possível carregar o módulo financeiro.",
    successCreated: "Lançamento real criado com sucesso.",
    noCategories: "Ainda não existem categorias cadastradas.",
    noActivities: "Ainda não existem atividades cadastradas.",
    noCostCenters: "Ainda não existem centros de custo cadastrados.",
    noAccounts: "Ainda não existem contas cadastradas.",
    noEntries: "Ainda não existem lançamentos financeiros para esta empresa.",
    refresh: "Atualizar",
    companyId: "ID da empresa",
    userId: "ID do usuário",
    profileRole: "Perfil",
    connectedBackend: "Backend conectado",
    connectedBackendDesc: "Esta página está carregando dados de /api/financeiro.",
    chooseOption: "Selecionar",
    saving: "Salvando...",
  };
}

function getDocumentTypeLabel(locale: string, value: FinanceDocumentType) {
  const labels = {
    "pt-BR": {
      invoice: "Nota fiscal",
      receipt: "Recibo",
      service_order: "Ordem de serviço",
      contract: "Contrato",
      internal_note: "Lançamento interno",
      other: "Outro",
    },
    "en-US": {
      invoice: "Invoice",
      receipt: "Receipt",
      service_order: "Service order",
      contract: "Contract",
      internal_note: "Internal entry",
      other: "Other",
    },
    "es-ES": {
      invoice: "Factura",
      receipt: "Recibo",
      service_order: "Orden de servicio",
      contract: "Contrato",
      internal_note: "Registro interno",
      other: "Otro",
    },
  } as const;

  return labels[locale as keyof typeof labels]?.[value] ?? labels["pt-BR"][value];
}

function getStatusLabel(locale: string, value: FinanceEntryStatus) {
  const labels = {
    "pt-BR": {
      open: "Aberto",
      pending: "Pendente",
      approved: "Aprovado",
      received: "Recebido",
      paid: "Pago",
      cancelled: "Cancelado",
    },
    "en-US": {
      open: "Open",
      pending: "Pending",
      approved: "Approved",
      received: "Received",
      paid: "Paid",
      cancelled: "Cancelled",
    },
    "es-ES": {
      open: "Abierto",
      pending: "Pendiente",
      approved: "Aprobado",
      received: "Recibido",
      paid: "Pagado",
      cancelled: "Cancelado",
    },
  } as const;

  return labels[locale as keyof typeof labels]?.[value] ?? labels["pt-BR"][value];
}

function formatDate(value: string | null, locale: string) {
  if (!value) return "-";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(locale).format(date);
}

function getErrorMessage(error: unknown, fallback: string) {
  if (typeof error === "string") return error;

  if (error && typeof error === "object" && "error" in error) {
    const maybeError = (error as { error?: unknown }).error;
    if (typeof maybeError === "string") return maybeError;
  }

  return fallback;
}

export default function FinanceiroPage() {
  const { locale, currency } = useAuroraGlobal();
  const content = getFinanceContent(locale);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<FinanceDashboardResponse | null>(null);
  const [userEmail, setUserEmail] = useState("");

  const [entryName, setEntryName] = useState("");
  const [entryType, setEntryType] = useState<FinanceEntryType>("expense");
  const [documentType, setDocumentType] = useState<FinanceDocumentType>("invoice");
  const [documentNumber, setDocumentNumber] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [activityId, setActivityId] = useState("");
  const [accountId, setAccountId] = useState("");
  const [costCenterId, setCostCenterId] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [settlementDate, setSettlementDate] = useState("");
  const [competenceDate, setCompetenceDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [unit, setUnit] = useState("");

  useEffect(() => {
    setUserEmail(getStoredUserEmail());
  }, []);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setLoadError(null);

    try {
      const response = await fetch("/api/financeiro", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail || null,
        }),
        cache: "no-store",
      });

      const json = (await response.json()) as FinanceDashboardResponse | FinanceApiError;

      if (!response.ok || !json.ok) {
        throw new Error(getErrorMessage(json, content.genericError));
      }

      setDashboardData(json);
    } catch (error) {
      const message = error instanceof Error ? error.message : content.genericError;
      setLoadError(message);
      setDashboardData(null);
    } finally {
      setLoading(false);
    }
  }, [content.genericError, userEmail]);

  useEffect(() => {
    if (!userEmail) {
      setLoading(false);
      setLoadError("Usuário não autenticado ou sem e-mail de fallback.");
      setDashboardData(null);
      return;
    }

    void loadDashboard();
  }, [loadDashboard, userEmail]);

  const settings = dashboardData?.dashboard.settings ?? null;
  const categories = dashboardData?.dashboard.categories ?? [];
  const activities = dashboardData?.dashboard.activities ?? [];
  const costCenters = dashboardData?.dashboard.costCenters ?? [];
  const accounts = dashboardData?.dashboard.accounts ?? [];
  const entries = dashboardData?.dashboard.entries ?? [];
  const summary = dashboardData?.dashboard.summary ?? {
    income: 0,
    expense: 0,
    balance: 0,
    openCount: 0,
    pendingCount: 0,
    settledCount: 0,
    categoriesCount: 0,
    activitiesCount: 0,
    costCentersCount: 0,
    accountsCount: 0,
  };

  const preferredCurrency = settings?.default_currency || currency;

  const selectedCategory = useMemo(
    () => categories.find((item) => item.id === categoryId) ?? null,
    [categories, categoryId]
  );

  const filteredActivities = useMemo(() => {
    if (!selectedCategory) return activities;
    return activities.filter(
      (item) => !item.category_id || item.category_id === selectedCategory.id
    );
  }, [activities, selectedCategory]);

  async function handleCreateEntry() {
    setSuccessMessage(null);

    const numericAmount = Number(amount.replace(",", "."));

    if (!entryName.trim()) {
      setLoadError(`${content.entryName} é obrigatório.`);
      return;
    }

    if (!Number.isFinite(numericAmount) || numericAmount < 0) {
      setLoadError(`${content.amount} inválido.`);
      return;
    }

    if (!userEmail) {
      setLoadError(content.authError);
      return;
    }

    setSubmitting(true);
    setLoadError(null);

    try {
      const response = await fetch("/api/financeiro", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          account_id: accountId || null,
          category_id: categoryId || null,
          activity_id: activityId || null,
          cost_center_id: costCenterId || null,
          entry_type: entryType,
          title: entryName,
          description: note || null,
          document_type: documentType,
          document_number: documentNumber || null,
          amount: numericAmount,
          currency_code: preferredCurrency,
          payment_method: paymentMethod || null,
          issue_date: issueDate || null,
          due_date: dueDate || null,
          settlement_date: settlementDate || null,
          competence_date: competenceDate || null,
          company_unit: unit || null,
        }),
      });

      const json = (await response.json()) as
        | (FinanceDashboardResponse & {
            entry?: FinanceEntryViewRow;
            message?: string;
            companyId?: string;
            userId?: string;
            profile?: FinanceDashboardResponse["profile"];
            dashboard?: FinanceDashboardResponse["dashboard"];
          })
        | (FinanceApiError & { message?: string });

      if (!response.ok || !json.ok) {
        throw new Error(getErrorMessage(json, content.genericError));
      }

      if ("dashboard" in json && json.dashboard) {
        setDashboardData({
          ok: true,
          companyId: json.companyId || dashboardData?.companyId || "",
          userId: json.userId || dashboardData?.userId || "",
          profile: json.profile || dashboardData?.profile || { id: "", email: userEmail, role: "user" },
          dashboard: json.dashboard,
        });
      }

      setSuccessMessage((json as { message?: string }).message || content.successCreated);

      setEntryName("");
      setEntryType("expense");
      setDocumentType("invoice");
      setDocumentNumber("");
      setCategoryId("");
      setActivityId("");
      setAccountId("");
      setCostCenterId("");
      setAmount("");
      setNote("");
      setIssueDate("");
      setDueDate("");
      setSettlementDate("");
      setCompetenceDate("");
      setPaymentMethod("");
      setUnit("");
    } catch (error) {
      const message = error instanceof Error ? error.message : content.genericError;
      setLoadError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(34,197,94,0.08) 0%, rgba(8,12,22,0.98) 30%, #040816 65%, #020617 100%)",
        color: "#f8fafc",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1240,
          margin: "0 auto",
          padding: "20px 16px 80px",
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        <AuroraGlobalBar
          title={content.pageTitle}
          subtitle={content.pageSubtitle}
          showNotice
        />

        <section
          style={{
            borderRadius: 32,
            border: "1px solid rgba(110, 231, 255, 0.14)",
            background:
              "linear-gradient(135deg, rgba(6,10,20,0.98) 0%, rgba(8,14,26,0.96) 50%, rgba(7,12,24,0.98) 100%)",
            padding: "26px 18px",
            boxShadow: "0 25px 90px rgba(0,0,0,0.35)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 18,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                width: "fit-content",
                padding: "8px 12px",
                borderRadius: 999,
                background: "rgba(34,197,94,0.10)",
                border: "1px solid rgba(34,197,94,0.22)",
                color: "#bbf7d0",
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: 0.4,
              }}
            >
              💰 {content.businessArea}
            </span>

            <h1
              style={{
                margin: 0,
                fontSize: "clamp(30px, 4vw, 48px)",
                lineHeight: 1.04,
                fontWeight: 900,
                letterSpacing: -1.2,
              }}
            >
              {content.heroTitle}
            </h1>

            <p
              style={{
                margin: 0,
                color: "rgba(226,232,240,0.82)",
                fontSize: 15,
                lineHeight: 1.7,
                maxWidth: 760,
              }}
            >
              {content.heroDescription}
            </p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
                marginTop: 2,
              }}
            >
              <Link
                href="/"
                style={{
                  minHeight: 46,
                  padding: "0 16px",
                  borderRadius: 14,
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: 14,
                  color: "#e2e8f0",
                  border: "1px solid rgba(148,163,184,0.24)",
                  background: "rgba(15,23,42,0.72)",
                }}
              >
                {content.internalBack}
              </Link>

              <button
                type="button"
                onClick={() => void loadDashboard()}
                style={{
                  minHeight: 46,
                  padding: "0 16px",
                  borderRadius: 14,
                  border: "none",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: 14,
                  color: "#04111d",
                  background: "linear-gradient(135deg, #67e8f9 0%, #22c55e 100%)",
                  boxShadow: "0 18px 40px rgba(34,197,94,0.22)",
                }}
              >
                {content.refresh}
              </button>
            </div>

            {userEmail ? (
              <div
                style={{
                  borderRadius: 18,
                  border: "1px solid rgba(34,197,94,0.18)",
                  background: "rgba(20,83,45,0.22)",
                  padding: "14px",
                  color: "#bbf7d0",
                  fontSize: 14,
                  lineHeight: 1.6,
                  fontWeight: 700,
                }}
              >
                E-mail em uso no fallback: {userEmail}
              </div>
            ) : null}

            {loading ? (
              <div
                style={{
                  borderRadius: 18,
                  border: "1px solid rgba(59,130,246,0.16)",
                  background: "rgba(15,23,42,0.58)",
                  padding: "14px",
                  color: "#bfdbfe",
                  fontSize: 14,
                  lineHeight: 1.6,
                  fontWeight: 700,
                }}
              >
                {content.loading}
                <br />
                <span style={{ color: "rgba(191,219,254,0.78)", fontWeight: 600 }}>
                  {content.loadingAuth}
                </span>
              </div>
            ) : null}

            {loadError ? (
              <div
                style={{
                  borderRadius: 18,
                  border: "1px solid rgba(248,113,113,0.18)",
                  background: "rgba(127,29,29,0.28)",
                  padding: "14px",
                  color: "#fecaca",
                  fontSize: 14,
                  lineHeight: 1.6,
                  fontWeight: 700,
                }}
              >
                {loadError.includes("não autenticado") ||
                loadError.includes("fallback") ||
                loadError.includes("not authenticated")
                  ? content.authError
                  : loadError}
              </div>
            ) : null}

            {successMessage ? (
              <div
                style={{
                  borderRadius: 18,
                  border: "1px solid rgba(34,197,94,0.18)",
                  background: "rgba(20,83,45,0.28)",
                  padding: "14px",
                  color: "#bbf7d0",
                  fontSize: 14,
                  lineHeight: 1.6,
                  fontWeight: 700,
                }}
              >
                {successMessage}
              </div>
            ) : null}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 12,
            }}
          >
            {[
              { title: content.financialVision, value: content.privateByCompanyDesc },
              { title: content.editableCategories, value: content.editableCategoriesDesc },
              { title: content.editableActivities, value: content.editableActivitiesDesc },
              { title: content.premiumReports, value: content.premiumReportsDesc },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  borderRadius: 22,
                  border: "1px solid rgba(148,163,184,0.14)",
                  background: "rgba(15,23,42,0.62)",
                  padding: "16px 14px",
                  minHeight: 130,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    color: "#93c5fd",
                    fontSize: 12,
                    fontWeight: 800,
                    letterSpacing: 0.4,
                    textTransform: "uppercase",
                  }}
                >
                  {item.title}
                </div>
                <div
                  style={{
                    color: "#f8fafc",
                    fontSize: 15,
                    lineHeight: 1.5,
                    fontWeight: 700,
                  }}
                >
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </section>

        {dashboardData ? (
          <section
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 14,
            }}
          >
            {[
              {
                title: content.monthlyRevenue,
                value: formatAuroraMoney({
                  amount: summary.income,
                  currency: preferredCurrency,
                  locale,
                }),
              },
              {
                title: content.monthlyExpenses,
                value: formatAuroraMoney({
                  amount: summary.expense,
                  currency: preferredCurrency,
                  locale,
                }),
              },
              {
                title: content.monthlyBalance,
                value: formatAuroraMoney({
                  amount: summary.balance,
                  currency: preferredCurrency,
                  locale,
                }),
              },
              {
                title: content.activeCategories,
                value: String(summary.categoriesCount),
              },
              {
                title: content.activeActivities,
                value: String(summary.activitiesCount),
              },
              {
                title: content.openEntries,
                value: String(summary.openCount),
              },
              {
                title: content.pendingEntries,
                value: String(summary.pendingCount),
              },
              {
                title: content.settledEntries,
                value: String(summary.settledCount),
              },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  borderRadius: 24,
                  border: "1px solid rgba(148,163,184,0.14)",
                  background:
                    "linear-gradient(180deg, rgba(8,12,24,0.95) 0%, rgba(6,10,19,0.98) 100%)",
                  padding: "18px 16px",
                  boxShadow: "0 18px 60px rgba(0,0,0,0.26)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  minHeight: 120,
                }}
              >
                <div
                  style={{
                    color: "#93c5fd",
                    fontSize: 12,
                    fontWeight: 800,
                    letterSpacing: 0.4,
                    textTransform: "uppercase",
                  }}
                >
                  {item.title}
                </div>
                <div
                  style={{
                    color: "#f8fafc",
                    fontSize: 26,
                    lineHeight: 1.1,
                    fontWeight: 900,
                    letterSpacing: -0.6,
                  }}
                >
                  {item.value}
                </div>
              </div>
            ))}
          </section>
        ) : null}

        {dashboardData ? (
          <section
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.06fr) minmax(0, 1.34fr)",
              gap: 16,
            }}
          >
            <div
              style={{
                borderRadius: 28,
                border: "1px solid rgba(148,163,184,0.14)",
                background:
                  "linear-gradient(180deg, rgba(8,12,24,0.95) 0%, rgba(5,9,18,0.98) 100%)",
                padding: "20px 18px",
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <span
                  style={{
                    color: "#93c5fd",
                    fontSize: 12,
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: 0.4,
                  }}
                >
                  {content.quickCreateTitle}
                </span>

                <h2
                  style={{
                    margin: 0,
                    fontSize: 26,
                    lineHeight: 1.08,
                    fontWeight: 900,
                  }}
                >
                  {content.connectedBackend}
                </h2>

                <p
                  style={{
                    margin: 0,
                    color: "rgba(226,232,240,0.78)",
                    fontSize: 14,
                    lineHeight: 1.7,
                  }}
                >
                  {content.quickCreateDescription}
                </p>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: 12,
                }}
              >
                <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span style={{ color: "#cbd5e1", fontSize: 13, fontWeight: 700 }}>
                    {content.entryName}
                  </span>
                  <input
                    value={entryName}
                    onChange={(event) => setEntryName(event.target.value)}
                    placeholder={
                      locale === "en-US"
                        ? "Ex.: Field support"
                        : locale === "es-ES"
                        ? "Ej.: Apoyo de campo"
                        : "Ex.: Apoio de campo"
                    }
                    style={{
                      width: "100%",
                      minHeight: 48,
                      borderRadius: 14,
                      border: "1px solid rgba(148,163,184,0.22)",
                      background: "rgba(15,23,42,0.92)",
                      color: "#f8fafc",
                      padding: "0 14px",
                      fontSize: 14,
                      fontWeight: 600,
                      outline: "none",
                    }}
                  />
                </label>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    gap: 12,
                  }}
                >
                  <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <span style={{ color: "#cbd5e1", fontSize: 13, fontWeight: 700 }}>
                      {content.entryType}
                    </span>
                    <select
                      value={entryType}
                      onChange={(event) => setEntryType(event.target.value as FinanceEntryType)}
                      style={{
                        width: "100%",
                        minHeight: 48,
                        borderRadius: 14,
                        border: "1px solid rgba(148,163,184,0.22)",
                        background: "rgba(15,23,42,0.92)",
                        color: "#f8fafc",
                        padding: "0 14px",
                        fontSize: 14,
                        fontWeight: 600,
                        outline: "none",
                      }}
                    >
                      <option value="income">{content.income}</option>
                      <option value="expense">{content.expense}</option>
                    </select>
                  </label>

                  <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <span style={{ color: "#cbd5e1", fontSize: 13, fontWeight: 700 }}>
                      {content.documentType}
                    </span>
                    <select
                      value={documentType}
                      onChange={(event) =>
                        setDocumentType(event.target.value as FinanceDocumentType)
                      }
                      style={{
                        width: "100%",
                        minHeight: 48,
                        borderRadius: 14,
                        border: "1px solid rgba(148,163,184,0.22)",
                        background: "rgba(15,23,42,0.92)",
                        color: "#f8fafc",
                        padding: "0 14px",
                        fontSize: 14,
                        fontWeight: 600,
                        outline: "none",
                      }}
                    >
                      <option value="invoice">{getDocumentTypeLabel(locale, "invoice")}</option>
                      <option value="receipt">{getDocumentTypeLabel(locale, "receipt")}</option>
                      <option value="service_order">
                        {getDocumentTypeLabel(locale, "service_order")}
                      </option>
                      <option value="contract">{getDocumentTypeLabel(locale, "contract")}</option>
                      <option value="internal_note">
                        {getDocumentTypeLabel(locale, "internal_note")}
                      </option>
                      <option value="other">{getDocumentTypeLabel(locale, "other")}</option>
                    </select>
                  </label>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    gap: 12,
                  }}
                >
                  <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <span style={{ color: "#cbd5e1", fontSize: 13, fontWeight: 700 }}>
                      {content.documentNumber}
                    </span>
                    <input
                      value={documentNumber}
                      onChange={(event) => setDocumentNumber(event.target.value)}
                      placeholder="NF-2026-001"
                      style={{
                        width: "100%",
                        minHeight: 48,
                        borderRadius: 14,
                        border: "1px solid rgba(148,163,184,0.22)",
                        background: "rgba(15,23,42,0.92)",
                        color: "#f8fafc",
                        padding: "0 14px",
                        fontSize: 14,
                        fontWeight: 600,
                        outline: "none",
                      }}
                    />
                  </label>

                  <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <span style={{ color: "#cbd5e1", fontSize: 13, fontWeight: 700 }}>
                      {content.amount}
                    </span>
                    <input
                      value={amount}
                      onChange={(event) => setAmount(event.target.value)}
                      placeholder="0,00"
                      style={{
                        width: "100%",
                        minHeight: 48,
                        borderRadius: 14,
                        border: "1px solid rgba(148,163,184,0.22)",
                        background: "rgba(15,23,42,0.92)",
                        color: "#f8fafc",
                        padding: "0 14px",
                        fontSize: 14,
                        fontWeight: 600,
                        outline: "none",
                      }}
                    />
                  </label>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    gap: 12,
                  }}
                >
                  <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <span style={{ color: "#cbd5e1", fontSize: 13, fontWeight: 700 }}>
                      {settings?.category_label || content.category}
                    </span>
                    <select
                      value={categoryId}
                      onChange={(event) => setCategoryId(event.target.value)}
                      style={{
                        width: "100%",
                        minHeight: 48,
                        borderRadius: 14,
                        border: "1px solid rgba(148,163,184,0.22)",
                        background: "rgba(15,23,42,0.92)",
                        color: "#f8fafc",
                        padding: "0 14px",
                        fontSize: 14,
                        fontWeight: 600,
                        outline: "none",
                      }}
                    >
                      <option value="">{content.chooseOption}</option>
                      {categories.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <span style={{ color: "#cbd5e1", fontSize: 13, fontWeight: 700 }}>
                      {settings?.activity_label || content.activity}
                    </span>
                    <select
                      value={activityId}
                      onChange={(event) => setActivityId(event.target.value)}
                      style={{
                        width: "100%",
                        minHeight: 48,
                        borderRadius: 14,
                        border: "1px solid rgba(148,163,184,0.22)",
                        background: "rgba(15,23,42,0.92)",
                        color: "#f8fafc",
                        padding: "0 14px",
                        fontSize: 14,
                        fontWeight: 600,
                        outline: "none",
                      }}
                    >
                      <option value="">{content.chooseOption}</option>
                      {filteredActivities.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    gap: 12,
                  }}
                >
                  <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <span style={{ color: "#cbd5e1", fontSize: 13, fontWeight: 700 }}>
                      {settings?.account_label || content.account}
                    </span>
                    <select
                      value={accountId}
                      onChange={(event) => setAccountId(event.target.value)}
                      style={{
                        width: "100%",
                        minHeight: 48,
                        borderRadius: 14,
                        border: "1px solid rgba(148,163,184,0.22)",
                        background: "rgba(15,23,42,0.92)",
                        color: "#f8fafc",
                        padding: "0 14px",
                        fontSize: 14,
                        fontWeight: 600,
                        outline: "none",
                      }}
                    >
                      <option value="">{content.chooseOption}</option>
                      {accounts.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <span style={{ color: "#cbd5e1", fontSize: 13, fontWeight: 700 }}>
                      {settings?.cost_center_label || content.costCenter}
                    </span>
                    <select
                      value={costCenterId}
                      onChange={(event) => setCostCenterId(event.target.value)}
                      style={{
                        width: "100%",
                        minHeight: 48,
                        borderRadius: 14,
                        border: "1px solid rgba(148,163,184,0.22)",
                        background: "rgba(15,23,42,0.92)",
                        color: "#f8fafc",
                        padding: "0 14px",
                        fontSize: 14,
                        fontWeight: 600,
                        outline: "none",
                      }}
                    >
                      <option value="">{content.chooseOption}</option>
                      {costCenters.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    gap: 12,
                  }}
                >
                  <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <span style={{ color: "#cbd5e1", fontSize: 13, fontWeight: 700 }}>
                      {content.issueDate}
                    </span>
                    <input
                      type="date"
                      value={issueDate}
                      onChange={(event) => setIssueDate(event.target.value)}
                      style={{
                        width: "100%",
                        minHeight: 48,
                        borderRadius: 14,
                        border: "1px solid rgba(148,163,184,0.22)",
                        background: "rgba(15,23,42,0.92)",
                        color: "#f8fafc",
                        padding: "0 14px",
                        fontSize: 14,
                        fontWeight: 600,
                        outline: "none",
                      }}
                    />
                  </label>

                  <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <span style={{ color: "#cbd5e1", fontSize: 13, fontWeight: 700 }}>
                      {content.dueDate}
                    </span>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(event) => setDueDate(event.target.value)}
                      style={{
                        width: "100%",
                        minHeight: 48,
                        borderRadius: 14,
                        border: "1px solid rgba(148,163,184,0.22)",
                        background: "rgba(15,23,42,0.92)",
                        color: "#f8fafc",
                        padding: "0 14px",
                        fontSize: 14,
                        fontWeight: 600,
                        outline: "none",
                      }}
                    />
                  </label>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    gap: 12,
                  }}
                >
                  <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <span style={{ color: "#cbd5e1", fontSize: 13, fontWeight: 700 }}>
                      {content.settlementDate}
                    </span>
                    <input
                      type="date"
                      value={settlementDate}
                      onChange={(event) => setSettlementDate(event.target.value)}
                      style={{
                        width: "100%",
                        minHeight: 48,
                        borderRadius: 14,
                        border: "1px solid rgba(148,163,184,0.22)",
                        background: "rgba(15,23,42,0.92)",
                        color: "#f8fafc",
                        padding: "0 14px",
                        fontSize: 14,
                        fontWeight: 600,
                        outline: "none",
                      }}
                    />
                  </label>

                  <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <span style={{ color: "#cbd5e1", fontSize: 13, fontWeight: 700 }}>
                      {content.competenceDate}
                    </span>
                    <input
                      type="date"
                      value={competenceDate}
                      onChange={(event) => setCompetenceDate(event.target.value)}
                      style={{
                        width: "100%",
                        minHeight: 48,
                        borderRadius: 14,
                        border: "1px solid rgba(148,163,184,0.22)",
                        background: "rgba(15,23,42,0.92)",
                        color: "#f8fafc",
                        padding: "0 14px",
                        fontSize: 14,
                        fontWeight: 600,
                        outline: "none",
                      }}
                    />
                  </label>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    gap: 12,
                  }}
                >
                  <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <span style={{ color: "#cbd5e1", fontSize: 13, fontWeight: 700 }}>
                      {content.paymentMethod}
                    </span>
                    <input
                      value={paymentMethod}
                      onChange={(event) => setPaymentMethod(event.target.value)}
                      placeholder="PIX / Dinheiro / Transferência"
                      style={{
                        width: "100%",
                        minHeight: 48,
                        borderRadius: 14,
                        border: "1px solid rgba(148,163,184,0.22)",
                        background: "rgba(15,23,42,0.92)",
                        color: "#f8fafc",
                        padding: "0 14px",
                        fontSize: 14,
                        fontWeight: 600,
                        outline: "none",
                      }}
                    />
                  </label>

                  <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <span style={{ color: "#cbd5e1", fontSize: 13, fontWeight: 700 }}>
                      {content.unit}
                    </span>
                    <input
                      value={unit}
                      onChange={(event) => setUnit(event.target.value)}
                      placeholder="Unidade principal"
                      style={{
                        width: "100%",
                        minHeight: 48,
                        borderRadius: 14,
                        border: "1px solid rgba(148,163,184,0.22)",
                        background: "rgba(15,23,42,0.92)",
                        color: "#f8fafc",
                        padding: "0 14px",
                        fontSize: 14,
                        fontWeight: 600,
                        outline: "none",
                      }}
                    />
                  </label>
                </div>

                <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span style={{ color: "#cbd5e1", fontSize: 13, fontWeight: 700 }}>
                    {content.note}
                  </span>
                  <textarea
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    placeholder="Observações internas..."
                    rows={4}
                    style={{
                      width: "100%",
                      borderRadius: 14,
                      border: "1px solid rgba(148,163,184,0.22)",
                      background: "rgba(15,23,42,0.92)",
                      color: "#f8fafc",
                      padding: "12px 14px",
                      fontSize: 14,
                      fontWeight: 600,
                      outline: "none",
                      resize: "vertical",
                      fontFamily: "inherit",
                    }}
                  />
                </label>

                <button
                  type="button"
                  onClick={() => void handleCreateEntry()}
                  disabled={submitting}
                  style={{
                    minHeight: 48,
                    borderRadius: 14,
                    border: "none",
                    cursor: submitting ? "not-allowed" : "pointer",
                    opacity: submitting ? 0.7 : 1,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 900,
                    fontSize: 14,
                    color: "#04111d",
                    background: "linear-gradient(135deg, #67e8f9 0%, #22c55e 100%)",
                    boxShadow: "0 18px 40px rgba(34,197,94,0.18)",
                  }}
                >
                  {submitting ? content.saving : content.saveEntry}
                </button>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div
                style={{
                  borderRadius: 28,
                  border: "1px solid rgba(148,163,184,0.14)",
                  background:
                    "linear-gradient(180deg, rgba(8,12,24,0.95) 0%, rgba(5,9,18,0.98) 100%)",
                  padding: "20px 18px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <span
                    style={{
                      color: "#93c5fd",
                      fontSize: 12,
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: 0.4,
                    }}
                  >
                    {content.connectedBackend}
                  </span>
                  <h2
                    style={{
                      margin: 0,
                      fontSize: 26,
                      lineHeight: 1.08,
                      fontWeight: 900,
                    }}
                  >
                    {content.company}
                  </h2>
                  <p
                    style={{
                      margin: 0,
                      color: "rgba(226,232,240,0.78)",
                      fontSize: 14,
                      lineHeight: 1.7,
                    }}
                  >
                    {content.connectedBackendDesc}
                  </p>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: 12,
                  }}
                >
                  {[
                    { title: content.companyId, value: dashboardData.companyId },
                    { title: content.userId, value: dashboardData.userId },
                    {
                      title: content.profileRole,
                      value: dashboardData.profile.role || "-",
                    },
                    {
                      title: content.account,
                      value: `${summary.accountsCount}`,
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      style={{
                        borderRadius: 20,
                        border: "1px solid rgba(148,163,184,0.12)",
                        background: "rgba(15,23,42,0.52)",
                        padding: "14px 12px",
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                        minHeight: 100,
                      }}
                    >
                      <div
                        style={{
                          color: "#93c5fd",
                          fontSize: 12,
                          fontWeight: 800,
                          letterSpacing: 0.4,
                          textTransform: "uppercase",
                        }}
                      >
                        {item.title}
                      </div>
                      <div
                        style={{
                          color: "#f8fafc",
                          fontSize: 14,
                          lineHeight: 1.5,
                          fontWeight: 800,
                          wordBreak: "break-word",
                        }}
                      >
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: 12,
                  }}
                >
                  {[
                    {
                      title: settings?.category_label || content.category,
                      value:
                        categories.length > 0
                          ? categories.map((item) => item.name).join(", ")
                          : content.noCategories,
                    },
                    {
                      title: settings?.activity_label || content.activity,
                      value:
                        activities.length > 0
                          ? activities.map((item) => item.name).join(", ")
                          : content.noActivities,
                    },
                    {
                      title: settings?.cost_center_label || content.costCenter,
                      value:
                        costCenters.length > 0
                          ? costCenters.map((item) => item.name).join(", ")
                          : content.noCostCenters,
                    },
                    {
                      title: settings?.account_label || content.account,
                      value:
                        accounts.length > 0
                          ? accounts.map((item) => item.name).join(", ")
                          : content.noAccounts,
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      style={{
                        borderRadius: 20,
                        border: "1px solid rgba(148,163,184,0.12)",
                        background: "rgba(15,23,42,0.52)",
                        padding: "14px 12px",
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                      }}
                    >
                      <div
                        style={{
                          color: "#93c5fd",
                          fontSize: 12,
                          fontWeight: 800,
                          letterSpacing: 0.4,
                          textTransform: "uppercase",
                        }}
                      >
                        {item.title}
                      </div>
                      <div
                        style={{
                          color: "#f8fafc",
                          fontSize: 13,
                          lineHeight: 1.6,
                          fontWeight: 700,
                        }}
                      >
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div
                style={{
                  borderRadius: 28,
                  border: "1px solid rgba(148,163,184,0.14)",
                  background:
                    "linear-gradient(180deg, rgba(8,12,24,0.95) 0%, rgba(5,9,18,0.98) 100%)",
                  padding: "20px 18px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
              >
                <div
                  style={{
                    color: "#f8fafc",
                    fontSize: 22,
                    fontWeight: 900,
                    lineHeight: 1.1,
                  }}
                >
                  {content.recentEntries}
                </div>

                {entries.length === 0 ? (
                  <div
                    style={{
                      borderRadius: 18,
                      border: "1px solid rgba(148,163,184,0.12)",
                      background: "rgba(15,23,42,0.52)",
                      padding: "16px 14px",
                      color: "rgba(226,232,240,0.78)",
                      fontSize: 14,
                      lineHeight: 1.6,
                      fontWeight: 700,
                    }}
                  >
                    {content.noEntries}
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {entries.map((item) => (
                      <div
                        key={item.id}
                        style={{
                          borderRadius: 20,
                          border: "1px solid rgba(148,163,184,0.12)",
                          background: "rgba(15,23,42,0.52)",
                          padding: "14px 14px",
                          display: "grid",
                          gridTemplateColumns: "minmax(0, 1.55fr) minmax(0, 1fr)",
                          gap: 12,
                        }}
                      >
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              alignItems: "center",
                              gap: 8,
                            }}
                          >
                            <span
                              style={{
                                color: "#f8fafc",
                                fontSize: 16,
                                fontWeight: 900,
                                lineHeight: 1.2,
                              }}
                            >
                              {item.title}
                            </span>

                            <span
                              style={{
                                padding: "5px 9px",
                                borderRadius: 999,
                                background:
                                  item.entry_type === "income"
                                    ? "rgba(34,197,94,0.12)"
                                    : "rgba(248,113,113,0.12)",
                                border:
                                  item.entry_type === "income"
                                    ? "1px solid rgba(34,197,94,0.22)"
                                    : "1px solid rgba(248,113,113,0.22)",
                                color:
                                  item.entry_type === "income" ? "#bbf7d0" : "#fecaca",
                                fontSize: 11,
                                fontWeight: 800,
                                letterSpacing: 0.4,
                                textTransform: "uppercase",
                              }}
                            >
                              {item.entry_type === "income" ? content.income : content.expense}
                            </span>

                            <span
                              style={{
                                padding: "5px 9px",
                                borderRadius: 999,
                                background: "rgba(59,130,246,0.10)",
                                border: "1px solid rgba(59,130,246,0.18)",
                                color: "#bfdbfe",
                                fontSize: 11,
                                fontWeight: 800,
                                letterSpacing: 0.4,
                                textTransform: "uppercase",
                              }}
                            >
                              {getDocumentTypeLabel(locale, item.document_type)}
                            </span>
                          </div>

                          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                            {[
                              item.category_name,
                              item.activity_name,
                              item.account_name,
                              item.cost_center_name,
                            ]
                              .filter(Boolean)
                              .map((tag) => (
                                <span
                                  key={`${item.id}-${tag}`}
                                  style={{
                                    padding: "6px 10px",
                                    borderRadius: 999,
                                    background: "rgba(59,130,246,0.10)",
                                    border: "1px solid rgba(59,130,246,0.18)",
                                    color: "#bfdbfe",
                                    fontSize: 12,
                                    fontWeight: 800,
                                  }}
                                >
                                  {tag}
                                </span>
                              ))}
                          </div>

                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                              gap: 8,
                            }}
                          >
                            <div
                              style={{
                                color: "rgba(226,232,240,0.76)",
                                fontSize: 13,
                                lineHeight: 1.5,
                                fontWeight: 700,
                              }}
                            >
                              <strong style={{ color: "#cbd5e1" }}>
                                {content.documentNumber}:
                              </strong>{" "}
                              {item.document_number || "-"}
                            </div>
                            <div
                              style={{
                                color: "rgba(226,232,240,0.76)",
                                fontSize: 13,
                                lineHeight: 1.5,
                                fontWeight: 700,
                              }}
                            >
                              <strong style={{ color: "#cbd5e1" }}>
                                {content.issueDate}:
                              </strong>{" "}
                              {formatDate(item.issue_date, locale)}
                            </div>
                            <div
                              style={{
                                color: "rgba(226,232,240,0.76)",
                                fontSize: 13,
                                lineHeight: 1.5,
                                fontWeight: 700,
                              }}
                            >
                              <strong style={{ color: "#cbd5e1" }}>
                                {content.dueDate}:
                              </strong>{" "}
                              {formatDate(item.due_date, locale)}
                            </div>
                            <div
                              style={{
                                color: "rgba(226,232,240,0.76)",
                                fontSize: 13,
                                lineHeight: 1.5,
                                fontWeight: 700,
                              }}
                            >
                              <strong style={{ color: "#cbd5e1" }}>
                                {content.settlementDate}:
                              </strong>{" "}
                              {formatDate(item.settlement_date, locale)}
                            </div>
                            <div
                              style={{
                                color: "rgba(226,232,240,0.76)",
                                fontSize: 13,
                                lineHeight: 1.5,
                                fontWeight: 700,
                              }}
                            >
                              <strong style={{ color: "#cbd5e1" }}>
                                {content.paymentMethod}:
                              </strong>{" "}
                              {item.payment_method || "-"}
                            </div>
                            <div
                              style={{
                                color: "rgba(226,232,240,0.76)",
                                fontSize: 13,
                                lineHeight: 1.5,
                                fontWeight: 700,
                              }}
                            >
                              <strong style={{ color: "#cbd5e1" }}>
                                {content.unit}:
                              </strong>{" "}
                              {item.company_unit || "-"}
                            </div>
                          </div>

                          {item.description ? (
                            <div
                              style={{
                                color: "rgba(226,232,240,0.72)",
                                fontSize: 13,
                                lineHeight: 1.6,
                                fontWeight: 600,
                              }}
                            >
                              {item.description}
                            </div>
                          ) : null}
                        </div>

                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 8,
                            justifyContent: "space-between",
                            alignItems: "flex-end",
                          }}
                        >
                          <div
                            style={{
                              color:
                                item.entry_type === "income" ? "#86efac" : "#fda4af",
                              fontSize: 22,
                              lineHeight: 1.1,
                              fontWeight: 900,
                              textAlign: "right",
                            }}
                          >
                            {formatAuroraMoney({
                              amount: item.amount,
                              currency: item.currency_code || preferredCurrency,
                              locale,
                            })}
                          </div>

                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "flex-end",
                              gap: 6,
                            }}
                          >
                            <div
                              style={{
                                color: "#94a3b8",
                                fontSize: 12,
                                fontWeight: 800,
                                letterSpacing: 0.4,
                                textTransform: "uppercase",
                              }}
                            >
                              {content.status}
                            </div>
                            <div
                              style={{
                                color: "#f8fafc",
                                fontSize: 13,
                                fontWeight: 800,
                                textAlign: "right",
                              }}
                            >
                              {getStatusLabel(locale, item.status)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}