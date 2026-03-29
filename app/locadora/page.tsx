import Link from "next/link";

const stats = [
  { label: "Módulo ativo", value: "Locadora comercial" },
  { label: "Fluxo inicial", value: "Captação + cadastro" },
  { label: "Foco", value: "Venda, locação e proposta" },
];

const solutions = [
  {
    title: "Cadastro de veículos",
    description:
      "Organize carros, utilitários, diária, status, placa, observações e disponibilidade em um fluxo real.",
    href: "/cadastro-veiculos",
    cta: "Abrir cadastro de veículos",
    icon: "🚗",
  },
  {
    title: "Clientes cadastrados",
    description:
      "Visualize a base de clientes e avance para atendimento, negociação, proposta e fechamento comercial.",
    href: "/locadora/clientes",
    cta: "Ver clientes cadastrados",
    icon: "👤",
  },
  {
    title: "Central de cadastros",
    description:
      "Concentre veículos, clientes, bancos, parceiros e estrutura operacional da locadora em um só lugar.",
    href: "/locadora/cadastros",
    cta: "Abrir central de cadastros",
    icon: "🧩",
  },
  {
    title: "Painel da locadora",
    description:
      "Área administrativa para acompanhar operação, cadastro, organização do funil e próximos ajustes da plataforma.",
    href: "/locadora/admin",
    cta: "Entrar no painel",
    icon: "📊",
  },
];

const audiences = [
  "Locadoras de veículos",
  "Seminovos e revenda",
  "Parceiros comerciais",
  "Bancos e financiadoras",
  "Motoristas e condutores",
  "Empresas com frota",
];

const steps = [
  {
    title: "1. Atrair o cliente",
    text: "Use a página comercial, WhatsApp, anúncios e divulgação para trazer interessados para dentro da Aurora.",
  },
  {
    title: "2. Cadastrar o veículo",
    text: "Registre frota, diária, observações, disponibilidade e dados essenciais para atendimento real.",
  },
  {
    title: "3. Atender e propor",
    text: "Conecte cliente, veículo, parceiro ou banco e avance para proposta comercial e fechamento.",
  },
  {
    title: "4. Escalar a operação",
    text: "Expanda para seminovos, transporte, parceiros e módulos extras sem perder o padrão da plataforma.",
  },
];

export default function LocadoraPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(34,197,94,0.16), transparent 24%), linear-gradient(180deg, #020617 0%, #020b14 38%, #000000 100%)",
        color: "#ffffff",
      }}
    >
      <section
        style={{
          maxWidth: 1220,
          margin: "0 auto",
          padding: "24px 16px 72px",
        }}
      >
        <header
          style={{
            borderRadius: 28,
            overflow: "hidden",
            border: "1px solid rgba(74, 222, 128, 0.16)",
            background:
              "linear-gradient(180deg, rgba(7, 18, 30, 0.98) 0%, rgba(3, 12, 23, 0.98) 100%)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.38)",
          }}
        >
          <div
            style={{
              padding: "22px 18px 24px",
              borderBottom: "1px solid rgba(148,163,184,0.10)",
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
            }}
          >
            <Link href="/" style={topLink}>
              Voltar à Home
            </Link>

            <Link href="/guardiao" style={topLink}>
              Ir para o Guardião
            </Link>

            <Link href="/app-builder" style={topLink}>
              Voltar ao App Builder
            </Link>
          </div>

          <div
            style={{
              padding: "22px 18px 28px",
              display: "grid",
              gridTemplateColumns: "1.15fr 0.85fr",
              gap: 18,
            }}
          >
            <div>
              <div style={pillGreen}>
                <span>🚗</span>
                <span>Aurora Locadora • operação comercial ativa</span>
              </div>

              <h1
                style={{
                  margin: "16px 0 12px",
                  fontSize: "clamp(34px, 6vw, 64px)",
                  lineHeight: 1.02,
                  fontWeight: 900,
                  letterSpacing: "-0.04em",
                  color: "#f8fffb",
                }}
              >
                Estrutura comercial para locadoras, frota, clientes e propostas
              </h1>

              <p
                style={{
                  margin: 0,
                  maxWidth: 760,
                  fontSize: "clamp(15px, 3.2vw, 20px)",
                  lineHeight: 1.7,
                  color: "rgba(226,232,240,0.84)",
                }}
              >
                A Aurora Locadora foi organizada para captação comercial, cadastro
                de veículos, atendimento, clientes, parceiros, bancos e expansão
                do funil de venda e locação. Estamos em constante atualização e
                pode haver momentos de instabilidade.
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
                  gap: 12,
                  marginTop: 20,
                }}
              >
                <Link href="/cadastro-veiculos" style={primaryCta}>
                  Cadastro de Veículos
                </Link>

                <Link href="/locadora/cadastros" style={primaryCtaSoft}>
                  Central de Cadastros
                </Link>

                <Link href="/locadora/clientes" style={darkCta}>
                  Clientes
                </Link>

                <a
                  href="https://wa.me/5531997490074"
                  target="_blank"
                  rel="noreferrer"
                  style={whatsCta}
                >
                  WhatsApp Comercial
                </a>
              </div>
            </div>

            <aside
              style={{
                borderRadius: 24,
                padding: 18,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(148,163,184,0.12)",
                alignSelf: "stretch",
              }}
            >
              <div style={pillBlue}>
                <span>📈</span>
                <span>Status comercial</span>
              </div>

              <h2
                style={{
                  margin: "14px 0 10px",
                  fontSize: 26,
                  lineHeight: 1.15,
                  color: "#f8fffb",
                }}
              >
                Página pronta para gerar entrada, organização e fechamento
              </h2>

              <p
                style={{
                  margin: 0,
                  color: "rgba(226,232,240,0.78)",
                  lineHeight: 1.7,
                  fontSize: 14,
                }}
              >
                Aqui o objetivo é reduzir desorganização, acelerar atendimento e
                deixar visível o caminho entre veículo, cliente, proposta,
                locação, venda e expansão operacional.
              </p>

              <div
                style={{
                  display: "grid",
                  gap: 10,
                  marginTop: 16,
                }}
              >
                {stats.map((item) => (
                  <div key={item.label} style={statBox}>
                    <span style={{ color: "#93c5fd", fontSize: 12, fontWeight: 800 }}>
                      {item.label}
                    </span>
                    <strong style={{ color: "#f8fffb", fontSize: 16 }}>
                      {item.value}
                    </strong>
                  </div>
                ))}
              </div>

              <div
                style={{
                  marginTop: 16,
                  display: "grid",
                  gap: 10,
                }}
              >
                <Link href="/locadora/admin" style={darkCtaBlock}>
                  Abrir painel da locadora
                </Link>

                <Link href="/locadora/seminovos" style={darkCtaBlock}>
                  Ir para seminovos
                </Link>

                <Link href="/locadora/transporte" style={darkCtaBlock}>
                  Ir para transporte
                </Link>
              </div>
            </aside>
          </div>
        </header>

        <section style={{ marginTop: 18 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: 14,
            }}
          >
            {solutions.map((item) => (
              <Link key={item.title} href={item.href} style={cardLink}>
                <article style={card}>
                  <div style={iconBox}>{item.icon}</div>

                  <h3
                    style={{
                      margin: "0 0 10px",
                      fontSize: 22,
                      lineHeight: 1.2,
                      color: "#f8fffb",
                    }}
                  >
                    {item.title}
                  </h3>

                  <p
                    style={{
                      margin: 0,
                      color: "rgba(226,232,240,0.74)",
                      lineHeight: 1.65,
                      fontSize: 14,
                    }}
                  >
                    {item.description}
                  </p>

                  <span style={cardAction}>{item.cta}</span>
                </article>
              </Link>
            ))}
          </div>
        </section>

        <section
          style={{
            marginTop: 18,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
          }}
        >
          <div style={panel}>
            <div style={pillGreen}>
              <span>🎯</span>
              <span>Para quem é</span>
            </div>

            <h3
              style={{
                margin: "14px 0 10px",
                fontSize: 28,
                lineHeight: 1.15,
                color: "#f8fffb",
              }}
            >
              Público comercial que pode operar dentro da Aurora Locadora
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: 10,
              }}
            >
              {audiences.map((item) => (
                <div key={item} style={chipBox}>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div style={panel}>
            <div style={pillBlue}>
              <span>🧠</span>
              <span>Direção do módulo</span>
            </div>

            <h3
              style={{
                margin: "14px 0 10px",
                fontSize: 28,
                lineHeight: 1.15,
                color: "#f8fffb",
              }}
            >
              Estrutura pensada para vender, locar e escalar
            </h3>

            <p
              style={{
                margin: 0,
                color: "rgba(226,232,240,0.78)",
                lineHeight: 1.75,
                fontSize: 15,
              }}
            >
              A Aurora Locadora não deve ser só uma página bonita. Ela precisa
              funcionar como base comercial real, com entrada de veículos,
              clientes, parceiros, proposta, comunicação e futura integração com
              bancos, seguros e oportunidades de fechamento dentro da própria
              plataforma.
            </p>
          </div>
        </section>

        <section style={{ marginTop: 18 }}>
          <div style={panel}>
            <div style={pillGreen}>
              <span>⚙️</span>
              <span>Fluxo recomendado</span>
            </div>

            <h3
              style={{
                margin: "14px 0 16px",
                fontSize: 30,
                lineHeight: 1.12,
                color: "#f8fffb",
              }}
            >
              Caminho comercial para operação da locadora
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 12,
              }}
            >
              {steps.map((step) => (
                <div key={step.title} style={stepCard}>
                  <strong
                    style={{
                      display: "block",
                      marginBottom: 10,
                      fontSize: 17,
                      color: "#f8fffb",
                    }}
                  >
                    {step.title}
                  </strong>

                  <span
                    style={{
                      color: "rgba(226,232,240,0.76)",
                      lineHeight: 1.65,
                      fontSize: 14,
                    }}
                  >
                    {step.text}
                  </span>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: 18,
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 12,
              }}
            >
              <Link href="/cadastro-veiculos" style={primaryCta}>
                Começar pelo cadastro de veículos
              </Link>

              <Link href="/locadora/cadastros" style={primaryCtaSoft}>
                Organizar central de cadastros
              </Link>

              <a
                href="https://wa.me/5531997490074"
                target="_blank"
                rel="noreferrer"
                style={whatsCta}
              >
                Falar no WhatsApp agora
              </a>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

const topLink = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 42,
  padding: "0 14px",
  borderRadius: 12,
  textDecoration: "none",
  fontWeight: 700,
  fontSize: 14,
  color: "#dbeafe",
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(148,163,184,0.14)",
};

const pillGreen = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "8px 12px",
  borderRadius: 999,
  background: "rgba(34,197,94,0.12)",
  border: "1px solid rgba(74,222,128,0.22)",
  color: "#bbf7d0",
  fontSize: 13,
  fontWeight: 800,
};

const pillBlue = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "8px 12px",
  borderRadius: 999,
  background: "rgba(59,130,246,0.12)",
  border: "1px solid rgba(96,165,250,0.22)",
  color: "#dbeafe",
  fontSize: 13,
  fontWeight: 800,
};

const primaryCta = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 52,
  padding: "0 18px",
  borderRadius: 16,
  textDecoration: "none",
  fontWeight: 900,
  fontSize: 15,
  color: "#04130a",
  background: "linear-gradient(135deg, #22c55e, #4ade80)",
};

const primaryCtaSoft = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 52,
  padding: "0 18px",
  borderRadius: 16,
  textDecoration: "none",
  fontWeight: 800,
  fontSize: 15,
  color: "#f0fdf4",
  background: "rgba(34,197,94,0.14)",
  border: "1px solid rgba(74,222,128,0.22)",
};

const darkCta = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 52,
  padding: "0 18px",
  borderRadius: 16,
  textDecoration: "none",
  fontWeight: 800,
  fontSize: 15,
  color: "#e5e7eb",
  background: "rgba(15,23,42,0.72)",
  border: "1px solid rgba(148,163,184,0.20)",
};

const darkCtaBlock = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 48,
  padding: "0 16px",
  borderRadius: 14,
  textDecoration: "none",
  fontWeight: 800,
  fontSize: 14,
  color: "#e5e7eb",
  background: "rgba(15,23,42,0.72)",
  border: "1px solid rgba(148,163,184,0.20)",
};

const whatsCta = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 52,
  padding: "0 18px",
  borderRadius: 16,
  textDecoration: "none",
  fontWeight: 900,
  fontSize: 15,
  color: "#04110a",
  background: "#25D366",
};

const statBox = {
  display: "grid",
  gap: 6,
  padding: 14,
  borderRadius: 16,
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(148,163,184,0.10)",
};

const cardLink = {
  display: "block",
  textDecoration: "none",
  color: "inherit",
};

const card = {
  height: "100%",
  padding: 20,
  borderRadius: 24,
  background:
    "linear-gradient(180deg, rgba(8,18,32,0.98) 0%, rgba(6,13,24,0.98) 100%)",
  border: "1px solid rgba(148,163,184,0.12)",
  boxShadow: "0 16px 40px rgba(0,0,0,0.20)",
};

const iconBox = {
  width: 52,
  height: 52,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 16,
  background: "rgba(34,197,94,0.12)",
  border: "1px solid rgba(74,222,128,0.18)",
  fontSize: 26,
  marginBottom: 14,
};

const cardAction = {
  display: "inline-flex",
  marginTop: 16,
  color: "#86efac",
  fontWeight: 800,
  fontSize: 14,
};

const panel = {
  borderRadius: 24,
  padding: 20,
  border: "1px solid rgba(148,163,184,0.12)",
  background:
    "linear-gradient(180deg, rgba(8,18,32,0.98) 0%, rgba(6,13,24,0.98) 100%)",
};

const chipBox = {
  padding: "12px 14px",
  borderRadius: 14,
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(148,163,184,0.10)",
  color: "#f8fffb",
  fontWeight: 700,
  fontSize: 14,
};

const stepCard = {
  padding: 18,
  borderRadius: 18,
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(148,163,184,0.10)",
};