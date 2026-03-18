import { Suspense } from "react";
import ChatClient from "./chat-client";

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-black px-4 py-6 text-white">
          <div className="mx-auto max-w-5xl">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              Carregando chat...
            </div>
          </div>
        </main>
      }
    >
      <ChatClient />
    </Suspense>
  );
}