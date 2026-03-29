import { NextRequest, NextResponse } from "next/server";
import {
  logRouteError,
  logRouteInfo,
  saveHealthCheck,
} from "@/lib/aurora-guard";

export const runtime = "nodejs";

type HealthStatus = "healthy" | "warning" | "critical";

type RouteCheckResult = {
  service: string;
  target: string;
  ok: boolean;
  status: HealthStatus;
  latencyMs: number;
  httpStatus: number | null;
  error: string | null;
};

function getBaseUrl(req: NextRequest) {
  const envUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.APP_URL ||
    "";

  if (envUrl) {
    return envUrl.replace(/\/$/, "");
  }

  const protocol = req.headers.get("x-forwarded-proto") || "http";
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");

  if (host) {
    return `${protocol}://${host}`;
  }

  return "http://127.0.0.1:3000";
}

async function checkUrl(
  service: string,
  url: string,
  init?: RequestInit
): Promise<RouteCheckResult> {
  const startedAt = Date.now();

  try {
    const response = await fetch(url, {
      method: init?.method || "GET",
      headers: init?.headers,
      body: init?.body,
      cache: "no-store",
    });

    const latencyMs = Date.now() - startedAt;

    let status: HealthStatus = "healthy";

    if (!response.ok) {
      status = response.status >= 500 ? "critical" : "warning";
    }

    return {
      service,
      target: url,
      ok: response.ok,
      status,
      latencyMs,
      httpStatus: response.status,
      error: response.ok ? null : `HTTP ${response.status}`,
    };
  } catch (error) {
    const latencyMs = Date.now() - startedAt;

    return {
      service,
      target: url,
      ok: false,
      status: "critical",
      latencyMs,
      httpStatus: null,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

function summarizeOverallStatus(results: RouteCheckResult[]): HealthStatus {
  if (results.some((item) => item.status === "critical")) {
    return "critical";
  }

  if (results.some((item) => item.status === "warning")) {
    return "warning";
  }

  return "healthy";
}

export async function GET(req: NextRequest) {
  const baseUrl = getBaseUrl(req);

  const chatPageUrl = `${baseUrl}/chat`;
  const livroPageUrl = `${baseUrl}/livro`;
  const apiChatUrl = `${baseUrl}/api/chat`;
  const apiImageUrl = `${baseUrl}/api/image`;

  const checks: RouteCheckResult[] = [];

  checks.push(await checkUrl("chat-page", chatPageUrl));
  checks.push(await checkUrl("livro-page", livroPageUrl));
  checks.push(await checkUrl("api-chat", apiChatUrl));

  const apiImagePayload = JSON.stringify({
    prompt: "teste de health check do aurora guardiao",
    email: "healthcheck@aurora.local",
  });

  checks.push(
    await checkUrl("api-image", apiImageUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: apiImagePayload,
    })
  );

  const overallStatus = summarizeOverallStatus(checks);

  for (const item of checks) {
    await saveHealthCheck({
      service: item.service,
      status: item.status,
      latencyMs: item.latencyMs,
      details: {
        target: item.target,
        httpStatus: item.httpStatus,
        ok: item.ok,
        error: item.error,
      },
    });

    if (!item.ok) {
      await logRouteError({
        route: "/api/guard/health",
        message: `Falha detectada no health check: ${item.service}`,
        details: {
          service: item.service,
          target: item.target,
          httpStatus: item.httpStatus,
          error: item.error,
          latencyMs: item.latencyMs,
        },
      });
    } else {
      await logRouteInfo({
        route: "/api/guard/health",
        message: `Health check OK: ${item.service}`,
        details: {
          service: item.service,
          target: item.target,
          httpStatus: item.httpStatus,
          latencyMs: item.latencyMs,
        },
      });
    }
  }

  return NextResponse.json(
    {
      ok: overallStatus !== "critical",
      guard: "Aurora Guardião",
      status: overallStatus,
      checkedAt: new Date().toISOString(),
      results: checks,
    },
    {
      status: overallStatus === "critical" ? 500 : 200,
    }
  );
}