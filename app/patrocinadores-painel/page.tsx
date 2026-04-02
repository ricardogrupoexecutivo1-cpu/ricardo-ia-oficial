import https from "node:https";
import Link from "next/link";
import PatrocinadoresPainelClient from "@/components/patrocinadores/patrocinadores-painel-client";

export const runtime = "nodejs";

type SponsorLeadDbRow = {
  id: string;

  company_name?: string | null;
  contact_name?: string | null;
  responsible_name?: string | null;

  whatsapp?: string | null;
  email?: string | null;
  segment?: string | null;

  plan?: string | null;
  plan_name?: string | null;

  website?: string | null;
  site_url?: string | null;

  campaign_description?: string | null;
  logo_url?: string | null;

  accepted_terms?: boolean | null;
  terms_accepted?: boolean | null;

  status?: string | null;

  notes?: string | null;
  observations?: string | null;

  created_at?: string | null;
  updated_at?: string | null;

  asaas_payment_link?: string | null;
  payment_link?: string | null;
  payment_status?: string | null;
};

type SponsorLeadRow = {
  id: string;
  company_name: string;
  contact_name: string;
  whatsapp: string | null;
  email: string;
  segment: string;
  plan: string;
  website: string | null;
  campaign_description: string | null;
  logo_url: string | null;
  accepted_terms: boolean;
  status: string;
  notes: string | null;
  created_at: string | null;
  updated_at: string | null;
  asaas_payment_link: string | null;
  payment_link: string | null;
  payment_status: string | null;
};

type SponsorLeadsResult = {
  leads: SponsorLeadRow[];
  errorMessage: string | null;
};

function getSupabaseEnv() {
  const supabaseUrl =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  if (!supabaseUrl) {
    throw new Error("SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL não encontrado.");
  }

  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY não encontrada.");
  }

  const parsed = new URL(supabaseUrl);

  return {
    origin: parsed.origin,
    hostname: parsed.hostname,
    serviceRoleKey,
  };
}

function normalizeSponsorLead(row: SponsorLeadDbRow): SponsorLeadRow {
  return {
    id: row.id,
    company_name: row.company_name || "-",
    contact_name: row.contact_name || row.responsible_name || "-",
    whatsapp: row.whatsapp || null,
    email: row.email || "-",
    segment: row.segment || "-",
    plan: row.plan || row.plan_name || "-",
    website: row.website || row.site_url || null,
    campaign_description: row.campaign_description || null,
    logo_url: row.logo_url || null,
    accepted_terms: Boolean(row.accepted_terms ?? row.terms_accepted ?? false),
    status: row.status || "lead",
    notes: row.notes || row.observations || null,
    created_at: row.created_at || null,
    updated_at: row.updated_at || null,
    asaas_payment_link: row.asaas_payment_link || null,
    payment_link: row.payment_link || null,
    payment_status: row.payment_status || null,
  };
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function requestJson(path: string): Promise<unknown> {
  const { hostname, serviceRoleKey } = getSupabaseEnv();

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname,
        path,
        method: "GET",
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
          Accept: "application/json",
        },
      },
      (res) => {
        let raw = "";

        res.setEncoding("utf8");
        res.on("data", (chunk) => {
          raw += chunk;
        });

        res.on("end", () => {
          const statusCode = res.statusCode ?? 500;

          if (statusCode < 200 || statusCode >= 300) {
            reject(
              new Error(
                `Supabase HTTP ${statusCode}: ${raw || "Resposta vazia"}`,
              ),
            );
            return;
          }

          try {
            const parsed = raw ? JSON.parse(raw) : [];
            resolve(parsed);
          } catch (error) {
            reject(
              error instanceof Error
                ? error
                : new Error("Não foi possível interpretar a resposta JSON."),
            );
          }
        });
      },
    );

    req.on("error", (error) => {
      reject(error);
    });

    req.setTimeout(12000, () => {
      req.destroy(new Error("Tempo de leitura do Supabase excedido."));
    });

    req.end();
  });
}

async function fetchSponsorLeadsOnce(): Promise<SponsorLeadDbRow[]> {
  const rows = (await requestJson(
    "/rest/v1/sponsor_leads?select=*&order=created_at.desc&limit=50",
  )) as SponsorLeadDbRow[];

  console.log("🔥 DEBUG SUPABASE HTTPS", {
    TOTAL: rows?.length ?? 0,
    DATA: rows,
    ERROR: null,
  });

  return Array.isArray(rows) ? rows : [];
}

async function getSponsorLeads(): Promise<SponsorLeadsResult> {
  const maxAttempts = 3;
  let lastError: unknown = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const rows = await fetchSponsorLeadsOnce();

      return {
        leads: rows.map(normalizeSponsorLead),
        errorMessage: null,
      };
    } catch (error) {
      lastError = error;

      console.error(
        `❌ ERRO AO CARREGAR PATROCINADORES | tentativa ${attempt}/${maxAttempts}`,
        error,
      );

      if (attempt < maxAttempts) {
        await sleep(700 * attempt);
      }
    }
  }

  const message =
    lastError instanceof Error
      ? lastError.message
      : "Erro inesperado ao consultar patrocinadores.";

  return {
    leads: [],
    errorMessage: message,
  };
}

export default async function PatrocinadoresPainelPage() {
  const { leads, errorMessage } = await getSponsorLeads();

  const total = leads.length;
  const leadCount = leads.filter((item) => item.status === "lead").length;
  const analysisCount = leads.filter(
    (item) => item.status === "em_analise",
  ).length;
  const approvedCount = leads.filter(
    (item) =>
      item.status === "aprovado" ||
      item.status === "aguardando_pagamento" ||
      item.status === "pago",
  ).length;
  const activeCount = leads.filter((item) => item.status === "ativo").length;

  const painelItems = leads.map((lead) => ({
    id: lead.id,
    nome: lead.company_name,
    responsavel: lead.contact_name,
    whatsapp: lead.whatsapp,
    email: lead.email,
    segmento: lead.segment,
    plano: lead.plan,
    campaign_description: lead.campaign_description,
    observacoes: lead.notes,
    status: lead.status,
    commercial_status: lead.status,
    payment_status: lead.payment_status,
    asaas_payment_link: lead.asaas_payment_link,
    payment_link: lead.payment_link,
    created_at: lead.created_at,
    updated_at: lead.updated_at,
  }));

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "24px 16px 80px",
        background:
          "radial-gradient(circle at top, rgba(59,130,246,0.10), transparent 18%), radial-gradient(circle at left, rgba(34,197,94,0.10), transparent 24%), linear-gradient(180deg, #eef6ff 0%, #f7fbff 36%, #edf7f3 100%)",
      }}
    >
      <div
        style={{
          maxWidth: 1260,
          margin: "0 auto",
          display: "grid",
          gap: 18,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <TopLink href="/" label="Voltar à Home" color="#2563eb" />
          <TopLink
            href="/patrocinadores"
            label="Ver patrocinadores"
            color="#0f766e"
          />
          <TopLink
            href="/patrocinador-cadastro"
            label="Novo patrocinador"
            color="#2563eb"
          />
          <TopLink href="/guardiao" label="Ir para o Guardião" color="#0f766e" />
        </div>

        <section
          style={{
            border: "1px solid rgba(15,23,42,0.08)",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.88), rgba(255,255,255,0.74))",
            borderRadius: 28,
            padding: "26px 22px",
            boxShadow: "0 18px 60px rgba(15,23,42,0.08)",
            display: "grid",
            gap: 18,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              width: "fit-content",
              alignItems: "center",
              gap: 8,
              padding: "8px 12px",
              borderRadius: 999,
              background: "rgba(37,99,235,0.08)",
              border: "1px solid rgba(37,99,235,0.16)",
              color: "#2563eb",
              fontSize: 13,
              fontWeight: 800,
            }}
          >
            📊 Painel de patrocinadores Aurora
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "clamp(30px, 6vw, 48px)",
              lineHeight: 1.02,
              letterSpacing: "-0.03em",
              color: "#0f172a",
            }}
          >
            Leads comerciais de patrocinadores
          </h1>

          <p
            style={{
              margin: 0,
              color: "rgba(15,23,42,0.74)",
              fontSize: 18,
              lineHeight: 1.7,
              maxWidth: 980,
              fontWeight: 700,
            }}
          >
            Painel central para acompanhar empresas interessadas em patrocinar
            segmentos da Aurora com clareza, segurança e transparência comercial.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 12,
            }}
          >
            <MiniInfo
              title="Total"
              value={String(total)}
              text="Quantidade total de leads comerciais recebidos."
            />
            <MiniInfo
              title="Leads"
              value={String(leadCount)}
              text="Entradas novas aguardando análise comercial."
            />
            <MiniInfo
              title="Em análise"
              value={String(analysisCount)}
              text="Leads em avaliação de segmento, campanha e viabilidade."
            />
            <MiniInfo
              title="Aprovados"
              value={String(approvedCount)}
              text="Leads aprovados para avançar para contrato e pagamento."
            />
            <MiniInfo
              title="Ativos"
              value={String(activeCount)}
              text="Patrocinadores já ativos na operação comercial da Aurora."
            />
          </div>
        </section>

        {errorMessage ? (
          <section
            style={{
              border: "1px solid rgba(239,68,68,0.16)",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,255,255,0.82))",
              borderRadius: 24,
              padding: "22px 18px",
              boxShadow: "0 18px 60px rgba(15,23,42,0.06)",
              display: "grid",
              gap: 10,
            }}
          >
            <div
              style={{
                display: "inline-flex",
                width: "fit-content",
                alignItems: "center",
                padding: "8px 12px",
                borderRadius: 999,
                background: "rgba(239,68,68,0.10)",
                border: "1px solid rgba(239,68,68,0.18)",
                color: "#b91c1c",
                fontSize: 13,
                fontWeight: 800,
              }}
            >
              Erro de leitura
            </div>

            <h2
              style={{
                margin: 0,
                fontSize: 24,
                fontWeight: 900,
                color: "#0f172a",
              }}
            >
              Não foi possível carregar os patrocinadores agora
            </h2>

            <p
              style={{
                margin: 0,
                color: "rgba(15,23,42,0.72)",
                lineHeight: 1.7,
                fontWeight: 700,
              }}
            >
              O painel foi blindado para não cair por completo quando houver
              falha temporária de conexão, credencial ou leitura no banco.
            </p>

            <div
              style={{
                borderRadius: 18,
                padding: "14px 16px",
                background: "rgba(248,250,252,0.9)",
                border: "1px solid rgba(15,23,42,0.06)",
                color: "#0f172a",
                fontSize: 14,
                lineHeight: 1.7,
                fontWeight: 700,
                wordBreak: "break-word",
              }}
            >
              {errorMessage}
            </div>
          </section>
        ) : null}

        {!errorMessage && leads.length === 0 ? (
          <section
            style={{
              border: "1px solid rgba(15,23,42,0.08)",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.88), rgba(255,255,255,0.74))",
              borderRadius: 24,
              padding: "22px 18px",
              boxShadow: "0 18px 60px rgba(15,23,42,0.06)",
              display: "grid",
              gap: 10,
            }}
          >
            <h2 style={{ margin: 0, fontSize: 24, fontWeight: 900 }}>
              Nenhum lead cadastrado ainda
            </h2>
            <p
              style={{
                margin: 0,
                color: "rgba(15,23,42,0.72)",
                lineHeight: 1.7,
              }}
            >
              Quando uma empresa preencher o formulário comercial, ela aparecerá
              aqui com status inicial de lead.
            </p>
          </section>
        ) : null}

        {!errorMessage && leads.length > 0 ? (
          <PatrocinadoresPainelClient items={painelItems} />
        ) : null}
      </div>
    </main>
  );
}

function TopLink({
  href,
  label,
  color,
}: {
  href: string;
  label: string;
  color: string;
}) {
  return (
    <Link
      href={href}
      style={{
        textDecoration: "none",
        border: `1px solid ${color}`,
        background: "rgba(255,255,255,0.76)",
        borderRadius: 14,
        padding: "10px 14px",
        fontWeight: 800,
        boxShadow: "0 8px 18px rgba(15,23,42,0.04)",
        color,
      }}
    >
      {label}
    </Link>
  );
}

function MiniInfo({
  title,
  value,
  text,
}: {
  title: string;
  value: string;
  text: string;
}) {
  return (
    <div
      style={{
        borderRadius: 18,
        padding: "16px",
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.80), rgba(255,255,255,0.64))",
        border: "1px solid rgba(15,23,42,0.08)",
        display: "grid",
        gap: 8,
        boxShadow: "0 8px 18px rgba(15,23,42,0.04)",
      }}
    >
      <div
        style={{
          fontSize: 12,
          fontWeight: 900,
          color: "#2563eb",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: 22,
          fontWeight: 900,
          color: "#0f172a",
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 14,
          lineHeight: 1.6,
          color: "rgba(15,23,42,0.62)",
        }}
      >
        {text}
      </div>
    </div>
  );
}