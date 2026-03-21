"use client";

type ChatImageReferenceProps = {
  imageUrl: string | null;
  fileName?: string | null;
  onRemove?: () => void;
};

export default function ChatImageReference({
  imageUrl,
  fileName,
  onRemove,
}: ChatImageReferenceProps) {
  if (!imageUrl) {
    return null;
  }

  return (
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
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "grid", gap: 4 }}>
          <div
            style={{
              fontSize: 14,
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
            A Aurora pode usar essa imagem como base para campanhas, identidade visual,
            anúncios, criativos e ideias de marketing.
          </div>
        </div>

        {onRemove ? (
          <button
            type="button"
            onClick={onRemove}
            style={{
              borderRadius: 12,
              padding: "10px 14px",
              border: "1px solid rgba(255,255,255,0.14)",
              background: "transparent",
              color: "inherit",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Remover imagem
          </button>
        ) : null}
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
            src={imageUrl}
            alt={fileName || "Imagem de referência"}
            style={{
              display: "block",
              width: "100%",
              height: 140,
              objectFit: "cover",
            }}
          />
        </div>

        <div
          style={{
            display: "grid",
            gap: 8,
          }}
        >
          <div style={{ fontSize: 14 }}>
            <strong>Arquivo:</strong> {fileName || "Imagem enviada"}
          </div>

          <div
            style={{
              fontSize: 13,
              opacity: 0.82,
              lineHeight: 1.5,
              wordBreak: "break-word",
            }}
          >
            <strong>URL:</strong> {imageUrl}
          </div>
        </div>
      </div>
    </div>
  );
}