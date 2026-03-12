import OpenAI from 'openai'

export const runtime = 'nodejs'
export const maxDuration = 60

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

function normalizePrompt(text: string) {
  return text.replace(/\s+/g, ' ').trim()
}

function shortenText(text: string, maxLength = 1200) {
  if (text.length <= maxLength) {
    return text
  }

  return `${text.slice(0, maxLength)}...`
}

function extractImageIdea(campaignText: string) {
  const match = campaignText.match(
    /(?:3️⃣\s*IDEIA DE IMAGEM(?: PARA GERAR)?|IDEIA DE IMAGEM(?: PARA GERAR)?)([\s\S]*?)(?:4️⃣|HASHTAGS|5️⃣|ESTRATÉGIA|$)/i
  )

  if (match?.[1]) {
    const cleaned = match[1].replace(/\n+/g, ' ').trim()
    if (cleaned) {
      return cleaned
    }
  }

  return ''
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
    const userPrompt = normalizePrompt(rawPrompt)

    if (!userPrompt) {
      return Response.json(
        { error: 'Descrição da campanha não informada.' },
        { status: 400 }
      )
    }

    const campaignPrompt = `
Você é um especialista mundial em marketing digital e criação de campanhas.

Crie uma campanha completa, clara, profissional e persuasiva, em português do Brasil.

Estrutura obrigatória da resposta:

1️⃣ TEXTO PARA INSTAGRAM

2️⃣ TEXTO PARA ANÚNCIO

3️⃣ IDEIA DE IMAGEM PARA GERAR

4️⃣ 10 HASHTAGS

5️⃣ ESTRATÉGIA RÁPIDA DE MARKETING

Regras:
- seja objetivo
- entregue conteúdo pronto para uso
- pense como marketing moderno de startup, produto digital ou empresa
- a ideia de imagem deve ser visual, clara e boa para gerar em IA
    `.trim()

    const campaignResponse = await openai.responses.create({
      model: 'gpt-4.1-mini',
      input: [
        {
          role: 'system',
          content: campaignPrompt,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    })

    const campaignText =
      campaignResponse.output_text?.trim() ||
      'Não foi possível gerar a campanha.'

    const extractedImageIdea = extractImageIdea(campaignText)

    const imagePromptBase = extractedImageIdea || userPrompt
    const safeImagePrompt = shortenText(imagePromptBase, 700)

    const finalImagePrompt = `
Crie uma imagem publicitária de alta qualidade com base neste briefing:

"${safeImagePrompt}"

Regras:
- imagem moderna
- visual forte e profissional
- adequada para Instagram e redes sociais
- composição bonita e chamativa
- texto dentro da imagem apenas se o briefing realmente pedir
- aparência premium e tecnológica
    `.trim()

    const imageResponse = await openai.images.generate({
      model: 'gpt-image-1',
      prompt: finalImagePrompt,
      size: '1024x1024',
    })

    const imageBase64 = imageResponse.data?.[0]?.b64_json

    if (!imageBase64) {
      return Response.json(
        {
          campaign: campaignText,
          error: 'Campanha gerada, mas não foi possível gerar a imagem.',
        },
        { status: 200 }
      )
    }

    const imageUrl = `data:image/png;base64,${imageBase64}`

    return Response.json(
      {
        campaign: campaignText,
        imageUrl,
      },
      { status: 200 }
    )
  } catch (error: any) {
    return Response.json(
      {
        error:
          error?.message ||
          'Erro ao gerar campanha de marketing automática.',
      },
      { status: 500 }
    )
  }
}