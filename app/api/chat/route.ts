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

  const employees =
    userText.match(/(\d{1,3}(?:\.\d{3})*|\d+)\s*empregados?/i) ||
    userText.match(/(\d{1,3}(?:\.\d{3})*|\d+)\s*funcion[áa]rios?/i)

  if (employees) {
    facts.push({
      key: 'employees_count',
      value: normalizeNumber(employees[1]),
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

  const branches =
    userText.match(/(\d{1,3}(?:\.\d{3})*|\d+)\s*filiais?/i)

  if (branches) {
    facts.push({
      key: 'branches_count',
      value: normalizeNumber(branches[1]),
      confidence: 0.98,
    })
  }

  const branchesLocation =
    userText.match(/filiais?\s+em\s+([A-Za-zÀ-ÿ\s]+?)(?:[.!?]|$)/i)

  if (branchesLocation) {
    facts.push({
      key: 'branches_location',
      value: branchesLocation[1].trim(),
      confidence: 0.94,
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

function buildMemoryBlock(map: Map<string, string>) {
  if (map.size === 0) return 'Memórias: nenhuma ainda.'

  const lines: string[] = []

  for (const [key, value] of map.entries()) {
    lines.push(`- ${key}: ${value}`)
  }

  return 'Memórias do usuário/empresa:\n' + lines.join('\n')
}

function buildVectorContextBlock(vectorRows: any[] | null) {
  if (!vectorRows || vectorRows.length === 0) {
    return ''
  }

  const lines = vectorRows
    .filter((r: any) => Number(r?.similarity ?? 0) > 0.25)
    .slice(0, 5)
    .map((r: any, i: number) => `Memória relevante ${i + 1}: ${String(r.content)}`)

  if (lines.length === 0) return ''

  return `
INFORMAÇÕES IMPORTANTES DE CONVERSAS PASSADAS:
${lines.join('\n')}

Se o usuário fizer uma pergunta relacionada a essas informações, utilize-as diretamente na resposta.
`
}

function buildDirectAnswer(message: string, memory: Map<string, string>) {
  const wantsDrivers = /motoristas?/i.test(message)
  const wantsEmployees = /empregados?|funcion[áa]rios?/i.test(message)
  const wantsCompanies = /empresas?/i.test(message)
  const wantsPrazo = /prazo/i.test(message)
  const wantsBranches = /filiais?/i.test(message)
  const wantsLocation = /onde|localiza|ficam|fica/i.test(message)

  const isQuestion =
    /\?/.test(message) ||
    /\bquantos?\b/i.test(message) ||
    /\bqual\b/i.test(message) ||
    /\bquais\b/i.test(message) ||
    /\bonde\b/i.test(message)

  if (!isQuestion) return null

  if (wantsBranches && wantsLocation && memory.has('branches_location')) {
    const count = memory.get('branches_count')
    const location = memory.get('branches_location')
    if (count && location) {
      return `Suas ${count} filiais ficam em ${location}.`
    }
    return `Suas filiais ficam em ${location}.`
  }

  const countParts: string[] = []
  let prazoPart: string | null = null

  if (wantsDrivers && memory.has('drivers_count')) {
    countParts.push(`${memory.get('drivers_count')} motoristas`)
  }

  if (wantsEmployees && memory.has('employees_count')) {
    countParts.push(`${memory.get('employees_count')} empregados`)
  }

  if (wantsCompanies && memory.has('companies_count')) {
    countParts.push(`${memory.get('companies_count')} empresas`)
  }

  if (wantsBranches && memory.has('branches_count')) {
    countParts.push(`${memory.get('branches_count')} filiais`)
  }

  if (wantsPrazo) {
    if (memory.has('payment_terms_list')) {
      prazoPart = memory.get('payment_terms_list') || null
    } else if (memory.has('payment_terms_default')) {
      prazoPart = memory.get('payment_terms_default') || null
    }
  }

  if (countParts.length === 0 && !prazoPart) return null

  let countsText = ''
  if (countParts.length === 1) {
    countsText = countParts[0]
  } else if (countParts.length === 2) {
    countsText = `${countParts[0]} e ${countParts[1]}`
  } else if (countParts.length > 2) {
    countsText = `${countParts.slice(0, -1).join(', ')} e ${countParts[countParts.length - 1]}`
  }

  if (countsText && prazoPart) {
    return `Você tem ${countsText} e seus prazos são ${prazoPart}.`
  }

  if (countsText) {
    return `Você tem ${countsText}.`
  }

  return `Seus prazos são ${prazoPart}.`
}

async function createEmbedding(text: string) {
  const response = await client.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  })

  return response.data[0].embedding
}

async function saveVectorMemory(params: {
  companyId: string
  userId: string
  conversationId: string
  content: string
}) {
  try {
    const embedding = await createEmbedding(params.content)

    await supabaseAdmin.from('memory_vectors').insert({
      company_id: params.companyId,
      user_id: params.userId,
      conversation_id: params.conversationId,
      content: params.content,
      embedding,
    })
  } catch (e) {
    console.error('Erro ao salvar memória vetorial:', e)
  }
}

async function searchVectorMemory(params: {
  companyId: string
  userId: string
  query: string
}) {
  try {
    const queryEmbedding = await createEmbedding(params.query)

    const { data, error } = await supabaseAdmin.rpc('match_memory_vectors', {
      query_embedding: queryEmbedding,
      match_count: 5,
      filter_company_id: params.companyId,
      filter_user_id: params.userId,
    })

    if (error) {
      console.error('Erro ao buscar memória vetorial:', error)
      return []
    }

    return data || []
  } catch (e) {
    console.error('Erro ao buscar memória vetorial:', e)
    return []
  }
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
        JSON.stringify({ error: 'Body inválido. Envie { userId, companyId, conversationId, message }.' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
        }
      )
    }

    await supabaseAdmin.from('messages').insert({
      conversation_id: conversationId,
      company_id: companyId,
      user_id: userId,
      role: 'user',
      content: message,
    })

    const currentFacts = extractFacts(message)
    await upsertFacts(companyId, userId, currentFacts)

    await saveVectorMemory({
      companyId,
      userId,
      conversationId,
      content: message,
    })

    const { data: rows } = await supabaseAdmin
      .from('messages')
      .select('role, content')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(30)

    const history: Msg[] = (rows || [])
      .map((r: any) => ({ role: r.role as Role, content: String(r.content) }))
      .filter((m) => m.role === 'user' || m.role === 'assistant')

    const { data: memRows } = await supabaseAdmin
      .from('memories')
      .select('key, value, confidence')
      .eq('company_id', companyId)
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(30)

    const vectorRows = await searchVectorMemory({
      companyId,
      userId,
      query: message,
    })

    const memoryMap = memoryMapFromRows(memRows)
    const memoryBlock = buildMemoryBlock(memoryMap)
    const vectorContextBlock = buildVectorContextBlock(vectorRows)
    const directAnswer = buildDirectAnswer(message, memoryMap)

    const encoder = new TextEncoder()
    let assistantText = ''

    if (directAnswer) {
      assistantText = directAnswer

      const sseStream = new ReadableStream({
        async start(controller) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'delta', text: directAnswer })}\n\n`))
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`))

          await supabaseAdmin.from('messages').insert({
            conversation_id: conversationId,
            company_id: companyId,
            user_id: userId,
            role: 'assistant',
            content: assistantText,
          })

          await saveVectorMemory({
            companyId,
            userId,
            conversationId,
            content: assistantText,
          })

          controller.close()
        },
      })

      return new Response(sseStream, {
        headers: {
          'Content-Type': 'text/event-stream; charset=utf-8',
          'Cache-Control': 'no-cache, no-transform',
          Connection: 'keep-alive',
        },
      })
    }

    const stream = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      stream: true,
      temperature: 0.3,
      max_tokens: 700,
      messages: [
        {
          role: 'system',
          content: `Você é a AURORA do RicardoIA.

Responda sempre em português do Brasil.

REGRAS CRÍTICAS:
- Use SEMPRE as informações abaixo antes de responder.
- Elas são memórias reais do usuário.
- Se a pergunta estiver relacionada a essas memórias, responda usando essas informações.
- Nunca ignore as memórias se elas responderem à pergunta.
- Use o histórico, as memórias e o contexto semântico de conversas antigas como contexto real.
- Quando o usuário fizer uma pergunta objetiva, responda de forma objetiva e direta.
- Evite frases genéricas.
- Seja firme, clara e profissional.

MEMÓRIAS DO USUÁRIO:
${memoryBlock}

MEMÓRIAS SEMÂNTICAS DE CONVERSAS ANTIGAS:
${vectorContextBlock}

Se o usuário perguntar algo que esteja nessas memórias, responda diretamente usando esses dados.
`,
        },
        ...history,
      ],
    })

    const sseStream = new ReadableStream({
      async start(controller) {
        const send = (obj: any) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`))
        }

        try {
          for await (const part of stream) {
            const text = part.choices?.[0]?.delta?.content || ''
            if (text) {
              assistantText += text
              send({ type: 'delta', text })
            }
          }

          send({ type: 'done' })
        } catch (err: any) {
          send({ type: 'error', message: String(err?.message ?? err) })
        } finally {
          if (assistantText.trim()) {
            await supabaseAdmin.from('messages').insert({
              conversation_id: conversationId,
              company_id: companyId,
              user_id: userId,
              role: 'assistant',
              content: assistantText,
            })

            await saveVectorMemory({
              companyId,
              userId,
              conversationId,
              content: assistantText,
            })
          }

          controller.close()
        }
      },
    })

    return new Response(sseStream, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
      },
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