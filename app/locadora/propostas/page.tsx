"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Cliente = {
  id: string;
  nome?: string;
  email?: string;
  whatsapp?: string;
};

type Veiculo = {
  id: string;
  titulo?: string;
  marca?: string;
  modelo?: string;
};

type Proposta = {
  id: string;
  cliente_id?: string | null;
  cliente_nome?: string;
  veiculo_id?: string | null;
  veiculo_nome?: string;
  valor?: number | string;
  status?: string;
  comissao_percentual?: number | string;
  comissao_valor?: number | string;
};

function normalizarValorParaNumero(valor: string) {
  const limpo = String(valor)
    .trim()
    .replace(/\s/g, "")
    .replace(/\./g, "")
    .replace(",", ".")
    .replace(/[^\d.-]/g, "");

  const numero = Number(limpo);
  return isNaN(numero) ? 0 : numero;
}

function formatarMoeda(valor: any) {
  const numero = Number(valor || 0);
  return numero.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function PropostasPage() {
  const [clienteId, setClienteId] = useState("");
  const [veiculoId, setVeiculoId] = useState("");
  const [valor, setValor] = useState("");
  const [comissaoPercentual, setComissaoPercentual] = useState("10");

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [propostas, setPropostas] = useState<Proposta[]>([]);

  const [email, setEmail] = useState("");

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail") || "";
    setEmail(userEmail);

    if (userEmail) {
      carregarPropostas(userEmail);
      carregarClientes(userEmail);
      carregarVeiculos(userEmail);
    }
  }, []);

  async function carregarPropostas(ownerEmail: string) {
    const res = await fetch(
      `/api/locadora/propostas?ownerEmail=${encodeURIComponent(ownerEmail)}`
    );
    const data = await res.json();
    setPropostas(Array.isArray(data) ? data : []);
  }

  async function carregarClientes(ownerEmail: string) {
    const res = await fetch(
      `/api/locadora/clientes?ownerEmail=${encodeURIComponent(ownerEmail)}`
    );
    const data = await res.json();
    setClientes(data.items || []);
  }

  async function carregarVeiculos(ownerEmail: string) {
    const res = await fetch(
      `/api/locadora/vehicles?ownerEmail=${encodeURIComponent(ownerEmail)}`
    );
    const data = await res.json();
    setVeiculos(data.vehicles || []);
  }

  const clienteSelecionado = useMemo(
    () => clientes.find((c) => c.id === clienteId),
    [clientes, clienteId]
  );

  const veiculoSelecionado = useMemo(
    () => veiculos.find((v) => v.id === veiculoId),
    [veiculos, veiculoId]
  );

  async function criarProposta() {
    if (!clienteId || !veiculoId || !valor) {
      alert("Selecione cliente, veículo e informe o valor.");
      return;
    }

    const valorNumero = normalizarValorParaNumero(valor);
    const percentualNumero = normalizarValorParaNumero(comissaoPercentual);

    if (!valorNumero || valorNumero <= 0) {
      alert("Informe um valor válido. Ex.: 2800,00");
      return;
    }

    if (percentualNumero < 0) {
      alert("Informe um percentual de comissão válido.");
      return;
    }

    const res = await fetch("/api/locadora/propostas", {
      method: "POST",
      body: JSON.stringify({
        cliente_id: clienteSelecionado?.id || null,
        cliente_nome: clienteSelecionado?.nome || "",
        cliente_email: clienteSelecionado?.email || "",
        cliente_whatsapp: clienteSelecionado?.whatsapp || "",
        veiculo_id: veiculoSelecionado?.id || null,
        veiculo_nome: veiculoSelecionado?.titulo || "",
        valor: valorNumero,
        owner_email: email,
        comissao_percentual: percentualNumero,
      }),
    });

    const data = await res.json();

    if (data?.error) {
      alert(`Erro ao criar proposta: ${data.error}`);
      return;
    }

    setClienteId("");
    setVeiculoId("");
    setValor("");
    setComissaoPercentual("10");

    carregarPropostas(email);
  }

  async function atualizarStatus(id: string, status: string) {
    const res = await fetch("/api/locadora/propostas", {
      method: "PATCH",
      body: JSON.stringify({ id, status }),
    });

    const data = await res.json();

    if (data?.error) {
      alert(`Erro ao atualizar status: ${data.error}`);
      return;
    }

    carregarPropostas(email);
  }

  return (
    <main style={{ padding: 20 }}>
      <Link href="/locadora">← Voltar para locadora</Link>

      <h1 style={{ fontSize: 28, marginTop: 20 }}>
        📄 Propostas da Locadora
      </h1>

      <p style={{ color: "#94a3b8" }}>
        Sistema conectado ao banco real. Pode haver instabilidade durante
        atualizações.
      </p>

      <div style={{ marginTop: 20 }}>
        <select
          value={clienteId}
          onChange={(e) => setClienteId(e.target.value)}
          style={input}
        >
          <option value="">Selecionar cliente</option>
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome}
            </option>
          ))}
        </select>

        <select
          value={veiculoId}
          onChange={(e) => setVeiculoId(e.target.value)}
          style={input}
        >
          <option value="">Selecionar veículo</option>
          {veiculos.map((v) => (
            <option key={v.id} value={v.id}>
              {v.titulo}
            </option>
          ))}
        </select>

        <input
          placeholder="Valor (ex.: 2800,00)"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          style={input}
        />

        <input
          placeholder="Comissão % (ex.: 10)"
          value={comissaoPercentual}
          onChange={(e) => setComissaoPercentual(e.target.value)}
          style={input}
        />

        <button onClick={criarProposta} style={btnPrimary}>
          Criar proposta
        </button>
      </div>

      <div style={{ marginTop: 30 }}>
        {propostas.length === 0 && (
          <p style={{ color: "#94a3b8" }}>
            Nenhuma proposta encontrada.
          </p>
        )}

        {propostas.map((p) => (
          <div key={p.id} style={card}>
            <div>
              <strong>{p.cliente_nome}</strong>
              <p>Cliente ID: {p.cliente_id || "-"}</p>
              <p>Veículo: {p.veiculo_nome}</p>
              <p>Veículo ID: {p.veiculo_id || "-"}</p>
              <p>Valor: R$ {formatarMoeda(p.valor)}</p>
              <p>Status: {p.status}</p>
              <p>Comissão %: {Number(p.comissao_percentual || 0)}%</p>
              <p>Comissão valor: R$ {formatarMoeda(p.comissao_valor)}</p>
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button
                onClick={() => atualizarStatus(p.id, "aprovada")}
                style={btnGreen}
              >
                Aprovar
              </button>

              <button
                onClick={() => atualizarStatus(p.id, "recusada")}
                style={btnRed}
              >
                Recusar
              </button>

              <a
                href={`https://wa.me/55?text=Proposta ${p.cliente_nome} - ${p.veiculo_nome}`}
                target="_blank"
                style={btnWhats}
              >
                WhatsApp
              </a>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

const input = {
  display: "block",
  marginBottom: 10,
  padding: 10,
  width: "100%",
  maxWidth: 400,
  borderRadius: 8,
  border: "1px solid #334155",
};

const btnPrimary = {
  padding: "10px 16px",
  borderRadius: 8,
  background: "#22c55e",
  border: "none",
  fontWeight: 800,
};

const card = {
  border: "1px solid #334155",
  padding: 12,
  borderRadius: 10,
  marginBottom: 10,
};

const btnGreen = {
  background: "#22c55e",
  border: "none",
  padding: "6px 10px",
};

const btnRed = {
  background: "#ef4444",
  border: "none",
  padding: "6px 10px",
  color: "#fff",
};

const btnWhats = {
  background: "#25D366",
  padding: "6px 10px",
  textDecoration: "none",
  color: "#000",
};