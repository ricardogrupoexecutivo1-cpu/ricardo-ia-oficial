'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'

type BlocoItem = {
  titulo: string
  descricao: string
}

const blocosPerfil: BlocoItem[] = [
  {
    titulo: 'Página pública própria',
    descricao:
      'Cada vendedor terá uma página própria com link exclusivo para divulgar seus produtos e sua vitrine.',
  },
  {
    titulo: 'Catálogo do vendedor',
    descricao:
      'Área para organizar produtos, fotos, preços, condições, entrega e destaque comercial.',
  },
  {
    titulo: 'Contratação de entrega',
    descricao:
      'O vendedor poderá informar e organizar a contratação da entrega em sua própria página.',
  },
  {
    titulo: 'Gestão independente',
    descricao:
      'O vendedor mantém sua operação, seu estoque, sua logística e sua responsabilidade comercial.',
  },
]

const blocosOperacao: BlocoItem[] = [
  {
    titulo: 'Produtos publicados',
    descricao:
      'Controle dos itens ativos, em revisão, pausados ou em destaque dentro do marketplace.',
  },
  {
    titulo: 'Pedidos recebidos',
    descricao:
      'Base para acompanhar pedidos, status, confirmação e andamento da operação do vendedor.',
  },
  {
    titulo: 'Taxas e comissão',
    descricao:
      'Leitura clara do percentual aplicado por venda e visão futura de repasses e saldos.',
  },
  {
    titulo: 'Divulgação por link',
    descricao:
      'Cada vendedor terá seu próprio link para compartilhar em WhatsApp, Instagram, Facebook e outros canais.',
  },
]

const proximasCamadas: BlocoItem[] = [
  {
    titulo: 'Cadastro do vendedor',
    descricao:
      'Formulário seguro para entrada no marketplace com dados da loja, contato e categoria.',
  },
  {
    titulo: 'Área da vitrine',
    descricao:
      'Página visual do vendedor com identidade própria, catálogo e meios de contratação.',
  },
  {
    titulo: 'Painel interno',
    descricao:
      'Visão operacional para gerenciar produtos, pedidos, taxas, destaques e performance.',
  },
  {
    titulo: 'Ligação com comprador',
    descricao:
      'Base futura para o comprador acompanhar histórico, pedidos e andamento dentro da plataforma.',
  },
]

export default function MarketplaceVendedorPage() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 820)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const pageStyle: CSSProperties = {
    minHeight: '100vh',
    background:
      'radial-gradient(circle at top, rgba(6,182,212,0.16), rgba(255,255,255,1) 28%, rgba(240,249,255,1) 65%, rgba(224,242,254,1) 100%)',
    color: '#0f172a',
    padding: isMobile ? '10px 10px 18px' : '14px 14px 22px',
  }

  const shellStyle: CSSProperties = {
    width: '100%',
    maxWidth: 1280,
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: isMobile ? 12 : 14,
  }

  const sectionCardStyle: CSSProperties = {
    borderRadius: isMobile ? 20 : 24,
    background: '#ffffff',
    border: '1px solid rgba(6,182,212,0.12)',
    boxShadow: '0 14px 40px rgba(2,132,199,0.08)',
  }

  const badgeStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    borderRadius: 999,
    border: '1px solid rgba(6,182,212,0.18)',
    background: '#ecfeff',
    color: '#0369a1',
    padding: isMobile ? '5px 9px' : '6px 10px',
    fontSize: 10,
    fontWeight: 900,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  }

  const titleStyle: CSSProperties = {
    margin: '10px 0 0',
    fontSize: isMobile ? 24 : 30,
    lineHeight: 1.05,
    fontWeight: 900,
    letterSpacing: '-0.03em',
  }

  const textStyle: CSSProperties = {
    margin: '8px 0 0',
    color: '#475569',
    fontSize: isMobile ? 13 : 14,
    lineHeight: 1.55,
  }

  const primaryButtonStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: isMobile ? 38 : 40,
    padding: isMobile ? '0 12px' : '0 14px',
    borderRadius: 10,
    background: 'linear-gradient(135deg, #06b6d4 0%, #2563eb 100%)',
    color: '#ffffff',
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontSize: 11,
    boxShadow: '0 10px 18px rgba(2,132,199,0.14)',
  }

  const darkButtonStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: isMobile ? 38 : 40,
    padding: isMobile ? '0 12px' : '0 14px',
    borderRadius: 10,
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    color: '#ffffff',
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontSize: 11,
  }

  const outlineButtonStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: isMobile ? 38 : 40,
    padding: isMobile ? '0 12px' : '0 14px',
    borderRadius: 10,
    border: '1px solid rgba(6,182,212,0.18)',
    background: '#ffffff',
    color: '#0369a1',
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontSize: 11,
  }

  return (
    <main style={pageStyle}>
      <div style={shellStyle}>
        <section style={{ ...sectionCardStyle, overflow: 'hidden' }}>
          <div
            style={{
              background: 'linear-gradient(135deg, #06b6d4 0%, #0ea5e9 48%, #2563eb 100%)',
              color: '#ffffff',
              padding: isMobile ? '16px 14px' : '18px 18px',
            }}
          >
            <div
              style={{
                display: 'grid',
                gap: 12,
                gridTemplateColumns: isMobile ? '1fr' : '1.12fr 0.88fr',
                alignItems: 'stretch',
              }}
            >
              <div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '6px 10px',
                    borderRadius: 999,
                    border: '1px solid rgba(255,255,255,0.24)',
                    background: 'rgba(255,255,255,0.10)',
                    fontSize: 10,
                    fontWeight: 900,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  Aurora Marketplace • Vendedor
                </div>

                <h1
                  style={{
                    margin: '10px 0 0',
                    fontSize: isMobile ? 30 : 36,
                    lineHeight: 0.96,
                    fontWeight: 900,
                    letterSpacing: '-0.04em',
                  }}
                >
                  ÁREA DO VENDEDOR
                </h1>

                <p
                  style={{
                    margin: '10px 0 0',
                    maxWidth: 760,
                    fontSize: isMobile ? 13 : 14,
                    lineHeight: 1.55,
                    color: 'rgba(255,255,255,0.92)',
                  }}
                >
                  Camada isolada para estruturar a entrada do vendedor, sua página própria, sua
                  vitrine, seu link de divulgação e sua operação dentro do Marketplace Aurora Shop.
                </p>

                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 8,
                    marginTop: 12,
                  }}
                >
                  <Link href="/marketplace" style={outlineButtonStyle}>
                    Voltar ao marketplace
                  </Link>

                  <Link href="/global" style={primaryButtonStyle}>
                    Voltar à home global
                  </Link>
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                  gap: 8,
                }}
              >
                {[
                  ['Página', 'Própria do vendedor'],
                  ['Link', 'Exclusivo para divulgar'],
                  ['Operação', 'Separada e segura'],
                  ['Base', 'Pronta para crescer'],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    style={{
                      borderRadius: 14,
                      padding: isMobile ? 10 : 12,
                      background: 'rgba(255,255,255,0.14)',
                      border: '1px solid rgba(255,255,255,0.18)',
                    }}
                  >
                    <div
                      style={{
                        fontSize: 9,
                        fontWeight: 900,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.84)',
                      }}
                    >
                      {label}
                    </div>
                    <div
                      style={{
                        marginTop: 6,
                        fontSize: isMobile ? 15 : 17,
                        lineHeight: 1.15,
                        fontWeight: 900,
                      }}
                    >
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ padding: isMobile ? 12 : 14 }}>
            <div
              style={{
                display: 'grid',
                gap: 12,
                gridTemplateColumns: isMobile ? '1fr' : '1.18fr 0.82fr',
              }}
            >
              <div
                style={{
                  borderRadius: 18,
                  border: '1px solid rgba(6,182,212,0.14)',
                  background: 'linear-gradient(180deg, #ffffff 0%, #f0f9ff 100%)',
                  padding: isMobile ? 12 : 14,
                  boxShadow: '0 8px 22px rgba(2,132,199,0.06)',
                }}
              >
                <div style={badgeStyle}>Visão central</div>

                <h2 style={titleStyle}>Cada vendedor terá sua própria página com link próprio</h2>

                <p style={textStyle}>
                  Esta base organiza a visão do vendedor como uma unidade forte do marketplace,
                  pronta para divulgação, operação e monetização.
                </p>

                <div
                  style={{
                    display: 'grid',
                    gap: 8,
                    marginTop: 10,
                  }}
                >
                  {blocosPerfil.map((item) => (
                    <div
                      key={item.titulo}
                      style={{
                        borderRadius: 10,
                        border: '1px solid rgba(6,182,212,0.10)',
                        background: '#ffffff',
                        padding: '9px 10px',
                      }}
                    >
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 900,
                          color: '#0f172a',
                        }}
                      >
                        {item.titulo}
                      </div>
                      <div
                        style={{
                          marginTop: 4,
                          fontSize: 12,
                          lineHeight: 1.45,
                          color: '#475569',
                        }}
                      >
                        {item.descricao}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div
                style={{
                  borderRadius: 18,
                  background: 'linear-gradient(135deg, #0f172a 0%, #111827 50%, #083344 100%)',
                  color: '#ffffff',
                  padding: isMobile ? 12 : 14,
                  boxShadow: '0 16px 34px rgba(15,23,42,0.18)',
                }}
              >
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    borderRadius: 999,
                    border: '1px solid rgba(34,211,238,0.20)',
                    background: 'rgba(34,211,238,0.10)',
                    color: '#a5f3fc',
                    padding: '6px 10px',
                    fontSize: 9,
                    fontWeight: 900,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  Direção comercial
                </div>

                <h2
                  style={{
                    margin: '10px 0 0',
                    fontSize: isMobile ? 22 : 24,
                    lineHeight: 1.04,
                    fontWeight: 900,
                    letterSpacing: '-0.03em',
                  }}
                >
                  Estrutura inspirada em grandes plataformas, mas com nossa lógica
                </h2>

                <p
                  style={{
                    margin: '8px 0 0',
                    color: 'rgba(226,232,240,0.90)',
                    fontSize: 13,
                    lineHeight: 1.5,
                  }}
                >
                  O objetivo é crescer para algo forte como Mercado Livre, Shopee e Hotmart,
                  mantendo evolução em camadas isoladas e seguras.
                </p>

                <div
                  style={{
                    display: 'grid',
                    gap: 8,
                    marginTop: 10,
                  }}
                >
                  {[
                    'Página própria do vendedor',
                    'Área interna de gestão',
                    'Link próprio de divulgação',
                    'Base para pedidos e histórico',
                  ].map((item) => (
                    <div
                      key={item}
                      style={{
                        borderRadius: 10,
                        padding: '9px 10px',
                        border: '1px solid rgba(255,255,255,0.08)',
                        background: 'rgba(255,255,255,0.06)',
                        color: '#f8fafc',
                        fontSize: 12,
                        lineHeight: 1.4,
                      }}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1.45fr 1fr',
            gap: 12,
          }}
        >
          <div style={{ ...sectionCardStyle, padding: isMobile ? 12 : 14 }}>
            <div style={badgeStyle}>Operação do vendedor</div>
            <h2 style={titleStyle}>Base da futura área interna</h2>
            <p style={textStyle}>
              Estrutura preparada para organizar catálogo, pedidos, divulgação e leitura comercial.
            </p>

            <div
              style={{
                display: 'grid',
                gap: 8,
                marginTop: 12,
              }}
            >
              {blocosOperacao.map((item) => (
                <div
                  key={item.titulo}
                  style={{
                    borderRadius: 12,
                    border: '1px solid rgba(6,182,212,0.10)',
                    background: '#ffffff',
                    padding: '10px 11px',
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 900,
                      color: '#0f172a',
                    }}
                  >
                    {item.titulo}
                  </div>
                  <div
                    style={{
                      marginTop: 4,
                      fontSize: 12,
                      lineHeight: 1.45,
                      color: '#475569',
                    }}
                  >
                    {item.descricao}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <section style={{ ...sectionCardStyle, padding: isMobile ? 12 : 14 }}>
              <div style={badgeStyle}>Próximas camadas</div>
              <h2 style={titleStyle}>Crescimento seguro</h2>
              <p style={textStyle}>
                Tudo em páginas novas, mantendo a blindagem do que já está pronto.
              </p>

              <div
                style={{
                  display: 'grid',
                  gap: 8,
                  marginTop: 12,
                }}
              >
                {proximasCamadas.map((item) => (
                  <div
                    key={item.titulo}
                    style={{
                      borderRadius: 10,
                      border: '1px solid rgba(6,182,212,0.10)',
                      background: 'linear-gradient(90deg, #ecfeff 0%, #f0f9ff 100%)',
                      padding: '9px 10px',
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 900,
                        color: '#0369a1',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {item.titulo}
                    </div>
                    <div
                      style={{
                        marginTop: 4,
                        fontSize: 12,
                        lineHeight: 1.45,
                        color: '#334155',
                      }}
                    >
                      {item.descricao}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section
              style={{
                borderRadius: isMobile ? 20 : 24,
                padding: isMobile ? 12 : 14,
                color: '#ffffff',
                background: 'linear-gradient(135deg, #06b6d4 0%, #0ea5e9 46%, #2563eb 100%)',
                boxShadow: '0 16px 42px rgba(2,132,199,0.18)',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  borderRadius: 999,
                  border: '1px solid rgba(255,255,255,0.24)',
                  background: 'rgba(255,255,255,0.10)',
                  color: '#ffffff',
                  padding: '6px 10px',
                  fontSize: 9,
                  fontWeight: 900,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                Próximo passo
              </div>

              <h2
                style={{
                  margin: '10px 0 0',
                  fontSize: isMobile ? 22 : 24,
                  lineHeight: 1.04,
                  fontWeight: 900,
                  letterSpacing: '-0.03em',
                }}
              >
                Depois desta página, criamos a área do comprador
              </h2>

              <p
                style={{
                  margin: '8px 0 0',
                  color: 'rgba(255,255,255,0.92)',
                  fontSize: 13,
                  lineHeight: 1.5,
                }}
              >
                O comprador também terá sua página própria para histórico, acompanhamento e leitura
                da sua relação com o marketplace.
              </p>

              <div
                style={{
                  display: 'grid',
                  gap: 8,
                  marginTop: 10,
                }}
              >
                <Link href="/marketplace" style={outlineButtonStyle}>
                  Voltar ao marketplace
                </Link>

                <Link href="/global" style={darkButtonStyle}>
                  Voltar à home global
                </Link>
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  )
}