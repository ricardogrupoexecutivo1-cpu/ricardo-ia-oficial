import Link from "next/link";

const sections = [
  {
    title: "1. Objeto do patrocínio",
    items: [
      "A Aurora oferece espaço comercial para patrocinadores oficiais por segmento dentro da plataforma.",
      "O patrocínio pode incluir presença em página institucional, página de segmento, área de destaque, vitrine comercial e outras posições definidas pela Aurora.",
      "A contratação não representa exclusividade automática, salvo quando houver plano específico de exclusividade descrito e aprovado comercialmente.",
    ],
  },
  {
    title: "2. Entrada comercial e análise",
    items: [
      "Todo patrocinador entra inicialmente como lead comercial e passa por análise interna da Aurora.",
      "A Aurora poderá aprovar, reprovar ou solicitar ajustes de campanha, identidade visual, texto, logo, segmento ou posicionamento.",
      "O envio do formulário não garante ativação imediata nem reserva automática de espaço.",
    ],
  },
  {
    title: "3. Planos e exposição",
    items: [
      "Os planos podem variar conforme segmento, posição, tempo de exposição e formato contratado.",
      "A Aurora poderá trabalhar com plano local, premium do segmento e exclusivo, entre outros formatos comerciais.",
      "Cada segmento poderá ter limitação de vagas para manter clareza, valor percebido e qualidade da exposição.",
    ],
  },
  {
    title: "4. Pagamento",
    items: [
      "O pagamento deverá ocorrer por meio oficial definido pela Aurora, preferencialmente dentro da plataforma ou por link de pagamento autorizado.",
      "Nenhum patrocinador será ativado de forma definitiva sem a confirmação do pagamento correspondente ao plano aprovado.",
      "Em caso de atraso, a Aurora poderá pausar ou não ativar a exposição comercial até a regularização.",
    ],
  },
  {
    title: "5. Prazo e renovação",
    items: [
      "O patrocínio terá prazo definido na proposta comercial aprovada.",
      "Salvo disposição diferente no acordo comercial, a renovação poderá ocorrer automaticamente por novo ciclo do mesmo plano.",
      "A Aurora deverá manter transparência sobre valor, prazo, renovação e condição de continuidade.",
    ],
  },
  {
    title: "6. Cancelamento",
    items: [
      "O patrocinador poderá solicitar encerramento conforme as regras comerciais vigentes e o prazo acordado.",
      "A Aurora poderá encerrar a exposição em caso de descumprimento de regras, inadimplência, uso indevido de marca, conteúdo enganoso ou risco à plataforma.",
      "Quando aplicável, cancelamentos deverão respeitar o ciclo vigente e condições previamente aprovadas.",
    ],
  },
  {
    title: "7. Conteúdo, campanha e identidade visual",
    items: [
      "O patrocinador é responsável pela veracidade das informações, identidade visual, campanhas, textos, links e materiais enviados.",
      "A Aurora poderá solicitar ajustes para manter padrão visual, clareza, compatibilidade técnica e segurança do usuário.",
      "Não será permitido conteúdo ilegal, enganoso, ofensivo, abusivo, discriminatório ou que comprometa a reputação da plataforma.",
    ],
  },
  {
    title: "8. Uso de marca e posicionamento",
    items: [
      "A Aurora poderá exibir nome, logo, descrição, link e campanha do patrocinador dentro dos espaços contratados.",
      "A posição visual do patrocinador poderá variar conforme plano, layout, evolução do produto e necessidade de usabilidade da plataforma.",
      "A contratação de patrocínio não transfere controle editorial ou estrutural da plataforma ao patrocinador.",
    ],
  },
  {
    title: "9. Transparência e segurança",
    items: [
      "A Aurora atuará com transparência máxima em relação a preço, entrega, vigência, ativação e encerramento.",
      "Os dados comerciais recebidos serão tratados de forma profissional para viabilizar análise, contato, proposta, contrato e ativação.",
      "A Aurora poderá manter registros operacionais e históricos de leads, aprovações, ativações e cancelamentos para controle interno.",
    ],
  },
  {
    title: "10. Ativação e status comercial",
    items: [
      "O fluxo comercial poderá seguir status como: lead, em análise, aprovado, ativo e cancelado.",
      "A mudança de status dependerá da análise comercial, aceite das regras e confirmação do pagamento quando aplicável.",
      "A Aurora poderá criar futuramente área própria para acompanhamento operacional do patrocinador dentro da plataforma.",
    ],
  },
];

export default function PatrocinadoresTermosPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "24px 16px 80px",
        background:
          "radial-gradient(circle at top, rgba(59,130,246,0.10), transparent 18%), radial-gradient(circle at left, rgba(34,197,94,0.10), transparent 24%), linear-gradient(180deg, #eef6ff 0%, #f7fbff 36%, #edf7f3 100%)",
      }}
    >
      <div
        style={{
          maxWidth: 1180,
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
          <TopLink href="/patrocinadores" label="Ver patrocinadores" color="#0f766e" />
          <TopLink
            href="/patrocinador-cadastro"
            label="Novo patrocinador"
            color="#2563eb"
          />
          <TopLink
            href="/patrocinadores-painel"
            label="Painel comercial"
            color="#0f766e"
          />
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
            📜 Regras comerciais Aurora
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "clamp(30px, 6vw, 48px)",
              lineHeight: 1.02,
              letterSpacing: "-0.03em",
              color: "#0f172a",
            }}
          >
            Contrato base e regras comerciais do patrocinador
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
            Esta página foi criada para garantir clareza, segurança e transparência
            máxima no relacionamento comercial entre a Aurora e seus patrocinadores.
            O objetivo é deixar regras, entregas, limites, pagamento, renovação e
            cancelamento compreensíveis antes da ativação de qualquer campanha.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 12,
            }}
          >
            <MiniInfo
              title="Clareza"
              value="Objetiva"
              text="Explicação direta para evitar dúvida comercial e reduzir ruído."
            />
            <MiniInfo
              title="Segurança"
              value="Profissional"
              text="A base comercial precisa proteger a Aurora e o patrocinador."
            />
            <MiniInfo
              title="Transparência"
              value="Total"
              text="Preço, prazo, renovação, cancelamento e entrega devem ser claros."
            />
            <MiniInfo
              title="Escala"
              value="Pronta"
              text="Estrutura preparada para crescer sem perder organização."
            />
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gap: 16,
          }}
        >
          {sections.map((section) => (
            <article
              key={section.title}
              style={{
                border: "1px solid rgba(15,23,42,0.08)",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.88), rgba(255,255,255,0.74))",
                borderRadius: 24,
                padding: "22px 18px",
                boxShadow: "0 18px 60px rgba(15,23,42,0.06)",
                display: "grid",
                gap: 12,
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: 24,
                  lineHeight: 1.12,
                  fontWeight: 900,
                  color: "#0f172a",
                }}
              >
                {section.title}
              </h2>

              <div
                style={{
                  display: "grid",
                  gap: 10,
                }}
              >
                {section.items.map((item, index) => (
                  <div
                    key={`${section.title}-${index}`}
                    style={{
                      borderRadius: 16,
                      padding: "12px 14px",
                      background: "rgba(248,250,252,0.9)",
                      border: "1px solid rgba(15,23,42,0.06)",
                      color: "rgba(15,23,42,0.78)",
                      lineHeight: 1.7,
                      fontSize: 14,
                      fontWeight: 700,
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </article>
          ))}
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
              Próximos passos comerciais
            </div>

            <div
              style={{
                fontSize: 14,
                lineHeight: 1.7,
                color: "rgba(15,23,42,0.72)",
              }}
            >
              Depois da aprovação comercial, a Aurora poderá seguir com proposta,
              contrato formal, pagamento, ativação do patrocinador e posicionamento
              visual no segmento correspondente.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <Link href="/patrocinador-cadastro" style={styles.primaryButton}>
              Quero ser patrocinador
            </Link>
            <Link href="/patrocinadores-painel" style={styles.secondaryButton}>
              Ver painel comercial
            </Link>
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
        ...styles.topLink,
        borderColor: color,
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
    <div style={styles.infoCard}>
      <div style={styles.infoTitle}>{title}</div>
      <div style={styles.infoValue}>{value}</div>
      <div style={styles.infoText}>{text}</div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  topLink: {
    textDecoration: "none",
    border: "1px solid rgba(15,23,42,0.08)",
    background: "rgba(255,255,255,0.76)",
    borderRadius: 14,
    padding: "10px 14px",
    fontWeight: 800,
    boxShadow: "0 8px 18px rgba(15,23,42,0.04)",
  },
  infoCard: {
    borderRadius: 18,
    padding: "16px",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.80), rgba(255,255,255,0.64))",
    border: "1px solid rgba(15,23,42,0.08)",
    display: "grid",
    gap: 8,
    boxShadow: "0 8px 18px rgba(15,23,42,0.04)",
  },
  infoTitle: {
    fontSize: 12,
    fontWeight: 900,
    color: "#2563eb",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  infoValue: {
    fontSize: 22,
    fontWeight: 900,
    color: "#0f172a",
  },
  infoText: {
    fontSize: 14,
    lineHeight: 1.6,
    color: "rgba(15,23,42,0.62)",
  },
  primaryButton: {
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
  },
  secondaryButton: {
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
  },
};