"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type ExploreItem = {
  id: string;
  prompt: string;
  image_url: string;
  created_at?: string | null;
  email?: string | null;
};

type ExploreResponse = {
  ok: boolean;
  items?: ExploreItem[];
  total?: number;
  generatedAt?: string;
  error?: string;
};

function formatDate(value?: string | null) {
  if (!value) return "Agora há pouco";

  try {
    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return "Agora há pouco";
  }
}

function getShareUrl(id: string) {
  if (typeof window === "undefined") return `/i/${id}`;
  return `${window.location.origin}/i/${id}`;
}

export default function ExplorarPage() {
  const [items, setItems] = useState<ExploreItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadImages = useCallback(async (silent = false) => {
    try {
      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(null);

      const response = await fetch(`/api/explorar?limit=30&t=${Date.now()}`, {
        method: "GET",
        cache: "no-store",
        headers: {
          "Cache-Control": "no-store",
          Pragma: "no-cache",
        },
      });

      const data = (await response.json()) as ExploreResponse;

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Não foi possível carregar a galeria.");
      }

      setItems(Array.isArray(data.items) ? data.items : []);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao carregar a galeria.";
      setError(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadImages(false);

    const interval = window.setInterval(() => {
      loadImages(true);
    }, 30000);

    return () => {
      window.clearInterval(interval);
    };
  }, [loadImages]);

  const hasItems = items.length > 0;

  const statsText = useMemo(() => {
    if (loading) return "Carregando imagens recentes...";
    if (!hasItems) return "Nenhuma imagem pública encontrada no momento.";
    return `${items.length} imagens carregadas sem cache.`;
  }, [hasItems, items.length, loading]);

  async function handleNativeShare(item: ExploreItem) {
    const shareUrl = getShareUrl(item.id);
    const shareTitle = "Aurora IA";
    const shareText = item.prompt || "Imagem criada na Aurora IA";

    try {
      if (navigator.share) {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        return;
      }

      await navigator.clipboard.writeText(shareUrl);
      alert("Link copiado com sucesso.");
    } catch (err) {
      console.error("Aurora IA: erro ao compartilhar.", err);
    }
  }

  function openWhatsApp(item: ExploreItem) {
    const shareUrl = getShareUrl(item.id);
    const text = encodeURIComponent(
      `${item.prompt || "Veja esta imagem criada na Aurora IA"} ${shareUrl}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank", "noopener,noreferrer");
  }

  function openFacebook(item: ExploreItem) {
    const shareUrl = encodeURIComponent(getShareUrl(item.id));
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  function openX(item: ExploreItem) {
    const shareUrl = encodeURIComponent(getShareUrl(item.id));
    const text = encodeURIComponent(item.prompt || "Imagem criada na Aurora IA");
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${shareUrl}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  function openLinkedIn(item: ExploreItem) {
    const shareUrl = encodeURIComponent(getShareUrl(item.id));
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(0,255,140,0.08), transparent 28%), #07111a",
        color: "#e8eef7",
        padding: "24px 16px 64px",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "grid",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(8,16,24,0.88)",
              borderRadius: 24,
              padding: 20,
              boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 12,
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 12,
                    letterSpacing: 1.2,
                    textTransform: "uppercase",
                    color: "#7ee7b8",
                    fontWeight: 700,
                  }}
                >
                  Aurora IA Explorar
                </p>

                <h1
                  style={{
                    margin: "8px 0 10px",
                    fontSize: "clamp(28px, 4vw, 46px)",
                    lineHeight: 1.05,
                  }}
                >
                  Últimas imagens públicas da plataforma
                </h1>

                <p
                  style={{
                    margin: 0,
                    maxWidth: 760,
                    color: "rgba(232,238,247,0.78)",
                    lineHeight: 1.6,
                  }}
                >
                  Galeria atualizada sem cache pesado, com foco em mostrar as
                  imagens mais recentes e facilitar compartilhamento. Estamos em
                  constante atualização e pode haver momentos de instabilidade.
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap",
                }}
              >
                <button
                  type="button"
                  onClick={() => loadImages(true)}
                  disabled={refreshing}
                  style={{
                    border: "1px solid rgba(126,231,184,0.35)",
                    background: "rgba(126,231,184,0.12)",
                    color: "#dfffee",
                    borderRadius: 14,
                    padding: "12px 16px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {refreshing ? "Atualizando..." : "Atualizar agora"}
                </button>

                <Link
                  href="/chat"
                  style={{
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "rgba(255,255,255,0.04)",
                    color: "#ffffff",
                    borderRadius: 14,
                    padding: "12px 16px",
                    fontWeight: 700,
                    textDecoration: "none",
                  }}
                >
                  Abrir Aurora
                </Link>
              </div>
            </div>

            <div
              style={{
                marginTop: 16,
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                color: "rgba(232,238,247,0.72)",
                fontSize: 14,
              }}
            >
              <span>{statsText}</span>
              <span>•</span>
              <span>Sem cache</span>
              <span>•</span>
              <span>Foco mobile</span>
            </div>

            {error ? (
              <div
                style={{
                  marginTop: 16,
                  borderRadius: 16,
                  padding: 14,
                  border: "1px solid rgba(255,120,120,0.35)",
                  background: "rgba(255,80,80,0.10)",
                  color: "#ffd7d7",
                }}
              >
                {error}
              </div>
            ) : null}
          </div>
        </div>

        {loading ? (
          <div
            style={{
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(8,16,24,0.88)",
              borderRadius: 24,
              padding: 24,
            }}
          >
            Carregando galeria...
          </div>
        ) : !hasItems ? (
          <div
            style={{
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(8,16,24,0.88)",
              borderRadius: 24,
              padding: 24,
            }}
          >
            Nenhuma imagem pública encontrada ainda.
          </div>
        ) : (
          <section
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 18,
            }}
          >
            {items.map((item) => {
              const shareUrl = getShareUrl(item.id);

              return (
                <article
                  key={item.id}
                  style={{
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "rgba(8,16,24,0.92)",
                    borderRadius: 24,
                    overflow: "hidden",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.28)",
                  }}
                >
                  <Link
                    href={`/i/${item.id}`}
                    style={{
                      display: "block",
                      position: "relative",
                      width: "100%",
                      aspectRatio: "1 / 1",
                      background: "#0c1722",
                    }}
                  >
                    <Image
                      src={item.image_url}
                      alt={item.prompt || "Imagem Aurora IA"}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 100vw, 33vw"
                      style={{
                        objectFit: "cover",
                      }}
                    />
                  </Link>

                  <div
                    style={{
                      padding: 16,
                      display: "grid",
                      gap: 12,
                    }}
                  >
                    <div>
                      <p
                        style={{
                          margin: 0,
                          color: "#7ee7b8",
                          fontSize: 12,
                          fontWeight: 800,
                          textTransform: "uppercase",
                          letterSpacing: 1,
                        }}
                      >
                        Aurora IA
                      </p>

                      <h2
                        style={{
                          margin: "8px 0 8px",
                          fontSize: 18,
                          lineHeight: 1.35,
                        }}
                      >
                        {item.prompt || "Imagem criada na plataforma"}
                      </h2>

                      <p
                        style={{
                          margin: 0,
                          fontSize: 13,
                          color: "rgba(232,238,247,0.68)",
                        }}
                      >
                        {formatDate(item.created_at)}
                      </p>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gap: 10,
                      }}
                    >
                      <Link
                        href={`/i/${item.id}`}
                        style={{
                          textDecoration: "none",
                          textAlign: "center",
                          borderRadius: 14,
                          padding: "12px 14px",
                          fontWeight: 800,
                          background: "linear-gradient(135deg, #16a34a, #22c55e)",
                          color: "#04110a",
                        }}
                      >
                        Ver imagem pública
                      </Link>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                          gap: 10,
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => handleNativeShare(item)}
                          style={buttonStyle}
                        >
                          Compartilhar
                        </button>

                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              await navigator.clipboard.writeText(shareUrl);
                              alert("Link copiado com sucesso.");
                            } catch (err) {
                              console.error("Erro ao copiar link:", err);
                            }
                          }}
                          style={buttonStyle}
                        >
                          Copiar link
                        </button>

                        <button
                          type="button"
                          onClick={() => openWhatsApp(item)}
                          style={buttonStyle}
                        >
                          WhatsApp
                        </button>

                        <button
                          type="button"
                          onClick={() => openFacebook(item)}
                          style={buttonStyle}
                        >
                          Facebook
                        </button>

                        <button
                          type="button"
                          onClick={() => openX(item)}
                          style={buttonStyle}
                        >
                          X / Twitter
                        </button>

                        <button
                          type="button"
                          onClick={() => openLinkedIn(item)}
                          style={buttonStyle}
                        >
                          LinkedIn
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}

const buttonStyle: React.CSSProperties = {
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.04)",
  color: "#eef6ff",
  borderRadius: 14,
  padding: "12px 10px",
  fontWeight: 700,
  cursor: "pointer",
};