'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState, type CSSProperties } from 'react'

type SellerVerification = {
  nome?: string
  documento?: string
  telefone?: string
  pix?: string
  aceite?: boolean
  status?: 'em_analise' | 'verificado' | 'rejeitado'
  criadoEm?: string
}

type SellerProduct = {
  id: string
  nome: string
  preco: string
  categoria: string
  estoque: string
  status: 'disponivel' | 'pausado' | 'rascunho'
  imagem: string
  descricao: string
  criadoEm: string
}

const VERIFICATION_KEY = 'aurora_vendedor_verificacao'
const PRODUCTS_KEY = 'aurora-marketplace-vendedor-produtos'

function parseProductsFromStorage(): SellerProduct[] {
  if (typeof window === 'undefined') return []

  try {
    const raw = localStorage.getItem(PRODUCTS_KEY)
    if (!raw) return []

    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    return parsed
      .map((item: any) => ({
        id: String(item?.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`),
        nome: String(item?.nome || ''),
        preco: String(item?.preco || ''),
        categoria: String(item?.categoria || ''),
        estoque: String(item?.estoque || ''),
        status:
          item?.status === 'pausado' || item?.status === 'rascunho'
            ? item.status
            : 'disponivel',
        imagem: String(item?.imagem || ''),
        descricao: String(item?.descricao || ''),
        criadoEm: String(item?.criadoEm || new Date().toISOString()),
      }))
      .sort((a, b) => {
        const dateA = new Date(a.criadoEm).getTime()
        const dateB = new Date(b.criadoEm).getTime()
        return dateB - dateA
      })
  } catch (error) {
    console.error('Erro ao ler vitrine do vendedor:', error)
    return []
  }
}

export default function MarketplaceVendedorVitrinePage() {
  const [loading, setLoading] = useState(true)
  const [isVerified, setIsVerified] = useState(false)
  const [verification, setVerification] = useState<SellerVerification | null>(null)
  const [products, setProducts] = useState<SellerProduct[]>([])

  useEffect(() => {
    try {
      const rawVerification = localStorage.getItem(VERIFICATION_KEY)
      const parsedVerification = rawVerification
        ? (JSON.parse(rawVerification) as SellerVerification)
        : null

      setVerification(parsedVerification)
      setIsVerified(parsedVerification?.status === 'verificado')

      const storedProducts = parseProductsFromStorage()
      setProducts(storedProducts)
    } catch (error) {
      console.error('Erro ao carregar vitrine do vendedor:', error)
      setVerification(null)
      setIsVerified(false)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [])

  const metrics = useMemo(() => {
    const total = products.length
    const disponiveis = products.filter((item) => item.status === 'disponivel').length
    const pausados = products.filter((item) => item.status === 'pausado').length
    const rascunhos = products.filter((item) => item.status === 'rascunho').length

    return {
      total,
      disponiveis,
      pausados,
      rascunhos,
    }
  }, [products])

  const visibleProducts = useMemo(() => {
    return products.filter((item) => item.status === 'disponivel')
  }, [products])

  if (loading) {
    return (
      <main style={styles.page}>
        <section style={styles.centerCard}>
          <p style={styles.kicker}>Aurora Marketplace • Vitrine do vendedor</p>
          <h1 style={styles.title}>Carregando vitrine protegida...</h1>
          <p style={styles.subtitle}>
            Estamos validando se o vendedor está autorizado a acessar a vitrine operacional.
          </p>
        </section>
      </main>
    )
  }

  if (!isVerified) {
    return (
      <main style={styles.page}>
        <section style={styles.blockedCard}>
          <p style={styles.kicker}>Aurora Marketplace • Vitrine do vendedor</p>
          <h1 style={styles.title}>Vitrine bloqueada por segurança</h1>
          <p style={styles.subtitle}>
            Esta área só pode ser acessada por vendedor com status <strong>verificado</strong>.
            A vitrine operacional não deve ficar disponível para perfis sem validação concluída.
          </p>

          <div style={styles.notice}>
            Status atual:{' '}
            <strong>
              {verification?.status ? verification.status.toUpperCase() : 'NÃO ENVIADO'}
            </strong>
          </div>

          <div style={styles.summaryGrid}>
            <div style={styles.summaryItem}>
              <span style={styles.summaryLabel}>Nome / razão social</span>
              <strong style={styles.summaryValue}>
                {verification?.nome || 'Não informado'}
              </strong>
            </div>

            <div style={styles.summaryItem}>
              <span style={styles.summaryLabel}>Documento</span>
              <strong style={styles.summaryValue}>
                {verification?.documento || 'Não informado'}
              </strong>
            </div>

            <div style={styles.summaryItem}>
              <span style={styles.summaryLabel}>Telefone</span>
              <strong style={styles.summaryValue}>
                {verification?.telefone || 'Não informado'}
              </strong>
            </div>

            <div style={styles.summaryItem}>
              <span style={styles.summaryLabel}>Chave PIX</span>
              <strong style={styles.summaryValue}>
                {verification?.pix || 'Não informada'}
              </strong>
            </div>
          </div>

          <div style={styles.buttonRow}>
            <Link href="/marketplace/vendedor/acesso-seguro" style={styles.primaryButton}>
              Ir para acesso seguro
            </Link>
            <Link href="/marketplace/vendedor/verificacao" style={styles.secondaryButton}>
              Revisar verificação
            </Link>
            <Link href="/marketplace/vendedor" style={styles.secondaryButton}>
              Voltar à área do vendedor
            </Link>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.heroTop}>
          <div>
            <p style={styles.kicker}>Aurora Marketplace • Vitrine do vendedor</p>
            <h1 style={styles.title}>Vitrine protegida</h1>
            <p style={styles.subtitle}>
              Área operacional da vitrine liberada apenas para vendedor <strong>verificado</strong>.
              Aqui o catálogo já aparece pronto para leitura comercial e preparação da loja pública.
            </p>
          </div>

          <div style={styles.actions}>
            <Link href="/marketplace/vendedor" style={styles.secondaryButton}>
              Área do vendedor
            </Link>
            <Link href="/marketplace/vendedor/produtos" style={styles.primaryButton}>
              Gerenciar produtos
            </Link>
          </div>
        </div>

        <div style={styles.notice}>
          Sistema em constante atualização e podem ocorrer instabilidades momentâneas durante melhorias.
        </div>
      </section>

      <section style={styles.metricsGrid}>
        <article style={styles.metricCard}>
          <span style={styles.metricLabel}>Produtos totais</span>
          <strong style={styles.metricValue}>{metrics.total}</strong>
          <span style={styles.metricHelp}>Tudo o que já foi salvo na área protegida</span>
        </article>

        <article style={styles.metricCard}>
          <span style={styles.metricLabel}>Disponíveis</span>
          <strong style={styles.metricValue}>{metrics.disponiveis}</strong>
          <span style={styles.metricHelp}>Itens ativos para exibição comercial</span>
        </article>

        <article style={styles.metricCard}>
          <span style={styles.metricLabel}>Pausados</span>
          <strong style={styles.metricValue}>{metrics.pausados}</strong>
          <span style={styles.metricHelp}>Itens fora da vitrine no momento</span>
        </article>

        <article style={styles.metricCard}>
          <span style={styles.metricLabel}>Rascunhos</span>
          <strong style={styles.metricValue}>{metrics.rascunhos}</strong>
          <span style={styles.metricHelp}>Itens ainda em preparação</span>
        </article>
      </section>

      <section style={styles.contentGrid}>
        <article style={styles.sideCard}>
          <div style={styles.sectionHeader}>
            <p style={styles.sectionKicker}>Leitura rápida</p>
            <h2 style={styles.sectionTitle}>Resumo da conta</h2>
            <p style={styles.sectionText}>
              Esta vitrine só abre porque a conta está validada para operação comercial.
            </p>
          </div>

          <div style={styles.summaryGrid}>
            <div style={styles.summaryItem}>
              <span style={styles.summaryLabel}>Vendedor</span>
              <strong style={styles.summaryValue}>
                {verification?.nome || 'Não informado'}
              </strong>
            </div>

            <div style={styles.summaryItem}>
              <span style={styles.summaryLabel}>Status da conta</span>
              <strong style={styles.summaryValue}>
                {verification?.status?.toUpperCase() || 'NÃO INFORMADO'}
              </strong>
            </div>

            <div style={styles.summaryItem}>
              <span style={styles.summaryLabel}>Documento</span>
              <strong style={styles.summaryValue}>
                {verification?.documento || 'Não informado'}
              </strong>
            </div>

            <div style={styles.summaryItem}>
              <span style={styles.summaryLabel}>Telefone</span>
              <strong style={styles.summaryValue}>
                {verification?.telefone || 'Não informado'}
              </strong>
            </div>
          </div>

          <div style={styles.helperBox}>
            A operação desta página está blindada localmente para abrir apenas quando o vendedor estiver verificado.
          </div>

          <div style={styles.buttonRow}>
            <Link href="/marketplace/vendedor/produtos" style={styles.primaryButton}>
              Cadastrar produto
            </Link>
            <Link href="/marketplace/vendedor/acesso-seguro" style={styles.secondaryButton}>
              Ver status seguro
            </Link>
          </div>
        </article>

        <article style={styles.mainCard}>
          <div style={styles.sectionHeader}>
            <p style={styles.sectionKicker}>Leitura comercial</p>
            <h2 style={styles.sectionTitle}>Produtos prontos para vitrine</h2>
            <p style={styles.sectionText}>
              Aqui exibimos apenas os produtos marcados como <strong>disponível</strong>.
            </p>
          </div>

          {visibleProducts.length === 0 ? (
            <div style={styles.emptyBox}>
              Nenhum produto disponível para vitrine ainda. Cadastre ou ative produtos na área protegida do vendedor.
            </div>
          ) : (
            <div style={styles.productsGrid}>
              {visibleProducts.map((product) => (
                <article key={product.id} style={styles.productCard}>
                  <div style={styles.productTop}>
                    <span style={styles.productBadge}>DISPONÍVEL</span>
                    <span style={styles.productDate}>
                      {new Date(product.criadoEm).toLocaleString('pt-BR')}
                    </span>
                  </div>

                  <h3 style={styles.productTitle}>{product.nome || 'Produto sem nome'}</h3>

                  <div style={styles.productInfoGrid}>
                    <div style={styles.summaryItem}>
                      <span style={styles.summaryLabel}>Preço</span>
                      <strong style={styles.summaryValue}>
                        {product.preco || 'Não informado'}
                      </strong>
                    </div>

                    <div style={styles.summaryItem}>
                      <span style={styles.summaryLabel}>Categoria</span>
                      <strong style={styles.summaryValue}>
                        {product.categoria || 'Não informada'}
                      </strong>
                    </div>

                    <div style={styles.summaryItem}>
                      <span style={styles.summaryLabel}>Estoque</span>
                      <strong style={styles.summaryValue}>
                        {product.estoque || 'Não informado'}
                      </strong>
                    </div>

                    <div style={styles.summaryItem}>
                      <span style={styles.summaryLabel}>Imagem</span>
                      <strong style={styles.summaryValue}>
                        {product.imagem || 'Não informada'}
                      </strong>
                    </div>
                  </div>

                  <div style={styles.descriptionBox}>
                    <span style={styles.summaryLabel}>Descrição</span>
                    <p style={styles.descriptionText}>
                      {product.descricao || 'Descrição ainda não informada para este item.'}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </article>
      </section>
    </main>
  )
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #eef8ff 0%, #ffffff 100%)',
    padding: '24px 16px 56px',
    color: '#0f172a',
  },
  centerCard: {
    maxWidth: 820,
    margin: '0 auto',
    background: '#ffffff',
    borderRadius: 28,
    padding: 24,
    border: '1px solid rgba(8, 145, 178, 0.12)',
    boxShadow: '0 20px 60px rgba(15, 23, 42, 0.08)',
  },
  blockedCard: {
    maxWidth: 980,
    margin: '0 auto',
    background: '#fff7ed',
    borderRadius: 28,
    padding: 24,
    border: '1px solid #fed7aa',
    boxShadow: '0 20px 60px rgba(15, 23, 42, 0.08)',
  },
  hero: {
    maxWidth: '1200px',
    margin: '0 auto 20px auto',
    background: 'rgba(255,255,255,0.94)',
    border: '1px solid rgba(8, 145, 178, 0.14)',
    borderRadius: 28,
    padding: 24,
    boxShadow: '0 18px 60px rgba(15, 23, 42, 0.08)',
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
    maxWidth: 860,
    fontSize: 16,
    lineHeight: 1.7,
    color: '#334155',
  },
  actions: {
    display: 'flex',
    gap: 12,
    flexWrap: 'wrap',
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
  contentGrid: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'minmax(320px, 1fr) minmax(0, 2fr)',
    gap: 16,
  },
  sideCard: {
    background: '#ffffff',
    borderRadius: 24,
    padding: 22,
    border: '1px solid rgba(8, 145, 178, 0.12)',
    boxShadow: '0 16px 44px rgba(15, 23, 42, 0.06)',
  },
  mainCard: {
    background: '#ffffff',
    borderRadius: 24,
    padding: 22,
    border: '1px solid rgba(8, 145, 178, 0.12)',
    boxShadow: '0 16px 44px rgba(15, 23, 42, 0.06)',
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
    margin: '6px 0 10px',
    fontSize: 28,
    lineHeight: 1.15,
    color: '#082f49',
  },
  sectionText: {
    margin: 0,
    fontSize: 15,
    lineHeight: 1.7,
    color: '#475569',
  },
  buttonRow: {
    marginTop: 18,
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
  helperBox: {
    marginTop: 16,
    borderRadius: 16,
    padding: '14px 16px',
    background: '#eff6ff',
    border: '1px solid #bfdbfe',
    color: '#1d4ed8',
    fontWeight: 700,
    lineHeight: 1.6,
  },
  emptyBox: {
    borderRadius: 18,
    padding: 18,
    background: '#f8fafc',
    border: '1px solid rgba(148, 163, 184, 0.15)',
    color: '#475569',
    lineHeight: 1.7,
  },
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 16,
  },
  productCard: {
    background: '#ffffff',
    borderRadius: 22,
    padding: 18,
    border: '1px solid rgba(8, 145, 178, 0.12)',
    boxShadow: '0 12px 34px rgba(15, 23, 42, 0.05)',
  },
  productTop: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 12,
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  productBadge: {
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
  productDate: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: 700,
  },
  productTitle: {
    margin: '12px 0 14px',
    fontSize: 22,
    lineHeight: 1.2,
    color: '#082f49',
  },
  productInfoGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12,
  },
  summaryGrid: {
    marginTop: 18,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 12,
  },
  summaryItem: {
    background: 'rgba(255,255,255,0.82)',
    borderRadius: 16,
    padding: 14,
    border: '1px solid rgba(148, 163, 184, 0.15)',
  },
  summaryLabel: {
    display: 'block',
    fontSize: 12,
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: '#0891b2',
  },
  summaryValue: {
    display: 'block',
    marginTop: 8,
    fontSize: 15,
    lineHeight: 1.5,
    color: '#0f172a',
    wordBreak: 'break-word',
  },
  descriptionBox: {
    marginTop: 14,
    background: '#f8fafc',
    borderRadius: 18,
    padding: 14,
    border: '1px solid rgba(148, 163, 184, 0.15)',
  },
  descriptionText: {
    margin: '8px 0 0',
    color: '#334155',
    lineHeight: 1.6,
    fontSize: 15,
  },
}