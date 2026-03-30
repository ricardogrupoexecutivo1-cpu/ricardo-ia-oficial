import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

type ModuleRow = {
  id: string;
  module_name?: string | null;
  module_slug?: string | null;
  route_path?: string | null;
  payload?: any;
  project_id?: string | null;
  owner_email?: string | null;
};

function getSupabaseAdmin() {
  const supabaseUrl =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE;

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function text(value: unknown) {
  if (typeof value !== "string") return "";
  return value.trim();
}

function prettyTitle(value: string) {
  return value
    .split("-")
    .filter(Boolean)
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
    .join(" ");
}

async function getModuleBySlug(slug: string): Promise<ModuleRow | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("app_builder_modules")
    .select("*")
    .eq("module_slug", slug)
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;
  return data as ModuleRow;
}

export default async function DynamicModulePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const slug = text(resolvedParams?.slug);
  const moduleData = await getModuleBySlug(slug);

  if (!moduleData) {
    return (
      <main style={styles.main}>
        <div style={styles.container}>
          <div style={styles.badge}>Módulo não encontrado</div>
          <h1 style={styles.title}>Esse módulo ainda não foi carregado</h1>
          <p style={styles.text}>
            A rota dinâmica foi criada, mas este slug ainda não foi encontrado no banco
            do App Builder.
          </p>

          <div style={styles.actions}>
            <Link href="/app-builder" style={styles.primaryButton}>
              Voltar ao App Builder
            </Link>
            <Link href="/" style={styles.secondaryButton}>
              Ir para Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const payload = moduleData.payload || {};
  const moduleName =
    text(moduleData.module_name) || prettyTitle(text(moduleData.module_slug));
  const routePath = text(moduleData.route_path) || `/${slug}`;

  return (
    <main style={styles.main}>
      <div style={styles.container}>
        <div style={styles.topNav}>
          <Link href="/" style={styles.navLink}>
            Home
          </Link>
          <Link href="/app-builder" style={styles.navLink}>
            App Builder
          </Link>
          <Link href={routePath} style={styles.navLink}>
            Atualizar módulo
          </Link>
        </div>

        <section style={styles.heroCard}>
          <div style={styles.badge}>Módulo dinâmico ativo</div>
          <h1 style={styles.title}>{moduleName}</h1>
          <p style={styles.text}>
            Este módulo foi aberto a partir da estrutura técnica salva no Aurora App Builder.
            A rota já não cai mais em 404 e agora pode ser usada como base para evolução real.
          </p>

          <div style={styles.infoGrid}>
            <InfoCard label="Slug" value={text(moduleData.module_slug) || "-"} />
            <InfoCard label="Rota" value={routePath} />
            <InfoCard label="Projeto" value={text(moduleData.project_id) || "-"} />
            <InfoCard label="Responsável" value={text(moduleData.owner_email) || "-"} />
          </div>
        </section>

        <section style={styles.contentCard}>
          <h2 style={styles.sectionTitle}>Resumo do módulo</h2>

          <div style={styles.summaryGrid}>
            <SummaryItem
              title="Nome do app"
              value={text(payload?.appName) || "Não informado"}
            />
            <SummaryItem
              title="Tipo"
              value={text(payload?.appType) || "Não informado"}
            />
            <SummaryItem
              title="Público-alvo"
              value={text(payload?.targetAudience) || "Não informado"}
            />
            <SummaryItem
              title="Objetivo"
              value={text(payload?.businessGoal) || "Não informado"}
            />
            <SummaryItem
              title="Telefone"
              value={text(payload?.contactPhone) || "Não informado"}
            />
            <SummaryItem
              title="E-mail"
              value={text(payload?.contactEmail) || "Não informado"}
            />
          </div>

          <div style={{ marginTop: 22 }}>
            <h3 style={styles.blockTitle}>Descrição da marca</h3>
            <div style={styles.blockBox}>
              {text(payload?.brandDescription) || "Descrição ainda não informada."}
            </div>
          </div>

          <div style={{ marginTop: 22 }}>
            <h3 style={styles.blockTitle}>Payload técnico</h3>
            <pre style={styles.codeBox}>
              {JSON.stringify(payload, null, 2)}
            </pre>
          </div>

          <div style={styles.actions}>
            <Link href="/app-builder" style={styles.primaryButton}>
              Voltar ao App Builder
            </Link>
            <Link href="/" style={styles.secondaryButton}>
              Ir para Home
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div style={styles.infoCard}>
      <div style={styles.infoLabel}>{label}</div>
      <div style={styles.infoValue}>{value}</div>
    </div>
  );
}

function SummaryItem({ title, value }: { title: string; value: string }) {
  return (
    <div style={styles.summaryCard}>
      <div style={styles.summaryTitle}>{title}</div>
      <div style={styles.summaryValue}>{value}</div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top, rgba(16,185,129,0.14), transparent 25%), #050816",
    color: "#e5eef8",
    padding: "32px 16px 80px",
  },
  container: {
    maxWidth: 1180,
    margin: "0 auto",
  },
  topNav: {
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 16,
  },
  navLink: {
    color: "#dbeafe",
    textDecoration: "none",
    border: "1px solid rgba(148,163,184,0.22)",
    borderRadius: 999,
    padding: "10px 14px",
    fontWeight: 700,
  },
  heroCard: {
    border: "1px solid rgba(148,163,184,0.18)",
    background: "rgba(15,23,42,0.72)",
    backdropFilter: "blur(10px)",
    borderRadius: 24,
    padding: 24,
    boxShadow: "0 20px 80px rgba(0,0,0,0.35)",
    marginBottom: 24,
  },
  contentCard: {
    border: "1px solid rgba(148,163,184,0.18)",
    background: "rgba(15,23,42,0.72)",
    backdropFilter: "blur(10px)",
    borderRadius: 24,
    padding: 24,
    boxShadow: "0 20px 80px rgba(0,0,0,0.35)",
  },
  badge: {
    display: "inline-flex",
    padding: "8px 12px",
    borderRadius: 999,
    background: "rgba(16,185,129,0.14)",
    border: "1px solid rgba(16,185,129,0.25)",
    color: "#86efac",
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: 0.3,
    marginBottom: 14,
  },
  title: {
    fontSize: 38,
    lineHeight: 1.05,
    margin: 0,
  },
  text: {
    color: "#94a3b8",
    marginTop: 14,
    maxWidth: 940,
    fontSize: 16,
    lineHeight: 1.7,
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 16,
    marginTop: 24,
  },
  infoCard: {
    borderRadius: 20,
    padding: 18,
    background: "rgba(2,6,23,0.45)",
    border: "1px solid rgba(148,163,184,0.16)",
  },
  infoLabel: {
    fontSize: 12,
    color: "#94a3b8",
  },
  infoValue: {
    fontWeight: 800,
    fontSize: 18,
    marginTop: 8,
    wordBreak: "break-word",
  },
  sectionTitle: {
    fontSize: 24,
    margin: 0,
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 16,
    marginTop: 18,
  },
  summaryCard: {
    borderRadius: 18,
    padding: 18,
    background: "rgba(2,6,23,0.45)",
    border: "1px solid rgba(148,163,184,0.16)",
  },
  summaryTitle: {
    fontSize: 13,
    color: "#94a3b8",
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 700,
    color: "#f8fafc",
    lineHeight: 1.6,
    wordBreak: "break-word",
  },
  blockTitle: {
    fontSize: 18,
    margin: "0 0 10px 0",
  },
  blockBox: {
    borderRadius: 16,
    padding: 16,
    background: "rgba(2,6,23,0.45)",
    border: "1px solid rgba(148,163,184,0.16)",
    lineHeight: 1.7,
    color: "#e2e8f0",
  },
  codeBox: {
    borderRadius: 16,
    padding: 16,
    background: "rgba(2,6,23,0.70)",
    border: "1px solid rgba(148,163,184,0.16)",
    lineHeight: 1.6,
    color: "#bfdbfe",
    overflowX: "auto",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    fontSize: 13,
  },
  actions: {
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 22,
  },
  primaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
    padding: "0 18px",
    borderRadius: 14,
    background: "linear-gradient(135deg, #22c55e 0%, #14b8a6 100%)",
    color: "#03130d",
    textDecoration: "none",
    fontWeight: 900,
  },
  secondaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
    padding: "0 18px",
    borderRadius: 14,
    background: "rgba(15,23,42,0.72)",
    color: "#f8fafc",
    textDecoration: "none",
    fontWeight: 900,
    border: "1px solid rgba(148,163,184,0.18)",
  },
};