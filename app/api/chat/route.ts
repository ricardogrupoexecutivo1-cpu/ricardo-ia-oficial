import { NextResponse } from 'next/server'
import OpenAI from 'openai'

export const runtime = 'nodejs' // importante para evitar edge incompatível

type Msg = { role: 'user' | 'assistant' | 'system'; content: string }

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null)

    // Aceita { message: "..." } OU { messages: [...] }
    let messages: Msg[] = []

    if (body?.messages && Array.isArray(body.messages)) {
      messages = body.messages
        .filter((m: any) => m?.role && m?.content)
        .map((m: any) => ({ role: m.role, content: String(m.content) }))
    } else if (typeof body?.message === 'string') {
      messages = [{ role: 'user', content: body.message }]
    } else {
      return NextResponse.json(
        { error: 'Body inválido. Envie { message: string } ou { messages: [{role, content}] }.' },
        { status: 400 }
      )
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OPENAI_API_KEY não configurada na Vercel.' },
        { status: 500 }
      )
    }

    const client = new OpenAI({ apiKey })

    const resp = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Você é a RicardoIA. Responda em português do Brasil, de forma objetiva e útil.' },
        ...messages,
      ],
      temperature: 0.7,
    })

    const reply = resp.choices?.[0]?.message?.content ?? 'Sem resposta.'

    return NextResponse.json({ reply })
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Erro interno na rota /api/chat.', details: String(err?.message ?? err) },
      { status: 500 }
    )
  }
}