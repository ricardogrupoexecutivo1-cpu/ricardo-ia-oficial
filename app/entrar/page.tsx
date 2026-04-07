"use client";

import Link from "next/link";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { useEffect, useMemo, useState } from "react";

type AuthMode = "idle" | "loading_google" | "loading_apple" | "loading_email";

export default function EntrarPage() {
  const [email, setEmail] = useState("");
  const [mode, setMode] = useState<AuthMode>("idle");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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
    if (!supabase) return;

    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;

      if (data.session) {
        window.location.href = "/";
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (
        session &&
        (event === "SIGNED_IN" ||
          event === "TOKEN_REFRESHED" ||
          event === "INITIAL_SESSION")
      ) {
        window.location.href = "/";
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  async function handleOAuthLogin(provider: "google" | "apple") {
    setError("");
    setMessage("");

    if (!supabase) {
      setError(
        "Auth da Aurora ainda não está pronto neste ambiente. Verifique NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY."
      );
      return;
    }

    try {
      setMode(provider === "loading_google" ? "loading_google" : provider === "google" ? "loading_google" : "loading_apple");

      const redirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/entrar`
          : undefined;

      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo,
        },
      });

      if (authError) {
        throw authError;
      }

      setMessage(
        provider === "google"
          ? "Redirecionando para entrada com Google..."
          : "Redirecionando para entrada com Apple..."
      );
    } catch (err: any) {
      setError(
        err?.message ||
          "Não foi possível iniciar a autenticação agora. Tente novamente."
      );
      setMode("idle");
    }
  }

  async function handleEmailLogin() {
    setError("");
    setMessage("");

    if (!supabase) {
      setError(
        "Auth da Aurora ainda não está pronto neste ambiente. Verifique NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY."
      );
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Digite seu e-mail para continuar.");
      return;
    }

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);

    if (!isValidEmail) {
      setError("Digite um e-mail válido.");
      return;
    }

    try {
      setMode("loading_email");

      const redirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/entrar`
          : undefined;

      const { error: authError } = await supabase.auth.signInWithOtp({
        email: normalizedEmail,
        options: {
          emailRedirectTo: redirectTo,
        },
      });

      if (authError) {
        throw authError;
      }

      setMessage(
        "Enviamos um link mágico para seu e-mail. Depois de entrar, você será levado para a home oficial."
      );
      setEmail("");
      setMode("idle");
    } catch (err: any) {
      setError(
        err?.message ||
          "Não foi possível enviar o link de acesso por e-mail agora."
      );
      setMode("idle");
    }
  }

  const isLoading = mode !== "idle";

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(59,130,246,0.10), transparent 18%), radial-gradient(circle at left, rgba(34,197,94,0.10), transparent 24%), linear-gradient(180deg, #eef6ff 0%, #f7fbff 36%, #edf7f3 100%)",
        color: "#0f172a",
        padding: "24px 16px 80px",
        display: "flex",
        alignItems: "center",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: 1180,
          margin: "0 auto",
          display: "grid",
          gap: 18,
        }}
      >
        <header
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            alignItems: "center",
            justifyContent: "space-between",
            border: "1px solid rgba(15,23,42,0.08)",
            background: "rgba(255,255,255,0.78)",
            backdropFilter: "blur(14px)",
            borderRadius: 24,
            padding: "14px 16px",
            boxShadow: "0 18px 42px rgba(15,23,42,0.07)",
          }}
        >
          <div style={{ display: "grid", gap: 4 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 900,
                letterSpacing: "0.08em",
                color: "#2563eb",
                textTransform: "uppercase",
              }}
            >
              Aurora IA
            </div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 900,
                lineHeight: 1.2,
                color: "#0f172a",
              }}
            >
              Entrada oficial • login • continuidade de acesso
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            <Link href="/entrada" style={secondaryButtonStyle}>
              Voltar à entrada
            </Link>
            <Link href="/" style={primaryButtonStyle}>
              Ir para a home oficial
            </Link>
          </div>
        </header>

        <section
          style={{
            border: "1px solid rgba(15,23,42,0.08)",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,255,255,0.78))",
            borderRadius: 30,
            padding: "28px 20px",
            boxShadow: "0 22px 70px rgba(15,23,42,0.09)",
            display: "grid",
            gap: 22,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              width: "fit-content",
              alignItems: "center",
              gap: 8,
              padding: "8px 12px",
              borderRadius: 999,
              background: "rgba(37,99,235,0.08)",
              border: "1px solid rgba(37,99,235,0.16)",
              color: "#2563eb",
              fontSize: 12,
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Acesso Aurora
          </div>

          <div style={heroGridStyle}>
            <div style={{ display: "grid", gap: 12 }}>
              <h1
                style={{
                  margin: 0,
                  fontSize: "clamp(32px, 5vw, 58px)",
                  lineHeight: 0.98,
                  letterSpacing: "-0.04em",
                  color: "#0f172a",
                  maxWidth: 820,
                }}
              >
                Entre na Aurora com Google, Apple ou e-mail
              </h1>

              <p
                style={{
                  margin: 0,
                  maxWidth: 900,
                  color: "rgba(15,23,42,0.72)",
                  fontSize: 18,
                  lineHeight: 1.7,
                  fontWeight: 600,
                }}
              >
                Esta área concentra a entrada oficial da Aurora para manter
                continuidade de acesso, reduzir atrito e levar o usuário para a
                home principal já publicada, sem alterar a estrutura atual.
              </p>

              <div
                style={{
                  borderRadius: 18,
                  padding: "14px 16px",
                  background:
                    "linear-gradient(135deg, rgba(37,99,235,0.08), rgba(16,185,129,0.08))",
                  border: "1px solid rgba(37,99,235,0.14)",
                  color: "#0f172a",
                  fontSize: 14,
                  lineHeight: 1.75,
                  fontWeight: 700,
                  maxWidth: 860,
                }}
              >
                Sistema em constante atualização. Pode haver momentos de
                instabilidade durante melhorias. Após o login, o fluxo segue
                para a home oficial da Aurora.
              </div>

              {!authReady ? (
                <div style={warningBoxStyle}>
                  Ambiente sem auth público configurado. Para ativar esta tela,
                  confirme no projeto as variáveis{" "}
                  <strong>NEXT_PUBLIC_SUPABASE_URL</strong> e{" "}
                  <strong>NEXT_PUBLIC_SUPABASE_ANON_KEY</strong>.
                </div>
              ) : null}

              {message ? <div style={successBoxStyle}>{message}</div> : null}
              {error ? <div style={errorBoxStyle}>{error}</div> : null}
            </div>

            <aside style={loginPanelStyle}>
              <div style={panelHeaderStyle}>
                <div style={panelBadgeStyle}>Acesso rápido</div>
                <h2 style={panelTitleStyle}>Escolha como entrar</h2>
                <p style={panelTextStyle}>
                  Google e Apple entram por OAuth. E-mail usa link mágico para
                  acesso seguro sem senha. Depois do login, a pessoa segue para
                  a home oficial.
                </p>
              </div>

              <div style={buttonsWrapStyle}>
                <button
                  type="button"
                  style={oauthButtonStyle}
                  onClick={() => handleOAuthLogin("google")}
                  disabled={isLoading}
                >
                  <span style={iconCircleStyle}>G</span>
                  <span>Entrar com Google</span>
                  <span style={liveTagStyle}>
                    {mode === "loading_google" ? "abrindo..." : "ativo"}
                  </span>
                </button>

                <button
                  type="button"
                  style={oauthButtonStyle}
                  onClick={() => handleOAuthLogin("apple")}
                  disabled={isLoading}
                >
                  <span style={iconCircleStyle}></span>
                  <span>Entrar com Apple</span>
                  <span style={liveTagStyle}>
                    {mode === "loading_apple" ? "abrindo..." : "ativo"}
                  </span>
                </button>
              </div>

              <div style={dividerStyle}>
                <span style={dividerLineStyle} />
                <span style={dividerTextStyle}>Ou entre por e-mail</span>
                <span style={dividerLineStyle} />
              </div>

              <div style={emailBoxStyle}>
                <label htmlFor="aurora-login-email" style={inputLabelStyle}>
                  Seu e-mail
                </label>

                <input
                  id="aurora-login-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="voce@empresa.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  style={inputStyle}
                  disabled={isLoading}
                />

                <button
                  type="button"
                  style={primaryBlockButtonStyle}
                  onClick={handleEmailLogin}
                  disabled={isLoading}
                >
                  {mode === "loading_email"
                    ? "Enviando link..."
                    : "Entrar com e-mail"}
                </button>
              </div>

              <div style={dividerStyle}>
                <span style={dividerLineStyle} />
                <span style={dividerTextStyle}>Fluxo oficial</span>
                <span style={dividerLineStyle} />
              </div>

              <div style={actionsGridStyle}>
                <Link href="/entrada" style={secondaryButtonStyle}>
                  Voltar para a entrada
                </Link>

                <Link href="/" style={secondaryButtonStyle}>
                  Ver home oficial
                </Link>

                <Link href="/cadastro-geral" style={secondaryButtonStyle}>
                  Completar cadastro depois
                </Link>
              </div>
            </aside>
          </div>

          <div style={featuresGridStyle}>
            <div style={featureCardStyle}>
              <div style={featureLabelStyle}>Google</div>
              <div style={featureTitleStyle}>Entrada rápida para escala</div>
              <div style={featureTextStyle}>
                Ideal para reduzir atrito e facilitar retenção de quem chega
                pela primeira vez na Aurora.
              </div>
            </div>

            <div style={featureCardStyle}>
              <div style={featureLabelStyle}>Apple</div>
              <div style={featureTitleStyle}>Experiência premium</div>
              <div style={featureTextStyle}>
                Importante para reforçar percepção internacional, mobile e
                entrada mais elegante no ecossistema.
              </div>
            </div>

            <div style={featureCardStyle}>
              <div style={featureLabelStyle}>E-mail</div>
              <div style={featureTitleStyle}>Base universal</div>
              <div style={featureTextStyle}>
                Mantém a Aurora acessível para qualquer usuário, com fallback
                forte para cadastro inicial e continuidade.
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

const heroGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1.2fr) minmax(320px, 420px)",
  gap: 18,
  alignItems: "start",
};

const loginPanelStyle: React.CSSProperties = {
  borderRadius: 24,
  padding: "18px",
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.90), rgba(248,250,252,0.94))",
  border: "1px solid rgba(15,23,42,0.08)",
  boxShadow: "0 16px 40px rgba(15,23,42,0.06)",
  display: "grid",
  gap: 16,
};

const panelHeaderStyle: React.CSSProperties = {
  display: "grid",
  gap: 8,
};

const panelBadgeStyle: React.CSSProperties = {
  display: "inline-flex",
  width: "fit-content",
  alignItems: "center",
  justifyContent: "center",
  padding: "7px 11px",
  borderRadius: 999,
  background: "rgba(16,185,129,0.08)",
  border: "1px solid rgba(16,185,129,0.16)",
  color: "#15803d",
  fontSize: 12,
  fontWeight: 900,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};

const panelTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 28,
  lineHeight: 1.04,
  color: "#0f172a",
  fontWeight: 900,
};

const panelTextStyle: React.CSSProperties = {
  margin: 0,
  color: "rgba(15,23,42,0.68)",
  fontSize: 14,
  lineHeight: 1.7,
  fontWeight: 700,
};

const buttonsWrapStyle: React.CSSProperties = {
  display: "grid",
  gap: 10,
};

const oauthButtonStyle: React.CSSProperties = {
  minHeight: 58,
  borderRadius: 16,
  border: "1px solid rgba(15,23,42,0.08)",
  background: "rgba(255,255,255,0.90)",
  color: "#0f172a",
  padding: "12px 14px",
  fontWeight: 800,
  display: "grid",
  gridTemplateColumns: "40px 1fr auto",
  alignItems: "center",
  gap: 12,
  boxShadow: "0 10px 22px rgba(15,23,42,0.05)",
  cursor: "pointer",
};

const iconCircleStyle: React.CSSProperties = {
  width: 32,
  height: 32,
  borderRadius: 999,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(135deg, #eff6ff, #ecfeff)",
  border: "1px solid rgba(37,99,235,0.12)",
  color: "#2563eb",
  fontSize: 16,
  fontWeight: 900,
};

const liveTagStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 900,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: "#15803d",
  background: "rgba(16,185,129,0.08)",
  border: "1px solid rgba(16,185,129,0.14)",
  borderRadius: 999,
  padding: "6px 8px",
};

const dividerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
};

const dividerLineStyle: React.CSSProperties = {
  flex: 1,
  height: 1,
  background: "rgba(15,23,42,0.08)",
};

const dividerTextStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 900,
  color: "rgba(15,23,42,0.52)",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};

const emailBoxStyle: React.CSSProperties = {
  display: "grid",
  gap: 10,
};

const inputLabelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 900,
  color: "#2563eb",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};

const inputStyle: React.CSSProperties = {
  minHeight: 52,
  borderRadius: 14,
  border: "1px solid rgba(15,23,42,0.10)",
  background: "#ffffff",
  padding: "0 14px",
  fontSize: 15,
  color: "#0f172a",
  outline: "none",
  boxShadow: "0 8px 18px rgba(15,23,42,0.04)",
};

const actionsGridStyle: React.CSSProperties = {
  display: "grid",
  gap: 10,
};

const featuresGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 12,
};

const featureCardStyle: React.CSSProperties = {
  borderRadius: 22,
  padding: "18px",
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.86), rgba(255,255,255,0.72))",
  border: "1px solid rgba(15,23,42,0.08)",
  boxShadow: "0 12px 28px rgba(15,23,42,0.05)",
  display: "grid",
  gap: 8,
};

const featureLabelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 900,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#2563eb",
};

const featureTitleStyle: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 900,
  lineHeight: 1.1,
  color: "#0f172a",
};

const featureTextStyle: React.CSSProperties = {
  fontSize: 14,
  lineHeight: 1.7,
  fontWeight: 700,
  color: "rgba(15,23,42,0.72)",
};

const warningBoxStyle: React.CSSProperties = {
  borderRadius: 16,
  padding: "14px 16px",
  background: "rgba(245,158,11,0.10)",
  border: "1px solid rgba(245,158,11,0.18)",
  color: "#92400e",
  fontSize: 14,
  lineHeight: 1.7,
  fontWeight: 700,
  maxWidth: 860,
};

const successBoxStyle: React.CSSProperties = {
  borderRadius: 16,
  padding: "14px 16px",
  background: "rgba(16,185,129,0.10)",
  border: "1px solid rgba(16,185,129,0.18)",
  color: "#047857",
  fontSize: 14,
  lineHeight: 1.7,
  fontWeight: 700,
  maxWidth: 860,
};

const errorBoxStyle: React.CSSProperties = {
  borderRadius: 16,
  padding: "14px 16px",
  background: "rgba(239,68,68,0.10)",
  border: "1px solid rgba(239,68,68,0.18)",
  color: "#b91c1c",
  fontSize: 14,
  lineHeight: 1.7,
  fontWeight: 700,
  maxWidth: 860,
};

const primaryButtonStyle: React.CSSProperties = {
  textDecoration: "none",
  color: "#ffffff",
  background: "linear-gradient(135deg, #2563eb, #3b82f6)",
  border: "1px solid rgba(37,99,235,0.16)",
  borderRadius: 14,
  padding: "12px 16px",
  fontWeight: 900,
  display: "inline-flex",
  justifyContent: "center",
  alignItems: "center",
  boxShadow: "0 14px 30px rgba(37,99,235,0.16)",
  fontSize: 14,
};

const primaryBlockButtonStyle: React.CSSProperties = {
  textDecoration: "none",
  color: "#ffffff",
  background: "linear-gradient(135deg, #2563eb, #3b82f6)",
  border: "1px solid rgba(37,99,235,0.16)",
  borderRadius: 14,
  padding: "13px 16px",
  fontWeight: 900,
  display: "inline-flex",
  justifyContent: "center",
  alignItems: "center",
  boxShadow: "0 14px 30px rgba(37,99,235,0.16)",
  fontSize: 14,
  cursor: "pointer",
};

const secondaryButtonStyle: React.CSSProperties = {
  textDecoration: "none",
  color: "#0f172a",
  background: "rgba(255,255,255,0.82)",
  border: "1px solid rgba(15,23,42,0.08)",
  borderRadius: 14,
  padding: "12px 16px",
  fontWeight: 800,
  display: "inline-flex",
  justifyContent: "center",
  alignItems: "center",
  boxShadow: "0 10px 22px rgba(15,23,42,0.05)",
  fontSize: 14,
};