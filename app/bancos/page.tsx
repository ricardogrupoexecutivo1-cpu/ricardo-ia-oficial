"use client";

export default function BancosPage() {
  return (
    <main style={{
      minHeight: "100vh",
      background: "linear-gradient(180deg,#050505,#0b0b0b)",
      color: "#fff",
      padding: "40px 20px"
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        
        {/* HERO */}
        <div style={{
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 30,
          padding: 30,
          background: "rgba(255,255,255,0.04)",
          marginBottom: 30
        }}>
          <h1 style={{ fontSize: 38, marginBottom: 10 }}>
            Bancos e Financeiras na Aurora
          </h1>

          <p style={{ color: "#aaa", fontSize: 16 }}>
            Receba clientes prontos para financiamento dentro da plataforma Aurora.
            Aprove ou recuse propostas em tempo real e gere receita sem sair do ecossistema.
          </p>
        </div>

        {/* BENEFÍCIOS */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 20,
          marginBottom: 30
        }}>
          {[
            "Clientes prontos para financiamento",
            "Propostas dentro da plataforma",
            "Alta conversão",
          ].map((item, i) => (
            <div key={i} style={{
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 20,
              padding: 20,
              background: "rgba(0,0,0,0.3)"
            }}>
              <strong>{item}</strong>
            </div>
          ))}
        </div>

        {/* EXPLICAÇÃO */}
        <div style={{
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 20,
          padding: 25,
          marginBottom: 30,
          background: "rgba(0,0,0,0.3)"
        }}>
          <h2 style={{ marginBottom: 10 }}>Como funciona</h2>

          <p style={{ color: "#bbb", lineHeight: 1.7 }}>
            O cliente escolhe um veículo ou imóvel, envia interesse e os bancos parceiros
            podem responder com propostas diretamente dentro da plataforma.
          </p>
        </div>

        {/* CTA */}
        <div style={{
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 20,
          padding: 30,
          textAlign: "center",
          background: "rgba(0,0,0,0.3)"
        }}>
          <h2 style={{ marginBottom: 10 }}>
            Seja um banco parceiro
          </h2>

          <p style={{ color: "#aaa", marginBottom: 20 }}>
            Cadastre sua instituição e comece a receber oportunidades.
          </p>

          <a
            href="/anunciar/cadastro?tipo=banco"
            style={{
              background: "#22c55e",
              color: "#000",
              padding: "14px 24px",
              borderRadius: 12,
              fontWeight: "bold",
              textDecoration: "none",
              display: "inline-block"
            }}
          >
            Cadastrar banco agora
          </a>
        </div>

      </div>
    </main>
  );
}