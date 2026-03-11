export default function ChatPage() {
  return (
    <main
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: 40,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ fontSize: 32, marginBottom: 16 }}>Chat Aurora IA</h1>

      <p style={{ color: "#555", marginBottom: 24 }}>
        Esta é a área de conversa da Aurora IA.
      </p>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: 8,
          padding: 20,
          background: "#fafafa",
          marginBottom: 20,
        }}
      >
        <p style={{ margin: 0, color: "#333" }}>
          Chat inicial carregado com sucesso.
        </p>
      </div>

      <form
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <textarea
          placeholder="Digite sua mensagem..."
          rows={6}
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 8,
            border: "1px solid #ccc",
            fontSize: 16,
            resize: "vertical",
          }}
        />

        <div style={{ display: "flex", gap: 10 }}>
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
            Enviar
          </button>

          <a
            href="/"
            style={{
              padding: "12px 20px",
              border: "1px solid #000",
              borderRadius: 6,
              textDecoration: "none",
              color: "#000",
              display: "inline-block",
            }}
          >
            Voltar
          </a>
        </div>
      </form>
    </main>
  );
}