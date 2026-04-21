'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

type MarketplaceProduto = {
  id?: string
  nome?: string
  preco?: number | string
  categoria?: string
  descricao?: string
  imagem?: string
  status?: string
}

type MarketplaceEntrega = {
  nome?: string
  telefone?: string
  cep?: string
  endereco?: string
  numero?: string
  complemento?: string
  bairro?: string
  cidade?: string
  estado?: string
}

type MarketplacePedido = {
  id?: string
  codigo?: string
  produtoId?: string
  produto?: MarketplaceProduto
  compradorNome?: string
  compradorTelefone?: string
  compradorEmail?: string
  entrega?: MarketplaceEntrega
  status?: string
  criadoEm?: string
  atualizadoEm?: string
}

type MarketplaceEntregaProva = {
  id: string
  pedidoCodigo: string
  recebedorNome: string
  recebedorDocumento?: string
  recebedorTelefone?: string
  fotoOuLink?: string
  observacao?: string
  status:
    | 'ENTREGUE_AGUARDANDO_CONFIRMACAO'
    | 'RECEBIMENTO_CONFIRMADO'
    | 'EM_CONTESTACAO'
  criadoEm: string
  atualizadoEm: string
  confirmacaoCompradorEm?: string
  contestacaoAbertaEm?: string
  contestacaoMotivo?: string
  contestacaoDetalhes?: string
}

const STORAGE_PEDIDO_ATUAL_CANDIDATOS = [
  'aurora-marketplace-pedido-atual',
  'aurora-marketplace-pedido-local',
  'aurora-marketplace-pedidos-atual',
  'aurora-marketplace-checkout-atual',
  'aurora-marketplace-interesse-pedido',
]

const STORAGE_PEDIDOS_LISTA_CANDIDATOS = [
  'aurora-marketplace-pedidos',
  'aurora-marketplace-pedidos-locais',
  'aurora-marketplace-historico-pedidos',
]

const STORAGE_PROVAS = 'aurora-marketplace-entrega-provas'

function formatarDataHora(valor?: string) {
  if (!valor) return 'Não informado'
  const data = new Date(valor)
  if (Number.isNaN(data.getTime())) return valor
  return data.toLocaleString('pt-BR')
}

function formatarMoeda(valor?: number | string) {
  const numero =
    typeof valor === 'number'
      ? valor
      : typeof valor === 'string'
      ? Number(valor.toString().replace(/\./g, '').replace(',', '.').replace(/[^\d.-]/g, ''))
      : 0

  if (Number.isNaN(numero)) return 'R$ 0,00'

  return numero.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

function montarEndereco(entrega?: MarketplaceEntrega) {
  if (!entrega) return 'Não informado'

  const partes = [
    entrega.endereco,
    entrega.numero,
    entrega.complemento,
    entrega.bairro,
    entrega.cidade,
    entrega.estado,
    entrega.cep,
  ].filter(Boolean)

  return partes.length ? partes.join(', ') : 'Não informado'
}

function tentarLerJSON<T>(valor: string | null): T | null {
  if (!valor) return null

  try {
    return JSON.parse(valor) as T
  } catch {
    return null
  }
}

function lerPedidoAtualLocal(): MarketplacePedido | null {
  if (typeof window === 'undefined') return null

  for (const chave of STORAGE_PEDIDO_ATUAL_CANDIDATOS) {
    const bruto = localStorage.getItem(chave)
    const dado = tentarLerJSON<MarketplacePedido | MarketplacePedido[]>(bruto)

    if (!dado) continue

    if (Array.isArray(dado)) {
      const primeiro = dado[0]
      if (primeiro) return primeiro
      continue
    }

    if (typeof dado === 'object') {
      return dado
    }
  }

  return null
}

function lerPedidosListaLocal(): MarketplacePedido[] {
  if (typeof window === 'undefined') return []

  for (const chave of STORAGE_PEDIDOS_LISTA_CANDIDATOS) {
    const bruto = localStorage.getItem(chave)
    const dados = tentarLerJSON<MarketplacePedido[]>(bruto)

    if (Array.isArray(dados)) {
      return dados
    }
  }

  return []
}

function lerProvasLocal(): MarketplaceEntregaProva[] {
  if (typeof window === 'undefined') return []

  const bruto = localStorage.getItem(STORAGE_PROVAS)
  const dados = tentarLerJSON<MarketplaceEntregaProva[]>(bruto)

  if (!Array.isArray(dados)) return []

  return dados
}

function salvarProvasLocal(lista: MarketplaceEntregaProva[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_PROVAS, JSON.stringify(lista))
}

function ordenarPorAtualizacaoDesc<T extends { atualizadoEm?: string; criadoEm?: string }>(lista: T[]) {
  return [...lista].sort((a, b) => {
    const dataA = new Date(a.atualizadoEm || a.criadoEm || 0).getTime()
    const dataB = new Date(b.atualizadoEm || b.criadoEm || 0).getTime()
    return dataB - dataA
  })
}

export default function MarketplacePedidoConfirmacaoPage() {
  const [pedidoAtual, setPedidoAtual] = useState<MarketplacePedido | null>(null)
  const [provas, setProvas] = useState<MarketplaceEntregaProva[]>([])
  const [provaAtual, setProvaAtual] = useState<MarketplaceEntregaProva | null>(null)
  const [motivoContestacao, setMotivoContestacao] = useState('')
  const [detalhesContestacao, setDetalhesContestacao] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [erro, setErro] = useState('')
  const [carregado, setCarregado] = useState(false)
  const [origemLeitura, setOrigemLeitura] = useState('')

  useEffect(() => {
    const pedidoDireto = lerPedidoAtualLocal()
    const pedidosLista = lerPedidosListaLocal()
    const provasSalvas = ordenarPorAtualizacaoDesc(lerProvasLocal())

    let provaSelecionada: MarketplaceEntregaProva | null = null
    let pedidoSelecionado: MarketplacePedido | null = pedidoDireto

    const codigoPedidoDireto = pedidoDireto?.codigo || pedidoDireto?.id || ''

    if (codigoPedidoDireto) {
      provaSelecionada =
        provasSalvas.find((item) => item.pedidoCodigo === codigoPedidoDireto) || null
    }

    if (!provaSelecionada && provasSalvas.length > 0) {
      provaSelecionada = provasSalvas[0]
    }

    if (!pedidoSelecionado && provaSelecionada?.pedidoCodigo) {
      pedidoSelecionado =
        pedidosLista.find(
          (item) =>
            item.codigo === provaSelecionada?.pedidoCodigo ||
            item.id === provaSelecionada?.pedidoCodigo
        ) || null
    }

    setPedidoAtual(pedidoSelecionado)
    setProvas(provasSalvas)
    setProvaAtual(provaSelecionada)

    if (pedidoDireto && provaSelecionada && codigoPedidoDireto === provaSelecionada.pedidoCodigo) {
      setOrigemLeitura('Pedido atual + prova vinculada encontrados com sucesso.')
    } else if (!pedidoDireto && provaSelecionada && pedidoSelecionado) {
      setOrigemLeitura('Pedido atual não veio preenchido, mas a tela recuperou a prova e religou o pedido pela base local.')
    } else if (!pedidoDireto && provaSelecionada) {
      setOrigemLeitura('Pedido atual não veio preenchido, mas a tela recuperou a prova mais recente para não travar a confirmação.')
    } else if (pedidoDireto && !provaSelecionada) {
      setOrigemLeitura('Pedido encontrado, mas ainda não há prova registrada para ele.')
    } else {
      setOrigemLeitura('Nenhum vínculo local suficiente foi encontrado para esta etapa.')
    }

    setCarregado(true)
  }, [])

  const enderecoCompleto = useMemo(() => montarEndereco(pedidoAtual?.entrega), [pedidoAtual])

  const resumoStatus = useMemo(() => {
    return {
      total: provas.length,
      aguardando: provas.filter((item) => item.status === 'ENTREGUE_AGUARDANDO_CONFIRMACAO').length,
      confirmadas: provas.filter((item) => item.status === 'RECEBIMENTO_CONFIRMADO').length,
      contestacoes: provas.filter((item) => item.status === 'EM_CONTESTACAO').length,
    }
  }, [provas])

  function atualizarProva(statusNovo: MarketplaceEntregaProva['status'], extras?: Partial<MarketplaceEntregaProva>) {
    if (!provaAtual) {
      setErro('Nenhuma prova de entrega foi encontrada para o pedido atual.')
      setMensagem('')
      return
    }

    const agora = new Date().toISOString()

    const provaAtualizada: MarketplaceEntregaProva = {
      ...provaAtual,
      ...extras,
      status: statusNovo,
      atualizadoEm: agora,
    }

    const novaListaBase = provas.some((item) => item.id === provaAtual.id)
      ? provas.map((item) => (item.id === provaAtual.id ? provaAtualizada : item))
      : [provaAtualizada, ...provas]

    const novaLista = ordenarPorAtualizacaoDesc(novaListaBase)

    salvarProvasLocal(novaLista)
    setProvas(novaLista)
    setProvaAtual(provaAtualizada)
    setErro('')
  }

  function confirmarRecebimento() {
    if (!provaAtual) {
      setErro('Nenhuma prova de entrega foi encontrada para confirmação.')
      setMensagem('')
      return
    }

    atualizarProva('RECEBIMENTO_CONFIRMADO', {
      confirmacaoCompradorEm: new Date().toISOString(),
      contestacaoAbertaEm: undefined,
      contestacaoMotivo: undefined,
      contestacaoDetalhes: undefined,
    })

    setMensagem(
      'Recebimento confirmado com sucesso. A entrega ficou reconhecida pelo comprador e o fluxo já fica preparado para futura liberação lógica do pagamento.'
    )
  }

  function abrirContestacao() {
    if (!provaAtual) {
      setErro('Nenhuma prova de entrega foi encontrada para contestação.')
      setMensagem('')
      return
    }

    if (!motivoContestacao.trim()) {
      setErro('Informe o motivo principal da contestação.')
      setMensagem('')
      return
    }

    atualizarProva('EM_CONTESTACAO', {
      contestacaoAbertaEm: new Date().toISOString(),
      contestacaoMotivo: motivoContestacao.trim(),
      contestacaoDetalhes: detalhesContestacao.trim() || undefined,
    })

    setMensagem(
      'Contestação aberta com sucesso. O caso foi marcado para revisão sem quebrar o histórico atual da entrega.'
    )
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #eef8ff 0%, #f7fbff 35%, #ffffff 100%)',
        color: '#0f172a',
      }}
    >
      <div
        style={{
          maxWidth: 1180,
          margin: '0 auto',
          padding: '24px 16px 64px',
        }}
      >
        <section
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            marginBottom: 20,
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 12px',
                borderRadius: 999,
                background: '#dff4ff',
                color: '#0369a1',
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: 0.4,
                textTransform: 'uppercase',
                marginBottom: 12,
              }}
            >
              Aurora Marketplace • Confirmação final
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: 'clamp(28px, 4vw, 44px)',
                lineHeight: 1.05,
                fontWeight: 900,
              }}
            >
              Confirmação do comprador
            </h1>

            <p
              style={{
                marginTop: 12,
                marginBottom: 0,
                maxWidth: 840,
                fontSize: 16,
                lineHeight: 1.6,
                color: '#334155',
              }}
            >
              Camada isolada para o comprador reconhecer a entrega ou abrir contestação
              com segurança. Esta etapa protege vendedor, comprador e a reputação da
              plataforma sem quebrar o fluxo atual.
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 10,
            }}
          >
            <Link
              href="/marketplace/pedido/entrega-prova"
              style={{
                textDecoration: 'none',
                padding: '12px 16px',
                borderRadius: 14,
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#0f172a',
                fontWeight: 700,
              }}
            >
              Voltar à prova de entrega
            </Link>

            <Link
              href="/marketplace"
              style={{
                textDecoration: 'none',
                padding: '12px 16px',
                borderRadius: 14,
                background: '#0ea5e9',
                color: '#ffffff',
                fontWeight: 800,
                boxShadow: '0 16px 40px rgba(14,165,233,0.22)',
              }}
            >
              Voltar ao Marketplace
            </Link>
          </div>
        </section>

        <div
          style={{
            marginBottom: 20,
            padding: '14px 16px',
            borderRadius: 18,
            background: '#fff7ed',
            border: '1px solid #fed7aa',
            color: '#9a3412',
            fontWeight: 600,
          }}
        >
          Sistema em constante atualização e podem ocorrer instabilidades momentâneas durante melhorias.
        </div>

        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 12,
            marginBottom: 16,
          }}
        >
          {[
            { titulo: 'Registros', valor: resumoStatus.total, detalhe: 'Provas salvas localmente' },
            { titulo: 'Aguardando', valor: resumoStatus.aguardando, detalhe: 'Esperando decisão do comprador' },
            { titulo: 'Confirmadas', valor: resumoStatus.confirmadas, detalhe: 'Recebimentos reconhecidos' },
            { titulo: 'Contestações', valor: resumoStatus.contestacoes, detalhe: 'Casos em revisão' },
          ].map((item) => (
            <article
              key={item.titulo}
              style={{
                background: '#ffffff',
                border: '1px solid #dbeafe',
                borderRadius: 22,
                padding: 18,
                boxShadow: '0 18px 40px rgba(15,23,42,0.06)',
              }}
            >
              <div
                style={{
                  color: '#0369a1',
                  fontSize: 12,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: 0.3,
                  marginBottom: 8,
                }}
              >
                {item.titulo}
              </div>
              <div
                style={{
                  fontSize: 34,
                  fontWeight: 900,
                  lineHeight: 1,
                  marginBottom: 8,
                }}
              >
                {item.valor}
              </div>
              <div
                style={{
                  color: '#475569',
                  fontSize: 14,
                  lineHeight: 1.5,
                }}
              >
                {item.detalhe}
              </div>
            </article>
          ))}
        </section>

        <div
          style={{
            marginBottom: 20,
            padding: '14px 16px',
            borderRadius: 18,
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            color: '#1d4ed8',
            fontWeight: 700,
          }}
        >
          {origemLeitura || 'Leitura local em preparação.'}
        </div>

        {mensagem ? (
          <div
            style={{
              marginBottom: 20,
              padding: '16px 18px',
              borderRadius: 18,
              background: '#ecfdf5',
              border: '1px solid #86efac',
              color: '#166534',
              fontWeight: 700,
            }}
          >
            {mensagem}
          </div>
        ) : null}

        {erro ? (
          <div
            style={{
              marginBottom: 20,
              padding: '16px 18px',
              borderRadius: 18,
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#991b1b',
              fontWeight: 700,
            }}
          >
            {erro}
          </div>
        ) : null}

        <section
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr',
            gap: 18,
          }}
        >
          <div style={{ display: 'grid', gap: 18 }}>
            <article
              style={{
                background: '#ffffff',
                borderRadius: 24,
                border: '1px solid #dbeafe',
                boxShadow: '0 18px 40px rgba(15,23,42,0.06)',
                padding: 22,
              }}
            >
              <h2
                style={{
                  marginTop: 0,
                  marginBottom: 10,
                  fontSize: 24,
                  fontWeight: 900,
                }}
              >
                Leitura do pedido
              </h2>

              <p
                style={{
                  marginTop: 0,
                  marginBottom: 18,
                  color: '#475569',
                  lineHeight: 1.6,
                }}
              >
                Referência atual para a decisão final do comprador e para a continuidade
                lógica do pagamento no futuro.
              </p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: 12,
                }}
              >
                {[
                  ['Pedido atual', pedidoAtual?.codigo || pedidoAtual?.id || provaAtual?.pedidoCodigo || 'Não informado'],
                  ['Produto', pedidoAtual?.produto?.nome || 'Não informado'],
                  ['Preço', formatarMoeda(pedidoAtual?.produto?.preco)],
                  ['Comprador', pedidoAtual?.compradorNome || provaAtual?.recebedorNome || 'Não informado'],
                  ['Telefone', pedidoAtual?.compradorTelefone || provaAtual?.recebedorTelefone || 'Não informado'],
                  ['Status do pedido', pedidoAtual?.status || provaAtual?.status || 'Não informado'],
                  ['Criado em', formatarDataHora(pedidoAtual?.criadoEm || provaAtual?.criadoEm)],
                  ['Atualizado em', formatarDataHora(pedidoAtual?.atualizadoEm || provaAtual?.atualizadoEm)],
                ].map(([rotulo, valor]) => (
                  <div
                    key={rotulo}
                    style={{
                      padding: 14,
                      borderRadius: 18,
                      background: '#f8fbff',
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    <div
                      style={{
                        fontSize: 12,
                        textTransform: 'uppercase',
                        fontWeight: 800,
                        color: '#0369a1',
                        marginBottom: 6,
                      }}
                    >
                      {rotulo}
                    </div>
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: '#0f172a',
                        wordBreak: 'break-word',
                      }}
                    >
                      {valor}
                    </div>
                  </div>
                ))}
              </div>

              <div
                style={{
                  marginTop: 14,
                  padding: 16,
                  borderRadius: 18,
                  background: '#f8fbff',
                  border: '1px solid #e2e8f0',
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    textTransform: 'uppercase',
                    fontWeight: 800,
                    color: '#0369a1',
                    marginBottom: 6,
                  }}
                >
                  Endereço de entrega
                </div>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: '#0f172a',
                    lineHeight: 1.6,
                  }}
                >
                  {enderecoCompleto}
                </div>
              </div>
            </article>

            <article
              style={{
                background: '#ffffff',
                borderRadius: 24,
                border: '1px solid #dbeafe',
                boxShadow: '0 18px 40px rgba(15,23,42,0.06)',
                padding: 22,
              }}
            >
              <h2
                style={{
                  marginTop: 0,
                  marginBottom: 10,
                  fontSize: 24,
                  fontWeight: 900,
                }}
              >
                Prova atual da entrega
              </h2>

              <p
                style={{
                  marginTop: 0,
                  marginBottom: 18,
                  color: '#475569',
                  lineHeight: 1.6,
                }}
              >
                Esta leitura usa a melhor prova local disponível, mesmo quando o pedido atual não vier preenchido.
              </p>

              {!carregado ? (
                <div
                  style={{
                    padding: 16,
                    borderRadius: 18,
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    color: '#334155',
                    fontWeight: 700,
                  }}
                >
                  Carregando dados locais...
                </div>
              ) : provaAtual ? (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: 12,
                  }}
                >
                  {[
                    ['Status', provaAtual.status],
                    ['Pedido', provaAtual.pedidoCodigo],
                    ['Recebedor', provaAtual.recebedorNome || 'Não informado'],
                    ['Documento', provaAtual.recebedorDocumento || 'Não informado'],
                    ['Telefone', provaAtual.recebedorTelefone || 'Não informado'],
                    ['Foto / link', provaAtual.fotoOuLink || 'Não informado'],
                    ['Criada em', formatarDataHora(provaAtual.criadoEm)],
                    ['Atualizada em', formatarDataHora(provaAtual.atualizadoEm)],
                    ['Confirmação do comprador', formatarDataHora(provaAtual.confirmacaoCompradorEm)],
                    ['Contestação aberta em', formatarDataHora(provaAtual.contestacaoAbertaEm)],
                    ['Motivo da contestação', provaAtual.contestacaoMotivo || 'Não informado'],
                    ['Detalhes da contestação', provaAtual.contestacaoDetalhes || 'Não informado'],
                  ].map(([rotulo, valor]) => (
                    <div
                      key={rotulo}
                      style={{
                        padding: 14,
                        borderRadius: 18,
                        background: '#f8fbff',
                        border: '1px solid #e2e8f0',
                      }}
                    >
                      <div
                        style={{
                          fontSize: 12,
                          textTransform: 'uppercase',
                          fontWeight: 800,
                          color: '#0369a1',
                          marginBottom: 6,
                        }}
                      >
                        {rotulo}
                      </div>
                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: 700,
                          color: '#0f172a',
                          lineHeight: 1.5,
                          wordBreak: 'break-word',
                        }}
                      >
                        {valor}
                      </div>
                    </div>
                  ))}

                  <div
                    style={{
                      gridColumn: '1 / -1',
                      padding: 14,
                      borderRadius: 18,
                      background: '#f8fbff',
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    <div
                      style={{
                        fontSize: 12,
                        textTransform: 'uppercase',
                        fontWeight: 800,
                        color: '#0369a1',
                        marginBottom: 6,
                      }}
                    >
                      Observação da entrega
                    </div>
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: '#0f172a',
                        lineHeight: 1.6,
                      }}
                    >
                      {provaAtual.observacao || 'Sem observações adicionais.'}
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    padding: 16,
                    borderRadius: 18,
                    background: '#fff7ed',
                    border: '1px solid #fed7aa',
                    color: '#9a3412',
                    fontWeight: 700,
                  }}
                >
                  Nenhuma prova de entrega foi encontrada para o pedido atual. Primeiro conclua a etapa
                  de prova de entrega.
                </div>
              )}
            </article>
          </div>

          <aside style={{ display: 'grid', gap: 18 }}>
            <article
              style={{
                background: '#ffffff',
                borderRadius: 24,
                border: '1px solid #dbeafe',
                boxShadow: '0 18px 40px rgba(15,23,42,0.06)',
                padding: 22,
              }}
            >
              <h2
                style={{
                  marginTop: 0,
                  marginBottom: 10,
                  fontSize: 22,
                  fontWeight: 900,
                }}
              >
                Confirmar recebimento
              </h2>

              <p
                style={{
                  marginTop: 0,
                  marginBottom: 16,
                  color: '#475569',
                  lineHeight: 1.6,
                }}
              >
                Use esta ação quando o comprador reconhecer que recebeu corretamente o pedido.
              </p>

              <button
                type="button"
                onClick={confirmarRecebimento}
                disabled={!provaAtual}
                style={{
                  width: '100%',
                  border: 'none',
                  borderRadius: 16,
                  padding: '14px 16px',
                  background: provaAtual ? '#16a34a' : '#94a3b8',
                  color: '#ffffff',
                  fontSize: 15,
                  fontWeight: 800,
                  cursor: provaAtual ? 'pointer' : 'not-allowed',
                  boxShadow: provaAtual ? '0 16px 36px rgba(22,163,74,0.22)' : 'none',
                }}
              >
                Confirmar recebimento
              </button>
            </article>

            <article
              style={{
                background: '#ffffff',
                borderRadius: 24,
                border: '1px solid #dbeafe',
                boxShadow: '0 18px 40px rgba(15,23,42,0.06)',
                padding: 22,
              }}
            >
              <h2
                style={{
                  marginTop: 0,
                  marginBottom: 10,
                  fontSize: 22,
                  fontWeight: 900,
                }}
              >
                Abrir contestação
              </h2>

              <p
                style={{
                  marginTop: 0,
                  marginBottom: 16,
                  color: '#475569',
                  lineHeight: 1.6,
                }}
              >
                Use esta ação quando houver divergência, ausência de recebimento, dano ou informação incorreta.
              </p>

              <label
                style={{
                  display: 'block',
                  marginBottom: 12,
                }}
              >
                <span
                  style={{
                    display: 'block',
                    fontSize: 13,
                    fontWeight: 800,
                    color: '#0f172a',
                    marginBottom: 8,
                  }}
                >
                  Motivo da contestação
                </span>
                <input
                  value={motivoContestacao}
                  onChange={(e) => setMotivoContestacao(e.target.value)}
                  placeholder="Ex.: produto não recebido, item diferente, dano, endereço divergente..."
                  style={{
                    width: '100%',
                    borderRadius: 14,
                    border: '1px solid #cbd5e1',
                    padding: '12px 14px',
                    fontSize: 14,
                    outline: 'none',
                  }}
                />
              </label>

              <label
                style={{
                  display: 'block',
                  marginBottom: 14,
                }}
              >
                <span
                  style={{
                    display: 'block',
                    fontSize: 13,
                    fontWeight: 800,
                    color: '#0f172a',
                    marginBottom: 8,
                  }}
                >
                  Detalhes adicionais
                </span>
                <textarea
                  value={detalhesContestacao}
                  onChange={(e) => setDetalhesContestacao(e.target.value)}
                  placeholder="Descreva o que aconteceu para deixar a revisão futura mais clara."
                  rows={6}
                  style={{
                    width: '100%',
                    borderRadius: 14,
                    border: '1px solid #cbd5e1',
                    padding: '12px 14px',
                    fontSize: 14,
                    resize: 'vertical',
                    outline: 'none',
                  }}
                />
              </label>

              <button
                type="button"
                onClick={abrirContestacao}
                disabled={!provaAtual}
                style={{
                  width: '100%',
                  border: 'none',
                  borderRadius: 16,
                  padding: '14px 16px',
                  background: provaAtual ? '#dc2626' : '#94a3b8',
                  color: '#ffffff',
                  fontSize: 15,
                  fontWeight: 800,
                  cursor: provaAtual ? 'pointer' : 'not-allowed',
                  boxShadow: provaAtual ? '0 16px 36px rgba(220,38,38,0.20)' : 'none',
                }}
              >
                Abrir contestação
              </button>
            </article>

            <article
              style={{
                background: '#f8fbff',
                borderRadius: 24,
                border: '1px solid #dbeafe',
                padding: 22,
              }}
            >
              <h3
                style={{
                  marginTop: 0,
                  marginBottom: 10,
                  fontSize: 18,
                  fontWeight: 900,
                }}
              >
                Próximo efeito desta página
              </h3>

              <ul
                style={{
                  margin: 0,
                  paddingLeft: 18,
                  color: '#334155',
                  lineHeight: 1.8,
                  fontWeight: 600,
                }}
              >
                <li>confirmar ou contestar a prova de entrega</li>
                <li>preservar histórico local da operação</li>
                <li>não quebrar a etapa anterior já validada</li>
                <li>preparar futura liberação lógica do pagamento</li>
              </ul>
            </article>
          </aside>
        </section>
      </div>
    </main>
  )
}