"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import InstallPwaButton from "@/components/install-pwa-button";

type Message = {
  role: "user" | "assistant";
  content: string;
  imageUrl?: string | null;
  imagePageUrl?: string | null;
};

type ChatApiResponse = {
  reply?: string;
  content?: string;
  message?: string;
  imageUrl?: string | null;
  image_url?: string | null;
  imagePageUrl?: string | null;
  image_page_url?: string | null;
  messagesRemaining?: number | null;
  imagesRemaining?: number | null;
  bonusImages?: number | null;
  plan?: string | null;
  error?: string;
};

type MeApiResponse = {
  email?: string;
  plan?: string | null;
  planStatus?: string | null;
  planExpiresAt?: string | null;
  lastPaymentAt?: string | null;
  bonusImages?: number | null;
  messagesRemaining?: number | null;
  imagesRemaining?: number | null;
  error?: string;
};

const quickActions = [
  "Criar campanha para Instagram",
  "Gerar imagem premium para anúncio",
  "Ideia de negócio com IA",
  "Criar texto de vendas",
];

function normalizeAssistantText(data: ChatApiResponse) {
  return (
    data.reply ||
    data.content ||
    data.message ||
    "Recebi sua mensagem, mas a resposta veio vazia."
  );
}

function isLikelyImageRequest(text: string) {
  const value = text.toLowerCase();

  return (
    value.includes("crie uma imagem") ||
    value.includes("gere uma imagem") ||
    value.includes("criar imagem") ||
    value.includes("gerar imagem") ||
    value.includes("faça uma imagem") ||
    value.includes("imagem de") ||
    value.includes("desenhe") ||
    value.includes("crie arte") ||
    value.includes("gere arte") ||
    value.includes("create an image") ||
    value.includes("generate an image") ||
    value.includes("image of")
  );
}

function formatPlanLabel(value: string | null | undefined) {
  if (!value) return "FREE";
  return String(value).trim().toUpperCase();
}

function formatPlanStatus(value: string | null | undefined) {
  const normalized = String(value || "").trim().toLowerCase();

  if (!normalized) return "-";
  if (normalized === "active") return "Ativo";
  if (normalized === "inactive") return "Inativo";
  if (normalized === "canceled") return "Cancelado";
  if (normalized === "expired") return "Expirado";

  return normalized.toUpperCase();
}

export default function ChatClient() {
  const [input, setInput] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [plan, setPlan] = useState("FREE");
  const [planStatus, setPlanStatus] = useState<string | null>(null);
  const [planExpiresAt, setPlanExpiresAt] = useState<string | null>(null);
  const [messagesRemaining, setMessagesRemaining] = useState<number | null>(null);
  const [imagesRemaining, setImagesRemaining] = useState<number | null>(null);
  const [bonusImages, setBonusImages] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Olá! Eu sou a Aurora IA. Posso conversar com você, criar campanhas, sugerir ideias de negócio e gerar imagens.",
    },
  ]);

  const endRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  useEffect(() => {
    const savedEmail = window.localStorage.getItem("aurora-user-email");
    if (savedEmail) {
      setUserEmail(savedEmail);
    }
  }, []);

  useEffect(() => {
    if (!userEmail.trim()) {
      return;
    }

    window.localStorage.setItem(
      "aurora-user-email",
      userEmail.trim().toLowerCase()
    );
  }, [userEmail]);

  useEffect(() => {
    if (!userEmail.trim()) return;

    async function loadPlan() {
      try {
        const response = await fetch(
          `/api/me?email=${encodeURIComponent(userEmail.trim().toLowerCase())}`
        );

        let data: MeApiResponse = {};
        try {
          data = (await response.json()) as MeApiResponse;
        } catch {
          data = {};
        }

        if (!response.ok) return;

        if (typeof data.plan === "string" && data.plan.trim()) {
          setPlan(data.plan);
        }

        if (typeof data.planStatus === "string") {
          setPlanStatus(data.planStatus);
        } else {
          setPlanStatus(null);
        }

        if (typeof data.planExpiresAt === "string" && data.planExpiresAt.trim()) {
          setPlanExpiresAt(data.planExpiresAt);
        } else {
          setPlanExpiresAt(null);
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
      } catch {
        // silencioso
      }
    }

    void loadPlan();
  }, [userEmail]);

  const headerPlanLabel = useMemo(() => {
    return formatPlanLabel(plan);
  }, [plan]);

  const headerPlanStatusLabel = useMemo(() => {
    return formatPlanStatus(planStatus);
  }, [planStatus]);

  const daysRemaining = useMemo(() => {
    if (!planExpiresAt) return null;

    const now = new Date().getTime();
    const expires = new Date(planExpiresAt).getTime();

    if (Number.isNaN(expires)) return null;

    const diff = expires - now;

    if (diff <= 0) return 0;

    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }, [planExpiresAt]);

  const planExpiresLabel = useMemo(() => {
    if (!planExpiresAt) return "-";

    const date = new Date(planExpiresAt);

    if (Number.isNaN(date.getTime())) return "-";

    return date.toLocaleDateString("pt-BR");
  }, [planExpiresAt]);

  const canSend = useMemo(
    () => !loading && input.trim().length > 0,
    [loading, input]
  );

  async function sendMessage(textParam?: string) {
    const text = (textParam ?? input).trim();

    if (!text || loading) {
      return;
    }

    const historyForApi = messages.map((item) => ({
      role: item.role,
      content: item.content,
    }));

    const nextUserMessage: Message = {
      role: "user",
      content: text,
    };

    setMessages((current) => [...current, nextUserMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          email: userEmail.trim(),
          messages: historyForApi,
        }),
      });

      let data: ChatApiResponse = {};
      try {
        data = (await response.json()) as ChatApiResponse;
      } catch {
        data = {};
      }

      if (!response.ok) {
        setMessages((current) => [
          ...current,
          {
            role: "assistant",
            content: data.error || "Erro ao responder no chat.",
          },
        ]);
        return;
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

      if (typeof data.plan === "string" && data.plan.trim()) {
        setPlan(data.plan);
      }

      const imageUrl = data.imageUrl || data.image_url || null;
      const imagePageUrl = data.imagePageUrl || data.image_page_url || null;

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: normalizeAssistantText(data),
          imageUrl,
          imagePageUrl,
        },
      ]);
    } catch (error) {
      const fallback =
        error instanceof Error
          ? error.message
          : "Erro inesperado ao enviar sua mensagem.";

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: fallback,
        },
      ]);
    } finally {
      setLoading(false);
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage();
  }

  function handleQuickAction(text: string) {
    setInput(text);
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }

  function handleTextareaKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (canSend) {
        void sendMessage();
      }
    }
  }

  const planHint = isLikelyImageRequest(input)
    ? "Pedido detectado como criação visual."
    : "Converse normalmente ou peça campanhas e ideias.";

  return (
    <main className="aurora-chat-app">
      <div className="aurora-chat-app__bg aurora-chat-app__bg--1" />
      <div className="aurora-chat-app__bg aurora-chat-app__bg--2" />

      <header className="aurora-chat-app__header">
        <div className="aurora-chat-app__topbar">
          <Link href="/" className="aurora-chat-app__backButton">
            ← Home
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
            <span className="aurora-chat-app__heroBadge">
              Experiência mobile forte
            </span>
            <h1>Converse, crie imagens e segure atenção com cara de app real.</h1>
            <p>
              A Aurora está pronta para responder, gerar ideias e entregar visual
              melhor para retenção e conversão.
            </p>
          </div>

          <div className="aurora-chat-app__heroSide">
            <div className="aurora-chat-app__miniStats">
              <div className="aurora-chat-app__miniStat">
                <span>Plano</span>
                <strong>{headerPlanLabel}</strong>
              </div>

              <div className="aurora-chat-app__miniStat">
                <span>Status</span>
                <strong>{headerPlanStatusLabel}</strong>
              </div>

              <div className="aurora-chat-app__miniStat">
                <span>Vence em</span>
                <strong>
                  {daysRemaining === null
                    ? "-"
                    : daysRemaining === 0
                    ? "Expirado"
                    : `${daysRemaining} dias`}
                </strong>
              </div>

              <div className="aurora-chat-app__miniStat">
                <span>Validade</span>
                <strong>{planExpiresLabel}</strong>
              </div>

              <div className="aurora-chat-app__miniStat">
                <span>Mensagens</span>
                <strong>
                  {messagesRemaining === null
                    ? "-"
                    : messagesRemaining === -1
                    ? "Ilimitado"
                    : String(messagesRemaining)}
                </strong>
              </div>

              <div className="aurora-chat-app__miniStat">
                <span>Imagens</span>
                <strong>
                  {imagesRemaining === null || imagesRemaining === -1
                    ? "Ilimitado"
                    : String(imagesRemaining)}
                </strong>
              </div>

              <div className="aurora-chat-app__miniStat">
                <span>Bônus</span>
                <strong>{bonusImages}</strong>
              </div>
            </div>

            <div className="aurora-chat-app__installBox">
              <InstallPwaButton />
            </div>
          </div>
        </section>

        <section className="aurora-chat-app__emailCard">
          <label className="aurora-chat-app__label" htmlFor="aurora-email">
            Digite seu e-mail para controle do seu plano
          </label>

          <input
            id="aurora-email"
            type="email"
            value={userEmail}
            onChange={(event) => setUserEmail(event.target.value)}
            placeholder="seuemail@exemplo.com"
            className="aurora-chat-app__emailInput"
            autoComplete="email"
          />

          <p className="aurora-chat-app__emailHint">
            Esse e-mail ajuda a controlar plano, limites e recursos liberados.
          </p>
        </section>

        <section className="aurora-chat-app__quickActions">
          {quickActions.map((item) => (
            <button
              key={item}
              type="button"
              className="aurora-chat-app__quickButton"
              onClick={() => handleQuickAction(item)}
            >
              {item}
            </button>
          ))}
        </section>
      </header>

      <section className="aurora-chat-app__conversation">
        <div className="aurora-chat-app__conversationHeader">
          <div>
            <h2>Chat da Aurora</h2>
            <p>{planHint}</p>
          </div>

          <span className="aurora-chat-app__livePill">online</span>
        </div>

        <div className="aurora-chat-app__messages">
          {messages.map((message, index) => {
            const isAssistant = message.role === "assistant";

            return (
              <article
                key={`${message.role}-${index}-${message.content.slice(0, 24)}`}
                className={
                  isAssistant
                    ? "aurora-chat-app__message aurora-chat-app__message--assistant"
                    : "aurora-chat-app__message aurora-chat-app__message--user"
                }
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
                          ✦ Gerado pela Aurora IA
                        </span>
                      </div>

                      <div className="aurora-chat-app__imageContainer">
                        <img
                          src={message.imageUrl}
                          alt="Imagem gerada pela Aurora IA"
                          className="aurora-chat-app__image aurora-chat-app__image--premium"
                        />

                        <div className="aurora-chat-app__imageOverlay">
                          Visual premium pronto para campanha
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
                            🚀 Abrir página
                          </a>
                        ) : null}

                        <a
                          href={message.imageUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="aurora-chat-app__imageButton"
                        >
                          🔍 Ver imagem
                        </a>

                        <button
                          type="button"
                          className="aurora-chat-app__imageButton aurora-chat-app__imageButton--ghost"
                          onClick={() =>
                            setInput(
                              "gere outra variação dessa imagem mais impactante"
                            )
                          }
                        >
                          🔄 Gerar variação
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

          <div ref={endRef} />
        </div>
      </section>

      <form className="aurora-chat-app__composer" onSubmit={handleSubmit}>
        <div className="aurora-chat-app__composerBox">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleTextareaKeyDown}
            placeholder="Digite sua mensagem ou descreva a imagem que deseja..."
            className="aurora-chat-app__textarea"
            rows={1}
          />

          <button
            type="submit"
            className="aurora-chat-app__sendButton"
            disabled={!canSend}
          >
            {loading ? "Enviando..." : "Enviar"}
          </button>
        </div>

        <p className="aurora-chat-app__composerHint">
          Enter envia. Shift + Enter quebra linha.
        </p>
      </form>
    </main>
  );
}