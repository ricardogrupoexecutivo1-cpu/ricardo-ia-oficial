import OpenAI from 'openai'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export const runtime = 'nodejs'
export const maxDuration = 60

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

type Role = 'user' | 'assistant' | 'system'
type Msg = { role: Role; content: string }

function safeStr(x: any) {
  return typeof x === 'string' ? x : ''
}

async function extractFacts(userText: string) {
  const facts: { key: string; value: string; confidence: number }[] = []

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

  const companies =
    userText.match(/(\d+)\s*empresas?/i)

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

function buildMemoryBlock(memRows: any[] | null) {
  if (!memRows || memRows.length === 0) {
    return 'Memórias: nenhuma ainda.'
  }

  return (
    'Memórias do usuário/empresa:\n' +
    memRows.map((m: any) => `- ${m.key}: ${m.value}`).join('\n')
  )
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

    // salva mensagem do usuário
    await supabaseAdmin.from('messages').insert({
      conversation_id: conversationId,
      company_id: companyId,
      user_id: userId,
      role: 'user',
      content: message,
    })

    // extrai fatos da mensagem atual e já faz upsert ANTES da resposta
    const facts = await extractFacts(message)

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

    // histórico
    const { data: rows } = await supabaseAdmin
      .from('messages')
      .select('role, content')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(30)

    const history: Msg[] = (rows || [])
      .map((r: any) => ({ role: r.role as Role, content: String(r.content) }))
      .filter((m) => m.role === 'user' || m.role === 'assistant')

    // memórias atualizadas
    const { data: memRows } = await supabaseAdmin
      .from('memories')
      .select('key, value, confidence')
      .eq('company_id', companyId)
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(30)

    const memoryBlock = buildMemoryBlock(memRows)

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
- Se o usuário atualizar um número ou fato, considere o valor mais recente como o correto.
- Se a resposta já estiver na memória, responda diretamente.
- Seja firme, clara e profissional.

EXEMPLOS DE ESTILO:
Pergunta: "Quantos motoristas eu tenho e qual é o meu prazo?"
Resposta ideal: "Você tem 18 motoristas e seu prazo padrão é de 30 dias."

Pergunta: "Quantos funcionários tenho, quantas empresas tenho e qual é meu novo prazo?"
Resposta ideal: "Você tem 100000 empregados, 4000 empresas e seu novo prazo é de 190 dias."

${memoryBlock}`,
        },
        ...history,
      ],
    })

    const encoder = new TextEncoder()
    let assistantText = ''

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