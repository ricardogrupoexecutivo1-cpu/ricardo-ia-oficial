"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  trackChatMessageSent,
  trackChatOpened,
  trackImageGenerationFailed,
  trackImageGenerationRequested,
  trackImageGenerationSucceeded,
  trackReferralLinkCopied,
} from "@/lib/analytics";

type Message = {
  role: "user" | "assistant";
  content: string;
  imageUrl?: string | null;
  imagePageUrl?: string | null;
};

type LeadResult = {
  saved?: boolean;
  nivel?: "frio" | "morno" | "quente";
  interesse?: string;
  score?: number;
  reason?: string;
};

type ChatResponse = {
  reply?: string | null;
  message?: string | null;
  content?: string | null;
  error?: string | null;
  imageUrl?: string | null;
  image_url?: string | null;
  imagePageUrl?: string | null;
  image_page_url?: string | null;
  messagesRemaining?: number | null;
  imagesRemaining?: number | null;
  bonusImages?: number | null;
  plan?: string | null;
  referralCode?: string | null;
  referralLink?: string | null;
  referredBy?: string | null;
  imageSaved?: boolean | null;
  imageSavedId?: string | null;
  imageSaveError?: string | null;
  leadSaved?: boolean | null;
  leadResult?: LeadResult | null;
  detectedIntent?: string | null;
};

type UsageStatusResponse = {
  plan?: string | null;
  messagesRemaining?: number | null;
  imagesRemaining?: number | null;
  bonusImages?: number | null;
  referralCode?: string | null;
  referralLink?: string | null;
  referredBy?: string | null;
};

const EMAIL_STORAGE_KEY = "aurora-user-email";

const INITIAL_MESSAGE: Message = {
  role: "assistant",
  content:
    "Olá! Eu sou a Aurora IA. Posso conversar com você, criar campanhas, sugerir ideias de negócio e gerar imagens.\n\nHello! I am Aurora IA. I can help you create apps, campaigns, business ideas and premium images.\n\n👉 O que você quer fazer agora?\n👉 What do you want to do now?",
};

function isImagePrompt(text: string) {
  const normalized = text.toLowerCase();

  const terms = [
    "crie uma imagem",
    "gere uma imagem",
    "gerar imagem",
    "imagem",
    "arte",
    "foto",
    "banner",
    "criativo",
    "post para instagram",
    "thumbnail",
    "capa",
    "logo",
  ];

  return terms.some((term) => normalized.includes(term));
}

function resolveAssistantText(data: ChatResponse, imageUrl: string | null) {
  const raw =
    data.reply?.trim() ||
    data.message?.trim() ||
    data.content?.trim() ||
    "";

  if (raw) return raw;
  if (imageUrl) return "Imagem gerada com sucesso. / Image generated successfully.";
  if (data.error?.trim()) return data.error.trim();

  if (data.imageSaveError?.trim()) {
    return `Recebi sua mensagem, mas houve um problema: ${data.imageSaveError.trim()}`;
  }

  return "Recebi sua mensagem, mas a resposta veio vazia.";
}

function buildWhatsappShareUrl(url: string) {
  return `https://wa.me/?text=${encodeURIComponent(url)}`;
}

function buildFacebookShareUrl(url: string) {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    url
  )}`;
}

function buildXShareUrl(url: string) {
  return `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`;
}

function buildLinkedinShareUrl(url: string) {
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    url
  )}`;
}

function buildTelegramShareUrl(url: string) {
  return `https://t.me/share/url?url=${encodeURIComponent(url)}`;
}

function leadTone(
  nivel: "frio" | "morno" | "quente" | ""
): {
  title: string;
  border: string;
  background: string;
} {
  if (nivel === "quente") {
    return {
      title: "Lead quente",
      border: "1px solid rgba(239, 68, 68, 0.24)",
      background:
        "linear-gradient(135deg, rgba(239,68,68,0.08), rgba(255,255,255,0.72))",
    };
  }

  if (nivel === "morno") {
    return {
      title: "Lead morno",
      border: "1px solid rgba(245, 158, 11, 0.24)",
      background:
        "linear-gradient(135deg, rgba(245,158,11,0.08), rgba(255,255,255,0.72))",
    };
  }

  return {
    title: "Lead frio",
    border: "1px solid rgba(16, 185, 129, 0.24)",
    background:
      "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(255,255,255,0.72))",
  };
}

const glassCardStyle: React.CSSProperties = {
  border: "1px solid rgba(15,23,42,0.08)",
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.88), rgba(255,255,255,0.74))",
  boxShadow: "0 18px 42px rgba(15,23,42,0.08)",
  backdropFilter: "blur(14px)",
  borderRadius: 28,
};

const premiumButtonStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 42,
  padding: "0 16px",
  borderRadius: 13,
  textDecoration: "none",
  background: "linear-gradient(135deg, #2563eb, #3b82f6)",
  color: "#ffffff",
  fontWeight: 900,
  border: "1px solid rgba(37,99,235,0.16)",
  boxShadow: "0 12px 28px rgba(37,99,235,0.16)",
  fontSize: 13,
};

const softButtonStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 42,
  padding: "0 16px",
  borderRadius: 13,
  textDecoration: "none",
  background: "rgba(255,255,255,0.78)",
  color: "#0f172a",
  fontWeight: 800,
  border: "1px solid rgba(15,23,42,0.08)",
  boxShadow: "0 8px 18px rgba(15,23,42,0.05)",
  fontSize: 13,
};

const quickButtonStyle: React.CSSProperties = {
  border: "1px solid rgba(15,23,42,0.08)",
  background: "rgba(255,255,255,0.76)",
  color: "#0f172a",
  borderRadius: 14,
  minHeight: 44,
  padding: "10px 12px",
  fontWeight: 800,
  lineHeight: 1.3,
  boxShadow: "0 8px 20px rgba(15,23,42,0.05)",
  fontSize: 13,
};

const miniStatStyle: React.CSSProperties = {
  borderRadius: 16,
  padding: "12px 12px",
  border: "1px solid rgba(15,23,42,0.08)",
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.80), rgba(255,255,255,0.64))",
  display: "grid",
  gap: 5,
  boxShadow: "0 8px 18px rgba(15,23,42,0.04)",
};

const sectionTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "clamp(24px, 4vw, 38px)",
  lineHeight: 1.02,
  letterSpacing: "-0.03em",
  color: "#0f172a",
};

export default function ChatClient() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [userEmail, setUserEmail] = useState("");
  const [plan, setPlan] = useState("FREE");
  const [messagesRemaining, setMessagesRemaining] = useState<number | null>(null);
  const [imagesRemaining, setImagesRemaining] = useState<number | null>(null);
  const [bonusImages, setBonusImages] = useState(0);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [referralLink, setReferralLink] = useState<string | null>(null);
  const [referredBy, setReferredBy] = useState<string | null>(null);

  const [leadNivel, setLeadNivel] = useState<"" | "frio" | "morno" | "quente">(
    ""
  );
  const [leadScore, setLeadScore] = useState<number | null>(null);
  const [leadInteresse, setLeadInteresse] = useState<string>("");
  const [leadSavedFeedback, setLeadSavedFeedback] = useState<
    "idle" | "saved" | "error"
  >("idle");

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const trackedOpenRef = useRef(false);

  useEffect(() => {
    if (!trackedOpenRef.current) {
      trackChatOpened("chat-page");
      trackedOpenRef.current = true;
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedEmail = window.localStorage.getItem(EMAIL_STORAGE_KEY);
    if (savedEmail) setUserEmail(savedEmail);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (userEmail.trim()) {
      window.localStorage.setItem(EMAIL_STORAGE_KEY, userEmail.trim());
    }
  }, [userEmail]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    async function loadUsage() {
      if (!userEmail.trim()) return;

      try {
        const response = await fetch(
          `/api/usage/status?email=${encodeURIComponent(userEmail.trim())}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        if (!response.ok) return;

        const data: UsageStatusResponse = await response.json();

        if (typeof data.plan === "string" && data.plan) setPlan(data.plan);
        if (typeof data.messagesRemaining === "number") {
          setMessagesRemaining(data.messagesRemaining);
        }
        if (typeof data.imagesRemaining === "number") {
          setImagesRemaining(data.imagesRemaining);
        }
        if (typeof data.bonusImages === "number") setBonusImages(data.bonusImages);
        if (typeof data.referralCode === "string") setReferralCode(data.referralCode);
        if (typeof data.referralLink === "string") setReferralLink(data.referralLink);
        if (typeof data.referredBy === "string") setReferredBy(data.referredBy);
      } catch (error) {
        console.error("Erro ao carregar status de uso:", error);
      }
    }

    loadUsage();
  }, [userEmail]);

  const referralLinkResolved = useMemo(() => {
    if (referralLink) return referralLink;
    if (!referralCode) return null;

    if (typeof window !== "undefined") {
      return `${window.location.origin}/?ref=${referralCode}`;
    }

    return null;
  }, [referralCode, referralLink]);

  const leadUi = leadTone(leadNivel);

  async function handleCopyReferralLink() {
    if (!referralLinkResolved) return;

    try {
      await navigator.clipboard.writeText(referralLinkResolved);
      trackReferralLinkCopied("chat-page");
      window.alert("Link de convite copiado com sucesso.");
    } catch (error) {
      console.error("Erro ao copiar link de convite:", error);
      window.alert("Não foi possível copiar o link de convite.");
    }
  }

  async function handleCopyImageLink(url: string | null | undefined) {
    if (!url) return;

    try {
      await navigator.clipboard.writeText(url);
      window.alert("Link da imagem copiado com sucesso.");
    } catch (error) {
      console.error("Erro ao copiar link da imagem:", error);
      window.alert("Não foi possível copiar o link da imagem.");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const text = input.trim();
    if (!text || loading) return;

    const nextMessages: Message[] = [
      ...messages,
      {
        role: "user",
        content: text,
      },
    ];

    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    const hasEmail = Boolean(userEmail.trim());
    const promptLooksLikeImage = isImagePrompt(text);

    trackChatMessageSent("chat-page", hasEmail, text.length);

    if (promptLooksLikeImage) {
      trackImageGenerationRequested("chat-page", hasEmail, text.length);
    }

    try {
      const endpoint = promptLooksLikeImage ? "/api/image" : "/api/chat";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          prompt: text,
          email: userEmail.trim() || undefined,
          messages: nextMessages.map((item) => ({
            role: item.role,
            content: item.content,
          })),
        }),
      });

      const data: ChatResponse = await response.json();

      if (typeof data?.messagesRemaining === "number") {
        setMessagesRemaining(data.messagesRemaining);
      }

      if (typeof data?.imagesRemaining === "number") {
        setImagesRemaining(data.imagesRemaining);
      }

      if (typeof data?.bonusImages === "number") {
        setBonusImages(data.bonusImages);
      }

      if (typeof data?.plan === "string" && data.plan) {
        setPlan(data.plan);
      }

      if (typeof data?.referralCode === "string") {
        setReferralCode(data.referralCode);
      }

      if (typeof data?.referralLink === "string") {
        setReferralLink(data.referralLink);
      }

      if (typeof data?.referredBy === "string") {
        setReferredBy(data.referredBy);
      }

      if (data?.leadResult?.saved) {
        setLeadSavedFeedback("saved");

        if (
          data.leadResult.nivel === "frio" ||
          data.leadResult.nivel === "morno" ||
          data.leadResult.nivel === "quente"
        ) {
          setLeadNivel(data.leadResult.nivel);
        }

        if (typeof data.leadResult.score === "number") {
          setLeadScore(data.leadResult.score);
        }

        if (typeof data.leadResult.interesse === "string") {
          setLeadInteresse(data.leadResult.interesse);
        }
      } else if (userEmail.trim()) {
        setLeadSavedFeedback("error");
      }

      const imageUrl = data.imageUrl || data.image_url || null;
      const imagePageUrl = data.imagePageUrl || data.image_page_url || imageUrl;
      const assistantText = resolveAssistantText(data, imageUrl);

      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content: assistantText,
          imageUrl,
          imagePageUrl,
        },
      ]);

      if (imageUrl) {
        trackImageGenerationSucceeded("chat-page", endpoint);
      } else if (promptLooksLikeImage) {
        trackImageGenerationFailed(
          "chat-page",
          data.imageSaveError || data.error || "sem-imagem-retornada"
        );
      }

      if (!response.ok) {
        console.error(`Erro retornado pela API ${endpoint}:`, data);
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);

      const message =
        error instanceof Error
          ? error.message
          : "Falha inesperada ao enviar a mensagem.";

      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content: message,
        },
      ]);

      if (promptLooksLikeImage) {
        trackImageGenerationFailed("chat-page", "exception");
      }

      if (userEmail.trim()) {
        setLeadSavedFeedback("error");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="aurora-chat-app"
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(59,130,246,0.10), transparent 18%), radial-gradient(circle at left, rgba(34,197,94,0.10), transparent 24%), linear-gradient(180deg, #eef6ff 0%, #f7fbff 36%, #edf7f3 100%)",
        color: "#0f172a",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "18px 14px 90px",
          display: "grid",
          gap: 18,
        }}
      >
        <header className="aurora-chat-app__header" style={{ display: "grid", gap: 16 }}>
          <div
            className="aurora-chat-app__topbar"
            style={{
              ...glassCardStyle,
              padding: "14px 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <Link href="/" className="aurora-chat-app__backButton" style={softButtonStyle}>
              Home
            </Link>

            <div
              className="aurora-chat-app__brand"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "4px 0",
              }}
            >
              <span
                className="aurora-chat-app__brandDot"
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 999,
                  background: "#3b82f6",
                  boxShadow: "0 0 18px rgba(59,130,246,0.45)",
                  flexShrink: 0,
                }}
              />
              <div style={{ display: "grid", gap: 2 }}>
                <strong style={{ fontSize: 17, color: "#0f172a" }}>Aurora IA</strong>
                <span style={{ color: "rgba(15,23,42,0.58)", fontSize: 12 }}>
                  Chat premium
                </span>
              </div>
            </div>

            <Link href="/planos" className="aurora-chat-app__ghostButton" style={softButtonStyle}>
              Planos
            </Link>
          </div>

          <section
            className="aurora-chat-app__heroCard"
            style={{
              ...glassCardStyle,
              padding: "20px 16px",
              display: "grid",
              gap: 16,
            }}
          >
            <div className="aurora-chat-app__heroText" style={{ display: "grid", gap: 12 }}>
              <div
                className="aurora-chat-app__heroBadge"
                style={{
                  display: "inline-flex",
                  width: "fit-content",
                  alignItems: "center",
                  gap: 8,
                  padding: "7px 11px",
                  borderRadius: 999,
                  background: "rgba(37,99,235,0.08)",
                  border: "1px solid rgba(37,99,235,0.16)",
                  color: "#2563eb",
                  fontSize: 12,
                  fontWeight: 800,
                }}
              >
                Aurora IA
              </div>

              <div style={{ display: "grid", gap: 8 }}>
                <h1 style={sectionTitleStyle}>Chat da Aurora</h1>

                <p
                  style={{
                    margin: 0,
                    color: "rgba(15,23,42,0.74)",
                    fontSize: 16,
                    lineHeight: 1.7,
                    maxWidth: 920,
                    fontWeight: 700,
                  }}
                >
                  Converse, crie imagens e gere ideias com um visual mais premium, leve e alinhado
                  com a nova Aurora.
                </p>
              </div>

              <div
                style={{
                  display: "grid",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    color: "#2563eb",
                    fontSize: 13,
                    fontWeight: 800,
                    lineHeight: 1.5,
                  }}
                >
                  🌍 Available worldwide • Create apps, campaigns and business ideas
                </div>

                <div
                  style={{
                    color: "#0f766e",
                    fontSize: 12,
                    fontWeight: 800,
                    lineHeight: 1.5,
                  }}
                >
                  🔒 Plataforma protegida com bloqueio de atividades maliciosas e ações suspeitas
                </div>
              </div>

              <div
                className="aurora-chat-app__quickActions"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: 10,
                  marginTop: 2,
                }}
              >
                <button
                  type="button"
                  className="aurora-chat-app__quickButton"
                  style={quickButtonStyle}
                  onClick={() => setInput("Criar campanha que vende no Instagram")}
                >
                  💰 Criar campanha
                </button>

                <button
                  type="button"
                  className="aurora-chat-app__quickButton"
                  style={quickButtonStyle}
                  onClick={() => setInput("Criar imagem premium para anúncio")}
                >
                  🎨 Criar imagem
                </button>

                <button
                  type="button"
                  className="aurora-chat-app__quickButton"
                  style={quickButtonStyle}
                  onClick={() => setInput("Gerar ideia lucrativa com IA")}
                >
                  🚀 Ideia lucrativa
                </button>

                <button
                  type="button"
                  className="aurora-chat-app__quickButton"
                  style={quickButtonStyle}
                  onClick={() => setInput("Criar texto de vendas que converte")}
                >
                  📢 Texto de vendas
                </button>
              </div>
            </div>

            <div
              className="aurora-chat-app__heroSide"
              style={{
                display: "grid",
                gap: 14,
              }}
            >
              <div
                className="aurora-chat-app__miniStats"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                  gap: 10,
                }}
              >
                <div className="aurora-chat-app__miniStat" style={miniStatStyle}>
                  <span style={{ color: "rgba(15,23,42,0.54)", fontSize: 11 }}>Plano</span>
                  <strong style={{ fontSize: 20, color: "#0f172a" }}>{plan || "FREE"}</strong>
                </div>

                <div className="aurora-chat-app__miniStat" style={miniStatStyle}>
                  <span style={{ color: "rgba(15,23,42,0.54)", fontSize: 11 }}>Mensagens</span>
                  <strong style={{ fontSize: 20, color: "#0f172a" }}>
                    {messagesRemaining ?? "-"}
                  </strong>
                </div>

                <div className="aurora-chat-app__miniStat" style={miniStatStyle}>
                  <span style={{ color: "rgba(15,23,42,0.54)", fontSize: 11 }}>Imagens</span>
                  <strong style={{ fontSize: 20, color: "#0f172a" }}>
                    {imagesRemaining ?? "Ilimitado"}
                  </strong>
                </div>

                <div className="aurora-chat-app__miniStat" style={miniStatStyle}>
                  <span style={{ color: "rgba(15,23,42,0.54)", fontSize: 11 }}>Bônus</span>
                  <strong style={{ fontSize: 20, color: "#0f172a" }}>{bonusImages}</strong>
                </div>
              </div>

              <div
                className="aurora-chat-app__emailCard"
                style={{
                  borderRadius: 20,
                  border: "1px solid rgba(15,23,42,0.08)",
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.80), rgba(255,255,255,0.64))",
                  padding: 14,
                  display: "grid",
                  gap: 8,
                  boxShadow: "0 8px 18px rgba(15,23,42,0.04)",
                }}
              >
                <label
                  className="aurora-chat-app__label"
                  htmlFor="aurora-email"
                  style={{
                    fontSize: 13,
                    fontWeight: 800,
                    color: "#0f172a",
                  }}
                >
                  Digite seu e-mail para controle do seu plano
                </label>

                <input
                  id="aurora-email"
                  type="email"
                  className="aurora-chat-app__emailInput"
                  placeholder="seuemail@exemplo.com"
                  value={userEmail}
                  onChange={(event) => setUserEmail(event.target.value)}
                  style={{
                    width: "100%",
                    minHeight: 46,
                    borderRadius: 13,
                    border: "1px solid rgba(15,23,42,0.10)",
                    background: "rgba(255,255,255,0.92)",
                    color: "#0f172a",
                    padding: "0 14px",
                    outline: "none",
                    fontSize: 14,
                  }}
                />

                <p
                  className="aurora-chat-app__emailHint"
                  style={{
                    margin: 0,
                    color: "rgba(15,23,42,0.58)",
                    lineHeight: 1.6,
                    fontSize: 12,
                  }}
                >
                  Esse e-mail ajuda a controlar plano, limites e recursos liberados.
                </p>
              </div>

              {userEmail.trim() ? (
                <div
                  style={{
                    padding: 14,
                    borderRadius: 20,
                    border: leadUi.border,
                    background: leadUi.background,
                    boxShadow: "0 10px 24px rgba(15,23,42,0.05)",
                  }}
                >
                  <strong style={{ display: "block", marginBottom: 8, fontSize: 15, color: "#0f172a" }}>
                    CRM Aurora
                  </strong>

                  <p style={{ margin: 0, lineHeight: 1.65, color: "#0f172a" }}>
                    Status atual:{" "}
                    <strong>{leadNivel ? leadUi.title : "Aguardando interação"}</strong>
                  </p>

                  <p style={{ margin: "8px 0 0", lineHeight: 1.65, color: "#0f172a" }}>
                    Score: <strong>{leadScore ?? 0}</strong>
                  </p>

                  <p style={{ margin: "8px 0 0", lineHeight: 1.65, color: "#0f172a" }}>
                    Interesse: <strong>{leadInteresse || "-"}</strong>
                  </p>

                  <p style={{ margin: "8px 0 0", lineHeight: 1.65, color: "#0f172a" }}>
                    Gravação:{" "}
                    <strong>
                      {leadSavedFeedback === "saved"
                        ? "lead salvo no CRM"
                        : leadSavedFeedback === "error"
                        ? "falha ao gravar"
                        : "aguardando envio"}
                    </strong>
                  </p>
                </div>
              ) : null}
            </div>
          </section>
        </header>

        <section
          className="aurora-chat-app__conversation"
          style={{
            ...glassCardStyle,
            padding: "20px 16px",
            display: "grid",
            gap: 14,
          }}
        >
          <div
            className="aurora-chat-app__conversationHeader"
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "grid", gap: 5 }}>
              <h2 style={{ margin: 0, fontSize: 24, color: "#0f172a" }}>Chat Aurora IA</h2>
              <p
                style={{
                  margin: 0,
                  color: "rgba(15,23,42,0.62)",
                  lineHeight: 1.65,
                }}
              >
                Converse normalmente ou peça imagens, campanhas, ideias e criação de app.
              </p>
            </div>

            <span
              className="aurora-chat-app__livePill"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 34,
                padding: "0 12px",
                borderRadius: 999,
                background: "rgba(16,185,129,0.10)",
                border: "1px solid rgba(16,185,129,0.18)",
                color: "#0f766e",
                fontWeight: 800,
                fontSize: 12,
              }}
            >
              online
            </span>
          </div>

          {userEmail.trim() ? (
            <div
              style={{
                padding: "16px 16px",
                borderRadius: 18,
                border: "1px solid rgba(37,99,235,0.16)",
                background:
                  "linear-gradient(135deg, rgba(37,99,235,0.06), rgba(16,185,129,0.06))",
                boxShadow: "0 10px 24px rgba(15,23,42,0.05)",
              }}
            >
              <strong style={{ display: "block", marginBottom: 8, fontSize: 15, color: "#0f172a" }}>
                ✅ Cadastro básico ativo
              </strong>

              <p style={{ margin: 0, lineHeight: 1.7, color: "#0f172a" }}>
                Seu acesso já está ativo na Aurora. Você pode usar o chat, explorar a plataforma
                e navegar livremente.
              </p>

              <p
                style={{
                  margin: "8px 0 0",
                  lineHeight: 1.7,
                  color: "rgba(15,23,42,0.70)",
                }}
              >
                Quando quiser, você pode completar seu cadastro para organizar melhor sua presença,
                estruturar sua operação e liberar mais recursos.
              </p>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 10,
                  marginTop: 14,
                }}
              >
                <Link href="/cadastro" style={premiumButtonStyle}>
                  Completar cadastro
                </Link>

                <Link href="/cadastro-basico" style={softButtonStyle}>
                  Ver cadastro básico
                </Link>
              </div>
            </div>
          ) : null}

          <div
            style={{
              padding: "14px 14px",
              borderRadius: 18,
              border: "1px solid rgba(245,158,11,0.16)",
              background:
                "linear-gradient(135deg, rgba(245,158,11,0.06), rgba(255,255,255,0.72))",
            }}
          >
            <strong style={{ display: "block", marginBottom: 6, fontSize: 15, color: "#0f172a" }}>
              Avisos importantes
            </strong>

            <p style={{ margin: 0, lineHeight: 1.65, color: "#0f172a" }}>
              Estamos em atualizações constantes para melhorar a plataforma. Em
              alguns momentos, isso pode gerar instabilidade temporária.
            </p>

            <p style={{ margin: "8px 0 0", lineHeight: 1.65, color: "#0f172a" }}>
              A Aurora IA pode cometer erros, gerar respostas imprecisas ou
              conteúdo incompleto. Sempre confira informações importantes antes de
              usar comercialmente, financeiramente, juridicamente ou em decisões
              sensíveis.
            </p>

            <p style={{ margin: "8px 0 0", lineHeight: 1.65, color: "#0f172a" }}>
              🔒 Sistema com bloqueio de atividades maliciosas e ações suspeitas para
              proteger a plataforma.
            </p>

            <p style={{ margin: "8px 0 0", lineHeight: 1.65, color: "#2563eb" }}>
              🌍 English support available for international visitors.
            </p>
          </div>

          <div
            style={{
              padding: 14,
              borderRadius: 20,
              border: "1px solid rgba(15,23,42,0.08)",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.80), rgba(255,255,255,0.64))",
              boxShadow: "0 10px 24px rgba(15,23,42,0.05)",
            }}
          >
            <h2 style={{ margin: 0, fontSize: 20, color: "#0f172a" }}>
              Convide amigos e ganhe imagens bônus
            </h2>

            <p
              style={{
                margin: "8px 0 0",
                color: "rgba(15,23,42,0.62)",
                lineHeight: 1.65,
              }}
            >
              Cada novo indicado válido pode render mais imagens para você.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 10,
                marginTop: 12,
              }}
            >
              <div className="aurora-chat-app__miniStat" style={miniStatStyle}>
                <span style={{ color: "rgba(15,23,42,0.54)", fontSize: 11 }}>Seu código</span>
                <strong style={{ fontSize: 17, color: "#0f172a" }}>{referralCode || "-"}</strong>
              </div>

              <div className="aurora-chat-app__miniStat" style={miniStatStyle}>
                <span style={{ color: "rgba(15,23,42,0.54)", fontSize: 11 }}>Seu link</span>
                <strong
                  style={{
                    wordBreak: "break-word",
                    lineHeight: 1.5,
                    fontSize: 14,
                    color: "#0f172a",
                  }}
                >
                  {referralLinkResolved || "-"}
                </strong>
              </div>
            </div>

            <div
              className="aurora-chat-app__quickActions"
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
                marginTop: 12,
              }}
            >
              <button
                type="button"
                className="aurora-chat-app__quickButton"
                style={quickButtonStyle}
                onClick={handleCopyReferralLink}
                disabled={!referralLinkResolved}
              >
                Copiar link
              </button>

              <Link href="/planos" className="aurora-chat-app__ghostButton" style={softButtonStyle}>
                Ver planos
              </Link>
            </div>

            {referredBy ? (
              <p style={{ margin: "12px 0 0", lineHeight: 1.65, color: "#0f172a" }}>
                Você foi indicado por: <strong>{referredBy}</strong>
              </p>
            ) : null}
          </div>

          <div
            className="aurora-chat-app__messages"
            style={{
              display: "grid",
              gap: 12,
              marginTop: 2,
            }}
          >
            {messages.map((message, index) => {
              const isAssistant = message.role === "assistant";
              const shareUrl = message.imagePageUrl || message.imageUrl || null;

              return (
                <article
                  key={`${message.role}-${index}-${message.content.slice(0, 24)}`}
                  className={`aurora-chat-app__message ${
                    isAssistant
                      ? "aurora-chat-app__message--assistant"
                      : "aurora-chat-app__message--user"
                  }`}
                  style={{
                    display: "grid",
                    gap: 8,
                    justifyItems: isAssistant ? "start" : "end",
                  }}
                >
                  <div
                    className="aurora-chat-app__messageMeta"
                    style={{
                      fontSize: 11,
                      color: "rgba(15,23,42,0.54)",
                      fontWeight: 800,
                    }}
                  >
                    <span>{isAssistant ? "Aurora IA" : "Você"}</span>
                  </div>

                  <div
                    className="aurora-chat-app__bubble"
                    style={{
                      width: "min(100%, 900px)",
                      padding: "15px 15px",
                      borderRadius: 18,
                      border: isAssistant
                        ? "1px solid rgba(15,23,42,0.08)"
                        : "1px solid rgba(37,99,235,0.14)",
                      background: isAssistant
                        ? "linear-gradient(180deg, rgba(255,255,255,0.84), rgba(255,255,255,0.68))"
                        : "linear-gradient(135deg, rgba(37,99,235,0.08), rgba(59,130,246,0.04))",
                      boxShadow: "0 12px 24px rgba(15,23,42,0.05)",
                    }}
                  >
                    <p
                      style={{
                        whiteSpace: "pre-wrap",
                        margin: 0,
                        lineHeight: 1.75,
                        color: "#0f172a",
                      }}
                    >
                      {message.content}
                    </p>

                    {message.imageUrl ? (
                      <div
                        className="aurora-chat-app__imageWrap aurora-chat-app__imageWrap--premium"
                        style={{
                          display: "grid",
                          gap: 12,
                          marginTop: 14,
                        }}
                      >
                        <div className="aurora-chat-app__imageHeader">
                          <span
                            className="aurora-chat-app__imageBadge"
                            style={{
                              display: "inline-flex",
                              width: "fit-content",
                              alignItems: "center",
                              justifyContent: "center",
                              minHeight: 32,
                              padding: "0 12px",
                              borderRadius: 999,
                              background: "rgba(37,99,235,0.08)",
                              border: "1px solid rgba(37,99,235,0.16)",
                              color: "#2563eb",
                              fontSize: 12,
                              fontWeight: 800,
                            }}
                          >
                            Imagem gerada pela Aurora IA
                          </span>
                        </div>

                        <div
                          className="aurora-chat-app__imageContainer"
                          style={{
                            position: "relative",
                            overflow: "hidden",
                            borderRadius: 18,
                            border: "1px solid rgba(15,23,42,0.08)",
                            background: "rgba(255,255,255,0.78)",
                          }}
                        >
                          <img
                            src={message.imageUrl}
                            alt="Imagem gerada pela Aurora IA"
                            className="aurora-chat-app__image aurora-chat-app__image--premium"
                            style={{
                              width: "100%",
                              display: "block",
                            }}
                          />

                          <div
                            className="aurora-chat-app__imageOverlay"
                            style={{
                              position: "absolute",
                              left: 12,
                              right: 12,
                              bottom: 12,
                              borderRadius: 12,
                              padding: "10px 12px",
                              background: "rgba(255,255,255,0.88)",
                              border: "1px solid rgba(15,23,42,0.08)",
                              color: "#0f172a",
                              fontSize: 13,
                              fontWeight: 700,
                            }}
                          >
                            Página pública pronta para compartilhar e divulgar.
                          </div>
                        </div>

                        <div
                          className="aurora-chat-app__imageActions aurora-chat-app__imageActions--premium"
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 10,
                          }}
                        >
                          {message.imagePageUrl ? (
                            <a
                              href={message.imagePageUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="aurora-chat-app__imageButton aurora-chat-app__imageButton--primary"
                              style={premiumButtonStyle}
                            >
                              Ver imagem
                            </a>
                          ) : null}

                          {shareUrl ? (
                            <>
                              <button
                                type="button"
                                className="aurora-chat-app__imageButton"
                                style={softButtonStyle}
                                onClick={() => handleCopyImageLink(shareUrl)}
                              >
                                Copiar link
                              </button>

                              <a
                                href={buildWhatsappShareUrl(shareUrl)}
                                target="_blank"
                                rel="noreferrer"
                                className="aurora-chat-app__imageButton"
                                style={softButtonStyle}
                              >
                                WhatsApp
                              </a>

                              <a
                                href={buildFacebookShareUrl(shareUrl)}
                                target="_blank"
                                rel="noreferrer"
                                className="aurora-chat-app__imageButton"
                                style={softButtonStyle}
                              >
                                Facebook
                              </a>

                              <a
                                href={buildXShareUrl(shareUrl)}
                                target="_blank"
                                rel="noreferrer"
                                className="aurora-chat-app__imageButton"
                                style={softButtonStyle}
                              >
                                X
                              </a>

                              <a
                                href={buildLinkedinShareUrl(shareUrl)}
                                target="_blank"
                                rel="noreferrer"
                                className="aurora-chat-app__imageButton"
                                style={softButtonStyle}
                              >
                                LinkedIn
                              </a>

                              <a
                                href={buildTelegramShareUrl(shareUrl)}
                                target="_blank"
                                rel="noreferrer"
                                className="aurora-chat-app__imageButton"
                                style={softButtonStyle}
                              >
                                Telegram
                              </a>
                            </>
                          ) : null}

                          <button
                            type="button"
                            className="aurora-chat-app__imageButton aurora-chat-app__imageButton--ghost"
                            style={softButtonStyle}
                            onClick={() =>
                              setInput("gere outra variação dessa imagem mais impactante")
                            }
                          >
                            Gerar variação
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </article>
              );
            })}

            {loading ? (
              <article
                className="aurora-chat-app__message aurora-chat-app__message--assistant"
                style={{
                  display: "grid",
                  gap: 8,
                }}
              >
                <div
                  className="aurora-chat-app__messageMeta"
                  style={{
                    fontSize: 11,
                    color: "rgba(15,23,42,0.54)",
                    fontWeight: 800,
                  }}
                >
                  <span>Aurora IA</span>
                </div>

                <div
                  className="aurora-chat-app__bubble aurora-chat-app__bubble--loading"
                  style={{
                    width: "fit-content",
                    minWidth: 84,
                    padding: "14px 16px",
                    borderRadius: 16,
                    border: "1px solid rgba(15,23,42,0.08)",
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.84), rgba(255,255,255,0.68))",
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                  }}
                >
                  <span className="aurora-chat-app__typingDot" />
                  <span className="aurora-chat-app__typingDot" />
                  <span className="aurora-chat-app__typingDot" />
                </div>
              </article>
            ) : null}

            <div ref={messagesEndRef} />
          </div>
        </section>

        <section
          className="aurora-chat-app__composer"
          style={{
            position: "sticky",
            bottom: 10,
            zIndex: 20,
          }}
        >
          <form
            className="aurora-chat-app__composerBox"
            onSubmit={handleSubmit}
            style={{
              ...glassCardStyle,
              padding: "10px",
              display: "grid",
              gap: 10,
            }}
          >
            <textarea
              className="aurora-chat-app__textarea"
              placeholder="Digite sua mensagem ou descreva a imagem que deseja..."
              value={input}
              onChange={(event) => setInput(event.target.value)}
              rows={2}
              disabled={loading}
              style={{
                width: "100%",
                resize: "vertical",
                minHeight: 72,
                borderRadius: 15,
                border: "1px solid rgba(15,23,42,0.10)",
                background: "rgba(255,255,255,0.92)",
                color: "#0f172a",
                padding: "14px 14px",
                outline: "none",
                fontSize: 14,
                lineHeight: 1.6,
              }}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <p
                className="aurora-chat-app__composerHint"
                style={{
                  margin: 0,
                  color: "rgba(15,23,42,0.54)",
                  fontSize: 12,
                }}
              >
                Enter envia. Shift + Enter quebra linha.
              </p>

              <button
                type="submit"
                className="aurora-chat-app__sendButton"
                disabled={loading || !input.trim()}
                style={{
                  minWidth: 120,
                  minHeight: 42,
                  borderRadius: 13,
                  border: "1px solid rgba(37,99,235,0.16)",
                  background: "linear-gradient(135deg, #2563eb, #3b82f6)",
                  color: "#ffffff",
                  fontWeight: 900,
                  boxShadow: "0 12px 28px rgba(37,99,235,0.16)",
                  cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                  opacity: loading || !input.trim() ? 0.7 : 1,
                  fontSize: 13,
                }}
              >
                {loading ? "Enviando..." : "Enviar"}
              </button>
            </div>
          </form>

          <p
            style={{
              marginTop: 10,
              fontSize: 12,
              color: "#2563eb",
              textAlign: "center",
              fontWeight: 800,
            }}
          >
            ✨ Crie seu app • Cadastre sua empresa • Gere negócios
          </p>
        </section>
      </div>
    </main>
  );
}