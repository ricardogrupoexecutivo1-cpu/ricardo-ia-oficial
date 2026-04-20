'use client'

import Link from 'next/link'
import type { CSSProperties } from 'react'

export default function MarketplacePage() {

  const page: CSSProperties = {
    minHeight: '100vh',
    background: '#f0f9ff',
    padding: 20
  }

  const card: CSSProperties = {
    background: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    border: '1px solid #e2e8f0'
  }

  const button: CSSProperties = {
    display: 'inline-block',
    padding: '10px 14px',
    borderRadius: 10,
    background: '#06b6d4',
    color: '#fff',
    fontWeight: 700,
    textDecoration: 'none'
  }

  return (
    <main style={page}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        <div style={card}>
          <h1>Marketplace Aurora Shop</h1>
          <p>Venda online com estrutura simples, leve e escalável.</p>
        </div>

        <div style={card}>
          <h2>💰 Modelo de monetização</h2>
          <p><strong>Sem mensalidade.</strong></p>
          <p><strong>Sem plano obrigatório.</strong></p>
          <p><strong>Comissão de 5% apenas quando vender.</strong></p>
          <p>A Aurora só ganha quando você ganha.</p>
        </div>

        <div style={card}>
          <h2>🚀 Vantagens</h2>
          <ul>
            <li>Entrada gratuita para vendedores</li>
            <li>Página própria com link para divulgação</li>
            <li>Controle total do vendedor sobre operação</li>
            <li>Entrega por conta do vendedor</li>
            <li>Modelo leve sem custo fixo</li>
          </ul>
        </div>

        <div style={card}>
          <h2>📦 Para vendedores</h2>
          <p>Cadastre sua loja, publique seus produtos e comece a vender.</p>

          <Link href="/marketplace/vendedor/cadastro" style={button}>
            Quero vender
          </Link>
        </div>

        <div style={card}>
          <h2>🛒 Para compradores</h2>
          <p>Explore produtos, entre em contato com vendedores e feche negócios.</p>

          <Link href="/marketplace/comprador" style={button}>
            Quero comprar
          </Link>
        </div>

        <div style={card}>
          <h2>🔗 Navegação</h2>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link href="/marketplace/vendedor" style={button}>Área do vendedor</Link>
            <Link href="/marketplace/vendedor/vitrine" style={button}>Ver vitrine</Link>
            <Link href="/marketplace/comprador" style={button}>Área do comprador</Link>
          </div>
        </div>

      </div>
    </main>
  )
}