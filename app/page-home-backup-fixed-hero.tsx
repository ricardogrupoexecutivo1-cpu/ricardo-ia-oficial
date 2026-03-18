import Image from "next/image";
import Link from "next/link";
import { buildPromptSeo } from "@/lib/prompt-seo";
import { CATEGORY_RULES } from "@/lib/seo";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

type HomeImageRecord = {
  id: string;
  prompt: string | null;
  image_url: string | null;
  created_at: string | null;
  is_public: boolean | null;
};

type FeaturedPrompt = {
  slug: string;
  label: string;
  count: number;
  imageUrl: string | null;
};

async function getHomeImages(): Promise<HomeImageRecord[]> {
  try {
    const supabase = getSupabaseAdmin();

    const { data } = await supabase
      .from("images")
      .select("id, prompt, image_url, created_at, is_public")
      .eq("is_public", true)
      .not("image_url", "is", null)
      .order("created_at", { ascending: false })
      .limit(500);

    return data || [];
  } catch {
    return [];
  }
}

function findBestHeroImage(images: HomeImageRecord[]) {
  const preferred = images.find((item) => {
    const prompt = (item.prompt || "").toLowerCase();

    return (
      prompt.includes("robô futurista branco") ||
      prompt.includes("robo futurista branco") ||
      prompt.includes("robô amigável") ||
      prompt.includes("robo amigavel") ||
      prompt.includes("aurora ia")
    );
  });

  return preferred?.image_url || images[0]?.image_url || null;
}

function buildFeaturedPrompts(images: HomeImageRecord[]): FeaturedPrompt[] {
  const promptMap = new Map<string, FeaturedPrompt>();

  for (const item of images) {
    const seo = buildPromptSeo(item.prompt);
    const key = seo.slug;
    const label = key.replace(/-/g, " ");

    if (!promptMap.has(key)) {
      promptMap.set(key, {
        slug: key,
        label,
        count: 1,
        imageUrl: item.image_url || null,
      });
    } else {
      const current = promptMap.get(key)!;
      promptMap.set(key, {
        ...current,
        count: current.count + 1,
        imageUrl: current.imageUrl || item.image_url || null,
      });
    }
  }

  return Array.from(promptMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
}

export default async function HomePage() {
  const images = await getHomeImages();
  const heroImageUrl = findBestHeroImage(images);
  const featuredPrompts = buildFeaturedPrompts(images);

  return (
    <main style={{ maxWidth: 1240, margin: "0 auto", padding: "24px" }}>
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 28,
          alignItems: "center",
          marginBottom: 40,
          padding: "28px",
          borderRadius: 28,
          background:
            "linear-gradient(135deg, rgba(124,58,237,0.18), rgba(30,41,59,0.96))",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.22)",
        }}
      >
        <div>
          <p
            style={{
              opacity: 0.75,
              margin: 0,
              marginBottom: 10,
              fontSize: 14,
              letterSpacing: 0.6,
            }}
          >
            AURORA IA
          </p>

          <h1
            style={{
              fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
              fontWeight: 900,
              lineHeight: 1.05,
              margin: 0,
              marginBottom: 18,
            }}
          >
            Converse, gere imagens e crie com inteligência artificial
          </h1>

          <p
            style={{
              fontSize: 17,
              lineHeight: 1.75,
              opacity: 0.9,
              margin: 0,
              marginBottom: 22,
              maxWidth: 640,
            }}
          >
            A Aurora IA une geração de imagens, páginas públicas, prompts
            inteligentes e estrutura pronta para crescer no Google.
          </p>

          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              marginBottom: 16,
            }}
          >
            <Link
              href="/chat"
              style={{
                padding: "14px 20px",
                borderRadius: 14,
                background: "#7c3aed",
                color: "#fff",
                textDecoration: "none",
                fontWeight: 800,
                boxShadow: "0 12px 30px rgba(124,58,237,0.35)",
              }}
            >
              Abrir chat
            </Link>

            <Link
              href="/planos"
              style={{
                padding: "14px 20px",
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.18)",
                textDecoration: "none",
                color: "inherit",
                fontWeight: 700,
                background: "rgba(255,255,255,0.04)",
              }}
            >
              Ver planos
            </Link>

            <Link
              href="/explorar/prompts"
              style={{
                padding: "14px 20px",
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.18)",
                textDecoration: "none",
                color: "inherit",
                fontWeight: 700,
                background: "rgba(255,255,255,0.04)",
              }}
            >
              Prompts populares
            </Link>
          </div>

          <p style={{ margin: 0, opacity: 0.72, fontSize: 14 }}>
            Plataforma em evolução: imagens, campanhas, prompts públicos e SEO automático.
          </p>
        </div>

        <div
          style={{
            position: "relative",
            minHeight: 520,
            borderRadius: 24,
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.08)",
            background:
              "radial-gradient(circle at top, rgba(255,255,255,0.12), rgba(124,58,237,0.16), rgba(15,23,42,0.98))",
            boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
          }}
        >
          {heroImageUrl ? (
            <Image
              src={heroImageUrl}
              alt="Aurora IA"
              fill
              sizes="(max-width: 768px) 100vw, 560px"
              style={{ objectFit: "cover" }}
              priority
            />
          ) : (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 28,
                textAlign: "center",
              }}
            >
              <div>
                <div style={{ fontSize: 120, lineHeight: 1, marginBottom: 16 }}>🤖</div>
                <h2
                  style={{
                    margin: 0,
                    marginBottom: 12,
                    fontSize: "1.8rem",
                    fontWeight: 800,
                  }}
                >
                  Aurora IA
                </h2>
                <p
                  style={{
                    margin: 0,
                    opacity: 0.82,
                    lineHeight: 1.7,
                    maxWidth: 420,
                  }}
                >
                  Em breve aqui entra o robô futurista branco definitivo da Aurora.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      <section style={{ marginBottom: 34 }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: 14 }}>
          Explorar categorias
        </h2>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          {CATEGORY_RULES.map((category) => (
            <Link
              key={category.slug}
              href={`/categorias/${category.slug}`}
              style={{
                padding: "10px 14px",
                borderRadius: 999,
                textDecoration: "none",
                color: "inherit",
                border: "1px solid rgba(255,255,255,0.14)",
                background: "rgba(255,255,255,0.03)",
                fontWeight: 600,
              }}
            >
              {category.name}
            </Link>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: 34 }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: 14 }}>
          Explorar conteúdos
        </h2>

        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          <Link
            href="/chat"
            style={{
              padding: "12px 16px",
              borderRadius: 14,
              textDecoration: "none",
              color: "inherit",
              border: "1px solid rgba(255,255,255,0.14)",
              background: "rgba(255,255,255,0.03)",
              fontWeight: 600,
            }}
          >
            Abrir chat
          </Link>

          <Link
            href="/explorar"
            style={{
              padding: "12px 16px",
              borderRadius: 14,
              textDecoration: "none",
              color: "inherit",
              border: "1px solid rgba(255,255,255,0.14)",
              background: "rgba(255,255,255,0.03)",
              fontWeight: 600,
            }}
          >
            Ver galeria pública
          </Link>

          <Link
            href="/explorar/prompts"
            style={{
              padding: "12px 16px",
              borderRadius: 14,
              textDecoration: "none",
              color: "inherit",
              border: "1px solid rgba(255,255,255,0.14)",
              background: "rgba(255,255,255,0.03)",
              fontWeight: 600,
            }}
          >
            Ver prompts populares
          </Link>

          <Link
            href="/planos"
            style={{
              padding: "12px 16px",
              borderRadius: 14,
              textDecoration: "none",
              color: "inherit",
              border: "1px solid rgba(255,255,255,0.14)",
              background: "rgba(255,255,255,0.03)",
              fontWeight: 600,
            }}
          >
            Ver planos
          </Link>
        </div>
      </section>

      <section style={{ marginBottom: 32 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
            marginBottom: 16,
          }}
        >
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0 }}>
            Prompts em destaque
          </h2>

          <Link
            href="/explorar/prompts"
            style={{
              textDecoration: "none",
              color: "inherit",
              opacity: 0.84,
              fontWeight: 600,
            }}
          >
            Ver todos →
          </Link>
        </div>

        {featuredPrompts.length === 0 ? (
          <div
            style={{
              padding: 18,
              borderRadius: 18,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.03)",
            }}
          >
            Ainda não há prompts em destaque disponíveis.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 18,
            }}
          >
            {featuredPrompts.map((item) => (
              <Link
                key={item.slug}
                href={`/prompts/${item.slug}`}
                style={{
                  display: "block",
                  borderRadius: 20,
                  overflow: "hidden",
                  textDecoration: "none",
                  color: "inherit",
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.03)",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "1 / 1",
                    background:
                      "linear-gradient(135deg, rgba(124,58,237,0.22), rgba(15,23,42,0.96))",
                  }}
                >
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, 320px"
                      style={{ objectFit: "cover" }}
                    />
                  ) : null}
                </div>

                <div style={{ padding: 16 }}>
                  <p
                    style={{
                      margin: 0,
                      marginBottom: 10,
                      lineHeight: 1.55,
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    {item.label}
                  </p>

                  <span style={{ fontSize: 12, opacity: 0.68 }}>
                    {item.count} imagens relacionadas
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}