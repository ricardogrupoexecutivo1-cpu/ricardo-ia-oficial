"use client";

import { useEffect, useState } from "react";

export default function ReferralTracker() {
  const [refCode, setRefCode] = useState("");

  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      const ref = (url.searchParams.get("ref") || "").trim();

      if (ref) {
        localStorage.setItem("aurora_ref", ref);
        setRefCode(ref);
        return;
      }

      const saved = localStorage.getItem("aurora_ref") || "";
      if (saved) {
        setRefCode(saved);
      }
    } catch (error) {
      console.error("Erro ao capturar referência:", error);
    }
  }, []);

  if (!refCode) return null;

  return (
    <div
      style={{
        marginTop: "14px",
        marginBottom: "6px",
        padding: "10px 14px",
        borderRadius: "14px",
        border: "1px solid rgba(96, 165, 250, 0.22)",
        background: "rgba(96, 165, 250, 0.08)",
        color: "#dbeafe",
        fontSize: "14px",
        textAlign: "center",
      }}
    >
      Você chegou por uma indicação especial: <strong>{refCode}</strong>
    </div>
  );
}