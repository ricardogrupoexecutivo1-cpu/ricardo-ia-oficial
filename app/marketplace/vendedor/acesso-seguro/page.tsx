'use client'

import Link from 'next/link'
import { useEffect, useState, type CSSProperties } from 'react'

type VerificacaoVendedor = {
  nome?: string
  documento?: string
  telefone?: string
  pix?: string
  aceite?: boolean
  status?: 'em_analise' | 'verificado' | 'rejeitado'
  criadoEm?: string
}

const STORAGE_KEY = 'aurora_vendedor_verificacao'

export default function MarketplaceVendedorAcessoSeguroPage() {
  const [loading, setLoading] = useState(true)
  const [verificacao, setVerificacao] = useState<VerificacaoVendedor | null>(null)

  useEffect(() => {
    carregarVerificacao()
  }, [])

  function carregarVerificacao() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)

      if (!raw) {
        setVerificacao(null)
        setLoading(false)
        return
      }

      const parsed = JSON.parse(raw) as VerificacaoVendedor
      setVerificacao(parsed)
    } catch (error) {
      console.error('Erro ao ler verificação do vendedor:', error)
      setVerificacao(null)
    } finally {
      setLoading(false)
    }
  }

  function atualizarStatus(status: 'em_analise' | 'verificado' | 'rejeitado') {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return

      const parsed = JSON.parse(raw) as VerificacaoVendedor
      const atualizado = {
        ...parsed,
        status,
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(atualizado))
      setVerificacao(atualizado)
      alert(`Status atualizado para: ${status}`)
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      alert('Não foi possível atualizar o status.')
    }
  }

  const status = verificacao?.status || 'nao_enviado'

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <p style={styles.kicker}>Aurora Marketplace • Vendedor</p>
        <h1 style={styles.title}>Acesso seguro do vendedor</h1>
        <p style={styles.subtitle}>
          Porta de entrada isolada para proteger a operação do Marketplace. O vendedor
          só deve avançar para a área operacional após iniciar ou concluir a validação
          de identidade.
        </p>

        <div style={styles.notice}>
          Sistema em constante atualização e podem ocorrer instabilidades momentâneas
          durante melhorias.
        </div>

        {loading ? (
          <section style={styles.statusBox}>
            <span style={styles.statusLabel}>Status</span>
            <strong style={styles.statusValue}>Carregando verificação...</strong>
            <p style={styles.statusText}>
              Estamos validando a base local da verificação do vendedor.
            </p>
          </section>
        ) : status === 'nao_enviado' ? (
          <section style={styles.blockBox}>
            <span style={styles.statusLabel}>Status</span>
            <strong style={styles.blockTitle}>Verificação obrigatória pendente</strong>
            <p style={styles.statusText}>
              Ainda não encontramos dados de verificação do vendedor. Para proteger a
              plataforma, anúncios e recebimentos devem passar primeiro pela validação
              de identidade e de dados de recebimento.
            </p>

            <div style={styles.buttonRow}>
              <Link href="/marketplace/vendedor/verificacao" style={styles.primaryButton}>
                Fazer verificação agora
              </Link>
              <Link href="/marketplace" style={styles.secondaryButton}>
                Voltar ao Marketplace
              </Link>
            </div>
          </section>
        ) : status === 'rejeitado' ? (
          <section style={styles.blockBox}>
            <span style={styles.statusLabel}>Status</span>
            <strong style={styles.blockTitle}>Verificação reprovada</strong>
            <p style={styles.statusText}>
              Seus dados precisam de nova revisão antes de vender na plataforma.
              Revise documento, telefone e chave PIX e envie novamente.
            </p>

            <div style={styles.summaryGrid}>
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Nome / razão social</span>
                <strong style={styles.summaryValue}>
                  {verificacao?.nome || 'Não informado'}
                </strong>
              </div>
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Documento</span>
                <strong style={styles.summaryValue}>
                  {verificacao?.documento || 'Não informado'}
                </strong>
              </div>
            </div>

            <div style={styles.buttonRow}>
              <button
                style={styles.secondaryActionButton}
                onClick={() => atualizarStatus('em_analise')}
              >
                Voltar para análise
              </button>
              <Link href="/marketplace/vendedor/verificacao" style={styles.primaryButton}>
                Corrigir verificação
              </Link>
            </div>
          </section>
        ) : status === 'em_analise' ? (
          <section style={styles.analysisBox}>
            <span style={styles.statusLabel}>Status</span>
            <strong style={styles.analysisTitle}>Verificação em análise</strong>
            <p style={styles.statusText}>
              Seu cadastro já entrou na fila de validação. Por segurança, a plataforma
              só deve liberar plenamente a operação após aprovação final.
            </p>

            <div style={styles.summaryGrid}>
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Nome / razão social</span>
                <strong style={styles.summaryValue}>
                  {verificacao?.nome || 'Não informado'}
                </strong>
              </div>

              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Documento</span>
                <strong style={styles.summaryValue}>
                  {verificacao?.documento || 'Não informado'}
                </strong>
              </div>

              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Telefone</span>
                <strong style={styles.summaryValue}>
                  {verificacao?.telefone || 'Não informado'}
                </strong>
              </div>

              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Chave PIX</span>
                <strong style={styles.summaryValue}>
                  {verificacao?.pix || 'Não informada'}
                </strong>
              </div>
            </div>

            <div style={styles.buttonRow}>
              <button
                style={styles.primaryActionButton}
                onClick={() => atualizarStatus('verificado')}
              >
                Aprovar vendedor
              </button>
              <button
                style={styles.secondaryActionButton}
                onClick={() => atualizarStatus('rejeitado')}
              >
                Reprovar vendedor
              </button>
              <Link href="/marketplace/vendedor/verificacao" style={styles.secondaryButton}>
                Revisar verificação
              </Link>
            </div>
          </section>
        ) : (
          <section style={styles.approvedBox}>
            <span style={styles.statusLabel}>Status</span>
            <strong style={styles.approvedTitle}>Vendedor liberado</strong>
            <p style={styles.statusText}>
              Sua verificação foi aprovada. Agora a entrada para a operação do vendedor
              já pode seguir pela camada protegida.
            </p>

            <div style={styles.summaryGrid}>
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Nome / razão social</span>
                <strong style={styles.summaryValue}>
                  {verificacao?.nome || 'Não informado'}
                </strong>
              </div>

              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Documento</span>
                <strong style={styles.summaryValue}>
                  {verificacao?.documento || 'Não informado'}
                </strong>
              </div>

              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Telefone</span>
                <strong style={styles.summaryValue}>
                  {verificacao?.telefone || 'Não informado'}
                </strong>
              </div>

              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Chave PIX</span>
                <strong style={styles.summaryValue}>
                  {verificacao?.pix || 'Não informada'}
                </strong>
              </div>
            </div>

            <div style={styles.buttonRow}>
              <Link href="/marketplace/vendedor/produtos" style={styles.primaryButton}>
                Entrar na área do vendedor
              </Link>
              <button
                style={styles.secondaryActionButton}
                onClick={() => atualizarStatus('em_analise')}
              >
                Voltar para análise
              </button>
            </div>
          </section>
        )}
      </section>
    </main>
  )
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #eef8ff 0%, #ffffff 100%)',
    padding: '24px 16px 56px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 920,
    background: '#ffffff',
    borderRadius: 28,
    padding: 24,
    border: '1px solid rgba(8, 145, 178, 0.12)',
    boxShadow: '0 20px 60px rgba(15, 23, 42, 0.08)',
  },
  kicker: {
    margin: 0,
    fontSize: 13,
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    color: '#0891b2',
  },
  title: {
    margin: '8px 0 10px',
    fontSize: 'clamp(28px, 4vw, 42px)',
    lineHeight: 1.05,
    color: '#082f49',
    fontWeight: 900,
  },
  subtitle: {
    margin: 0,
    fontSize: 16,
    lineHeight: 1.7,
    color: '#334155',
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
  statusBox: {
    marginTop: 20,
    borderRadius: 24,
    padding: 22,
    background: '#ffffff',
    border: '1px solid rgba(148, 163, 184, 0.22)',
  },
  blockBox: {
    marginTop: 20,
    borderRadius: 24,
    padding: 22,
    background: '#fff7ed',
    border: '1px solid #fed7aa',
  },
  analysisBox: {
    marginTop: 20,
    borderRadius: 24,
    padding: 22,
    background: '#eff6ff',
    border: '1px solid #bfdbfe',
  },
  approvedBox: {
    marginTop: 20,
    borderRadius: 24,
    padding: 22,
    background: '#ecfdf5',
    border: '1px solid #a7f3d0',
  },
  statusLabel: {
    display: 'block',
    fontSize: 12,
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#0891b2',
  },
  statusValue: {
    display: 'block',
    marginTop: 10,
    fontSize: 24,
    color: '#082f49',
  },
  blockTitle: {
    display: 'block',
    marginTop: 10,
    fontSize: 26,
    lineHeight: 1.15,
    color: '#9a3412',
  },
  analysisTitle: {
    display: 'block',
    marginTop: 10,
    fontSize: 26,
    lineHeight: 1.15,
    color: '#1d4ed8',
  },
  approvedTitle: {
    display: 'block',
    marginTop: 10,
    fontSize: 26,
    lineHeight: 1.15,
    color: '#047857',
  },
  statusText: {
    margin: '12px 0 0',
    fontSize: 15,
    lineHeight: 1.7,
    color: '#334155',
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
  primaryActionButton: {
    minHeight: 46,
    padding: '0 18px',
    borderRadius: 14,
    border: 'none',
    fontWeight: 800,
    background: 'linear-gradient(135deg, #22d3ee 0%, #0ea5e9 100%)',
    color: '#ffffff',
    boxShadow: '0 14px 28px rgba(14, 165, 233, 0.25)',
    cursor: 'pointer',
  },
  secondaryActionButton: {
    minHeight: 46,
    padding: '0 18px',
    borderRadius: 14,
    border: '1px solid rgba(148, 163, 184, 0.35)',
    fontWeight: 800,
    background: '#ffffff',
    color: '#0f172a',
    cursor: 'pointer',
  },
  summaryGrid: {
    marginTop: 18,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 12,
  },
  summaryItem: {
    background: 'rgba(255,255,255,0.78)',
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
}