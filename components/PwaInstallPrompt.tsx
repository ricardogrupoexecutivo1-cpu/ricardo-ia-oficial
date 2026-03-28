"use client";

import { useEffect, useMemo, useState } from "react";

type BeforeInstallPromptEventLike = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

function isIosLike() {
  if (typeof window === "undefined") return false;

  const ua = window.navigator.userAgent || "";
  const platform = window.navigator.platform || "";

  const iOSDevice = /iPhone|iPad|iPod/i.test(ua);
  const iPadOSDesktopMode =
    platform === "MacIntel" && typeof navigator !== "undefined" && navigator.maxTouchPoints > 1;

  return iOSDevice || iPadOSDesktopMode;
}

function isStandaloneDisplayMode() {
  if (typeof window === "undefined") return false;

  const viaMediaQuery = window.matchMedia?.("(display-mode: standalone)")?.matches;
  const viaNavigatorStandalone =
    "standalone" in window.navigator &&
    Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone);

  return Boolean(viaMediaQuery || viaNavigatorStandalone);
}

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEventLike | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [showIosHelp, setShowIosHelp] = useState(false);

  const ios = useMemo(() => isIosLike(), []);
  const standalone = useMemo(() => isStandaloneDisplayMode(), []);

  useEffect(() => {
    setIsInstalled(standalone);

    function onBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEventLike);
    }

    function onAppInstalled() {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setShowIosHelp(false);
    }

    function onVisibilityOrPageShow() {
      if (isStandaloneDisplayMode()) {
        setIsInstalled(true);
        setDeferredPrompt(null);
        setShowIosHelp(false);
      }
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);
    window.addEventListener("pageshow", onVisibilityOrPageShow);
    document.addEventListener("visibilitychange", onVisibilityOrPageShow);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
      window.removeEventListener("pageshow", onVisibilityOrPageShow);
      document.removeEventListener("visibilitychange", onVisibilityOrPageShow);
    };
  }, [standalone]);

  async function handleInstall() {
    if (ios) {
      setShowIosHelp(true);
      return;
    }

    if (!deferredPrompt) {
      return;
    }

    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;

      if (choice.outcome === "accepted") {
        setIsInstalled(true);
      }

      setDeferredPrompt(null);
    } catch {
      // mantém silencioso para não atrapalhar a experiência
    }
  }

  if (isInstalled || dismissed) {
    return null;
  }

  const canShowBanner = ios || Boolean(deferredPrompt);

  if (!canShowBanner) {
    return null;
  }

  return (
    <>
      <div
        style={{
          position: "fixed",
          left: 12,
          right: 12,
          bottom: 12,
          zIndex: 9999,
          borderRadius: 20,
          border: "1px solid rgba(255,255,255,0.12)",
          background:
            "linear-gradient(180deg, rgba(7,12,28,0.96), rgba(4,9,20,0.98))",
          boxShadow: "0 18px 50px rgba(0,0,0,0.35)",
          padding: 14,
          color: "#eef6ff",
          backdropFilter: "blur(12px)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 10px",
                borderRadius: 999,
                background: "rgba(34,197,94,0.10)",
                border: "1px solid rgba(34,197,94,0.20)",
                color: "#b9f7cf",
                fontSize: 12,
                fontWeight: 800,
                marginBottom: 10,
              }}
            >
              <span>📲</span>
              <span>Instalar app</span>
            </div>

            <div
              style={{
                fontSize: 18,
                fontWeight: 900,
                lineHeight: 1.15,
                marginBottom: 8,
              }}
            >
              Instale a Aurora IA no seu celular
            </div>

            <div
              style={{
                color: "#cbd5e1",
                fontSize: 14,
                lineHeight: 1.6,
              }}
            >
              {ios
                ? "No iPhone/iPad, toque abaixo para ver como adicionar o app à tela inicial."
                : "Toque no botão para instalar agora e usar como aplicativo."}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label="Fechar aviso de instalação"
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.10)",
              background: "rgba(255,255,255,0.04)",
              color: "#eef6ff",
              cursor: "pointer",
              flexShrink: 0,
              fontSize: 18,
              fontWeight: 800,
            }}
          >
            ×
          </button>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            marginTop: 14,
          }}
        >
          <button
            type="button"
            onClick={handleInstall}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 46,
              padding: "0 16px",
              borderRadius: 14,
              border: "none",
              cursor: "pointer",
              fontWeight: 900,
              fontSize: 15,
              color: "#04110a",
              background: "linear-gradient(135deg, #22c55e, #86efac)",
              boxShadow: "0 16px 40px rgba(34,197,94,0.24)",
            }}
          >
            {ios ? "Ver como instalar no iPhone" : "Instalar aplicativo"}
          </button>

          <button
            type="button"
            onClick={() => setDismissed(true)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 46,
              padding: "0 16px",
              borderRadius: 14,
              border: "1px solid rgba(148,163,184,0.28)",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: 15,
              color: "#e5e7eb",
              background: "rgba(15,23,42,0.62)",
            }}
          >
            Agora não
          </button>
        </div>
      </div>

      {showIosHelp ? (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 10000,
            background: "rgba(2,6,23,0.78)",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            padding: 12,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 520,
              borderRadius: 24,
              border: "1px solid rgba(255,255,255,0.12)",
              background:
                "linear-gradient(180deg, rgba(7,12,28,0.98), rgba(4,9,20,0.99))",
              boxShadow: "0 20px 60px rgba(0,0,0,0.40)",
              padding: 18,
              color: "#eef6ff",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 10px",
                borderRadius: 999,
                background: "rgba(59,130,246,0.12)",
                border: "1px solid rgba(59,130,246,0.22)",
                color: "#bfdbfe",
                fontSize: 12,
                fontWeight: 800,
                marginBottom: 12,
              }}
            >
              <span>🍎</span>
              <span>Instalação no iPhone / iPad</span>
            </div>

            <div
              style={{
                fontSize: 22,
                lineHeight: 1.08,
                fontWeight: 900,
                marginBottom: 12,
              }}
            >
              Adicione a Aurora IA à tela inicial
            </div>

            <div
              style={{
                display: "grid",
                gap: 10,
                color: "#d5e5f7",
                lineHeight: 1.7,
                fontSize: 15,
              }}
            >
              <div style={stepStyle}>
                <strong>1.</strong> Toque no botão <strong>Compartilhar</strong> do navegador.
              </div>
              <div style={stepStyle}>
                <strong>2.</strong> Procure a opção <strong>Adicionar à Tela de Início</strong>.
              </div>
              <div style={stepStyle}>
                <strong>3.</strong> Confirme para instalar e abrir como aplicativo.
              </div>
            </div>

            <div
              style={{
                marginTop: 14,
                padding: 14,
                borderRadius: 16,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#cbd5e1",
                fontSize: 14,
                lineHeight: 1.65,
              }}
            >
              Depois de instalar, a Aurora IA pode abrir em tela cheia como app.
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
                marginTop: 16,
              }}
            >
              <button
                type="button"
                onClick={() => setShowIosHelp(false)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 46,
                  padding: "0 16px",
                  borderRadius: 14,
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 900,
                  fontSize: 15,
                  color: "#04110a",
                  background: "linear-gradient(135deg, #22c55e, #86efac)",
                }}
              >
                Entendi
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowIosHelp(false);
                  setDismissed(true);
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 46,
                  padding: "0 16px",
                  borderRadius: 14,
                  border: "1px solid rgba(148,163,184,0.28)",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: 15,
                  color: "#e5e7eb",
                  background: "rgba(15,23,42,0.62)",
                }}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

const stepStyle: React.CSSProperties = {
  borderRadius: 14,
  padding: "12px 14px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
};