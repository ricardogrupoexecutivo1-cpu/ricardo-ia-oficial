import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type OpenAIImageResponse = {
  created?: number;
  data?: Array<{
    url?: string;
    b64_json?: string;
  }>;
  error?: {
    message?: string;
  };
};

type ImageRequestBody = {
  prompt?: string;
  email?: string;
};

async function readJsonBody(req: NextRequest) {
  const raw = await req.text();

  if (!raw || !raw.trim()) {
    throw new Error("Body vazio na requisição.");
  }

  try {
    return JSON.parse(raw) as ImageRequestBody;
  } catch {
    throw new Error(`JSON inválido na requisição: ${raw}`);
  }
}

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Variáveis do Supabase não configuradas. Verifique NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  return createClient(supabaseUrl, serviceRoleKey);
}

function getStorageBucketName() {
  return process.env.SUPABASE_STORAGE_BUCKET?.trim() || "images";
}

function sanitizeFilePart(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function normalizeSpaces(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function containsAny(text: string, items: string[]) {
  const value = text.toLowerCase();
  return items.some((item) => value.includes(item));
}

function inferVisualMode(userPrompt: string) {
  const prompt = userPrompt.toLowerCase();

  if (
    containsAny(prompt, [
      "instagram",
      "anúncio",
      "anuncio",
      "campanha",
      "propaganda",
      "venda",
      "tráfego",
      "trafego",
      "marketing",
      "story",
      "stories",
      "feed",
      "banner",
      "criativo",
      "publicidade",
    ])
  ) {
    return "ad";
  }

  if (
    containsAny(prompt, [
      "logo",
      "logomarca",
      "marca",
      "identidade visual",
      "brand",
    ])
  ) {
    return "brand";
  }

  if (
    containsAny(prompt, [
      "realista",
      "fotorealista",
      "foto",
      "photorealistic",
      "cinematográfico",
      "cinematografico",
    ])
  ) {
    return "realistic";
  }

  return "premium";
}

function buildEnhancedPrompt(userPrompt: string) {
  const cleanPrompt = normalizeSpaces(userPrompt);
  const mode = inferVisualMode(cleanPrompt);

  const base = [
    "Criar uma imagem extremamente bonita, premium, impactante e memorável.",
    "Visual com alto nível de direção de arte, composição forte e acabamento profissional.",
    "Imagem com contraste elegante, profundidade, iluminação cinematográfica, definição alta e visual que prenda atenção imediatamente.",
    "Evitar resultado genérico, sem aparência amadora, sem visual lavado, sem composição fraca.",
    "Priorizar beleza visual, desejo, impacto, sofisticação e percepção de alto valor.",
  ];

  const premiumLook = [
    "Estética premium contemporânea.",
    "Luzes volumétricas sutis, reflexos elegantes, brilho controlado e riqueza de detalhes.",
    "Paleta visual forte, moderna e comercialmente atrativa.",
    "Composição central muito bem resolvida, com sensação de produto de alto nível.",
  ];

  const adMode = [
    "A imagem deve ter força publicitária e aparência de campanha de alto impacto.",
    "Deve parecer peça de marca premium feita para chamar clique e conversão.",
    "Transmitir desejo, inovação, modernidade e autoridade.",
    "Visual pensado para anúncios, redes sociais e campanhas pagas.",
  ];

  const brandMode = [
    "A imagem deve reforçar identidade visual premium e percepção de marca forte.",
    "Visual limpo, sofisticado, elegante e memorável.",
    "A composição deve funcionar bem para branding e presença digital.",
  ];

  const realisticMode = [
    "Fotorealismo refinado, com textura natural, iluminação cinematográfica e acabamento de campanha premium.",
    "Pele, materiais, ambiente e profundidade com aparência real e elegante.",
  ];

  const premiumMode = [
    "Visual futurista premium, refinado, sofisticado e altamente atraente.",
    "A composição deve causar espanto positivo e vontade de continuar vendo mais.",
  ];

  const finish = [
    "Alta resolução, muitos detalhes, nitidez premium, aspecto polido e profissional.",
    "Sem texto embutido na imagem, salvo se o usuário pedir explicitamente.",
    `Pedido do usuário: ${cleanPrompt}`,
  ];

  const blocks = [...base, ...premiumLook];

  if (mode === "ad") {
    blocks.push(...adMode);
  } else if (mode === "brand") {
    blocks.push(...brandMode);
  } else if (mode === "realistic") {
    blocks.push(...realisticMode);
  } else {
    blocks.push(...premiumMode);
  }

  blocks.push(...finish);

  return blocks.join(" ");
}

async function downloadImageAsBuffer(imageUrl: string) {
  console.log("BAIXANDO IMAGEM DA URL DA OPENAI...");
  const response = await fetch(imageUrl);

  console.log("DOWNLOAD STATUS:", response.status);

  if (!response.ok) {
    throw new Error(
      `Não foi possível baixar a imagem retornada pela OpenAI. Status ${response.status}.`
    );
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function insertImageRecord(params: {
  prompt: string;
  imageUrl: string;
  email: string;
}) {
  const supabase = getSupabaseAdmin();

  const attempts = [
    {
      label: "prompt,image_url,email",
      payload: {
        prompt: params.prompt,
        image_url: params.imageUrl,
        email: params.email || null,
      },
    },
    {
      label: "prompt,image_url,user_email",
      payload: {
        prompt: params.prompt,
        image_url: params.imageUrl,
        user_email: params.email || null,
      },
    },
    {
      label: "prompt,image_url",
      payload: {
        prompt: params.prompt,
        image_url: params.imageUrl,
      },
    },
  ];

  let lastError: string | null = null;

  for (const attempt of attempts) {
    console.log("TENTANDO INSERT:", attempt.label);

    const result = await supabase
      .from("images")
      .insert(attempt.payload)
      .select("id")
      .single();

    if (!result.error && result.data?.id) {
      console.log("INSERT OK:", attempt.label, result.data.id);
      return {
        id: String(result.data.id),
        error: null,
      };
    }

    lastError = result.error?.message || "Erro desconhecido ao inserir imagem.";
    console.log("INSERT FALHOU:", attempt.label, lastError);
  }

  return {
    id: null,
    error: lastError,
  };
}

export async function POST(req: NextRequest) {
  try {
    console.log("API IMAGE CHAMADA");

    const body = await readJsonBody(req);
    const prompt = typeof body?.prompt === "string" ? body.prompt.trim() : "";
    const email =
      typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

    console.log("BODY OK:", { prompt, email });

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt não enviado." },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      console.log("FALTA OPENAI_API_KEY");
      return NextResponse.json(
        { error: "OPENAI_API_KEY não configurada." },
        { status: 500 }
      );
    }

    const enhancedPrompt = buildEnhancedPrompt(prompt);

    console.log("PROMPT ORIGINAL:", prompt);
    console.log("PROMPT MELHORADO:", enhancedPrompt);

    console.log("OPENAI_API_KEY OK");
    console.log(
      "NEXT_PUBLIC_SUPABASE_URL OK:",
      Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL)
    );
    console.log(
      "SUPABASE_SERVICE_ROLE_KEY OK:",
      Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)
    );
    console.log("SUPABASE_STORAGE_BUCKET:", getStorageBucketName());
    console.log(
      "NEXT_PUBLIC_SITE_URL:",
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    );

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";

    console.log("CHAMANDO OPENAI IMAGES...");
    const openAiResponse = await fetch(
      "https://api.openai.com/v1/images/generations",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-image-1",
          prompt: enhancedPrompt,
          size: "1024x1024",
          quality: "high",
        }),
      }
    );

    console.log("OPENAI STATUS:", openAiResponse.status);

    const openAiText = await openAiResponse.text();
    console.log("OPENAI RAW TEXT RECEBIDO");

    let openAiData: OpenAIImageResponse;
    try {
      openAiData = JSON.parse(openAiText) as OpenAIImageResponse;
    } catch {
      console.log("ERRO PARSE OPENAI:", openAiText);
      return NextResponse.json(
        { error: "Resposta inválida da OpenAI." },
        { status: 500 }
      );
    }

    console.log("RESPOSTA OPENAI IMAGE:", {
      ok: openAiResponse.ok,
      status: openAiResponse.status,
      hasUrl: Boolean(openAiData?.data?.[0]?.url),
      hasB64: Boolean(openAiData?.data?.[0]?.b64_json),
      error: openAiData?.error?.message || null,
    });

    if (!openAiResponse.ok) {
      return NextResponse.json(
        {
          error:
            openAiData?.error?.message || "Erro ao gerar imagem na OpenAI.",
        },
        { status: 500 }
      );
    }

    const firstImage = openAiData?.data?.[0];
    const imageUrlFromApi = firstImage?.url;
    const imageBase64 = firstImage?.b64_json;

    let buffer: Buffer | null = null;

    if (typeof imageBase64 === "string" && imageBase64.trim()) {
      console.log("USANDO B64 DA OPENAI");
      buffer = Buffer.from(imageBase64, "base64");
    } else if (typeof imageUrlFromApi === "string" && imageUrlFromApi.trim()) {
      console.log("USANDO URL DA OPENAI");
      buffer = await downloadImageAsBuffer(imageUrlFromApi);
    } else {
      console.log("OPENAI NÃO RETORNOU URL NEM B64");
    }

    if (!buffer) {
      return NextResponse.json(
        { error: "Imagem não retornada pela API." },
        { status: 500 }
      );
    }

    console.log("BUFFER OK:", buffer.length);

    const supabase = getSupabaseAdmin();
    const bucketName = getStorageBucketName();

    const safeEmailPart = email ? sanitizeFilePart(email) : "anon";
    const safePromptPart = sanitizeFilePart(prompt) || "imagem";
    const fileId = crypto.randomUUID();
    const fileName = `${safeEmailPart}/${Date.now()}-${safePromptPart}-${fileId}.png`;

    console.log("UPLOAD STORAGE BUCKET:", bucketName);
    console.log("UPLOAD STORAGE FILE:", fileName);

    const uploadResult = await supabase.storage
      .from(bucketName)
      .upload(fileName, buffer, {
        contentType: "image/png",
        upsert: false,
      });

    if (uploadResult.error) {
      console.log("ERRO STORAGE:", uploadResult.error.message);
      return NextResponse.json(
        { error: `Erro ao salvar no Storage: ${uploadResult.error.message}` },
        { status: 500 }
      );
    }

    console.log("UPLOAD STORAGE OK");

    const publicUrlResult = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    const publicImageUrl = publicUrlResult.data.publicUrl;

    console.log("PUBLIC URL:", publicImageUrl);

    if (!publicImageUrl) {
      return NextResponse.json(
        { error: "Não foi possível gerar a URL pública da imagem." },
        { status: 500 }
      );
    }

    const insertResult = await insertImageRecord({
      prompt,
      imageUrl: publicImageUrl,
      email,
    });

    let imagePageUrl: string | null = null;

    if (insertResult.id) {
      imagePageUrl = `${siteUrl}/i/${insertResult.id}`;
    } else {
      imagePageUrl = publicImageUrl;
      console.log("AVISO: salvou no storage, mas não registrou na tabela images.");
      console.log("ERRO BANCO:", insertResult.error);
    }

    console.log("RETORNANDO SUCESSO FINAL");

    return NextResponse.json({
      reply: insertResult.id
        ? "Imagem gerada e salva com sucesso."
        : "Imagem gerada e salva no storage, mas não entrou na galeria.",
      message: insertResult.id
        ? "Imagem gerada e salva com sucesso."
        : "Imagem gerada e salva no storage, mas não entrou na galeria.",
      imageUrl: publicImageUrl,
      imagePageUrl,
      savedToDatabase: Boolean(insertResult.id),
      databaseError: insertResult.error,
      originalPrompt: prompt,
      enhancedPrompt,
    });
  } catch (error) {
    console.log("ERRO IMAGE API:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erro interno ao gerar imagem.",
      },
      { status: 500 }
    );
  }
}