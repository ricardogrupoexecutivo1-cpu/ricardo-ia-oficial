"use client";
import { useState } from "react";
import Link from "next/link";

export default function CadastrarImovel() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    // Payload simples - sem imobiliaria_id
    const payload = {
      name: data.titulo || "Imóvel sem título",
      city: data.cidade,
      state: data.estado,
      tipo: data.tipo,
      preco: data.preco,
      descricao: data.descricao,
    };

    try {
      const res = await fetch("/api/imoveis/cadastrar-imovel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (json.ok) {
        setSuccess(true);
        setMsg("✅ Imóvel cadastrado com sucesso!");
        e.currentTarget.reset();
      } else {
        setMsg(json.error || "Erro ao cadastrar o imóvel.");
      }
    } catch (err) {
      console.error(err);
      setMsg("Erro de conexão. Tente novamente.");
    }

    setLoading(false);
  }

  if (success) {
    return (
      <div style={{ padding: "60px 20px", textAlign: "center", minHeight: "100vh" }}>
        <h1>✅ Imóvel Cadastrado com Sucesso!</h1>
        <p>Seu anúncio foi publicado na Aurora Imóveis.</p>
        <div style={{ marginTop: "30px" }}>
          <Link 
            href="/imoveis/busca" 
            style={{ 
              marginRight: "15px", 
              padding: "12px 24px", 
              background: "#22c55e", 
              color: "white", 
              borderRadius: "8px", 
              textDecoration: "none" 
            }}
          >
            Ver na Busca
          </Link>
          <Link 
            href="/imoveis" 
            style={{ 
              padding: "12px 24px", 
              background: "#64748b", 
              color: "white", 
              borderRadius: "8px", 
              textDecoration: "none" 
            }}
          >
            Voltar para Imóveis
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px 20px", maxWidth: "700px", margin: "0 auto", minHeight: "100vh" }}>
      <Link href="/imoveis" style={{ color: "#64748b", marginBottom: "20px", display: "inline-block" }}>
        ← Voltar para Imóveis
      </Link>

      <h1 style={{ fontSize: "32px", marginBottom: "10px" }}>🏠 Cadastrar Novo Imóvel</h1>
      <p style={{ marginBottom: "30px", color: "#475569" }}>
        Preencha os dados do imóvel que deseja anunciar.
      </p>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <input name="titulo" placeholder="Título do anúncio *" required style={inputStyle} />
        <input name="tipo" placeholder="Tipo de imóvel *" required style={inputStyle} />
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <input name="cidade" placeholder="Cidade *" required style={inputStyle} />
          <input name="estado" placeholder="Estado (UF) *" required style={inputStyle} />
        </div>

        <input name="preco" type="number" placeholder="Valor (R$)" required style={inputStyle} />

        <textarea 
          name="descricao" 
          placeholder="Descrição completa do imóvel..." 
          rows={5} 
          required 
          style={textareaStyle} 
        />

        <button type="submit" disabled={loading} style={submitButton}>
          {loading ? "Publicando..." : "Publicar Imóvel"}
        </button>
      </form>

      {msg && <p style={msgStyle}>{msg}</p>}
    </div>
  );
}

/* ==================== ESTILOS ==================== */
const inputStyle = {
  padding: "14px 16px",
  borderRadius: 12,
  border: "1px solid #cbd5e1",
  fontSize: 16,
  background: "#fff",
};

const textareaStyle = { ...inputStyle, minHeight: 130 };

const submitButton = {
  marginTop: 20,
  padding: "16px",
  fontSize: 18,
  fontWeight: 800,
  background: "#22c55e",
  color: "#fff",
  border: "none",
  borderRadius: 12,
  cursor: "pointer",
};

const msgStyle = {
  marginTop: 20,
  padding: 15,
  borderRadius: 8,
  textAlign: "center" as const,
  fontWeight: 700,
};