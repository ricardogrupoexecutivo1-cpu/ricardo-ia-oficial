import { supabaseAdmin } from '../../../lib/supabaseAdmin'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any))

    const displayName = typeof body?.displayName === 'string' ? body.displayName : 'Visitante'
    const companyName = typeof body?.companyName === 'string' ? body.companyName : 'Empresa Demo'

    const { data: user, error: userErr } = await supabaseAdmin
      .from('app_users')
      .insert({ display_name: displayName })
      .select('id')
      .single()

    if (userErr || !user?.id) {
      return new Response(JSON.stringify({ error: 'Falha ao criar app_user', details: userErr?.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      })
    }

    const { data: company, error: companyErr } = await supabaseAdmin
      .from('companies')
      .insert({ name: companyName })
      .select('id')
      .single()

    if (companyErr || !company?.id) {
      return new Response(JSON.stringify({ error: 'Falha ao criar company', details: companyErr?.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      })
    }

    const { data: conversation, error: convErr } = await supabaseAdmin
      .from('conversations')
      .insert({
        company_id: company.id,
        user_id: user.id,
        title: 'Nova conversa',
      })
      .select('id')
      .single()

    if (convErr || !conversation?.id) {
      return new Response(JSON.stringify({ error: 'Falha ao criar conversation', details: convErr?.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      })
    }

    return new Response(
      JSON.stringify({
        userId: user.id,
        companyId: company.id,
        conversationId: conversation.id,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      }
    )
  } catch (err: any) {
    return new Response(JSON.stringify({ error: 'Erro no /api/init', details: String(err?.message ?? err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    })
  }
}