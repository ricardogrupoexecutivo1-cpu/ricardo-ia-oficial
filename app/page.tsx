import Link from "next/link";

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(34,197,94,0.12), transparent 18%), radial-gradient(circle at right top, rgba(59,130,246,0.10), transparent 22%), linear-gradient(180deg, #03110d 0%, #071712 38%, #030504 100%)",
        color: "#ecfdf5",
      }}
    >
      <section
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "24px 16px 80px",
          display: "grid",
          gap: 18,
        }}
      >
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 14,
            flexWrap: "wrap",
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(6, 16, 13, 0.82)",
            backdropFilter: "blur(10px)",
            borderRadius: 24,
            padding: "16px 18px",
            boxShadow: "0 18px 60px rgba(0,0,0,0.22)",
          }}
        >
          <div
            style={{
              display: "grid",
              gap: 6,
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: "0.08em",
                color: "#86efac",
                textTransform: "uppercase",
              }}
            >
              ricardoiaoficial.com
            </div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 900,
                lineHeight: 1.2,
              }}
            >
              Aurora IA • Plataforma internacional de negócios
            </div>
          </div>

          <nav
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <Link href="/chat" style={navLinkStyle}>
              Chat
            </Link>
            <Link href="/explorar" style={navLinkStyle}>
              Explorar
            </Link>
            <Link href="/planos" style={navLinkStyle}>
              Planos
            </Link>
            <Link href="/cadastro" style={ctaSmallStyle}>
              Cadastrar grátis
            </Link>
          </nav>
        </header>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1.15fr 0.85fr",
            gap: 18,
          }}
        >
          <div
            style={{
              border: "1px solid rgba(255,255,255,0.08)",
              background:
                "linear-gradient(180deg, rgba(7,18,13,0.90), rgba(7,18,13,0.78))",
              borderRadius: 28,
              padding: "28px 22px",
              boxShadow: "0 18px 60px rgba(0,0,0,0.22)",
              display: "grid",
              gap: 18,
            }}
          >
            <div
              style={{
                display: "inline-flex",
                width: "fit-content",
                alignItems: "center",
                gap: 8,
                padding: "8px 12px",
                borderRadius: 999,
                background: "rgba(34,197,94,0.10)",
                border: "1px solid rgba(34,197,94,0.26)",
                color: "#86efac",
                fontSize: 13,
                fontWeight: 800,
              }}
            >
              Cadastre-se gratuitamente
            </div>

            <div style={{ display: "grid", gap: 10 }}>
              <h1
                style={{
                  margin: 0,
                  fontSize: "clamp(34px, 6vw, 58px)",
                  lineHeight: 1.02,
                  letterSpacing: "-0.03em",
                }}
              >
                Cadastre e busque negócios no Brasil e no mundo
              </h1>

              <p
                style={{
                  margin: 0,
                  color: "rgba(236,253,245,0.80)",
                  fontSize: 18,
                  lineHeight: 1.7,
                  maxWidth: 840,
                }}
              >
                A <strong>ricardoiaoficial.com</strong> é uma plataforma
                internacional para conectar empresas, profissionais, fornecedores,
                locadoras, agro, mercado imobiliário, serviços e futuras operações
                financeiras em um ecossistema sério, moderno e pronto para crescer.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: 12,
              }}
            >
              {[
                "Agro",
                "Locadoras",
                "Bancos",
                "Mercado imobiliário",
                "Serviços",
                "Ecossistema internacional",
              ].map((item) => (
                <div
                  key={item}
                  style={{
                    borderRadius: 18,
                    padding: "14px 14px",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    fontWeight: 800,
                    color: "#ecfdf5",
                  }}
                >
                  {item}
                </div>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <Link href="/cadastro" style={primaryBigButtonStyle}>
                Cadastrar agora gratuitamente
              </Link>

              <Link href="/explorar" style={secondaryBigButtonStyle}>
                Explorar oportunidades
              </Link>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: 12,
              }}
            >
              {[
                {
                  title: "Entrada simples",
                  text: "Usuários podem entrar, escolher sua área e se cadastrar rapidamente.",
                },
                {
                  title: "Busca séria",
                  text: "Estrutura para encontrar empresas, serviços, oportunidades e negócios.",
                },
                {
                  title: "Escala global",
                  text: "Base criada para crescer no Brasil e no mundo com visão estratégica.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  style={{
                    borderRadius: 18,
                    padding: "16px 16px",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    display: "grid",
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 900,
                    }}
                  >
                    {item.title}
                  </div>
                  <div
                    style={{
                      color: "rgba(236,253,245,0.72)",
                      lineHeight: 1.6,
                      fontSize: 14,
                    }}
                  >
                    {item.text}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside
            style={{
              display: "grid",
              gap: 18,
            }}
          >
            <div
              style={{
                border: "1px solid rgba(255,255,255,0.08)",
                background:
                  "linear-gradient(180deg, rgba(9,20,30,0.92), rgba(8,18,26,0.84))",
                borderRadius: 28,
                padding: "22px 18px",
                boxShadow: "0 18px 60px rgba(0,0,0,0.22)",
                display: "grid",
                gap: 14,
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: "#93c5fd",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                English
              </div>

              <div
                style={{
                  fontSize: 26,
                  fontWeight: 900,
                  lineHeight: 1.15,
                }}
              >
                Sign up for free
              </div>

              <div
                style={{
                  color: "rgba(239,246,255,0.78)",
                  lineHeight: 1.7,
                  fontSize: 15,
                }}
              >
                Global business platform for agro, rentals, banks, real estate,
                services and strategic opportunities in Brazil and worldwide.
              </div>

              <Link href="/cadastro" style={languageButtonStyle}>
                Sign up now
              </Link>
            </div>

            <div
              style={{
                border: "1px solid rgba(255,255,255,0.08)",
                background:
                  "linear-gradient(180deg, rgba(24,12,12,0.92), rgba(18,8,8,0.84))",
                borderRadius: 28,
                padding: "22px 18px",
                boxShadow: "0 18px 60px rgba(0,0,0,0.22)",
                display: "grid",
                gap: 14,
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: "#fca5a5",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Español
              </div>

              <div
                style={{
                  fontSize: 26,
                  fontWeight: 900,
                  lineHeight: 1.15,
                }}
              >
                Regístrate gratis
              </div>

              <div
                style={{
                  color: "rgba(254,242,242,0.78)",
                  lineHeight: 1.7,
                  fontSize: 15,
                }}
              >
                Plataforma internacional de negocios para agro, alquiler,
                bancos, inmobiliaria, servicios y oportunidades en Brasil y en el mundo.
              </div>

              <Link href="/cadastro" style={languageButtonStyle}>
                Registrarse gratis
              </Link>
            </div>
          </aside>
        </section>

        <section
          style={{
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(7, 18, 13, 0.84)",
            borderRadius: 28,
            padding: "22px 18px",
            boxShadow: "0 18px 60px rgba(0,0,0,0.20)",
            display: "grid",
            gap: 14,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 800,
                color: "#86efac",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Ecossistema Aurora
            </div>
            <h2
              style={{
                margin: "8px 0 0",
                fontSize: "clamp(26px, 4vw, 38px)",
                lineHeight: 1.1,
              }}
            >
              Entre, cadastre, apareça e feche negócios
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 12,
            }}
          >
            {[
              {
                title: "Agro",
                href: "/agro",
                text: "Presença profissional para o setor agrícola e oportunidades do campo.",
              },
              {
                title: "Locadoras",
                href: "/locadora",
                text: "Cadastros, motoristas, operação e expansão comercial do setor.",
              },
              {
                title: "Imóveis",
                href: "/imoveis",
                text: "Busca, cadastro e presença digital para o mercado imobiliário.",
              },
              {
                title: "Aurora IA",
                href: "/chat",
                text: "Converse, crie campanhas, imagens e acelere sua operação.",
              },
            ].map((item) => (
              <Link
                key={item.title}
                href={item.href}
                style={{
                  textDecoration: "none",
                  color: "#ecfdf5",
                  borderRadius: 20,
                  padding: "18px 16px",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  display: "grid",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    fontSize: 17,
                    fontWeight: 900,
                  }}
                >
                  {item.title}
                </div>
                <div
                  style={{
                    color: "rgba(236,253,245,0.72)",
                    lineHeight: 1.6,
                    fontSize: 14,
                  }}
                >
                  {item.text}
                </div>
                <div
                  style={{
                    color: "#86efac",
                    fontWeight: 800,
                  }}
                >
                  Abrir →
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section
          style={{
            border: "1px solid rgba(255,255,255,0.08)",
            background:
              "linear-gradient(135deg, rgba(34,197,94,0.12), rgba(59,130,246,0.10))",
            borderRadius: 28,
            padding: "24px 18px",
            display: "grid",
            gap: 14,
          }}
        >
          <div
            style={{
              fontSize: "clamp(24px, 4vw, 36px)",
              fontWeight: 900,
              lineHeight: 1.1,
            }}
          >
            Cadastre-se gratuitamente e comece agora
          </div>

          <div
            style={{
              color: "rgba(236,253,245,0.84)",
              lineHeight: 1.7,
              fontSize: 16,
              maxWidth: 900,
            }}
          >
            Plataforma séria, moderna e em expansão contínua. Sistema em constante
            atualização e pode haver momentos de instabilidade durante melhorias e
            novas liberações.
          </div>

          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <Link href="/cadastro" style={primaryBigButtonStyle}>
              Entrar / cadastrar gratuitamente
            </Link>
            <Link href="/planos" style={secondaryBigButtonStyle}>
              Ver planos
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}

const navLinkStyle: React.CSSProperties = {
  textDecoration: "none",
  color: "#ecfdf5",
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.04)",
  borderRadius: 12,
  padding: "10px 14px",
  fontWeight: 700,
};

const ctaSmallStyle: React.CSSProperties = {
  textDecoration: "none",
  color: "#04110a",
  border: "1px solid rgba(34,197,94,0.28)",
  background: "linear-gradient(135deg, #22c55e, #4ade80)",
  borderRadius: 12,
  padding: "10px 14px",
  fontWeight: 900,
};

const primaryBigButtonStyle: React.CSSProperties = {
  textDecoration: "none",
  color: "#04110a",
  background: "linear-gradient(135deg, #22c55e, #4ade80)",
  border: "1px solid rgba(34,197,94,0.28)",
  borderRadius: 16,
  padding: "14px 18px",
  fontWeight: 900,
  display: "inline-flex",
  justifyContent: "center",
  alignItems: "center",
};

const secondaryBigButtonStyle: React.CSSProperties = {
  textDecoration: "none",
  color: "#ecfdf5",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.10)",
  borderRadius: 16,
  padding: "14px 18px",
  fontWeight: 800,
  display: "inline-flex",
  justifyContent: "center",
  alignItems: "center",
};

const languageButtonStyle: React.CSSProperties = {
  textDecoration: "none",
  color: "#ecfdf5",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 14,
  padding: "12px 16px",
  fontWeight: 900,
  display: "inline-flex",
  justifyContent: "center",
  alignItems: "center",
};