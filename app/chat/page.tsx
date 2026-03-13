"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

type Message = {
  role: "user" | "assistant";
  content: string;
};

function isImageRequest(text: string) {
  const value = text.toLowerCase();

  return (
    value.includes("crie uma imagem") ||
    value.includes("gere uma imagem") ||
    value.includes("criar imagem") ||
    value.includes("gerar imagem") ||
    value.includes("faça uma imagem") ||
    value.includes("desenhe") ||
    value.includes("imagem de") ||
    value.includes("image of") ||
    value.includes("create an image") ||
    value.includes("generate an image")
  );
}

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Olá! Eu sou a Aurora IA. Posso conversar com você ou gerar uma imagem.",
    },
  ]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const text = input.trim();
    if (!text || loading || imageLoading) return;

    if (isImageRequest(text)) {
      await handleGenerateImage(text);
      return;
    }

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

      const data = await response.json();

      if (!response.ok) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data?.error || "Erro ao processar a mensagem.",
          },
        ]);
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data?.reply || "Resposta vazia.",
        },
      ]);
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

  async function handleGenerateImage(customPrompt?: string) {
    const prompt = (customPrompt || input).trim();

    if (!prompt || imageLoading) return;

    setGeneratedImage("");
    setImageLoading(true);

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: prompt,
      },
    ]);

    try {
      const response = await fetch("/api/image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data?.error || "Erro ao gerar imagem.",
          },
        ]);
        return;
      }

      const src = `data:${data.mimeType};base64,${data.imageBase64}`;
      setGeneratedImage(src);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Imagem gerada com sucesso.",
        },
      ]);

      setInput("");
    } catch (error) {
      console.error("Erro ao gerar imagem:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Erro ao gerar imagem.",
        },
      ]);
    } finally {
      setImageLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #020617, #0f172a, #081225)",
        color: "white",
        padding: "24px",
      }}
    >
      <div style={{ maxWidth: "980px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "12px",
            alignItems: "center",
            flexWrap: "wrap",
            marginBottom: "20px",
          }}
        >
          <div>
            <h1 style={{ fontSize: "32px", marginBottom: "8px" }}>Aurora IA</h1>
            <p style={{ opacity: 0.85 }}>
              Conversa inteligente e geração de imagens.
            </p>
          </div>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link
              href="/"
              style={{
                color: "white",
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.14)",
                padding: "10px 14px",
                borderRadius: "12px",
              }}
            >
              Início
            </Link>

            <Link
              href="/planos"
              style={{
                color: "white",
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.14)",
                padding: "10px 14px",
                borderRadius: "12px",
              }}
            >
              Planos
            </Link>
          </div>
        </div>

        <div
          style={{
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "22px",
            background: "rgba(255,255,255,0.05)",
            padding: "18px",
          }}
        >
          <div
            style={{
              minHeight: "320px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                style={{
                  alignSelf: message.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "85%",
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.5,
                  padding: "14px 16px",
                  borderRadius: "16px",
                  background:
                    message.role === "user"
                      ? "#2563eb"
                      : "rgba(255,255,255,0.08)",
                }}
              >
                {message.content}
              </div>
            ))}
          </div>

          {generatedImage ? (
            <div style={{ marginTop: "18px" }}>
              <img
                src={generatedImage}
                alt="Imagem gerada por IA"
                style={{
                  width: "100%",
                  maxWidth: "520px",
                  borderRadius: "18px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  display: "block",
                }}
              />
            </div>
          ) : null}

          <form
            onSubmit={handleSubmit}
            style={{
              marginTop: "18px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua mensagem ou descreva a imagem que deseja..."
              rows={4}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "16px",
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.06)",
                color: "white",
                resize: "vertical",
                outline: "none",
              }}
            />

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <button
                type="submit"
                disabled={loading || imageLoading}
                style={{
                  padding: "14px 18px",
                  borderRadius: "14px",
                  border: "none",
                  background: loading ? "#334155" : "#06b6d4",
                  color: "white",
                  fontWeight: "bold",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "Enviando..." : "Enviar mensagem"}
              </button>

              <button
                type="button"
                onClick={() => handleGenerateImage()}
                disabled={imageLoading || loading}
                style={{
                  padding: "14px 18px",
                  borderRadius: "14px",
                  border: "1px solid rgba(255,255,255,0.14)",
                  background: imageLoading ? "#1e293b" : "rgba(255,255,255,0.06)",
                  color: "white",
                  fontWeight: "bold",
                  cursor: imageLoading ? "not-allowed" : "pointer",
                }}
              >
                {imageLoading ? "Gerando imagem..." : "Gerar imagem"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}