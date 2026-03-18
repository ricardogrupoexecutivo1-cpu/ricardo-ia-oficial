import Link from "next/link";

export default function LivroPage() {
  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <div className="mx-auto max-w-6xl px-4 py-10">

        {/* HERO */}
        <section className="rounded-3xl border border-emerald-400/20 bg-emerald-500/10 px-6 py-10 shadow-[0_0_40px_rgba(16,185,129,0.10)]">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">

            {/* TEXTO */}
            <div>
              <h1 className="text-3xl font-bold md:text-5xl">
                O ser humano só não conquista o que não quer
              </h1>

              <p className="mt-4 text-white/70">
                Um livro direto sobre decisão, ação e conquista real.
              </p>

              <p className="mt-2 text-sm text-white/50">
                Por Ricardo Leonardo Moreira
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href="/livros/livro-aurora.pdf"
                  download
                  className="rounded-xl bg-emerald-500 px-6 py-3 font-bold text-black hover:bg-emerald-400"
                >
                  📥 Baixar livro (PDF)
                </a>

                <Link
                  href="/chat"
                  className="rounded-xl border border-white/20 px-6 py-3 font-semibold hover:bg-white/10"
                >
                  Abrir Aurora IA
                </Link>
              </div>
            </div>

            {/* CAPA (USANDO SUA IMAGEM) */}
            <div className="flex justify-center">
              <img
                src="/livros/livro-aurora.pdf"
                alt="Capa do livro"
                className="w-full max-w-sm rounded-2xl shadow-2xl"
              />
            </div>

          </div>
        </section>

        {/* SOBRE */}
        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold">Sobre o livro</h2>
            <p className="mt-4 text-sm text-white/70 leading-6">
              Este livro foi criado para pessoas que sabem que podem mais,
              mas ainda não tomaram as decisões necessárias.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold">Para quem é</h2>
            <p className="mt-4 text-sm text-white/70 leading-6">
              Para quem quer sair da teoria, parar de adiar e começar a conquistar.
            </p>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="mt-10 rounded-3xl border border-emerald-400/15 bg-white/5 px-6 py-10 text-center">
          <h2 className="text-2xl font-bold">
            Agora é sua vez de agir
          </h2>

          <p className="mt-4 text-white/70">
            Use a Aurora IA para transformar ideias em ação.
          </p>

          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/chat"
              className="rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-black hover:bg-emerald-400"
            >
              Abrir Chat
            </Link>

            <Link
              href="/editor"
              className="rounded-xl border border-white/20 px-6 py-3 font-semibold hover:bg-white/10"
            >
              Criar campanha
            </Link>
          </div>
        </section>

      </div>
    </main>
  );
}