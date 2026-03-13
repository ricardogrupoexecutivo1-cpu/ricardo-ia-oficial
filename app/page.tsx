"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function HomePage() {
  useEffect(() => {
    fetch("/api/marketing/visit", {
      method: "POST",
    }).catch(() => {});
  }, []);

  return (
    <main style={{ padding: 24, maxWidth: 980, margin: "0 auto" }}>
      <section style={{ textAlign: "center", padding: "48px 0" }}>
        <h1 style={{ fontSize: 40, marginBottom: 16 }}>
          RicardoIA
        </h1>

        <p style={{ fontSize: 20, lineHeight: 1.6, marginBottom: 24 }}>
          Sua inteligência artificial para atendimento, produtividade,
          marketing e crescimento empresarial.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/chat"
            style={{
              padding: "14px 22px",
              borderRadius: 10,
              textDecoration: "none",
              border: "1px solid #111",
              fontWeight: 700
            }}
          >
            Testar agora
          </Link>

          <Link
            href="/planos"
            style={{
              padding: "14px 22px",
              borderRadius: 10,
              textDecoration: "none",
              border: "1px solid #111",
              fontWeight: 700
            }}
          >
            Ver planos
          </Link>
        </div>
      </section>

      <section style={{ padding: "24px 0" }}>
        <h2 style={{ fontSize: 28, marginBottom: 12 }}>Por que usar a RicardoIA?</h2>
        <div style={{ display: "grid", gap: 16 }}>
          <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16 }}>
            Atendimento rápido e inteligente para clientes
          </div>
          <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16 }}>
            Apoio em vendas, marketing e organização do negócio
          </div>
          <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16 }}>
            Experiência simples, profissional e pronta para escalar
          </div>
        </div>
      </section>

      <section style={{ padding: "24px 0" }}>
        <h2 style={{ fontSize: 28, marginBottom: 12 }}>Plano em destaque</h2>

        <div style={{ border: "1px solid #111", borderRadius: 16, padding: 20 }}>
          <h3 style={{ fontSize: 24, marginBottom: 8 }}>Plano PRO</h3>
          <p style={{ marginBottom: 16 }}>
            Ideal para quem quer usar a IA com mais força no dia a dia.
          </p>

          <p style={{ fontSize: 32, fontWeight: 800, marginBottom: 20 }}>
            R$ 29,90/mês
          </p>

          <a
            href="COLE_AQUI_O_SEU_LINK_DE_PAGAMENTO_ASAAS"
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-block",
              padding: "14px 22px",
              borderRadius: 10,
              textDecoration: "none",
              border: "1px solid #111",
              fontWeight: 700
            }}
          >
            Assinar agora
          </a>
        </div>
      </section>

      <section style={{ padding: "24px 0 48px 0" }}>
        <h2 style={{ fontSize: 28, marginBottom: 12 }}>Comece hoje</h2>
        <p style={{ marginBottom: 16 }}>
          Teste a plataforma, conheça os recursos e faça o upgrade quando quiser.
        </p>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link
            href="/chat"
            style={{
              padding: "14px 22px",
              borderRadius: 10,
              textDecoration: "none",
              border: "1px solid #111",
              fontWeight: 700
            }}
          >
            Abrir chat
          </Link>

          <Link
            href="/login"
            style={{
              padding: "14px 22px",
              borderRadius: 10,
              textDecoration: "none",
              border: "1px solid #111",
              fontWeight: 700
            }}
          >
            Entrar
          </Link>
        </div>
      </section>
    </main>
  );
}