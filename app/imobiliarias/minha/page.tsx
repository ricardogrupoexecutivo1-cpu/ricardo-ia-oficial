"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function MinhaImobiliaria() {
  const [imobiliaria, setImobiliaria] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedNome = localStorage.getItem("imobiliaria_nome");

    if (savedNome) {
      setImobiliaria({ name: savedNome });
      setLoading(false);
      return;
    }

    fetch("/api/imobiliarias/minha")
      .then(res => res.json())
      .then(json => {
        if (json.ok && json.data) {
          setImobiliaria(json.data);
          localStorage.setItem("imobiliaria_nome", json.data.name || json.data.nome);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div style={{ padding: 60, textAlign: "center" }}>Carregando...</div>;
  }

  if (!imobiliaria) {
    return (
      <div style={{ padding: 60, textAlign: "center" }}>
        <h2>Nenhuma imobiliária encontrada</h2>
        <Link href="/imobiliarias/cadastrar">Cadastrar Imobiliária</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "36px", textAlign: "center" }}>👋 Bem-vindo, {imobiliaria.name}</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginTop: "40px" }}>
        <div style={{ background: "#fff", padding: "24px", borderRadius: "16px", border: "1px solid #ddd", textAlign: "center" }}>
          <strong>Imóveis cadastrados</strong>
          <h2>0</h2>
        </div>
        <div style={{ background: "#fff", padding: "24px", borderRadius: "16px", border: "1px solid #ddd", textAlign: "center" }}>
          <strong>Cidade</strong>
          <h2>{imobiliaria.city || "—"}</h2>
        </div>
      </div>

      <div style={{ marginTop: "50px", display: "flex", flexDirection: "column", gap: "15px" }}>
        <Link 
          href="/imoveis/imovel/cadastrar" 
          style={{ 
            padding: "18px", 
            background: "#22c55e", 
            color: "white", 
            textAlign: "center", 
            borderRadius: "12px", 
            textDecoration: "none", 
            fontWeight: "bold" 
          }}
        >
          🏠 Cadastrar Novo Imóvel
        </Link>
        <Link 
          href="/imoveis/busca" 
          style={{ 
            padding: "18px", 
            background: "#3b82f6", 
            color: "white", 
            textAlign: "center", 
            borderRadius: "12px", 
            textDecoration: "none", 
            fontWeight: "bold" 
          }}
        >
          🔍 Ver Meus Imóveis
        </Link>
      </div>
    </div>
  );
}