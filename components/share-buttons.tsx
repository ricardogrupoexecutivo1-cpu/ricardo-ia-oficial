"use client";

import { useMemo, useState } from "react";

type ShareButtonsProps = {
  title?: string;
  text?: string;
  url?: string;
  className?: string;
};

function normalizeUrl(url?: string) {
  if (!url) {
    if (typeof window !== "undefined") return window.location.href;
    return "https://ricardoiaoficial.com";
  }

  if (url.startsWith("http://") || url.startsWith("https://")) return url;

  return `https://ricardoiaoficial.com${url.startsWith("/") ? url : `/${url}`}`;
}

function buttonStyle(primary?: boolean): React.CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 42,
    padding: "10px 14px",
    borderRadius: 999,
    border: primary
      ? "1px solid rgba(16,185,129,0.28)"
      : "1px solid rgba(255,255,255,0.12)",
    background: primary ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.05)",
    color: "#f8fafc",
    fontSize: 13,
    fontWeight: 700,
    textDecoration: "none",
    cursor: "pointer",
    whiteSpace: "nowrap",
  };
}

export default function ShareButtons({
  title = "Aurora IA",
  text = "Veja isso na Aurora IA",
  url,
  className,
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = useMemo(() => normalizeUrl(url), [url]);
  const shareText = `${text} ${shareUrl}`.trim();

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    shareUrl
  )}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    shareUrl
  )}`;
  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    text
  )}&url=${encodeURIComponent(shareUrl)}`;

  async function handleNativeShare() {
    if (typeof navigator === "undefined" || !navigator.share) return;

    try {
      await navigator.share({
        title,
        text,
        url: shareUrl,
      });
    } catch {
      //
    }
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      //
    }
  }

  const canUseNativeShare =
    typeof navigator !== "undefined" && typeof navigator.share === "function";

  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 10,
      }}
    >
      {canUseNativeShare && (
        <button type="button" onClick={handleNativeShare} style={buttonStyle(true)}>
          Compartilhar
        </button>
      )}

      <a href={whatsappUrl} target="_blank" rel="noreferrer" style={buttonStyle()}>
        WhatsApp
      </a>

      <a href={facebookUrl} target="_blank" rel="noreferrer" style={buttonStyle()}>
        Facebook
      </a>

      <a href={linkedinUrl} target="_blank" rel="noreferrer" style={buttonStyle()}>
        LinkedIn
      </a>

      <a href={xUrl} target="_blank" rel="noreferrer" style={buttonStyle()}>
        X
      </a>

      <button type="button" onClick={handleCopyLink} style={buttonStyle()}>
        {copied ? "Link copiado" : "Copiar link"}
      </button>
    </div>
  );
}