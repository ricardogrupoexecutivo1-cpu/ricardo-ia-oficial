"use client";

import { useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function EntradaAuroraPage() {
  const [email, setEmail] = useState("ricardogrupoexecutivo1@gmail.com");
  const [password, setPassword] = useState("");
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingReset, setLoadingReset] = useState(false);
  const [message, setMessage] = useState(
    "Use sua conta para continuar no ecossistema Aurora."
  );
  const [audioStatus, setAudioStatus] = useState(
    "Áudio oficial da Aurora pronto para ativação."
  );

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // ✅ LOGIN COM SENHA (VOLTA PARA HOME REAL)
  async function handleEmailLogin() {
    try {
      setLoadingEmail(true);

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password.trim(),
      });

      if (error) throw error;

      // 🔥 VOLTA PARA O ECOSSISTEMA (COMO ERA)
      window.location.href = "/";
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setLoadingEmail(false);
    }
  }

  // ✅ GOOGLE LOGIN (VOLTA PARA HOME REAL)
  async function handleGoogleLogin() {
    try {
      setLoadingGoogle(true);

      // 🔥 VOLTA PARA O ECOSSISTEMA
      const redirectTo = `${window.location.origin}/`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      });

      if (error) throw error;
    } catch (error: any) {
      setMessage(error.message);
      setLoadingGoogle(false);
    }
  }

  async function handleResetPassword() {
    try {
      setLoadingReset(true);

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setMessage("Verifique seu e-mail para redefinir sua senha.");
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setLoadingReset(false);
    }
  }

  async function handlePlayAudio() {
    try {
      const audio = audioRef.current;
      if (!audio) return;

      audio.pause();
      audio.currentTime = 0;
      await audio.play();

      setAudioStatus("Apresentação oficial da Aurora em reprodução.");
    } catch {
      setAudioStatus("Erro ao reproduzir áudio.");
    }
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <section style={styles.hero}>
          <h1 style={styles.title}>
            Gere negócios reais com inteligência artificial
          </h1>

          <p style={styles.subtitle}>
            Entre, conecte sua empresa e encontre oportunidades reais dentro da Aurora.
          </p>

          <div style={styles.ctaRow}>
            <a href="/cadastro-geral" style={styles.primaryHeroLink}>
              Criar cadastro grátis
            </a>

            {/* 🔥 NÃO FORÇA NADA */}
            <button
              onClick={handleGoogleLogin}
              style={styles.secondaryHeroButton}
            >
              Entrar com Google
            </button>
          </div>

          <div style={styles.microCopy}>
            Leva menos de 1 minuto para começar
          </div>

          <div style={styles.audioCard}>
            <button onClick={handlePlayAudio} style={styles.audioButton}>
              ▶ Ouvir apresentação da Aurora
            </button>

            <audio ref={audioRef} controls style={{ width: "100%" }}>
              <source src="/audio/aurora-intro.ogg" />
            </audio>

            <div>{audioStatus}</div>
          </div>
        </section>

        <section style={styles.loginSection}>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail"
            style={styles.input}
          />

          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            type="password"
            style={styles.input}
          />

          <button onClick={handleEmailLogin} style={styles.primaryButton}>
            Entrar
          </button>

          <button onClick={handleGoogleLogin} style={styles.secondaryButton}>
            Entrar com Google
          </button>

          <button onClick={handleResetPassword} style={styles.linkButton}>
            Esqueci minha senha
          </button>

          <div>{message}</div>
        </section>
      </div>
    </main>
  );
}

const styles: any = {
  page: { padding: 20 },
  container: { maxWidth: 900, margin: "0 auto" },
  title: { fontSize: 32, fontWeight: 900 },
  subtitle: { marginBottom: 10 },
  ctaRow: { display: "flex", gap: 10, marginBottom: 10 },
  primaryHeroLink: { background: "#0f6fff", color: "#fff", padding: 10 },
  secondaryHeroButton: { padding: 10 },
  microCopy: { marginBottom: 10 },
  audioCard: { marginTop: 20 },
  audioButton: { padding: 10 },
  loginSection: { marginTop: 30, display: "grid", gap: 10 },
  input: { padding: 10 },
  primaryButton: { padding: 10, background: "#0f6fff", color: "#fff" },
  secondaryButton: { padding: 10 },
  linkButton: { background: "none", border: "none" },
};