import { createClient } from "@supabase/supabase-js";

export default async function sitemap() {

  const baseUrl = "https://ricardoiaoficial.com";

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: images } = await supabase
    .from("images")
    .select("id,created_at")
    .eq("is_public", true)
    .limit(5000);

  const imagePages = (images || []).map((img) => ({
    url: `${baseUrl}/i/${img.id}`,
    lastModified: img.created_at,
  }));

  return [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/chat`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/explorar`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/planilha`,
      lastModified: new Date(),
    },
    ...imagePages,
  ];
}