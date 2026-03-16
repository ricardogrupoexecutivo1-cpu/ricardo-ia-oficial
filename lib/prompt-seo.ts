import { normalizeText } from "@/lib/seo";

export type PromptSeoItem = {
  normalizedPrompt: string;
  slug: string;
  title: string;
  description: string;
};

const PROMPT_STOPWORDS = new Set([
  "a",
  "o",
  "e",
  "de",
  "da",
  "do",
  "das",
  "dos",
  "um",
  "uma",
  "uns",
  "umas",
  "para",
  "com",
  "sem",
  "por",
  "em",
  "no",
  "na",
  "nos",
  "nas",
  "que",
  "como",
  "mais",
  "menos",
  "muito",
  "muita",
  "muitos",
  "muitas",
  "me",
  "aurora",
  "agora",
  "porfavor",
  "por",
  "favor",
  "uma",
  "imagem",
  "crie",
  "gere",
  "criar",
  "gerar",
  "faça",
  "faca",
  "pra",
  "para",
  "mim",
]);

function cleanWords(prompt: string) {
  return normalizeText(prompt)
    .split(" ")
    .map((word) => word.trim())
    .filter((word) => word.length >= 3 && !PROMPT_STOPWORDS.has(word));
}

export function normalizePrompt(prompt: string | null | undefined) {
  const safePrompt = (prompt || "").trim();

  if (!safePrompt) {
    return "imagem-gerada-com-ia";
  }

  const words = cleanWords(safePrompt);
  const finalWords = words.length ? words : normalizeText(safePrompt).split(" ").filter(Boolean);

  return finalWords.slice(0, 8).join("-");
}

export function slugifyPrompt(prompt: string | null | undefined) {
  const normalized = normalizePrompt(prompt);
  return normalized || "imagem-gerada-com-ia";
}

export function buildPromptSeo(prompt: string | null | undefined): PromptSeoItem {
  const safePrompt = (prompt || "Imagem gerada com IA").trim();
  const slug = slugifyPrompt(safePrompt);

  const normalizedPrompt = normalizeText(safePrompt);
  const titleBase =
    safePrompt.length > 60 ? `${safePrompt.slice(0, 60)}...` : safePrompt;

  const title = `${titleBase} | Prompt | Aurora IA`;

  const rawDescription = `Veja imagens públicas criadas na Aurora IA a partir do prompt: ${safePrompt}. Explore resultados relacionados, páginas públicas e inspiração visual com inteligência artificial.`;

  const description =
    rawDescription.length > 160
      ? `${rawDescription.slice(0, 157)}...`
      : rawDescription;

  return {
    normalizedPrompt,
    slug,
    title,
    description,
  };
}

export function promptsLookSimilar(
  promptA: string | null | undefined,
  promptB: string | null | undefined
) {
  const a = normalizePrompt(promptA);
  const b = normalizePrompt(promptB);

  if (!a || !b) return false;
  if (a === b) return true;

  return a.includes(b) || b.includes(a);
}