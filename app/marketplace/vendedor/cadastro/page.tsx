'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'

type PlanoOption = 'inicial' | 'impulso' | 'parceiro'
type EntregaOption = 'propria' | 'transportadora' | 'retirada' | 'a_combinar'

type FormState = {
  nomeLoja: string
  responsavel: string
  email: string
  whatsapp: string
  categoria: string
  cidade: string
  estado: string
  plano: PlanoOption
  entrega: EntregaOption
  instagram: string
  site: string
  descricao: string
}

const planoLabels: Record<PlanoOption, string> = {
  inicial: 'Plano Inicial • 5%',
  impulso: 'Plano Impulso • 4%',
  parceiro: 'Plano Parceiro • 3%',
}

const entregaLabels: Record<EntregaOption, string> = {
  propria: 'Entrega própria',
  transportadora: 'Transportadora parceira',
  retirada: 'Retirada no local',
  a_combinar: 'A combinar com o comprador',
}

const categoriasBase = [
  'Moda',
  'Beleza',
  'Casa e decoração',
  'Eletrônicos',
  'Informática',
  'Serviços digitais',
  'Cursos e infoprodutos',
  'Automotivo',
  'Peças e acessórios',
  'Agro',
  'Imóveis e utilidades',
  'Saúde e bem-estar',
  'Outro',
]

const estadosBrasil = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
]

export default function MarketplaceVendedorCadastroPage() {
  const [isMobile, setIsMobile] = useState(false)
  const [salvou, setSalvou] = useState(false)
  const [form, setForm] = useState<FormState>({
    nomeLoja: '',
    responsavel: '',
    email: '',
    whatsapp: '',
    categoria: '',
    cidade: '',
    estado: '',
    plano: 'inicial',
    entrega: 'a_combinar',
    instagram: '',
    site: '',
    descricao: '',
  })

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
    minHeight: isMobile ? 40 : 42,
    padding: isMobile ? '0 12px' : '0 14px',
    borderRadius: 10,
    background: 'linear-gradient(135deg, #06b6d4 0%, #2563eb 100%)',
    color: '#ffffff',
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontSize: 11,
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 10px 18px rgba(2,132,199,0.14)',
  }

  const darkButtonStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: isMobile ? 40 : 42,
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
    minHeight: isMobile ? 40 : 42,
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

  const labelStyle: CSSProperties = {
    display: 'block',
    marginBottom: 6,
    fontSize: 11,
    fontWeight: 900,
    color: '#0369a1',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  }

  const inputStyle: CSSProperties = {
    width: '100%',
    minHeight: 42,
    borderRadius: 10,
    border: '1px solid rgba(6,182,212,0.16)',
    background: '#ffffff',
    color: '#0f172a',
    padding: '0 12px',
    fontSize: 13,
    outline: 'none',
    boxShadow: '0 4px 10px rgba(2,132,199,0.04)',
  }

  const textareaStyle: CSSProperties = {
    width: '100%',
    minHeight: 120,
    borderRadius: 10,
    border: '1px solid rgba(6,182,212,0.16)',
    background: '#ffffff',
    color: '#0f172a',
    padding: '12px',
    fontSize: 13,
    outline: 'none',
    resize: 'vertical',
    boxShadow: '0 4px 10px rgba(2,132,199,0.04)',
  }

  const headerGridStyle: CSSProperties = {
    display: 'grid',
    gap: 12,
    gridTemplateColumns: isMobile ? '1fr' : '1.12fr 0.88fr',
    alignItems: 'stretch',
  }

  const formGridStyle: CSSProperties = {
    display: 'grid',
    gap: 12,
    gridTemplateColumns: isMobile ? '1fr' : '1.4fr 0.9fr',
  }

  const leftGridStyle: CSSProperties = {
    display: 'grid',
    gap: 12,
    gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
  }

  const rightCardMiniStyle: CSSProperties = {
    borderRadius: 14,
    border: '1px solid rgba(6,182,212,0.10)',
    background: 'linear-gradient(90deg, #ecfeff 0%, #f0f9ff 100%)',
    padding: '10px 11px',
  }

  const resumoPlano = useMemo(() => planoLabels[form.plano], [form.plano])
  const resumoEntrega = useMemo(() => entregaLabels[form.entrega], [form.entrega])

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }))
    setSalvou(false)
  }

  function handleSalvarCadastro() {
    try {
      localStorage.setItem('aurora-marketplace-vendedor-cadastro', JSON.stringify(form))
      setSalvou(true)
    } catch {
      setSalvou(false)
      alert('Não foi possível salvar localmente neste momento.')
    }
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
            <div style={headerGridStyle}>
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
                  Aurora Marketplace • Cadastro do vendedor
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
                  ENTRADA DO VENDEDOR
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
                  Página isolada para o vendedor entrar no Marketplace Aurora Shop com segurança,
                  criando a base da sua loja, vitrine e operação.
                </p>

                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 8,
                    marginTop: 12,
                  }}
                >
                  <Link href="/marketplace/vendedor" style={outlineButtonStyle}>
                    Voltar à área do vendedor
                  </Link>

                  <Link href="/marketplace" style={primaryButtonStyle}>
                    Voltar ao marketplace
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
                  ['Entrada', 'Real do vendedor'],
                  ['Página', 'Própria da loja'],
                  ['Link', 'Pronto para divulgar'],
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
            <div style={formGridStyle}>
              <section
                style={{
                  borderRadius: 18,
                  border: '1px solid rgba(6,182,212,0.14)',
                  background: 'linear-gradient(180deg, #ffffff 0%, #f0f9ff 100%)',
                  padding: isMobile ? 12 : 14,
                  boxShadow: '0 8px 22px rgba(2,132,199,0.06)',
                }}
              >
                <div style={badgeStyle}>Cadastro do vendedor</div>
                <h2 style={titleStyle}>Monte a base da sua loja dentro da Aurora</h2>
                <p style={textStyle}>
                  Esta entrada organiza os dados principais do vendedor para a futura página própria,
                  vitrine e operação comercial.
                </p>

                <div style={{ ...leftGridStyle, marginTop: 12 }}>
                  <div>
                    <label style={labelStyle}>Nome da loja</label>
                    <input
                      style={inputStyle}
                      value={form.nomeLoja}
                      onChange={(e) => updateField('nomeLoja', e.target.value)}
                      placeholder="Ex.: Aurora Tech Store"
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>Responsável</label>
                    <input
                      style={inputStyle}
                      value={form.responsavel}
                      onChange={(e) => updateField('responsavel', e.target.value)}
                      placeholder="Nome do responsável"
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>E-mail</label>
                    <input
                      style={inputStyle}
                      value={form.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      placeholder="contato@loja.com"
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>WhatsApp</label>
                    <input
                      style={inputStyle}
                      value={form.whatsapp}
                      onChange={(e) => updateField('whatsapp', e.target.value)}
                      placeholder="(00) 00000-0000"
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>Categoria principal</label>
                    <select
                      style={inputStyle}
                      value={form.categoria}
                      onChange={(e) => updateField('categoria', e.target.value)}
                    >
                      <option value="">Selecione a categoria</option>
                      {categoriasBase.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={labelStyle}>Plano inicial</label>
                    <select
                      style={inputStyle}
                      value={form.plano}
                      onChange={(e) => updateField('plano', e.target.value as PlanoOption)}
                    >
                      <option value="inicial">{planoLabels.inicial}</option>
                      <option value="impulso">{planoLabels.impulso}</option>
                      <option value="parceiro">{planoLabels.parceiro}</option>
                    </select>
                  </div>

                  <div>
                    <label style={labelStyle}>Cidade</label>
                    <input
                      style={inputStyle}
                      value={form.cidade}
                      onChange={(e) => updateField('cidade', e.target.value)}
                      placeholder="Sua cidade"
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>Estado</label>
                    <select
                      style={inputStyle}
                      value={form.estado}
                      onChange={(e) => updateField('estado', e.target.value)}
                    >
                      <option value="">Selecione o estado</option>
                      {estadosBrasil.map((uf) => (
                        <option key={uf} value={uf}>
                          {uf}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={labelStyle}>Entrega principal</label>
                    <select
                      style={inputStyle}
                      value={form.entrega}
                      onChange={(e) => updateField('entrega', e.target.value as EntregaOption)}
                    >
                      <option value="propria">{entregaLabels.propria}</option>
                      <option value="transportadora">{entregaLabels.transportadora}</option>
                      <option value="retirada">{entregaLabels.retirada}</option>
                      <option value="a_combinar">{entregaLabels.a_combinar}</option>
                    </select>
                  </div>

                  <div>
                    <label style={labelStyle}>Instagram</label>
                    <input
                      style={inputStyle}
                      value={form.instagram}
                      onChange={(e) => updateField('instagram', e.target.value)}
                      placeholder="@sualoja"
                    />
                  </div>

                  <div style={{ gridColumn: isMobile ? 'auto' : '1 / span 2' }}>
                    <label style={labelStyle}>Site ou link principal</label>
                    <input
                      style={inputStyle}
                      value={form.site}
                      onChange={(e) => updateField('site', e.target.value)}
                      placeholder="https://..."
                    />
                  </div>

                  <div style={{ gridColumn: isMobile ? 'auto' : '1 / span 2' }}>
                    <label style={labelStyle}>Descrição da loja</label>
                    <textarea
                      style={textareaStyle}
                      value={form.descricao}
                      onChange={(e) => updateField('descricao', e.target.value)}
                      placeholder="Descreva sua loja, seus produtos, diferenciais e forma de atendimento."
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 8,
                    marginTop: 12,
                  }}
                >
                  <button type="button" style={primaryButtonStyle} onClick={handleSalvarCadastro}>
                    Salvar base do vendedor
                  </button>

                  <Link href="/marketplace/vendedor" style={outlineButtonStyle}>
                    Voltar à área do vendedor
                  </Link>
                </div>

                <div
                  style={{
                    marginTop: 10,
                    borderRadius: 10,
                    border: '1px solid rgba(6,182,212,0.10)',
                    background: salvou ? '#ecfeff' : '#ffffff',
                    padding: '10px 11px',
                    color: salvou ? '#0c4a6e' : '#475569',
                    fontSize: 12,
                    lineHeight: 1.45,
                  }}
                >
                  {salvou
                    ? 'Base do vendedor salva localmente com sucesso. Esta é uma etapa isolada e segura para preparar a próxima camada.'
                    : 'Nesta etapa, o salvamento é local e seguro para preparar a evolução da área do vendedor.'}
                </div>
              </section>

              <section
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                <div style={{ ...sectionCardStyle, padding: isMobile ? 12 : 14 }}>
                  <div style={badgeStyle}>Resumo da operação</div>
                  <h2 style={titleStyle}>Leitura rápida da loja</h2>
                  <p style={textStyle}>
                    Este bloco mostra a fotografia da entrada do vendedor antes da futura integração completa.
                  </p>

                  <div
                    style={{
                      display: 'grid',
                      gap: 8,
                      marginTop: 12,
                    }}
                  >
                    <div style={rightCardMiniStyle}>
                      <div style={{ fontSize: 11, fontWeight: 900, color: '#0369a1', textTransform: 'uppercase' }}>
                        Loja
                      </div>
                      <div style={{ marginTop: 4, fontSize: 13, lineHeight: 1.45, color: '#0f172a' }}>
                        {form.nomeLoja || 'Ainda não informado'}
                      </div>
                    </div>

                    <div style={rightCardMiniStyle}>
                      <div style={{ fontSize: 11, fontWeight: 900, color: '#0369a1', textTransform: 'uppercase' }}>
                        Responsável
                      </div>
                      <div style={{ marginTop: 4, fontSize: 13, lineHeight: 1.45, color: '#0f172a' }}>
                        {form.responsavel || 'Ainda não informado'}
                      </div>
                    </div>

                    <div style={rightCardMiniStyle}>
                      <div style={{ fontSize: 11, fontWeight: 900, color: '#0369a1', textTransform: 'uppercase' }}>
                        Plano
                      </div>
                      <div style={{ marginTop: 4, fontSize: 13, lineHeight: 1.45, color: '#0f172a' }}>
                        {resumoPlano}
                      </div>
                    </div>

                    <div style={rightCardMiniStyle}>
                      <div style={{ fontSize: 11, fontWeight: 900, color: '#0369a1', textTransform: 'uppercase' }}>
                        Entrega
                      </div>
                      <div style={{ marginTop: 4, fontSize: 13, lineHeight: 1.45, color: '#0f172a' }}>
                        {resumoEntrega}
                      </div>
                    </div>

                    <div style={rightCardMiniStyle}>
                      <div style={{ fontSize: 11, fontWeight: 900, color: '#0369a1', textTransform: 'uppercase' }}>
                        Cidade / Estado
                      </div>
                      <div style={{ marginTop: 4, fontSize: 13, lineHeight: 1.45, color: '#0f172a' }}>
                        {form.cidade || 'Cidade'} {form.estado ? `• ${form.estado}` : '• Estado'}
                      </div>
                    </div>

                    <div style={rightCardMiniStyle}>
                      <div style={{ fontSize: 11, fontWeight: 900, color: '#0369a1', textTransform: 'uppercase' }}>
                        Categoria
                      </div>
                      <div style={{ marginTop: 4, fontSize: 13, lineHeight: 1.45, color: '#0f172a' }}>
                        {form.categoria || 'Ainda não definida'}
                      </div>
                    </div>
                  </div>
                </div>

                <div
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
                    Depois desta entrada, criamos a vitrine pública do vendedor
                  </h2>

                  <p
                    style={{
                      margin: '8px 0 0',
                      color: 'rgba(255,255,255,0.92)',
                      fontSize: 13,
                      lineHeight: 1.5,
                    }}
                  >
                    A sequência correta agora é montar a página pública da loja, com link próprio,
                    identidade visual, catálogo e contratação de entrega.
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
                </div>
              </section>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}