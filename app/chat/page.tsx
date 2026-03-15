import { Suspense } from "react";
import ChatClient from "./chat-client";

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <main
          style={{
            minHeight: "100vh",
            background: "#0b1020",
            color: "#ffffff",
            padding: 20,
            fontFamily: "Arial, sans-serif",
          }}
        >
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <h1 style={{ fontSize: 32, marginBottom: 8 }}>Aurora IA</h1>
            <p style={{ color: "#aab4d6", marginTop: 0 }}>
              Carregando chat...
            </p>
          </div>
        </main>
      }
    >
      <ChatClient />
    </Suspense>
  );
}