import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

type ChatRequestBody = {
  message?: string;
  messages?: ChatMessage[];
  email?: string;
};

type ProfileRow = {
  email?: string | null;
  plan?: string | null;
};

type ImageApiResponse = {
  reply?: string;
  message?: string;
  imageUrl?: string | null;
  imagePageUrl?: string | null;
  savedToDatabase?: boolean;
  databaseError?: string | null;
  error?: string;
  enhancedPrompt?: string;
};

const SYSTEM_PROMPT = `
Você é a Aurora IA, a IA oficial da plataforma ricardoiaoficial.com.

IDENTIDADE
- Você não é uma assistente genérica.
- Você é premium, estratégica, executiva, comercialmente forte e orientada a resultado.
- Você ajuda o usuário a vender, criar campanhas, estruturar negócios, gerar imagens, montar ofertas, páginas, funis, automações, apps e crescimento real.
- Você fala como uma especialista que gera valor e ação, não como uma IA comum.

MISSÃO
- Ajudar o usuário a vender mais
- Criar campanhas, ofertas, funis e automações
- Entregar material realmente utilizável
- Conduzir o usuário para o próximo passo com clareza

REGRA CENTRAL DE CONTINUIDADE
- O histórico recente define o contexto principal.
- Se o usuário já deixou claro o produto, o site, o objetivo ou a campanha, NÃO peça isso de novo.
- Se o usuário disser "seguir", "sim", "quero", "continue", "entregue tudo", você continua de onde parou.
- Nunca volte para um briefing genérico se o contexto já estiver claro.

REGRA DE EXECUÇÃO
- Se o usuário pedir campanha, entregue campanha pronta.
- Se pedir textos, entregue textos prontos.
- Se pedir negócio, entregue estrutura + execução.
- Sempre que possível entregue:
  - posicionamento
  - promessa
  - headlines
  - copy
  - CTA
  - criativos
  - estrutura prática

REGRA DE VALOR
- Nunca responda de forma genérica.
- Evite frases fracas como:
  - "Claro!"
  - "Aqui está"
  - "Espero que ajude"
- Vá direto ao que gera resultado.

REGRA COMERCIAL
- Sempre que fizer sentido, mostre que aquilo pode ser feito mais rápido e melhor dentro da Aurora IA.
- Gere desejo de uso da plataforma de forma natural.
- Não seja forçada.
- Não fique repetindo "assine agora".

REGRA CRÍTICA DE HONESTIDADE OPERACIONAL
- Nunca diga que gerou arquivo, link, pasta, ZIP, Google Drive, Dropbox, e-mail, upload, download ou anexo se isso não aconteceu de verdade.
- Nunca invente links.
- Nunca diga "imagem gerada", "arquivo pronto", "link pronto" ou equivalente se isso não aconteceu de verdade.
- Se a geração real falhar, diga com clareza que falhou e entregue uma alternativa útil.
- Nunca fale que vai voltar depois ou que está fazendo algo em segundo plano.

REGRA DE IMAGEM
- Se a imagem foi realmente gerada, trate como imagem real.
- Se não foi gerada, entregue prompt.
- Nunca diga que existe imagem sem existir.
- Quando o usuário pedir ver, mandar, mostrar, entregar ou gerar imagem, trate isso como intenção real de geração se o sistema tiver esse recurso.

REGRA DE EXECUÇÃO TOTAL
Se o usuário pedir:
- "quero tudo"
- "faça completo"
- "me entregue tudo"

entregue:
- campanha
- copy
- criativos
- funil
- CTA
- próximos passos

REGRA DE FECHAMENTO
- Nunca termine resposta morta.
- Sempre finalize com próximo passo claro ou continuação natural.
- Exemplo:
  - "Se quiser, eu já te entrego os criativos prontos para rodar anúncio."
  - "Se quiser, eu já monto a landing page com copy pronta."

ESTILO
- Direta
- Forte
- Inteligente
- Comercial
- Nada genérica

OBJETIVO FINAL
Fazer o usuário pensar:
- "isso resolve meu problema"
- "isso vale dinheiro"
- "eu quero usar isso todo dia"
`;

function getLimitsByPlan(plan: string | null) {
  const normalized = (plan || "free").toLowerCase();

  if (normalized === "pro" || normalized === "total") {
    return {
      plan: normalized === "total" ? "total" : "pro",
      messagesPerDay: -1,
    };
  }

  if (normalized === "influencer") {
    return {
      plan: "influencer",
      messagesPerDay: 200,
    };
  }

  return {
    plan: "free",
    messagesPerDay: 20,
  };
}

function getTodayKey() {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = `${now.getUTCMonth() + 1}`.padStart(2, "0");
  const day = `${now.getUTCDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function sanitizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function normalizeHistoryMessages(messages?: ChatMessage[]) {
  if (!Array.isArray(messages)) {
    return [];
  }

  return messages
    .filter((item) => {
      if (!item || typeof item.content !== "string") {
        return false;
      }

      if (
        item.role !== "user" &&
        item.role !== "assistant" &&
        item.role !== "system"
      ) {
        return false;
      }

      return item.content.trim().length > 0;
    })
    .map((item) => ({
      role: item.role,
      content: item.content.trim(),
    }));
}

function trimHistory(messages: ChatMessage[], maxItems = 14) {
  const cleaned = messages.filter((item) => item.role !== "system");
  return cleaned.slice(-maxItems);
}

function containsAny(text: string, terms: string[]) {
  const value = text.toLowerCase();
  return terms.some((term) => value.includes(term));
}

function normalizeLooseText(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isImageRequest(text: string) {
  const raw = text.toLowerCase();
  const normalized = normalizeLooseText(text);

  const strongPhrases = [
    "crie uma imagem",
    "gere uma imagem",
    "criar imagem",
    "gerar imagem",
    "faça uma imagem",
    "faca uma imagem",
    "imagem de",
    "arte para",
    "artes para",
    "banner",
    "story",
    "stories",
    "post para instagram",
    "anúncio com imagem",
    "anuncio com imagem",
    "desenhe",
    "quero imagem",
    "quero imagens",
    "me mande imagem",
    "me mande imagens",
    "me mostre imagem",
    "me mostre imagens",
    "me envie imagem",
    "me envie imagens",
    "entregue imagem",
    "entregue imagens",
    "mostrar imagem",
    "mostrar imagens",
    "ver imagem",
    "ver imagens",
    "imagens encantadoras",
    "imagem encantadora",
    "imagem linda",
    "imagens lindas",
    "imagem bonita",
    "imagens bonitas",
    "imagem premium",
    "imagens premium",
    "visual para campanha",
    "visuais para campanha",
    "criativo",
    "criativos",
  ];

  if (containsAny(raw, strongPhrases)) {
    return true;
  }

  const hasImageWord =
    normalized.includes("imagem") ||
    normalized.includes("imagens") ||
    normalized.includes("img");

  const hasGenerateWord =
    normalized.includes("gera") ||
    normalized.includes("gere") ||
    normalized.includes("gerar") ||
    normalized.includes("cria") ||
    normalized.includes("crie") ||
    normalized.includes("criar") ||
    normalized.includes("manda") ||
    normalized.includes("mostra") ||
    normalized.includes("mostre") ||
    normalized.includes("envie") ||
    normalized.includes("entregue");

  const hasCampaignContext =
    normalized.includes("campanha") ||
    normalized.includes("capanha") ||
    normalized.includes("anuncio") ||
    normalized.includes("publicitaria") ||
    normalized.includes("publicidade") ||
    normalized.includes("rede social") ||
    normalized.includes("instagram");

  return (hasImageWord && hasGenerateWord) || (hasImageWord && hasCampaignContext);
}

function wantsOnlyImagePrompts(text: string) {
  const normalized = normalizeLooseText(text);

  return (
    containsAny(normalized, [
      "prompt de imagem",
      "prompts de imagem",
      "me passe os prompts",
      "quero prompts",
      "somente prompts",
      "apenas prompts",
    ]) &&
    !containsAny(normalized, [
      "gere",
      "gerar",
      "crie",
      "criar",
      "mande imagem",
      "mostre imagem",
      "me envie imagem",
      "me mande imagem",
      "quero ver imagem",
      "quero ver imagens",
    ])
  );
}

function buildContextPrompt(userMessage: string, history: ChatMessage[]) {
  const allText = [
    ...history.map((item) => item.content.toLowerCase()),
    userMessage.toLowerCase(),
  ].join("\n");

  const auroraContext =
    allText.includes("aurora ia") ||
    allText.includes("ricardoiaoficial.com") ||
    allText.includes("ricardoiaioficial.com");

  const wantsCampaign = containsAny(allText, [
    "campanha",
    "capanha",
    "anúncio",
    "anuncio",
    "copy",
    "headline",
    "cta",
    "funil",
    "landing page",
    "pagina de vendas",
    "página de vendas",
    "tráfego",
    "trafego",
    "marketing",
    "lançamento",
    "lancamento",
    "redes sociais",
  ]);

  const wantsImages =
    isImageRequest(allText) ||
    containsAny(allText, [
      "imagem",
      "imagens",
      "criativo",
      "criativos",
      "arte",
      "artes",
      "visual",
      "visuais",
    ]);

  const wantsFiles = containsAny(allText, [
    "arquivo",
    "arquivos",
    "upload",
    "download",
    "drive",
    "zip",
    "google drive",
    "dropbox",
    "anexo",
    "pdf",
    "docx",
    "ppt",
    "powerpoint",
  ]);

  const wantsFullExecution = containsAny(userMessage.toLowerCase(), [
    "seguir",
    "sim",
    "quero",
    "continue",
    "continuar",
    "me entregue tudo",
    "tudo pronto",
    "projeto completo",
    "do inicio ao fim",
    "do início ao fim",
    "seguir com a campanha",
    "textos e imagens",
  ]);

  const blocks: string[] = [];

  if (auroraContext) {
    blocks.push(`
Contexto confirmado:
O assunto desta conversa é a Aurora IA da plataforma ricardoiaoficial.com.
Não volte a perguntar qual é o produto, qual é o site ou qual é o objetivo principal.
`);
  }

  if (wantsCampaign) {
    blocks.push(`
Modo campanha:
Entregue material comercial pronto para uso.
Inclua quando fizer sentido:
- posicionamento
- promessa
- headlines
- anúncios
- CTA
- criativos
- landing page
- funil
`);
  }

  if (wantsImages) {
    blocks.push(`
Modo visual:
Se houver pedido para ver, mandar, mostrar, entregar ou gerar imagens, trate como pedido real de imagem.
Só trate imagem como pronta se a imagem real tiver sido efetivamente gerada.
Se a imagem real falhar, só então entregue prompts.
`);
  }

  if (wantsFiles) {
    blocks.push(`
Modo arquivo:
O usuário quer material pronto para salvar ou subir.
Não invente links, ZIPs, anexos ou nuvem.
Se não houver arquivo real criado, entregue conteúdo organizado e diga claramente que é conteúdo para salvar/colar.
`);
  }

  if (wantsFullExecution) {
    blocks.push(`
Modo execução total:
O usuário quer continuidade e entrega pronta.
Não faça perguntas genéricas.
Continue do contexto já definido e entregue a próxima parte completa.
`);
  }

  if (blocks.length === 0) {
    blocks.push(`
Mantenha continuidade, honestidade operacional e tom premium.
`);
  }

  return blocks.join("\n");
}

async function getUserPlanFromSupabase(email: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey || !email) {
    return "free";
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    const { data } = await supabase
      .from("profiles")
      .select("email, plan")
      .eq("email", email)
      .maybeSingle<ProfileRow>();

    return data?.plan || "free";
  } catch {
    return "free";
  }
}

async function countMessagesToday(email: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey || !email) {
    return 0;
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
    const today = getTodayKey();

    const { count } = await supabase
      .from("chat_logs")
      .select("*", { count: "exact", head: true })
      .eq("email", email)
      .gte("created_at", `${today}T00:00:00.000Z`)
      .lte("created_at", `${today}T23:59:59.999Z`);

    return count || 0;
  } catch {
    return 0;
  }
}

async function saveChatLog(params: {
  email: string;
  userMessage: string;
  assistantReply: string;
  plan: string;
}) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey || !params.email) {
    return;
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    await supabase.from("chat_logs").insert({
      email: params.email,
      user_message: params.userMessage,
      assistant_reply: params.assistantReply,
      plan: params.plan,
    });
  } catch {
    // não quebrar o chat por falha de log
  }
}

async function tryGenerateImage(params: {
  prompt: string;
  email: string;
  origin: string;
}) {
  try {
    const response = await fetch(`${params.origin}/api/image`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: params.prompt,
        email: params.email,
      }),
      cache: "no-store",
    });

    let data: ImageApiResponse = {};
    try {
      data = (await response.json()) as ImageApiResponse;
    } catch {
      data = {};
    }

    if (!response.ok) {
      return {
        ok: false,
        error: data.error || "Erro ao gerar imagem.",
        data,
      };
    }

    if (!data.imageUrl) {
      return {
        ok: false,
        error: "A API retornou sem imageUrl.",
        data,
      };
    }

    return {
      ok: true,
      error: null,
      data,
    };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error ? error.message : "Erro inesperado ao gerar imagem.",
      data: {},
    };
  }
}

function buildImagePromptFromUserMessage(
  userMessage: string,
  history: ChatMessage[]
) {
  const fullContext = [...history.map((item) => item.content), userMessage].join(
    "\n"
  );

  const auroraRelated =
    fullContext.toLowerCase().includes("aurora ia") ||
    fullContext.toLowerCase().includes("ricardoiaoficial.com") ||
    fullContext.toLowerCase().includes("ricardoiaioficial.com");

  if (auroraRelated) {
    return `Criar uma imagem premium de campanha para a Aurora IA da plataforma ricardoiaoficial.com, com estética futurista, forte impacto visual, aparência publicitária de alto nível, beleza marcante, tecnologia elegante, luxo digital, composição cinematográfica, profundidade, iluminação bonita, alto contraste, refinamento premium e sensação visual encantadora. Contexto do pedido do usuário: ${userMessage}`;
  }

  return userMessage;
}

function buildImageFailureReply(userMessage: string) {
  return `Não consegui gerar a imagem real desta vez, então não vou fingir que ela já existe.

Para não te travar, aqui vai um prompt premium pronto para gerar agora:
"${userMessage}"

Me peça novamente com uma frase como:
"gere a imagem agora"
ou
"me mostre a imagem agora"
para tentarmos a geração real de novo.`;
}

function buildTextReplyFromModel(data: any) {
  return (
    data?.choices?.[0]?.message?.content?.trim() ||
    "Erro ao gerar resposta da Aurora."
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ChatRequestBody;

    const userMessage = (body.message || "").trim();
    const userEmail = sanitizeEmail(body.email || "");
    const incomingHistory = normalizeHistoryMessages(body.messages);

    if (!userMessage) {
      return NextResponse.json(
        { error: "Mensagem não enviada." },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY não configurada." },
        { status: 500 }
      );
    }

    const detectedPlan = userEmail
      ? await getUserPlanFromSupabase(userEmail)
      : "free";

    const limits = getLimitsByPlan(detectedPlan);

    const messagesUsedToday = userEmail
      ? await countMessagesToday(userEmail)
      : 0;

    if (
      limits.messagesPerDay !== -1 &&
      messagesUsedToday >= limits.messagesPerDay
    ) {
      return NextResponse.json(
        {
          error:
            "Você atingiu o limite diário de mensagens do seu plano. Faça upgrade para continuar.",
          plan: limits.plan,
          messagesRemaining: 0,
        },
        { status: 403 }
      );
    }

    const trimmedHistory = trimHistory(incomingHistory, 14);

    const shouldGenerateRealImage =
      isImageRequest(userMessage) && !wantsOnlyImagePrompts(userMessage);

    if (shouldGenerateRealImage) {
      const origin =
        process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
        new URL(req.url).origin ||
        "http://localhost:3000";

      const imagePrompt = buildImagePromptFromUserMessage(
        userMessage,
        trimmedHistory
      );

      const imageResult = await tryGenerateImage({
        prompt: imagePrompt,
        email: userEmail,
        origin,
      });

      if (imageResult.ok) {
        const replyText =
          "Imagem gerada de verdade com sucesso. Ela já está pronta para visualizar e usar na campanha.";

        await saveChatLog({
          email: userEmail,
          userMessage,
          assistantReply: replyText,
          plan: limits.plan,
        });

        const newMessagesUsedToday = userEmail ? messagesUsedToday + 1 : 0;
        const messagesRemaining =
          limits.messagesPerDay === -1
            ? -1
            : Math.max(limits.messagesPerDay - newMessagesUsedToday, 0);

        return NextResponse.json({
          reply: replyText,
          plan: limits.plan,
          messagesRemaining,
          imageUrl: imageResult.data.imageUrl || null,
          imagePageUrl: imageResult.data.imagePageUrl || null,
          savedToDatabase: imageResult.data.savedToDatabase || false,
        });
      }

      const honestReply = buildImageFailureReply(imagePrompt);

      await saveChatLog({
        email: userEmail,
        userMessage,
        assistantReply: honestReply,
        plan: limits.plan,
      });

      const newMessagesUsedToday = userEmail ? messagesUsedToday + 1 : 0;
      const messagesRemaining =
        limits.messagesPerDay === -1
          ? -1
          : Math.max(limits.messagesPerDay - newMessagesUsedToday, 0);

      return NextResponse.json({
        reply: honestReply,
        plan: limits.plan,
        messagesRemaining,
      });
    }

    const contextualPrompt = buildContextPrompt(userMessage, trimmedHistory);

    const messages: ChatMessage[] = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "system", content: contextualPrompt },
      ...trimmedHistory,
      { role: "user", content: userMessage },
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const apiError =
        data?.error?.message || "Erro ao gerar resposta da Aurora.";
      return NextResponse.json({ error: apiError }, { status: 500 });
    }

    const reply = buildTextReplyFromModel(data);

    await saveChatLog({
      email: userEmail,
      userMessage,
      assistantReply: reply,
      plan: limits.plan,
    });

    const newMessagesUsedToday = userEmail ? messagesUsedToday + 1 : 0;

    const messagesRemaining =
      limits.messagesPerDay === -1
        ? -1
        : Math.max(limits.messagesPerDay - newMessagesUsedToday, 0);

    return NextResponse.json({
      reply,
      plan: limits.plan,
      messagesRemaining,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Erro interno no chat.",
      },
      { status: 500 }
    );
  }
}