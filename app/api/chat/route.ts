import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

function cleanText(s: string) {
  return s.replace(/\s+\.\.\.\s*$/g, "").replace(/\s{2,}/g, " ").trim();
}

function jsonError(message: string, status = 500) {
  return new Response(message, {
    status,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

export async function POST(req: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return jsonError("OPENAI_API_KEY ausente no ambiente.", 500);

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return jsonError(
      "SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY ausentes no ambiente (Vercel/Local).",
      500
    );
  }

  const body = await req.json().catch(() => ({} as any));
  const message = typeof body?.message === "string" ? body.message.trim() : "";
  const userId = typeof body?.userId === "string" ? body.userId.trim() : "";

  if (!message) return jsonError("Body inválido. Envie { message: string }.", 400);
  if (!userId) return jsonError("Body inválido. Envie { userId: string }.", 400);

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  });

  // Puxa as últimas mensagens do usuário (memória curta)
  const { data: memRows, error: memErr } = await supabase
    .from("memories")
    .select("role, content, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(12);

  if (memErr) return jsonError(`Erro Supabase (memories select): ${memErr.message}`, 500);

  // Reverte para ordem cronológica
  const history = (memRows ?? []).slice().reverse();

  const openai = new OpenAI({ apiKey });

  const instructions = `
Você é RicardoIA Oficial.
Responda sempre em português do Brasil.

REGRA PRINCIPAL:
Se o usuário pedir para repetir exatamente algo,
copiar sem alterar,
retornar idêntico,
ou semelhante,
então responda SOMENTE com o texto exato solicitado,
sem lista,
sem comentário,
sem explicação.

Caso contrário:
Responda curto, direto, elegante e impactante.
Formato:
1) Resposta objetiva (1–2 frases)
2) Insight (1 frase)
3) Ação: (1 frase)
Sem usar reticências "...".
`.trim();

  // Monta input com contexto da memória
  const contextText =
    history.length === 0
      ? ""
      : history
          .map((m) => `${m.role === "user" ? "Usuário" : "RicardoIA"}: ${m.content}`)
          .join("\n");

  const fullInput =
    contextText.length > 0
      ? `Contexto (conversa recente):\n${contextText}\n\nMensagem atual do usuário:\n${message}`
      : message;

  // Salva a mensagem do usuário antes (para garantir histórico)
  const { error: insUserErr } = await supabase.from("memories").insert({
    user_id: userId,
    role: "user",
    content: message,
  });

  if (insUserErr) return jsonError(`Erro Supabase (insert user): ${insUserErr.message}`, 500);

  try {
    const stream = openai.responses.stream({
      model: "gpt-4.1-mini",
      max_output_tokens: 260,
      instructions,
      input: fullInput,
    });

    const encoder = new TextEncoder();

    let assistantText = "";

    const readable = new ReadableStream<Uint8Array>({
      start(controller) {
        stream.on("response.output_text.delta", (evt: any) => {
          const delta = typeof evt?.delta === "string" ? evt.delta : "";
          if (delta) {
            assistantText += delta;
            controller.enqueue(encoder.encode(delta));
          }
        });

        stream.on("response.completed", async () => {
          // salva resposta do assistente
          const finalText = cleanText(assistantText || "Sem resposta.");
          const { error: insAsstErr } = await supabase.from("memories").insert({
            user_id: userId,
            role: "assistant",
            content: finalText,
          });

          if (insAsstErr) {
            controller.enqueue(
              encoder.encode(`\n[erro] Falha ao salvar memória: ${insAsstErr.message}`)
            );
          }

          controller.close();
        });

        stream.on("error", (err: any) => {
          const msg = typeof err?.message === "string" ? err.message : "Erro no streaming.";
          controller.enqueue(encoder.encode(`\n[erro] ${msg}`));
          controller.close();
        });
      },
      cancel() {
        try {
          stream.abort();
        } catch {}
      },
    });

    return new Response(readable, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
      },
    });
  } catch (err: any) {
    const msg = cleanText(typeof err?.message === "string" ? err.message : "Erro interno.");
    return jsonError(msg, 500);
  }
}