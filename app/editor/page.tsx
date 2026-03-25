import EditorClient from "./editor-client";
import Link from "next/link";

export default function EditorPage() {
  return (
    <main className="min-h-screen text-white">
      <section className="mx-auto max-w-7xl px-4 pt-6 pb-8 md:px-6 md:pt-8">
        <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.16),transparent_24%),radial-gradient(circle_at_right_top,rgba(59,130,246,0.14),transparent_24%),rgba(8,16,24,0.92)] shadow-[0_30px_100px_rgba(0,0,0,0.38)]">
          <div className="px-5 py-8 md:px-8 md:py-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-[11px] font-extrabold uppercase tracking-[0.24em] text-emerald-300">
              <span>Aurora Editor</span>
            </div>

            <div className="mt-5 grid gap-6 md:grid-cols-[1.25fr_0.75fr] md:items-end">
              <div>
                <h1 className="max-w-3xl text-3xl font-black leading-tight text-white md:text-5xl">
                  Crie campanhas, artes e ideias com IA
                </h1>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70 md:text-lg">
                  Gere imagens, textos e campanhas prontas para vender com uma
                  experiência mais bonita, organizada e pronta para uso real no
                  celular e no desktop.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/chat"
                    className="inline-flex items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-400/15 px-5 py-3 text-sm font-extrabold text-emerald-100 transition hover:-translate-y-0.5 hover:bg-emerald-400/20"
                  >
                    💬 Abrir chat
                  </Link>

                  <Link
                    href="/planos"
                    className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-white/10"
                  >
                    🚀 Ver planos
                  </Link>
                </div>
              </div>

              <div className="grid gap-3 md:justify-self-end">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-300">
                    Foco
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white">
                    Campanhas, criativos e materiais prontos para conversão.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-sky-300">
                    Uso real
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white">
                    Ideal para social media, locadora, loja, imobiliária,
                    restaurante e operação comercial.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-10 md:px-6 md:pb-16">
        <div className="rounded-[32px] border border-white/10 bg-[rgba(8,16,24,0.9)] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.32)] md:p-6">
          <div className="mb-5 rounded-2xl border border-amber-300/15 bg-amber-400/10 px-4 py-3 text-sm leading-6 text-amber-100">
            <strong className="font-extrabold">⚠️ Aviso importante:</strong> A
            Aurora IA está em constante evolução e pode apresentar pequenas
            instabilidades durante atualizações.
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-3 md:p-5">
            <EditorClient />
          </div>
        </div>
      </section>
    </main>
  );
}