'use client'

import { useEffect, useRef, useState } from 'react'

type Role = 'user' | 'assistant'
type Msg = { role: Role; content: string }

export default function ChatComponent() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'assistant', content: 'Olá! Como posso ajudar você hoje?' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function sendMessage() {
    const text = input.trim()
    if (!text || loading) return

    const nextMessages: Msg[] = [...messages, { role: 'user' as const, content: text }]

    setInput('')
    setLoading(true)

    // UI: usuário + placeholder do assistente
    setMessages([...nextMessages, { role: 'assistant' as const, content: '' }])

    let assistantText = ''

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages }),
      })

      if (!res.ok) {
        const errText = await res.text().catch(() => '')
        throw new Error(errText || `HTTP ${res.status}`)
      }

      if (!res.body) {
        // fallback raro
        const full = await res.text()
        assistantText = full
        setMessages((prev) => {
          const updated = [...prev]
          updated[updated.length - 1] = { role: 'assistant', content: assistantText || 'Sem resposta.' }
          return updated
        })
        return
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })

        // SSE events separados por \n\n
        const parts = buffer.split('\n\n')
        buffer = parts.pop() || ''

        for (const chunk of parts) {
          const line = chunk.trim()

          // ignora pings ": ping"
          if (line.startsWith(':')) continue

          if (!line.startsWith('data:')) continue

          const jsonStr = line.slice(5).trim()
          if (!jsonStr) continue

          let payload: any
          try {
            payload = JSON.parse(jsonStr)
          } catch {
            continue
          }

          if (payload.type === 'delta' && typeof payload.text === 'string') {
            assistantText += payload.text
            setMessages((prev) => {
              const updated = [...prev]
              updated[updated.length - 1] = { role: 'assistant', content: assistantText }
              return updated
            })
          }

          if (payload.type === 'done') {
            // terminou normal
          }

          if (payload.type === 'error') {
            const msg = payload.message ? String(payload.message) : 'erro no stream'
            assistantText += `\n\n⚠️ Stream interrompido no final (texto acima está válido). Detalhe: ${msg}`
            setMessages((prev) => {
              const updated = [...prev]
              updated[updated.length - 1] = { role: 'assistant', content: assistantText }
              return updated
            })
          }
        }
      }
    } catch (e: any) {
      const msg = e?.message ? String(e.message) : 'falha no streaming'
      assistantText =
        (assistantText || '') +
        (assistantText ? '\n\n' : '') +
        `⚠️ A resposta foi interrompida no final (mas o texto acima está válido). Detalhe: ${msg}`

      setMessages((prev) => {
        const updated = [...prev]
        updated[updated.length - 1] = { role: 'assistant', content: assistantText }
        return updated
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col w-full max-w-md h-[500px] bg-white border rounded-xl shadow-lg overflow-hidden">
      <div className="flex-1 p-4 overflow-y-auto space-y-2">
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
            <div className="inline-block px-3 py-2 rounded-lg bg-gray-200 whitespace-pre-wrap">
              {m.content}
            </div>
          </div>
        ))}

        {loading && <div className="text-xs text-gray-500">digitando...</div>}
        <div ref={endRef} />
      </div>

      <div className="p-3 border-t flex gap-2">
        <input
          className="flex-1 px-3 py-2 border rounded-lg"
          placeholder="Digite sua mensagem..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          disabled={loading}
        />
        <button
          className="px-4 py-2 bg-black text-white rounded-lg disabled:opacity-50"
          onClick={sendMessage}
          disabled={loading}
        >
          Enviar
        </button>
      </div>
    </div>
  )
}
