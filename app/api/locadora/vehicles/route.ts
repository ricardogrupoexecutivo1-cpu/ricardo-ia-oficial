import { NextResponse } from "next/server";
import { getLocadoraServerClient } from "@/lib/supabase-locadora-server";
import { locadoraVehicles } from "@/lib/locadora-data";

export async function GET() {
  try {
    const supabase = getLocadoraServerClient();

    if (!supabase) {
      return NextResponse.json({
        vehicles: locadoraVehicles,
        source: "local-fallback",
      });
    }

    const { data, error } = await supabase
      .from("locadora_vehicles")
      .select(`
        id,
        slug,
        title,
        brand,
        model,
        year,
        category,
        fuel,
        transmission,
        mode,
        price_sale,
        price_rent_daily,
        location,
        image,
        featured,
        description,
        badge,
        seller:locadora_sellers (
          name,
          logo_text,
          tagline,
          phone,
          whatsapp
        )
      `)
      .eq("active", true)
      .order("featured", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar veículos no Supabase:", error);

      return NextResponse.json({
        vehicles: locadoraVehicles,
        source: "local-fallback-error",
      });
    }

    const vehicles =
      data?.map((item) => {
        const seller = Array.isArray(item.seller) ? item.seller[0] : item.seller;

        return {
          id: item.slug || item.id,
          title: item.title,
          brand: item.brand,
          model: item.model,
          year: item.year,
          category: item.category,
          fuel: item.fuel,
          transmission: item.transmission,
          mode: item.mode || ["venda"],
          priceSale: item.price_sale,
          priceRentDaily: item.price_rent_daily,
          location: item.location,
          image: item.image,
          featured: item.featured,
          description: item.description,
          sellerName: seller?.name || "Locadora",
          sellerLogo: seller?.logo_text || "LC",
          sellerTagline: seller?.tagline || "Locadora parceira",
          badge: item.badge || undefined,
          sellerPhone: seller?.phone || "",
          sellerWhatsapp: seller?.whatsapp || "",
        };
      }) || [];

    if (!vehicles.length) {
      return NextResponse.json({
        vehicles: locadoraVehicles,
        source: "local-fallback-empty",
      });
    }

    return NextResponse.json({
      vehicles,
      source: "supabase",
    });
  } catch (error) {
    console.error("Erro geral ao listar veículos:", error);

    return NextResponse.json({
      vehicles: locadoraVehicles,
      source: "local-fallback-exception",
    });
  }
}