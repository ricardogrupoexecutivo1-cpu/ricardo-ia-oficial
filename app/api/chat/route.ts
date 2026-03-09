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
        {
          onConflict: 'company_id,user_id,key',
        }
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
    normalized.includes('o que você é') ||
    normalized.includes('o que voce e') ||
    normalized.includes('quem é a aurora') ||
    normalized.includes('quem e a aurora')

  if (asksWho) {
    return `Eu sou Aurora IA, a inteligência artificial da plataforma RicardoIA. Estou aberta para testes públicos e posso ajudar com ideias, negócios, conhecimento, tecnologia, receitas e muito mais.`
  }

  const asksLink =
    normalized.includes('qual é seu link') ||
    normalized.includes('qual e seu link') ||
    normalized.includes('qual é o link') ||
    normalized.includes('qual e o link') ||
    normalized.includes('onde te acesso') ||
    normalized.includes('como acessar') ||
    normalized.includes('onde usar') ||
    normalized.includes('onde encontro a aurora') ||
    normalized.includes('onde encontro você') ||
    normalized.includes('onde encontro voce')

  if (asksLink) {
    return `Você pode usar a Aurora IA em ${siteUrl}`
  }

  const asksApp =
    normalized.includes('você tem app') ||
    normalized.includes('voce tem app') ||
    normalized.includes('tem app') ||
    normalized.includes('como baixar') ||
    normalized.includes('como instalar') ||
    normalized.includes('baixar no celular') ||
    normalized.includes('baixar no pc') ||
    normalized.includes('instalar no celular') ||
    normalized.includes('tem aplicativo')

  if (asksApp) {
    return `Você pode acessar a Aurora IA em ${siteUrl}. No celular, abra o site no navegador e use a opção “Adicionar à tela inicial” para instalar como aplicativo. No computador, basta acessar normalmente pelo navegador.`
  }

  const asksCapabilities =
    normalized.includes('o que você faz') ||
    normalized.includes('o que voce faz') ||
    normalized.includes('o que a aurora faz') ||
    normalized.includes('no que você ajuda') ||
    normalized.includes('no que voce ajuda') ||
    normalized.includes('como você pode ajudar') ||
    normalized.includes('como voce pode ajudar')

  if (asksCapabilities) {
    return `Eu posso ajudar com ideias de negócios, tecnologia, conhecimento, receitas, curiosidades, organização de informações e muito mais. Você pode me usar agora em ${siteUrl}`
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
      return new Response(JSON.stringify({ reply: directAnswer }), {
        status: 200,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      })
    }

    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.3,
      messages: [
        {
          role: 'system',
          content:
            'Você é Aurora IA, a inteligência artificial da plataforma RicardoIA. Responda sempre em português do Brasil, de forma clara, útil e amigável. Quando fizer sentido, mencione que a Aurora está disponível em https://ricardoiaoficial.com',
        },
        {
          role: 'user',
          content: message,
        },
      ],
    })

    const assistantText =
      completion.choices?.[0]?.message?.content || 'Sem resposta.'

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