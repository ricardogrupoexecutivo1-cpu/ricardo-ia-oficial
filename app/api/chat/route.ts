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

function makeTitleFromMessage(message: string) {
  const clean = message.replace(/\s+/g, ' ').trim()

  if (!clean) {
    return 'Nova conversa'
  }

  return clean.length > 60 ? `${clean.slice(0, 60)}...` : clean
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

    const userId = typeof body.userId === 'string' ? body.userId.trim() : ''
    const sessionId =
      typeof body.sessionId === 'string' ? body.sessionId.trim() : ''
    let conversationId =
      typeof body.conversationId === 'string'
        ? body.conversationId.trim()
        : ''

    if (!userId && !sessionId) {
      return Response.json(
        { error: 'userId e sessionId ausentes.' },
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

    if (userId && !conversationId) {
      const { data: createdConversation, error: createConversationError } =
        await supabaseAdmin
          .from('chat_conversations')
          .insert([
            {
              user_id: userId,
              title: makeTitleFromMessage(userMessage),
            },
          ])
          .select('id')
          .single()

      if (createConversationError || !createdConversation?.id) {
        return Response.json(
          {
            error: `Erro ao criar conversa: ${
              createConversationError?.message || 'sem id'
            }`,
          },
          { status: 500 }
        )
      }

      conversationId = createdConversation.id
    }

    let query = supabaseAdmin
      .from('chat_memories')
      .select('role, content, created_at')

    if (conversationId) {
      query = query.eq('conversation_id', conversationId)
    } else if (userId) {
      query = query.eq('user_id', userId)
    } else {
      query = query.eq('session_id', sessionId)
    }

    const { data: memoryRows, error: memoryError } = await query
      .order('created_at', { ascending: false })
      .limit(20)

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

Abaixo está a memória recente disponível:
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

    const rowsToInsert: Array<{
      user_id?: string
      session_id?: string
      conversation_id?: string
      role: 'user' | 'assistant'
      content: string
    }> = []

    if (userId) {
      rowsToInsert.push(
        {
          user_id: userId,
          conversation_id: conversationId || undefined,
          role: 'user',
          content: userMessage,
        },
        {
          user_id: userId,
          conversation_id: conversationId || undefined,
          role: 'assistant',
          content: reply,
        }
      )
    } else {
      rowsToInsert.push(
        {
          session_id: sessionId,
          role: 'user',
          content: userMessage,
        },
        {
          session_id: sessionId,
          role: 'assistant',
          content: reply,
        }
      )
    }

    const { error: insertError } = await supabaseAdmin
      .from('chat_memories')
      .insert(rowsToInsert)

    if (insertError) {
      return Response.json(
        { error: `Erro ao salvar memória: ${insertError.message}` },
        { status: 500 }
      )
    }

    if (conversationId && userId) {
      await supabaseAdmin
        .from('chat_conversations')
        .update({
          updated_at: new Date().toISOString(),
        })
        .eq('id', conversationId)
        .eq('user_id', userId)
    }

    return Response.json({ reply, conversationId })
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