"use client";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

function safeGtag(...args: unknown[]) {
  if (typeof window === "undefined") return;

  try {
    if (typeof window.gtag === "function") {
      window.gtag(...args);
      return;
    }

    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push(args);
    }
  } catch (error) {
    console.error("Erro no analytics:", error);
  }
}

function safeEvent(eventName: string, params?: Record<string, unknown>) {
  safeGtag("event", eventName, params || {});
}

export function trackChatOpened(origin = "chat-page") {
  safeEvent("chat_opened", { origin });
}

export function trackChatMessageSent(
  origin = "chat-page",
  hasEmail = false,
  messageLength = 0
) {
  safeEvent("chat_message_sent", {
    origin,
    has_email: hasEmail,
    message_length: messageLength,
  });
}

export function trackImageGenerationRequested(
  origin = "chat-page",
  hasEmail = false,
  promptLength = 0
) {
  safeEvent("image_generation_requested", {
    origin,
    has_email: hasEmail,
    prompt_length: promptLength,
  });
}

export function trackImageGenerationSucceeded(
  origin = "chat-page",
  provider = "unknown"
) {
  safeEvent("image_generation_succeeded", {
    origin,
    provider,
  });
}

export function trackImageGenerationFailed(
  origin = "chat-page",
  reason = "unknown"
) {
  safeEvent("image_generation_failed", {
    origin,
    reason,
  });
}

export function trackReferralLinkCopied(origin = "chat-page") {
  safeEvent("referral_link_copied", { origin });
}

export function trackCadastroBasicoClick(origin = "unknown") {
  safeEvent("cadastro_basico_click", { origin });
}

export function trackCadastroGeralSaved(origin = "cadastro-geral") {
  safeEvent("cadastro_geral_saved", { origin });
}

export function trackSegmentClick(segment = "unknown", origin = "home") {
  safeEvent("segment_click", {
    segment,
    origin,
  });
}

export function trackBankPartnerClick(origin = "home") {
  safeEvent("bank_partner_click", { origin });
}

export function trackChatCtaClick(origin = "home") {
  safeEvent("chat_cta_click", { origin });
}