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

const STORAGE_PROVAS = 'aurora-marketplace-entrega-provas'

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

function formatarDataHora(valor?: string) {
  if (!valor) return 'Não informado'
  const data = new Date(valor)
  if (Number.isNaN(data.getTime())) return valor
  return data.toLocaleString('pt-BR')
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

function ordenarPorAtualizacaoDesc<T extends { atualizadoEm?: string; criadoEm?: string }>(lista: T[]) {
  return [...lista].sort((a, b) => {
    const dataA = new Date(a.atualizadoEm || a.criadoEm || 0).getTime()
    const dataB = new Date(b.atualizadoEm || b.criadoEm || 0).getTime()
    return dataB - dataA
  })
}

export default function MarketplaceEntregaProvaPage() {
  const [pedidoAtual, setPedidoAtual] = useState<MarketplacePedido | null>(null)
  const [provas, setProvas] = useState<MarketplaceEntregaProva[]>([])
  const [pedidoCodigo, setPedidoCodigo] = useState('')
  const [recebedorNome, setRecebedorNome] = useState('')
  const [recebedorDocumento, setRecebedorDocumento] = useState('')
  const [recebedorTelefone, setRecebedorTelefone] = useState('')
  const [fotoOuLink, setFotoOuLink] = useState('')
  const [observacao, setObservacao] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [erro, setErro] = useState('')

  useEffect(() => {
    const pedido = lerPedidoAtualLocal()
    const provasSalvas = ordenarPorAtualizacaoDesc(lerProvasLocal())

    setPedidoAtual(pedido)
    setProvas(provasSalvas)
    setPedidoCodigo(pedido?.codigo || pedido?.id || '')
    setRecebedorNome(pedido?.compradorNome || '')
    setRecebedorTelefone(pedido?.compradorTelefone || '')
  }, [])

  const resumo = useMemo(() => {
    return {
      total: provas.length,
      aguardando: provas.filter((item) => item.status === 'ENTREGUE_AGUARDANDO_CONFIRMACAO').length,
      confirmadas: provas.filter((item) => item.status === 'RECEBIMENTO_CONFIRMADO').length,
      contestacoes: provas.filter((item) => item.status === 'EM_CONTESTACAO').length,
    }
  }, [provas])

  const enderecoCompleto = useMemo(() => montarEndereco(pedidoAtual?.entrega), [pedidoAtual])

  function registrarProva() {
    if (!pedidoCodigo.trim()) {
      setErro('Informe o código do pedido para registrar a prova de entrega.')
      setMensagem('')
      return
    }

    if (!recebedorNome.trim()) {
      setErro('Informe o nome de quem recebeu.')
      setMensagem('')
      return
    }

    const agora = new Date().toISOString()

    const novaProva: MarketplaceEntregaProva = {
      id: `prova-${Date.now()}`,
      pedidoCodigo: pedidoCodigo.trim(),
      recebedorNome: recebedorNome.trim(),
      recebedorDocumento: recebedorDocumento.trim() || undefined,
      recebedorTelefone: recebedorTelefone.trim() || undefined,
      fotoOuLink: fotoOuLink.trim() || undefined,
      observacao: observacao.trim() || undefined,
      status: 'ENTREGUE_AGUARDANDO_CONFIRMACAO',
      criadoEm: agora,
      atualizadoEm: agora,
    }

    const novaLista = ordenarPorAtualizacaoDesc([novaProva, ...provas])
    salvarProvasLocal(novaLista)
    setProvas(novaLista)
    setMensagem('Prova de entrega registrada com sucesso. O pedido agora pode seguir para confirmação final do comprador.')
    setErro('')
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
              Aurora Marketplace • Prova de entrega
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: 'clamp(28px, 4vw, 44px)',
                lineHeight: 1.05,
                fontWeight: 900,
              }}
            >
              Registro da entrega
            </h1>

            <p
              style={{
                marginTop: 12,
                marginBottom: 0,
                maxWidth: 860,
                fontSize: 16,
                lineHeight: 1.6,
                color: '#334155',
              }}
            >
              Camada isolada para gerar evidência real da entrega antes da confirmação final do comprador.
              Essa etapa protege vendedor, comprador e a reputação da plataforma.
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
              href="/marketplace/comprador"
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
              Voltar ao painel
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
            marginBottom: 24,
          }}
        >
          {[
            { titulo: 'Provas', valor: resumo.total, detalhe: 'Registros de entrega salvos localmente' },
            { titulo: 'Aguardando confirmação', valor: resumo.aguardando, detalhe: 'Entregas esperando resposta do comprador' },
            { titulo: 'Confirmadas', valor: resumo.confirmadas, detalhe: 'Entregas já reconhecidas pelo sistema' },
            { titulo: 'Contestações', valor: resumo.contestacoes, detalhe: 'Casos abertos para revisão' },
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
            gridTemplateColumns: '1.1fr 0.9fr',
            gap: 18,
          }}
        >
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
              Cadastrar prova de entrega
            </h2>

            <p
              style={{
                marginTop: 0,
                marginBottom: 18,
                color: '#475569',
                lineHeight: 1.6,
              }}
            >
              Registre aqui o recebimento com dados mínimos para futura confirmação do comprador.
            </p>

            <div
              style={{
                display: 'grid',
                gap: 14,
              }}
            >
              <label>
                <span
                  style={{
                    display: 'block',
                    fontSize: 13,
                    fontWeight: 800,
                    color: '#0f172a',
                    marginBottom: 8,
                  }}
                >
                  Código do pedido
                </span>
                <input
                  value={pedidoCodigo}
                  onChange={(e) => setPedidoCodigo(e.target.value)}
                  placeholder="PED-20260420181947"
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

              <label>
                <span
                  style={{
                    display: 'block',
                    fontSize: 13,
                    fontWeight: 800,
                    color: '#0f172a',
                    marginBottom: 8,
                  }}
                >
                  Nome de quem recebeu
                </span>
                <input
                  value={recebedorNome}
                  onChange={(e) => setRecebedorNome(e.target.value)}
                  placeholder="Maria Eduarda"
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

              <label>
                <span
                  style={{
                    display: 'block',
                    fontSize: 13,
                    fontWeight: 800,
                    color: '#0f172a',
                    marginBottom: 8,
                  }}
                >
                  Documento do recebedor
                </span>
                <input
                  value={recebedorDocumento}
                  onChange={(e) => setRecebedorDocumento(e.target.value)}
                  placeholder="Ex.: CPF, RG ou outro identificador"
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

              <label>
                <span
                  style={{
                    display: 'block',
                    fontSize: 13,
                    fontWeight: 800,
                    color: '#0f172a',
                    marginBottom: 8,
                  }}
                >
                  Telefone do recebedor
                </span>
                <input
                  value={recebedorTelefone}
                  onChange={(e) => setRecebedorTelefone(e.target.value)}
                  placeholder="31997490074"
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

              <label>
                <span
                  style={{
                    display: 'block',
                    fontSize: 13,
                    fontWeight: 800,
                    color: '#0f172a',
                    marginBottom: 8,
                  }}
                >
                  Foto ou link da prova
                </span>
                <input
                  value={fotoOuLink}
                  onChange={(e) => setFotoOuLink(e.target.value)}
                  placeholder="Ex.: https://imagem-da-entrega"
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

              <label>
                <span
                  style={{
                    display: 'block',
                    fontSize: 13,
                    fontWeight: 800,
                    color: '#0f172a',
                    marginBottom: 8,
                  }}
                >
                  Observação da entrega
                </span>
                <textarea
                  value={observacao}
                  onChange={(e) => setObservacao(e.target.value)}
                  placeholder="Descreva condições da entrega, nome do entregador, detalhes do recebimento e outras observações."
                  rows={5}
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

              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 12,
                  marginTop: 4,
                }}
              >
                <button
                  type="button"
                  onClick={registrarProva}
                  style={{
                    border: 'none',
                    borderRadius: 16,
                    padding: '14px 18px',
                    background: '#0ea5e9',
                    color: '#ffffff',
                    fontSize: 15,
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 16px 36px rgba(14,165,233,0.22)',
                  }}
                >
                  Registrar prova de entrega
                </button>

                <Link
                  href="/marketplace/pedido/confirmacao"
                  style={{
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 16,
                    padding: '14px 18px',
                    background: '#16a34a',
                    color: '#ffffff',
                    fontSize: 15,
                    fontWeight: 800,
                    boxShadow: '0 16px 36px rgba(22,163,74,0.22)',
                  }}
                >
                  Ir para confirmação final
                </Link>
              </div>
            </div>
          </article>

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
                  fontSize: 22,
                  fontWeight: 900,
                }}
              >
                Base atual
              </h2>

              <p
                style={{
                  marginTop: 0,
                  marginBottom: 18,
                  color: '#475569',
                  lineHeight: 1.6,
                }}
              >
                Leitura do pedido referência para facilitar o lançamento da prova de entrega.
              </p>

              <div
                style={{
                  display: 'grid',
                  gap: 12,
                }}
              >
                {[
                  ['Pedido atual', pedidoAtual?.codigo || pedidoAtual?.id || pedidoCodigo || 'Não informado'],
                  ['Produto', pedidoAtual?.produto?.nome || 'Não informado'],
                  ['Comprador', pedidoAtual?.compradorNome || recebedorNome || 'Não informado'],
                  ['Telefone', pedidoAtual?.compradorTelefone || recebedorTelefone || 'Não informado'],
                  ['Endereço de entrega', enderecoCompleto],
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
                        lineHeight: 1.6,
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
                  marginTop: 16,
                  padding: 14,
                  borderRadius: 18,
                  background: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  color: '#1d4ed8',
                  fontWeight: 700,
                }}
              >
                Esta etapa prepara a confirmação final do comprador e a futura liberação lógica do pagamento.
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
                  fontSize: 22,
                  fontWeight: 900,
                }}
              >
                Histórico
              </h2>

              <p
                style={{
                  marginTop: 0,
                  marginBottom: 18,
                  color: '#475569',
                  lineHeight: 1.6,
                }}
              >
                Provas registradas para acompanhamento local da operação.
              </p>

              {provas.length === 0 ? (
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
                  Nenhuma prova registrada até agora.
                </div>
              ) : (
                <div
                  style={{
                    display: 'grid',
                    gap: 12,
                  }}
                >
                  {provas.map((item) => (
                    <div
                      key={item.id}
                      style={{
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
                          fontWeight: 900,
                          color: '#0369a1',
                          marginBottom: 8,
                        }}
                      >
                        {item.status}
                      </div>

                      <div
                        style={{
                          display: 'grid',
                          gap: 6,
                          color: '#0f172a',
                          fontWeight: 700,
                        }}
                      >
                        <div>{formatarDataHora(item.criadoEm)}</div>
                        <div>{item.pedidoCodigo}</div>
                        <div>Recebedor: {item.recebedorNome || 'Não informado'}</div>
                        <div>Documento: {item.recebedorDocumento || 'Não informado'}</div>
                        <div>Telefone: {item.recebedorTelefone || 'Não informado'}</div>
                        <div>Foto / link: {item.fotoOuLink || 'Não informado'}</div>
                        <div>Observação: {item.observacao || 'Sem observações adicionais.'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </article>
          </div>
        </section>
      </div>
    </main>
  )
}