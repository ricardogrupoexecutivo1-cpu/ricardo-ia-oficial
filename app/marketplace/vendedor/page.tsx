'use client'

import Link from 'next/link'
import type { CSSProperties } from 'react'

export default function MarketplaceVendedorPage() {
  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.heroTop}>
          <div>
            <p style={styles.kicker}>Aurora Marketplace • Vendedor</p>
            <h1 style={styles.title}>Área do vendedor</h1>
            <p style={styles.subtitle}>
              Porta comercial do vendedor com entrada organizada para cadastro,
              verificação, vitrine e operação protegida. A segurança da plataforma
              começa pela validação do vendedor antes da liberação plena das vendas.
            </p>
          </div>

          <div style={styles.actions}>
            <Link href="/marketplace" style={styles.secondaryButton}>
              Voltar ao Marketplace
            </Link>
            <Link href="/marketplace/vendedor/acesso-seguro" style={styles.primaryButton}>
              Entrar com segurança
            </Link>
          </div>
        </div>

        <div style={styles.notice}>
          Sistema em constante atualização e podem ocorrer instabilidades momentâneas
          durante melhorias.
        </div>
      </section>

      <section style={styles.grid}>
        <article style={styles.card}>
          <span style={styles.cardLabel}>Etapa 1</span>
          <h2 style={styles.cardTitle}>Verificação obrigatória</h2>
          <p style={styles.cardText}>
            Antes de vender, o lojista deve validar identidade, documento, telefone
            e dados de recebimento. Essa é a camada que protege a reputação do
            Marketplace.
          </p>

          <div style={styles.cardButtons}>
            <Link href="/marketplace/vendedor/verificacao" style={styles.primaryButton}>
              Fazer verificação
            </Link>
            <Link href="/marketplace/vendedor/acesso-seguro" style={styles.secondaryButton}>
              Ver status seguro
            </Link>
          </div>
        </article>

        <article style={styles.card}>
          <span style={styles.cardLabel}>Etapa 2</span>
          <h2 style={styles.cardTitle}>Entrada protegida</h2>
          <p style={styles.cardText}>
            O caminho correto para a operação do vendedor agora passa primeiro pela
            camada de acesso seguro. Sem isso, a plataforma perde controle sobre quem
            realmente está apto a vender.
          </p>

          <div style={styles.cardButtons}>
            <Link href="/marketplace/vendedor/acesso-seguro" style={styles.primaryButton}>
              Acessar camada segura
            </Link>
          </div>
        </article>

        <article style={styles.card}>
          <span style={styles.cardLabel}>Etapa 3</span>
          <h2 style={styles.cardTitle}>Operação comercial</h2>
          <p style={styles.cardText}>
            Depois da aprovação, o vendedor segue para produtos, vitrine e operação
            real. Essa separação evita liberar vendas para perfis ainda sem análise.
          </p>

          <div style={styles.cardButtons}>
            <Link href="/marketplace/vendedor/produtos" style={styles.secondaryButton}>
              Ver produtos
            </Link>
            <Link href="/marketplace/vendedor/vitrine" style={styles.secondaryButton}>
              Ver vitrine
            </Link>
          </div>
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
  grid: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 16,
  },
  card: {
    background: '#ffffff',
    borderRadius: 24,
    padding: 22,
    border: '1px solid rgba(8, 145, 178, 0.12)',
    boxShadow: '0 16px 44px rgba(15, 23, 42, 0.06)',
  },
  cardLabel: {
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
  cardTitle: {
    margin: '12px 0 10px',
    fontSize: 24,
    lineHeight: 1.15,
    color: '#082f49',
  },
  cardText: {
    margin: 0,
    fontSize: 15,
    lineHeight: 1.7,
    color: '#475569',
  },
  cardButtons: {
    marginTop: 18,
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap',
  },
}