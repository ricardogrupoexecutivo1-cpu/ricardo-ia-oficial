import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const { csv, ownerEmail, projectId } = await req.json();

  if (!csv) {
    return NextResponse.json({ error: "CSV vazio" }, { status: 400 });
  }

  const linhas = csv.split("\n").filter((l: string) => l.trim() !== "");

  const headers = linhas[0].split(",");

  const dados = linhas.slice(1).map((linha: string) => {
    const valores = linha.split(",");

    const obj: any = {};

    headers.forEach((h: string, i: number) => {
      obj[h.trim()] = valores[i]?.trim();
    });

    return {
      titulo: obj.titulo || "",
      marca: obj.marca || "",
      modelo: obj.modelo || "",
      ano: obj.ano || "",
      cor: obj.cor || "",
      placa: obj.placa || "",
      valor_diaria: obj.valorDiaria || "0",
      status: obj.status || "disponivel",
      observacoes: obj.observacoes || "",
      owner_email: ownerEmail,
      project_id: projectId,
    };
  });

  const { error } = await supabase
    .from("aurora_locadora_vehicles")
    .insert(dados);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    total: dados.length,
  });
}