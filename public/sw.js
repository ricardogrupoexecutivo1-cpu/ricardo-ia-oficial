self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", () => {
  // Service worker neutro por enquanto.
  // Mantido apenas para evitar 404 em /sw.js
  // enquanto a Aurora evolui com segurança.
});