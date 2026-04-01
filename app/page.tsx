import Link from "next/link";

const GENERAL_SIGNUP_HREF = "/cadastro-geral";

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
            <Link href={GENERAL_SIGNUP_HREF} style={ctaSmallStyle}>
              Cadastro geral grátis
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
              Cadastro livre • sem obrigatoriedade para entrar
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
                Entre, explore e cadastre sua empresa quando quiser
              </h1>

              <p
                style={{
                  margin: 0,
                  color: "rgba(236,253,245,0.82)",
                  fontSize: 18,
                  lineHeight: 1.7,
                  maxWidth: 860,
                }}
              >
                A Aurora permite que o usuário conheça o ecossistema livremente e,
                quando fizer sentido, entre no <strong>cadastro geral real</strong>
                para salvar empresa, fornecedor, operação, marca, serviço ou
                oportunidade no banco de dados.
              </p>

              <p
                style={{
                  margin: 0,
                  color: "rgba(236,253,245,0.70)",
                  fontSize: 15,
                  lineHeight: 1.7,
                  maxWidth: 920,
                }}
              >
                O cadastro não deve bloquear a entrada no site. Ele fica disponível
                de forma clara, forte e estratégica para o momento em que o usuário
                quiser se cadastrar.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <Link href={GENERAL_SIGNUP_HREF} style={primaryBigButtonStyle}>
                Cadastrar empresa agora
              </Link>

              <Link href="/explorar" style={secondaryBigButtonStyle}>
                Explorar antes de cadastrar
              </Link>

              <Link href="/chat" style={secondaryBigButtonStyle}>
                Abrir Aurora IA
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
                "Empresas",
                "Fornecedores",
                "Agro",
                "Locadoras",
                "Mercado imobiliário",
                "Serviços e negócios",
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
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: 12,
              }}
            >
              {[
                {
                  title: "Entrada livre",
                  text: "O visitante pode navegar sem ser obrigado a preencher cadastro para conhecer a plataforma.",
                },
                {
                  title: "Cadastro estratégico",
                  text: "Quando quiser se posicionar no ecossistema, ele entra no cadastro geral real e salva seus dados.",
                },
                {
                  title: "Conversão melhor",
                  text: "Menos bloqueio na entrada e mais clareza aumentam confiança, permanência e chance de cadastro.",
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
                Explore freely and register when you want
              </div>

              <div
                style={{
                  color: "rgba(239,246,255,0.78)",
                  lineHeight: 1.7,
                  fontSize: 15,
                }}
              >
                Access to the platform must stay open. Registration remains
                available as a clear and strong option whenever the user is ready
                to place the business inside the ecosystem.
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <Link href={GENERAL_SIGNUP_HREF} style={languageButtonStyle}>
                  General sign up
                </Link>

                <Link href="/explorar" style={secondaryBigButtonStyle}>
                  Explore first
                </Link>
              </div>
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
                Explora libremente y regístrate cuando quieras
              </div>

              <div
                style={{
                  color: "rgba(254,242,242,0.78)",
                  lineHeight: 1.7,
                  fontSize: 15,
                }}
              >
                La entrada al sitio debe permanecer libre. El registro general
                queda disponible como una opción clara para cuando la empresa
                quiera entrar en la base real del ecosistema.
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <Link href={GENERAL_SIGNUP_HREF} style={languageButtonStyle}>
                  Registro general
                </Link>

                <Link href="/explorar" style={secondaryBigButtonStyle}>
                  Explorar primero
                </Link>
              </div>
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
              Entre, explore, cadastre e feche negócios
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
            Cadastro geral disponível sem travar a entrada no site
          </div>

          <div
            style={{
              color: "rgba(236,253,245,0.84)",
              lineHeight: 1.7,
              fontSize: 16,
              maxWidth: 900,
            }}
          >
            O botão principal da home leva direto ao cadastro geral real, mas a
            navegação continua livre. Assim o usuário entra no site sem pressão e
            se cadastra no momento certo.
          </div>

          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <Link href={GENERAL_SIGNUP_HREF} style={primaryBigButtonStyle}>
              Entrar no cadastro geral
            </Link>
            <Link href="/explorar" style={secondaryBigButtonStyle}>
              Continuar explorando
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