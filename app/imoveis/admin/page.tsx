"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export default function ImoveisAdminGatePage() {
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

      const response = await fetch("/api/imoveis/admin-login", {
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
          data?.error || "Não foi possível entrar agora. Tente novamente."
        );
        return;
      }

      window.location.href = "/imoveis/admin/painel";
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
          "radial-gradient(circle at top, rgba(56,189,248,0.14), transparent 0%, transparent 28%), radial-gradient(circle at right top, rgba(59,130,246,0.14), transparent 0%, transparent 22%), linear-gradient(180deg, #041018 0%, #02060d 100%)",
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
            href="/imoveis"
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
            <span>Voltar para Imóveis</span>
          </Link>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 14px",
              borderRadius: 999,
              background: "rgba(56,189,248,0.12)",
              border: "1px solid rgba(56,189,248,0.24)",
              color: "#b7e7ff",
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
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.15fr) minmax(320px, 0.85fr)",
            gap: 22,
          }}
          className="aurora-imoveis-admin-grid"
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
              padding: 0,
              minWidth: 0,
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(90deg, rgba(56,189,248,0.08), transparent 28%, transparent 72%, rgba(59,130,246,0.08))",
                pointerEvents: "none",
              }}
            />

            <div
              style={{
                position: "absolute",
                top: 0,
                left: 28,
                right: 28,
                height: 1,
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
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
                <span aria-hidden="true">🏠</span>
                <span>Aurora Imóveis</span>
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
                Entrar no admin de imóveis
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
                Área protegida para cadastro real de imóveis, corretores,
                imobiliárias, clientes, parceiros e operação comercial dentro
                do ecossistema Aurora.
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
                <div style={pillStyle}>Corretores e imobiliárias</div>
                <div style={pillStyle}>Operação nacional</div>
              </div>

              <div
                style={{
                  marginTop: 28,
                  padding: 18,
                  borderRadius: 22,
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  minWidth: 0,
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 800,
                    letterSpacing: "0.2em",
                    color: "#8db5d9",
                    marginBottom: 12,
                  }}
                >
                  AVISO
                </div>

                <div
                  style={{
                    color: "#f2f8ff",
                    fontSize: 16,
                    lineHeight: 1.7,
                  }}
                >
                  Sistema em constante atualização. Pode haver momentos de
                  instabilidade durante ajustes de performance, segurança,
                  expansão comercial e evolução da plataforma.
                </div>
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
                background: "rgba(56,189,248,0.12)",
                border: "1px solid rgba(56,189,248,0.24)",
                color: "#b7e7ff",
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
              Use a senha administrativa para liberar o acesso ao painel do
              módulo imobiliário.
            </p>

            <form onSubmit={handleSubmit}>
              <label
                htmlFor="imoveis-admin-password"
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
                id="imoveis-admin-password"
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
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
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
                  color: "#03111a",
                  background:
                    canSubmit && !loading
                      ? "linear-gradient(135deg, #38bdf8, #7dd3fc)"
                      : "linear-gradient(135deg, #6b7280, #9ca3af)",
                  boxShadow:
                    canSubmit && !loading
                      ? "0 18px 40px rgba(56,189,248,0.25)"
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
              <strong>IMOVEIS_ADMIN_PASSWORD</strong>.
            </div>

            <div
              style={{
                marginTop: 18,
                display: "grid",
                gap: 10,
              }}
            >
              <div style={miniInfoBox}>
                <strong style={miniInfoTitle}>Painel protegido</strong>
                <span style={miniInfoText}>
                  Cadastro real e controle interno da operação imobiliária.
                </span>
              </div>

              <div style={miniInfoBox}>
                <strong style={miniInfoTitle}>Mais segurança</strong>
                <span style={miniInfoText}>
                  Acesso separado da navegação pública da plataforma.
                </span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <style jsx global>{`
        @media (max-width: 980px) {
          .aurora-imoveis-admin-grid {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 768px) {
          html,
          body {
            overflow-x: hidden;
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
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
};

const miniInfoBox: React.CSSProperties = {
  display: "grid",
  gap: 6,
  padding: 14,
  borderRadius: 16,
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.07)",
};

const miniInfoTitle: React.CSSProperties = {
  color: "#f3f8ff",
  fontSize: 14,
};

const miniInfoText: React.CSSProperties = {
  color: "#b8cde3",
  fontSize: 13,
  lineHeight: 1.6,
};