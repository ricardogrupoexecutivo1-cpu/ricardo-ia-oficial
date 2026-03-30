"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function getSupabaseBrowserClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) return null;

  return createClient(url, anonKey);
}

export default function CadastroBasicoPage() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | "info">(
    "info"
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFeedback("");

    try {
      const supabase = getSupabaseBrowserClient();

      if (!supabase) {
        throw new Error(
          "Variáveis NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY não configuradas."
        );
      }

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;

      if (!user) {
        throw new Error("Você precisa estar logado para salvar o cadastro básico.");
      }

      if (!nome.trim()) {
        throw new Error("Preencha o nome.");
      }

      if (!email.trim()) {
        throw new Error("Preencha o e-mail.");
      }

      const payload = {
        user_id: user.id,
        nome_responsavel: nome.trim(),
        email: email.trim(),
        status: "rascunho",
        is_public: false,
        origem: "cadastro_basico",
      };

      const { error } = await supabase.from("cadastros_gerais").insert(payload);

      if (error) throw error;

      setFeedbackType("success");
      setFeedback("Cadastro básico salvo com sucesso.");

      const emailSafe = encodeURIComponent(email.trim());

      router.push(
        `/cadastro/sucesso?next=/cadastro&email=${emailSafe}&basic=1`
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Falha ao salvar cadastro básico.";
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
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex.: Ricardo Leonardo Moreira"
                  style={inputStyle}
                />
              </div>

              <div style={fieldWrap}>
                <label style={labelStyle}>E-mail</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ex.: ricardogrupoexecutivo1@gmail.com"
                  style={inputStyle}
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
                  border:
                    feedbackType === "error"
                      ? "1px solid rgba(239,68,68,0.35)"
                      : "1px solid rgba(34,197,94,0.35)",
                  background:
                    feedbackType === "error"
                      ? "rgba(239,68,68,0.10)"
                      : "rgba(34,197,94,0.10)",
                  color:
                    feedbackType === "error" ? "#fecaca" : "#bbf7d0",
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