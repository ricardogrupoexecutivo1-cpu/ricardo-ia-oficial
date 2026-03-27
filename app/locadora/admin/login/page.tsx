"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export default function LocadoraAdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => password.trim().length > 0, [password]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!password.trim()) {
      setError("Digite a senha para continuar.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/locadora/admin-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: password.trim(),
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setError(
          data?.error || "Não foi possível validar a senha agora."
        );
        return;
      }

      window.location.href = "/locadora/admin/painel";
    } catch {
      setError("Falha de conexão ao validar a senha.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(34,197,94,0.16), transparent 0%, transparent 28%), radial-gradient(circle at right top, rgba(20,184,166,0.12), transparent 0%, transparent 22%), linear-gradient(180deg, #041018 0%, #02060d 100%)",
        color: "#eef6ff",
        overflowX: "hidden",
      }}
    >
      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "20px 16px 88px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 20,
          }}
        >
          <Link
            href="/locadora"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              textDecoration: "none",
              color: "#cfe8ff",
              fontWeight: 700,
              fontSize: 14,
              padding: "10px 14px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.22)",
            }}
          >
            <span aria-hidden="true">←</span>
            <span>Voltar para Locadora</span>
          </Link>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 14px",
              borderRadius: 999,
              background: "rgba(34,197,94,0.10)",
              border: "1px solid rgba(34,197,94,0.24)",
              color: "#9ff3c4",
              fontWeight: 800,
              fontSize: 13,
              letterSpacing: 0.3,
            }}
          >
            <span aria-hidden="true">🔒</span>
            <span>ÁREA PROTEGIDA</span>
          </div>
        </div>

        <div
          className="aurora-locadora-admin-login-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.15fr) minmax(320px, 0.85fr)",
            gap: 22,
          }}
        >
          <article
            style={{
              position: "relative",
              overflow: "hidden",
              borderRadius: 30,
              border: "1px solid rgba(255,255,255,0.08)",
              background:
                "linear-gradient(180deg, rgba(10,24,36,0.92) 0%, rgba(5,11,18,0.98) 100%)",
              boxShadow: "0 30px 80px rgba(0,0,0,0.38)",
              minWidth: 0,
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(90deg, rgba(34,197,94,0.08), transparent 28%, transparent 72%, rgba(20,184,166,0.08))",
                pointerEvents: "none",
              }}
            />

            <div
              style={{
                position: "relative",
                padding: "28px 22px 24px",
                minWidth: 0,
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 12px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  color: "#b8d7ff",
                  fontWeight: 800,
                  fontSize: 12,
                  marginBottom: 18,
                }}
              >
                <span aria-hidden="true">🚗</span>
                <span>Aurora Locadoras</span>
              </div>

              <h1
                style={{
                  margin: 0,
                  fontSize: "clamp(34px, 7vw, 68px)",
                  lineHeight: 1.02,
                  letterSpacing: "-0.04em",
                  fontWeight: 900,
                  maxWidth: 760,
                  wordBreak: "break-word",
                }}
              >
                Login admin da locadora
              </h1>

              <p
                style={{
                  marginTop: 18,
                  marginBottom: 0,
                  maxWidth: 720,
                  color: "#d5e5f7",
                  fontSize: "clamp(17px, 3.7vw, 22px)",
                  lineHeight: 1.72,
                }}
              >
                Área protegida para gestão real de locadoras, veículos,
                motoristas, parceiros, bancos e fluxo comercial em todo o
                Brasil.
              </p>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 12,
                  marginTop: 26,
                }}
              >
                <div style={pillStyle}>Cadastro real</div>
                <div style={pillStyle}>Acesso protegido</div>
                <div style={pillStyle}>Operação nacional</div>
                <div style={pillStyle}>Filiais em todo Brasil</div>
              </div>
            </div>
          </article>

          <aside
            style={{
              borderRadius: 30,
              border: "1px solid rgba(255,255,255,0.08)",
              background:
                "linear-gradient(180deg, rgba(10,18,30,0.96) 0%, rgba(4,8,14,0.99) 100%)",
              boxShadow: "0 26px 70px rgba(0,0,0,0.34)",
              padding: 22,
              minWidth: 0,
              alignSelf: "start",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 12px",
                borderRadius: 999,
                background: "rgba(34,197,94,0.10)",
                border: "1px solid rgba(34,197,94,0.24)",
                color: "#9ff3c4",
                fontWeight: 800,
                fontSize: 12,
                marginBottom: 14,
              }}
            >
              <span aria-hidden="true">🛡️</span>
              <span>Login seguro</span>
            </div>

            <h2
              style={{
                margin: "0 0 10px",
                fontSize: 28,
                lineHeight: 1.1,
                fontWeight: 900,
                letterSpacing: "-0.03em",
              }}
            >
              Entrar no painel
            </h2>

            <p
              style={{
                margin: "0 0 20px",
                color: "#bcd3ea",
                fontSize: 15,
                lineHeight: 1.65,
              }}
            >
              Use a senha administrativa para liberar o acesso ao painel da locadora.
            </p>

            <form onSubmit={handleSubmit}>
              <label
                htmlFor="locadora-admin-login-password"
                style={{
                  display: "block",
                  marginBottom: 10,
                  color: "#dcecff",
                  fontWeight: 800,
                  fontSize: 14,
                }}
              >
                Senha do admin
              </label>

              <input
                id="locadora-admin-login-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Digite a senha"
                autoComplete="current-password"
                style={{
                  width: "100%",
                  height: 54,
                  borderRadius: 16,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.06)",
                  color: "#ffffff",
                  outline: "none",
                  padding: "0 16px",
                  fontSize: 16,
                  boxSizing: "border-box",
                }}
              />

              {error ? (
                <div
                  style={{
                    marginTop: 12,
                    padding: "12px 14px",
                    borderRadius: 14,
                    background: "rgba(239,68,68,0.10)",
                    border: "1px solid rgba(239,68,68,0.24)",
                    color: "#ffd1d1",
                    fontSize: 14,
                    lineHeight: 1.5,
                  }}
                >
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={!canSubmit || loading}
                style={{
                  width: "100%",
                  height: 54,
                  border: 0,
                  borderRadius: 16,
                  marginTop: 16,
                  cursor: canSubmit && !loading ? "pointer" : "not-allowed",
                  fontWeight: 900,
                  fontSize: 17,
                  color: "#04110a",
                  background:
                    canSubmit && !loading
                      ? "linear-gradient(135deg, #22c55e, #86efac)"
                      : "linear-gradient(135deg, #6b7280, #9ca3af)",
                  boxShadow:
                    canSubmit && !loading
                      ? "0 18px 40px rgba(34,197,94,0.25)"
                      : "none",
                }}
              >
                {loading ? "Validando..." : "Entrar no admin"}
              </button>
            </form>

            <div
              style={{
                marginTop: 18,
                padding: 16,
                borderRadius: 18,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                color: "#b9cde3",
                fontSize: 14,
                lineHeight: 1.7,
              }}
            >
              Defina a senha em <strong>.env.local</strong> usando a variável{" "}
              <strong>LOCADORA_ADMIN_PASSWORD</strong>.
            </div>
          </aside>
        </div>
      </section>

      <style jsx global>{`
        @media (max-width: 980px) {
          .aurora-locadora-admin-login-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}

const pillStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 42,
  padding: "0 16px",
  borderRadius: 999,
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "#e5f0fb",
  fontWeight: 700,
  fontSize: 14,
};