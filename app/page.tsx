import ChatComponent from "../components/ChatComponent";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900 p-4">
      <div className="w-full max-w-3xl bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-6">
        <ChatComponent />
      </div>
    </main>
  );
}
