import Link from "next/link";

export default function EditorPublicPage() {
  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <div className="mx-auto max-w-5xl px-4 py-10">
        
        <header className="text-center">
          <h1 className="text-4xl font-bold md:text-5xl">
            Crie artes profissionais em minutos
          </h1>

          <p className="mt-4 text-white/70">
            Com o Aurora Editor você transforma ideias em campanhas prontas
            para Instagram, Facebook e WhatsApp.
          </p>
        </header>

        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/editor"
            className="rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-black hover:bg-emerald-400"
          >
            Abrir Editor Agora
          </Link>

          <Link
            href="/planos"
            className="rounded-xl border border-white/20 px-6 py-3 font-semibold hover:bg-white/10"
          >
            Ver Planos
          </Link>
        </div>

        <section className="mt-16 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="font-semibold text-lg">Templates prontos</h3>
            <p className="mt-2 text-sm text-white/70">
              Escolha nichos como locadora, restaurante, loja e mais.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="font-semibold text-lg">Criação rápida</h3>
            <p className="mt-2 text-sm text-white/70">
              Monte artes em segundos com visual profissional.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="font-semibold text-lg">Campanhas automáticas</h3>
            <p className="mt-2 text-sm text-white/70">
              Gere textos prontos para redes sociais automaticamente.
            </p>
          </div>
        </section>

        <section className="mt-16 text-center">
          <h2 className="text-2xl font-bold">
            Transforme ideias em vendas com a Aurora IA
          </h2>

          <Link
            href="/editor"
            className="mt-6 inline-block rounded-xl bg-emerald-500 px-8 py-4 font-bold text-black hover:bg-emerald-400"
          >
            Começar agora
          </Link>
        </section>
      </div>
    </main>
  );
}