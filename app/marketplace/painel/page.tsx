'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { createClient } from '@supabase/supabase-js'

type MarketplaceOrder = {
  id?: string
  order_code?: string
  product_id?: string
  product_name?: string
  buyer_name?: string
  buyer_phone?: string
  buyer_city?: string
  buyer_state?: string
  delivery_address?: string
  status?: string
  total_amount?: number | string
  created_at?: string
  updated_at?: string
}

type DeliveryData = {
  nomeRecebedor?: string
  telefone?: string
  email?: string
  cep?: string
  endereco?: string
  numero?: string
  complemento?: string
  bairro?: string
  cidade?: string
  estado?: string
}

type InterestProduct = {
  id?: string
  nome?: string
  preco?: string | number
  categoria?: string
  estoque?: string
  status?: string
  descricao?: string
}

type DataOrigin = 'supabase' | 'local' | 'vazio'

type LocalKeyDebug = {
  key: string
  kind: 'array' | 'object' | 'text' | 'empty' | 'invalid_json'
  items: number
  preview: string
}

type DedupedOrder = MarketplaceOrder & {
  duplicate_count: number
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null

const ORDER_KEY = 'aurora-marketplace-pedidos'
const DELIVERY_KEY = 'aurora_marketplace_comprador_entrega'
const INTEREST_KEY = 'aurora_marketplace_interesse_produto'

function toCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

function parseMoney(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) return value

  if (typeof value === 'string') {
    const cleaned = value
      .replace(/[^\d,.,-]/g, '')
      .replace(/\.(?=\d{3}(?:\D|$))/g, '')
      .replace(',', '.')

    const parsed = Number(cleaned)
    return Number.isFinite(parsed) ? parsed : 0
  }

  return 0
}

function buildPreview(value: string) {
  return value.length > 140 ? `${value.slice(0, 140)}...` : value
}

function safeJsonParse<T>(raw: string | null): T | null {
  if (!raw) return null

  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

function composeAddress(delivery: DeliveryData | null) {
  if (!delivery) return ''

  const parts = [
    delivery.endereco,
    delivery.numero,
    delivery.complemento,
    delivery.bairro,
    delivery.cidade,
    delivery.estado,
    delivery.cep,
  ].filter(Boolean)

  return parts.join(', ')
}

function normalizeText(value: unknown) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

function normalizeSupabaseOrder(
  item: any,
  delivery: DeliveryData | null,
  fallbackProduct: InterestProduct | null
): MarketplaceOrder {
  const productName =
    item?.product_name ||
    item?.produto ||
    item?.nome_produto ||
    fallbackProduct?.nome ||
    'Produto não informado'

  const buyerName =
    item?.buyer_name ||
    item?.nome ||
    item?.cliente ||
    delivery?.nomeRecebedor ||
    'Comprador não informado'

  const buyerPhone =
    item?.buyer_phone ||
    item?.telefone ||
    item?.whatsapp ||
    delivery?.telefone ||
    'Não informado'

  const buyerCity =
    item?.buyer_city ||
    item?.cidade ||
    delivery?.cidade ||
    'Não informada'

  const buyerState =
    item?.buyer_state ||
    item?.estado ||
    delivery?.estado ||
    ''

  const deliveryAddress =
    item?.delivery_address ||
    item?.endereco ||
    composeAddress(delivery) ||
    'Endereço ainda não informado.'

  return {
    id: item?.id || '',
    order_code: item?.order_code || item?.codigo || item?.codigo_pedido || item?.id || '',
    product_id: item?.product_id || item?.produto_id || fallbackProduct?.id || '',
    product_name: productName,
    buyer_name: buyerName,
    buyer_phone: buyerPhone,
    buyer_city: buyerCity,
    buyer_state: buyerState,
    delivery_address: deliveryAddress,
    status: item?.status || 'pendente',
    total_amount:
      item?.total_amount ??
      item?.valor_total ??
      item?.preco ??
      item?.valor ??
      fallbackProduct?.preco ??
      0,
    created_at: item?.created_at || item?.criado_em || item?.data || new Date().toISOString(),
    updated_at: item?.updated_at || item?.atualizado_em || item?.created_at || new Date().toISOString(),
  }
}

function normalizeLocalOrder(
  item: any,
  delivery: DeliveryData | null,
  fallbackProduct: InterestProduct | null
): MarketplaceOrder {
  const productName =
    item?.produtoNome ||
    item?.product_name ||
    item?.produto ||
    item?.nomeProduto ||
    fallbackProduct?.nome ||
    'Produto não informado'

  const buyerName =
    item?.compradorNome ||
    item?.buyer_name ||
    item?.nome ||
    item?.cliente ||
    delivery?.nomeRecebedor ||
    'Comprador não informado'

  const buyerPhone =
    item?.compradorTelefone ||
    item?.buyer_phone ||
    item?.telefone ||
    delivery?.telefone ||
    'Não informado'

  const buyerCity =
    item?.compradorCidade ||
    item?.buyer_city ||
    item?.cidade ||
    delivery?.cidade ||
    'Não informada'

  const buyerState =
    item?.compradorEstado ||
    item?.buyer_state ||
    item?.estado ||
    delivery?.estado ||
    ''

  const deliveryAddress =
    item?.enderecoEntrega ||
    item?.delivery_address ||
    item?.endereco ||
    composeAddress(delivery) ||
    'Endereço ainda não informado.'

  return {
    id: item?.id || '',
    order_code: item?.codigoPedido || item?.order_code || item?.codigo || item?.id || '',
    product_id: item?.produtoId || item?.product_id || fallbackProduct?.id || '',
    product_name: productName,
    buyer_name: buyerName,
    buyer_phone: buyerPhone,
    buyer_city: buyerCity,
    buyer_state: buyerState,
    delivery_address: deliveryAddress,
    status: item?.status || 'pendente',
    total_amount:
      item?.valorTotal ??
      item?.total_amount ??
      item?.preco ??
      item?.valor ??
      fallbackProduct?.preco ??
      0,
    created_at: item?.criadoEm || item?.created_at || item?.data || new Date().toISOString(),
    updated_at: item?.atualizadoEm || item?.updated_at || item?.criadoEm || new Date().toISOString(),
  }
}

function inspectRelevantLocalStorage(): LocalKeyDebug[] {
  if (typeof window === 'undefined') return []

  const keys = [ORDER_KEY, DELIVERY_KEY, INTEREST_KEY]
  const result: LocalKeyDebug[] = []

  for (const key of keys) {
    const raw = localStorage.getItem(key)

    if (!raw) {
      result.push({
        key,
        kind: 'empty',
        items: 0,
        preview: '',
      })
      continue
    }

    try {
      const parsed = JSON.parse(raw)

      if (Array.isArray(parsed)) {
        result.push({
          key,
          kind: 'array',
          items: parsed.length,
          preview: buildPreview(JSON.stringify(parsed[0] ?? parsed).slice(0, 200)),
        })
        continue
      }

      if (parsed && typeof parsed === 'object') {
        result.push({
          key,
          kind: 'object',
          items: 1,
          preview: buildPreview(JSON.stringify(parsed).slice(0, 200)),
        })
        continue
      }

      result.push({
        key,
        kind: 'text',
        items: 1,
        preview: buildPreview(String(parsed)),
      })
    } catch {
      result.push({
        key,
        kind: 'invalid_json',
        items: 0,
        preview: buildPreview(raw),
      })
    }
  }

  return result
}

function readLocalOrders(): {
  orders: MarketplaceOrder[]
  matchedKeys: string[]
  debugKeys: LocalKeyDebug[]
} {
  if (typeof window === 'undefined') {
    return { orders: [], matchedKeys: [], debugKeys: [] }
  }

  const delivery = safeJsonParse<DeliveryData>(localStorage.getItem(DELIVERY_KEY))
  const fallbackProduct = safeJsonParse<InterestProduct>(localStorage.getItem(INTEREST_KEY))
  const rawOrders = safeJsonParse<any[]>(localStorage.getItem(ORDER_KEY))
  const debugKeys = inspectRelevantLocalStorage()

  if (!Array.isArray(rawOrders) || rawOrders.length === 0) {
    return {
      orders: [],
      matchedKeys: [],
      debugKeys,
    }
  }

  const orders = rawOrders
    .map((item) => normalizeLocalOrder(item, delivery, fallbackProduct))
    .sort((a, b) => {
      const dateA = new Date(a.created_at || 0).getTime()
      const dateB = new Date(b.created_at || 0).getTime()
      return dateB - dateA
    })

  return {
    orders,
    matchedKeys: [ORDER_KEY, DELIVERY_KEY, INTEREST_KEY].filter((key) => {
      const raw = localStorage.getItem(key)
      return Boolean(raw)
    }),
    debugKeys,
  }
}

function buildDedupKey(order: MarketplaceOrder) {
  const product = normalizeText(order.product_name)
  const buyer = normalizeText(order.buyer_name)
  const phone = normalizeText(order.buyer_phone)
  const address = normalizeText(order.delivery_address)
  const value = parseMoney(order.total_amount).toFixed(2)

  return [product, buyer, phone, address, value].join('|')
}

function dedupeOrders(orders: MarketplaceOrder[]): DedupedOrder[] {
  const groups = new Map<string, MarketplaceOrder[]>()

  for (const order of orders) {
    const key = buildDedupKey(order)
    const current = groups.get(key) || []
    current.push(order)
    groups.set(key, current)
  }

  const deduped = Array.from(groups.values()).map((group) => {
    const sorted = [...group].sort((a, b) => {
      const dateA = new Date(a.created_at || 0).getTime()
      const dateB = new Date(b.created_at || 0).getTime()
      return dateB - dateA
    })

    const newest = sorted[0]

    return {
      ...newest,
      duplicate_count: group.length,
    }
  })

  return deduped.sort((a, b) => {
    const dateA = new Date(a.created_at || 0).getTime()
    const dateB = new Date(b.created_at || 0).getTime()
    return dateB - dateA
  })
}

export default function MarketplacePainelPage() {
  const [orders, setOrders] = useState<MarketplaceOrder[]>([])
  const [origin, setOrigin] = useState<DataOrigin>('vazio')
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [supabaseInfo, setSupabaseInfo] = useState('Ainda não verificado')
  const [matchedLocalKeys, setMatchedLocalKeys] = useState<string[]>([])
  const [localDebugKeys, setLocalDebugKeys] = useState<LocalKeyDebug[]>([])

  useEffect(() => {
    async function loadOrders() {
      setLoading(true)
      setErrorMessage('')
      setSupabaseInfo('Verificando leitura no Supabase...')

      const localDelivery =
        typeof window !== 'undefined'
          ? safeJsonParse<DeliveryData>(localStorage.getItem(DELIVERY_KEY))
          : null

      const localInterest =
        typeof window !== 'undefined'
          ? safeJsonParse<InterestProduct>(localStorage.getItem(INTEREST_KEY))
          : null

      try {
        if (!supabase) {
          setSupabaseInfo('Supabase indisponível: variáveis públicas ausentes.')
        } else {
          const { data, error } = await supabase
            .from('marketplace_orders')
            .select('*')
            .order('created_at', { ascending: false })

          if (!error && Array.isArray(data) && data.length > 0) {
            setOrders(
              data.map((item) => normalizeSupabaseOrder(item, localDelivery, localInterest))
            )
            setOrigin('supabase')
            setSupabaseInfo(`Leitura Supabase OK: ${data.length} pedido(s) encontrado(s).`)

            const localResult = readLocalOrders()
            setMatchedLocalKeys(localResult.matchedKeys)
            setLocalDebugKeys(localResult.debugKeys)

            setLoading(false)
            return
          }

          if (error) {
            const message =
              error.message || 'Erro desconhecido ao ler marketplace_orders.'
            setSupabaseInfo(`Falha ao ler Supabase: ${message}`)
          } else {
            setSupabaseInfo('Supabase respondeu sem erro, mas sem pedidos.')
          }
        }

        const localResult = readLocalOrders()
        setMatchedLocalKeys(localResult.matchedKeys)
        setLocalDebugKeys(localResult.debugKeys)

        if (localResult.orders.length > 0) {
          setOrders(localResult.orders)
          setOrigin('local')
        } else {
          setOrders([])
          setOrigin('vazio')
        }
      } catch (error: any) {
        console.error('Erro ao carregar painel do marketplace:', error)
        setErrorMessage('Não foi possível carregar os pedidos agora.')

        const maybeMessage =
          typeof error?.message === 'string' ? error.message : 'Erro inesperado.'
        setSupabaseInfo(`Erro geral na leitura: ${maybeMessage}`)

        const localResult = readLocalOrders()
        setMatchedLocalKeys(localResult.matchedKeys)
        setLocalDebugKeys(localResult.debugKeys)

        if (localResult.orders.length > 0) {
          setOrders(localResult.orders)
          setOrigin('local')
        } else {
          setOrders([])
          setOrigin('vazio')
        }
      } finally {
        setLoading(false)
      }
    }

    loadOrders()
  }, [])

  const dedupedOrders = useMemo(() => dedupeOrders(orders), [orders])

  const metrics = useMemo(() => {
    const totalBruto = orders.length
    const totalExibido = dedupedOrders.length
    const duplicadosOcultos = Math.max(totalBruto - totalExibido, 0)

    const pendentes = dedupedOrders.filter((item) => {
      const status = String(item.status || '').toLowerCase()
      return (
        status.includes('pend') ||
        status.includes('aguard') ||
        status.includes('confirm')
      )
    }).length

    const concluidos = dedupedOrders.filter((item) => {
      const status = String(item.status || '').toLowerCase()
      return (
        status.includes('conclu') ||
        status.includes('entreg') ||
        status.includes('receb')
      )
    }).length

    const valorTotal = dedupedOrders.reduce((sum, item) => {
      return sum + parseMoney(item.total_amount)
    }, 0)

    return {
      totalBruto,
      totalExibido,
      duplicadosOcultos,
      pendentes,
      concluidos,
      valorTotal,
    }
  }, [orders, dedupedOrders])

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.heroTop}>
          <div>
            <p style={styles.kicker}>Aurora Marketplace • Painel</p>
            <h1 style={styles.title}>Painel-resumo geral</h1>
            <p style={styles.subtitle}>
              Camada isolada para acompanhar pedidos reais do Marketplace sem misturar
              catálogo, interesse ou outros módulos. O sistema tenta ler o Supabase
              primeiro, mantém fallback local e deduplica apenas a exibição do painel.
            </p>
          </div>

          <div style={styles.actions}>
            <Link href="/marketplace" style={styles.secondaryButton}>
              Voltar ao Marketplace
            </Link>
            <Link href="/marketplace/comprador" style={styles.primaryButton}>
              Ir ao comprador
            </Link>
          </div>
        </div>

        <div style={styles.notice}>
          Sistema em constante atualização e podem ocorrer instabilidades
          momentâneas durante melhorias.
        </div>
      </section>

      <section style={styles.metricsGrid}>
        <article style={styles.metricCard}>
          <span style={styles.metricLabel}>Pedidos exibidos</span>
          <strong style={styles.metricValue}>{metrics.totalExibido}</strong>
          <span style={styles.metricHelp}>Total executivo após deduplicação visual</span>
        </article>

        <article style={styles.metricCard}>
          <span style={styles.metricLabel}>Pendentes</span>
          <strong style={styles.metricValue}>{metrics.pendentes}</strong>
          <span style={styles.metricHelp}>Pedidos aguardando avanço</span>
        </article>

        <article style={styles.metricCard}>
          <span style={styles.metricLabel}>Concluídos</span>
          <strong style={styles.metricValue}>{metrics.concluidos}</strong>
          <span style={styles.metricHelp}>Pedidos recebidos ou entregues</span>
        </article>

        <article style={styles.metricCard}>
          <span style={styles.metricLabel}>Valor total</span>
          <strong style={styles.metricValue}>{toCurrency(metrics.valorTotal)}</strong>
          <span style={styles.metricHelp}>Soma estimada dos pedidos exibidos</span>
        </article>
      </section>

      <section style={styles.statusBar}>
        <div style={styles.statusPill}>
          Origem dos dados:{' '}
          <strong>
            {origin === 'supabase'
              ? 'SUPABASE'
              : origin === 'local'
              ? 'LOCAL'
              : 'SEM DADOS'}
          </strong>
        </div>

        <div style={styles.statusPill}>
          Histórico bruto salvo: <strong>{metrics.totalBruto}</strong>
        </div>

        <div style={styles.statusPill}>
          Duplicados ocultos na exibição: <strong>{metrics.duplicadosOcultos}</strong>
        </div>

        <div style={styles.statusPill}>
          Chaves locais usadas: <strong>{matchedLocalKeys.length}</strong>
        </div>
      </section>

      {errorMessage ? <div style={styles.errorBox}>{errorMessage}</div> : null}

      <section style={styles.debugWrap}>
        <article style={styles.debugCard}>
          <span style={styles.debugLabel}>Diagnóstico do Supabase</span>
          <p style={styles.debugText}>{supabaseInfo}</p>
        </article>

        <article style={styles.debugCard}>
          <span style={styles.debugLabel}>Chaves locais usadas no painel</span>
          {matchedLocalKeys.length === 0 ? (
            <p style={styles.debugText}>Nenhuma chave local útil encontrada.</p>
          ) : (
            <div style={styles.chipsWrap}>
              {matchedLocalKeys.map((key) => (
                <span key={key} style={styles.chip}>
                  {key}
                </span>
              ))}
            </div>
          )}
        </article>
      </section>

      {loading ? (
        <section style={styles.emptyState}>
          <h2 style={styles.emptyTitle}>Carregando pedidos...</h2>
          <p style={styles.emptyText}>
            Estamos buscando primeiro no banco e depois no fallback local.
          </p>
        </section>
      ) : dedupedOrders.length === 0 ? (
        <section style={styles.emptyState}>
          <h2 style={styles.emptyTitle}>Nenhum pedido encontrado ainda</h2>
          <p style={styles.emptyText}>
            O painel não encontrou pedido real nem no Supabase nem na chave local oficial.
          </p>

          <div style={styles.emptyButtons}>
            <Link href="/marketplace/interesse" style={styles.primaryButton}>
              Ir para interesse
            </Link>
            <Link href="/marketplace/comprador/entrega" style={styles.secondaryButton}>
              Ir para entrega
            </Link>
          </div>
        </section>
      ) : (
        <section style={styles.ordersSection}>
          <div style={styles.sectionHeader}>
            <div>
              <p style={styles.sectionKicker}>Leitura operacional</p>
              <h2 style={styles.sectionTitle}>Pedidos recentes</h2>
            </div>
          </div>

          <div style={styles.ordersGrid}>
            {dedupedOrders.map((order, index) => {
              const amount = parseMoney(order.total_amount)
              const createdLabel = order.created_at
                ? new Date(order.created_at).toLocaleString('pt-BR')
                : 'Sem data'

              return (
                <article
                  key={`${order.id || order.order_code || 'pedido'}-${index}`}
                  style={styles.orderCard}
                >
                  <div style={styles.orderTop}>
                    <div>
                      <span style={styles.orderTag}>Pedido</span>
                      <h3 style={styles.orderTitle}>
                        {order.product_name || 'Produto não informado'}
                      </h3>
                    </div>
                    <span style={styles.orderStatus}>
                      {String(order.status || 'pendente').toUpperCase()}
                    </span>
                  </div>

                  <div style={styles.orderInfoGrid}>
                    <div style={styles.infoItem}>
                      <span style={styles.infoLabel}>Comprador</span>
                      <strong style={styles.infoValue}>
                        {order.buyer_name || 'Comprador não informado'}
                      </strong>
                    </div>

                    <div style={styles.infoItem}>
                      <span style={styles.infoLabel}>Telefone</span>
                      <strong style={styles.infoValue}>
                        {order.buyer_phone || 'Não informado'}
                      </strong>
                    </div>

                    <div style={styles.infoItem}>
                      <span style={styles.infoLabel}>Cidade</span>
                      <strong style={styles.infoValue}>
                        {order.buyer_city || 'Não informada'}
                        {order.buyer_state ? ` / ${order.buyer_state}` : ''}
                      </strong>
                    </div>

                    <div style={styles.infoItem}>
                      <span style={styles.infoLabel}>Valor</span>
                      <strong style={styles.infoValue}>{toCurrency(amount)}</strong>
                    </div>
                  </div>

                  <div style={styles.addressBox}>
                    <span style={styles.infoLabel}>Entrega</span>
                    <p style={styles.addressText}>
                      {order.delivery_address || 'Endereço ainda não informado.'}
                    </p>
                  </div>

                  <div style={styles.duplicateRow}>
                    <span style={styles.duplicateBadge}>
                      {order.duplicate_count > 1
                        ? `${order.duplicate_count} registros parecidos agrupados`
                        : 'Registro único'}
                    </span>
                  </div>

                  <div style={styles.orderFooter}>
                    <span style={styles.footerCode}>
                      {order.order_code || order.id || `PED-${index + 1}`}
                    </span>
                    <span style={styles.footerDate}>{createdLabel}</span>
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      )}

      <section style={styles.debugListSection}>
        <div style={styles.sectionHeader}>
          <div>
            <p style={styles.sectionKicker}>Raio-x local</p>
            <h2 style={styles.sectionTitle}>Chaves oficiais observadas</h2>
          </div>
        </div>

        {localDebugKeys.length === 0 ? (
          <div style={styles.debugEmpty}>
            Nenhuma chave oficial do fluxo foi encontrada no navegador.
          </div>
        ) : (
          <div style={styles.debugKeysGrid}>
            {localDebugKeys.map((item) => (
              <article key={item.key} style={styles.debugKeyCard}>
                <div style={styles.debugKeyTop}>
                  <strong style={styles.debugKeyName}>{item.key}</strong>
                  <span style={styles.debugKeyMeta}>
                    {item.kind.toUpperCase()} • {item.items}
                  </span>
                </div>
                <p style={styles.debugPreview}>{item.preview || 'Sem preview.'}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: '100vh',
    background:
      'linear-gradient(180deg, #eef8ff 0%, #f8fcff 45%, #ffffff 100%)',
    padding: '24px 16px 56px',
    color: '#0f172a',
  },
  hero: {
    maxWidth: '1200px',
    margin: '0 auto 20px auto',
    background: 'rgba(255,255,255,0.92)',
    border: '1px solid rgba(8, 145, 178, 0.16)',
    borderRadius: 28,
    padding: 24,
    boxShadow: '0 18px 60px rgba(15, 23, 42, 0.08)',
    backdropFilter: 'blur(10px)',
  },
  heroTop: {
    display: 'flex',
    gap: 16,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  kicker: {
    margin: 0,
    fontSize: 13,
    fontWeight: 800,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: '#0891b2',
  },
  title: {
    margin: '8px 0 10px',
    fontSize: 'clamp(28px, 4vw, 44px)',
    lineHeight: 1.04,
    fontWeight: 900,
    color: '#082f49',
  },
  subtitle: {
    margin: 0,
    maxWidth: 820,
    fontSize: 16,
    lineHeight: 1.7,
    color: '#334155',
  },
  actions: {
    display: 'flex',
    gap: 12,
    flexWrap: 'wrap',
  },
  primaryButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 46,
    padding: '0 18px',
    borderRadius: 14,
    textDecoration: 'none',
    fontWeight: 800,
    background: 'linear-gradient(135deg, #22d3ee 0%, #0ea5e9 100%)',
    color: '#ffffff',
    boxShadow: '0 14px 28px rgba(14, 165, 233, 0.25)',
  },
  secondaryButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 46,
    padding: '0 18px',
    borderRadius: 14,
    textDecoration: 'none',
    fontWeight: 800,
    background: '#ffffff',
    color: '#0f172a',
    border: '1px solid rgba(148, 163, 184, 0.35)',
  },
  notice: {
    marginTop: 18,
    borderRadius: 18,
    padding: '14px 16px',
    background: 'linear-gradient(135deg, #ecfeff 0%, #eff6ff 100%)',
    border: '1px solid rgba(34, 211, 238, 0.2)',
    color: '#155e75',
    fontSize: 14,
    fontWeight: 700,
  },
  metricsGrid: {
    maxWidth: '1200px',
    margin: '0 auto 18px auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 16,
  },
  metricCard: {
    background: '#ffffff',
    borderRadius: 24,
    padding: 20,
    border: '1px solid rgba(8, 145, 178, 0.12)',
    boxShadow: '0 14px 40px rgba(15, 23, 42, 0.06)',
  },
  metricLabel: {
    display: 'block',
    fontSize: 13,
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#0891b2',
  },
  metricValue: {
    display: 'block',
    marginTop: 10,
    fontSize: 30,
    lineHeight: 1.1,
    color: '#082f49',
  },
  metricHelp: {
    display: 'block',
    marginTop: 10,
    fontSize: 14,
    color: '#475569',
  },
  statusBar: {
    maxWidth: '1200px',
    margin: '0 auto 18px auto',
    display: 'flex',
    gap: 12,
    flexWrap: 'wrap',
  },
  statusPill: {
    background: '#ffffff',
    borderRadius: 999,
    padding: '10px 16px',
    border: '1px solid rgba(8, 145, 178, 0.15)',
    color: '#0f172a',
    fontSize: 14,
    fontWeight: 700,
    boxShadow: '0 10px 30px rgba(15, 23, 42, 0.05)',
  },
  errorBox: {
    maxWidth: '1200px',
    margin: '0 auto 18px auto',
    borderRadius: 18,
    padding: '14px 16px',
    background: '#fff1f2',
    border: '1px solid #fecdd3',
    color: '#9f1239',
    fontWeight: 700,
  },
  debugWrap: {
    maxWidth: '1200px',
    margin: '0 auto 18px auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 16,
  },
  debugCard: {
    background: '#ffffff',
    borderRadius: 22,
    padding: 18,
    border: '1px solid rgba(8, 145, 178, 0.12)',
    boxShadow: '0 14px 40px rgba(15, 23, 42, 0.06)',
  },
  debugLabel: {
    display: 'block',
    fontSize: 12,
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#0891b2',
  },
  debugText: {
    margin: '10px 0 0',
    fontSize: 15,
    lineHeight: 1.65,
    color: '#334155',
  },
  chipsWrap: {
    marginTop: 10,
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    display: 'inline-flex',
    padding: '8px 12px',
    borderRadius: 999,
    background: '#ecfeff',
    color: '#155e75',
    fontSize: 13,
    fontWeight: 800,
  },
  emptyState: {
    maxWidth: '1200px',
    margin: '0 auto',
    background: '#ffffff',
    borderRadius: 28,
    padding: 28,
    border: '1px solid rgba(8, 145, 178, 0.12)',
    boxShadow: '0 18px 50px rgba(15, 23, 42, 0.06)',
    textAlign: 'center',
  },
  emptyTitle: {
    margin: 0,
    fontSize: 28,
    color: '#082f49',
  },
  emptyText: {
    margin: '12px auto 0',
    maxWidth: 760,
    fontSize: 16,
    lineHeight: 1.7,
    color: '#475569',
  },
  emptyButtons: {
    marginTop: 20,
    display: 'flex',
    gap: 12,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  ordersSection: {
    maxWidth: '1200px',
    margin: '0 auto 18px auto',
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionKicker: {
    margin: 0,
    fontSize: 13,
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: 1.1,
    color: '#0891b2',
  },
  sectionTitle: {
    margin: '6px 0 0',
    fontSize: 28,
    color: '#082f49',
  },
  ordersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 16,
  },
  orderCard: {
    background: '#ffffff',
    borderRadius: 24,
    padding: 20,
    border: '1px solid rgba(8, 145, 178, 0.12)',
    boxShadow: '0 16px 44px rgba(15, 23, 42, 0.06)',
  },
  orderTop: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 12,
    alignItems: 'flex-start',
  },
  orderTag: {
    display: 'inline-flex',
    padding: '6px 10px',
    borderRadius: 999,
    background: '#ecfeff',
    color: '#155e75',
    fontSize: 12,
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  orderTitle: {
    margin: '10px 0 0',
    fontSize: 22,
    lineHeight: 1.2,
    color: '#082f49',
  },
  orderStatus: {
    whiteSpace: 'nowrap',
    padding: '8px 12px',
    borderRadius: 999,
    background: '#eff6ff',
    color: '#1d4ed8',
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: 0.8,
  },
  orderInfoGrid: {
    marginTop: 18,
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12,
  },
  infoItem: {
    background: '#f8fafc',
    borderRadius: 16,
    padding: 12,
    border: '1px solid rgba(148, 163, 184, 0.15)',
  },
  infoLabel: {
    display: 'block',
    fontSize: 12,
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: '#0891b2',
  },
  infoValue: {
    display: 'block',
    marginTop: 8,
    fontSize: 15,
    lineHeight: 1.45,
    color: '#0f172a',
  },
  addressBox: {
    marginTop: 14,
    background: '#f8fafc',
    borderRadius: 18,
    padding: 14,
    border: '1px solid rgba(148, 163, 184, 0.15)',
  },
  addressText: {
    margin: '8px 0 0',
    color: '#334155',
    lineHeight: 1.6,
    fontSize: 15,
  },
  duplicateRow: {
    marginTop: 14,
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
  },
  duplicateBadge: {
    display: 'inline-flex',
    padding: '8px 12px',
    borderRadius: 999,
    background: '#eff6ff',
    color: '#1d4ed8',
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: 0.3,
  },
  orderFooter: {
    marginTop: 16,
    display: 'flex',
    justifyContent: 'space-between',
    gap: 12,
    flexWrap: 'wrap',
    fontSize: 13,
    color: '#64748b',
    fontWeight: 700,
  },
  footerCode: {
    display: 'inline-flex',
    alignItems: 'center',
  },
  footerDate: {
    display: 'inline-flex',
    alignItems: 'center',
  },
  debugListSection: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  debugEmpty: {
    background: '#ffffff',
    borderRadius: 22,
    padding: 18,
    border: '1px solid rgba(8, 145, 178, 0.12)',
    color: '#475569',
  },
  debugKeysGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 14,
  },
  debugKeyCard: {
    background: '#ffffff',
    borderRadius: 22,
    padding: 16,
    border: '1px solid rgba(8, 145, 178, 0.12)',
    boxShadow: '0 12px 34px rgba(15, 23, 42, 0.05)',
  },
  debugKeyTop: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  debugKeyName: {
    color: '#082f49',
    fontSize: 15,
    lineHeight: 1.4,
    wordBreak: 'break-word',
  },
  debugKeyMeta: {
    color: '#0891b2',
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: 0.8,
  },
  debugPreview: {
    margin: '10px 0 0',
    fontSize: 13,
    lineHeight: 1.6,
    color: '#475569',
    wordBreak: 'break-word',
  },
}