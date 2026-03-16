import Link from "next/link";

const WHATSAPP_NUMBER = "5531997490074";

type Plan = {
  name: string;
  price: string;
  subtitle: string;
  description: string;
  features: string[];
  ctaLabel: string;
  badge?: string;
  highlight?: boolean;
};

const plans: Plan[] = [
  {
    name: "FREE",
    price: "Grátis",
    subtitle: "Para começar a conhecer a Aurora IA.",
    description:
      "Ideal para primeiros testes, exploração da plataforma e uso inicial do chat e da geração de imagens.",
    features: [
      "3 imagens por dia",
      "Acesso inicial à Aurora IA",
      "Uso básico para testes",
      "Entrada rápida na plataforma",
    ],
    ctaLabel: "Começar grátis",
  },
  {
    name: "PRO",
    price: "R$29/mês",
    subtitle: "Para quem quer usar mais no dia a dia.",
    description:
      "Plano para usuários que já querem mais produtividade, mais imagens e uma experiência mais forte na criação com IA.",
    features: [
      "100 imagens por dia",
      "Mais liberdade de uso",
      "Melhor para criadores e usuários frequentes",
      "Ótimo passo após o FREE",
    ],
    ctaLabel: "Quero PRO",
  },
  {
    name: "CREATOR",
    price: "R$79/mês",
    subtitle: "Para empreendedores e criadores digitais.",
    description:
      "Pensado para quem quer criar campanhas, validar ideias, produzir mais conteúdo e preparar projetos com foco comercial.",
    features: [
      "300 imagens por dia",
      "Melhor para criativos e negócios",
      "Mais força para marketing e conteúdo",
      "Base ideal para expansão comercial",
    ],
    ctaLabel: "Quero CREATOR",
  },
  {
    name: "Developer Starter",
    price: "R$49/mês",
    subtitle: "Para quem está começando e quer criar os primeiros produtos.",
    description:
      "Ideal para aprender, testar ideias, gerar imagens e começar a construir soluções reais com a Aurora IA.",
    features: [
      "200 imagens por dia",
      "Projetos e testes com foco em aprendizado",
      "Base para landing pages e apps simples",
      "Uso comercial permitido",
      "Perfeito para freelancers e iniciantes",
    ],
    ctaLabel: "Quero começar",
    badge: "Developer",
  },
  {
    name: "Developer Pro",
    price: "R$149/mês",
    subtitle: "Para quem já quer vender, escalar e entregar mais rápido.",
    description:
      "Feito para profissionais, agências técnicas e criadores de software que querem transformar a Aurora em braço operacional do negócio.",
    features: [
      "1000 imagens por dia",
      "Criação acelerada de apps, painéis e sistemas",
      "Base para produtos SaaS e projetos de cliente",
      "Melhor fit para operação comercial",
      "Plano ideal para quem já está tarimbado",
    ],
    ctaLabel: "Quero escalar",
    badge: "Developer",
    highlight: true,
  },
  {
    name: "AGENCY",
    price: "R$299/mês",
    subtitle: "Para operações fortes, equipes e escala comercial.",
    description:
      "Pensado para agências, empresas e operações que precisam de grande volume, produção constante e futuro uso mais avançado da Aurora.",
    features: [
      "Imagens ilimitadas",
      "Melhor para times e agências",
      "Escala maior de produção",
      "Base premium para uso profissional intenso",
    ],
    ctaLabel: "Quero AGENCY",
    badge: "Escala",
  },
];

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
  price,
  subtitle,
  description,
  features,
  ctaLabel,
  badge,
  highlight = false,
}: Plan) {
  const whatsappLink = buildWhatsAppLink(name, price);

  return (
    <article
      className={`flex h-full flex-col rounded-3xl border p-6 shadow-sm ${
        highlight ? "border-black bg-black text-white" : "bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          {badge ? (
            <p
              className={`text-xs font-semibold uppercase tracking-wide ${
                highlight ? "text-neutral-300" : "text-blue-600"
              }`}
            >
              {badge}
            </p>
          ) : (
            <p
              className={`text-xs font-semibold uppercase tracking-wide ${
                highlight ? "text-neutral-300" : "text-neutral-500"
              }`}
            >
              Plano Aurora
            </p>
          )}

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
            Mais forte
          </span>
        ) : null}
      </div>

      <div className="mt-6">
        <p className="text-4xl font-extrabold">{price}</p>
        <p
          className={`mt-3 text-sm leading-6 ${
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

      <div className="mt-8 flex-1" />

      <div className="mt-4">
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

export const dynamic = "force-dynamic";

export default function PlanosPage() {
  const generalWhatsAppLink = buildWhatsAppLink("Atendimento comercial", "Sob consulta");

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <section className="rounded-[2rem] border bg-white p-6 shadow-sm md:p-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Aurora IA Planos
            </p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight md:text-5xl">
              Escolha o plano ideal para crescer com a Aurora IA
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-neutral-600 md:text-lg">
              A Aurora IA está evoluindo para virar uma plataforma completa de
              criação de imagens, negócios, marketing e aplicativos. Aqui você
              escolhe o plano certo para sua fase.
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
              href="/developers"
              className="rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
            >
              Ver Developers
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl border bg-neutral-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Uso
            </p>
            <p className="mt-2 text-lg font-semibold">Pessoal e profissional</p>
          </div>

          <div className="rounded-3xl border bg-neutral-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Caminho
            </p>
            <p className="mt-2 text-lg font-semibold">Do iniciante ao avançado</p>
          </div>

          <div className="rounded-3xl border bg-neutral-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Foco
            </p>
            <p className="mt-2 text-lg font-semibold">Criação e monetização</p>
          </div>

          <div className="rounded-3xl border bg-neutral-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Evolução
            </p>
            <p className="mt-2 text-lg font-semibold">Escada de crescimento</p>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Planos da plataforma
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">
            Da entrada gratuita até a operação em escala
          </h2>
          <p className="mt-3 max-w-3xl text-neutral-600">
            A estrutura abaixo foi pensada para permitir entrada fácil, evolução
            natural e crescimento comercial dentro da própria Aurora IA.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard key={plan.name} {...plan} />
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-[2rem] border bg-black p-6 text-white shadow-sm md:p-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-neutral-300">
          Visão comercial
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
          Cada plano prepara o próximo passo do usuário
        </h2>
        <p className="mt-4 max-w-4xl text-base leading-7 text-neutral-300">
          O FREE atrai. O PRO converte. O CREATOR impulsiona negócios. Os planos
          Developer trazem programadores e criadores de software. O AGENCY abre
          espaço para operação profissional e escala.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-5">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm font-semibold">FREE</p>
            <p className="mt-2 text-sm text-neutral-300">Entrada e descoberta.</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm font-semibold">PRO</p>
            <p className="mt-2 text-sm text-neutral-300">Uso recorrente.</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm font-semibold">CREATOR</p>
            <p className="mt-2 text-sm text-neutral-300">Conteúdo e negócio.</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm font-semibold">DEVELOPER</p>
            <p className="mt-2 text-sm text-neutral-300">Apps e software.</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm font-semibold">AGENCY</p>
            <p className="mt-2 text-sm text-neutral-300">Escala e operação.</p>
          </div>
        </div>
      </section>

      <section className="mt-10 rounded-[2rem] border bg-white p-6 shadow-sm md:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
              Próximo passo
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">
              Deixe a página pronta para vender
            </h2>
            <p className="mt-4 max-w-3xl text-neutral-600">
              Agora que a Aurora já tem página de developers e escada de planos,
              o próximo movimento forte é ligar isso com upgrade real, checkout
              ou atendimento comercial.
            </p>
          </div>

          <div className="rounded-3xl border bg-neutral-50 p-6">
            <p className="text-sm font-semibold">Ações rápidas</p>

            <div className="mt-4 flex flex-col gap-3">
              <Link
                href="/developers"
                className="rounded-2xl bg-black px-5 py-3 text-center text-sm font-semibold text-white hover:opacity-90"
              >
                Ver Developers
              </Link>

              <Link
                href="/chat"
                className="rounded-2xl border px-5 py-3 text-center text-sm font-semibold hover:bg-neutral-100"
              >
                Testar a Aurora
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