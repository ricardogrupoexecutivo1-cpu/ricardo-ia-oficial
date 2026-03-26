"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

type VeiculoMap = {
  [key: string]: {
    nome: string;
    preco: number;
    cidade: string;
    descricao: string;
    imagem: string;
    whatsapp: string;
  };
};

const veiculos: VeiculoMap = {
  "1": {
    nome: "Toyota Hilux 2022",
    preco: 180000,
    cidade: "Belo Horizonte",
    descricao:
      "Veículo em excelente estado, completo, pronto para uso. Ideal para locadoras, operação comercial ou uso particular.",
    imagem: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2",
    whatsapp: "55319997490074",
  },
  "2": {
    nome: "Jeep Compass 2023",
    preco: 150000,
    cidade: "Lagoa Santa",
    descricao:
      "SUV moderno, confortável e pronto para operação. Ótima opção para vitrine premium e negociação rápida.",
    imagem: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a",
    whatsapp: "55319997490074",
  },
};

export default function VeiculoPage() {
  const params = useParams();
  const id = String(params?.id ?? "");
  const slug = String(params?.slug ?? "");

  const veiculo = veiculos[id];

  if (!veiculo) {
    return (
      <main className="min-h-screen bg-black p-6 text-white">
        <div className="mx-auto max-w-4xl rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <h1 className="text-2xl font-bold">Veículo não encontrado</h1>
          <p className="mt-3 text-gray-400">
            O veículo solicitado não foi localizado no momento.
          </p>

          <Link
            href="/locadora"
            className="mt-6 inline-flex rounded-xl bg-green-500 px-4 py-3 font-semibold text-black hover:bg-green-400"
          >
            Voltar para a vitrine
          </Link>
        </div>
      </main>
    );
  }

  const mensagem = encodeURIComponent(
    `Olá, tenho interesse no veículo ${veiculo.nome} da loja ${slug}.`
  );

  return (
    <main className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/locadora"
          className="mb-6 inline-flex rounded-xl border border-zinc-700 px-4 py-2 text-sm text-gray-300 hover:bg-zinc-900"
        >
          ← Voltar para vitrine
        </Link>

        <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900">
          <img
            src={veiculo.imagem}
            alt={veiculo.nome}
            className="h-72 w-full object-cover md:h-96"
          />

          <div className="grid gap-8 p-6 md:grid-cols-[1.3fr_0.7fr]">
            <section>
              <p className="text-sm uppercase tracking-[0.2em] text-green-400">
                Aurora Locadora
              </p>

              <h1 className="mt-2 text-3xl font-bold md:text-4xl">
                {veiculo.nome}
              </h1>

              <p className="mt-3 text-lg text-gray-400">📍 {veiculo.cidade}</p>

              <p className="mt-6 text-base leading-7 text-gray-300">
                {veiculo.descricao}
              </p>
            </section>

            <aside className="rounded-2xl border border-zinc-800 bg-black/40 p-5">
              <p className="text-sm text-gray-400">Valor</p>
              <p className="mt-2 text-3xl font-bold text-green-400">
                R$ {veiculo.preco.toLocaleString("pt-BR")}
              </p>

              <a
                href={`https://wa.me/${veiculo.whatsapp}?text=${mensagem}`}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-green-500 px-4 py-4 text-center font-bold text-black hover:bg-green-400"
              >
                Falar no WhatsApp
              </a>

              <p className="mt-4 text-xs text-gray-500">
                Sistema em constante atualização e pode haver momentos de instabilidade.
              </p>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}