"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const [msg, setMsg] = useState(
    "Validando acesso com segurança. Sistema em constante atualização e pode haver momentos de instabilidade."
  );

  useEffect(() => {
    let mounted = true;

    async function finishOAuth() {
      try {
        setMsg("Lendo retorno do login...");

        const hash = window.location.hash || "";
        const search = window.location.search || "";

        const hasOAuthParams =
          hash.includes("access_token=") ||
          hash.includes("refresh_token=") ||
          search.includes("code=");

        if (!hasOAuthParams) {
          setMsg("Nenhum retorno de autenticação foi encontrado. Redirecionando para login...");
          setTimeout(() => {
            window.location.href = "/login";
          }, 1200);
          return;
        }

        setMsg("Consolidando sessão...");

        // Para fluxo por hash/token
        const {
          data: sessionData,
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          throw new Error(sessionError.message);
        }

        if (mounted && sessionData.session) {
          setMsg("Sessão validada com sucesso. Redirecionando para o cadastro geral...");
          window.history.replaceState({}, document.title, "/auth/callback");

          setTimeout(() => {
            window.location.href = "/cadastro-geral";
          }, 800);
          return;
        }

        // Para fluxo com code exchange / fallback
        const {
          data: refreshData,
          error: refreshError,
        } = await supabase.auth.refreshSession();

        if (refreshError) {
          throw new Error(refreshError.message);
        }

        if (mounted && refreshData.session) {
          setMsg("Sessão criada com sucesso. Redirecionando para o cadastro geral...");
          window.history.replaceState({}, document.title, "/auth/callback");

          setTimeout(() => {
            window.location.href = "/cadastro-geral";
          }, 800);
          return;
        }

        setMsg("Não foi possível consolidar a sessão. Voltando para login...");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1200);
      } catch (error: any) {
        setMsg(error?.message || "Erro ao concluir autenticação. Voltando para login...");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      }
    }

    finishOAuth();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <div style={styles.badge}>Aurora Auth</div>
        <h1 style={styles.title}>Concluindo acesso</h1>
        <p style={styles.text}>{msg}</p>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px 16px",
    background: "linear-gradient(180deg, #f8fbff 0%, #eef5ff 100%)",
    color: "#142033",
  },
  card: {
    width: "100%",
    maxWidth: 680,
    background: "linear-gradient(135deg, #ffffff 0%, #f6fbff 100%)",
    border: "1px solid #d7e6f7",
    borderRadius: 28,
    padding: 28,
    boxShadow: "0 20px 60px rgba(19, 44, 74, 0.08)",
  },
  badge: {
    display: "inline-flex",
    padding: "8px 12px",
    borderRadius: 999,
    background: "#e8f7ec",
    border: "1px solid #bfe7c8",
    color: "#18794e",
    fontWeight: 800,
    fontSize: 12,
    letterSpacing: 0.3,
    marginBottom: 14,
  },
  title: {
    fontSize: "clamp(28px, 5vw, 40px)",
    lineHeight: 1.04,
    margin: "0 0 12px",
    fontWeight: 900,
    color: "#0f1f35",
  },
  text: {
    margin: 0,
    color: "#52637a",
    fontSize: 16,
    lineHeight: 1.7,
    fontWeight: 700,
  },
};