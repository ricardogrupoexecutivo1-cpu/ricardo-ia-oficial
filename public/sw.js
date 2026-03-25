const SW_VERSION = "aurora-sw-2026-03-25-01";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("message", (event) => {
  if (!event.data) return;

  if (event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  if (event.data.type === "CLEAR_ALL_CACHES") {
    event.waitUntil(
      (async () => {
        const keys = await caches.keys();
        await Promise.all(keys.map((key) => caches.delete(key)));
      })()
    );
  }
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();

      await Promise.all(
        keys.map((key) => {
          if (key !== SW_VERSION) {
            return caches.delete(key);
          }
          return Promise.resolve(true);
        })
      );

      await clients.claim();

      const clientList = await clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });

      for (const client of clientList) {
        client.postMessage({
          type: "AURORA_SW_ACTIVATED",
          version: SW_VERSION,
        });
      }
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) {
    return;
  }

  const acceptHeader = request.headers.get("accept") || "";
  const isHtml =
    request.mode === "navigate" ||
    request.destination === "document" ||
    acceptHeader.includes("text/html");

  const isApi = url.pathname.startsWith("/api/");
  const isCriticalAsset =
    request.destination === "script" ||
    request.destination === "style" ||
    request.destination === "worker";

  // HTML sempre pela rede para evitar tela velha
  if (isHtml) {
    event.respondWith(
      fetch(request, { cache: "no-store" }).catch(() => {
        return new Response(
          "<!doctype html><html><body><h1>Sem conexão</h1></body></html>",
          {
            headers: {
              "Content-Type": "text/html; charset=utf-8",
              "Cache-Control": "no-store",
            },
            status: 503,
          }
        );
      })
    );
    return;
  }

  // API sempre pela rede para galeria, planos e dados novos
  if (isApi) {
    event.respondWith(fetch(request, { cache: "no-store" }));
    return;
  }

  // JS/CSS/worker sempre pela rede para não servir bundle antigo
  if (isCriticalAsset) {
    event.respondWith(fetch(request, { cache: "no-store" }));
    return;
  }

  // Para o resto: tenta rede primeiro, sem gravar cache manual
  event.respondWith(
    fetch(request).catch(async () => {
      const cached = await caches.match(request);
      if (cached) return cached;
      throw new Error("Falha de rede e sem cache disponível.");
    })
  );
});