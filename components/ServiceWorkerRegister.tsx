"use client";

import { useEffect, useRef } from "react";

const SW_URL = "/sw.js?v=2026-03-25-01";

declare global {
  interface Window {
    __auroraSwReloading?: boolean;
    __auroraSwRegistered?: boolean;
  }
}

export default function ServiceWorkerRegister() {
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    let alive = true;

    const reloadOnce = () => {
      if (typeof window === "undefined") return;
      if (window.__auroraSwReloading) return;

      window.__auroraSwReloading = true;
      window.location.reload();
    };

    const clearBrowserCaches = async () => {
      try {
        if (!("caches" in window)) return;

        const keys = await caches.keys();
        await Promise.all(keys.map((key) => caches.delete(key)));
      } catch (error) {
        console.error("Aurora IA: erro ao limpar caches do navegador.", error);
      }
    };

    const unregisterOldWorkers = async () => {
      try {
        const registrations = await navigator.serviceWorker.getRegistrations();

        await Promise.all(
          registrations.map(async (registration) => {
            const activeScript = registration.active?.scriptURL || "";
            const waitingScript = registration.waiting?.scriptURL || "";
            const installingScript = registration.installing?.scriptURL || "";

            const belongsToAurora =
              activeScript.includes("/sw.js") ||
              waitingScript.includes("/sw.js") ||
              installingScript.includes("/sw.js");

            if (belongsToAurora) {
              return;
            }

            try {
              await registration.unregister();
            } catch (error) {
              console.error(
                "Aurora IA: erro ao remover service worker antigo.",
                error
              );
            }
          })
        );
      } catch (error) {
        console.error(
          "Aurora IA: erro ao listar service workers registrados.",
          error
        );
      }
    };

    const forceWaitingWorker = (registration: ServiceWorkerRegistration) => {
      if (registration.waiting) {
        registration.waiting.postMessage({ type: "CLEAR_ALL_CACHES" });
        registration.waiting.postMessage({ type: "SKIP_WAITING" });
      }
    };

    const attachUpdateFound = (registration: ServiceWorkerRegistration) => {
      registration.addEventListener("updatefound", () => {
        const installingWorker = registration.installing;
        if (!installingWorker) return;

        installingWorker.addEventListener("statechange", () => {
          if (installingWorker.state === "installed") {
            if (navigator.serviceWorker.controller) {
              forceWaitingWorker(registration);
            }
          }
        });
      });
    };

    const registerWorker = async () => {
      try {
        await unregisterOldWorkers();
        await clearBrowserCaches();

        const registration = await navigator.serviceWorker.register(SW_URL, {
          scope: "/",
          updateViaCache: "none",
        });

        attachUpdateFound(registration);
        forceWaitingWorker(registration);

        try {
          await registration.update();
        } catch (error) {
          console.error("Aurora IA: erro ao atualizar service worker.", error);
        }

        navigator.serviceWorker.addEventListener("controllerchange", () => {
          if (!alive) return;
          reloadOnce();
        });

        navigator.serviceWorker.addEventListener("message", (event) => {
          const data = event.data;

          if (!data || typeof data !== "object") return;

          if (data.type === "AURORA_SW_ACTIVATED") {
            reloadOnce();
          }
        });

        const intervalId = window.setInterval(async () => {
          try {
            const regs = await navigator.serviceWorker.getRegistrations();

            await Promise.all(
              regs.map(async (reg) => {
                try {
                  await reg.update();
                  forceWaitingWorker(reg);
                } catch (error) {
                  console.error(
                    "Aurora IA: erro ao verificar atualização do SW.",
                    error
                  );
                }
              })
            );
          } catch (error) {
            console.error(
              "Aurora IA: erro ao consultar registros do service worker.",
              error
            );
          }
        }, 60_000);

        return () => {
          window.clearInterval(intervalId);
        };
      } catch (error) {
        console.error("Aurora IA: erro ao registrar service worker.", error);
        return () => {};
      }
    };

    let cleanup: (() => void) | undefined;

    registerWorker().then((fn) => {
      cleanup = fn;
    });

    return () => {
      alive = false;
      if (cleanup) cleanup();
    };
  }, []);

  return null;
}