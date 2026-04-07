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
  const [messageType, setMessageType] = useState<"info" | "success" | "error">(
    "info"
  );
  const [audioStatus, setAudioStatus] = useState(
    "Áudio oficial da Aurora pronto para ativação."
  );

  const audioRef = useRef<HTMLAudioElement | null>(null);

  function getFriendlyAuthError(message: string) {
    const raw = String(message || "").toLowerCase();

    if (
      raw.includes("invalid login credentials") ||
      raw.includes("invalid credentials") ||
      raw.includes("email not confirmed")
    ) {
      return "E-mail ou senha inválidos para login por senha. Como o Google já funcionou, sua conta existe. Você pode entrar com Google agora ou redefinir a senha abaixo.";
    }

    if (raw.includes("email rate limit exceeded")) {
      return "Muitas tentativas em pouco tempo. Aguarde um pouco e tente novamente.";
    }

    if (raw.includes("network") || raw.includes("fetch")) {
      return "Falha de conexão no momento. Tente novamente em instantes.";
    }

    return message || "Não foi possível entrar com e-mail e senha.";
  }

  async function handleEmailLogin() {
    try {
      setLoadingEmail(true);
      setMessage("Entrando com e-mail e senha...");
      setMessageType("info");

      const finalEmail = email.trim().toLowerCase();
      const finalPassword = password.trim();

      if (!finalEmail) {
        throw new Error("Informe o e-mail para entrar.");
      }

      if (!finalPassword) {
        throw new Error("Informe a senha para entrar.");
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: finalEmail,
        password: finalPassword,
      });

      if (error) {
        throw new Error(getFriendlyAuthError(error.message));
      }

      setMessage("Login realizado com sucesso. Redirecionando...");
      setMessageType("success");

      window.location.href = "/cadastro-geral";
    } catch (error: any) {
      setMessage(
        getFriendlyAuthError(
          error?.message || "Não foi possível entrar com e-mail e senha."
        )
      );
      setMessageType("error");
    } finally {
      setLoadingEmail(false);
    }
  }

  async function handleGoogleLogin() {
    try {
      setLoadingGoogle(true);
      setMessage("Redirecionando para o login com Google...");
      setMessageType("info");

      const redirectTo = `${window.location.origin}/cadastro-geral`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
        },
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error: any) {
      setMessage(error?.message || "Não foi possível iniciar o login com Google.");
      setMessageType("error");
      setLoadingGoogle(false);
    }
  }

  async function handleResetPassword() {
    try {
      setLoadingReset(true);
      setMessage("Enviando link de redefinição de senha...");
      setMessageType("info");

      const finalEmail = email.trim().toLowerCase();

      if (!finalEmail) {
        throw new Error("Informe seu e-mail para redefinir a senha.");
      }

      const { error } = await supabase.auth.resetPasswordForEmail(finalEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw new Error(error.message);
      }

      setMessage(
        "Link de redefinição enviado. Verifique seu e-mail e depois tente o login por senha novamente."
      );
      setMessageType("success");
    } catch (error: any) {
      setMessage(
        error?.message || "Não foi possível enviar a redefinição de senha."
      );
      setMessageType("error");
    } finally {
      setLoadingReset(false);
    }
  }

  async function handlePlayAudio() {
    try {
      setAudioStatus("Tentando reproduzir a apresentação da Aurora...");

      const audio = audioRef.current;
      if (!audio) {
        throw new Error("Player de áudio não encontrado.");
      }

      audio.pause();
      audio.currentTime = 0;

      await audio.play();

      setAudioStatus("Apresentação oficial da Aurora em reprodução.");
    } catch {
      setAudioStatus(
        "Não foi possível reproduzir o áudio. Confirme se o arquivo aurora-intro.ogg ou aurora-intro.mp3 está na pasta public\\audio."
      );
    }
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <section style={styles.hero}>
          <div style={styles.badge}>Nova entrada estratégica da Aurora</div>

          <div style={styles.topGrid}>
            <div style={styles.topContent}>
              <h1 style={styles.title}>
                Gere negócios reais com inteligência artificial
              </h1>

              <p style={styles.subtitle}>
                Entre, conecte sua empresa e encontre oportunidades reais dentro
                da Aurora.
              </p>

              <div style={styles.languageRow}>
                <span style={styles.languageActive}>PT</span>
                <span style={styles.languageItem}>EN</span>
                <span style={styles.languageItem}>ES</span>
              </div>

              <div style={styles.ctaRow}>
                <a href="/cadastro-geral" style={styles.primaryHeroLink}>
                  Criar cadastro grátis
                </a>
                <a href="/chat" style={styles.secondaryHeroLink}>
                  Entrar na Aurora agora
                </a>
              </div>

              <div style={styles.microCopy}>
                Leva menos de 1 minuto para começar
              </div>
            </div>

            <aside style={styles.heroAside}>
              <div style={styles.asideCard}>
                <div style={styles.asideLabel}>Entrada forte</div>
                <div style={styles.asideValue}>Mobile-first premium</div>
              </div>

              <div style={styles.asideCard}>
                <div style={styles.asideLabel}>Login</div>
                <div style={styles.asideValue}>Google + senha + reset</div>
              </div>

              <div style={styles.asideCard}>
                <div style={styles.asideLabel}>Áudio oficial</div>
                <div style={styles.asideValue}>Pronto para ativar</div>
              </div>
            </aside>
          </div>

          <div style={styles.audioCard}>
            <div style={styles.audioHeader}>
              <div>
                <div style={styles.audioTitle}>Apresentação da Aurora</div>
                <p style={styles.audioText}>
                  Ouça a apresentação oficial da plataforma com voz humana real
                  para dar mais clareza, confiança e retenção logo na entrada.
                </p>
              </div>

              <button
                type="button"
                onClick={handlePlayAudio}
                style={styles.audioButton}
              >
                ▶ Ouvir apresentação da Aurora
              </button>
            </div>

            <audio
              ref={audioRef}
              preload="metadata"
              style={styles.audioPlayer}
              controls
            >
              <source
                src="/audio/aurora-intro.ogg"
                type='audio/ogg; codecs="opus"'
              />
              <source src="/audio/aurora-intro.ogg" type="audio/ogg" />
              <source src="/audio/aurora-intro.mp3" type="audio/mpeg" />
              Seu navegador não suporta áudio HTML5.
            </audio>

            <div style={styles.audioStatus}>{audioStatus}</div>
          </div>

          <div style={styles.infoGrid}>
            <div style={styles.infoCard}>
              <div style={styles.infoTitle}>O que é a Aurora</div>
              <p style={styles.infoText}>
                Uma plataforma empresarial para cadastrar operações, conectar
                perfis e gerar oportunidades reais em múltiplos segmentos.
              </p>
            </div>

            <div style={styles.infoCard}>
              <div style={styles.infoTitle}>Como agir aqui dentro</div>
              <p style={styles.infoText}>
                Entre, cadastre sua empresa ou operação, escolha sua área e
                avance para os módulos que fazem mais sentido para você.
              </p>
            </div>

            <div style={styles.infoCard}>
              <div style={styles.infoTitle}>O que já existe</div>
              <p style={styles.infoText}>
                Chat, cadastro empresarial, app builder, financeiro, locadora,
                imóveis, agro e outras frentes do ecossistema Aurora.
              </p>
            </div>
          </div>
        </section>

        <section style={styles.loginSection}>
          <div style={styles.loginGrid}>
            <div style={styles.loginIntro}>
              <h2 style={styles.loginTitle}>Entrar na plataforma</h2>

              <p style={styles.loginSubtitle}>
                Sistema em constante atualização e pode haver momentos de
                instabilidade. Use sua conta para continuar no ecossistema
                Aurora.
              </p>

              <div style={styles.quickList}>
                <div style={styles.quickItem}>• Login com Google funcionando</div>
                <div style={styles.quickItem}>• Login por senha funcionando</div>
                <div style={styles.quickItem}>• Reset de senha funcionando</div>
                <div style={styles.quickItem}>
                  • Redirecionamento para cadastro-geral
                </div>
              </div>
            </div>

            <div>
              <section
                style={{
                  ...styles.messageBox,
                  ...(messageType === "success"
                    ? styles.messageSuccess
                    : messageType === "error"
                    ? styles.messageError
                    : styles.messageInfo),
                }}
              >
                {message}
              </section>

              <div style={styles.formWrap}>
                <label style={styles.fieldWrap}>
                  <span style={styles.label}>E-mail</span>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="Seu e-mail"
                    style={styles.input}
                  />
                </label>

                <label style={styles.fieldWrap}>
                  <span style={styles.label}>Senha</span>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="Sua senha"
                    style={styles.input}
                    onKeyDown={(e) => {
                      if (
                        e.key === "Enter" &&
                        !loadingEmail &&
                        !loadingGoogle &&
                        !loadingReset
                      ) {
                        handleEmailLogin();
                      }
                    }}
                  />
                </label>

                <button
                  type="button"
                  style={styles.primaryButton}
                  onClick={handleEmailLogin}
                  disabled={loadingEmail || loadingGoogle || loadingReset}
                >
                  {loadingEmail ? "Entrando..." : "Entrar"}
                </button>

                <button
                  type="button"
                  style={styles.secondaryButton}
                  onClick={handleGoogleLogin}
                  disabled={loadingEmail || loadingGoogle || loadingReset}
                >
                  {loadingGoogle ? "Abrindo Google..." : "Entrar com Google"}
                </button>

                <button
                  type="button"
                  style={styles.linkButton}
                  onClick={handleResetPassword}
                  disabled={loadingEmail || loadingGoogle || loadingReset}
                >
                  {loadingReset ? "Enviando redefinição..." : "Esqueci minha senha"}
                </button>
              </div>
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
    padding: "16px 12px 56px",
    color: "#142033",
  },
  container: {
    maxWidth: 1180,
    margin: "0 auto",
    display: "grid",
    gap: 16,
  },
  hero: {
    background: "linear-gradient(135deg, #ffffff 0%, #f6fbff 100%)",
    border: "1px solid #d7e6f7",
    borderRadius: 28,
    padding: 20,
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
    marginBottom: 14,
  },
  topGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.4fr) minmax(280px, 0.8fr)",
    gap: 16,
    alignItems: "stretch",
  },
  topContent: {
    display: "grid",
    gap: 12,
  },
  heroAside: {
    display: "grid",
    gap: 12,
  },
  asideCard: {
    padding: 16,
    borderRadius: 20,
    background: "#ffffff",
    border: "1px solid #dde9f5",
    boxShadow: "0 10px 25px rgba(20, 32, 51, 0.04)",
  },
  asideLabel: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: "#6c819a",
    fontWeight: 800,
    marginBottom: 6,
  },
  asideValue: {
    fontSize: 16,
    fontWeight: 900,
    color: "#13263f",
  },
  title: {
    fontSize: "clamp(30px, 6vw, 54px)",
    fontWeight: 900,
    margin: 0,
    color: "#0f1f35",
    lineHeight: 1.02,
    maxWidth: 760,
  },
  subtitle: {
    color: "#52637a",
    maxWidth: 720,
    margin: 0,
    lineHeight: 1.6,
    fontSize: 18,
    fontWeight: 600,
  },
  languageRow: {
    display: "flex",
    gap: 10,
    marginTop: 4,
    flexWrap: "wrap",
  },
  languageActive: {
    background: "#0f6fff",
    color: "#fff",
    padding: "7px 12px",
    borderRadius: 999,
    fontWeight: 800,
    fontSize: 13,
  },
  languageItem: {
    background: "#fff",
    border: "1px solid #d6e4f2",
    padding: "7px 12px",
    borderRadius: 999,
    fontWeight: 800,
    color: "#22415f",
    fontSize: 13,
  },
  ctaRow: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    marginTop: 2,
  },
  primaryHeroLink: {
    textDecoration: "none",
    padding: "14px 20px",
    borderRadius: 16,
    background: "#0f6fff",
    color: "#ffffff",
    fontWeight: 900,
    fontSize: 16,
    boxShadow: "0 12px 24px rgba(15, 111, 255, 0.18)",
  },
  secondaryHeroLink: {
    textDecoration: "none",
    padding: "14px 20px",
    borderRadius: 16,
    background: "#ffffff",
    color: "#22415f",
    border: "1px solid #d6e4f2",
    fontWeight: 900,
    fontSize: 16,
  },
  microCopy: {
    color: "#5f738d",
    fontSize: 14,
    fontWeight: 700,
    marginTop: 2,
  },
  audioCard: {
    marginTop: 18,
    padding: 18,
    borderRadius: 22,
    background: "#fff",
    border: "1px solid #dde9f5",
    boxShadow: "0 10px 25px rgba(20, 32, 51, 0.04)",
  },
  audioHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: 14,
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: 12,
  },
  audioTitle: {
    fontWeight: 900,
    marginBottom: 6,
    color: "#13263f",
    fontSize: 20,
  },
  audioText: {
    color: "#52637a",
    margin: 0,
    lineHeight: 1.7,
    maxWidth: 760,
  },
  audioButton: {
    border: 0,
    borderRadius: 16,
    padding: "14px 18px",
    fontWeight: 900,
    cursor: "pointer",
    background: "linear-gradient(90deg, #0f6fff 0%, #22c55e 100%)",
    color: "#ffffff",
    minWidth: 220,
  },
  audioPlayer: {
    width: "100%",
    display: "block",
  },
  audioStatus: {
    marginTop: 10,
    color: "#22415f",
    fontWeight: 800,
    lineHeight: 1.5,
  },
  infoGrid: {
    marginTop: 18,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 12,
  },
  infoCard: {
    padding: 16,
    borderRadius: 18,
    background: "#fff",
    border: "1px solid #dde9f5",
  },
  infoTitle: {
    fontWeight: 900,
    marginBottom: 6,
    color: "#13263f",
  },
  infoText: {
    color: "#52637a",
    lineHeight: 1.7,
    margin: 0,
  },
  loginSection: {
    background: "#fff",
    padding: 20,
    borderRadius: 24,
    border: "1px solid #dde9f5",
    boxShadow: "0 14px 34px rgba(19, 44, 74, 0.05)",
  },
  loginGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) minmax(320px, 420px)",
    gap: 18,
    alignItems: "start",
  },
  loginIntro: {
    display: "grid",
    gap: 10,
  },
  loginTitle: {
    fontWeight: 900,
    margin: 0,
    color: "#13263f",
    fontSize: 24,
  },
  loginSubtitle: {
    color: "#52637a",
    margin: 0,
    lineHeight: 1.7,
  },
  quickList: {
    display: "grid",
    gap: 6,
    marginTop: 2,
  },
  quickItem: {
    color: "#27415d",
    fontWeight: 700,
  },
  messageBox: {
    marginTop: 0,
    marginBottom: 14,
    borderRadius: 16,
    padding: "14px 16px",
    fontWeight: 800,
    lineHeight: 1.55,
  },
  messageSuccess: {
    background: "#edf9f0",
    border: "1px solid #c8ead0",
    color: "#18794e",
  },
  messageError: {
    background: "#fff1f1",
    border: "1px solid #f3c6c6",
    color: "#b42318",
  },
  messageInfo: {
    background: "#eef6ff",
    border: "1px solid #cfe3fb",
    color: "#1e5fae",
  },
  formWrap: {
    maxWidth: 420,
    display: "grid",
    gap: 10,
  },
  fieldWrap: {
    display: "grid",
    gap: 6,
  },
  label: {
    fontWeight: 800,
    color: "#27415d",
  },
  input: {
    padding: "13px 14px",
    borderRadius: 14,
    border: "1px solid #d8e5f1",
    background: "#fbfdff",
    color: "#142033",
    minHeight: 50,
    outline: "none",
  },
  primaryButton: {
    padding: 13,
    borderRadius: 14,
    background: "#0f6fff",
    color: "#fff",
    border: "none",
    fontWeight: 900,
    cursor: "pointer",
  },
  secondaryButton: {
    padding: 13,
    borderRadius: 14,
    border: "1px solid #ccc",
    background: "#fff",
    fontWeight: 900,
    cursor: "pointer",
    color: "#22415f",
  },
  linkButton: {
    padding: "12px 0 0",
    border: "none",
    background: "transparent",
    color: "#0f6fff",
    fontWeight: 900,
    cursor: "pointer",
    textAlign: "left",
  },
};