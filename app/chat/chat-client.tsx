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
    "robô",
    "robo",
    "new york",
    "nova york",
  ];

  return terms.some((term) => normalized.includes(term));
}

function resolveAssistantText(data: ChatResponse, imageUrl: string | null) {
  const raw =
    data.reply?.trim() ||
    data.message?.trim() ||
    data.content?.trim() ||
    "";

  if (raw) {
    return raw;
  }

  if (imageUrl) {
    return "Imagem gerada com sucesso.";
  }

  if (data.error?.trim()) {
    return data.error.trim();
  }

  if (data.imageSaveError?.trim()) {
    return `Recebi sua mensagem, mas houve um problema: ${data.imageSaveError.trim()}`;
  }

  return "Recebi sua mensagem, mas a resposta veio vazia.";
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
    if (savedEmail) {
      setUserEmail(savedEmail);
    }
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

        if (typeof data.plan === "string" && data.plan) {
          setPlan(data.plan);
        }

        if (typeof data.messagesRemaining === "number") {
          setMessagesRemaining(data.messagesRemaining);
        }

        if (typeof data.imagesRemaining === "number") {
          setImagesRemaining(data.imagesRemaining);
        }

        if (typeof data.bonusImages === "number") {
          setBonusImages(data.bonusImages);
        }

        if (typeof data.referralCode === "string") {
          setReferralCode(data.referralCode);
        }

        if (typeof data.referralLink === "string") {
          setReferralLink(data.referralLink);
        }

        if (typeof data.referredBy === "string") {
          setReferredBy(data.referredBy);
        }
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
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="aurora-chat-app">
      <section className="aurora-chat-app__hero">
        <div className="aurora-chat-app__heroBadge">Aurora IA</div>
        <h1 className="aurora-chat-app__title">Chat da Aurora</h1>
        <p className="aurora-chat-app__subtitle">
          Converse normalmente ou peça campanhas e ideias.
        </p>
      </section>

      <section className="aurora-chat-app__panel aurora-chat-app__panel--status">
        <div className="aurora-chat-app__statusGrid">
          <div className="aurora-chat-app__statusCard">
            <span className="aurora-chat-app__statusLabel">Plano</span>
            <strong className="aurora-chat-app__statusValue">{plan || "FREE"}</strong>
          </div>

          <div className="aurora-chat-app__statusCard">
            <span className="aurora-chat-app__statusLabel">Mensagens</span>
            <strong className="aurora-chat-app__statusValue">
              {messagesRemaining ?? "-"}
            </strong>
          </div>

          <div className="aurora-chat-app__statusCard">
            <span className="aurora-chat-app__statusLabel">Imagens</span>
            <strong className="aurora-chat-app__statusValue">
              {imagesRemaining ?? "Ilimitado"}
            </strong>
          </div>

          <div className="aurora-chat-app__statusCard">
            <span className="aurora-chat-app__statusLabel">Bônus</span>
            <strong className="aurora-chat-app__statusValue">{bonusImages}</strong>
          </div>
        </div>

        <div className="aurora-chat-app__emailBox">
          <label className="aurora-chat-app__label" htmlFor="aurora-email">
            Digite seu e-mail para controle do seu plano
          </label>

          <input
            id="aurora-email"
            type="email"
            className="aurora-chat-app__input"
            placeholder="seuemail@exemplo.com"
            value={userEmail}
            onChange={(event) => setUserEmail(event.target.value)}
          />

          <p className="aurora-chat-app__helperText">
            Esse e-mail ajuda a controlar plano, limites e recursos liberados.
          </p>
        </div>

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
      </section>

      <section className="aurora-chat-app__panel aurora-chat-app__panel--referral">
        <h2 className="aurora-chat-app__sectionTitle">
          Convide amigos e ganhe imagens bônus
        </h2>

        <p className="aurora-chat-app__sectionText">
          Cada novo indicado válido pode render mais imagens para você.
        </p>

        <div className="aurora-chat-app__referralGrid">
          <div className="aurora-chat-app__referralCard">
            <span className="aurora-chat-app__statusLabel">Seu código</span>
            <strong className="aurora-chat-app__statusValue">
              {referralCode || "-"}
            </strong>
          </div>

          <div className="aurora-chat-app__referralCard">
            <span className="aurora-chat-app__statusLabel">Seu link</span>
            <strong className="aurora-chat-app__statusValue aurora-chat-app__statusValue--wrap">
              {referralLinkResolved || "-"}
            </strong>
          </div>
        </div>

        <div className="aurora-chat-app__referralActions">
          <button
            type="button"
            className="aurora-chat-app__quickButton"
            onClick={handleCopyReferralLink}
            disabled={!referralLinkResolved}
          >
            Copiar link
          </button>

          <Link href="/planos" className="aurora-chat-app__linkButton">
            Ver planos
          </Link>
        </div>

        {referredBy ? (
          <p className="aurora-chat-app__sectionText">
            Você foi indicado por: <strong>{referredBy}</strong>
          </p>
        ) : null}
      </section>

      <section className="aurora-chat-app__panel aurora-chat-app__panel--messages">
        <div className="aurora-chat-app__messagesHeader">
          <h2 className="aurora-chat-app__sectionTitle">Chat da Aurora</h2>
        </div>

        <div className="aurora-chat-app__messagesList">
          {messages.map((message, index) => {
            const isAssistant = message.role === "assistant";

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

                <div className="aurora-chat-app__messageContent">
                  <p>{message.content}</p>

                  {message.imageUrl ? (
                    <div className="aurora-chat-app__imageWrap">
                      <img
                        src={message.imageUrl}
                        alt="Imagem gerada pela Aurora IA"
                        className="aurora-chat-app__image"
                      />

                      <div className="aurora-chat-app__imageActions">
                        {message.imagePageUrl ? (
                          <a
                            href={message.imagePageUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="aurora-chat-app__imageButton"
                          >
                            Ver imagem
                          </a>
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

              <div className="aurora-chat-app__messageContent">
                <p>Preparando sua resposta...</p>
              </div>
            </article>
          ) : null}

          <div ref={messagesEndRef} />
        </div>

        <form className="aurora-chat-app__form" onSubmit={handleSubmit}>
          <textarea
            className="aurora-chat-app__textarea"
            placeholder="Digite sua mensagem ou descreva a imagem que deseja..."
            value={input}
            onChange={(event) => setInput(event.target.value)}
            rows={4}
            disabled={loading}
          />

          <div className="aurora-chat-app__formActions">
            <button
              type="submit"
              className="aurora-chat-app__submit"
              disabled={loading || !input.trim()}
            >
              {loading ? "Enviando..." : "Enviar"}
            </button>
          </div>

          <p className="aurora-chat-app__helperText">
            Enter envia. Shift + Enter quebra linha.
          </p>
        </form>
      </section>
    </main>
  );
}