export type LocationRecord = {
  country: string;
  countryCode: string;
  state: string;
  stateCode: string;
  city: string;
  municipality: string;
  neighborhood?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
};

export type SearchScope =
  | "country"
  | "state"
  | "city"
  | "municipality"
  | "neighborhood";

export const BRAZIL_DEFAULT_COUNTRY = "Brasil";
export const BRAZIL_DEFAULT_COUNTRY_CODE = "BR";

export function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

export function slugify(value: string): string {
  return normalizeText(value)
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function buildLocationSlug(location: Partial<LocationRecord>): string {
  const parts = [
    location.country,
    location.state,
    location.city,
    location.municipality,
    location.neighborhood,
  ]
    .filter(Boolean)
    .map((item) => slugify(String(item)));

  return parts.join("/");
}

export function buildLocationLabel(location: Partial<LocationRecord>): string {
  const parts = [
    location.neighborhood,
    location.municipality,
    location.city,
    location.state,
    location.country,
  ].filter(Boolean);

  return parts.join(", ");
}

export function isBrazil(location: Partial<LocationRecord>): boolean {
  return (
    normalizeText(location.country ?? "") === normalizeText(BRAZIL_DEFAULT_COUNTRY) ||
    normalizeText(location.countryCode ?? "") === normalizeText(BRAZIL_DEFAULT_COUNTRY_CODE)
  );
}

export function getSearchPriority(scope: SearchScope): number {
  switch (scope) {
    case "neighborhood":
      return 5;
    case "municipality":
      return 4;
    case "city":
      return 3;
    case "state":
      return 2;
    case "country":
    default:
      return 1;
  }
}

export function matchByScope(
  location: Partial<LocationRecord>,
  query: string,
  scope: SearchScope
): boolean {
  const normalizedQuery = normalizeText(query);

  if (!normalizedQuery) return true;

  switch (scope) {
    case "country":
      return normalizeText(location.country ?? "").includes(normalizedQuery);

    case "state":
      return (
        normalizeText(location.state ?? "").includes(normalizedQuery) ||
        normalizeText(location.stateCode ?? "").includes(normalizedQuery)
      );

    case "city":
      return normalizeText(location.city ?? "").includes(normalizedQuery);

    case "municipality":
      return normalizeText(location.municipality ?? "").includes(normalizedQuery);

    case "neighborhood":
      return normalizeText(location.neighborhood ?? "").includes(normalizedQuery);

    default:
      return false;
  }
}

export function locationMatchesAnyField(
  location: Partial<LocationRecord>,
  query: string
): boolean {
  const normalizedQuery = normalizeText(query);

  if (!normalizedQuery) return true;

  const fields = [
    location.country,
    location.countryCode,
    location.state,
    location.stateCode,
    location.city,
    location.municipality,
    location.neighborhood,
    location.postalCode,
  ]
    .filter(Boolean)
    .map((item) => normalizeText(String(item)));

  return fields.some((field) => field.includes(normalizedQuery));
}

export function parseBrazilLocation(input: {
  state: string;
  stateCode: string;
  city: string;
  municipality?: string;
  neighborhood?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
}): LocationRecord {
  return {
    country: BRAZIL_DEFAULT_COUNTRY,
    countryCode: BRAZIL_DEFAULT_COUNTRY_CODE,
    state: input.state,
    stateCode: input.stateCode,
    city: input.city,
    municipality: input.municipality ?? input.city,
    neighborhood: input.neighborhood,
    postalCode: input.postalCode,
    latitude: input.latitude,
    longitude: input.longitude,
  };
}

export const seedLocations: LocationRecord[] = [
  parseBrazilLocation({
    state: "Minas Gerais",
    stateCode: "MG",
    city: "Belo Horizonte",
    municipality: "Belo Horizonte",
    neighborhood: "Centro",
  }),
  parseBrazilLocation({
    state: "Minas Gerais",
    stateCode: "MG",
    city: "Lagoa Santa",
    municipality: "Lagoa Santa",
  }),
  parseBrazilLocation({
    state: "Minas Gerais",
    stateCode: "MG",
    city: "Vespasiano",
    municipality: "Vespasiano",
  }),
  parseBrazilLocation({
    state: "Minas Gerais",
    stateCode: "MG",
    city: "Pedro Leopoldo",
    municipality: "Pedro Leopoldo",
  }),
  parseBrazilLocation({
    state: "Minas Gerais",
    stateCode: "MG",
    city: "Santa Luzia",
    municipality: "Santa Luzia",
  }),
  parseBrazilLocation({
    state: "São Paulo",
    stateCode: "SP",
    city: "São Paulo",
    municipality: "São Paulo",
  }),
  parseBrazilLocation({
    state: "Rio de Janeiro",
    stateCode: "RJ",
    city: "Rio de Janeiro",
    municipality: "Rio de Janeiro",
  }),
];

export function groupLocationsByState(locations: LocationRecord[]) {
  return locations.reduce<Record<string, LocationRecord[]>>((acc, location) => {
    const key = slugify(location.state);

    if (!acc[key]) {
      acc[key] = [];
    }

    acc[key].push(location);
    return acc;
  }, {});
}

export function groupLocationsByCity(locations: LocationRecord[]) {
  return locations.reduce<Record<string, LocationRecord[]>>((acc, location) => {
    const key = `${slugify(location.state)}:${slugify(location.city)}`;

    if (!acc[key]) {
      acc[key] = [];
    }

    acc[key].push(location);
    return acc;
  }, {});
}