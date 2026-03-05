'use client'

import { useEffect, useRef, useState } from 'react'

type Msg = {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatComponent() {

  const [messages, setMessages] = useState<Msg[]>([
    { role: 'assistant', content: 'Olá! Como posso ajudar você hoje?' }
  ])

  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const endRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage() {

    const text = input.trim()

    if (!text || loading) return

    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: text }])

    setLoading(true)

    try {

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      })

      const data = await res.json()

      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: data.reply || 'Sem resposta.' }
      ])

    } catch (err) {

      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Erro ao processar a mensagem.' }
      ])

    } finally {
      setLoading(false)
    }

  }

  return (

    <div className="flex flex-col w-full max-w-md h-[500px] bg-white border rounded-xl shadow-lg overflow-hidden">

      {/* mensagens */}

      <div className="flex-1 p-4 overflow-y-auto space-y-2">

        {messages.map((m, i) => (

          <div
            key={i}
            className={m.role === 'user' ? 'text-right' : 'text-left'}
          >

            <div className="inline-block px-3 py-2 rounded-lg bg-gray-200">
              {m.content}
            </div>

          </div>

        ))}

        {loading && (
          <div className="text-xs text-gray-500">
            digitando...
          </div>
        )}

        <div ref={endRef} />

      </div>

      {/* input */}

      <div className="p-3 border-t flex gap-2">

        <input
          className="flex-1 px-3 py-2 border rounded-lg"
          placeholder="Digite sua mensagem..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') sendMessage()
          }}
        />

        <button
          className="px-4 py-2 bg-black text-white rounded-lg"
          onClick={sendMessage}
        >
          Enviar
        </button>

      </div>

    </div>

  )

}