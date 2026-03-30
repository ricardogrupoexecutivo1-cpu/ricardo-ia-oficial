import Link from "next/link";

const quickCards = [
  {
    title: "Crie seu próprio aplicativo",
    text: "Monte seu app na Aurora IA mesmo sem programar e comece sua operação digital agora.",
    href: "/chat",
    cta: "Criar meu app agora",
    icon: "📱",
  },
  {
    title: "Entre rápido com cadastro básico",
    text: "Preencha apenas nome e e-mail para entrar. O cadastro completo pode ser concluído depois, sem travar interesse.",
    href: "/cadastro-basico",
    cta: "Fazer cadastro básico",
    icon: "🚀",
  },
  {
    title: "Consiga clientes e oportunidades",
    text: "Use a plataforma para gerar negócios reais, divulgar sua empresa e atrair novos contatos.",
    href: "/chat",
    cta: "Entrar e começar",
    icon: "💰",
  },
  {
    title: "Motoristas, fornecedores e empresas",
    text: "Cadastre-se para aparecer, vender, trabalhar e participar do ecossistema da Aurora IA.",
    href: "/cadastro-basico",
    cta: "Começar agora",
    icon: "🌍",
  },
];

const highlightCards = [
  {
    title: "Entrada rápida",
    text: "Cadastro em menos de 2 minutos para começar agora e completar os dados depois.",
  },
  {
    title: "Sem programação",
    text: "A plataforma foi feita para colocar mais gente para dentro com velocidade e baixa fricção.",
  },
  {
    title: "Crescimento real",
    text: "Usuários já estão entrando no Brasil e no exterior, com tráfego vindo de redes sociais e busca.",
  },
];

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(16,185,129,0.22), transparent 22%), linear-gradient(180deg, #07111f 0%, #08101a 35%, #05080f 100%)",
        color: "#f8fafc",
      }}
    >
      <section
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "32px 20px 88px",
        }}
      >
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
            marginBottom: 32,
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 14px",
                borderRadius: 999,
                background: "rgba(15, 23, 42, 0.72)",
                border: "1px solid rgba(148, 163, 184, 0.18)",
                fontSize: 13,
                color: "#cbd5e1",
                marginBottom: 14,
              }}
            >
              <span>🚀</span>
              <span>AURORA IA</span>
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: "clamp(2.2rem, 6vw, 4.5rem)",
                lineHeight: 1.02,
                fontWeight: 900,
                letterSpacing: "-0.04em",
                maxWidth: 840,
              }}
            >
              Crie seu próprio aplicativo em minutos
            </h1>

            <p
              style={{
                marginTop: 18,
                marginBottom: 0,
                maxWidth: 780,
                fontSize: "clamp(1rem, 2.2vw, 1.18rem)",
                lineHeight: 1.7,
                color: "#dbeafe",
              }}
            >
              Empresas, motoristas, fornecedores e novos segmentos já estão
              entrando. Comece grátis agora, entre com cadastro básico e
              complete seus dados depois.
            </p>

            <div
              style={{
                marginTop: 14,
                color: "#93c5fd",
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              🌍 Available worldwide • Create apps, campaigns and business ideas
            </div>

            <div
              style={{
                marginTop: 10,
                color: "#86efac",
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              🔒 Plataforma protegida com bloqueio de atividades maliciosas e ações suspeitas
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 14,
                marginTop: 24,
              }}
            >
              <Link
                href="/cadastro-basico"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 56,
                  padding: "0 22px",
                  borderRadius: 16,
                  background:
                    "linear-gradient(135deg, #22c55e 0%, #14b8a6 100%)",
                  color: "#03130d",
                  fontWeight: 900,
                  fontSize: 16,
                  textDecoration: "none",
                  boxShadow: "0 20px 50px rgba(20,184,166,0.28)",
                }}
              >
                🚀 ENTRAR COM CADASTRO BÁSICO
              </Link>

              <Link
                href="/chat"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 56,
                  padding: "0 22px",
                  borderRadius: 16,
                  background: "rgba(15, 23, 42, 0.88)",
                  color: "#f8fafc",
                  fontWeight: 900,
                  fontSize: 16,
                  textDecoration: "none",
                  border: "1px solid rgba(148, 163, 184, 0.18)",
                }}
              >
                💬 ENTRAR NO CHAT
              </Link>
            </div>

            <div
              style={{
                display: "grid",
                gap: 10,
                marginTop: 18,
                color: "#e2e8f0",
                fontSize: 14,
              }}
            >
              <div>⚡ Cadastro em menos de 2 minutos</div>
              <div>🔥 Nome + e-mail primeiro, resto depois</div>
              <div>💰 Taxa de manutenção de R$ 15/mês em breve</div>
            </div>

            <div
              style={{
                marginTop: 22,
                textAlign: "left",
                color: "#86efac",
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              ↓ Role para baixo e veja tudo que você pode fazer na Aurora IA
            </div>
          </div>

          <div
            style={{
              minWidth: 280,
              maxWidth: 380,
              flex: "1 1 320px",
              borderRadius: 28,
              padding: 22,
              background: "rgba(7, 14, 25, 0.86)",
              border: "1px solid rgba(34, 197, 94, 0.22)",
              boxShadow: "0 30px 80px rgba(0,0,0,0.28)",
            }}
          >
            <div
              style={{
                fontSize: 13,
                color: "#86efac",
                fontWeight: 800,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              ricardoiaoficial.com
            </div>

            <div
              style={{
                marginTop: 14,
                fontSize: 28,
                fontWeight: 900,
                lineHeight: 1.1,
              }}
            >
              Entre agora sem travar seu interesse
            </div>

            <p
              style={{
                marginTop: 14,
                marginBottom: 0,
                color: "#cbd5e1",
                lineHeight: 1.65,
                fontSize: 15,
              }}
            >
              Primeiro o usuário entra rápido. Depois ele conclui o cadastro com
              calma. Essa é a forma mais forte de acelerar conversão.
            </p>

            <div
              style={{
                marginTop: 18,
                padding: 16,
                borderRadius: 18,
                background: "rgba(34,197,94,0.08)",
                border: "1px solid rgba(34,197,94,0.18)",
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 800,
                  color: "#bbf7d0",
                  marginBottom: 8,
                }}
              >
                Cadastro básico visível
              </div>

              <div
                style={{
                  color: "#e2e8f0",
                  lineHeight: 1.65,
                  fontSize: 14,
                }}
              >
                Nome + e-mail para começar agora.
                Depois o sistema mostra:
                <strong> conclua seu cadastro em até 30 dias.</strong>
              </div>
            </div>

            <Link
              href="/cadastro-basico"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                marginTop: 18,
                minHeight: 54,
                borderRadius: 16,
                background:
                  "linear-gradient(135deg, #22c55e 0%, #14b8a6 100%)",
                color: "#03130d",
                fontWeight: 900,
                fontSize: 16,
                textDecoration: "none",
                boxShadow: "0 20px 50px rgba(20,184,166,0.28)",
              }}
            >
              🚀 COMEÇAR AGORA
            </Link>
          </div>
        </header>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 18,
            marginBottom: 54,
          }}
        >
          {quickCards.map((item) => (
            <div
              key={item.title}
              style={{
                borderRadius: 24,
                padding: 22,
                background: "rgba(8, 15, 28, 0.82)",
                border: "1px solid rgba(148, 163, 184, 0.15)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
              }}
            >
              <div
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  background: "rgba(34, 197, 94, 0.14)",
                  marginBottom: 16,
                }}
              >
                {item.icon}
              </div>

              <h2
                style={{
                  margin: 0,
                  fontSize: 22,
                  lineHeight: 1.2,
                }}
              >
                {item.title}
              </h2>

              <p
                style={{
                  marginTop: 12,
                  marginBottom: 0,
                  color: "#cbd5e1",
                  lineHeight: 1.7,
                  fontSize: 15,
                }}
              >
                {item.text}
              </p>

              <Link
                href={item.href}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 18,
                  minHeight: 46,
                  padding: "0 16px",
                  borderRadius: 14,
                  textDecoration: "none",
                  color: "#f8fafc",
                  background: "rgba(15, 23, 42, 0.88)",
                  border: "1px solid rgba(34, 197, 94, 0.24)",
                  fontWeight: 800,
                }}
              >
                {item.cta}
              </Link>
            </div>
          ))}
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 0.8fr",
            gap: 20,
            marginBottom: 54,
          }}
        >
          <div
            style={{
              borderRadius: 28,
              padding: 28,
              background:
                "linear-gradient(180deg, rgba(8,15,28,0.95) 0%, rgba(5,10,18,0.95) 100%)",
              border: "1px solid rgba(148, 163, 184, 0.14)",
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 900,
                color: "#86efac",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              O que você pode fazer na Aurora IA
            </div>

            <h3
              style={{
                marginTop: 12,
                marginBottom: 0,
                fontSize: "clamp(1.6rem, 3vw, 2.5rem)",
                lineHeight: 1.08,
              }}
            >
              Entre rápido agora e complete seus dados depois
            </h3>

            <p
              style={{
                marginTop: 14,
                marginBottom: 0,
                maxWidth: 760,
                color: "#cbd5e1",
                lineHeight: 1.75,
                fontSize: 16,
              }}
            >
              O foco da home agora é converter mais. Primeiro a pessoa entra
              com cadastro básico. Depois do acesso inicial, ela clica para
              continuar e completa os dados de forma organizada.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 14,
                marginTop: 22,
              }}
            >
              {highlightCards.map((item) => (
                <div
                  key={item.title}
                  style={{
                    borderRadius: 18,
                    padding: 18,
                    background: "rgba(15, 23, 42, 0.72)",
                    border: "1px solid rgba(148, 163, 184, 0.14)",
                  }}
                >
                  <div
                    style={{
                      fontWeight: 800,
                      marginBottom: 10,
                      fontSize: 16,
                    }}
                  >
                    {item.title}
                  </div>
                  <div
                    style={{
                      color: "#cbd5e1",
                      lineHeight: 1.65,
                      fontSize: 14,
                    }}
                  >
                    {item.text}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              borderRadius: 28,
              padding: 28,
              background: "rgba(8,15,28,0.85)",
              border: "1px solid rgba(148, 163, 184, 0.14)",
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 900,
                color: "#93c5fd",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Prova social
            </div>

            <div
              style={{
                marginTop: 12,
                fontSize: 30,
                fontWeight: 900,
                lineHeight: 1.1,
              }}
            >
              Usuários já entrando no Brasil e no exterior
            </div>

            <p
              style={{
                marginTop: 14,
                marginBottom: 0,
                color: "#cbd5e1",
                lineHeight: 1.75,
                fontSize: 15,
              }}
            >
              A Aurora IA já está recebendo acessos por redes sociais, busca e
              tráfego direto. O objetivo agora é acelerar a entrada e deixar a
              plataforma ainda mais forte.
            </p>

            <div
              style={{
                display: "grid",
                gap: 12,
                marginTop: 22,
                fontSize: 15,
                color: "#e2e8f0",
              }}
            >
              <div>🇧🇷 Brasil</div>
              <div>🇺🇸 Estados Unidos</div>
              <div>🇸🇪 Suécia</div>
              <div>🇨🇭 Suíça</div>
              <div>🇮🇪 Irlanda</div>
            </div>

            <Link
              href="/cadastro-basico"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 22,
                width: "100%",
                minHeight: 50,
                borderRadius: 16,
                textDecoration: "none",
                color: "#03130d",
                background: "#22c55e",
                border: "1px solid rgba(34, 197, 94, 0.38)",
                fontWeight: 900,
              }}
            >
              👉 ENTRAR AGORA
            </Link>
          </div>
        </section>

        <section
          style={{
            borderRadius: 32,
            padding: "30px 24px",
            background:
              "linear-gradient(135deg, rgba(34,197,94,0.18) 0%, rgba(15,23,42,0.88) 60%, rgba(8,15,28,0.96) 100%)",
            border: "1px solid rgba(34, 197, 94, 0.24)",
            boxShadow: "0 30px 80px rgba(0,0,0,0.22)",
          }}
        >
          <div
            style={{
              maxWidth: 980,
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 900,
                color: "#bbf7d0",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Quem entra primeiro sai na frente
            </div>

            <h2
              style={{
                marginTop: 10,
                marginBottom: 0,
                fontSize: "clamp(1.8rem, 4vw, 3.2rem)",
                lineHeight: 1.05,
                fontWeight: 900,
              }}
            >
              Entre agora, use cadastro básico e comece a estruturar seu negócio
              com a Aurora IA
            </h2>

            <p
              style={{
                marginTop: 14,
                marginBottom: 0,
                maxWidth: 900,
                color: "#ecfeff",
                lineHeight: 1.8,
                fontSize: 16,
              }}
            >
              Acesse <strong>ricardoiaoficial.com</strong>, entre com nome e
              e-mail, use a plataforma e depois conclua o cadastro com calma.
              Isso reduz travamento, aumenta conversão e acelera crescimento.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 14,
              marginTop: 24,
            }}
          >
            <Link
              href="/cadastro-basico"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 54,
                padding: "0 22px",
                borderRadius: 16,
                background: "#f8fafc",
                color: "#05131d",
                textDecoration: "none",
                fontWeight: 900,
              }}
            >
              🚀 CADASTRO BÁSICO AGORA
            </Link>

            <Link
              href="/chat"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 54,
                padding: "0 22px",
                borderRadius: 16,
                background: "transparent",
                color: "#f8fafc",
                textDecoration: "none",
                fontWeight: 900,
                border: "1px solid rgba(248,250,252,0.28)",
              }}
            >
              💬 ENTRAR NO CHAT
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}