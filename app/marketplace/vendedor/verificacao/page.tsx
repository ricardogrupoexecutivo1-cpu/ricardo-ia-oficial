'use client'

import { useState } from 'react'

export default function VerificacaoVendedor() {
  const [form, setForm] = useState({
    nome: '',
    documento: '',
    telefone: '',
    pix: '',
    aceite: false,
  })

  function salvar() {
    if (!form.nome || !form.documento || !form.telefone || !form.pix) {
      alert('Preencha todos os campos')
      return
    }

    if (!form.aceite) {
      alert('Você precisa aceitar os termos')
      return
    }

    localStorage.setItem(
      'aurora_vendedor_verificacao',
      JSON.stringify({
        ...form,
        status: 'em_analise',
        criadoEm: new Date().toISOString(),
      })
    )

    alert('Verificação enviada com sucesso!')
  }

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <h1 style={styles.title}>Verificação do Vendedor</h1>

        <p style={styles.subtitle}>
          Para vender no Aurora Marketplace, valide sua identidade e dados de recebimento.
        </p>

        <div style={styles.form}>
          <input
            placeholder="Nome completo ou razão social"
            style={styles.input}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
          />

          <input
            placeholder="CPF ou CNPJ"
            style={styles.input}
            onChange={(e) => setForm({ ...form, documento: e.target.value })}
          />

          <input
            placeholder="Telefone"
            style={styles.input}
            onChange={(e) => setForm({ ...form, telefone: e.target.value })}
          />

          <input
            placeholder="Chave PIX"
            style={styles.input}
            onChange={(e) => setForm({ ...form, pix: e.target.value })}
          />

          <label style={styles.checkbox}>
            <input
              type="checkbox"
              onChange={(e) =>
                setForm({ ...form, aceite: e.target.checked })
              }
            />
            Aceito os termos e responsabilidades da plataforma
          </label>

          <button style={styles.button} onClick={salvar}>
            Enviar verificação
          </button>
        </div>
      </section>
    </main>
  )
}

const styles: any = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg,#eef8ff,#ffffff)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    background: '#fff',
    borderRadius: 20,
    padding: 24,
    boxShadow: '0 20px 50px rgba(0,0,0,0.08)',
    border: '1px solid rgba(0,0,0,0.05)',
  },
  title: {
    fontSize: 24,
    fontWeight: 800,
    marginBottom: 8,
    color: '#082f49',
  },
  subtitle: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 20,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  input: {
    padding: 12,
    borderRadius: 10,
    border: '1px solid #e2e8f0',
    fontSize: 14,
  },
  checkbox: {
    fontSize: 13,
    display: 'flex',
    gap: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  button: {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    border: 'none',
    background: 'linear-gradient(135deg,#22d3ee,#0ea5e9)',
    color: '#fff',
    fontWeight: 700,
    cursor: 'pointer',
  },
}