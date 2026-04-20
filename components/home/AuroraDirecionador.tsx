'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

type Destino = {
  titulo: string
  descricao: string
  href: string
  palavras: string[]
  destaque?: boolean
}

const DESTINOS: Destino[] = [
  {
    titulo: 'Cadastro geral',
    descricao: 'Entrada oficial para empresas, profissionais, fornecedores, compradores, parceiros e operações.',
    href: '/cadastro-geral',
    palavras: [
      'cadastro',
      'cadastro geral',
      'cadastrar',
      'empresa',
      'profissional',
      'fornecedor',
      'comprador',
      'parceiro',
      'operacao',
      'operação',
      'entrada',
      'registrar',
      'registro',
    ],
    destaque: true,
  },
  {
    titulo: 'Buscar empresas',
    descricao: 'Pesquisa pública segura para encontrar empresas, serviços, fornecedores e oportunidades.',
    href: '/buscar',
    palavras: [
      'buscar',
      'busca',
      'empresas',
      'procurar',
      'fornecedor',
      'fornecedores',
      'servico',
      'serviço',
      'servicos',
      'serviços',
      'encontrar',
      'pesquisa',
      'pesquisar',
    ],
    destaque: true,
  },
  {
    titulo: 'Guardião',
    descricao: 'Auditoria e gestão da camada pública segura dos cadastros.',
    href: '/guardiao',
    palavras: [
      'guardiao',
      'guardião',
      'auditoria',
      'auditar',
      'perfil',
      'perfis',
      'camada publica',
      'camada pública',
      'publico',
      'público',
      'validacao',
      'validação',
    ],
  },
  {
    titulo: 'App Builder',
    descricao: 'Área para estruturação, geração e evolução de aplicativos e módulos.',
    href: '/app-builder',
    palavras: [
      'app builder',
      'builder',
      'app',
      'aplicativo',
      'aplicativos',
      'modulo',
      'módulo',
      'modulos',
      'módulos',
      'gerar app',
      'criar app',
      'software',
    ],
  },
  {
    titulo: 'Financeiro',
    descricao: 'Gestão financeira empresarial com visão privada, lançamentos e relatórios.',
    href: '/financeiro',
    palavras: [
      'financeiro',
      'financas',
      'finanças',
      'contas',
      'caixa',
      'relatorios',
      'relatórios',
      'lancamentos',
      'lançamentos',
      'dre',
      'despesas',
      'receitas',
    ],
  },
  {
    titulo: 'Locadoras',
    descricao: 'Área comercial e operacional para locadoras, frota, propostas e negócios.',
    href: '/locadora',
    palavras: [
      'locadora',
      'locadoras',
      'frota',
      'veiculos',
      'veículos',
      'seminovos',
      'carros',
      'aluguel',
      'rental',
    ],
  },
  {
    titulo: 'Imóveis',
    descricao: 'Entrada para operações, captação e expansão do segmento imobiliário.',
    href: '/imoveis',
    palavras: [
      'imoveis',
      'imóveis',
      'imobiliaria',
      'imobiliária',
      'casa',
      'apartamento',
      'terreno',
      'aluguel',
      'venda de imovel',
      'venda de imóvel',
    ],
  },
  {
    titulo: 'Bancos',
    descricao: 'Área estratégica para crédito, financiamento, seguros e parceiros financeiros.',
    href: '/bancos',
    palavras: [
      'banco',
      'bancos',
      'credito',
      'crédito',
      'financiamento',
      'financiar',
      'seguro',
      'seguros',
      'parceiro financeiro',
    ],
  },
  {
    titulo: 'AGRO',
    descricao: 'Segmento preparado para produtores, fornecedores, máquinas, insumos e negócios rurais.',
    href: '/agro',
    palavras: [
      'agro',
      'agronegocio',
      'agronegócio',
      'fazenda',
      'produtor',
      'rural',
      'insumos',
      'maquinas',
      'máquinas',
      'gado',
      'plantio',
    ],
  },
  {
    titulo: 'Mineração',
    descricao: 'Entrada para operações, fornecedores, indústria e oportunidades do setor mineral.',
    href: '/mineracao',
    palavras: [
      'mineracao',
      'mineração',
      'mina',
      'minerio',
      'minério',
      'industrial',
      'fornecedor industrial',
      'exploracao',
      'exploração',
    ],
  },
  {
    titulo: 'Chat Aurora',
    descricao: 'Canal para orientação, apoio e navegação assistida dentro do ecossistema.',
    href: '/chat',
    palavras: [
      'chat',
      'aurora responde',
      'ajuda',
      'suporte',
      'duvida',
      'dúvida',
      'atendimento',
      'orientacao',
      'orientação',
    ],
  },
  {
    titulo: 'Planos',
    descricao: 'Página de planos, expansão comercial e evolução da contratação.',
    href: '/planos',
    palavras: [
      'plano',
      'planos',
      'assinatura',
      'preco',
      'preço',
      'contratar',
      'premium',
      'upgrade',
    ],
  },
]

function normalizarTexto(valor: string) {
  return valor
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

function encontrarMelhoresDestinos(termo: string) {
  const busca = normalizarTexto(termo)

  if (!busca) {
    return DESTINOS.filter((item) => item.destaque).concat(
      DESTINOS.filter((item) => !item.destaque).slice(0, 4)
    )
  }

  const pontuados = DESTINOS.map((item) => {
    const titulo = normalizarTexto(item.titulo)
    const descricao = normalizarTexto(item.descricao)

    let pontos = 0

    if (titulo.includes(busca)) pontos += 10
    if (descricao.includes(busca)) pontos += 4

    for (const palavra of item.palavras) {
      const palavraNormalizada = normalizarTexto(palavra)

      if (palavraNormalizada === busca) pontos += 12
      else if (palavraNormalizada.includes(busca)) pontos += 7
      else if (busca.includes(palavraNormalizada)) pontos += 5
    }

    return { ...item, pontos }
  })

  const encontrados = pontuados
    .filter((item) => item.pontos > 0)
    .sort((a, b) => b.pontos - a.pontos)

  if (encontrados.length > 0) {
    return encontrados.slice(0, 6)
  }

  return [
    {
      titulo: 'Cadastro geral',
      descricao: 'Se ainda estiver em dúvida, entre pela base oficial da plataforma.',
      href: '/cadastro-geral',
      palavras: [],
      destaque: true,
    },
    {
      titulo: 'Buscar empresas',
      descricao: 'Ou procure empresas, serviços e oportunidades na busca pública segura.',
      href: '/buscar',
      palavras: [],
      destaque: true,
    },
    {
      titulo: 'Chat Aurora',
      descricao: 'Se quiser orientação, entre no chat para ser direcionado com mais clareza.',
      href: '/chat',
      palavras: [],
      destaque: true,
    },
  ]
}

export default function AuroraDirecionador() {
  const router = useRouter()
  const [termo, setTermo] = useState('')
  const [tentouBuscar, setTentouBuscar] = useState(false)

  const resultados = useMemo(() => encontrarMelhoresDestinos(termo), [termo])

  function irParaMelhorDestino() {
    setTentouBuscar(true)
    const melhor = resultados[0]

    if (melhor?.href) {
      router.push(melhor.href)
    }
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    irParaMelhorDestino()
  }

  return (
    <section className="relative overflow-hidden rounded-[28px] border border-cyan-200/70 bg-white/95 p-5 shadow-[0_20px_80px_rgba(8,145,178,0.12)] backdrop-blur md:p-7">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.14),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.12),transparent_35%)]" />

      <div className="relative z-10">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="max-w-3xl">
            <span className="inline-flex w-fit rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
              Entrada guiada
            </span>

            <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-900 md:text-3xl">
              Para onde você quer ir na Aurora?
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
              Digite o que você procura e o sistema direciona você para a área mais adequada,
              evitando que a pessoa entre no lugar errado e desista no meio do caminho.
            </p>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 shadow-sm md:max-w-sm">
            <strong className="block text-sm font-extrabold">Acesso facilitado</strong>
            <span className="mt-1 block leading-5">
              Sistema em constante atualização e pode haver momentos de instabilidade.
            </span>
          </div>
        </div>

        <form onSubmit={onSubmit} className="mt-6">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="flex-1">
              <label htmlFor="direcionador-aurora" className="mb-2 block text-sm font-semibold text-slate-700">
                Exemplo: quero cadastrar minha empresa, buscar fornecedor, entrar no financeiro, locadora, agro...
              </label>

              <input
                id="direcionador-aurora"
                type="text"
                value={termo}
                onChange={(e) => {
                  setTermo(e.target.value)
                  if (tentouBuscar) setTentouBuscar(false)
                }}
                placeholder="Digite aqui o que você quer fazer na plataforma"
                className="w-full rounded-2xl border border-cyan-200 bg-white px-4 py-4 text-base text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
              />
            </div>

            <div className="flex w-full flex-col gap-3 md:w-auto md:min-w-[220px] md:justify-end">
              <button
                type="submit"
                className="inline-flex min-h-[56px] items-center justify-center rounded-2xl bg-cyan-600 px-5 py-3 text-base font-bold text-white shadow-lg transition hover:-translate-y-0.5"
              >
                Direcionar agora
              </button>

              <button
                type="button"
                onClick={() => router.push('/chat')}
                className="inline-flex min-h-[56px] items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-base font-bold text-slate-700 transition hover:-translate-y-0.5"
              >
                Preciso de ajuda
              </button>
            </div>
          </div>
        </form>

        <div className="mt-4 flex flex-wrap gap-2">
          {[
            { label: 'Cadastrar empresa', href: '/cadastro-geral' },
            { label: 'Buscar empresas', href: '/buscar' },
            { label: 'Financeiro', href: '/financeiro' },
            { label: 'Locadoras', href: '/locadora' },
            { label: 'App Builder', href: '/app-builder' },
            { label: 'Guardião', href: '/guardiao' },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => router.push(item.href)}
              className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-2 text-sm font-semibold text-cyan-700 transition hover:border-cyan-300 hover:bg-cyan-100"
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-[24px] border border-slate-200 bg-slate-50/80 p-4 md:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 md:text-lg">
                Sugestões de destino
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                {termo
                  ? 'Resultados encontrados para a sua busca.'
                  : 'Opções rápidas para facilitar a entrada na plataforma.'}
              </p>
            </div>

            {tentouBuscar && termo && (
              <span className="rounded-full border border-cyan-200 bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-cyan-700">
                Direcionamento ativo
              </span>
            )}
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {resultados.map((item) => (
              <button
                key={`${item.titulo}-${item.href}`}
                type="button"
                onClick={() => router.push(item.href)}
                className="group rounded-[24px] border border-white bg-white p-4 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-[0_16px_50px_rgba(15,23,42,0.10)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-base font-black text-slate-900">
                      {item.titulo}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {item.descricao}
                    </p>
                  </div>

                  <span className="rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.16em] text-cyan-700">
                    Abrir
                  </span>
                </div>
              </button>
            ))}
          </div>

          {termo && resultados.length === 0 && (
            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              Não encontramos um caminho claro para essa busca. Tente termos como:
              <strong> cadastro, fornecedor, financeiro, locadora, agro, imóveis, bancos ou chat.</strong>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}