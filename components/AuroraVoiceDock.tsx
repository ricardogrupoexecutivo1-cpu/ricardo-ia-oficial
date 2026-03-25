"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";

type SupportedLocale = "pt-BR" | "en-US" | "es-ES";

const STORAGE_KEY_ENABLED = "aurora_voice_enabled";
const STORAGE_KEY_LOCALE = "aurora_locale";

function getPreferredSpeechLocale(): SupportedLocale {
  if (typeof window === "undefined") return "pt-BR";

  const saved = window.localStorage.getItem(STORAGE_KEY_LOCALE)?.toLowerCase();

  if (saved?.startsWith("en")) return "en-US";
  if (saved?.startsWith("es")) return "es-ES";
  return "pt-BR";
}

function normalizeText(text: string) {
  return text
    .replace(/\s+/g, " ")
    .replace(/copiar link/gi, "")
    .replace(/whatsapp/gi, "")
    .replace(/facebook/gi, "")
    .replace(/linkedin/gi, "")
    .replace(/telegram/gi, "")
    .replace(/x\s*\/?\s*twitter/gi, "")
    .replace(/ver imagem/gi, "")
    .replace(/página pública pronta para compartilhar e divulgar\./gi, "")
    .trim();
}

function findLatestAssistantMessage(): string {
  if (typeof document === "undefined") return "";

  const selectors = [
    ".aurora-chat-app__message--assistant",
    '[data-role="assistant"]',
    '[data-message-role="assistant"]',
    ".message--assistant",
    ".assistant-message",
  ];

  for (const selector of selectors) {
    const nodes = Array.from(document.querySelectorAll(selector));
    const lastNode = nodes[nodes.length - 1] as HTMLElement | undefined;

    if (!lastNode) continue;

    const cloned = lastNode.cloneNode(true) as HTMLElement;

    const removableSelectors = [
      "button",
      "a",
      "svg",
      "img",
      "video",
      "audio",
      "script",
      "style",
      ".aurora-chat-app__messageMeta",
      ".aurora-chat-app__imageActions",
      ".aurora-chat-app__imageButtons",
    ];

    removableSelectors.forEach((item) => {
      cloned.querySelectorAll(item).forEach((el) => el.remove());
    });

    const text = normalizeText(cloned.innerText || cloned.textContent || "");
    if (text) return text;
  }

  const fallbackArticles = Array.from(document.querySelectorAll("article"));
  const assistantArticles = fallbackArticles.filter((node) => {
    const text = (node.textContent || "").toLowerCase();
    return text.includes("aurora ia");
  });

  const lastArticle = assistantArticles[assistantArticles.length - 1] as
    | HTMLElement
    | undefined;

  if (!lastArticle) return "";

  const cloned = lastArticle.cloneNode(true) as HTMLElement;
  cloned
    .querySelectorAll("button,a,svg,img,video,audio,script,style")
    .forEach((el) => el.remove());

  return normalizeText(cloned.innerText || cloned.textContent || "");
}

function chooseVoice(locale: SupportedLocale): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return null;
  }

  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  const exact = voices.find(
    (voice) => voice.lang.toLowerCase() === locale.toLowerCase()
  );
  if (exact) return exact;

  const broad = voices.find((voice) =>
    voice.lang.toLowerCase().startsWith(locale.slice(0, 2).toLowerCase())
  );
  if (broad) return broad;

  return voices[0] || null;
}

export default function AuroraVoiceDock() {
  const pathname = usePathname();
  const [enabled, setEnabled] = useState(false);
  const [supported, setSupported] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [voicesReady, setVoicesReady] = useState(false);
  const lastSpokenRef = useRef("");
  const observerRef = useRef<MutationObserver | null>(null);

  const isChatPage = useMemo(() => pathname === "/chat", [pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hasSpeech =
      "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
    setSupported(hasSpeech);

    try {
      const saved = window.localStorage.getItem(STORAGE_KEY_ENABLED);
      setEnabled(saved === "true");
    } catch {
      setEnabled(false);
    }

    if (!hasSpeech) return;

    const markVoicesReady = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setVoicesReady(true);
      }
    };

    markVoicesReady();

    window.speechSynthesis.onvoiceschanged = () => {
      markVoicesReady();
    };

    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = (text: string) => {
    if (!supported || !text) return;

    const clean = normalizeText(text);
    if (!clean) return;

    try {
      window.speechSynthesis.cancel();

      const locale = getPreferredSpeechLocale();
      const utterance = new SpeechSynthesisUtterance(clean);
      const selectedVoice = chooseVoice(locale);

      utterance.lang = locale;
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);

      lastSpokenRef.current = clean;
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error("Aurora IA: erro ao falar resposta.", error);
      setSpeaking(false);
    }
  };

  useEffect(() => {
    if (!isChatPage || !supported) return;

    const listenForNewMessages = () => {
      const latest = findLatestAssistantMessage();

      if (!latest) return;
      if (latest === lastSpokenRef.current) return;
      if (!enabled) return;

      speak(latest);
    };

    const bootTimer = window.setTimeout(() => {
      listenForNewMessages();
    }, 1200);

    observerRef.current?.disconnect();

    const observer = new MutationObserver(() => {
      const latest = findLatestAssistantMessage();

      if (!latest) return;
      if (latest === lastSpokenRef.current) return;
      if (!enabled) return;

      speak(latest);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    observerRef.current = observer;

    return () => {
      window.clearTimeout(bootTimer);
      observer.disconnect();
    };
  }, [enabled, isChatPage, supported, voicesReady]);

  useEffect(() => {
    const onLanguageChange = () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        setSpeaking(false);
      }
    };

    window.addEventListener(
      "aurora-language-change",
      onLanguageChange as EventListener
    );

    return () => {
      window.removeEventListener(
        "aurora-language-change",
        onLanguageChange as EventListener
      );
    };
  }, []);

  if (!isChatPage) return null;

  return (
    <div
      style={{
        position: "fixed",
        left: 16,
        bottom: 76,
        zIndex: 9999,
        display: "grid",
        gap: 10,
        maxWidth: 320,
      }}
    >
      <div
        style={{
          background: "rgba(5,10,16,0.88)",
          border: "1px solid rgba(255,255,255,0.10)",
          borderRadius: 18,
          padding: 14,
          boxShadow: "0 18px 48px rgba(0,0,0,0.34)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 10,
            marginBottom: 10,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: 1,
                color: "#7ee7b8",
              }}
            >
              Aurora Voice
            </div>

            <div
              style={{
                fontSize: 13,
                color: "rgba(235,242,250,0.86)",
                marginTop: 4,
              }}
            >
              Respostas faladas no chat
            </div>
          </div>

          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: speaking ? "#7ee7b8" : "rgba(235,242,250,0.7)",
            }}
          >
            {speaking ? "Falando..." : enabled ? "Ativo" : "Parado"}
          </div>
        </div>

        {!supported ? (
          <div
            style={{
              fontSize: 12,
              lineHeight: 1.5,
              color: "#ffd7d7",
              background: "rgba(255,80,80,0.10)",
              border: "1px solid rgba(255,120,120,0.28)",
              borderRadius: 12,
              padding: 10,
            }}
          >
            Voz do navegador não disponível neste dispositivo.
          </div>
        ) : (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
              }}
            >
              <button
                type="button"
                onClick={() => {
                  const next = !enabled;
                  setEnabled(next);

                  try {
                    window.localStorage.setItem(
                      STORAGE_KEY_ENABLED,
                      String(next)
                    );
                  } catch (error) {
                    console.error("Aurora IA: erro salvando voz ativa.", error);
                  }

                  if (!next && "speechSynthesis" in window) {
                    window.speechSynthesis.cancel();
                    setSpeaking(false);
                  }
                }}
                style={buttonPrimary}
              >
                {enabled ? "Desativar voz" : "Ativar voz"}
              </button>

              <button
                type="button"
                onClick={() => {
                  const latest = findLatestAssistantMessage();
                  if (latest) speak(latest);
                }}
                style={buttonSecondary}
              >
                Ler última
              </button>
            </div>

            <p
              style={{
                margin: "10px 0 0",
                fontSize: 12,
                lineHeight: 1.45,
                color: "rgba(235,242,250,0.75)",
              }}
            >
              A Aurora pode falar automaticamente a resposta mais recente.
              Microfone entra no próximo passo.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

const buttonPrimary: React.CSSProperties = {
  border: "1px solid rgba(126,231,184,0.35)",
  background: "rgba(126,231,184,0.14)",
  color: "#eefcf5",
  borderRadius: 12,
  padding: "10px 12px",
  fontWeight: 800,
  cursor: "pointer",
};

const buttonSecondary: React.CSSProperties = {
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.05)",
  color: "#f5fbff",
  borderRadius: 12,
  padding: "10px 12px",
  fontWeight: 800,
  cursor: "pointer",
};