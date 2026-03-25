"use client";

import { useEffect, useState } from "react";

export default function PwaInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  async function handleInstall() {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    const choice = await deferredPrompt.userChoice;

    if (choice.outcome === "accepted") {
      console.log("App instalado 🚀");
    }

    setDeferredPrompt(null);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <button
      onClick={handleInstall}
      style={{
        position: "fixed",
        bottom: 90,
        left: 16,
        zIndex: 9999,
        padding: "14px 18px",
        borderRadius: 999,
        background: "linear-gradient(135deg, #22c55e, #86efac)",
        color: "#04110a",
        fontWeight: 800,
        border: "none",
        boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
        cursor: "pointer",
      }}
    >
      📲 Instalar Aurora IA
    </button>
  );
}