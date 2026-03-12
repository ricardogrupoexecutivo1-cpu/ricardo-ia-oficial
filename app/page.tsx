'use client'

import { useEffect, useState } from 'react'

export default function HomePage() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 900)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <main
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(180deg, #0b1020 0%, #121a33 42%, #f5f7fb 42%, #f5f7fb 100%)',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <section
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: isMobile ? '20px 14px 24px' : '32px 16px 24px',
          color: '#fff',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'flex-start' : 'center',
            gap: 12,
            flexWrap: 'wrap',
            marginBottom: 24,
          }}
        >
          <div style={{ fontSize: isMobile ? 24 : 28, fontWeight: 700 }}>
            Aurora IA
          </div>

          <div
            style={{
              display: 'flex',
              gap: 10,
              flexWrap: 'wrap',
              width: isMobile ? '100%' : 'auto',
            }}
          >
            <a
              href="/chat"
              style={{
                flex: isMobile ? 1 : 'unset',
                textAlign: 'center',
                padding: '10px 16px',
                borderRadius: 10,
                textDecoration: 'none',
                background: '#fff',
                color: '#111',
                fontWeight: 700,
              }}
            >
              Abrir Chat
            </a>

            <a
              href="/login"
              style={{
                flex: isMobile ? 1 : 'unset',
                textAlign: 'center',
                padding: '10px 16px',
                borderRadius: 10,
                textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.35)',
                color: '#fff',
                fontWeight: 700,
              }}
            >
              Login
            </a>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1.2fr 0.8fr',
            gap: 16,
          }}
        >
          <div
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 20,
              padding: isMobile ? 18 : 24,
              backdropFilter: 'blur(8px)',
            }}
          >
            <div
              style={{
                display: 'inline-block',
                padding: '8px 12px',
                borderRadius: 999,
                background: 'rgba(255,255,255,0.12)',
                fontSize: 13,
                marginBottom: 16,
              }}
            >
              IA brasileira disponível para o mundo
            </div>

            <h1
              style={{
                margin: '0 0 14px 0',
                fontSize: isMobile ? 30 : 42,
                lineHeight: 1.08,
              }}
            >
              A plataforma de IA brasileira para chat, marketing, imagens e
              produtividade.
            </h1>

            <p
              style={{
                margin: 0,
                fontSize: isMobile ? 16 : 18,
                lineHeight: 1.7,
                color: 'rgba(255,255,255,0.88)',
                maxWidth: 760,
              }}
            >
              Converse com a Aurora, gere campanhas de marketing automáticas,
              crie imagens, use memória inteligente e tenha uma IA moderna para
              pessoas e empresas.
            </p>

            <div
              style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                gap: 12,
                flexWrap: 'wrap',
                marginTop: 24,
              }}
            >
              <a
                href="/chat"
                style={{
                  textAlign: 'center',
                  padding: '14px 20px',
                  borderRadius: 12,
                  textDecoration: 'none',
                  background: '#7c5cff',
                  color: '#fff',
                  fontWeight: 700,
                }}
              >
                Testar Aurora Agora
              </a>

              <a
                href="/login"
                style={{
                  textAlign: 'center',
                  padding: '14px 20px',
                  borderRadius: 12,
                  textDecoration: 'none',
                  background: '#fff',
                  color: '#111',
                  fontWeight: 700,
                }}
              >
                Criar Conta
              </a>

              <a
                href="/planos"
                style={{
                  textAlign: 'center',
                  padding: '14px 20px',
                  borderRadius: 12,
                  textDecoration: 'none',
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: '#fff',
                  fontWeight: 700,
                }}
              >
                Ver Planos
              </a>
            </div>

            <div
              style={{
                display: 'flex',
                gap: 12,
                flexWrap: 'wrap',
                marginTop: 18,
                color: 'rgba(255,255,255,0.82)',
                fontSize: 14,
              }}
            >
              <span>✔ Chat inteligente</span>
              <span>✔ Imagens com IA</span>
              <span>✔ Marketing automático</span>
              <span>✔ Memória por usuário</span>
            </div>
          </div>

          <div
            style={{
              background: '#ffffff',
              border: '1px solid #dbe2ee',
              borderRadius: 20,
              padding: isMobile ? 18 : 24,
              boxShadow: '0 10px 30px rgba(0,0,0,0.10)',
              color: '#111827',
            }}
          >
            <div
              style={{
                fontSize: 14,
                color: '#475569',
                marginBottom: 10,
                fontWeight: 700,
              }}
            >
              Plano especial inicial
            </div>

            <div
              style={{
                fontSize: isMobile ? 28 : 32,
                fontWeight: 800,
                marginBottom: 10,
                color: '#0f172a',
              }}
            >
              Founders Aurora
            </div>

            <div
              style={{
                fontSize: isMobile ? 17 : 18,
                lineHeight: 1.7,
                color: '#1e293b',
                fontWeight: 700,
              }}
            >
              R$ 29,90/mês
              <br />
              preço garantido por até 24 meses
            </div>

            <div
              style={{
                marginTop: 16,
                padding: 14,
                borderRadius: 14,
                background: '#f8fafc',
                lineHeight: 1.7,
                color: '#0f172a',
                fontSize: isMobile ? 15 : 16,
                border: '1px solid #e2e8f0',
              }}
            >
              ✅ acesso à Aurora IA
              <br />
              ✅ chat com memória
              <br />
              ✅ geração de campanhas
              <br />
              ✅ geração de imagens
              <br />
              ✅ suporte na fase inicial
            </div>

            <div
              style={{
                marginTop: 16,
                fontSize: 14,
                color: '#b45309',
                fontWeight: 800,
                lineHeight: 1.7,
              }}
            >
              Oferta inicial limitada para os primeiros 500 usuários.
              <br />
              Pagamento seguro via Mercado Pago.
              <br />
              Pix • Cartão • Assinatura mensal.
            </div>

            <a
              href="https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=cc255abd5e32475bae9167c8b6b3926d"
              target="_blank"
              rel="noreferrer"
              style={{
                marginTop: 18,
                display: 'block',
                textAlign: 'center',
                padding: '14px 20px',
                borderRadius: 12,
                textDecoration: 'none',
                background: '#00d084',
                color: '#04130c',
                fontWeight: 800,
              }}
            >
              Assinar Plano Founders
            </a>
          </div>
        </div>
      </section>

      <section
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: isMobile ? '18px 14px 38px' : '24px 16px 48px',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile
              ? '1fr'
              : 'repeat(3, minmax(0, 1fr))',
            gap: 16,
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 18,
              padding: 22,
              border: '1px solid #e8edf5',
              boxShadow: '0 6px 20px rgba(10,18,35,0.05)',
            }}
          >
            <div style={{ fontWeight: 800, marginBottom: 10 }}>
              Chat com memória
            </div>
            <div style={{ color: '#444', lineHeight: 1.7 }}>
              A Aurora lembra contexto do usuário e melhora a experiência a cada
              nova conversa.
            </div>
          </div>

          <div
            style={{
              background: '#fff',
              borderRadius: 18,
              padding: 22,
              border: '1px solid #e8edf5',
              boxShadow: '0 6px 20px rgba(10,18,35,0.05)',
            }}
          >
            <div style={{ fontWeight: 800, marginBottom: 10 }}>
              Marketing automático
            </div>
            <div style={{ color: '#444', lineHeight: 1.7 }}>
              Crie campanhas, copies, hashtags e imagens prontas para divulgação
              em poucos segundos.
            </div>
          </div>

          <div
            style={{
              background: '#fff',
              borderRadius: 18,
              padding: 22,
              border: '1px solid #e8edf5',
              boxShadow: '0 6px 20px rgba(10,18,35,0.05)',
            }}
          >
            <div style={{ fontWeight: 800, marginBottom: 10 }}>
              IA brasileira
            </div>
            <div style={{ color: '#444', lineHeight: 1.7 }}>
              Plataforma criada no Brasil, com visão de crescimento global e
              foco em utilidade real.
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: 20,
            background: '#fff',
            borderRadius: 20,
            padding: isMobile ? 18 : 24,
            border: '1px solid #e8edf5',
            boxShadow: '0 6px 20px rgba(10,18,35,0.05)',
          }}
        >
          <h2
            style={{
              margin: '0 0 12px 0',
              fontSize: isMobile ? 24 : 28,
              color: '#111',
            }}
          >
            Instale a Aurora IA no seu celular
          </h2>

          <p
            style={{
              margin: 0,
              color: '#444',
              lineHeight: 1.7,
              fontSize: 16,
            }}
          >
            Acesse pelo celular e use a opção
            <strong> “Adicionar à tela inicial” </strong>
            para instalar a Aurora IA como aplicativo.
          </p>

          <div
            style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              gap: 12,
              flexWrap: 'wrap',
              marginTop: 18,
            }}
          >
            <a
              href="/chat"
              style={{
                textAlign: 'center',
                padding: '12px 18px',
                borderRadius: 10,
                textDecoration: 'none',
                background: '#111',
                color: '#fff',
                fontWeight: 700,
              }}
            >
              Abrir Aurora no celular
            </a>

            <a
              href="https://ricardoiaoficial.com"
              style={{
                textAlign: 'center',
                padding: '12px 18px',
                borderRadius: 10,
                textDecoration: 'none',
                background: '#f3f5fa',
                color: '#111',
                fontWeight: 700,
                border: '1px solid #dbe2ee',
              }}
            >
              Link oficial
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}