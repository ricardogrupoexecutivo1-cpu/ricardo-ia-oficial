import { NextRequest, NextResponse } from "next/server";
import { getLocadoraServerClient } from "@/lib/supabase-locadora-server";

type LeadBody = {
  name?: string;
  phone?: string;
  email?: string;
  interest?: string;
  vehicleId?: string;
  message?: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as LeadBody;

    const name = (body.name || "").trim();
    const phone = (body.phone || "").trim();
    const email = (body.email || "").trim().toLowerCase();
    const interest = (body.interest || "").trim();
    const vehicleId = (body.vehicleId || "").trim();
    const message = (body.message || "").trim();

    if (!name) {
      return NextResponse.json({ error: "Informe seu nome." }, { status: 400 });
    }

    if (!phone && !email) {
      return NextResponse.json(
        { error: "Informe telefone ou e-mail para contato." },
        { status: 400 }
      );
    }

    const supabase = getLocadoraServerClient();

    const lead = {
      name,
      phone: phone || null,
      email: email || null,
      interest: interest || null,
      vehicle_id: vehicleId || null,
      message: message || null,
      source: "aurora-locadora",
    };

    if (supabase) {
      const { error } = await supabase.from("locadora_leads").insert(lead);

      if (error) {
        console.error("Erro ao salvar lead no Supabase:", error);
        return NextResponse.json(
          { error: "Erro ao salvar lead no banco." },
          { status: 500 }
        );
      }
    } else {
      console.log("SUPABASE_SERVICE_ROLE_KEY ou URL ausente. Lead em modo fallback:", lead);
    }

    return NextResponse.json({
      success: true,
      message: "Lead enviado com sucesso.",
    });
  } catch (error) {
    console.error("Erro ao receber lead da locadora:", error);

    return NextResponse.json(
      { error: "Erro ao enviar lead." },
      { status: 500 }
    );
  }
}