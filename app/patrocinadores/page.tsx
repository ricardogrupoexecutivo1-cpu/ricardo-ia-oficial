import Link from "next/link";

type SponsorTier = "Destaque local" | "Premium do segmento" | "Exclusivo";

type SponsorCard = {
  segment: string;
  title: string;
  description: string;
  audience: string;
  placement: string;
  tier: SponsorTier;
  monthlyValue: string;
};

const sponsorCards: SponsorCard[] = [
  {
    segment: "AGRO",
    title: "Patrocinador oficial do AGRO",
    description:
      "Espaço premium para marcas do agro que desejam exposição qualificada dentro da Aurora.",
    audience: "Produtores, fornecedores, compradores, revendas e operação rural.",
    placement: "Área AGRO, vitrine do segmento e destaque comercial.",
    tier: "Premium do segmento",
    monthlyValue: "R$ 1.500 a R$ 2.500 / mês",
  },
  {
    segment: "Locadora",
    title: "Patrocinador oficial da Locadora",
    description:
      "Posição pensada para locadoras, frotas, motoristas e parceiros operacionais.",
    audience: "Locadoras, compradores, motoristas, manutenção e operação.",
    placement: "Módulo locadora, busca e áreas comerciais ligadas ao segmento.",
    tier: "Premium do segmento",
    monthlyValue: "R$ 1.500 a R$ 2.500 / mês",
  },
  {
    segment: "Imóveis",
    title: "Patrocinador oficial de Imóveis",
    description:
      "Exposição premium para imobiliárias, construtoras e parceiros do mercado imobiliário.",
    audience: "Imobiliárias, compradores, vendedores, corretores e investidores.",
    placement: "Área de imóveis, páginas de busca e destaques de segmento.",
    tier: "Premium do segmento",
    monthlyValue: "R$ 1.500 a R$ 2.500 / mês",
  },
  {
    segment: "Transportes",
    title: "Patrocinador oficial de Transportes",
    description:
      "Espaço pensado para transportadoras, logística, motoristas e parceiros comerciais.",
    audience: "Transportadoras, embarcadores, motoristas e operação logística.",
    placement: "Módulos de transportes, cadastros e áreas de conexão comercial.",
    tier: "Premium do segmento",
    monthlyValue: "R$ 1.200 a R$ 2.200 / mês",
  },
  {
    segment: "Financeiro",
    title: "Patrocinador oficial do Financeiro",
    description:
      "Área ideal para fintechs, bancos, parceiros de crédito, seguros e serviços financeiros.",
    audience: "Empresas, operações, parceiros financeiros e tomada de decisão.",
    placement: "Financeiro Aurora, áreas estratégicas e pontos de autoridade.",
    tier: "Exclusivo",
    monthlyValue: "R$ 3.000 a R$ 7.000 / mês",
  },
  {
    segment: "Serviços",
    title: "Patrocinador oficial de Serviços",
    description:
      "Vitrine premium para empresas prestadoras de serviços em múltiplos segmentos.",
    audience: "Empresas, compradores, fornecedores e rede de atendimento.",
    placement: "Vitrine comercial, áreas de busca e cadastros segmentados.",
    tier: "Destaque local",
    monthlyValue: "R$ 500 a R$ 1.200 / mês",
  },
  {
    segment: "Mineração",
    title: "Patrocinador oficial da Mineração",
    description:
      "Espaço estratégico para fornecedores, operações, engenharia e negócios da mineração.",
    audience: "Empresas de mineração, fornecedores, parceiros e compradores.",
    placement: "Área Mineração, páginas públicas e blocos de autoridade.",
    tier: "Exclusivo",
    monthlyValue: "R$ 2.500 a R$ 6.000 / mês",
  },
];

function getTierStyles(tier: SponsorTier) {
  if (tier === "Exclusivo") {
    return {
      background: "rgba(245,158,11,0.10)",
      border: "1px solid rgba(245,158,11,0.18)",
      color: "#b45309",
    };
  }

  if (tier === "Premium do segmento") {
    return {
      background: "rgba(37,99,235,0.10)",
      border: "1px solid rgba(37,99,235,0.18)",
      color: "#1d4ed8",
    };
  }

  return {
    background: "rgba(16,185,129,0.10)",
    border: "1px solid rgba(16,185,129,0.18)",
    color: "#047857",
  };
}

export default function PatrocinadoresPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(59,130,246,0.10), transparent 18%), radial-gradient(circle at left, rgba(34,197,94,0.10), transparent 24%), linear-gradient(180deg, #eef6ff 0%, #f7fbff 36%, #edf7f3 100%)",
        color: "#0f172a",
        padding: "24px 16px 80px",
      }}
    >
      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          display: "grid",
          gap: 18,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <TopLink href="/" label="Voltar à Home" color="#2563eb" />
          <TopLink href="/guardiao" label="Ir para o Guardião" color="#0f766e" />
          <TopLink href="/cadastro-geral" label="Ir para Cadastro" color="#2563eb" />
          <TopLink href="/mineracao" label="Mineração" color="#1d4ed8" />
        </div>

        <section
          style={{
            border: "1px solid rgba(15,23,42,0.08)",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.88), rgba(255,255,255,0.74))",
            borderRadius: 28,
            padding: "26px 22px",
            boxShadow: "0 18px 60px rgba(15,23,42,0.08)",
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
              background: "rgba(37,99,235,0.08)",
              border: "1px solid rgba(37,99,235,0.16)",
              color: "#2563eb",
              fontSize: 13,
              fontWeight: 800,
            }}
          >
            🤝 Patrocinadores Aurora
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "clamp(30px, 6vw, 52px)",
              lineHeight: 1.02,
              letterSpacing: "-0.03em",
              color: "#0f172a",
            }}
          >
            Patrocinadores oficiais por segmento
          </h1>

          <p
            style={{
              margin: 0,
              color: "rgba(15,23,42,0.74)",
              fontSize: 18,
              lineHeight: 1.7,
              maxWidth: 980,
              fontWeight: 700,
            }}
          >
            A Aurora não vende apenas banner. A Aurora abre espaço para parceiros
            oficiais por segmento, com presença premium dentro de um ecossistema
            empresarial em crescimento. Sistema em constante atualização e pode haver
            momentos de instabilidade durante melhorias e novas liberações.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 12,
            }}
          >
            <MiniInfo
              title="Modelo"
              value="Parceiro oficial"
              text="A proposta é vender autoridade e presença por segmento, não só um banner."
            />
            <MiniInfo
              title="Formato"
              value="1 por segmento"
              text="Cada segmento pode ter destaque premium com exposição organizada."
            />
            <MiniInfo
              title="Monetização"
              value="Receita recorrente"
              text="Base pensada para contratos mensais e evolução comercial da plataforma."
            />
            <MiniInfo
              title="Estratégia"
              value="Começar enxuto"
              text="Primeiro validamos segmentos estratégicos e depois ampliamos a oferta."
            />
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 16,
          }}
        >
          {sponsorCards.map((card) => {
            const tierStyle = getTierStyles(card.tier);

            return (
              <article
                key={`${card.segment}-${card.title}`}
                style={{
                  border: "1px solid rgba(15,23,42,0.08)",
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.88), rgba(255,255,255,0.74))",
                  borderRadius: 24,
                  padding: "22px 18px",
                  boxShadow: "0 18px 60px rgba(15,23,42,0.06)",
                  display: "grid",
                  gap: 14,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
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
                        fontWeight: 900,
                        color: "#2563eb",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                      }}
                    >
                      {card.segment}
                    </div>

                    <h2
                      style={{
                        margin: 0,
                        fontSize: 24,
                        lineHeight: 1.1,
                        fontWeight: 900,
                        color: "#0f172a",
                      }}
                    >
                      {card.title}
                    </h2>
                  </div>

                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      minHeight: 34,
                      padding: "0 12px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 800,
                      ...tierStyle,
                    }}
                  >
                    {card.tier}
                  </span>
                </div>

                <p
                  style={{
                    margin: 0,
                    color: "rgba(15,23,42,0.72)",
                    lineHeight: 1.7,
                    fontSize: 14,
                  }}
                >
                  {card.description}
                </p>

                <InfoLine label="Público" value={card.audience} />
                <InfoLine label="Posicionamento" value={card.placement} />
                <InfoLine label="Base de investimento" value={card.monthlyValue} />

                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    flexWrap: "wrap",
                    marginTop: 4,
                  }}
                >
                  <Link href="/cadastro-geral" style={primaryButton}>
                    Quero ser patrocinador
                  </Link>

                  <Link href="/" style={secondaryButton}>
                    Ver home Aurora
                  </Link>
                </div>
              </article>
            );
          })}
        </section>

        <section
          style={{
            border: "1px solid rgba(15,23,42,0.08)",
            background:
              "linear-gradient(135deg, rgba(37,99,235,0.08), rgba(16,185,129,0.08))",
            borderRadius: 24,
            padding: "22px 18px",
            display: "grid",
            gap: 14,
            boxShadow: "0 16px 34px rgba(15,23,42,0.06)",
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
                fontSize: 22,
                fontWeight: 900,
                color: "#0f172a",
              }}
            >
              Como vender isso para as empresas
            </div>

            <div
              style={{
                fontSize: 14,
                lineHeight: 1.7,
                color: "rgba(15,23,42,0.72)",
              }}
            >
              Você não está oferecendo só uma logo no site. Você está oferecendo
              presença premium, associação de marca e posição oficial dentro de um
              segmento estratégico da Aurora.
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 12,
            }}
          >
            <MiniInfo
              title="Argumento 1"
              value="Autoridade"
              text="A empresa aparece como parceira oficial do segmento dentro da plataforma."
            />
            <MiniInfo
              title="Argumento 2"
              value="Exposição"
              text="A marca ganha presença em área estratégica, não escondida como banner comum."
            />
            <MiniInfo
              title="Argumento 3"
              value="Recorrência"
              text="Modelo mensal simples, com potencial de renovação e crescimento."
            />
            <MiniInfo
              title="Argumento 4"
              value="Escalada"
              text="Começa com segmentos principais e depois amplia para outras áreas da Aurora."
            />
          </div>
        </section>
      </div>
    </main>
  );
}

function TopLink({
  href,
  label,
  color,
}: {
  href: string;
  label: string;
  color: string;
}) {
  return (
    <Link
      href={href}
      style={{
        textDecoration: "none",
        border: "1px solid rgba(15,23,42,0.08)",
        background: "rgba(255,255,255,0.76)",
        borderRadius: 14,
        padding: "10px 14px",
        fontWeight: 800,
        boxShadow: "0 8px 18px rgba(15,23,42,0.04)",
        color,
      }}
    >
      {label}
    </Link>
  );
}

function MiniInfo({
  title,
  value,
  text,
}: {
  title: string;
  value: string;
  text: string;
}) {
  return (
    <div
      style={{
        borderRadius: 18,
        padding: "16px",
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.80), rgba(255,255,255,0.64))",
        border: "1px solid rgba(15,23,42,0.08)",
        display: "grid",
        gap: 8,
        boxShadow: "0 8px 18px rgba(15,23,42,0.04)",
      }}
    >
      <div
        style={{
          fontSize: 12,
          fontWeight: 900,
          color: "#2563eb",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: 22,
          fontWeight: 900,
          color: "#0f172a",
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 14,
          lineHeight: 1.6,
          color: "rgba(15,23,42,0.62)",
        }}
      >
        {text}
      </div>
    </div>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        borderRadius: 16,
        padding: "12px 14px",
        background: "rgba(255,255,255,0.76)",
        border: "1px solid rgba(15,23,42,0.08)",
        color: "rgba(15,23,42,0.74)",
        fontSize: 14,
        lineHeight: 1.7,
        boxShadow: "0 8px 18px rgba(15,23,42,0.04)",
      }}
    >
      <strong style={{ color: "#0f172a" }}>{label}: </strong>
      {value}
    </div>
  );
}

const primaryButton: React.CSSProperties = {
  cursor: "pointer",
  borderRadius: 16,
  border: "1px solid rgba(37,99,235,0.16)",
  background: "linear-gradient(135deg, #2563eb, #3b82f6)",
  color: "#ffffff",
  padding: "14px 18px",
  fontWeight: 900,
  boxShadow: "0 12px 28px rgba(37,99,235,0.16)",
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};

const secondaryButton: React.CSSProperties = {
  cursor: "pointer",
  borderRadius: 16,
  border: "1px solid rgba(15,23,42,0.08)",
  background: "rgba(255,255,255,0.78)",
  color: "#0f172a",
  padding: "14px 18px",
  fontWeight: 800,
  boxShadow: "0 8px 18px rgba(15,23,42,0.04)",
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};