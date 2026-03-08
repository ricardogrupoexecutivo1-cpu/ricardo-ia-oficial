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
    if (r.key && r.value) {
      map.set(r.key, r.value)
    }
  }

  return map
}

function buildDirectAnswer(message: string, memory: Map<string, string>) {

  const normalized = message.toLowerCase()

  const asksName =
    normalized.includes('qual é meu nome') ||
    normalized.includes('qual e meu nome') ||
    normalized.includes('qual é o meu nome') ||
    normalized.includes('qual e o meu nome')

  if (asksName) {

    const storedName = memory.get('user_name')

    if (storedName) {
      return `Seu nome é ${storedName}.`
    }
  }

  const nameIntro = message.match(/meu nome é\s+([A-Za-zÀ-ÿ]+)/i)

  if (nameIntro) {
    return `Prazer em conhecê-lo, ${nameIntro[1]}.`
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

      return new Response(
        JSON.stringify({ error: 'Body inválido' }),
        { status: 400 }
      )
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

      return new Response(
        JSON.stringify({ reply: directAnswer }),
        { status: 200 }
      )
    }

    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.3,
      messages: [
        {
          role: 'system',
          content:
            'Você é Aurora, a inteligência artificial da RicardoIA. Responda sempre em português.',
        },
        {
          role: 'user',
          content: message,
        },
      ],
    })

    const assistantText =
      completion.choices?.[0]?.message?.content || 'Sem resposta.'

    return new Response(
      JSON.stringify({ reply: assistantText }),
      { status: 200 }
    )

  } catch (err: any) {

    return new Response(
      JSON.stringify({
        error: 'Erro no /api/chat',
        details: String(err?.message ?? err),
      }),
      { status: 500 }
    )
  }
}