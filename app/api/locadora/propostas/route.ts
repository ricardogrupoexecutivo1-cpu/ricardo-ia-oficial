import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function normalizarNumero(valor: unknown) {
  const limpo = String(valor ?? "")
    .trim()
    .replace(/\s/g, "")
    .replace(/\./g, "")
    .replace(",", ".")
    .replace(/[^\d.-]/g, "");

  const numero = Number(limpo);
  return isNaN(numero) ? 0 : numero;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const ownerEmail = searchParams.get("ownerEmail");

    if (!ownerEmail) {
      return NextResponse.json(
        { error: "ownerEmail required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("locadora_propostas")
      .select("*")
      .eq("owner_email", ownerEmail)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Erro ao listar propostas" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const valor = normalizarNumero(body.valor);
    const percentual = normalizarNumero(body.comissao_percentual || 0);
    const comissaoValor = Number(((valor * percentual) / 100).toFixed(2));

    const payload = {
      cliente_id: body.cliente_id || null,
      cliente_nome: body.cliente_nome || "",
      cliente_email: body.cliente_email || "",
      cliente_whatsapp: body.cliente_whatsapp || "",
      veiculo_id: body.veiculo_id || null,
      veiculo_nome: body.veiculo_nome || "",
      valor,
      status: body.status || "aberta",
      owner_email: body.owner_email || "",
      comissao_percentual: percentual,
      comissao_valor: body.status === "aprovada" ? comissaoValor : 0,
    };

    const { error } = await supabase
      .from("locadora_propostas")
      .insert([payload]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      comissao_percentual: percentual,
      comissao_valor: body.status === "aprovada" ? comissaoValor : 0,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Erro ao criar proposta" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }

    const { data: propostaAtual, error: erroBusca } = await supabase
      .from("locadora_propostas")
      .select("*")
      .eq("id", id)
      .single();

    if (erroBusca) {
      return NextResponse.json({ error: erroBusca.message }, { status: 500 });
    }

    const valor = normalizarNumero(propostaAtual?.valor);
    const percentual = normalizarNumero(
      propostaAtual?.comissao_percentual || 0
    );

    const comissaoValor =
      status === "aprovada"
        ? Number(((valor * percentual) / 100).toFixed(2))
        : 0;

    const { error } = await supabase
      .from("locadora_propostas")
      .update({
        status: status || "aberta",
        comissao_percentual: percentual,
        comissao_valor: comissaoValor,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      comissao_percentual: percentual,
      comissao_valor: comissaoValor,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Erro ao atualizar proposta" },
      { status: 500 }
    );
  }
}