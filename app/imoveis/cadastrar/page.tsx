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

    try {
      const res = await fetch("/api/imoveis/cadastrar-imovel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
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
      setMsg("Erro de conexão. Tente novamente.");
    }

    setLoading(false);
  }

  if (success) {
    return (
      <main style={mainStyle}>
        <div style={successContainer}>
          <h1>✅ Imóvel Cadastrado com Sucesso!</h1>
          <p>Seu imóvel foi publicado na Aurora Imóveis.</p>
          <div style={buttonsContainer}>
            <Link href="/imoveis/busca" style={primaryBtn}>Ver todos os imóveis</Link>
            <Link href="/imoveis" style={secondaryBtn}>Voltar para Imóveis</Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={mainStyle}>
      <div style={containerStyle}>
        <Link href="/imoveis" style={backLink}>← Voltar para Imóveis</Link>

        <h1 style={titleStyle}>🏠 Cadastrar Novo Imóvel</h1>
        <p style={subtitleStyle}>
          Preencha os dados do imóvel que deseja anunciar.
        </p>

        <form onSubmit={handleSubmit} style={formStyle}>
          <input 
            name="titulo" 
            placeholder="Título do anúncio (ex: Apartamento 2 quartos no Centro)" 
            required 
            style={inputStyle} 
          />
          
          <input 
            name="tipo" 
            placeholder="Tipo de imóvel (Apartamento, Casa, Sala, Terreno...)" 
            required 
            style={inputStyle} 
          />

          <div style={rowStyle}>
            <input name="cidade" placeholder="Cidade *" required style={inputStyle} />
            <input name="estado" placeholder="Estado (UF) *" required style={inputStyle} />
          </div>

          <input 
            name="preco" 
            type="number" 
            placeholder="Valor (R$)" 
            required 
            style={inputStyle} 
          />

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
    </main>
  );
}

/* ==================== ESTILOS ==================== */
const mainStyle = {
  minHeight: "100vh",
  background: "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)",
  padding: "40px 20px",
  color: "#0f172a",
};

const containerStyle = { maxWidth: 700, margin: "0 auto" };
const backLink = { color: "#64748b", textDecoration: "none", fontWeight: 600, marginBottom: 20, display: "inline-block" };

const titleStyle = { fontSize: 36, fontWeight: 900, marginBottom: 8 };
const subtitleStyle = { fontSize: 18, color: "#475569", marginBottom: 32 };

const formStyle = { display: "flex", flexDirection: "column" as const, gap: 16 };
const rowStyle = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 };

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
  background: "linear-gradient(135deg, #22c55e, #16a34a)",
  color: "#fff",
  border: "none",
  borderRadius: 16,
  cursor: "pointer",
};

const msgStyle = { marginTop: 20, padding: 16, borderRadius: 12, textAlign: "center" as const, fontWeight: 700 };