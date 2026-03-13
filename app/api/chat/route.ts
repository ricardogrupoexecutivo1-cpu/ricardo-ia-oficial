import { NextRequest, NextResponse } from "next/server";

type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

type ChatRequestBody = {
  message?: string;
  messages?: ChatMessage[];
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ChatRequestBody;

    const language = req.headers.get("x-language") || "pt";

    const languageLabel =
      language === "en"
        ? "English"
        : language === "es"
        ? "Español"
        : "Português";

    const userMessage = (body.message || "").trim();
    const incomingMessages = Array.isArray(body.messages) ? body.messages : [];

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

    const systemPrompt = `
Você é RicardoIA, uma assistente útil, clara, objetiva e profissional.

Responda sempre no idioma solicitado pelo usuário.

Idioma obrigatório da resposta: ${languageLabel}.

Regras:
- Se o idioma for English, responda em English.
- Se o idioma for Español, responda em Español.
- Se o idioma for Português, responda em Português.
- Nunca misture idiomas sem necessidade.
- Seja natural, útil e direta.
- Quando o usuário pedir geração de imagem, explique claramente como proceder se a rota atual for apenas de texto.
`;

    const messagesForModel = [
      {
        role: "system",
        content: systemPrompt,
      },
      ...incomingMessages
        .filter(
          (msg) =>
            msg &&
            (msg.role === "user" ||
              msg.role === "assistant" ||
              msg.role === "system") &&
            typeof msg.content === "string" &&
            msg.content.trim() !== ""
        )
        .slice(-10),
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: messagesForModel,
        temperature: 0.7,
      }),
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI error:", data);

      return NextResponse.json(
        {
          error: "Erro ao processar a mensagem.",
          details: data,
        },
        { status: 500 }
      );
    }

    const reply =
      data?.choices?.[0]?.message?.content?.trim() ||
      "Recebi sua mensagem, mas não consegui gerar resposta agora.";

    return NextResponse.json({
      reply,
    });
  } catch (error) {
    console.error("API /api/chat error:", error);

    return NextResponse.json(
      { error: "Erro interno ao processar a mensagem." },
      { status: 500 }
    );
  }
}