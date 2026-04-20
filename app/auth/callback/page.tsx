"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export default function AuthCallbackPage() {
  const [message, setMessage] = useState(
    "Confirmando seu acesso e preparando sua entrada na Aurora..."
  );

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const authReady = Boolean(supabaseUrl && supabaseAnonKey);

  const supabase = useMemo<SupabaseClient | null>(() => {
    if (!authReady) return null;

    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }, [authReady, supabaseUrl, supabaseAnonKey]);

  useEffect(() => {
    let active = true;

    async function run() {
      try {
        if (!supabase) {
          if (!active) return;

          setMessage(
            "Auth ainda não disponível. Redirecionando para entrada..."
          );

          setTimeout(() => {
            window.location.href = "/entrada";
          }, 1200);

          return;
        }

        // 🔥 pega código do Google
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);

          if (error) throw error;
        }

        // 🔥 verifica sessão criada
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (!active) return;

        if (session) {
          setMessage(
            "Login concluído. Redirecionando para a home da Aurora..."
          );

          setTimeout(() => {
            window.location.href = "/home"; // 🔥 CORREÇÃO FINAL
          }, 800);

          return;
        }

        setMessage("Sessão não encontrada. Voltando para entrada...");

        setTimeout(() => {
          window.location.href = "/entrada";
        }, 1200);
      } catch (error: any) {
        if (!active) return;

        setMessage(
          error?.message || "Erro no login. Voltando para entrada..."
        );

        setTimeout(() => {
          window.location.href = "/entrada";
        }, 1400);
      }
    }

    run();

    return () => {
      active = false;
    };
  }, [supabase]);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background:
          "radial-gradient(circle at top, rgba(34,197,94,0.15), transparent 30%), #020617",
        color: "#fff",
      }}
    >
      <div
        style={{
          maxWidth: 420,
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: 26, fontWeight: 900 }}>
          Conectando à Aurora
        </h1>

        <p style={{ marginTop: 10, opacity: 0.7 }}>{message}</p>

        <p style={{ marginTop: 20, fontSize: 12, opacity: 0.5 }}>
          Sistema em constante atualização.
        </p>
      </div>
    </main>
  );
}