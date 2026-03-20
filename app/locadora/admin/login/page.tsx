"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LocadoraAdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setFeedback(null);

    try {
      const response = await fetch("/api/locadora/admin/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setFeedback(data?.error || "Não foi possível entrar no admin.");
        setSending(false);
        return;
      }

      router.push("/locadora/admin");
      router.refresh();
    } catch {
      setFeedback("Erro inesperado ao entrar.");
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#02030a] text-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.12),transparent_24%),radial-gradient(circle_at_right,rgba(34,211,238,0.12),transparent_28%)]" />
        <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6 py-16 md:px-8">
          <div className="w-full max-w-xl rounded-[2.2rem] border border-white/10 bg-[#07101f]/92 p-8 shadow-2xl">
            <div className="mb-6 flex flex-wrap gap-3">
              <Link
                href="/locadora"
                className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/90 transition hover:bg-white/10"
              >
                ← Voltar para Locadora
              </Link>

              <span className="rounded-full border border-amber-400/25 bg-amber-400/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-amber-300">
                Login admin
              </span>
            </div>

            <h1 className="text-4xl font-black md:text-5xl">
              Entrar no admin da locadora
            </h1>

            <p className="mt-4 text-white/70">
              Área protegida para cadastro real de locadoras e veículos.
            </p>

            <form onSubmit={handleSubmit} className="mt-8">
              <label className="mb-2 block text-sm font-medium text-white/75">
                Senha do admin
              </label>

              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-[#050914] px-4 py-3 text-white outline-none transition focus:border-emerald-400/45 focus:shadow-[0_0_0_4px_rgba(16,185,129,0.10)]"
                placeholder="Digite a senha"
              />

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <button
                  type="submit"
                  disabled={sending}
                  className="rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-300 px-6 py-3 font-bold text-slate-950 transition hover:scale-[1.02] disabled:opacity-60"
                >
                  {sending ? "Entrando..." : "Entrar no admin"}
                </button>

                {feedback ? (
                  <p className="text-sm text-white/75">{feedback}</p>
                ) : null}
              </div>
            </form>

            <div className="mt-8 rounded-[1.6rem] border border-white/10 bg-black/20 p-4 text-sm text-white/65">
              Defina a senha em <strong>`.env.local`</strong> usando a variável{" "}
              <strong>`LOCADORA_ADMIN_PASSWORD`</strong>.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}