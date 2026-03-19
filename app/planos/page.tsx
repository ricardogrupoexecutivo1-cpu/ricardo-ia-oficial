import Link from "next/link";

export default function PlanosPage() {
  return (
    <main className="aurora-page">
      <section className="hero-section">
        <div className="site-shell">
          <div className="hero-card">

            <div className="hero-badge">Aurora IA Planos</div>

            <h1 className="hero-title">
              Escolha seu plano e desbloqueie todo o poder da Aurora
            </h1>

            <p className="hero-description">
              Crie imagens, campanhas, ideias e evolua com uma plataforma em constante atualização.
            </p>

            <div className="cards-grid cards-grid-4">

              {/* FREE */}
              <div className="feature-card">
                <h3 className="feature-title">FREE</h3>
                <p className="feature-description">
                  Ideal para começar
                </p>

                <ul>
                  <li>✔ 3 imagens por dia</li>
                  <li>✔ Chat básico</li>
                  <li>✔ Testes iniciais</li>
                </ul>

                <button className="btn btn-secondary btn-block">
                  Plano atual
                </button>
              </div>

              {/* PRO (mais barato) */}
              <div className="feature-card">
                <h3 className="feature-title">PRO</h3>
                <p className="feature-description">
                  Para quem quer acelerar
                </p>

                <ul>
                  <li>✔ Mais imagens por dia</li>
                  <li>✔ Prioridade no sistema</li>
                  <li>✔ Recursos avançados</li>
                </ul>

                <a
                  href="https://www.asaas.com/c/ej715gfx5qpvlh1v"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-block"
                >
                  🚀 Assinar PRO
                </a>
              </div>

              {/* TOTAL (mais caro) */}
              <div className="feature-card">
                <h3 className="feature-title">TOTAL</h3>
                <p className="feature-description">
                  Liberação completa
                </p>

                <ul>
                  <li>✔ Imagens ilimitadas</li>
                  <li>✔ Acesso total</li>
                  <li>✔ Futuras funções liberadas</li>
                </ul>

                <a
                  href="https://www.asaas.com/c/m2co5t8qj55fvn2d"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-block"
                >
                  💎 Assinar TOTAL
                </a>
              </div>

            </div>

            {/* AFILIADOS */}
            <div style={{ marginTop: 40 }}>
              <div className="feature-card">
                <h3 className="feature-title">AFILIADOS</h3>
                <p className="feature-description">
                  Indique a Aurora IA e ganhe comissões por cada usuário que entrar e comprar através do seu link.
                </p>

                <ul>
                  <li>✔ Ganhos por indicação</li>
                  <li>✔ Link exclusivo</li>
                  <li>✔ Escala com tráfego</li>
                  <li>✔ Ideal para criadores e divulgadores</li>
                </ul>

                <Link href="/chat" className="btn btn-secondary btn-block">
                  🚀 Começar como afiliado
                </Link>
              </div>
            </div>

            <div style={{ marginTop: 30 }}>
              <Link href="/" className="btn btn-secondary">
                Voltar para Home
              </Link>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}