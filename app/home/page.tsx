"use client";

export default function AuroraHome() {
  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>
          Bem-vindo à Aurora IA
        </h1>

        <p style={styles.subtitle}>
          Escolha o que você quer fazer agora dentro do ecossistema.
        </p>

        <div style={styles.grid}>
          <a href="/cadastro-geral" style={styles.card}>
            💼 Cadastrar empresa
          </a>

          <a href="/chat" style={styles.card}>
            💬 Usar Chat Aurora
          </a>

          <a href="/locadora" style={styles.card}>
            🚗 Locadora
          </a>

          <a href="/agro" style={styles.card}>
            🌱 AGRO
          </a>

          <a href="/imoveis" style={styles.card}>
            🏢 Imóveis
          </a>

          <a href="/app-builder" style={styles.card}>
            🧠 Criar App
          </a>

          <a href="/financeiro" style={styles.card}>
            📊 Financeiro
          </a>

          <a href="/explorar" style={styles.card}>
            🌍 Explorar
          </a>
        </div>
      </div>
    </main>
  );
}

const styles: any = {
  page: {
    minHeight: "100vh",
    background: "#f8fbff",
    padding: 20,
  },
  container: {
    maxWidth: 900,
    margin: "0 auto",
    textAlign: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: 900,
    marginBottom: 10,
  },
  subtitle: {
    marginBottom: 30,
    color: "#555",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 15,
  },
  card: {
    padding: 20,
    background: "#fff",
    borderRadius: 16,
    textDecoration: "none",
    fontWeight: 800,
    color: "#142033",
    border: "1px solid #ddd",
  },
};