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
    } catch (err) {
      setMsg("Erro inesperado.");
    }

    setLoading(false);
  }

  return (
    <main style={{ padding: 20, maxWidth: 600, margin: "0 auto" }}>
      <h1>Cadastro de Imobiliária</h1>

      <p>
        Cadastre sua imobiliária e receba contatos dentro da Aurora.
      </p>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10 }}>
        <input name="name" placeholder="Nome da imobiliária" required />
        <input name="city" placeholder="Cidade" required />
        <input name="state" placeholder="Estado" required />
        <input name="whatsapp" placeholder="WhatsApp" required />
        <input name="email" placeholder="Email" />

        <button disabled={loading}>
          {loading ? "Enviando..." : "Cadastrar"}
        </button>
      </form>

      {msg && <p style={{ marginTop: 10 }}>{msg}</p>}

      <p style={{ marginTop: 20, fontSize: 12, opacity: 0.6 }}>
        Sistema em constante atualização. Podem ocorrer instabilidades.
      </p>
    </main>
  );
}