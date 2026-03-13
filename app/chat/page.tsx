"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Olá! Eu sou a RicardoIA. Como posso ajudar você hoje?",
    },
  ]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const text = input.trim();
    if (!text || loading) return;

    const currentLang =
      typeof window !== "undefined"
        ? localStorage.getItem("aurora_lang") || "pt"
        : "pt";

    const nextMessages: Message[] = [
      ...messages,
      { role: "user", content: text },
    ];

    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-language": currentLang,
        },
        body: JSON.stringify({
          message: text,
          messages: nextMessages,
        }),
      });

      const contentType = response.headers.get("content-type") || "";

      if (!response.ok) {
        let errorText = "Erro ao processar a mensagem.";

        try {
          if (contentType.includes("application/json")) {
            const errorData = await response.json();
            errorText = errorData?.error || errorText;
          } else {
            const rawText = await response.text();
            if (rawText) errorText = rawText;
          }
        } catch {
          // mantém mensagem padrão
        }

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: errorText,
          },
        ]);

        return;
      }

      if (contentType.includes("application/json")) {
        const data = await response.json();

        const reply =
          data?.reply ||
          data?.message ||
          data?.output_text ||
          "Recebi sua mensagem, mas a resposta veio vazia.";

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: String(reply),
          },
        ]);

        return;
      }

      const reader = response.body?.getReader();

      if (!reader) {
        const fallbackText = await response.text();

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: fallbackText || "Resposta recebida.",
          },
        ]);

        return;
      }

      const decoder = new TextDecoder();
      let fullText = "";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "",
        },
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        fullText += decoder.decode(value, { stream: true });

        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: fullText,
          };
          return updated;
        });
      }
    } catch (error) {
      console.error("Erro no chat:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Erro ao processar a mensagem.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a, #1e293b, #020617)",
        color: "white",
        padding: "24px",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
            marginBottom: "24px",
          }}
        >
          <div>
            <h1 style={{ fontSize: "32px", marginBottom: "8px" }}>RicardoIA</h1>
            <p style={{ opacity: 0.85 }}>
              Atendimento, produtividade, marketing e crescimento empresarial.
            </p>
          </div>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link
              href="/"
              style={{
                color: "white",
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.2)",
                padding: "10px 14px",
                borderRadius: "10px",
              }}
            >
              Início
            </Link>

            <Link
              href="/planos"
              style={{
                color: "white",
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.2)",
                padding: "10px 14px",
                borderRadius: "10px",
              }}
            >
              Ver planos
            </Link>
          </div>
        </div>

        <div
          style={{
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "18px",
            background: "rgba(255,255,255,0.05)",
            padding: "18px",
            minHeight: "420px",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              flex: 1,
              overflowY: "auto",
            }}
          >
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                style={{
                  alignSelf:
                    message.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "85%",
                  padding: "14px 16px",
                  borderRadius: "14px",
                  background:
                    message.role === "user"
                      ? "#4f46e5"
                      : "rgba(255,255,255,0.08)",
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.5,
                }}
              >
                {message.content}
              </div>
            ))}
          </div>

          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              marginTop: "10px",
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua mensagem..."
              style={{
                flex: 1,
                minWidth: "240px",
                padding: "14px 16px",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.15)",
                background: "rgba(255,255,255,0.08)",
                color: "white",
                outline: "none",
              }}
            />

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "14px 20px",
                borderRadius: "12px",
                border: "none",
                background: loading ? "#475569" : "#6366f1",
                color: "white",
                fontWeight: "bold",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Enviando..." : "Enviar"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}