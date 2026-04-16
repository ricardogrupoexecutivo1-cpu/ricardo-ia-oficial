"use client";
import { useState, useEffect } from "react";

type Imovel = {
  id?: string;
  name?: string;
  city?: string;
  state?: string;
  preco?: number;
  descricao?: string;
};

export default function BuscaImoveis() {
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImoveis();
  }, []);

  async function fetchImoveis() {
    try {
      const res = await fetch("/api/imoveis/busca");
      const json = await res.json();

      if (json.ok) {
        setImoveis(json.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const filtered = imoveis.filter((imovel) => {
    const term = searchTerm.toLowerCase();
    return (
      (imovel.name || "").toLowerCase().includes(term) ||
      (imovel.city || "").toLowerCase().includes(term) ||
      (imovel.descricao || "").toLowerCase().includes(term)
    );
  });

  return (
    <div style={{ padding: "40px 20px", maxWidth: "1100px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", fontSize: "36px", marginBottom: "30px" }}>🔍 Busca de Imóveis</h1>

      <input
        type="text"
        placeholder="Buscar por título ou cidade..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: "100%",
          padding: "16px",
          fontSize: "17px",
          borderRadius: "12px",
          border: "1px solid #ccc",
          marginBottom: "30px",
        }}
      />

      {loading ? (
        <p style={{ textAlign: "center" }}>Carregando imóveis...</p>
      ) : filtered.length === 0 ? (
        <p style={{ textAlign: "center", color: "#666" }}>Nenhum imóvel encontrado.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
          {filtered.map((imovel, index) => (
            <div key={index} style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "16px",
              border: "1px solid #ddd",
            }}>
              <h3>{imovel.name || "Sem título"}</h3>
              <p>{imovel.city} • {imovel.state}</p>
              {imovel.preco && <p style={{ fontWeight: "bold", color: "#15803d" }}>R$ {imovel.preco}</p>}
              {imovel.descricao && <p style={{ marginTop: "10px" }}>{imovel.descricao}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}