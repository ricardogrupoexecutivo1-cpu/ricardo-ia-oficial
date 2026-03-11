export default function Page() {
  return (
    <main
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: 40,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ fontSize: 36, marginBottom: 20 }}>
        Aurora IA
      </h1>

      <p style={{ fontSize: 18, color: "#555" }}>
        Plataforma de Inteligência Artificial integrada ao ERP GES.
      </p>

      <div
        style={{
          display: "flex",
          gap: 10,
          marginTop: 30,
        }}
      >
        <a
          href="/chat"
          style={{
            padding: "12px 20px",
            background: "#000",
            color: "#fff",
            textDecoration: "none",
            borderRadius: 6,
          }}
        >
          Abrir Chat
        </a>

        <a
          href="/login"
          style={{
            padding: "12px 20px",
            border: "1px solid #000",
            textDecoration: "none",
            borderRadius: 6,
          }}
        >
          Login
        </a>
      </div>

      <div
        style={{
          marginTop: 40,
          color: "#444",
          lineHeight: 1.6,
        }}
      >
        <h2>Sobre a Aurora IA</h2>

        <p>
          A Aurora IA é uma plataforma avançada que combina inteligência
          artificial com sistemas de gestão empresarial.
        </p>

        <p>
          Ela foi criada para ajudar empresas a tomarem decisões melhores,
          automatizar processos e centralizar informações estratégicas.
        </p>

        <p>
          O sistema está sendo desenvolvido para integrar:
        </p>

        <ul>
          <li>ERP GES</li>
          <li>Gestão financeira</li>
          <li>Operações</li>
          <li>Análise inteligente de dados</li>
        </ul>
      </div>
    </main>
  );
}