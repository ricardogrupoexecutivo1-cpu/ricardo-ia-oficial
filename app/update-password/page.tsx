"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(
    "Defina uma nova senha para sua conta."
  );

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);
      setMsg("Atualizando senha...");

      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      setMsg("Senha atualizada com sucesso! Agora você pode fazer login.");
    } catch (error: any) {
      setMsg(error?.message || "Erro ao atualizar senha.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>Criar nova senha</h1>

          <form onSubmit={handleUpdate} style={styles.form}>
            <input
              type="password"
              placeholder="Digite sua nova senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />

            <button style={styles.button} disabled={loading}>
              {loading ? "Salvando..." : "Salvar nova senha"}
            </button>
          </form>

          <p style={styles.msg}>{msg}</p>
        </div>
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f4f8ff",
  },
  container: {
    width: "100%",
    maxWidth: 420,
    padding: 20,
  },
  card: {
    background: "#fff",
    padding: 24,
    borderRadius: 20,
    boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
  },
  title: {
    fontSize: 26,
    fontWeight: 900,
    marginBottom: 16,
  },
  form: {
    display: "grid",
    gap: 12,
  },
  input: {
    padding: 12,
    borderRadius: 10,
    border: "1px solid #ddd",
  },
  button: {
    padding: 12,
    borderRadius: 10,
    border: 0,
    background: "#0f6fff",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
  },
  msg: {
    marginTop: 12,
    fontWeight: 600,
  },
};