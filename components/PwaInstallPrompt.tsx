"use client";

import { useEffect, useState } from "react";

export default function PwaInstallPrompt() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const alreadyDismissed = sessionStorage.getItem("aurora_pwa_prompt_closed");

    if (alreadyDismissed === "1") {
      return;
    }

    setVisible(true);

    const timer = window.setTimeout(() => {
      handleClose();
    }, 7000);

    return () => window.clearTimeout(timer);
  }, []);

  function handleClose() {
    setVisible(false);
    sessionStorage.setItem("aurora_pwa_prompt_closed", "1");
  }

  if (!visible) return null;

  return (
    <div style={wrapper}>
      <div style={content}>
        <div style={textWrap}>
          <div style={title}>📲 Baixe a Aurora no seu celular</div>
          <div style={subtitle}>Install Aurora on your mobile device</div>
        </div>

        <button type="button" onClick={handleClose} style={closeButton}>
          ✕
        </button>
      </div>
    </div>
  );
}

const wrapper = {
  position: "fixed" as const,
  left: 16,
  right: 16,
  bottom: 16,
  zIndex: 9999,
  display: "flex",
  justifyContent: "center",
  pointerEvents: "none" as const,
};

const content = {
  width: "100%",
  maxWidth: 520,
  background: "#12182b",
  border: "1px solid rgba(255,255,255,0.10)",
  borderRadius: 16,
  padding: "12px 14px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  boxShadow: "0 18px 40px rgba(0,0,0,0.35)",
  pointerEvents: "auto" as const,
};

const textWrap = {
  minWidth: 0,
};

const title = {
  fontSize: 13,
  fontWeight: 700,
  color: "#ffffff",
  lineHeight: 1.4,
};

const subtitle = {
  fontSize: 11,
  opacity: 0.68,
  color: "#ffffff",
  lineHeight: 1.4,
};

const closeButton = {
  width: 34,
  height: 34,
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.04)",
  color: "#ffffff",
  cursor: "pointer",
  flexShrink: 0,
};