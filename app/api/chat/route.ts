import OpenAI from 'openai'

export const runtime = 'nodejs'

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null)
    const messages = body?.messages || []

    const stream = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      stream: true,
      messages: [
        {
          role: 'system',
          content:
            'Você é a RicardoIA. Responda em português do Brasil de forma clara e profissional.',
        },
        ...messages,
      ],
    })

    const encoder = new TextEncoder()

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const part of stream) {
            const text = part.choices?.[0]?.delta?.content || ''
            controller.enqueue(encoder.encode(text))
          }
        } catch (err) {
          console.error('Streaming error:', err)
        } finally {
          controller.close()
        }
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
      },
    })
  } catch (err: any) {
    console.error('Route error:', err)
    return new Response(
      JSON.stringify({
        error: 'Erro no /api/chat',
        details: String(err?.message ?? err),
      }),
      { status: 500, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
    )
  }
}