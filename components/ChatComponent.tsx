"use client";

import { useState } from "react";

export default function ChatComponent() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);

  async function sendMessage() {
    const text = input.trim();
    if (!text) return;

    setMessages((m) => [...m, { role: "user", content: text }]);
    setInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();
      const reply = typeof data?.reply === "string" ? data.reply : "Sem resposta.";

      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Erro ao conectar com o servidor." },
      ]);
    }
  }

  return (
    <div style={{ maxWidth: 720, margin: "40px auto", padding: 16, fontFamily: "Arial" }}>
      <h1>RicardoIA</h1>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: 8,
          padding: 12,
          minHeight: 220,
          marginBottom: 12,
          overflowY: "auto",
          whiteSpace: "pre-wrap",
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
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
          placeholder="Digite sua mensagem..."
          style={{ flex: 1, padding: 10, borderRadius: 8, border: "1px solid #ddd" }}
        />
        <button
          onClick={sendMessage}
          style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #ddd", cursor: "pointer" }}
        >
          Enviar
        </button>
      </div>
    </div>
  );
}