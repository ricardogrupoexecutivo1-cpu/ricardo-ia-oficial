"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type ExploreImage = {
  id: string;
  prompt: string | null;
  image_url: string | null;
  created_at: string | null;
  email?: string | null;
};

type ExploreApiResponse = {
  images?: ExploreImage[];
  error?: string;
};

function formatPrompt(prompt: string | null) {
  const text = (prompt || "Imagem criada por IA").trim();
  return text || "Imagem criada por IA";
}

export default function ExplorePage() {
  const [images, setImages] = useState<ExploreImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadImages() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/explorar", {
          cache: "no-store",
        });

        const data = (await response.json()) as ExploreApiResponse;

        if (!response.ok) {
          setError(data?.error || "Erro ao carregar imagens.");
          setImages([]);
          return;
        }

        setImages(Array.isArray(data?.images) ? data.images : []);
      } catch (err) {
        console.error(err);
        setError("Erro inesperado ao carregar a galeria.");
        setImages([]);
      } finally {
        setLoading(false);
      }
    }

    loadImages();
  }, []);

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <header className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Aurora IA
            </p>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Explorar imagens públicas
            </h1>
            <p className="max-w-3xl text-sm leading-6 text-zinc-600 sm:text-base">
              Descubra imagens criadas na Aurora IA.
            </p>

            <div className="pt-2">
              <Link
                href="/chat"
                className="inline-flex items-center justify-center rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Criar nova imagem
              </Link>
            </div>
          </div>
        </header>

        {loading && (
          <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-zinc-500">Carregando galeria...</p>
          </section>
        )}

        {!loading && error && (
          <section className="rounded-3xl border border-red-200 bg-red-50 p-6 shadow-sm">
            <p className="text-sm font-medium text-red-700">{error}</p>
          </section>
        )}

        {!loading && !error && images.length === 0 && (
          <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-zinc-500">
              Ainda não há imagens públicas para exibir.
            </p>
          </section>
        )}

        {!loading && !error && images.length > 0 && (
          <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {images.map((image) => (
                <Link
                  key={image.id}
                  href={`/i/${image.id}`}
                  className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="aspect-square overflow-hidden bg-zinc-100">
                    <img
                      src={image.image_url || ""}
                      alt={formatPrompt(image.prompt)}
                      className="h-full w-full object-cover transition group-hover:scale-[1.02]"
                    />
                  </div>

                  <div className="p-4">
                    <p className="line-clamp-3 text-sm leading-6 text-zinc-800">
                      {formatPrompt(image.prompt)}
                    </p>

                    <p className="mt-2 text-xs text-zinc-500">
                      ID: {image.id}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}