"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CadastrarImobiliaria() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get("nome"),
      city: formData.get("cidade"),
      state: formData.get("estado"),
      whatsapp: formData.get("whatsapp"),
      email: formData.get("email"),
    };

    try {
      const res = await fetch("/api/imoveis/cadastrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (json.ok && json.data) {
        // Salva no localStorage para "login"
        localStorage.setItem("imobiliaria_id", json.data.id);
        localStorage.setItem("imobiliaria_nome", json.data.name || json.data.nome);

        setSuccess(true);
        setMsg("✅ Imobiliária cadastrada com sucesso!");

        // Redirecionamento automático
        setTimeout(() => {
          router.push("/imobiliarias/minha");
        }, 1500);
      } else {
        setMsg(json.error || "Erro ao cadastrar.");
      }
    } catch (err) {
      console.error(err);
      setMsg("Erro de conexão. Tente novamente.");
    }

    setLoading(false);
  }

  if (success) {
    return (
      <main style={mainStyle}>
        <div style={successContainer}>
          <h1>✅ Imobiliária Cadastrada com Sucesso!</h1>
          <p>Redirecionando para sua área pessoal...</p>
        </div>
      </main>
    );
  }

  return (
    <main style={mainStyle}>
      <div style={containerStyle}>
        <Link href="/imoveis" style={backLink}>← Voltar para Imóveis</Link>

        <h1 style={titleStyle}>🏢 Cadastro da Imobiliária</h1>
        <p style={subtitleStyle}>
          Cadastre sua imobiliária para começar a anunciar imóveis na Aurora.
        </p>

        <form onSubmit={handleSubmit} style={formStyle}>
          <input name="nome" placeholder="Nome da Imobiliária *" required style={inputStyle} />
          <input name="cidade" placeholder="Cidade *" required style={inputStyle} />
          <input name="estado" placeholder="Estado (UF) *" required style={inputStyle} />
          <input name="whatsapp" placeholder="WhatsApp *" required style={inputStyle} />
          <input name="email" type="email" placeholder="E-mail *" required style={inputStyle} />

          <button type="submit" disabled={loading} style={submitButton}>
            {loading ? "Cadastrando..." : "Cadastrar Imobiliária"}
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

const inputStyle = {
  padding: "14px 16px",
  borderRadius: 12,
  border: "1px solid #cbd5e1",
  fontSize: 16,
  background: "#fff",
};

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

const successContainer = { textAlign: "center" as const, marginTop: 120 };