"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CadastroImoveis() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    const form = new FormData(e.target);
    const data = Object.fromEntries(form.entries());

    try {
      const res = await fetch("/api/imoveis/cadastrar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (json.ok) {
        setMsg("Cadastro enviado com sucesso.");

        // limpa formulário
        e.target.reset();

        // 🔥 REDIRECIONAMENTO SEGURO
        setTimeout(() => {
          router.push("/?cadastro=imoveis-sucesso");
        }, 1200);
      } else {
        setMsg(json.error || "Erro ao cadastrar.");
      }
    } catch (err) {
      console.error("Erro cadastro:", err);
      setMsg("Erro inesperado.");
    }

    setLoading(false);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: 20,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        background: "#05080f",
        color: "#fff",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 500,
        }}
      >
        <h1 style={{ fontSize: 26, marginBottom: 10 }}>
          🏡 Cadastro de Imobiliária
        </h1>

        <p style={{ marginBottom: 20, color: "#ccc" }}>
          Cadastre sua imobiliária e receba contatos dentro da Aurora.
        </p>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <input
            name="name"
            placeholder="Nome da imobiliária"
            required
            style={inputStyle}
          />

          <input
            name="city"
            placeholder="Cidade"
            required
            style={inputStyle}
          />

          <input
            name="state"
            placeholder="Estado"
            required
            style={inputStyle}
          />

          <input
            name="whatsapp"
            placeholder="WhatsApp"
            required
            style={inputStyle}
          />

          <input
            name="email"
            placeholder="Email"
            style={inputStyle}
          />

          <button
            type="submit"
            disabled={loading}
            style={buttonStyle}
          >
            {loading ? "Enviando..." : "🚀 Cadastrar"}
          </button>
        </form>

        {msg && (
          <div
            style={{
              marginTop: 16,
              padding: 12,
              borderRadius: 10,
              background:
                msg.includes("sucesso")
                  ? "rgba(34,197,94,0.15)"
                  : "rgba(239,68,68,0.15)",
              border:
                msg.includes("sucesso")
                  ? "1px solid rgba(34,197,94,0.4)"
                  : "1px solid rgba(239,68,68,0.4)",
              fontWeight: "bold",
            }}
          >
            {msg}
          </div>
        )}

        <p style={{ marginTop: 20, fontSize: 12, opacity: 0.6 }}>
          Sistema em constante atualização. Podem ocorrer instabilidades.
        </p>
      </div>
    </main>
  );
}

const inputStyle = {
  height: 45,
  borderRadius: 10,
  border: "1px solid #333",
  padding: "0 10px",
  fontSize: 14,
  background: "#0b1220",
  color: "#fff",
};

const buttonStyle = {
  height: 50,
  borderRadius: 12,
  border: "none",
  background: "linear-gradient(135deg, #22c55e, #14b8a6)",
  color: "#03130d",
  fontWeight: "bold",
  fontSize: 16,
  cursor: "pointer",
};