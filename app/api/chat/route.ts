import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

type LeadNivel = "frio" | "morno" | "quente";
type IntentType = "campanha" | "imagem" | "ideia" | "monetizacao" | "geral";

type IncomingMessage = {
  role?: "user" | "assistant" | string;
  content?: string;
};

type SafeConversationMessage = {
  role: "user" | "assistant";
  content: string;
};

type LeadResult = {
  saved: boolean;
  nivel?: LeadNivel;
  interesse?: string;
  score?: number;
  reason?: string;
};

type ReferralResult = {
  referralCode: string | null;
  referralLink: string | null;
  referredBy: string | null;
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

function extractConversationMessages(body: any): SafeConversationMessage[] {
  if (!Array.isArray(body?.messages)) return [];

  return body.messages
    .filter(
      (item: IncomingMessage) =>
        item &&
        (item.role === "user" || item.role === "assistant") &&
        typeof item.content === "string" &&
        item.content.trim()
    )
    .map((item: IncomingMessage) => ({
      role: item.role === "assistant" ? "assistant" : "user",
      content: String(item.content).trim(),
    }));
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
    "quero uma imagem",
    "pedido de imagem",
    "imagem linda",
    "imagem real",
    "imagem futurista",
    "super imagem",
  ];

  return terms.some((term) => text.includes(term));
}

function detectIntent(message: string): IntentType {
  const text = normalizeText(message);

  if (!text) return "geral";
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
    return { nivel: "morno", interesse: "imagem", score: 6 };
  }

  if (intent === "ideia") {
    return { nivel: "morno", interesse: "ideia", score: 5 };
  }

  return { nivel: "frio", interesse: "geral", score: 1 };
}

function buildSystemPrompt() {
  return `
Você é a Aurora IA.

Regras principais:
- responda exatamente o que o usuário pediu
- use o histórico da conversa para manter contexto
- não invente que o usuário não pediu algo se isso estiver no histórico
- não puxar automaticamente para monetização, Aurora IA ou vendas, a menos que o usuário peça
- seja útil, direta, natural e clara
- responda em português por padrão
- se o usuário pedir tradução, traduza
- se o usuário pedir lista em muitos idiomas, entregue a lista de forma organizada
- se o usuário pedir receita, dê receita
- se o usuário pedir campanha, dê campanha
- se o usuário pedir ideia de negócio, dê ideia
- se o usuário pedir algo comum, responda normalmente como assistente geral

Contexto do produto:
- você faz parte da Aurora IA
- pode ajudar com campanhas, ideias, negócios, textos e orientação geral
- a geração de imagem fica em outra rota, então aqui foque em resposta textual útil

Estilo:
- linguagem clara
- sem resposta genérica
- sem repetir introduções desnecessárias
- sem dizer que vai ajudar e depois não ajudar
- quando o usuário pedir continuação, continue de onde a conversa parou
`;
}

async function generateReplyWithOpenAI(
  conversation: SafeConversationMessage[],
  currentMessage: string
) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY não configurada.");
  }

  const history = conversation.slice(-16).map((item) => ({
    role: item.role,
    content: item.content,
  }));

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      temperature: 0.6,
      messages: [
        {
          role: "system",
          content: buildSystemPrompt(),
        },
        ...history,
        ...(history.length === 0 ||
        history[history.length - 1]?.role !== "user" ||
        history[history.length - 1]?.content !== currentMessage
          ? [
              {
                role: "user",
                content: currentMessage,
              },
            ]
          : []),
      ],
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMessage =
      data?.error?.message ||
      data?.error ||
      "Falha ao gerar resposta com OpenAI.";
    throw new Error(errorMessage);
  }

  const reply = data?.choices?.[0]?.message?.content;

  if (!reply || typeof reply !== "string") {
    throw new Error("A OpenAI retornou uma resposta vazia.");
  }

  return reply.trim();
}

async function saveLead(email: string, message: string): Promise<LeadResult> {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return { saved: false, reason: "supabase_not_configured" };
  }

  const cleanEmail = String(email || "").trim().toLowerCase();
  if (!cleanEmail) {
    return { saved: false, reason: "missing_email" };
  }

  const { nivel, interesse, score } = detectLeadData(message);

  try {
    const { data: existingLead, error: selectError } = await supabase
      .from("leads")
      .select("id")
      .eq("email", cleanEmail)
      .limit(1)
      .maybeSingle();

    if (selectError) {
      return { saved: false, reason: selectError.message };
    }

    if (existingLead?.id) {
      const { error: updateError } = await supabase
        .from("leads")
        .update({
          nivel,
          interesse,
          score,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingLead.id);

      if (updateError) {
        return { saved: false, reason: updateError.message };
      }
    } else {
      const { error: insertError } = await supabase.from("leads").insert({
        email: cleanEmail,
        nivel,
        interesse,
        score,
        updated_at: new Date().toISOString(),
      });

      if (insertError) {
        return { saved: false, reason: insertError.message };
      }
    }

    return {
      saved: true,
      nivel,
      interesse,
      score,
    };
  } catch (error) {
    return {
      saved: false,
      reason: error instanceof Error ? error.message : "lead_save_failed",
    };
  }
}

async function getReferralData(email: string): Promise<ReferralResult> {
  const supabase = getSupabaseAdmin();

  if (!supabase || !email) {
    return {
      referralCode: null,
      referralLink: null,
      referredBy: null,
    };
  }

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("referral_code,referred_by")
      .eq("email", email)
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return {
        referralCode: null,
        referralLink: null,
        referredBy: null,
      };
    }

    const referralCode =
      typeof data.referral_code === "string" ? data.referral_code : null;
    const referredBy =
      typeof data.referred_by === "string" ? data.referred_by : null;

    return {
      referralCode,
      referralLink: referralCode
        ? `https://ricardoiaoficial.com/?ref=${encodeURIComponent(referralCode)}`
        : null,
      referredBy,
    };
  } catch {
    return {
      referralCode: null,
      referralLink: null,
      referredBy: null,
    };
  }
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

    if (!message) {
      return NextResponse.json(
        {
          ok: false,
          error: "Mensagem vazia.",
        },
        { status: 400 }
      );
    }

    const [reply, leadResult, referralData] = await Promise.all([
      generateReplyWithOpenAI(messages, message),
      email ? saveLead(email, message) : Promise.resolve(null),
      email
        ? getReferralData(email)
        : Promise.resolve({
            referralCode: null,
            referralLink: null,
            referredBy: null,
          }),
    ]);

    return NextResponse.json({
      ok: true,
      reply,
      leadSaved: Boolean(leadResult?.saved),
      leadResult,
      detectedIntent: detectIntent(message),
      referralCode: referralData.referralCode,
      referralLink: referralData.referralLink,
      referredBy: referralData.referredBy,
    });
  } catch (error) {
    console.error("Erro em /api/chat:", error);

    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Erro interno no chat.",
      },
      { status: 500 }
    );
  }
}