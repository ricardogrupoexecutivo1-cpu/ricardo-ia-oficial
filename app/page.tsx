'use client'

import { useState, useEffect } from 'react'

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
    let uid = localStorage.getItem('aurora_user')
    let cid = localStorage.getItem('aurora_conversation')

    if (!uid) {
      uid = crypto.randomUUID()
      localStorage.setItem('aurora_user', uid)
    }

    if (!cid) {
      cid = crypto.randomUUID()
      localStorage.setItem('aurora_conversation', cid)
    }

    setUserId(uid)
    setConversationId(cid)
  }, [])

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
    alert('Link copiado! Compartilhe a Aurora.')
  }

  return (
    <div style={{ maxWidth: 760, margin: '40px auto', fontFamily: 'Arial', padding: 20 }}>
      
      <div style={{ textAlign: 'center', marginBottom: 10 }}>
        <b>Beta público aberto • Teste gratuitamente hoje</b>
      </div>

      <h2 style={{ textAlign: 'center', marginBottom: 0 }}>
        RicardoIA apresenta
      </h2>

      <h1 style={{ textAlign: 'center', marginTop: 4 }}>
        Aurora IA Beta
      </h1>

      <p style={{ textAlign: 'center' }}>
        🌎 Aberto para testes no mundo todo
      </p>

      <p style={{ textAlign: 'center' }}>
        Ideias • Negócios • Conhecimento • Curiosidades • Tecnologia
      </p>

      <p style={{ textAlign: 'center' }}>
        Converse com a inteligência artificial agora.
      </p>

      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <button onClick={copyLink}>
          Compartilhar Aurora
        </button>
      </div>

      {messages.length === 0 && (
        <div style={{ marginBottom: 20 }}>
          <b>Experimente perguntar:</b>

          <button onClick={() => sendMessage(null, 'Como ganhar dinheiro online?')}>
            Como ganhar dinheiro online?
          </button>

          <button onClick={() => sendMessage(null, 'Me dê uma receita rápida')}>
            Me dê uma receita rápida
          </button>

          <button onClick={() => sendMessage(null, 'Explique inteligência artificial')}>
            Explique inteligência artificial
          </button>

          <button onClick={() => sendMessage(null, 'Quais negócios posso começar com pouco dinheiro?')}>
            Quais negócios posso começar com pouco dinheiro?
          </button>
        </div>
      )}

      <div style={{ border: '1px solid #ddd', padding: 20, minHeight: 300, marginBottom: 20 }}>
        {messages.length === 0 && !loading && (
          <div>Olá! Eu sou a AURORA. Como posso ajudar você hoje?</div>
        )}

        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <b>{m.role === 'user' ? 'Você:' : 'Aurora:'}</b> {m.content}
          </div>
        ))}

        {loading && <div>Aurora está pensando...</div>}
      </div>

      <form onSubmit={sendMessage}>
        <input
          style={{ width: '75%', padding: 10 }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite sua mensagem..."
        />

        <button type="submit">
          Enviar
        </button>
      </form>
    </div>
  )
}