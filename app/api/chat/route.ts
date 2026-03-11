import OpenAI from 'openai'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export const runtime = 'nodejs'
export const maxDuration = 60

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

type MemoryRow = {
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        { error: 'OPENAI_API_KEY não configurada.' },
        { status: 500 }
      )
    }

    const body = await req.json().catch(() => null)

    if (!body || typeof body !== 'object') {
      return Response.json({ error: 'Body inválido.' }, { status: 400 })
    }

    const sessionId =
      typeof body.sessionId === 'string' ? body.sessionId.trim() : ''

    if (!sessionId) {
      return Response.json(
        { error: 'sessionId não informado.' },
        { status: 400 }
      )
    }

    let userMessage = ''

    if (typeof body.message === 'string') {
      userMessage = body.message.trim()
    } else if (Array.isArray(body.messages)) {
      const lastUserMessage = [...body.messages]
        .reverse()
        .find(
          (item) =>
            item &&
            typeof item === 'object' &&
            item.role === 'user' &&
            typeof item.content === 'string'
        )

      userMessage = lastUserMessage?.content?.trim() || ''
    }

    if (!userMessage) {
      return Response.json(
        { error: 'Mensagem não informada.' },
        { status: 400 }
      )
    }

    const { data: memoryRows, error: memoryError } = await supabaseAdmin
      .from('chat_memories')
      .select('role, content, created_at')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false })
      .limit(12)

    if (memoryError) {
      return Response.json(
        { error: `Erro ao buscar memória: ${memoryError.message}` },
        { status: 500 }
      )
    }

    const orderedMemories = ((memoryRows || []) as MemoryRow[]).reverse()

    const memoryText =
      orderedMemories.length > 0
        ? orderedMemories
            .map((item) => {
              const speaker = item.role === 'user' ? 'Usuário' : 'Aurora'
              return `${speaker}: ${item.content}`
            })
            .join('\n')
        : 'Sem memórias anteriores.'

    const response = await openai.responses.create({
      model: 'gpt-4.1-mini',
      input: [
        {
          role: 'system',
          content: `
Você é a Aurora IA, uma assistente empresarial inteligente, clara, objetiva e útil.
Responda sempre em português do Brasil.

Abaixo está a memória recente desta sessão:
${memoryText}

Use essa memória para manter contexto, continuidade e coerência nas respostas.
Se a memória não for suficiente, responda normalmente sem inventar fatos.
          `.trim(),
        },
        {
          role: 'user',
          content: userMessage,
        },
      ],
    })

    const reply =
      response.output_text?.trim() || 'Não consegui gerar uma resposta agora.'

    const { error: insertError } = await supabaseAdmin
      .from('chat_memories')
      .insert([
        {
          session_id: sessionId,
          role: 'user',
          content: userMessage,
        },
        {
          session_id: sessionId,
          role: 'assistant',
          content: reply,
        },
      ])

    if (insertError) {
      return Response.json(
        { error: `Erro ao salvar memória: ${insertError.message}` },
        { status: 500 }
      )
    }

    return Response.json({ reply })
  } catch (error: any) {
    return Response.json(
      {
        error:
          error?.message || 'Erro ao processar a mensagem na Aurora IA.',
      },
      { status: 500 }
    )
  }
}