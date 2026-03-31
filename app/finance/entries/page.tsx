"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const FALLBACK_EMAIL = "grupoexecutivoservice1@gmail.com";

type EntryItem = {
  id: string;
  company_id?: string;
  title?: string | null;
  type: string | null;
  entry_type?: string | null;
  entry_date: string;
  amount: number;
  description: string | null;
  notes: string | null;
  category_id: string | null;
  activity_id: string | null;
  account_id: string | null;
  cost_center_id: string | null;
  reference_code: string | null;
  status: string | null;
  is_active: boolean | null;
  created_at: string | null;
  updated_at?: string | null;
};

type CategoryItem = {
  id: string;
  name: string;
  type?: string | null;
  is_active?: boolean | null;
};

type ActivityItem = {
  id: string;
  name: string;
  category_id?: string | null;
  is_active?: boolean | null;
};

type AccountItem = {
  id: string;
  name: string;
  type?: string | null;
  currency?: string | null;
  current_balance?: number | null;
  is_active?: boolean | null;
};

type CostCenterItem = {
  id: string;
  name: string;
  code?: string | null;
  is_active?: boolean | null;
};

type FilterState = {
  dateFrom: string;
  dateTo: string;
  type: string;
  status: string;
  categoryId: string;
  activityId: string;
  accountId: string;
  costCenterId: string;
  search: string;
};

function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

function getStoredEmail(): string {
  if (typeof window === "undefined") {
    return FALLBACK_EMAIL;
  }

  const candidates = [
    localStorage.getItem("aurora_user_email"),
    localStorage.getItem("userEmail"),
    localStorage.getItem("email"),
    localStorage.getItem("aurora_email"),
  ];

  const found = candidates.find((value) => String(value || "").trim());
  return String(found || FALLBACK_EMAIL).trim().toLowerCase();
}

function applyWordFixes(text: string): string {
  return text
    .replace(/\bVeculos\b/g, "Veículos")
    .replace(/\bveculos\b/g, "veículos")
    .replace(/\bVeiculo\b/g, "Veículo")
    .replace(/\bveiculo\b/g, "veículo")
    .replace(/\bVeiculos\b/g, "Veículos")
    .replace(/\bveiculos\b/g, "veículos")
    .replace(/\bautomtico\b/g, "automático")
    .replace(/\bAutomtico\b/g, "Automático")
    .replace(/\blanamento\b/g, "lançamento")
    .replace(/\bLanamento\b/g, "Lançamento")
    .replace(/\btransferncia\b/g, "transferência")
    .replace(/\bTransferncia\b/g, "Transferência")
    .replace(/\bdescrio\b/g, "descrição")
    .replace(/\bDescrio\b/g, "Descrição")
    .replace(/\bobservaes\b/g, "observações")
    .replace(/\bObservaes\b/g, "Observações")
    .replace(/\boperao\b/g, "operação")
    .replace(/\bOperao\b/g, "Operação")
    .replace(/\badministrao\b/g, "administração")
    .replace(/\bAdministrao\b/g, "Administração");
}

function safeText(value?: string | null): string {
  const raw = String(value || "").trim();
  if (!raw) return "";
  const normalized = raw.replace(/�/g, "").replace(/\s+/g, " ").trim();
  const fixed = applyWordFixes(normalized);
  return fixed || normalized || raw;
}

function formatMoney(value?: number | null, currency = "BRL"): string {
  const amount = Number(value || 0);
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: currency || "BRL",
  }).format(amount);
}

function formatDate(value?: string | null): string {
  if (!value) return "-";
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat("pt-BR").format(parsed);
}

function normalizeType(value?: string | null): "income" | "expense" | "transfer" {
  const raw = String(value || "").trim().toLowerCase();
  if (raw === "income" || raw === "entrada") return "income";
  if (raw === "transfer" || raw === "transferência" || raw === "transferencia") {
    return "transfer";
  }
  return "expense";
}

function normalizeStatus(value?: string | null): "paid" | "pending" | "cancelled" {
  const raw = String(value || "").trim().toLowerCase();
  if (raw === "pending" || raw === "pendente") return "pending";
  if (raw === "cancelled" || raw === "cancelado") return "cancelled";
  return "paid";
}

function typeLabel(value?: string | null): string {
  const type = normalizeType(value);
  if (type === "income") return "Entrada";
  if (type === "transfer") return "Transferência";
  return "Saída";
}

function statusLabel(value?: string | null): string {
  const status = normalizeStatus(value);
  if (status === "pending") return "Pendente";
  if (status === "cancelled") return "Cancelado";
  return "Pago";
}

function typeBadgeStyle(type: string) {
  if (type === "income") {
    return {
      background: "rgba(34,197,94,0.16)",
      border: "1px solid rgba(34,197,94,0.28)",
      color: "#86efac",
    };
  }

  if (type === "transfer") {
    return {
      background: "rgba(56,189,248,0.16)",
      border: "1px solid rgba(56,189,248,0.28)",
      color: "#7dd3fc",
    };
  }

  return {
    background: "rgba(239,68,68,0.16)",
    border: "1px solid rgba(239,68,68,0.28)",
    color: "#fca5a5",
  };
}

function statusBadgeStyle(status: string) {
  if (status === "paid") {
    return {
      background: "rgba(34,197,94,0.12)",
      border: "1px solid rgba(34,197,94,0.24)",
      color: "#bbf7d0",
    };
  }

  if (status === "pending") {
    return {
      background: "rgba(245,158,11,0.12)",
      border: "1px solid rgba(245,158,11,0.24)",
      color: "#fde68a",
    };
  }

  return {
    background: "rgba(239,68,68,0.12)",
    border: "1px solid rgba(239,68,68,0.24)",
    color: "#fecaca",
  };
}

export default function FinanceEntriesPage() {
  const [email, setEmail] = useState(FALLBACK_EMAIL);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [entries, setEntries] = useState<EntryItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [accounts, setAccounts] = useState<AccountItem[]>([]);
  const [costCenters, setCostCenters] = useState<CostCenterItem[]>([]);

  const [filters, setFilters] = useState<FilterState>({
    dateFrom: "",
    dateTo: "",
    type: "",
    status: "",
    categoryId: "",
    activityId: "",
    accountId: "",
    costCenterId: "",
    search: "",
  });

  async function loadData(mode: "initial" | "refresh" = "initial") {
    try {
      if (mode === "initial") setLoading(true);
      if (mode === "refresh") setRefreshing(true);

      setError("");
      setMessage("");

      const resolvedEmail = getStoredEmail();
      setEmail(resolvedEmail);

      const [entriesRes, categoriesRes, activitiesRes, accountsRes, costCentersRes] =
        await Promise.all([
          fetch(
            `${getBaseUrl()}/api/finance/entries?email=${encodeURIComponent(resolvedEmail)}`,
            { method: "GET", cache: "no-store" },
          ),
          fetch(
            `${getBaseUrl()}/api/finance/categories?email=${encodeURIComponent(resolvedEmail)}`,
            { method: "GET", cache: "no-store" },
          ),
          fetch(
            `${getBaseUrl()}/api/finance/activities?email=${encodeURIComponent(resolvedEmail)}`,
            { method: "GET", cache: "no-store" },
          ),
          fetch(
            `${getBaseUrl()}/api/finance/accounts?email=${encodeURIComponent(resolvedEmail)}`,
            { method: "GET", cache: "no-store" },
          ),
          fetch(
            `${getBaseUrl()}/api/finance/cost-centers?email=${encodeURIComponent(resolvedEmail)}`,
            { method: "GET", cache: "no-store" },
          ),
        ]);

      const entriesData = await entriesRes.json();
      const categoriesData = await categoriesRes.json();
      const activitiesData = await activitiesRes.json();
      const accountsData = await accountsRes.json();
      const costCentersData = await costCentersRes.json();

      if (!entriesRes.ok || !entriesData.ok) {
        throw new Error(entriesData.error || "Erro ao carregar lançamentos.");
      }
      if (!categoriesRes.ok || !categoriesData.ok) {
        throw new Error(categoriesData.error || "Erro ao carregar categorias.");
      }
      if (!activitiesRes.ok || !activitiesData.ok) {
        throw new Error(activitiesData.error || "Erro ao carregar atividades.");
      }
      if (!accountsRes.ok || !accountsData.ok) {
        throw new Error(accountsData.error || "Erro ao carregar contas.");
      }
      if (!costCentersRes.ok || !costCentersData.ok) {
        throw new Error(costCentersData.error || "Erro ao carregar centros de custo.");
      }

      setEntries(Array.isArray(entriesData.items) ? entriesData.items : []);
      setCategories(Array.isArray(categoriesData.items) ? categoriesData.items : []);
      setActivities(Array.isArray(activitiesData.items) ? activitiesData.items : []);
      setAccounts(Array.isArray(accountsData.items) ? accountsData.items : []);
      setCostCenters(Array.isArray(costCentersData.items) ? costCentersData.items : []);

      setMessage(
        "Lançamentos carregados com filtros e visão resumida. Sistema em constante atualização e pode haver momentos de instabilidade durante melhorias.",
      );
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Erro ao carregar módulo de lançamentos.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadData("initial");
  }, []);

  const categoryMap = useMemo(() => {
    return new Map(categories.map((item) => [item.id, safeText(item.name)]));
  }, [categories]);

  const activityMap = useMemo(() => {
    return new Map(activities.map((item) => [item.id, safeText(item.name)]));
  }, [activities]);

  const accountMap = useMemo(() => {
    return new Map(accounts.map((item) => [item.id, safeText(item.name)]));
  }, [accounts]);

  const costCenterMap = useMemo(() => {
    return new Map(costCenters.map((item) => [item.id, safeText(item.name)]));
  }, [costCenters]);

  const filteredEntries = useMemo(() => {
    return entries.filter((item) => {
      const itemType = normalizeType(item.type || item.entry_type);
      const itemStatus = normalizeStatus(item.status);
      const itemDate = String(item.entry_date || "");
      const searchText = [
        safeText(item.title),
        safeText(item.description),
        safeText(item.notes),
        safeText(item.reference_code),
        categoryMap.get(item.category_id || ""),
        activityMap.get(item.activity_id || ""),
        accountMap.get(item.account_id || ""),
        costCenterMap.get(item.cost_center_id || ""),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (filters.dateFrom && itemDate < filters.dateFrom) return false;
      if (filters.dateTo && itemDate > filters.dateTo) return false;
      if (filters.type && itemType !== filters.type) return false;
      if (filters.status && itemStatus !== filters.status) return false;
      if (filters.categoryId && item.category_id !== filters.categoryId) return false;
      if (filters.activityId && item.activity_id !== filters.activityId) return false;
      if (filters.accountId && item.account_id !== filters.accountId) return false;
      if (filters.costCenterId && item.cost_center_id !== filters.costCenterId) return false;

      if (filters.search.trim()) {
        const needle = filters.search.trim().toLowerCase();
        if (!searchText.includes(needle)) return false;
      }

      return true;
    });
  }, [entries, filters, categoryMap, activityMap, accountMap, costCenterMap]);

  const summary = useMemo(() => {
    const totalEntries = filteredEntries.length;

    const incomeTotal = filteredEntries
      .filter((item) => normalizeType(item.type || item.entry_type) === "income")
      .reduce((acc, item) => acc + Number(item.amount || 0), 0);

    const expenseTotal = filteredEntries
      .filter((item) => normalizeType(item.type || item.entry_type) === "expense")
      .reduce((acc, item) => acc + Number(item.amount || 0), 0);

    const transferTotal = filteredEntries
      .filter((item) => normalizeType(item.type || item.entry_type) === "transfer")
      .reduce((acc, item) => acc + Number(item.amount || 0), 0);

    const pendingCount = filteredEntries.filter(
      (item) => normalizeStatus(item.status) === "pending",
    ).length;

    const paidCount = filteredEntries.filter(
      (item) => normalizeStatus(item.status) === "paid",
    ).length;

    const cancelledCount = filteredEntries.filter(
      (item) => normalizeStatus(item.status) === "cancelled",
    ).length;

    const netResult = incomeTotal - expenseTotal;

    return {
      totalEntries,
      incomeTotal,
      expenseTotal,
      transferTotal,
      pendingCount,
      paidCount,
      cancelledCount,
      netResult,
    };
  }, [filteredEntries]);

  function updateFilter<K extends keyof FilterState>(key: K, value: FilterState[K]) {
    setFilters((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function clearFilters() {
    setFilters({
      dateFrom: "",
      dateTo: "",
      type: "",
      status: "",
      categoryId: "",
      activityId: "",
      accountId: "",
      costCenterId: "",
      search: "",
    });
  }

  const quickLinks = [
    { title: "Voltar ao hub", href: "/finance" },
    { title: "Abrir relatórios", href: "/finance/reports" },
  ];

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(34,197,94,0.10), transparent 16%), radial-gradient(circle at right top, rgba(56,189,248,0.08), transparent 18%), linear-gradient(180deg, #05110c 0%, #07130f 38%, #030504 100%)",
        color: "#ecfdf5",
        padding: "24px 14px 80px",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          display: "grid",
          gap: 16,
        }}
      >
        <section
          style={{
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(7,18,13,0.84)",
            backdropFilter: "blur(12px)",
            borderRadius: 28,
            padding: 22,
            boxShadow: "0 18px 60px rgba(0,0,0,0.28)",
            display: "grid",
            gap: 18,
          }}
        >
          <div style={{ maxWidth: 860 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 12px",
                borderRadius: 999,
                background: "rgba(16,185,129,0.10)",
                border: "1px solid rgba(16,185,129,0.28)",
                color: "#6ee7b7",
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              Financeiro Aurora • Lançamentos
            </div>

            <h1
              style={{
                margin: "16px 0 10px",
                fontSize: "clamp(28px, 5vw, 42px)",
                lineHeight: 1.05,
              }}
            >
              Filtros e visão profissional dos lançamentos
            </h1>

            <p
              style={{
                margin: 0,
                color: "rgba(236,253,245,0.82)",
                fontSize: 16,
                lineHeight: 1.7,
              }}
            >
              Aqui você controla entradas, saídas e transferências com filtros
              por período, tipo, status, conta, categoria, atividade e centro de
              custo. Esta tela prepara o terreno para relatórios premium sem
              quebrar a base atual. Sistema em constante atualização e pode haver
              momentos de instabilidade durante melhorias.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 10,
            }}
          >
            {quickLinks.map((item) => (
              <Link key={item.title} href={item.href} style={topButtonSecondary}>
                {item.title}
              </Link>
            ))}

            <button
              type="button"
              onClick={() => loadData("refresh")}
              disabled={refreshing || loading}
              style={{
                ...topButtonGreen,
                cursor: refreshing || loading ? "not-allowed" : "pointer",
                opacity: refreshing || loading ? 0.7 : 1,
              }}
            >
              {refreshing ? "Atualizando..." : "Atualizar lançamentos"}
            </button>
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
            gap: 12,
          }}
        >
          {[
            {
              label: "Lançamentos filtrados",
              value: String(summary.totalEntries),
              note: "Quantidade exibida conforme filtros aplicados",
            },
            {
              label: "Entradas",
              value: formatMoney(summary.incomeTotal),
              note: "Soma das entradas dentro do filtro atual",
            },
            {
              label: "Saídas",
              value: formatMoney(summary.expenseTotal),
              note: "Soma das saídas dentro do filtro atual",
            },
            {
              label: "Transferências",
              value: formatMoney(summary.transferTotal),
              note: "Total financeiro de transferências filtradas",
            },
            {
              label: "Resultado",
              value: formatMoney(summary.netResult),
              note: "Entradas menos saídas no recorte atual",
            },
          ].map((card) => (
            <div
              key={card.label}
              style={{
                borderRadius: 22,
                padding: 18,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(8,19,15,0.88)",
              }}
            >
              <div
                style={{
                  color: "rgba(236,253,245,0.72)",
                  fontSize: 13,
                  marginBottom: 10,
                }}
              >
                {card.label}
              </div>
              <div
                style={{
                  fontSize: "clamp(24px, 4vw, 30px)",
                  fontWeight: 800,
                  marginBottom: 8,
                  lineHeight: 1.1,
                  wordBreak: "break-word",
                }}
              >
                {loading ? "..." : card.value}
              </div>
              <div
                style={{
                  color: "rgba(236,253,245,0.62)",
                  fontSize: 13,
                  lineHeight: 1.5,
                }}
              >
                {card.note}
              </div>
            </div>
          ))}
        </section>

        <section
          style={{
            borderRadius: 24,
            padding: 20,
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(8,19,15,0.90)",
            display: "grid",
            gap: 14,
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: 24,
              }}
            >
              Filtros inteligentes
            </h2>
            <div
              style={{
                color: "rgba(236,253,245,0.72)",
                marginTop: 6,
                lineHeight: 1.6,
                wordBreak: "break-word",
              }}
            >
              E-mail em uso no fallback: {email}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 12,
            }}
          >
            <label style={{ display: "grid", gap: 8 }}>
              <span style={filterLabelStyle}>Data inicial</span>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => updateFilter("dateFrom", e.target.value)}
                style={inputStyle}
              />
            </label>

            <label style={{ display: "grid", gap: 8 }}>
              <span style={filterLabelStyle}>Data final</span>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => updateFilter("dateTo", e.target.value)}
                style={inputStyle}
              />
            </label>

            <label style={{ display: "grid", gap: 8 }}>
              <span style={filterLabelStyle}>Tipo</span>
              <select
                value={filters.type}
                onChange={(e) => updateFilter("type", e.target.value)}
                style={inputStyle}
              >
                <option value="">Todos</option>
                <option value="income">Entrada</option>
                <option value="expense">Saída</option>
                <option value="transfer">Transferência</option>
              </select>
            </label>

            <label style={{ display: "grid", gap: 8 }}>
              <span style={filterLabelStyle}>Status</span>
              <select
                value={filters.status}
                onChange={(e) => updateFilter("status", e.target.value)}
                style={inputStyle}
              >
                <option value="">Todos</option>
                <option value="paid">Pago</option>
                <option value="pending">Pendente</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </label>

            <label style={{ display: "grid", gap: 8 }}>
              <span style={filterLabelStyle}>Categoria</span>
              <select
                value={filters.categoryId}
                onChange={(e) => updateFilter("categoryId", e.target.value)}
                style={inputStyle}
              >
                <option value="">Todas</option>
                {categories.map((item) => (
                  <option key={item.id} value={item.id}>
                    {safeText(item.name)}
                  </option>
                ))}
              </select>
            </label>

            <label style={{ display: "grid", gap: 8 }}>
              <span style={filterLabelStyle}>Atividade</span>
              <select
                value={filters.activityId}
                onChange={(e) => updateFilter("activityId", e.target.value)}
                style={inputStyle}
              >
                <option value="">Todas</option>
                {activities.map((item) => (
                  <option key={item.id} value={item.id}>
                    {safeText(item.name)}
                  </option>
                ))}
              </select>
            </label>

            <label style={{ display: "grid", gap: 8 }}>
              <span style={filterLabelStyle}>Conta</span>
              <select
                value={filters.accountId}
                onChange={(e) => updateFilter("accountId", e.target.value)}
                style={inputStyle}
              >
                <option value="">Todas</option>
                {accounts.map((item) => (
                  <option key={item.id} value={item.id}>
                    {safeText(item.name)}
                  </option>
                ))}
              </select>
            </label>

            <label style={{ display: "grid", gap: 8 }}>
              <span style={filterLabelStyle}>Centro de custo</span>
              <select
                value={filters.costCenterId}
                onChange={(e) => updateFilter("costCenterId", e.target.value)}
                style={inputStyle}
              >
                <option value="">Todos</option>
                {costCenters.map((item) => (
                  <option key={item.id} value={item.id}>
                    {safeText(item.name)}
                  </option>
                ))}
              </select>
            </label>

            <label
              style={{
                display: "grid",
                gap: 8,
                gridColumn: "1 / -1",
              }}
            >
              <span style={filterLabelStyle}>Busca livre</span>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => updateFilter("search", e.target.value)}
                placeholder="Pesquisar por descrição, observação, referência, categoria, conta..."
                style={inputStyle}
              />
            </label>
          </div>

          <button
            type="button"
            onClick={clearFilters}
            style={{
              justifySelf: "start",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.10)",
              background: "rgba(255,255,255,0.04)",
              color: "#ecfdf5",
              padding: "10px 14px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Limpar filtros
          </button>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
            gap: 12,
          }}
        >
          {[
            {
              label: "Pagos",
              value: String(summary.paidCount),
              note: "Lançamentos marcados como pagos",
            },
            {
              label: "Pendentes",
              value: String(summary.pendingCount),
              note: "Itens que ainda exigem atenção",
            },
            {
              label: "Cancelados",
              value: String(summary.cancelledCount),
              note: "Lançamentos descartados ou anulados",
            },
          ].map((card) => (
            <div
              key={card.label}
              style={{
                borderRadius: 20,
                padding: 18,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(8,19,15,0.88)",
              }}
            >
              <div style={{ color: "rgba(236,253,245,0.72)", fontSize: 13 }}>
                {card.label}
              </div>
              <div
                style={{
                  marginTop: 8,
                  fontSize: "clamp(24px, 4vw, 28px)",
                  fontWeight: 900,
                }}
              >
                {loading ? "..." : card.value}
              </div>
              <div
                style={{
                  marginTop: 8,
                  color: "rgba(236,253,245,0.62)",
                  fontSize: 13,
                  lineHeight: 1.5,
                }}
              >
                {card.note}
              </div>
            </div>
          ))}
        </section>

        {message ? (
          <div
            style={{
              borderRadius: 16,
              padding: "14px 16px",
              background: "rgba(34,197,94,0.12)",
              border: "1px solid rgba(34,197,94,0.20)",
              color: "#bbf7d0",
              lineHeight: 1.6,
            }}
          >
            {message}
          </div>
        ) : null}

        {error ? (
          <div
            style={{
              borderRadius: 16,
              padding: "14px 16px",
              background: "rgba(239,68,68,0.12)",
              border: "1px solid rgba(239,68,68,0.20)",
              color: "#fecaca",
              lineHeight: 1.6,
            }}
          >
            {error}
          </div>
        ) : null}

        <section
          style={{
            borderRadius: 24,
            padding: 20,
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(8,19,15,0.90)",
            display: "grid",
            gap: 14,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 24,
                }}
              >
                Lista profissional de lançamentos
              </h2>
              <div
                style={{
                  color: "rgba(236,253,245,0.72)",
                  marginTop: 6,
                  lineHeight: 1.6,
                }}
              >
                Visualização filtrada em tempo real para apoiar decisão, conferência e futura expansão para relatórios premium.
              </div>
            </div>

            <div
              style={{
                color: "rgba(236,253,245,0.78)",
                fontWeight: 700,
              }}
            >
              Exibindo: {summary.totalEntries}
            </div>
          </div>

          <div style={{ display: "grid", gap: 12 }}>
            {loading ? (
              <div style={emptyBoxStyle}>Carregando lançamentos...</div>
            ) : filteredEntries.length === 0 ? (
              <div style={emptyBoxStyle}>Nenhum lançamento encontrado com os filtros atuais.</div>
            ) : (
              filteredEntries.map((item) => {
                const itemType = normalizeType(item.type || item.entry_type);
                const itemStatus = normalizeStatus(item.status);

                return (
                  <article
                    key={item.id}
                    style={{
                      borderRadius: 22,
                      padding: 18,
                      border: "1px solid rgba(255,255,255,0.08)",
                      background: "rgba(255,255,255,0.03)",
                      display: "grid",
                      gap: 14,
                    }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gap: 10,
                      }}
                    >
                      <div style={{ display: "grid", gap: 8 }}>
                        <div
                          style={{
                            fontSize: 20,
                            fontWeight: 800,
                            lineHeight: 1.35,
                            wordBreak: "break-word",
                          }}
                        >
                          {safeText(item.title) || safeText(item.description) || "Lançamento financeiro"}
                        </div>

                        <div
                          style={{
                            color: "rgba(236,253,245,0.68)",
                            lineHeight: 1.6,
                            fontSize: 14,
                          }}
                        >
                          {safeText(item.description) || "Sem descrição complementar."}
                        </div>
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gap: 10,
                        }}
                      >
                        <div
                          style={{
                            fontSize: 26,
                            fontWeight: 900,
                            color:
                              itemType === "income"
                                ? "#86efac"
                                : itemType === "transfer"
                                  ? "#7dd3fc"
                                  : "#fca5a5",
                            wordBreak: "break-word",
                          }}
                        >
                          {itemType === "expense" ? "-" : ""}
                          {formatMoney(item.amount)}
                        </div>

                        <div
                          style={{
                            display: "flex",
                            gap: 8,
                            flexWrap: "wrap",
                          }}
                        >
                          <span
                            style={{
                              borderRadius: 999,
                              padding: "6px 10px",
                              fontSize: 12,
                              fontWeight: 800,
                              ...typeBadgeStyle(itemType),
                            }}
                          >
                            {typeLabel(itemType)}
                          </span>

                          <span
                            style={{
                              borderRadius: 999,
                              padding: "6px 10px",
                              fontSize: 12,
                              fontWeight: 800,
                              ...statusBadgeStyle(itemStatus),
                            }}
                          >
                            {statusLabel(itemStatus)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                        gap: 10,
                      }}
                    >
                      <InfoMini label="Data" value={formatDate(item.entry_date)} />
                      <InfoMini label="Categoria" value={categoryMap.get(item.category_id || "") || "-"} />
                      <InfoMini label="Atividade" value={activityMap.get(item.activity_id || "") || "-"} />
                      <InfoMini label="Conta" value={accountMap.get(item.account_id || "") || "-"} />
                      <InfoMini label="Centro de custo" value={costCenterMap.get(item.cost_center_id || "") || "-"} />
                      <InfoMini label="Referência" value={safeText(item.reference_code) || "-"} />
                    </div>

                    <div
                      style={{
                        borderRadius: 14,
                        padding: "12px 14px",
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.06)",
                        color: "rgba(236,253,245,0.78)",
                        lineHeight: 1.6,
                      }}
                    >
                      <strong style={{ color: "#ecfdf5" }}>Observações:</strong>{" "}
                      {safeText(item.notes) || "Sem observações adicionais."}
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function InfoMini({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        borderRadius: 14,
        padding: "10px 12px",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div
        style={{
          fontSize: 12,
          color: "rgba(236,253,245,0.62)",
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontWeight: 700,
          color: "#ecfdf5",
          lineHeight: 1.45,
          wordBreak: "break-word",
        }}
      >
        {value}
      </div>
    </div>
  );
}

const topButtonSecondary: React.CSSProperties = {
  textDecoration: "none",
  color: "#ecfdf5",
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.04)",
  borderRadius: 14,
  padding: "12px 16px",
  fontWeight: 700,
  textAlign: "center",
};

const topButtonGreen: React.CSSProperties = {
  border: "1px solid rgba(16,185,129,0.28)",
  background: "linear-gradient(135deg, #059669, #10b981)",
  color: "#04110a",
  borderRadius: 14,
  padding: "12px 16px",
  fontWeight: 900,
};

const filterLabelStyle: React.CSSProperties = {
  fontSize: 13,
  color: "rgba(236,253,245,0.72)",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.04)",
  color: "#ecfdf5",
  padding: "12px 14px",
  outline: "none",
};

const emptyBoxStyle: React.CSSProperties = {
  borderRadius: 16,
  padding: "16px 14px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.03)",
  color: "rgba(236,253,245,0.72)",
  lineHeight: 1.6,
};