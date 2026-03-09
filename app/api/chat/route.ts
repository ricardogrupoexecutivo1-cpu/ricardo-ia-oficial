import OpenAI from 'openai'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export const runtime = 'nodejs'
export const maxDuration = 60

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

type Fact = {
  key: string
  value: string
  confidence: number
}

type Msg = { role: 'user' | 'assistant'; content: string }

function safeStr(x: any) {
  return typeof x === 'string' ? x : ''
}

function extractFacts(userText: string): Fact[] {
  const facts: Fact[] = []
  const nameMatch = userText.match(/meu nome é\s+([A-Za-zÀ-ÿ]+)/i)

  if (nameMatch) {
    facts.push({
      key: 'user_name',
      value: nameMatch[1],
      confidence: 0.98,
    })
  }

  return facts
}

async function upsertFacts(companyId: string, userId: string, facts: Fact[]) {
  for (const f of facts) {
    await supabaseAdmin
      .from('memories')
      .upsert(
        {
          company_id: companyId,
          user_id: userId,
          key: f.key,
          value: f.value,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'company_id,user_id,key' }
      )
  }
}

function memoryMapFromRows(rows: any[] | null) {
  const map = new Map<string, string>()
  for (const r of rows || []) {
    if (r?.key && r?.value) {
      map.set(String(r.key), String(r.value))
    }
  }
  return map
}

function buildDirectAnswer(message: string, memory: Map<string, string>) {
  const normalized = message.toLowerCase()
  const siteUrl = 'https://ricardoiaoficial.com'

  const asksName =
    normalized.includes('qual é meu nome') ||
    normalized.includes('qual e meu nome') ||
    normalized.includes('qual é o meu nome') ||
    normalized.includes('qual e o meu nome')

  if (asksName && memory.has('user_name')) {
    return `Seu nome é ${memory.get('user_name')}.`
  }

  const nameIntro = message.match(/meu nome é\s+([A-Za-zÀ-ÿ]+)/i)
  if (nameIntro) {
    return `Prazer em conhecê-lo, ${nameIntro[1]}.`
  }

  const asksWho =
    normalized.includes('quem é você') ||
    normalized.includes('quem e voce') ||
    normalized.includes('quem é voce') ||
    normalized.includes('quem é a aurora') ||
    normalized.includes('quem e a aurora')

  if (asksWho) {
    return `Eu sou Aurora IA, a inteligência artificial da plataforma RicardoIA. Estou aberta para testes públicos e posso ajudar com ideias, negócios, conhecimento, tecnologia, receitas e muito mais.`
  }

  const asksLink =
    normalized.includes('qual é seu link') ||
    normalized.includes('qual e seu link') ||
    normalized.includes('onde te acesso') ||
    normalized.includes('como acessar') ||
    normalized.includes('onde usar')

  if (asksLink) {
    return `Você pode usar a Aurora IA em ${siteUrl}`
  }

  const asksLanguages =
    normalized.includes('quantas linguas') ||
    normalized.includes('quantas línguas') ||
    normalized.includes('what languages do you speak') ||
    normalized.includes('which languages do you speak') ||
    normalized.includes('hablas español') ||
    normalized.includes('qué idiomas hablas')

  if (asksLanguages) {
    if (
      normalized.includes('what languages') ||
      normalized.includes('which languages')
    ) {
      return `I can communicate in multiple languages and I usually reply in the same language used by the user. You can try Aurora IA now at ${siteUrl}`
    }

    if (
      normalized.includes('hablas') ||
      normalized.includes('qué idiomas')
    ) {
      return `Puedo comunicarme en varios idiomas y normalmente respondo en el mismo idioma que utiliza el usuario. Puedes probar Aurora IA ahora en ${siteUrl}`
    }

    return `Eu posso conversar em vários idiomas e normalmente respondo no mesmo idioma em que você falar comigo. Você pode testar a Aurora IA agora em ${siteUrl}`
  }

  return null
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null)

    const userId = safeStr(body?.userId)
    const companyId = safeStr(body?.companyId)
    const conversationId = safeStr(body?.conversationId)
    const message = safeStr(body?.message)

    if (!userId || !companyId || !conversationId || !message) {
      return new Response(JSON.stringify({ error: 'Body inválido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      })
    }

    // Salva mensagem do usuário
    await supabaseAdmin.from('messages').insert({
      conversation_id: conversationId,
      company_id: companyId,
      user_id: userId,
      role: 'user',
      content: message,
    })

    const facts = extractFacts(message)
    if (facts.length > 0) {
      await upsertFacts(companyId, userId, facts)
    }

    const { data: memRows } = await supabaseAdmin
      .from('memories')
      .select('key,value')
      .eq('company_id', companyId)
      .eq('user_id', userId)

    const memory = memoryMapFromRows(memRows)

    const directAnswer = buildDirectAnswer(message, memory)
    if (directAnswer) {
      await supabaseAdmin.from('messages').insert({
        conversation_id: conversationId,
        company_id: companyId,
        user_id: userId,
        role: 'assistant',
        content: directAnswer,
      })

      return new Response(JSON.stringify({ reply: directAnswer }), {
        status: 200,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      })
    }

    // Busca histórico da conversa
    const { data: historyRows } = await supabaseAdmin
      .from('messages')
      .select('role,content')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(20)

    const history: Msg[] = (historyRows || []).map((r: any) => ({
      role: r.role,
      content: r.content,
    }))

    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.3,
      messages: [
        {
          role: 'system',
          content:
            'You are Aurora IA, the artificial intelligence of the RicardoIA platform. Always reply in the SAME language used by the user. Be clear, helpful and friendly. When relevant mention that Aurora IA is available at https://ricardoiaoficial.com',
        },
        ...history,
        {
          role: 'user',
          content: message,
        },
      ],
    })

    const assistantText =
      completion.choices?.[0]?.message?.content || 'Sem resposta.'

    // Salva resposta
    await supabaseAdmin.from('messages').insert({
      conversation_id: conversationId,
      company_id: companyId,
      user_id: userId,
      role: 'assistant',
      content: assistantText,
    })

    return new Response(JSON.stringify({ reply: assistantText }), {
      status: 200,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    })
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        error: 'Erro no /api/chat',
        details: String(err?.message ?? err),
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      }
    )
  }
}