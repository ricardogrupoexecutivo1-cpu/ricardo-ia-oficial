import { getLocadoraServerClient } from "./supabase-locadora-server";

type SearchParams = {
  brand?: string;
  model?: string;
  city?: string;
  state?: string;
  quantity?: number;
};

export async function searchVehicles(params: SearchParams) {
  const supabase = getLocadoraServerClient();

  if (!supabase) {
    return {
      vehicles: [],
      stage: "no_db",
    };
  }

  const { brand, model, city, state, quantity = 1 } = params;

  // =========================================
  // 1️⃣ BUSCA NA CIDADE
  // =========================================
  let query = supabase
    .from("locadora_vehicles")
    .select("*")
    .eq("active", true)
    .gte("quantity_available", quantity);

  if (brand) query = query.ilike("brand", `%${brand}%`);
  if (model) query = query.ilike("model", `%${model}%`);
  if (city) query = query.ilike("search_city", `%${city}%`);

  let { data: vehiclesCity } = await query;

  if (vehiclesCity && vehiclesCity.length > 0) {
    return {
      vehicles: vehiclesCity,
      stage: "city",
    };
  }

  // =========================================
  // 2️⃣ BUSCA NO ESTADO
  // =========================================
  query = supabase
    .from("locadora_vehicles")
    .select("*")
    .eq("active", true)
    .gte("quantity_available", quantity);

  if (brand) query = query.ilike("brand", `%${brand}%`);
  if (model) query = query.ilike("model", `%${model}%`);
  if (state) query = query.ilike("search_state", `%${state}%`);

  let { data: vehiclesState } = await query;

  if (vehiclesState && vehiclesState.length > 0) {
    return {
      vehicles: vehiclesState,
      stage: "state",
    };
  }

  // =========================================
  // 3️⃣ BUSCA NACIONAL
  // =========================================
  query = supabase
    .from("locadora_vehicles")
    .select("*")
    .eq("active", true)
    .gte("quantity_available", quantity);

  if (brand) query = query.ilike("brand", `%${brand}%`);
  if (model) query = query.ilike("model", `%${model}%`);

  let { data: vehiclesBrasil } = await query;

  return {
    vehicles: vehiclesBrasil || [],
    stage: "brazil",
  };
}