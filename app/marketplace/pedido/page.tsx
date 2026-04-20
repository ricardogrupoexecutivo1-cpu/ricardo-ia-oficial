'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

type ProdutoMarketplace = {
  id: string
  nome: string
  preco: number
  descricao?: string
  categoria?: string
  estoque?: string
  status?: 'disponivel' | 'pausado' | 'rascunho'
  imagem?: string
  vendedorNome?: string
  lojaNome?: string
  lojaSlug?: string
}

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

type PedidoMarketplace = {
  id: string
  criadoEm: string
  status: 'aguardando_confirmacao'
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

const STORAGE_KEYS = {
  produtoSelecionado: [
    'aurora-marketplace-produto-selecionado',
    'marketplace-produto-selecionado',
    'produto-interesse-marketplace',
    'produtoSelecionadoMarketplace',
  ],
  produtos: [
    'aurora-marketplace-produtos',
    'marketplace-produtos',
    'produtos-marketplace',
    'marketplaceProdutos',
  ],
  entrega: [
    'aurora-marketplace-entrega-comprador',
    'marketplace-entrega-comprador',
    'comprador-entrega-marketplace',
    'marketplaceCompradorEntrega',
  ],
  pedidos: [
    'aurora-marketplace-pedidos',
    'marketplace-pedidos',
    'historico-pedidos-marketplace',
    'marketplacePedidos',
  ],
} as const

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

function salvarEmPrimeiraChave(keys: readonly string[], value: unknown) {
  if (typeof window === 'undefined') return
  if (!keys.length) return
  localStorage.setItem(keys[0], JSON.stringify(value))
}

function moeda(valor: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number.isFinite(valor) ? valor : 0)
}

function gerarIdPedido() {
  const agora = new Date()
  const base = `${agora.getFullYear()}${String(agora.getMonth() + 1).padStart(2, '0')}${String(
    agora.getDate(),
  ).padStart(2, '0')}${String(agora.getHours()).padStart(2, '0')}${String(
    agora.getMinutes(),
  ).padStart(2, '0')}${String(agora.getSeconds()).padStart(2, '0')}`

  return `PED-${base}`
}

function textoEndereco(entrega: EnderecoComprador) {
  const linha1 = [entrega.endereco, entrega.numero].filter(Boolean).join(', ')
  const linha2 = [entrega.bairro, entrega.cidade, entrega.estado].filter(Boolean).join(' • ')
  const linha3 = [entrega.cep, entrega.complemento].filter(Boolean).join(' • ')

  return [linha1, linha2, linha3].filter(Boolean)
}

export default function MarketplacePedidoPage() {
  const [produto, setProduto] = useState<ProdutoMarketplace | null>(null)
  const [entrega, setEntrega] = useState<EnderecoComprador>({})
  const [carregando, setCarregando] = useState(true)
  const [mensagem, setMensagem] = useState('')
  const [pedidoCriado, setPedidoCriado] = useState<PedidoMarketplace | null>(null)

  useEffect(() => {
    try {
      const produtoSelecionado = lerPrimeiroJsonValido<ProdutoMarketplace | null>(
        STORAGE_KEYS.produtoSelecionado,
        null,
      )

      const listaProdutos = lerPrimeiroJsonValido<ProdutoMarketplace[]>(STORAGE_KEYS.produtos, [])
      const enderecoAtual = lerPrimeiroJsonValido<EnderecoComprador>(STORAGE_KEYS.entrega, {})

      const primeiroDisponivel =
        listaProdutos.find((item) => (item.status || 'disponivel') === 'disponivel') || null

      setProduto(produtoSelecionado || primeiroDisponivel || null)
      setEntrega(enderecoAtual || {})
    } finally {
      setCarregando(false)
    }
  }, [])

  const entregaCompleta = useMemo(() => {
    return Boolean(entrega?.nome && entrega?.telefone && entrega?.cidade && entrega?.estado && entrega?.endereco)
  }, [entrega])

  const linhasEndereco = useMemo(() => textoEndereco(entrega), [entrega])

  function criarPedidoLocal() {
    if (!produto) {
      setMensagem('Nenhum produto disponível para gerar o pedido nesta etapa.')
      return
    }

    if (!entregaCompleta) {
      setMensagem('Entrega incompleta. Preencha o endereço do comprador antes de concluir o pedido.')
      return
    }

    const novoPedido: PedidoMarketplace = {
      id: gerarIdPedido(),
      criadoEm: new Date().toISOString(),
      status: 'aguardando_confirmacao',
      produtoId: produto.id,
      produtoNome: produto.nome,
      produtoPreco: Number(produto.preco || 0),
      produtoCategoria: produto.categoria,
      produtoImagem: produto.imagem,
      compradorNome: entrega.nome,
      compradorTelefone: entrega.telefone,
      compradorEmail: entrega.email,
      entrega,
      lojaNome: produto.lojaNome,
      lojaSlug: produto.lojaSlug,
      vendedorNome: produto.vendedorNome,
    }

    const pedidosAtuais = lerPrimeiroJsonValido<PedidoMarketplace[]>(STORAGE_KEYS.pedidos, [])
    const novosPedidos = [novoPedido, ...pedidosAtuais]

    salvarEmPrimeiraChave(STORAGE_KEYS.pedidos, novosPedidos)
    setPedidoCriado(novoPedido)
    setMensagem('Pedido local criado com sucesso. O histórico já recebeu este registro.')
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(180deg, #eef9ff 0%, #f8fdff 45%, #ffffff 100%)',
        color: '#0f172a',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 1180,
          margin: '0 auto',
          padding: '24px 16px 80px',
        }}
      >
        <section
          style={{
            border: '1px solid rgba(14, 116, 144, 0.12)',
            background: 'rgba(255,255,255,0.92)',
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
            <Link href="/marketplace/interesse" style={botaoSecundario}>
              Voltar ao interesse
            </Link>
            <Link href="/marketplace/comprador/entrega" style={botaoSecundario}>
              Ver entrega
            </Link>
            <Link href="/marketplace/comprador" style={botaoSecundario}>
              Área do comprador
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gap: 18,
            }}
          >
            <div>
              <div style={badge}>Aurora Marketplace • Pedido local</div>
              <h1
                style={{
                  fontSize: 'clamp(2rem, 4vw, 3.4rem)',
                  lineHeight: 1.05,
                  margin: '14px 0 10px',
                  letterSpacing: '-0.03em',
                }}
              >
                CHECKOUT INICIAL DO PEDIDO
              </h1>
              <p
                style={{
                  fontSize: 16,
                  lineHeight: 1.7,
                  color: '#334155',
                  maxWidth: 900,
                  margin: 0,
                }}
              >
                Página isolada para transformar o interesse em pedido local sem quebrar o Marketplace.
                Aqui reunimos produto selecionado, endereço do comprador e histórico inicial da operação.
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
                <strong style={tituloMini}>Produto</strong>
                <span style={numeroMini}>{produto ? '1' : '0'}</span>
                <p style={textoMini}>Leitura do item selecionado para continuidade.</p>
              </div>
              <div style={cardResumo}>
                <strong style={tituloMini}>Entrega</strong>
                <span style={numeroMini}>{entregaCompleta ? 'OK' : 'Pendente'}</span>
                <p style={textoMini}>Validação simples do endereço do comprador.</p>
              </div>
              <div style={cardResumo}>
                <strong style={tituloMini}>Histórico</strong>
                <span style={numeroMini}>Local</span>
                <p style={textoMini}>O pedido fica salvo localmente nesta primeira etapa.</p>
              </div>
            </div>
          </div>
        </section>

        {carregando ? (
          <section style={cardBloco}>
            <p style={paragrafoPadrao}>Carregando leitura local do Marketplace...</p>
          </section>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 0.8fr',
              gap: 20,
            }}
          >
            <section style={cardBloco}>
              <div style={{ marginBottom: 18 }}>
                <h2 style={tituloSecao}>Produto selecionado</h2>
                <p style={paragrafoPadrao}>
                  Nesta fase, o sistema tenta ler o produto salvo no interesse. Se não encontrar,
                  usa o primeiro item disponível como base de continuidade.
                </p>
              </div>

              {produto ? (
                <div
                  style={{
                    display: 'grid',
                    gap: 16,
                    border: '1px solid rgba(14,116,144,0.12)',
                    borderRadius: 22,
                    padding: 18,
                    background: 'linear-gradient(180deg, #ffffff 0%, #f6fcff 100%)',
                  }}
                >
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                    <span style={pillAtivo}>Disponível</span>
                    {produto.categoria ? <span style={pillNeutro}>{produto.categoria}</span> : null}
                    {produto.lojaNome ? <span style={pillNeutro}>{produto.lojaNome}</span> : null}
                  </div>

                  <div>
                    <h3
                      style={{
                        fontSize: 28,
                        lineHeight: 1.1,
                        margin: '0 0 8px',
                      }}
                    >
                      {produto.nome}
                    </h3>
                    <div
                      style={{
                        fontSize: 28,
                        fontWeight: 800,
                        color: '#0f766e',
                        marginBottom: 10,
                      }}
                    >
                      {moeda(Number(produto.preco || 0))}
                    </div>
                    <p style={paragrafoPadrao}>
                      {produto.descricao?.trim()
                        ? produto.descricao
                        : 'Descrição ainda não informada para este item.'}
                    </p>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                      gap: 12,
                    }}
                  >
                    <div style={subCard}>
                      <strong style={labelMini}>Categoria</strong>
                      <div style={valorMini}>{produto.categoria || 'Não informada'}</div>
                    </div>
                    <div style={subCard}>
                      <strong style={labelMini}>Estoque</strong>
                      <div style={valorMini}>{produto.estoque || 'Não informado'}</div>
                    </div>
                    <div style={subCard}>
                      <strong style={labelMini}>Vendedor</strong>
                      <div style={valorMini}>{produto.vendedorNome || 'Não informado'}</div>
                    </div>
                    <div style={subCard}>
                      <strong style={labelMini}>Loja pública</strong>
                      <div style={valorMini}>{produto.lojaSlug || 'Sem slug'}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={caixaAviso}>
                  Nenhum produto foi encontrado no armazenamento local nesta etapa.
                </div>
              )}
            </section>

            <section style={cardBloco}>
              <div style={{ marginBottom: 18 }}>
                <h2 style={tituloSecao}>Entrega do comprador</h2>
                <p style={paragrafoPadrao}>
                  Base atual do endereço que será reaproveitado no pedido local e no histórico.
                </p>
              </div>

              <div
                style={{
                  display: 'grid',
                  gap: 12,
                  border: '1px solid rgba(14,116,144,0.12)',
                  borderRadius: 22,
                  padding: 18,
                  background: '#ffffff',
                }}
              >
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {entregaCompleta ? (
                    <span style={pillAtivo}>Entrega pronta</span>
                  ) : (
                    <span style={pillPendente}>Entrega incompleta</span>
                  )}
                </div>

                <div style={subCard}>
                  <strong style={labelMini}>Nome</strong>
                  <div style={valorMini}>{entrega.nome || 'Não informado'}</div>
                </div>

                <div style={subCard}>
                  <strong style={labelMini}>Telefone</strong>
                  <div style={valorMini}>{entrega.telefone || 'Não informado'}</div>
                </div>

                <div style={subCard}>
                  <strong style={labelMini}>E-mail</strong>
                  <div style={valorMini}>{entrega.email || 'Não informado'}</div>
                </div>

                <div style={subCard}>
                  <strong style={labelMini}>Endereço</strong>
                  <div style={valorMini}>
                    {linhasEndereco.length ? (
                      linhasEndereco.map((linha, index) => <div key={`${linha}-${index}`}>{linha}</div>)
                    ) : (
                      'Não informado'
                    )}
                  </div>
                </div>

                {entrega.referencia ? (
                  <div style={subCard}>
                    <strong style={labelMini}>Referência</strong>
                    <div style={valorMini}>{entrega.referencia}</div>
                  </div>
                ) : null}

                <Link href="/marketplace/comprador/entrega" style={botaoSecundario}>
                  Abrir endereço de entrega
                </Link>
              </div>
            </section>
          </div>
        )}

        <section
          style={{
            ...cardBloco,
            marginTop: 20,
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              gap: 16,
              alignItems: 'center',
            }}
          >
            <div>
              <h2 style={tituloSecao}>Fechamento inicial do pedido</h2>
              <p style={paragrafoPadrao}>
                Nesta primeira ligação, o pedido ainda é local. Ele já entra no histórico com status
                <strong> aguardando confirmação</strong>, pronto para evolução futura.
              </p>
              <p
                style={{
                  ...paragrafoPadrao,
                  marginBottom: 0,
                  color: '#0f766e',
                  fontWeight: 700,
                }}
              >
                Sistema em constante atualização e pode haver momentos de instabilidade.
              </p>
            </div>

            <button
              type="button"
              onClick={criarPedidoLocal}
              style={botaoPrincipal}
            >
              Criar pedido local
            </button>
          </div>

          {mensagem ? (
            <div
              style={{
                marginTop: 16,
                borderRadius: 18,
                border: '1px solid rgba(13, 148, 136, 0.18)',
                background: 'rgba(240, 253, 250, 0.95)',
                color: '#115e59',
                padding: '14px 16px',
                fontWeight: 700,
              }}
            >
              {mensagem}
            </div>
          ) : null}

          {pedidoCriado ? (
            <div
              style={{
                marginTop: 18,
                display: 'grid',
                gap: 12,
                border: '1px solid rgba(14,116,144,0.12)',
                borderRadius: 22,
                background: '#ffffff',
                padding: 18,
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: 22,
                  lineHeight: 1.1,
                }}
              >
                Pedido local criado
              </h3>

              <div style={subCard}>
                <strong style={labelMini}>Número do pedido</strong>
                <div style={valorMini}>{pedidoCriado.id}</div>
              </div>

              <div style={subCard}>
                <strong style={labelMini}>Produto</strong>
                <div style={valorMini}>{pedidoCriado.produtoNome}</div>
              </div>

              <div style={subCard}>
                <strong style={labelMini}>Valor</strong>
                <div style={valorMini}>{moeda(pedidoCriado.produtoPreco)}</div>
              </div>

              <div style={subCard}>
                <strong style={labelMini}>Comprador</strong>
                <div style={valorMini}>{pedidoCriado.compradorNome || 'Não informado'}</div>
              </div>

              <div style={subCard}>
                <strong style={labelMini}>Status</strong>
                <div style={valorMini}>Aguardando confirmação</div>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 10,
                  marginTop: 6,
                }}
              >
                <Link href="/marketplace/comprador" style={botaoSecundario}>
                  Voltar ao comprador
                </Link>
                <Link href="/marketplace/interesse" style={botaoSecundario}>
                  Voltar ao interesse
                </Link>
              </div>
            </div>
          ) : null}
        </section>
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

const botaoPrincipal: React.CSSProperties = {
  border: 'none',
  borderRadius: 18,
  padding: '14px 18px',
  background: 'linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%)',
  color: '#083344',
  fontWeight: 800,
  fontSize: 15,
  cursor: 'pointer',
  boxShadow: '0 16px 40px rgba(6, 182, 212, 0.22)',
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

const pillAtivo: React.CSSProperties = {
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

const pillPendente: React.CSSProperties = {
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