import { supabaseAdmin } from '@/lib/supabaseAdmin'

export const runtime = 'nodejs'
export const maxDuration = 60

async function tableExists(tableName: string) {
  const { data, error } = await supabaseAdmin.rpc('exec_sql_public_table_exists', {
    table_name_input: tableName,
  }).single()

  if (error) return false
  return Boolean(data)
}

async function safeCount(tableName: string) {
  try {
    const { count, error } = await supabaseAdmin
      .from(tableName)
      .select('*', { count: 'exact', head: true })

    if (error) return null
    return count ?? 0
  } catch {
    return null
  }
}

export async function GET() {
  try {
    const tablesToCheck = [
      'clients',
      'drivers',
      'trips',
      'travel_orders',
      'invoices',
      'payments',
      'receivables',
    ]

    const result: Record<string, number | null> = {}

    for (const table of tablesToCheck) {
      result[table] = await safeCount(table)
    }

    return new Response(
      JSON.stringify({
        ok: true,
        insights: {
          clients: result.clients,
          drivers: result.drivers,
          trips: result.trips ?? result.travel_orders,
          invoices: result.invoices,
          payments: result.payments,
          receivables: result.receivables,
        },
        raw: result,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      }
    )
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: 'Erro ao consultar insights do ERP.',
        details: String(err?.message ?? err),
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      }
    )
  }
}