"use client";

import { track } from "@vercel/analytics";

type Primitive = string | number | boolean | null | undefined;
type EventProperties = Record<string, Primitive>;

export function trackEvent(
  name: string,
  properties?: EventProperties
) {
  try {
    track(name, properties);
  } catch (error) {
    console.warn("Analytics error:", error);
  }
}

// =========================
// CHAT
// =========================

export function trackChatOpened(...args: any[]) {
  const [source] = args;

  trackEvent("chat_opened", {
    source,
  });
}

export function trackChatMessageSent(...args: any[]) {
  const [source, hasEmail, length] = args;

  trackEvent("chat_message_sent", {
    source,
    hasEmail,
    length,
  });
}

// =========================
// IMAGENS
// =========================

export function trackImageGenerationRequested(...args: any[]) {
  const [source, hasEmail, length] = args;

  trackEvent("image_generation_requested", {
    source,
    hasEmail,
    length,
  });
}

export function trackImageGenerationSucceeded(...args: any[]) {
  const [source] = args;

  trackEvent("image_generation_succeeded", {
    source,
  });
}

export function trackImageGenerationFailed(...args: any[]) {
  const [error, source] = args;

  trackEvent("image_generation_failed", {
    error,
    source,
  });
}

// =========================
// REFERRAL
// =========================

export function trackReferralLinkCopied(...args: any[]) {
  const [source] = args;

  trackEvent("referral_link_copied", {
    source,
  });
}