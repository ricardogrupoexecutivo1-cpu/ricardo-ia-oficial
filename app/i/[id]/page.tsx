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

function cardStyle() {
  return {
    borderRadius: 20,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.03)",
    padding: 20,
  } as const;
}

function pillLinkStyle() {
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px 14px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.04)",
    textDecoration: "none",
    color: "inherit",
    fontWeight: 600,
  } as const;
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
    <main style={{ maxWidth: 1180, margin: "0 auto", padding: "24px" }}>
      <section
        style={{
          ...cardStyle(),
          marginBottom: 24,
          textAlign: "center",
          background:
            "linear-gradient(135deg, rgba(124,58,237,0.14), rgba(15,23,42,0.92))",
        }}
      >
        <p style={{ opacity: 0.72, margin: 0, marginBottom: 10 }}>
          Imagem pública • Aurora IA
        </p>

        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 800,
            lineHeight: 1.25,
            margin: 0,
            marginBottom: 14,
          }}
        >
          {image.prompt || "Imagem gerada por IA"}
        </h1>

        <p
          style={{
            margin: "0 auto 20px",
            maxWidth: 860,
            lineHeight: 1.7,
            opacity: 0.88,
          }}
        >
          {seo.description}
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            justifyContent: "center",
          }}
        >
          <Link href="/" style={pillLinkStyle()}>
            Início
          </Link>

          <Link href="/chat" style={pillLinkStyle()}>
            Chat
          </Link>

          <Link href="/explorar" style={pillLinkStyle()}>
            Galeria pública
          </Link>

          <Link href="/planos" style={pillLinkStyle()}>
            Planos
          </Link>

          <Link href={`/prompts/${promptSeo.slug}`} style={pillLinkStyle()}>
            Página do prompt
          </Link>
        </div>
      </section>

      <section
        style={{
          ...cardStyle(),
          marginBottom: 24,
          padding: 14,
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "1 / 1",
            borderRadius: 18,
            overflow: "hidden",
            background: "#0f172a",
          }}
        >
          <Image
            src={image.image_url}
            alt={image.prompt || "Imagem gerada por IA"}
            fill
            sizes="(max-width: 768px) 100vw, 960px"
            style={{ objectFit: "cover" }}
            priority
          />
        </div>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 20,
        }}
      >
        <div style={cardStyle()}>
          <h2
            style={{
              fontSize: "1.1rem",
              fontWeight: 700,
              marginTop: 0,
              marginBottom: 14,
            }}
          >
            Navegação rápida
          </h2>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            <Link href="/" style={pillLinkStyle()}>
              Voltar para o início
            </Link>

            <Link href="/explorar" style={pillLinkStyle()}>
              Explorar imagens
            </Link>

            <Link href={`/prompts/${promptSeo.slug}`} style={pillLinkStyle()}>
              Ver prompt
            </Link>
          </div>
        </div>

        <div style={cardStyle()}>
          <h2
            style={{
              fontSize: "1.1rem",
              fontWeight: 700,
              marginTop: 0,
              marginBottom: 14,
            }}
          >
            Categorias relacionadas
          </h2>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {categoryLinks.map((category) => (
              <Link key={category.slug} href={category.href} style={pillLinkStyle()}>
                {category.name}
              </Link>
            ))}
          </div>
        </div>

        <div style={cardStyle()}>
          <h2
            style={{
              fontSize: "1.1rem",
              fontWeight: 700,
              marginTop: 0,
              marginBottom: 14,
            }}
          >
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
        </div>
      </section>
    </main>
  );
}