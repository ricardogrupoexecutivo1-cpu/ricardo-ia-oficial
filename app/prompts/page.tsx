"use client";

export default function PromptsPage() {
  const prompts = [
    "Crie 10 ideias de negócio lucrativas usando inteligência artificial.",
    "Crie uma campanha de marketing para Instagram para uma empresa de tecnologia.",
    "Gere um roteiro de vídeo viral para TikTok sobre inteligência artificial.",
    "Crie 5 slogans criativos para uma startup de tecnologia.",
    "Explique uma ideia de negócio inovadora que use IA para resolver problemas do dia a dia.",
    "Crie um post de Instagram para divulgar um produto tecnológico.",
    "Sugira 10 ideias de conteúdo para um canal sobre inteligência artificial.",
    "Crie um plano de marketing simples para uma pequena empresa.",
    "Explique como usar inteligência artificial para aumentar vendas online.",
    "Crie uma estratégia para crescer seguidores no Instagram usando IA."
  ];

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px" }}>
      <h1 style={{ fontSize: 34, fontWeight: 800 }}>
        Prompts de Inteligência Artificial
      </h1>

      <p style={{ marginTop: 10, lineHeight: 1.6 }}>
        Veja exemplos de prompts que podem ser usados com a Aurora IA para gerar
        ideias, campanhas de marketing, imagens e estratégias de crescimento.
      </p>

      <div style={{ marginTop: 30 }}>
        {prompts.map((prompt, index) => (
          <div
            key={index}
            style={{
              padding: 16,
              marginBottom: 12,
              borderRadius: 12,
              border: "1px solid #e5e7eb",
              background: "#f9fafb",
              fontWeight: 600
            }}
          >
            {index + 1}. {prompt}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 30 }}>
        <a
          href="/chat"
          style={{
            padding: "14px 20px",
            background: "#111827",
            color: "#fff",
            borderRadius: 10,
            textDecoration: "none",
            fontWeight: 700
          }}
        >
          Testar estes prompts na Aurora IA
        </a>
      </div>
    </main>
  );
}