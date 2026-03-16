"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
  imageUrl?: string | null;
  imagePageUrl?: string | null;
};

type ChatApiResponse = {
  reply?: string;
  message?: string;
  content?: string;
  messages?: { role?: string; content?: string }[];
  messagesRemaining?: number | null;
  imagesRemaining?: number | null;
  plan?: string | null;
  error?: string;
};

type ImageApiResponse = {
  imageId?: string;
  imageUrl?: string;
  image_url?: string;
  url?: string;
  imagePageUrl?: string;
  messagesRemaining?: number | null;
  imagesRemaining?: number | null;
  plan?: string | null;
  error?: string;
};

type ReferralApiResponse = {
  referralCode?: string | null;
  referralLink?: string | null;
  referredBy?: string | null;
  bonusImages?: number | null;
  referralBonusAwarded?: boolean;
  rewardPerReferral?: number;
  error?: string;
};

function isImageRequest(text: string) {
  const value = text.toLowerCase().trim();

  return (
    value.includes("crie uma imagem") ||
    value.includes("gere uma imagem") ||
    value.includes("gerar uma imagem") ||
    value.includes("criar imagem") ||
    value.includes("gerar imagem") ||
    value.includes("faça uma imagem") ||
    value.includes("faz uma imagem") ||
    value.includes("desenhe") ||
    value.includes("imagem de") ||
    value.includes("create an image") ||
    value.includes("generate an image") ||
    value.includes("image of")
  );
}

function getAssistantText(data: ChatApiResponse) {
  if (typeof data.reply === "string" && data.reply.trim()) return data.reply.trim();
  if (typeof data.message === "string" && data.message.trim()) return data.message.trim();
  if (typeof data.content === "string" && data.content.trim()) return data.content.trim();

  if (Array.isArray(data.messages) && data.messages.length > 0) {
    const lastAssistant = [...data.messages]
      .reverse()
      .find((item) => item.role === "assistant" && typeof item.content === "string");

    if (lastAssistant?.content?.trim()) {
      return lastAssistant.content.trim();
    }
  }

  return "Recebi sua mensagem, mas não consegui montar a resposta corretamente.";
}

function getPlanLabel(plan: string | null | undefined) {
  const value = (plan || "free").toLowerCase();

  if (value === "pro") return "PRO";
  if (value === "influencer") return "INFLUENCER";
  if (value === "total") return "TOTAL";
  if (value === "developer") return "DEVELOPER";

  return "FREE";
}

function formatRemaining(value: number | null) {
  if (value === null) return "-";
  if (value === -1) return "Ilimitado";
  return String(value);
}

function getQuickPrompt(type: "marketing" | "image" | "business") {
  if (type === "marketing") {
    return "Crie uma campanha de marketing para minha empresa com foco em vendas, redes sociais e posicionamento.";
  }

  if (type === "image") {
    return "Crie uma imagem impactante de tecnologia futurista com iluminação neon e visual profissional.";
  }

  return "Me dê uma ideia de negócio lucrativa, escalável e moderna para começar com baixo investimento.";
}

async function fetchWithTimeout(
  input: RequestInfo | URL,
  init?: RequestInit,
  timeoutMs = 30000
) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(input, {
      ...init,
      signal: controller.signal,
    });
  } finally {
    window.clearTimeout(timeoutId);
  }
}

function isLikelyImageUrl(value: string | null | undefined) {
  if (!value) return false;

  const lower = value.toLowerCase();

  return lower.startsWith("http://") || lower.startsWith("https://") || lower.startsWith("data:image/");
}

export default function ChatClient() {
  const [input, setInput] = useState("");
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState("free");
  const [messagesRemaining, setMessagesRemaining] = useState<number | null>(null);
  const [imagesRemaining, setImagesRemaining] = useState<number | null>(null);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [referralLink, setReferralLink] = useState<string | null>(null);
  const [referredBy, setReferredBy] = useState<string | null>(null);
  const [bonusImages, setBonusImages] = useState<number>(0);
  const [rewardPerReferral, setRewardPerReferral] = useState<number>(5);
  const [copied, setCopied] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Olá! Eu sou a Aurora IA. Posso conversar com você, criar campanhas, sugerir ideias de negócio e gerar imagens.",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const savedEmail =
      typeof window !== "undefined" ? window.localStorage.getItem("aurora_email") : null;

    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("aurora_email", email);
    }
  }, [email]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const ref = (params.get("ref") || "").trim().toLowerCase();
    const prompt = (params.get("prompt") || "").trim();

    if (ref) {
      window.localStorage.setItem("aurora_ref", ref);
    }

    if (prompt) {
      setInput(prompt);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    async function loadReferral() {
      const userEmail = email.trim().toLowerCase();

      if (!userEmail) {
        setReferralCode(null);
        setReferralLink(null);
        setReferredBy(null);
        setBonusImages(0);
        return;
      }

      try {
        const ref =
          typeof window !== "undefined"
            ? window.localStorage.getItem("aurora_ref") || ""
            : "";

        const response = await fetchWithTimeout(
          "/api/referral",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: userEmail,
              ref,
            }),
          },
          15000
        );

        const data = (await response.json()) as ReferralApiResponse;

        if (!response.ok) {
          console.error(data?.error || "Erro ao carregar referral.");
          return;
        }

        setReferralCode(data?.referralCode || null);
        setReferralLink(data?.referralLink || null);
        setReferredBy(data?.referredBy || null);
        setBonusImages(Number(data?.bonusImages || 0));
        setRewardPerReferral(Number(data?.rewardPerReferral || 5));
      } catch (error) {
        console.error("Erro ao carregar referral:", error);
      }
    }

    loadReferral();
  }, [email]);

  const canSend = useMemo(() => {
    return input.trim().length > 0 && !isLoading;
  }, [input, isLoading]);

  async function handleQuickAction(type: "marketing" | "image" | "business") {
    const text = getQuickPrompt(type);
    setInput(text);
    await handleSubmit(undefined, text);
  }

  async function handleCopyReferralLink() {
    if (!referralLink) return;

    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Erro ao copiar link:", error);
    }
  }

  async function handleSubmit(
    event?: FormEvent<HTMLFormElement>,
    forcedText?: string
  ) {
    event?.preventDefault();

    const text = (forcedText ?? input).trim();
    const userEmail = email.trim().toLowerCase();

    if (!text || isLoading) return;

    const nextMessages: Message[] = [
      ...messages,
      {
        role: "user",
        content: text,
      },
    ];

    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      if (isImageRequest(text)) {
        const response = await fetchWithTimeout(
          "/api/image",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              prompt: text,
              email: userEmail,
            }),
          },
          120000
        );

        const data = (await response.json()) as ImageApiResponse;

        if (!response.ok) {
          setMessages([
            ...nextMessages,
            {
              role: "assistant",
              content: data?.error || "Erro ao gerar a imagem.",
            },
          ]);
          return;
        }

        if (typeof data?.imagesRemaining === "number") {
          setImagesRemaining(data.imagesRemaining);
        }

        if (typeof data?.messagesRemaining === "number") {
          setMessagesRemaining(data.messagesRemaining);
        }

        if (typeof data?.plan === "string" && data.plan) {
          setPlan(data.plan);
        }

        const imageUrl = data.imageUrl || data.image_url || data.url;
        const imagePageUrl = data.imagePageUrl || null;

        setMessages([
          ...nextMessages,
          {
            role: "assistant",
            content: imagePageUrl
              ? "Imagem gerada com sucesso. Sua página pública já está pronta."
              : "Imagem gerada com sucesso.",
            imageUrl: imageUrl || null,
            imagePageUrl,
          },
        ]);

        return;
      }

      const response = await fetchWithTimeout(
        "/api/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: text,
            email: userEmail,
          }),
        },
        45000
      );

      const data = (await response.json()) as ChatApiResponse;

      if (!response.ok) {
        setMessages([
          ...nextMessages,
          {
            role: "assistant",
            content: data?.error || "Erro ao responder no chat.",
          },
        ]);
        return;
      }

      if (typeof data?.messagesRemaining === "number") {
        setMessagesRemaining(data.messagesRemaining);
      }

      if (typeof data?.imagesRemaining === "number") {
        setImagesRemaining(data.imagesRemaining);
      }

      if (typeof data?.plan === "string" && data.plan) {
        setPlan(data.plan);
      }

      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content: getAssistantText(data),
        },
      ]);
    } catch (error) {
      console.error(error);

      const fallbackMessage =
        error instanceof Error && error.name === "AbortError"
          ? "A requisição demorou demais e foi cancelada. A geração de imagem excedeu 120 segundos."
          : "Ocorreu um erro inesperado. Tente novamente em instantes.";

      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content: fallbackMessage,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <header className="rounded-2xl border border-zinc-200 bg-gradient-to-r from-zinc-50 to-white p-5 shadow-sm">
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Aurora IA
              </h1>
              <p className="mt-2 text-sm leading-6 text-zinc-600 sm:text-base">
                Conversa inteligente, geração de imagens, campanhas e ideias para negócios.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-4">
              <div className="rounded-xl border border-zinc-200 bg-white p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Plano atual
                </div>
                <div className="mt-2 text-lg font-bold">{getPlanLabel(plan)}</div>
              </div>

              <div className="rounded-xl border border-zinc-200 bg-white p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Mensagens restantes hoje
                </div>
                <div className="mt-2 text-lg font-bold">
                  {formatRemaining(messagesRemaining)}
                </div>
              </div>

              <div className="rounded-xl border border-zinc-200 bg-white p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Imagens restantes hoje
                </div>
                <div className="mt-2 text-lg font-bold">
                  {formatRemaining(imagesRemaining)}
                </div>
              </div>

              <div className="rounded-xl border border-zinc-200 bg-white p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Imagens bônus
                </div>
                <div className="mt-2 text-lg font-bold">{bonusImages}</div>
              </div>
            </div>
          </div>
        </header>

        <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <label
            htmlFor="aurora-email"
            className="mb-2 block text-sm font-semibold text-zinc-700"
          >
            Digite seu e-mail para controle do seu plano
          </label>

          <input
            id="aurora-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seuemail@dominio.com"
            className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
          />

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <button
              type="button"
              onClick={() => handleQuickAction("marketing")}
              disabled={isLoading}
              className="rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm font-medium transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Criar campanha
            </button>

            <button
              type="button"
              onClick={() => handleQuickAction("image")}
              disabled={isLoading}
              className="rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm font-medium transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Gerar imagem
            </button>

            <button
              type="button"
              onClick={() => handleQuickAction("business")}
              disabled={isLoading}
              className="rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm font-medium transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Ideia de negócio
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-base font-semibold sm:text-lg">
                Convide amigos e ganhe imagens bônus
              </h2>
              <p className="mt-1 text-sm text-zinc-600">
                Cada novo indicado válido pode render +{rewardPerReferral} imagens para você.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Seu código
                </div>
                <div className="mt-2 break-all text-sm font-semibold text-zinc-900">
                  {referralCode || "-"}
                </div>
              </div>

              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 sm:col-span-2">
                <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Seu link de convite
                </div>
                <div className="mt-2 break-all text-sm text-zinc-900">
                  {referralLink || "Digite seu e-mail para gerar seu link."}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-zinc-600">
                {referredBy ? (
                  <>Você entrou por indicação de: <strong>{referredBy}</strong></>
                ) : (
                  <>Nenhuma indicação registrada até agora.</>
                )}
              </div>

              <button
                type="button"
                onClick={handleCopyReferralLink}
                disabled={!referralLink}
                className="inline-flex items-center justify-center rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {copied ? "Link copiado!" : "Copiar link de convite"}
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <div className="border-b border-zinc-200 px-5 py-4">
            <h2 className="text-base font-semibold sm:text-lg">Chat da Aurora</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Escreva normalmente ou peça uma imagem.
            </p>
          </div>

          <div className="max-h-[560px] space-y-4 overflow-y-auto px-4 py-4 sm:px-5">
            {messages.map((message, index) => {
              const isUser = message.role === "user";

              return (
                <div
                  key={`${message.role}-${index}`}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={[
                      "max-w-[92%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm sm:max-w-[80%]",
                      isUser
                        ? "bg-zinc-900 text-white"
                        : "border border-zinc-200 bg-zinc-50 text-zinc-900",
                    ].join(" ")}
                  >
                    {message.imageUrl && isLikelyImageUrl(message.imageUrl) && (
                      <div className="mb-3 overflow-hidden rounded-2xl border border-zinc-200 bg-white">
                        <img
                          src={message.imageUrl}
                          alt="Imagem gerada pela Aurora IA"
                          className="h-auto w-full object-cover"
                        />
                      </div>
                    )}

                    <div className="whitespace-pre-wrap">{message.content}</div>

                    {(message.imageUrl || message.imagePageUrl) && (
                      <div className="mt-3 flex flex-col gap-2">
                        {message.imagePageUrl && (
                          <a
                            href={message.imagePageUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-semibold underline underline-offset-4"
                          >
                            Ver página pública da imagem
                          </a>
                        )}

                        {message.imageUrl && isLikelyImageUrl(message.imageUrl) && (
                          <a
                            href={message.imageUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-semibold underline underline-offset-4"
                          >
                            Abrir imagem em nova guia
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[92%] rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-500 shadow-sm sm:max-w-[80%]">
                  Aurora IA está gerando sua resposta...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="border-t border-zinc-200 p-4 sm:p-5">
            <div className="flex flex-col gap-3">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Digite sua mensagem ou descreva a imagem que deseja..."
                rows={4}
                className="w-full resize-none rounded-2xl border border-zinc-300 px-4 py-3 text-sm leading-6 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
              />

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs leading-5 text-zinc-500">
                  Exemplos: “Crie uma imagem de Dubai futurista” ou “Me dê uma estratégia de marketing”.
                </p>

                <button
                  type="submit"
                  disabled={!canSend}
                  className="inline-flex items-center justify-center rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? "Enviando..." : "Enviar mensagem"}
                </button>
              </div>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}