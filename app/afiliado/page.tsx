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
          "radial-gradient(circle at top, rgba(0,208,132,0.18), transparent 40%), #020617",
        color: "#fff",
        padding: "24px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{ width: "100%", maxWidth: "860px" }}>
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
              href="/chat"
              style={{
                color: "#fff",
                textDecoration: "none",
                padding: "10px 14px",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              Chat
            </Link>

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
            borderRadius: "30px",
            padding: "30px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(0,208,132,0.16)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.35)",
            marginBottom: "18px",
          }}
        >
          <span
            style={{
              display: "inline-block",
              padding: "8px 14px",
              borderRadius: "999px",
              background: "rgba(0,208,132,0.12)",
              color: "#75ffbf",
              marginBottom: "16px",
            }}
          >
            Aurora IA • Programa de Afiliados
          </span>

          <h1 style={{ fontSize: "2.35rem", lineHeight: 1.08, marginBottom: "14px" }}>
            Indique a Aurora IA e transforme divulgação em receita.
          </h1>

          <p style={{ opacity: 0.82, lineHeight: 1.7, fontSize: "1.04rem" }}>
            Gere seu link de indicação, compartilhe nas redes, grupos, WhatsApp e
            para clientes. A Aurora foi feita para chamar atenção e facilitar venda,
            então o afiliado entra com tráfego e aproveita uma oferta forte.
          </p>

          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              marginTop: "20px",
            }}
          >
            <a
              href="#gerar-link"
              style={{
                padding: "14px 18px",
                borderRadius: "14px",
                textDecoration: "none",
                background: "linear-gradient(135deg, #00d084, #75ffbf)",
                color: "#000",
                fontWeight: "bold",
              }}
            >
              Entrar e pegar meu link
            </a>

            <Link
              href="/planos"
              style={{
                padding: "14px 18px",
                borderRadius: "14px",
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#fff",
              }}
            >
              Ver planos
            </Link>
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
            marginBottom: "18px",
          }}
        >
          {[
            ["1. Cadastre-se", "Entre na Aurora IA e tenha seu código/link pessoal de divulgação."],
            ["2. Compartilhe", "Envie seu link no WhatsApp, Instagram, grupos e para clientes."],
            ["3. Ganhe", "Cada venda originada pelo seu link pode gerar comissão e bônus."],
          ].map(([title, text]) => (
            <div
              key={title}
              style={{
                borderRadius: "22px",
                padding: "20px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <strong style={{ display: "block", marginBottom: "10px" }}>{title}</strong>
              <span style={{ opacity: 0.78, lineHeight: 1.65 }}>{text}</span>
            </div>
          ))}
        </section>

        <section
          style={{
            borderRadius: "26px",
            padding: "26px",
            background: "rgba(117,255,191,0.06)",
            border: "1px solid rgba(117,255,191,0.15)",
            marginBottom: "18px",
          }}
        >
          <h2 style={{ marginTop: 0, marginBottom: "12px" }}>
            Para quem é o programa
          </h2>

          <div style={{ display: "grid", gap: "10px" }}>
            {[
              "Afiliados que querem vender uma ferramenta com recorrência mensal.",
              "Agências, designers e social medias que querem agregar mais valor.",
              "Vendedores e parceiros comerciais que já têm carteira de clientes.",
              "Pessoas que querem monetizar indicação de uma IA com aplicação real.",
            ].map((item) => (
              <div
                key={item}
                style={{
                  padding: "14px 16px",
                  borderRadius: "14px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section
          id="gerar-link"
          style={{
            borderRadius: "26px",
            padding: "26px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <h2 style={{ marginTop: 0, marginBottom: "12px" }}>
            Gere seu link agora
          </h2>

          <p style={{ opacity: 0.84, lineHeight: 1.7, marginBottom: "14px" }}>
            Digite seu e-mail para criar um link pronto para divulgação.
          </p>

          <input
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
        </section>
      </div>
    </main>
  );
}