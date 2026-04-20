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
    titulo: 'Página própria do comprador',
    descricao:
      'Cada comprador terá sua própria página para acompanhar pedidos, histórico, status e relacionamento com o marketplace.',
  },
  {
    titulo: 'Histórico de compras',
    descricao:
      'Área preparada para mostrar pedidos anteriores, valores, vendedores envolvidos e andamento geral.',
  },
  {
    titulo: 'Acompanhamento de pedidos',
    descricao:
      'Base para leitura de status, confirmação, andamento e fechamento do ciclo da compra.',
  },
  {
    titulo: 'Relação com vendedores',
    descricao:
      'O comprador poderá visualizar quais vendedores atenderam seus pedidos e acompanhar sua jornada dentro da plataforma.',
  },
]

const blocosOperacao: BlocoItem[] = [
  {
    titulo: 'Pedidos em andamento',
    descricao:
      'Visão dos pedidos ativos, aguardando confirmação, preparação, envio ou conclusão.',
  },
  {
    titulo: 'Histórico consolidado',
    descricao:
      'Base para centralizar compras anteriores e facilitar nova tomada de decisão do comprador.',
  },
  {
    titulo: 'Acompanhamento por etapa',
    descricao:
      'Leitura futura do fluxo do pedido do início até a conclusão, sem perder o histórico.',
  },
  {
    titulo: 'Perfil do comprador',
    descricao:
      'Estrutura para organizar dados, preferências, histórico, recorrência e comportamento comercial.',
  },
]

const proximasCamadas: BlocoItem[] = [
  {
    titulo: 'Cadastro do comprador',
    descricao:
      'Formulário seguro para entrada no marketplace com dados principais e base futura de relacionamento.',
  },
  {
    titulo: 'Minha área',
    descricao:
      'Página individual do comprador para acompanhamento de pedidos, histórico e status.',
  },
  {
    titulo: 'Histórico por vendedor',
    descricao:
      'Visão futura para entender de quem comprou, com qual frequência e como foi o atendimento.',
  },
  {
    titulo: 'Ligação com financeiro',
    descricao:
      'Base posterior para leitura de pagamentos, confirmações e evolução comercial do comprador.',
  },
]

export default function MarketplaceCompradorPage() {
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
                  Aurora Marketplace • Comprador
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
                  ÁREA DO COMPRADOR
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
                  Camada isolada para estruturar a página própria do comprador, seu histórico,
                  acompanhamento de pedidos e sua relação comercial dentro do Marketplace Aurora Shop.
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

                  <Link href="/marketplace/vendedor" style={primaryButtonStyle}>
                    Ver área do vendedor
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
                  ['Página', 'Própria do comprador'],
                  ['Histórico', 'Compras e pedidos'],
                  ['Acompanhamento', 'Status e evolução'],
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

                <h2 style={titleStyle}>Todo comprador terá sua própria página com histórico e acompanhamento</h2>

                <p style={textStyle}>
                  Esta base organiza a visão do comprador como uma jornada completa dentro do
                  marketplace, sem perder pedidos, relações e evolução comercial.
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
                  O comprador será parte viva do ecossistema
                </h2>

                <p
                  style={{
                    margin: '8px 0 0',
                    color: 'rgba(226,232,240,0.90)',
                    fontSize: 13,
                    lineHeight: 1.5,
                  }}
                >
                  Queremos uma jornada forte, com clareza de histórico, pedidos, status e
                  relacionamento com vendedores, em linha com plataformas grandes.
                </p>

                <div
                  style={{
                    display: 'grid',
                    gap: 8,
                    marginTop: 10,
                  }}
                >
                  {[
                    'Histórico organizado',
                    'Pedidos visíveis',
                    'Acompanhamento claro',
                    'Base futura de recompra',
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
            <div style={badgeStyle}>Operação do comprador</div>
            <h2 style={titleStyle}>Base da futura área interna</h2>
            <p style={textStyle}>
              Estrutura preparada para pedidos, histórico, status e leitura comercial do comprador.
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
                Depois desta página, criamos a entrada real de cadastro do vendedor
              </h2>

              <p
                style={{
                  margin: '8px 0 0',
                  color: 'rgba(255,255,255,0.92)',
                  fontSize: 13,
                  lineHeight: 1.5,
                }}
              >
                A sequência lógica agora é transformar a visão em entrada prática para o vendedor
                começar a operar de verdade dentro do marketplace.
              </p>

              <div
                style={{
                  display: 'grid',
                  gap: 8,
                  marginTop: 10,
                }}
              >
                <Link href="/marketplace/vendedor" style={outlineButtonStyle}>
                  Voltar à área do vendedor
                </Link>

                <Link href="/marketplace" style={darkButtonStyle}>
                  Voltar ao marketplace
                </Link>
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  )
}