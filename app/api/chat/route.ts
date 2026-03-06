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

function extractFacts(userText: string): Fact[] {
  const facts: Fact[] = []

  const drivers = userText.match(/(\d+)\s*motoristas?/i)
  if (drivers) {
    facts.push({
      key: 'drivers_count',
      value: drivers[1],
      confidence: 0.98,
    })
  }

  const employees =
    userText.match(/(\d+)\s*empregados?/i) ||
    userText.match(/(\d+)\s*funcion[áa]rios?/i)

  if (employees) {
    facts.push({
      key: 'employees_count',
      value: employees[1],
      confidence: 0.98,
    })
  }

  const companies = userText.match(/(\d+)\s*empresas?/i)
  if (companies) {
    facts.push({
      key: 'companies_count',
      value: companies[1],
      confidence: 0.98,
    })
  }

  const prazo =
    userText.match(/prazo(?:\s*padr[aã]o)?(?:\s*(?:é|e|de|chega\s*a))?\s*(\d+)\s*dias?/i) ||
    userText.match(/(\d+)\s*dias?/i)

  if (prazo) {
    facts.push({
      key: 'payment_terms_default',
      value: `${prazo[1]} dias`,
      confidence: 0.95,
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

function buildDirectAnswer(message: string, memory: Map<string, string>) {
  const wantsDrivers = /motoristas?/i.test(message)
  const wantsEmployees = /empregados?|funcion[áa]rios?/i.test(message)
  const wantsCompanies = /empresas?/i.test(message)
  const wantsPrazo = /prazo/i.test(message)

  const isQuestion =
    /\?/.test(message) ||
    /\bquantos?\b/i.test(message) ||
    /\bqual\b/i.test(message)

  if (!isQuestion) return null

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

  if (wantsPrazo && memory.has('payment_terms_default')) {
    prazoPart = `${memory.get('payment_terms_default')}`
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
    return `Você tem ${countsText} e seu prazo atual é de ${prazoPart}.`
  }

  if (countsText) {
    return `Você tem ${countsText}.`
  }

  return `Seu prazo atual é de ${prazoPart}.`
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

    const memoryMap = memoryMapFromRows(memRows)
    const memoryBlock = buildMemoryBlock(memoryMap)
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

REGRAS IMPORTANTES:
- Use o histórico e as memórias como contexto real.
- Quando o usuário fizer uma pergunta objetiva, responda de forma objetiva e direta.
- Evite frases genéricas como:
  "estou aqui para ajudar"
  "se precisar de mais alguma coisa"
  "estou à disposição"
  "estou pronta para responder"
- Se o usuário atualizar um número ou fato, considere o valor mais recente como o correto.
- Se a resposta já estiver na memória, responda diretamente.
- Seja firme, clara e profissional.

EXEMPLOS DE ESTILO:
Pergunta: "Quantos motoristas eu tenho e qual é o meu prazo?"
Resposta ideal: "Você tem 18 motoristas e seu prazo padrão é de 30 dias."

Pergunta: "Quantos funcionários tenho, quantas empresas tenho e qual é meu novo prazo?"
Resposta ideal: "Você tem 100000 empregados, 4000 empresas e seu prazo atual é de 190 dias."

${memoryBlock}`,
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