"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type ExploreImage = {
  id: string;
  prompt: string | null;
  image_url: string | null;
  created_at: string | null;
  email?: string | null;
};

type ExploreApiResponse = {
  images?: ExploreImage[];
  error?: string;
};

function formatPrompt(prompt: string | null) {
  const text = (prompt || "Imagem criada por IA").trim();
  return text || "Imagem criada por IA";
}

export default function ExplorePage() {
  const [images, setImages] = useState<ExploreImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadImages() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/explorar", {
          cache: "no-store",
        });

        const data = (await response.json()) as ExploreApiResponse;

        if (!response.ok) {
          setError(data?.error || "Erro ao carregar imagens.");
          setImages([]);
          return;
        }

        setImages(Array.isArray(data?.images) ? data.images : []);
      } catch (err) {
        console.error(err);
        setError("Erro inesperado ao carregar a galeria.");
        setImages([]);
      } finally {
        setLoading(false);
      }
    }

    loadImages();
  }, []);

  return (
    <main className="aurora-page">
      <section className="chat-hero-section">
        <div className="site-shell">
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <header className="sidebar-card sidebar-card-highlight">
              <div className="hero-badge">Aurora IA</div>

              <h1
                style={{
                  margin: "14px 0 10px",
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  lineHeight: 1.08,
                }}
              >
                Explorar imagens públicas
              </h1>

              <p className="mini-text" style={{ maxWidth: 760 }}>
                Descubra imagens criadas na Aurora IA com visual premium,
                leitura confortável e padrão visual consistente com o restante da plataforma.
              </p>

              <div className="sidebar-actions" style={{ marginTop: 18 }}>
                <Link href="/chat" className="btn btn-primary">
                  Criar nova imagem
                </Link>
                <Link href="/" className="btn btn-secondary">
                  Home
                </Link>
              </div>
            </header>

            {loading && (
              <section className="sidebar-card">
                <p className="mini-text">Carregando galeria...</p>
              </section>
            )}

            {!loading && error && (
              <section className="sidebar-card">
                <p style={{ color: "#ff8b8b", fontWeight: 700 }}>{error}</p>
              </section>
            )}

            {!loading && !error && images.length === 0 && (
              <section className="sidebar-card">
                <p className="mini-text">
                  Ainda não há imagens públicas para exibir.
                </p>
              </section>
            )}

            {!loading && !error && images.length > 0 && (
              <section className="sidebar-card">
                <div
                  style={{
                    display: "grid",
                    gap: 16,
                    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                  }}
                >
                  {images.map((image) => (
                    <Link
                      key={image.id}
                      href={`/i/${image.id}`}
                      className="feature-card"
                      style={{
                        display: "block",
                        overflow: "hidden",
                        padding: 14,
                      }}
                    >
                      <div
                        style={{
                          aspectRatio: "1 / 1",
                          overflow: "hidden",
                          borderRadius: 18,
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid rgba(92, 255, 170, 0.14)",
                        }}
                      >
                        <img
                          src={image.image_url || ""}
                          alt={formatPrompt(image.prompt)}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                      </div>

                      <div
                        style={{
                          marginTop: 12,
                          padding: 12,
                          borderRadius: 16,
                          background: "rgba(4, 10, 9, 0.82)",
                          border: "1px solid rgba(92, 255, 170, 0.12)",
                        }}
                      >
                        <p
                          style={{
                            margin: 0,
                            fontSize: 14,
                            lineHeight: 1.6,
                            color: "#e8fff2",
                          }}
                        >
                          {formatPrompt(image.prompt)}
                        </p>

                        <p
                          style={{
                            margin: "8px 0 0",
                            fontSize: 11,
                            color: "#8fb3a7",
                          }}
                        >
                          ID: {image.id}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}