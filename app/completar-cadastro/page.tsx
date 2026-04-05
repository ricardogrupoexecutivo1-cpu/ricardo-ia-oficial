"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Lang = "pt" | "en" | "es";
type AccessSource = "google" | "apple" | "email" | "aurora" | "desconhecido";

type PrefillData = {
  found: boolean;
  sourceTable: string;
  fullName: string;
  companyName: string;
  whatsapp: string;
  city: string;
  state: string;
  segment: string;
  slug: string;
  status: string;
  email: string;
  coverageType: string;
  registrationType: string;
  registrationComplete: string;
  sourceOrigin: string;
  completionDeadline: string;
};

type AccessPrefillApiResponse = {
  ok: boolean;
  found: boolean;
  sourceTable: string;
  data: Omit<PrefillData, "found" | "sourceTable"> | null;
  error?: string;
};

const GENERAL_SIGNUP_HREF = "/cadastro-geral";
const SEARCH_COMPANIES_HREF = "/cadastros";
const CHAT_HREF = "/chat";
const HOME_HREF = "/";

const emptyPrefill: PrefillData = {
  found: false,
  sourceTable: "",
  fullName: "",
  companyName: "",
  whatsapp: "",
  city: "",
  state: "",
  segment: "",
  slug: "",
  status: "",
  email: "",
  coverageType: "",
  registrationType: "",
  registrationComplete: "",
  sourceOrigin: "",
  completionDeadline: "",
};

const copyByLang = {
  pt: {
    badge: "Acesso salvo com segurança",
    title: "Você já está dentro da Aurora",
    subtitle:
      "Seu acesso já está ativo. Agora você pode continuar navegando normalmente e completar seu cadastro no momento ideal.",
    sourceLabel: "Forma de entrada",
    emailLabel: "E-mail identificado",
    primaryButton: "Completar cadastro geral",
    secondaryButton: "Explorar empresas",
    tertiaryButton: "Abrir chat Aurora",
    quaternaryButton: "Voltar para home",
    benefitTitle: "O que acontece agora",
    benefitOne:
      "Seu acesso pode continuar ativo mesmo sem completar tudo neste momento.",
    benefitTwo:
      "A Aurora pode lembrar depois, de forma leve, que ainda falta concluir o cadastro geral.",
    benefitThree:
      "Completar o cadastro melhora sua presença, suas oportunidades e sua organização na plataforma.",
    reminderTitle: "Lembrete rápido, sem bloqueio",
    reminderText:
      "Você pode continuar navegando agora e concluir o cadastro geral depois. A ideia é facilitar a entrada, aumentar a base salva e escalar com segurança.",
    footerText:
      "Sistema em constante atualização. Pode haver momentos de instabilidade durante melhorias.",
    continueLater: "Continuar agora e lembrar depois",
    savedMessage: "Lembrete salvo. Você pode seguir sem bloqueio.",
    unknownSource: "Entrada direta",
    prefillBadge: "Pré-cadastro encontrado",
    prefillTitle: "Encontramos dados anteriores pelo seu e-mail",
    prefillText:
      "A Aurora reaproveitou informações já existentes para acelerar sua continuidade e evitar retrabalho.",
    prefillLoading: "Buscando dados anteriores pelo e-mail...",
    prefillNotFound:
      "Ainda não encontramos pré-cadastro por este e-mail. Você pode continuar normalmente.",
    prefillError:
      "Não foi possível consultar os dados anteriores agora. O acesso continua liberado sem travar.",
    fieldName: "Nome",
    fieldCompany: "Empresa",
    fieldWhatsapp: "WhatsApp",
    fieldCity: "Cidade",
    fieldState: "Estado",
    fieldSegment: "Segmento",
    fieldSlug: "Slug",
    fieldStatus: "Status",
    fieldSource: "Origem dos dados",
    fieldCoverage: "Cobertura",
    fieldRegistrationType: "Tipo de cadastro",
    fieldRegistrationComplete: "Cadastro completo",
    fieldOrigin: "Origem",
    fieldDeadline: "Prazo",
  },
  en: {
    badge: "Access safely saved",
    title: "You are already inside Aurora",
    subtitle:
      "Your access is already active. Now you can keep browsing normally and complete your registration at the ideal moment.",
    sourceLabel: "Access method",
    emailLabel: "Identified email",
    primaryButton: "Complete general registration",
    secondaryButton: "Explore companies",
    tertiaryButton: "Open Aurora chat",
    quaternaryButton: "Back to home",
    benefitTitle: "What happens now",
    benefitOne:
      "Your access can remain active even if you do not complete everything right now.",
    benefitTwo:
      "Aurora can remind you later, lightly, that the general registration is still pending.",
    benefitThree:
      "Completing the registration improves your presence, opportunities and organization on the platform.",
    reminderTitle: "Quick reminder, no blocking",
    reminderText:
      "You can keep browsing now and finish the general registration later. The idea is to make entry easier, grow the saved base and scale safely.",
    footerText:
      "System constantly updating. There may be moments of instability during improvements.",
    continueLater: "Continue now and remember later",
    savedMessage: "Reminder saved. You can continue without blocking.",
    unknownSource: "Direct entry",
    prefillBadge: "Previous registration found",
    prefillTitle: "We found previous data using your email",
    prefillText:
      "Aurora reused existing information to speed up your continuation and avoid rework.",
    prefillLoading: "Searching previous data by email...",
    prefillNotFound:
      "We have not found previous registration for this email yet. You can continue normally.",
    prefillError:
      "We could not query previous data right now. Access remains open without blocking.",
    fieldName: "Name",
    fieldCompany: "Company",
    fieldWhatsapp: "WhatsApp",
    fieldCity: "City",
    fieldState: "State",
    fieldSegment: "Segment",
    fieldSlug: "Slug",
    fieldStatus: "Status",
    fieldSource: "Data source",
    fieldCoverage: "Coverage",
    fieldRegistrationType: "Registration type",
    fieldRegistrationComplete: "Registration complete",
    fieldOrigin: "Origin",
    fieldDeadline: "Deadline",
  },
  es: {
    badge: "Acceso guardado con seguridad",
    title: "Ya estás dentro de Aurora",
    subtitle:
      "Tu acceso ya está activo. Ahora puedes seguir navegando normalmente y completar tu registro en el momento ideal.",
    sourceLabel: "Forma de acceso",
    emailLabel: "Correo identificado",
    primaryButton: "Completar registro general",
    secondaryButton: "Explorar empresas",
    tertiaryButton: "Abrir chat Aurora",
    quaternaryButton: "Volver al inicio",
    benefitTitle: "Qué pasa ahora",
    benefitOne:
      "Tu acceso puede seguir activo aunque no completes todo en este momento.",
    benefitTwo:
      "Aurora puede recordarte después, de forma ligera, que aún falta terminar el registro general.",
    benefitThree:
      "Completar el registro mejora tu presencia, tus oportunidades y tu organización dentro de la plataforma.",
    reminderTitle: "Recordatorio rápido, sin bloqueo",
    reminderText:
      "Puedes seguir navegando ahora y terminar el registro general después. La idea es facilitar la entrada, aumentar la base guardada y escalar con seguridad.",
    footerText:
      "Sistema en constante actualización. Puede haber momentos de inestabilidad durante mejoras.",
    continueLater: "Continuar ahora y recordar después",
    savedMessage: "Recordatorio guardado. Puedes seguir sin bloqueo.",
    unknownSource: "Entrada directa",
    prefillBadge: "Prerregistro encontrado",
    prefillTitle: "Encontramos datos anteriores con tu correo",
    prefillText:
      "Aurora reutilizó información existente para acelerar tu continuidad y evitar repetir trabajo.",
    prefillLoading: "Buscando datos anteriores por correo...",
    prefillNotFound:
      "Todavía no encontramos prerregistro para este correo. Puedes continuar normalmente.",
    prefillError:
      "No fue posible consultar los datos anteriores ahora. El acceso sigue liberado sin bloqueo.",
    fieldName: "Nombre",
    fieldCompany: "Empresa",
    fieldWhatsapp: "WhatsApp",
    fieldCity: "Ciudad",
    fieldState: "Estado",
    fieldSegment: "Segmento",
    fieldSlug: "Slug",
    fieldStatus: "Estado",
    fieldSource: "Origen de datos",
    fieldCoverage: "Cobertura",
    fieldRegistrationType: "Tipo de registro",
    fieldRegistrationComplete: "Registro completo",
    fieldOrigin: "Origen",
    fieldDeadline: "Plazo",
  },
} satisfies Record<
  Lang,
  {
    badge: string;
    title: string;
    subtitle: string;
    sourceLabel: string;
    emailLabel: string;
    primaryButton: string;
    secondaryButton: string;
    tertiaryButton: string;
    quaternaryButton: string;
    benefitTitle: string;
    benefitOne: string;
    benefitTwo: string;
    benefitThree: string;
    reminderTitle: string;
    reminderText: string;
    footerText: string;
    continueLater: string;
    savedMessage: string;
    unknownSource: string;
    prefillBadge: string;
    prefillTitle: string;
    prefillText: string;
    prefillLoading: string;
    prefillNotFound: string;
    prefillError: string;
    fieldName: string;
    fieldCompany: string;
    fieldWhatsapp: string;
    fieldCity: string;
    fieldState: string;
    fieldSegment: string;
    fieldSlug: string;
    fieldStatus: string;
    fieldSource: string;
    fieldCoverage: string;
    fieldRegistrationType: string;
    fieldRegistrationComplete: string;
    fieldOrigin: string;
    fieldDeadline: string;
  }
>;

function readSearchParam(name: string) {
  if (typeof window === "undefined") return "";
  const url = new URL(window.location.href);
  return url.searchParams.get(name) || "";
}

function normalizeSource(value: string): AccessSource {
  const normalized = value.toLowerCase().trim();

  if (normalized === "google") return "google";
  if (normalized === "apple") return "apple";
  if (normalized === "email") return "email";
  if (normalized === "aurora") return "aurora";

  return "desconhecido";
}

function getSourceLabel(source: AccessSource, unknownLabel: string) {
  switch (source) {
    case "google":
      return "Google";
    case "apple":
      return "Apple";
    case "email":
      return "E-mail";
    case "aurora":
      return "Aurora";
    default:
      return unknownLabel;
  }
}

function formatDate(value: string) {
  if (!value) return "-";

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleString("pt-BR");
}

function formatBooleanLike(value: string) {
  if (!value) return "-";
  if (value === "true") return "Sim";
  if (value === "false") return "Não";
  return value;
}

export default function CompletarCadastroPage() {
  const [lang, setLang] = useState<Lang>("pt");
  const [source, setSource] = useState<AccessSource>("desconhecido");
  const [email, setEmail] = useState("");
  const [savedNotice, setSavedNotice] = useState("");
  const [prefill, setPrefill] = useState<PrefillData>(emptyPrefill);
  const [prefillLoading, setPrefillLoading] = useState(true);
  const [prefillMessage, setPrefillMessage] = useState("");

  const t = useMemo(() => copyByLang[lang], [lang]);

  useEffect(() => {
    const urlLang = readSearchParam("lang");
    if (urlLang === "pt" || urlLang === "en" || urlLang === "es") {
      setLang(urlLang);
    }

    const sourceParam = readSearchParam("source");
    const emailParam = readSearchParam("email");

    const normalizedSource = normalizeSource(sourceParam);
    setSource(normalizedSource);

    if (emailParam) {
      const decodedEmail = decodeURIComponent(emailParam);
      setEmail(decodedEmail);

      try {
        localStorage.setItem("aurora_last_login_email", decodedEmail);
      } catch {}
    } else {
      try {
        const savedEmail =
          localStorage.getItem("aurora_last_login_email") ||
          localStorage.getItem("aurora_signup_email") ||
          localStorage.getItem("aurora_email") ||
          "";
        setEmail(savedEmail);
      } catch {}
    }

    try {
      localStorage.setItem("aurora_access_status", "cadastro_iniciado");
      localStorage.setItem("aurora_profile_completion_status", "incompleto");
      localStorage.setItem("aurora_post_login_reminder_pending", "true");
      localStorage.setItem("aurora_post_login_last_source", normalizedSource);
      localStorage.setItem(
        "aurora_post_login_last_seen_at",
        new Date().toISOString()
      );
    } catch {}
  }, []);

  useEffect(() => {
    async function loadPrefill() {
      if (!email) {
        setPrefillLoading(false);
        return;
      }

      setPrefillLoading(true);
      setPrefillMessage("");

      try {
        const response = await fetch(
          `/api/access-prefill?email=${encodeURIComponent(email.trim().toLowerCase())}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const payload: AccessPrefillApiResponse = await response.json();

        if (!response.ok || !payload.ok) {
          setPrefill(emptyPrefill);
          setPrefillMessage(payload.error || t.prefillError);
          setPrefillLoading(false);
          return;
        }

        if (!payload.found || !payload.data) {
          setPrefill(emptyPrefill);
          setPrefillMessage(t.prefillNotFound);
          setPrefillLoading(false);
          return;
        }

        const normalizedPrefill: PrefillData = {
          found: true,
          sourceTable: payload.sourceTable,
          fullName: payload.data.fullName || "",
          companyName: payload.data.companyName || "",
          whatsapp: payload.data.whatsapp || "",
          city: payload.data.city || "",
          state: payload.data.state || "",
          segment: payload.data.segment || "",
          slug: payload.data.slug || "",
          status: payload.data.status || "",
          email: payload.data.email || "",
          coverageType: payload.data.coverageType || "",
          registrationType: payload.data.registrationType || "",
          registrationComplete: payload.data.registrationComplete || "",
          sourceOrigin: payload.data.sourceOrigin || "",
          completionDeadline: payload.data.completionDeadline || "",
        };

        setPrefill(normalizedPrefill);

        try {
          localStorage.setItem(
            "aurora_prefill_snapshot",
            JSON.stringify(normalizedPrefill)
          );
        } catch {}

        setPrefillLoading(false);
      } catch {
        setPrefill(emptyPrefill);
        setPrefillMessage(t.prefillError);
        setPrefillLoading(false);
      }
    }

    loadPrefill();
  }, [email, t.prefillError, t.prefillNotFound]);

  function handleContinueLater() {
    try {
      localStorage.setItem("aurora_post_login_reminder_dismissed", "true");
      localStorage.setItem(
        "aurora_post_login_reminder_dismissed_at",
        new Date().toISOString()
      );
      localStorage.setItem("aurora_post_login_reminder_pending", "true");
    } catch {}

    setSavedNotice(t.savedMessage);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(59,130,246,0.10), transparent 18%), radial-gradient(circle at right, rgba(16,185,129,0.10), transparent 20%), linear-gradient(180deg, #eef6ff 0%, #f7fbff 38%, #edf7f3 100%)",
        color: "#0f172a",
        padding: "24px 16px 48px",
      }}
    >
      <section
        style={{
          maxWidth: 1120,
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
              Aurora IA • Continuação de acesso
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
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
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

            <div
              style={{
                display: "grid",
                gap: 10,
                border: "1px solid rgba(15,23,42,0.08)",
                background: "rgba(248,250,252,0.88)",
                borderRadius: 20,
                padding: "16px",
              }}
            >
              <InfoRow
                label={t.sourceLabel}
                value={getSourceLabel(source, t.unknownSource)}
              />

              <InfoRow label={t.emailLabel} value={email || "-"} />
            </div>

            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <Link href={GENERAL_SIGNUP_HREF} style={primaryBigButtonStyle}>
                {t.primaryButton}
              </Link>

              <button
                type="button"
                onClick={handleContinueLater}
                style={softActionButtonStyle}
              >
                {t.continueLater}
              </button>
            </div>

            {savedNotice ? (
              <div style={savedNoticeStyle}>{savedNotice}</div>
            ) : null}

            <div
              style={{
                color: "rgba(15,23,42,0.54)",
                fontSize: 13,
                lineHeight: 1.65,
                fontWeight: 700,
              }}
            >
              {t.footerText}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gap: 18,
            }}
          >
            <section style={infoCardStyle}>
              <div style={sectionBadgeStyle}>{t.benefitTitle}</div>

              <div style={benefitListStyle}>
                <BenefitCard text={t.benefitOne} />
                <BenefitCard text={t.benefitTwo} />
                <BenefitCard text={t.benefitThree} />
              </div>
            </section>

            <section style={reminderCardStyle}>
              <div style={sectionBadgeStyle}>{t.reminderTitle}</div>

              <p style={reminderTextStyle}>{t.reminderText}</p>

              <div
                style={{
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap",
                }}
              >
                <Link href={SEARCH_COMPANIES_HREF} style={secondaryBigButtonStyle}>
                  {t.secondaryButton}
                </Link>

                <Link href={CHAT_HREF} style={secondaryBigButtonStyle}>
                  {t.tertiaryButton}
                </Link>

                <Link href={HOME_HREF} style={secondaryBigButtonStyle}>
                  {t.quaternaryButton}
                </Link>
              </div>
            </section>

            <section style={prefillCardStyle}>
              <div style={prefillBadgeStyle}>
                {prefill.found ? t.prefillBadge : t.emailLabel}
              </div>

              {prefillLoading ? (
                <p style={prefillTextStyle}>{t.prefillLoading}</p>
              ) : prefill.found ? (
                <>
                  <h3 style={prefillTitleStyle}>{t.prefillTitle}</h3>
                  <p style={prefillTextStyle}>{t.prefillText}</p>

                  <div style={prefillGridStyle}>
                    <InfoRow label={t.fieldName} value={prefill.fullName || "-"} />
                    <InfoRow
                      label={t.fieldCompany}
                      value={prefill.companyName || "-"}
                    />
                    <InfoRow
                      label={t.fieldWhatsapp}
                      value={prefill.whatsapp || "-"}
                    />
                    <InfoRow label={t.fieldCity} value={prefill.city || "-"} />
                    <InfoRow label={t.fieldState} value={prefill.state || "-"} />
                    <InfoRow
                      label={t.fieldSegment}
                      value={prefill.segment || "-"}
                    />
                    <InfoRow label={t.fieldSlug} value={prefill.slug || "-"} />
                    <InfoRow label={t.fieldStatus} value={prefill.status || "-"} />
                    <InfoRow
                      label={t.fieldSource}
                      value={prefill.sourceTable || "-"}
                    />
                    <InfoRow
                      label={t.fieldCoverage}
                      value={prefill.coverageType || "-"}
                    />
                    <InfoRow
                      label={t.fieldRegistrationType}
                      value={prefill.registrationType || "-"}
                    />
                    <InfoRow
                      label={t.fieldRegistrationComplete}
                      value={formatBooleanLike(prefill.registrationComplete)}
                    />
                    <InfoRow
                      label={t.fieldOrigin}
                      value={prefill.sourceOrigin || "-"}
                    />
                    <InfoRow
                      label={t.fieldDeadline}
                      value={formatDate(prefill.completionDeadline)}
                    />
                  </div>
                </>
              ) : (
                <p style={prefillTextStyle}>
                  {prefillMessage || t.prefillNotFound}
                </p>
              )}
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

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "grid",
        gap: 4,
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 900,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          color: "rgba(15,23,42,0.54)",
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: 15,
          fontWeight: 800,
          color: "#0f172a",
          wordBreak: "break-word",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function BenefitCard({ text }: { text: string }) {
  return (
    <div
      style={{
        border: "1px solid rgba(15,23,42,0.08)",
        background: "rgba(255,255,255,0.84)",
        borderRadius: 20,
        padding: "16px",
        color: "rgba(15,23,42,0.72)",
        lineHeight: 1.7,
        fontSize: 15,
        fontWeight: 700,
        boxShadow: "0 12px 28px rgba(15,23,42,0.05)",
      }}
    >
      {text}
    </div>
  );
}

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

const prefillCardStyle: React.CSSProperties = {
  display: "grid",
  gap: 12,
  border: "1px solid rgba(16,185,129,0.12)",
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.90), rgba(240,253,250,0.92))",
  borderRadius: 26,
  padding: "20px",
  boxShadow: "0 16px 40px rgba(15,23,42,0.06)",
};

const prefillBadgeStyle: React.CSSProperties = {
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

const prefillTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "clamp(20px, 3vw, 26px)",
  fontWeight: 900,
  color: "#0f172a",
  lineHeight: 1.08,
};

const prefillTextStyle: React.CSSProperties = {
  margin: 0,
  color: "rgba(15,23,42,0.70)",
  lineHeight: 1.7,
  fontSize: 15,
  fontWeight: 700,
};

const prefillGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: 12,
  border: "1px solid rgba(15,23,42,0.08)",
  background: "rgba(255,255,255,0.84)",
  borderRadius: 18,
  padding: "14px",
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

const reminderTextStyle: React.CSSProperties = {
  margin: 0,
  color: "rgba(15,23,42,0.70)",
  lineHeight: 1.7,
  fontSize: 15,
  fontWeight: 700,
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

const softActionButtonStyle: React.CSSProperties = {
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
  cursor: "pointer",
};

const savedNoticeStyle: React.CSSProperties = {
  border: "1px solid rgba(16,185,129,0.14)",
  background: "rgba(16,185,129,0.08)",
  color: "#166534",
  borderRadius: 16,
  padding: "12px 14px",
  fontSize: 14,
  fontWeight: 800,
  lineHeight: 1.6,
};