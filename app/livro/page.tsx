import Link from "next/link";

export default function LivroPage() {
  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <div className="mx-auto max-w-6xl px-4 py-10">

        {/* HERO */}
        <section className="rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-emerald-500/10 via-black to-black px-6 py-10 shadow-[0_0_80px_rgba(16,185,129,0.15)]">
          <div className="grid gap-8 md:grid-cols-[320px_minmax(0,1fr)] md:items-center">

            <div className="flex justify-center">
              <img
                src="/livros/capa.jpg"
                alt="Capa do livro"
                className="w-full max-w-[280px] rounded-2xl border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
              />
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300">
                Livro Aurora IA
              </p>

              <h1 className="mt-4 text-3xl font-bold leading-tight md:text-5xl">
                O ser humano só não conquista o que não quer
              </h1>

              <p className="mt-4 text-white/70 md:text-lg">
                Decisão, ação e disciplina. Um conteúdo direto para quem quer sair do comum e construir resultado real.
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
                  📥 Baixar PDF
                </a>

                <Link
                  href="/livro/capitulo-1"
                  className="rounded-xl border border-white/20 px-6 py-3 text-center font-semibold transition hover:bg-white/10"
                >
                  📖 Ler agora
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CONVERSÃO */}
        <section className="mt-10 rounded-3xl border border-emerald-400/20 bg-emerald-500/5 p-6 text-center">
          <h2 className="text-xl font-bold md:text-2xl">
            Leia, aplique e transforme em resultado
          </h2>

          <p className="mt-3 text-white/70">
            Use o conteúdo junto com o Chat e o Editor da Aurora para transformar conhecimento em ação.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/chat" className="rounded-xl bg-emerald-500 px-5 py-3 text-black">
              💬 Usar no chat
            </Link>

            <Link href="/editor" className="rounded-xl border border-white/20 px-5 py-3 hover:bg-white/10">
              🎨 Criar campanha
            </Link>

            <Link href="/planos" className="rounded-xl border border-white/20 px-5 py-3 hover:bg-white/10">
              🚀 Ver planos
            </Link>
          </div>
        </section>

        {/* CONTEÚDO */}
        <section className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">

          <div className="space-y-6">
            <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm text-emerald-300">Sobre o livro</p>

              <div className="mt-4 space-y-4 text-white/70">
                <p>
                  Este livro é para quem sabe que pode mais, mas ainda não transformou intenção em ação.
                </p>

                <p>
                  Aqui você encontra um caminho direto: decisão, execução e constância.
                </p>

                <p>
                  Não é teoria. É movimento.
                </p>
              </div>
            </section>
          </div>

        </section>

      </div>
    </main>
  );
}