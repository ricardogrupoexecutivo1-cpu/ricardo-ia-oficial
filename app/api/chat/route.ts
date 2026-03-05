import OpenAI from 'openai'

export const runtime = 'nodejs'

type Msg = { role: 'user' | 'assistant' | 'system'; content: string }

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null)

    let messages: Msg[] = []

    if (typeof body?.message === 'string') {
      messages = [{ role: 'user', content: body.message }]
    } else if (Array.isArray(body?.messages)) {
      messages = body.messages
        .filter((m: any) => m?.role && m?.content)
        .map((m: any) => ({ role: m.role, content: String(m.content) }))
    } else {
      return new Response(
        JSON.stringify({
          error: 'Body inválido. Envie { message: string } ou { messages: [{role, content}] }.',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      )
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'OPENAI_API_KEY não configurada na Vercel.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      })
    }

    const client = new OpenAI({ apiKey })

    const resp = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Você é a RicardoIA. Responda em português do Brasil.' },
        ...messages,
      ],
      temperature: 0.7,
    })

    const reply = resp.choices?.[0]?.message?.content ?? 'Sem resposta.'

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    })
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        error: 'Erro interno na rota /api/chat.',
        details: String(err?.message ?? err),
      }),
      { status: 500, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
    )
  }
}