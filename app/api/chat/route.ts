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
  const prompt = `
Extraia fatos IMPORTANTES e REUTILIZÁVEIS sobre o usuário/empresa.
Retorne APENAS JSON válido.
Máximo 8 itens.
Use chaves curtas em inglês_snake_case.
Se não houver fatos relevantes, retorne [].

Texto:
"""${userText}"""
`.trim()

  const resp = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.2,
    max_tokens: 300,
    messages: [{ role: 'system', content: prompt }],
  })

  const raw = resp.choices?.[0]?.message?.content ?? '[]'

  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter((x) => x && typeof x.key === 'string' && typeof x.value === 'string')
      .slice(0, 8)
      .map((x) => ({
        key: x.key.trim(),
        value: x.value.trim(),
        confidence: typeof x.confidence === 'number' ? x.confidence : 0.7,
      }))
  } catch {
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
        { status: 400, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      )
    }

    await supabaseAdmin.from('messages').insert({
      conversation_id: conversationId,
      company_id: companyId,
      user_id: userId,
      role: 'user',
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

    const memoryBlock =
      memRows && memRows.length
        ? 'Memórias do usuário/empresa:\n' +
          memRows.map((m: any) => `- ${m.key}: ${m.value} (conf ${Number(m.confidence ?? 0.7).toFixed(2)})`).join('\n')
        : 'Memórias do usuário/empresa: nenhuma ainda.'

    const stream = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      stream: true,
      temperature: 0.7,
      max_tokens: 900,
      messages: [
        {
          role: 'system',
          content:
            `Você é a AURORA do RicardoIA. Responda em português do Brasil, com clareza, objetividade e organização.\n\n${memoryBlock}`,
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
    return new Response(JSON.stringify({ error: 'Erro no /api/chat', details: String(err?.message ?? err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    })
  }
}