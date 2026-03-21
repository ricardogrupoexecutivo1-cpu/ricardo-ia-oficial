"use client";

import Link from "next/link";
import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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

type UploadResponse = {
  publicUrl?: string;
  path?: string;
  fileName?: string;
  contentType?: string;
  size?: number;
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

  const [referenceImageUrl, setReferenceImageUrl] = useState<string | null>(null);
  const [referenceImageName, setReferenceImageName] = useState<string | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedPreviewUrl, setSelectedPreviewUrl] = useState<string | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Olá! Eu sou a Aurora IA. Posso conversar com você, criar campanhas, sugerir ideias de negócio e gerar imagens.",
    },
  ]);

  const endRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  useEffect(() => {
    const savedEmail = window.localStorage.getItem("aurora-user-email");
    if (savedEmail) {
      setUserEmail(savedEmail);
    }

    const savedReferenceImageUrl = window.localStorage.getItem(
      "aurora-reference-image-url"
    );
    const savedReferenceImageName = window.localStorage.getItem(
      "aurora-reference-image-name"
    );

    if (savedReferenceImageUrl) {
      setReferenceImageUrl(savedReferenceImageUrl);
    }

    if (savedReferenceImageName) {
      setReferenceImageName(savedReferenceImageName);
    }
  }, []);

  useEffect(() => {
    if (!userEmail.trim()) return;

    window.localStorage.setItem(
      "aurora-user-email",
      userEmail.trim().toLowerCase()
    );
  }, [userEmail]);

  useEffect(() => {
    if (referenceImageUrl) {
      window.localStorage.setItem(
        "aurora-reference-image-url",
        referenceImageUrl
      );
    } else {
      window.localStorage.removeItem("aurora-reference-image-url");
    }

    if (referenceImageName) {
      window.localStorage.setItem(
        "aurora-reference-image-name",
        referenceImageName
      );
    } else {
      window.localStorage.removeItem("aurora-reference-image-name");
    }
  }, [referenceImageUrl, referenceImageName]);

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

  const headerPlanLabel = useMemo(() => formatPlanLabel(plan), [plan]);
  const headerPlanStatusLabel = useMemo(
    () => formatPlanStatus(planStatus),
    [planStatus]
  );

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
          referenceImageUrl,
          referenceImageName,
        }),
      });

      let data: ChatApiResponse = {};
      try {
        data = (await response.json()) as ChatApiResponse;
      } catch {
        data = {};
      }

      if (!response.ok || data.error) {
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

  function handleOpenFilePicker() {
    fileInputRef.current?.click();
  }

  function handleOpenCamera() {
    cameraInputRef.current?.click();
  }

  function handleIncomingFile(file: File | null) {
    setUploadError(null);
    setSelectedFile(file);

    if (!file) {
      setSelectedPreviewUrl(null);
      return;
    }

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setSelectedFile(null);
      setSelectedPreviewUrl(null);
      setUploadError("Formato inválido. Use PNG, JPG ou WEBP.");
      return;
    }

    const maxSizeInBytes = 10 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      setSelectedFile(null);
      setSelectedPreviewUrl(null);
      setUploadError("Arquivo muito grande. Limite de 10MB.");
      return;
    }

    const preview = URL.createObjectURL(file);
    setSelectedPreviewUrl(preview);
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] || null;
    handleIncomingFile(file);
  }

  function handleCameraChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] || null;
    handleIncomingFile(file);
  }

  async function handleUploadReferenceImage() {
    if (!selectedFile) {
      setUploadError("Selecione uma imagem antes de enviar.");
      return;
    }

    try {
      setUploadLoading(true);
      setUploadError(null);

      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const rawText = await response.text();

      let data: UploadResponse | null = null;
      try {
        data = rawText ? (JSON.parse(rawText) as UploadResponse) : null;
      } catch {
        data = null;
      }

      if (!response.ok || data?.error) {
        setUploadError(
          data?.error || rawText || `Erro no upload. Status ${response.status}.`
        );
        return;
      }

      if (!data?.publicUrl) {
        setUploadError("Upload concluído sem URL pública.");
        return;
      }

      setReferenceImageUrl(data.publicUrl);
      setReferenceImageName(data.fileName || selectedFile.name || "imagem-enviada");
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : "Erro inesperado no upload."
      );
    } finally {
      setUploadLoading(false);
    }
  }

  function handleClearReferenceImage() {
    setSelectedFile(null);
    setSelectedPreviewUrl(null);
    setReferenceImageUrl(null);
    setReferenceImageName(null);
    setUploadError(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    if (cameraInputRef.current) {
      cameraInputRef.current.value = "";
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

        <section
          style={{
            marginTop: 16,
            display: "grid",
            gap: 14,
            border: "2px solid rgba(0,255,170,0.24)",
            borderRadius: 20,
            padding: 16,
            background: "rgba(6,18,16,0.88)",
          }}
        >
          <div style={{ display: "grid", gap: 6 }}>
            <div style={{ fontSize: 18, fontWeight: 800 }}>
              📸 Enviar imagem para usar no chat
            </div>

            <div
              style={{
                fontSize: 14,
                opacity: 0.85,
                lineHeight: 1.5,
              }}
            >
              Envie uma imagem pronta ou tire uma foto agora para a Aurora criar
              campanhas com base visual.
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp,image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleCameraChange}
            style={{ display: "none" }}
          />

          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <button
              type="button"
              onClick={handleOpenFilePicker}
              style={{
                border: "1px solid rgba(0,255,170,0.22)",
                borderRadius: 12,
                padding: "12px 16px",
                fontWeight: 800,
                cursor: "pointer",
                background: "rgba(0,255,170,0.10)",
                color: "inherit",
              }}
            >
              Selecionar imagem
            </button>

            <button
              type="button"
              onClick={handleOpenCamera}
              style={{
                border: "1px solid rgba(255,255,255,0.16)",
                borderRadius: 12,
                padding: "12px 16px",
                fontWeight: 800,
                cursor: "pointer",
                background: "rgba(255,255,255,0.05)",
                color: "inherit",
              }}
            >
              Tirar foto
            </button>

            <button
              type="button"
              onClick={handleUploadReferenceImage}
              disabled={uploadLoading}
              style={{
                border: "none",
                borderRadius: 12,
                padding: "12px 16px",
                fontWeight: 800,
                cursor: uploadLoading ? "not-allowed" : "pointer",
                opacity: uploadLoading ? 0.7 : 1,
              }}
            >
              {uploadLoading ? "Enviando..." : "Usar imagem no chat"}
            </button>

            <button
              type="button"
              onClick={handleClearReferenceImage}
              disabled={uploadLoading}
              style={{
                borderRadius: 12,
                padding: "12px 16px",
                fontWeight: 700,
                cursor: uploadLoading ? "not-allowed" : "pointer",
                border: "1px solid rgba(255,255,255,0.14)",
                background: "transparent",
                color: "inherit",
                opacity: uploadLoading ? 0.7 : 1,
              }}
            >
              Limpar
            </button>
          </div>

          <div
            style={{
              fontSize: 14,
              opacity: selectedFile ? 0.95 : 0.7,
              wordBreak: "break-word",
            }}
          >
            {selectedFile ? selectedFile.name : "Nenhuma imagem selecionada"}
          </div>

          {selectedPreviewUrl ? (
            <div
              style={{
                borderRadius: 16,
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.10)",
                background: "rgba(0,0,0,0.2)",
              }}
            >
              <img
                src={selectedPreviewUrl}
                alt="Pré-visualização da imagem"
                style={{
                  display: "block",
                  width: "100%",
                  maxHeight: 320,
                  objectFit: "contain",
                }}
              />
            </div>
          ) : null}

          {uploadError ? (
            <div
              style={{
                borderRadius: 12,
                padding: 12,
                background: "rgba(255,0,0,0.10)",
                border: "1px solid rgba(255,0,0,0.18)",
                fontSize: 14,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {uploadError}
            </div>
          ) : null}

          {referenceImageUrl ? (
            <div
              style={{
                width: "100%",
                border: "1px solid rgba(0,255,170,0.16)",
                borderRadius: 18,
                padding: 14,
                background: "rgba(0,255,170,0.06)",
                display: "grid",
                gap: 12,
              }}
            >
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 800,
                }}
              >
                Imagem de referência ativa
              </div>

              <div
                style={{
                  fontSize: 13,
                  opacity: 0.82,
                  lineHeight: 1.5,
                }}
              >
                A Aurora vai usar essa imagem como base para campanhas,
                identidade visual, anúncios, criativos e ideias de marketing.
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "140px 1fr",
                  gap: 14,
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    borderRadius: 14,
                    overflow: "hidden",
                    border: "1px solid rgba(255,255,255,0.10)",
                    background: "rgba(0,0,0,0.18)",
                  }}
                >
                  <img
                    src={referenceImageUrl}
                    alt={referenceImageName || "Imagem de referência"}
                    style={{
                      display: "block",
                      width: "100%",
                      height: 140,
                      objectFit: "cover",
                    }}
                  />
                </div>

                <div style={{ display: "grid", gap: 8 }}>
                  <div style={{ fontSize: 14 }}>
                    <strong>Arquivo:</strong> {referenceImageName || "Imagem enviada"}
                  </div>

                  <div
                    style={{
                      fontSize: 13,
                      opacity: 0.82,
                      lineHeight: 1.5,
                      wordBreak: "break-word",
                    }}
                  >
                    <strong>URL:</strong> {referenceImageUrl}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
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
            <p>
              {referenceImageUrl
                ? "Imagem de referência ativa para apoiar campanhas e criação visual."
                : planHint}
            </p>
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