import type { SupabaseClient } from "@supabase/supabase-js";
import { getLocadoraServerClient } from "./supabase-locadora-server";
import {
  listAllSellers,
  listVehicles,
  mapSellerToAdminRow,
  mapVehicleToAdminRow,
} from "./locadora-repository";

const SELLERS_TABLE = "locadora_sellers";
const VEHICLES_TABLE = "locadora_vehicles";

type DbMode = "database" | "mock";

function getClient(): SupabaseClient | null {
  return getLocadoraServerClient();
}

export function getLocadoraDbMode(): DbMode {
  return getClient() ? "database" : "mock";
}

export async function listSellersFromDbOrMock() {
  const client = getClient();

  if (!client) {
    return {
      mode: "mock" as const,
      sellers: listAllSellers().map(mapSellerToAdminRow),
    };
  }

  const { data, error } = await client
    .from(SELLERS_TABLE)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[locadora-db] erro ao buscar sellers no Supabase:", error);
    return {
      mode: "mock" as const,
      sellers: listAllSellers().map(mapSellerToAdminRow),
    };
  }

  return {
    mode: "database" as const,
    sellers: Array.isArray(data) ? data : [],
  };
}

export async function listVehiclesFromDbOrMock() {
  const client = getClient();

  if (!client) {
    return {
      mode: "mock" as const,
      vehicles: listVehicles().map(mapVehicleToAdminRow),
    };
  }

  const { data, error } = await client
    .from(VEHICLES_TABLE)
    .select(
      `
        *,
        seller:locadora_sellers (
          id,
          tenant_slug,
          company_name,
          trade_name,
          logo_text,
          tagline,
          phone,
          whatsapp
        )
      `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[locadora-db] erro ao buscar veículos no Supabase:", error);
    return {
      mode: "mock" as const,
      vehicles: listVehicles().map(mapVehicleToAdminRow),
    };
  }

  const vehicles = (Array.isArray(data) ? data : []).map((item: any) => ({
    ...item,
    seller: item?.seller
      ? {
          id: item.seller.id,
          tenant_slug: item.seller.tenant_slug ?? null,
          company_name: item.seller.company_name ?? null,
          name: item.seller.trade_name ?? null,
          logo_text: item.seller.logo_text ?? "",
          tagline: item.seller.tagline ?? null,
          phone: item.seller.phone ?? null,
          whatsapp: item.seller.whatsapp ?? null,
        }
      : null,
  }));

  return {
    mode: "database" as const,
    vehicles,
  };
}

export async function createSellerInDb(payload: {
  tenantSlug: string;
  companyName: string;
  tradeName: string;
  type: string;
  tagline?: string;
  phone?: string;
  whatsapp?: string;
  logoText: string;
  city?: string;
  state?: string;
  active?: boolean;
  featured?: boolean;
}) {
  const client = getClient();

  if (!client) {
    return {
      mode: "mock" as const,
      seller: {
        id: `mock-seller-${Date.now()}`,
        tenant_slug: payload.tenantSlug,
        company_name: payload.companyName,
        trade_name: payload.tradeName,
        type: payload.type,
        tagline: payload.tagline ?? null,
        phone: payload.phone ?? null,
        whatsapp: payload.whatsapp ?? null,
        logo_text: payload.logoText,
        city: payload.city ?? null,
        state: payload.state ?? null,
        active: payload.active ?? true,
        featured: payload.featured ?? false,
      },
    };
  }

  const { data, error } = await client
    .from(SELLERS_TABLE)
    .insert({
      tenant_slug: payload.tenantSlug,
      company_name: payload.companyName,
      trade_name: payload.tradeName,
      type: payload.type,
      tagline: payload.tagline ?? null,
      phone: payload.phone ?? null,
      whatsapp: payload.whatsapp ?? null,
      logo_text: payload.logoText,
      city: payload.city ?? null,
      state: payload.state ?? null,
      active: payload.active ?? true,
      featured: payload.featured ?? false,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message || "Erro ao criar locadora no banco.");
  }

  return {
    mode: "database" as const,
    seller: data,
  };
}

export async function createVehicleInDb(payload: {
  tenantSlug: string;
  sellerId: string;
  slug: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  category: string;
  fuel: string;
  transmission: string;
  mode: string[];
  status?: string;
  priceSale?: number | null;
  priceRentDaily?: number | null;
  location: string;
  city?: string;
  state?: string;
  image: string;
  featured?: boolean;
  description: string;
  badge?: string;
  platformCommissionPercent?: number | null;
}) {
  const client = getClient();

  if (!client) {
    return {
      mode: "mock" as const,
      vehicle: {
        id: `mock-vehicle-${Date.now()}`,
        tenant_slug: payload.tenantSlug,
        seller_id: payload.sellerId,
        slug: payload.slug,
        title: payload.title,
        brand: payload.brand,
        model: payload.model,
        year: payload.year,
        category: payload.category,
        fuel: payload.fuel,
        transmission: payload.transmission,
        mode: payload.mode,
        status: payload.status ?? "disponivel",
        price_sale: payload.priceSale ?? null,
        price_rent_daily: payload.priceRentDaily ?? null,
        location: payload.location,
        city: payload.city ?? null,
        state: payload.state ?? null,
        image: payload.image,
        featured: payload.featured ?? false,
        description: payload.description,
        badge: payload.badge ?? null,
        platform_commission_percent: payload.platformCommissionPercent ?? null,
      },
    };
  }

  const { data, error } = await client
    .from(VEHICLES_TABLE)
    .insert({
      tenant_slug: payload.tenantSlug,
      seller_id: payload.sellerId,
      slug: payload.slug,
      title: payload.title,
      brand: payload.brand,
      model: payload.model,
      year: payload.year,
      category: payload.category,
      fuel: payload.fuel,
      transmission: payload.transmission,
      mode: payload.mode,
      status: payload.status ?? "disponivel",
      price_sale: payload.priceSale ?? null,
      price_rent_daily: payload.priceRentDaily ?? null,
      location: payload.location,
      city: payload.city ?? null,
      state: payload.state ?? null,
      image: payload.image,
      featured: payload.featured ?? false,
      description: payload.description,
      badge: payload.badge ?? null,
      platform_commission_percent: payload.platformCommissionPercent ?? null,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message || "Erro ao criar veículo no banco.");
  }

  return {
    mode: "database" as const,
    vehicle: data,
  };
}