"use client";

import Link from "next/link";

type OptionCard = {
  title: string;
  badge: string;
  description: string;
  href: string;
  points: string[];
};

const options: OptionCard[] = [
  {
    title: "Anunciar veículos",
    badge: "Locadora / Loja",
    description:
      "Cadastre veículos para venda, exposição de estoque, geração de leads e atendimento por WhatsApp.",
    href: "/locadora",
    points: [
      "Vitrine de veículos",
      "Página individual por anúncio",
      "Contato rápido",
      "Base pronta para expansão",
    ],
  },
  {
    title: "Anunciar imóveis",
    badge: "Imobiliária / Corretor",
    description:
      "Cadastre imóveis para venda e aluguel com foco em cidade, estado, município e bairro.",
    href: "/imoveis",
    points: [
      "Portal independente",
      "Busca local forte",
      "Rota pronta para SEO",
      "Escala Brasil todo",
    ],
  },
  {
    title: "Entrar como banco",
    badge: "Financeiro",
    description:
      "Participe do ecossistema para receber propostas, avaliar crédito e financiar operações dentro da plataforma.",
    href: "/anunciar?tipo=banco",
    points: [
      "Base para financiamento",
      "Leads qualificados",
      "Integração futura com propostas",
      "Presença dentro da venda",
    ],
  },
  {
    title: "Entrar como seguradora",
    badge: "Proteção / Seguro",
    description:
      "Atenda clientes da plataforma com propostas de seguro e presença comercial integrada ao fluxo de venda.",
    href: "/anunciar?tipo=seguradora",
    points: [
      "Canal comercial integrado",
      "Base escalável",
      "Contato direto",
      "Mais valor ao ecossistema",
    ],
  },
];

export default function AnunciarPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="px-3 py-4 sm:px-4 lg:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-5 rounded-2xl border border-zinc-800 bg-zinc-950 p-4 sm:p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-green-400">
              Aurora Anúncios
            </p>

            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
              Escolha como deseja anunciar
            </h1>

            <p className="mt-2 max-w-3xl text-sm text-zinc-400">
              Entrada comercial do ecossistema Aurora para veículos, imóveis, bancos e seguros.
              Sistema em constante atualização e pode haver momentos de instabilidade.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {options.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 transition hover:border-green-500/40 hover:bg-zinc-900"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-zinc-700 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-green-400">
                    {item.badge}
                  </span>
                </div>

                <h2 className="mt-3 text-xl font-bold">{item.title}</h2>

                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  {item.description}
                </p>

                <div className="mt-4 grid gap-2">
                  {item.points.map((point) => (
                    <div
                      key={point}
                      className="rounded-lg border border-zinc-800 bg-black/30 px-3 py-2 text-sm text-zinc-300"
                    >
                      {point}
                    </div>
                  ))}
                </div>

                <Link
                  href={item.href}
                  className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-green-500 px-4 py-3 text-center font-bold text-black transition hover:bg-green-400"
                >
                  Continuar
                </Link>
              </article>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-zinc-800 bg-zinc-950 p-4 sm:p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
              Visão de escala
            </p>

            <div className="mt-3 grid gap-3 md:grid-cols-4">
              <div className="rounded-xl border border-zinc-800 bg-black/30 p-3">
                <p className="text-sm font-semibold">Locadora</p>
                <p className="mt-1 text-xs leading-5 text-zinc-400">
                  Vitrine automotiva com detalhe de veículo e geração de leads.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-black/30 p-3">
                <p className="text-sm font-semibold">Imóveis</p>
                <p className="mt-1 text-xs leading-5 text-zinc-400">
                  Portal local com foco em estado, cidade, município e bairro.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-black/30 p-3">
                <p className="text-sm font-semibold">Bancos</p>
                <p className="mt-1 text-xs leading-5 text-zinc-400">
                  Base para financiamento dentro da própria plataforma.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-black/30 p-3">
                <p className="text-sm font-semibold">Seguros</p>
                <p className="mt-1 text-xs leading-5 text-zinc-400">
                  Estrutura para ampliar valor e receita sobre a operação.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}