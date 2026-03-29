"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const chapter1 = `
Capitulo 1 - O comeco da virada

Todo negocio nasce duas vezes. Primeiro na mente de quem enxerga uma oportunidade. Depois no mundo real, quando essa visao ganha forma, produto, atendimento e constancia.

A maioria das pessoas para no primeiro nascimento. Sonha, fala, imagina, planeja, mas nao constroi. O vencedor entende que visao sem execucao e so desejo bonito.

A Aurora nasce com esse espirito: organizar, integrar, acelerar e transformar ideias em operacao real. Nao basta ter um site. Nao basta ter trafego. Nao basta aparecer. O que gera resultado e construir um ecossistema em que cada entrada leva a uma acao, cada acao leva a uma oportunidade, e cada oportunidade pode virar relacionamento, recorrencia e faturamento.

Quem domina isso sai do improviso e entra na gestao.
`;

const chapter2 = `
Capitulo 2 - A forca do ecossistema

Negocios isolados brigam para sobreviver. Ecossistemas crescem se alimentando das conexoes entre suas partes.

Quando uma empresa entra, ela nao compra apenas visibilidade. Ela entra em uma rede. Um fornecedor pode virar parceiro. Um motorista pode virar oportunidade. Um cliente pode virar recorrencia. Um conteudo pode virar autoridade. Um atendimento pode virar indicacao. Uma plataforma organizada transforma trafego em relacionamento.

Esse e o poder de uma estrutura bem pensada: um cadastro nao e so um formulario, uma pagina nao e so uma tela, um botao nao e so um clique. Tudo e porta de entrada para uma proxima acao.

O grande jogo nao e apenas atrair pessoas. E manter, direcionar e transformar esse movimento em valor real.
`;

const previewText = `
Capitulo 3 - A construcao da confianca

Confianca nao e discurso. E experiencia. E o cliente sentir que existe organizacao, clareza, cuidado e continuidade.

Capitulo 4 - Retencao e permanencia

A retencao nasce quando o usuario encontra valor recorrente. Perfil proprio, historico, atendimento, financeiro, vistoria, contratos e relacionamento formam um ambiente onde voltar faz sentido.
`;

export default function LivroPage() {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("aurora_book_unlocked");
      setUnlocked(saved === "true");
    } catch {
      setUnlocked(false);
    }
  }, []);

  function unlockLocal() {
    try {
      window.localStorage.setItem("aurora_book_unlocked", "true");
      setUnlocked(true);
    } catch {}
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#020617",
        color: "#ffffff",
        padding: "24px 14px 80px",
      }}
    >
      <section
        style={{
          maxWidth: 960,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "inline-block",
            padding: "8px 12px",
            borderRadius: 999,
            background: "rgba(59,130,246,0.12)",
            border: "1px solid rgba(59,130,246,0.22)",
            color: "#bfdbfe",
            fontWeight: 800,
            fontSize: 12,
            marginBottom: 18,
          }}
        >
          LIVRO AURORA IA
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: "clamp(30px, 8vw, 56px)",
            lineHeight: 1.02,
            fontWeight: 900,
            maxWidth: 760,
          }}
        >
          Leia dois capitulos e desbloqueie o livro completo
        </h1>

        <p
          style={{
            marginTop: 16,
            color: "#cbd5e1",
            fontSize: 18,
            lineHeight: 1.7,
            maxWidth: 820,
          }}
        >
          O livro vira porta de entrada para a Aurora. A pessoa le uma parte,
          entende o valor e recebe um convite claro para continuar.
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            marginTop: 22,
          }}
        >
          <Link href="/" style={secondaryButton}>
            Voltar para home
          </Link>

          <button type="button" onClick={unlockLocal} style={primaryButton}>
            Simular desbloqueio local
          </button>
        </div>

        <section style={card}>
          <div style={label}>CAPITULO 1</div>
          <h2 style={title}>O comeco da virada</h2>
          <div style={bodyText}>{chapter1}</div>
        </section>

        <section style={{ ...card, marginTop: 16 }}>
          <div style={label}>CAPITULO 2</div>
          <h2 style={title}>A forca do ecossistema</h2>
          <div style={bodyText}>{chapter2}</div>
        </section>

        {!unlocked ? (
          <section style={lockCard}>
            <div style={labelGreen}>CONTEUDO BLOQUEADO</div>
            <h2 style={lockTitle}>
              Continue lendo e baixe o livro completo gratuitamente
            </h2>

            <p style={lockText}>
              No proximo passo, vamos ligar isso ao cadastro real da plataforma.
              Por enquanto, voce ja consegue validar a experiencia de leitura e
              bloqueio.
            </p>

            <div style={previewBox}>
              <div style={label}>PREVIA</div>
              <div style={bodyText}>{previewText}</div>
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
                marginTop: 18,
              }}
            >
              <button type="button" onClick={unlockLocal} style={primaryButton}>
                Liberar leitura local
              </button>

              <Link href="/" style={secondaryButton}>
                Voltar
              </Link>
            </div>
          </section>
        ) : (
          <section style={unlockCard}>
            <div style={labelBlue}>ACESSO LIBERADO</div>
            <h2 style={lockTitle}>Livro completo desbloqueado</h2>

            <p style={lockText}>
              Agora a leitura completa pode ser vista aqui. No proximo passo,
              vamos amarrar isso com cadastro real e download liberado.
            </p>

            <div style={previewBox}>
              <div style={label}>VERSAO LIBERADA</div>
              <div style={bodyText}>
                {chapter1}
                {"\n\n"}
                {chapter2}
                {"\n\n"}
                {previewText}
                {"\n\n"}
                Capitulo 5 - Direcionamento total ao cliente
                {"\n\n"}
                O verdadeiro diferencial esta em entender a intencao de cada
                pessoa e conduzir para o lugar certo. Um sistema que escuta,
                organiza e direciona vende mais e retem melhor.
              </div>
            </div>
          </section>
        )}
      </section>
    </main>
  );
}

const card = {
  marginTop: 24,
  borderRadius: 20,
  padding: 18,
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
};

const lockCard = {
  marginTop: 24,
  borderRadius: 20,
  padding: 20,
  background: "rgba(34,197,94,0.08)",
  border: "1px solid rgba(34,197,94,0.22)",
};

const unlockCard = {
  marginTop: 24,
  borderRadius: 20,
  padding: 20,
  background: "rgba(59,130,246,0.08)",
  border: "1px solid rgba(59,130,246,0.22)",
};

const label = {
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: "0.14em",
  color: "#8db5d9",
  marginBottom: 10,
};

const labelGreen = {
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: "0.14em",
  color: "#b9f7cf",
  marginBottom: 10,
};

const labelBlue = {
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: "0.14em",
  color: "#bfdbfe",
  marginBottom: 10,
};

const title = {
  margin: "0 0 10px",
  fontSize: 28,
  fontWeight: 900,
  lineHeight: 1.08,
};

const lockTitle = {
  margin: "0 0 10px",
  fontSize: "clamp(24px, 6vw, 38px)",
  fontWeight: 900,
  lineHeight: 1.08,
};

const bodyText = {
  whiteSpace: "pre-wrap" as const,
  color: "#d5e5f7",
  lineHeight: 1.85,
  fontSize: 16,
};

const lockText = {
  margin: 0,
  color: "#d5e5f7",
  lineHeight: 1.8,
  fontSize: 16,
};

const previewBox = {
  marginTop: 16,
  borderRadius: 18,
  padding: 16,
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
};

const primaryButton = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 46,
  padding: "0 18px",
  borderRadius: 14,
  textDecoration: "none",
  fontWeight: 800,
  fontSize: 15,
  color: "#04110a",
  background: "linear-gradient(135deg, #22c55e, #86efac)",
  border: "none",
  cursor: "pointer",
};

const secondaryButton = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 46,
  padding: "0 18px",
  borderRadius: 14,
  textDecoration: "none",
  fontWeight: 700,
  fontSize: 15,
  color: "#e5e7eb",
  border: "1px solid rgba(148,163,184,0.28)",
  background: "rgba(15,23,42,0.62)",
};