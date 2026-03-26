import {
  locadoraSellers,
  locadoraVehicles,
  type SellerItem,
  type VehicleItem,
} from "./locadora-data";
import { ensureActive, requireTenantId } from "./locadora-core";

export type SellerRecord = SellerItem;
export type VehicleRecord = VehicleItem;

export function listAllSellers() {
  return [...locadoraSellers];
}

export function listActiveSellers() {
  return locadoraSellers.filter((seller) => ensureActive(seller.active));
}

export function getSellerByIdFromRepository(sellerId: string) {
  return locadoraSellers.find((seller) => seller.id === sellerId) || null;
}

export function getSellerByTenantSlugFromRepository(tenantSlug: string) {
  return (
    locadoraSellers.find((seller) => seller.tenantSlug === tenantSlug) || null
  );
}

export function listVehicles() {
  return [...locadoraVehicles];
}

export function listActiveVehicles() {
  return locadoraVehicles.filter((vehicle) => vehicle.status === "disponivel");
}

export function listVehiclesByTenantSlug(tenantSlug: string) {
  const validTenantSlug = requireTenantId(tenantSlug);

  return locadoraVehicles.filter(
    (vehicle) => vehicle.tenantSlug === validTenantSlug
  );
}

export function listVehiclesBySellerId(sellerId: string) {
  return locadoraVehicles.filter((vehicle) => vehicle.sellerId === sellerId);
}

export function getVehicleById(vehicleId: string) {
  return locadoraVehicles.find((vehicle) => vehicle.id === vehicleId) || null;
}

export function getFeaturedVehiclesFromRepository() {
  return locadoraVehicles.filter(
    (vehicle) => vehicle.featured && vehicle.status === "disponivel"
  );
}

export function buildSellerPublicPagePath(tenantSlug: string) {
  const validTenantSlug = requireTenantId(tenantSlug);
  return `/locadora/${validTenantSlug}`;
}

export function buildVehiclePublicPagePath(vehicle: {
  tenantSlug: string;
  id: string;
}) {
  const validTenantSlug = requireTenantId(vehicle.tenantSlug);
  return `/locadora/${validTenantSlug}/veiculo/${vehicle.id}`;
}

export function mapSellerToAdminRow(seller: SellerRecord) {
  return {
    id: seller.id,
    tenant_slug: seller.tenantSlug,
    company_name: seller.companyName,
    name: seller.tradeName,
    type: seller.type,
    tagline: seller.tagline || null,
    phone: seller.phone || null,
    whatsapp: seller.whatsapp || null,
    logo_text: seller.logoText,
    city: seller.city || null,
    state: seller.state || null,
    active: seller.active,
    featured: Boolean(seller.featured),
  };
}

export function mapVehicleToAdminRow(vehicle: VehicleRecord) {
  const seller = getSellerByIdFromRepository(vehicle.sellerId);

  return {
    id: vehicle.id,
    tenant_slug: vehicle.tenantSlug,
    seller_id: vehicle.sellerId,
    slug: vehicle.id,
    title: vehicle.title,
    brand: vehicle.brand,
    model: vehicle.model,
    year: vehicle.year,
    category: vehicle.category,
    fuel: vehicle.fuel,
    transmission: vehicle.transmission,
    mode: vehicle.mode,
    status: vehicle.status,
    price_sale: vehicle.priceSale ?? null,
    price_rent_daily: vehicle.priceRentDaily ?? null,
    location: vehicle.location,
    city: vehicle.city,
    state: vehicle.state,
    image: vehicle.image,
    featured: Boolean(vehicle.featured),
    active: vehicle.status !== "inativo",
    description: vehicle.description,
    badge: vehicle.badge || null,
    platform_commission_percent: vehicle.platformCommissionPercent ?? null,
    seller: seller
      ? {
          id: seller.id,
          tenant_slug: seller.tenantSlug,
          company_name: seller.companyName,
          name: seller.tradeName,
          logo_text: seller.logoText,
          tagline: seller.tagline || null,
          phone: seller.phone || null,
          whatsapp: seller.whatsapp || null,
        }
      : null,
  };
}