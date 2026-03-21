"use client";

import Link from "next/link";

export default function ViralPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(0,208,132,0.18), transparent 40%), #020617",
        color: "#fff",
        padding: "24px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{ width: "100%", maxWidth: "860px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
            marginBottom: "20px",
          }}
        >
          <Link href="/" style={{ color: "#75ffbf", textDecoration: "none" }}>
            ← Home
          </Link>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <Link
              href="/chat"
              style={{
                color: "#fff",
                textDecoration: "none",
                padding: "10px 14px",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              Chat
            </Link>

            <Link
              href="/oferta"
              style={{
                color: "#fff",
                textDecoration: "none",
                padding: "10px 14px",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              Oferta
            </Link>
          </div>
        </div>

        <section
          style={{
            borderRadius: "30px",
            padding: "30px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(0,208,132,0.16)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.35)",
            marginBottom: "18px",
          }}
        >
          <span
            style={{
              display: "inline-block",
              padding: "8px 14px",
              borderRadius: "999px",
              background: "rgba(0,208,132,0.12)",
              color: "#75ffbf",
              marginBottom: "16px",
            }}
          >
            Aurora IA • Página Viral
          </span>

          <h1 style={{ fontSize: "2.4rem", lineHeight: 1.08, marginBottom: "14px" }}>
            Crie imagens, campanhas e ideias de negócio em segundos com IA.
          </h1>

          <p style={{ opacity: 0.82, lineHeight: 1.7, fontSize: "1.04rem" }}>
            A Aurora IA foi feita para chamar atenção, gerar imagens de impacto,
            acelerar campanhas e transformar curiosidade em oportunidade real de
            venda.
          </p>

          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              marginTop: "20px",
            }}
          >
            <Link
              href="/chat"
              style={{
                padding: "14px 18px",
                borderRadius: "14px",
                textDecoration: "none",
                background: "linear-gradient(135deg, #00d084, #75ffbf)",
                color: "#000",
                fontWeight: "bold",
              }}
            >
              Testar agora
            </Link>

            <Link
              href="/oferta"
              style={{
                padding: "14px 18px",
                borderRadius: "14px",
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#fff",
              }}
            >
              Ver planos
            </Link>
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
            marginBottom: "18px",
          }}
        >
          {[
            [
              "Imagens que chamam atenção",
              "Peça uma arte impactante e use em anúncio, post ou campanha.",
            ],
            [
              "Textos e campanhas",
              "Gere ideias, ofertas, argumentos de venda e criativos.",
            ],
            [
              "Uso prático",
              "Ideal para negócio local, criador, afiliado e operação comercial.",
            ],
          ].map(([title, text]) => (
            <div
              key={title}
              style={{
                borderRadius: "22px",
                padding: "20px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <strong style={{ display: "block", marginBottom: "10px" }}>{title}</strong>
              <span style={{ opacity: 0.78, lineHeight: 1.65 }}>{text}</span>
            </div>
          ))}
        </section>

        <section
          style={{
            borderRadius: "26px",
            padding: "26px",
            background: "rgba(117,255,191,0.06)",
            border: "1px solid rgba(117,255,191,0.15)",
            marginBottom: "18px",
          }}
        >
          <h2 style={{ marginTop: 0, marginBottom: "12px" }}>
            O que as pessoas querem fazer aqui
          </h2>

          <div style={{ display: "grid", gap: "10px" }}>
            {[
              "Criar imagem de campanha em segundos",
              "Testar uma ideia de negócio",
              "Montar texto de vendas rápido",
              "Gerar algo bonito para postar e divulgar",
            ].map((item) => (
              <div
                key={item}
                style={{
                  padding: "14px 16px",
                  borderRadius: "14px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section
          style={{
            borderRadius: "26px",
            padding: "26px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <h2 style={{ marginTop: 0, marginBottom: "12px" }}>
            Chamada final
          </h2>

          <p style={{ opacity: 0.84, lineHeight: 1.7 }}>
            Entre agora, teste a Aurora e veja como uma boa experiência de IA pode
            prender atenção, gerar valor e abrir espaço para vendas.
          </p>

          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              marginTop: "16px",
            }}
          >
            <Link
              href="/chat"
              style={{
                padding: "14px 18px",
                borderRadius: "14px",
                textDecoration: "none",
                background: "#00d084",
                color: "#000",
                fontWeight: "bold",
              }}
            >
              Abrir Aurora
            </Link>

            <Link
              href="/afiliado"
              style={{
                padding: "14px 18px",
                borderRadius: "14px",
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#fff",
              }}
            >
              Quero divulgar
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}