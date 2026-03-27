export type AuroraCoverageType =
  | "local"
  | "regional"
  | "state"
  | "national";

export type AuroraLocationRecord = {
  country?: string | null;
  state?: string | null;
  city?: string | null;
  neighborhood?: string | null;
  postalCode?: string | null;
  latitude?: number | null;
  longitude?: number | null;
};

export type AuroraCoverageRecord = {
  coverageType: AuroraCoverageType;
  maxRadiusKm?: number | null;
  servesCities?: string[] | null;
  servesStates?: string[] | null;
  servesNationally?: boolean | null;
  deliveryAvailable?: boolean | null;
  pickupAvailable?: boolean | null;
};

export type AuroraSearchLocationInput = {
  city?: string | null;
  state?: string | null;
  latitude?: number | null;
  longitude?: number | null;
};

export type AuroraDistanceResult = {
  distanceKm: number | null;
  sameCity: boolean;
  sameState: boolean;
  coverageMatch: boolean;
  score: number;
};

function normalizeText(value?: string | null) {
  if (!value) return null;

  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

export function areSameCity(
  aCity?: string | null,
  aState?: string | null,
  bCity?: string | null,
  bState?: string | null
) {
  const cityA = normalizeText(aCity);
  const cityB = normalizeText(bCity);
  const stateA = normalizeText(aState);
  const stateB = normalizeText(bState);

  return Boolean(cityA && cityB && stateA && stateB && cityA === cityB && stateA === stateB);
}

export function areSameState(aState?: string | null, bState?: string | null) {
  const stateA = normalizeText(aState);
  const stateB = normalizeText(bState);

  return Boolean(stateA && stateB && stateA === stateB);
}

export function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

export function calculateDistanceKm(
  fromLat?: number | null,
  fromLng?: number | null,
  toLat?: number | null,
  toLng?: number | null
) {
  if (
    typeof fromLat !== "number" ||
    typeof fromLng !== "number" ||
    typeof toLat !== "number" ||
    typeof toLng !== "number"
  ) {
    return null;
  }

  const earthRadiusKm = 6371;
  const deltaLat = toRadians(toLat - fromLat);
  const deltaLng = toRadians(toLng - fromLng);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(toRadians(fromLat)) *
      Math.cos(toRadians(toLat)) *
      Math.sin(deltaLng / 2) *
      Math.sin(deltaLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Number((earthRadiusKm * c).toFixed(1));
}

export function locationMatchesCoverage(
  listingLocation: AuroraLocationRecord,
  coverage: AuroraCoverageRecord,
  search: AuroraSearchLocationInput
) {
  if (coverage.servesNationally || coverage.coverageType === "national") {
    return true;
  }

  const searchState = normalizeText(search.state);
  const searchCity = normalizeText(search.city);

  const servesStates = (coverage.servesStates ?? [])
    .map((state) => normalizeText(state))
    .filter(Boolean) as string[];

  const servesCities = (coverage.servesCities ?? [])
    .map((city) => normalizeText(city))
    .filter(Boolean) as string[];

  if (searchCity && searchState) {
    if (
      areSameCity(listingLocation.city, listingLocation.state, search.city, search.state)
    ) {
      return true;
    }

    if (servesCities.includes(searchCity)) {
      return true;
    }
  }

  if (searchState) {
    if (areSameState(listingLocation.state, search.state)) {
      return true;
    }

    if (servesStates.includes(searchState)) {
      return true;
    }
  }

  const distanceKm = calculateDistanceKm(
    search.latitude,
    search.longitude,
    listingLocation.latitude,
    listingLocation.longitude
  );

  if (
    typeof distanceKm === "number" &&
    typeof coverage.maxRadiusKm === "number" &&
    distanceKm <= coverage.maxRadiusKm
  ) {
    return true;
  }

  return false;
}

export function calculateLocationScore(
  listingLocation: AuroraLocationRecord,
  coverage: AuroraCoverageRecord,
  search: AuroraSearchLocationInput
): AuroraDistanceResult {
  const sameCity = areSameCity(
    listingLocation.city,
    listingLocation.state,
    search.city,
    search.state
  );

  const sameState = areSameState(listingLocation.state, search.state);

  const distanceKm = calculateDistanceKm(
    search.latitude,
    search.longitude,
    listingLocation.latitude,
    listingLocation.longitude
  );

  const coverageMatch = locationMatchesCoverage(
    listingLocation,
    coverage,
    search
  );

  let score = 0;

  if (sameCity) {
    score += 100;
  }

  if (!sameCity && sameState) {
    score += 60;
  }

  if (coverageMatch) {
    score += 40;
  }

  if (coverage.deliveryAvailable) {
    score += 15;
  }

  if (coverage.pickupAvailable) {
    score += 5;
  }

  if (typeof distanceKm === "number") {
    if (distanceKm <= 20) score += 35;
    else if (distanceKm <= 50) score += 25;
    else if (distanceKm <= 150) score += 15;
    else if (distanceKm <= 500) score += 8;
    else score += 2;
  }

  if (coverage.coverageType === "national") {
    score += 10;
  }

  return {
    distanceKm,
    sameCity,
    sameState,
    coverageMatch,
    score,
  };
}

export function compareListingsByLocationScore(
  a: AuroraDistanceResult,
  b: AuroraDistanceResult
) {
  return b.score - a.score;
}