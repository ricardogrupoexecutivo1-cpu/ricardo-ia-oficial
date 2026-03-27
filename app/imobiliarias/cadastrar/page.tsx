"use client";

import { useState } from "react";

export default function CadastroImobiliariaPage() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    const form = new FormData(e.currentTarget);
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
        setMsg("Cadastro de imobiliária enviado com sucesso.");
        e.currentTarget.reset();
      } else {
        setMsg(json.error || "Erro ao cadastrar imobiliária.");
      }
    } catch {
      setMsg("Erro inesperado ao enviar cadastro.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: 20,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        background:
          "radial-gradient(circle at top, rgba(59,130,246,0.16), transparent 24%), #050816",
        color: "#e5eef8",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 560,
          background: "rgba(7,12,28,0.88)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 24,
          padding: 24,
          boxShadow: "0 18px 60px rgba(0,0,0,0.35)",
        }}
      >
        <h1
          style={{
            fontSize: 28,
            marginTop: 0,
            marginBottom: 10,
          }}
        >
          Cadastro de Imobiliária
        </h1>

        <p
          style={{
            marginBottom: 20,
            color: "#9fb0c7",
            lineHeight: 1.7,
          }}
        >
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
            {loading ? "Enviando..." : "Cadastrar imobiliária"}
          </button>
        </form>

        {msg && (
          <p
            style={{
              marginTop: 15,
              fontWeight: "bold",
            }}
          >
            {msg}
          </p>
        )}

        <p
          style={{
            marginTop: 20,
            fontSize: 12,
            opacity: 0.7,
          }}
        >
          Sistema em constante atualização. Podem ocorrer instabilidades.
        </p>
      </div>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  height: 46,
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.15)",
  background: "rgba(255,255,255,0.04)",
  color: "#fff",
  padding: "0 12px",
  fontSize: 14,
  outline: "none",
};