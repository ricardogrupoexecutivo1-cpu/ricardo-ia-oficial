import OpenAI from 'openai'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export const runtime = 'nodejs'
export const maxDuration = 60

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

type Role = 'user' | 'assistant' | 'system'
type Msg = { role: Role; content: string }

type Fact = {
  key: string
  value: string
  confidence: number
}

function safeStr(x: any) {
  return typeof x === 'string' ? x : ''
}

function normalizeNumber(value: string) {
  return value.replace(/\./g, '').replace(/\s+/g, '')
}

function extractAllPrazoDays(text: string) {
  const matches = [...text.matchAll(/(\d{1,3}(?:\.\d{3})*|\d+)\s*dias?/gi)]
  const nums = matches.map((m) => normalizeNumber(m[1])).filter(Boolean)
  return [...new Set(nums)]
}

function extractFacts(userText: string): Fact[] {
  const facts: Fact[] = []

  const userName = userText.match(/meu nome é\s+([A-Za-zÀ-ÿ]+)/i)
  if (userName) {
    facts.push({
      key: 'user_name',
      value: userName[1],
      confidence: 0.98,
    })
  }

  const drivers = userText.match(/(\d{1,3}(?:\.\d{3})*|\d+)\s*motoristas?/i)
  if (drivers) {
    facts.push({
      key: 'drivers_count',
      value: normalizeNumber(drivers[1]),
      confidence: 0.98,
    })
  }

  const companies = userText.match(/(\d{1,3}(?:\.\d{3})*|\d+)\s*empresas?/i)
  if (companies) {
    facts.push({
      key: 'companies_count',
      value: normalizeNumber(companies[1]),
      confidence: 0.98,
    })
  }

  const branches = userText.match(/(\d{1,3}(?:\.\d{3})*|\d+)\s*filiais?/i)
  if (branches) {
    facts.push({
      key: 'branches_count',
      value: normalizeNumber(branches[1]),
      confidence: 0.98,
    })
  }

  const branchesLocation = userText.match(/filiais?\s+em\s+([A-Za-zÀ-ÿ\s]+?)(?:[.!?]|$)/i)
  if (branchesLocation) {
    facts.push({
      key: 'branches_location',
      value: branchesLocation[1].trim(),
      confidence: 0.94,
    })
  }

  const prazoNums = extractAllPrazoDays(userText)

  if (prazoNums.length === 1) {
    facts.push({
      key: 'payment_terms_default',
      value: `${prazoNums[0]} dias`,
      confidence: 0.95,
    })
  }

  if (prazoNums.length > 1) {
    facts.push({
      key: 'payment_terms_default',
      value: `${prazoNums[0]} dias`,
      confidence: 0.9,
    })

    facts.push({
      key: 'payment_terms_list',
      value: prazoNums.map((n) => `${n} dias`).join(', '),
      confidence: 0.96,
    })
  }

  return facts
}

async function upsertFacts(companyId: string, userId: string, facts: Fact[]) {
  for (const f of facts) {
    try {
      await supabaseAdmin.from('memories').upsert(
        {
          company_id: companyId,
          user_id: userId,
          key: f.key,
          value: f.value,
          confidence: f.confidence,
          source_role: 'user',
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'company_id,user_id,key' }
      )
    } catch (e) {
      console.error('Erro ao salvar memória:', e)
    }
  }
}

function memoryMapFromRows(memRows: any[] | null) {
  const map = new Map<string, string>()
  for (const row of memRows || []) {
    if (row?.key && row?.value) {
      map.set(String(row.key), String(row.value))
    }
  }
  return map
}

function buildDirectAnswer(message: string, memory: Map<string, string>) {
  const asksName = /qual é meu nome/i.test(message)

  if (asksName && memory.has('user_name')) {
    return `Seu nome é ${memory.get('user_name')}.`
  }

  const wantsDrivers = /motoristas?/i.test(message)
  const wantsCompanies = /empresas?/i.test(message)
  const wantsBranches = /filiais?/i.test(message)

  if (wantsDrivers && memory.has('drivers_count')) {
    return `Você tem ${memory.get('drivers_count')} motoristas.`
  }

  if (wantsCompanies && memory.has('companies_count')) {
    return `Você tem ${memory.get('companies_count')} empresas.`
  }

  if (wantsBranches && memory.has('branches_location')) {
    return `Suas filiais ficam em ${memory.get('branches_location')}.`
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

    const currentFacts = extractFacts(message)
    await upsertFacts(companyId, userId, currentFacts)

    const { data: memRows } = await supabaseAdmin
      .from('memories')
      .select('key,value')
      .eq('company_id', companyId)
      .eq('user_id', userId)

    const memoryMap = memoryMapFromRows(memRows)

    const directAnswer = buildDirectAnswer(message, memoryMap)

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
        { role: 'user', content: message },
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