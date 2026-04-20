'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'

type EntregaOption = 'propria' | 'transportadora' | 'retirada' | 'a_combinar'

type FormState = {
  nomeLoja: string
  responsavel: string
  email: string
  whatsapp: string
  categoria: string
  cidade: string
  estado: string
  entrega: EntregaOption
  instagram: string
  site: string
  descricao: string
}

const entregaLabels: Record<EntregaOption, string> = {
  propria: 'Entrega própria',
  transportadora: 'Transportadora parceira',
  retirada: 'Retirada no local',
  a_combinar: 'A combinar com o comprador',
}

export default function MarketplaceVendedorCadastroPage() {
  const [isMobile, setIsMobile] = useState(false)
  const [salvou, setSalvou] = useState(false)

  const [form, setForm] = useState<FormState>({
    nomeLoja: '',
    responsavel: '',
    email: '',
    whatsapp: '',
    categoria: '',
    cidade: '',
    estado: '',
    entrega: 'a_combinar',
    instagram: '',
    site: '',
    descricao: '',
  })

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 820)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  function updateField(field: keyof FormState, value: any) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setSalvou(false)
  }

  function salvar() {
    localStorage.setItem('aurora-marketplace-vendedor-cadastro', JSON.stringify(form))
    setSalvou(true)
  }

  const pageStyle: CSSProperties = {
    minHeight: '100vh',
    background: '#f0f9ff',
    padding: 12,
  }

  const card: CSSProperties = {
    background: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    border: '1px solid #e2e8f0'
  }

  const input: CSSProperties = {
    width: '100%',
    height: 42,
    borderRadius: 10,
    border: '1px solid #cbd5f5',
    padding: '0 10px'
  }

  const button: CSSProperties = {
    height: 44,
    borderRadius: 10,
    background: '#06b6d4',
    color: '#fff',
    fontWeight: 700,
    border: 'none',
    cursor: 'pointer'
  }

  return (
    <main style={pageStyle}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        
        <div style={card}>
          <h1>Cadastro do Vendedor</h1>
          <p>Entre gratuitamente. Você só paga quando vender.</p>
        </div>

        <div style={card}>
          <strong>💰 Modelo Aurora</strong>
          <p>Sem mensalidade. Comissão de 5% por venda.</p>
        </div>

        <div style={card}>
          <label>Nome da loja</label>
          <input style={input} onChange={e=>updateField('nomeLoja', e.target.value)} />
        </div>

        <div style={card}>
          <label>Responsável</label>
          <input style={input} onChange={e=>updateField('responsavel', e.target.value)} />
        </div>

        <div style={card}>
          <label>Email</label>
          <input style={input} onChange={e=>updateField('email', e.target.value)} />
        </div>

        <div style={card}>
          <label>WhatsApp</label>
          <input style={input} onChange={e=>updateField('whatsapp', e.target.value)} />
        </div>

        <div style={card}>
          <label>Categoria</label>
          <input style={input} onChange={e=>updateField('categoria', e.target.value)} />
        </div>

        <div style={card}>
          <label>Cidade</label>
          <input style={input} onChange={e=>updateField('cidade', e.target.value)} />
        </div>

        <div style={card}>
          <label>Estado</label>
          <input style={input} onChange={e=>updateField('estado', e.target.value)} />
        </div>

        <div style={card}>
          <label>Entrega</label>
          <select style={input} onChange={e=>updateField('entrega', e.target.value)}>
            <option value="a_combinar">A combinar</option>
            <option value="propria">Própria</option>
            <option value="transportadora">Transportadora</option>
            <option value="retirada">Retirada</option>
          </select>
        </div>

        <div style={card}>
          <label>Instagram</label>
          <input style={input} onChange={e=>updateField('instagram', e.target.value)} />
        </div>

        <div style={card}>
          <label>Site</label>
          <input style={input} onChange={e=>updateField('site', e.target.value)} />
        </div>

        <div style={card}>
          <label>Descrição</label>
          <textarea style={{...input, height:100}} onChange={e=>updateField('descricao', e.target.value)} />
        </div>

        <div style={card}>
          <button style={button} onClick={salvar}>
            Salvar cadastro
          </button>
        </div>

        {salvou && (
          <div style={card}>
            ✅ Cadastro salvo. Agora você pode criar sua vitrine.
          </div>
        )}

        <div style={card}>
          <Link href="/marketplace/vendedor/vitrine">
            Ir para vitrine
          </Link>
        </div>

      </div>
    </main>
  )
}