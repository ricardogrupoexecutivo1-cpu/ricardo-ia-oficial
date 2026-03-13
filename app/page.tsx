"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Lang = "pt" | "en" | "es";

const content = {
  pt: {
    badge: "IA brasileira disponível para o mundo",
    title: "Aurora IA",
    subtitle:
      "A plataforma de IA brasileira para chat, marketing, imagens e produtividade.",
    description:
      "Converse com a Aurora, gere campanhas de marketing automáticas, crie imagens, use memória inteligente e tenha uma IA moderna para pessoas e empresas.",
    openChat: "Testar Aurora Agora",
    createAccount: "Criar Conta",
    seePlans: "Ver Planos",
    features: [
      "✔ Chat inteligente",
      "✔ Imagens com IA",
      "✔ Marketing automático",
      "✔ Memória por usuário",
    ],
    specialPlan: "Plano especial inicial",
    foundersTitle: "Founders Aurora",
    foundersPrice: "R$ 29,90/mês",
    foundersNote: "preço garantido por até 24 meses",
    foundersBenefits: [
      "✅ acesso à Aurora IA",
      "✅ chat com memória",
      "✅ geração de campanhas",
      "✅ geração de imagens",
      "✅ suporte na fase inicial",
    ],
    foundersOffer: "Oferta inicial limitada para os primeiros 500 usuários.",
    payment: "Pagamento seguro via Asaas.",
    paymentMethods: "Pix • Cartão • Boleto • Assinatura mensal.",
    signPlan: "Assinar Plano Founders",
    influencerTitle: "Plano Influencer",
    influencerPrice: "R$ 9,90/mês",
    influencerNote: "ideal para divulgar e crescer junto com a Aurora",
    influencerBenefits: [
      "✅ acesso à Aurora IA",
      "✅ geração de imagens",
      "✅ marketing para redes sociais",
      "✅ preço acessível para criadores",
      "✅ ajuda na divulgação da plataforma",
    ],
    influencerButton: "Assinar Plano Influencer",
    memoryTitle: "Chat com memória",
    memoryText:
      "A Aurora lembra contexto do usuário e melhora a experiência a cada nova conversa.",
    marketingTitle: "Marketing automático",
    marketingText:
      "Crie campanhas, copies, hashtags e imagens prontas para divulgação em poucos segundos.",
    brazilTitle: "IA brasileira",
    brazilText:
      "Plataforma criada no Brasil, com visão de crescimento global e foco em utilidade real.",
    mobileTitle: "Instale a Aurora IA no seu celular",
    mobileText:
      "Acesse pelo celular e use a opção “Adicionar à tela inicial” para instalar a Aurora IA como aplicativo.",
    mobileButton: "Abrir Aurora no celular",
    officialLink: "Link oficial",
    login: "Login",
  },
  en: {
    badge: "Brazilian AI available to the world",
    title: "Aurora AI",
    subtitle:
      "The Brazilian AI platform for chat, marketing, images, and productivity.",
    description:
      "Talk to Aurora, generate automated marketing campaigns, create images, use smart memory, and access a modern AI platform for people and businesses.",
    openChat: "Try Aurora Now",
    createAccount: "Create Account",
    seePlans: "View Plans",
    features: [
      "✔ Smart chat",
      "✔ AI images",
      "✔ Automatic marketing",
      "✔ Per-user memory",
    ],
    specialPlan: "Special launch plan",
    foundersTitle: "Aurora Founders",
    foundersPrice: "R$ 29.90/month",
    foundersNote: "price locked for up to 24 months",
    foundersBenefits: [
      "✅ access to Aurora AI",
      "✅ chat with memory",
      "✅ campaign generation",
      "✅ image generation",
      "✅ early-stage support",
    ],
    foundersOffer: "Limited early offer for the first 500 users.",
    payment: "Secure payment via Asaas.",
    paymentMethods: "Pix • Credit Card • Boleto • Monthly subscription.",
    signPlan: "Subscribe to Founders Plan",
    influencerTitle: "Influencer Plan",
    influencerPrice: "R$ 9.90/month",
    influencerNote: "ideal for creators who want to grow with Aurora",
    influencerBenefits: [
      "✅ access to Aurora AI",
      "✅ image generation",
      "✅ social media marketing tools",
      "✅ affordable creator pricing",
      "✅ helps promote the platform",
    ],
    influencerButton: "Subscribe to Influencer Plan",
    memoryTitle: "Memory-based chat",
    memoryText:
      "Aurora remembers user context and improves the experience with every new conversation.",
    marketingTitle: "Automatic marketing",
    marketingText:
      "Create campaigns, copies, hashtags and ready-to-publish images in seconds.",
    brazilTitle: "Brazilian AI",
    brazilText:
      "A platform built in Brazil with a global growth vision and focus on real utility.",
    mobileTitle: "Install Aurora AI on your phone",
    mobileText:
      "Access it on mobile and use “Add to Home Screen” to install Aurora AI as an app.",
    mobileButton: "Open Aurora on mobile",
    officialLink: "Official link",
    login: "Login",
  },
  es: {
    badge: "IA brasileña disponible para el mundo",
    title: "Aurora IA",
    subtitle:
      "La plataforma brasileña de IA para chat, marketing, imágenes y productividad.",
    description:
      "Habla con Aurora, genera campañas de marketing automáticas, crea imágenes, usa memoria inteligente y accede a una IA moderna para personas y empresas.",
    openChat: "Probar Aurora Ahora",
    createAccount: "Crear Cuenta",
    seePlans: "Ver Planes",
    features: [
      "✔ Chat inteligente",
      "✔ Imágenes con IA",
      "✔ Marketing automático",
      "✔ Memoria por usuario",
    ],
    specialPlan: "Plan inicial especial",
    foundersTitle: "Founders Aurora",
    foundersPrice: "R$ 29,90/mes",
    foundersNote: "precio garantizado por hasta 24 meses",
    foundersBenefits: [
      "✅ acceso a Aurora IA",
      "✅ chat con memoria",
      "✅ generación de campañas",
      "✅ generación de imágenes",
      "✅ soporte en la fase inicial",
    ],
    foundersOffer: "Oferta inicial limitada para los primeros 500 usuarios.",
    payment: "Pago seguro vía Asaas.",
    paymentMethods: "Pix • Tarjeta • Boleto • Suscripción mensual.",
    signPlan: "Suscribirse al Plan Founders",
    influencerTitle: "Plan Influencer",
    influencerPrice: "R$ 9,90/mes",
    influencerNote: "ideal para creadores que quieran crecer con Aurora",
    influencerBenefits: [
      "✅ acceso a Aurora IA",
      "✅ generación de imágenes",
      "✅ marketing para redes sociales",
      "✅ precio accesible para creadores",
      "✅ ayuda a divulgar la plataforma",
    ],
    influencerButton: "Suscribirse al Plan Influencer",
    memoryTitle: "Chat con memoria",
    memoryText:
      "Aurora recuerda el contexto del usuario y mejora la experiencia en cada nueva conversación.",
    marketingTitle: "Marketing automático",
    marketingText:
      "Crea campañas, copies, hashtags e imágenes listas para publicar en segundos.",
    brazilTitle: "IA brasileña",
    brazilText:
      "Plataforma creada en Brasil, con visión de crecimiento global y enfoque en utilidad real.",
    mobileTitle: "Instala Aurora IA en tu celular",
    mobileText:
      "Accede desde el móvil y usa “Agregar a la pantalla de inicio” para instalar Aurora IA como aplicación.",
    mobileButton: "Abrir Aurora en el móvil",
    officialLink: "Enlace oficial",
    login: "Login",
  },
};

export default function HomePage() {
  const [lang, setLang] = useState<Lang>("pt");

  useEffect(() => {
    const saved = localStorage.getItem("aurora_lang") as Lang | null;

    if (saved === "pt" || saved === "en" || saved === "es") {
      setLang(saved);
      return;
    }

    const browserLang = (navigator.language || "").toLowerCase();

    if (browserLang.startsWith("en")) {
      localStorage.setItem("aurora_lang", "en");
      setLang("en");
      return;
    }

    if (browserLang.startsWith("es")) {
      localStorage.setItem("aurora_lang", "es");
      setLang("es");
      return;
    }

    localStorage.setItem("aurora_lang", "pt");
    setLang("pt");
  }, []);

  const t = content[lang];

  function openFounders() {
    window.open("https://www.asaas.com/c/ayfhkldtnk1osf37", "_blank");
  }

  function openInfluencer() {
    window.open("https://www.asaas.com/c/ayfhkldtnk1osf37", "_blank");
  }

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 20px" }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          marginBottom: 30,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: 34, fontWeight: "bold" }}>{t.title}</h1>
          <p style={{ marginTop: 8 }}>{t.badge}</p>
        </div>

        <nav style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href="/chat">{t.openChat}</Link>
          <Link href="/login">{t.login}</Link>
          <Link href="/planos">{t.seePlans}</Link>
        </nav>
      </header>

      <section style={{ marginTop: 30 }}>
        <h2 style={{ fontSize: 38, lineHeight: 1.15 }}>{t.subtitle}</h2>
        <p style={{ fontSize: 18, marginTop: 16, maxWidth: 850 }}>{t.description}</p>

        <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
          <Link
            href="/chat"
            style={{
              padding: "14px 20px",
              borderRadius: 12,
              background: "#111",
              color: "#fff",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            {t.openChat}
          </Link>

          <Link
            href="/login"
            style={{
              padding: "14px 20px",
              borderRadius: 12,
              border: "1px solid #ccc",
              textDecoration: "none",
              fontWeight: "bold",
              color: "#111",
            }}
          >
            {t.createAccount}
          </Link>

          <Link
            href="/planos"
            style={{
              padding: "14px 20px",
              borderRadius: 12,
              border: "1px solid #ccc",
              textDecoration: "none",
              fontWeight: "bold",
              color: "#111",
            }}
          >
            {t.seePlans}
          </Link>
        </div>

        <div style={{ marginTop: 28, display: "grid", gap: 10 }}>
          {t.features.map((item) => (
            <div key={item}>{item}</div>
          ))}
        </div>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 20,
          marginTop: 40,
        }}
      >
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: 18,
            padding: 24,
            background: "#fafafa",
          }}
        >
          <p style={{ margin: 0, opacity: 0.8 }}>{t.specialPlan}</p>
          <h3 style={{ fontSize: 28, marginTop: 10 }}>{t.foundersTitle}</h3>
          <p style={{ fontSize: 24, fontWeight: "bold", marginTop: 10 }}>{t.foundersPrice}</p>
          <p>{t.foundersNote}</p>

          <div style={{ marginTop: 18, display: "grid", gap: 8 }}>
            {t.foundersBenefits.map((item) => (
              <div key={item}>{item}</div>
            ))}
          </div>

          <p style={{ marginTop: 18 }}>{t.foundersOffer}</p>
          <p>{t.payment}</p>
          <p>{t.paymentMethods}</p>

          <button
            onClick={openFounders}
            style={{
              marginTop: 20,
              padding: "14px 18px",
              borderRadius: 12,
              border: "none",
              background: "#111",
              color: "#fff",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {t.signPlan}
          </button>
        </div>

        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: 18,
            padding: 24,
            background: "#fffdf6",
          }}
        >
          <p style={{ margin: 0, opacity: 0.8 }}>{t.specialPlan}</p>
          <h3 style={{ fontSize: 28, marginTop: 10 }}>{t.influencerTitle}</h3>
          <p style={{ fontSize: 24, fontWeight: "bold", marginTop: 10 }}>{t.influencerPrice}</p>
          <p>{t.influencerNote}</p>

          <div style={{ marginTop: 18, display: "grid", gap: 8 }}>
            {t.influencerBenefits.map((item) => (
              <div key={item}>{item}</div>
            ))}
          </div>

          <p style={{ marginTop: 18 }}>{t.payment}</p>
          <p>{t.paymentMethods}</p>

          <button
            onClick={openInfluencer}
            style={{
              marginTop: 20,
              padding: "14px 18px",
              borderRadius: 12,
              border: "1px solid #111",
              background: "transparent",
              color: "#111",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {t.influencerButton}
          </button>
        </div>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 20,
          marginTop: 45,
        }}
      >
        <div style={{ border: "1px solid #eee", borderRadius: 16, padding: 20 }}>
          <h3>{t.memoryTitle}</h3>
          <p>{t.memoryText}</p>
        </div>

        <div style={{ border: "1px solid #eee", borderRadius: 16, padding: 20 }}>
          <h3>{t.marketingTitle}</h3>
          <p>{t.marketingText}</p>
        </div>

        <div style={{ border: "1px solid #eee", borderRadius: 16, padding: 20 }}>
          <h3>{t.brazilTitle}</h3>
          <p>{t.brazilText}</p>
        </div>
      </section>

      <section
        style={{
          marginTop: 45,
          border: "1px solid #eee",
          borderRadius: 16,
          padding: 24,
        }}
      >
        <h3>{t.mobileTitle}</h3>
        <p>{t.mobileText}</p>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 16 }}>
          <a
            href="https://ricardoiaoficial.com"
            target="_blank"
            rel="noreferrer"
            style={{
              padding: "12px 18px",
              borderRadius: 12,
              background: "#111",
              color: "#fff",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            {t.mobileButton}
          </a>

          <a
            href="https://ricardoiaoficial.com"
            target="_blank"
            rel="noreferrer"
            style={{
              padding: "12px 18px",
              borderRadius: 12,
              border: "1px solid #ccc",
              textDecoration: "none",
              color: "#111",
              fontWeight: "bold",
            }}
          >
            {t.officialLink}
          </a>
        </div>
      </section>
    </main>
  );
}