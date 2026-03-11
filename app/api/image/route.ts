import OpenAI from 'openai'

export const runtime = 'nodejs'
export const maxDuration = 60

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

function normalizePrompt(text: string) {
  return text.replace(/\s+/g, ' ').trim()
}

function shortenPrompt(text: string, maxLength = 700) {
  if (text.length <= maxLength) {
    return text
  }

  return `${text.slice(0, maxLength)}...`
}

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

    const rawPrompt = typeof body.prompt === 'string' ? body.prompt : ''
    const normalizedPrompt = normalizePrompt(rawPrompt)

    if (!normalizedPrompt) {
      return Response.json(
        { error: 'Prompt da imagem não informado.' },
        { status: 400 }
      )
    }

    const safePrompt = shortenPrompt(normalizedPrompt, 700)

    const finalPrompt = `
Crie uma imagem de alta qualidade com base no pedido abaixo.

Pedido do usuário:
"${safePrompt}"

Instruções:
- imagem visualmente forte
- composição profissional
- adequada para divulgação digital
- estilo moderno e chamativo
- texto dentro da imagem apenas se o pedido realmente solicitar
- resposta visual limpa e bem organizada
    `.trim()

    const result = await openai.images.generate({
      model: 'gpt-image-1',
      prompt: finalPrompt,
      size: '512x512',
    })

    const imageBase64 = result.data?.[0]?.b64_json

    if (!imageBase64) {
      return Response.json(
        { error: 'Não foi possível gerar a imagem.' },
        { status: 500 }
      )
    }

    const imageUrl = `data:image/png;base64,${imageBase64}`

    return Response.json({ imageUrl }, { status: 200 })
  } catch (error: any) {
    return Response.json(
      {
        error:
          error?.message ||
          'Falha ao gerar imagem. Tente novamente com um pedido um pouco mais curto.',
      },
      { status: 500 }
    )
  }
}