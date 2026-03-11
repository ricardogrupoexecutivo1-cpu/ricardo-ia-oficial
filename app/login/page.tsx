'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()

  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const cleanEmail = email.trim()
    const cleanPassword = password.trim()

    if (!cleanEmail || !cleanPassword) {
      setError('Preencha e-mail e senha.')
      return
    }

    if (cleanPassword.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPassword,
        })

        if (error) {
          throw error
        }

        setSuccess('Login realizado com sucesso.')
        router.push('/chat')
        router.refresh()
        return
      }

      const { error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: cleanPassword,
      })

      if (error) {
        throw error
      }

      setSuccess(
        'Conta criada com sucesso. Se o Supabase exigir confirmação por e-mail, confirme seu e-mail antes de entrar.'
      )
      setMode('login')
    } catch (err: any) {
      setError(err?.message || 'Erro ao processar login.')
    } finally {
      setLoading(false)
    }
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
          maxWidth: 520,
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
            <h1 style={{ margin: 0, fontSize: 30 }}>
              {mode === 'login' ? 'Login Aurora IA' : 'Criar conta Aurora IA'}
            </h1>
            <p style={{ margin: '8px 0 0 0', color: '#555' }}>
              {mode === 'login'
                ? 'Entre com seu e-mail e senha.'
                : 'Crie sua conta para acessar a Aurora IA.'}
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
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          }}
        >
          <form
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
            }}
          >
            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: 6,
                  fontWeight: 'bold',
                  color: '#222',
                }}
              >
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu e-mail"
                autoComplete="email"
                style={{
                  width: '100%',
                  padding: 12,
                  borderRadius: 8,
                  border: '1px solid #ccc',
                  fontSize: 16,
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: 6,
                  fontWeight: 'bold',
                  color: '#222',
                }}
              >
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha"
                autoComplete={
                  mode === 'login' ? 'current-password' : 'new-password'
                }
                style={{
                  width: '100%',
                  padding: 12,
                  borderRadius: 8,
                  border: '1px solid #ccc',
                  fontSize: 16,
                  boxSizing: 'border-box',
                }}
              />
            </div>

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
                fontSize: 16,
              }}
            >
              {loading
                ? 'Processando...'
                : mode === 'login'
                ? 'Entrar'
                : 'Criar conta'}
            </button>
          </form>

          {error ? (
            <div
              style={{
                marginTop: 16,
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

          {success ? (
            <div
              style={{
                marginTop: 16,
                padding: 14,
                borderRadius: 10,
                background: '#f6ffed',
                border: '1px solid #b7eb8f',
                color: '#135200',
                whiteSpace: 'pre-wrap',
              }}
            >
              <strong>Sucesso:</strong> {success}
            </div>
          ) : null}

          <div
            style={{
              marginTop: 20,
              paddingTop: 16,
              borderTop: '1px solid #eee',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            {mode === 'login' ? (
              <button
                type="button"
                onClick={() => {
                  setMode('signup')
                  setError('')
                  setSuccess('')
                }}
                style={{
                  padding: '12px 20px',
                  background: '#fff',
                  color: '#000',
                  border: '1px solid #000',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontSize: 16,
                }}
              >
                Criar nova conta
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMode('login')
                  setError('')
                  setSuccess('')
                }}
                style={{
                  padding: '12px 20px',
                  background: '#fff',
                  color: '#000',
                  border: '1px solid #000',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontSize: 16,
                }}
              >
                Já tenho conta
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}