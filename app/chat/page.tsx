"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type Message = {
  role: "user" | "assistant";
  content: string;
};

function normalizePlan(value: string | null | undefined) {
  const normalized = (value || "").trim().toLowerCase();

  if (
    normalized === "pro" ||
    normalized === "total" ||
    normalized === "premium" ||
    normalized === "admin"
  ) {
    return "pro";
  }

  if (normalized === "influencer") {
    return "influencer";
  }

  return "free";
}

function isImageRequest(text: string) {
  const value = text.toLowerCase().trim();

  const strongTriggers = [
    "crie uma imagem",
    "gere uma imagem",
    "criar imagem",
    "gerar imagem",
    "faça uma imagem",
    "desenhe",
    "create an image",
    "generate an image",
  ];

  const descriptiveTriggers = [
    "imagem de",
    "imagem do",
    "imagem da",
    "imagem para",
    "quero uma imagem",
    "preciso de uma imagem",
    "crie para mim uma imagem",
    "gere para mim uma imagem",
  ];

  if (strongTriggers.some((trigger) => value.includes(trigger))) {
    return true;
  }

  if (descriptiveTriggers.some((trigger) => value.includes(trigger))) {
    return true;
  }

  return false;
}

function isLikelyUrl(text: string) {
  const value = text.trim().toLowerCase();
  return (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("www.")
  );
}

function buildShareText(shareUrl: string, prompt: string) {
  return `${prompt || "Olha essa imagem criada com a Aurora IA"} ${shareUrl}`.trim();
}

function getWhatsappShareUrl(shareUrl: string, prompt: string) {
  const text = encodeURIComponent(buildShareText(shareUrl, prompt));
  return `https://wa.me/?text=${text}`;
}

function getFacebookShareUrl(shareUrl: string) {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    shareUrl
  )}`;
}

function getXShareUrl(shareUrl: string, prompt: string) {
  const text = encodeURIComponent(
    prompt || "Olha essa imagem criada com a Aurora IA"
  );
  const url = encodeURIComponent(shareUrl);
  return `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
}

function getTelegramShareUrl(shareUrl: string, prompt: string) {
  const text = encodeURIComponent(
    prompt || "Olha essa imagem criada com a Aurora IA"
  );
  const url = encodeURIComponent(shareUrl);
  return `https://t.me/share/url?url=${url}&text=${text}`;
}

function getLinkedInShareUrl(shareUrl: string) {
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    shareUrl
  )}`;
}

export default function ChatPage() {
  const searchParams = useSearchParams();

  const [input, setInput] = useState("");
  const [email, setEmail] = useState("ricardogrupoexecutivo1@gmail.com");
  const [plan, setPlan] = useState("total");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Olá! Eu sou a Aurora IA. Posso conversar com você ou gerar uma imagem.",
    },
  ]);
  const [generatedImage, setGeneratedImage] = useState("");
  const [generatedImageId, setGeneratedImageId] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [debugUrl, setDebugUrl] = useState("");
  const [loadingChat, setLoadingChat] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const selectedPlan = normalizePlan(searchParams.get("plan"));

    if (selectedPlan === "pro") {
      setPlan("pro");
      return;
    }

    if (selectedPlan === "influencer") {
      setPlan("influencer");
      return;
    }

    setPlan("free");
  }, [searchParams]);

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    if (generatedImageId) {
      return `${window.location.origin}/i/${generatedImageId}`;
    }
    return generatedImage;
  }, [generatedImage, generatedImageId]);

  function setTemporaryFeedback(message: string) {
    setFeedback(message);
    window.setTimeout(() => {
      setFeedback("");
    }, 2500);
  }

  async function generateImageFromPrompt(promptText: string) {
    const cleanText = promptText.trim();
    if (!cleanText || loadingChat || loadingImage) return;

    setMessages((prev) => [...prev, { role: "user", content: cleanText }]);
    setLoadingImage(true);

    try {
      const res = await fetch("/api/image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: cleanText,
          email,
          plan,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data?.error || "Erro ao gerar imagem.",
          },
        ]);
        setGeneratedImage("");
        setGeneratedImageId("");
        setGeneratedPrompt("");
        setDebugUrl("");
        return;
      }

      const finalImageUrl = data?.imageUrl || data?.image_url || "";
      const finalImageId = data?.imageId || "";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: finalImageUrl
            ? "Imagem gerada com sucesso."
            : "A imagem foi gerada, mas nenhuma URL foi retornada.",
        },
      ]);

      setGeneratedImage(finalImageUrl);
      setGeneratedImageId(finalImageId);
      setGeneratedPrompt(cleanText);
      setDebugUrl(finalImageUrl);
      setInput("");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro inesperado.";
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Erro: ${message}`,
        },
      ]);
      setGeneratedImage("");
      setGeneratedImageId("");
      setGeneratedPrompt("");
      setDebugUrl("");
    } finally {
      setLoadingImage(false);
    }
  }

  async function sendChatMessage(messageText: string) {
    const cleanText = messageText.trim();
    if (!cleanText || loadingChat || loadingImage) return;

    setMessages((prev) => [...prev, { role: "user", content: cleanText }]);
    setLoadingChat(true);

    try {
      if (isLikelyUrl(cleanText)) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Recebi um link. Para gerar uma nova imagem, descreva a imagem desejada no campo de texto e clique em Gerar imagem.",
          },
        ]);
        setInput("");
        return;
      }

      if (isImageRequest(cleanText)) {
        setLoadingChat(false);
        await generateImageFromPrompt(cleanText);
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Olá! Como posso ajudar você hoje?",
        },
      ]);

      setInput("");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro inesperado.";
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Erro: ${message}`,
        },
      ]);
    } finally {
      setLoadingChat(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await sendChatMessage(input);
  }

  async function handleGenerateImageClick() {
    const cleanText = input.trim();

    if (!cleanText) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Descreva a imagem no campo de texto e depois clique em Gerar imagem.",
        },
      ]);
      return;
    }

    if (isLikelyUrl(cleanText)) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Esse conteúdo parece ser um link. Cole uma descrição da imagem para gerar uma nova criação.",
        },
      ]);
      return;
    }

    await generateImageFromPrompt(cleanText);
  }

  async function handleShareCurrentImage() {
    if (!shareUrl) {
      setTemporaryFeedback("Gere uma imagem antes de compartilhar.");
      return;
    }

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Aurora IA",
          text: generatedPrompt || "Olha essa imagem criada com a Aurora IA",
          url: shareUrl,
        });
        return;
      }

      await navigator.clipboard.writeText(shareUrl);
      setTemporaryFeedback("Link da página pública copiado.");
    } catch {
      setTemporaryFeedback("Não foi possível compartilhar agora.");
    }
  }

  async function handleCopyCurrentImageLink() {
    if (!shareUrl) {
      setTemporaryFeedback("Gere uma imagem antes de copiar o link.");
      return;
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setTemporaryFeedback("Link copiado com sucesso.");
    } catch {
      setTemporaryFeedback("Não foi possível copiar o link.");
    }
  }

  const isBusy = loadingChat || loadingImage;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0b1020",
        color: "#ffffff",
        padding: 20,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ marginBottom: 20 }}>
          <Link href="/" style={{ color: "#9ecbff", textDecoration: "none" }}>
            Voltar
          </Link>
        </div>

        <h1 style={{ fontSize: 32, marginBottom: 8 }}>Aurora IA</h1>
        <p style={{ color: "#aab4d6", marginTop: 0 }}>
          Conversa inteligente e geração de imagens.
        </p>

        {feedback ? (
          <div
            style={{
              marginBottom: 16,
              background: "#16203d",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 12,
              padding: 12,
              color: "#dbe7ff",
            }}
          >
            {feedback}
          </div>
        ) : null}

        <div
          style={{
            background: "#121a33",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 16,
            padding: 16,
            marginBottom: 20,
          }}
        >
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", marginBottom: 6 }}>E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 6 }}>Plano</label>
            <input
              type="text"
              value={plan}
              onChange={(e) => setPlan(normalizePlan(e.target.value))}
              style={inputStyle}
            />
          </div>
        </div>

        <div
          style={{
            background: "#121a33",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 16,
            padding: 16,
            marginBottom: 20,
          }}
        >
          {messages.map((message, index) => (
            <div
              key={index}
              style={{
                marginBottom: 12,
                padding: 12,
                borderRadius: 12,
                background:
                  message.role === "user" ? "#1d2a52" : "#18213f",
              }}
            >
              <strong>{message.role === "user" ? "Você" : "Aurora"}:</strong>{" "}
              {message.content}
            </div>
          ))}

          {generatedImage ? (
            <div style={{ marginTop: 16 }}>
              <p style={{ marginBottom: 10 }}>Imagem gerada por IA</p>

              <div
                style={{
                  position: "relative",
                  width: "100%",
                  maxWidth: 640,
                }}
              >
                <img
                  src={generatedImage}
                  alt="Imagem gerada por IA"
                  style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: 14,
                    display: "block",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                />

                <div
                  style={{
                    position: "absolute",
                    top: "8%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "88%",
                    textAlign: "center",
                    fontWeight: 800,
                    fontSize: "clamp(18px, 3vw, 28px)",
                    color: "#ffffff",
                    textShadow:
                      "0 2px 6px rgba(0,0,0,0.85), 0 0 16px rgba(0,0,0,0.65)",
                    letterSpacing: 1,
                    lineHeight: 1.2,
                    wordBreak: "break-word",
                  }}
                >
                  RICARDOIAOFICIAL.COM
                </div>

                <div
                  style={{
                    position: "absolute",
                    bottom: "8%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "78%",
                    textAlign: "center",
                    fontWeight: 800,
                    fontSize: "clamp(18px, 3vw, 26px)",
                    color: "#00eaff",
                    textShadow:
                      "0 2px 6px rgba(0,0,0,0.9), 0 0 16px rgba(0,0,0,0.75)",
                    letterSpacing: 2,
                    lineHeight: 1.2,
                    wordBreak: "break-word",
                  }}
                >
                  AURORA IA
                </div>
              </div>

              {shareUrl ? (
                <div style={{ marginTop: 12, marginBottom: 8 }}>
                  <p style={{ marginBottom: 6, color: "#aab4d6" }}>
                    Página pública para compartilhar:
                  </p>
                  <a
                    href={shareUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "#7ec8ff", wordBreak: "break-all" }}
                  >
                    {shareUrl}
                  </a>
                </div>
              ) : null}

              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                  marginTop: 14,
                }}
              >
                <button
                  type="button"
                  onClick={handleShareCurrentImage}
                  style={shareButtonPrimary}
                >
                  Compartilhar
                </button>

                <a
                  href={
                    shareUrl
                      ? getWhatsappShareUrl(shareUrl, generatedPrompt)
                      : "#"
                  }
                  target="_blank"
                  rel="noreferrer"
                  style={shareLinkButton}
                >
                  WhatsApp
                </a>

                <a
                  href={shareUrl ? getFacebookShareUrl(shareUrl) : "#"}
                  target="_blank"
                  rel="noreferrer"
                  style={shareLinkButton}
                >
                  Facebook
                </a>

                <a
                  href={shareUrl ? getXShareUrl(shareUrl, generatedPrompt) : "#"}
                  target="_blank"
                  rel="noreferrer"
                  style={shareLinkButton}
                >
                  X
                </a>

                <a
                  href={
                    shareUrl
                      ? getTelegramShareUrl(shareUrl, generatedPrompt)
                      : "#"
                  }
                  target="_blank"
                  rel="noreferrer"
                  style={shareLinkButton}
                >
                  Telegram
                </a>

                <a
                  href={shareUrl ? getLinkedInShareUrl(shareUrl) : "#"}
                  target="_blank"
                  rel="noreferrer"
                  style={shareLinkButton}
                >
                  LinkedIn
                </a>

                <button
                  type="button"
                  onClick={handleCopyCurrentImageLink}
                  style={shareButtonSecondary}
                >
                  Copiar link
                </button>
              </div>
            </div>
          ) : null}

          {debugUrl ? (
            <div style={{ marginTop: 16, wordBreak: "break-all" }}>
              <p style={{ marginBottom: 6, color: "#aab4d6" }}>
                URL original da imagem:
              </p>
              <a
                href={debugUrl}
                target="_blank"
                rel="noreferrer"
                style={{ color: "#7ec8ff" }}
              >
                {debugUrl}
              </a>
            </div>
          ) : null}
        </div>

        <form onSubmit={handleSubmit}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua mensagem ou descreva a imagem que deseja..."
            rows={4}
            style={{
              width: "100%",
              padding: 14,
              borderRadius: 14,
              border: "1px solid #2b3558",
              background: "#0f1730",
              color: "#fff",
              resize: "vertical",
              marginBottom: 12,
            }}
          />

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button
              type="submit"
              disabled={isBusy}
              style={{
                padding: "12px 18px",
                borderRadius: 10,
                border: "none",
                background: "#2b7fff",
                color: "#fff",
                cursor: isBusy ? "not-allowed" : "pointer",
                opacity: isBusy ? 0.7 : 1,
              }}
            >
              {loadingChat ? "Enviando..." : "Enviar mensagem"}
            </button>

            <button
              type="button"
              onClick={handleGenerateImageClick}
              disabled={isBusy}
              style={{
                padding: "12px 18px",
                borderRadius: 10,
                border: "1px solid #2b3558",
                background: "#16203d",
                color: "#fff",
                cursor: isBusy ? "not-allowed" : "pointer",
                opacity: isBusy ? 0.7 : 1,
              }}
            >
              {loadingImage ? "Gerando..." : "Gerar imagem"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: 12,
  borderRadius: 10,
  border: "1px solid #2b3558",
  background: "#0f1730",
  color: "#fff",
};

const shareButtonPrimary: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: 10,
  border: "none",
  background: "#2b7fff",
  color: "#fff",
  cursor: "pointer",
  fontSize: 14,
};

const shareButtonSecondary: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #2b3558",
  background: "#16203d",
  color: "#fff",
  cursor: "pointer",
  fontSize: 14,
};

const shareLinkButton: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #2b3558",
  background: "#16203d",
  color: "#fff",
  cursor: "pointer",
  fontSize: 14,
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
};