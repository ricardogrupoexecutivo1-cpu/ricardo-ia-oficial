"use client";

import React, { useMemo, useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

function getOrCreateUserId() {
  if (typeof window === "undefined") return "server";
  const key = "ricardoia_user_id";
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;

  // Gera um id simples (suficiente para MVP)
  const newId =
    (crypto?.randomUUID?.() as string | undefined) ??
    `uid_${Math.random().toString(16).slice(2)}_${Date.now()}`;
  window.localStorage.setItem(key, newId);
  return newId;
}

export default function ChatComponent() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const boxRef = useRef<HTMLDivElement | null>(null);

  const canSend = useMemo(() => !sending && input.trim().length > 0, [sending, input]);

  function scrollToBottom() {
    requestAnimationFrame(() => {
      if (!boxRef.current) return;
      boxRef.current.scrollTop = boxRef.current.scrollHeight;
    });
  }

  async function sendMessage() {
    const text = input.trim();
    if (!text || sending) return;

    setSending(true);
    setInput("");

    setMessages((prev) => [...prev, { role: "user", content: text }, { role: "assistant", content: "" }]);
    scrollToBottom();

    try {
      const userId = getOrCreateUserId();

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, userId }),
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        const msg = errText || `Erro HTTP ${res.status}`;
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { role: "assistant", content: msg };
          return next;
        });
        return;
      }

      if (!res.body) {
        const full = await res.text().catch(() => "");
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { role: "assistant", content: full || "Sem resposta." };
          return next;
        });
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let done = false;
      while (!done) {
        const { value, done: d } = await reader.read();
        done = d;

        const chunk = value ? decoder.decode(value, { stream: !done }) : "";
        if (chunk) {
          setMessages((prev) => {
            const next = [...prev];
            const last = next[next.length - 1];
            next[next.length - 1] = {
              role: "assistant",
              content: (last?.content ?? "") + chunk,
            };
            return next;
          });
          scrollToBottom();
        }
      }
    } catch (e: any) {
      const msg = typeof e?.message === "string" ? e.message : "Erro ao conectar.";
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = { role: "assistant", content: msg };
        return next;
      });
    } finally {
      setSending(false);
      scrollToBottom();
    }
  }

  return (
    <div style={{ maxWidth: 720, margin: "24px auto", padding: 16, fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ marginBottom: 10 }}>Chat RicardoIA</h2>

      <div
        ref={boxRef}
        style={{
          border: "1px solid #ddd",
          borderRadius: 8,
          padding: 12,
          minHeight: 220,
          marginBottom: 12,
          overflowY: "auto",
          whiteSpace: "pre-wrap",
          background: "#fff",
        }}
      >
        {messages.length === 0 ? (
          <div style={{ opacity: 0.7 }}>Digite sua mensagem…</div>
        ) : (
          messages.map((m, i) => (
            <div key={i} style={{ margin: "8px 0" }}>
              <b>{m.role === "user" ? "Você" : "RicardoIA"}:</b> {m.content}
            </div>
          ))
        )}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={input}
          disabled={sending}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
          placeholder={sending ? "Aguarde..." : "Digite sua mensagem..."}
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 8,
            border: "1px solid #ddd",
            outline: "none",
          }}
        />
        <button
          onClick={sendMessage}
          disabled={!canSend}
          style={{
            padding: "10px 14px",
            borderRadius: 8,
            border: "1px solid #ddd",
            cursor: canSend ? "pointer" : "not-allowed",
            opacity: canSend ? 1 : 0.6,
          }}
        >
          {sending ? "Enviando..." : "Enviar"}
        </button>
      </div>
    </div>
  );
}