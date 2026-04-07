"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";

function clearAllSupabaseStorage() {
  if (typeof window === "undefined") return;

  const localKeys = Object.keys(localStorage);
  for (const key of localKeys) {
    if (
      key.includes("supabase") ||
      key.includes("sb-") ||
      key.toLowerCase().includes("auth-token")
    ) {
      localStorage.removeItem(key);
    }
  }

  const sessionKeys = Object.keys(sessionStorage);
  for (const key of sessionKeys) {
    if (
      key.includes("supabase") ||
      key.includes("sb-") ||
      key.toLowerCase().includes("auth-token")
    ) {
      sessionStorage.removeItem(key);
    }
  }
}

async function safeSignOut() {
  try {
    await Promise.race([
      supabase.auth.signOut(),
      new Promise((resolve) => setTimeout(resolve, 2500)),
    ]);
  } catch {
    // segue mesmo se falhar
  }
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(
    "Sistema em constante atualização e pode haver momentos de instabilidade."
  );
  const [session, setSession] = useState<Session | null>(null);
  const [sessionEmail, setSessionEmail] = useState("");
  const [sessionUserId, setSessionUserId] = useState("");
  const [storageKeys, setStorageKeys] = useState<string[]>([]);

  async function refreshSession(showIdleMessage = false) {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        throw new Error(error.message);
      }

      setSession(session || null);
      setSessionEmail(session?.user?.email || "");
      setSessionUserId(session?.user?.id || "");

      if (typeof window !== "undefined") {
        const keys = [
          ...Object.keys(localStorage),
          ...Object.keys(sessionStorage),
        ].filter(
          (key) =>
            key.includes("supabase") ||
            key.includes("sb-") ||
            key.toLowerCase().includes("auth-token")
        );

        setStorageKeys(Array.from(new Set(keys)));
      }

      if (showIdleMessage) {
        setMsg(
          session
            ? "Sessão encontrada com sucesso."
            : "Sem sessão ativa no navegador. Sistema em constante atualização e pode haver momentos de instabilidade."
        );
      }

      return session || null;
    } catch (error: any) {
      setMsg(error?.message || "Erro ao validar sessão.");
      return null;
    }
  }

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setLoading(true);
      setMsg("Entrando...");

      clearAllSupabaseStorage();

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: senha,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.session) {
        throw new Error("Login realizado, mas nenhuma sessão foi retornada.");
      }

      await refreshSession();
      setMsg("Login realizado com sucesso. Redirecionando para o cadastro geral...");
      window.location.href = "/cadastro-geral";
    } catch (error: any) {
      setMsg(error?.message || "Erro ao logar.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    try {
      setLoading(true);
      setMsg("Redirecionando para o Google...");

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error: any) {
      setMsg(error?.message || "Erro ao entrar com Google.");
      setLoading(false);
    }
  }

  async function handleLogout() {
    try {
      setLoading(true);
      setMsg("Limpando sessão local...");

      await safeSignOut();
      clearAllSupabaseStorage();

      setSession(null);
      setSessionEmail("");
      setSessionUserId("");
      setStorageKeys([]);
      setEmail("");
      setSenha("");

      setMsg("Limpeza concluída. Agora valide a sessão novamente.");
    } catch (error: any) {
      setMsg(error?.message || "Erro ao limpar sessão.");
    } finally {
      setLoading(false);
    }
  }

  function handleForceClearOnly() {
    clearAllSupabaseStorage();
    setSession(null);
    setSessionEmail("");
    setSessionUserId("");
    setStorageKeys([]);
    setMsg("Limpeza forçada do storage concluída. Agora valide a sessão novamente.");
  }

  useEffect(() => {
    refreshSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession || null);
      setSessionEmail(newSession?.user?.email || "");
      setSessionUserId(newSession?.user?.id || "");

      if (typeof window !== "undefined") {
        const keys = [
          ...Object.keys(localStorage),
          ...Object.keys(sessionStorage),
        ].filter(
          (key) =>
            key.includes("supabase") ||
            key.includes("sb-") ||
            key.toLowerCase().includes("auth-token")
        );

        setStorageKeys(Array.from(new Set(keys)));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <section style={styles.card}>
          <div style={styles.badge}>Login Aurora</div>
          <h1 style={styles.title}>Trocar conta da Aurora</h1>
          <p style={styles.subtitle}>
            Use esta tela para remover o usuário de teste do navegador e entrar com a conta principal.
            Sistema em constante atualização e pode haver momentos de instabilidade.
          </p>

          <div style={styles.sessionBox}>
            <div style={styles.sessionTitle}>Sessão atual</div>
            <div style={styles.sessionLine}>
              <strong>Status:</strong> {session ? "Sessão ativa" : "Sem sessão ativa"}
            </div>
            <div style={styles.sessionLine}>
              <strong>E-mail:</strong> {sessionEmail || "não encontrado"}
            </div>
            <div style={styles.sessionLine}>
              <strong>User ID:</strong> {sessionUserId || "não encontrado"}
            </div>
            <div style={styles.sessionLine}>
              <strong>Chaves auth detectadas:</strong> {storageKeys.length}
            </div>
            <div style={styles.codeBox}>
              {storageKeys.length ? storageKeys.join("\n") : "nenhuma chave de auth encontrada"}
            </div>
          </div>

          <form onSubmit={handleLogin} style={styles.form}>
            <label style={styles.fieldWrap}>
              <span style={styles.label}>E-mail</span>
              <input
                type="email"
                placeholder="Seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                autoComplete="email"
              />
            </label>

            <label style={styles.fieldWrap}>
              <span style={styles.label}>Senha</span>
              <input
                type="password"
                placeholder="Sua senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                style={styles.input}
                autoComplete="current-password"
              />
            </label>

            <div style={styles.actions}>
              <button type="submit" style={styles.primaryButton} disabled={loading}>
                {loading ? "Processando..." : "Entrar"}
              </button>

              <button
                type="button"
                onClick={handleGoogleLogin}
                style={styles.googleButton}
                disabled={loading}
              >
                Entrar com Google
              </button>

              <button
                type="button"
                onClick={handleLogout}
                style={styles.secondaryButton}
                disabled={loading}
              >
                Sair da sessão
              </button>

              <button
                type="button"
                onClick={handleForceClearOnly}
                style={styles.secondaryButton}
                disabled={loading}
              >
                Forçar limpeza local
              </button>

              <button
                type="button"
                onClick={() => refreshSession(true)}
                style={styles.secondaryButton}
                disabled={loading}
              >
                Validar sessão
              </button>

              <button
                type="button"
                onClick={() => {
                  window.location.href = "/cadastro-geral";
                }}
                style={styles.secondaryButton}
                disabled={loading}
              >
                Ir para cadastro geral
              </button>
            </div>
          </form>

          <section
            style={{
              ...styles.messageBox,
              ...(msg.toLowerCase().includes("erro") ||
              msg.toLowerCase().includes("falha") ||
              msg.toLowerCase().includes("invalid")
                ? styles.messageError
                : styles.messageInfo),
            }}
          >
            {msg}
          </section>

          <div style={styles.helpBox}>
            <div style={styles.helpTitle}>Faça exatamente assim</div>
            <div style={styles.helpText}>1. Clique em <strong>Sair da sessão</strong>.</div>
            <div style={styles.helpText}>2. Clique em <strong>Forçar limpeza local</strong>.</div>
            <div style={styles.helpText}>3. Clique em <strong>Validar sessão</strong>.</div>
            <div style={styles.helpText}>
              4. Confirme: <strong>Sem sessão ativa</strong> e <strong>0 chaves</strong>.
            </div>
            <div style={styles.helpText}>
              5. Entre com <strong>ricardogrupoexecutivo1@gmail.com</strong> ou use{" "}
              <strong>Entrar com Google</strong>.
            </div>
            <div style={styles.helpText}>
              6. O login com Google volta por <strong>/auth/callback</strong> para consolidar a sessão.
            </div>
            <div style={styles.helpText}>
              7. Depois siga para <strong>/cadastro-geral</strong>, clique em{" "}
              <strong>Validar login agora</strong> e depois em <strong>Salvar cadastro geral</strong>.
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #f8fbff 0%, #eef5ff 100%)",
    padding: "24px 16px 64px",
    color: "#142033",
  },
  container: {
    maxWidth: 760,
    margin: "0 auto",
  },
  card: {
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
    fontSize: "clamp(30px, 5vw, 42px)",
    lineHeight: 1.04,
    margin: "0 0 12px",
    fontWeight: 900,
    color: "#0f1f35",
  },
  subtitle: {
    margin: 0,
    color: "#52637a",
    fontSize: 16,
    lineHeight: 1.7,
  },
  sessionBox: {
    marginTop: 18,
    padding: 18,
    borderRadius: 20,
    background: "#ffffff",
    border: "1px solid #dde9f5",
    boxShadow: "0 10px 25px rgba(20, 32, 51, 0.04)",
  },
  sessionTitle: {
    fontWeight: 900,
    color: "#13263f",
    marginBottom: 10,
  },
  sessionLine: {
    color: "#27415d",
    marginBottom: 6,
    wordBreak: "break-word",
  },
  codeBox: {
    marginTop: 8,
    padding: 12,
    borderRadius: 12,
    background: "#f8fbff",
    border: "1px solid #dde9f5",
    color: "#27415d",
    fontFamily: "monospace",
    fontSize: 12,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
  form: {
    display: "grid",
    gap: 14,
    marginTop: 18,
  },
  fieldWrap: {
    display: "grid",
    gap: 8,
  },
  label: {
    color: "#27415d",
    fontWeight: 800,
    fontSize: 14,
  },
  input: {
    width: "100%",
    minHeight: 50,
    borderRadius: 16,
    border: "1px solid #d8e5f1",
    background: "#fbfdff",
    color: "#142033",
    padding: "12px 14px",
    outline: "none",
  },
  actions: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    marginTop: 6,
  },
  primaryButton: {
    border: 0,
    borderRadius: 16,
    padding: "14px 20px",
    fontWeight: 900,
    cursor: "pointer",
    background: "linear-gradient(90deg, #0f6fff 0%, #22c55e 100%)",
    color: "#ffffff",
  },
  googleButton: {
    border: 0,
    borderRadius: 16,
    padding: "14px 20px",
    fontWeight: 900,
    cursor: "pointer",
    background: "linear-gradient(90deg, #ea4335 0%, #4285f4 100%)",
    color: "#ffffff",
  },
  secondaryButton: {
    borderRadius: 16,
    padding: "14px 20px",
    fontWeight: 900,
    cursor: "pointer",
    background: "#ffffff",
    color: "#22415f",
    border: "1px solid #d6e4f2",
  },
  messageBox: {
    marginTop: 18,
    borderRadius: 18,
    padding: "15px 16px",
    fontWeight: 800,
  },
  messageInfo: {
    background: "#eef6ff",
    border: "1px solid #cfe3fb",
    color: "#1e5fae",
  },
  messageError: {
    background: "#fff1f1",
    border: "1px solid #f3c6c6",
    color: "#b42318",
  },
  helpBox: {
    marginTop: 18,
    padding: 18,
    borderRadius: 20,
    background: "#ffffff",
    border: "1px solid #dde9f5",
  },
  helpTitle: {
    fontWeight: 900,
    color: "#13263f",
    marginBottom: 10,
  },
  helpText: {
    color: "#27415d",
    marginBottom: 6,
  },
};