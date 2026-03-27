"use client";

import { useState } from "react";

export default function CadastroImoveis() {
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
        e.target.reset();
      } else {
        setMsg(json.error || "Erro ao cadastrar.");
      }
    } catch {
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
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 500,
        }}
      >
        <h1 style={{ fontSize: 24, marginBottom: 10 }}>
          Cadastro de Imobiliária
        </h1>

        <p style={{ marginBottom: 20 }}>
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

          {/* BOTÃO GARANTIDO VISÍVEL */}
          <button
            type="submit"
            disabled={loading}
            style={{
              height: 50,
              borderRadius: 12,
              border: "none",
              background: "#16a34a",
              color: "#fff",
              fontWeight: "bold",
              fontSize: 16,
              cursor: "pointer",
            }}
          >
            {loading ? "Enviando..." : "Cadastrar"}
          </button>
        </form>

        {msg && (
          <p style={{ marginTop: 15, fontWeight: "bold" }}>{msg}</p>
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
  border: "1px solid #ccc",
  padding: "0 10px",
  fontSize: 14,
};