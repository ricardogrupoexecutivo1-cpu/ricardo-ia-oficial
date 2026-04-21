'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

type EnderecoComprador = {
  nome?: string
  telefone?: string
  email?: string
  cep?: string
  endereco?: string
  numero?: string
  complemento?: string
  bairro?: string
  cidade?: string
  estado?: string
  referencia?: string
}

type StatusPedidoMarketplace =
  | 'aguardando_confirmacao'
  | 'confirmado'
  | 'em_separacao'
  | 'enviado'
  | 'recebido'

type PedidoMarketplace = {
  id: string
  criadoEm: string
  status: StatusPedidoMarketplace
  produtoId: string
  produtoNome: string
  produtoPreco: number
  produtoCategoria?: string
  produtoImagem?: string
  compradorNome?: string
  compradorTelefone?: string
  compradorEmail?: string
  entrega: EnderecoComprador
  lojaNome?: string
  lojaSlug?: string
  vendedorNome?: string
}

const STORAGE_KEYS_PEDIDOS = [
  'aurora-marketplace-pedidos',
  'marketplace-pedidos',
  'historico-pedidos-marketplace',
  'marketplacePedidos',
] as const

function lerPrimeiroJsonValido<T>(keys: readonly string[], fallback: T): T {
  if (typeof window === 'undefined') return fallback

  for (const key of keys) {
    try {
      const bruto = localStorage.getItem(key)
      if (!bruto) continue
      const parsed = JSON.parse(bruto)
      if (parsed) return parsed as T
    } catch {}
  }

  return fallback
}

function salvarNaPrimeiraChave(keys: readonly string[], value: unknown): boolean {
  if (typeof window === 'undefined') return false
  if (!keys.length) return false

  try {
    localStorage.setItem(keys[0], JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

function moeda(valor: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number.isFinite(valor) ? valor : 0)
}

function formatarData(valor?: string) {
  if (!valor) return 'Data não informada'

  const data = new Date(valor)
  if (Number.isNaN(data.getTime())) return 'Data não informada'

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(data)
}

function textoEndereco(entrega?: EnderecoComprador) {
  if (!entrega) return 'Endereço não informado'

  const linha1 = [entrega.endereco, entrega.numero].filter(Boolean).join(', ')
  const linha2 = [entrega.bairro, entrega.cidade, entrega.estado].filter(Boolean).join(' • ')
  const linha3 = [entrega.cep].filter(Boolean).join(' • ')

  const resultado = [linha1, linha2, linha3].filter(Boolean).join(' — ')
  return resultado || 'Endereço não informado'
}

function normalizarStatus(valor: unknown): StatusPedidoMarketplace {
  const status = String(valor ?? '').trim().toLowerCase()

  if (status === 'confirmado') return 'confirmado'
  if (status === 'em_separacao') return 'em_separacao'
  if (status === 'enviado') return 'enviado'
  if (status === 'recebido') return 'recebido'
  return 'aguardando_confirmacao'
}

function normalizarPedidos(valor: unknown): PedidoMarketplace[] {
  if (!Array.isArray(valor)) return []

  return valor
    .map((item): PedidoMarketplace | null => {
      if (!item || typeof item !== 'object') return null

      const pedido = item as Record<string, unknown>
      const preco = Number(pedido.produtoPreco ?? 0)

      const entregaRaw =
        pedido.entrega && typeof pedido.entrega === 'object'
          ? (pedido.entrega as Record<string, unknown>)
          : {}

      const pedidoNormalizado: PedidoMarketplace = {
        id: String(pedido.id ?? '').trim(),
        criadoEm: String(pedido.criadoEm ?? '').trim(),
        status: normalizarStatus(pedido.status),
        produtoId: String(pedido.produtoId ?? '').trim(),
        produtoNome: String(pedido.produtoNome ?? '').trim() || 'Produto não informado',
        produtoPreco: Number.isFinite(preco) ? preco : 0,
        produtoCategoria: String(pedido.produtoCategoria ?? '').trim() || undefined,
        produtoImagem: String(pedido.produtoImagem ?? '').trim() || undefined,
        compradorNome: String(pedido.compradorNome ?? '').trim() || undefined,
        compradorTelefone: String(pedido.compradorTelefone ?? '').trim() || undefined,
        compradorEmail: String(pedido.compradorEmail ?? '').trim() || undefined,
        entrega: {
          nome: String(entregaRaw.nome ?? '').trim() || undefined,
          telefone: String(entregaRaw.telefone ?? '').trim() || undefined,
          email: String(entregaRaw.email ?? '').trim() || undefined,
          cep: String(entregaRaw.cep ?? '').trim() || undefined,
          endereco: String(entregaRaw.endereco ?? '').trim() || undefined,
          numero: String(entregaRaw.numero ?? '').trim() || undefined,
          complemento: String(entregaRaw.complemento ?? '').trim() || undefined,
          bairro: String(entregaRaw.bairro ?? '').trim() || undefined,
          cidade: String(entregaRaw.cidade ?? '').trim() || undefined,
          estado: String(entregaRaw.estado ?? '').trim() || undefined,
          referencia: String(entregaRaw.referencia ?? '').trim() || undefined,
        },
        lojaNome: String(pedido.lojaNome ?? '').trim() || undefined,
        lojaSlug: String(pedido.lojaSlug ?? '').trim() || undefined,
        vendedorNome: String(pedido.vendedorNome ?? '').trim() || undefined,
      }

      if (!pedidoNormalizado.id) return null

      return pedidoNormalizado
    })
    .filter((item): item is PedidoMarketplace => item !== null)
}

function textoStatus(status: StatusPedidoMarketplace) {
  if (status === 'confirmado') return 'Confirmado'
  if (status === 'em_separacao') return 'Em separação'
  if (status === 'enviado') return 'Enviado'
  if (status === 'recebido') return 'Recebido'
  return 'Aguardando confirmação'
}

function estiloStatus(status: StatusPedidoMarketplace): React.CSSProperties {
  if (status === 'confirmado') {
    return {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '8px 12px',
      borderRadius: 999,
      background: 'rgba(59, 130, 246, 0.12)',
      border: '1px solid rgba(59, 130, 246, 0.18)',
      color: '#1d4ed8',
      fontWeight: 800,
      fontSize: 13,
    }
  }

  if (status === 'em_separacao') {
    return {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '8px 12px',
      borderRadius: 999,
      background: 'rgba(245, 158, 11, 0.12)',
      border: '1px solid rgba(245, 158, 11, 0.18)',
      color: '#b45309',
      fontWeight: 800,
      fontSize: 13,
    }
  }

  if (status === 'enviado') {
    return {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '8px 12px',
      borderRadius: 999,
      background: 'rgba(16, 185, 129, 0.12)',
      border: '1px solid rgba(16, 185, 129, 0.18)',
      color: '#047857',
      fontWeight: 800,
      fontSize: 13,
    }
  }

  if (status === 'recebido') {
    return {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '8px 12px',
      borderRadius: 999,
      background: 'rgba(168, 85, 247, 0.12)',
      border: '1px solid rgba(168, 85, 247, 0.18)',
      color: '#7e22ce',
      fontWeight: 800,
      fontSize: 13,
    }
  }

  return {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '8px 12px',
    borderRadius: 999,
    background: 'rgba(107, 114, 128, 0.12)',
    border: '1px solid rgba(107, 114, 128, 0.18)',
    color: '#374151',
    fontWeight: 800,
    fontSize: 13,
  }
}

export default function MarketplaceCompradorPedidosPage() {
  const [pedidos, setPedidos] = useState<PedidoMarketplace[]>([])
  const [carregando, setCarregando] = useState(true)
  const [mensagem, setMensagem] = useState('')

  useEffect(() => {
    try {
      const bruto = lerPrimeiroJsonValido<unknown>(STORAGE_KEYS_PEDIDOS, [])
      const pedidosNormalizados = normalizarPedidos(bruto)
      setPedidos(pedidosNormalizados)
    } finally {
      setCarregando(false)
    }
  }, [])

  const totalPedidos = pedidos.length

  const valorTotal = useMemo(() => {
    return pedidos.reduce((acc, pedido) => acc + Number(pedido.produtoPreco || 0), 0)
  }, [pedidos])

  const totalAguardando = useMemo(
    () => pedidos.filter((pedido) => pedido.status === 'aguardando_confirmacao').length,
    [pedidos],
  )

  const totalConfirmados = useMemo(
    () => pedidos.filter((pedido) => pedido.status === 'confirmado').length,
    [pedidos],
  )

  const totalSeparacao = useMemo(
    () => pedidos.filter((pedido) => pedido.status === 'em_separacao').length,
    [pedidos],
  )

  const totalEnviados = useMemo(
    () => pedidos.filter((pedido) => pedido.status === 'enviado').length,
    [pedidos],
  )

  const totalRecebidos = useMemo(
    () => pedidos.filter((pedido) => pedido.status === 'recebido').length,
    [pedidos],
  )

  function marcarComoRecebido(pedidoId: string) {
    const pedidosAtualizados = pedidos.map((pedido) =>
      pedido.id === pedidoId
        ? {
            ...pedido,
            status: 'recebido' as StatusPedidoMarketplace,
          }
        : pedido,
    )

    const ok = salvarNaPrimeiraChave(STORAGE_KEYS_PEDIDOS, pedidosAtualizados)

    if (!ok) {
      setMensagem('Não foi possível atualizar o status local do pedido neste momento.')
      return
    }

    setPedidos(pedidosAtualizados)
    setMensagem(`Pedido ${pedidoId} marcado como Recebido com sucesso.`)
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #eef9ff 0%, #f8fdff 45%, #ffffff 100%)',
        color: '#0f172a',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 1220,
          margin: '0 auto',
          padding: '24px 16px 80px',
        }}
      >
        <section
          style={{
            border: '1px solid rgba(14, 116, 144, 0.12)',
            background: 'rgba(255,255,255,0.94)',
            borderRadius: 28,
            boxShadow: '0 20px 60px rgba(15, 23, 42, 0.08)',
            padding: 24,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 10,
              marginBottom: 16,
            }}
          >
            <Link href="/marketplace/comprador/entrega" style={botaoSecundario}>
              Voltar ao comprador
            </Link>
            <Link href="/marketplace/pedido" style={botaoSecundario}>
              Ver pedido local
            </Link>
            <Link href="/marketplace/vendedor/pedidos" style={botaoSecundario}>
              Ver painel do vendedor
            </Link>
          </div>

          <div style={{ display: 'grid', gap: 18 }}>
            <div>
              <div style={badge}>Aurora Marketplace • Comprador • Pedidos</div>
              <h1
                style={{
                  fontSize: 'clamp(2rem, 4vw, 3.4rem)',
                  lineHeight: 1.05,
                  margin: '14px 0 10px',
                  letterSpacing: '-0.03em',
                }}
              >
                HISTÓRICO LOCAL DE PEDIDOS
              </h1>
              <p
                style={{
                  fontSize: 16,
                  lineHeight: 1.7,
                  color: '#334155',
                  maxWidth: 920,
                  margin: 0,
                }}
              >
                Página isolada para o comprador visualizar os pedidos locais já gerados sem quebrar o
                Marketplace. Aqui reunimos número do pedido, produto, valor, comprador e status atualizado.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: 14,
              }}
            >
              <div style={cardResumo}>
                <strong style={tituloMini}>Pedidos</strong>
                <span style={numeroMini}>{String(totalPedidos)}</span>
                <p style={textoMini}>Quantidade de pedidos locais já salvos no histórico.</p>
              </div>

              <div style={cardResumo}>
                <strong style={tituloMini}>Valor total</strong>
                <span style={numeroMini}>{moeda(valorTotal)}</span>
                <p style={textoMini}>Soma local dos pedidos exibidos nesta área do comprador.</p>
              </div>

              <div style={cardResumo}>
                <strong style={tituloMini}>Aguardando</strong>
                <span style={numeroMini}>{String(totalAguardando)}</span>
                <p style={textoMini}>Pedidos que ainda aguardam a primeira confirmação do vendedor.</p>
              </div>

              <div style={cardResumo}>
                <strong style={tituloMini}>Confirmados</strong>
                <span style={numeroMini}>{String(totalConfirmados)}</span>
                <p style={textoMini}>Pedidos que já foram assumidos e confirmados pelo vendedor.</p>
              </div>

              <div style={cardResumo}>
                <strong style={tituloMini}>Separação</strong>
                <span style={numeroMini}>{String(totalSeparacao)}</span>
                <p style={textoMini}>Pedidos já em preparação operacional para envio.</p>
              </div>

              <div style={cardResumo}>
                <strong style={tituloMini}>Enviados</strong>
                <span style={numeroMini}>{String(totalEnviados)}</span>
                <p style={textoMini}>Pedidos já marcados como enviados nesta camada local.</p>
              </div>

              <div style={cardResumo}>
                <strong style={tituloMini}>Recebidos</strong>
                <span style={numeroMini}>{String(totalRecebidos)}</span>
                <p style={textoMini}>Pedidos já confirmados como recebidos pelo comprador.</p>
              </div>
            </div>
          </div>
        </section>

        {mensagem ? (
          <section
            style={{
              ...cardBloco,
              marginBottom: 20,
              border: '1px solid rgba(13, 148, 136, 0.18)',
              background: 'rgba(240, 253, 250, 0.95)',
              color: '#115e59',
            }}
          >
            <strong>{mensagem}</strong>
          </section>
        ) : null}

        {carregando ? (
          <section style={cardBloco}>
            <p style={paragrafoPadrao}>Carregando histórico local do comprador...</p>
          </section>
        ) : pedidos.length === 0 ? (
          <section style={cardBloco}>
            <div style={caixaAviso}>
              Nenhum pedido local foi encontrado ainda. Gere o primeiro pedido pelo fluxo do Marketplace.
            </div>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 10,
                marginTop: 18,
              }}
            >
              <Link href="/marketplace/vendedor/vitrine" style={botaoSecundario}>
                Ir para vitrine
              </Link>
              <Link href="/marketplace/interesse" style={botaoSecundario}>
                Ir para interesse
              </Link>
              <Link href="/marketplace/pedido" style={botaoSecundario}>
                Ir para pedido
              </Link>
            </div>
          </section>
        ) : (
          <section style={cardBloco}>
            <div style={{ marginBottom: 18 }}>
              <h2 style={tituloSecao}>Pedidos do comprador</h2>
              <p style={paragrafoPadrao}>
                Aqui ficam os registros locais já preparados no fluxo validado do Marketplace, agora com
                o status refletindo a atualização feita pelo vendedor e a confirmação final do comprador.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gap: 16,
              }}
            >
              {pedidos.map((pedido) => (
                <article
                  key={pedido.id}
                  style={{
                    border: '1px solid rgba(14,116,144,0.12)',
                    borderRadius: 24,
                    background: 'linear-gradient(180deg, #ffffff 0%, #f7fcff 100%)',
                    boxShadow: '0 16px 36px rgba(15, 23, 42, 0.06)',
                    padding: 18,
                    display: 'grid',
                    gap: 14,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      gap: 12,
                      alignItems: 'flex-start',
                    }}
                  >
                    <div style={{ display: 'grid', gap: 8 }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                        <span style={estiloStatus(pedido.status)}>{textoStatus(pedido.status)}</span>
                        <span style={pillNeutro}>{pedido.id}</span>
                      </div>

                      <div>
                        <h3
                          style={{
                            margin: 0,
                            fontSize: 24,
                            lineHeight: 1.1,
                          }}
                        >
                          {pedido.produtoNome}
                        </h3>

                        <p
                          style={{
                            margin: '8px 0 0',
                            color: '#475569',
                            fontSize: 14,
                            lineHeight: 1.6,
                          }}
                        >
                          Criado em {formatarData(pedido.criadoEm)}
                        </p>
                      </div>
                    </div>

                    <div
                      style={{
                        fontSize: 26,
                        fontWeight: 800,
                        color: '#0f766e',
                        lineHeight: 1,
                      }}
                    >
                      {moeda(pedido.produtoPreco)}
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                      gap: 12,
                    }}
                  >
                    <div style={subCard}>
                      <strong style={labelMini}>Comprador</strong>
                      <div style={valorMini}>{pedido.compradorNome || 'Não informado'}</div>
                    </div>

                    <div style={subCard}>
                      <strong style={labelMini}>Telefone</strong>
                      <div style={valorMini}>{pedido.compradorTelefone || 'Não informado'}</div>
                    </div>

                    <div style={subCard}>
                      <strong style={labelMini}>E-mail</strong>
                      <div style={valorMini}>{pedido.compradorEmail || 'Não informado'}</div>
                    </div>

                    <div style={subCard}>
                      <strong style={labelMini}>Categoria</strong>
                      <div style={valorMini}>{pedido.produtoCategoria || 'Não informada'}</div>
                    </div>

                    <div style={subCard}>
                      <strong style={labelMini}>Entrega</strong>
                      <div style={valorMini}>{textoEndereco(pedido.entrega)}</div>
                    </div>

                    <div style={subCard}>
                      <strong style={labelMini}>Referência</strong>
                      <div style={valorMini}>{pedido.entrega?.referencia || 'Não informada'}</div>
                    </div>
                  </div>

                  {pedido.status === 'enviado' ? (
                    <div
                      style={{
                        display: 'grid',
                        gap: 10,
                        borderTop: '1px solid rgba(148, 163, 184, 0.18)',
                        paddingTop: 14,
                      }}
                    >
                      <strong
                        style={{
                          fontSize: 14,
                          color: '#0f172a',
                        }}
                      >
                        Ação do comprador
                      </strong>

                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: 10,
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => marcarComoRecebido(pedido.id)}
                          style={botaoRecebido}
                        >
                          Marcar como recebido
                        </button>
                      </div>
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}

const badge: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  padding: '8px 12px',
  borderRadius: 999,
  background: 'rgba(6, 182, 212, 0.10)',
  border: '1px solid rgba(6, 182, 212, 0.18)',
  color: '#0f766e',
  fontWeight: 800,
  fontSize: 13,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
}

const cardBloco: React.CSSProperties = {
  border: '1px solid rgba(14, 116, 144, 0.12)',
  background: 'rgba(255,255,255,0.94)',
  borderRadius: 28,
  boxShadow: '0 20px 60px rgba(15, 23, 42, 0.08)',
  padding: 24,
}

const cardResumo: React.CSSProperties = {
  border: '1px solid rgba(14,116,144,0.12)',
  background: '#ffffff',
  borderRadius: 22,
  padding: 18,
  display: 'grid',
  gap: 8,
}

const tituloMini: React.CSSProperties = {
  fontSize: 13,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: '#0f766e',
}

const numeroMini: React.CSSProperties = {
  fontSize: 26,
  fontWeight: 800,
  color: '#0f172a',
  lineHeight: 1,
}

const textoMini: React.CSSProperties = {
  margin: 0,
  color: '#475569',
  lineHeight: 1.6,
  fontSize: 14,
}

const tituloSecao: React.CSSProperties = {
  margin: 0,
  fontSize: 24,
  lineHeight: 1.1,
}

const paragrafoPadrao: React.CSSProperties = {
  margin: '8px 0 0',
  color: '#475569',
  lineHeight: 1.7,
  fontSize: 15,
}

const subCard: React.CSSProperties = {
  border: '1px solid rgba(148, 163, 184, 0.18)',
  borderRadius: 18,
  background: '#f8fbff',
  padding: 14,
}

const labelMini: React.CSSProperties = {
  display: 'block',
  fontSize: 12,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: '#0f766e',
  marginBottom: 6,
}

const valorMini: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 700,
  color: '#0f172a',
  lineHeight: 1.6,
}

const caixaAviso: React.CSSProperties = {
  borderRadius: 20,
  padding: 16,
  border: '1px solid rgba(245, 158, 11, 0.22)',
  background: 'rgba(255, 251, 235, 0.96)',
  color: '#92400e',
  fontWeight: 700,
}

const botaoSecundario: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  textDecoration: 'none',
  borderRadius: 16,
  padding: '12px 14px',
  border: '1px solid rgba(14, 116, 144, 0.14)',
  background: '#ffffff',
  color: '#0f172a',
  fontWeight: 700,
}

const botaoRecebido: React.CSSProperties = {
  border: 'none',
  borderRadius: 14,
  padding: '12px 14px',
  background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
  color: '#ffffff',
  fontWeight: 800,
  fontSize: 14,
  cursor: 'pointer',
}

const pillNeutro: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '8px 12px',
  borderRadius: 999,
  background: 'rgba(15, 23, 42, 0.06)',
  border: '1px solid rgba(148, 163, 184, 0.18)',
  color: '#334155',
  fontWeight: 700,
  fontSize: 13,
}