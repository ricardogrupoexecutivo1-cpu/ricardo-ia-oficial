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

type FactRow = {
  fact: string
}

function makeTitleFromMessage(message: string) {
  const clean = message.replace(/\s+/g, ' ').trim()

  if (!clean) {
    return 'Nova conversa'
  }

  return clean.length > 60 ? `${clean.slice(0, 60)}...` : clean
}

function normalizeText(text: string) {
  return text.replace(/\s+/g, ' ').trim()
}

function extractFactsFromMessage(message: string) {
  const text = normalizeText(message)
  const lower = text.toLowerCase()
  const facts = new Set<string>()

  const patterns = [
    {
      regex: /\bmeu nome é\s+([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ\s'-]{1,60})/i,
      build: (match: RegExpMatchArray) =>
        `O nome do usuário é ${normalizeText(match[1])}.`,
    },
    {
      regex: /\beu sou o fundador da\s+([A-Za-zÀ-ÿ0-9][A-Za-zÀ-ÿ0-9\s'-]{1,80})/i,
      build: (match: RegExpMatchArray) =>
        `O usuário é o fundador da ${normalizeText(match[1])}.`,
    },
    {
      regex: /\beu sou a fundadora da\s+([A-Za-zÀ-ÿ0-9][A-Za-zÀ-ÿ0-9\s'-]{1,80})/i,
      build: (match: RegExpMatchArray) =>
        `A usuária é a fundadora da ${normalizeText(match[1])}.`,
    },
    {
      regex:
        /\bminha esposa (?:se chama|chama-se|é)\s+([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ\s'-]{1,60})/i,
      build: (match: RegExpMatchArray) =>
        `A esposa do usuário se chama ${normalizeText(match[1])}.`,
    },
    {
      regex:
        /\bmeu marido (?:se chama|chama-se|é)\s+([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ\s'-]{1,60})/i,
      build: (match: RegExpMatchArray) =>
        `O marido da usuária se chama ${normalizeText(match[1])}.`,
    },
  ]

  for (const pattern of patterns) {
    const match = text.match(pattern.regex)
    if (match) {
      facts.add(pattern.build(match))
    }
  }

  if (
    lower.includes('minha esposa neida') ||
    lower.includes('minha esposa é neida') ||
    lower.includes('minha esposa se chama neida')
  ) {
    facts.add('A esposa do usuário se chama Neida.')
  }

  if (
    lower.includes('eu ricardo') ||
    lower.includes('sou ricardo') ||
    lower.includes('me chamo ricardo')
  ) {
    facts.add('O nome do usuário é Ricardo.')
  }

  return Array.from(facts)
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
      .order('created_at', { ascending: true })
      .limit(30)

    if (memoryError) {
      return Response.json(
        { error: `Erro ao buscar memória: ${memoryError.message}` },
        { status: 500 }
      )
    }

    let permanentFacts: FactRow[] = []

    if (userId) {
      const { data: factRows, error: factError } = await supabaseAdmin
        .from('user_facts')
        .select('fact')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(20)

      if (factError) {
        return Response.json(
          { error: `Erro ao buscar fatos: ${factError.message}` },
          { status: 500 }
        )
      }

      permanentFacts = (factRows || []) as FactRow[]
    }

    const orderedMemories = (memoryRows || []) as MemoryRow[]

    const historyInput = orderedMemories
      .filter(
        (item) =>
          item &&
          (item.role === 'user' || item.role === 'assistant') &&
          typeof item.content === 'string' &&
          item.content.trim()
      )
      .map((item) => ({
        role: item.role,
        content: item.content,
      }))

    const factText =
      permanentFacts.length > 0
        ? permanentFacts.map((item) => `- ${item.fact}`).join('\n')
        : '- Nenhum fato permanente salvo até agora.'

    const response = await openai.responses.create({
      model: 'gpt-4.1-mini',
      input: [
        {
          role: 'system',
          content: `
Você é a Aurora IA, uma assistente empresarial inteligente, clara, objetiva e útil.
Responda sempre em português do Brasil.

Fatos permanentes conhecidos sobre este usuário:
${factText}

Use esses fatos quando forem relevantes.
Use também o histórico da conversa para manter contexto, continuidade e coerência.
Quando o usuário informar fatos pessoais ou duradouros, trate esses fatos como contexto útil.
Não invente dados que o usuário não informou.
          `.trim(),
        },
        ...historyInput,
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

    if (userId) {
      const extractedFacts = extractFactsFromMessage(userMessage)

      for (const fact of extractedFacts) {
        const normalizedFact = normalizeText(fact)

        const alreadyExists = permanentFacts.some(
          (item) => normalizeText(item.fact).toLowerCase() === normalizedFact.toLowerCase()
        )

        if (!alreadyExists) {
          await supabaseAdmin.from('user_facts').insert([
            {
              user_id: userId,
              fact: normalizedFact,
            },
          ])
        }
      }
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