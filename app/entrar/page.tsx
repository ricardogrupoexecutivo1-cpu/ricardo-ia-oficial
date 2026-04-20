"use client";

import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export default function EntrarPage() {
  const [loading, setLoading] = useState(false);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // 🔥 SE JÁ ESTIVER LOGADO → VAI PRA HOME
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        window.location.href = "/home";
      }
    });
  }, []);

  // 🔥 LOGIN GOOGLE DIRETO
  async function loginGoogle() {
    setLoading(true);

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/entrar",
      },
    });
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "#ffffff",
          padding: 30,
          borderRadius: 16,
          boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: 26, fontWeight: 900 }}>
          Aurora IA
        </h1>

        <p style={{ marginTop: 10, color: "#555" }}>
          Entre com Google e acesse a plataforma em segundos.
        </p>

        <button
          onClick={loginGoogle}
          disabled={loading}
          style={{
            marginTop: 20,
            width: "100%",
            height: 52,
            background: "#22c55e",
            border: "none",
            borderRadius: 10,
            color: "#fff",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          {loading ? "Abrindo Google..." : "Entrar com Google"}
        </button>

        <p style={{ marginTop: 20, fontSize: 12, color: "#888" }}>
          Sistema em constante atualização.
        </p>
      </div>
    </main>
  );
}