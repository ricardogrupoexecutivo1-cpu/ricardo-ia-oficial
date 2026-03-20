import Link from "next/link";

export default function AfiliadosPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-12 md:px-10">
        <div className="rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-8 shadow-2xl">
          <div className="mb-4 inline-flex rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-1 text-sm font-medium text-emerald-300">
            Programa de Afiliados Aurora IA
          </div>

          <h1 className="text-3xl font-black tracking-tight md:text-5xl">
            Indique a Aurora IA e ganhe comissões por venda
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-7 text-white/75 md:text-lg">
            Convide pessoas para usar a Aurora IA, compartilhe seu link e
            transforme divulgação em receita. Ideal para afiliados, parceiros,
            criadores e vendedores.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/chat"
              className="inline-flex items-center justify-center rounded-2xl bg-emerald-400 px-6 py-3 text-sm font-bold text-black transition hover:scale-[1.02]"
            >
              Entrar e pegar meu link
            </Link>

            <Link
              href="/planos"
              className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Ver planos
            </Link>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
              1. Cadastre-se
            </div>
            <p className="mt-3 text-sm leading-7 text-white/75">
              Entre na Aurora IA e tenha seu código/link pessoal de divulgação.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
              2. Compartilhe
            </div>
            <p className="mt-3 text-sm leading-7 text-white/75">
              Envie seu link no WhatsApp, Instagram, grupos e para clientes.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
              3. Ganhe
            </div>
            <p className="mt-3 text-sm leading-7 text-white/75">
              Cada venda originada pelo seu link pode gerar comissão e bônus.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-2xl font-black">Para quem é o programa</h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5 text-sm leading-7 text-white/75">
              Afiliados que querem vender uma ferramenta com recorrência mensal.
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5 text-sm leading-7 text-white/75">
              Agências, designers e social medias que querem agregar mais valor.
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5 text-sm leading-7 text-white/75">
              Vendedores e parceiros comerciais que já têm carteira de clientes.
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5 text-sm leading-7 text-white/75">
              Pessoas que querem monetizar indicação de uma IA com aplicação real.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}