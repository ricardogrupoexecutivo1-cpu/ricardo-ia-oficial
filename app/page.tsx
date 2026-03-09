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

      <h2 style={{ textAlign: 'center', marginBottom: 6 }}>RicardoIA apresenta</h2>
      <h1 style={{ textAlign: 'center', marginTop: 0, marginBottom: 8 }}>Aurora IA Beta</h1>

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
          textAlign: 'center',
          marginBottom: 20,
          border: '1px solid #ddd',
          borderRadius: 12,
          padding: 16,
          background: '#fafafa',
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: 8 }}>Faça qualquer pergunta para Aurora</h2>

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
          <button onClick={() => sendMessage(undefined, 'Como ganhar dinheiro online?')}>
            💡 Como ganhar dinheiro online?
          </button>

          <button onClick={() => sendMessage(undefined, 'Receita rápida de pão de queijo')}>
            🍞 Receita rápida de pão de queijo
          </button>

          <button onClick={() => sendMessage(undefined, 'Ideias de negócios para começar')}>
            🚀 Ideias de negócios para começar
          </button>

          <button onClick={() => sendMessage(undefined, 'Explique inteligência artificial')}>
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
          <div style={{ color: '#777' }}>Olá! Eu sou a AURORA. Como posso ajudar você hoje?</div>
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

      <form onSubmit={sendMessage}>
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

          <button type="submit">Enviar</button>
        </div>
      </form>
    </div>
  )
}