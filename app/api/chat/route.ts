import OpenAI from 'openai'

export const runtime = 'nodejs'

// ✅ aumenta o tempo máximo da Function na Vercel (se o plano permitir)
export const maxDuration = 60

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

type Msg = { role: 'user' | 'assistant' | 'system'; content: string }

function normalizeMessages(body: any): Msg[] {
  if (typeof body?.message === 'string') {
    return [{ role: 'user', content: body.message }]
  }

  if (Array.isArray(body?.messages)) {
    return body.messages
      .filter((m: any) => m && typeof m.role === 'string' && typeof m.content === 'string')
      .map((m: any) => ({ role: m.role, content: m.content }))
      .filter((m: any) => m.role === 'user' || m.role === 'assistant' || m.role === 'system')
  }

  return []
}

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return new Response(JSON.stringify({ error: 'OPENAI_API_KEY ausente na Vercel.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      })
    }

    const body = await req.json().catch(() => null)
    const messages = normalizeMessages(body)

    if (!messages.length) {
      return new Response(
        JSON.stringify({ error: 'Body inválido. Envie { message } ou { messages: [{role, content}] }.' }),
        { status: 400, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      )
    }

    const stream = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      stream: true,
      temperature: 0.7,
      // ✅ evita “respostas infinitas” que podem estourar timeout
      max_tokens: 800,
      messages: [
        {
          role: 'system',
          content:
            'Você é a RicardoIA. Responda em português do Brasil, claro e profissional. Use tópicos quando ajudar.',
        },
        ...messages,
      ],
    })

    const encoder = new TextEncoder()

    const sseStream = new ReadableStream({
      async start(controller) {
        const send = (obj: any) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`))
        }

        // ✅ keep-alive: envia ping se ficar muito tempo sem mandar dados
        let lastSend = Date.now()
        const pingIfNeeded = () => {
          const now = Date.now()
          if (now - lastSend > 8000) {
            // comentário SSE (não quebra JSON)
            controller.enqueue(encoder.encode(`: ping\n\n`))
            lastSend = now
          }
        }

        try {
          for await (const part of stream) {
            pingIfNeeded()

            const text = part.choices?.[0]?.delta?.content || ''
            if (text) {
              send({ type: 'delta', text })
              lastSend = Date.now()
            }
          }

          send({ type: 'done' })
        } catch (err: any) {
          console.error('SSE streaming error:', err)
          send({ type: 'error', message: String(err?.message ?? err) })
        } finally {
          controller.close()
        }
      },
    })

    return new Response(sseStream, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
      },
    })
  } catch (err: any) {
    console.error('Route error:', err)
    return new Response(JSON.stringify({ error: 'Erro no /api/chat', details: String(err?.message ?? err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    })
  }
}