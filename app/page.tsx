"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const segmentos = [
  {
    title: "AGRO",
    text: "Produtores, fazendas, fornecedores, máquinas, insumos e oportunidades do agro.",
    href: "/agro",
    icon: "🌱",
    cta: "Entrar no AGRO",
  },
  {
    title: "Imobiliária",
    text: "Imóveis, corretores, construtoras, oportunidades e captação imobiliária.",
    href: "/imoveis",
    icon: "🏡",
    cta: "Entrar em Imóveis",
  },
  {
    title: "Locadora",
    text: "Locadoras, motoristas, seminovos, fornecedores, cegonheiros e compradores.",
    href: "/locadora",
    icon: "🚗",
    cta: "Entrar na Locadora",
  },
  {
    title: "Mineração",
    text: "Exploração, fornecedores, áreas, parceiros técnicos e oportunidades do setor.",
    href: "/mineracao",
    icon: "⛏️",
    cta: "Entrar na Mineração",
  },
];

const acoesRapidas = [
  {
    title: "Criar meu aplicativo",
    text: "Monte seu app dentro da Aurora IA mesmo sem programar.",
    href: "/chat",
    icon: "📱",
    ctaPt: "Criar app agora",
    ctaEn: "Create app now",
  },
  {
    title: "Cadastro básico",
    text: "Entre rápido com nome e e-mail. O restante pode ser concluído depois.",
    href: "/cadastro-basico",
    icon: "🚀",
    ctaPt: "Entrar com cadastro básico",
    ctaEn: "Basic registration",
  },
  {
    title: "Entrar no chat",
    text: "Use o chat da Aurora para ideias, campanhas, imagens e criação de apps.",
    href: "/chat",
    icon: "💬",
    ctaPt: "Abrir chat",
    ctaEn: "Open chat",
  },
];

const destaques = [
  {
    title: "Entrada rápida",
    text: "Cadastro em menos de 2 minutos para reduzir fricção e acelerar conversão.",
  },
  {
    title: "Ecossistema real",
    text: "A pessoa entra e já visualiza os segmentos e oportunidades da plataforma.",
  },
  {
    title: "Crescimento comercial",
    text: "Mais clareza na Home aumenta interesse, retenção e taxa de clique.",
  },
];

type WelcomeState = {
  active: boolean;
  name: string;
  email: string;
  welcomePt: string;
};

export default function HomePage() {
  const [welcomeData, setWelcomeData] = useState<WelcomeState>({
    active: false,
    name: "",
    email: "",
    welcomePt: "",
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const welcome = params.get("welcome") || "";
    const name = params.get("name") || "";
    const email = params.get("email") || "";
    const welcomePt =
      params.get("welcomePt") ||
      (name
        ? `Bem-vindo, ${name}! Seu acesso inicial foi liberado com sucesso.`
        : "Bem-vindo! Seu acesso inicial foi liberado com sucesso.");

    setWelcomeData({
      active: welcome === "1",
      name,
      email,
      welcomePt,
    });
  }, []);

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
          maxWidth: 1280,
          margin: "0 auto",
          padding: "32px 20px 88px",
        }}
      >
        {welcomeData.active ? (
          <section
            style={{
              marginBottom: 24,
              borderRadius: 24,
              padding: "20px 18px",
              background:
                "linear-gradient(135deg, rgba(34,197,94,0.18) 0%, rgba(20,184,166,0.12) 100%)",
              border: "1px solid rgba(34,197,94,0.28)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 14px",
                borderRadius: 999,
                background: "rgba(2,6,23,0.45)",
                border: "1px solid rgba(134,239,172,0.20)",
                color: "#bbf7d0",
                fontSize: 13,
                fontWeight: 900,
              }}
            >
              ✅ ACESSO LIBERADO
            </div>

            <h2
              style={{
                marginTop: 14,
                marginBottom: 0,
                fontSize: "clamp(1.5rem, 3vw, 2.4rem)",
                lineHeight: 1.08,
                fontWeight: 900,
              }}
            >
              {welcomeData.welcomePt}
            </h2>

            <p
              style={{
                marginTop: 12,
                marginBottom: 0,
                color: "#dbeafe",
                lineHeight: 1.75,
                fontSize: 15,
                maxWidth: 960,
              }}
            >
              Agora você já caiu direto na página principal da Aurora IA com os
              segmentos visíveis. Explore as áreas abaixo e conclua seu cadastro
              com calma depois.
            </p>

            {welcomeData.email ? (
              <div
                style={{
                  marginTop: 12,
                  color: "#93c5fd",
                  fontWeight: 700,
                  fontSize: 14,
                }}
              >
                E-mail inicial: {welcomeData.email}
              </div>
            ) : null}

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
                marginTop: 18,
              }}
            >
              <Link href="/cadastro" style={primaryCta}>
                Concluir cadastro completo
              </Link>

              <Link href="/chat" style={secondaryCta}>
                Abrir chat da Aurora
              </Link>
            </div>
          </section>
        ) : null}

        <header
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 0.8fr",
            gap: 22,
            alignItems: "stretch",
          }}
        >
          <section
            style={{
              borderRadius: 30,
              padding: 28,
              background: "rgba(8,15,28,0.86)",
              border: "1px solid rgba(148,163,184,0.16)",
              boxShadow: "0 30px 80px rgba(0,0,0,0.25)",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 14px",
                borderRadius: 999,
                background: "rgba(15,23,42,0.72)",
                border: "1px solid rgba(148,163,184,0.18)",
                fontSize: 13,
                color: "#cbd5e1",
                marginBottom: 14,
                fontWeight: 800,
              }}
            >
              <span>🚀</span>
              <span>AURORA IA</span>
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: "clamp(2.2rem, 6vw, 4.4rem)",
                lineHeight: 1.02,
                fontWeight: 900,
                letterSpacing: "-0.04em",
                maxWidth: 860,
              }}
            >
              Plataforma para criar apps, gerar negócios e conectar segmentos reais
            </h1>

            <p
              style={{
                marginTop: 18,
                marginBottom: 0,
                maxWidth: 820,
                fontSize: "clamp(1rem, 2.2vw, 1.18rem)",
                lineHeight: 1.75,
                color: "#dbeafe",
              }}
            >
              Empresas, motoristas, fornecedores, compradores, parceiros e bancos
              podem entrar na Aurora IA e operar dentro do mesmo ecossistema.
              Agora a Home mostra os segmentos logo no início para gerar mais
              interesse e menos travamento.
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
              <Link href="/cadastro-basico" style={heroPrimaryButton}>
                <span style={stackText}>
                  <span>🚀 ENTRAR COM CADASTRO BÁSICO</span>
                  <span style={subLabel}>Start with basic registration</span>
                </span>
              </Link>

              <Link href="/chat" style={heroSecondaryButton}>
                <span style={stackText}>
                  <span>💬 ENTRAR NO CHAT</span>
                  <span style={subLabel}>Open chat</span>
                </span>
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
              <div>🔥 Segmentos visíveis logo no topo</div>
              <div>💰 Estrutura preparada para bancos, seguradoras e parceiros</div>
            </div>
          </section>

          <aside
            style={{
              borderRadius: 30,
              padding: 24,
              background: "rgba(7,14,25,0.88)",
              border: "1px solid rgba(34,197,94,0.20)",
              boxShadow: "0 30px 80px rgba(0,0,0,0.25)",
            }}
          >
            <div
              style={{
                fontSize: 13,
                color: "#86efac",
                fontWeight: 900,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Bancos e financiamento
            </div>

            <h2
              style={{
                marginTop: 12,
                marginBottom: 0,
                fontSize: 30,
                lineHeight: 1.08,
                fontWeight: 900,
              }}
            >
              Financiamento e aprovação dentro da plataforma
            </h2>

            <p
              style={{
                marginTop: 14,
                marginBottom: 0,
                color: "#cbd5e1",
                lineHeight: 1.72,
                fontSize: 15,
              }}
            >
              Bancos, financiadoras, seguradoras e parceiros financeiros podem
              entrar na Aurora IA para analisar propostas, financiar veículos,
              ofertar seguros, aprovar ou negar no local e gerar comissão sem
              tirar a negociação de dentro do sistema.
            </p>

            <div
              style={{
                display: "grid",
                gap: 10,
                marginTop: 18,
                color: "#e2e8f0",
                fontSize: 14,
              }}
            >
              <div>🏦 Entrada de bancos e financiadoras</div>
              <div>📄 Resposta a propostas dentro da plataforma</div>
              <div>🛡️ Oferta de seguro no fluxo da negociação</div>
              <div>💸 Comissão sem bypass da venda</div>
            </div>

            <Link href="/cadastro-basico" style={fullWidthGreenButton}>
              Entrar como banco / parceiro
            </Link>

            <div
              style={{
                marginTop: 14,
                color: "#93c5fd",
                fontSize: 13,
                lineHeight: 1.6,
                fontWeight: 700,
              }}
            >
              Sistema em constante atualização e pode haver momentos de instabilidade.
            </div>
          </aside>
        </header>

        <section style={{ marginTop: 30 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              flexWrap: "wrap",
              marginBottom: 16,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 900,
                  color: "#86efac",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Segmentos principais
              </div>

              <h2
                style={{
                  marginTop: 10,
                  marginBottom: 0,
                  fontSize: "clamp(1.6rem, 3vw, 2.6rem)",
                  lineHeight: 1.08,
                  fontWeight: 900,
                }}
              >
                Entre direto na área que faz sentido para o usuário
              </h2>
            </div>

            <Link href="/cadastro-basico" style={miniOutlineButton}>
              Cadastro rápido
            </Link>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 18,
            }}
          >
            {segmentos.map((item) => (
              <div
                key={item.title}
                style={{
                  borderRadius: 24,
                  padding: 22,
                  background: "rgba(8,15,28,0.82)",
                  border: "1px solid rgba(148,163,184,0.15)",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 26,
                    background: "rgba(34,197,94,0.14)",
                    marginBottom: 16,
                  }}
                >
                  {item.icon}
                </div>

                <h3
                  style={{
                    margin: 0,
                    fontSize: 24,
                    lineHeight: 1.15,
                    fontWeight: 900,
                  }}
                >
                  {item.title}
                </h3>

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

                <Link href={item.href} style={cardButton}>
                  {item.cta}
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 18,
            marginTop: 34,
          }}
        >
          {acoesRapidas.map((item) => (
            <div
              key={item.title}
              style={{
                borderRadius: 24,
                padding: 22,
                background: "rgba(8,15,28,0.82)",
                border: "1px solid rgba(148,163,184,0.15)",
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
                  background: "rgba(34,197,94,0.14)",
                  marginBottom: 16,
                }}
              >
                {item.icon}
              </div>

              <h3
                style={{
                  margin: 0,
                  fontSize: 22,
                  lineHeight: 1.2,
                  fontWeight: 900,
                }}
              >
                {item.title}
              </h3>

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

              <Link href={item.href} style={cardButton}>
                <span style={stackText}>
                  <span>{item.ctaPt}</span>
                  <span style={subLabel}>{item.ctaEn}</span>
                </span>
              </Link>
            </div>
          ))}
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 0.8fr",
            gap: 20,
            marginTop: 34,
          }}
        >
          <div
            style={{
              borderRadius: 28,
              padding: 28,
              background:
                "linear-gradient(180deg, rgba(8,15,28,0.95) 0%, rgba(5,10,18,0.95) 100%)",
              border: "1px solid rgba(148,163,184,0.14)",
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
              O que muda com esta Home
            </div>

            <h3
              style={{
                marginTop: 12,
                marginBottom: 0,
                fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
                lineHeight: 1.08,
                fontWeight: 900,
              }}
            >
              Menos dificuldade para explorar. Mais clareza, interesse e ação.
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
              O usuário agora cai direto na página principal e já enxerga os
              segmentos criados, o bloco financeiro e os acessos rápidos. Isso
              reduz a sensação de sistema difícil e aumenta a chance de clicar
              logo em alguma área importante.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 14,
                marginTop: 22,
              }}
            >
              {destaques.map((item) => (
                <div
                  key={item.title}
                  style={{
                    borderRadius: 18,
                    padding: 18,
                    background: "rgba(15,23,42,0.72)",
                    border: "1px solid rgba(148,163,184,0.14)",
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
              border: "1px solid rgba(148,163,184,0.14)",
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

            <Link href="/cadastro-basico" style={fullWidthGreenButton}>
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
            border: "1px solid rgba(34,197,94,0.24)",
            boxShadow: "0 30px 80px rgba(0,0,0,0.22)",
            marginTop: 36,
          }}
        >
          <div style={{ maxWidth: 980 }}>
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
              Entre agora, escolha um segmento, use a Aurora e complete o cadastro
              com calma
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
              e-mail, veja os segmentos, explore a plataforma e depois finalize
              seus dados. Isso reduz travamento, aumenta conversão e acelera o
              crescimento comercial da Aurora IA.
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
            <Link href="/cadastro-basico" style={lightButton}>
              🚀 CADASTRO BÁSICO AGORA
            </Link>

            <Link href="/chat" style={transparentButton}>
              💬 ENTRAR NO CHAT
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}

const stackText: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  lineHeight: 1.2,
};

const subLabel: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
};

const heroPrimaryButton: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 56,
  padding: "0 22px",
  borderRadius: 16,
  background: "linear-gradient(135deg, #22c55e 0%, #14b8a6 100%)",
  color: "#03130d",
  fontWeight: 900,
  fontSize: 16,
  textDecoration: "none",
  boxShadow: "0 20px 50px rgba(20,184,166,0.28)",
};

const heroSecondaryButton: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 56,
  padding: "0 22px",
  borderRadius: 16,
  background: "rgba(15,23,42,0.88)",
  color: "#f8fafc",
  fontWeight: 900,
  fontSize: 16,
  textDecoration: "none",
  border: "1px solid rgba(148,163,184,0.18)",
};

const fullWidthGreenButton: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  marginTop: 18,
  minHeight: 52,
  padding: "0 18px",
  borderRadius: 16,
  background: "linear-gradient(135deg, #22c55e 0%, #14b8a6 100%)",
  color: "#03130d",
  textDecoration: "none",
  fontWeight: 900,
  boxShadow: "0 20px 50px rgba(20,184,166,0.22)",
};

const primaryCta: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 48,
  padding: "0 18px",
  borderRadius: 14,
  background: "#f8fafc",
  color: "#05131d",
  textDecoration: "none",
  fontWeight: 900,
};

const secondaryCta: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 48,
  padding: "0 18px",
  borderRadius: 14,
  background: "transparent",
  color: "#f8fafc",
  textDecoration: "none",
  fontWeight: 900,
  border: "1px solid rgba(248,250,252,0.24)",
};

const miniOutlineButton: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 44,
  padding: "0 16px",
  borderRadius: 14,
  background: "rgba(15,23,42,0.88)",
  color: "#f8fafc",
  textDecoration: "none",
  fontWeight: 800,
  border: "1px solid rgba(148,163,184,0.18)",
};

const cardButton: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  marginTop: 18,
  minHeight: 46,
  padding: "0 16px",
  borderRadius: 14,
  textDecoration: "none",
  color: "#f8fafc",
  background: "rgba(15,23,42,0.88)",
  border: "1px solid rgba(34,197,94,0.24)",
  fontWeight: 800,
};

const lightButton: React.CSSProperties = {
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
};

const transparentButton: React.CSSProperties = {
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
};