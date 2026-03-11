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

    const prompt =
      typeof body.prompt === 'string' ? body.prompt.trim() : ''

    if (!prompt) {
      return Response.json(
        { error: 'Prompt da imagem não informado.' },
        { status: 400 }
      )
    }

    const result = await openai.images.generate({
      model: 'gpt-image-1',
      prompt,
      size: '1024x1024',
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
        error: error?.message || 'Erro ao gerar imagem.',
      },
      { status: 500 }
    )
  }
}