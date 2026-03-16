import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { dedupeGalleryItems } from "@/lib/gallery-utils";
import { SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site";
import { getCategoryBySlug, promptMatchesCategory, unslugify } from "@/lib/seo";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

type ImageRecord = {
  id: string;
  prompt: string | null;
  image_url: string | null;
  created_at: string | null;
  is_public: boolean | null;
};

async function getCategoryImages(slug: string): Promise<ImageRecord[]> {
  const supabase = getSupabaseAdmin();

  const { data } = await supabase
    .from("images")
    .select("id, prompt, image_url, created_at, is_public")
    .eq("is_public", true)
    .not("image_url", "is", null)
    .order("created_at", { ascending: false })
    .limit(300);

  const filtered = (data || []).filter((item) => promptMatchesCategory(item.prompt, slug));
  const deduped = dedupeGalleryItems(filtered);

  return deduped.slice(0, 60);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Categoria não encontrada",
      description: "A categoria solicitada não foi encontrada.",
    };
  }

  const images = await getCategoryImages(slug);
  const pageUrl = `${SITE_URL}/categorias/${slug}`;
  const firstImage = images[0]?.image_url || absoluteUrl("/icons/icon-512.png");

  const title = `${category.name} | Aurora IA`;
  const description =
    images.length > 0
      ? `Explore imagens públicas da categoria ${category.name} geradas na Aurora IA.`
      : `Veja a categoria ${category.name} na Aurora IA e acompanhe novas imagens públicas.`;

  return {
    title,
    description,
    keywords: [
      category.name,
      `imagens ${category.name.toLowerCase()}`,
      "Aurora IA",
      "arte com IA",
      "imagens públicas",
    ],
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      type: "website",
      url: pageUrl,
      title,
      description,
      siteName: SITE_NAME,
      images: [
        {
          url: firstImage,
          alt: category.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [firstImage],
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const images = await getCategoryImages(slug);

  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: "24px" }}>
      <div style={{ marginBottom: 24 }}>
        <p style={{ opacity: 0.7, marginBottom: 8 }}>Categoria pública • Aurora IA</p>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: 12 }}>
          {category.name}
        </h1>
        <p style={{ lineHeight: 1.7, opacity: 0.88, maxWidth: 780 }}>
          Página automática de SEO da categoria {category.name}. Aqui ficam reunidas
          imagens públicas relacionadas a esse tema.
        </p>
      </div>

      <div style={{ marginBottom: 24 }}>
        <Link
          href="/explorar"
          style={{
            display: "inline-flex",
            padding: "10px 14px",
            borderRadius: 999,
            textDecoration: "none",
            border: "1px solid rgba(255,255,255,0.15)",
          }}
        >
          ← Voltar para explorar
        </Link>
      </div>

      {images.length === 0 ? (
        <div
          style={{
            padding: 24,
            borderRadius: 20,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          Ainda não há imagens públicas nesta categoria.
        </div>
      ) : (
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
                    alt={image.prompt || category.name}
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
                  {image.prompt || unslugify(slug)}
                </p>
              </div>
            </Link>
          ))}
        </section>
      )}
    </main>
  );
}