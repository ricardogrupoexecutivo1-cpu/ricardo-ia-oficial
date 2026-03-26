import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocadoraServerClient } from "@/lib/supabase-locadora-server";
import {
  formatCurrencyBRL,
  buildVehicleWhatsappLink,
  getSellerBySlug,
  getVehiclesByTenantSlug,
} from "@/lib/locadora-data";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

async function getSellerAndVehicles(slug: string) {
  const supabase = getLocadoraServerClient();

  if (!supabase) {
    const seller = getSellerBySlug(slug);
    const vehicles = getVehiclesByTenantSlug(slug);
    return {
      mode: "mock" as const,
      seller,
      vehicles,
    };
  }

  const { data: seller, error: sellerError } = await supabase
    .from("locadora_sellers")
    .select("*")
    .eq("tenant_slug", slug)
    .eq("active", true)
    .maybeSingle();

  if (sellerError) {
    console.error("[locadora-public] erro seller:", sellerError);
  }

  if (!seller) {
    return {
      mode: "database" as const,
      seller: null,
      vehicles: [],
    };
  }

  const { data: vehicles, error: vehiclesError } = await supabase
    .from("locadora_vehicles")
    .select("*")
    .eq("tenant_slug", slug)
    .eq("active", true)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (vehiclesError) {
    console.error("[locadora-public] erro vehicles:", vehiclesError);
  }

  return {
    mode: "database" as const,
    seller,
    vehicles: Array.isArray(vehicles) ? vehicles : [],
  };
}

export default async function LocadoraSellerPage({ params }: PageProps) {
  const { slug } = await params;
  const result = await getSellerAndVehicles(slug);

  if (!result.seller) {
    notFound();
  }

  const seller = result.seller;
  const vehicles = result.vehicles || [];

  const sellerName =
    seller.trade_name || seller.company_name || seller.name || "Locadora";

  const sellerTagline = seller.tagline || "Veículos para venda e aluguel";
  const sellerCity = seller.city || "";
  const sellerState = seller.state || "";
  const sellerPhone = seller.whatsapp || seller.phone || "";
  const whatsappLink = sellerPhone
    ? `https://wa.me/${String(sellerPhone).replace(/\D/g, "")}?text=${encodeURIComponent(
        `Olá! Quero atendimento da ${sellerName}.`
      )}`
    : "#";

  return (
    <main className="min-h-screen bg-[#02030a] text-white">
      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.10),transparent_26%),radial-gradient(circle_at_right,rgba(34,211,238,0.10),transparent_30%)]">
        <div className="mx-auto max-w-7xl px-6 py-12 md:px-8">
          <div className="mb-4 flex flex-wrap gap-3">
            <Link
              href="/locadora"
              className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/90 transition hover:bg-white/10"
            >
              ← Voltar para Aurora Locadora
            </Link>

            <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-300">
              Página da locadora
            </span>

            <span className="rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-200">
              {result.mode === "database" ? "Banco real" : "Mock"}
            </span>
          </div>

          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-5 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] border border-white/10 bg-white/10 text-2xl font-black">
                  {seller.logo_text || seller.logoText || "LC"}
                </div>

                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-emerald-300/80">
                    Locadora parceira
                  </p>
                  <h1 className="mt-2 text-4xl font-black md:text-6xl">
                    {sellerName}
                  </h1>
                </div>
              </div>

              <p className="max-w-2xl text-lg text-white/72">
                {sellerTagline}
              </p>

              <p className="mt-4 text-sm text-white/55">
                {sellerCity}
                {sellerCity && sellerState ? " - " : ""}
                {sellerState}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-300 px-6 py-3 font-bold text-slate-950 transition hover:scale-[1.02]"
              >
                Falar no WhatsApp
              </a>

              <Link
                href="/chat"
                className="rounded-2xl border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                Criar anúncio com IA
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 md:px-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-cyan-300/80">
              Estoque da locadora
            </p>
            <h2 className="mt-2 text-3xl font-black">
              {vehicles.length} veículo{vehicles.length === 1 ? "" : "s"}
            </h2>
          </div>
        </div>

        {vehicles.length === 0 ? (
          <div className="rounded-[2rem] border border-white/10 bg-[#07101f]/92 p-8 text-white/65">
            Nenhum veículo ativo encontrado para esta locadora no momento.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {vehicles.map((vehicle: any) => {
              const title = vehicle.title || "Veículo";
              const image = vehicle.image || "";
              const description = vehicle.description || "";
              const salePrice = formatCurrencyBRL(vehicle.price_sale ?? vehicle.priceSale);
              const rentPrice = formatCurrencyBRL(
                vehicle.price_rent_daily ?? vehicle.priceRentDaily
              );
              const phone =
                seller.whatsapp ||
                seller.phone ||
                vehicle.sellerPhone ||
                "";

              const whatsappVehicleLink = buildVehicleWhatsappLink({
                title,
                sellerPhone: phone,
              });

              return (
                <article
                  key={vehicle.id}
                  className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#07101f]/92"
                >
                  {image ? (
                    <div className="aspect-[16/10] overflow-hidden">
                      <img
                        src={image}
                        alt={title}
                        className="h-full w-full object-cover transition duration-500 hover:scale-[1.03]"
                      />
                    </div>
                  ) : null}

                  <div className="p-6">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      {vehicle.badge ? (
                        <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-300">
                          {vehicle.badge}
                        </span>
                      ) : null}

                      {vehicle.featured ? (
                        <span className="rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-200">
                          Destaque
                        </span>
                      ) : null}
                    </div>

                    <h3 className="text-2xl font-black">{title}</h3>

                    <p className="mt-2 text-sm text-white/60">
                      {vehicle.brand} • {vehicle.model} • {vehicle.year}
                    </p>

                    <p className="mt-3 line-clamp-3 text-sm text-white/68">
                      {description}
                    </p>

                    <div className="mt-5 space-y-2 text-sm">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-white/55">Venda</span>
                        <span className="font-semibold text-white">
                          {salePrice || "-"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <span className="text-white/55">Diária</span>
                        <span className="font-semibold text-white">
                          {rentPrice || "-"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <span className="text-white/55">Local</span>
                        <span className="font-semibold text-white">
                          {vehicle.location || "-"}
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <a
                        href={whatsappVehicleLink}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-300 px-4 py-3 text-sm font-bold text-slate-950 transition hover:scale-[1.02]"
                      >
                        Tenho interesse
                      </a>

                      <Link
                        href={`/chat?prompt=${encodeURIComponent(
                          `Crie uma campanha para vender o veículo ${title} da locadora ${sellerName} em ${sellerCity || "Minas Gerais"}`
                        )}`}
                        className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                      >
                        Criar anúncio com IA
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}