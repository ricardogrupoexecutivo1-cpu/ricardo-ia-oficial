import { supabaseAdmin } from '@/lib/supabaseAdmin'

export const runtime = 'nodejs'

function normalizeFact(text: string) {
  return text.replace(/\s+/g, ' ').trim()
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
      .from('user_facts')
      .select('id, user_id, fact, created_at, updated_at')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })

    if (error) {
      return Response.json(
        { error: `Erro ao buscar fatos: ${error.message}` },
        { status: 500 }
      )
    }

    return Response.json({ facts: data || [] }, { status: 200 })
  } catch (error: any) {
    return Response.json(
      {
        error: error?.message || 'Erro ao listar fatos.',
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
    const fact = typeof body.fact === 'string' ? normalizeFact(body.fact) : ''

    if (!userId) {
      return Response.json(
        { error: 'userId não informado.' },
        { status: 400 }
      )
    }

    if (!fact) {
      return Response.json(
        { error: 'fact não informado.' },
        { status: 400 }
      )
    }

    const { data: existingRows, error: existingError } = await supabaseAdmin
      .from('user_facts')
      .select('id, fact')
      .eq('user_id', userId)

    if (existingError) {
      return Response.json(
        { error: `Erro ao verificar fatos: ${existingError.message}` },
        { status: 500 }
      )
    }

    const alreadyExists = (existingRows || []).some(
      (row) => normalizeFact(row.fact).toLowerCase() === fact.toLowerCase()
    )

    if (alreadyExists) {
      return Response.json({ saved: false, duplicated: true }, { status: 200 })
    }

    const { data, error } = await supabaseAdmin
      .from('user_facts')
      .insert([
        {
          user_id: userId,
          fact,
        },
      ])
      .select('id, user_id, fact, created_at, updated_at')
      .single()

    if (error) {
      return Response.json(
        { error: `Erro ao salvar fato: ${error.message}` },
        { status: 500 }
      )
    }

    return Response.json({ saved: true, fact: data }, { status: 200 })
  } catch (error: any) {
    return Response.json(
      {
        error: error?.message || 'Erro ao salvar fato.',
      },
      { status: 500 }
    )
  }
}