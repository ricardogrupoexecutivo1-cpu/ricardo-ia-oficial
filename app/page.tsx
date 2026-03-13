"use client";

import Link from "next/link";

export default function HomePage() {
  function openFounders() {
    window.open("https://www.asaas.com/c/ayfhkldtnk1osf37", "_blank");
  }

  function openInfluencer() {
    window.open("https://www.asaas.com/c/ayfhkldtnk1osf37", "_blank");
  }

  return (
    <main className="home-shell">
      <header className="topbar">
        <div className="logo">RicardoIA</div>

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

      <section className="hero">
        <div className="hero-left">
          <div className="badge">IA brasileira pronta para o mundo</div>

          <h1 className="hero-title">
            Sua inteligência artificial para <span>atendimento, produtividade, marketing e crescimento</span>
          </h1>

          <p className="hero-subtitle">
            Converse, gere imagens, crie campanhas, acelere tarefas e transforme a RicardoIA em sua plataforma de apoio diário para crescer com mais velocidade.
          </p>

          <div className="hero-list">
            <div className="hero-item">⚡ Chat inteligente e rápido</div>
            <div className="hero-item">🎨 Geração de imagens com IA</div>
            <div className="hero-item">📈 Marketing automático</div>
            <div className="hero-item">🌍 Estrutura pronta para o mundo</div>
          </div>

          <div className="hero-buttons">
            <Link href="/chat" className="btn-primary">
              Testar agora
            </Link>

            <Link href="/planos" className="btn-secondary">
              Ver planos
            </Link>
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

      <section className="stats">
        <div className="stat-card">
          <div className="stat-small">Experiência</div>
          <div className="stat-big">Visual moderno</div>
        </div>

        <div className="stat-card">
          <div className="stat-small">Estratégia</div>
          <div className="stat-big">Pronta para escalar</div>
        </div>

        <div className="stat-card">
          <div className="stat-small">Objetivo</div>
          <div className="stat-big">Conversão e impacto</div>
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <h3>Atendimento Inteligente</h3>
          <p>
            Responda clientes com mais rapidez, clareza e profissionalismo usando IA moderna.
          </p>
        </div>

        <div className="feature-card">
          <h3>Marketing Automático</h3>
          <p>
            Crie campanhas, posts, ideias, legendas e textos profissionais em segundos.
          </p>
        </div>

        <div className="feature-card">
          <h3>Produtividade</h3>
          <p>
            Organize tarefas, estratégias, processos e crescimento empresarial em um só lugar.
          </p>
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
            <button onClick={openFounders} className="btn-primary">
              Assinar agora
            </button>
          </div>
        </div>

        <div className="plan-card">
          <div className="plan-badge">NOVO</div>
          <div className="plan-title">Plano Influencer</div>
          <div className="plan-price">R$ 9,90/mês</div>
          <div className="plan-desc">
            Entrada acessível para criadores que podem divulgar e crescer com a plataforma.
          </div>

          <div className="plan-list">
            <div>✅ Valor de entrada baixo</div>
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

      <div className="footer-note">
        Comece hoje • Teste a plataforma, conheça os recursos e faça upgrade quando quiser.
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
        Você está conversando com uma inteligência artificial. Sempre confira as informações,
        pois pode haver erros, interpretações incorretas ou respostas imprecisas.
      </div>
    </main>
  );
}