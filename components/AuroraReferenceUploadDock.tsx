"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";

type UploadedReference = {
  name: string;
  url: string;
  type: "image" | "logo";
  mimeType?: string;
  savedAt: string;
};

type UploadApiResponse =
  | {
      ok?: boolean;
      url?: string;
      imageUrl?: string;
      publicUrl?: string;
      fileUrl?: string;
      path?: string;
      error?: string;
    }
  | Record<string, unknown>;

const STORAGE_KEY = "aurora_active_reference";
const EVENT_NAME = "aurora-reference-updated";

function isImageFile(file: File) {
  return file.type.startsWith("image/");
}

function inferReferenceType(fileName: string): "image" | "logo" {
  const value = fileName.toLowerCase();

  if (
    value.includes("logo") ||
    value.includes("marca") ||
    value.includes("logomarca")
  ) {
    return "logo";
  }

  return "image";
}

function normalizeUploadUrl(data: UploadApiResponse): string {
  const candidates = [
    typeof data.url === "string" ? data.url : "",
    typeof data.imageUrl === "string" ? data.imageUrl : "",
    typeof data.publicUrl === "string" ? data.publicUrl : "",
    typeof data.fileUrl === "string" ? data.fileUrl : "",
    typeof data.path === "string" ? data.path : "",
  ].filter(Boolean);

  return candidates[0] || "";
}

export default function AuroraReferenceUploadDock() {
  const pathname = usePathname();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [currentRef, setCurrentRef] = useState<UploadedReference | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [expanded, setExpanded] = useState(false);

  const isVisible = useMemo(() => {
    return pathname === "/chat" || pathname === "/" || pathname === "/editor";
  }, [pathname]);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved) as UploadedReference;
        if (parsed?.url) {
          setCurrentRef(parsed);
        }
      }
    } catch (error) {
      console.error("Aurora IA: erro ao ler referência ativa.", error);
    }
  }, []);

  function persistReference(nextRef: UploadedReference | null) {
    try {
      if (!nextRef) {
        window.localStorage.removeItem(STORAGE_KEY);
      } else {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextRef));
      }

      window.dispatchEvent(
        new CustomEvent(EVENT_NAME, {
          detail: nextRef,
        })
      );
    } catch (error) {
      console.error("Aurora IA: erro ao salvar referência ativa.", error);
    }
  }

  async function handleFileSelected(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!isImageFile(file)) {
      setMessage("Selecione uma imagem válida para usar como referência.");
      return;
    }

    setUploading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", inferReferenceType(file.name));

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        cache: "no-store",
      });

      const data = (await response.json()) as UploadApiResponse;

      if (!response.ok) {
        throw new Error(
          typeof data.error === "string"
            ? data.error
            : "Falha ao enviar imagem."
        );
      }

      const url = normalizeUploadUrl(data);

      if (!url) {
        throw new Error("Upload concluído, mas a URL não foi retornada.");
      }

      const uploadedRef: UploadedReference = {
        name: file.name,
        url,
        type: inferReferenceType(file.name),
        mimeType: file.type,
        savedAt: new Date().toISOString(),
      };

      setCurrentRef(uploadedRef);
      persistReference(uploadedRef);
      setMessage("Imagem de referência ativa com sucesso.");
      setExpanded(true);
    } catch (error) {
      const text =
        error instanceof Error ? error.message : "Erro ao subir imagem.";
      setMessage(text);
    } finally {
      setUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  function removeReference() {
    setCurrentRef(null);
    persistReference(null);
    setMessage("Referência removida.");
  }

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: "fixed",
        right: 16,
        bottom: 76,
        zIndex: 9999,
        width: "min(360px, calc(100vw - 32px))",
      }}
    >
      <div
        style={{
          borderRadius: 20,
          border: "1px solid rgba(255,255,255,0.10)",
          background: "rgba(5,10,16,0.92)",
          boxShadow: "0 18px 48px rgba(0,0,0,0.34)",
          backdropFilter: "blur(10px)",
          overflow: "hidden",
        }}
      >
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          style={{
            width: "100%",
            border: "none",
            background: "transparent",
            color: "#eef6ff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            padding: 14,
            cursor: "pointer",
            fontWeight: 800,
            fontSize: 14,
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span aria-hidden="true">🖼️</span>
            <span>Imagem própria / logomarca</span>
          </span>

          <span
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.72)",
            }}
          >
            {expanded ? "Fechar" : "Abrir"}
          </span>
        </button>

        {expanded ? (
          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.08)",
              padding: 14,
              display: "grid",
              gap: 12,
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 12,
                lineHeight: 1.5,
                color: "rgba(235,242,250,0.78)",
              }}
            >
              Suba sua imagem, arte ou logomarca para usar como referência em
              campanhas, criativos e geração visual.
            </p>

            <div
              style={{
                display: "grid",
                gap: 10,
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/jpg"
                onChange={handleFileSelected}
                style={{
                  color: "#eef6ff",
                  fontSize: 13,
                }}
              />

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: currentRef ? "1fr 1fr" : "1fr",
                  gap: 10,
                }}
              >
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  style={primaryButton}
                >
                  {uploading ? "Enviando..." : "Subir imagem / logo"}
                </button>

                {currentRef ? (
                  <button
                    type="button"
                    onClick={removeReference}
                    style={secondaryButton}
                  >
                    Remover referência
                  </button>
                ) : null}
              </div>
            </div>

            {currentRef ? (
              <div
                style={{
                  borderRadius: 16,
                  border: "1px solid rgba(126,231,184,0.25)",
                  background: "rgba(126,231,184,0.08)",
                  padding: 12,
                  display: "grid",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 800,
                    color: "#7ee7b8",
                    textTransform: "uppercase",
                    letterSpacing: 1,
                  }}
                >
                  Referência ativa
                </div>

                <div
                  style={{
                    display: "grid",
                    gap: 6,
                    color: "#eef6ff",
                    fontSize: 13,
                  }}
                >
                  <div>
                    <strong>Arquivo:</strong> {currentRef.name}
                  </div>
                  <div>
                    <strong>Tipo:</strong>{" "}
                    {currentRef.type === "logo" ? "Logomarca" : "Imagem"}
                  </div>
                </div>

                <a
                  href={currentRef.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    textDecoration: "none",
                    color: "#04110a",
                    background: "linear-gradient(135deg, #22c55e, #86efac)",
                    padding: "10px 12px",
                    borderRadius: 12,
                    fontWeight: 800,
                    textAlign: "center",
                  }}
                >
                  Ver referência enviada
                </a>
              </div>
            ) : null}

            {message ? (
              <div
                style={{
                  borderRadius: 14,
                  padding: 12,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#eef6ff",
                  fontSize: 12,
                  lineHeight: 1.5,
                }}
              >
                {message}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

const primaryButton: React.CSSProperties = {
  border: "1px solid rgba(126,231,184,0.35)",
  background: "rgba(126,231,184,0.14)",
  color: "#eefcf5",
  borderRadius: 12,
  padding: "12px 14px",
  fontWeight: 800,
  cursor: "pointer",
};

const secondaryButton: React.CSSProperties = {
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.05)",
  color: "#f5fbff",
  borderRadius: 12,
  padding: "12px 14px",
  fontWeight: 800,
  cursor: "pointer",
};