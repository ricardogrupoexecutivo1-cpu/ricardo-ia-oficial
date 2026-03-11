'use client'

import { FormEvent, useState } from 'react'

export default function ChatPage() {
  const [message, setMessage] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const trimmedMessage = message.trim()

    if (!trimmedMessage) {
      setError('Digite uma mensagem antes de enviar.')
      return
    }

    setLoading(true)
    setError('')
    setAnswer('')

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: trimmedMessage,
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

      const finalAnswer =
        parsed?.reply ||
        parsed?.response ||
        parsed?.message ||
        parsed?.output_text ||
        rawText ||
        'Sem resposta da IA.'

      setAnswer(finalAnswer)
    } catch (err: any) {
      setError(err?.message || 'Erro ao enviar mensagem.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main
      style={{
        maxWidth: 900,
        margin: '0 auto',
        padding: 40,
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h1 style={{ fontSize: 32, marginBottom: 16 }}>Chat Aurora IA</h1>

      <p style={{ color: '#555', marginBottom: 24 }}>
        Converse com a Aurora IA em tempo real.
      </p>

      <div
        style={{
          border: '1px solid #ddd',
          borderRadius: 8,
          padding: 20,
          background: '#fafafa',
          marginBottom: 20,
        }}
      >
        <p style={{ margin: 0, color: '#333' }}>
          Digite uma pergunta e clique em enviar.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Digite sua mensagem..."
          rows={6}
          style={{
            width: '100%',
            padding: 12,
            borderRadius: 8,
            border: '1px solid #ccc',
            fontSize: 16,
            resize: 'vertical',
          }}
        />

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px 20px',
              background: '#000',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Enviando...' : 'Enviar'}
          </button>

          <button
            type="button"
            onClick={() => {
              setMessage('')
              setAnswer('')
              setError('')
            }}
            style={{
              padding: '12px 20px',
              background: '#fff',
              color: '#000',
              border: '1px solid #000',
              borderRadius: 6,
              cursor: 'pointer',
            }}
          >
            Limpar
          </button>

          <a
            href="/"
            style={{
              padding: '12px 20px',
              border: '1px solid #000',
              borderRadius: 6,
              textDecoration: 'none',
              color: '#000',
              display: 'inline-block',
            }}
          >
            Voltar
          </a>
        </div>
      </form>

      {error ? (
        <div
          style={{
            marginTop: 24,
            padding: 16,
            borderRadius: 8,
            background: '#fff1f0',
            border: '1px solid #ffccc7',
            color: '#a8071a',
            whiteSpace: 'pre-wrap',
          }}
        >
          <strong>Erro:</strong> {error}
        </div>
      ) : null}

      {answer ? (
        <div
          style={{
            marginTop: 24,
            padding: 20,
            borderRadius: 8,
            background: '#f6ffed',
            border: '1px solid #b7eb8f',
            color: '#135200',
            whiteSpace: 'pre-wrap',
            lineHeight: 1.6,
          }}
        >
          <h2 style={{ marginTop: 0, fontSize: 22 }}>Resposta da Aurora</h2>
          <div>{answer}</div>
        </div>
      ) : null}
    </main>
  )
}