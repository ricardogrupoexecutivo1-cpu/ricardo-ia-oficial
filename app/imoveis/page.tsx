"use client";

import Link from "next/link";
import {
  buildLocationLabel,
  parseBrazilLocation,
  slugify,
} from "@/lib/shared/locations";

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
  imagem: string;
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
    imagem:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80",
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
    imagem:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
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
    imagem:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
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
    imagem:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
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
    imagem:
      "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1200&q=80",
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
    imagem:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
    location: parseBrazilLocation({
      state: "Minas Gerais",
      stateCode: "MG",
      city: "Pedro Leopoldo",
      municipality: "Pedro Leopoldo",
      neighborhood: "Centro",
    }),
  },
  {
    id: "7",
    titulo: "Casa com quintal e ótima iluminação",
    finalidade: "Venda",
    tipo: "Casa",
    preco: 560000,
    quartos: 3,
    banheiros: 2,
    vagas: 2,
    area: 160,
    imagem:
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80",
    location: parseBrazilLocation({
      state: "Minas Gerais",
      stateCode: "MG",
      city: "Santa Luzia",
      municipality: "Santa Luzia",
      neighborhood: "São Benedito",
    }),
  },
  {
    id: "8",
    titulo: "Apartamento amplo para família",
    finalidade: "Venda",
    tipo: "Apartamento",
    preco: 690000,
    quartos: 3,
    banheiros: 2,
    vagas: 2,
    area: 110,
    imagem:
      "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=1200&q=80",
    location: parseBrazilLocation({
      state: "Paraná",
      stateCode: "PR",
      city: "Curitiba",
      municipality: "Curitiba",
      neighborhood: "Batel",
    }),
  },
  {
    id: "9",
    titulo: "Lote residencial em área de crescimento",
    finalidade: "Venda",
    tipo: "Lote",
    preco: 185000,
    area: 300,
    imagem:
      "https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=1200&q=80",
    location: parseBrazilLocation({
      state: "Goiás",
      stateCode: "GO",
      city: "Goiânia",
      municipality: "Goiânia",
      neighborhood: "Jardim América",
    }),
  },
  {
    id: "10",
    titulo: "Cobertura duplex com terraço",
    finalidade: "Aluguel",
    tipo: "Cobertura",
    preco: 7800,
    quartos: 3,
    banheiros: 3,
    vagas: 2,
    area: 190,
    imagem:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    location: parseBrazilLocation({
      state: "Distrito Federal",
      stateCode: "DF",
      city: "Brasília",
      municipality: "Brasília",
      neighborhood: "Águas Claras",
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

function buildImovelHref(imovel: Imovel) {
  const estado = slugify(imovel.location.state);
  const cidade = slugify(imovel.location.city);
  const titulo = slugify(imovel.titulo);

  return `/imoveis/${estado}/${cidade}/${imovel.id}-${titulo}`;
}

export default function ImoveisPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="px-2 py-3 sm:px-3 lg:px-4">
        <div className="mb-3 border-b border-zinc-800 pb-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-green-400">
            Aurora Imóveis
          </p>

          <h1 className="mt-1 text-lg font-bold sm:text-xl">
            Imóveis no Brasil todo
          </h1>

          <p className="mt-1 text-[11px] text-zinc-400 sm:text-xs">
            Portal independente para venda e aluguel com foco em cidade, estado, município e bairro.
            Sistema em constante atualização e pode haver momentos de instabilidade.
          </p>
        </div>

        <div className="mb-3 grid grid-cols-2 gap-2 md:grid-cols-4">
          <div className="rounded-md border border-zinc-800 bg-zinc-950 p-2.5">
            <p className="text-[9px] uppercase tracking-[0.18em] text-zinc-500">
              Foco
            </p>
            <p className="mt-1 text-[12px] font-semibold">Busca local forte</p>
          </div>

          <div className="rounded-md border border-zinc-800 bg-zinc-950 p-2.5">
            <p className="text-[9px] uppercase tracking-[0.18em] text-zinc-500">
              Cobertura
            </p>
            <p className="mt-1 text-[12px] font-semibold">Brasil todo</p>
          </div>

          <div className="rounded-md border border-zinc-800 bg-zinc-950 p-2.5">
            <p className="text-[9px] uppercase tracking-[0.18em] text-zinc-500">
              Finalidade
            </p>
            <p className="mt-1 text-[12px] font-semibold">Venda e aluguel</p>
          </div>

          <div className="rounded-md border border-zinc-800 bg-zinc-950 p-2.5">
            <p className="text-[9px] uppercase tracking-[0.18em] text-zinc-500">
              Escala
            </p>
            <p className="mt-1 text-[12px] font-semibold">Base pronta</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {imoveis.map((imovel) => {
            const local = buildLocationLabel(imovel.location);

            return (
              <Link
                key={imovel.id}
                href={buildImovelHref(imovel)}
                className="group overflow-hidden rounded-md border border-zinc-800 bg-zinc-950 transition hover:border-green-500/40 hover:bg-zinc-900"
              >
                <div className="h-[78px] w-full overflow-hidden bg-zinc-800 sm:h-[86px] md:h-[92px]">
                  <img
                    src={imovel.imagem}
                    alt={imovel.titulo}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                <div className="p-2">
                  <div className="flex items-center justify-between gap-1">
                    <span className="rounded-full border border-zinc-700 px-1.5 py-0.5 text-[9px] font-semibold text-green-400">
                      {imovel.finalidade}
                    </span>

                    <span className="text-[9px] text-zinc-400">
                      {imovel.tipo}
                    </span>
                  </div>

                  <h2 className="mt-1 line-clamp-2 text-[12px] font-semibold leading-4 text-white">
                    {imovel.titulo}
                  </h2>

                  <p className="mt-1 text-[14px] font-bold text-green-400">
                    {formatCurrency(imovel.preco)}
                  </p>

                  <p className="mt-1 line-clamp-2 text-[10px] leading-4 text-zinc-400">
                    {local}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-1 text-[9px] text-zinc-300">
                    <span className="rounded border border-zinc-700 px-1.5 py-0.5">
                      {imovel.area} m²
                    </span>

                    {typeof imovel.quartos === "number" ? (
                      <span className="rounded border border-zinc-700 px-1.5 py-0.5">
                        {imovel.quartos} qts
                      </span>
                    ) : null}

                    {typeof imovel.banheiros === "number" ? (
                      <span className="rounded border border-zinc-700 px-1.5 py-0.5">
                        {imovel.banheiros} banh.
                      </span>
                    ) : null}

                    {typeof imovel.vagas === "number" ? (
                      <span className="rounded border border-zinc-700 px-1.5 py-0.5">
                        {imovel.vagas} vagas
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-2 inline-flex w-full items-center justify-center rounded-md bg-green-500 px-2 py-1.5 text-[10px] font-bold text-black transition group-hover:bg-green-400">
                    Ver imóvel
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}