import Link from "next/link";
import type { CSSProperties } from "react";

const passos = [
  {
    numero: "1",
    titulo: "Comece pelo cadastro geral",
    texto:
      "Entre no cadastro principal da Aurora e preencha os dados básicos da sua operação. Se você for motorista, condutor, empresa, fornecedor ou prestador, esse é o ponto oficial de entrada.",
    href: "/cadastro-geral",
    cta: "Abrir cadastro geral",
  },
  {
    numero: "2",
    titulo: "Escolha o seu perfil corretamente",
    texto:
      "Marque o tipo de perfil que mais combina com sua realidade. Agora a Aurora já mostra Motorista / Condutor de forma visível para facilitar a entrada de quem precisa de um caminho mais direto.",
    href: "/cadastro-geral",
    cta: "Preencher perfil",
  },
  {
    numero: "3",
    titulo: "Defina sua área de atuação",
    texto:
      "Escolha se você atende Brasil inteiro, estado, região, cidade ou vários locais. Isso ajuda a Aurora a organizar melhor sua presença e facilitar buscas futuras.",
    href: "/cadastro-geral",
    cta: "Definir atuação",
  },
  {
    numero: "4",
    titulo: "Adicione segmentos, produtos e serviços",
    texto:
      "Informe em que área você atua e o que oferece. Isso melhora a descoberta dentro da plataforma e ajuda outras pessoas a encontrarem sua operação.",
    href: "/cadastro-geral",
    cta: "Adicionar segmentos",
  },
  {
    numero: "5",
    titulo: "Revise a camada pública com privacidade",
    texto:
      "Antes de publicar qualquer coisa, confira quais informações podem aparecer publicamente. A Aurora foi organizada para proteger pessoas e empresas por padrão.",
    href: "/cadastro-geral",
    cta: "Revisar privacidade",
  },
  {
    numero: "6",
    titulo: "Salve e siga para seu módulo principal",
    texto:
      "Depois de salvar, siga para a área principal do seu negócio, como Locadora, AGRO, Imóveis, Financeiro, Bancos, Mineração ou App Builder.",
    href: "/",
    cta: "Voltar para home",
  },
];

const modulos = [
  {
    titulo: "Locadora",
    texto: "Cadastre veículos, clientes, motoristas e operações.",
    href: "/locadora",
  },
  {
    titulo: "AGRO",
    texto: "Conecte compradores, fornecedores e oportunidades.",
    href: "/agro",
  },
  {
    titulo: "Imóveis",
    texto: "Cadastre imóveis e gere negócios imobiliários.",
    href: "/imoveis",
  },
  {
    titulo: "Financeiro",
    texto: "Estruture a operação financeira privada da empresa.",
    href: "/financeiro",
  },
  {
    titulo: "Mineração",
    texto: "Abra espaço para negócios e conexões do segmento.",
    href: "/mineracao",
  },
  {
    titulo: "App Builder",
    texto: "Crie módulos, sistemas e novas estruturas com IA.",
    href: "/app-builder",
  },
];

export default function ComoUsarPage() {
  return (
    <main style={pageStyle}>
      <section style={containerStyle}>
        <header style={heroStyle}>
          <div style={badgeStyle}>Tutorial oficial da Aurora</div>

          <h1 style={heroTitleStyle}>Como usar a Aurora corretamente</h1>

          <p style={heroTextStyle}>
            Esta página foi criada para orientar novos usuários com clareza,
            reduzir dúvidas, evitar erros no cadastro e facilitar a entrada
            correta em cada área principal da plataforma.
          </p>

          <div style={heroActionsStyle}>
            <Link href="/cadastro-geral" style={primaryButtonStyle}>
              Fazer cadastro agora
            </Link>

            <Link href="/chat" style={secondaryButtonStyle}>
              Pedir ajuda no Chat Aurora
            </Link>
          </div>
        </header>

        <section style={sectionStyle}>
          <div style={sectionHeaderStyle}>
            <div>
              <div style={sectionKickerStyle}>Passo a passo</div>
              <h2 style={sectionTitleStyle}>Cadastro sem erro e sem confusão</h2>
            </div>
          </div>

          <div style={stepsGridStyle}>
            {passos.map((passo) => (
              <article key={passo.numero} style={stepCardStyle}>
                <div style={stepNumberStyle}>{passo.numero}</div>
                <h3 style={stepTitleStyle}>{passo.titulo}</h3>
                <p style={stepTextStyle}>{passo.texto}</p>
                <Link href={passo.href} style={stepLinkStyle}>
                  {passo.cta}
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section style={highlightStyle}>
          <div style={sectionKickerStyle}>Atenção importante</div>
          <h2 style={sectionTitleStyle}>Se você é motorista ou condutor</h2>
          <p style={highlightTextStyle}>
            Agora a Aurora já mostra a opção <strong>Motorista / Condutor</strong>{" "}
            no cadastro geral para facilitar sua entrada. Também existem
            sugestões de segmentos como <strong>Motorista</strong>,{" "}
            <strong>Condutor</strong>, <strong>Motorista particular</strong> e{" "}
            <strong>Motorista executivo</strong>.
          </p>
        </section>

        <section style={sectionStyle}>
          <div style={sectionHeaderStyle}>
            <div>
              <div style={sectionKickerStyle}>Módulos principais</div>
              <h2 style={sectionTitleStyle}>Depois do cadastro, siga por aqui</h2>
            </div>
          </div>

          <div style={modulesGridStyle}>
            {modulos.map((modulo) => (
              <Link key={modulo.href} href={modulo.href} style={moduleLinkStyle}>
                <article style={moduleCardStyle}>
                  <h3 style={moduleTitleStyle}>{modulo.titulo}</h3>
                  <p style={moduleTextStyle}>{modulo.texto}</p>
                  <span style={moduleActionStyle}>Abrir módulo</span>
                </article>
              </Link>
            ))}
          </div>
        </section>

        <section style={supportStyle}>
          <div style={sectionKickerStyle}>Ajuda e suporte</div>
          <h2 style={sectionTitleStyle}>
            Encontrou erro ou precisa de ajuda para se cadastrar?
          </h2>

          <p style={supportTextStyle}>
            Se algo não estiver claro, se o cadastro não salvar, se uma página
            estiver com erro ou se você não souber qual caminho seguir, use uma
            destas portas de apoio da Aurora.
          </p>

          <div style={supportGridStyle}>
            <Link href="/chat" style={supportCardLinkStyle}>
              <article style={supportCardStyle}>
                <h3 style={supportCardTitleStyle}>Chat Aurora</h3>
                <p style={supportCardTextStyle}>
                  Peça ajuda imediata, orientação de cadastro e próximos passos.
                </p>
                <span style={supportActionStyle}>Abrir chat</span>
              </article>
            </Link>

            <Link href="/aurora-responde" style={supportCardLinkStyle}>
              <article style={supportCardStyle}>
                <h3 style={supportCardTitleStyle}>Aurora Responde</h3>
                <p style={supportCardTextStyle}>
                  Use esta área para dúvidas, pedidos de auxílio, críticas,
                  sugestões e orientação dentro da plataforma.
                </p>
                <span style={supportActionStyle}>Abrir Aurora Responde</span>
              </article>
            </Link>

            <Link href="/cadastro-geral" style={supportCardLinkStyle}>
              <article style={supportCardStyle}>
                <h3 style={supportCardTitleStyle}>Voltar ao cadastro</h3>
                <p style={supportCardTextStyle}>
                  Retome o preenchimento do cadastro oficial da Aurora sem perder
                  o caminho principal.
                </p>
                <span style={supportActionStyle}>Retomar cadastro</span>
              </article>
            </Link>
          </div>

          <div style={reportBoxStyle}>
            <div style={reportTitleStyle}>Como comunicar erro de forma correta</div>
            <p style={reportTextStyle}>
              Sempre que possível, informe: qual página abriu, o que você tentou
              fazer, o que apareceu na tela e se havia algum aviso ou mensagem
              de erro. Isso ajuda a Aurora a corrigir mais rápido.
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  background:
    "linear-gradient(180deg, #eef6ff 0%, #f8fbff 36%, #eef9f2 100%)",
  color: "#0f172a",
};

const containerStyle: CSSProperties = {
  maxWidth: 1240,
  margin: "0 auto",
  padding: "24px 16px 72px",
  display: "grid",
  gap: 20,
};

const heroStyle: CSSProperties = {
  borderRadius: 30,
  padding: 28,
  background:
    "radial-gradient(circle at top right, rgba(34,197,94,0.12), transparent 22%), radial-gradient(circle at left top, rgba(59,130,246,0.14), transparent 24%), linear-gradient(135deg, #ffffff 0%, #f7fbff 50%, #effbf4 100%)",
  border: "1px solid rgba(148,163,184,0.18)",
  boxShadow: "0 24px 70px rgba(15,23,42,0.08)",
  display: "grid",
  gap: 18,
};

const badgeStyle: CSSProperties = {
  display: "inline-flex",
  width: "fit-content",
  alignItems: "center",
  borderRadius: 999,
  padding: "8px 12px",
  background: "#eff6ff",
  border: "1px solid #bfdbfe",
  color: "#2563eb",
  fontWeight: 800,
  fontSize: 13,
};

const heroTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: "clamp(30px, 5vw, 52px)",
  lineHeight: 1.02,
  fontWeight: 900,
};

const heroTextStyle: CSSProperties = {
  margin: 0,
  maxWidth: 900,
  color: "#475569",
  fontSize: 17,
  lineHeight: 1.75,
};

const heroActionsStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 12,
};

const primaryButtonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
  borderRadius: 14,
  padding: "13px 18px",
  background: "linear-gradient(135deg, #2563eb 0%, #22c55e 100%)",
  color: "#ffffff",
  fontWeight: 800,
  boxShadow: "0 16px 36px rgba(37,99,235,0.18)",
};

const secondaryButtonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
  borderRadius: 14,
  padding: "13px 18px",
  background: "#ffffff",
  border: "1px solid #dbeafe",
  color: "#0f172a",
  fontWeight: 700,
};

const sectionStyle: CSSProperties = {
  borderRadius: 28,
  padding: 24,
  background: "#ffffff",
  border: "1px solid rgba(148,163,184,0.14)",
  boxShadow: "0 18px 50px rgba(15,23,42,0.06)",
  display: "grid",
  gap: 18,
};

const sectionHeaderStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 16,
  flexWrap: "wrap",
};

const sectionKickerStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: 0.45,
  textTransform: "uppercase",
  color: "#16a34a",
  marginBottom: 8,
};

const sectionTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 28,
  lineHeight: 1.1,
  fontWeight: 900,
};

const stepsGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: 16,
};

const stepCardStyle: CSSProperties = {
  borderRadius: 22,
  padding: 20,
  background: "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
  border: "1px solid rgba(148,163,184,0.14)",
  boxShadow: "0 14px 34px rgba(15,23,42,0.05)",
  display: "grid",
  gap: 12,
};

const stepNumberStyle: CSSProperties = {
  width: 38,
  height: 38,
  borderRadius: 999,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#eff6ff",
  border: "1px solid #bfdbfe",
  color: "#2563eb",
  fontWeight: 900,
};

const stepTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 19,
  fontWeight: 900,
};

const stepTextStyle: CSSProperties = {
  margin: 0,
  color: "#475569",
  lineHeight: 1.75,
};

const stepLinkStyle: CSSProperties = {
  display: "inline-flex",
  width: "fit-content",
  textDecoration: "none",
  color: "#2563eb",
  fontWeight: 800,
};

const highlightStyle: CSSProperties = {
  borderRadius: 28,
  padding: 24,
  background:
    "linear-gradient(135deg, rgba(37,99,235,0.08), rgba(16,185,129,0.08))",
  border: "1px solid rgba(37,99,235,0.14)",
  boxShadow: "0 18px 50px rgba(15,23,42,0.05)",
};

const highlightTextStyle: CSSProperties = {
  margin: 0,
  color: "#334155",
  lineHeight: 1.8,
};

const modulesGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 16,
};

const moduleLinkStyle: CSSProperties = {
  textDecoration: "none",
  color: "inherit",
};

const moduleCardStyle: CSSProperties = {
  borderRadius: 20,
  padding: 18,
  background: "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
  border: "1px solid rgba(148,163,184,0.14)",
  boxShadow: "0 12px 30px rgba(15,23,42,0.05)",
  display: "grid",
  gap: 10,
};

const moduleTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 18,
  fontWeight: 900,
};

const moduleTextStyle: CSSProperties = {
  margin: 0,
  color: "#64748b",
  lineHeight: 1.7,
};

const moduleActionStyle: CSSProperties = {
  color: "#2563eb",
  fontWeight: 800,
};

const supportStyle: CSSProperties = {
  borderRadius: 28,
  padding: 24,
  background: "#ffffff",
  border: "1px solid rgba(148,163,184,0.14)",
  boxShadow: "0 18px 50px rgba(15,23,42,0.06)",
  display: "grid",
  gap: 18,
};

const supportTextStyle: CSSProperties = {
  margin: 0,
  color: "#475569",
  lineHeight: 1.8,
};

const supportGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: 16,
};

const supportCardLinkStyle: CSSProperties = {
  textDecoration: "none",
  color: "inherit",
};

const supportCardStyle: CSSProperties = {
  borderRadius: 22,
  padding: 20,
  background: "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
  border: "1px solid rgba(148,163,184,0.14)",
  boxShadow: "0 12px 30px rgba(15,23,42,0.05)",
  display: "grid",
  gap: 10,
};

const supportCardTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 18,
  fontWeight: 900,
};

const supportCardTextStyle: CSSProperties = {
  margin: 0,
  color: "#64748b",
  lineHeight: 1.75,
};

const supportActionStyle: CSSProperties = {
  color: "#2563eb",
  fontWeight: 800,
};

const reportBoxStyle: CSSProperties = {
  borderRadius: 18,
  padding: 18,
  background: "#fff8eb",
  border: "1px solid #fde68a",
  boxShadow: "0 10px 24px rgba(245,158,11,0.08)",
};

const reportTitleStyle: CSSProperties = {
  fontWeight: 900,
  color: "#92400e",
  marginBottom: 8,
};

const reportTextStyle: CSSProperties = {
  margin: 0,
  color: "#92400e",
  lineHeight: 1.7,
};