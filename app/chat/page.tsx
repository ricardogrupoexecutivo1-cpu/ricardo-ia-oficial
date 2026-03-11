'use client'

import { FormEvent, KeyboardEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

type AuthUser = {
  id: string
  email?: string
} | null

type Conversation = {
  id: string
  title: string
  created_at: string
  updated_at: string
}

function generateSessionId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `session_${Date.now()}_${Math.random().toString(36).slice(2)}`
}

export default function ChatPage() {
  const router = useRouter()

  const [user, setUser] = useState<AuthUser>(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [sessionId, setSessionId] = useState('')
  const [conversationId, setConversationId] = useState('')
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Olá! Eu sou a Aurora IA. Como posso ajudar você hoje?',
    },
  ])
  const [loading, setLoading] = useState(false)
  const [loadingConversations, setLoadingConversations] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const storageKey = 'aurora_session_id'
    const existingSessionId = window.localStorage.getItem(storageKey)

    if (existingSessionId) {
      setSessionId(existingSessionId)
    } else {
      const newSessionId = generateSessionId()
      window.localStorage.setItem(storageKey, newSessionId)
      setSessionId(newSessionId)
    }
  }, [])

  async function loadConversations(userId: string) {
    setLoadingConversations(true)

    try {
      const response = await fetch(
        `/api/conversations?userId=${encodeURIComponent(userId)}`
      )
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error || 'Erro ao carregar conversas.')
      }

      setConversations(data?.conversations || [])
    } catch (err: any) {
      setError(err?.message || 'Erro ao carregar conversas.')
    } finally {
      setLoadingConversations(false)
    }
  }

  useEffect(() => {
    async function loadUser() {
      try {
        const { data, error } = await supabase.auth.getUser()

        if (error || !data.user) {
          setUser(null)
          setAuthChecked(true)
          router.replace('/login')
          return
        }

        const authUser = {
          id: data.user.id,
          email: data.user.email,
        }

        setUser(authUser)
        setAuthChecked(true)
        await loadConversations(authUser.id)
      } catch {
        setUser(null)
        setAuthChecked(true)
        router.replace('/login')
      }
    }

    loadUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_OUT') {
        setUser(null)
        setAuthChecked(true)
        router.replace('/login')
        return
      }

      try {
        const { data, error } = await supabase.auth.getUser()

        if (error || !data.user) {
          setUser(null)
          setAuthChecked(true)
          router.replace('/login')
          return
        }

        const authUser = {
          id: data.user.id,
          email: data.user.email,
        }

        setUser(authUser)
        setAuthChecked(true)
        await loadConversations(authUser.id)
      } catch {
        setUser(null)
        setAuthChecked(true)
        router.replace('/login')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  async function createNewConversation() {
    setConversationId('')
    setMessages([
      {
        role: 'assistant',
        content: 'Olá! Eu sou a Aurora IA. Como posso ajudar você hoje?',
      },
    ])
    setMessage('')
    setError('')
  }

  async function openConversation(selectedConversationId: string) {
    if (!user?.id) {
      return
    }

    try {
      const historyResponse = await fetch('/api/chat/history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          conversationId: selectedConversationId,
        }),
      })

      const historyData = await historyResponse.json()

      if (!historyResponse.ok) {
        throw new Error(historyData?.error || 'Erro ao carregar histórico.')
      }

      setConversationId(selectedConversationId)
      setMessages(
        historyData?.messages?.length
          ? historyData.messages
          : [
              {
                role: 'assistant',
                content: 'Olá! Eu sou a Aurora IA. Como posso ajudar você hoje?',
              },
            ]
      )
      setError('')
    } catch (err: any) {
      setError(err?.message || 'Erro ao abrir conversa.')
    }
  }

  async function sendMessage() {
    const trimmedMessage = message.trim()

    if (!trimmedMessage || loading) {
      return
    }

    if (!user?.id) {
      setError('Usuário não autenticado.')
      router.replace('/login')
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
          userId: user.id,
          sessionId: sessionId || null,
          conversationId: conversationId || null,
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

      const returnedConversationId =
        typeof parsed?.conversationId === 'string'
          ? parsed.conversationId
          : ''

      if (returnedConversationId) {
        setConversationId(returnedConversationId)
      }

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: reply,
        },
      ])

      await loadConversations(user.id)
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

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  function clearChat() {
    setMessage('')
    setError('')
    setConversationId('')
    setMessages([
      {
        role: 'assistant',
        content: 'Olá! Eu sou a Aurora IA. Como posso ajudar você hoje?',
      },
    ])
  }

  if (!authChecked) {
    return (
      <main
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f5f5f5',
          fontFamily: 'Arial, sans-serif',
          padding: 24,
        }}
      >
        <div
          style={{
            background: '#fff',
            border: '1px solid #e5e5e5',
            borderRadius: 14,
            padding: 24,
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            textAlign: 'center',
          }}
        >
          Verificando autenticação...
        </div>
      </main>
    )
  }

  if (!user?.id) {
    return (
      <main
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f5f5f5',
          fontFamily: 'Arial, sans-serif',
          padding: 24,
        }}
      >
        <div
          style={{
            background: '#fff',
            border: '1px solid #e5e5e5',
            borderRadius: 14,
            padding: 24,
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            textAlign: 'center',
          }}
        >
          Redirecionando para o login...
        </div>
      </main>
    )
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
          maxWidth: 1200,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '280px 1fr',
          gap: 16,
        }}
      >
        <aside
          style={{
            background: '#fff',
            border: '1px solid #e5e5e5',
            borderRadius: 14,
            padding: 16,
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            height: 'fit-content',
          }}
        >
          <button
            type="button"
            onClick={createNewConversation}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: '#000',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              marginBottom: 14,
            }}
          >
            Nova conversa
          </button>

          <div style={{ fontWeight: 'bold', marginBottom: 10 }}>
            Histórico
          </div>

          {loadingConversations ? (
            <div style={{ color: '#666', fontSize: 14 }}>Carregando...</div>
          ) : conversations.length === 0 ? (
            <div style={{ color: '#666', fontSize: 14 }}>
              Nenhuma conversa ainda.
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              {conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  type="button"
                  onClick={() => openConversation(conversation.id)}
                  style={{
                    textAlign: 'left',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border:
                      conversation.id === conversationId
                        ? '1px solid #000'
                        : '1px solid #ddd',
                    background:
                      conversation.id === conversationId ? '#f3f3f3' : '#fff',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: '#111',
                      marginBottom: 4,
                    }}
                  >
                    {conversation.title}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: '#666',
                    }}
                  >
                    {new Date(conversation.updated_at).toLocaleString('pt-BR')}
                  </div>
                </button>
              ))}
            </div>
          )}
        </aside>

        <section>
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
                Converse com a Aurora IA em estilo ChatGPT com histórico por usuário.
              </p>
              <p style={{ margin: '8px 0 0 0', color: '#666', fontSize: 14 }}>
                {`Logado como: ${user.email || 'usuário sem e-mail'}`}
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                gap: 10,
                flexWrap: 'wrap',
              }}
            >
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

              <button
                type="button"
                onClick={handleLogout}
                style={{
                  padding: '10px 16px',
                  border: '1px solid #000',
                  borderRadius: 8,
                  background: '#fff',
                  color: '#000',
                  cursor: 'pointer',
                }}
              >
                Sair
              </button>
            </div>
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
                disabled={loading || !sessionId}
                style={{
                  padding: '12px 20px',
                  background: '#000',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading || !sessionId ? 0.7 : 1,
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
                Limpar conversa atual
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  )
}