import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

type AuroraImage = {
  id: string;
  prompt: string;
  image_url: string;
  created_at: string;
  is_public: boolean;
};

function slugifyPrompt(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

function formatDate(dateString: string) {
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(dateString));
  } catch {
    return dateString;
  }
}

async function getPublicPrompts(): Promise<AuroraImage[]> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    console.error("Variáveis do Supabase não configuradas para /prompts.");
    return [];
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const { data, error } = await supabase
    .from("aurora_images")
    .select("id, prompt, image_url, created_at, is_public")
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    console.error("Erro ao carregar prompts públicos:", error);
    return [];
  }

  return data ?? [];
}

export default async function PromptsPage() {
  const images = await getPublicPrompts();

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-8 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex items-center rounded-lg border border-white/10 px-4 py-2 text-sm text-white/80 transition hover:border-white/20 hover:text-white"
          >
            ← Voltar para início
          </Link>

          <Link
            href="/explorar"
            className="inline-flex items-center rounded-lg border border-white/10 px-4 py-2 text-sm text-white/80 transition hover:border-white/20 hover:text-white"
          >
            Explorar galeria
          </Link>
        </div>

        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.25em] text-cyan-400">
            PROMPTS • AURORA IA
          </p>

          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
            Ideias e prompts públicos da Aurora IA
          </h1>

          <p className="mt-3 max-w-3xl text-white/70">
            Descubra prompts usados para criar imagens públicas na Aurora IA.
            Essa página ajuda novos usuários a se inspirarem e também aumenta
            a capacidade do Google encontrar temas buscados como advogado do
            futuro, Dubai iluminada, formas de ganhar dinheiro na internet e
            muitos outros.
          </p>
        </div>

        {images.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-white/70">
            Nenhum prompt público encontrado no momento.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {images.map((image) => {
              const slug = slugifyPrompt(image.prompt) || image.id;

              return (
                <article
                  key={image.id}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
                >
                  <Link
                    href={`/explorar/${slug}?id=${image.id}`}
                    className="block"
                  >
                    <div className="aspect-video overflow-hidden bg-black">
                      <img
                        src={image.image_url}
                        alt={image.prompt}
                        className="h-full w-full object-cover transition duration-300 hover:scale-[1.02]"
                      />
                    </div>
                  </Link>

                  <div className="p-5">
                    <h2 className="text-lg font-semibold text-white">
                      {image.prompt}
                    </h2>

                    <p className="mt-3 text-sm text-white/60">
                      Criado em {formatDate(image.created_at)}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <Link
                        href={`/explorar/${slug}?id=${image.id}`}
                        className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-black transition hover:opacity-90"
                      >
                        Ver imagem
                      </Link>

                      <Link
                        href="/chat"
                        className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/80 transition hover:border-white/20 hover:text-white"
                      >
                        Criar parecido
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}