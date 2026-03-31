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

type FilterState = {
  dateFrom: string;
  dateTo: string;
  status: string;
};

type GroupRow = {
  id: string;
  name: string;
  total: number;
  count: number;
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
    .replace(/\bAdministrao\b/g, "Administração")
    .replace(/\bmanuteno\b/g, "manutenção")
    .replace(/\bManuteno\b/g, "Manutenção")
    .replace(/\bcomercializao\b/g, "comercialização")
    .replace(/\bComercializao\b/g, "Comercialização")
    .replace(/\binteno\b/g, "intenção")
    .replace(/\bInteno\b/g, "Intenção")
    .replace(/\bavaliao\b/g, "avaliação")
    .replace(/\bAvaliao\b/g, "Avaliação")
    .replace(/\bgesto\b/g, "gestão")
    .replace(/\bGesto\b/g, "Gestão")
    .replace(/\bnegociao\b/g, "negociação")
    .replace(/\bNegociao\b/g, "Negociação")
    .replace(/\bProduo\b/g, "Produção")
    .replace(/\bproduo\b/g, "produção")
    .replace(/\bservio\b/g, "serviço")
    .replace(/\bServio\b/g, "Serviço")
    .replace(/\bsoluo\b/g, "solução")
    .replace(/\bSoluo\b/g, "Solução");
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

function groupByDimension(params: {
  entries: EntryItem[];
  map: Map<string, string>;
  field: "category_id" | "activity_id" | "account_id";
}): GroupRow[] {
  const { entries, map, field } = params;
  const accumulator = new Map<string, GroupRow>();

  for (const item of entries) {
    const key = String(item[field] || "unknown");
    const name = key === "unknown" ? "Não informado" : safeText(map.get(key) || "Não informado");
    const current = accumulator.get(key) || {
      id: key,
      name,
      total: 0,
      count: 0,
    };

    current.total += Number(item.amount || 0);
    current.count += 1;
    accumulator.set(key, current);
  }

  return Array.from(accumulator.values()).sort((a, b) => b.total - a.total);
}

function csvEscape(value: unknown): string {
  const text = String(value ?? "");
  const escaped = text.replace(/"/g, '""');
  return `"${escaped}"`;
}

export default function FinanceReportsPage() {
  const [email, setEmail] = useState(FALLBACK_EMAIL);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [entries, setEntries] = useState<EntryItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [accounts, setAccounts] = useState<AccountItem[]>([]);

  const [filters, setFilters] = useState<FilterState>({
    dateFrom: "",
    dateTo: "",
    status: "",
  });

  async function loadData(mode: "initial" | "refresh" = "initial") {
    try {
      if (mode === "initial") setLoading(true);
      if (mode === "refresh") setRefreshing(true);

      setError("");
      setMessage("");

      const resolvedEmail = getStoredEmail();
      setEmail(resolvedEmail);

      const [entriesRes, categoriesRes, activitiesRes, accountsRes] =
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
        ]);

      const entriesData = await entriesRes.json();
      const categoriesData = await categoriesRes.json();
      const activitiesData = await activitiesRes.json();
      const accountsData = await accountsRes.json();

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

      setEntries(Array.isArray(entriesData.items) ? entriesData.items : []);
      setCategories(Array.isArray(categoriesData.items) ? categoriesData.items : []);
      setActivities(Array.isArray(activitiesData.items) ? activitiesData.items : []);
      setAccounts(Array.isArray(accountsData.items) ? accountsData.items : []);

      setMessage(
        "Relatórios financeiros carregados com sucesso. Sistema em constante atualização e pode haver momentos de instabilidade durante melhorias.",
      );
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Erro ao carregar relatórios financeiros.",
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

  const filteredEntries = useMemo(() => {
    return entries.filter((item) => {
      const itemDate = String(item.entry_date || "");
      const itemStatus = normalizeStatus(item.status);

      if (filters.dateFrom && itemDate < filters.dateFrom) return false;
      if (filters.dateTo && itemDate > filters.dateTo) return false;
      if (filters.status && itemStatus !== filters.status) return false;

      return true;
    });
  }, [entries, filters]);

  const report = useMemo(() => {
    const incomeEntries = filteredEntries.filter(
      (item) => normalizeType(item.type || item.entry_type) === "income",
    );
    const expenseEntries = filteredEntries.filter(
      (item) => normalizeType(item.type || item.entry_type) === "expense",
    );
    const transferEntries = filteredEntries.filter(
      (item) => normalizeType(item.type || item.entry_type) === "transfer",
    );

    const incomeTotal = incomeEntries.reduce((acc, item) => acc + Number(item.amount || 0), 0);
    const expenseTotal = expenseEntries.reduce((acc, item) => acc + Number(item.amount || 0), 0);
    const transferTotal = transferEntries.reduce((acc, item) => acc + Number(item.amount || 0), 0);

    const paidCount = filteredEntries.filter(
      (item) => normalizeStatus(item.status) === "paid",
    ).length;
    const pendingCount = filteredEntries.filter(
      (item) => normalizeStatus(item.status) === "pending",
    ).length;
    const cancelledCount = filteredEntries.filter(
      (item) => normalizeStatus(item.status) === "cancelled",
    ).length;

    const result = incomeTotal - expenseTotal;

    const byCategory = groupByDimension({
      entries: filteredEntries,
      map: categoryMap,
      field: "category_id",
    });
    const byActivity = groupByDimension({
      entries: filteredEntries,
      map: activityMap,
      field: "activity_id",
    });
    const byAccount = groupByDimension({
      entries: filteredEntries,
      map: accountMap,
      field: "account_id",
    });

    const recent = [...filteredEntries]
      .sort((a, b) => {
        const dateA = `${a.entry_date || ""}-${a.created_at || ""}`;
        const dateB = `${b.entry_date || ""}-${b.created_at || ""}`;
        return dateA < dateB ? 1 : -1;
      })
      .slice(0, 10);

    return {
      totalEntries: filteredEntries.length,
      incomeTotal,
      expenseTotal,
      transferTotal,
      result,
      paidCount,
      pendingCount,
      cancelledCount,
      byCategory,
      byActivity,
      byAccount,
      recent,
    };
  }, [filteredEntries, categoryMap, activityMap, accountMap]);

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
      status: "",
    });
  }

  function exportCsv() {
    try {
      setExporting(true);
      setError("");

      const summaryLines = [
        ["Tipo", "Valor"],
        ["Lançamentos", report.totalEntries],
        ["Entradas", report.incomeTotal],
        ["Saídas", report.expenseTotal],
        ["Transferências", report.transferTotal],
        ["Resultado", report.result],
        ["Pagos", report.paidCount],
        ["Pendentes", report.pendingCount],
        ["Cancelados", report.cancelledCount],
      ];

      const entryHeader = [
        "Data",
        "Tipo",
        "Status",
        "Valor",
        "Título",
        "Descrição",
        "Observações",
        "Categoria",
        "Atividade",
        "Conta",
        "Referência",
      ];

      const entryLines = filteredEntries.map((item) => [
        formatDate(item.entry_date),
        typeLabel(item.type || item.entry_type),
        statusLabel(item.status),
        Number(item.amount || 0).toFixed(2),
        safeText(item.title),
        safeText(item.description),
        safeText(item.notes),
        categoryMap.get(item.category_id || "") || "",
        activityMap.get(item.activity_id || "") || "",
        accountMap.get(item.account_id || "") || "",
        safeText(item.reference_code),
      ]);

      const categoryHeader = ["Categoria", "Total", "Quantidade"];
      const categoryLines = report.byCategory.map((row) => [
        row.name,
        row.total.toFixed(2),
        String(row.count),
      ]);

      const activityHeader = ["Atividade", "Total", "Quantidade"];
      const activityLines = report.byActivity.map((row) => [
        row.name,
        row.total.toFixed(2),
        String(row.count),
      ]);

      const accountHeader = ["Conta", "Total", "Quantidade"];
      const accountLines = report.byAccount.map((row) => [
        row.name,
        row.total.toFixed(2),
        String(row.count),
      ]);

      const sections = [
        ["RELATORIO FINANCEIRO AURORA"],
        ["Email", email],
        ["Data inicial", filters.dateFrom || "Todos"],
        ["Data final", filters.dateTo || "Todos"],
        ["Status", filters.status ? statusLabel(filters.status) : "Todos"],
        [],
        ["RESUMO"],
        ...summaryLines,
        [],
        ["LANCAMENTOS"],
        entryHeader,
        ...entryLines,
        [],
        ["TOTAL POR CATEGORIA"],
        categoryHeader,
        ...categoryLines,
        [],
        ["TOTAL POR ATIVIDADE"],
        activityHeader,
        ...activityLines,
        [],
        ["TOTAL POR CONTA"],
        accountHeader,
        ...accountLines,
      ];

      const csvContent = sections
        .map((row) => row.map((cell) => csvEscape(cell)).join(";"))
        .join("\n");

      const blob = new Blob(["\uFEFF" + csvContent], {
        type: "text/csv;charset=utf-8;",
      });

      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      const today = new Date().toISOString().slice(0, 10);

      link.href = url;
      link.download = `financeiro-aurora-relatorio-${today}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setMessage(
        "CSV exportado com sucesso. Sistema em constante atualização e pode haver momentos de instabilidade durante melhorias.",
      );
    } catch (exportError) {
      setError(
        exportError instanceof Error
          ? exportError.message
          : "Erro ao exportar relatório em CSV.",
      );
    } finally {
      setExporting(false);
    }
  }

  const quickActions = [
    {
      title: "Exportar CSV",
      action: exportCsv,
      disabled: loading || refreshing || exporting,
      kind: "green" as const,
    },
    {
      title: "Atualizar relatórios",
      action: () => loadData("refresh"),
      disabled: refreshing || loading || exporting,
      kind: "blue" as const,
    },
  ];

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(59,130,246,0.10), transparent 16%), radial-gradient(circle at right top, rgba(34,197,94,0.08), transparent 18%), linear-gradient(180deg, #041018 0%, #07131a 38%, #030506 100%)",
        color: "#eff6ff",
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
            background: "rgba(7, 17, 24, 0.86)",
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
                background: "rgba(59,130,246,0.10)",
                border: "1px solid rgba(59,130,246,0.28)",
                color: "#93c5fd",
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              Financeiro Aurora • Relatórios
            </div>

            <h1
              style={{
                margin: "16px 0 10px",
                fontSize: "clamp(28px, 5vw, 44px)",
                lineHeight: 1.05,
              }}
            >
              Relatórios premium do financeiro
            </h1>

            <p
              style={{
                margin: 0,
                color: "rgba(239,246,255,0.82)",
                fontSize: 16,
                lineHeight: 1.7,
              }}
            >
              Painel executivo com leitura de resultado, agrupamentos e visão
              estratégica dos lançamentos reais da empresa. Esta tela foi criada
              para apoiar decisão, conferência e expansão premium do Financeiro
              Aurora. Sistema em constante atualização e pode haver momentos de
              instabilidade durante melhorias.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 10,
            }}
          >
            <Link href="/finance" style={topButtonSecondary}>
              Voltar ao hub
            </Link>

            <Link href="/finance/entries" style={topButtonSecondary}>
              Ver lançamentos
            </Link>

            {quickActions.map((item) => (
              <button
                key={item.title}
                type="button"
                onClick={item.action}
                disabled={item.disabled}
                style={{
                  ...(item.kind === "green" ? topButtonGreen : topButtonBlue),
                  cursor: item.disabled ? "not-allowed" : "pointer",
                  opacity: item.disabled ? 0.7 : 1,
                }}
              >
                {item.title === "Exportar CSV" && exporting
                  ? "Exportando..."
                  : item.title === "Atualizar relatórios" && refreshing
                    ? "Atualizando..."
                    : item.title}
              </button>
            ))}
          </div>
        </section>

        <section
          style={{
            borderRadius: 24,
            padding: 20,
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(8, 18, 26, 0.90)",
            display: "grid",
            gap: 14,
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: 24 }}>Filtros do relatório</h2>
            <div
              style={{
                color: "rgba(239,246,255,0.72)",
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
          </div>

          <button
            type="button"
            onClick={clearFilters}
            style={{
              justifySelf: "start",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.10)",
              background: "rgba(255,255,255,0.04)",
              color: "#eff6ff",
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
              label: "Lançamentos",
              value: String(report.totalEntries),
              note: "Total de itens dentro do filtro atual",
            },
            {
              label: "Entradas",
              value: formatMoney(report.incomeTotal),
              note: "Receitas registradas no período",
            },
            {
              label: "Saídas",
              value: formatMoney(report.expenseTotal),
              note: "Despesas registradas no período",
            },
            {
              label: "Transferências",
              value: formatMoney(report.transferTotal),
              note: "Movimentações de transferência no período",
            },
            {
              label: "Resultado",
              value: formatMoney(report.result),
              note: "Entradas menos saídas",
            },
          ].map((card) => (
            <div
              key={card.label}
              style={{
                borderRadius: 22,
                padding: 18,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(8, 18, 26, 0.88)",
              }}
            >
              <div
                style={{
                  color: "rgba(239,246,255,0.72)",
                  fontSize: 13,
                  marginBottom: 10,
                }}
              >
                {card.label}
              </div>
              <div
                style={{
                  fontSize: "clamp(24px, 4vw, 30px)",
                  fontWeight: 900,
                  marginBottom: 8,
                  lineHeight: 1.1,
                  wordBreak: "break-word",
                }}
              >
                {loading ? "..." : card.value}
              </div>
              <div
                style={{
                  color: "rgba(239,246,255,0.62)",
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
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
            gap: 12,
          }}
        >
          {[
            {
              label: "Pagos",
              value: String(report.paidCount),
              note: "Lançamentos liquidados",
            },
            {
              label: "Pendentes",
              value: String(report.pendingCount),
              note: "Itens que exigem ação",
            },
            {
              label: "Cancelados",
              value: String(report.cancelledCount),
              note: "Itens anulados ou descartados",
            },
          ].map((card) => (
            <div
              key={card.label}
              style={{
                borderRadius: 20,
                padding: 18,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(8, 18, 26, 0.88)",
              }}
            >
              <div style={{ color: "rgba(239,246,255,0.72)", fontSize: 13 }}>
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
                  color: "rgba(239,246,255,0.62)",
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
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 16,
          }}
        >
          <GroupCard title="Total por categoria" rows={report.byCategory} />
          <GroupCard title="Total por atividade" rows={report.byActivity} />
          <GroupCard title="Total por conta" rows={report.byAccount} />
        </section>

        <section
          style={{
            borderRadius: 24,
            padding: 20,
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(8, 18, 26, 0.90)",
            display: "grid",
            gap: 14,
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: 24 }}>Lançamentos recentes</h2>
            <div
              style={{
                color: "rgba(239,246,255,0.72)",
                marginTop: 6,
                lineHeight: 1.6,
              }}
            >
              Últimos registros do filtro atual para conferência rápida.
            </div>
          </div>

          <div style={{ display: "grid", gap: 12 }}>
            {loading ? (
              <div style={emptyBoxStyle}>Carregando relatórios...</div>
            ) : report.recent.length === 0 ? (
              <div style={emptyBoxStyle}>Nenhum lançamento encontrado no filtro atual.</div>
            ) : (
              report.recent.map((item) => {
                const itemType = normalizeType(item.type || item.entry_type);

                return (
                  <article
                    key={item.id}
                    style={{
                      borderRadius: 18,
                      padding: 16,
                      border: "1px solid rgba(255,255,255,0.08)",
                      background: "rgba(255,255,255,0.03)",
                      display: "grid",
                      gap: 12,
                    }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gap: 8,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 18,
                          fontWeight: 800,
                          lineHeight: 1.4,
                        }}
                      >
                        {safeText(item.title) || safeText(item.description) || "Lançamento financeiro"}
                      </div>

                      <div
                        style={{
                          fontSize: 22,
                          fontWeight: 900,
                          color:
                            itemType === "income"
                              ? "#86efac"
                              : itemType === "transfer"
                                ? "#93c5fd"
                                : "#fca5a5",
                          wordBreak: "break-word",
                        }}
                      >
                        {itemType === "expense" ? "-" : ""}
                        {formatMoney(item.amount)}
                      </div>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                        gap: 10,
                        color: "rgba(239,246,255,0.80)",
                      }}
                    >
                      <InfoMini label="Data" value={formatDate(item.entry_date)} />
                      <InfoMini label="Categoria" value={categoryMap.get(item.category_id || "") || "-"} />
                      <InfoMini label="Atividade" value={activityMap.get(item.activity_id || "") || "-"} />
                      <InfoMini label="Conta" value={accountMap.get(item.account_id || "") || "-"} />
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

function GroupCard({ title, rows }: { title: string; rows: GroupRow[] }) {
  return (
    <section
      style={{
        borderRadius: 24,
        padding: 20,
        border: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(8, 18, 26, 0.90)",
        display: "grid",
        gap: 14,
      }}
    >
      <div>
        <h2 style={{ margin: 0, fontSize: 24 }}>{title}</h2>
        <div
          style={{
            color: "rgba(239,246,255,0.72)",
            marginTop: 6,
            lineHeight: 1.6,
          }}
        >
          Leitura consolidada do financeiro por agrupamento.
        </div>
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        {rows.length === 0 ? (
          <div style={emptyBoxStyle}>Nenhum dado disponível neste agrupamento.</div>
        ) : (
          rows.map((row) => (
            <div
              key={`${title}-${row.id}`}
              style={{
                borderRadius: 16,
                padding: "12px 14px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                display: "grid",
                gap: 6,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 10,
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    fontWeight: 800,
                    color: "#eff6ff",
                    lineHeight: 1.4,
                    wordBreak: "break-word",
                  }}
                >
                  {row.name}
                </div>

                <div
                  style={{
                    fontWeight: 900,
                    color: "#bfdbfe",
                    wordBreak: "break-word",
                  }}
                >
                  {formatMoney(row.total)}
                </div>
              </div>

              <div
                style={{
                  fontSize: 13,
                  color: "rgba(239,246,255,0.66)",
                }}
              >
                Quantidade de lançamentos: {row.count}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
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
          color: "rgba(239,246,255,0.62)",
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontWeight: 700,
          color: "#eff6ff",
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
  color: "#eff6ff",
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.04)",
  borderRadius: 14,
  padding: "12px 16px",
  fontWeight: 700,
  textAlign: "center",
};

const topButtonGreen: React.CSSProperties = {
  border: "1px solid rgba(34,197,94,0.28)",
  background: "linear-gradient(135deg, #16a34a, #22c55e)",
  color: "#04110a",
  borderRadius: 14,
  padding: "12px 16px",
  fontWeight: 900,
};

const topButtonBlue: React.CSSProperties = {
  border: "1px solid rgba(59,130,246,0.28)",
  background: "linear-gradient(135deg, #2563eb, #3b82f6)",
  color: "#eff6ff",
  borderRadius: 14,
  padding: "12px 16px",
  fontWeight: 900,
};

const filterLabelStyle: React.CSSProperties = {
  fontSize: 13,
  color: "rgba(239,246,255,0.72)",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.04)",
  color: "#eff6ff",
  padding: "12px 14px",
  outline: "none",
};

const emptyBoxStyle: React.CSSProperties = {
  borderRadius: 16,
  padding: "16px 14px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.03)",
  color: "rgba(239,246,255,0.72)",
  lineHeight: 1.6,
};