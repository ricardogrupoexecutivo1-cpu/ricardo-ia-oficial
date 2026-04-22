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
            "Auth público ainda não está disponível neste ambiente. Redirecionando para a entrada oficial..."
          );

          window.setTimeout(() => {
            window.location.href = "/";
          }, 1200);

          return;
        }

        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);

          if (error) {
            throw error;
          }
        }

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        if (!active) return;

        if (session) {
          setMessage(
            "Login concluído com sucesso. Redirecionando para a home oficial da Aurora..."
          );

          window.setTimeout(() => {
            window.location.href = "/";
          }, 900);

          return;
        }

        setMessage(
          "Nenhuma sessão válida foi encontrada. Redirecionando para a entrada oficial..."
        );

        window.setTimeout(() => {
          window.location.href = "/";
        }, 1200);
      } catch (error: any) {
        if (!active) return;

        setMessage(
          error?.message ||
            "Não foi possível concluir o login agora. Redirecionando para a entrada oficial..."
        );

        window.setTimeout(() => {
          window.location.href = "/";
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
          "radial-gradient(circle at top, rgba(59,130,246,0.10), transparent 18%), radial-gradient(circle at left, rgba(34,197,94,0.10), transparent 24%), linear-gradient(180deg, #eef6ff 0%, #f7fbff 36%, #edf7f3 100%)",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: 760,
          background: "rgba(255,255,255,0.92)",
          border: "1px solid rgba(15,23,42,0.08)",
          borderRadius: 24,
          padding: 28,
          boxShadow: "0 18px 42px rgba(15,23,42,0.08)",
          textAlign: "center",
          display: "grid",
          gap: 14,
        }}
      >
        <div
          style={{
            fontSize: 12,
            fontWeight: 900,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#2563eb",
          }}
        >
          Aurora Auth Callback
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: "clamp(26px, 4vw, 38px)",
            lineHeight: 1.05,
            color: "#0f172a",
          }}
        >
          Confirmando seu acesso
        </h1>

        <p
          style={{
            margin: 0,
            color: "rgba(15,23,42,0.72)",
            lineHeight: 1.75,
            fontSize: 16,
          }}
        >
          {message}
        </p>

        <div
          style={{
            marginTop: 6,
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <a
            href="/entrada"
            style={{
              padding: "12px 18px",
              borderRadius: 12,
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              color: "#0f172a",
              textDecoration: "none",
              fontWeight: 800,
            }}
          >
            Voltar para entrada
          </a>

          <a
            href="/"
            style={{
              padding: "12px 18px",
              borderRadius: 12,
              background: "linear-gradient(135deg, #2563eb, #3b82f6)",
              color: "#fff",
              textDecoration: "none",
              fontWeight: 900,
              boxShadow: "0 14px 30px rgba(37,99,235,0.16)",
            }}
          >
            Ir para home oficial
          </a>
        </div>
      </section>
    </main>
  );
}