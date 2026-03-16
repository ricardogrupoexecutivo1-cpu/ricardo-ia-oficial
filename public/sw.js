const STATIC_CACHE = "aurora-static-v2";
const PAGE_CACHE = "aurora-pages-v2";
const IMAGE_CACHE = "aurora-images-v2";

const CORE_ASSETS = [
  "/",
  "/explorar",
  "/planos",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/apple-touch-icon.png",
  "/manifest.webmanifest",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (![STATIC_CACHE, PAGE_CACHE, IMAGE_CACHE].includes(key)) {
            return caches.delete(key);
          }
          return Promise.resolve();
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") return;

  const url = new URL(request.url);

  if (request.mode === "navigate") {
    event.respondWith(networkFirstPages(request));
    return;
  }

  if (
    request.destination === "image" ||
    url.pathname.includes("/_next/image") ||
    /\.(png|jpg|jpeg|webp|gif|svg)$/i.test(url.pathname)
  ) {
    event.respondWith(cacheFirstImages(request));
    return;
  }

  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icons/") ||
    url.pathname === "/manifest.webmanifest"
  ) {
    event.respondWith(cacheFirstStatic(request));
    return;
  }
});

async function networkFirstPages(request) {
  const cache = await caches.open(PAGE_CACHE);

  try {
    const fresh = await fetch(request);
    cache.put(request, fresh.clone()).catch(() => {});
    return fresh;
  } catch {
    const cached = await cache.match(request);
    return cached || caches.match("/");
  }
}

async function cacheFirstImages(request) {
  const cache = await caches.open(IMAGE_CACHE);
  const cached = await cache.match(request);

  if (cached) return cached;

  const fresh = await fetch(request);
  cache.put(request, fresh.clone()).catch(() => {});
  return fresh;
}

async function cacheFirstStatic(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(request);

  if (cached) return cached;

  const fresh = await fetch(request);
  cache.put(request, fresh.clone()).catch(() => {});
  return fresh;
}