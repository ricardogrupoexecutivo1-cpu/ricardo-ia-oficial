import Image from "next/image";
import Link from "next/link";
import { buildPromptSeo } from "@/lib/prompt-seo";
import { CATEGORY_RULES } from "@/lib/seo";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

async function getFeaturedPrompts() {
  try {
    const supabase = getSupabaseAdmin();

    const { data } = await supabase
      .from("images")
      .select("prompt, image_url, created_at, is_public")
      .eq("is_public", true)
      .not("prompt", "is", null)
      .not("image_url", "is", null)
      .order("created_at", { ascending: false })
      .limit(500);

    const promptMap = new Map<
      string,
      {
        slug: string;
        label: string;
        count: number;
        imageUrl: string | null;
      }
    >();

    for (const item of data || []) {
      const seo = buildPromptSeo(item.prompt);
      const key = seo.slug;
      const label = seo.slug.replace(/-/g, " ");

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
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const featuredPrompts = await getFeaturedPrompts();

  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: "24px" }}>
      <section style={{ marginBottom: 28 }}>
        <p style={{ opacity: 0.7, marginBottom: 8 }}>Aurora IA</p>
        <h1 style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: 12 }}>
          Converse, gere imagens e explore páginas públicas com SEO automático
        </h1>
        <p style={{ lineHeight: 1.7, opacity: 0.88, maxWidth: 820 }}>
          A Aurora IA agora organiza imagens públicas por categoria, por prompt e
          fortalece links internos para crescer organicamente no Google.
        </p>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: 12 }}>
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
              }}
            >
              {category.name}
            </Link>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: 12 }}>
          Explorar conteúdos
        </h2>

        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          <Link
            href="/chat"
            style={{
              padding: "12px 16px",
              borderRadius: 12,
              textDecoration: "none",
              color: "inherit",
              border: "1px solid rgba(255,255,255,0.14)",
            }}
          >
            Abrir chat
          </Link>

          <Link
            href="/explorar"
            style={{
              padding: "12px 16px",
              borderRadius: 12,
              textDecoration: "none",
              color: "inherit",
              border: "1px solid rgba(255,255,255,0.14)",
            }}
          >
            Ver galeria pública
          </Link>

          <Link
            href="/explorar/prompts"
            style={{
              padding: "12px 16px",
              borderRadius: 12,
              textDecoration: "none",
              color: "inherit",
              border: "1px solid rgba(255,255,255,0.14)",
            }}
          >
            Ver prompts populares
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
            marginBottom: 14,
          }}
        >
          <h2 style={{ fontSize: "1.2rem", fontWeight: 700, margin: 0 }}>
            Prompts em destaque
          </h2>

          <Link
            href="/explorar/prompts"
            style={{
              textDecoration: "none",
              color: "inherit",
              opacity: 0.8,
            }}
          >
            Ver todos →
          </Link>
        </div>

        {featuredPrompts.length === 0 ? (
          <div
            style={{
              padding: 18,
              borderRadius: 16,
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
              gap: 16,
            }}
          >
            {featuredPrompts.map((item) => (
              <Link
                key={item.slug}
                href={`/prompts/${item.slug}`}
                style={{
                  display: "block",
                  borderRadius: 18,
                  overflow: "hidden",
                  textDecoration: "none",
                  color: "inherit",
                  border: "1px solid rgba(255,255,255,0.1)",
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
                      lineHeight: 1.5,
                      fontSize: 14,
                    }}
                  >
                    {item.label}
                  </p>

                  <span style={{ fontSize: 12, opacity: 0.65 }}>
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