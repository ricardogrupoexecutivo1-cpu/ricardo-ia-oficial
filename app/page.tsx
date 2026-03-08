'use client'

import { useState } from 'react'

export default function Page() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  async function sendMessage(e?: any, preset?: string) {
    if (e) e.preventDefault()

    const text = preset || input.trim()
    if (!text) return

    setInput('')
    setLoading(true)

    const userMessage = { role: 'user', content: text }

    setMessages((prev) => [...prev, userMessage])

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'demo-user',
          companyId: 'demo-company',
          conversationId: 'main-chat',
          message: text,
        }),
      })

      const data = await res.json()

      const assistantMessage = {
        role: 'assistant',
        content: data.reply || 'Sem resposta.',
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Erro ao consultar a IA.' },
      ])
    }

    setLoading(false)
  }

  function copyLink() {
    navigator.clipboard.writeText('https://ricardoiaoficial.com')
    alert('Link copiado! Compartilhe com seus amigos.')
  }

  return (
    <div style={{ maxWidth: 750, margin: '40px auto', fontFamily: 'Arial' }}>
      
      <h2 style={{ textAlign: 'center' }}>
        RicardoIA apresenta
      </h2>

      <h1 style={{ textAlign: 'center', marginTop: 0 }}>
        Aurora IA Beta
      </h1>

      <p style={{ textAlign: 'center' }}>
        Converse com a inteligência artificial agora.
      </p>

      <p style={{ textAlign: 'center', fontSize: 14 }}>
        Beta público aberto — teste gratuitamente.
      </p>

      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <button
          onClick={copyLink}
          style={{
            padding: '8px 14px',
            borderRadius: 6,
            border: 'none',
            background: '#333',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          Compartilhar Aurora
        </button>
      </div>

      <div
        style={{
          border: '1px solid #ddd',
          borderRadius: 10,
          padding: 20,
          minHeight: 300,
          marginBottom: 20,
        }}
      >
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <b>{m.role === 'user' ? 'Você:' : 'Aurora:'}</b> {m.content}
          </div>
        ))}

        {loading && <div>Aurora está pensando...</div>}
      </div>

      {messages.length === 0 && (
        <div style={{ marginBottom: 20 }}>
          <b>Experimente perguntar:</b>
          <div style={{ marginTop: 10 }}>
            <button onClick={() => sendMessage(null, 'Como ganhar dinheiro online?')} style={exampleBtn}>
              Como ganhar dinheiro online?
            </button>

            <button onClick={() => sendMessage(null, 'Me dê uma receita rápida')} style={exampleBtn}>
              Me dê uma receita rápida
            </button>

            <button onClick={() => sendMessage(null, 'Explique inteligência artificial')} style={exampleBtn}>
              Explique inteligência artificial
            </button>
          </div>
        </div>
      )}

      <form onSubmit={sendMessage}>
        <input
          style={{
            width: '75%',
            padding: 10,
            borderRadius: 6,
            border: '1px solid #ccc',
          }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite sua mensagem..."
        />

        <button
          type="submit"
          style={{
            marginLeft: 10,
            padding: '10px 16px',
            borderRadius: 6,
            border: 'none',
            background: '#111',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          Enviar
        </button>
      </form>
    </div>
  )
}

const exampleBtn = {
  display: 'block',
  marginBottom: 8,
  padding: '6px 10px',
  borderRadius: 6,
  border: '1px solid #ccc',
  background: '#f5f5f5',
  cursor: 'pointer',
}