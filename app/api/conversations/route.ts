import { supabaseAdmin } from '@/lib/supabaseAdmin'

export const runtime = 'nodejs'

function makeTitleFromMessage(message: string) {
  const clean = message.replace(/\s+/g, ' ').trim()

  if (!clean) {
    return 'Nova conversa'
  }

  return clean.length > 60 ? `${clean.slice(0, 60)}...` : clean
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')?.trim() || ''

    if (!userId) {
      return Response.json(
        { error: 'userId não informado.' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('chat_conversations')
      .select('id, user_id, title, created_at, updated_at')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })

    if (error) {
      return Response.json(
        { error: `Erro ao buscar conversas: ${error.message}` },
        { status: 500 }
      )
    }

    return Response.json({ conversations: data || [] }, { status: 200 })
  } catch (error: any) {
    return Response.json(
      {
        error: error?.message || 'Erro ao listar conversas.',
      },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null)

    if (!body || typeof body !== 'object') {
      return Response.json({ error: 'Body inválido.' }, { status: 400 })
    }

    const userId = typeof body.userId === 'string' ? body.userId.trim() : ''
    const firstMessage =
      typeof body.firstMessage === 'string' ? body.firstMessage.trim() : ''

    if (!userId) {
      return Response.json(
        { error: 'userId não informado.' },
        { status: 400 }
      )
    }

    const title = makeTitleFromMessage(firstMessage)

    const { data, error } = await supabaseAdmin
      .from('chat_conversations')
      .insert([
        {
          user_id: userId,
          title,
        },
      ])
      .select('id, user_id, title, created_at, updated_at')
      .single()

    if (error) {
      return Response.json(
        { error: `Erro ao criar conversa: ${error.message}` },
        { status: 500 }
      )
    }

    return Response.json({ conversation: data }, { status: 200 })
  } catch (error: any) {
    return Response.json(
      {
        error: error?.message || 'Erro ao criar conversa.',
      },
      { status: 500 }
    )
  }
}