import Link from "next/link";
import InstallPwaButton from "@/components/install-pwa-button";

const quickCards = [
  {
    title: "Chat inteligente",
    description: "Converse, peça campanhas, ideias e conteúdos com resposta rápida.",
    href: "/chat",
    cta: "Abrir chat",
  },
  {
    title: "Gerar imagens",
    description: "Crie artes, anúncios e visuais com aparência mais forte para vender mais.",
    href: "/chat",
    cta: "Criar imagem",
  },
  {
    title: "Explorar",
    description: "Veja imagens públicas e inspirações para acelerar criação e divulgação.",
    href: "/explorar",
    cta: "Explorar agora",
  },
];

export default function HomePage() {
  return (
    <main className="aurora-home">
      <div className="aurora-home__bg aurora-home__bg--1" />
      <div className="aurora-home__bg aurora-home__bg--2" />

      <section className="aurora-home__hero">
        <div className="aurora-home__badge">Aurora IA Premium App</div>

        <h1 className="aurora-home__title">
          A sua IA para conversar, criar imagens, campanhas e negócio no celular.
        </h1>

        <p className="aurora-home__subtitle">
          Transformamos a Aurora em experiência forte para mobile, com cara de app,
          foco em retenção, criação rápida e instalação no Android.
        </p>

        <div className="aurora-home__ctaRow">
          <Link href="/chat" className="aurora-home__primaryButton">
            Abrir Aurora
          </Link>

          <Link href="/planos" className="aurora-home__secondaryButton">
            Ver planos
          </Link>
        </div>

        <div className="aurora-home__installWrap">
          <InstallPwaButton />
        </div>

        <div className="aurora-home__stats">
          <div className="aurora-home__statCard">
            <span className="aurora-home__statValue">App</span>
            <span className="aurora-home__statLabel">Instalável no Android</span>
          </div>

          <div className="aurora-home__statCard">
            <span className="aurora-home__statValue">Chat</span>
            <span className="aurora-home__statLabel">Resposta e criação rápida</span>
          </div>

          <div className="aurora-home__statCard">
            <span className="aurora-home__statValue">PWA</span>
            <span className="aurora-home__statLabel">Experiência mobile forte</span>
          </div>
        </div>
      </section>

      <section className="aurora-home__section">
        <div className="aurora-home__sectionHeader">
          <h2>Comece em segundos</h2>
          <p>A Aurora precisa abrir rápido, ser bonita e fazer a pessoa querer voltar.</p>
        </div>

        <div className="aurora-home__cards">
          {quickCards.map((item) => (
            <article key={item.title} className="aurora-home__card">
              <div className="aurora-home__cardGlow" />
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <Link href={item.href} className="aurora-home__cardLink">
                {item.cta}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="aurora-home__section aurora-home__section--compact">
        <div className="aurora-home__promo">
          <div>
            <span className="aurora-home__promoLabel">Modo crescimento</span>
            <h2>Site com cara de app vende mais e segura mais atenção.</h2>
            <p>
              A instalação no Android reduz abandono, facilita retorno e fortalece a
              percepção de produto premium.
            </p>
          </div>

          <Link href="/chat" className="aurora-home__primaryButton aurora-home__primaryButton--fit">
            Entrar agora
          </Link>
        </div>
      </section>
    </main>
  );
}