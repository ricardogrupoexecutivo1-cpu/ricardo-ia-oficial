"use client";

import { ChangeEvent, useMemo, useRef, useState } from "react";

type UploadImageProps = {
  label?: string;
  buttonText?: string;
  helpText?: string;
  onUploaded?: (result: {
    publicUrl: string;
    path?: string;
    fileName?: string;
    contentType?: string;
    size?: number;
  }) => void;
};

type UploadState = {
  loading: boolean;
  error: string | null;
  publicUrl: string | null;
  fileName: string | null;
  path: string | null;
  contentType: string | null;
  size: number | null;
};

export default function UploadImage({
  label = "Enviar imagem ou logo",
  buttonText = "Fazer upload",
  helpText = "PNG, JPG ou WEBP até 10MB.",
  onUploaded,
}: UploadImageProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [state, setState] = useState<UploadState>({
    loading: false,
    error: null,
    publicUrl: null,
    fileName: null,
    path: null,
    contentType: null,
    size: null,
  });

  const prettySize = useMemo(() => {
    const size = state.size ?? selectedFile?.size ?? null;
    if (!size) return null;
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  }, [state.size, selectedFile]);

  function handleOpenPicker() {
    inputRef.current?.click();
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] || null;

    setState((prev) => ({
      ...prev,
      error: null,
      publicUrl: null,
      fileName: null,
      path: null,
      contentType: null,
      size: null,
    }));

    setSelectedFile(file);

    if (!file) {
      setPreviewUrl(null);
      return;
    }

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setSelectedFile(null);
      setPreviewUrl(null);
      setState((prev) => ({
        ...prev,
        error: "Formato inválido. Use PNG, JPG ou WEBP.",
      }));
      return;
    }

    const maxSizeInBytes = 10 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      setSelectedFile(null);
      setPreviewUrl(null);
      setState((prev) => ({
        ...prev,
        error: "Arquivo muito grande. Limite de 10MB.",
      }));
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  }

  async function handleUpload() {
    if (!selectedFile) {
      setState((prev) => ({
        ...prev,
        error: "Selecione uma imagem antes de enviar.",
      }));
      return;
    }

    try {
      setState((prev) => ({
        ...prev,
        loading: true,
        error: null,
      }));

      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const rawText = await response.text();

      let data: any = null;
      try {
        data = rawText ? JSON.parse(rawText) : null;
      } catch {
        data = null;
      }

      if (!response.ok) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error:
            data?.error ||
            rawText ||
            `Erro no upload. Status ${response.status}.`,
        }));
        return;
      }

      if (!data) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: `Resposta não veio em JSON. Retorno bruto: ${rawText}`,
        }));
        return;
      }

      const nextState: UploadState = {
        loading: false,
        error: null,
        publicUrl: data.publicUrl || null,
        fileName: data.fileName || selectedFile.name || null,
        path: data.path || null,
        contentType: data.contentType || selectedFile.type || null,
        size: typeof data.size === "number" ? data.size : selectedFile.size,
      };

      setState(nextState);

      if (onUploaded && data?.publicUrl) {
        onUploaded({
          publicUrl: data.publicUrl,
          path: data.path,
          fileName: data.fileName || selectedFile.name,
          contentType: data.contentType || selectedFile.type,
          size: typeof data.size === "number" ? data.size : selectedFile.size,
        });
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro inesperado no upload.";

      setState((prev) => ({
        ...prev,
        loading: false,
        error: message,
      }));
    }
  }

  function handleClear() {
    setSelectedFile(null);
    setPreviewUrl(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    setState({
      loading: false,
      error: null,
      publicUrl: null,
      fileName: null,
      path: null,
      contentType: null,
      size: null,
    });
  }

  return (
    <div
      style={{
        width: "100%",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 18,
        padding: 16,
        background: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div style={{ display: "grid", gap: 12 }}>
        <div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              marginBottom: 6,
            }}
          >
            {label}
          </div>

          <div
            style={{
              fontSize: 13,
              opacity: 0.78,
              lineHeight: 1.5,
            }}
          >
            {helpText}
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          onChange={handleFileChange}
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
            onClick={handleOpenPicker}
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

          <div
            style={{
              fontSize: 14,
              opacity: selectedFile ? 0.95 : 0.7,
              wordBreak: "break-word",
            }}
          >
            {selectedFile ? selectedFile.name : "Nenhuma imagem selecionada"}
          </div>
        </div>

        {selectedFile ? (
          <div
            style={{
              borderRadius: 12,
              padding: 12,
              border: "1px solid rgba(255,255,255,0.10)",
              background: "rgba(255,255,255,0.03)",
              fontSize: 14,
              lineHeight: 1.6,
            }}
          >
            <div>
              <strong>Arquivo:</strong> {selectedFile.name}
            </div>
            <div>
              <strong>Tipo:</strong> {selectedFile.type}
            </div>
            <div>
              <strong>Tamanho:</strong> {prettySize}
            </div>
          </div>
        ) : null}

        {previewUrl ? (
          <div
            style={{
              borderRadius: 16,
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(0,0,0,0.2)",
            }}
          >
            <img
              src={previewUrl}
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

        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            onClick={handleUpload}
            disabled={state.loading}
            style={{
              border: "none",
              borderRadius: 12,
              padding: "12px 16px",
              fontWeight: 800,
              cursor: state.loading ? "not-allowed" : "pointer",
              opacity: state.loading ? 0.7 : 1,
            }}
          >
            {state.loading ? "Enviando..." : buttonText}
          </button>

          <button
            type="button"
            onClick={handleClear}
            disabled={state.loading}
            style={{
              borderRadius: 12,
              padding: "12px 16px",
              fontWeight: 700,
              cursor: state.loading ? "not-allowed" : "pointer",
              border: "1px solid rgba(255,255,255,0.14)",
              background: "transparent",
              color: "inherit",
              opacity: state.loading ? 0.7 : 1,
            }}
          >
            Limpar
          </button>
        </div>

        {state.error ? (
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
            {state.error}
          </div>
        ) : null}

        {state.publicUrl ? (
          <div
            style={{
              display: "grid",
              gap: 8,
              borderRadius: 12,
              padding: 12,
              background: "rgba(0,255,140,0.08)",
              border: "1px solid rgba(0,255,140,0.18)",
            }}
          >
            <div style={{ fontWeight: 700 }}>Upload concluído</div>

            <div style={{ fontSize: 14, opacity: 0.9 }}>
              <strong>Arquivo:</strong> {state.fileName}
            </div>

            <div style={{ fontSize: 14, opacity: 0.9 }}>
              <strong>Tipo:</strong> {state.contentType}
            </div>

            <div style={{ fontSize: 14, opacity: 0.9 }}>
              <strong>Tamanho:</strong> {prettySize}
            </div>

            <div style={{ fontSize: 14, opacity: 0.9, wordBreak: "break-all" }}>
              <strong>URL pública:</strong> {state.publicUrl}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}