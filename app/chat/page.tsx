'use client'

import { FormEvent, KeyboardEvent, useState } from 'react'

type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatPage() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Olá! Eu sou a Aurora IA. Como posso ajudar você hoje?',
    },
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function sendMessage() {
    const trimmedMessage = message.trim()

    if (!trimmedMessage || loading) {
      return
    }

    const updatedMessages: ChatMessage[] = [
      ...messages,
      { role: 'user', content: trimmedMessage },
    ]

    setMessages(updatedMessages)
    setMessage('')
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: trimmedMessage,
          messages: updatedMessages,
        }),
      })

      const rawText = await response.text()

      let parsed: any = null
      try {
        parsed = JSON.parse(rawText)
      } catch {
        parsed = null
      }

      if (!response.ok) {
        const apiError =
          parsed?.error ||
          parsed?.message ||
          rawText ||
          'Erro ao processar a mensagem.'

        throw new Error(apiError)
      }

      const reply =
        parsed?.reply ||
        parsed?.response ||
        parsed?.message ||
        parsed?.output_text ||
        rawText ||
        'Sem resposta da Aurora.'

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: reply,
        },
      ])
    } catch (err: any) {
      setError(err?.message || 'Erro ao enviar mensagem.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    await sendMessage()
  }

  async function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      await sendMessage()
    }
  }

  function clearChat() {
    setMessage('')
    setError('')
    setMessages([
      {
        role: 'assistant',
        content: 'Olá! Eu sou a Aurora IA. Como posso ajudar você hoje?',
      },
    ])
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#f5f5f5',
        padding: '24px 16px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: 900,
          margin: '0 auto',
        }}
      >
        <div
          style={{
            marginBottom: 20,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          <div>
            <h1 style={{ margin: 0, fontSize: 30 }}>Chat Aurora IA</h1>
            <p style={{ margin: '8px 0 0 0', color: '#555' }}>
              Converse com a Aurora IA em estilo ChatGPT.
            </p>
          </div>

          <a
            href="/"
            style={{
              padding: '10px 16px',
              border: '1px solid #000',
              borderRadius: 8,
              textDecoration: 'none',
              color: '#000',
              background: '#fff',
            }}
          >
            Voltar
          </a>
        </div>

        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e5e5e5',
            borderRadius: 14,
            padding: 20,
            minHeight: 420,
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
            }}
          >
            {messages.map((item, index) => {
              const isUser = item.role === 'user'

              return (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: isUser ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div
                    style={{
                      maxWidth: '80%',
                      padding: '14px 16px',
                      borderRadius: 14,
                      background: isUser ? '#000' : '#f0f0f0',
                      color: isUser ? '#fff' : '#111',
                      whiteSpace: 'pre-wrap',
                      lineHeight: 1.6,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 12,
                        opacity: 0.75,
                        marginBottom: 6,
                        fontWeight: 'bold',
                      }}
                    >
                      {isUser ? 'Você' : 'Aurora'}
                    </div>
                    <div>{item.content}</div>
                  </div>
                </div>
              )
            })}

            {loading ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                }}
              >
                <div
                  style={{
                    maxWidth: '80%',
                    padding: '14px 16px',
                    borderRadius: 14,
                    background: '#f0f0f0',
                    color: '#111',
                    lineHeight: 1.6,
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      opacity: 0.75,
                      marginBottom: 6,
                      fontWeight: 'bold',
                    }}
                  >
                    Aurora
                  </div>
                  <div>Digitando...</div>
                </div>
              </div>
            ) : null}

            {error ? (
              <div
                style={{
                  padding: 14,
                  borderRadius: 10,
                  background: '#fff1f0',
                  border: '1px solid #ffccc7',
                  color: '#a8071a',
                  whiteSpace: 'pre-wrap',
                }}
              >
                <strong>Erro:</strong> {error}
              </div>
            ) : null}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            marginTop: 16,
            background: '#ffffff',
            border: '1px solid #e5e5e5',
            borderRadius: 14,
            padding: 16,
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          }}
        >
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite sua mensagem... (Enter envia, Shift + Enter quebra linha)"
            rows={4}
            style={{
              width: '100%',
              padding: 14,
              borderRadius: 10,
              border: '1px solid #ccc',
              fontSize: 16,
              resize: 'vertical',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />

          <div
            style={{
              marginTop: 12,
              display: 'flex',
              gap: 10,
              flexWrap: 'wrap',
            }}
          >
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '12px 20px',
                background: '#000',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Enviando...' : 'Enviar'}
            </button>

            <button
              type="button"
              onClick={clearChat}
              disabled={loading}
              style={{
                padding: '12px 20px',
                background: '#fff',
                color: '#000',
                border: '1px solid #000',
                borderRadius: 8,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
              }}
            >
              Limpar conversa
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}