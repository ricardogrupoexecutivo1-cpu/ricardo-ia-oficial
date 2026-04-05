"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type Lang = "pt" | "en" | "es";
type AccessSource = "google" | "apple" | "email";

const COMPLETE_REGISTRATION_PATH = "/completar-cadastro";
const GENERAL_SIGNUP_HREF = "/cadastro-geral";
const SEARCH_COMPANIES_HREF = "/cadastros";
const CHAT_HREF = "/chat";
const HOME_HREF = "/";

const copyByLang = {
  pt: {
    badge: "Entrada oficial da Aurora",
    title: "Entre na Aurora do jeito mais fácil",
    subtitle:
      "Seu acesso pode ser salvo agora e o cadastro geral pode ser completado depois, sem travar sua navegação.",
    emailLabel: "Seu e-mail",
    emailPlaceholder: "Ex.: ricardogrupoexecutivo1@gmail.com",
    continueWithGoogle: "Continuar com Google",
    continueWithApple: "Continuar com Apple",
    continueWithEmail: "Entrar com e-mail",
    emailHelp:
      "Ao entrar com e-mail, a Aurora já pode salvar sua base de acesso com segurança.",
    quickTitle: "Fluxo pensado para escala",
    quickOne: "Acesso salvo primeiro",
    quickOneText:
      "A pessoa entra rápido e já fica identificada na plataforma.",
    quickTwo: "Cadastro completo depois",
    quickTwoText:
      "O preenchimento total pode ser concluído no melhor momento, sem bloquear o uso.",
    quickThree: "Mais volume e retenção",
    quickThreeText:
      "Esse fluxo ajuda a aumentar base salva, recorrência e percepção de crescimento.",
    footerPrimary: "Cadastro geral",
    footerSecondary: "Explorar empresas",
    footerThird: "Abrir chat Aurora",
    footerFourth: "Voltar para home",
    invalidEmail:
      "Digite um e-mail válido para continuar com entrada por e-mail.",
    directEntryLabel: "Entrada direta",
    oauthLoadingGoogle: "Conectando com Google...",
    oauthLoadingApple: "Conectando com Apple...",
    oauthFailedFallback:
      "OAuth não disponível agora. Mantivemos seu acesso pelo fluxo seguro da Aurora.",
  },
  en: {
    badge: "Aurora official access",
    title: "Enter Aurora the easiest way",
    subtitle:
      "Your access can be saved now and the full registration can be completed later, without blocking your navigation.",
    emailLabel: "Your email",
    emailPlaceholder: "Ex.: ricardogrupoexecutivo1@gmail.com",
    continueWithGoogle: "Continue with Google",
    continueWithApple: "Continue with Apple",
    continueWithEmail: "Continue with email",
    emailHelp:
      "When entering with email, Aurora can already save your access base safely.",
    quickTitle: "Flow designed for scale",
    quickOne: "Access saved first",
    quickOneText:
      "The person enters quickly and is already identified on the platform.",
    quickTwo: "Full registration later",
    quickTwoText:
      "Full completion can happen at the best moment, without blocking use.",
    quickThree: "More volume and retention",
    quickThreeText:
      "This flow helps increase saved base, recurrence and perception of growth.",
    footerPrimary: "General registration",
    footerSecondary: "Explore companies",
    footerThird: "Open Aurora chat",
    footerFourth: "Back to home",
    invalidEmail: "Enter a valid email to continue with email access.",
    directEntryLabel: "Direct entry",
    oauthLoadingGoogle: "Connecting with Google...",
    oauthLoadingApple: "Connecting with Apple...",
    oauthFailedFallback:
      "OAuth is not available right now. We kept your access through Aurora's safe flow.",
  },
  es: {
    badge: "Entrada oficial de Aurora",
    title: "Entra en Aurora de la forma más fácil",
    subtitle:
      "Tu acceso puede guardarse ahora y el registro general puede completarse después, sin bloquear tu navegación.",
    emailLabel: "Tu correo",
    emailPlaceholder: "Ej.: ricardogrupoexecutivo1@gmail.com",
    continueWithGoogle: "Continuar con Google",
    continueWithApple: "Continuar con Apple",
    continueWithEmail: "Entrar con correo",
    emailHelp:
      "Al entrar con correo, Aurora ya puede guardar tu base de acceso con seguridad.",
    quickTitle: "Flujo pensado para escalar",
    quickOne: "Acceso guardado primero",
    quickOneText:
      "La persona entra rápido y ya queda identificada en la plataforma.",
    quickTwo: "Registro completo después",
    quickTwoText:
      "El llenado total puede terminarse en el mejor momento, sin bloquear el uso.",
    quickThree: "Más volumen y retención",
    quickThreeText:
      "Este flujo ayuda a aumentar la base guardada, la recurrencia y la percepción de crecimiento.",
    footerPrimary: "Registro general",
    footerSecondary: "Explorar empresas",
    footerThird: "Abrir chat Aurora",
    footerFourth: "Volver al inicio",
    invalidEmail:
      "Introduce un correo válido para continuar con entrada por correo.",
    directEntryLabel: "Entrada directa",
    oauthLoadingGoogle: "Conectando con Google...",
    oauthLoadingApple: "Conectando con Apple...",
    oauthFailedFallback:
      "OAuth no está disponible ahora. Mantuvimos tu acceso con el flujo seguro de Aurora.",
  },
} satisfies Record<
  Lang,
  {
    badge: string;
    title: string;
    subtitle: string;
    emailLabel: string;
    emailPlaceholder: string;
    continueWithGoogle: string;
    continueWithApple: string;
    continueWithEmail: string;
    emailHelp: string;
    quickTitle: string;
    quickOne: string;
    quickOneText: string;
    quickTwo: string;
    quickTwoText: string;
    quickThree: string;
    quickThreeText: string;
    footerPrimary: string;
    footerSecondary: string;
    footerThird: string;
    footerFourth: string;
    invalidEmail: string;
    directEntryLabel: string;
    oauthLoadingGoogle: string;
    oauthLoadingApple: string;
    oauthFailedFallback: string;
  }
>;

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function getSupabaseBrowserClient(): SupabaseClient | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  try {
    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  } catch {
    return null;
  }
}

function saveAccessBase(source: AccessSource, email: string) {
  const normalizedEmail = email.trim().toLowerCase();

  try {
    localStorage.setItem("aurora_access_status", "cadastro_iniciado");
    localStorage.setItem("aurora_profile_completion_status", "incompleto");
    localStorage.setItem("aurora_post_login_reminder_pending", "true");
    localStorage.setItem("aurora_post_login_last_source", source);
    localStorage.setItem("aurora_post_login_last_seen_at", new Date().toISOString());
    localStorage.setItem("aurora_last_login_email", normalizedEmail);
    localStorage.setItem("aurora_signup_email", normalizedEmail);
    localStorage.setItem("aurora_email", normalizedEmail);

    const savedUsersRaw = localStorage.getItem("aurora_saved_access_leads");
    const savedUsers = savedUsersRaw ? JSON.parse(savedUsersRaw) : [];

    const withoutDuplicate = Array.isArray(savedUsers)
      ? savedUsers.filter((item: any) => {
          const itemEmail = String(item?.email || "").toLowerCase();
          return itemEmail !== normalizedEmail;
        })
      : [];

    withoutDuplicate.unshift({
      email: normalizedEmail,
      source,
      status: "cadastro_iniciado",
      profile_completion_status: "incompleto",
      saved_at: new Date().toISOString(),
    });

    localStorage.setItem(
      "aurora_saved_access_leads",
      JSON.stringify(withoutDuplicate.slice(0, 2000))
    );
  } catch {}
}

function buildCompleteRegistrationUrl(source: AccessSource, email: string, lang: Lang) {
  const encodedEmail = encodeURIComponent(email.trim().toLowerCase());
  return `${window.location.origin}${COMPLETE_REGISTRATION_PATH}?source=${source}&email=${encodedEmail}&lang=${lang}`;
}

function redirectToCompleteRegistration(source: AccessSource, email: string, lang: Lang) {
  const target = buildCompleteRegistrationUrl(source, email, lang);
  window.location.href = target;
}

export default function LoginPage() {
  const [lang, setLang] = useState<Lang>("pt");
  const [email, setEmail] = useState("ricardogrupoexecutivo1@gmail.com");
  const [error, setError] = useState("");
  const [loadingProvider, setLoadingProvider] = useState<AccessSource | "">("");
  const [notice, setNotice] = useState("");

  const t = useMemo(() => copyByLang[lang], [lang]);

  async function handleSocialEntry(source: AccessSource) {
    const fallbackEmail =
      email.trim().toLowerCase() || `acesso-${source}@aurora.local`;

    setError("");
    setNotice("");
    setLoadingProvider(source);

    saveAccessBase(source, fallbackEmail);

    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setNotice(t.oauthFailedFallback);
      redirectToCompleteRegistration(source, fallbackEmail, lang);
      return;
    }

    try {
      const redirectTo = buildCompleteRegistrationUrl(source, fallbackEmail, lang);

      const provider = source === "google" ? "google" : "apple";

      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo,
          queryParams:
            source === "google"
              ? {
                  access_type: "offline",
                  prompt: "select_account",
                }
              : undefined,
        },
      });

      if (authError) {
        setNotice(t.oauthFailedFallback);
        redirectToCompleteRegistration(source, fallbackEmail, lang);
        return;
      }
    } catch {
      setNotice(t.oauthFailedFallback);
      redirectToCompleteRegistration(source, fallbackEmail, lang);
    } finally {
      setLoadingProvider("");
    }
  }

  function handleEmailEntry() {
    const normalizedEmail = email.trim().toLowerCase();

    if (!isValidEmail(normalizedEmail)) {
      setError(t.invalidEmail);
      return;
    }

    setError("");
    setNotice("");
    saveAccessBase("email", normalizedEmail);
    redirectToCompleteRegistration("email", normalizedEmail, lang);
  }

  const googleButtonLabel =
    loadingProvider === "google" ? t.oauthLoadingGoogle : t.continueWithGoogle;

  const appleButtonLabel =
    loadingProvider === "apple" ? t.oauthLoadingApple : t.continueWithApple;

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(59,130,246,0.10), transparent 18%), radial-gradient(circle at right, rgba(16,185,129,0.10), transparent 22%), linear-gradient(180deg, #eef6ff 0%, #f7fbff 38%, #edf7f3 100%)",
        color: "#0f172a",
        padding: "24px 16px 48px",
      }}
    >
      <section
        style={{
          maxWidth: 1160,
          margin: "0 auto",
          display: "grid",
          gap: 18,
        }}
      >
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
            border: "1px solid rgba(15,23,42,0.08)",
            background: "rgba(255,255,255,0.78)",
            backdropFilter: "blur(14px)",
            borderRadius: 24,
            padding: "14px 16px",
            boxShadow: "0 18px 42px rgba(15,23,42,0.07)",
          }}
        >
          <div style={{ display: "grid", gap: 3 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 900,
                letterSpacing: "0.08em",
                color: "#2563eb",
                textTransform: "uppercase",
              }}
            >
              ricardoiaoficial.com
            </div>

            <div
              style={{
                fontSize: 18,
                fontWeight: 900,
                lineHeight: 1.15,
              }}
            >
              Aurora IA • Entrada de acesso
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 6,
              flexWrap: "wrap",
            }}
          >
            <LanguageButton
              label="PT"
              active={lang === "pt"}
              onClick={() => setLang("pt")}
            />
            <LanguageButton
              label="EN"
              active={lang === "en"}
              onClick={() => setLang("en")}
            />
            <LanguageButton
              label="ES"
              active={lang === "es"}
              onClick={() => setLang("es")}
            />
          </div>
        </header>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 18,
            alignItems: "stretch",
          }}
        >
          <div
            style={{
              display: "grid",
              gap: 16,
              border: "1px solid rgba(15,23,42,0.08)",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.88), rgba(255,255,255,0.74))",
              borderRadius: 30,
              padding: "24px 20px",
              boxShadow: "0 22px 70px rgba(15,23,42,0.09)",
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
              {t.badge}
            </div>

            <div style={{ display: "grid", gap: 10 }}>
              <h1
                style={{
                  margin: 0,
                  fontSize: "clamp(30px, 5vw, 46px)",
                  lineHeight: 0.98,
                  letterSpacing: "-0.04em",
                }}
              >
                {t.title}
              </h1>

              <p
                style={{
                  margin: 0,
                  color: "rgba(15,23,42,0.70)",
                  fontSize: 16,
                  lineHeight: 1.7,
                  fontWeight: 700,
                }}
              >
                {t.subtitle}
              </p>
            </div>

            <div style={socialButtonsWrapStyle}>
              <button
                type="button"
                onClick={() => handleSocialEntry("google")}
                style={socialButtonStyle}
                disabled={loadingProvider !== ""}
              >
                {googleButtonLabel}
              </button>

              <button
                type="button"
                onClick={() => handleSocialEntry("apple")}
                style={socialButtonStyle}
                disabled={loadingProvider !== ""}
              >
                {appleButtonLabel}
              </button>
            </div>

            <div style={emailCardStyle}>
              <label
                htmlFor="aurora-login-email"
                style={{
                  fontSize: 12,
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "rgba(15,23,42,0.58)",
                }}
              >
                {t.emailLabel}
              </label>

              <input
                id="aurora-login-email"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (error) setError("");
                }}
                placeholder={t.emailPlaceholder}
                autoComplete="email"
                style={inputStyle}
              />

              <button
                type="button"
                onClick={handleEmailEntry}
                style={primaryBigButtonStyle}
                disabled={loadingProvider !== ""}
              >
                {t.continueWithEmail}
              </button>

              <div
                style={{
                  color: "rgba(15,23,42,0.58)",
                  fontSize: 13,
                  lineHeight: 1.65,
                  fontWeight: 700,
                }}
              >
                {t.emailHelp}
              </div>

              {error ? <div style={errorStyle}>{error}</div> : null}
              {notice ? <div style={noticeStyle}>{notice}</div> : null}
            </div>

            <div
              style={{
                color: "rgba(15,23,42,0.54)",
                fontSize: 13,
                lineHeight: 1.65,
                fontWeight: 700,
              }}
            >
              {t.directEntryLabel}: Google, Apple ou e-mail.
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gap: 18,
            }}
          >
            <section style={infoCardStyle}>
              <div style={sectionBadgeStyle}>{t.quickTitle}</div>

              <div style={benefitListStyle}>
                <BenefitCard title={t.quickOne} text={t.quickOneText} />
                <BenefitCard title={t.quickTwo} text={t.quickTwoText} />
                <BenefitCard title={t.quickThree} text={t.quickThreeText} />
              </div>
            </section>

            <section style={reminderCardStyle}>
              <div style={sectionBadgeStyle}>Aurora IA</div>

              <div
                style={{
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap",
                }}
              >
                <Link href={GENERAL_SIGNUP_HREF} style={secondaryBigButtonStyle}>
                  {t.footerPrimary}
                </Link>

                <Link href={SEARCH_COMPANIES_HREF} style={secondaryBigButtonStyle}>
                  {t.footerSecondary}
                </Link>

                <Link href={CHAT_HREF} style={secondaryBigButtonStyle}>
                  {t.footerThird}
                </Link>

                <Link href={HOME_HREF} style={secondaryBigButtonStyle}>
                  {t.footerFourth}
                </Link>
              </div>
            </section>
          </div>
        </section>
      </section>
    </main>
  );
}

function LanguageButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        minHeight: 32,
        padding: "0 11px",
        borderRadius: 999,
        border: active
          ? "1px solid rgba(37,99,235,0.24)"
          : "1px solid rgba(15,23,42,0.08)",
        background: active
          ? "linear-gradient(135deg, rgba(37,99,235,0.10), rgba(59,130,246,0.04))"
          : "rgba(255,255,255,0.66)",
        color: active ? "#1d4ed8" : "#0f172a",
        fontWeight: 900,
        cursor: "pointer",
        boxShadow: active ? "0 0 14px rgba(37,99,235,0.06)" : "none",
        fontSize: 12,
      }}
    >
      {label}
    </button>
  );
}

function BenefitCard({ title, text }: { title: string; text: string }) {
  return (
    <div
      style={{
        border: "1px solid rgba(15,23,42,0.08)",
        background: "rgba(255,255,255,0.84)",
        borderRadius: 20,
        padding: "16px",
        boxShadow: "0 12px 28px rgba(15,23,42,0.05)",
        display: "grid",
        gap: 6,
      }}
    >
      <div
        style={{
          fontSize: 16,
          fontWeight: 900,
          color: "#0f172a",
          lineHeight: 1.2,
        }}
      >
        {title}
      </div>

      <div
        style={{
          color: "rgba(15,23,42,0.72)",
          lineHeight: 1.7,
          fontSize: 15,
          fontWeight: 700,
        }}
      >
        {text}
      </div>
    </div>
  );
}

const socialButtonsWrapStyle: React.CSSProperties = {
  display: "grid",
  gap: 10,
};

const socialButtonStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 52,
  borderRadius: 16,
  border: "1px solid rgba(15,23,42,0.08)",
  background: "rgba(255,255,255,0.84)",
  color: "#0f172a",
  fontWeight: 900,
  fontSize: 15,
  cursor: "pointer",
  boxShadow: "0 10px 22px rgba(15,23,42,0.05)",
  opacity: 1,
};

const emailCardStyle: React.CSSProperties = {
  display: "grid",
  gap: 10,
  border: "1px solid rgba(15,23,42,0.08)",
  background: "rgba(248,250,252,0.88)",
  borderRadius: 20,
  padding: "16px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 50,
  borderRadius: 14,
  border: "1px solid rgba(15,23,42,0.12)",
  padding: "0 14px",
  fontSize: 15,
  fontWeight: 700,
  color: "#0f172a",
  background: "#ffffff",
  outline: "none",
  boxSizing: "border-box",
};

const infoCardStyle: React.CSSProperties = {
  display: "grid",
  gap: 14,
  border: "1px solid rgba(15,23,42,0.08)",
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.86), rgba(248,250,252,0.90))",
  borderRadius: 26,
  padding: "20px",
  boxShadow: "0 16px 40px rgba(15,23,42,0.06)",
};

const reminderCardStyle: React.CSSProperties = {
  display: "grid",
  gap: 14,
  border: "1px solid rgba(37,99,235,0.10)",
  background:
    "linear-gradient(135deg, rgba(37,99,235,0.06), rgba(255,255,255,0.84), rgba(16,185,129,0.06))",
  borderRadius: 26,
  padding: "20px",
  boxShadow: "0 16px 40px rgba(15,23,42,0.06)",
};

const sectionBadgeStyle: React.CSSProperties = {
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

const benefitListStyle: React.CSSProperties = {
  display: "grid",
  gap: 12,
};

const primaryBigButtonStyle: React.CSSProperties = {
  textDecoration: "none",
  color: "#ffffff",
  background: "linear-gradient(135deg, #2563eb, #3b82f6)",
  border: "1px solid rgba(37,99,235,0.16)",
  borderRadius: 15,
  padding: "13px 16px",
  fontWeight: 900,
  display: "inline-flex",
  justifyContent: "center",
  alignItems: "center",
  boxShadow: "0 14px 30px rgba(37,99,235,0.16)",
  fontSize: 14,
  cursor: "pointer",
};

const secondaryBigButtonStyle: React.CSSProperties = {
  textDecoration: "none",
  color: "#0f172a",
  background: "rgba(255,255,255,0.78)",
  border: "1px solid rgba(15,23,42,0.08)",
  borderRadius: 15,
  padding: "13px 16px",
  fontWeight: 800,
  display: "inline-flex",
  justifyContent: "center",
  alignItems: "center",
  boxShadow: "0 10px 22px rgba(15,23,42,0.05)",
  fontSize: 14,
};

const errorStyle: React.CSSProperties = {
  border: "1px solid rgba(239,68,68,0.16)",
  background: "rgba(239,68,68,0.08)",
  color: "#991b1b",
  borderRadius: 14,
  padding: "10px 12px",
  fontSize: 14,
  fontWeight: 800,
  lineHeight: 1.6,
};

const noticeStyle: React.CSSProperties = {
  border: "1px solid rgba(37,99,235,0.16)",
  background: "rgba(37,99,235,0.08)",
  color: "#1d4ed8",
  borderRadius: 14,
  padding: "10px 12px",
  fontSize: 14,
  fontWeight: 800,
  lineHeight: 1.6,
};