export default function Home() {
  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>
          ⚠️ Aurora IA em atualização
        </h1>

        <p style={styles.text}>
          Estamos realizando ajustes para melhorar a plataforma.
        </p>

        <p style={styles.text}>
          Em alguns momentos, pode haver instabilidade temporária.
        </p>

        <p style={styles.textStrong}>
          Você poderá acessar novamente em instantes.
        </p>

        <div style={styles.actions}>
          <a href="/entrada" style={styles.button}>
            Voltar para entrada
          </a>

          <a href="/chat" style={styles.buttonSecondary}>
            Ir para chat
          </a>
        </div>
      </div>
    </main>
  );
}

const styles: any = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f8fbff",
    padding: 20,
    textAlign: "center",
  },
  container: {
    maxWidth: 500,
  },
  title: {
    fontSize: 28,
    fontWeight: 900,
    marginBottom: 20,
  },
  text: {
    marginBottom: 10,
    color: "#555",
  },
  textStrong: {
    marginTop: 15,
    fontWeight: 800,
  },
  actions: {
    marginTop: 25,
    display: "flex",
    gap: 10,
    justifyContent: "center",
  },
  button: {
    padding: 12,
    background: "#0f6fff",
    color: "#fff",
    textDecoration: "none",
    borderRadius: 10,
  },
  buttonSecondary: {
    padding: 12,
    border: "1px solid #ccc",
    borderRadius: 10,
    textDecoration: "none",
    color: "#000",
  },
};