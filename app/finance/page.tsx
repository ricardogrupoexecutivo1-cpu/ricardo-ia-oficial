"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const FALLBACK_EMAIL = "grupoexecutivoservice1@gmail.com";

type CategoryItem = {
  id: string;
  name: string;
  type?: string | null;
  is_active: boolean | null;
};

type ActivityItem = {
  id: string;
  name: string;
  category_id: string | null;
  is_active: boolean | null;
};

type AccountItem = {
  id: string;
  name: string;
  type: string;
  currency: string | null;
  current_balance: number | null;
  is_active: boolean | null;
};

type CostCenterItem = {
  id: string;
  name: string;
  code: string | null;
  is_active: boolean | null;
};

type EntryItem = {
  id: string;
  title?: string | null;
  type: string | null;
  entry_type?: string | null;
  amount: number;
  status: string | null;
  is_active: boolean | null;
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

function formatMoney(value?: number | null, currency = "BRL"): string {
  const amount = Number(value || 0);

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: currency || "BRL",
  }).format(amount);
}

function normalizeType(value?: string | null): "income" | "expense" | "transfer" {
  const raw = String(value || "").trim().toLowerCase();

  if (raw === "income" || raw === "entrada") return "income";
  if (raw === "transfer" || raw === "transferência" || raw === "transferencia") {
    return "transfer";
  }

  return "expense";
}

export default function FinanceHubPage() {
  const [email, setEmail] = useState(FALLBACK_EMAIL);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [reconciling, setReconciling] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [accounts, setAccounts] = useState<AccountItem[]>([]);
  const [costCenters, setCostCenters] = useState<CostCenterItem[]>([]);
  const [entries, setEntries] = useState<EntryItem[]>([]);

  const stats = useMemo(() => {
    const totalCategories = categories.length;
    const totalActivities = activities.length;
    const totalAccounts = accounts.length;
    const totalCostCenters = costCenters.length;
    const totalEntries = entries.length;

    const activeCategories = categories.filter((item) => item.is_active !== false).length;
    const activeActivities = activities.filter((item) => item.is_active !== false).length;
    const activeAccounts = accounts.filter((item) => item.is_active !== false).length;
    const activeCostCenters = costCenters.filter((item) => item.is_active !== false).length;
    const activeEntries = entries.filter((item) => item.is_active !== false).length;

    const totalBalance = accounts.reduce(
      (acc, item) => acc + Number(item.current_balance || 0),
      0,
    );

    const totalIncome = entries
      .filter((item) => normalizeType(item.type || item.entry_type) === "income")
      .reduce((acc, item) => acc + Number(item.amount || 0), 0);

    const totalExpense = entries
      .filter((item) => normalizeType(item.type || item.entry_type) === "expense")
      .reduce((acc, item) => acc + Number(item.amount || 0), 0);

    const totalTransfers = entries.filter(
      (item) => normalizeType(item.type || item.entry_type) === "transfer",
    ).length;

    const netResult = totalIncome - totalExpense;

    return {
      totalCategories,
      totalActivities,
      totalAccounts,
      totalCostCenters,
      totalEntries,
      activeCategories,
      activeActivities,
      activeAccounts,
      activeCostCenters,
      activeEntries,
      totalBalance,
      totalIncome,
      totalExpense,
      totalTransfers,
      netResult,
    };
  }, [categories, activities, accounts, costCenters, entries]);

  async function loadHub(mode: "initial" | "refresh" = "initial") {
    try {
      if (mode === "initial") setLoading(true);
      if (mode === "refresh") setRefreshing(true);

      setError("");
      setMessage("");

      const resolvedEmail = getStoredEmail();
      setEmail(resolvedEmail);

      const [categoriesRes, activitiesRes, accountsRes, costCentersRes, entriesRes] =
        await Promise.all([
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
          fetch(
            `${getBaseUrl()}/api/finance/entries?email=${encodeURIComponent(resolvedEmail)}`,
            { method: "GET", cache: "no-store" },
          ),
        ]);

      const categoriesData = await categoriesRes.json();
      const activitiesData = await activitiesRes.json();
      const accountsData = await accountsRes.json();
      const costCentersData = await costCentersRes.json();
      const entriesData = await entriesRes.json();

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

      if (!entriesRes.ok || !entriesData.ok) {
        throw new Error(entriesData.error || "Erro ao carregar lançamentos.");
      }

      setCategories(Array.isArray(categoriesData.items) ? categoriesData.items : []);
      setActivities(Array.isArray(activitiesData.items) ? activitiesData.items : []);
      setAccounts(Array.isArray(accountsData.items) ? accountsData.items : []);
      setCostCenters(Array.isArray(costCentersData.items) ? costCentersData.items : []);
      setEntries(Array.isArray(entriesData.items) ? entriesData.items : []);

      setMessage(
        "Hub financeiro carregado com sucesso. Sistema em constante atualização e pode haver momentos de instabilidade durante melhorias.",
      );
    } catch (hubError) {
      setError(
        hubError instanceof Error
          ? hubError.message
          : "Erro ao carregar o hub financeiro.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  async function reconcileBalances() {
    try {
      setReconciling(true);
      setError("");
      setMessage("");

      const resolvedEmail = getStoredEmail();
      setEmail(resolvedEmail);

      const response = await fetch(`${getBaseUrl()}/api/finance/reconcile-balances`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: resolvedEmail,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Erro ao reconciliar saldos.");
      }

      const summary = data.summary || {};
      const totalReconciledBalance = Number(summary.total_reconciled_balance || 0);
      const totalDelta = Number(summary.total_delta || 0);

      await loadHub("refresh");

      setMessage(
        `Reconciliação concluída com sucesso. Saldo total reconciliado: ${formatMoney(totalReconciledBalance)}. Ajuste aplicado: ${formatMoney(totalDelta)}. Sistema em constante atualização e pode haver momentos de instabilidade durante melhorias.`,
      );
    } catch (reconcileError) {
      setError(
        reconcileError instanceof Error
          ? reconcileError.message
          : "Erro ao reconciliar saldo histórico.",
      );
    } finally {
      setReconciling(false);
    }
  }

  useEffect(() => {
    loadHub("initial");
  }, []);

  const moduleCards = [
    {
      title: "Categorias",
      href: "/finance/categories",
      value: stats.totalCategories,
      active: stats.activeCategories,
      note: "Base para receitas, despesas, investimentos e transferências.",
      accent: "rgba(34,197,94,0.22)",
      glow: "rgba(34,197,94,0.18)",
      emoji: "🟢",
    },
    {
      title: "Atividades",
      href: "/finance/activities",
      value: stats.totalActivities,
      active: stats.activeActivities,
      note: "Estrutura de operação real da empresa: vendas, aluguel, marketing e mais.",
      accent: "rgba(56,189,248,0.22)",
      glow: "rgba(56,189,248,0.18)",
      emoji: "🔵",
    },
    {
      title: "Contas",
      href: "/finance/accounts",
      value: stats.totalAccounts,
      active: stats.activeAccounts,
      note: "Controle de caixa, banco, PIX, cartão, digital e outras contas.",
      accent: "rgba(245,158,11,0.22)",
      glow: "rgba(245,158,11,0.18)",
      emoji: "🟠",
    },
    {
      title: "Centros de custo",
      href: "/finance/cost-centers",
      value: stats.totalCostCenters,
      active: stats.activeCostCenters,
      note: "Separação por área, operação, unidade, frota, comercial e administrativo.",
      accent: "rgba(168,85,247,0.22)",
      glow: "rgba(168,85,247,0.18)",
      emoji: "🟣",
    },
    {
      title: "Lançamentos",
      href: "/finance/entries",
      value: stats.totalEntries,
      active: stats.activeEntries,
      note: "Entradas, saídas e transferências ligadas à estrutura real do financeiro.",
      accent: "rgba(16,185,129,0.22)",
      glow: "rgba(16,185,129,0.18)",
      emoji: "💸",
    },
    {
      title: "Relatórios",
      href: "/finance/reports",
      value: stats.totalEntries,
      active: stats.activeEntries,
      note: "Leitura executiva com resultado, agrupamentos e visão premium do financeiro.",
      accent: "rgba(59,130,246,0.22)",
      glow: "rgba(59,130,246,0.18)",
      emoji: "📊",
    },
  ];

  const quickActions = [
    {
      title: "Abrir relatórios premium",
      href: "/finance/reports",
      note: "Leitura executiva e exportação CSV.",
    },
    {
      title: "Abrir lançamentos",
      href: "/finance/entries",
      note: "Filtrar e conferir movimentações.",
    },
    {
      title: "Abrir contas",
      href: "/finance/accounts",
      note: "Ver saldos e contas da empresa.",
    },
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
          maxWidth: 1220,
          margin: "0 auto",
          display: "grid",
          gap: 16,
        }}
      >
        <section
          style={{
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(7, 18, 13, 0.84)",
            backdropFilter: "blur(12px)",
            borderRadius: 28,
            padding: 22,
            boxShadow: "0 18px 60px rgba(0,0,0,0.28)",
            display: "grid",
            gap: 18,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 16,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <div style={{ maxWidth: 820 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 12px",
                  borderRadius: 999,
                  background: "rgba(34,197,94,0.10)",
                  border: "1px solid rgba(34,197,94,0.28)",
                  color: "#86efac",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                Financeiro Aurora
              </div>

              <h1
                style={{
                  margin: "16px 0 10px",
                  fontSize: "clamp(28px, 5vw, 44px)",
                  lineHeight: 1.05,
                }}
              >
                Hub financeiro empresarial editável
              </h1>

              <p
                style={{
                  margin: 0,
                  color: "rgba(236,253,245,0.82)",
                  fontSize: 16,
                  lineHeight: 1.7,
                }}
              >
                Centro principal para estruturar o financeiro privado por empresa
                com categorias, atividades, contas, centros de custo, lançamentos
                reais e relatórios premium. Esta base foi criada para crescer sem
                travar nomenclaturas e sem quebrar a operação atual. Sistema em
                constante atualização e pode haver momentos de instabilidade durante
                melhorias.
              </p>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 10,
            }}
          >
            <Link href="/" style={topButtonSecondary}>
              Voltar para home
            </Link>

            <button
              type="button"
              onClick={() => loadHub("refresh")}
              disabled={refreshing || loading || reconciling}
              style={{
                ...topButtonGreen,
                cursor: refreshing || loading || reconciling ? "not-allowed" : "pointer",
                opacity: refreshing || loading || reconciling ? 0.7 : 1,
              }}
            >
              {refreshing ? "Atualizando..." : "Atualizar hub"}
            </button>

            <button
              type="button"
              onClick={reconcileBalances}
              disabled={reconciling || loading || refreshing}
              style={{
                ...topButtonBlue,
                cursor: reconciling || loading || refreshing ? "not-allowed" : "pointer",
                opacity: reconciling || loading || refreshing ? 0.7 : 1,
              }}
            >
              {reconciling ? "Reconciliando..." : "Reconciliar saldo"}
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
              label: "Categorias",
              value: String(stats.totalCategories),
              note: "Estrutura financeira base",
            },
            {
              label: "Lançamentos",
              value: String(stats.totalEntries),
              note: "Movimentações reais registradas",
            },
            {
              label: "Entradas",
              value: formatMoney(stats.totalIncome, "BRL"),
              note: "Soma das entradas lançadas",
            },
            {
              label: "Saídas",
              value: formatMoney(stats.totalExpense, "BRL"),
              note: "Soma das saídas lançadas",
            },
            {
              label: "Resultado",
              value: formatMoney(stats.netResult, "BRL"),
              note: "Entradas menos saídas do financeiro",
            },
            {
              label: "Saldo das contas",
              value: formatMoney(stats.totalBalance, "BRL"),
              note: "Saldo consolidado atual das contas",
            },
          ].map((card) => (
            <div
              key={card.label}
              style={{
                borderRadius: 22,
                padding: 18,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(8, 19, 15, 0.88)",
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
                {card.value}
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
            background: "rgba(8, 19, 15, 0.90)",
            display: "grid",
            gap: 12,
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: 24,
              }}
            >
              Ações rápidas
            </h2>
            <div
              style={{
                marginTop: 6,
                color: "rgba(236,253,245,0.74)",
                lineHeight: 1.6,
              }}
            >
              Atalhos para a operação principal do financeiro no dia a dia.
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 12,
            }}
          >
            {quickActions.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                style={{
                  textDecoration: "none",
                  color: "#ecfdf5",
                  borderRadius: 18,
                  padding: 16,
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.03)",
                  display: "grid",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: 16,
                  }}
                >
                  {item.title}
                </div>
                <div
                  style={{
                    color: "rgba(236,253,245,0.68)",
                    lineHeight: 1.5,
                    fontSize: 13,
                  }}
                >
                  {item.note}
                </div>
                <div
                  style={{
                    fontWeight: 800,
                    color: "#bbf7d0",
                  }}
                >
                  Abrir →
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: 16,
          }}
        >
          {moduleCards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              style={{
                textDecoration: "none",
                color: "#ecfdf5",
                borderRadius: 24,
                padding: 20,
                border: "1px solid rgba(255,255,255,0.08)",
                background: `linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.03)), ${card.glow}`,
                boxShadow: "0 14px 40px rgba(0,0,0,0.22)",
                display: "grid",
                gap: 12,
                minHeight: 180,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 800,
                    lineHeight: 1.4,
                  }}
                >
                  {card.emoji} {card.title}
                </div>

                <span
                  style={{
                    borderRadius: 999,
                    padding: "6px 10px",
                    background: card.accent,
                    border: "1px solid rgba(255,255,255,0.08)",
                    fontSize: 12,
                    fontWeight: 800,
                    whiteSpace: "nowrap",
                  }}
                >
                  Ativas: {card.active}
                </span>
              </div>

              <div
                style={{
                  fontSize: "clamp(30px, 6vw, 38px)",
                  fontWeight: 900,
                  lineHeight: 1,
                }}
              >
                {loading ? "..." : card.value}
              </div>

              <div
                style={{
                  color: "rgba(236,253,245,0.72)",
                  lineHeight: 1.65,
                  fontSize: 14,
                }}
              >
                {card.note}
              </div>

              <div
                style={{
                  marginTop: "auto",
                  fontWeight: 800,
                  color: "rgba(236,253,245,0.92)",
                }}
              >
                Abrir módulo →
              </div>
            </Link>
          ))}
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 18,
          }}
        >
          <div
            style={{
              borderRadius: 24,
              padding: 22,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(8, 19, 15, 0.90)",
            }}
          >
            <h2
              style={{
                marginTop: 0,
                marginBottom: 10,
                fontSize: 24,
              }}
            >
              Estrutura já criada
            </h2>

            <div
              style={{
                display: "grid",
                gap: 12,
              }}
            >
              {[
                `Categorias cadastradas: ${stats.totalCategories}`,
                `Atividades cadastradas: ${stats.totalActivities}`,
                `Contas cadastradas: ${stats.totalAccounts}`,
                `Centros de custo cadastrados: ${stats.totalCostCenters}`,
                `Lançamentos cadastrados: ${stats.totalEntries}`,
                `Entradas registradas: ${formatMoney(stats.totalIncome, "BRL")}`,
                `Saídas registradas: ${formatMoney(stats.totalExpense, "BRL")}`,
                `Resultado financeiro: ${formatMoney(stats.netResult, "BRL")}`,
                `Saldo atual das contas: ${formatMoney(stats.totalBalance, "BRL")}`,
                `Transferências cadastradas: ${stats.totalTransfers}`,
                `E-mail em uso no fallback: ${email}`,
              ].map((text) => (
                <div
                  key={text}
                  style={{
                    borderRadius: 16,
                    padding: "12px 14px",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    color: "rgba(236,253,245,0.82)",
                    lineHeight: 1.6,
                    wordBreak: "break-word",
                  }}
                >
                  {text}
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              borderRadius: 24,
              padding: 22,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(8, 19, 15, 0.90)",
              display: "grid",
              gap: 14,
            }}
          >
            <div>
              <h2
                style={{
                  marginTop: 0,
                  marginBottom: 10,
                  fontSize: 24,
                }}
              >
                Próximo passo
              </h2>

              <div
                style={{
                  color: "rgba(236,253,245,0.78)",
                  lineHeight: 1.7,
                  fontSize: 14,
                }}
              >
                O próximo bloco profissional é blindar mobile e UX fina também nos
                relatórios e lançamentos, depois fazer o git ready com a base
                financeira estável, forte e vendável.
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gap: 10,
              }}
            >
              {[
                "1. Ajustar mobile fino nos relatórios",
                "2. Ajustar mobile fino nos lançamentos",
                "3. Fazer git ready com base estável",
                "4. Subir contabilidade integrada",
                "5. Subir folha de pagamento",
              ].map((step) => (
                <div
                  key={step}
                  style={{
                    borderRadius: 14,
                    padding: "10px 12px",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    color: "rgba(236,253,245,0.82)",
                  }}
                >
                  {step}
                </div>
              ))}
            </div>

            <Link
              href="/finance/reports"
              style={{
                display: "inline-flex",
                justifyContent: "center",
                textDecoration: "none",
                color: "#04110a",
                background: "linear-gradient(135deg, #60a5fa, #3b82f6)",
                borderRadius: 14,
                padding: "12px 16px",
                fontWeight: 900,
              }}
            >
              Abrir relatórios premium
            </Link>
          </div>
        </section>
      </div>
    </main>
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