"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

export default function FinanceiroLocadora() {
  const [propostas, setPropostas] = useState<any[]>([]);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail") || "";
    setEmail(userEmail);

    if (userEmail) {
      carregar(userEmail);
    }
  }, []);

  async function carregar(ownerEmail: string) {
    const res = await fetch(
      `/api/locadora/propostas?ownerEmail=${encodeURIComponent(ownerEmail)}`
    );
    const data = await res.json();
    setPropostas(Array.isArray(data) ? data : []);
  }

  const aprovadas = useMemo(
    () => propostas.filter((p) => p.status === "aprovada"),
    [propostas]
  );

  const abertas = useMemo(
    () => propostas.filter((p) => p.status === "aberta"),
    [propostas]
  );

  const faturado = useMemo(() => {
    return aprovadas.reduce((acc, p) => acc + Number(p.valor || 0), 0);
  }, [aprovadas]);

  const previsao = useMemo(() => {
    return abertas.reduce((acc, p) => acc + Number(p.valor || 0), 0);
  }, [abertas]);

  const ticketMedio = useMemo(() => {
    if (aprovadas.length === 0) return 0;
    return faturado / aprovadas.length;
  }, [aprovadas, faturado]);

  const comissaoTotal = useMemo(() => {
    return aprovadas.reduce(
      (acc, p) => acc + Number(p.comissao_valor || 0),
      0
    );
  }, [aprovadas]);

  return (
    <main style={{ padding: 20 }}>
      <Link href="/locadora">← Voltar para locadora</Link>

      <h1 style={{ fontSize: 28, marginTop: 20 }}>
        💰 Financeiro da Locadora
      </h1>

      <p style={{ color: "#94a3b8" }}>
        Controle financeiro baseado nas propostas. Sistema em constante
        atualização.
      </p>

      <div style={{ marginTop: 20, display: "grid", gap: 12 }}>
        <Card title="Faturamento total" value={formatMoeda(faturado)} />
        <Card title="Previsão de entrada" value={formatMoeda(previsao)} />
        <Card title="Ticket médio" value={formatMoeda(ticketMedio)} />
        <Card title="Comissão total Aurora" value={formatMoeda(comissaoTotal)} />
        <Card title="Propostas aprovadas" value={String(aprovadas.length)} />
        <Card title="Propostas em aberto" value={String(abertas.length)} />
      </div>

      <h2 style={{ marginTop: 30 }}>📄 Propostas aprovadas</h2>

      {aprovadas.length === 0 && (
        <p style={{ color: "#94a3b8" }}>
          Nenhuma proposta aprovada ainda.
        </p>
      )}

      {aprovadas.map((p) => (
        <div key={p.id} style={card}>
          <strong>{p.cliente_nome}</strong>
          <p>{p.veiculo_nome}</p>
          <p>Valor da proposta: {formatMoeda(p.valor)}</p>
          <p>Comissão: {formatMoeda(p.comissao_valor)}</p>
          <p>Percentual: {Number(p.comissao_percentual || 0)}%</p>
        </div>
      ))}
    </main>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div style={card}>
      <strong>{title}</strong>
      <h2>{value}</h2>
    </div>
  );
}

function formatMoeda(v: any) {
  const n = Number(v || 0);
  return n.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

const card = {
  border: "1px solid #334155",
  padding: 16,
  borderRadius: 10,
};