'use client'

import Link from 'next/link'
import { useMemo, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { CSSProperties } from 'react'

type AccessItem = {
  titulo: string
  descricao: string
  href: string
  badge: string
}

type RobotItem = {
  titulo: string
  descricao: string
}

const acessos: AccessItem[] = [
  {
    titulo: 'Cadastro Geral',
    descricao:
      'Base principal de entrada da Aurora para empresas, profissionais, fornecedores, compradores, parceiros e operações.',
    href: '/cadastro',
    badge: 'Entrada oficial',
  },
  {
    titulo: 'Buscar Empresas',
    descricao:
      'Pesquisa pública segura para encontrar empresas, serviços e oportunidades dentro do ecossistema.',
    href: '/buscar',
    badge: 'Busca segura',
  },
  {
    titulo: 'Aurora Motoristas',
    descricao:
      'Operação, cadastro, gestão de serviços, controle interno e expansão segura da base de motoristas.',
    href: '/motoristas',
    badge: 'Operação premium',
  },
  {
    titulo: 'Aurora Condomínios',
    descricao:
      'Aplicativo para gestão moderna de condomínios com organização, praticidade e visão profissional.',
    href: '/condominios',
    badge: 'Gestão prática',
  },
  {
    titulo: 'Seminovos Locadoras',
    descricao:
      'Ambiente para locadoras, veículos, compradores, fornecedores e oportunidades comerciais do setor.',
    href: '/seminovos-locadoras',
    badge: 'Setor automotivo',
  },
  {
    titulo: 'Financeiro',
    descricao:
      'Camada empresarial editável para leitura financeira, lançamentos, relatórios e controle de contas.',
    href: '/financeiro',
    badge: 'Área protegida',
  },
  {
    titulo: 'App Builder',
    descricao:
      'Estrutura para geração de novos apps, módulos e produtos digitais dentro do ecossistema Aurora.',
    href: '/app-builder',
    badge: 'Expansão IA',
  },
  {
    titulo: 'Guardião',
    descricao:
      'Auditoria, leitura da camada pública segura e validação estratégica dos cadastros da plataforma.',
    href: '/guardiao',
    badge: 'Auditoria',
  },
  {
    titulo: 'AGRO',
    descricao:
      'Área estratégica para produtores, fornecedores, compradores, serviços rurais e novas conexões comerciais.',
    href: '/agro',
    badge: 'Expansão setorial',
  },
  {
    titulo: 'Imóveis',
    descricao:
      'Ponto de entrada para imobiliárias, imóveis, captação, leads e operações imobiliárias futuras.',
    href: '/imoveis',
    badge: 'Mercado imobiliário',
  },
  {
    titulo: 'Mineração',
    descricao:
      'Camada para mineração, fornecedores industriais, compradores e estruturação de oportunidades pesadas.',
    href: '/mineracao',
    badge: 'Mercado industrial',
  },
  {
    titulo: 'Aurora Responde',
    descricao:
      'Canal de apoio, direcionamento, dúvidas, sugestões e expansão da experiência do usuário.',
    href: '/aurora-responde',
    badge: 'Atendimento',
  },
]

const marketplaceDestaques = [
  'Taxa estratégica abaixo do mercado',
  'Entrega e operação do vendedor',
  'Página própria para contratar entrega',
  'Base pronta para monetização escalável',
]

const robos: RobotItem[] = [
  {
    titulo: 'Captação Global',
    descricao:
      'Estrutura para futura automação comercial de clientes, parceiros e compradores.',
  },
  {
    titulo: 'Investidores',
    descricao:
      'Frente estratégica para apresentar oportunidades do ecossistema a investidores.',
  },
  {
    titulo: 'Expansão Setorial',
    descricao:
      'Base para expansão em locação, agro, imóveis, serviços e mineração.',
  },
  {
    titulo: 'Distribuição',
    descricao:
      'Camada pensada para impulsionar produtos, apps e vitrines do marketplace.',
  },
]

const searchRoutes: Array<{ termos: string[]; href: string }> = [
  { termos: ['cadastro', 'cadastro geral', 'empresa', 'empresas'], href: '/cadastro' },
  { termos: ['buscar', 'pesquisa', 'buscar empresas'], href: '/buscar' },
  { termos: ['motorista', 'motoristas', 'servico', 'serviços'], href: '/motoristas' },
  { termos: ['condominio', 'condominios', 'condomínio', 'condomínios'], href: '/condominios' },
  { termos: ['seminovos', 'locadora', 'locadoras', 'veiculos', 'veículos'], href: '/seminovos-locadoras' },
  { termos: ['financeiro', 'financas', 'finanças', 'contas'], href: '/financeiro' },
  { termos: ['app builder', 'builder', 'apps', 'aplicativos'], href: '/app-builder' },
  { termos: ['guardiao', 'guardião', 'auditoria'], href: '/guardiao' },
  { termos: ['agro', 'rural', 'fazenda'], href: '/agro' },
  { termos: ['imovel', 'imóveis', 'imoveis', 'imobiliaria', 'imobiliária'], href: '/imoveis' },
  { termos: ['mineracao', 'mineração', 'industrial'], href: '/mineracao' },
  { termos: ['responde', 'suporte', 'ajuda', 'atendimento'], href: '/aurora-responde' },
  { termos: ['marketplace', 'market place', 'shop', 'loja'], href: '/marketplace' },
]

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

export default function GlobalPage() {
  const router = useRouter()
  const [busca, setBusca] = useState('')
  const [mensagemBusca, setMensagemBusca] = useState('')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 820)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const acessosVisiveis = useMemo(() => acessos, [])

  function handleBuscarDestino() {
    const termo = normalizeText(busca)

    if (!termo) {
      setMensagemBusca('Digite o nome de uma área, produto ou objetivo para eu te direcionar.')
      return
    }

    const rotaEncontrada = searchRoutes.find((item) =>
      item.termos.some((termoBase) => termo.includes(normalizeText(termoBase))),
    )

    if (rotaEncontrada) {
      setMensagemBusca(`Direcionando você para ${rotaEncontrada.href} ...`)
      router.push(rotaEncontrada.href)
      return
    }

    setMensagemBusca(
      'Ainda não encontrei uma rota exata. Use os cards e botões abaixo para entrar rapidamente na área desejada.',
    )
  }

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

  const secondaryButtonStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: isMobile ? 38 : 40,
    padding: isMobile ? '0 12px' : '0 14px',
    borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.28)',
    background: 'rgba(255,255,255,0.10)',
    color: '#ffffff',
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontSize: 11,
  }

  const quickButtonStyle = (active: boolean): CSSProperties => ({
    border: active ? '1px solid #0284c7' : '1px solid #bae6fd',
    background: active ? 'linear-gradient(135deg, #06b6d4, #0284c7)' : '#ffffff',
    color: active ? '#ffffff' : '#0369a1',
    borderRadius: 10,
    padding: '7px 11px',
    fontSize: 10,
    fontWeight: 900,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    boxShadow: active ? '0 8px 14px rgba(2,132,199,0.14)' : '0 4px 10px rgba(2,132,199,0.04)',
    minHeight: 34,
  })

  const topGridStyle: CSSProperties = {
    display: 'grid',
    gap: 12,
    gridTemplateColumns: isMobile ? '1fr' : '1.12fr 0.88fr',
    alignItems: 'stretch',
  }

  const middleGridStyle: CSSProperties = {
    display: 'grid',
    gap: 12,
    gridTemplateColumns: isMobile ? '1fr' : '1.18fr 0.82fr',
  }

  const accessGridStyle: CSSProperties = {
    display: 'grid',
    gap: 12,
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, minmax(0, 1fr))',
  }

  const robotGridStyle: CSSProperties = {
    display: 'grid',
    gap: 12,
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, minmax(0, 1fr))',
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
            <div style={topGridStyle}>
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
                  RicardoIAOficial.com
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
                  HOME GLOBAL AURORA
                </h1>

                <p
                  style={{
                    margin: '10px 0 0',
                    maxWidth: 720,
                    fontSize: isMobile ? 13 : 14,
                    lineHeight: 1.55,
                    color: 'rgba(255,255,255,0.92)',
                  }}
                >
                  Página de alto impacto para entrada rápida, expansão comercial e direcionamento
                  inteligente a todos os produtos do ecossistema.
                </p>

                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 8,
                    marginTop: 12,
                  }}
                >
                  <Link href="/cadastro" style={primaryButtonStyle}>
                    Entrar pela Aurora
                  </Link>

                  <Link href="/marketplace" style={secondaryButtonStyle}>
                    Abrir marketplace
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
                  ['Foco', 'Conversão'],
                  ['Objetivo', 'Escala global'],
                  ['Entrada', 'Clara e rápida'],
                  ['Base', 'Multi-produtos'],
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
            <div style={middleGridStyle}>
              <div
                style={{
                  borderRadius: 18,
                  border: '1px solid rgba(6,182,212,0.14)',
                  background: 'linear-gradient(180deg, #ffffff 0%, #f0f9ff 100%)',
                  padding: isMobile ? 12 : 14,
                  boxShadow: '0 8px 22px rgba(2,132,199,0.06)',
                }}
              >
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    borderRadius: 999,
                    border: '1px solid rgba(6,182,212,0.18)',
                    background: '#ffffff',
                    color: '#0369a1',
                    padding: '6px 10px',
                    fontSize: 9,
                    fontWeight: 900,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  Entrada inteligente
                </div>

                <h2
                  style={{
                    margin: '10px 0 0',
                    fontSize: isMobile ? 22 : 24,
                    lineHeight: 1.02,
                    fontWeight: 900,
                    letterSpacing: '-0.03em',
                  }}
                >
                  Para onde você quer ir agora?
                </h2>

                <p style={textStyle}>
                  Digite o que você procura e a home tenta te levar ao ponto certo do sistema.
                </p>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : '1fr 130px',
                    gap: 8,
                    marginTop: 10,
                  }}
                >
                  <input
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleBuscarDestino()
                    }}
                    placeholder="Ex.: motoristas, financeiro, imóveis, agro..."
                    style={{
                      minHeight: 40,
                      borderRadius: 10,
                      border: '1px solid rgba(6,182,212,0.18)',
                      background: '#ffffff',
                      color: '#0f172a',
                      padding: '0 12px',
                      fontSize: 13,
                      outline: 'none',
                      boxShadow: '0 4px 10px rgba(2,132,199,0.05)',
                    }}
                  />

                  <button
                    type="button"
                    onClick={handleBuscarDestino}
                    style={{
                      minHeight: 40,
                      borderRadius: 10,
                      border: 'none',
                      background: 'linear-gradient(135deg, #06b6d4 0%, #2563eb 100%)',
                      color: '#ffffff',
                      fontWeight: 900,
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      fontSize: 11,
                      cursor: 'pointer',
                      boxShadow: '0 10px 18px rgba(2,132,199,0.14)',
                    }}
                  >
                    Explorar
                  </button>
                </div>

                <div
                  style={{
                    marginTop: 8,
                    minHeight: 18,
                    borderRadius: 10,
                    border: '1px solid rgba(6,182,212,0.10)',
                    background: '#ffffff',
                    padding: '9px 10px',
                    color: '#475569',
                    fontSize: 12,
                    lineHeight: 1.45,
                  }}
                >
                  {mensagemBusca || 'Use a busca ou clique em um dos atalhos abaixo.'}
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 6,
                    marginTop: 8,
                  }}
                >
                  {[
                    'Cadastro Geral',
                    'Buscar Empresas',
                    'Aurora Motoristas',
                    'Financeiro',
                    'App Builder',
                    'Marketplace',
                  ].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        setBusca(item)
                        setMensagemBusca('')
                      }}
                      style={quickButtonStyle(normalizeText(busca) === normalizeText(item))}
                    >
                      {item}
                    </button>
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
                  Frente global
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
                  A Aurora como vitrine mundial
                </h2>

                <p
                  style={{
                    margin: '8px 0 0',
                    color: 'rgba(226,232,240,0.90)',
                    fontSize: 13,
                    lineHeight: 1.5,
                  }}
                >
                  Base pronta para apresentar produtos, captar clientes e abrir portas para investidores.
                </p>

                <div
                  style={{
                    display: 'grid',
                    gap: 8,
                    marginTop: 10,
                  }}
                >
                  {[
                    'Direcionamento rápido',
                    'Expansão internacional',
                    'Base pronta para marketplace',
                    'Identidade premium',
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

                <div
                  style={{
                    marginTop: 8,
                    borderRadius: 10,
                    padding: '9px 10px',
                    background: 'rgba(245,158,11,0.12)',
                    border: '1px solid rgba(245,158,11,0.18)',
                    color: '#fef3c7',
                    fontSize: 12,
                    lineHeight: 1.45,
                  }}
                >
                  Sistema em constante atualização e pode haver momentos de instabilidade durante melhorias.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1.7fr 0.9fr',
            gap: 12,
          }}
        >
          <div style={{ ...sectionCardStyle, padding: isMobile ? 12 : 14 }}>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 10,
                alignItems: 'flex-end',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ maxWidth: 760 }}>
                <div style={badgeStyle}>Acessos principais</div>

                <h2 style={titleStyle}>Todos os produtos em uma única entrada</h2>

                <p style={textStyle}>
                  Cards compactos para leitura rápida, impacto visual e menos rolagem.
                </p>
              </div>

              <Link href="/cadastro" style={primaryButtonStyle}>
                Entrar pela base oficial
              </Link>
            </div>

            <div style={{ ...accessGridStyle, marginTop: 12 }}>
              {acessosVisiveis.map((item) => (
                <Link
                  key={item.titulo}
                  href={item.href}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: isMobile ? 170 : 180,
                    borderRadius: 14,
                    border: '1px solid rgba(6,182,212,0.12)',
                    background: 'linear-gradient(180deg, #ffffff 0%, #f8fdff 55%, #ecfeff 100%)',
                    padding: isMobile ? 12 : 13,
                    boxShadow: '0 10px 22px rgba(2,132,199,0.05)',
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
                      {item.badge}
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
                    Acessar agora
                  </div>
                </Link>
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
              <div style={badgeStyle}>Marketplace Aurora Shop</div>

              <h2 style={titleStyle}>Próxima conexão já pronta para entrar</h2>

              <p style={textStyle}>
                Base preparada para monetização abaixo de Mercado Livre e Shopee, com entrega por conta do vendedor.
              </p>

              <div
                style={{
                  display: 'grid',
                  gap: 8,
                  marginTop: 10,
                }}
              >
                {marketplaceDestaques.map((item) => (
                  <div
                    key={item}
                    style={{
                      borderRadius: 10,
                      border: '1px solid rgba(6,182,212,0.10)',
                      background: 'linear-gradient(90deg, #ecfeff 0%, #f0f9ff 100%)',
                      padding: '9px 10px',
                      color: '#334155',
                      fontSize: 12,
                      lineHeight: 1.4,
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>

              <div
                style={{
                  display: 'grid',
                  gap: 8,
                  marginTop: 10,
                }}
              >
                <Link
                  href="/marketplace"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 38,
                    borderRadius: 10,
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                    color: '#ffffff',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontSize: 11,
                  }}
                >
                  Abrir marketplace
                </Link>

                <Link
                  href="/app-builder"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 38,
                    borderRadius: 10,
                    border: '1px solid rgba(6,182,212,0.18)',
                    background: '#ffffff',
                    color: '#0369a1',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontSize: 11,
                  }}
                >
                  Ver App Builder
                </Link>
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
                Próximo passo estratégico
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
                Depois desta home, nós ligamos o Marketplace com a mesma maestria.
              </h2>

              <p
                style={{
                  margin: '8px 0 0',
                  color: 'rgba(255,255,255,0.92)',
                  fontSize: 13,
                  lineHeight: 1.5,
                }}
              >
                A base está pronta para receber a próxima camada de vendas, produtos, vitrines e expansão comercial.
              </p>

              <div
                style={{
                  display: 'grid',
                  gap: 8,
                  marginTop: 10,
                }}
              >
                <Link
                  href="/marketplace"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 38,
                    borderRadius: 10,
                    background: '#ffffff',
                    color: '#0369a1',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontSize: 11,
                  }}
                >
                  Ir para o marketplace
                </Link>

                <Link
                  href="/cadastro"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 38,
                    borderRadius: 10,
                    border: '1px solid rgba(255,255,255,0.28)',
                    background: 'rgba(255,255,255,0.12)',
                    color: '#ffffff',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontSize: 11,
                  }}
                >
                  Entrar pela Aurora
                </Link>
              </div>
            </section>
          </div>
        </section>

        <section style={{ ...sectionCardStyle, padding: isMobile ? 12 : 14 }}>
          <div style={{ maxWidth: 780 }}>
            <div style={badgeStyle}>Robôs estratégicos</div>

            <h2 style={titleStyle}>Frente comercial e global da Aurora</h2>

            <p style={textStyle}>
              Estrutura visual pronta para a etapa posterior de captação, investidores, expansão e distribuição.
            </p>
          </div>

          <div style={{ ...robotGridStyle, marginTop: 12 }}>
            {robos.map((item) => (
              <div
                key={item.titulo}
                style={{
                  borderRadius: 14,
                  padding: isMobile ? 12 : 13,
                  color: '#ffffff',
                  background: 'linear-gradient(135deg, #0f172a 0%, #111827 46%, #083344 100%)',
                  boxShadow: '0 12px 26px rgba(15,23,42,0.14)',
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
                    padding: '5px 8px',
                    fontSize: 9,
                    fontWeight: 900,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                  }}
                >
                  IA Aurora
                </div>

                <h3
                  style={{
                    margin: '10px 0 0',
                    fontSize: isMobile ? 17 : 18,
                    lineHeight: 1.08,
                    fontWeight: 900,
                    letterSpacing: '-0.03em',
                  }}
                >
                  {item.titulo}
                </h3>

                <p
                  style={{
                    margin: '8px 0 0',
                    color: 'rgba(226,232,240,0.92)',
                    fontSize: 12,
                    lineHeight: 1.45,
                  }}
                >
                  {item.descricao}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}