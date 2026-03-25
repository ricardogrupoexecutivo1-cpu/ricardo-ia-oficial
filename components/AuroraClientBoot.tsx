"use client";

import { useEffect } from "react";
import ServiceWorkerRegister from "./ServiceWorkerRegister";

const APP_VERSION = "2026-03-25-01";
const VERSION_KEY = "aurora_app_version";

export default function AuroraClientBoot() {
  useEffect(() => {
    const run = async () => {
      try {
        const lastVersion =
          typeof window !== "undefined"
            ? window.localStorage.getItem(VERSION_KEY)
            : null;

        if (lastVersion !== APP_VERSION) {
          if ("caches" in window) {
            try {
              const keys = await caches.keys();
              await Promise.all(keys.map((key) => caches.delete(key)));
            } catch (error) {
              console.error("Aurora IA: erro limpando cache por versão.", error);
            }
          }

          try {
            window.localStorage.setItem(VERSION_KEY, APP_VERSION);
          } catch (error) {
            console.error(
              "Aurora IA: erro salvando versão local da aplicação.",
              error
            );
          }
        }
      } catch (error) {
        console.error("Aurora IA: erro no boot global do client.", error);
      }
    };

    run();
  }, []);

  return <ServiceWorkerRegister />;
}