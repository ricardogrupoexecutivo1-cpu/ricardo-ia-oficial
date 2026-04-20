'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'

type PlanoItem = {
  titulo: string
  taxa: string
  destaque?: string
  descricao: string
}

type RecursoItem = {
  titulo: string
  descricao: string
}

type EtapaItem = {
  titulo: string
  descricao: string
}

const planos: PlanoItem[] = [
  {
    titulo: 'Plano Inicial',
    taxa: '5%',
    destaque: 'Entrada rápida',
    descricao:
      'Ideal para começar com taxa estratégica abaixo de grandes marketplaces, com página própria e exposição dentro da Aurora.',
  },
  {
    titulo: 'Plano Impulso',
    taxa: '4%',
    destaque: 'Mais visibilidade',
    descricao:
      'Para vendedores que querem mais destaque interno, melhor posicionamento comercial e estrutura mais forte de vitrine.',
  },
  {
    titulo: 'Plano Parceiro',
    taxa: '3%',
    destaque: 'Escala comercial',
    descricao:
      'Pensado para operações maiores, parceiros estratégicos e vendedores com foco em alto volume e crescimento contínuo.',
  },
]

const recursos: RecursoItem[] = [
  {
    titulo: 'Página própria do vendedor',
    descricao:
      'Cada vendedor terá sua própria área para apresentar produtos, informações, formas de contato e contratação de entrega.',
  },
  {
    titulo: 'Taxa abaixo do mercado',
    descricao:
      'Estrutura preparada para trabalhar com percentuais mais competitivos que grandes marketplaces tradicionais.',
  },
  {
    titulo: 'Entrega por conta do vendedor',
    descricao:
      'A Aurora não assume a logística. O vendedor define e contrata a entrega dentro da sua própria operação.',
  },
  {
    titulo: 'Contratação de entrega na página',
    descricao:
      'A plataforma disponibiliza meios para o vendedor informar, organizar e permitir a contratação da entrega em sua área.',
  },
  {
    titulo: 'Base para monetização escalável',
    descricao:
      'Modelo pronto para crescer com taxas, planos, destaques pagos, vitrines premium e expansão comercial futura.',
  },
  {
    titulo: 'Independência preservada',
    descricao:
      'Esta página nasce separada da home global, mantendo a regra de evoluir por camadas isoladas sem quebrar o que já está pronto.',
  },
]

const etapas: EtapaItem[] = [
  {
    titulo: 'Etapa 1',
    descricao: 'Apresentar o Marketplace com clareza, valor comercial e proposta de monetização.',
  },
  {
    titulo: 'Etapa 2',
    descricao: 'Criar entrada para vendedores com cadastro, vitrine e área própria de operação.',
  },
  {
    titulo: 'Etapa 3',
    descricao: 'Estruturar produtos, comissão por venda, destaques e ranking comercial.',
  },
  {
    titulo: 'Etapa 4',
    descricao: 'Ligar contratação de entrega, meios de pagamento e fluxo de pedidos do vendedor.',
  },
]

export default function MarketplacePage() {
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
                  Aurora Marketplace
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
                  MARKETPLACE AURORA SHOP
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
                  Página independente para monetização com taxa estratégica, vitrine de vendedores e
                  operação comercial preparada para crescer com força.
                </p>

                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 8,
                    marginTop: 12,
                  }}
                >
                  <Link href="/global" style={outlineButtonStyle}>
                    Voltar à home global
                  </Link>

                  <Link href="/cadastro" style={primaryButtonStyle}>
                    Cadastro geral
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
                  ['Taxa', 'Abaixo do mercado'],
                  ['Entrega', 'Por conta do vendedor'],
                  ['Modelo', 'Escalável'],
                  ['Base', 'Pronta para monetizar'],
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
                <div style={badgeStyle}>Proposta central</div>

                <h2 style={titleStyle}>Monetizar com inteligência e taxa competitiva</h2>

                <p style={textStyle}>
                  O Marketplace Aurora Shop nasce para permitir vendas com taxas mais atraentes,
                  abaixo de grandes plataformas, preservando a operação do vendedor.
                </p>

                <div
                  style={{
                    display: 'grid',
                    gap: 8,
                    marginTop: 10,
                  }}
                >
                  {[
                    'A Aurora intermedia a visibilidade e a estrutura comercial.',
                    'O vendedor mantém sua própria operação e sua logística.',
                    'A entrega continua sendo responsabilidade do vendedor.',
                    'A plataforma disponibiliza meios para contratação da entrega na página do vendedor.',
                  ].map((item) => (
                    <div
                      key={item}
                      style={{
                        borderRadius: 10,
                        border: '1px solid rgba(6,182,212,0.10)',
                        background: '#ffffff',
                        padding: '9px 10px',
                        color: '#334155',
                        fontSize: 12,
                        lineHeight: 1.45,
                      }}
                    >
                      {item}
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
                  Regra comercial
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
                  Entrega e operação continuam com o vendedor
                </h2>

                <p
                  style={{
                    margin: '8px 0 0',
                    color: 'rgba(226,232,240,0.90)',
                    fontSize: 13,
                    lineHeight: 1.5,
                  }}
                >
                  A Aurora oferece vitrine, estrutura e meios comerciais. A execução logística segue
                  com quem vende.
                </p>

                <div
                  style={{
                    display: 'grid',
                    gap: 8,
                    marginTop: 10,
                  }}
                >
                  {[
                    'Sem assumir entrega direta',
                    'Sem assumir estoque',
                    'Sem sobrecarregar a operação central',
                    'Modelo mais leve e escalável',
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

        <section style={{ ...sectionCardStyle, padding: isMobile ? 12 : 14 }}>
          <div style={badgeStyle}>Planos e taxas</div>
          <h2 style={titleStyle}>Estrutura inicial de monetização</h2>
          <p style={textStyle}>
            Modelo de entrada pronto para validar adesão, atrair vendedores e crescer com segurança.
          </p>

          <div
            style={{
              display: 'grid',
              gap: 12,
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, minmax(0, 1fr))',
              marginTop: 12,
            }}
          >
            {planos.map((item) => (
              <div
                key={item.titulo}
                style={{
                  borderRadius: 14,
                  border: '1px solid rgba(6,182,212,0.12)',
                  background: 'linear-gradient(180deg, #ffffff 0%, #f8fdff 55%, #ecfeff 100%)',
                  padding: isMobile ? 12 : 13,
                  boxShadow: '0 10px 22px rgba(2,132,199,0.05)',
                  minHeight: isMobile ? 180 : 190,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      borderRadius: 999,
                      border: '1px solid rgba(6,182,212,0.16)',
                      background: '#ffffff',
                      color: '#0369a1',
                      padding: '5px 8px',
                      fontSize: 9,
                      fontWeight: 900,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {item.destaque || 'Plano'}
                  </div>

                  <h3
                    style={{
                      margin: '10px 0 0',
                      fontSize: isMobile ? 18 : 19,
                      lineHeight: 1.08,
                      fontWeight: 900,
                      color: '#0f172a',
                      letterSpacing: '-0.03em',
                    }}
                  >
                    {item.titulo}
                  </h3>

                  <div
                    style={{
                      marginTop: 8,
                      fontSize: isMobile ? 28 : 32,
                      lineHeight: 1,
                      fontWeight: 900,
                      color: '#0369a1',
                    }}
                  >
                    {item.taxa}
                  </div>

                  <p
                    style={{
                      margin: '8px 0 0',
                      color: '#475569',
                      fontSize: 12,
                      lineHeight: 1.45,
                    }}
                  >
                    {item.descricao}
                  </p>
                </div>

                <div
                  style={{
                    marginTop: 10,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 34,
                    borderRadius: 10,
                    border: '1px solid rgba(6,182,212,0.18)',
                    background: '#ffffff',
                    color: '#0369a1',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontSize: 10,
                    boxShadow: '0 4px 10px rgba(2,132,199,0.04)',
                  }}
                >
                  Pronto para evoluir
                </div>
              </div>
            ))}
          </div>
        </section>

        <section
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1.4fr 1fr',
            gap: 12,
          }}
        >
          <div style={{ ...sectionCardStyle, padding: isMobile ? 12 : 14 }}>
            <div style={badgeStyle}>Recursos planejados</div>
            <h2 style={titleStyle}>O que esta base já organiza</h2>
            <p style={textStyle}>
              Camada isolada para crescer sem mexer na home global e sem quebrar a operação.
            </p>

            <div
              style={{
                display: 'grid',
                gap: 8,
                marginTop: 12,
              }}
            >
              {recursos.map((item) => (
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
              <div style={badgeStyle}>Próximas etapas</div>
              <h2 style={titleStyle}>Construção em camadas</h2>
              <p style={textStyle}>
                Crescimento seguro, sem misturar tudo de uma vez.
              </p>

              <div
                style={{
                  display: 'grid',
                  gap: 8,
                  marginTop: 12,
                }}
              >
                {etapas.map((item) => (
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
                Continuidade
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
                Próximo passo depois desta página: criar a área do vendedor
              </h2>

              <p
                style={{
                  margin: '8px 0 0',
                  color: 'rgba(255,255,255,0.92)',
                  fontSize: 13,
                  lineHeight: 1.5,
                }}
              >
                Depois daqui, nós criamos a entrada isolada para vendedores publicarem, gerirem e
                estruturarem suas vitrines.
              </p>

              <div
                style={{
                  display: 'grid',
                  gap: 8,
                  marginTop: 10,
                }}
              >
                <Link href="/global" style={outlineButtonStyle}>
                  Voltar à home global
                </Link>

                <Link href="/cadastro" style={primaryButtonStyle}>
                  Ir para cadastro geral
                </Link>
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  )
}