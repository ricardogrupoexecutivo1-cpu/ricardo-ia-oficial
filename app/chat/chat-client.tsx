"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
  imageUrl?: string | null;
  imagePageUrl?: string | null;
};

function isImageRequest(text: string) {
  const value = text.toLowerCase();

  return (
    value.includes("crie uma imagem") ||
    value.includes("gere uma imagem") ||
    value.includes("criar imagem") ||
    value.includes("gerar imagem") ||
    value.includes("faça uma imagem") ||
    value.includes("imagem de")
  );
}

export default function ChatClient() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Olá! Eu sou a Aurora IA. Posso conversar com você, criar campanhas e gerar imagens.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      if (isImageRequest(input)) {
        const res = await fetch("/api/image", {
          method: "POST",
          body: JSON.stringify({ prompt: input }),
        });

        const data = await res.json();

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Imagem gerada:",
            imageUrl: data.imageUrl,
          },
        ]);
      } else {
        const res = await fetch("/api/chat", {
          method: "POST",
          body: JSON.stringify({ message: input }),
        });

        const data = await res.json();

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.reply || "Resposta recebida.",
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Erro ao conectar com o servidor.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="aurora-page">
      <section className="chat-hero-section">
        <div className="site-shell">
          <div className="chat-layout">
            {/* SIDEBAR */}
            <aside className="chat-sidebar">
              <div className="sidebar-card sidebar-card-highlight">
                <div className="hero-badge">Aurora IA</div>
                <h1 className="chat-title">Chat da Aurora</h1>
                <p className="chat-subtitle">
                  Converse, crie campanhas e gere imagens com uma experiência premium.
                </p>

                <div className="sidebar-actions">
                  <Link href="/" className="btn btn-secondary btn-block">
                    Home
                  </Link>
                  <Link href="/planos" className="btn btn-primary btn-block">
                    Planos
                  </Link>
                </div>
              </div>
            </aside>

            {/* CHAT */}
            <section className="chat-main">
              <div className="chat-window">
                <div className="chat-window-header">
                  <h2 className="chat-window-title">
                    Experiência restaurada
                  </h2>
                </div>

                <div className="messages-panel">
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`message-row ${
                        msg.role === "user"
                          ? "message-row-user"
                          : "message-row-assistant"
                      }`}
                    >
                      <div
                        className={`message-bubble ${
                          msg.role === "user"
                            ? "message-bubble-user"
                            : "message-bubble-assistant"
                        }`}
                      >
                        <strong>
                          {msg.role === "user" ? "Você" : "Aurora"}
                        </strong>
                        <p>{msg.content}</p>

                        {msg.imageUrl && (
                          <img
                            src={msg.imageUrl}
                            className="message-image"
                          />
                        )}
                      </div>
                    </div>
                  ))}

                  {loading && (
                    <div className="message-row message-row-assistant">
                      <div className="message-bubble message-bubble-assistant">
                        Pensando...
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                <form className="composer" onSubmit={handleSubmit}>
                  <div className="composer-grid">
                    <textarea
                      className="aurora-textarea"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Digite sua mensagem..."
                    />

                    <button className="btn btn-primary">
                      Enviar
                    </button>
                  </div>
                </form>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}