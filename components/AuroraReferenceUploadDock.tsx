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
      setMessage("Selecione uma imagem válida.");
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
        throw new Error("Upload ok, mas sem URL.");
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
      setMessage("Imagem ativa com sucesso.");
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
        bottom: 60, // 🔥 ajuste fino aqui
        zIndex: 9999,
        width: "min(320px, calc(100vw - 32px))",
      }}
    >
      <div
        style={{
          borderRadius: 18,
          border: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(5,10,16,0.85)",
          boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
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
            padding: 12,
            cursor: "pointer",
            fontWeight: 800,
            fontSize: 13,
          }}
        >
          <span style={{ display: "flex", gap: 8 }}>
            🖼️ Imagem / logo
          </span>
          <span style={{ fontSize: 11 }}>
            {expanded ? "Fechar" : "Abrir"}
          </span>
        </button>

        {expanded && (
          <div style={{ padding: 12 }}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelected}
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              style={primaryButton}
            >
              {uploading ? "Enviando..." : "Subir imagem"}
            </button>

            {currentRef && (
              <button onClick={removeReference} style={secondaryButton}>
                Remover
              </button>
            )}

            {message && <p style={{ fontSize: 12 }}>{message}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

const primaryButton: React.CSSProperties = {
  marginTop: 8,
  padding: 10,
  borderRadius: 10,
  background: "#22c55e",
  border: "none",
  color: "#04110a",
  fontWeight: 800,
  cursor: "pointer",
};

const secondaryButton: React.CSSProperties = {
  marginTop: 8,
  padding: 10,
  borderRadius: 10,
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "#fff",
  fontWeight: 800,
  cursor: "pointer",
};