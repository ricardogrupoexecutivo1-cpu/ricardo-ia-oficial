"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type ExploreImage = {
  id: string;
  prompt: string | null;
  image_url: string | null;
  created_at: string | null;
};

function buildShareText(shareUrl: string, prompt: string) {
  return `${prompt || "Olha essa imagem criada com a Aurora IA"} ${shareUrl}`.trim();
}

function getWhatsappShareUrl(shareUrl: string, prompt: string) {
  const text = encodeURIComponent(buildShareText(shareUrl, prompt));
  return `https://wa.me/?text=${text}`;
}

function getFacebookShareUrl(shareUrl: string) {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
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
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
}

export default function ExplorarPage() {
  const [images, setImages] = useState<ExploreImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    let active = true;

    async function loadImages() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("/api/explore", {
          cache: "no-store",
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error || "Erro ao carregar imagens públicas.");
        }

        if (active) {
          setImages(Array.isArray(data?.images) ? data.images : []);
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Erro ao carregar imagens.";
        if (active) {
          setError(message);
          setImages([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadImages();

    return () => {
      active = false;
    };
  }, []);

  function setTemporaryFeedback(message: string) {
    setFeedback(message);
    window.setTimeout(() => {
      setFeedback("");
    }, 2500);
  }

  function buildPublicShareUrl(id: string) {
    return `${window.location.origin}/i/${id}`;
  }

  async function handleNativeShare(image: ExploreImage) {
    const shareUrl = buildPublicShareUrl(image.id);
    const text = image.prompt || "Imagem criada com a Aurora IA";

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Aurora IA",
          text,
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

  async function handleCopyLink(imageId: string) {
    const shareUrl = buildPublicShareUrl(imageId);

    try {
      await navigator.clipboard.writeText(shareUrl);
      setTemporaryFeedback("Link copiado com sucesso.");
    } catch {
      setTemporaryFeedback("Não foi possível copiar o link.");
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0b1020",
        color: "#fff",
        padding: 20,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ marginBottom: 20 }}>
          <Link href="/" style={{ color: "#9ecbff", textDecoration: "none" }}>
            Voltar
          </Link>
        </div>

        <h1 style={{ fontSize: 32, marginBottom: 8 }}>Imagens públicas</h1>
        <p style={{ color: "#aab4d6", marginTop: 0 }}>
          Explore e compartilhe as imagens geradas publicamente na Aurora IA.
        </p>

        {feedback ? (
          <div
            style={{
              marginTop: 12,
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

        {loading ? (
          <div
            style={{
              background: "#121a33",
              borderRadius: 16,
              padding: 20,
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            Carregando imagens...
          </div>
        ) : error ? (
          <div
            style={{
              background: "#121a33",
              borderRadius: 16,
              padding: 20,
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#ffb3b3",
            }}
          >
            Erro: {error}
          </div>
        ) : images.length === 0 ? (
          <div
            style={{
              background: "#121a33",
              borderRadius: 16,
              padding: 20,
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            Nenhuma imagem pública encontrada.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 20,
              marginTop: 24,
            }}
          >
            {images.map((image) => {
              const imageUrl = image.image_url || "";
              const prompt = image.prompt || "Imagem criada com a Aurora IA";
              const shareUrl = buildPublicShareUrl(image.id);

              return (
                <article
                  key={image.id}
                  style={{
                    background: "#121a33",
                    borderRadius: 16,
                    overflow: "hidden",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={prompt}
                      style={{
                        width: "100%",
                        aspectRatio: "1 / 1",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        aspectRatio: "1 / 1",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "#0f1730",
                        color: "#aab4d6",
                      }}
                    >
                      Imagem indisponível
                    </div>
                  )}

                  <div style={{ padding: 14 }}>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 14,
                        lineHeight: 1.5,
                        color: "#e6ebff",
                        minHeight: 44,
                      }}
                    >
                      {image.prompt || "Sem prompt informado."}
                    </p>

                    <p
                      style={{
                        marginTop: 10,
                        marginBottom: 10,
                        fontSize: 12,
                        color: "#93a0c9",
                      }}
                    >
                      {image.created_at
                        ? new Date(image.created_at).toLocaleString("pt-BR")
                        : "Data não disponível"}
                    </p>

                    <a
                      href={shareUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: "block",
                        color: "#7ec8ff",
                        fontSize: 12,
                        wordBreak: "break-all",
                        marginBottom: 14,
                        textDecoration: "none",
                      }}
                    >
                      {shareUrl}
                    </a>

                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        flexWrap: "wrap",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => handleNativeShare(image)}
                        style={shareButtonPrimary}
                      >
                        Compartilhar
                      </button>

                      <a
                        href={getWhatsappShareUrl(shareUrl, prompt)}
                        target="_blank"
                        rel="noreferrer"
                        style={shareLinkButton}
                      >
                        WhatsApp
                      </a>

                      <a
                        href={getFacebookShareUrl(shareUrl)}
                        target="_blank"
                        rel="noreferrer"
                        style={shareLinkButton}
                      >
                        Facebook
                      </a>

                      <a
                        href={getXShareUrl(shareUrl, prompt)}
                        target="_blank"
                        rel="noreferrer"
                        style={shareLinkButton}
                      >
                        X
                      </a>

                      <a
                        href={getTelegramShareUrl(shareUrl, prompt)}
                        target="_blank"
                        rel="noreferrer"
                        style={shareLinkButton}
                      >
                        Telegram
                      </a>

                      <a
                        href={getLinkedInShareUrl(shareUrl)}
                        target="_blank"
                        rel="noreferrer"
                        style={shareLinkButton}
                      >
                        LinkedIn
                      </a>

                      <button
                        type="button"
                        onClick={() => handleCopyLink(image.id)}
                        style={shareButtonSecondary}
                      >
                        Copiar link
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

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