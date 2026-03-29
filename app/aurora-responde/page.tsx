import Link from "next/link";

export default function AuroraRespondePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(16,185,129,0.16), transparent 28%), #050816",
        color: "#e5eef8",
        padding: "32px 16px 80px",
      }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: 16,
          }}
        >
          <Link
            href="/"
            style={{
              color: "#93c5fd",
              textDecoration: "none",
              border: "1px solid rgba(147,197,253,0.25)",
              borderRadius: 999,
              padding: "10px 14px",
            }}
          >
            Voltar à Home
          </Link>

          <Link
            href="/chat"
            style={{
              color: "#86efac",
              textDecoration: "none",
              border: "1px solid rgba(134,239,172,0.25)",
              borderRadius: 999,
              padding: "10px 14px",
            }}
          >
            Ir para o Chat
          </Link>

          <Link
            href="/guardiao"
            style={{
              color: "#facc15",
              textDecoration: "none",
              border: "1px solid rgba(250,204,21,0.25)",
              borderRadius: 999,
              padding: "10px 14px",
            }}
          >
            Ir para o Guardião
          </Link>
        </div>

        <section
          style={{
            border: "1px solid rgba(148,163,184,0.18)",
            background: "rgba(15,23,42,0.72)",
            backdropFilter: "blur(10px)",
            borderRadius: 24,
            padding: 24,
            boxShadow: "0 20px 80px rgba(0,0,0,0.35)",
            marginBottom: 24,
          }}
        >
          <div
            style={{
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
            }}
          >
            Aurora Responde
          </div>

          <h1
            style={{
              fontSize: 38,
              lineHeight: 1.05,
              margin: 0,
            }}
          >
            Atendimento e resposta da plataforma em atualização
          </h1>

          <p
            style={{
              color: "#94a3b8",
              marginTop: 14,
              maxWidth: 860,
              fontSize: 16,
              lineHeight: 1.7,
            }}
          >
            Esta área da Aurora foi preparada para centralizar atendimento,
            dúvidas, críticas, sugestões, reclamações, direcionamento do usuário
            e comunicação da plataforma. Estamos em constante atualização e pode
            haver momentos de instabilidade.
          </p>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              borderRadius: 20,
              padding: 18,
              background: "rgba(15,23,42,0.72)",
              border: "1px solid rgba(148,163,184,0.16)",
            }}
          >
            <div style={{ fontSize: 12, color: "#94a3b8" }}>Status atual</div>
            <div style={{ fontWeight: 800, fontSize: 20, marginTop: 8 }}>
              Página ativa
            </div>
            <p style={{ color: "#cbd5e1", marginTop: 10, marginBottom: 0 }}>
              A área pública foi ativada para receber usuários e evitar rotas
              quebradas.
            </p>
          </div>

          <div
            style={{
              borderRadius: 20,
              padding: 18,
              background: "rgba(15,23,42,0.72)",
              border: "1px solid rgba(148,163,184,0.16)",
            }}
          >
            <div style={{ fontSize: 12, color: "#94a3b8" }}>Objetivo</div>
            <div style={{ fontWeight: 800, fontSize: 20, marginTop: 8 }}>
              Resposta central
            </div>
            <p style={{ color: "#cbd5e1", marginTop: 10, marginBottom: 0 }}>
              Organizar contato, suporte, direcionamento e relacionamento com o
              usuário.
            </p>
          </div>

          <div
            style={{
              borderRadius: 20,
              padding: 18,
              background: "rgba(15,23,42,0.72)",
              border: "1px solid rgba(148,163,184,0.16)",
            }}
          >
            <div style={{ fontSize: 12, color: "#94a3b8" }}>Próximo passo</div>
            <div style={{ fontWeight: 800, fontSize: 20, marginTop: 8 }}>
              Formulário real
            </div>
            <p style={{ color: "#cbd5e1", marginTop: 10, marginBottom: 0 }}>
              Ligar mensagens, categorias e encaminhamento ao banco de forma real.
            </p>
          </div>
        </section>

        <section
          style={{
            borderRadius: 24,
            padding: 24,
            background: "rgba(15,23,42,0.72)",
            border: "1px solid rgba(148,163,184,0.18)",
            boxShadow: "0 20px 80px rgba(0,0,0,0.35)",
            marginBottom: 24,
          }}
        >
          <h2 style={{ fontSize: 24, marginTop: 0 }}>Canais previstos</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 14,
              marginTop: 18,
            }}
          >
            {[
              "Dúvidas gerais",
              "Críticas e sugestões",
              "Reclamações",
              "Direcionamento de usuário",
              "Atendimento comercial",
              "Encaminhamento para WhatsApp",
            ].map((item) => (
              <div
                key={item}
                style={{
                  borderRadius: 16,
                  padding: 16,
                  background: "rgba(2,6,23,0.45)",
                  border: "1px solid rgba(148,163,184,0.14)",
                  color: "#e2e8f0",
                  fontWeight: 700,
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section
          style={{
            borderRadius: 24,
            padding: 24,
            background: "rgba(15,23,42,0.72)",
            border: "1px solid rgba(148,163,184,0.18)",
            boxShadow: "0 20px 80px rgba(0,0,0,0.35)",
          }}
        >
          <h2 style={{ fontSize: 24, marginTop: 0 }}>
            Direções que já podem ser ligadas depois
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 14,
              marginTop: 18,
            }}
          >
            {[
              {
                title: "Suporte da plataforma",
                text: "Atendimento para dificuldades de uso, login, navegação e recursos.",
              },
              {
                title: "Comercial",
                text: "Leads, planos, parcerias, empresas e oportunidades.",
              },
              {
                title: "Operacional",
                text: "Encaminhamento interno para módulos, cadastros e setores específicos.",
              },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  borderRadius: 18,
                  padding: 18,
                  background: "rgba(2,6,23,0.45)",
                  border: "1px solid rgba(148,163,184,0.14)",
                }}
              >
                <div style={{ fontWeight: 800, fontSize: 18 }}>
                  {item.title}
                </div>
                <p
                  style={{
                    color: "#cbd5e1",
                    marginTop: 10,
                    marginBottom: 0,
                    lineHeight: 1.6,
                  }}
                >
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}