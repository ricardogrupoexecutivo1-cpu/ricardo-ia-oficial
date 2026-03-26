"use client";

import Link from "next/link";

type Veiculo = {
  id: string;
  slug: string;
  nome: string;
  preco: number;
  cidade: string;
  ano: string;
  imagem: string;
  cambio: string;
  combustivel: string;
};

const veiculos: Veiculo[] = [
  {
    id: "1",
    slug: "seminovos-raja",
    nome: "Toyota Hilux",
    preco: 180000,
    cidade: "Belo Horizonte",
    ano: "2022",
    cambio: "Automático",
    combustivel: "Diesel",
    imagem:
      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "2",
    slug: "aurora-motors",
    nome: "Jeep Compass",
    preco: 150000,
    cidade: "Lagoa Santa",
    ano: "2023",
    cambio: "Automático",
    combustivel: "Flex",
    imagem:
      "https://images.unsplash.com/photo-1494976688153-c85f95c5f258?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "3",
    slug: "seminovos-raja",
    nome: "Chevrolet Onix",
    preco: 78900,
    cidade: "Contagem",
    ano: "2021",
    cambio: "Manual",
    combustivel: "Flex",
    imagem:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "4",
    slug: "aurora-motors",
    nome: "Volkswagen T-Cross",
    preco: 119900,
    cidade: "Betim",
    ano: "2022",
    cambio: "Automático",
    combustivel: "Flex",
    imagem:
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "5",
    slug: "seminovos-raja",
    nome: "Fiat Toro",
    preco: 132900,
    cidade: "Belo Horizonte",
    ano: "2021",
    cambio: "Automático",
    combustivel: "Diesel",
    imagem:
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "6",
    slug: "aurora-motors",
    nome: "Hyundai Creta",
    preco: 124900,
    cidade: "Pedro Leopoldo",
    ano: "2023",
    cambio: "Automático",
    combustivel: "Flex",
    imagem:
      "https://images.unsplash.com/photo-1502161254066-6c74afbf07aa?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "7",
    slug: "seminovos-raja",
    nome: "Renault Kwid",
    preco: 55900,
    cidade: "Vespasiano",
    ano: "2020",
    cambio: "Manual",
    combustivel: "Flex",
    imagem:
      "https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "8",
    slug: "aurora-motors",
    nome: "Toyota Corolla",
    preco: 139900,
    cidade: "Sete Lagoas",
    ano: "2022",
    cambio: "Automático",
    combustivel: "Flex",
    imagem:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "9",
    slug: "seminovos-raja",
    nome: "Honda HR-V",
    preco: 128900,
    cidade: "Santa Luzia",
    ano: "2022",
    cambio: "Automático",
    combustivel: "Flex",
    imagem:
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "10",
    slug: "aurora-motors",
    nome: "Nissan Kicks",
    preco: 112900,
    cidade: "Venda Nova",
    ano: "2021",
    cambio: "Automático",
    combustivel: "Flex",
    imagem:
      "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "11",
    slug: "seminovos-raja",
    nome: "Ford Ranger",
    preco: 169900,
    cidade: "BH",
    ano: "2022",
    cambio: "Automático",
    combustivel: "Diesel",
    imagem:
      "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "12",
    slug: "aurora-motors",
    nome: "Fiat Argo",
    preco: 69900,
    cidade: "Confins",
    ano: "2021",
    cambio: "Manual",
    combustivel: "Flex",
    imagem:
      "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=800&q=80",
  },
];

export default function LocadoraPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="px-2 py-3 sm:px-3 lg:px-4">
        <div className="mb-3 border-b border-zinc-800 pb-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-green-400">
            Aurora Locadora
          </p>

          <h1 className="mt-1 text-lg font-bold sm:text-xl">
            Vitrine de veículos
          </h1>

          <p className="mt-1 text-[11px] text-zinc-400 sm:text-xs">
            Escolha um veículo para ver detalhes. Sistema em constante atualização e pode haver momentos de instabilidade.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {veiculos.map((v) => (
            <Link
              key={v.id}
              href={`/locadora/${v.slug}/veiculo/${v.id}`}
              className="group overflow-hidden rounded-md border border-zinc-800 bg-zinc-950 transition hover:border-green-500/40 hover:bg-zinc-900"
            >
              <div className="h-[74px] w-full overflow-hidden bg-zinc-800 sm:h-[82px] md:h-[88px]">
                <img
                  src={v.imagem}
                  alt={`${v.nome} ${v.ano}`}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              <div className="p-2">
                <h2 className="line-clamp-1 text-[12px] font-semibold leading-4 text-white">
                  {v.nome}
                </h2>

                <div className="mt-1 text-[10px] leading-4 text-zinc-400">
                  {v.ano} • {v.cambio}
                </div>

                <p className="mt-1 text-[14px] font-bold text-green-400">
                  R$ {v.preco.toLocaleString("pt-BR")}
                </p>

                <p className="mt-1 line-clamp-1 text-[10px] leading-4 text-zinc-400">
                  {v.cidade} • {v.combustivel}
                </p>

                <div className="mt-2 inline-flex w-full items-center justify-center rounded-md bg-green-500 px-2 py-1.5 text-[10px] font-bold text-black transition group-hover:bg-green-400">
                  Ver detalhes
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}