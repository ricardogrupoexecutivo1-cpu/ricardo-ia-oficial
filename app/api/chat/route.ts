import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import crypto from "node:crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const generatedBucketName = "generated-campaigns";

function getLimitsByPlan(plan: string | null) {
  const normalized = (plan || "free").toLowerCase();

  if (normalized === "premium") {
    return {
      plan: "premium",
      messagesPerDay: -1,
      imagesPerDay: -1,
    };
  }

  if (normalized === "pro") {
    return {
      plan: "pro",
      messagesPerDay: -1,
      imagesPerDay: 100,
    };
  }

  if (normalized === "influencer") {
    return {
      plan: "influencer",
      messagesPerDay: 200,
      imagesPerDay: 50,
    };
  }

  return {
    plan: "free",
    messagesPerDay: -1,
    imagesPerDay: -1,
  };
}

function containsAny(text: string, terms: string[]) {
  const value = text.toLowerCase();
  return terms.some((term) => value.includes(term));
}

function isImageRequest(text: string) {
  return containsAny(text, [
    "crie uma imagem",
    "gere uma imagem",
    "criar imagem",
    "gerar imagem",
    "faça uma imagem",
    "faca uma imagem",
    "imagem de",
    "desenhe",
    "crie arte",
    "gere arte",
    "crie a arte",
    "gere a arte",
    "crie o criativo",
    "gere o criativo",
    "crie um criativo",
    "gere um criativo",
    "crie um banner",
    "gere um banner",
    "crie um story",
    "gere um story",
    "crie um post",
    "gere um post",
    "crie um anúncio",
    "gere um anúncio",
    "crie um anuncio",
    "gere um anuncio",
    "crie a imagem da campanha",
    "gere a imagem da campanha",
    "crie a imagem do anúncio",
    "gere a imagem do anúncio",
    "crie a imagem do anuncio",
    "gere a imagem do anuncio",
    "create an image",
    "generate an image",
    "image of",
    "banner",
    "story",
    "anúncio",
    "anuncio",
    "criativo",
  ]);
}

function wantsGeneratedCampaignImage(text: string) {
  return isImageRequest(text);
}

function startOfDayIso() {
  const now = new Date();
  const start = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0,
    0
  );
  return start.toISOString();
}

function buildReferenceContext(
  message: string,
  imageUrl: string | null,
  imageName: string | null
) {
  const cleanMessage = String(message || "").trim();
  const cleanImageUrl = String(imageUrl || "").trim();
  const cleanImageName = String(imageName || "").trim();

  if (!cleanImageUrl) {
    return cleanMessage;
  }

  return `
CONTEXTO VISUAL DO USUÁRIO:
- O usuário enviou uma imagem de referência para orientar a resposta.
- Nome do arquivo: ${cleanImageName || "imagem-enviada"}
- URL da imagem: ${cleanImageUrl}

REGRAS DE USO DA REFERÊNCIA:
- Considere essa imagem como o principal ativo visual do pedido.
- Ela pode representar produto, marca, logo, fachada, veículo, embalagem, peça publicitária ou identidade visual.
- Use essa referência para construir campanha, copy, headline, CTA, legenda, oferta, criativo e direção de arte.
- Não trave pedindo informações extras logo no início.
- Se faltarem detalhes, assuma contexto comercial útil e prático.
- Quando o pedido envolver campanha ou imagem, entregue também uma proposta clara de arte publicitária baseada nessa imagem.
- Não diga que você não consegue ver a imagem.
- Use a imagem como referência estratégica e visual para responder.

PEDIDO DO USUÁRIO:
${cleanMessage}
  `.trim();
}

function buildCampaignImagePrompt(params: {
  userMessage: string;
  assistantText: string;
  referenceImageName: string | null;
  hasReferenceImage: boolean;
}) {
  const userMessage = String(params.userMessage || "").trim();
  const assistantText = String(params.assistantText || "").trim();
  const referenceImageName = String(params.referenceImageName || "").trim();

  if (params.hasReferenceImage) {
    return `
Transforme a imagem enviada pelo usuário em uma ARTE PUBLICITÁRIA real e profissional.

Arquivo de referência:
${referenceImageName || "imagem-enviada"}

Pedido do usuário:
${userMessage}

Campanha criada pela Aurora:
${assistantText}

INSTRUÇÕES:
- USE A PRÓPRIA IMAGEM ENVIADA COMO BASE REAL DA PEÇA.
- Preserve o assunto principal da imagem.
- Melhore a apresentação visual para parecer anúncio premium.
- Adicione composição publicitária profissional.
- Deixe visual bonito, forte e comercial.
- Foco em Instagram, Facebook e anúncios.
- Formato quadrado 1:1.
- Headline forte e legível.
- CTA visível.
- Bom contraste.
- Sem poluição visual.
- Aparência de peça pronta para vender.

Se for gastronômico:
- destacar textura, calor, apetite, brilho e clima convidativo

Se for produto:
- destacar valor, presença, limpeza visual e sensação premium

Se for marca local:
- dar cara de campanha profissional regional
    `.trim();
  }

  return `
Crie uma imagem publicitária profissional com base no pedido abaixo.

Pedido do usuário:
${userMessage}

Direção criativa criada pela Aurora:
${assistantText}

INSTRUÇÕES:
- Gere uma imagem final pronta para campanha.
- Aparência premium, comercial e chamativa.
- Visual forte, bonito e limpo.
- Composição publicitária profissional.
- Boa iluminação e contraste.
- Sem texto excessivo.
- Sem marca d'água.
- Alta qualidade.
- Formato 1:1.
- Pode parecer anúncio real para redes sociais.
  `.trim();
}

async function downloadReferenceImageAsFile(
  imageUrl: string,
  fileName: string | null
) {
  const response = await fetch(imageUrl, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Não foi possível baixar a imagem de referência. Status ${response.status}.`
    );
  }

  const contentType = response.headers.get("content-type") || "image/png";
  const arrayBuffer = await response.arrayBuffer();
  const extension =
    contentType.includes("jpeg") || contentType.includes("jpg")
      ? "jpg"
      : contentType.includes("webp")
      ? "webp"
      : contentType.includes("heic")
      ? "heic"
      : contentType.includes("heif")
      ? "heif"
      : "png";

  const safeName =
    (fileName || "referencia")
      .replace(/[^a-zA-Z0-9.\-_]/g, "-")
      .replace(/-+/g, "-")
      .toLowerCase() || "referencia";

  const finalName = safeName.includes(".")
    ? safeName
    : `${safeName}.${extension}`;

  return new File([arrayBuffer], finalName, { type: contentType });
}

async function saveBase64ImageToSupabase(params: {
  base64Image: string;
  email: string;
  prompt: string;
}) {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY não configurada.");
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);
  const buffer = Buffer.from(params.base64Image, "base64");
  const filePath = `campaigns/${Date.now()}-${crypto.randomUUID()}.png`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from(generatedBucketName)
    .upload(filePath, buffer, {
      contentType: "image/png",
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Erro ao salvar imagem gerada: ${uploadError.message}`);
  }

  const {
    data: { publicUrl },
  } = supabaseAdmin.storage.from(generatedBucketName).getPublicUrl(filePath);

  if (!publicUrl) {
    throw new Error("Imagem gerada sem URL pública.");
  }

  const insertResult = await supabaseAdmin.from("generated_images").insert({
    user_email: params.email,
    image_url: publicUrl,
    prompt: params.prompt,
  });

  if (insertResult.error) {
    throw new Error(
      `Erro ao salvar registro da imagem gerada: ${insertResult.error.message}`
    );
  }

  return {
    publicUrl,
    filePath,
  };
}

export async function POST(req: NextRequest) {
  try {
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: "Supabase não configurado." },
        { status: 500 }
      );
    }

    if (!supabaseServiceRoleKey) {
      return NextResponse.json(
        { error: "SUPABASE_SERVICE_ROLE_KEY não configurada." },
        { status: 500 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY não configurada." },
        { status: 500 }
      );
    }

    const body = await req.json();

    const message = String(body?.message || "").trim();
    const email = String(body?.email || "").trim().toLowerCase();
    const referenceImageUrl = body?.referenceImageUrl
      ? String(body.referenceImageUrl).trim()
      : null;
    const referenceImageName = body?.referenceImageName
      ? String(body.referenceImageName).trim()
      : null;

    if (!message) {
      return NextResponse.json(
        { error: "Mensagem não informada." },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("plan, plan_status, plan_expires_at")
      .eq("email", email)
      .maybeSingle();

    if (profileError) {
      return NextResponse.json(
        { error: `Erro ao buscar perfil: ${profileError.message}` },
        { status: 500 }
      );
    }

    const plan = (profile?.plan || "free").toLowerCase();
    const planStatus = (profile?.plan_status || "inactive").toLowerCase();
    const expiresAt = profile?.plan_expires_at;

    const isActivePlan =
      plan !== "free" &&
      planStatus === "active" &&
      !!expiresAt &&
      new Date(expiresAt).getTime() > Date.now();

    const finalPlan = isActivePlan ? plan : "free";
    const limits = getLimitsByPlan(finalPlan);
    const startOfDay = startOfDayIso();

    const { count: messagesCount, error: messagesCountError } = await supabase
      .from("chat_messages")
      .select("id", { count: "exact", head: true })
      .eq("user_email", email)
      .gte("created_at", startOfDay);

    if (messagesCountError) {
      return NextResponse.json(
        { error: `Erro ao contar mensagens: ${messagesCountError.message}` },
        { status: 500 }
      );
    }

    const { count: imagesCount, error: imagesCountError } = await supabase
      .from("generated_images")
      .select("id", { count: "exact", head: true })
      .eq("user_email", email)
      .gte("created_at", startOfDay);

    if (imagesCountError) {
      return NextResponse.json(
        { error: `Erro ao contar imagens: ${imagesCountError.message}` },
        { status: 500 }
      );
    }

    const messagesUsed = Number(messagesCount || 0);
    const imagesUsed = Number(imagesCount || 0);

    if (limits.messagesPerDay >= 0 && messagesUsed >= limits.messagesPerDay) {
      return NextResponse.json(
        {
          error: "Limite de mensagens atingido hoje.",
          plan: finalPlan,
          messagesRemaining: 0,
          imagesRemaining:
            limits.imagesPerDay >= 0
              ? Math.max(limits.imagesPerDay - imagesUsed, 0)
              : -1,
        },
        { status: 200 }
      );
    }

    const imageRequested = wantsGeneratedCampaignImage(message);

    if (imageRequested && limits.imagesPerDay >= 0 && imagesUsed >= limits.imagesPerDay) {
      return NextResponse.json(
        {
          error: "Limite de imagens atingido hoje.",
          plan: finalPlan,
          messagesRemaining:
            limits.messagesPerDay >= 0
              ? Math.max(limits.messagesPerDay - messagesUsed, 0)
              : -1,
          imagesRemaining: 0,
        },
        { status: 200 }
      );
    }

    const enrichedMessage = buildReferenceContext(
      message,
      referenceImageUrl,
      referenceImageName
    );

    const completion = await openai.chat.completions.create({
      model: "gpt-5-mini",
      messages: [
        {
          role: "system",
          content: `
Você é a Aurora IA, especialista em marketing, vendas, campanhas, posicionamento, oferta, copy, criativos e direção de arte.

REGRAS CRÍTICAS:
- Sempre responda em português do Brasil.
- Seja prática, direta, comercial e útil.
- Não trave pedindo informações no início se já for possível ajudar.
- Sua função é executar.
- Quando o usuário pedir campanha, anúncio, legenda, copy, posicionamento, oferta, branding, roteiro ou criativo, entregue material pronto para uso.
- Quando o usuário pedir imagem, arte, banner, criativo ou peça visual, responda de forma curta e útil, porque a imagem será gerada automaticamente.

QUANDO EXISTIR IMAGEM DE REFERÊNCIA:
- Assuma que a imagem enviada é o ativo visual principal do pedido.
- Use essa referência para construir a campanha.
- Não peça confirmação como primeira ação.
- Não responda de forma genérica.
- Entregue campanha e proposta visual da peça publicitária.

SE O USUÁRIO PEDIR CAMPANHA:
ENTREGUE SEMPRE NESTA ESTRUTURA:
1. Nome da campanha
2. Headline forte
3. Texto principal do anúncio
4. CTA
5. Ideia visual baseada na imagem enviada
6. Arte publicitária sugerida
7. Estratégia básica de uso

SE O USUÁRIO PEDIR IMAGEM:
- Não entregue tutorial longo.
- Não jogue a geração para outra ferramenta.
- Entregue um texto curto de apoio para acompanhar a imagem.
          `.trim(),
        },
        {
          role: "user",
          content: enrichedMessage,
        },
      ],
    });

    let text =
      completion.choices[0]?.message?.content?.trim() || "Erro ao responder.";

    let generatedImageUrl: string | null = null;

    if (imageRequested) {
      const imagePrompt = buildCampaignImagePrompt({
        userMessage: message,
        assistantText: text,
        referenceImageName,
        hasReferenceImage: Boolean(referenceImageUrl),
      });

      let base64Image: string | null = null;

      if (referenceImageUrl) {
        const referenceFile = await downloadReferenceImageAsFile(
          referenceImageUrl,
          referenceImageName
        );

        const imageEditResponse = await openai.images.edit({
          model: "gpt-image-1",
          image: referenceFile,
          prompt: imagePrompt,
          size: "1024x1024",
        });

        base64Image = imageEditResponse.data?.[0]?.b64_json || null;
      } else {
        const imageGenResponse = await openai.images.generate({
          model: "gpt-image-1",
          prompt: imagePrompt,
          size: "1024x1024",
        });

        base64Image = imageGenResponse.data?.[0]?.b64_json || null;
      }

      if (base64Image) {
        const saved = await saveBase64ImageToSupabase({
          base64Image,
          email,
          prompt: imagePrompt,
        });

        generatedImageUrl = saved.publicUrl;
        console.log("IMAGE GERADA:", generatedImageUrl);

        if (!text || text.length < 8) {
          text = "Imagem gerada com sucesso. Aqui está sua criação visual.";
        }
      }
    }

    const insertUserResult = await supabase.from("chat_messages").insert({
      user_email: email,
      role: "user",
      content: message,
    });

    if (insertUserResult.error) {
      return NextResponse.json(
        {
          error: `Erro ao salvar mensagem do usuário: ${insertUserResult.error.message}`,
        },
        { status: 500 }
      );
    }

    const assistantContentToSave = generatedImageUrl
      ? `${text}\n\n[Imagem gerada automaticamente: ${generatedImageUrl}]`
      : text;

    const insertAssistantResult = await supabase.from("chat_messages").insert({
      user_email: email,
      role: "assistant",
      content: assistantContentToSave,
    });

    if (insertAssistantResult.error) {
      return NextResponse.json(
        {
          error: `Erro ao salvar resposta da Aurora: ${insertAssistantResult.error.message}`,
        },
        { status: 500 }
      );
    }

    const nextMessagesRemaining =
      limits.messagesPerDay >= 0
        ? Math.max(limits.messagesPerDay - (messagesUsed + 1), 0)
        : -1;

    const nextImagesRemaining =
      limits.imagesPerDay >= 0
        ? Math.max(
            limits.imagesPerDay - imagesUsed - (generatedImageUrl ? 1 : 0),
            0
          )
        : -1;

    return NextResponse.json(
      {
        reply: text,
        plan: finalPlan,
        messagesRemaining: nextMessagesRemaining,
        imagesRemaining: nextImagesRemaining,
        referenceImageUsed: Boolean(referenceImageUrl),
        imageUrl: generatedImageUrl || null,
        imagePageUrl: generatedImageUrl || null,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("ERRO /api/chat:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Erro interno no chat.",
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  }
}