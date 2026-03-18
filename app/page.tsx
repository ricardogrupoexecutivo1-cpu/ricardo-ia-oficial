"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type GalleryImage = {
  id: string;
  image_url: string;
  prompt: string | null;
};

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizePrompt(value: string | null) {
  return (value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function resolveImageUrl(item: any) {
  const candidates = [
    item?.image_url,
    item?.imageUrl,
    item?.public_image_url,
    item?.publicImageUrl,
    item?.url,
    item?.src,
  ];

  for (const candidate of candidates) {
    const value = normalizeText(candidate);

    if (
      value &&
      (value.startsWith("http://") ||
        value.startsWith("https://") ||
        value.startsWith("data:image/") ||
        value.startsWith("/"))
    ) {
      return value;
    }
  }

  return "";
}

function normalizeImages(payload: any): GalleryImage[] {
  const candidates = [payload?.images, payload?.data, payload?.items, payload];

  for (const candidate of candidates) {
    if (!Array.isArray(candidate)) continue;

    const normalized = candidate
      .map((item: any, index: number) => {
        const id = normalizeText(item?.id) || `img-${index}`;
        const imageUrl = resolveImageUrl(item);
        const prompt =
          normalizeText(item?.prompt) ||
          normalizeText(item?.title) ||
          normalizeText(item?.message) ||
          null;

        return {
          id,
          image_url: imageUrl,
          prompt: prompt || null,
        };
      })
      .filter((item: GalleryImage) => item.image_url);

    if (normalized.length > 0) {
      return normalized;
    }
  }

  return [];
}

function buildFeaturedImages(images: GalleryImage[], limit = 8) {
  const unique: GalleryImage[] = [];
  const seenPromptKeys = new Set<string>();
  const seenImageUrls = new Set<string>();

  for (const image of images) {
    const imageUrlKey = image.image_url.trim();

    if (!imageUrlKey || seenImageUrls.has(imageUrlKey)) {
      continue;
    }

    const promptKey = normalizePrompt(image.prompt);

    if (promptKey && seenPromptKeys.has(promptKey)) {
      continue;
    }

    seenImageUrls.add(imageUrlKey);

    if (promptKey) {
      seenPromptKeys.add(promptKey);
    }

    unique.push(image);

    if (unique.length >= limit) {
      break;
    }
  }

  return unique;
}

function FeaturedCard({ image }: { image: GalleryImage }) {
  const [failed, setFailed] = useState(false);

  return (
    <Link
      href={`/i/${image.id}`}
      title={image.prompt || "Imagem criada com Aurora IA"}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5"
    >
      <div className="aspect-square overflow-hidden bg-black/20">
        {!failed ? (
          <img
            src={image.image_url}
            alt={image.prompt || "Imagem criada com Aurora IA"}
            onError={() => setFailed(true)}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 p-4 text-center">
            <div>
              <p className="text-sm font-semibold text-white/85">Aurora IA</p>
              <p className="mt-2 line-clamp-3 text-xs leading-5 text-white/65">
                {image.prompt || "Imagem criada com Aurora IA"}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent p-3 opacity-100 transition duration-300 md:opacity-0 md:group-hover:opacity-100">
        <p className="line-clamp-2 text-xs leading-5 text-white">
          {image.prompt || "Imagem criada com Aurora IA"}
        </p>
      </div>
    </Link>
  );
}

function ValueCard({
  title,
  description,
  href,
  cta,
  highlight = false,
}: {
  title: string;
  description: string;
  href: string;
  cta: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-3xl border p-5 ${
        highlight
          ? "border-emerald-400/20 bg-emerald-500/10 shadow-[0_0_35px_rgba(16,185,129,0.10)]"
          : "border-white/10 bg-white/5"
      }`}
    >
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-white/70">{description}</p>

      <Link
        href={href}
        className={`mt-5 inline-flex rounded-xl px-5 py-3 text-sm font-semibold transition ${
          highlight
            ? "bg-emerald-500 text-black hover:bg-emerald-400"
            : "border border-white/15 text-white hover:bg-white/10"
        }`}
      >
        {cta}
      </Link>
    </div>
  );
}

export default function HomePage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadImages() {
      try {
        const response = await fetch("/api/explore", {
          method: "GET",
          cache: "no-store",
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(
            (data && typeof data?.error === "string" && data.error) ||
              "Erro ao carregar imagens."
          );
        }

        const normalized = normalizeImages(data);

        if (isMounted) {
          setImages(normalized);
        }
      } catch {
        if (isMounted) {
          setImages([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadImages();

    return () => {
      isMounted = false;
    };
  }, []);

  const featuredImages = useMemo(() => {
    return buildFeaturedImages(images, 8);
  }, [images]);

  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <header className="mb-6 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold">Aurora IA</h1>
            <p className="text-sm text-white/60">
              Imagens, ideias, campanhas e criação com IA.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/chat"
              className="rounded-full border border-white/10 px-4 py-2 text-sm hover:bg-white/10"
            >
              Chat
            </Link>
            <Link
              href="/editor"
              className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-emerald-400"
            >
              Abrir Editor
            </Link>
            <Link
              href="/planos"
              className="rounded-full border border-white/10 px-4 py-2 text-sm hover:bg-white/10"
            >
              Planos
            </Link>
          </div>
        </header>

        <section className="mb-8 rounded-3xl border border-emerald-400/15 bg-white/5 px-5 py-8 shadow-[0_0_40px_rgba(16,185,129,0.08)]">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold leading-tight md:text-5xl">
              Crie imagens, campanhas e peças visuais com a Aurora IA
            </h2>

            <p className="mt-4 text-sm leading-6 text-white/70 md:text-base">
              Gere imagens, campanhas e ideias de negócio em segundos. Agora a
              Aurora também conta com editor visual para transformar imagens em
              artes prontas para divulgação.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/chat"
                className="rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-black transition hover:bg-emerald-400"
              >
                Gerar imagem agora
              </Link>

              <Link
                href="/editor"
                className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-6 py-3 font-semibold text-emerald-300 transition hover:bg-emerald-500/15"
              >
                Criar arte no editor
              </Link>

              <Link
                href="/explorar"
                className="rounded-xl border border-white/15 px-6 py-3 font-semibold transition hover:bg-white/10"
              >
                Explorar galeria
              </Link>
            </div>
          </div>
        </section>

        <section className="mb-8 rounded-3xl border border-emerald-400/20 bg-emerald-500/10 px-5 py-8 text-center">
          <h2 className="text-2xl font-bold md:text-3xl">
            Crie artes profissionais com o Aurora Editor
          </h2>

          <p className="mt-3 text-white/70">
            Suba sua imagem, edite, gere campanhas e baixe tudo pronto em segundos.
          </p>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/editor"
              className="rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-black transition hover:bg-emerald-400"
            >
              Abrir Editor
            </Link>

            <Link
              href="/editor-public"
              className="rounded-xl border border-white/20 px-6 py-3 font-semibold transition hover:bg-white/10"
            >
              Ver como funciona
            </Link>
          </div>
        </section>

        <section className="mb-8 grid gap-4 md:grid-cols-3">
          <ValueCard
            title="Chat inteligente"
            description="Converse com a Aurora para criar ideias, campanhas, respostas e imagens com rapidez."
            href="/chat"
            cta="Abrir chat"
          />

          <ValueCard
            title="Aurora Editor"
            description="Suba imagem, escreva textos, ajuste botão, aplique template e baixe a peça pronta para postar."
            href="/editor"
            cta="Abrir editor"
            highlight
          />

          <ValueCard
            title="Planos para crescer"
            description="Comece grátis e avance para recursos pensados para criadores, empresas e monetização."
            href="/planos"
            cta="Ver planos"
          />
        </section>

        <section className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-5">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-300">
                Novo módulo
              </p>
              <h3 className="mt-2 text-2xl font-bold md:text-3xl">
                Aurora Editor: transforme imagem em campanha pronta
              </h3>
              <p className="mt-3 text-sm leading-6 text-white/70 md:text-base">
                Faça upload da imagem, edite título, subtítulo e botão de ação,
                use templates por nicho e baixe o material pronto para Instagram,
                anúncio, loja, locadora, imobiliária e muito mais.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/editor"
                className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-black transition hover:bg-emerald-400"
              >
                Usar o Editor
              </Link>

              <Link
                href="/planos"
                className="inline-flex items-center justify-center rounded-xl border border-white/15 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                Ver planos da Aurora
              </Link>
            </div>
          </div>
        </section>

        <section className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-5">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-300">
                Em breve
              </p>
              <h3 className="mt-2 text-2xl font-bold md:text-3xl">
                Livro: O ser humano só não conquista o que não quer
              </h3>
              <p className="mt-3 text-sm leading-6 text-white/70 md:text-base">
                Estamos preparando a página do seu livro com leitura online,
                download e integração com a Aurora IA para gerar autoridade,
                retenção e conexão com o público.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/livro"
                className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-black transition hover:bg-emerald-400"
              >
                Ver página do livro
              </Link>

              <Link
                href="/chat"
                className="inline-flex items-center justify-center rounded-xl border border-white/15 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                Abrir Aurora
              </Link>
            </div>
          </div>
        </section>

        <section className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold">Imagens em destaque</h3>
            <p className="text-sm text-white/60">
              Capa automática com imagens recentes e vitrine dinâmica.
            </p>
          </div>

          <Link
            href="/explorar"
            className="text-sm text-emerald-300 transition hover:text-emerald-200"
          >
            Ver todas
          </Link>
        </section>

        {isLoading ? (
          <section className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="aspect-square animate-pulse rounded-2xl border border-white/10 bg-white/5"
              />
            ))}
          </section>
        ) : featuredImages.length > 0 ? (
          <section className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {featuredImages.map((image) => (
              <FeaturedCard key={image.id} image={image} />
            ))}
          </section>
        ) : (
          <section className="rounded-2xl border border-dashed border-white/15 bg-white/5 px-4 py-10 text-center">
            <p className="text-sm text-white/70">
              Nenhuma imagem disponível ainda na capa.
            </p>
            <p className="mt-2 text-sm text-white/50">
              Gere novas imagens no chat para preencher automaticamente esta área.
            </p>

            <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/chat"
                className="inline-flex rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-black transition hover:bg-emerald-400"
              >
                Criar primeira imagem
              </Link>

              <Link
                href="/editor"
                className="inline-flex rounded-xl border border-white/15 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                Abrir Editor
              </Link>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}