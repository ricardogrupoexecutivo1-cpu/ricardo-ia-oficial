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
    "Olá! Eu sou a Aurora IA. Posso conversar com você, criar campanhas, sugerir ideias de negócio e gerar imagens.",
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
  if (imageUrl) return "Imagem gerada com sucesso.";
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
      border: "1px solid rgba(255, 107, 107, 0.45)",
      background:
        "linear-gradient(135deg, rgba(255,107,107,0.18), rgba(255,255,255,0.04))",
    };
  }

  if (nivel === "morno") {
    return {
      title: "Lead morno",
      border: "1px solid rgba(255, 193, 7, 0.35)",
      background:
        "linear-gradient(135deg, rgba(255,193,7,0.16), rgba(255,255,255,0.04))",
    };
  }

  return {
    title: "Lead frio",
    border: "1px solid rgba(0, 208, 132, 0.25)",
    background:
      "linear-gradient(135deg, rgba(0,208,132,0.12), rgba(255,255,255,0.03))",
  };
}

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
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
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
        trackImageGenerationSucceeded("chat-page", "api-chat");
      } else if (promptLooksLikeImage) {
        trackImageGenerationFailed(
          "chat-page",
          data.imageSaveError || data.error || "sem-imagem-retornada"
        );
      }

      if (!response.ok) {
        console.error("Erro retornado pela API /api/chat:", data);
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
    <main className="aurora-chat-app">
      <div className="aurora-chat-app__bg aurora-chat-app__bg--1" />
      <div className="aurora-chat-app__bg aurora-chat-app__bg--2" />

      <header className="aurora-chat-app__header">
        <div className="aurora-chat-app__topbar">
          <Link href="/" className="aurora-chat-app__backButton">
            Home
          </Link>

          <div className="aurora-chat-app__brand">
            <span className="aurora-chat-app__brandDot" />
            <div>
              <strong>Aurora IA</strong>
              <span>Chat premium</span>
            </div>
          </div>

          <Link href="/planos" className="aurora-chat-app__ghostButton">
            Planos
          </Link>
        </div>

        <section className="aurora-chat-app__heroCard">
          <div className="aurora-chat-app__heroText">
            <div className="aurora-chat-app__heroBadge">Aurora IA</div>
            <h1>Chat da Aurora</h1>
            <p>
              Converse, crie imagens e segure atenção com cara de app real.
              A Aurora está pronta para responder, gerar ideias e entregar
              visual melhor para retenção e conversão.
            </p>

            <div className="aurora-chat-app__quickActions">
              <button
                type="button"
                className="aurora-chat-app__quickButton"
                onClick={() => setInput("Criar campanha para Instagram")}
              >
                Criar campanha para Instagram
              </button>

              <button
                type="button"
                className="aurora-chat-app__quickButton"
                onClick={() => setInput("Gerar imagem premium para anúncio")}
              >
                Gerar imagem premium para anúncio
              </button>

              <button
                type="button"
                className="aurora-chat-app__quickButton"
                onClick={() => setInput("Ideia de negócio com IA")}
              >
                Ideia de negócio com IA
              </button>

              <button
                type="button"
                className="aurora-chat-app__quickButton"
                onClick={() => setInput("Criar texto de vendas")}
              >
                Criar texto de vendas
              </button>
            </div>
          </div>

          <div className="aurora-chat-app__heroSide">
            <div className="aurora-chat-app__miniStats">
              <div className="aurora-chat-app__miniStat">
                <span>Plano</span>
                <strong>{plan || "FREE"}</strong>
              </div>

              <div className="aurora-chat-app__miniStat">
                <span>Mensagens</span>
                <strong>{messagesRemaining ?? "-"}</strong>
              </div>

              <div className="aurora-chat-app__miniStat">
                <span>Imagens</span>
                <strong>{imagesRemaining ?? "Ilimitado"}</strong>
              </div>

              <div className="aurora-chat-app__miniStat">
                <span>Bônus</span>
                <strong>{bonusImages}</strong>
              </div>
            </div>

            <div className="aurora-chat-app__emailCard">
              <label className="aurora-chat-app__label" htmlFor="aurora-email">
                Digite seu e-mail para controle do seu plano
              </label>

              <input
                id="aurora-email"
                type="email"
                className="aurora-chat-app__emailInput"
                placeholder="seuemail@exemplo.com"
                value={userEmail}
                onChange={(event) => setUserEmail(event.target.value)}
              />

              <p className="aurora-chat-app__emailHint">
                Esse e-mail ajuda a controlar plano, limites e recursos liberados.
              </p>
            </div>

            {userEmail.trim() ? (
              <div
                style={{
                  marginTop: 14,
                  padding: 16,
                  borderRadius: 18,
                  border: leadUi.border,
                  background: leadUi.background,
                }}
              >
                <strong style={{ display: "block", marginBottom: 8 }}>
                  CRM Aurora
                </strong>

                <p style={{ margin: 0, lineHeight: 1.6 }}>
                  Status atual: <strong>{leadNivel ? leadUi.title : "Aguardando interação"}</strong>
                </p>

                <p style={{ margin: "8px 0 0", lineHeight: 1.6 }}>
                  Score: <strong>{leadScore ?? 0}</strong>
                </p>

                <p style={{ margin: "8px 0 0", lineHeight: 1.6 }}>
                  Interesse: <strong>{leadInteresse || "-"}</strong>
                </p>

                <p style={{ margin: "8px 0 0", lineHeight: 1.6 }}>
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

      <section className="aurora-chat-app__conversation">
        <div className="aurora-chat-app__conversationHeader">
          <div>
            <h2>Chat Aurora IA</h2>
            <p>
              {messages.length > 1
                ? "Converse normalmente ou peça imagens, campanhas e ideias."
                : "Converse normalmente ou peça imagens, campanhas e ideias."}
            </p>
          </div>

          <span className="aurora-chat-app__livePill">online</span>
        </div>

        <div
          style={{
            marginTop: 16,
            marginBottom: 16,
            padding: "14px 16px",
            borderRadius: 14,
            border: "1px solid rgba(255,255,255,0.12)",
            background:
              "linear-gradient(135deg, rgba(255,193,7,0.14), rgba(255,255,255,0.05))",
          }}
        >
          <strong style={{ display: "block", marginBottom: 6 }}>
            Avisos importantes
          </strong>

          <p style={{ margin: 0, lineHeight: 1.6 }}>
            Estamos em atualizações constantes para melhorar a plataforma. Em
            alguns momentos, isso pode gerar instabilidade temporária.
          </p>

          <p style={{ margin: "8px 0 0", lineHeight: 1.6 }}>
            A Aurora IA pode cometer erros, gerar respostas imprecisas ou
            conteúdo incompleto. Sempre confira informações importantes antes de
            usar comercialmente, financeiramente, juridicamente ou em decisões
            sensíveis.
          </p>
        </div>

        <div
          style={{
            marginBottom: 16,
            padding: 16,
            borderRadius: 22,
            border: "1px solid rgba(0,208,132,0.12)",
            background: "rgba(255,255,255,0.03)",
          }}
        >
          <h2 style={{ margin: 0 }} className="aurora-chat-app__sectionTitle">
            Convide amigos e ganhe imagens bônus
          </h2>

          <p className="aurora-chat-app__sectionText">
            Cada novo indicado válido pode render mais imagens para você.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 12,
              marginTop: 14,
            }}
          >
            <div className="aurora-chat-app__miniStat">
              <span>Seu código</span>
              <strong>{referralCode || "-"}</strong>
            </div>

            <div className="aurora-chat-app__miniStat">
              <span>Seu link</span>
              <strong style={{ wordBreak: "break-word", lineHeight: 1.5 }}>
                {referralLinkResolved || "-"}
              </strong>
            </div>
          </div>

          <div className="aurora-chat-app__quickActions" style={{ marginTop: 14 }}>
            <button
              type="button"
              className="aurora-chat-app__quickButton"
              onClick={handleCopyReferralLink}
              disabled={!referralLinkResolved}
            >
              Copiar link
            </button>

            <Link href="/planos" className="aurora-chat-app__ghostButton">
              Ver planos
            </Link>
          </div>

          {referredBy ? (
            <p className="aurora-chat-app__sectionText">
              Você foi indicado por: <strong>{referredBy}</strong>
            </p>
          ) : null}
        </div>

        <div className="aurora-chat-app__messages">
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
              >
                <div className="aurora-chat-app__messageMeta">
                  <span>{isAssistant ? "Aurora IA" : "Você"}</span>
                </div>

                <div className="aurora-chat-app__bubble">
                  <p>{message.content}</p>

                  {message.imageUrl ? (
                    <div className="aurora-chat-app__imageWrap aurora-chat-app__imageWrap--premium">
                      <div className="aurora-chat-app__imageHeader">
                        <span className="aurora-chat-app__imageBadge">
                          Imagem gerada pela Aurora IA
                        </span>
                      </div>

                      <div className="aurora-chat-app__imageContainer">
                        <img
                          src={message.imageUrl}
                          alt="Imagem gerada pela Aurora IA"
                          className="aurora-chat-app__image aurora-chat-app__image--premium"
                        />

                        <div className="aurora-chat-app__imageOverlay">
                          Página pública pronta para compartilhar e divulgar.
                        </div>
                      </div>

                      <div className="aurora-chat-app__imageActions aurora-chat-app__imageActions--premium">
                        {message.imagePageUrl ? (
                          <a
                            href={message.imagePageUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="aurora-chat-app__imageButton aurora-chat-app__imageButton--primary"
                          >
                            Ver imagem
                          </a>
                        ) : null}

                        {shareUrl ? (
                          <>
                            <button
                              type="button"
                              className="aurora-chat-app__imageButton"
                              onClick={() => handleCopyImageLink(shareUrl)}
                            >
                              Copiar link
                            </button>

                            <a
                              href={buildWhatsappShareUrl(shareUrl)}
                              target="_blank"
                              rel="noreferrer"
                              className="aurora-chat-app__imageButton"
                            >
                              WhatsApp
                            </a>

                            <a
                              href={buildFacebookShareUrl(shareUrl)}
                              target="_blank"
                              rel="noreferrer"
                              className="aurora-chat-app__imageButton"
                            >
                              Facebook
                            </a>

                            <a
                              href={buildXShareUrl(shareUrl)}
                              target="_blank"
                              rel="noreferrer"
                              className="aurora-chat-app__imageButton"
                            >
                              X
                            </a>

                            <a
                              href={buildLinkedinShareUrl(shareUrl)}
                              target="_blank"
                              rel="noreferrer"
                              className="aurora-chat-app__imageButton"
                            >
                              LinkedIn
                            </a>

                            <a
                              href={buildTelegramShareUrl(shareUrl)}
                              target="_blank"
                              rel="noreferrer"
                              className="aurora-chat-app__imageButton"
                            >
                              Telegram
                            </a>
                          </>
                        ) : null}

                        <button
                          type="button"
                          className="aurora-chat-app__imageButton aurora-chat-app__imageButton--ghost"
                          onClick={() =>
                            setInput(
                              "gere outra variação dessa imagem mais impactante"
                            )
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
            <article className="aurora-chat-app__message aurora-chat-app__message--assistant">
              <div className="aurora-chat-app__messageMeta">
                <span>Aurora IA</span>
              </div>

              <div className="aurora-chat-app__bubble aurora-chat-app__bubble--loading">
                <span className="aurora-chat-app__typingDot" />
                <span className="aurora-chat-app__typingDot" />
                <span className="aurora-chat-app__typingDot" />
              </div>
            </article>
          ) : null}

          <div ref={messagesEndRef} />
        </div>
      </section>

      <section className="aurora-chat-app__composer">
        <form className="aurora-chat-app__composerBox" onSubmit={handleSubmit}>
          <textarea
            className="aurora-chat-app__textarea"
            placeholder="Digite sua mensagem ou descreva a imagem que deseja..."
            value={input}
            onChange={(event) => setInput(event.target.value)}
            rows={4}
            disabled={loading}
          />

          <button
            type="submit"
            className="aurora-chat-app__sendButton"
            disabled={loading || !input.trim()}
          >
            {loading ? "Enviando..." : "Enviar"}
          </button>
        </form>

        <p className="aurora-chat-app__composerHint">
          Enter envia. Shift + Enter quebra linha.
        </p>
      </section>
    </main>
  );
}