import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

type CadastroItem = {
  id: string;
  empresa?: string | null;
  area?: string | null;
  atividade?: string | null;
  atividade_personalizada?: string | null;
  abrangencia?: string | null;
  descricao?: string | null;
  whatsapp?: string | null;
  created_at?: string | null;
};

function getSupabase() {
  const url =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;

  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.error("Supabase não configurado");
    return null;
  }

  return createClient(url, key);
}

function formatWhatsappLink(value: string) {
  return `https://wa.me/${value.replace(/\D/g, "")}`;
}

export default async function ExplorarPage() {
  const supabase = getSupabase();

  let cadastros: CadastroItem[] = [];

  if (supabase) {
    const { data, error } = await supabase
      .from("cadastros")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar cadastros:", error.message);
    }

    cadastros = (data as CadastroItem[]) || [];
  }

  const totalEmpresas = cadastros.length;

  return (
    <main style={styles.main}>
      <div style={styles.container}>
        <header style={styles.topbar}>
          <div style={styles.brandWrap}>
            <div style={styles.brandMini}>ricardoiaoficial.com</div>
            <div style={styles.brandTitle}>Aurora IA • Explorar empresas</div>
          </div>

          <div style={styles.topActions}>
            <Link href="/" style={styles.navButton}>
              Home
            </Link>
            <Link href="/chat" style={styles.navButton}>
              Chat
            </Link>
            <Link href="/cadastro-geral" style={styles.primaryNavButton}>
              Cadastrar empresa
            </Link>
          </div>
        </header>

        <section style={styles.heroCard}>
          <div style={styles.heroBadge}>Busca profissional da Aurora</div>

          <h1 style={styles.heroTitle}>Empresas na Aurora</h1>

          <p style={styles.heroText}>
            Encontre empresas, fornecedores e oportunidades em uma vitrine mais
            clara, premium e confiável.
          </p>

          <p style={styles.heroSubText}>
            Find companies, suppliers and opportunities with a cleaner and more
            international presentation.
          </p>

          <div style={styles.heroActions}>
            <Link href="/cadastro-geral" style={styles.primaryButton}>
              Cadastrar empresa
            </Link>
            <Link href="/chat" style={styles.secondaryButton}>
              Abrir Aurora IA
            </Link>
          </div>

          <div style={styles.metricsGrid}>
            <MiniMetric
              label="Empresas"
              value={String(totalEmpresas)}
              text="Cadastros carregados nesta vitrine."
            />
            <MiniMetric
              label="Busca"
              value="Ativa"
              text="Exploração visual em padrão premium."
            />
            <MiniMetric
              label="Ecossistema"
              value="Aberto"
              text="Empresas, fornecedores e oportunidades."
            />
          </div>
        </section>

        {cadastros.length > 0 ? (
          <section style={styles.resultsSection}>
            <div style={styles.resultsHeader}>
              <div>
                <h2 style={styles.resultsTitle}>Empresas encontradas</h2>
                <p style={styles.resultsText}>
                  Cards mais limpos, leitura melhor e contato direto quando disponível.
                </p>
              </div>

              <div style={styles.resultsCounter}>
                {totalEmpresas} resultado{totalEmpresas === 1 ? "" : "s"}
              </div>
            </div>

            <div style={styles.grid}>
              {cadastros.map((item) => {
                const atividadeTexto = [item.atividade, item.atividade_personalizada]
                  .filter(Boolean)
                  .join(" • ");

                return (
                  <article key={item.id} style={styles.card}>
                    <div style={styles.cardTop}>
                      <div style={styles.cardTitle}>
                        {item.empresa || "Empresa não informada"}
                      </div>

                      {item.area ? (
                        <div style={styles.tag}>
                          {item.area}
                        </div>
                      ) : null}
                    </div>

                    {atividadeTexto ? (
                      <div style={styles.textLine}>
                        <strong>Atuação:</strong> {atividadeTexto}
                      </div>
                    ) : null}

                    {item.abrangencia ? (
                      <div style={styles.textLine}>
                        <strong>Cobertura:</strong> {item.abrangencia}
                      </div>
                    ) : null}

                    {item.descricao ? (
                      <p style={styles.description}>{item.descricao}</p>
                    ) : (
                      <p style={styles.descriptionMuted}>
                        Cadastro sem descrição detalhada no momento.
                      </p>
                    )}

                    <div style={styles.cardFooter}>
                      {item.whatsapp ? (
                        <a
                          href={formatWhatsappLink(item.whatsapp)}
                          target="_blank"
                          rel="noreferrer"
                          style={styles.cardPrimaryButton}
                        >
                          WhatsApp
                        </a>
                      ) : (
                        <div style={styles.noContact}>
                          Contato ainda não liberado
                        </div>
                      )}

                      <Link href="/cadastro-geral" style={styles.cardSecondaryButton}>
                        Criar cadastro
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ) : (
          <section style={styles.emptySection}>
            <div style={styles.emptyBadge}>Explorar Aurora</div>
            <h2 style={styles.emptyTitle}>Nenhuma empresa cadastrada ainda</h2>
            <p style={styles.emptyText}>
              Esta vitrine ainda está em construção comercial. O próximo cadastro pode
              abrir a primeira presença nesta área da Aurora.
            </p>

            <div style={styles.emptyActions}>
              <Link href="/cadastro-geral" style={styles.primaryButton}>
                Cadastrar primeira empresa
              </Link>
              <Link href="/chat" style={styles.secondaryButton}>
                Falar com a Aurora
              </Link>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function MiniMetric({
  label,
  value,
  text,
}: {
  label: string;
  value: string;
  text: string;
}) {
  return (
    <div style={styles.metricCard}>
      <div style={styles.metricLabel}>{label}</div>
      <div style={styles.metricValue}>{value}</div>
      <div style={styles.metricText}>{text}</div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top, rgba(59,130,246,0.10), transparent 18%), radial-gradient(circle at left, rgba(34,197,94,0.10), transparent 24%), linear-gradient(180deg, #eef6ff 0%, #f7fbff 36%, #edf7f3 100%)",
    color: "#0f172a",
    padding: "24px 16px 70px",
  },
  container: {
    maxWidth: 1240,
    margin: "0 auto",
    display: "grid",
    gap: 18,
  },
  topbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 14,
    flexWrap: "wrap",
    border: "1px solid rgba(15,23,42,0.08)",
    background: "rgba(255,255,255,0.78)",
    backdropFilter: "blur(14px)",
    borderRadius: 22,
    padding: "12px 14px",
    boxShadow: "0 18px 42px rgba(15,23,42,0.07)",
  },
  brandWrap: {
    display: "grid",
    gap: 3,
  },
  brandMini: {
    fontSize: 11,
    fontWeight: 900,
    letterSpacing: "0.08em",
    color: "#2563eb",
    textTransform: "uppercase",
  },
  brandTitle: {
    fontSize: 17,
    fontWeight: 900,
    lineHeight: 1.2,
    color: "#0f172a",
  },
  topActions: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
  },
  navButton: {
    textDecoration: "none",
    color: "#0f172a",
    border: "1px solid rgba(15,23,42,0.08)",
    background: "rgba(255,255,255,0.72)",
    borderRadius: 11,
    padding: "9px 12px",
    fontWeight: 800,
    boxShadow: "0 8px 16px rgba(15,23,42,0.04)",
    fontSize: 13,
  },
  primaryNavButton: {
    textDecoration: "none",
    color: "#ffffff",
    border: "1px solid rgba(37,99,235,0.16)",
    background: "linear-gradient(135deg, #2563eb, #3b82f6)",
    borderRadius: 11,
    padding: "9px 12px",
    fontWeight: 900,
    boxShadow: "0 10px 24px rgba(37,99,235,0.16)",
    fontSize: 13,
  },
  heroCard: {
    border: "1px solid rgba(15,23,42,0.08)",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.88), rgba(255,255,255,0.74))",
    borderRadius: 28,
    padding: "26px 22px",
    boxShadow: "0 18px 60px rgba(15,23,42,0.08)",
    display: "grid",
    gap: 16,
  },
  heroBadge: {
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
  },
  heroTitle: {
    margin: 0,
    fontSize: "clamp(30px, 6vw, 52px)",
    lineHeight: 1.02,
    letterSpacing: "-0.03em",
    color: "#0f172a",
  },
  heroText: {
    margin: 0,
    color: "rgba(15,23,42,0.74)",
    fontSize: 18,
    lineHeight: 1.7,
    maxWidth: 900,
    fontWeight: 700,
  },
  heroSubText: {
    margin: 0,
    color: "#2563eb",
    fontSize: 14,
    lineHeight: 1.6,
    fontWeight: 700,
  },
  heroActions: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
  },
  primaryButton: {
    textDecoration: "none",
    color: "#ffffff",
    background: "linear-gradient(135deg, #2563eb, #3b82f6)",
    border: "1px solid rgba(37,99,235,0.16)",
    borderRadius: 15,
    padding: "13px 16px",
    fontWeight: 900,
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 14px 30px rgba(37,99,235,0.16)",
    fontSize: 14,
  },
  secondaryButton: {
    textDecoration: "none",
    color: "#0f172a",
    background: "rgba(255,255,255,0.74)",
    border: "1px solid rgba(15,23,42,0.08)",
    borderRadius: 15,
    padding: "13px 16px",
    fontWeight: 800,
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 10px 22px rgba(15,23,42,0.05)",
    fontSize: 14,
  },
  metricsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 12,
    marginTop: 4,
  },
  metricCard: {
    borderRadius: 18,
    padding: "16px",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.80), rgba(255,255,255,0.64))",
    border: "1px solid rgba(15,23,42,0.08)",
    display: "grid",
    gap: 8,
    boxShadow: "0 8px 18px rgba(15,23,42,0.04)",
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: 900,
    color: "#2563eb",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  metricValue: {
    fontSize: 22,
    fontWeight: 900,
    color: "#0f172a",
  },
  metricText: {
    fontSize: 14,
    lineHeight: 1.6,
    color: "rgba(15,23,42,0.62)",
  },
  resultsSection: {
    display: "grid",
    gap: 14,
  },
  resultsHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 14,
    flexWrap: "wrap",
  },
  resultsTitle: {
    margin: 0,
    fontSize: 26,
    fontWeight: 900,
    color: "#0f172a",
  },
  resultsText: {
    margin: "6px 0 0",
    color: "rgba(15,23,42,0.62)",
    lineHeight: 1.65,
    fontSize: 14,
  },
  resultsCounter: {
    borderRadius: 999,
    padding: "8px 12px",
    background: "rgba(37,99,235,0.08)",
    border: "1px solid rgba(37,99,235,0.16)",
    color: "#2563eb",
    fontWeight: 900,
    fontSize: 13,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 14,
  },
  card: {
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.88), rgba(255,255,255,0.74))",
    padding: 16,
    borderRadius: 20,
    border: "1px solid rgba(15,23,42,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: 10,
    boxShadow: "0 12px 28px rgba(15,23,42,0.05)",
  },
  cardTop: {
    display: "grid",
    gap: 8,
  },
  cardTitle: {
    fontWeight: 900,
    fontSize: 18,
    color: "#0f172a",
    lineHeight: 1.3,
  },
  tag: {
    width: "fit-content",
    fontSize: 12,
    background: "rgba(37,99,235,0.08)",
    border: "1px solid rgba(37,99,235,0.16)",
    color: "#2563eb",
    padding: "6px 10px",
    borderRadius: 999,
    fontWeight: 800,
  },
  textLine: {
    fontSize: 13,
    color: "rgba(15,23,42,0.74)",
    lineHeight: 1.5,
  },
  description: {
    fontSize: 14,
    lineHeight: 1.7,
    color: "#0f172a",
    margin: 0,
  },
  descriptionMuted: {
    fontSize: 14,
    lineHeight: 1.7,
    color: "rgba(15,23,42,0.54)",
    margin: 0,
  },
  cardFooter: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    marginTop: "auto",
    paddingTop: 4,
  },
  cardPrimaryButton: {
    textDecoration: "none",
    color: "#ffffff",
    background: "linear-gradient(135deg, #2563eb, #3b82f6)",
    border: "1px solid rgba(37,99,235,0.16)",
    borderRadius: 13,
    padding: "10px 14px",
    fontWeight: 900,
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 10px 22px rgba(37,99,235,0.14)",
    fontSize: 13,
  },
  cardSecondaryButton: {
    textDecoration: "none",
    color: "#0f172a",
    background: "rgba(255,255,255,0.78)",
    border: "1px solid rgba(15,23,42,0.08)",
    borderRadius: 13,
    padding: "10px 14px",
    fontWeight: 800,
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 8px 18px rgba(15,23,42,0.04)",
    fontSize: 13,
  },
  noContact: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 40,
    padding: "0 14px",
    borderRadius: 13,
    background: "rgba(255,255,255,0.76)",
    border: "1px solid rgba(15,23,42,0.08)",
    color: "rgba(15,23,42,0.54)",
    fontWeight: 700,
    fontSize: 13,
  },
  emptySection: {
    border: "1px solid rgba(15,23,42,0.08)",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.88), rgba(255,255,255,0.74))",
    borderRadius: 28,
    padding: "30px 22px",
    boxShadow: "0 18px 60px rgba(15,23,42,0.08)",
    display: "grid",
    gap: 14,
    justifyItems: "center",
    textAlign: "center",
  },
  emptyBadge: {
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
  },
  emptyTitle: {
    margin: 0,
    fontSize: "clamp(24px, 5vw, 38px)",
    lineHeight: 1.06,
    color: "#0f172a",
    fontWeight: 900,
  },
  emptyText: {
    margin: 0,
    color: "rgba(15,23,42,0.68)",
    lineHeight: 1.7,
    fontSize: 15,
    maxWidth: 760,
  },
  emptyActions: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 2,
  },
};