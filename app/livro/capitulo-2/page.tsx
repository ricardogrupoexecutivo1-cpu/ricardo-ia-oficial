import Link from "next/link";

export default function Capitulo2Page() {
  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <section className="rounded-3xl border border-emerald-400/15 bg-white/5 px-6 py-8 shadow-[0_0_40px_rgba(16,185,129,0.08)]">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300">
                Livro online
              </p>
              <h1 className="mt-3 text-3xl font-bold md:text-5xl">
                Capítulo 2 — A ação separa quem conquista
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-white/70 md:text-base">
                Pensar não muda nada. O que muda é agir.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/livro"
                className="rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold transition hover:bg-white/10"
              >
                ← Voltar ao livro
              </Link>

              <Link
                href="/chat"
                className="rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-emerald-400"
              >
                Abrir Aurora
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <article className="rounded-3xl border border-white/10 bg-white/5 p-8 md:p-10">
            <div className="mb-8 border-l-4 border-emerald-400 pl-4">
              <p className="text-lg font-semibold text-white/90">
                Pensar não muda nada. Planejar não muda nada. O que muda é agir.
              </p>
            </div>

            <div className="space-y-6 text-[16px] leading-8 text-white/80 md:text-lg">
              <p>
                A diferença entre quem vence e quem fica parado está na execução.
                Sonhos sem movimento continuam sendo apenas intenção.
              </p>

              <p>
                Muita gente sabe o que precisa fazer, mas adia. Espera o melhor
                momento, a condição perfeita, a certeza absoluta. Só que a vida
                raramente entrega tudo pronto.
              </p>

              <p>
                A ação é o que separa quem apenas deseja de quem realmente
                conquista. É ela que transforma pensamento em resultado e ideia
                em realidade.
              </p>

              <p>
                Quem age aprende mais rápido, corrige mais cedo e cresce mais.
                Quem espera demais fica preso no mesmo lugar, olhando o tempo
                passar.
              </p>
            </div>
          </article>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-300">
                Capítulo atual
              </p>
              <h2 className="mt-3 text-xl font-bold">
                A ação separa quem conquista
              </h2>
              <p className="mt-3 text-sm leading-6 text-white/70">
                O resultado começa quando a decisão vira movimento.
              </p>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-300">
                Navegação
              </p>

              <div className="mt-4 flex flex-col gap-3">
                <Link
                  href="/livro/capitulo-1"
                  className="rounded-xl border border-white/15 px-4 py-3 text-sm font-semibold transition hover:bg-white/10"
                >
                  ← Capítulo anterior
                </Link>

                <Link
                  href="/livro"
                  className="rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-black transition hover:bg-emerald-400"
                >
                  Ver página do livro
                </Link>
              </div>
            </section>
          </aside>
        </section>
      </div>
    </main>
  );
}