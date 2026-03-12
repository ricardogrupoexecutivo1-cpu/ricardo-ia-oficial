export default function Planos() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        fontFamily: "Arial, sans-serif",
        padding: "40px 20px"
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        <h1 style={{ fontSize: 40, textAlign: "center", marginBottom: 10 }}>
          Planos Aurora IA
        </h1>

        <p style={{ textAlign: "center", opacity: 0.8, marginBottom: 40 }}>
          Inteligência Artificial brasileira aberta para o mundo
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px,1fr))",
            gap: 25
          }}
        >

          {/* Plano Gratuito */}

          <div
            style={{
              background: "#1e293b",
              padding: 25,
              borderRadius: 14
            }}
          >
            <h2>Plano Gratuito</h2>

            <h3 style={{ fontSize: 28 }}>R$ 0</h3>

            <p>Ideal para testar a Aurora IA.</p>

            <ul style={{ lineHeight: 1.8 }}>
              <li>✔ Chat com IA</li>
              <li>✔ Geração de imagens limitada</li>
              <li>✔ Marketing básico</li>
              <li>✔ Acesso inicial</li>
            </ul>

            <a
              href="/chat"
              style={{
                display: "inline-block",
                marginTop: 15,
                background: "#3b82f6",
                padding: "10px 18px",
                borderRadius: 8,
                color: "white",
                textDecoration: "none"
              }}
            >
              Começar grátis
            </a>
          </div>

          {/* Plano Evolução */}

          <div
            style={{
              background: "#1e293b",
              padding: 25,
              borderRadius: 14,
              border: "2px solid #8b5cf6"
            }}
          >
            <h2>Plano Evolução</h2>

            <h3 style={{ fontSize: 28 }}>R$ 29,90 / mês</h3>

            <p>Plano completo para produtividade com IA.</p>

            <ul style={{ lineHeight: 1.8 }}>
              <li>✔ Chat avançado</li>
              <li>✔ Mais geração de imagens</li>
              <li>✔ Marketing automático</li>
              <li>✔ Memória inteligente</li>
              <li>✔ Atualizações constantes</li>
            </ul>

            <a
              href="/login"
              style={{
                display: "inline-block",
                marginTop: 15,
                background: "#8b5cf6",
                padding: "10px 18px",
                borderRadius: 8,
                color: "white",
                textDecoration: "none"
              }}
            >
              Contratar
            </a>
          </div>

          {/* Plano Fundador */}

          <div
            style={{
              background: "#1e293b",
              padding: 25,
              borderRadius: 14
            }}
          >
            <h2>Plano Fundador</h2>

            <h3 style={{ fontSize: 28 }}>R$ 29,90</h3>

            <p>Preço especial para os primeiros usuários.</p>

            <ul style={{ lineHeight: 1.8 }}>
              <li>✔ Tudo do plano evolução</li>
              <li>✔ Preço garantido por até 24 meses</li>
              <li>✔ Acesso antecipado a novidades</li>
              <li>✔ Suporte prioritário</li>
            </ul>

            <a
              href="/login"
              style={{
                display: "inline-block",
                marginTop: 15,
                background: "#22c55e",
                padding: "10px 18px",
                borderRadius: 8,
                color: "white",
                textDecoration: "none"
              }}
            >
              Quero ser fundador
            </a>
          </div>

        </div>

        <div style={{ textAlign: "center", marginTop: 50 }}>
          <a
            href="/"
            style={{
              color: "#94a3b8",
              textDecoration: "none"
            }}
          >
            ← Voltar para Aurora IA
          </a>
        </div>

      </div>
    </main>
  )
}