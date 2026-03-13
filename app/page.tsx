"use client";

import Link from "next/link";
import ReferralTracker from "./components/ReferralTracker";

export default function HomePage() {
  async function captureReferral(plan: "pro" | "influencer") {
    try {
      const refCode =
        typeof window !== "undefined"
          ? (localStorage.getItem("aurora_ref") || "").trim()
          : "";

      if (!refCode) return;

      await fetch("/api/referral/capture", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refCode,
          planClicked: plan,
          sourceUrl: typeof window !== "undefined" ? window.location.href : "",
        }),
      });
    } catch (error) {
      console.error("Erro ao capturar referência:", error);
    }
  }

  async function openPro() {
    await captureReferral("pro");
    window.open("https://www.asaas.com/c/ayfhkldtnk1osf37", "_blank");
  }

  async function openInfluencer() {
    await captureReferral("influencer");
    window.open("https://www.asaas.com/c/ej715gfx5qpvlh1v", "_blank");
  }

  async function shareAurora() {
    const ref =
      typeof window !== "undefined"
        ? localStorage.getItem("aurora_ref") || ""
        : "";

    const baseUrl = "https://ricardoiaoficial.com";
    const shareUrl = ref ? `${baseUrl}?ref=${encodeURIComponent(ref)}` : baseUrl;

    const shareData = {
      title: "Aurora IA",
      text: "Conheça a Aurora IA: inteligência artificial para atendimento, produtividade, marketing e geração de imagens.",
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }

      await navigator.clipboard.writeText(shareUrl);
      alert(`Link copiado com sucesso: ${shareUrl}`);
    } catch (error) {
      console.error("Erro ao compartilhar:", error);
    }
  }

  return (
    <main className="home-shell">
      <div className="neon-network">
        <div
          className="neon-line"
          style={{
            width: "280px",
            top: "12%",
            left: "8%",
            transform: "rotate(18deg)",
          }}
        ></div>
        <div
          className="neon-line"
          style={{
            width: "220px",
            top: "22%",
            left: "28%",
            transform: "rotate(-12deg)",
          }}
        ></div>
        <div
          className="neon-line"
          style={{
            width: "320px",
            top: "36%",
            left: "58%",
            transform: "rotate(10deg)",
          }}
        ></div>
        <div
          className="neon-line"
          style={{
            width: "240px",
            top: "68%",
            left: "12%",
            transform: "rotate(-16deg)",
          }}
        ></div>
        <div
          className="neon-line"
          style={{
            width: "300px",
            top: "78%",
            left: "54%",
            transform: "rotate(14deg)",
          }}
        ></div>

        <div className="neon-dot" style={{ top: "11%", left: "9%" }}></div>
        <div className="neon-dot" style={{ top: "21%", left: "43%" }}></div>
        <div className="neon-dot" style={{ top: "34%", left: "76%" }}></div>
        <div className="neon-dot" style={{ top: "67%", left: "20%" }}></div>
        <div className="neon-dot" style={{ top: "77%", left: "70%" }}></div>
      </div>

      <header className="topbar">
        <div className="logo">Aurora IA</div>

        <nav className="top-actions">
          <Link href="/chat" className="top-link">
            Testar agora
          </Link>

          <Link href="/planos" className="top-link">
            Ver planos
          </Link>

          <Link href="/login" className="top-link">
            Entrar
          </Link>
        </nav>
      </header>

      <ReferralTracker />

      <div
        style={{
          marginTop: "18px",
          marginBottom: "12px",
          padding: "12px 16px",
          borderRadius: "16px",
          border: "1px solid rgba(74, 222, 128, 0.22)",
          background: "rgba(74, 222, 128, 0.08)",
          color: "#dcfce7",
          fontWeight: 700,
          textAlign: "center",
          lineHeight: 1.5,
        }}
      >
        🌍 Aurora IA já está disponível para o mundo com suporte a vários idiomas.
      </div>

      <section className="hero">
        <div className="hero-left">
          <div className="badge">IA brasileira pronta para o mundo</div>

          <h1 className="hero-title">
            Sua inteligência artificial para{" "}
            <span>atendimento, produtividade, marketing e crescimento</span>
          </h1>

          <p className="hero-subtitle">
            Converse, gere imagens, crie campanhas, acelere tarefas e transforme
            a Aurora IA em sua plataforma de apoio diário para crescer com mais
            velocidade.
          </p>

          <div
            style={{
              padding: "14px 16px",
              borderRadius: "16px",
              border: "1px solid rgba(255,255,255,0.10)",
              background: "rgba(255,255,255,0.05)",
              color: "#dbeafe",
              lineHeight: 1.6,
            }}
          >
            Uma inteligência artificial criada no Brasil para ajudar pessoas e
            empresas no mundo inteiro.
          </div>

          <div
            style={{
              marginTop: "18px",
              padding: "16px",
              borderRadius: "18px",
              border: "1px solid rgba(255,255,255,0.10)",
              background: "rgba(15,23,42,0.55)",
              color: "#e2e8f0",
              lineHeight: 1.7,
            }}
          >
            <div
              style={{
                fontWeight: 800,
                marginBottom: "10px",
                color: "#ffffff",
              }}
            >
              Experimente pedir agora:
            </div>

            <div>• Crie uma campanha de marketing para Instagram</div>
            <div>• Gere uma imagem futurista de cidade tecnológica</div>
            <div>• Me dê uma ideia de negócio lucrativa</div>
          </div>

          <div className="hero-list">
            <div className="hero-item">⚡ Chat inteligente</div>
            <div className="hero-item">🎨 Geração de imagens</div>
            <div className="hero-item">📈 Marketing automático</div>
            <div className="hero-item">🌍 Plataforma global</div>
          </div>

          <div className="hero-buttons">
            <Link href="/chat" className="btn-primary">
              Testar agora
            </Link>

            <Link href="/planos" className="btn-secondary">
              Ver planos
            </Link>

            <Link href="/explorar" className="btn-secondary">
              Explorar criações
            </Link>

            <Link href="/ganhe" className="btn-secondary">
              💰 Ganhar indicando Aurora
            </Link>

            <button onClick={shareAurora} className="btn-secondary">
              Compartilhar Aurora IA
            </button>
          </div>

          <Link
            href="/chat"
            style={{
              display: "block",
              marginTop: "18px",
              width: "100%",
              textAlign: "center",
              padding: "16px 18px",
              borderRadius: "18px",
              background: "linear-gradient(135deg, #facc15, #f59e0b)",
              color: "#111827",
              fontWeight: 900,
              fontSize: "18px",
              textDecoration: "none",
              boxShadow: "0 16px 40px rgba(250, 204, 21, 0.18)",
            }}
          >
            Começar a conversar com a Aurora
          </Link>

          <div
            style={{
              marginTop: "14px",
              padding: "14px 16px",
              borderRadius: "16px",
              border: "1px solid rgba(250, 204, 21, 0.22)",
              background: "rgba(250, 204, 21, 0.08)",
              color: "#fef3c7",
              lineHeight: 1.6,
            }}
          >
            Estamos lançando novidades e novas funções com frequência. Durante
            esta fase podem ocorrer pequenos ajustes ou instabilidades pontuais.
          </div>
        </div>

        <div className="hero-visual">
          <div className="visual-card">
            <div className="float-tag tag-1">⚡ IA rápida</div>
            <div className="float-tag tag-2">🎨 Imagens</div>
            <div className="float-tag tag-3">🌍 Global</div>
            <div className="float-tag tag-4">📈 Marketing</div>

            <div className="robot-laptop"></div>

            <div className="robot-core">
              <div className="robot-head">
                <div className="robot-ear-left"></div>
                <div className="robot-ear-right"></div>

                <div className="robot-face">
                  <div className="eye"></div>
                  <div className="eye"></div>
                  <div className="mouth"></div>
                </div>
              </div>

              <div className="robot-arm-left"></div>
              <div className="robot-arm-right"></div>
              <div className="robot-body"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="plans">
        <div className="plan-card plan-highlight">
          <div className="plan-badge">POPULAR</div>

          <div className="plan-title">Plano PRO</div>

          <div className="plan-price">R$ 29,90/mês</div>

          <div className="plan-desc">
            Ideal para quem quer usar a IA com mais força no dia a dia.
          </div>

          <div className="plan-list">
            <div>✅ Chat com memória</div>
            <div>✅ Geração de imagens</div>
            <div>✅ Marketing com IA</div>
            <div>✅ Apoio ao crescimento</div>
          </div>

          <div className="plan-actions">
            <button onClick={openPro} className="btn-primary">
              Assinar agora
            </button>
          </div>
        </div>

        <div className="plan-card">
          <div className="plan-badge">NOVO</div>

          <div className="plan-title">Plano Influencer</div>

          <div className="plan-price">R$ 9,90/mês</div>

          <div className="plan-desc">
            Ideal para criadores e pessoas que desejam divulgar e crescer com a
            Aurora IA.
          </div>

          <div className="plan-list">
            <div>✅ Valor de entrada acessível</div>
            <div>✅ Ideal para criadores</div>
            <div>✅ Conteúdo com IA</div>
            <div>✅ Potencial de divulgação</div>
          </div>

          <div className="plan-actions">
            <button onClick={openInfluencer} className="btn-secondary">
              Assinar influencer
            </button>
          </div>
        </div>
      </section>

      <section
        style={{
          marginTop: "50px",
          padding: "28px",
          borderRadius: "22px",
          border: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(255,255,255,0.05)",
          lineHeight: 1.7,
        }}
      >
        <h2 style={{ fontSize: "28px", marginBottom: "16px" }}>
          O futuro da Aurora IA
        </h2>

        <p style={{ color: "#dbeafe" }}>
          Estamos construindo muito mais do que uma inteligência artificial. A
          Aurora IA evolui para um ecossistema de soluções reais, pensado para
          unir tecnologia, produtividade, gestão, negócios e praticidade no dia
          a dia.
        </p>

        <div style={{ marginTop: "16px", color: "#e2e8f0" }}>
          • ERP empresarial e pessoal
          <br />
          • Plataforma de venda de veículos de locadoras
          <br />
          • Novos aplicativos e soluções digitais
          <br />
          • Ferramentas criadas para facilitar a vida humana
        </div>
      </section>

      <div className="footer-note">
        Comece hoje • Teste a plataforma e descubra como a Aurora IA pode ajudar
        você.
      </div>

      <div
        style={{
          marginTop: 18,
          textAlign: "center",
          color: "#94a3b8",
          fontSize: "13px",
          lineHeight: 1.6,
          maxWidth: "900px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        Você está conversando com uma inteligência artificial. Sempre confira as
        informações pois podem existir erros ou interpretações incorretas.
      </div>
    </main>
  );
}