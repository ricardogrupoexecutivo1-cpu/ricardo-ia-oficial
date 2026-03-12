import OpenAI from "openai"

export const runtime = "nodejs"
export const maxDuration = 60

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {

    const body = await req.json().catch(() => null)

    if (!body || typeof body !== "object") {
      return Response.json({ error: "Body inválido." }, { status: 400 })
    }

    const prompt = typeof body.prompt === "string" ? body.prompt : ""

    if (!prompt) {
      return Response.json(
        { error: "Descrição da campanha não informada." },
        { status: 400 }
      )
    }

    const systemPrompt = `
Você é um especialista mundial em marketing digital.

Crie uma campanha completa baseada na solicitação do usuário.

Estrutura obrigatória:

1️⃣ TEXTO PARA INSTAGRAM

2️⃣ TEXTO PARA ANÚNCIO

3️⃣ IDEIA DE IMAGEM PARA GERAR

4️⃣ 10 HASHTAGS

5️⃣ ESTRATÉGIA RÁPIDA DE MARKETING

Seja claro, persuasivo e profissional.
`

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: `${systemPrompt}\n\nPedido do usuário:\n${prompt}`,
    })

    const text =
      response.output_text ||
      "Não foi possível gerar a campanha."

    return Response.json({
      campaign: text,
    })

  } catch (error: any) {

    return Response.json(
      {
        error:
          error?.message ||
          "Erro ao gerar campanha de marketing.",
      },
      { status: 500 }
    )
  }
}