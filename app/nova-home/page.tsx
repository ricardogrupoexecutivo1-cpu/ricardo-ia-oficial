'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

type Destino = {
  titulo: string
  descricao: string
  href: string
  tipo: 'interno' | 'externo'
  categoria: 'entrada' | 'produto' | 'gestao' | 'suporte'
  palavras: string[]
  destaque?: boolean
}

const DESTINOS: Destino[] = [
  {
    titulo: 'Cadastro geral',
    descricao:
      'Entrada oficial da Aurora para empresas, profissionais, fornecedores, compradores, parceiros e operações.',
    href: '/cadastro-geral',
    tipo: 'interno',
    categoria: 'entrada',
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
      'registro',
    ],
    destaque: true,
  },
  {
    titulo: 'Buscar empresas',
    descricao:
      'Pesquisa pública segura para encontrar empresas, serviços, fornecedores e oportunidades.',
    href: '/buscar',
    tipo: 'interno',
    categoria: 'entrada',
    palavras: [
      'buscar',
      'busca',
      'pesquisar',
      'pesquisa',
      'empresa',
      'empresas',
      'servico',
      'serviço',
      'fornecedor',
      'fornecedores',
      'encontrar',
    ],
    destaque: true,
  },
  {
    titulo: 'Guardião',
    descricao:
      'Auditoria e gestão da camada pública segura dos cadastros.',
    href: '/guardiao',
    tipo: 'interno',
    categoria: 'gestao',
    palavras: [
      'guardiao',
      'guardião',
      'auditoria',
      'perfil',
      'perfis',
      'publico',
      'público',
      'camada pública',
      'camada publica',
      'validacao',
      'validação',
    ],
  },
  {
    titulo: 'App Builder',
    descricao:
      'Área estratégica para geração de módulos, aplicativos e evolução dos projetos.',
    href: '/app-builder',
    tipo: 'interno',
    categoria: 'gestao',
    palavras: [
      'app',
      'app builder',
      'builder',
      'aplicativo',
      'aplicativos',
      'modulo',
      'módulo',
      'sistema',
      'software',
      'gerar app',
      'criar app',
    ],
  },
  {
    titulo: 'Financeiro',
    descricao:
      'Gestão empresarial com lançamentos, leitura privada, contas e relatórios.',
    href: '/financeiro',
    tipo: 'interno',
    categoria: 'gestao',
    palavras: [
      'financeiro',
      'financas',
      'finanças',
      'caixa',
      'contas',
      'despesas',
      'receitas',
      'dre',
      'lancamentos',
      'lançamentos',
      'relatorios',
      'relatórios',
    ],
  },
  {
    titulo: 'Locadoras',
    descricao:
      'Entrada para frota, propostas, veículos e operação do segmento de locadoras.',
    href: '/locadora',
    tipo: 'interno',
    categoria: 'produto',
    palavras: [
      'locadora',
      'locadoras',
      'veiculos',
      'veículos',
      'frota',
      'seminovos',
      'rental',
      'carros',
      'automoveis',
      'automóveis',
    ],
  },
  {
    titulo: 'Imóveis',
    descricao:
      'Área do segmento imobiliário para captação, divulgação e oportunidades.',
    href: '/imoveis',
    tipo: 'interno',
    categoria: 'produto',
    palavras: [
      'imoveis',
      'imóveis',
      'imobiliaria',
      'imobiliária',
      'apartamento',
      'casa',
      'terreno',
      'aluguel',
      'venda',
    ],
  },
  {
    titulo: 'Bancos',
    descricao:
      'Canal para crédito, financiamento, seguro e relacionamento com parceiros financeiros.',
    href: '/bancos',
    tipo: 'interno',
    categoria: 'produto',
    palavras: [
      'banco',
      'bancos',
      'credito',
      'crédito',
      'financiamento',
      'financiar',
      'seguro',
      'seguros',
      'financeira',
    ],
  },
  {
    titulo: 'AGRO',
    descricao:
      'Segmento para produtores, fazendas, insumos, máquinas e negócios rurais.',
    href: '/agro',
    tipo: 'interno',
    categoria: 'produto',
    palavras: [
      'agro',
      'agronegocio',
      'agronegócio',
      'fazenda',
      'produtor',
      'rural',
      'insumos',
      'gado',
      'plantio',
      'maquinas',
      'máquinas',
    ],
  },
  {
    titulo: 'Mineração',
    descricao:
      'Entrada para mineração, indústria, fornecedores e expansão do setor mineral.',
    href: '/mineracao',
    tipo: 'interno',
    categoria: 'produto',
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
    descricao:
      'Canal de ajuda para quem ainda não sabe qual caminho seguir na plataforma.',
    href: '/chat',
    tipo: 'interno',
    categoria: 'suporte',
    palavras: [
      'chat',
      'ajuda',
      'suporte',
      'duvida',
      'dúvida',
      'orientacao',
      'orientação',
      'aurora responde',
      'atendimento',
    ],
    destaque: true,
  },
  {
    titulo: 'Aurora Motoristas',
    descricao:
      'Aplicativo independente para operação, serviços, motoristas, clientes e controle interno.',
    href: 'https://appmotoristas.com.br',
    tipo: 'externo',
    categoria: 'produto',
    palavras: [
      'motorista',
      'motoristas',
      'translado',
      'transfer',
      'servicos',
      'serviços',
      'condutor',
      'corrida',
      'viagem',
    ],
    destaque: true,
  },
  {
    titulo: 'Seminovos Locadoras',
    descricao:
      'Plataforma estratégica para veículos, vendas, locadoras e rede comercial.',
    href: 'https://seminovoslocadoras.com.br',
    tipo: 'externo',
    categoria: 'produto',
    palavras: [
      'seminovos',
      'veiculos',
      'veículos',
      'locadoras',
      'venda',
      'carros',
      'automoveis',
      'automóveis',
    ],
    destaque: true,
  },
  {
    titulo: 'Ricardo IA Oficial',
    descricao:
      'Portal principal do ecossistema empresarial com IA e entrada para os módulos centrais.',
    href: 'https://ricardoiaoficial.com',
    tipo: 'externo',
    categoria: 'entrada',
    palavras: [
      'ricardo ia',
      'ricardoia',
      'portal',
      'site principal',
      'home',
      'ecossistema',
      'ia',
      'inteligencia artificial',
      'inteligência artificial',
    ],
    destaque: true,
  },
]

function normalizarTexto(valor: string) {
  return valor
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

function pontuarDestino(busca: string, destino: Destino) {
  const textoBusca = normalizarTexto(busca)
  if (!textoBusca) return destino.destaque ? 50 : 10

  let pontos = 0
  const titulo = normalizarTexto(destino.titulo)
  const descricao = normalizarTexto(destino.descricao)

  if (titulo.includes(textoBusca)) pontos += 15
  if (descricao.includes(textoBusca)) pontos += 6

  for (const palavra of destino.palavras) {
    const palavraNormalizada = normalizarTexto(palavra)
    if (palavraNormalizada === textoBusca) pontos += 20
    else if (palavraNormalizada.includes(textoBusca)) pontos += 10
    else if (textoBusca.includes(palavraNormalizada)) pontos += 8
  }

  if (destino.destaque) pontos += 2
  return pontos
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

function LinkDestino({
  destino,
  className,
  children,
}: {
  destino: Destino
  className?: string
  children: React.ReactNode
}) {
  if (destino.tipo === 'externo') {
    return (
      <a
        href={destino.href}
        target="_blank"
        rel="noreferrer"
        className={className}
      >
        {children}
      </a>
    )
  }

  return (
    <Link href={destino.href} className={className}>
      {children}
    </Link>
  )
}

export default function NovaHomeAuroraPage() {
  const [busca, setBusca] = useState('')

  const resultados = useMemo(() => {
    return [...DESTINOS]
      .map((destino) => ({
        destino,
        pontos: pontuarDestino(busca, destino),
      }))
      .filter((item) => item.pontos > 0)
      .sort((a, b) => b.pontos - a.pontos)
      .slice(0, busca ? 8 : 6)
      .map((item) => item.destino)
  }, [busca])

  const entradas = DESTINOS.filter((item) => item.categoria === 'entrada')
  const produtos = DESTINOS.filter((item) => item.categoria === 'produto')
  const gestao = DESTINOS.filter((item) => item.categoria === 'gestao')
  const suporte = DESTINOS.filter((item) => item.categoria === 'suporte')

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#ecfeff_0%,#f8fbff_28%,#eef8ff_100%)] text-slate-900">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="overflow-hidden rounded-[32px] border border-cyan-100 bg-white/90 shadow-[0_30px_120px_rgba(14,116,144,0.12)] backdrop-blur">
          <div className="bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.15),transparent_35%)] px-5 py-6 sm:px-8 sm:py-8">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
              <div className="max-w-4xl">
                <span className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.22em] text-cyan-700">
                  Nova home independente
                </span>

                <h1 className="mt-4 text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                  Entrada inteligente da Aurora
                </h1>

                <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
                  Esta nova home foi criada para facilitar a vida de todos os usuários.
                  Em vez de cair direto no cadastro geral e se perder, a pessoa pode
                  pesquisar, entender o caminho certo e entrar no produto ideal com mais
                  clareza, rapidez e segurança.
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5"
                  >
                    Voltar à home atual
                  </Link>

                  <Link
                    href="/cadastro-geral"
                    className="inline-flex items-center justify-center rounded-2xl bg-cyan-600 px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5"
                  >
                    Entrada oficial: cadastro geral
                  </Link>

                  <Link
                    href="/buscar"
                    className="inline-flex items-center justify-center rounded-2xl border border-cyan-200 bg-cyan-50 px-5 py-3 text-sm font-bold text-cyan-700 transition hover:-translate-y-0.5"
                  >
                    Buscar empresas
                  </Link>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:w-[360px]">
                {[
                  { rotulo: 'Objetivo', valor: 'Entrada clara' },
                  { rotulo: 'Estratégia', valor: 'Direcionar antes de cadastrar' },
                  { rotulo: 'Privacidade', valor: 'Camada pública segura' },
                  { rotulo: 'Expansão', valor: 'Produtos integrados' },
                ].map((item) => (
                  <div
                    key={item.rotulo}
                    className="rounded-[24px] border border-white/80 bg-white/85 p-4 shadow-sm"
                  >
                    <div className="text-xs font-extrabold uppercase tracking-[0.18em] text-cyan-700">
                      {item.rotulo}
                    </div>
                    <div className="mt-2 text-sm font-bold text-slate-900">
                      {item.valor}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <section className="overflow-hidden rounded-[32px] border border-cyan-100 bg-white/92 p-5 shadow-[0_25px_80px_rgba(14,116,144,0.10)] sm:p-7">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <span className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.22em] text-cyan-700">
                Pesquisa de direção
              </span>

              <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                Para onde você quer ir?
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
                Digite o que você quer fazer e esta página ajuda a direcionar para a
                área correta da Aurora ou para um dos produtos conectados.
              </p>
            </div>

            <div className="rounded-[24px] border border-amber-200 bg-amber-50 px-4 py-4 text-sm leading-6 text-amber-900 xl:max-w-md">
              <strong className="block font-extrabold">Importante</strong>
              Sistema em constante atualização e pode haver momentos de instabilidade.
              Esta página foi criada justamente para reduzir confusão e facilitar a entrada.
            </div>
          </div>

          <div className="mt-6">
            <label
              htmlFor="busca-aurora"
              className="mb-2 block text-sm font-bold text-slate-700"
            >
              Exemplo: cadastrar empresa, buscar fornecedor, entrar no financeiro, locadora, motoristas, app, agro...
            </label>

            <input
              id="busca-aurora"
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Digite aqui o que você quer fazer"
              className="w-full rounded-[24px] border border-cyan-200 bg-white px-5 py-4 text-base text-slate-900 outline-none ring-0 transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {[
              'Cadastro geral',
              'Buscar empresas',
              'Financeiro',
              'Locadoras',
              'AGRO',
              'Motoristas',
              'App Builder',
              'Chat Aurora',
            ].map((sugestao) => (
              <button
                key={sugestao}
                type="button"
                onClick={() => setBusca(sugestao)}
                className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-2 text-sm font-semibold text-cyan-700 transition hover:border-cyan-300 hover:bg-cyan-100"
              >
                {sugestao}
              </button>
            ))}
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {resultados.map((destino) => (
              <LinkDestino
                key={`${destino.titulo}-${destino.href}`}
                destino={destino}
                className="group rounded-[28px] border border-slate-100 bg-slate-50/70 p-5 shadow-sm transition hover:-translate-y-1 hover:border-cyan-200 hover:bg-white hover:shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-lg font-black text-slate-900">
                      {destino.titulo}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {destino.descricao}
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full border border-cyan-200 bg-white px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em] text-cyan-700">
                    Abrir
                  </span>
                </div>

                <div className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                  {destino.tipo === 'externo' ? 'Produto externo' : 'Área interna'}
                </div>
              </LinkDestino>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[32px] border border-cyan-100 bg-white/92 p-5 shadow-[0_20px_70px_rgba(14,116,144,0.08)] sm:p-6">
            <div className="mb-4">
              <span className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.22em] text-cyan-700">
                Entrada principal
              </span>
              <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950">
                Comece pelo caminho certo
              </h2>
            </div>

            <div className="grid gap-4">
              {entradas.map((destino) => (
                <LinkDestino
                  key={destino.titulo}
                  destino={destino}
                  className="rounded-[24px] border border-slate-100 bg-slate-50/80 p-5 transition hover:-translate-y-0.5 hover:border-cyan-200 hover:bg-white"
                >
                  <div className="text-lg font-black text-slate-900">
                    {destino.titulo}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {destino.descricao}
                  </p>
                </LinkDestino>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-cyan-100 bg-white/92 p-5 shadow-[0_20px_70px_rgba(14,116,144,0.08)] sm:p-6">
            <div className="mb-4">
              <span className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.22em] text-cyan-700">
                Gestão e inteligência
              </span>
              <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950">
                Áreas de gestão
              </h2>
            </div>

            <div className="grid gap-4">
              {gestao.map((destino) => (
                <LinkDestino
                  key={destino.titulo}
                  destino={destino}
                  className="rounded-[24px] border border-slate-100 bg-slate-50/80 p-5 transition hover:-translate-y-0.5 hover:border-cyan-200 hover:bg-white"
                >
                  <div className="text-lg font-black text-slate-900">
                    {destino.titulo}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {destino.descricao}
                  </p>
                </LinkDestino>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[32px] border border-cyan-100 bg-white/92 p-5 shadow-[0_20px_70px_rgba(14,116,144,0.08)] sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-3xl">
              <span className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.22em] text-cyan-700">
                Produtos conectados
              </span>
              <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                Ecossistema Aurora
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
                Aqui ficam os produtos e segmentos conectados. Esta área ajuda o usuário
                a entender rapidamente o que existe e para onde deve seguir.
              </p>
            </div>

            <Link
              href="/chat"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5"
            >
              Ainda está em dúvida? Ir para o Chat Aurora
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {produtos.map((destino) => (
              <LinkDestino
                key={destino.titulo}
                destino={destino}
                className={cx(
                  'rounded-[28px] border p-5 transition hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(15,23,42,0.08)]',
                  destino.tipo === 'externo'
                    ? 'border-cyan-200 bg-cyan-50/70 hover:bg-white'
                    : 'border-slate-100 bg-slate-50/80 hover:border-cyan-200 hover:bg-white'
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-lg font-black text-slate-900">
                      {destino.titulo}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {destino.descricao}
                    </p>
                  </div>

                  <span
                    className={cx(
                      'rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em]',
                      destino.tipo === 'externo'
                        ? 'border border-cyan-300 bg-white text-cyan-700'
                        : 'border border-slate-200 bg-white text-slate-600'
                    )}
                  >
                    {destino.tipo === 'externo' ? 'Site' : 'Abrir'}
                  </span>
                </div>
              </LinkDestino>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
          <div className="rounded-[32px] border border-cyan-100 bg-white/92 p-5 shadow-[0_20px_70px_rgba(14,116,144,0.08)] sm:p-6">
            <span className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.22em] text-cyan-700">
              Fluxo recomendado
            </span>

            <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950">
              Como usar sem se perder
            </h2>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {[
                {
                  passo: '1',
                  titulo: 'Entenda seu objetivo',
                  texto:
                    'Primeiro a pessoa define se quer cadastrar, buscar, operar, contratar ou entrar em um produto específico.',
                },
                {
                  passo: '2',
                  titulo: 'Pesquise ou escolha um botão',
                  texto:
                    'A nova home reduz o risco de cair no lugar errado. A entrada fica mais clara e mais rápida.',
                },
                {
                  passo: '3',
                  titulo: 'Entre no caminho certo',
                  texto:
                    'Depois disso a pessoa segue para o cadastro geral, busca pública, gestão ou produto ideal.',
                },
              ].map((item) => (
                <div
                  key={item.passo}
                  className="rounded-[24px] border border-slate-100 bg-slate-50/70 p-5"
                >
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-cyan-600 text-sm font-black text-white">
                    {item.passo}
                  </div>
                  <div className="mt-4 text-lg font-black text-slate-900">
                    {item.titulo}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {item.texto}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-cyan-100 bg-white/92 p-5 shadow-[0_20px_70px_rgba(14,116,144,0.08)] sm:p-6">
            <span className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.22em] text-cyan-700">
              Suporte
            </span>

            <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950">
              Ajuda imediata
            </h2>

            <div className="mt-5 grid gap-4">
              {suporte.map((destino) => (
                <LinkDestino
                  key={destino.titulo}
                  destino={destino}
                  className="rounded-[24px] border border-slate-100 bg-slate-50/80 p-5 transition hover:-translate-y-0.5 hover:border-cyan-200 hover:bg-white"
                >
                  <div className="text-lg font-black text-slate-900">
                    {destino.titulo}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {destino.descricao}
                  </p>
                </LinkDestino>
              ))}

              <div className="rounded-[24px] border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
                <strong className="block font-extrabold">Observação</strong>
                Esta home nova é uma camada de organização. A ideia é facilitar o uso
                antes de substituir qualquer rota principal.
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  )
}