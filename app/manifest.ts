import type { MetadataRoute } from "next";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "Aurora IA",
    description: SITE_DESCRIPTION,
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0b1020",
    theme_color: "#0b1020",
    lang: "pt-BR",
    categories: ["productivity", "business", "graphics"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    screenshots: [
      {
        src: `${SITE_URL}/icons/screenshot-wide.png`,
        sizes: "1280x720",
        type: "image/png",
        form_factor: "wide",
        label: "Aurora IA no navegador",
      },
      {
        src: `${SITE_URL}/icons/screenshot-mobile.png`,
        sizes: "720x1280",
        type: "image/png",
        label: "Aurora IA no celular",
      },
    ],
  };
}