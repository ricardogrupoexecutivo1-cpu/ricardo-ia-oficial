"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function DebugSupabase() {
  const [status, setStatus] = useState("Iniciando...");
  const [session, setSession] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);

  async function testar() {
    try {
      setStatus("Testando conexão...");

      // 1. sessão atual
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        throw new Error("Erro sessão: " + sessionError.message);
      }

      setSession(session);

      // 2. tentar listar cadastros (teste banco)
      const { data, error } = await supabase
        .from("cadastros_gerais")
        .select("*")
        .limit(5);

      if (error) {
        throw new Error("Erro banco: " + error.message);
      }

      setUsers(data || []);

      setStatus("✅ Supabase OK");
    } catch (err: any) {
      setStatus("❌ " + err.message);
    }
  }

  useEffect(() => {
    testar();
  }, []);

  return (
    <div style={styles.page}>
      <h1>🔍 Debug Supabase</h1>

      <div style={styles.box}>
        <strong>Status:</strong> {status}
      </div>

      <div style={styles.box}>
        <strong>Sessão:</strong>
        <pre>{JSON.stringify(session, null, 2)}</pre>
      </div>

      <div style={styles.box}>
        <strong>Dados cadastros_gerais:</strong>
        <pre>{JSON.stringify(users, null, 2)}</pre>
      </div>

      <button onClick={testar} style={styles.button}>
        Re-testar
      </button>
    </div>
  );
}

const styles: any = {
  page: {
    padding: 30,
    fontFamily: "Arial",
  },
  box: {
    background: "#f4f4f4",
    padding: 15,
    marginTop: 15,
    borderRadius: 8,
  },
  button: {
    marginTop: 20,
    padding: 10,
    background: "#0f6fff",
    color: "#fff",
    border: "none",
    borderRadius: 6,
  },
};