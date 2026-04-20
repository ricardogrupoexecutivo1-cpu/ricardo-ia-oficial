import Link from "next/link";

export const dynamic = "force-dynamic";

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top, rgba(59, 130, 246, 0.25) 0%, rgba(11, 31, 58, 1) 45%, rgba(13, 42, 77, 1) 100%)",
    color: "#f8fafc",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "32px 16px",
  },
  wrap: {
    width: "100%",
    maxWidth: 1180,
    display: "grid",
    gridTemplateColumns: "1.15fr 0.85fr",
    gap: 24,
  },
  card: {
    background: "rgba(15, 23, 42, 0.82)",
    border: "1px solid rgba(148, 163, 184, 0.18)",
    borderRadius: 28,
    boxShadow: "0 24px 80px rgba(0,0,0,0.35)",
    backdropFilter: "blur(18px)",
  },
  hero: {
    padding: 32,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    minHeight: 560,
  },
  side: {
    padding: 24,
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 14px",
    borderRadius: 999,
    background: "rgba(34, 197, 94, 0.12)",
    border: "1px solid rgba(34, 197, 94, 0.28)",
    color: "#bbf7d0",
    fontSize: 13,
    fontWeight: 700,
    width: "fit-content",
    letterSpacing: 0.3,
  },
  title: {
    fontSize: "clamp(34px, 5vw, 62px)",
    lineHeight: 1.02,
    fontWeight: 900,
    margin: "18px 0 16px",
    letterSpacing: -1.6,
  },
  subtitle: {
    fontSize: 18,
    lineHeight: 1.7,
    color: "rgba(226, 232, 240, 0.88)",
    maxWidth: 760,
    margin: 0,
  },
  primaryActions: {
    display: "flex",
    flexWrap: "wrap",
    gap: 14,
    marginTop: 28,
  },
  primaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 56,
    padding: "0 22px",
    borderRadius: 16,
    textDecoration: "none",
    fontWeight: 800,
    fontSize: 16,
    background:
      "linear-gradient(135deg, #22c55e 0%, #16a34a 45%, #15803d 100%)",
    color: "#ffffff",
    boxShadow: "0 16px 40px rgba(34, 197, 94, 0.28)",
    border: "1px solid rgba(255,255,255,0.12)",
  },
  secondaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 56,
    padding: "0 22px",
    borderRadius: 16,
    textDecoration: "none",
    fontWeight: 800,
    fontSize: 16,
    background: "rgba(255,255,255,0.04)",
    color: "#f8fafc",
    border: "1px solid rgba(148, 163, 184, 0.22)",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 14,
    marginTop: 28,
  },
  infoCard: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(148, 163, 184, 0.16)",
    borderRadius: 20,
    padding: 18,
  },
  infoLabel: {
    fontSize: 12,
    textTransform: "uppercase" as const,
    letterSpacing: 1,
    color: "rgba(148, 163, 184, 0.95)",
    marginBottom: 8,
    fontWeight: 800,
  },
  infoText: {
    fontSize: 15,
    lineHeight: 1.6,
    color: "#e2e8f0",
    margin: 0,
  },
  sideTitle: {
    fontSize: 22,
    lineHeight: 1.2,
    fontWeight: 900,
    margin: 0,
  },
  sideText: {
    fontSize: 15,
    lineHeight: 1.7,
    color: "rgba(226, 232, 240, 0.88)",
    margin: 0,
  },
  audioBox: {
    padding: 18,
    borderRadius: 20,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(148, 163, 184, 0.16)",
  },
  audioTitle: {
    margin: "0 0 8px",
    fontSize: 16,
    fontWeight: 800,
    color: "#f8fafc",
  },
  audioText: {
    margin: "0 0 14px",
    fontSize: 14,
    lineHeight: 1.6,
    color: "rgba(226, 232, 240, 0.78)",
  },
  audioPlaceholder: {
    minHeight: 56,
    borderRadius: 14,
    border: "1px dashed rgba(148, 163, 184, 0.35)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 13,
    color: "rgba(226, 232, 240, 0.72)",
    background: "rgba(2, 6, 23, 0.45)",
    textAlign: "center" as const,
    padding: 12,
  },
  notice: {
    padding: 18,
    borderRadius: 18,
    background: "rgba(249, 115, 22, 0.08)",
    border: "1px solid rgba(249, 115, 22, 0.22)",
    color: "#fdba74",
    fontSize: 14,
    lineHeight: 1.6,
  },
  smallLinks: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
  },
  smallLink: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    padding: "0 14px",
    borderRadius: 14,
    textDecoration: "none",
    fontWeight: 700,
    fontSize: 14,
    background: "rgba(255,255,255,0.04)",
    color: "#e2e8f0",
    border: "1px solid rgba(148, 163, 184, 0.16)",
  },
};

export default function AuroraEntradaPage() {
  return (
    <main style={styles.page}>
      <div style={styles.wrap}>
        <section style={{ ...styles.card, ...styles.hero }}>
          <div>
            <div style={styles.badge}>Aurora Entrada</div>

            <h1 style={styles.title}>
              Entre na Aurora e siga para a home oficial
            </h1>

            <p style={styles.subtitle}>
              Esta é a nova porta de entrada da Aurora. Aqui o usuário pode
              ouvir a explicação, entrar com Google e continuar para a home real
              da plataforma sem alterar a estrutura principal já publicada.
            </p>

            <p style={{ ...styles.subtitle, marginTop: 14 }}>
              Entrada leve, login rápido e continuidade de acesso. O cadastro
              pode ser concluído depois, sem bloquear a navegação. O sistema
              está em constante evolução e algumas funcionalidades podem estar em
              melhoria.
            </p>

            <div style={styles.primaryActions}>
              <Link href="/entrar" style={styles.primaryButton}>
                Entrar agora
              </Link>

              <Link href="/home" style={styles.secondaryButton}>
                Ver home oficial
              </Link>

              <Link href="/chat" style={styles.secondaryButton}>
                Chat
              </Link>
            </div>

            <div style={styles.infoGrid}>
              <div style={styles.infoCard}>
                <div style={styles.infoLabel}>Fluxo oficial</div>
                <p style={styles.infoText}>
                  Entrada estratégica da Aurora com continuidade segura para a
                  home principal.
                </p>
              </div>

              <div style={styles.infoCard}>
                <div style={styles.infoLabel}>Login rápido</div>
                <p style={styles.infoText}>
                  O usuário entra primeiro e conclui o cadastro no momento
                  certo, sem travas.
                </p>
              </div>

              <div style={styles.infoCard}>
                <div style={styles.infoLabel}>Estrutura blindada</div>
                <p style={styles.infoText}>
                  A home principal permanece protegida enquanto a entrada faz o
                  filtro inicial.
                </p>
              </div>
            </div>
          </div>

          <div style={styles.notice}>
            Sistema em constante atualização. Pode haver momentos de
            instabilidade durante melhorias e evoluções da plataforma.
          </div>
        </section>

        <aside style={{ ...styles.card, ...styles.side }}>
          <h2 style={styles.sideTitle}>Áudio explicativo</h2>

          <p style={styles.sideText}>
            Ouça a explicação da Aurora antes do login.
          </p>

          <div style={styles.audioBox}>
            <h3 style={styles.audioTitle}>Apresentação da Aurora</h3>
            <p style={styles.audioText}>
              Área preparada para receber o áudio oficial da explicação da
              plataforma.
            </p>

            <div style={styles.audioPlaceholder}>
              Áudio explicativo disponível nesta área
            </div>
          </div>

          <div style={styles.audioBox}>
            <h3 style={styles.audioTitle}>Acesso rápido</h3>
            <p style={styles.audioText}>
              Use os botões abaixo para seguir exatamente pelo fluxo oficial da
              Aurora.
            </p>

            <div style={styles.smallLinks}>
              <Link href="/entrar" style={styles.smallLink}>
                Ir para login
              </Link>

              <Link href="/home" style={styles.smallLink}>
                Abrir home oficial
              </Link>

              <Link href="/" style={styles.smallLink}>
                Página inicial
              </Link>
            </div>
          </div>

          <div style={styles.audioBox}>
            <h3 style={styles.audioTitle}>Observação importante</h3>
            <p style={styles.audioText}>
              Se ao clicar em entrar você voltar para esta mesma tela, o próximo
              ajuste será na rota <strong>/entrar</strong>, para deixar o login
              visual no padrão premium da Aurora e garantir o redirecionamento
              final para <strong>/home</strong>.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}