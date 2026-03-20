"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Seller = {
  id: string;
  name: string;
  logo_text: string;
  tagline: string | null;
  phone: string | null;
  whatsapp: string | null;
  city: string | null;
  state: string | null;
  active: boolean;
};

type VehicleAdmin = {
  id: string;
  slug: string | null;
  title: string;
  brand: string;
  model: string;
  year: number;
  category: string;
  fuel: string;
  transmission: string;
  mode: string[];
  price_sale: number | null;
  price_rent_daily: number | null;
  location: string;
  image: string;
  featured: boolean;
  description: string;
  badge: string | null;
  active: boolean;
  seller_id?: string | null;
  seller?: {
    id: string;
    name: string;
    logo_text: string;
    tagline: string | null;
    phone: string | null;
    whatsapp: string | null;
  } | null;
};

type SellerForm = {
  id?: string;
  name: string;
  logoText: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  city: string;
  state: string;
  active: boolean;
};

type VehicleForm = {
  id?: string;
  sellerId: string;
  slug: string;
  title: string;
  brand: string;
  model: string;
  year: string;
  category: string;
  fuel: string;
  transmission: string;
  priceSale: string;
  priceRentDaily: string;
  location: string;
  image: string;
  description: string;
  badge: string;
  featured: boolean;
  active: boolean;
  venda: boolean;
  aluguel: boolean;
};

const emptySellerForm: SellerForm = {
  name: "",
  logoText: "",
  tagline: "",
  phone: "",
  whatsapp: "",
  city: "",
  state: "",
  active: true,
};

const emptyVehicleForm: VehicleForm = {
  sellerId: "",
  slug: "",
  title: "",
  brand: "",
  model: "",
  year: "",
  category: "SUV",
  fuel: "Flex",
  transmission: "Automático",
  priceSale: "",
  priceRentDaily: "",
  location: "",
  image: "",
  description: "",
  badge: "",
  featured: false,
  active: true,
  venda: true,
  aluguel: false,
};

export default function LocadoraAdminPage() {
  const router = useRouter();

  const [authChecked, setAuthChecked] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  const [sellers, setSellers] = useState<Seller[]>([]);
  const [vehicles, setVehicles] = useState<VehicleAdmin[]>([]);
  const [loading, setLoading] = useState(true);

  const [sellerForm, setSellerForm] = useState<SellerForm>(emptySellerForm);
  const [vehicleForm, setVehicleForm] = useState<VehicleForm>(emptyVehicleForm);

  const [sellerFeedback, setSellerFeedback] = useState<string | null>(null);
  const [vehicleFeedback, setVehicleFeedback] = useState<string | null>(null);
  const [savingSeller, setSavingSeller] = useState(false);
  const [savingVehicle, setSavingVehicle] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingVehicleImage, setUploadingVehicleImage] = useState(false);
  const [logoUploadPreview, setLogoUploadPreview] = useState<string | null>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch("/api/locadora/admin/auth/check", {
          cache: "no-store",
        });
        const data = await response.json();

        if (!response.ok || !data?.authenticated) {
          router.replace("/locadora/admin/login");
          return;
        }

        setAuthenticated(true);
      } catch {
        router.replace("/locadora/admin/login");
        return;
      } finally {
        setAuthChecked(true);
      }
    }

    checkAuth();
  }, [router]);

  async function loadData() {
    setLoading(true);

    try {
      const [sellerRes, vehicleRes] = await Promise.all([
        fetch("/api/locadora/admin/sellers", { cache: "no-store" }),
        fetch("/api/locadora/admin/vehicles", { cache: "no-store" }),
      ]);

      const sellerData = await sellerRes.json();
      const vehicleData = await vehicleRes.json();

      if (sellerRes.ok && Array.isArray(sellerData?.sellers)) {
        setSellers(sellerData.sellers);
      }

      if (vehicleRes.ok && Array.isArray(vehicleData?.vehicles)) {
        setVehicles(vehicleData.vehicles);
      }
    } catch {
      setSellerFeedback("Erro ao carregar locadoras.");
      setVehicleFeedback("Erro ao carregar veículos.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (authenticated) {
      loadData();
    }
  }, [authenticated]);

  async function handleLogout() {
    setLoggingOut(true);

    try {
      await fetch("/api/locadora/admin/auth", {
        method: "DELETE",
      });

      router.push("/locadora/admin/login");
      router.refresh();
    } catch {
      setLoggingOut(false);
    }
  }

  function resetSellerForm() {
    setSellerForm(emptySellerForm);
    setLogoUploadPreview(null);
  }

  function resetVehicleForm() {
    setVehicleForm(emptyVehicleForm);
  }

  function fillSellerForm(seller: Seller) {
    setSellerForm({
      id: seller.id,
      name: seller.name || "",
      logoText: seller.logo_text || "",
      tagline: seller.tagline || "",
      phone: seller.phone || "",
      whatsapp: seller.whatsapp || "",
      city: seller.city || "",
      state: seller.state || "",
      active: seller.active,
    });
    setLogoUploadPreview(null);
    setSellerFeedback(`Editando locadora: ${seller.name}`);
  }

  function fillVehicleForm(vehicle: VehicleAdmin) {
    setVehicleForm({
      id: vehicle.id,
      sellerId: vehicle.seller?.id || vehicle.seller_id || "",
      slug: vehicle.slug || "",
      title: vehicle.title || "",
      brand: vehicle.brand || "",
      model: vehicle.model || "",
      year: String(vehicle.year || ""),
      category: vehicle.category || "",
      fuel: vehicle.fuel || "",
      transmission: vehicle.transmission || "",
      priceSale:
        vehicle.price_sale === null || vehicle.price_sale === undefined
          ? ""
          : String(vehicle.price_sale),
      priceRentDaily:
        vehicle.price_rent_daily === null || vehicle.price_rent_daily === undefined
          ? ""
          : String(vehicle.price_rent_daily),
      location: vehicle.location || "",
      image: vehicle.image || "",
      description: vehicle.description || "",
      badge: vehicle.badge || "",
      featured: Boolean(vehicle.featured),
      active: Boolean(vehicle.active),
      venda: Array.isArray(vehicle.mode) ? vehicle.mode.includes("venda") : false,
      aluguel: Array.isArray(vehicle.mode) ? vehicle.mode.includes("aluguel") : false,
    });
    setVehicleFeedback(`Editando veículo: ${vehicle.title}`);
  }

  async function uploadFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/locadora/admin/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error || "Erro no upload.");
    }

    return data as { publicUrl: string };
  }

  async function handleLogoUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setUploadingLogo(true);
    setSellerFeedback(null);

    try {
      const data = await uploadFile(file);

      const fileName = file.name.replace(/\.[^/.]+$/, "");
      const parts = fileName
        .trim()
        .split(/\s+/)
        .map((item) => item[0])
        .filter(Boolean)
        .join("")
        .slice(0, 3)
        .toUpperCase();

      setSellerForm((current) => ({
        ...current,
        logoText: parts || current.logoText || "LG",
      }));

      setLogoUploadPreview(data.publicUrl);
      setSellerFeedback("Logo enviada com sucesso. A sigla foi preenchida automaticamente.");
    } catch (error) {
      setSellerFeedback(
        error instanceof Error ? error.message : "Erro ao enviar logo."
      );
    } finally {
      setUploadingLogo(false);
      event.target.value = "";
    }
  }

  async function handleVehicleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setUploadingVehicleImage(true);
    setVehicleFeedback(null);

    try {
      const data = await uploadFile(file);

      setVehicleForm((current) => ({
        ...current,
        image: data.publicUrl,
      }));

      setVehicleFeedback("Imagem do veículo enviada com sucesso.");
    } catch (error) {
      setVehicleFeedback(
        error instanceof Error ? error.message : "Erro ao enviar imagem."
      );
    } finally {
      setUploadingVehicleImage(false);
      event.target.value = "";
    }
  }

  async function toggleSellerActive(seller: Seller) {
    setSellerFeedback(null);

    try {
      const response = await fetch("/api/locadora/admin/sellers", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: seller.id,
          name: seller.name,
          logoText: seller.logo_text,
          tagline: seller.tagline || "",
          phone: seller.phone || "",
          whatsapp: seller.whatsapp || "",
          city: seller.city || "",
          state: seller.state || "",
          active: !seller.active,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setSellerFeedback(data?.error || "Erro ao alterar status da locadora.");
        return;
      }

      setSellerFeedback(
        seller.active
          ? "Locadora desativada com sucesso."
          : "Locadora ativada com sucesso."
      );

      await loadData();
    } catch {
      setSellerFeedback("Erro inesperado ao alterar status da locadora.");
    }
  }

  async function toggleVehicleActive(vehicle: VehicleAdmin) {
    setVehicleFeedback(null);

    try {
      const response = await fetch("/api/locadora/admin/vehicles", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: vehicle.id,
          sellerId: vehicle.seller?.id || vehicle.seller_id || "",
          slug: vehicle.slug || "",
          title: vehicle.title,
          brand: vehicle.brand,
          model: vehicle.model,
          year: vehicle.year,
          category: vehicle.category,
          fuel: vehicle.fuel,
          transmission: vehicle.transmission,
          mode: vehicle.mode || [],
          priceSale: vehicle.price_sale,
          priceRentDaily: vehicle.price_rent_daily,
          location: vehicle.location,
          image: vehicle.image,
          description: vehicle.description,
          badge: vehicle.badge || "",
          featured: vehicle.featured,
          active: !vehicle.active,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setVehicleFeedback(data?.error || "Erro ao alterar status do veículo.");
        return;
      }

      setVehicleFeedback(
        vehicle.active
          ? "Veículo desativado com sucesso."
          : "Veículo ativado com sucesso."
      );

      await loadData();
    } catch {
      setVehicleFeedback("Erro inesperado ao alterar status do veículo.");
    }
  }

  async function handleSellerSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingSeller(true);
    setSellerFeedback(null);

    try {
      const isEditing = Boolean(sellerForm.id);

      const response = await fetch("/api/locadora/admin/sellers", {
        method: isEditing ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sellerForm),
      });

      const data = await response.json();

      if (!response.ok) {
        setSellerFeedback(data?.error || "Erro ao salvar locadora.");
        setSavingSeller(false);
        return;
      }

      setSellerFeedback(
        isEditing
          ? "Locadora editada com sucesso."
          : "Locadora cadastrada com sucesso."
      );

      resetSellerForm();
      await loadData();
    } catch {
      setSellerFeedback("Erro inesperado ao salvar locadora.");
    } finally {
      setSavingSeller(false);
    }
  }

  async function handleVehicleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingVehicle(true);
    setVehicleFeedback(null);

    const mode: string[] = [];
    if (vehicleForm.venda) mode.push("venda");
    if (vehicleForm.aluguel) mode.push("aluguel");

    try {
      const isEditing = Boolean(vehicleForm.id);

      const response = await fetch("/api/locadora/admin/vehicles", {
        method: isEditing ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: vehicleForm.id,
          sellerId: vehicleForm.sellerId,
          slug: vehicleForm.slug,
          title: vehicleForm.title,
          brand: vehicleForm.brand,
          model: vehicleForm.model,
          year: vehicleForm.year,
          category: vehicleForm.category,
          fuel: vehicleForm.fuel,
          transmission: vehicleForm.transmission,
          mode,
          priceSale: vehicleForm.priceSale,
          priceRentDaily: vehicleForm.priceRentDaily,
          location: vehicleForm.location,
          image: vehicleForm.image,
          description: vehicleForm.description,
          badge: vehicleForm.badge,
          featured: vehicleForm.featured,
          active: vehicleForm.active,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setVehicleFeedback(data?.error || "Erro ao salvar veículo.");
        setSavingVehicle(false);
        return;
      }

      setVehicleFeedback(
        isEditing
          ? "Veículo editado com sucesso."
          : "Veículo cadastrado com sucesso."
      );

      resetVehicleForm();
      await loadData();
    } catch {
      setVehicleFeedback("Erro inesperado ao salvar veículo.");
    } finally {
      setSavingVehicle(false);
    }
  }

  if (!authChecked) {
    return (
      <main className="min-h-screen bg-[#02030a] text-white">
        <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6">
          <div className="rounded-[2rem] border border-white/10 bg-[#07101f]/92 px-8 py-6 text-white/75">
            Verificando acesso ao admin...
          </div>
        </div>
      </main>
    );
  }

  if (!authenticated) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#02030a] text-white">
      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.10),transparent_26%),radial-gradient(circle_at_right,rgba(34,211,238,0.10),transparent_30%)]">
        <div className="mx-auto max-w-7xl px-6 py-10 md:px-8">
          <div className="mb-6 flex flex-wrap gap-3">
            <Link
              href="/locadora"
              className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/90 transition hover:bg-white/10"
            >
              ← Voltar para Locadora
            </Link>

            <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-300">
              Admin locadora
            </span>

            <span className="rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-200">
              Upload ativo
            </span>

            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="rounded-full border border-amber-400/25 bg-amber-400/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-amber-300 transition hover:bg-amber-400/15 disabled:opacity-60"
            >
              {loggingOut ? "Saindo..." : "Sair"}
            </button>
          </div>

          <h1 className="text-4xl font-black md:text-6xl">
            Painel administrativo da Aurora Locadora
          </h1>

          <p className="mt-4 max-w-3xl text-white/70">
            Aqui você cadastra, edita e controla locadoras e veículos reais que
            alimentam a vitrine principal.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 md:px-8">
        <div className="grid gap-8 xl:grid-cols-2">
          <form
            onSubmit={handleSellerSubmit}
            className="rounded-[2rem] border border-white/10 bg-[#07101f]/92 p-8"
          >
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-emerald-300/80">
                  Cadastro de locadora
                </p>
                <h2 className="mt-2 text-3xl font-black">
                  {sellerForm.id ? "Editar locadora" : "Nova locadora"}
                </h2>
              </div>

              {sellerForm.id ? (
                <button
                  type="button"
                  onClick={resetSellerForm}
                  className="rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Cancelar edição
                </button>
              ) : null}
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm text-white/75">Nome</label>
                <input
                  value={sellerForm.name}
                  onChange={(event) =>
                    setSellerForm((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-[#050914] px-4 py-3 outline-none focus:border-emerald-400/40"
                  placeholder="Nome da locadora"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/75">Sigla / logo texto</label>
                <input
                  value={sellerForm.logoText}
                  onChange={(event) =>
                    setSellerForm((current) => ({
                      ...current,
                      logoText: event.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-[#050914] px-4 py-3 outline-none focus:border-emerald-400/40"
                  placeholder="Ex.: RS"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/75">Upload do logo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="block w-full rounded-2xl border border-white/10 bg-[#050914] px-4 py-3 text-sm text-white outline-none"
                />
                <p className="mt-2 text-xs text-white/50">
                  {uploadingLogo ? "Enviando logo..." : "Opcional: envia a imagem do logo para referência visual."}
                </p>
              </div>

              {logoUploadPreview ? (
                <div className="md:col-span-2">
                  <p className="mb-2 text-sm text-white/75">Prévia do logo enviado</p>
                  <div className="w-fit rounded-2xl border border-white/10 bg-[#050914] p-3">
                    <img
                      src={logoUploadPreview}
                      alt="Logo enviado"
                      className="h-20 w-20 rounded-xl object-cover"
                    />
                  </div>
                </div>
              ) : null}

              <div>
                <label className="mb-2 block text-sm text-white/75">Telefone</label>
                <input
                  value={sellerForm.phone}
                  onChange={(event) =>
                    setSellerForm((current) => ({
                      ...current,
                      phone: event.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-[#050914] px-4 py-3 outline-none focus:border-emerald-400/40"
                  placeholder="(31) 99999-9999"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm text-white/75">Tagline</label>
                <input
                  value={sellerForm.tagline}
                  onChange={(event) =>
                    setSellerForm((current) => ({
                      ...current,
                      tagline: event.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-[#050914] px-4 py-3 outline-none focus:border-emerald-400/40"
                  placeholder="Ex.: Seminovos premium"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/75">WhatsApp</label>
                <input
                  value={sellerForm.whatsapp}
                  onChange={(event) =>
                    setSellerForm((current) => ({
                      ...current,
                      whatsapp: event.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-[#050914] px-4 py-3 outline-none focus:border-emerald-400/40"
                  placeholder="5531999999999"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/75">Cidade</label>
                <input
                  value={sellerForm.city}
                  onChange={(event) =>
                    setSellerForm((current) => ({
                      ...current,
                      city: event.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-[#050914] px-4 py-3 outline-none focus:border-emerald-400/40"
                  placeholder="Belo Horizonte"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/75">Estado</label>
                <input
                  value={sellerForm.state}
                  onChange={(event) =>
                    setSellerForm((current) => ({
                      ...current,
                      state: event.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-[#050914] px-4 py-3 outline-none focus:border-emerald-400/40"
                  placeholder="MG"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  id="seller-active"
                  type="checkbox"
                  checked={sellerForm.active}
                  onChange={(event) =>
                    setSellerForm((current) => ({
                      ...current,
                      active: event.target.checked,
                    }))
                  }
                />
                <label htmlFor="seller-active" className="text-sm text-white/75">
                  Locadora ativa
                </label>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                type="submit"
                disabled={savingSeller || uploadingLogo}
                className="rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-300 px-6 py-3 font-bold text-slate-950 transition hover:scale-[1.02] disabled:opacity-60"
              >
                {savingSeller
                  ? "Salvando..."
                  : sellerForm.id
                  ? "Salvar locadora"
                  : "Cadastrar locadora"}
              </button>

              {sellerFeedback ? (
                <p className="text-sm text-white/75">{sellerFeedback}</p>
              ) : null}
            </div>
          </form>

          <form
            onSubmit={handleVehicleSubmit}
            className="rounded-[2rem] border border-white/10 bg-[#07101f]/92 p-8"
          >
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-cyan-300/80">
                  Cadastro de veículo
                </p>
                <h2 className="mt-2 text-3xl font-black">
                  {vehicleForm.id ? "Editar veículo" : "Novo veículo"}
                </h2>
              </div>

              {vehicleForm.id ? (
                <button
                  type="button"
                  onClick={resetVehicleForm}
                  className="rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Cancelar edição
                </button>
              ) : null}
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm text-white/75">Locadora</label>
                <select
                  value={vehicleForm.sellerId}
                  onChange={(event) =>
                    setVehicleForm((current) => ({
                      ...current,
                      sellerId: event.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-[#050914] px-4 py-3 outline-none focus:border-cyan-400/40"
                >
                  <option value="">Selecione a locadora</option>
                  {sellers.map((seller) => (
                    <option key={seller.id} value={seller.id}>
                      {seller.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm text-white/75">Título</label>
                <input
                  value={vehicleForm.title}
                  onChange={(event) =>
                    setVehicleForm((current) => ({
                      ...current,
                      title: event.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-[#050914] px-4 py-3 outline-none focus:border-cyan-400/40"
                  placeholder="Toyota Hilux SRX 2023"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/75">Slug opcional</label>
                <input
                  value={vehicleForm.slug}
                  onChange={(event) =>
                    setVehicleForm((current) => ({
                      ...current,
                      slug: event.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-[#050914] px-4 py-3 outline-none focus:border-cyan-400/40"
                  placeholder="hilux-srx-2023"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/75">Ano</label>
                <input
                  value={vehicleForm.year}
                  onChange={(event) =>
                    setVehicleForm((current) => ({
                      ...current,
                      year: event.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-[#050914] px-4 py-3 outline-none focus:border-cyan-400/40"
                  placeholder="2024"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/75">Marca</label>
                <input
                  value={vehicleForm.brand}
                  onChange={(event) =>
                    setVehicleForm((current) => ({
                      ...current,
                      brand: event.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-[#050914] px-4 py-3 outline-none focus:border-cyan-400/40"
                  placeholder="Toyota"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/75">Modelo</label>
                <input
                  value={vehicleForm.model}
                  onChange={(event) =>
                    setVehicleForm((current) => ({
                      ...current,
                      model: event.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-[#050914] px-4 py-3 outline-none focus:border-cyan-400/40"
                  placeholder="Hilux SRX"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/75">Categoria</label>
                <input
                  value={vehicleForm.category}
                  onChange={(event) =>
                    setVehicleForm((current) => ({
                      ...current,
                      category: event.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-[#050914] px-4 py-3 outline-none focus:border-cyan-400/40"
                  placeholder="SUV"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/75">Combustível</label>
                <input
                  value={vehicleForm.fuel}
                  onChange={(event) =>
                    setVehicleForm((current) => ({
                      ...current,
                      fuel: event.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-[#050914] px-4 py-3 outline-none focus:border-cyan-400/40"
                  placeholder="Flex"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/75">Câmbio</label>
                <input
                  value={vehicleForm.transmission}
                  onChange={(event) =>
                    setVehicleForm((current) => ({
                      ...current,
                      transmission: event.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-[#050914] px-4 py-3 outline-none focus:border-cyan-400/40"
                  placeholder="Automático"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/75">Preço venda</label>
                <input
                  value={vehicleForm.priceSale}
                  onChange={(event) =>
                    setVehicleForm((current) => ({
                      ...current,
                      priceSale: event.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-[#050914] px-4 py-3 outline-none focus:border-cyan-400/40"
                  placeholder="149900"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/75">Preço diária</label>
                <input
                  value={vehicleForm.priceRentDaily}
                  onChange={(event) =>
                    setVehicleForm((current) => ({
                      ...current,
                      priceRentDaily: event.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-[#050914] px-4 py-3 outline-none focus:border-cyan-400/40"
                  placeholder="240"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/75">Local</label>
                <input
                  value={vehicleForm.location}
                  onChange={(event) =>
                    setVehicleForm((current) => ({
                      ...current,
                      location: event.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-[#050914] px-4 py-3 outline-none focus:border-cyan-400/40"
                  placeholder="Belo Horizonte - MG"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/75">Badge</label>
                <input
                  value={vehicleForm.badge}
                  onChange={(event) =>
                    setVehicleForm((current) => ({
                      ...current,
                      badge: event.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-[#050914] px-4 py-3 outline-none focus:border-cyan-400/40"
                  placeholder="Premium"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm text-white/75">Upload da imagem</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleVehicleImageUpload}
                  className="block w-full rounded-2xl border border-white/10 bg-[#050914] px-4 py-3 text-sm text-white outline-none"
                />
                <p className="mt-2 text-xs text-white/50">
                  {uploadingVehicleImage
                    ? "Enviando imagem..."
                    : "Opcional: envie a imagem e a URL será preenchida automaticamente."}
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm text-white/75">URL da imagem</label>
                <input
                  value={vehicleForm.image}
                  onChange={(event) =>
                    setVehicleForm((current) => ({
                      ...current,
                      image: event.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-[#050914] px-4 py-3 outline-none focus:border-cyan-400/40"
                  placeholder="https://..."
                />
              </div>

              {vehicleForm.image ? (
                <div className="md:col-span-2">
                  <p className="mb-2 text-sm text-white/75">Prévia da imagem</p>
                  <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#050914]">
                    <img
                      src={vehicleForm.image}
                      alt="Prévia do veículo"
                      className="h-56 w-full object-cover"
                    />
                  </div>
                </div>
              ) : null}

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm text-white/75">Descrição</label>
                <textarea
                  value={vehicleForm.description}
                  onChange={(event) =>
                    setVehicleForm((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  rows={4}
                  className="w-full rounded-2xl border border-white/10 bg-[#050914] px-4 py-3 outline-none focus:border-cyan-400/40"
                  placeholder="Descrição do veículo"
                />
              </div>

              <div className="md:col-span-2 flex flex-wrap gap-6">
                <label className="flex items-center gap-2 text-sm text-white/75">
                  <input
                    type="checkbox"
                    checked={vehicleForm.venda}
                    onChange={(event) =>
                      setVehicleForm((current) => ({
                        ...current,
                        venda: event.target.checked,
                      }))
                    }
                  />
                  Venda
                </label>

                <label className="flex items-center gap-2 text-sm text-white/75">
                  <input
                    type="checkbox"
                    checked={vehicleForm.aluguel}
                    onChange={(event) =>
                      setVehicleForm((current) => ({
                        ...current,
                        aluguel: event.target.checked,
                      }))
                    }
                  />
                  Aluguel
                </label>

                <label className="flex items-center gap-2 text-sm text-white/75">
                  <input
                    type="checkbox"
                    checked={vehicleForm.featured}
                    onChange={(event) =>
                      setVehicleForm((current) => ({
                        ...current,
                        featured: event.target.checked,
                      }))
                    }
                  />
                  Destaque
                </label>

                <label className="flex items-center gap-2 text-sm text-white/75">
                  <input
                    type="checkbox"
                    checked={vehicleForm.active}
                    onChange={(event) =>
                      setVehicleForm((current) => ({
                        ...current,
                        active: event.target.checked,
                      }))
                    }
                  />
                  Veículo ativo
                </label>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                type="submit"
                disabled={savingVehicle || uploadingVehicleImage}
                className="rounded-2xl bg-gradient-to-r from-cyan-300 to-emerald-400 px-6 py-3 font-bold text-slate-950 transition hover:scale-[1.02] disabled:opacity-60"
              >
                {savingVehicle
                  ? "Salvando..."
                  : vehicleForm.id
                  ? "Salvar veículo"
                  : "Cadastrar veículo"}
              </button>

              {vehicleFeedback ? (
                <p className="text-sm text-white/75">{vehicleFeedback}</p>
              ) : null}
            </div>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16 md:px-8">
        <div className="grid gap-8 xl:grid-cols-2">
          <div className="rounded-[2rem] border border-white/10 bg-[#07101f]/92 p-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-emerald-300/80">
                  Locadoras
                </p>
                <h2 className="mt-2 text-3xl font-black">
                  {loading ? "Carregando..." : sellers.length}
                </h2>
              </div>
            </div>

            <div className="space-y-4">
              {sellers.map((seller) => (
                <div
                  key={seller.id}
                  className="rounded-[1.5rem] border border-white/10 bg-[#050914] p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10 font-black">
                      {seller.logo_text}
                    </div>
                    <div>
                      <p className="font-bold">{seller.name}</p>
                      <p className="text-sm text-white/60">{seller.tagline || "-"}</p>
                    </div>
                  </div>

                  <div className="mt-3 text-sm text-white/65">
                    {seller.city || "-"} {seller.state ? `- ${seller.state}` : ""}
                  </div>

                  <div className="mt-1 text-sm text-white/50">
                    {seller.phone || "Sem telefone"} | {seller.whatsapp || "Sem WhatsApp"}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => fillSellerForm(seller)}
                      className="rounded-2xl border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-400/15"
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleSellerActive(seller)}
                      className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                        seller.active
                          ? "border border-rose-400/25 bg-rose-400/10 text-rose-300 hover:bg-rose-400/15"
                          : "border border-emerald-400/25 bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/15"
                      }`}
                    >
                      {seller.active ? "Desativar" : "Ativar"}
                    </button>

                    <span
                      className={`rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] ${
                        seller.active
                          ? "border border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                          : "border border-white/10 bg-white/5 text-white/55"
                      }`}
                    >
                      {seller.active ? "Ativa" : "Inativa"}
                    </span>
                  </div>
                </div>
              ))}

              {!loading && sellers.length === 0 ? (
                <div className="rounded-[1.5rem] border border-white/10 bg-[#050914] p-4 text-white/60">
                  Nenhuma locadora cadastrada ainda.
                </div>
              ) : null}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-[#07101f]/92 p-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-cyan-300/80">
                  Veículos
                </p>
                <h2 className="mt-2 text-3xl font-black">
                  {loading ? "Carregando..." : vehicles.length}
                </h2>
              </div>
            </div>

            <div className="space-y-4 max-h-[900px] overflow-auto pr-1">
              {vehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="rounded-[1.5rem] border border-white/10 bg-[#050914] p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-bold">{vehicle.title}</p>
                      <p className="text-sm text-white/60">
                        {vehicle.brand} • {vehicle.model} • {vehicle.year}
                      </p>
                    </div>

                    {vehicle.featured ? (
                      <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                        Destaque
                      </span>
                    ) : null}
                  </div>

                  {vehicle.image ? (
                    <div className="mt-3 overflow-hidden rounded-2xl border border-white/10">
                      <img
                        src={vehicle.image}
                        alt={vehicle.title}
                        className="h-40 w-full object-cover"
                      />
                    </div>
                  ) : null}

                  <div className="mt-3 text-sm text-white/65">
                    Locadora: {vehicle.seller?.name || "Sem locadora"}
                  </div>

                  <div className="mt-1 text-sm text-white/50">
                    {vehicle.location}
                  </div>

                  <div className="mt-1 text-sm text-white/50">
                    Venda: {vehicle.price_sale ?? "-"} | Diária: {vehicle.price_rent_daily ?? "-"}
                  </div>

                  <div className="mt-1 text-sm text-white/50">
                    Modalidades: {vehicle.mode?.join(", ") || "-"}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => fillVehicleForm(vehicle)}
                      className="rounded-2xl border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-400/15"
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleVehicleActive(vehicle)}
                      className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                        vehicle.active
                          ? "border border-rose-400/25 bg-rose-400/10 text-rose-300 hover:bg-rose-400/15"
                          : "border border-emerald-400/25 bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/15"
                      }`}
                    >
                      {vehicle.active ? "Desativar" : "Ativar"}
                    </button>

                    <span
                      className={`rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] ${
                        vehicle.active
                          ? "border border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                          : "border border-white/10 bg-white/5 text-white/55"
                      }`}
                    >
                      {vehicle.active ? "Ativo" : "Inativo"}
                    </span>
                  </div>
                </div>
              ))}

              {!loading && vehicles.length === 0 ? (
                <div className="rounded-[1.5rem] border border-white/10 bg-[#050914] p-4 text-white/60">
                  Nenhum veículo cadastrado ainda.
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}