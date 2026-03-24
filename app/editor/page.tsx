import EditorClient from "./editor-client";
import Link from "next/link";

export default function EditorPage() {
  return (
    <main className="min-h-screen bg-[#020617] text-white">

      {/* HERO */}
      <section className="border-b border-white/10 bg-gradient-to-br from-emerald-500/10 via-black to-black">
        <div className="mx-auto max-w-6xl px-4 py-12 text-center">

          <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">
            Editor Aurora IA
          </p>

          <h1 className="mt-4 text-3xl font-bold md:text-5xl">
            Crie campanhas, artes e ideias com IA
          </h1>

          <p className="mt-4 text-white/70 md:text-lg">
            Gere imagens, textos e campanhas prontas para vender.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/chat"
              className="rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold hover:bg-white/10"
            >
              💬 Abrir chat
            </Link>

            <Link
              href="/planos"
              className="rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold hover:bg-white/10"
            >
              🚀 Ver planos
            </Link>
          </div>
        </div>
      </section>

      {/* EDITOR */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-4 md:p-6 shadow-[0_0_30px_rgba(0,0,0,0.4)]">

          <p className="mb-4 text-sm text-white/50">
            ⚠️ A Aurora IA está em constante evolução e pode apresentar pequenas instabilidades durante atualizações.
          </p>

          <EditorClient />

        </div>
      </section>

    </main>
  );
}