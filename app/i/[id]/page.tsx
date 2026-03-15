import { createClient } from "@supabase/supabase-js";
import type { Metadata } from "next";
import Link from "next/link";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

async function getImageById(id: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return null;
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { data } = await supabase
    .from("images")
    .select("id, prompt, image_url, created_at, is_public")
    .eq("id", id)
    .maybeSingle();

  if (!data || data.is_public === false) {
    return null;
  }

  return data;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const image = await getImageById(id);

  const baseUrl = "https://ricardoiaoficial.com";
  const pageUrl = `${baseUrl}/i/${id}`;

  const promptText =
    image?.prompt?.trim() || "Imagem criada com inteligência artificial";
  const title = `Aurora IA • ${promptText}`;
  const description = `${promptText} • Criada em ricardoiaoficial.com com Aurora IA.`;

  const imageUrl = image?.image_url || "";

  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: "RICARDOIAOFICIAL.COM • AURORA IA",
      type: "website",
      locale: "pt_BR",
      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: 1024,
              height: 1024,
              alt: promptText,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function PublicImagePage({ params }: PageProps) {
  const { id } = await params;
  const image = await getImageById(id);

  if (!image) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#0b1020",
          color: "#ffffff",
          padding: 24,
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h1 style={{ marginTop: 0 }}>Aurora IA</h1>
          <p>Imagem não encontrada.</p>

          <div style={{ marginTop: 24 }}>
            <Link
              href="/chat"
              style={{
                display: "inline-block",
                padding: "12px 18px",
                borderRadius: 10,
                background: "#2b7fff",
                color: "#fff",
                textDecoration: "none",
                fontWeight: 700,
              }}
            >
              Criar imagem com Aurora IA
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0b1020",
        color: "#ffffff",
        padding: 24,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div style={{ marginBottom: 20 }}>
          <Link href="/" style={{ color: "#9ecbff", textDecoration: "none" }}>
            Voltar
          </Link>
        </div>

        <h1
          style={{
            fontSize: "clamp(28px, 4vw, 42px)",
            marginTop: 0,
            marginBottom: 10,
          }}
        >
          Aurora IA
        </h1>

        <p
          style={{
            color: "#c6d1ee",
            fontSize: 17,
            lineHeight: 1.6,
            marginTop: 0,
            marginBottom: 20,
          }}
        >
          {image.prompt || "Imagem criada com inteligência artificial."}
        </p>

        <div
          style={{
            background: "#121a33",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 18,
            padding: 16,
          }}
        >
          <img
            src={image.image_url || ""}
            alt={image.prompt || "Imagem criada com Aurora IA"}
            style={{
              width: "100%",
              height: "auto",
              borderRadius: 14,
              display: "block",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          />
        </div>

        <div
          style={{
            marginTop: 20,
            background: "#121a33",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 18,
            padding: 18,
          }}
        >
          <div
            style={{
              fontSize: 14,
              color: "#9fb0dc",
              marginBottom: 8,
              fontWeight: 700,
            }}
          >
            Prompt usado
          </div>

          <p
            style={{
              margin: 0,
              color: "#ffffff",
              lineHeight: 1.7,
              wordBreak: "break-word",
            }}
          >
            {image.prompt || "Sem prompt informado."}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            marginTop: 24,
          }}
        >
          <Link
            href="/chat"
            style={{
              display: "inline-block",
              padding: "12px 18px",
              borderRadius: 10,
              background: "#2b7fff",
              color: "#fff",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            Criar imagem com Aurora IA
          </Link>

          <Link
            href="/explorar"
            style={{
              display: "inline-block",
              padding: "12px 18px",
              borderRadius: 10,
              background: "#16203d",
              color: "#fff",
              textDecoration: "none",
              fontWeight: 700,
              border: "1px solid #2b3558",
            }}
          >
            Ver outras imagens
          </Link>
        </div>
      </div>
    </main>
  );
}