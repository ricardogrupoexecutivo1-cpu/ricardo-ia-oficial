"use client";

import { useState } from "react";
import Link from "next/link";

type Proposta = {
  id: number;
  cliente: string;
  veiculo: string;
  valor: string;
  status: "aberta" | "aprovada" | "recusada";
};

export default function PropostasLocadoraPage() {
  const [cliente, setCliente] = useState("");
  const [veiculo, setVeiculo] = useState("");
  const [valor, setValor] = useState("");

  const [propostas, setPropostas] = useState<Proposta[]>([]);
  const [busca, setBusca] = useState("");

  function criarProposta() {
    if (!cliente || !veiculo || !valor) return;

    const nova: Proposta = {
      id: Date.now(),
      cliente,
      veiculo,
      valor,
      status: "aberta",
    };

    setPropostas([nova, ...propostas]);

    setCliente("");
    setVeiculo("");
    setValor("");
  }

  function atualizarStatus(id: number, status: Proposta["status"]) {
    setPropostas((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    );
  }

  const propostasFiltradas = propostas.filter((p) =>
    `${p.cliente} ${p.veiculo}`.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#020617",
        color: "#fff",
        padding: "24px 16px",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* topo */}
        <div style={{ marginBottom: 20 }}>
          <Link href="/locadora" style={linkTop}>
            Voltar para locadora
          </Link>
        </div>

        <h1 style={title}>📄 Propostas da Locadora</h1>

        <p style={subtitle}>
          Crie propostas comerciais conectando cliente, veículo e valor. Sistema
          em constante atualização.
        </p>

        {/* criação */}
        <div style={box}>
          <h2 style={sectionTitle}>Nova proposta</h2>

          <div style={grid}>
            <input
              placeholder="Cliente"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
              style={input}
            />

            <input
              placeholder="Veículo"
              value={veiculo}
              onChange={(e) => setVeiculo(e.target.value)}
              style={input}
            />

            <input
              placeholder="Valor (ex: 1500)"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              style={input}
            />
          </div>

          <button onClick={criarProposta} style={btnPrimary}>
            Criar proposta
          </button>
        </div>

        {/* busca */}
        <div style={{ marginTop: 24 }}>
          <input
            placeholder="Buscar proposta..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            style={input}
          />
        </div>

        {/* lista */}
        <div style={{ marginTop: 20, display: "grid", gap: 14 }}>
          {propostasFiltradas.map((p) => (
            <div key={p.id} style={card}>
              <div>
                <strong>{p.cliente}</strong>
                <div style={text}>Veículo: {p.veiculo}</div>
                <div style={text}>Valor: R$ {p.valor}</div>
                <div style={text}>Status: {p.status}</div>
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
                  href={`https://wa.me/55?text=Proposta%20para%20${p.cliente}%20-%20${p.veiculo}%20-%20R$${p.valor}`}
                  target="_blank"
                  style={btnWhats}
                >
                  WhatsApp
                </a>
              </div>
            </div>
          ))}

          {propostasFiltradas.length === 0 && (
            <div style={text}>Nenhuma proposta criada ainda.</div>
          )}
        </div>
      </div>
    </main>
  );
}

/* estilos */
const title = { fontSize: 32, fontWeight: 900 };
const subtitle = { color: "#94a3b8", marginBottom: 20 };

const sectionTitle = { fontSize: 20, marginBottom: 10 };

const box = {
  padding: 16,
  borderRadius: 16,
  background: "#020617",
  border: "1px solid #334155",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
  gap: 10,
  marginBottom: 10,
};

const input = {
  padding: 10,
  borderRadius: 10,
  border: "1px solid #334155",
  background: "#020617",
  color: "#fff",
};

const btnPrimary = {
  padding: "10px 16px",
  borderRadius: 10,
  background: "#22c55e",
  color: "#000",
  fontWeight: 800,
  border: "none",
};

const card = {
  padding: 14,
  borderRadius: 14,
  border: "1px solid #334155",
  background: "#020617",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const text = { color: "#94a3b8", fontSize: 14 };

const btnGreen = {
  padding: "6px 10px",
  borderRadius: 8,
  background: "#22c55e",
  border: "none",
};

const btnRed = {
  padding: "6px 10px",
  borderRadius: 8,
  background: "#ef4444",
  border: "none",
  color: "#fff",
};

const btnWhats = {
  padding: "6px 10px",
  borderRadius: 8,
  background: "#25D366",
  textDecoration: "none",
  color: "#000",
};

const linkTop = {
  color: "#38bdf8",
  textDecoration: "none",
};