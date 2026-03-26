"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
};

export default function PwaInstallButton() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone ===
        true;

    setIsStandalone(standalone);

    const ua = window.navigator.userAgent.toLowerCase();
    const iphone = /iphone|ipad|ipod/.test(ua);
    const safari =
      /safari/.test(ua) && !/chrome|crios|fxios|edgios|android/.test(ua);

    setIsIos(iphone && safari);

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    const onAppInstalled = () => {
      setInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  async function handleInstall() {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;

    if (choice.outcome === "accepted") {
      setInstalled(true);
    }

    setDeferredPrompt(null);
  }

  if (isStandalone || installed) return null;

  if (deferredPrompt) {
    return (
      <button
        type="button"
        onClick={handleInstall}
        style={{
          position: "fixed",
          left: 16,
          bottom: 140,
          zIndex: 9999,
          border: "1px solid rgba(126,231,184,0.35)",
          background: "linear-gradient(135deg, #22c55e, #86efac)",
          color: "#04110a",
          borderRadius: 999,
          padding: "14px 18px",
          fontWeight: 900,
          fontSize: 14,
          boxShadow: "0 16px 40px rgba(0,0,0,0.35)",
          cursor: "pointer",
        }}
      >
        📲 Instalar Aurora IA
      </button>
    );
  }

  if (isIos) {
    return (
      <div
        style={{
          position: "fixed",
          left: 16,
          bottom: 140,
          zIndex: 9999,
          maxWidth: 320,
          border: "1px solid rgba(255,255,255,0.10)",
          background: "rgba(7,17,26,0.92)",
          color: "#eef6ff",
          borderRadius: 18,
          padding: 14,
          boxShadow: "0 16px 40px rgba(0,0,0,0.35)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div
          style={{
            fontSize: 12,
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: 1,
            color: "#7ee7b8",
            marginBottom: 8,
          }}
        >
          Instalar no iPhone
        </div>

        <div
          style={{
            fontSize: 13,
            lineHeight: 1.55,
            color: "rgba(238,246,255,0.82)",
          }}
        >
          Toque em <strong>Compartilhar</strong> no Safari e depois em{" "}
          <strong>Adicionar à Tela de Início</strong>.
        </div>
      </div>
    );
  }

  return null;
}