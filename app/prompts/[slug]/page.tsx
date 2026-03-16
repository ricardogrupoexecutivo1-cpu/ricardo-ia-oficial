import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { dedupeGalleryItems } from "@/lib/gallery-utils";
import { buildPromptSeo, promptsLookSimilar } from "@/lib/prompt-seo";
import { getCategoryLinksFromPrompt } from "@/lib/seo";
import { SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

type ImageRecord = {
  id: string;
  prompt: string | null;
  image_url: string | null;
  created_at: string | null;
  is_public: boolean | null;
};

async function getPromptImages(slug: string): Promise<ImageRecord[]> {
  const supabase = getSupabaseAdmin();

  const { data } = await supabase
    .from("images")
    .select("id, prompt, image_url, created_at, is_public")
    .eq("is_public", true)
    .not("image_url", "is", null)
    .order("created_at", { ascending: false })
    .limit(500);

  const filtered = (data || []).filter((item) => {
    const seo = buildPromptSeo(item.prompt);
    return seo.slug === slug || promptsLookSimilar(item.prompt, slug.replace(/-/g, " "));
  });

  const deduped = dedupeGalleryItems(filtered);

  return deduped.slice(0, 60);
}

async function getCanonicalPrompt(slug: string) {
  const images = await getPromptImages(slug);
  const firstPrompt = images[0]?.prompt?.trim();

  if (!firstPrompt) return null;

  return buildPromptSeo(firstPrompt);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const promptSeo = await getCanonicalPrompt(slug);

  if (!promptSeo) {
    return {
      title: "Prompt não encontrado",
      description: "O prompt solicitado não foi encontrado.",
    };
  }

  const images = await getPromptImages(slug);
  const pageUrl = `${SITE_URL}/prompts/${slug}`;
  const firstImage = images[0]?.image_url || absoluteUrl("/icons/icon-512.png");

  return {
    title: promptSeo.title,
    description: promptSeo.description,
    keywords: [
      "Aurora IA",
      "prompt de imagem",
      "imagens por prompt",
      promptSeo.slug.replace(/-/g, " "),
    ],
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      type: "website",
      url: pageUrl,
      title: promptSeo.title,
      description: promptSeo.description,
      siteName: SITE_NAME,
      images: [
        {
          url: firstImage,
          alt: promptSeo.slug,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: promptSeo.title,
      description: promptSeo.description,
      images: [firstImage],
    },
  };
}

export default async function PromptPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const images = await getPromptImages(slug);

  if (!images.length) {
    notFound();
  }

  const canonicalPrompt = images[0]?.prompt || "Prompt gerado com IA";
  const promptSeo = buildPromptSeo(canonicalPrompt);
  const categoryLinks = getCategoryLinksFromPrompt(canonicalPrompt);

  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: "24px" }}>
      <div style={{ marginBottom: 24 }}>
        <p style={{ opacity: 0.7, marginBottom: 8 }}>Prompt público • Aurora IA</p>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: 12 }}>
          {canonicalPrompt}
        </h1>
        <p style={{ lineHeight: 1.7, opacity: 0.88, maxWidth: 860 }}>
          {promptSeo.description}
        </p>
      </div>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 10 }}>
          Categorias relacionadas
        </h2>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {categoryLinks.map((category) => (
            <Link
              key={category.slug}
              href={category.href}
              style={{
                padding: "8px 12px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.15)",
                background: "rgba(255,255,255,0.04)",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              {category.name}
            </Link>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: 24 }}>
        <Link
          href="/explorar"
          style={{
            display: "inline-flex",
            padding: "10px 14px",
            borderRadius: 999,
            textDecoration: "none",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "inherit",
          }}
        >
          ← Voltar para explorar
        </Link>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 18,
        }}
      >
        {images.map((image) => (
          <Link
            key={image.id}
            href={`/i/${image.id}`}
            style={{
              display: "block",
              textDecoration: "none",
              color: "inherit",
              borderRadius: 18,
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.03)",
            }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "1 / 1",
                background: "#0f172a",
              }}
            >
              {image.image_url ? (
                <Image
                  src={image.image_url}
                  alt={image.prompt || canonicalPrompt}
                  fill
                  sizes="(max-width: 768px) 100vw, 300px"
                  style={{ objectFit: "cover" }}
                />
              ) : null}
            </div>

            <div style={{ padding: 14 }}>
              <p
                style={{
                  fontSize: 14,
                  lineHeight: 1.5,
                  margin: 0,
                  opacity: 0.92,
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {image.prompt || canonicalPrompt}
              </p>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}