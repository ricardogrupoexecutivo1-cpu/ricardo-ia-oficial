"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

function makeReferralCode(email: string) {
  const clean = email.trim().toLowerCase();
  if (!clean) return "";
  const base = clean.split("@")[0].replace(/[^a-z0-9]/g, "").slice(0, 18);
  const suffix = clean.length.toString().padStart(2, "0");
  return `${base}${suffix}`;
}

export default function AfiliadoPage() {
  const [email, setEmail] = useState("");
  const [copied, setCopied] = useState(false);

  const referralCode = useMemo(() => makeReferralCode(email), [email]);

  const referralLink = useMemo(() => {
    if (!referralCode) return "";
    return `https://ricardoiaoficial.com/?ref=${referralCode}`;
  }, [referralCode]);

  async function copyLink() {
    if (!referralLink) {
      alert("Digite seu e-mail para gerar seu link.");
      return;
    }

    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Não foi possível copiar o link.");
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(0,208,132,0.16), transparent 38%), #020617",
        color: "#fff",
        padding: "24px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{ width: "100%", maxWidth: "760px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
            marginBottom: "20px",
          }}
        >
          <Link href="/" style={{ color: "#75ffbf", textDecoration: "none" }}>
            ← Home
          </Link>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <Link
              href="/oferta"
              style={{
                color: "#fff",
                textDecoration: "none",
                padding: "10px 14px",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              Oferta
            </Link>

            <Link
              href="/planos"
              style={{
                color: "#fff",
                textDecoration: "none",
                padding: "10px 14px",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              Planos
            </Link>
          </div>
        </div>

        <section
          style={{
            borderRadius: "28px",
            padding: "28px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(0,208,132,0.16)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.35)",
          }}
        >
          <span
            style={{
              display: "inline-block",
              padding: "8px 14px",
              borderRadius: "999px",
              background: "rgba(0,208,132,0.12)",
              color: "#75ffbf",
              marginBottom: "14px",
              fontSize: "0.9rem",
            }}
          >
            Programa de Afiliados Aurora IA
          </span>

          <h1 style={{ fontSize: "2.2rem", lineHeight: 1.1, marginBottom: "12px" }}>
            Ganhe indicando a Aurora IA para outras pessoas.
          </h1>

          <p style={{ opacity: 0.8, fontSize: "1.02rem", lineHeight: 1.6 }}>
            Gere seu link, divulgue no Instagram, WhatsApp, grupos e páginas de
            vendas. Quanto mais pessoas entrarem pelo seu link, maior seu potencial
            de faturamento.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "14px",
              marginTop: "24px",
              marginBottom: "28px",
            }}
          >
            {[
              ["Fácil de divulgar", "Link pronto para compartilhar"],
              ["Ideal para social", "Instagram, Facebook e WhatsApp"],
              ["Oferta forte", "Produto com uso real e recorrência"],
              ["Escala", "Mais tráfego, mais chance de venda"],
            ].map(([title, text]) => (
              <div
                key={title}
                style={{
                  borderRadius: "18px",
                  padding: "16px",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <strong style={{ display: "block", marginBottom: "8px" }}>{title}</strong>
                <span style={{ opacity: 0.75 }}>{text}</span>
              </div>
            ))}
          </div>

          <div
            style={{
              borderRadius: "22px",
              padding: "20px",
              background: "rgba(0,0,0,0.22)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <label
              htmlFor="affiliate-email"
              style={{ display: "block", marginBottom: "10px", opacity: 0.88 }}
            >
              Digite seu e-mail para gerar seu link de afiliado
            </label>

            <input
              id="affiliate-email"
              type="email"
              placeholder="seuemail@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "14px",
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.05)",
                color: "#fff",
                marginBottom: "14px",
              }}
            />

            <div
              style={{
                padding: "14px",
                borderRadius: "14px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                wordBreak: "break-all",
                minHeight: "54px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {referralLink || "Seu link de afiliado aparecerá aqui"}
            </div>

            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
                marginTop: "14px",
              }}
            >
              <button
                type="button"
                onClick={copyLink}
                style={{
                  padding: "14px 18px",
                  borderRadius: "14px",
                  border: "none",
                  cursor: "pointer",
                  background: "linear-gradient(135deg, #00d084, #75ffbf)",
                  color: "#000",
                  fontWeight: "bold",
                }}
              >
                {copied ? "Link copiado" : "Copiar link"}
              </button>

              <a
                href={referralLink || "#"}
                target="_blank"
                rel="noreferrer"
                style={{
                  padding: "14px 18px",
                  borderRadius: "14px",
                  textDecoration: "none",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "#fff",
                  opacity: referralLink ? 1 : 0.5,
                  pointerEvents: referralLink ? "auto" : "none",
                }}
              >
                Abrir link
              </a>
            </div>
          </div>

          <div
            style={{
              marginTop: "24px",
              padding: "18px",
              borderRadius: "20px",
              background: "rgba(117,255,191,0.07)",
              border: "1px solid rgba(117,255,191,0.14)",
            }}
          >
            <strong style={{ display: "block", marginBottom: "10px" }}>
              Sugestão de texto para divulgar
            </strong>

            <p style={{ opacity: 0.85, lineHeight: 1.7, margin: 0 }}>
              Conheça a Aurora IA e gere imagens, campanhas e ideias de negócio em
              segundos. Teste agora pelo meu link:
              <br />
              <span style={{ color: "#75ffbf" }}>
                {referralLink || "gere seu link acima"}
              </span>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}