"use client";

import { useState, useRef, useEffect } from "react";

export default function ChatComponent() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<
    { role: string; content: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  async function sendMessage() {
    if (!message.trim() || loading) return;

    const userText = message.trim();
    setMessage("");

    const updatedChat = [
      ...chat,
      { role: "user", content: userText },
    ];

    setChat(updatedChat);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedChat,
        }),
      });

      if (!response.body) throw new Error("No stream");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let assistantText = "";

      // cria mensagem vazia do assistant
      setChat((prev) => [
        ...prev,
        { role: "assistant", content: "" },
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        assistantText += chunk;

        setChat((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].content = assistantText;
          return newMessages;
        });
      }

    } catch (error) {
      setChat((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Erro de conexão com o servidor.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full flex flex-col h-[75vh]">
      <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl">
        {chat.map((m, i) => (
          <div
            key={i}
            className={`p-4 rounded-2xl max-w-[75%] text-sm shadow ${
              m.role === "user"
                ? "ml-auto bg-zinc-200 dark:bg-zinc-700"
                : "bg-blue-600 text-white"
            }`}
          >
            {m.content}
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2 mt-4">
        <input
          className="flex-1 p-3 rounded-xl border dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Digite sua mensagem..."
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />

        <button
          onClick={sendMessage}
          disabled={loading}
          className="px-6 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}