import { normalizeText } from "@/lib/seo";

type GalleryItem = {
  id: string;
  prompt: string | null;
  image_url: string | null;
  created_at: string | null;
};

function normalizePromptKey(prompt: string | null | undefined) {
  const safe = normalizeText(prompt || "");

  if (!safe) return "sem-prompt";

  return safe
    .replace(/\s+/g, " ")
    .trim();
}

export function dedupeGalleryItems<T extends GalleryItem>(items: T[]) {
  const map = new Map<string, T>();

  for (const item of items) {
    const key = normalizePromptKey(item.prompt);

    if (!map.has(key)) {
      map.set(key, item);
      continue;
    }

    const existing = map.get(key)!;

    const existingDate = existing.created_at ? new Date(existing.created_at).getTime() : 0;
    const currentDate = item.created_at ? new Date(item.created_at).getTime() : 0;

    if (currentDate > existingDate) {
      map.set(key, item);
    }
  }

  return Array.from(map.values());
}