"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { buildLocationLabel, parseBrazilLocation } from "@/lib/shared/locations";

type Imovel = {
  id: string;
  titulo: string;
  finalidade: "Venda" | "Aluguel";
  tipo: "Casa" | "Apartamento" | "Lote" | "Cobertura" | "Galpão";
  preco: number;
  quartos?: number;
  banheiros?: number;
  vagas?: number;
  area: number;
  descricao: string;
  imagem: string;
  whatsapp: string;
  anunciante: string;
  location: ReturnType<typeof parseBrazilLocation>;
};

const imoveis: Imovel[] = [
  {
    id: "1",
    titulo: "Casa moderna com área gourmet",
    finalidade: "Venda",
    tipo: "Casa",
    preco: 890000,
    quartos: 3,
    banheiros: 3,
    vagas: 2,
    area: 220,
    descricao:
      "Casa moderna com excelente padrão de acabamento, ambientes amplos, área gourmet e ótima localização. Ideal para quem busca conforto, presença e valorização patrimonial.",
    imagem:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1400&q=80",
    whatsapp: "55319997490074",
    anunciante: "Aurora Imóveis BH",
    location: parseBrazilLocation({
      state: "Minas Gerais",
      stateCode: "MG",
      city: "Belo Horizonte",
      municipality: "Belo Horizonte",
      neighborhood: "Pampulha",
    }),
  },
  {
    id: "2",
    titulo: "Apartamento bem localizado e pronto para morar",
    finalidade: "Venda",
    tipo: "Apartamento",
    preco: 420000,
    quartos: 2,
    banheiros: 2,
    vagas: 1,
    area: 78,
    descricao:
      "Apartamento funcional, bem localizado e pronto para morar. Excelente opção para família pequena, investimento ou primeira aquisição.",
    imagem:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=80",
    whatsapp: "55319997490074",
    anunciante: "Aurora Imóveis Lagoa Santa",
    location: parseBrazilLocation({
      state: "Minas Gerais",
      stateCode: "MG",
      city: "Lagoa Santa",
      municipality: "Lagoa Santa",
      neighborhood: "Centro",
    }),
  },
  {
    id: "3",
    titulo: "Cobertura com vista e acabamento premium",
    finalidade: "Venda",
    tipo: "Cobertura",
    preco: 1250000,
    quartos: 4,
    banheiros: 4,
    vagas: 3,
    area: 260,
    descricao:
      "Cobertura diferenciada, com vista privilegiada, acabamento premium e excelente distribuição interna. Imóvel para público exigente.",
    imagem:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&q=80",
    whatsapp: "55319997490074",
    anunciante: "Aurora Prime SP",
    location: parseBrazilLocation({
      state: "São Paulo",
      stateCode: "SP",
      city: "São Paulo",
      municipality: "São Paulo",
      neighborhood: "Moema",
    }),
  },
  {
    id: "4",
    titulo: "Lote com excelente potencial comercial",
    finalidade: "Venda",
    tipo: "Lote",
    preco: 310000,
    area: 360,
    descricao:
      "Lote com excelente potencial comercial e residencial, em região estratégica e com ótimo potencial de valorização.",
    imagem:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80",
    whatsapp: "55319997490074",
    anunciante: "Aurora Imóveis Vespasiano",
    location: parseBrazilLocation({
      state: "Minas Gerais",
      stateCode: "MG",
      city: "Vespasiano",
      municipality: "Vespasiano",
      neighborhood: "Centro",
    }),
  },
  {
    id: "5",
    titulo: "Galpão para operação logística",
    finalidade: "Aluguel",
    tipo: "Galpão",
    preco: 18000,
    banheiros: 2,
    vagas: 6,
    area: 900,
    descricao:
      "Galpão ideal para operação logística, armazenagem e distribuição. Boa área útil, fácil acesso e estrutura pronta para operação.",
    imagem:
      "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1400&q=80",
    whatsapp: "55319997490074",
    anunciante: "Aurora Industrial RJ",
    location: parseBrazilLocation({
      state: "Rio de Janeiro",
      stateCode: "RJ",
      city: "Rio de Janeiro",
      municipality: "Rio de Janeiro",
      neighborhood: "Duque de Caxias",
    }),
  },
  {
    id: "6",
    titulo: "Apartamento compacto para renda ou moradia",
    finalidade: "Aluguel",
    tipo: "Apartamento",
    preco: 2200,
    quartos: 2,
    banheiros: 1,
    vagas: 1,
    area: 54,
    descricao:
      "Apartamento compacto, econômico e interessante tanto para moradia quanto para renda com locação. Bom custo-benefício.",
    imagem:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1400&q=80",
    whatsapp: "55319997490074",
    anunciante: "Aurora Imóveis Pedro Leopoldo",
    location: parseBrazilLocation({
      state: "Minas Gerais",
      stateCode: "MG",
      city: "Pedro Leopoldo",
      municipality: "Pedro Leopoldo",
      neighborhood: "Centro",
    }),
  },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

function extractIdFromSlug(value: string) {
  const [id] = value.split("-");
  return id ?? "";
}

export default function ImovelDetalhePage() {
  const params = useParams();
  const slugParam = String(params?.slug ?? "");
  const id = extractIdFromSlug(slugParam);

  const imovel = imoveis.find((item) => item.id === id);

  if (!imovel) {
    return (
      <main className="min-h-screen bg-black p-4 text-white">
        <div className="mx-auto max-w-4xl rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
          <h1 className="text-2xl font-bold">Imóvel não encontrado</h1>

          <p className="mt-3 text-sm text-zinc-400">
            O imóvel solicitado não foi localizado no momento.
          </p>

          <Link
            href="/imoveis"
            className="mt-6 inline-flex rounded-lg bg-green-500 px-4 py-3 font-bold text-black hover:bg-green-400"
          >
            Voltar para imóveis
          </Link>
        </div>
      </main>
    );
  }

  const local = buildLocationLabel(imovel.location);
  const mensagem = encodeURIComponent(
    `Olá, tenho interesse no imóvel "${imovel.titulo}" anunciado em ${local}.`
  );

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="px-2 py-3 sm:px-3 lg:px-4">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/imoveis"
            className="mb-4 inline-flex rounded-md border border-zinc-800 px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-900"
          >
            ← Voltar para imóveis
          </Link>

          <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
            <div className="h-[220px] w-full overflow-hidden bg-zinc-800 sm:h-[300px] lg:h-[380px]">
              <img
                src={imovel.imagem}
                alt={imovel.titulo}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="grid gap-4 p-4 lg:grid-cols-[1.4fr_0.6fr] lg:p-5">
              <section>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-zinc-700 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-green-400">
                    {imovel.finalidade}
                  </span>

                  <span className="rounded-full border border-zinc-700 px-2.5 py-1 text-[10px] text-zinc-300">
                    {imovel.tipo}
                  </span>
                </div>

                <h1 className="mt-3 text-2xl font-bold sm:text-3xl">
                  {imovel.titulo}
                </h1>

                <p className="mt-2 text-sm text-zinc-400">
                  {local}
                </p>

                <p className="mt-4 text-3xl font-bold text-green-400">
                  {formatCurrency(imovel.preco)}
                </p>

                <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-zinc-300">
                  <span className="rounded-md border border-zinc-700 px-2 py-1">
                    {imovel.area} m²
                  </span>

                  {typeof imovel.quartos === "number" ? (
                    <span className="rounded-md border border-zinc-700 px-2 py-1">
                      {imovel.quartos} quartos
                    </span>
                  ) : null}

                  {typeof imovel.banheiros === "number" ? (
                    <span className="rounded-md border border-zinc-700 px-2 py-1">
                      {imovel.banheiros} banheiros
                    </span>
                  ) : null}

                  {typeof imovel.vagas === "number" ? (
                    <span className="rounded-md border border-zinc-700 px-2 py-1">
                      {imovel.vagas} vagas
                    </span>
                  ) : null}
                </div>

                <div className="mt-6 rounded-xl border border-zinc-800 bg-black/30 p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-500">
                    Descrição
                  </p>

                  <p className="mt-3 text-sm leading-7 text-zinc-300">
                    {imovel.descricao}
                  </p>
                </div>
              </section>

              <aside className="rounded-xl border border-zinc-800 bg-black/40 p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-500">
                  Anunciante
                </p>

                <p className="mt-2 text-base font-semibold">
                  {imovel.anunciante}
                </p>

                <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-500">
                  Contato rápido
                </p>

                <a
                  href={`https://wa.me/${imovel.whatsapp}?text=${mensagem}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex w-full items-center justify-center rounded-lg bg-green-500 px-4 py-3 text-center text-sm font-bold text-black hover:bg-green-400"
                >
                  Falar no WhatsApp
                </a>

                <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-950 p-3">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                    Observação
                  </p>

                  <p className="mt-2 text-xs leading-6 text-zinc-400">
                    Sistema em constante atualização e pode haver momentos de instabilidade.
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}