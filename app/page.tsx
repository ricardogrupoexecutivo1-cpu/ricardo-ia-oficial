'use client'

import { useEffect, useState } from 'react'

type ChatMessage = {
  role: string
  content: string
}

export default function Page() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState('')
  const [conversationId, setConversationId] = useState('')
  const [feedbackSent, setFeedbackSent] = useState(false)

  useEffect(() => {
    let uid = localStorage.getItem('aurora_user_id')
    let cid = localStorage.getItem('aurora_conversation_id')

    if (!uid) {
      uid = crypto.randomUUID()
      localStorage.setItem('aurora_user_id', uid)
    }

    if (!cid) {
      cid = crypto.randomUUID()
      localStorage.setItem('aurora_conversation_id', cid)
    }

    setUserId(uid)
    setConversationId(cid)
  }, [])

  async function sendMessage(e?: any, preset?: string) {
    if (e) e.preventDefault()

    const text = preset || input.trim()
    if (!text || !userId || !conversationId) return

    setInput('')
    setLoading(true)

    const userMessage = { role: 'user', content: text }
    setMessages((prev) => [...prev, userMessage])

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          companyId: 'public-company',
          conversationId,
          message: text,
        }),
      })

      const data = await res.json()

      const assistantMessage = {
        role: 'assistant',
        content: data.reply || 'Sem resposta.',
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Erro ao consultar a IA.' },
      ])
    }

    setLoading(false)
  }

  function copyLink() {
    navigator.clipboard.writeText('https://ricardoiaoficial.com')
    alert('Link copiado! Agora você pode compartilhar a Aurora.')
  }

  function sendQuickFeedback(type: string) {
    setFeedbackSent(true)
    alert(`Feedback registrado: ${type}`)
  }

  return (
    <div
      style={{
        maxWidth: 760,
        margin: '40px auto',
        fontFamily: 'Arial, sans-serif',
        padding: '0 16px',
      }}
    >
      <div
        style={{
          textAlign: 'center',
          marginBottom: 18,
          padding: '10px 14px',
          borderRadius: 999,
          background: '#111',
          color: '#fff',
          fontWeight: 700,
        }}
      >
        Beta público aberto • Teste gratuitamente hoje
      </div>

      <h2 style={{ textAlign: 'center', marginBottom: 6 }}>
        RicardoIA apresenta
      </h2>

      <h1 style={{ textAlign: 'center', marginTop: 0, marginBottom: 8 }}>
        Aurora IA Beta
      </h1>

      <p style={{ textAlign: 'center', fontSize: 18, marginBottom: 8 }}>
        🌎 Aberto para testes no mundo todo
      </p>

      <p style={{ textAlign: 'center', marginTop: 0, marginBottom: 8 }}>
        Ideias • Negócios • Conhecimento • Curiosidades • Tecnologia
      </p>

      <p style={{ textAlign: 'center', color: '#555', marginTop: 0 }}>
        A Aurora está evoluindo diariamente com feedback real dos usuários.
      </p>

      <div
        style={{
          display: 'flex',
          gap: 10,
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: 22,
        }}
      >
        <button onClick={copyLink} style={primaryBtn}>
          Compartilhar Aurora
        </button>

        <a
          href="https://ricardoiaoficial.com"
          target="_blank"
          rel="noreferrer"
          style={{ ...secondaryBtn, textDecoration: 'none', display: 'inline-block' }}
        >
          ricardoiaoficial.com
        </a>
      </div>

      <div
        style={{
          textAlign: 'center',
          marginBottom: 20,
          border: '1px solid #ddd',
          borderRadius: 12,
          padding: 16,
          background: '#fafafa',
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: 8 }}>
          Faça qualquer pergunta para Aurora
        </h2>

        <p style={{ color: '#555', marginTop: 0 }}>
          Clique em um exemplo abaixo para começar mais rápido.
        </p>

        <div
          style={{
            display: 'flex',
            gap: 10,
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginTop: 12,
          }}
        >
          <button
            onClick={() => sendMessage(null, 'Como ganhar dinheiro online?')}
            style={promptBtn}
          >
            💡 Como ganhar dinheiro online?
          </button>

          <button
            onClick={() => sendMessage(null, 'Receita rápida de pão de queijo')}
            style={promptBtn}
          >
            🍞 Receita rápida de pão de queijo
          </button>

          <button
            onClick={() => sendMessage(null, 'Ideias de negócios para começar')}
            style={promptBtn}
          >
            🚀 Ideias de negócios para começar
          </button>

          <button
            onClick={() => sendMessage(null, 'Explique inteligência artificial')}
            style={promptBtn}
          >
            🤖 Explique inteligência artificial
          </button>
        </div>
      </div>

      <div
        style={{
          border: '1px solid #ddd',
          borderRadius: 12,
          padding: 20,
          minHeight: 320,
          marginBottom: 20,
          background: '#fff',
        }}
      >
        {messages.length === 0 && !loading && (
          <div style={{ color: '#777' }}>
            Olá! Eu sou a AURORA. Como posso ajudar você hoje?
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              marginBottom: 12,
              padding: '10px 12px',
              borderRadius: 10,
              background: m.role === 'user' ? '#f3f3f3' : '#eef5ff',
            }}
          >
            <b>{m.role === 'user' ? 'Você:' : 'Aurora:'}</b> {m.content}
          </div>
        ))}

        {loading && <div>Aurora está pensando...</div>}
      </div>

      <form onSubmit={sendMessage} style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <input
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 8,
              border: '1px solid #ccc',
              fontSize: 16,
            }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua mensagem..."
          />

          <button type="submit" style={primaryBtn}>
            Enviar
          </button>
        </div>
      </form>

      <div
        style={{
          border: '1px solid #ddd',
          borderRadius: 12,
          padding: 16,
          background: '#fafafa',
        }}
      >
        <b>Feedback rápido</b>
        <p style={{ marginTop: 8, color: '#555' }}>
          Sua opinião ajuda a Aurora evoluir mais rápido.
        </p>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button onClick={() => sendQuickFeedback('Excelente')} style={secondaryBtn}>
            Excelente
          </button>

          <button onClick={() => sendQuickFeedback('Boa')} style={secondaryBtn}>
            Boa
          </button>

          <button onClick={() => sendQuickFeedback('Precisa melhorar')} style={secondaryBtn}>
            Precisa melhorar
          </button>
        </div>

        {feedbackSent && (
          <p style={{ marginTop: 12, color: '#0a7a2f', fontWeight: 700 }}>
            Obrigado pelo feedback.
          </p>
        )}
      </div>
    </div>
  )
}

const primaryBtn: React.CSSProperties = {
  padding: '12px 16px',
  borderRadius: 8,
  border: 'none',
  background: '#111',
  color: '#fff',
  cursor: 'pointer',
  fontWeight: 700,
}

const secondaryBtn: React.CSSProperties = {
  padding: '10px 14px',
  borderRadius: 8,
  border: '1px solid #ccc',
  background: '#fff',
  color: '#111',
  cursor: 'pointer',
  fontWeight: 700,
}

const promptBtn: React.CSSProperties = {
  padding: '10px 14px',
  borderRadius: 999,
  border: '1px solid #ddd',
  background: '#fff',
  color: '#111',
  cursor: 'pointer',
  fontWeight: 700,
}
