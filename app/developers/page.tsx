import Link from "next/link";

const WHATSAPP_NUMBER = "5531999999999";

type PlanCardProps = {
  name: string;
  priceMonthly: string;
  subtitle: string;
  description: string;
  features: string[];
  ctaLabel: string;
  highlight?: boolean;
};

function buildWhatsAppLink(planName: string, price: string) {
  const text =
    `Olá! Tenho interesse no plano ${planName} da Aurora IA.` +
    `\nPlano: ${planName}` +
    `\nPreço: ${price}` +
    `\nQuero receber mais informações para ativação.`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

function PlanCard({
  name,
  priceMonthly,
  subtitle,
  description,
  features,
  ctaLabel,
  highlight = false,
}: PlanCardProps) {
  const whatsappLink = buildWhatsAppLink(name, priceMonthly);

  return (
    <article
      className={`rounded-3xl border p-6 shadow-sm ${
        highlight ? "border-black bg-black text-white" : "bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p
            className={`text-sm font-semibold uppercase tracking-wide ${
              highlight ? "text-neutral-300" : "text-neutral-500"
            }`}
          >
            Plano developer
          </p>
          <h2 className="mt-2 text-2xl font-bold">{name}</h2>
          <p
            className={`mt-2 text-sm ${
              highlight ? "text-neutral-300" : "text-neutral-600"
            }`}
          >
            {subtitle}
          </p>
        </div>

        {highlight ? (
          <span className="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold">
            Mais escolhido
          </span>
        ) : null}
      </div>

      <div className="mt-6">
        <p className="text-4xl font-extrabold">{priceMonthly}</p>
        <p
          className={`mt-2 text-sm ${
            highlight ? "text-neutral-300" : "text-neutral-600"
          }`}
        >
          {description}
        </p>
      </div>

      <ul className="mt-6 space-y-3">
        {features.map((feature) => (
          <li
            key={feature}
            className={`flex items-start gap-3 text-sm ${
              highlight ? "text-neutral-100" : "text-neutral-700"
            }`}
          >
            <span className="mt-0.5">✓</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <a
          href={whatsappLink}
          target="_blank"
          rel="noreferrer"
          className={`inline-flex rounded-2xl px-5 py-3 text-sm font-semibold transition ${
            highlight
              ? "bg-white text-black hover:opacity-90"
              : "bg-black text-white hover:opacity-90"
          }`}
        >
          {ctaLabel}
        </a>
      </div>
    </article>
  );
}

function FeatureBlock({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-neutral-600">{description}</p>
    </div>
  );
}

export const dynamic = "force-dynamic";

export default function DevelopersPage() {
  const generalWhatsAppLink = buildWhatsAppLink("Developer", "Sob consulta");

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <section className="rounded-[2rem] border bg-white p-6 shadow-sm md:p-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Aurora IA Developers
            </p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight md:text-5xl">
              Crie apps, sistemas e negócios com IA
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-neutral-600 md:text-lg">
              A Aurora IA foi pensada para desenvolvedores que querem acelerar
              criação de software, gerar imagens, montar projetos comerciais e
              transformar ideias em produtos prontos para vender.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/chat"
              className="rounded-2xl border px-5 py-3 text-sm font-semibold hover:bg-neutral-50"
            >
              Abrir Aurora
            </Link>

            <Link
              href="/explorar"
              className="rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
            >
              Ver imagens públicas
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl border bg-neutral-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Foco
            </p>
            <p className="mt-2 text-lg font-semibold">Desenvolvedores</p>
          </div>

          <div className="rounded-3xl border bg-neutral-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Uso principal
            </p>
            <p className="mt-2 text-lg font-semibold">Apps e SaaS</p>
          </div>

          <div className="rounded-3xl border bg-neutral-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Modelo
            </p>
            <p className="mt-2 text-lg font-semibold">Criação acelerada</p>
          </div>

          <div className="rounded-3xl border bg-neutral-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Público ideal
            </p>
            <p className="mt-2 text-lg font-semibold">Iniciante até Pro</p>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Planos para crescer
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">
            Escolha o nível ideal para sua fase
          </h2>
          <p className="mt-3 max-w-3xl text-neutral-600">
            Entrar mais barato ajuda quem está começando. Ter um plano mais
            forte ajuda quem já vende, cria para clientes ou quer escalar mais
            rápido.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <PlanCard
            name="Developer Starter"
            priceMonthly="R$49/mês"
            subtitle="Para quem está começando e quer criar os primeiros produtos."
            description="Ideal para aprender, testar ideias, gerar imagens e começar a construir soluções reais com a Aurora IA."
            features={[
              "200 imagens por dia",
              "Projetos e testes com foco em aprendizado",
              "Base para criar landing pages e apps simples",
              "Uso comercial permitido",
              "Acesso inicial ao ecossistema Aurora IA",
              "Perfeito para freelancers e iniciantes",
            ]}
            ctaLabel="Quero começar"
          />

          <PlanCard
            name="Developer Pro"
            priceMonthly="R$149/mês"
            subtitle="Para quem já quer vender, escalar e entregar mais rápido."
            description="Feito para profissionais, agências técnicas e criadores de software que querem transformar a Aurora em braço operacional do negócio."
            features={[
              "1000 imagens por dia",
              "Criação acelerada de apps, painéis e sistemas",
              "Base para produtos SaaS e projetos de cliente",
              "Maior capacidade para uso profissional",
              "Melhor fit para operação comercial",
              "Plano ideal para quem já está tarimbado",
            ]}
            ctaLabel="Quero escalar"
            highlight
          />
        </div>
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-3">
        <FeatureBlock
          title="Crie mais rápido"
          description="Use a Aurora IA para encurtar o caminho entre ideia e execução. Isso ajuda a testar produtos, validar demandas e montar soluções em menos tempo."
        />

        <FeatureBlock
          title="Venda para clientes"
          description="Os planos developer ajudam a posicionar a Aurora como motor de produção para freelancers, programadores, agências e criadores de produtos digitais."
        />

        <FeatureBlock
          title="Monte seu ecossistema"
          description="Com imagens, marketing, geração de ideias e futuro módulo de criação de aplicativos, a Aurora tende a virar uma fábrica de negócios assistida por IA."
        />
      </section>

      <section className="mt-10 rounded-[2rem] border bg-black p-6 text-white shadow-sm md:p-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-neutral-300">
          Visão da plataforma
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
          A Aurora IA não quer ser só chat.
        </h2>
        <p className="mt-4 max-w-4xl text-base leading-7 text-neutral-300">
          A ideia é unir criação de imagens, negócios, campanhas, apps e
          automação em um mesmo lugar. Para o desenvolvedor, isso significa
          ganhar velocidade, vender mais e construir produtos com muito mais
          poder operacional.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm font-semibold">Apps</p>
            <p className="mt-2 text-sm text-neutral-300">
              Base para criação de sistemas e produtos digitais.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm font-semibold">Marketing</p>
            <p className="mt-2 text-sm text-neutral-300">
              Campanhas, criativos e ativos para vender melhor.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm font-semibold">Imagens</p>
            <p className="mt-2 text-sm text-neutral-300">
              Produção visual para projetos, anúncios e validações.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm font-semibold">Negócios</p>
            <p className="mt-2 text-sm text-neutral-300">
              Uma plataforma pensada para criar receita e escala.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-10 rounded-[2rem] border bg-white p-6 shadow-sm md:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
              Próximo movimento
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">
              Entre agora e cresça junto com a Aurora IA
            </h2>
            <p className="mt-4 max-w-3xl text-neutral-600">
              Este é o momento ideal para posicionar a Aurora como plataforma
              para desenvolvedores do zero ao avançado. Quanto antes a página e
              os planos estiverem fortes, mais fácil será converter usuários em
              clientes pagantes.
            </p>
          </div>

          <div className="rounded-3xl border bg-neutral-50 p-6">
            <p className="text-sm font-semibold">Ações rápidas</p>

            <div className="mt-4 flex flex-col gap-3">
              <Link
                href="/planos"
                className="rounded-2xl bg-black px-5 py-3 text-center text-sm font-semibold text-white hover:opacity-90"
              >
                Ver página de planos
              </Link>

              <Link
                href="/chat"
                className="rounded-2xl border px-5 py-3 text-center text-sm font-semibold hover:bg-neutral-100"
              >
                Testar a Aurora agora
              </Link>

              <Link
                href="/explorar"
                className="rounded-2xl border px-5 py-3 text-center text-sm font-semibold hover:bg-neutral-100"
              >
                Ver vitrine pública
              </Link>

              <a
                href={generalWhatsAppLink}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border px-5 py-3 text-center text-sm font-semibold hover:bg-neutral-100"
              >
                Falar no WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}