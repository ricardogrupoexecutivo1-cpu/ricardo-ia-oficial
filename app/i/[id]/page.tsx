import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PublicImagePage({ params }: PageProps) {
  const { id } = await params;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#0b1020",
          color: "#fff",
          padding: 24,
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          Erro de configuração do ambiente.
        </div>
      </main>
    );
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

  const { data: image } = await supabase
    .from("images")
    .select("id, prompt, image_url, created_at, is_public")
    .eq("id", id)
    .maybeSingle();

  if (!image || image.is_public === false) {
    notFound();
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at center,#12213e 0%,#070c1b 45%,#02040a 100%)",
        color: "#fff",
        padding: 24,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <div style={{ marginBottom: 20 }}>
          <Link href="/" style={{ color: "#9ecbff", textDecoration: "none" }}>
            ← Voltar para Aurora IA
          </Link>
        </div>

        <section
          style={{
            background: "rgba(18,26,51,0.9)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 20,
            padding: 20,
            boxShadow: "0 0 40px rgba(0,0,0,0.25)",
          }}
        >
          <p
            style={{
              marginTop: 0,
              marginBottom: 10,
              color: "#79d8ff",
              fontWeight: 700,
              letterSpacing: 0.4,
            }}
          >
            AURORA IA
          </p>

          <h1 style={{ marginTop: 0, fontSize: 34, lineHeight: 1.15 }}>
            Imagem pública criada com a Aurora IA
          </h1>

          <p
            style={{
              color: "#c9d4ff",
              lineHeight: 1.6,
              fontSize: 17,
            }}
          >
            {image.prompt || "Imagem criada na plataforma Aurora IA."}
          </p>

          <div style={{ marginTop: 20, marginBottom: 20 }}>
            <img
              src={image.image_url || ""}
              alt={image.prompt || "Imagem pública da Aurora IA"}
              style={{
                width: "100%",
                maxWidth: 900,
                height: "auto",
                display: "block",
                borderRadius: 18,
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            />
          </div>

          <p
            style={{
              color: "#97a6d8",
              fontSize: 14,
              marginBottom: 18,
            }}
          >
            {image.created_at
              ? new Date(image.created_at).toLocaleString("pt-BR")
              : "Data não disponível"}
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link
              href="/chat"
              style={{
                padding: "12px 18px",
                borderRadius: 12,
                textDecoration: "none",
                background: "#2b7fff",
                color: "#fff",
                fontWeight: 700,
              }}
            >
              Criar a sua
            </Link>

            <a
              href={image.image_url || "#"}
              target="_blank"
              rel="noreferrer"
              style={{
                padding: "12px 18px",
                borderRadius: 12,
                textDecoration: "none",
                background: "#16203d",
                color: "#fff",
                border: "1px solid #2b3558",
              }}
            >
              Abrir imagem original
            </a>

            <Link
              href="/explorar"
              style={{
                padding: "12px 18px",
                borderRadius: 12,
                textDecoration: "none",
                background: "#16203d",
                color: "#fff",
                border: "1px solid #2b3558",
              }}
            >
              Ver imagens públicas
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}