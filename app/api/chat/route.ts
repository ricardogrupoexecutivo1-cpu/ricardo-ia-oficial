import OpenAI from 'openai'

export const runtime = 'nodejs'
export const maxDuration = 60

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

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

    const response = await openai.responses.create({
      model: 'gpt-4.1-mini',
      input: [
        {
          role: 'system',
          content:
            'Você é a Aurora IA, uma assistente empresarial inteligente, clara, objetiva e útil. Responda sempre em português do Brasil.',
        },
        {
          role: 'user',
          content: userMessage,
        },
      ],
    })

    const reply =
      response.output_text?.trim() || 'Não consegui gerar uma resposta agora.'

    return Response.json({ reply })
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