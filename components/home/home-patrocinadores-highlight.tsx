import Link from "next/link";

export default function HomePatrocinadoresHighlight() {
  return (
    <section
      style={{
        border: "1px solid rgba(15,23,42,0.08)",
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,255,255,0.80))",
        borderRadius: 32,
        padding: "28px 22px",
        boxShadow: "0 20px 60px rgba(15,23,42,0.08)",
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
        💼 Patrocinadores Aurora
      </div>

      <div
        style={{
          display: "grid",
          gap: 12,
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "clamp(28px, 4vw, 42px)",
            lineHeight: 1.02,
            letterSpacing: "-0.03em",
            color: "#0f172a",
          }}
        >
          Destaque sua marca dentro do ecossistema Aurora
        </h2>

        <p
          style={{
            margin: 0,
            color: "rgba(15,23,42,0.74)",
            fontSize: 17,
            lineHeight: 1.7,
            maxWidth: 980,
            fontWeight: 700,
          }}
        >
          Empresas podem patrocinar segmentos estratégicos da Aurora com presença
          comercial clara, profissional e pronta para escala. O fluxo já foi
          estruturado com painel comercial, cobrança e ativação para transformar
          visibilidade em receita real.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 12,
        }}
      >
        <MiniCard
          title="Presença forte"
          text="Sua marca pode entrar em áreas estratégicas da Aurora com destaque comercial e posicionamento premium."
        />
        <MiniCard
          title="Fluxo real"
          text="A Aurora já está preparada para organizar lead, análise, cobrança, pagamento e ativação."
        />
        <MiniCard
          title="Entrada simples"
          text="O patrocinador pode começar com uma estrutura objetiva, clara e pronta para conversão."
        />
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <Link href="/patrocinador-cadastro" style={styles.primaryButton}>
          Quero patrocinar a Aurora
        </Link>

        <Link href="/patrocinadores-termos" style={styles.secondaryButton}>
          Ver regras comerciais
        </Link>

        <Link href="/patrocinadores-painel" style={styles.secondaryButton}>
          Abrir painel comercial
        </Link>
      </div>

      <div
        style={{
          borderRadius: 20,
          padding: "16px 18px",
          background: "rgba(248,250,252,0.92)",
          border: "1px solid rgba(15,23,42,0.06)",
          color: "rgba(15,23,42,0.72)",
          fontSize: 14,
          lineHeight: 1.7,
          fontWeight: 700,
        }}
      >
        Sistema em constante atualização e pode haver momentos de instabilidade
        durante melhorias. A Aurora está evoluindo para oferecer uma entrada
        comercial mais clara, segura e internacional.
      </div>
    </section>
  );
}

function MiniCard({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div
      style={{
        borderRadius: 20,
        padding: "18px 16px",
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.84), rgba(255,255,255,0.68))",
        border: "1px solid rgba(15,23,42,0.08)",
        display: "grid",
        gap: 8,
        boxShadow: "0 8px 18px rgba(15,23,42,0.04)",
      }}
    >
      <div
        style={{
          fontSize: 13,
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
          color: "#0f172a",
          fontSize: 15,
          lineHeight: 1.7,
          fontWeight: 700,
        }}
      >
        {text}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  primaryButton: {
    textDecoration: "none",
    border: "1px solid rgba(37,99,235,0.16)",
    background: "linear-gradient(135deg, #2563eb, #3b82f6)",
    color: "#ffffff",
    borderRadius: 16,
    padding: "14px 18px",
    fontWeight: 900,
    boxShadow: "0 12px 28px rgba(37,99,235,0.16)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButton: {
    textDecoration: "none",
    border: "1px solid rgba(15,23,42,0.08)",
    background: "rgba(255,255,255,0.78)",
    color: "#0f172a",
    borderRadius: 16,
    padding: "14px 18px",
    fontWeight: 800,
    boxShadow: "0 8px 18px rgba(15,23,42,0.04)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  },
};