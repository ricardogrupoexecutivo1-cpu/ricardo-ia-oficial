"use client";

import { track } from "@vercel/analytics";

type Primitive = string | number | boolean | null | undefined;
type EventProperties = Record<string, Primitive>;
type SafeEventProperties = Record<string, string | number | boolean>;

export const ANALYTICS_EVENTS = {
  PLAN_VIEWED: "Plan Viewed",
  PLAN_CTA_CLICKED: "Plan CTA Clicked",
  CHECKOUT_STARTED: "Checkout Started",
  CHAT_OPENED: "Chat Opened",
  CHAT_MESSAGE_SENT: "Chat Message Sent",
  IMAGE_PROMPT_STARTED: "Image Prompt Started",
  IMAGE_GENERATION_REQUESTED: "Image Generation Requested",
  IMAGE_GENERATION_SUCCEEDED: "Image Generation Succeeded",
  IMAGE_GENERATION_FAILED: "Image Generation Failed",
  REFERRAL_LINK_COPIED: "Referral Link Copied",
  EDITOR_OPENED: "Editor Opened",
  EXPLORE_OPENED: "Explore Opened",
} as const;

export type AnalyticsEventName =
  (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

function sanitizeProperties(
  properties?: EventProperties
): SafeEventProperties | undefined {
  if (!properties) {
    return undefined;
  }

  const safe: SafeEventProperties = {};

  for (const [key, value] of Object.entries(properties)) {
    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      safe[key] = value;
    }
  }

  return Object.keys(safe).length > 0 ? safe : undefined;
}

export function trackEvent(
  eventName: AnalyticsEventName,
  properties?: EventProperties
) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const safeProperties = sanitizeProperties(properties);
    track(eventName, safeProperties);
  } catch (error) {
    console.error("Erro ao enviar evento para Vercel Analytics:", error);
  }
}

export function trackPlanViewed(planName: string, location?: string) {
  trackEvent(ANALYTICS_EVENTS.PLAN_VIEWED, {
    planName,
    location,
  });
}

export function trackPlanCtaClicked(
  planName: string,
  ctaLabel: string,
  location?: string
) {
  trackEvent(ANALYTICS_EVENTS.PLAN_CTA_CLICKED, {
    planName,
    ctaLabel,
    location,
  });
}

export function trackCheckoutStarted(
  planName: string,
  billingCycle?: string,
  value?: number
) {
  trackEvent(ANALYTICS_EVENTS.CHECKOUT_STARTED, {
    planName,
    billingCycle,
    value,
  });
}

export function trackChatOpened(location?: string) {
  trackEvent(ANALYTICS_EVENTS.CHAT_OPENED, {
    location,
  });
}

export function trackChatMessageSent(
  source?: string,
  hasEmail?: boolean,
  messageLength?: number
) {
  trackEvent(ANALYTICS_EVENTS.CHAT_MESSAGE_SENT, {
    source,
    hasEmail,
    messageLength,
  });
}

export function trackImagePromptStarted(source?: string, promptLength?: number) {
  trackEvent(ANALYTICS_EVENTS.IMAGE_PROMPT_STARTED, {
    source,
    promptLength,
  });
}

export function trackImageGenerationRequested(
  source?: string,
  hasEmail?: boolean,
  promptLength?: number
) {
  trackEvent(ANALYTICS_EVENTS.IMAGE_GENERATION_REQUESTED, {
    source,
    hasEmail,
    promptLength,
  });
}

export function trackImageGenerationSucceeded(
  source?: string,
  provider?: string
) {
  trackEvent(ANALYTICS_EVENTS.IMAGE_GENERATION_SUCCEEDED, {
    source,
    provider,
  });
}

export function trackImageGenerationFailed(
  source?: string,
  reason?: string
) {
  trackEvent(ANALYTICS_EVENTS.IMAGE_GENERATION_FAILED, {
    source,
    reason,
  });
}

export function trackReferralLinkCopied(source?: string) {
  trackEvent(ANALYTICS_EVENTS.REFERRAL_LINK_COPIED, {
    source,
  });
}

export function trackEditorOpened(source?: string) {
  trackEvent(ANALYTICS_EVENTS.EDITOR_OPENED, {
    source,
  });
}

export function trackExploreOpened(source?: string) {
  trackEvent(ANALYTICS_EVENTS.EXPLORE_OPENED, {
    source,
  });
}