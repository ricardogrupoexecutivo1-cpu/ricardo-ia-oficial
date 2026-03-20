"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  buildVehicleWhatsappLink,
  formatCurrencyBRL,
  locadoraVehicles as fallbackVehicles,
  type VehicleItem,
} from "@/lib/locadora-data";

type LeadForm = {
  name: string;
  phone: string;
  email: string;
  interest: string;
  vehicleId: string;
  message: string;
};

const interestOptions = [
  { value: "aluguel", label: "Quero alugar" },
  { value: "venda", label: "Quero comprar" },
  { value: "frota", label: "Quero montar frota" },
  { value: "anunciar", label: "Quero anunciar veículos" },
];

function getModeLabel(mode: "venda" | "aluguel") {
  return mode === "venda" ? "Venda" : "Aluguel";
}

export default function LocadoraPage() {
  const [mode, setMode] = useState<"todos" | "venda" | "aluguel">("todos");
  const [search, setSearch] = useState("");
  const [vehicles, setVehicles] = useState<VehicleItem[]>(fallbackVehicles);
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [dataSource, setDataSource] = useState("local");
  const [form, setForm] = useState<LeadForm>({
    name: "",
    phone: "",
    email: "",
    interest: "aluguel",
    vehicleId: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadVehicles() {
      try {
        const response = await fetch("/api/locadora/vehicles", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!active) {
          return;
        }

        if (response.ok && Array.isArray(data?.vehicles) && data.vehicles.length) {
          setVehicles(data.vehicles);
          setDataSource(String(data?.source || "api"));
        } else {
          setVehicles(fallbackVehicles);
          setDataSource("local-fallback");
        }
      } catch {
        if (!active) {
          return;
        }

        setVehicles(fallbackVehicles);
        setDataSource("local-fallback");
      } finally {
        if (active) {
          setLoadingVehicles(false);
        }
      }
    }

    loadVehicles();

    return () => {
      active = false;
    };
  }, []);

  const normalizedSearch = search.trim().toLowerCase();

  const filteredVehicles = useMemo(() => {
    let base = vehicles;

    if (mode !== "todos") {
      base = base.filter((vehicle) => vehicle.mode.includes(mode));
    }

    if (!normalizedSearch) {
      return base;
    }

    return base.filter((vehicle) => {
      const haystack = [
        vehicle.title,
        vehicle.brand,
        vehicle.model,
        vehicle.location,
        vehicle.category,
        vehicle.sellerName,
        vehicle.sellerTagline,
        vehicle.fuel,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedSearch);
    });
  }, [mode, normalizedSearch, vehicles]);

  const heroVehicle = vehicles[0] || fallbackVehicles[0];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setFeedback(null);

    try {
      const response = await fetch("/api/locadora/lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setFeedback(data?.error || "Não foi possível enviar seu lead.");
        setSending(false);
        return;
      }

      setFeedback("Lead enviado com sucesso. Sua locadora já está captando contatos.");
      setForm({
        name: "",
        phone: "",
        email: "",
        interest: "aluguel",
        vehicleId: "",
        message: "",
      });
    } catch {
      setFeedback("Erro inesperado ao enviar lead.");
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#02030a] text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.12),transparent_24%),radial-gradient(circle_at_right,rgba(34,211,238,0.12),transparent_28%),radial-gradient(circle_at_left_bottom,rgba(168,85,247,0.10),transparent_28%)]" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,0.9)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.9)_1px,transparent_1px)] [background-size:72px_72px]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/70 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-6 pb-14 pt-8 md:px-8 md:pb-20 md:pt-10">
          <div className="mb-8 flex flex-wrap items-center gap-3">
            <Link
              href="/"
              className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/90 transition hover:border-emerald-400/40 hover:bg-white/10"
            >
              ← Voltar para Aurora IA
            </Link>

            <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-300">
              Módulo independente
            </span>

            <span className="rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-200">
              Venda + aluguel + leads
            </span>

            <Link
              href="/locadora/admin"
              className="rounded-full border border-amber-400/25 bg-amber-400/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-amber-300 transition hover:bg-amber-400/15"
            >
              Abrir admin
            </Link>

            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/65">
              Fonte: {dataSource}
            </span>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
            <div>
              <div className="mb-5 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] uppercase tracking-[0.35em] text-white/60">
                Aurora Locadora Premium
              </div>

              <h1 className="max-w-4xl text-4xl font-black leading-[0.98] md:text-6xl xl:text-7xl">
                A vitrine mais forte para
                <span className="bg-gradient-to-r from-emerald-300 via-cyan-300 to-fuchsia-300 bg-clip-text text-transparent">
                  {" "}locadoras, seminovos e geração de clientes
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-white/72 md:text-lg">
                Uma landing page de impacto para venda e aluguel de veículos, com
                identidade das locadoras, destaque premium, leitura clara, busca
                rápida, contato via WhatsApp e foco direto em conversão.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#veiculos"
                  className="rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-300 px-6 py-3 font-bold text-slate-950 shadow-[0_0_30px_rgba(16,185,129,0.24)] transition hover:scale-[1.02]"
                >
                  Ver vitrine
                </a>

                <a
                  href="#lead"
                  className="rounded-2xl border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white transition hover:border-cyan-400/40 hover:bg-white/10"
                >
                  Gerar lead agora
                </a>

                <Link
                  href="/locadora/admin"
                  className="rounded-2xl border border-amber-400/25 bg-amber-400/10 px-6 py-3 font-semibold text-amber-300 transition hover:bg-amber-400/15"
                >
                  Painel admin
                </Link>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="rounded-[1.8rem] border border-emerald-400/20 bg-[#07101f]/90 p-5 shadow-[0_0_30px_rgba(16,185,129,0.08)]">
                  <div className="text-3xl font-black text-emerald-300">
                    {vehicles.length}
                  </div>
                  <div className="mt-1 text-sm text-white/65">veículos exibidos</div>
                </div>

                <div className="rounded-[1.8rem] border border-cyan-400/20 bg-[#07101f]/90 p-5 shadow-[0_0_30px_rgba(34,211,238,0.08)]">
                  <div className="text-3xl font-black text-cyan-300">Busca</div>
                  <div className="mt-1 text-sm text-white/65">rápida e inteligente</div>
                </div>

                <div className="rounded-[1.8rem] border border-fuchsia-400/20 bg-[#07101f]/90 p-5 shadow-[0_0_30px_rgba(217,70,239,0.08)]">
                  <div className="text-3xl font-black text-fuchsia-300">Banco</div>
                  <div className="mt-1 text-sm text-white/65">
                    {dataSource === "supabase" ? "veículos reais" : "modo fallback"}
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-r from-emerald-400/15 via-cyan-400/12 to-fuchsia-400/12 blur-3xl" />
              <div className="relative overflow-hidden rounded-[2.4rem] border border-white/10 bg-[#07101f]/95 shadow-2xl">
                <div className="relative h-[540px] w-full">
                  <img
                    src={heroVehicle.image}
                    alt={heroVehicle.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#02030a] via-[#02030a]/30 to-transparent" />
                  <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/55 to-transparent" />

                  <div className="absolute left-5 top-5 flex flex-wrap gap-2">
                    <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-300">
                      Em destaque
                    </span>
                    <span className="rounded-full border border-white/15 bg-black/35 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/90">
                      {heroVehicle.badge || "Premium"}
                    </span>
                  </div>

                  <div className="absolute bottom-5 left-5 right-5">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-lg font-black text-white shadow-lg backdrop-blur">
                        {heroVehicle.sellerLogo}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{heroVehicle.sellerName}</p>
                        <p className="text-xs text-white/65">{heroVehicle.sellerTagline}</p>
                      </div>
                    </div>

                    <h2 className="text-3xl font-black md:text-4xl">{heroVehicle.title}</h2>
                    <p className="mt-2 text-sm text-white/72">{heroVehicle.location}</p>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl border border-emerald-400/15 bg-black/35 p-4 backdrop-blur">
                        <div className="text-[11px] uppercase tracking-[0.22em] text-white/45">
                          Venda
                        </div>
                        <div className="mt-2 text-2xl font-black text-emerald-300">
                          {formatCurrencyBRL(heroVehicle.priceSale) || "Sob consulta"}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-cyan-400/15 bg-black/35 p-4 backdrop-blur">
                        <div className="text-[11px] uppercase tracking-[0.22em] text-white/45">
                          Aluguel / diária
                        </div>
                        <div className="mt-2 text-2xl font-black text-cyan-300">
                          {heroVehicle.priceRentDaily
                            ? formatCurrencyBRL(heroVehicle.priceRentDaily)
                            : "Não disponível"}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <a
                        href={buildVehicleWhatsappLink(heroVehicle)}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 transition hover:scale-[1.02]"
                      >
                        Falar no WhatsApp
                      </a>

                      <button
                        onClick={() =>
                          setForm((current) => ({
                            ...current,
                            vehicleId: heroVehicle.id,
                            interest: heroVehicle.mode.includes("venda") ? "venda" : "aluguel",
                          }))
                        }
                        className="rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
                      >
                        Selecionar no lead
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 border-t border-white/10 bg-[#050914] p-5 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/75">
                    Página separada da Aurora principal
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/75">
                    Preparada para anúncios de veículos
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/75">
                    Estrutura para painel e Supabase
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/75">
                    Foco em confiança, marca e conversão
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="veiculos" className="mx-auto max-w-7xl px-6 py-12 md:px-8">
        <div className="mb-8 flex flex-col gap-5">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-3 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-white/55">
                Estoque em destaque
              </div>
              <h2 className="text-3xl font-black md:text-5xl">
                Veículos com identidade da locadora
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">
                Mais bonito, mais forte e com identificação visual da empresa dona do anúncio.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setMode("todos")}
                className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${
                  mode === "todos"
                    ? "bg-gradient-to-r from-emerald-400 to-cyan-300 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.22)]"
                    : "border border-white/15 bg-white/5 text-white/85 hover:bg-white/10"
                }`}
              >
                Todos
              </button>

              <button
                onClick={() => setMode("venda")}
                className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${
                  mode === "venda"
                    ? "bg-gradient-to-r from-emerald-400 to-cyan-300 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.22)]"
                    : "border border-white/15 bg-white/5 text-white/85 hover:bg-white/10"
                }`}
              >
                Venda
              </button>

              <button
                onClick={() => setMode("aluguel")}
                className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${
                  mode === "aluguel"
                    ? "bg-gradient-to-r from-emerald-400 to-cyan-300 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.22)]"
                    : "border border-white/15 bg-white/5 text-white/85 hover:bg-white/10"
                }`}
              >
                Aluguel
              </button>
            </div>
          </div>

          <div className="rounded-[1.8rem] border border-white/10 bg-[#07101f]/92 p-4 md:p-5">
            <label className="mb-3 block text-sm font-medium text-white/75">
              Buscar por marca, modelo, cidade ou locadora
            </label>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Ex.: Hilux, Toyota, Belo Horizonte, Raja Seminovos..."
              className="w-full rounded-2xl border border-white/10 bg-[#050914] px-4 py-3 text-white outline-none transition focus:border-emerald-400/45 focus:shadow-[0_0_0_4px_rgba(16,185,129,0.10)]"
            />
            <p className="mt-3 text-xs text-white/50">
              {loadingVehicles ? "Carregando veículos..." : `${filteredVehicles.length} veículo(s) encontrado(s)`}
            </p>
          </div>
        </div>

        <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
          {filteredVehicles.map((vehicle) => (
            <article
              key={vehicle.id}
              className="group overflow-hidden rounded-[2rem] border border-white/10 bg-[#07101f]/92 shadow-[0_0_40px_rgba(2,6,23,0.55)] transition duration-300 hover:-translate-y-1 hover:border-emerald-400/20 hover:shadow-[0_0_40px_rgba(16,185,129,0.10)]"
            >
              <div className="relative h-72 overflow-hidden">
                <img
                  src={vehicle.image}
                  alt={vehicle.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#02030a] via-[#02030a]/12 to-transparent" />

                <div className="absolute left-4 top-4 right-4 flex items-start justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    {vehicle.badge ? (
                      <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-300">
                        {vehicle.badge}
                      </span>
                    ) : null}

                    {vehicle.mode.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-white/15 bg-black/35 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/90"
                      >
                        {getModeLabel(item)}
                      </span>
                    ))}
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-black/35 text-sm font-black text-white backdrop-blur">
                    {vehicle.sellerLogo}
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-2xl font-black">{vehicle.title}</h3>
                  <p className="mt-1 text-sm text-white/70">{vehicle.location}</p>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-4 flex items-center gap-3 rounded-[1.4rem] border border-white/10 bg-black/20 p-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-sm font-black text-white">
                    {vehicle.sellerLogo}
                  </div>
                  <div>
                    <p className="font-bold">{vehicle.sellerName}</p>
                    <p className="text-xs text-white/60">
                      {vehicle.sellerTagline || "Locadora parceira"}
                    </p>
                  </div>
                </div>

                <div className="mb-4 flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/75">
                    {vehicle.category}
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/75">
                    {vehicle.year}
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/75">
                    {vehicle.transmission}
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/75">
                    {vehicle.fuel}
                  </span>
                </div>

                <p className="text-sm leading-6 text-white/72">
                  {vehicle.description}
                </p>

                <div className="mt-5 grid gap-3">
                  <div className="rounded-2xl border border-emerald-400/12 bg-[#050914] p-4">
                    <div className="text-[11px] uppercase tracking-[0.22em] text-white/45">
                      Venda
                    </div>
                    <div className="mt-2 text-xl font-bold text-emerald-300">
                      {formatCurrencyBRL(vehicle.priceSale) || "Sob consulta"}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-cyan-400/12 bg-[#050914] p-4">
                    <div className="text-[11px] uppercase tracking-[0.22em] text-white/45">
                      Aluguel / diária
                    </div>
                    <div className="mt-2 text-xl font-bold text-cyan-300">
                      {vehicle.priceRentDaily
                        ? formatCurrencyBRL(vehicle.priceRentDaily)
                        : "Não disponível"}
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <a
                    href={buildVehicleWhatsappLink(vehicle)}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-300 px-4 py-2.5 text-center text-sm font-bold text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.20)] transition hover:scale-[1.02]"
                  >
                    WhatsApp
                  </a>

                  <button
                    onClick={() =>
                      setForm((current) => ({
                        ...current,
                        vehicleId: vehicle.id,
                        interest: vehicle.mode.includes("venda") ? "venda" : "aluguel",
                      }))
                    }
                    className="rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Selecionar veículo
                  </button>
                </div>

                <div className="mt-4 text-xs text-white/45">
                  Contato da loja: {vehicle.sellerPhone}
                </div>
              </div>
            </article>
          ))}
        </div>

        {!loadingVehicles && filteredVehicles.length === 0 ? (
          <div className="mt-8 rounded-[1.8rem] border border-white/10 bg-[#07101f]/92 p-8 text-center">
            <p className="text-xl font-bold">Nenhum veículo encontrado</p>
            <p className="mt-2 text-sm text-white/65">
              Tente buscar por outra marca, modelo, cidade ou locadora.
            </p>
          </div>
        ) : null}
      </section>

      <section id="lead" className="mx-auto max-w-7xl px-6 py-16 md:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="rounded-[2.3rem] border border-white/10 bg-[#07101f]/92 p-8 shadow-[0_0_40px_rgba(34,211,238,0.05)]">
            <div className="inline-flex rounded-full border border-fuchsia-400/25 bg-fuchsia-400/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-fuchsia-300">
              Geração de lead
            </div>

            <h2 className="mt-4 text-3xl font-black md:text-4xl">
              Receba contatos para venda, aluguel e frota
            </h2>

            <p className="mt-4 text-sm leading-7 text-white/72">
              Esta estrutura já deixa sua área comercial pronta para captar
              clientes agora e crescer para painel, banco e CRM.
            </p>

            <div className="mt-8 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/75">
                Lead geral ou por veículo específico
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/75">
                Preparado para WhatsApp e CRM
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/75">
                Base forte para anúncios e tráfego pago
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-[2.3rem] border border-white/10 bg-[#07101f]/92 p-8 shadow-[0_0_40px_rgba(16,185,129,0.05)]"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-white/75">
                  Nome
                </label>
                <input
                  value={form.name}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-[#050914] px-4 py-3 text-white outline-none transition focus:border-emerald-400/45 focus:shadow-[0_0_0_4px_rgba(16,185,129,0.10)]"
                  placeholder="Seu nome"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white/75">
                  Telefone
                </label>
                <input
                  value={form.phone}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      phone: event.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-[#050914] px-4 py-3 text-white outline-none transition focus:border-emerald-400/45 focus:shadow-[0_0_0_4px_rgba(16,185,129,0.10)]"
                  placeholder="(31) 99999-9999"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white/75">
                  E-mail
                </label>
                <input
                  value={form.email}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-[#050914] px-4 py-3 text-white outline-none transition focus:border-emerald-400/45 focus:shadow-[0_0_0_4px_rgba(16,185,129,0.10)]"
                  placeholder="voce@empresa.com"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white/75">
                  Interesse
                </label>
                <select
                  value={form.interest}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      interest: event.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-[#050914] px-4 py-3 text-white outline-none transition focus:border-emerald-400/45 focus:shadow-[0_0_0_4px_rgba(16,185,129,0.10)]"
                >
                  {interestOptions.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      className="bg-slate-900"
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white/75">
                  Veículo selecionado
                </label>
                <select
                  value={form.vehicleId}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      vehicleId: event.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-[#050914] px-4 py-3 text-white outline-none transition focus:border-emerald-400/45 focus:shadow-[0_0_0_4px_rgba(16,185,129,0.10)]"
                >
                  <option value="" className="bg-slate-900">
                    Sem veículo específico
                  </option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id} className="bg-slate-900">
                      {vehicle.title} - {vehicle.sellerName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-white/75">
                  Mensagem
                </label>
                <textarea
                  value={form.message}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      message: event.target.value,
                    }))
                  }
                  rows={5}
                  className="w-full rounded-2xl border border-white/10 bg-[#050914] px-4 py-3 text-white outline-none transition focus:border-emerald-400/45 focus:shadow-[0_0_0_4px_rgba(16,185,129,0.10)]"
                  placeholder="Descreva o que você procura."
                />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                type="submit"
                disabled={sending}
                className="rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-300 px-6 py-3 font-bold text-slate-950 shadow-[0_0_25px_rgba(16,185,129,0.22)] transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {sending ? "Enviando..." : "Enviar lead"}
              </button>

              {feedback ? <p className="text-sm text-white/75">{feedback}</p> : null}
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}