import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

function getAccessTokenFromRequest(req: Request) {
  const authorization = req.headers.get('authorization') || ''

  if (!authorization.startsWith('Bearer ')) {
    return ''
  }

  return authorization.slice('Bearer '.length).trim()
}

export async function GET(req: Request) {
  try {
    const accessToken = getAccessTokenFromRequest(req)

    if (!accessToken) {
      return Response.json({ user: null }, { status: 200 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    if (!supabaseUrl || !supabaseAnonKey) {
      return Response.json(
        { error: 'Variáveis do Supabase não configuradas.' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })

    const { data, error } = await supabase.auth.getUser(accessToken)

    if (error) {
      return Response.json({ user: null }, { status: 200 })
    }

    return Response.json({ user: data.user }, { status: 200 })
  } catch {
    return Response.json({ user: null }, { status: 200 })
  }
}