export type SeoAnalysis = {
  categories: string[];
  keywords: string[];
  title: string;
  description: string;
};

type CategoryRule = {
  name: string;
  slug: string;
  match: RegExp[];
};

const STOPWORDS = new Set([
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
  "the",
  "and",
  "of",
  "to",
  "in",
  "on",
  "at",
  "an",
  "is",
  "are",
  "image",
  "imagem",
  "crie",
  "gere",
  "criar",
  "gerar",
  "faça",
  "faca",
  "uma",
  "de",
  "um",
  "ai",
  "ia",
]);

export const CATEGORY_RULES: CategoryRule[] = [
  {
    name: "Futurista",
    slug: "futurista",
    match: [/futur/i, /cyberpunk/i, /neon/i, /rob[oô]t/i, /tecnolog/i, /\bia\b/i],
  },
  {
    name: "Cidades",
    slug: "cidades",
    match: [/cidade/i, /dubai/i, /nova york/i, /new york/i, /tokyo/i, /s[aã]o paulo/i, /metropole/i],
  },
  {
    name: "Negócios",
    slug: "negocios",
    match: [/neg[oó]cio/i, /empresa/i, /marketing/i, /campanha/i, /marca/i, /logo/i],
  },
  {
    name: "Personagens",
    slug: "personagens",
    match: [/personagem/i, /hero/i, /mulher/i, /homem/i, /garota/i, /rosto/i, /avatar/i],
  },
  {
    name: "Natureza",
    slug: "natureza",
    match: [/natureza/i, /floresta/i, /mar/i, /montanha/i, /praia/i, /rio/i],
  },
  {
    name: "Luxo",
    slug: "luxo",
    match: [/luxo/i, /premium/i, /elegante/i, /sofisticad/i, /gold/i, /ouro/i],
  },
  {
    name: "Religioso",
    slug: "religioso",
    match: [/jesus/i, /igreja/i, /anjo/i, /b[íi]blia/i, /cruz/i],
  },
  {
    name: "Arte Digital",
    slug: "arte-digital",
    match: [/arte/i, /digital/i, /3d/i, /realista/i, /ilustra/i, /cinematogr/i],
  },
];

export function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function slugify(value: string) {
  return normalizeText(value).replace(/\s+/g, "-");
}

export function unslugify(value: string) {
  return value
    .split("-")
    .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : ""))
    .join(" ");
}

function extractKeywords(prompt: string, max = 12) {
  const words = normalizeText(prompt)
    .split(" ")
    .map((w) => w.trim())
    .filter((w) => w.length >= 3 && !STOPWORDS.has(w));

  const unique: string[] = [];

  for (const word of words) {
    if (!unique.includes(word)) unique.push(word);
    if (unique.length >= max) break;
  }

  return unique;
}

export function detectCategoryRules(prompt: string) {
  const safePrompt = prompt || "";

  const found = CATEGORY_RULES.filter((rule) =>
    rule.match.some((regex) => regex.test(safePrompt))
  );

  return found.length
    ? found
    : [CATEGORY_RULES.find((item) => item.slug === "arte-digital")!];
}

function buildTitle(prompt: string, categories: string[]) {
  const promptShort =
    prompt.trim().length > 58 ? `${prompt.trim().slice(0, 58)}...` : prompt.trim();

  return `${promptShort} | ${categories[0]} | Aurora IA`;
}

function buildDescription(prompt: string, categories: string[], keywords: string[]) {
  const base =
    `Imagem gerada na Aurora IA com foco em ${categories.join(", ")}.` +
    ` Prompt: ${prompt.trim()}.`;
  const tags = keywords.length ? ` Palavras-chave: ${keywords.join(", ")}.` : "";
  const finalText = `${base}${tags}`;

  return finalText.length > 155 ? `${finalText.slice(0, 152)}...` : finalText;
}

export function analyzePromptForSeo(prompt: string | null | undefined): SeoAnalysis {
  const safePrompt = (prompt || "Imagem criada com inteligência artificial").trim();
  const matchedRules = detectCategoryRules(safePrompt);
  const categories = matchedRules.map((item) => item.name);
  const keywords = extractKeywords(safePrompt);
  const title = buildTitle(safePrompt, categories);
  const description = buildDescription(safePrompt, categories, keywords);

  return {
    categories,
    keywords,
    title,
    description,
  };
}

export function getCategoryBySlug(slug: string) {
  return CATEGORY_RULES.find((item) => item.slug === slug) || null;
}

export function getCategoryLinksFromPrompt(prompt: string | null | undefined) {
  const safePrompt = (prompt || "").trim();
  const matchedRules = detectCategoryRules(safePrompt);

  return matchedRules.map((item) => ({
    name: item.name,
    slug: item.slug,
    href: `/categorias/${item.slug}`,
  }));
}

export function promptMatchesCategory(prompt: string | null | undefined, slug: string) {
  const safePrompt = (prompt || "").trim();
  const category = getCategoryBySlug(slug);

  if (!category) return false;

  return category.match.some((regex) => regex.test(safePrompt));
}