"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type FormState = {
  fullName: string;
  companyName: string;
  whatsapp: string;
  email: string;
  city: string;
  segment: string;
};

const INITIAL_STATE: FormState = {
  fullName: "",
  companyName: "",
  whatsapp: "",
  email: "",
  city: "",
  segment: "",
};

export default function CadastroPage() {
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const progress = useMemo(() => {
    const values = Object.values(form);
    const filled = values.filter((value) => String(value || "").trim()).length;
    return Math.round((filled / values.length) * 100);
  }, [form]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function persistLightRegistration() {
    const payload = {
      ...form,
      createdAt: new Date().toISOString(),
      source: "cadastro-entrada-ecosistema",
    };

    if (typeof window !== "undefined") {
      localStorage.setItem("aurora_light_registration", JSON.stringify(payload));

      if (form.email.trim()) {
        const normalizedEmail = form.email.trim().toLowerCase();
        localStorage.setItem("aurora_user_email", normalizedEmail);
        localStorage.setItem("userEmail", normalizedEmail);
        localStorage.setItem("email", normalizedEmail);
        localStorage.setItem("aurora_email", normalizedEmail);
      }

      if (form.fullName.trim()) {
        localStorage.setItem("aurora_user_name", form.fullName.trim());
      }

      if (form.companyName.trim()) {
        localStorage.setItem("aurora_company_name", form.companyName.trim());
      }

      if (form.whatsapp.trim()) {
        localStorage.setItem("aurora_whatsapp", form.whatsapp.trim());
      }

      localStorage.setItem(
        "aurora_guest_access",
        JSON.stringify({
          startedAt: new Date().toISOString(),
          source: "cadastro-entrada-ecosistema",
        }),
      );
    }
  }

  function saveLightRegistration() {
    try {
      setError("");
      setMessage("");

      persistLightRegistration();

      setMessage(
        "Cadastro inicial salvo com sucesso. Agora escolha sua área principal no ecossistema e continue explorando sem bloqueio. Sistema em constante atualização e pode haver momentos de instabilidade durante melhorias.",
      );
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Erro ao salvar cadastro inicial.",
      );
    }
  }

  function goToArea(path: string) {
    try {
      setError("");
      setMessage("");
      persistLightRegistration();
      window.location.href = path;
    } catch (goError) {
      setError(
        goError instanceof Error
          ? goError.message
          : "Erro ao direcionar para a área selecionada.",
      );
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(34,197,94,0.14), transparent 18%), radial-gradient(circle at right top, rgba(59,130,246,0.12), transparent 22%), linear-gradient(180deg, #02100c 0%, #061711 40%, #020404 100%)",
        color: "#ecfdf5",
        padding: "24px 16px 80px",
      }}
    >
      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          display: "grid",
          gap: 18,
        }}
      >
        <section
          style={{
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(6,16,13,0.84)",
            backdropFilter: "blur(10px)",
            borderRadius: 28,
            padding: "22px 20px",
            boxShadow: "0 18px 60px rgba(0,0,0,0.24)",
            display: "grid",
            gap: 18,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 14,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <div style={{ display: "grid", gap: 6 }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  color: "#86efac",
                  textTransform: "uppercase",
                }}
              >
                ricardoiaoficial.com
              </div>

              <div
                style={{
                  fontSize: "clamp(28px, 5vw, 44px)",
                  fontWeight: 900,
                  lineHeight: 1.05,
                }}
              >
                Escolha sua área principal no ecossistema
              </div>

              <div
                style={{
                  color: "rgba(236,253,245,0.80)",
                  lineHeight: 1.7,
                  fontSize: 16,
                  maxWidth: 900,
                }}
              >
                Entre com uma jornada leve, rápida e estratégica. Salve seus dados
                iniciais e siga direto para a área que mais combina com seu objetivo.
                O chat fica como apoio, mas o foco principal é colocar você dentro
                do ecossistema certo desde o primeiro clique.
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <Link href="/" style={secondaryButtonStyle}>
                Voltar para home
              </Link>
              <Link href="/explorar" style={secondaryButtonStyle}>
                Explorar negócios
              </Link>
            </div>
          </div>

          <div
            style={{
              borderRadius: 18,
              padding: "14px 16px",
              border: "1px solid rgba(34,197,94,0.18)",
              background: "rgba(34,197,94,0.08)",
              display: "grid",
              gap: 8,
            }}
          >
            <div
              style={{
                fontSize: 13,
                color: "#bbf7d0",
                fontWeight: 800,
              }}
            >
              Progresso do cadastro inicial
            </div>

            <div
              style={{
                width: "100%",
                height: 10,
                borderRadius: 999,
                background: "rgba(255,255,255,0.08)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: "100%",
                  background: "linear-gradient(90deg, #22c55e, #4ade80)",
                }}
              />
            </div>

            <div
              style={{
                fontSize: 13,
                color: "rgba(236,253,245,0.78)",
              }}
            >
              {progress}% preenchido
            </div>
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1.02fr 0.98fr",
            gap: 18,
          }}
        >
          <div
            style={{
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(7,18,13,0.88)",
              borderRadius: 28,
              padding: "22px 20px",
              boxShadow: "0 18px 60px rgba(0,0,0,0.20)",
              display: "grid",
              gap: 16,
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 26,
                }}
              >
                Seus dados iniciais
              </h2>
              <div
                style={{
                  marginTop: 8,
                  color: "rgba(236,253,245,0.74)",
                  lineHeight: 1.6,
                }}
              >
                Preencha o que fizer sentido agora. Nada aqui trava seu acesso.
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 12,
              }}
            >
              <label style={{ display: "grid", gap: 8 }}>
                <span style={labelStyle}>Nome completo</span>
                <input
                  value={form.fullName}
                  onChange={(e) => updateField("fullName", e.target.value)}
                  placeholder="Ex.: Ricardo Leonardo Moreira"
                  style={inputStyle}
                />
              </label>

              <label style={{ display: "grid", gap: 8 }}>
                <span style={labelStyle}>Empresa ou marca</span>
                <input
                  value={form.companyName}
                  onChange={(e) => updateField("companyName", e.target.value)}
                  placeholder="Ex.: Aurora IA"
                  style={inputStyle}
                />
              </label>

              <label style={{ display: "grid", gap: 8 }}>
                <span style={labelStyle}>WhatsApp</span>
                <input
                  value={form.whatsapp}
                  onChange={(e) => updateField("whatsapp", e.target.value)}
                  placeholder="Ex.: (31) 99999-9999"
                  style={inputStyle}
                />
              </label>

              <label style={{ display: "grid", gap: 8 }}>
                <span style={labelStyle}>E-mail</span>
                <input
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  placeholder="Ex.: contato@empresa.com"
                  style={inputStyle}
                />
              </label>

              <label style={{ display: "grid", gap: 8 }}>
                <span style={labelStyle}>Cidade</span>
                <input
                  value={form.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  placeholder="Ex.: Belo Horizonte"
                  style={inputStyle}
                />
              </label>

              <label style={{ display: "grid", gap: 8 }}>
                <span style={labelStyle}>Segmento</span>
                <input
                  value={form.segment}
                  onChange={(e) => updateField("segment", e.target.value)}
                  placeholder="Ex.: Agro, locadora, imóveis, serviços..."
                  style={inputStyle}
                />
              </label>
            </div>

            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                onClick={saveLightRegistration}
                style={primaryButtonStyle}
              >
                Salvar cadastro inicial
              </button>

              <button
                type="button"
                onClick={() => goToArea("/explorar")}
                style={secondaryActionStyle}
              >
                Ver oportunidades agora
              </button>
            </div>

            {message ? (
              <div
                style={{
                  borderRadius: 16,
                  padding: "14px 16px",
                  background: "rgba(34,197,94,0.12)",
                  border: "1px solid rgba(34,197,94,0.20)",
                  color: "#bbf7d0",
                  lineHeight: 1.6,
                }}
              >
                {message}
              </div>
            ) : null}

            {error ? (
              <div
                style={{
                  borderRadius: 16,
                  padding: "14px 16px",
                  background: "rgba(239,68,68,0.12)",
                  border: "1px solid rgba(239,68,68,0.20)",
                  color: "#fecaca",
                  lineHeight: 1.6,
                }}
              >
                {error}
              </div>
            ) : null}
          </div>

          <div
            style={{
              display: "grid",
              gap: 18,
            }}
          >
            <section
              style={{
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(7,18,13,0.88)",
                borderRadius: 28,
                padding: "22px 20px",
                boxShadow: "0 18px 60px rgba(0,0,0,0.20)",
                display: "grid",
                gap: 14,
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: "#86efac",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Entrada profissional
              </div>

              <div
                style={{
                  fontSize: 24,
                  fontWeight: 900,
                  lineHeight: 1.15,
                }}
              >
                Escolha o setor certo desde o primeiro acesso
              </div>

              <div
                style={{
                  color: "rgba(236,253,245,0.76)",
                  lineHeight: 1.7,
                  fontSize: 15,
                }}
              >
                Direcione sua jornada para a área principal do seu negócio. Isso
                aumenta clareza, melhora a experiência e deixa o chat como apoio
                estratégico em segundo plano.
              </div>
            </section>

            <section
              style={{
                border: "1px solid rgba(255,255,255,0.08)",
                background:
                  "linear-gradient(135deg, rgba(34,197,94,0.10), rgba(59,130,246,0.08))",
                borderRadius: 28,
                padding: "22px 20px",
                display: "grid",
                gap: 12,
              }}
            >
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 900,
                  lineHeight: 1.15,
                }}
              >
                Acesse sua área principal
              </div>

              <div
                style={{
                  color: "rgba(236,253,245,0.80)",
                  lineHeight: 1.7,
                  fontSize: 15,
                }}
              >
                Escolha a entrada ideal para começar agora com mais foco.
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: 12,
                }}
              >
                {[
                  {
                    title: "Agro",
                    note: "Operação agrícola e oportunidades do setor.",
                    path: "/agro",
                  },
                  {
                    title: "Locadora",
                    note: "Empresas, motoristas e operação comercial.",
                    path: "/locadora",
                  },
                  {
                    title: "Imóveis",
                    note: "Busca, cadastros e presença imobiliária.",
                    path: "/imoveis",
                  },
                  {
                    title: "Serviços e negócios",
                    note: "Entrada geral para explorar o ecossistema.",
                    path: "/explorar",
                  },
                ].map((item) => (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => goToArea(item.path)}
                    style={sectorButtonStyle}
                  >
                    <span
                      style={{
                        fontSize: 18,
                        fontWeight: 900,
                        color: "#ecfdf5",
                        lineHeight: 1.2,
                      }}
                    >
                      {item.title}
                    </span>

                    <span
                      style={{
                        fontSize: 13,
                        color: "rgba(236,253,245,0.72)",
                        lineHeight: 1.5,
                      }}
                    >
                      {item.note}
                    </span>

                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 800,
                        color: "#86efac",
                      }}
                    >
                      Entrar →
                    </span>
                  </button>
                ))}
              </div>

              <div
                style={{
                  marginTop: 4,
                  padding: "12px 14px",
                  borderRadius: 16,
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.03)",
                  color: "rgba(236,253,245,0.74)",
                  lineHeight: 1.6,
                  fontSize: 14,
                }}
              >
                Chat Aurora IA disponível como apoio estratégico, sem roubar o foco
                da entrada principal do usuário.
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}

const labelStyle: React.CSSProperties = {
  fontSize: 13,
  color: "rgba(236,253,245,0.76)",
  fontWeight: 700,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.04)",
  color: "#ecfdf5",
  padding: "13px 14px",
  outline: "none",
};

const primaryButtonStyle: React.CSSProperties = {
  border: "1px solid rgba(34,197,94,0.28)",
  background: "linear-gradient(135deg, #22c55e, #4ade80)",
  color: "#04110a",
  borderRadius: 16,
  padding: "14px 18px",
  fontWeight: 900,
  cursor: "pointer",
};

const secondaryActionStyle: React.CSSProperties = {
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.04)",
  color: "#ecfdf5",
  borderRadius: 16,
  padding: "14px 18px",
  fontWeight: 800,
  cursor: "pointer",
};

const secondaryButtonStyle: React.CSSProperties = {
  textDecoration: "none",
  color: "#ecfdf5",
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.04)",
  borderRadius: 14,
  padding: "12px 16px",
  fontWeight: 700,
  textAlign: "center",
};

const sectorButtonStyle: React.CSSProperties = {
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.03)",
  borderRadius: 18,
  padding: "16px 14px",
  display: "grid",
  gap: 8,
  textAlign: "left",
  cursor: "pointer",
};