import { createClient } from "@supabase/supabase-js";
import type {
  AuroraCoverageRecord,
  AuroraLocationRecord,
} from "@/lib/aurora-location";
import type {
  CompanyContactRecord,
  CompanyRecord,
} from "@/lib/company-contacts";

type ListingRow = {
  id: string;
  company_id: string;
  contact_id: string | null;
  module: string;
  category: string;
  subcategory: string | null;
  title: string;
  description: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  image_url: string | null;
  price: number | null;
  whatsapp_override: string | null;
  delivery_available: boolean;
  pickup_available: boolean;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
};

type CompanyRow = {
  id: string;
  name: string;
  slug: string | null;
  city: string | null;
  state: string | null;
  whatsapp: string | null;
  phone: string | null;
  email: string | null;
  logo_url: string | null;
  is_active: boolean | null;
};

type ContactRow = {
  id: string;
  company_id: string;
  name: string;
  role:
    | "owner"
    | "manager"
    | "sales"
    | "buyer"
    | "support"
    | "finance"
    | "custom";
  whatsapp: string | null;
  phone: string | null;
  email: string | null;
  is_primary: boolean | null;
  is_active: boolean | null;
};

type LocationRow = {
  listing_id: string;
  country: string | null;
  state: string | null;
  city: string | null;
  neighborhood: string | null;
  postal_code: string | null;
  latitude: number | null;
  longitude: number | null;
  coverage_type: "local" | "regional" | "state" | "national";
  max_radius_km: number | null;
  serves_cities: string[] | null;
  serves_states: string[] | null;
  serves_nationally: boolean | null;
  delivery_available: boolean;
  pickup_available: boolean;
};

export type LocadoraListingFromDb = {
  id: string;
  module: string;
  category: string;
  subcategory: string | null;
  title: string;
  description: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  imageUrl: string | null;
  price: number | null;
  whatsappOverride: string | null;
  deliveryAvailable: boolean;
  pickupAvailable: boolean;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  companyId: string;
  contactId: string | null;
  company: CompanyRecord | null;
  contacts: CompanyContactRecord[];
  location: AuroraLocationRecord;
  coverage: AuroraCoverageRecord;
};

function getSupabaseAdmin() {
  const url =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  if (!url || !serviceRoleKey) {
    throw new Error(
      "SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórias."
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function mapCompany(row: CompanyRow | null | undefined): CompanyRecord | null {
  if (!row) return null;

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    city: row.city,
    state: row.state,
    whatsapp: row.whatsapp,
    phone: row.phone,
    email: row.email,
    logoUrl: row.logo_url,
    isActive: row.is_active ?? true,
  };
}

function mapContact(row: ContactRow): CompanyContactRecord {
  return {
    id: row.id,
    companyId: row.company_id,
    name: row.name,
    role: row.role,
    whatsapp: row.whatsapp,
    phone: row.phone,
    email: row.email,
    isPrimary: row.is_primary ?? false,
    isActive: row.is_active ?? true,
  };
}

function mapLocation(row: LocationRow | null | undefined): {
  location: AuroraLocationRecord;
  coverage: AuroraCoverageRecord;
} {
  if (!row) {
    return {
      location: {
        country: "Brasil",
        state: null,
        city: null,
        neighborhood: null,
        postalCode: null,
        latitude: null,
        longitude: null,
      },
      coverage: {
        coverageType: "local",
        maxRadiusKm: null,
        servesCities: [],
        servesStates: [],
        servesNationally: false,
        deliveryAvailable: false,
        pickupAvailable: false,
      },
    };
  }

  return {
    location: {
      country: row.country,
      state: row.state,
      city: row.city,
      neighborhood: row.neighborhood,
      postalCode: row.postal_code,
      latitude: row.latitude,
      longitude: row.longitude,
    },
    coverage: {
      coverageType: row.coverage_type,
      maxRadiusKm: row.max_radius_km,
      servesCities: row.serves_cities ?? [],
      servesStates: row.serves_states ?? [],
      servesNationally: row.serves_nationally ?? false,
      deliveryAvailable: row.delivery_available,
      pickupAvailable: row.pickup_available,
    },
  };
}

export async function getLocadoraListings(): Promise<LocadoraListingFromDb[]> {
  const supabase = getSupabaseAdmin();

  const { data: listingsData, error: listingsError } = await supabase
    .from("listings")
    .select(
      `
      id,
      company_id,
      contact_id,
      module,
      category,
      subcategory,
      title,
      description,
      city,
      state,
      country,
      image_url,
      price,
      whatsapp_override,
      delivery_available,
      pickup_available,
      is_active,
      is_featured,
      created_at,
      updated_at
    `
    )
    .eq("module", "locadora")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (listingsError) {
    console.error("Erro ao buscar listings da locadora:", listingsError);
    return [];
  }

  const listings = (listingsData ?? []) as ListingRow[];

  if (!listings.length) {
    return [];
  }

  const companyIds = Array.from(new Set(listings.map((item) => item.company_id)));
  const listingIds = listings.map((item) => item.id);

  const [
    { data: companiesData, error: companiesError },
    { data: contactsData, error: contactsError },
    { data: locationsData, error: locationsError },
  ] = await Promise.all([
    supabase
      .from("companies")
      .select(
        `
        id,
        name,
        slug,
        city,
        state,
        whatsapp,
        phone,
        email,
        logo_url,
        is_active
      `
      )
      .in("id", companyIds),
    supabase
      .from("company_contacts")
      .select(
        `
        id,
        company_id,
        name,
        role,
        whatsapp,
        phone,
        email,
        is_primary,
        is_active
      `
      )
      .in("company_id", companyIds)
      .eq("is_active", true),
    supabase
      .from("listing_locations")
      .select(
        `
        listing_id,
        country,
        state,
        city,
        neighborhood,
        postal_code,
        latitude,
        longitude,
        coverage_type,
        max_radius_km,
        serves_cities,
        serves_states,
        serves_nationally,
        delivery_available,
        pickup_available
      `
      )
      .in("listing_id", listingIds),
  ]);

  if (companiesError) {
    console.error("Erro ao buscar companies da locadora:", companiesError);
  }

  if (contactsError) {
    console.error("Erro ao buscar contacts da locadora:", contactsError);
  }

  if (locationsError) {
    console.error("Erro ao buscar locations da locadora:", locationsError);
  }

  const companies = ((companiesData ?? []) as CompanyRow[]).map(mapCompany);
  const contacts = ((contactsData ?? []) as ContactRow[]).map(mapContact);
  const locations = (locationsData ?? []) as LocationRow[];

  const companiesById = new Map(
    companies.filter(Boolean).map((company) => [company!.id, company!])
  );

  const contactsByCompanyId = new Map<string, CompanyContactRecord[]>();
  for (const contact of contacts) {
    const current = contactsByCompanyId.get(contact.companyId) ?? [];
    current.push(contact);
    contactsByCompanyId.set(contact.companyId, current);
  }

  const locationsByListingId = new Map<string, LocationRow>();
  for (const location of locations) {
    locationsByListingId.set(location.listing_id, location);
  }

  return listings.map((listing) => {
    const company = companiesById.get(listing.company_id) ?? null;
    const companyContacts = contactsByCompanyId.get(listing.company_id) ?? [];
    const locationRow = locationsByListingId.get(listing.id);
    const mappedLocation = mapLocation(locationRow);

    return {
      id: listing.id,
      module: listing.module,
      category: listing.category,
      subcategory: listing.subcategory,
      title: listing.title,
      description: listing.description,
      city: listing.city,
      state: listing.state,
      country: listing.country,
      imageUrl: listing.image_url,
      price: listing.price,
      whatsappOverride: listing.whatsapp_override,
      deliveryAvailable: listing.delivery_available,
      pickupAvailable: listing.pickup_available,
      isActive: listing.is_active,
      isFeatured: listing.is_featured,
      createdAt: listing.created_at,
      updatedAt: listing.updated_at,
      companyId: listing.company_id,
      contactId: listing.contact_id,
      company,
      contacts: companyContacts,
      location: mappedLocation.location,
      coverage: mappedLocation.coverage,
    };
  });
}