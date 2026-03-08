'use client'

import { useState } from 'react'

export default function Page() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  async function sendMessage(e?: any) {
    if (e) e.preventDefault()

    const text = input.trim()
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

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'Arial' }}>
      <h2>Olá! Eu sou a AURORA. Como posso ajudar você hoje?</h2>

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

      <form onSubmit={sendMessage}>
        <input
          style={{
            width: '80%',
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