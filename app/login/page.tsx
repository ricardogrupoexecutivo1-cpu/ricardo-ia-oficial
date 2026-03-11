export default function LoginPage() {
  return (
    <main
      style={{
        maxWidth: 520,
        margin: "0 auto",
        padding: 40,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ fontSize: 32, marginBottom: 16 }}>Login Aurora IA</h1>

      <p style={{ color: "#555", marginBottom: 24 }}>
        Entre com seu e-mail e senha para acessar a plataforma.
      </p>

      <form
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <input
          type="email"
          placeholder="Seu e-mail"
          style={{
            padding: 12,
            borderRadius: 8,
            border: "1px solid #ccc",
            fontSize: 16,
          }}
        />

        <input
          type="password"
          placeholder="Sua senha"
          style={{
            padding: 12,
            borderRadius: 8,
            border: "1px solid #ccc",
            fontSize: 16,
          }}
        />

        <button
          type="button"
          style={{
            padding: "12px 20px",
            background: "#000",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Entrar
        </button>

        <a
          href="/"
          style={{
            textDecoration: "none",
            color: "#000",
            marginTop: 8,
          }}
        >
          Voltar para a página inicial
        </a>
      </form>
    </main>
  );
}