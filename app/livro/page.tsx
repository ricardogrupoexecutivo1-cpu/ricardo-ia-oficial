import Link from "next/link";

export default function LivroPage() {
  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <section className="rounded-3xl border border-emerald-400/20 bg-emerald-500/10 px-6 py-10 shadow-[0_0_40px_rgba(16,185,129,0.10)]">
          <div className="grid gap-8 md:grid-cols-[320px_minmax(0,1fr)] md:items-center">
            <div className="flex justify-center">
              <img
                src="/livros/capa.jpg"
                alt="Capa do livro O ser humano só não conquista o que não quer"
                className="w-full max-w-[280px] rounded-2xl border border-white/10 shadow-2xl"
              />
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300">
                Livro em destaque
              </p>

              <h1 className="mt-4 text-3xl font-bold leading-tight md:text-5xl">
                O ser humano só não conquista o que não quer
              </h1>

              <p className="mt-4 text-white/70 md:text-lg">
                Um livro direto sobre decisão, ação, disciplina e conquista real.
              </p>

              <p className="mt-2 text-sm text-white/50">
                Por Ricardo Leonardo Moreira
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="/livros/livro-aurora.pdf"
                  download
                  className="rounded-xl bg-emerald-500 px-6 py-3 text-center font-bold text-black transition hover:bg-emerald-400"
                >
                  Baixar livro (PDF)
                </a>

                <Link
                  href="/livro/capitulo-1"
                  className="rounded-xl border border-white/20 px-6 py-3 text-center font-semibold transition hover:bg-white/10"
                >
                  Ler online
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-300">
                Sobre o livro
              </p>

              <div className="mt-4 space-y-4 text-sm leading-7 text-white/75 md:text-base">
                <p>
                  Este livro foi escrito para pessoas que sabem que podem mais,
                  mas ainda não transformaram vontade em movimento real.
                </p>

                <p>
                  Aqui, a proposta é simples e forte: mostrar que a conquista
                  não depende só de oportunidade, mas de decisão, ação e
                  constância.
                </p>

                <p>
                  A leitura conversa diretamente com quem quer sair da teoria,
                  abandonar a desculpa e começar a construir resultado.
                </p>
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-300">
                Índice de leitura
              </p>

              <div className="mt-5 space-y-4">
                <Link
                  href="/livro/capitulo-1"
                  className="block rounded-2xl border border-white/10 bg-black/20 p-5 transition hover:bg-white/10"
                >
                  <div className="text-sm font-semibold text-emerald-300">
                    Capítulo 1
                  </div>
                  <h2 className="mt-2 text-xl font-bold">
                    A decisão que muda tudo
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-white/70">
                    O ponto de virada começa quando a vontade vira decisão firme.
                  </p>
                </Link>

                <Link
                  href="/livro/capitulo-2"
                  className="block rounded-2xl border border-white/10 bg-black/20 p-5 transition hover:bg-white/10"
                >
                  <div className="text-sm font-semibold text-emerald-300">
                    Capítulo 2
                  </div>
                  <h2 className="mt-2 text-xl font-bold">
                    A ação separa quem conquista
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-white/70">
                    A execução é o que transforma pensamento em resultado.
                  </p>
                </Link>
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-300">
                Leitura online
              </p>

              <p className="mt-4 text-sm leading-7 text-white/70">
                Leia dentro da Aurora IA, aumente o tempo de permanência na
                plataforma e conecte o conteúdo com chat, editor e planos.
              </p>

              <Link
                href="/livro/capitulo-1"
                className="mt-5 inline-flex rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-emerald-400"
              >
                Começar leitura
              </Link>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-300">
                Ecossistema Aurora
              </p>

              <div className="mt-4 flex flex-col gap-3">
                <Link
                  href="/chat"
                  className="rounded-xl border border-white/15 px-4 py-3 text-sm font-semibold transition hover:bg-white/10"
                >
                  Abrir chat
                </Link>

                <Link
                  href="/editor"
                  className="rounded-xl border border-white/15 px-4 py-3 text-sm font-semibold transition hover:bg-white/10"
                >
                  Abrir editor
                </Link>

                <Link
                  href="/planos"
                  className="rounded-xl border border-white/15 px-4 py-3 text-sm font-semibold transition hover:bg-white/10"
                >
                  Ver planos
                </Link>
              </div>
            </section>
          </aside>
        </section>
      </div>
    </main>
  );
}