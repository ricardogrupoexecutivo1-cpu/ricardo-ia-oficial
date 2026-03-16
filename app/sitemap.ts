import type { MetadataRoute } from "next";
import { buildPromptSeo } from "@/lib/prompt-seo";
import { CATEGORY_RULES } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/explorar`,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/planos`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = CATEGORY_RULES.map((category) => ({
    url: `${SITE_URL}/categorias/${category.slug}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  let imageRoutes: MetadataRoute.Sitemap = [];
  let promptRoutes: MetadataRoute.Sitemap = [];

  try {
    const supabase = getSupabaseAdmin();

    const { data } = await supabase
      .from("images")
      .select("id, prompt, created_at, is_public")
      .eq("is_public", true)
      .order("created_at", { ascending: false })
      .limit(5000);

    imageRoutes =
      data?.map((item) => ({
        url: `${SITE_URL}/i/${item.id}`,
        lastModified: item.created_at ? new Date(item.created_at) : now,
        changeFrequency: "weekly",
        priority: 0.8,
      })) || [];

    const promptMap = new Map<string, Date>();

    for (const item of data || []) {
      const promptSeo = buildPromptSeo(item.prompt);
      const dateValue = item.created_at ? new Date(item.created_at) : now;

      if (!promptMap.has(promptSeo.slug)) {
        promptMap.set(promptSeo.slug, dateValue);
      }
    }

    promptRoutes = Array.from(promptMap.entries()).map(([slug, lastModified]) => ({
      url: `${SITE_URL}/prompts/${slug}`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.75,
    }));
  } catch {
    imageRoutes = [];
    promptRoutes = [];
  }

  return [...staticRoutes, ...categoryRoutes, ...promptRoutes, ...imageRoutes];
}