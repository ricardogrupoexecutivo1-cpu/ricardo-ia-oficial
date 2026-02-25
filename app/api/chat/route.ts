import OpenAI from "openai";
import { Pool } from "pg";

export const runtime = "nodejs";

function cleanText(s: string) {
  return s.replace(/\s+\.\.\.\s*$/g, "").replace(/\s{2,}/g, " ").trim();
}

function textError(message: string, status = 500) {
  return new Response(message, {
    status,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

// Pool singleton (evita abrir conexão toda hora)
declare global {
  // eslint-disable-next-line no-var
  var __dbPool: Pool | undefined;
}

function getPool() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) return null;

  if (!global.__dbPool) {
    global.__dbPool = new Pool({
      connectionString: databaseUrl,
      ssl: { rejectUnauthorized: false },
    });
  }
  return global.__dbPool;
}

export async function POST(req: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return textError("OPENAI_API_KEY ausente no ambiente.", 500);

  const pool = getPool();
  if (!pool) return textError("DATABASE_URL ausente no ambiente (Vercel/Local).", 500);

  const body = await req.json().catch(() => ({} as any));
  const message = typeof body?.message === "string" ? body.message.trim() : "";
  const userId = typeof body?.userId === "string" ? body.userId.trim() : "";

  if (!message) return textError("Body inválido. Envie { message: string }.", 400);
  if (!userId) return textError("Body inválido. Envie { userId: string }.", 400);

  // 1) Buscar memória curta
  let historyText = "";
  try {
    const { rows } = await pool.query(
      `select role, content
         from public.memories
        where user_id = $1
        order by created_at desc
        limit 12`,
      [userId]
    );

    const ordered = rows.slice().reverse();
    if (ordered.length > 0) {
      historyText = ordered
        .map((r: any) => `${r.role === "user" ? "Usuário" : "RicardoIA"}: ${r.content}`)
        .join("\n");
    }
  } catch (e: any) {
    return textError(`Erro DB (select memories): ${e?.message ?? "falha"}`, 500);
  }

  // 2) Inserir mensagem do usuário
  try {
    await pool.query(
      `insert into public.memories (user_id, role, content)
       values ($1, $2, $3)`,
      [userId, "user", message]
    );
  } catch (e: any) {
    return textError(`Erro DB (insert user): ${e?.message ?? "falha"}`, 500);
  }

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

  const fullInput =
    historyText.length > 0
      ? `Contexto (conversa recente):\n${historyText}\n\nMensagem atual do usuário:\n${message}`
      : message;

  // 3) Streaming + salvar resposta
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
          const finalText = cleanText(assistantText || "Sem resposta.");

          try {
            await pool.query(
              `insert into public.memories (user_id, role, content)
               values ($1, $2, $3)`,
              [userId, "assistant", finalText]
            );
          } catch (e: any) {
            controller.enqueue(
              encoder.encode(`\n[erro] Falha ao salvar memória: ${e?.message ?? "falha"}`)
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
  } catch (e: any) {
    return textError(cleanText(e?.message ?? "Erro interno."), 500);
  }
}