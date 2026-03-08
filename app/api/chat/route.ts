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

  const branchesLocation = userText.match(
    /filiais?\s+em\s+([A-Za-zÀ-ÿ\s]+?)(?=\s+prazo|\s+nosso|\s+temos|[.!?]|$)/i
  )

  if (branchesLocation) {
    facts.push({
      key: 'branches_location',
      value: branchesLocation[1].trim(),
      confidence: 0.95,
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

  return facts
}

async function upsertFacts(companyId: string, userId: string, facts: Fact[]) {
  for (const f of facts) {
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
  }
}

function memoryMapFromRows(memRows: any[] | null) {
  const map = new Map<string, string>()
  for (const row of memRows || []) {
    map.set(row.key, row.value)
  }
  return map
}

function buildMemoryConfirmation(facts: Fact[]) {
  if (!facts.length) return null

  const lines: string[] = []

  for (const f of facts) {
    if (f.key === 'drivers_count') lines.push(`motoristas: ${f.value}`)
    if (f.key === 'companies_count') lines.push(`empresas: ${f.value}`)
    if (f.key === 'branches_count') lines.push(`filiais: ${f.value}`)
    if (f.key === 'branches_location') lines.push(`local das filiais: ${f.value}`)
    if (f.key === 'payment_terms_default') lines.push(`prazo padrão: ${f.value}`)
  }

  return `Informações salvas com sucesso:\n\n- ${lines.join('\n- ')}`
}

function buildDirectAnswer(message: string, memory: Map<string, string>) {
  if (/quantos motoristas/i.test(message) && memory.has('drivers_count')) {
    return `Temos ${memory.get('drivers_count')} motoristas.`
  }

  if (/quantas empresas/i.test(message) && memory.has('companies_count')) {
    return `Temos ${memory.get('companies_count')} empresas.`
  }

  if (/quantas filiais/i.test(message) && memory.has('branches_count')) {
    return `Temos ${memory.get('branches_count')} filiais.`
  }

  if (/onde ficam.*filiais/i.test(message) && memory.has('branches_location')) {
    return `Nossas filiais ficam em ${memory.get('branches_location')}.`
  }

  if (/prazo/i.test(message) && memory.has('payment_terms_default')) {
    return `Nosso prazo padrão de pagamento é ${memory.get('payment_terms_default')}.`
  }

  return null
}

function isSystemQuestion(message: string) {
  return /clientes|viagens|faturas|pagamentos|receb/i.test(message)
}

async function getErpInsights(baseUrl: string) {
  const response = await fetch(`${baseUrl}/api/erp-insights`, { cache: 'no-store' })
  if (!response.ok) return null
  return response.json()
}

export async function POST(req: Request) {
  const body = await req.json()

  const userId = safeStr(body.userId)
  const companyId = safeStr(body.companyId)
  const conversationId = safeStr(body.conversationId)
  const message = safeStr(body.message)

  await supabaseAdmin.from('messages').insert({
    conversation_id: conversationId,
    company_id: companyId,
    user_id: userId,
    role: 'user',
    content: message,
  })

  const facts = extractFacts(message)
  await upsertFacts(companyId, userId, facts)

  const { data: memRows } = await supabaseAdmin
    .from('memories')
    .select('key,value')
    .eq('company_id', companyId)
    .eq('user_id', userId)

  const memory = memoryMapFromRows(memRows)

  const confirmation = buildMemoryConfirmation(facts)
  if (confirmation) {
    return new Response(JSON.stringify({ reply: confirmation }), { status: 200 })
  }

  const direct = buildDirectAnswer(message, memory)
  if (direct) {
    return new Response(JSON.stringify({ reply: direct }), { status: 200 })
  }

  if (isSystemQuestion(message)) {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!
    const erp = await getErpInsights(baseUrl)

    if (erp?.ok) {
      const i = erp.insights

      const text =
        `Situação atual do sistema:\n\n` +
        `Clientes: ${i.clients}\n` +
        `Motoristas: ${i.drivers}\n` +
        `Viagens: ${i.trips}\n` +
        `Notas/Faturas: ${i.invoices}\n` +
        `Pagamentos: ${i.payments}\n` +
        `Recebíveis: ${i.receivables}`

      return new Response(JSON.stringify({ reply: text }), { status: 200 })
    }
  }

  const completion = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: message }],
  })

  const reply = completion.choices[0].message.content || 'Sem resposta.'

  return new Response(JSON.stringify({ reply }), { status: 200 })
}
