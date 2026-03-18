"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

type MessageRole = "user" | "assistant";

type Message = {
  role: MessageRole;
  content: string;
  imageUrl?: string | null;
  imagePageUrl?: string | null;
};

function isImageRequest(text: string) {
  const value = text.trim().toLowerCase();

  if (!value) return false;

  const triggers = [
    "crie uma imagem",
    "gere uma imagem",
    "gerar uma imagem",
    "criar uma imagem",
    "faça uma imagem",
    "faz uma imagem",
    "desenhe",
    "imagem de",
    "quero uma imagem",
    "me mostre uma imagem",
    "crie para mim uma imagem",
    "gere para mim uma imagem",
    "create an image",
    "generate an image",
    "image of",
    "draw",
  ];

  return triggers.some((trigger) => value.includes(trigger));
}

function getText(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

export default function ChatClient() {
  const searchParams = useSearchParams();

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Olá! Eu sou a Aurora IA. Posso conversar com você, criar campanhas e gerar imagens.",
    },
  ]);

  const [input, setInput] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    const promptFromUrl = searchParams.get("prompt");

    if (promptFromUrl && !input.trim()) {
      setInput(promptFromUrl);
    }
  }, [searchParams, input]);

  const canSubmit = useMemo(() => {
    return input.trim().length > 0 && !isLoading;
  }, [input, isLoading]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const text = input.trim();
    const email = userEmail.trim().toLowerCase();

    if (!text || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      if (isImageRequest(text)) {
        const response = await fetch("/api/image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: text,
            email,
          }),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          const errorMessage: Message = {
            role: "assistant",
            content: getText(data?.error, "Erro ao gerar a imagem."),
          };

          setMessages((prev) => [...prev, errorMessage]);
          return;
        }

        const imageUrl =
          getText(data?.imageUrl) ||
          getText(data?.image_url) ||
          getText(data?.url) ||
          null;

        const assistantMessage: Message = {
          role: "assistant",
          content: getText(data?.message, "Imagem gerada."),
          imageUrl,
          imagePageUrl: getText(data?.imagePageUrl) || null,
        };

        setMessages((prev) => [...prev, assistantMessage]);
        return;
      }

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          email,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const errorMessage: Message = {
          role: "assistant",
          content: getText(data?.error, "Erro ao responder no chat."),
        };

        setMessages((prev) => [...prev, errorMessage]);
        return;
      }

      const assistantMessage: Message = {
        role: "assistant",
        content:
          getText(data?.reply) ||
          getText(data?.message) ||
          getText(data?.content) ||
          "Resposta recebida.",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: "assistant",
        content:
          error instanceof Error
            ? error.message
            : "Erro inesperado ao processar sua solicitação.",
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black px-4 py-6 text-white">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
          <div>
            <h1 className="text-2xl font-bold">Aurora IA</h1>
            <p className="text-sm text-white/70">
              Converse, crie campanhas, ideias de negócio e imagens.
            </p>
          </div>

          <nav className="flex flex-wrap gap-2">
            <Link
              href="/"
              className="rounded-full border border-white/10 px-4 py-2 text-sm hover:bg-white/10"
            >
              Home
            </Link>
            <Link
              href="/chat"
              className="rounded-full border border-white/10 px-4 py-2 text-sm hover:bg-white/10"
            >
              Chat
            </Link>
            <Link
              href="/editor"
              className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-emerald-400"
            >
              Editor
            </Link>
            <Link
              href="/planos"
              className="rounded-full border border-white/10 px-4 py-2 text-sm hover:bg-white/10"
            >
              Planos
            </Link>
            <Link
              href="/explorar"
              className="rounded-full border border-white/10 px-4 py-2 text-sm hover:bg-white/10"
            >
              Explorar
            </Link>
            <Link
              href="/prompts"
              className="rounded-full border border-white/10 px-4 py-2 text-sm hover:bg-white/10"
            >
              Prompts
            </Link>
          </nav>
        </header>

        <section className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4">
          <label className="mb-2 block text-sm text-white/80">Seu email</label>
          <input
            type="email"
            value={userEmail}
            onChange={(event) => setUserEmail(event.target.value)}
            placeholder="seuemail@exemplo.com"
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-white/40 focus:border-emerald-400/40"
          />
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5">
          <div className="border-b border-white/10 px-4 py-4">
            <h2 className="text-lg font-semibold">Chat da Aurora</h2>
          </div>

          <div className="h-[60vh] overflow-y-auto px-4 py-4">
            <div className="space-y-4">
              {messages.map((message, index) => {
                const isUser = message.role === "user";

                return (
                  <div
                    key={`${message.role}-${index}-${message.content.slice(0, 20)}`}
                    className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[90%] rounded-2xl px-4 py-3 md:max-w-[75%] ${
                        isUser
                          ? "border border-emerald-400/20 bg-emerald-500/10"
                          : "border border-white/10 bg-black/30"
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words text-sm leading-6">
                        {message.content}
                      </p>

                      {message.imageUrl ? (
                        <img
                          src={message.imageUrl}
                          alt="Imagem gerada pela Aurora IA"
                          className="mt-3 w-full max-w-2xl rounded-xl border border-emerald-400/20"
                        />
                      ) : null}

                      {message.imagePageUrl ? (
                        <a
                          href={message.imagePageUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-3 inline-block text-sm text-emerald-300 hover:text-emerald-200"
                        >
                          Abrir página da imagem
                        </a>
                      ) : null}
                    </div>
                  </div>
                );
              })}

              {isLoading ? (
                <div className="flex justify-start">
                  <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/70">
                    Aurora IA está processando...
                  </div>
                </div>
              ) : null}

              <div ref={messagesEndRef} />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="border-t border-white/10 p-4">
            <div className="flex flex-col gap-3">
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder='Exemplo: "Crie uma imagem de Dubai futurista" ou "Me dê uma estratégia de marketing".'
                rows={4}
                className="w-full resize-none rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-white/40 focus:border-emerald-400/40"
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? "Enviando..." : "Enviar"}
                </button>
              </div>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}