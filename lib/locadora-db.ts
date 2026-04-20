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
      company: null,
      listing: null,
    };
  }

  const isActive = payload.active ?? true;
  const isFeatured = payload.featured ?? false;

  const { data: seller, error: sellerError } = await client
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
      active: isActive,
      featured: isFeatured,
    })
    .select("*")
    .single();

  if (sellerError) {
    throw new Error(sellerError.message || "Erro ao criar locadora no banco.");
  }

  let company: any = null;
  let listing: any = null;

  const { data: existingCompany, error: existingCompanyError } = await client
    .from("companies")
    .select("id, name, slug")
    .eq("slug", payload.tenantSlug)
    .maybeSingle();

  if (existingCompanyError) {
    console.error(
      "[locadora-db] erro ao procurar company existente:",
      existingCompanyError
    );
  }

  if (existingCompany) {
    company = existingCompany;

    const { error: updateCompanyError } = await client
      .from("companies")
      .update({
        name: payload.companyName,
        city: payload.city ?? null,
        state: payload.state ?? null,
        whatsapp: payload.whatsapp ?? null,
        phone: payload.phone ?? null,
        is_active: isActive,
      })
      .eq("id", existingCompany.id);

    if (updateCompanyError) {
      console.error(
        "[locadora-db] erro ao atualizar company existente:",
        updateCompanyError
      );
    }
  } else {
    const { data: createdCompany, error: companyError } = await client
      .from("companies")
      .insert({
        name: payload.companyName,
        slug: payload.tenantSlug,
        city: payload.city ?? null,
        state: payload.state ?? null,
        whatsapp: payload.whatsapp ?? null,
        phone: payload.phone ?? null,
        is_active: isActive,
      })
      .select("*")
      .single();

    if (companyError) {
      throw new Error(companyError.message || "Erro ao criar company.");
    }

    company = createdCompany;
  }

  if (company?.id) {
    const { data: existingListing, error: existingListingError } = await client
      .from("listings")
      .select("id, company_id, module")
      .eq("company_id", company.id)
      .eq("module", "locadora")
      .maybeSingle();

    if (existingListingError) {
      console.error(
        "[locadora-db] erro ao procurar listing existente:",
        existingListingError
      );
    }

    if (existingListing) {
      const { data: updatedListing, error: updateListingError } = await client
        .from("listings")
        .update({
          category: "locadora",
          title: payload.tradeName || payload.companyName,
          description: payload.tagline ?? null,
          city: payload.city ?? null,
          state: payload.state ?? null,
          is_active: isActive,
          is_featured: isFeatured,
        })
        .eq("id", existingListing.id)
        .select("*")
        .single();

      if (updateListingError) {
        console.error(
          "[locadora-db] erro ao atualizar listing existente:",
          updateListingError
        );
      } else {
        listing = updatedListing;
      }
    } else {
      const { data: createdListing, error: listingError } = await client
        .from("listings")
        .insert({
          company_id: company.id,
          module: "locadora",
          category: "locadora",
          title: payload.tradeName || payload.companyName,
          description: payload.tagline ?? null,
          city: payload.city ?? null,
          state: payload.state ?? null,
          is_active: isActive,
          is_featured: isFeatured,
        })
        .select("*")
        .single();

      if (listingError) {
        throw new Error(listingError.message || "Erro ao criar listing.");
      }

      listing = createdListing;
    }
  }

  return {
    mode: "database" as const,
    seller,
    company,
    listing,
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