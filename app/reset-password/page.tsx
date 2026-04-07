"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("Defina sua nova senha.");
  const [type, setType] = useState<"info" | "success" | "error">("info");

  async function handleReset() {
    try {
      setLoading(true);
      setMessage("Atualizando senha...");
      setType("info");

      if (!password || password.length < 6) {
        throw new Error("A senha deve ter pelo menos 6 caracteres.");
      }

      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      setMessage("Senha atualizada com sucesso! Redirecionando...");
      setType("success");

      setTimeout(() => {
        window.location.href = "/entrada";
      }, 2000);
    } catch (err: any) {
      setMessage(err.message || "Erro ao atualizar senha.");
      setType("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={styles.page}>
      <div style={styles.box}>
        <h1 style={styles.title}>Redefinir senha</h1>

        <p style={styles.subtitle}>
          Defina uma nova senha para acessar a Aurora.
        </p>

        <div
          style={{
            ...styles.message,
            ...(type === "success"
              ? styles.success
              : type === "error"
              ? styles.error
              : styles.info),
          }}
        >
          {message}
        </div>

        <input
          type="password"
          placeholder="Nova senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button
          onClick={handleReset}
          disabled={loading}
          style={styles.button}
        >
          {loading ? "Salvando..." : "Salvar nova senha"}
        </button>
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
    background: "#eef5ff",
  },
  box: {
    background: "#fff",
    padding: 30,
    borderRadius: 20,
    width: 320,
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  },
  title: {
    fontSize: 22,
    fontWeight: 900,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 10,
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: 12,
    borderRadius: 10,
    background: "#0f6fff",
    color: "#fff",
    border: "none",
    fontWeight: 900,
  },
  message: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    fontSize: 13,
  },
  success: {
    background: "#e6f9ed",
    color: "#18794e",
  },
  error: {
    background: "#ffeaea",
    color: "#b42318",
  },
  info: {
    background: "#eef6ff",
    color: "#1e5fae",
  },
};