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

  async function sendMessage(e?: React.FormEvent, preset?: string) {
    if (e) e.preventDefault()

    const text = preset || input.trim()
    if (!text || !userId || !conversationId) return

    setInput('')
    setLoading(true)

    setMessages((prev) => [...prev, { role: 'user', content: text }])

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

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.reply || 'Sem resposta.' },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Erro ao consultar a IA.' },
      ])
    }

    setLoading(false)
  }

  return (
    <div
      style={{
        maxWidth: 820,
        margin: '0 auto',
        padding: '20px 14px 40px',
        fontFamily: 'Arial, sans-serif',
        background: '#ffffff',
        color: '#111111',
        minHeight: '100vh',
      }}
    >
      <div
        style={{
          textAlign: 'center',
          marginBottom: 18,
          padding: '10px 14px',
          borderRadius: 999,
          background: '#111111',
          color: '#ffffff',
          fontWeight: 700,
        }}
      >
        Beta público aberto • Teste gratuitamente hoje
      </div>

      <h2
        style={{
          textAlign: 'center',
          marginBottom: 6,
          color: '#111111',
        }}
      >
        RicardoIA apresenta
      </h2>

      <h1
        style={{
          textAlign: 'center',
          marginTop: 0,
          marginBottom: 8,
          color: '#111111',
        }}
      >
        Aurora IA Beta
      </h1>

      <p
        style={{
          textAlign: 'center',
          fontSize: 18,
          marginBottom: 8,
          color: '#111111',
        }}
      >
        🌎 Aberto para testes no mundo todo
      </p>

      <p
        style={{
          textAlign: 'center',
          marginTop: 0,
          marginBottom: 8,
          color: '#333333',
          fontWeight: 600,
        }}
      >
        Ideias • Negócios • Conhecimento • Curiosidades • Tecnologia
      </p>

      <p
        style={{
          textAlign: 'center',
          color: '#555555',
          marginTop: 0,
          marginBottom: 24,
        }}
      >
        A Aurora está evoluindo diariamente com feedback real dos usuários.
      </p>

      <div
        style={{
          textAlign: 'center',
          marginBottom: 20,
          border: '1px solid #dddddd',
          borderRadius: 16,
          padding: 18,
          background: '#f7f7f7',
        }}
      >
        <h2
          style={{
            marginTop: 0,
            marginBottom: 8,
            color: '#111111',
          }}
        >
          Faça qualquer pergunta para Aurora
        </h2>

        <p
          style={{
            color: '#555555',
            marginTop: 0,
            marginBottom: 16,
          }}
        >
          Clique em um exemplo abaixo para começar mais rápido.
        </p>

        <div
          style={{
            display: 'flex',
            gap: 10,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <button onClick={() => sendMessage(undefined, 'Como ganhar dinheiro online?')} style={promptBtn}>
            💡 Como ganhar dinheiro online?
          </button>

          <button onClick={() => sendMessage(undefined, 'Receita rápida de pão de queijo')} style={promptBtn}>
            🍞 Receita rápida de pão de queijo
          </button>

          <button onClick={() => sendMessage(undefined, 'Ideias de negócios para começar')} style={promptBtn}>
            🚀 Ideias de negócios para começar
          </button>

          <button onClick={() => sendMessage(undefined, 'Explique inteligência artificial')} style={promptBtn}>
            🤖 Explique inteligência artificial
          </button>
        </div>
      </div>

      <div
        style={{
          border: '1px solid #dddddd',
          borderRadius: 16,
          padding: 18,
          minHeight: 320,
          marginBottom: 20,
          background: '#ffffff',
          boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
        }}
      >
        {messages.length === 0 && !loading && (
          <div
            style={{
              color: '#444444',
              fontSize: 16,
              lineHeight: 1.5,
            }}
          >
            Olá! Eu sou a AURORA. Como posso ajudar você hoje?
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              marginBottom: 14,
              padding: '14px 14px',
              borderRadius: 14,
              background: m.role === 'user' ? '#f1f1f1' : '#e8f0ff',
              color: '#111111',
              border: '1px solid #d9d9d9',
              lineHeight: 1.6,
              fontSize: 16,
              wordBreak: 'break-word',
              whiteSpace: 'pre-wrap',
            }}
          >
            <b style={{ color: '#111111' }}>
              {m.role === 'user' ? 'Você:' : 'Aurora:'}
            </b>{' '}
            <span style={{ color: '#111111' }}>{m.content}</span>
          </div>
        ))}

        {loading && (
          <div
            style={{
              color: '#333333',
              fontWeight: 600,
            }}
          >
            Aurora está pensando...
          </div>
        )}
      </div>

      <form onSubmit={sendMessage}>
        <div
          style={{
            display: 'flex',
            gap: 10,
            alignItems: 'stretch',
          }}
        >
          <input
            style={{
              flex: 1,
              padding: 14,
              borderRadius: 10,
              border: '1px solid #bbbbbb',
              fontSize: 16,
              color: '#111111',
              background: '#ffffff',
              outline: 'none',
            }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua mensagem..."
          />

          <button type="submit" style={sendBtn}>
            Enviar
          </button>
        </div>
      </form>
    </div>
  )
}

const promptBtn: React.CSSProperties = {
  padding: '10px 14px',
  borderRadius: 999,
  border: '1px solid #cccccc',
  background: '#ffffff',
  color: '#111111',
  cursor: 'pointer',
  fontWeight: 700,
  fontSize: 15,
}

const sendBtn: React.CSSProperties = {
  padding: '0 18px',
  borderRadius: 10,
  border: 'none',
  background: '#111111',
  color: '#ffffff',
  cursor: 'pointer',
  fontWeight: 700,
  fontSize: 16,
}