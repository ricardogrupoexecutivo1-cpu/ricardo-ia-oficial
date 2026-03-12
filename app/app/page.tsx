'use client'

import { useEffect, useState } from 'react'

export default function AppPage() {
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
          'linear-gradient(180deg, #0b1020 0%, #121a33 45%, #f5f7fb 45%, #f5f7fb 100%)',
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
            Aurora IA App
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
              href="/"
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
              Home
            </a>

            <a
              href="/chat"
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
              Abrir Chat
            </a>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1.1fr 0.9fr',
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
              Instale a Aurora IA no seu celular
            </div>

            <h1
              style={{
                margin: '0 0 14px 0',
                fontSize: isMobile ? 30 : 42,
                lineHeight: 1.08,
              }}
            >
              Use a Aurora IA como aplicativo no Android e iPhone.
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
              Instale a Aurora IA diretamente no seu celular e tenha acesso
              rápido ao chat inteligente, geração de imagens, marketing
              automático e memória por usuário.
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
                Abrir Aurora Agora
              </a>

              <a
                href="https://ricardoiaoficial.com"
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
                Link oficial
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
              <span>✔ App instalável</span>
              <span>✔ Chat inteligente</span>
              <span>✔ Imagens com IA</span>
              <span>✔ Marketing automático</span>
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
              Instalação rápida
            </div>

            <div
              style={{
                fontSize: isMobile ? 28 : 32,
                fontWeight: 800,
                marginBottom: 10,
                color: '#0f172a',
              }}
            >
              Aurora IA App
            </div>

            <div
              style={{
                fontSize: isMobile ? 16 : 17,
                lineHeight: 1.7,
                color: '#1e293b',
                fontWeight: 600,
              }}
            >
              Instale em poucos segundos e tenha a Aurora sempre na tela do seu
              celular.
            </div>

            <div
              style={{
                marginTop: 16,
                padding: 14,
                borderRadius: 14,
                background: '#f8fafc',
                lineHeight: 1.8,
                color: '#0f172a',
                fontSize: isMobile ? 15 : 16,
                border: '1px solid #e2e8f0',
              }}
            >
              ✅ acesso rápido pelo ícone no celular
              <br />
              ✅ experiência parecida com app
              <br />
              ✅ ideal para Android e iPhone
              <br />
              ✅ funciona com seu login Aurora
            </div>

            <a
              href="/chat"
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
              Abrir e instalar
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
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
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
            <h2
              style={{
                margin: '0 0 12px 0',
                fontSize: isMobile ? 24 : 28,
                color: '#111',
              }}
            >
              Como instalar no Android
            </h2>

            <div style={{ color: '#444', lineHeight: 1.8, fontSize: 16 }}>
              1. Abra o site da Aurora IA no Chrome.
              <br />
              2. Toque no menu do navegador.
              <br />
              3. Escolha <strong>Adicionar à tela inicial</strong> ou
              <strong> Instalar app</strong>.
              <br />
              4. Confirme a instalação.
            </div>

            <a
              href="https://ricardoiaoficial.com"
              style={{
                marginTop: 18,
                display: 'inline-block',
                padding: '12px 18px',
                borderRadius: 10,
                textDecoration: 'none',
                background: '#111',
                color: '#fff',
                fontWeight: 700,
              }}
            >
              Abrir site oficial
            </a>
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
            <h2
              style={{
                margin: '0 0 12px 0',
                fontSize: isMobile ? 24 : 28,
                color: '#111',
              }}
            >
              Como instalar no iPhone
            </h2>

            <div style={{ color: '#444', lineHeight: 1.8, fontSize: 16 }}>
              1. Abra o site da Aurora IA no Safari.
              <br />
              2. Toque no botão de compartilhar.
              <br />
              3. Escolha <strong>Adicionar à Tela de Início</strong>.
              <br />
              4. Confirme e pronto.
            </div>

            <a
              href="https://ricardoiaoficial.com"
              style={{
                marginTop: 18,
                display: 'inline-block',
                padding: '12px 18px',
                borderRadius: 10,
                textDecoration: 'none',
                background: '#111',
                color: '#fff',
                fontWeight: 700,
              }}
            >
              Abrir site oficial
            </a>
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
            Aurora IA para o mundo
          </h2>

          <p
            style={{
              margin: 0,
              color: '#444',
              lineHeight: 1.7,
              fontSize: 16,
            }}
          >
            A Aurora IA é uma inteligência artificial brasileira, aberta para o
            mundo, com foco em produtividade, marketing, imagens e crescimento
            digital.
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
              href="/planos"
              style={{
                textAlign: 'center',
                padding: '12px 18px',
                borderRadius: 10,
                textDecoration: 'none',
                background: '#7c5cff',
                color: '#fff',
                fontWeight: 700,
              }}
            >
              Ver planos
            </a>

            <a
              href="/chat"
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
              Abrir chat
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}