import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buildPromptSeo } from "@/lib/prompt-seo";
import { analyzePromptForSeo, getCategoryLinksFromPrompt } from "@/lib/seo";
import { SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

type ImageRecord = {
  id: string;
  prompt: string | null;
  image_url: string | null;
  created_at: string | null;
  is_public: boolean | null;
};

async function getImage(id: string): Promise<ImageRecord | null> {
  const supabase = getSupabaseAdmin();

  const { data } = await supabase
    .from("images")
    .select("id, prompt, image_url, created_at, is_public")
    .eq("id", id)
    .eq("is_public", true)
    .maybeSingle();

  return data;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const image = await getImage(id);

  if (!image) {
    return {
      title: "Imagem não encontrada",
      description: "A imagem pública solicitada não foi encontrada.",
    };
  }

  const seo = analyzePromptForSeo(image.prompt);
  const pageUrl = `${SITE_URL}/i/${image.id}`;
  const ogImage = image.image_url || absoluteUrl("/icons/icon-512.png");

  return {
    title: seo.title,
    description: seo.description,
    keywords: [...seo.categories, ...seo.keywords, "Aurora IA", "imagem gerada por IA"],
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      type: "article",
      url: pageUrl,
      title: seo.title,
      description: seo.description,
      siteName: SITE_NAME,
      images: [
        {
          url: ogImage,
          alt: image.prompt || "Imagem gerada por IA",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [ogImage],
    },
  };
}

export default async function PublicImagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const image = await getImage(id);

  if (!image || !image.image_url) {
    notFound();
  }

  const seo = analyzePromptForSeo(image.prompt);
  const categoryLinks = getCategoryLinksFromPrompt(image.prompt);
  const promptSeo = buildPromptSeo(image.prompt);

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "24px" }}>
      <div style={{ marginBottom: 20 }}>
        <p style={{ opacity: 0.7, marginBottom: 8 }}>Imagem pública • Aurora IA</p>
        <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: 12 }}>
          {image.prompt || "Imagem gerada por IA"}
        </h1>
        <p style={{ lineHeight: 1.6, opacity: 0.85 }}>{seo.description}</p>
      </div>

      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "1 / 1",
          borderRadius: 18,
          overflow: "hidden",
          background: "#0f172a",
          marginBottom: 24,
        }}
      >
        <Image
          src={image.image_url}
          alt={image.prompt || "Imagem gerada por IA"}
          fill
          sizes="(max-width: 768px) 100vw, 900px"
          style={{ objectFit: "cover" }}
          priority
        />
      </div>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: 10 }}>
          Página do prompt
        </h2>

        <Link
          href={`/prompts/${promptSeo.slug}`}
          style={{
            display: "inline-flex",
            padding: "10px 14px",
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.15)",
            background: "rgba(255,255,255,0.04)",
            textDecoration: "none",
            color: "inherit",
          }}
        >
          Ver página deste prompt
        </Link>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: 10 }}>
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

      <section>
        <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: 10 }}>
          Palavras-chave
        </h2>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {seo.keywords.map((keyword) => (
            <span
              key={keyword}
              style={{
                padding: "8px 12px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.03)",
              }}
            >
              {keyword}
            </span>
          ))}
        </div>
      </section>
    </main>
  );
}