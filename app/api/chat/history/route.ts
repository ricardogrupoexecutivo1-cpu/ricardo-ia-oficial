import { supabaseAdmin } from '@/lib/supabaseAdmin'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null)

    if (!body || typeof body !== 'object') {
      return Response.json({ error: 'Body inválido.' }, { status: 400 })
    }

    const userId = typeof body.userId === 'string' ? body.userId.trim() : ''
    const conversationId =
      typeof body.conversationId === 'string'
        ? body.conversationId.trim()
        : ''

    if (!userId) {
      return Response.json(
        { error: 'userId não informado.' },
        { status: 400 }
      )
    }

    if (!conversationId) {
      return Response.json(
        { error: 'conversationId não informado.' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('chat_memories')
      .select('role, content, created_at')
      .eq('user_id', userId)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })

    if (error) {
      return Response.json(
        { error: `Erro ao carregar histórico: ${error.message}` },
        { status: 500 }
      )
    }

    return Response.json({ messages: data || [] }, { status: 200 })
  } catch (error: any) {
    return Response.json(
      {
        error: error?.message || 'Erro ao carregar histórico.',
      },
      { status: 500 }
    )
  }
}