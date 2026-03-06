'use client'

import { useEffect, useRef, useState } from 'react'

type Role = 'user' | 'assistant'
type Msg = { role: Role; content: string }

type InitState = {
  userId: string
  companyId: string
  conversationId: string
}

export default function ChatComponent() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'assistant', content: 'Olá! Eu sou a AURORA. Como posso ajudar você hoje?' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [init, setInit] = useState<InitState | null>(null)

  const endRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    const saved = localStorage.getItem('aurora_init')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed?.userId && parsed?.companyId && parsed?.conversationId) {
          setInit(parsed)
          return
        }
      } catch {}
    }

    ;(async () => {
      try {
        const res = await fetch('/api/init', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ displayName: 'Visitante', companyName: 'Empresa Demo' }),
        })

        const data = await res.json()

        if (data?.userId && data?.companyId && data?.conversationId) {
          localStorage.setItem('aurora_init', JSON.stringify(data))
          setInit(data)
        } else {
          setMessages((prev) => [
            ...prev,
            { role: 'assistant', content: 'Erro ao inicializar a AURORA.' },
          ])
        }
      } catch {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: 'Erro ao inicializar a AURORA.' },
        ])
      }
    })()
  }, [])

  async function sendMessage() {
    const text = input.trim()
    if (!text || loading) return
    if (!init) return

    const nextMessages: Msg[] = [...messages, { role: 'user' as const, content: text }]

    setInput('')
    setLoading(true)
    setMessages([...nextMessages, { role: 'assistant' as const, content: '' }])

    let assistantText = ''
    let doneReceived = false

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: init.userId,
          companyId: init.companyId,
          conversationId: init.conversationId,
          message: text,
        }),
      })

      if (!res.ok) {
        const errText = await res.text().catch(() => '')
        throw new Error(errText || `HTTP ${res.status}`)
      }

      const reader = res.body?.getReader()
      if (!reader) throw new Error('Sem stream')

      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })

        const parts = buffer.split('\n\n')
        buffer = parts.pop() || ''

        for (const chunk of parts) {
          const line = chunk.trim()

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
            doneReceived = true
            setLoading(false)
            try {
              await reader.cancel()
            } catch {}
            break
          }

          if (payload.type === 'error') {
            const msg = payload.message ? String(payload.message) : 'erro no stream'
            assistantText =
              (assistantText || '') +
              (assistantText ? '\n\n' : '') +
              `⚠️ Resposta interrompida. Detalhe: ${msg}`

            setMessages((prev) => {
              const updated = [...prev]
              updated[updated.length - 1] = { role: 'assistant', content: assistantText }
              return updated
            })

            setLoading(false)
            try {
              await reader.cancel()
            } catch {}
            break
          }
        }

        if (doneReceived) break
      }
    } catch (e: any) {
      const msg = e?.message ? String(e.message) : 'falha'
      assistantText =
        (assistantText || '') +
        (assistantText ? '\n\n' : '') +
        `⚠️ Resposta interrompida. Detalhe: ${msg}`

      setMessages((prev) => {
        const updated = [...prev]
        updated[updated.length - 1] = { role: 'assistant', content: assistantText || 'Erro ao processar a mensagem.' }
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