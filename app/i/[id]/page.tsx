import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

type ImageRow = {
  id: string;
  prompt?: string | null;
  image_url?: string | null;
  user_email?: string | null;
  email?: string | null;
  created_at?: string | null;
  is_public?: boolean | null;
};

function getEnv(name: string) {
  return process.env[name]?.trim() || "";
}

function getSupabaseClient() {
  const supabaseUrl =
    getEnv("SUPABASE_URL") || getEnv("NEXT_PUBLIC_SUPABASE_URL");
  const supabaseKey =
    getEnv("SUPABASE_SERVICE_ROLE_KEY") || getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Variáveis do Supabase não configuradas para a página /i/[id]."
    );
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function text(value: unknown) {
  if (typeof value !== "string") return "";
  return value.trim();
}

function absoluteUrl(pathOrUrl: string) {
  if (!pathOrUrl) return "";
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }

  const siteUrl =
    getEnv("NEXT_PUBLIC_SITE_URL") ||
    getEnv("NEXT_PUBLIC_APP_URL") ||
    "http://localhost:3000";

  return `${siteUrl.replace(/\/$/, "")}/${pathOrUrl.replace(/^\//, "")}`;
}

async function findImageById(id: string): Promise<ImageRow | null> {
  const supabase = getSupabaseClient();
  const tables = ["images", "aurora_images"];

  for (const table of tables) {
    const result = await supabase
      .from(table)
      .select("id,prompt,image_url,user_email,email,created_at,is_public")
      .eq("id", id)
      .maybeSingle();

    if (!result.error && result.data) {
      return result.data as ImageRow;
    }
  }

  return null;
}

function buildTitle(image: ImageRow | null) {
  const prompt = text(image?.prompt);
  if (!prompt) return "Imagem | Aurora IA";
  return `${prompt.slice(0, 60)}${prompt.length > 60 ? "..." : ""} | Aurora IA`;
}

function buildDescription(image: ImageRow | null) {
  const prompt = text(image?.prompt);
  if (!prompt) {
    return "Imagem pública da Aurora IA.";
  }

  return `Imagem pública da Aurora IA gerada a partir do prompt: ${prompt.slice(
    0,
    140
  )}${prompt.length > 140 ? "..." : ""}`;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const image = await findImageById(id);

  const title = buildTitle(image);
  const description = buildDescription(image);
  const imageUrl = text(image?.image_url);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: imageUrl ? [absoluteUrl(imageUrl)] : [],
    },
    twitter: {
      card: imageUrl ? "summary_large_image" : "summary",
      title,
      description,
      images: imageUrl ? [absoluteUrl(imageUrl)] : [],
    },
  };
}

export default async function PublicImagePage({ params }: PageProps) {
  const { id } = await params;
  const image = await findImageById(id);

  if (!image || !text(image.image_url)) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background:
            "radial-gradient(circle at top, rgba(59,130,246,0.14), transparent 28%), #050816",
          color: "#e5eef8",
          padding: "32px 16px 80px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div style={{ maxWidth: 1000, margin: "0 auto", width: "100%" }}>
          <section
            style={{
              border: "1px solid rgba(148,163,184,0.18)",
              background: "rgba(15,23,42,0.72)",
              backdropFilter: "blur(10px)",
              borderRadius: 24,
              padding: 32,
              boxShadow: "0 20px 80px rgba(0,0,0,0.35)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                padding: "8px 12px",
                borderRadius: 999,
                background: "rgba(239,68,68,0.14)",
                border: "1px solid rgba(239,68,68,0.25)",
                color: "#fca5a5",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: 0.3,
                marginBottom: 16,
              }}
            >
              Imagem não encontrada
            </div>

            <h1 style={{ fontSize: 38, lineHeight: 1.05, margin: 0 }}>
              Esta imagem não está mais disponível
            </h1>

            <p
              style={{
                color: "#94a3b8",
                marginTop: 16,
                maxWidth: 760,
                marginLeft: "auto",
                marginRight: "auto",
                fontSize: 16,
                lineHeight: 1.7,
              }}
            >
              O link acessado pode ser antigo, inválido ou a imagem pode ter sido
              removida. Estamos em constante atualização e pode haver momentos de
              instabilidade.
            </p>

            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                justifyContent: "center",
                marginTop: 24,
              }}
            >
              <Link
                href="/explorar"
                style={{
                  color: "#86efac",
                  textDecoration: "none",
                  border: "1px solid rgba(134,239,172,0.25)",
                  borderRadius: 999,
                  padding: "12px 16px",
                }}
              >
                Ir para Explorar
              </Link>

              <Link
                href="/"
                style={{
                  color: "#93c5fd",
                  textDecoration: "none",
                  border: "1px solid rgba(147,197,253,0.25)",
                  borderRadius: 999,
                  padding: "12px 16px",
                }}
              >
                Voltar à Home
              </Link>

              <Link
                href="/chat"
                style={{
                  color: "#facc15",
                  textDecoration: "none",
                  border: "1px solid rgba(250,204,21,0.25)",
                  borderRadius: 999,
                  padding: "12px 16px",
                }}
              >
                Criar nova imagem
              </Link>
            </div>

            <div
              style={{
                marginTop: 24,
                borderRadius: 18,
                padding: 18,
                background: "rgba(2,6,23,0.45)",
                border: "1px solid rgba(148,163,184,0.14)",
                color: "#cbd5e1",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  letterSpacing: 0.4,
                  marginBottom: 8,
                }}
              >
                ID auditado
              </div>
              <code style={{ wordBreak: "break-all" }}>{id}</code>
            </div>
          </section>
        </div>
      </main>
    );
  }

  const prompt = text(image.prompt) || "Imagem Aurora IA";
  const imageUrl = absoluteUrl(text(image.image_url));
  const createdAt = text(image.created_at);
  const ownerEmail = text(image.user_email) || text(image.email);

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(34,197,94,0.14), transparent 28%), #050816",
        color: "#e5eef8",
        padding: "32px 16px 80px",
      }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: 16,
          }}
        >
          <Link
            href="/"
            style={{
              color: "#93c5fd",
              textDecoration: "none",
              border: "1px solid rgba(147,197,253,0.25)",
              borderRadius: 999,
              padding: "10px 14px",
            }}
          >
            Voltar à Home
          </Link>

          <Link
            href="/explorar"
            style={{
              color: "#86efac",
              textDecoration: "none",
              border: "1px solid rgba(134,239,172,0.25)",
              borderRadius: 999,
              padding: "10px 14px",
            }}
          >
            Ir para Explorar
          </Link>

          <Link
            href="/chat"
            style={{
              color: "#facc15",
              textDecoration: "none",
              border: "1px solid rgba(250,204,21,0.25)",
              borderRadius: 999,
              padding: "10px 14px",
            }}
          >
            Criar nova imagem
          </Link>
        </div>

        <section
          style={{
            border: "1px solid rgba(148,163,184,0.18)",
            background: "rgba(15,23,42,0.72)",
            backdropFilter: "blur(10px)",
            borderRadius: 24,
            padding: 24,
            boxShadow: "0 20px 80px rgba(0,0,0,0.35)",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              padding: "8px 12px",
              borderRadius: 999,
              background: "rgba(34,197,94,0.14)",
              border: "1px solid rgba(34,197,94,0.25)",
              color: "#86efac",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: 0.3,
              marginBottom: 14,
            }}
          >
            Página pública da imagem
          </div>

          <h1 style={{ fontSize: 34, lineHeight: 1.1, margin: 0 }}>{prompt}</h1>

          <p
            style={{
              color: "#94a3b8",
              marginTop: 14,
              maxWidth: 860,
              fontSize: 16,
              lineHeight: 1.7,
            }}
          >
            Página individual da imagem gerada na Aurora IA. Estamos em constante
            atualização e pode haver momentos de instabilidade.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 14,
              marginTop: 18,
            }}
          >
            <div
              style={{
                borderRadius: 18,
                padding: 16,
                background: "rgba(2,6,23,0.45)",
                border: "1px solid rgba(148,163,184,0.14)",
              }}
            >
              <div style={{ fontSize: 12, color: "#94a3b8" }}>ID da imagem</div>
              <div style={{ fontWeight: 700, marginTop: 8, wordBreak: "break-all" }}>
                {image.id}
              </div>
            </div>

            <div
              style={{
                borderRadius: 18,
                padding: 16,
                background: "rgba(2,6,23,0.45)",
                border: "1px solid rgba(148,163,184,0.14)",
              }}
            >
              <div style={{ fontSize: 12, color: "#94a3b8" }}>Criado em</div>
              <div style={{ fontWeight: 700, marginTop: 8 }}>
                {createdAt || "-"}
              </div>
            </div>

            <div
              style={{
                borderRadius: 18,
                padding: 16,
                background: "rgba(2,6,23,0.45)",
                border: "1px solid rgba(148,163,184,0.14)",
              }}
            >
              <div style={{ fontSize: 12, color: "#94a3b8" }}>Contato</div>
              <div style={{ fontWeight: 700, marginTop: 8 }}>
                {ownerEmail || "Não informado"}
              </div>
            </div>
          </div>
        </section>

        <section
          style={{
            borderRadius: 24,
            padding: 24,
            background: "rgba(15,23,42,0.72)",
            border: "1px solid rgba(148,163,184,0.18)",
            boxShadow: "0 20px 80px rgba(0,0,0,0.35)",
          }}
        >
          <div
            style={{
              borderRadius: 20,
              overflow: "hidden",
              border: "1px solid rgba(148,163,184,0.16)",
              background: "rgba(2,6,23,0.45)",
            }}
          >
            <img
              src={imageUrl}
              alt={prompt}
              style={{
                width: "100%",
                height: "auto",
                display: "block",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              marginTop: 18,
            }}
          >
            <a
              href={imageUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                color: "#93c5fd",
                textDecoration: "none",
                border: "1px solid rgba(147,197,253,0.25)",
                borderRadius: 999,
                padding: "10px 14px",
              }}
            >
              Abrir imagem
            </a>

            <a
              href={`https://wa.me/?text=${encodeURIComponent(imageUrl)}`}
              target="_blank"
              rel="noreferrer"
              style={{
                color: "#86efac",
                textDecoration: "none",
                border: "1px solid rgba(134,239,172,0.25)",
                borderRadius: 999,
                padding: "10px 14px",
              }}
            >
              Compartilhar no WhatsApp
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}