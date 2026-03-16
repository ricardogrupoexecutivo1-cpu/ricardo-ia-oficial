import Link from "next/link";
import { buildPromptSeo } from "@/lib/prompt-seo";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

type ImageRecord = {
  id: string;
  prompt: string | null;
  created_at: string | null;
  is_public: boolean | null;
};

async function getTopPrompts() {
  const supabase = getSupabaseAdmin();

  const { data } = await supabase
    .from("images")
    .select("prompt, created_at, is_public")
    .eq("is_public", true)
    .not("prompt", "is", null)
    .order("created_at", { ascending: false })
    .limit(500);

  const map = new Map<string, number>();

  for (const item of data || []) {
    const seo = buildPromptSeo(item.prompt);
    const key = seo.slug;

    if (!map.has(key)) {
      map.set(key, 1);
    } else {
      map.set(key, map.get(key)! + 1);
    }
  }

  const sorted = Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 50);

  return sorted.map(([slug, count]) => ({
    slug,
    count,
  }));
}

export default async function ExplorePromptsPage() {
  const prompts = await getTopPrompts();

  return (
    <main style={{ maxWidth: 1000, margin: "0 auto", padding: "24px" }}>
      <div style={{ marginBottom: 28 }}>
        <p style={{ opacity: 0.7, marginBottom: 8 }}>Explorar • Aurora IA</p>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: 12 }}>
          Prompts mais populares
        </h1>
        <p style={{ opacity: 0.85, lineHeight: 1.6 }}>
          Descubra os prompts mais usados na Aurora IA e explore imagens geradas por outros usuários.
        </p>
      </div>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        {prompts.map((item) => (
          <Link
            key={item.slug}
            href={`/prompts/${item.slug}`}
            style={{
              display: "block",
              padding: "14px",
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.03)",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <p
              style={{
                fontSize: 14,
                marginBottom: 8,
                lineHeight: 1.4,
              }}
            >
              {item.slug.replace(/-/g, " ")}
            </p>

            <span style={{ fontSize: 12, opacity: 0.6 }}>
              {item.count} imagens
            </span>
          </Link>
        ))}
      </section>
    </main>
  );
}