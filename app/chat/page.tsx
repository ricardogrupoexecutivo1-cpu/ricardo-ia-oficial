import ChatClient from "./chat-client";

export default function ChatPage() {
  return (
    <main
      style={{
        width: "100%",
        maxWidth: 1100,
        margin: "0 auto",
      }}
    >
      <ChatClient />
    </main>
  );
}