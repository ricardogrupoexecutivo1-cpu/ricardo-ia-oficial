"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type CadastroBasicoApiResponse = {
  ok?: boolean;
  id?: string;
  email?: string;
  nome?: string;
  welcomePt?: string;
  welcomeEn?: string;
  error?: string;
};

function getErrorMessage(error: unknown) {
  if (!error) return "Falha ao salvar cadastro básico.";

  if (typeof error === "string") return error;

  if (error instanceof Error) return error.message;

  if (typeof error === "object") {
    const err = error as {
      message?: string;
      details?: string;
      hint?: string;
      code?: string;
      error?: string;
    };

    const parts = [
      err.error,
      err.message,
      err.details,
      err.hint,
      err.code,
    ].filter(Boolean);

    if (parts.length > 0) return parts.join(" | ");
  }

  return "Falha ao salvar cadastro básico.";
}

export default function CadastroBasicoPage() {
  const router = useRouter();
  const mountedAtRef = useRef<number>(Date.now());

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | "info">(
    "info"
  );

  useEffect(() => {
    mountedAtRef.current = Date.now();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFeedback("");

    try {
      if (!nome.trim()) {
        throw new Error("Preencha o nome.");
      }

      if (!email.trim()) {
        throw new Error("Preencha o e-mail.");
      }

      const emailNormalizado = email.trim().toLowerCase();

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailNormalizado)) {
        throw new Error("Digite um e-mail válido.");
      }

      const elapsedMs = Date.now() - mountedAtRef.current;
      if (elapsedMs < 1200) {
        throw new Error("Aguarde um instante e tente novamente.");
      }

      const response = await fetch("/api/cadastro-basico", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: nome.trim(),
          email: emailNormalizado,
        }),
      });

      const data: CadastroBasicoApiResponse = await response.json();

      if (!response.ok || !data?.ok) {
        throw new Error(data?.error || "Falha ao salvar cadastro básico.");
      }

      setFeedbackType("success");
      setFeedback("Cadastro básico salvo com sucesso.");

      const nomeSafe = encodeURIComponent(data.nome || nome.trim());
      const emailSafe = encodeURIComponent(data.email || emailNormalizado);
      const welcomePtSafe = encodeURIComponent(
        data.welcomePt ||
          `Bem-vindo, ${data.nome || nome.trim()}! Seu acesso inicial foi liberado com sucesso.`
      );
      const welcomeEnSafe = encodeURIComponent(
        data.welcomeEn ||
          `Welcome, ${data.nome || nome.trim()}! Your initial access has been successfully enabled.`
      );

      router.push(
        `/chat?welcome=1&name=${nomeSafe}&email=${emailSafe}&welcomePt=${welcomePtSafe}&welcomeEn=${welcomeEnSafe}`
      );
    } catch (error) {
      const message = getErrorMessage(error);
      console.error("Erro real do cadastro básico:", error);
      setFeedbackType("error");
      setFeedback(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(16,185,129,0.16), transparent 24%), linear-gradient(180deg, #07111f 0%, #08101a 35%, #05080f 100%)",
        color: "#f8fafc",
        padding: "32px 18px 80px",
      }}
    >
      <div
        style={{
          maxWidth: 840,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            marginBottom: 18,
          }}
        >
          <Link href="/" style={navStyle("#93c5fd")}>
            Voltar à Home
          </Link>
          <Link href="/chat" style={navStyle("#c4b5fd")}>
            Ir para o Chat
          </Link>
          <Link href="/cadastro" style={navStyle("#facc15")}>
            Cadastro completo
          </Link>
        </div>

        <section
          style={{
            borderRadius: 28,
            padding: 28,
            background: "rgba(8,15,28,0.88)",
            border: "1px solid rgba(148,163,184,0.16)",
            boxShadow: "0 25px 70px rgba(0,0,0,0.25)",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 14px",
              borderRadius: 999,
              background: "rgba(34,197,94,0.12)",
              border: "1px solid rgba(34,197,94,0.26)",
              color: "#bbf7d0",
              fontWeight: 800,
              fontSize: 13,
              marginBottom: 16,
            }}
          >
            🚀 CADASTRO BÁSICO • AURORA IA
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "clamp(2rem, 5vw, 3.4rem)",
              lineHeight: 1.05,
              fontWeight: 900,
            }}
          >
            Entre rápido agora
          </h1>

          <p
            style={{
              marginTop: 18,
              color: "#cbd5e1",
              fontSize: 17,
              lineHeight: 1.8,
              maxWidth: 720,
            }}
          >
            Preencha apenas nome e e-mail para entrar.
            O cadastro completo pode ser concluído depois, sem travar seu interesse agora.
          </p>

          <div
            style={{
              marginTop: 16,
              color: "#86efac",
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            ⚡ Nome + e-mail somente
          </div>

          <form onSubmit={handleSubmit} style={{ marginTop: 24 }}>
            <div
              style={{
                display: "grid",
                gap: 16,
              }}
            >
              <div style={fieldWrap}>
                <label style={labelStyle}>Nome</label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex.: Ricardo Leonardo Moreira"
                  style={inputStyle}
                  autoComplete="name"
                />
              </div>

              <div style={fieldWrap}>
                <label style={labelStyle}>E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ex.: ricardogrupoexecutivo1@gmail.com"
                  style={inputStyle}
                  autoComplete="email"
                  inputMode="email"
                />
              </div>
            </div>

            {feedback ? (
              <div
                style={{
                  marginTop: 18,
                  borderRadius: 16,
                  padding: 16,
                  lineHeight: 1.7,
                  whiteSpace: "pre-wrap",
                  border:
                    feedbackType === "error"
                      ? "1px solid rgba(239,68,68,0.35)"
                      : "1px solid rgba(34,197,94,0.35)",
                  background:
                    feedbackType === "error"
                      ? "rgba(239,68,68,0.10)"
                      : "rgba(34,197,94,0.10)",
                  color: feedbackType === "error" ? "#fecaca" : "#bbf7d0",
                }}
              >
                {feedback}
              </div>
            ) : null}

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 14,
                marginTop: 24,
              }}
            >
              <button type="submit" style={primaryButton} disabled={saving}>
                {saving ? "Salvando..." : "🚀 ENTRAR AGORA"}
              </button>

              <Link href="/cadastro" style={secondaryButton}>
                Ver cadastro completo
              </Link>
            </div>
          </form>

          <div
            style={{
              marginTop: 22,
              fontSize: 14,
              color: "#86efac",
              fontWeight: 700,
            }}
          >
            🔒 Plataforma protegida com bloqueio de atividades maliciosas e ações suspeitas.
          </div>
        </section>
      </div>
    </main>
  );
}

function navStyle(color: string): React.CSSProperties {
  return {
    color,
    textDecoration: "none",
    border: `1px solid ${color}33`,
    borderRadius: 999,
    padding: "10px 14px",
    fontWeight: 700,
    background: "rgba(15,23,42,0.45)",
  };
}

const fieldWrap: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

const labelStyle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 700,
  color: "#dbeafe",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: 14,
  border: "1px solid rgba(148,163,184,0.18)",
  background: "rgba(2,6,23,0.55)",
  color: "#ffffff",
  padding: "14px 16px",
  outline: "none",
  fontSize: 15,
};

const primaryButton: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 54,
  padding: "0 22px",
  borderRadius: 16,
  background: "linear-gradient(135deg, #22c55e 0%, #14b8a6 100%)",
  color: "#03130d",
  textDecoration: "none",
  fontWeight: 900,
  border: "none",
  cursor: "pointer",
};

const secondaryButton: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 54,
  padding: "0 22px",
  borderRadius: 16,
  background: "rgba(15,23,42,0.72)",
  color: "#f8fafc",
  textDecoration: "none",
  fontWeight: 900,
  border: "1px solid rgba(148,163,184,0.18)",
};