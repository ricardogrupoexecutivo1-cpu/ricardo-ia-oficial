import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
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
    keywords: [
      ...seo.categories,
      ...seo.keywords,
      "Aurora IA",
      "imagem gerada por IA",
    ],
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

function pillLinkStyle(primary = false) {
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px 14px",
    borderRadius: 999,
    border: primary
      ? "1px solid rgba(16,185,129,0.38)"
      : "1px solid rgba(255,255,255,0.14)",
    background: primary
      ? "rgba(16,185,129,0.18)"
      : "rgba(255,255,255,0.04)",
    textDecoration: "none",
    color: "inherit",
    fontWeight: 700,
  } as const;
}

function formatDate(value: string | null) {
  if (!value) return null;

  try {
    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return null;
  }
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
  const pageUrl = `${SITE_URL}/i/${image.id}`;
  const encodedPageUrl = encodeURIComponent(pageUrl);
  const encodedTitle = encodeURIComponent(seo.title);
  const createdAtLabel = formatDate(image.created_at);

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
    `${seo.title} - ${pageUrl}`
  )}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedPageUrl}`;
  const xUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedPageUrl}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedPageUrl}`;
  const telegramUrl = `https://t.me/share/url?url=${encodedPageUrl}&text=${encodedTitle}`;

  return (
    <main
      style={{
        maxWidth: 1180,
        margin: "0 auto",
        padding: "24px",
        color: "white",
      }}
    >
      <section
        style={{
          ...cardStyle(),
          marginBottom: 24,
          textAlign: "center",
          background:
            "linear-gradient(135deg, rgba(16,185,129,0.14), rgba(15,23,42,0.94))",
          boxShadow: "0 0 40px rgba(16,185,129,0.08)",
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
            marginBottom: 14,
          }}
        >
          <Link href="/chat" style={pillLinkStyle(true)}>
            Abrir chat
          </Link>

          <Link href="/planos" style={pillLinkStyle()}>
            Ver planos
          </Link>

          <Link href="/explorar" style={pillLinkStyle()}>
            Explorar mais imagens
          </Link>
        </div>

        {createdAtLabel ? (
          <p style={{ margin: 0, opacity: 0.6, fontSize: 13 }}>
            Publicada em {createdAtLabel}
          </p>
        ) : null}
      </section>

      <section
        style={{
          display: "grid",
          gap: 24,
          gridTemplateColumns: "minmax(0, 1fr)",
          marginBottom: 24,
        }}
      >
        <article
          style={{
            ...cardStyle(),
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "1 / 1",
              background: "rgba(255,255,255,0.02)",
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            <Image
              src={image.image_url}
              alt={image.prompt || "Imagem gerada por IA"}
              fill
              sizes="(max-width: 768px) 100vw, 900px"
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
        </article>
      </section>

      <section
        style={{
          display: "grid",
          gap: 24,
          gridTemplateColumns: "minmax(0, 1fr)",
          marginBottom: 24,
        }}
      >
        <article style={cardStyle()}>
          <p
            style={{
              marginTop: 0,
              marginBottom: 12,
              color: "rgb(110 231 183)",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.16em",
              fontSize: 12,
            }}
          >
            Compartilhar imagem
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              style={pillLinkStyle(true)}
            >
              WhatsApp
            </a>

            <a
              href={facebookUrl}
              target="_blank"
              rel="noreferrer"
              style={pillLinkStyle()}
            >
              Facebook
            </a>

            <a
              href={xUrl}
              target="_blank"
              rel="noreferrer"
              style={pillLinkStyle()}
            >
              X
            </a>

            <a
              href={linkedinUrl}
              target="_blank"
              rel="noreferrer"
              style={pillLinkStyle()}
            >
              LinkedIn
            </a>

            <a
              href={telegramUrl}
              target="_blank"
              rel="noreferrer"
              style={pillLinkStyle()}
            >
              Telegram
            </a>

            <a
              href={image.image_url}
              target="_blank"
              rel="noreferrer"
              style={pillLinkStyle()}
            >
              Ver imagem original
            </a>
          </div>

          <p style={{ marginTop: 14, marginBottom: 0, opacity: 0.64, fontSize: 13 }}>
            Para Instagram e TikTok, use este link na bio, stories, descrição ou direct:
            <br />
            <span style={{ wordBreak: "break-all" }}>{pageUrl}</span>
          </p>
        </article>
      </section>

      <section
        style={{
          display: "grid",
          gap: 24,
          gridTemplateColumns: "minmax(0, 1fr)",
        }}
      >
        <article style={cardStyle()}>
          <p
            style={{
              marginTop: 0,
              marginBottom: 12,
              color: "rgb(110 231 183)",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.16em",
              fontSize: 12,
            }}
          >
            Prompt e contexto
          </p>

          <p
            style={{
              marginTop: 0,
              lineHeight: 1.8,
              opacity: 0.9,
              whiteSpace: "pre-wrap",
            }}
          >
            {image.prompt || "Imagem gerada por IA na Aurora."}
          </p>
        </article>

        <article style={cardStyle()}>
          <p
            style={{
              marginTop: 0,
              marginBottom: 12,
              color: "rgb(110 231 183)",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.16em",
              fontSize: 12,
            }}
          >
            Descrição da imagem
          </p>

          <p style={{ margin: 0, lineHeight: 1.8, opacity: 0.85 }}>
            {seo.description}
          </p>
        </article>

        {categoryLinks.length ? (
          <article style={cardStyle()}>
            <p
              style={{
                marginTop: 0,
                marginBottom: 12,
                color: "rgb(110 231 183)",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.16em",
                fontSize: 12,
              }}
            >
              Categorias relacionadas
            </p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              {categoryLinks.map((item) => (
                <Link
                  key={item.slug}
                  href={item.href}
                  style={pillLinkStyle()}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </article>
        ) : null}

        <article style={cardStyle()}>
          <p
            style={{
              marginTop: 0,
              marginBottom: 12,
              color: "rgb(110 231 183)",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.16em",
              fontSize: 12,
            }}
          >
            Próximo passo
          </p>

          <p style={{ marginTop: 0, lineHeight: 1.8, opacity: 0.85 }}>
            Use esta imagem como prova social, compartilhe com clientes e leve
            tráfego para a Aurora IA com páginas públicas indexáveis.
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              marginTop: 16,
            }}
          >
            <Link href="/chat" style={pillLinkStyle(true)}>
              Gerar nova imagem
            </Link>

            <Link href="/editor" style={pillLinkStyle()}>
              Criar campanha
            </Link>
          </div>
        </article>
      </section>
    </main>
  );
}