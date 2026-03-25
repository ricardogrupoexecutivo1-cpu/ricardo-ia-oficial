"use client";

import { useEffect } from "react";

export default function AuroraClientBoot() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    let hideTimeout: any;

    function hideFloatingUI() {
      document.body.classList.add("aurora-hide-ui");
    }

    function showFloatingUI() {
      clearTimeout(hideTimeout);

      hideTimeout = setTimeout(() => {
        document.body.classList.remove("aurora-hide-ui");
      }, 300);
    }

    function handleFocus(e: any) {
      const tag = e.target?.tagName?.toLowerCase();

      if (tag === "textarea" || tag === "input") {
        hideFloatingUI();
      }
    }

    function handleBlur() {
      showFloatingUI();
    }

    document.addEventListener("focusin", handleFocus);
    document.addEventListener("focusout", handleBlur);

    return () => {
      document.removeEventListener("focusin", handleFocus);
      document.removeEventListener("focusout", handleBlur);
    };
  }, []);

  return null;
}