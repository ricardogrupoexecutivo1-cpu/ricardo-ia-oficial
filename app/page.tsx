import Link from "next/link";

const features = [
  {
    title: "Chat inteligente",
    description:
      "Converse com a Aurora IA para criar ideias, campanhas, textos, conceitos visuais e direcionamentos estratégicos com mais velocidade.",
  },
  {
    title: "Geração de imagens",
    description:
      "Transforme prompts em imagens com aparência profissional para redes sociais, negócios, anúncios e apresentações.",
  },
  {
    title: "Editor visual",
    description:
      "Abra sua criação, refine detalhes, ajuste a composição e deixe tudo pronto para baixar e publicar.",
  },
  {
    title: "Estrutura para monetização",
    description:
      "A Aurora IA foi desenhada para crescer como plataforma: criação, campanhas, imagens, negócios e futuras automações.",
  },
];

const highlights = [
  "Experiência premium no mobile e desktop",
  "Separações visuais limpas e elegantes",
  "Blocos organizados para melhor leitura",
  "Base visual pronta para escalar o produto",
];

export default function HomePage() {
  return (
    <main className="aurora-page">
      <section className="hero-section">
        <div className="site-shell">
          <div className="hero-card">
            <div className="hero-badge">Aurora IA</div>

            <div className="hero-grid">
              <div className="hero-copy">
                <h1 className="hero-title">
                  Imagens, ideias, campanhas e criação com IA
                </h1>

                <p className="hero-description">
                  Uma plataforma para conversar, criar artes, gerar campanhas,
                  explorar imagens e transformar atenção em negócio com uma
                  experiência mais bonita, premium e profissional.
                </p>

                <div className="hero-actions">
                  <Link href="/chat" className="btn btn-primary">
                    Abrir Chat
                  </Link>

                  <Link href="/planos" className="btn btn-secondary">
                    Ver Planos
                  </Link>
                </div>

                <div className="hero-points">
                  {highlights.map((item) => (
                    <div key={item} className="hero-point">
                      <span className="hero-point-dot" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="hero-panel">
                <div className="hero-panel-glow" />
                <div className="hero-panel-card">
                  <div className="mini-kicker">Plataforma Aurora</div>
                  <h2 className="mini-title">
                    Crie imagens, campanhas e peças visuais com mais impacto
                  </h2>
                  <p className="mini-text">
                    Gere imagens, campanhas e ideias de negócio em segundos.
                    Agora a Aurora também conta com editor visual e uma estrutura
                    pronta para crescer com força comercial.
                  </p>

                  <div className="mini-actions">
                    <Link href="/chat" className="btn btn-primary btn-block">
                      Gerar imagem agora
                    </Link>
                    <Link href="/explorar" className="btn btn-secondary btn-block">
                      Explorar galeria
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="site-shell">
          <div className="section-header">
            <span className="section-kicker">Plataforma Aurora</span>
            <h2 className="section-title">
              Uma home com separação visual clara e aparência premium
            </h2>
            <p className="section-description">
              O objetivo aqui é devolver a sensação de plataforma forte,
              organizada e elegante, tanto no celular quanto no desktop.
            </p>
          </div>

          <div className="cards-grid cards-grid-4">
            {features.map((feature) => (
              <article key={feature.title} className="feature-card">
                <div className="feature-icon" />
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="site-shell">
          <div className="split-card">
            <div className="split-copy">
              <span className="section-kicker">Editor em destaque</span>
              <h2 className="section-title">
                Crie artes com mais presença visual e melhor organização
              </h2>
              <p className="section-description">
                Suba sua imagem, gere campanhas, refine a composição e entregue
                tudo com uma aparência muito mais confiável para o usuário final.
              </p>

              <div className="inline-actions">
                <Link href="/chat" className="btn btn-primary">
                  Abrir Aurora
                </Link>
                <Link href="/prompts" className="btn btn-secondary">
                  Ver prompts
                </Link>
              </div>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-label">Visual</span>
                <strong className="stat-value">Premium</strong>
              </div>
              <div className="stat-card">
                <span className="stat-label">Estrutura</span>
                <strong className="stat-value">Organizada</strong>
              </div>
              <div className="stat-card">
                <span className="stat-label">Mobile</span>
                <strong className="stat-value">Responsivo</strong>
              </div>
              <div className="stat-card">
                <span className="stat-label">Base</span>
                <strong className="stat-value">Escalável</strong>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}