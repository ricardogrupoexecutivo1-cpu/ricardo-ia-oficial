"use client";

import Link from "next/link";

const imagensDemo = [
  {
    titulo: "Cidade futurista criada com IA",
    descricao: "Exemplo de arte gerada com a Aurora IA.",
  },
  {
    titulo: "Robô tecnológico neon",
    descricao: "Imagem promocional em estilo futurista.",
  },
  {
    titulo: "Campanha visual para redes sociais",
    descricao: "Criativo pronto para Instagram e Facebook.",
  },
  {
    titulo: "Arte conceitual de produto",
    descricao: "Exemplo de criação visual rápida com IA.",
  },
  {
    titulo: "Paisagem sci-fi cinematográfica",
    descricao: "Composição visual com alto impacto.",
  },
  {
    titulo: "Mascote digital da Aurora",
    descricao: "Visual publicitário com identidade tecnológica.",
  },
];

export default function ExplorarPage() {
  return (
    <main
      style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: "40px 20px",
        fontFamily: "system-ui",
      }}
    >
      <h1
        style={{
          fontSize: "36px",
          fontWeight: 800,
          color: "#111827",
        }}
      >
        Explorar criações da Aurora IA
      </h1>

      <p
        style={{
          marginTop: 12,
          color: "#374151",
          lineHeight: 1.7,
          maxWidth: 850,
        }}
      >
        Descubra exemplos de imagens, ideias visuais e materiais criados com a
        Aurora IA. Esta página será a vitrine pública das criações da
        plataforma.
      </p>

      <div
        style={{
          marginTop: 20,
          padding: "14px 16px",
          borderRadius: 14,
          border: "1px solid #fde68a",
          background: "#fef9c3",
          color: "#92400e",
          fontWeight: 600,
          lineHeight: 1.6,
        }}
      >
        🚀 Em breve, esta galeria exibirá imagens reais criadas pelos usuários
        da Aurora IA e poderá atrair tráfego orgânico do Google.
      </div>

      <div
        style={{
          marginTop: 30,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 20,
        }}
      >
        {imagensDemo.map((item, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 18,
              overflow: "hidden",
              background: "#ffffff",
              boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
            }}
          >
            <div
              style={{
                height: 220,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                  "linear-gradient(135deg, #111827 0%, #1d4ed8 45%, #7c3aed 100%)",
                color: "#ffffff",
                fontWeight: 800,
                fontSize: 22,
                textAlign: "center",
                padding: 20,
              }}
            >
              Aurora IA
            </div>

            <div style={{ padding: 18 }}>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: "#111827",
                }}
              >
                {item.titulo}
              </div>

              <div
                style={{
                  marginTop: 8,
                  color: "#4b5563",
                  lineHeight: 1.6,
                }}
              >
                {item.descricao}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: 34,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 14,
        }}
      >
        <Link
          href="/chat"
          style={{
            display: "block",
            textAlign: "center",
            padding: "16px",
            borderRadius: 14,
            textDecoration: "none",
            background: "#111827",
            color: "#ffffff",
            fontWeight: 800,
          }}
        >
          Testar Aurora agora
        </Link>

        <Link
          href="/planos"
          style={{
            display: "block",
            textAlign: "center",
            padding: "16px",
            borderRadius: 14,
            textDecoration: "none",
            background: "linear-gradient(135deg,#facc15,#f59e0b)",
            color: "#111827",
            fontWeight: 800,
          }}
        >
          Ver planos
        </Link>

        <Link
          href="/ganhe"
          style={{
            display: "block",
            textAlign: "center",
            padding: "16px",
            borderRadius: 14,
            textDecoration: "none",
            background: "#ecfeff",
            color: "#0f172a",
            fontWeight: 800,
            border: "1px solid #a5f3fc",
          }}
        >
          Ganhar indicando Aurora
        </Link>
      </div>
    </main>
  );
}