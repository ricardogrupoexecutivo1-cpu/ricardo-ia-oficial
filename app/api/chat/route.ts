import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

type LeadNivel = "frio" | "morno" | "quente";
type IntentType = "campanha" | "imagem" | "ideia" | "monetizacao" | "geral";

type IncomingMessage = {
  role?: "user" | "assistant" | string;
  content?: string;
};

function getSupabaseAdmin() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function normalizeText(value: string) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function isAffirmative(message: string) {
  const text = normalizeText(message);

  const terms = [
    "sim",
    "ok",
    "pode",
    "pode ser",
    "sim pode",
    "sim criar",
    "isso",
    "isso mesmo",
    "exatamente",
    "perfeito",
    "pode fazer",
    "gera",
    "gerar",
    "criar",
    "pode criar",
    "como o exemplo",
    "como seu exemplo",
    "como o exemplo acima",
    "igual ao exemplo",
    "esse mesmo",
    "seguir",
    "pode seguir",
    "seguir com isso",
    "seguir com pedido",
    "seguir com o pedido",
    "seguir com o pedido de imagem",
    "continuar",
    "continuar imagem",
    "continuar com a imagem",
    "prosseguir",
    "prosseguir com a imagem",
  ];

  return terms.some((term) => text === term || text.includes(term));
}

function isImageCreationRequest(message: string) {
  const text = normalizeText(message);

  const terms = [
    "crie uma imagem",
    "gere uma imagem",
    "gerar imagem",
    "criar imagem",
    "imagem profissional",
    "imagem da aurora",
    "robo aurora",
    "robô aurora",
    "banner",
    "arte",
    "foto",
    "criativo",
    "thumbnail",
    "capa",
    "anuncio visual",
    "imagem vendendo",
    "plataforma ricardoiaoficial.com",
    "2 crie",
    "quero uma imagem",
    "pedido de imagem",
    "imagem linda",
    "imagem real",
    "imagem futurista",
    "super imagem",
  ];

  return terms.some((term) => text.includes(term));
}

function isImageRefinement(message: string) {
  const text = normalizeText(message);

  const terms = [
    "estilo",
    "cinematografico",
    "mais realista",
    "mais real",
    "mais futurista",
    "mais premium",
    "mais elegante",
    "mais impactante",
    "mais chamativa",
    "mais encantadora",
    "fundo escuro",
    "neon",
    "azul",
    "verde",
    "roupa",
    "vestida",
    "deslumbrante",
    "instagram",
    "formato quadrado",
    "banner",
    "vertical",
    "horizontal",
    "4k",
    "ultra detalhado",
    "realista",
    "luxuosa",
    "luxuoso",
    "brilhante",
    "dramatico",
    "dramática",
    "dramatic lighting",
    "seguir com o pedido de imagem",
    "continuar com a imagem",
    "prosseguir com a imagem",
  ];

  return terms.some((term) => text.includes(term));
}

function isCampaignRequest(message: string) {
  const text = normalizeText(message);

  const terms = [
    "campanha",
    "vender",
    "marketing",
    "clientes",
    "cliente",
    "anuncio",
    "anunciar",
    "copy",
    "texto de vendas",
    "instagram",
    "whatsapp",
  ];

  return terms.some((term) => text.includes(term));
}

function isBusinessIdeaRequest(message: string) {
  const text = normalizeText(message);

  const terms = [
    "ideia",
    "negocio",
    "negocios",
    "empresa",
    "modelo de negocio",
    "criar negocio",
  ];

  return terms.some((term) => text.includes(term));
}

function isMonetizationRequest(message: string) {
  const text = normalizeText(message);

  const terms = [
    "monetizar",
    "receita",
    "faturar",
    "muitos clientes",
    "muito cliente",
    "gerar muita receita",
    "mais receita",
    "escalar",
    "crescer a aurora",
  ];

  return terms.some((term) => text.includes(term));
}

function detectIntent(message: string): IntentType {
  const text = normalizeText(message);

  if (text === "1") return "campanha";
  if (text === "2") return "imagem";
  if (text === "3") return "ideia";

  if (isMonetizationRequest(text)) return "monetizacao";
  if (isImageCreationRequest(text)) return "imagem";
  if (isCampaignRequest(text)) return "campanha";
  if (isBusinessIdeaRequest(text)) return "ideia";

  return "geral";
}

function detectLeadData(message: string): {
  nivel: LeadNivel;
  interesse: string;
  score: number;
} {
  const intent = detectIntent(message);

  if (intent === "campanha") {
    return { nivel: "quente", interesse: "campanha", score: 10 };
  }

  if (intent === "monetizacao") {
    return { nivel: "quente", interesse: "monetizacao", score: 10 };
  }

  if (intent === "imagem") {
    return { nivel: "morno", interesse: "imagem", score: 5 };
  }

  if (intent === "ideia") {
    return { nivel: "morno", interesse: "ideia", score: 5 };
  }

  return { nivel: "frio", interesse: "geral", score: 1 };
}

function extractEmailFromBody(body: any): string {
  const candidates = [
    body?.email,
    body?.userEmail,
    body?.user?.email,
    body?.profile?.email,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate.trim().toLowerCase();
    }
  }

  return "";
}

function extractMessageFromBody(body: any): string {
  if (typeof body?.message === "string" && body.message.trim()) {
    return body.message.trim();
  }

  if (Array.isArray(body?.messages) && body.messages.length > 0) {
    const lastUserMessage = [...body.messages]
      .reverse()
      .find(
        (item: IncomingMessage) =>
          item &&
          item.role === "user" &&
          typeof item.content === "string" &&
          item.content.trim()
      );

    if (lastUserMessage?.content) {
      return lastUserMessage.content.trim();
    }
  }

  return "";
}

function extractConversationMessages(body: any): IncomingMessage[] {
  if (!Array.isArray(body?.messages)) return [];

  return body.messages.filter(
    (item: IncomingMessage) =>
      item &&
      (item.role === "user" || item.role === "assistant") &&
      typeof item.content === "string" &&
      item.content.trim()
  );
}

function getLastMeaningfulUserIntent(
  messages: IncomingMessage[],
  currentMessage: string
): IntentType {
  const currentNormalized = normalizeText(currentMessage);

  for (let i = messages.length - 1; i >= 0; i -= 1) {
    const item = messages[i];

    if (!item || item.role !== "user" || typeof item.content !== "string") {
      continue;
    }

    const content = item.content.trim();
    const normalized = normalizeText(content);

    if (!normalized) continue;
    if (normalized === currentNormalized) continue;

    const intent = detectIntent(content);
    if (intent !== "geral") {
      return intent;
    }
  }

  return "geral";
}

function getLastImageRequest(messages: IncomingMessage[], currentMessage: string) {
  const currentNormalized = normalizeText(currentMessage);

  for (let i = messages.length - 1; i >= 0; i -= 1) {
    const item = messages[i];

    if (!item || item.role !== "user" || typeof item.content !== "string") {
      continue;
    }

    const content = item.content.trim();
    const normalized = normalizeText(content);

    if (!normalized) continue;
    if (normalized === currentNormalized) continue;

    if (detectIntent(content) === "imagem" || isImageRefinement(content)) {
      return content;
    }
  }

  return "";
}

function getLastAssistantImagePrompt(
  messages: IncomingMessage[],
  currentMessage: string
) {
  const currentNormalized = normalizeText(currentMessage);

  for (let i = messages.length - 1; i >= 0; i -= 1) {
    const item = messages[i];

    if (!item || item.role !== "assistant" || typeof item.content !== "string") {
      continue;
    }

    const content = item.content.trim();
    const normalized = normalizeText(content);

    if (!normalized) continue;
    if (normalized === currentNormalized) continue;

    if (
      normalized.includes("crie uma imagem publicitaria premium") ||
      normalized.includes("objetivo:") ||
      normalized.includes("personagem principal:") ||
      normalized.includes("direcao visual:") ||
      normalized.includes("instrucoes completas do usuario:")
    ) {
      return content;
    }
  }

  return "";
}

function buildCampaignReply() {
  return `🔥 Perfeito — vou te ajudar com campanha de vendas.

Aqui está uma estrutura inicial pronta 👇

1. Oferta
Defina exatamente o que você está vendendo e qual o principal benefício.

2. Chamada forte
Use algo direto como:
"Venda mais com uma campanha pronta para atrair clientes agora."

3. Divulgação
Publique no:
- Instagram
- WhatsApp
- Facebook
- Status

4. Ação
Sempre termine com uma chamada clara:
"Fale agora", "Peça orçamento", "Chame no WhatsApp" ou "Compre agora".

🚀 Se quiser, no próximo passo eu monto sua campanha completa pronta para copiar e usar.

Se quiser liberar uso profissional ilimitado:
ricardoiaoficial.com/planos`;
}

function buildImageGuidanceReply() {
  return `🎨 Perfeito — vamos criar sua imagem profissional.

Me envie agora uma descrição assim:

- produto ou serviço
- texto principal da imagem
- estilo visual
- cores
- formato (Instagram, banner, anúncio ou capa)

Exemplo:
"Crie uma imagem vendendo a Aurora IA, com um robô futurista, visual premium, fundo tecnológico escuro, neon azul e verde, e texto forte de venda."

👉 Escreva do seu jeito que eu monto o prompt completo para você.`;
}

function buildBusinessIdeaReply() {
  return `💡 Perfeito — vamos criar uma ideia de negócio.

Posso montar para você agora:

- nome da ideia
- público-alvo
- como vender
- diferencial
- texto inicial de divulgação

👉 Me diga o segmento que você quer, por exemplo:
- locadora
- mineração
- agro
- imóveis
- loja
- consultoria

Se quiser, escreva só o ramo e eu monto a ideia completa.`;
}

function buildMonetizationReply() {
  return `💰 Perfeito — monetizar a Aurora IA com muitos clientes exige 4 frentes ao mesmo tempo:

1. Entrada de tráfego
- Google Maps
- Instagram
- Google Meu Negócio
- SEO da plataforma

2. Conversão
- chat com resposta rápida
- campanhas prontas
- imagens prontas
- CTA para planos

3. Monetização
- plano FREE
- plano Influencer
- plano PRO
- serviços extras

4. Retenção
- salvar leads
- WhatsApp
- indicações
- perfil público por link

🚀 Se quiser, no próximo passo eu monto agora um plano prático de monetização da Aurora IA com:
- aquisição de clientes
- oferta
- planos
- funil de vendas`;
}

function mergeImageInstructions(
  baseRequest: string,
  currentMessage: string,
  assistantPrompt: string
) {
  const base = String(baseRequest || "").trim();
  const current = String(currentMessage || "").trim();
  const assistant = String(assistantPrompt || "").trim();

  if (assistant && isAffirmative(current)) {
    return `${base || "Aurora IA"}.
Use como base o prompt anterior já aprovado pelo usuário e continue a partir dele.`;
  }

  if (!base && !current) {
    return "Aurora IA, robô futurista premium, anúncio de alta conversão para ricardoiaoficial.com";
  }

  if (!base) return current;
  if (!current) return base;

  return `${base}. Ajustes adicionais pedidos pelo usuário: ${current}.`;
}

function buildImagePromptFromMessage(
  message: string,
  baseRequest?: string,
  assistantPrompt?: string
) {
  const mergedRequest = mergeImageInstructions(
    baseRequest || "",
    message,
    assistantPrompt || ""
  );

  return `Crie uma imagem publicitária premium para a Aurora IA com foco total em vendas.

Objetivo:
Vender o acesso à plataforma ricardoiaoficial.com com aparência extremamente profissional, encantadora e futurista.

Personagem principal:
- um robô feminino futurista representando a Aurora IA
- extremamente inteligente, elegante, confiável e visualmente deslumbrante
- aparência realista premium
- presença forte de tecnologia avançada

Direção visual:
- estilo cinematográfico
- iluminação dramática e refinada
- fundo tecnológico escuro
- efeitos neon azul, verde e detalhes luminosos
- visual moderno, impactante e de alta conversão
- composição luxuosa para anúncio profissional

Texto sugerido na imagem:
"Aurora IA"
"Crie campanhas, imagens e ideias com inteligência artificial"
"ricardoiaoficial.com"

Formato e uso:
- anúncio premium
- Instagram
- divulgação digital
- visual encantador para vender muito

Instruções completas do usuário:
"${mergedRequest}"`;
}

function shouldGeneratePromptFromCurrentMessage(
  currentMessage: string,
  previousIntent: IntentType
) {
  const normalized = normalizeText(currentMessage);

  if (isImageCreationRequest(normalized)) {
    return true;
  }

  if (previousIntent === "imagem" && isImageRefinement(normalized)) {
    return true;
  }

  if (previousIntent === "imagem" && isAffirmative(normalized)) {
    return true;
  }

  return false;
}

async function saveLead(email: string, message: string) {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    console.warn("Lead não salvo: variáveis do Supabase não configuradas.");
    return { saved: false, reason: "supabase_not_configured" };
  }

  const cleanEmail = String(email || "").trim().toLowerCase();
  if (!cleanEmail) {
    return { saved: false, reason: "missing_email" };
  }

  const { nivel, interesse, score } = detectLeadData(message);

  const { error } = await supabase.from("leads").insert({
    email: cleanEmail,
    nivel,
    interesse,
    score,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    console.error("Erro ao salvar lead:", error.message);
    return { saved: false, reason: error.message };
  }

  return {
    saved: true,
    nivel,
    interesse,
    score,
  };
}

function buildFallbackReply(
  message: string,
  previousIntent: IntentType = "geral",
  lastImageRequest = "",
  lastAssistantImagePrompt = ""
) {
  const currentIntent = detectIntent(message);
  const normalized = normalizeText(message);

  if (currentIntent === "campanha") {
    return buildCampaignReply();
  }

  if (currentIntent === "imagem") {
    const messageLooksDetailed =
      normalized.length > 20 || isImageRefinement(normalized);

    if (messageLooksDetailed) {
      return buildImagePromptFromMessage(
        message,
        lastImageRequest,
        lastAssistantImagePrompt
      );
    }

    return buildImageGuidanceReply();
  }

  if (currentIntent === "ideia") {
    return buildBusinessIdeaReply();
  }

  if (currentIntent === "monetizacao") {
    return buildMonetizationReply();
  }

  if (previousIntent === "imagem") {
    if (isAffirmative(normalized) || isImageRefinement(normalized)) {
      return buildImagePromptFromMessage(
        message,
        lastImageRequest,
        lastAssistantImagePrompt
      );
    }
  }

  if (previousIntent === "campanha" && isAffirmative(normalized)) {
    return `🔥 Perfeito — aqui vai uma campanha inicial pronta para usar:

Título:
Aurora IA — inteligência artificial para vender, criar e acelerar resultados

Texto:
Crie campanhas, imagens e ideias de negócio em minutos com uma plataforma inteligente, moderna e pronta para o dia a dia.
Acesse agora e descubra como vender mais com apoio da Aurora IA.

CTA:
Entre agora em ricardoiaoficial.com

Se quiser, no próximo passo eu monto:
- versão Instagram
- versão WhatsApp
- versão anúncio curto`;
  }

  if (previousIntent === "ideia" && isAffirmative(normalized)) {
    return `💡 Perfeito — vamos estruturar sua ideia.

Me diga agora só uma destas opções:
- locadora
- mineração
- agro
- imóveis
- consultoria
- outro segmento

Escreva só o ramo que eu monto a ideia completa.`;
  }

  return `🔥 Eu posso te ajudar agora com:

1. Criar campanha de vendas
2. Gerar imagem profissional
3. Ideia de negócio pronta

👉 Me diga o número ou escreva o que você quer.`;
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    method: "GET",
    message: "rota /api/chat ativa",
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const email = extractEmailFromBody(body);
    const message = extractMessageFromBody(body);
    const messages = extractConversationMessages(body);

    const previousIntent = getLastMeaningfulUserIntent(messages, message);
    const currentIntent = detectIntent(message);
    const lastImageRequest = getLastImageRequest(messages, message);
    const lastAssistantImagePrompt = getLastAssistantImagePrompt(
      messages,
      message
    );

    let leadResult: any = null;

    if (email && message) {
      leadResult = await saveLead(email, message);
    }

    const wantsPrompt = shouldGeneratePromptFromCurrentMessage(
      message,
      previousIntent
    );

    const reply =
      typeof body?.mockReply === "string" && body.mockReply.trim()
        ? body.mockReply.trim()
        : wantsPrompt
        ? buildImagePromptFromMessage(
            message,
            lastImageRequest,
            lastAssistantImagePrompt
          )
        : buildFallbackReply(
            message,
            previousIntent,
            lastImageRequest,
            lastAssistantImagePrompt
          );

    return NextResponse.json({
      ok: true,
      reply,
      leadSaved: Boolean(leadResult?.saved),
      leadResult,
      detectedIntent: currentIntent,
      previousIntent,
      lastImageRequest,
    });
  } catch (error) {
    console.error("Erro em /api/chat:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Erro interno no chat.",
      },
      { status: 500 }
    );
  }
}