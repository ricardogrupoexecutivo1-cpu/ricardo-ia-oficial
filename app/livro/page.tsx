import Link from "next/link";

const PAGE_URL = "https://ricardoiaoficial.com/livro";
const PAGE_TITLE = "O ser humano só não conquista o que não quer";
const PAGE_TEXT =
  "Leia o livro na Aurora IA e transforme conhecimento em ação real.";

const WHATSAPP_URL = `https://wa.me/?text=${encodeURIComponent(
  `${PAGE_TITLE} - ${PAGE_TEXT} ${PAGE_URL}`
)}`;

const FACEBOOK_URL = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
  PAGE_URL
)}`;

const X_URL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
  `${PAGE_TITLE} - ${PAGE_TEXT}`
)}&url=${encodeURIComponent(PAGE_URL)}`;

const LINKEDIN_URL = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
  PAGE_URL
)}`;

const TELEGRAM_URL = `https://t.me/share/url?url=${encodeURIComponent(
  PAGE_URL
)}&text=${encodeURIComponent(`${PAGE_TITLE} - ${PAGE_TEXT}`)}`;

export default function LivroPage() {
  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <section className="rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-emerald-500/10 via-black to-black px-6 py-10 shadow-[0_0_80px_rgba(16,185,129,0.15)]">
          <div className="grid gap-8 md:grid-cols-[320px_minmax(0,1fr)] md:items-center">
            <div className="flex justify-center">
              <img
                src="/livros/capa.jpg"
                alt="Capa do livro O ser humano só não conquista o que não quer"
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
                Decisão, ação e disciplina. Um conteúdo direto para quem quer
                sair do comum e construir resultado real.
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

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-emerald-300">
                  Compartilhar nas redes
                </p>

                <div className="mt-4 flex flex-wrap gap-3">
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-emerald-400"
                  >
                    WhatsApp
                  </a>

                  <a
                    href={FACEBOOK_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold transition hover:bg-white/10"
                  >
                    Facebook
                  </a>

                  <a
                    href={X_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold transition hover:bg-white/10"
                  >
                    X
                  </a>

                  <a
                    href={LINKEDIN_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold transition hover:bg-white/10"
                  >
                    LinkedIn
                  </a>

                  <a
                    href={TELEGRAM_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold transition hover:bg-white/10"
                  >
                    Telegram
                  </a>
                </div>

                <p className="mt-3 text-xs text-white/50">
                  Para Instagram e TikTok, use o link desta página na bio,
                  stories, descrição ou direct.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-emerald-400/20 bg-emerald-500/5 p-6 text-center">
          <h2 className="text-xl font-bold md:text-2xl">
            Leia, aplique e transforme em resultado
          </h2>

          <p className="mt-3 text-white/70">
            Use o conteúdo junto com o Chat e o Editor da Aurora para transformar
            conhecimento em ação.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/chat"
              className="rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-black hover:bg-emerald-400"
            >
              💬 Usar no chat
            </Link>

            <Link
              href="/editor"
              className="rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold hover:bg-white/10"
            >
              🎨 Criar campanha
            </Link>

            <Link
              href="/planos"
              className="rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold hover:bg-white/10"
            >
              🚀 Ver planos
            </Link>
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
                  Este livro é para quem sabe que pode mais, mas ainda não
                  transformou intenção em ação real.
                </p>

                <p>
                  Aqui você encontra um caminho direto: decisão, execução e
                  constância.
                </p>

                <p>Não é teoria. É movimento.</p>
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
                Leitura dentro da Aurora
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

            <section className="rounded-3xl border border-amber-400/20 bg-amber-500/5 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-300">
                Aviso
              </p>

              <p className="mt-4 text-sm leading-7 text-white/70">
                A Aurora IA está em constante atualização e pode apresentar
                pequenos momentos de instabilidade durante melhorias na
                plataforma.
              </p>
            </section>
          </aside>
        </section>
      </div>
    </main>
  );
}