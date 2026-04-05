"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, type CSSProperties } from "react";

function CadastroSucessoContent() {
  const searchParams = useSearchParams();

  const status = searchParams.get("status") || "ok";
  const email = searchParams.get("email") || "";
  const id = searchParams.get("id") || "";

  const sucesso = status === "ok";

  return (
    <main style={styles.main}>
      <div style={styles.container}>
        <section style={styles.card}>
          <div
            style={{
              ...styles.badge,
              ...(sucesso ? styles.badgeSuccess : styles.badgeInfo),
            }}
          >
            {sucesso ? "Cadastro salvo com segurança" : "Cadastro recebido"}
          </div>

          <h1 style={styles.title}>
            {sucesso
              ? "Seu cadastro geral foi salvo na Aurora"
              : "Sua operação foi registrada na Aurora"}
          </h1>

          <p style={styles.text}>
            A base principal do seu cadastro foi gravada e a Aurora já pode usar
            essas informações para continuidade, organização e evolução da sua
            presença na plataforma.
          </p>

          <div style={styles.infoGrid}>
            <div style={styles.infoCard}>
              <div style={styles.infoLabel}>Status</div>
              <div style={styles.infoValue}>
                {sucesso ? "Salvo com sucesso" : "Recebido"}
              </div>
            </div>

            <div style={styles.infoCard}>
              <div style={styles.infoLabel}>E-mail identificado</div>
              <div style={styles.infoValue}>{email || "-"}</div>
            </div>

            <div style={styles.infoCard}>
              <div style={styles.infoLabel}>ID do cadastro</div>
              <div style={styles.infoValue} style={{ wordBreak: "break-word" }}>
                {id || "-"}
              </div>
            </div>
          </div>

          <div style={styles.alert}>
            Sistema em constante atualização. Pode haver momentos de instabilidade
            durante melhorias. Seu cadastro foi salvo para continuidade segura.
          </div>

          <div style={styles.actions}>
            <Link href="/" style={styles.primaryButton}>
              Voltar para a Home
            </Link>

            <Link href="/guardiao" style={styles.secondaryButton}>
              Ir para o Guardião
            </Link>

            <Link href="/chat" style={styles.secondaryButton}>
              Abrir Chat da Aurora
            </Link>

            <Link
              href={email ? `/completar-cadastro?source=email&email=${encodeURIComponent(email)}` : "/cadastro-geral"}
              style={styles.secondaryButton}
            >
              Continuar cadastro
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function CadastroSucessoPage() {
  return (
    <Suspense fallback={<main style={styles.main}><div style={styles.container}><section style={styles.card}><div style={styles.title}>Carregando confirmação do cadastro...</div></section></div></main>}>
      <CadastroSucessoContent />
    </Suspense>
  );
}

const styles: Record<string, CSSProperties> = {
  main: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top, rgba(59,130,246,0.10), transparent 18%), radial-gradient(circle at left, rgba(34,197,94,0.10), transparent 24%), linear-gradient(180deg, #eef6ff 0%, #f7fbff 36%, #edf7f3 100%)",
    color: "#0f172a",
    padding: "24px 16px 80px",
    display: "flex",
    alignItems: "center",
  },
  container: {
    width: "100%",
    maxWidth: 980,
    margin: "0 auto",
  },
  card: {
    border: "1px solid rgba(15,23,42,0.08)",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,255,255,0.78))",
    borderRadius: 28,
    padding: "28px 22px",
    boxShadow: "0 18px 60px rgba(15,23,42,0.08)",
    display: "grid",
    gap: 18,
  },
  badge: {
    display: "inline-flex",
    width: "fit-content",
    alignItems: "center",
    gap: 8,
    padding: "8px 12px",
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 800,
  },
  badgeSuccess: {
    background: "rgba(16,185,129,0.10)",
    border: "1px solid rgba(16,185,129,0.18)",
    color: "#047857",
  },
  badgeInfo: {
    background: "rgba(37,99,235,0.10)",
    border: "1px solid rgba(37,99,235,0.18)",
    color: "#1d4ed8",
  },
  title: {
    margin: 0,
    fontSize: "clamp(30px, 5vw, 48px)",
    lineHeight: 1.05,
    letterSpacing: "-0.03em",
    fontWeight: 900,
    color: "#0f172a",
  },
  text: {
    margin: 0,
    color: "rgba(15,23,42,0.72)",
    fontSize: 17,
    lineHeight: 1.7,
    fontWeight: 600,
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 12,
  },
  infoCard: {
    borderRadius: 18,
    padding: 16,
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.86), rgba(255,255,255,0.70))",
    border: "1px solid rgba(15,23,42,0.08)",
    display: "grid",
    gap: 8,
    boxShadow: "0 8px 18px rgba(15,23,42,0.04)",
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#2563eb",
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 800,
    color: "#0f172a",
  },
  alert: {
    borderRadius: 16,
    padding: "14px 16px",
    background:
      "linear-gradient(135deg, rgba(37,99,235,0.08), rgba(16,185,129,0.08))",
    border: "1px solid rgba(37,99,235,0.14)",
    color: "#0f172a",
    fontSize: 14,
    lineHeight: 1.7,
    fontWeight: 700,
  },
  actions: {
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
  },
  primaryButton: {
    textDecoration: "none",
    borderRadius: 16,
    border: "1px solid rgba(37,99,235,0.16)",
    background: "linear-gradient(135deg, #2563eb, #3b82f6)",
    color: "#ffffff",
    padding: "14px 18px",
    fontWeight: 900,
    boxShadow: "0 12px 28px rgba(37,99,235,0.16)",
  },
  secondaryButton: {
    textDecoration: "none",
    borderRadius: 16,
    border: "1px solid rgba(15,23,42,0.08)",
    background: "rgba(255,255,255,0.82)",
    color: "#0f172a",
    padding: "14px 18px",
    fontWeight: 800,
    boxShadow: "0 8px 18px rgba(15,23,42,0.04)",
  },
};