"use client";

import { useState } from "react";
import Link from "next/link";

export default function TransportePage() {
  const [form, setForm] = useState({
    nome: "",
    tipo: "",
    cidade: "",
    estado: "",
    capacidade: "",
    whatsapp: "",
    observacoes: "",
  });

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    alert("Cadastro de transporte salvo (mock inicial). Próximo passo: integrar com banco de dados.");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(34,197,94,0.12), transparent 0%, transparent 26%), radial-gradient(circle at right top, rgba(20,184,166,0.12), transparent 0%, transparent 20%), linear-gradient(180deg, #041018 0%, #02060d 100%)",
        color: "#eef6ff",
        overflowX: "hidden",
      }}
    >
      <section
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "24px 16px 88px",
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
          <Link href="/locadora" style={secondaryButton}>
            ← Voltar para Locadora
          </Link>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 14px",
              borderRadius: 999,
              background: "rgba(34,197,94,0.10)",
              border: "1px solid rgba(34,197,94,0.24)",
              color: "#b9f7cf",
              fontWeight: 800,
              fontSize: 13,
            }}
          >
            <span aria-hidden="true">🚛</span>
            <span>Cegonheiros e transporte</span>
          </div>
        </div>

        <div
          className="aurora-transporte-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 0.95fr) minmax(0, 1.05fr)",
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
                fontSize: "clamp(34px, 7vw, 62px)",
                lineHeight: 1.02,
                letterSpacing: "-0.04em",
                fontWeight: 900,
              }}
            >
              Transporte de veículos em todo o Brasil
            </h1>

            <p
              style={{
                marginTop: 18,
                marginBottom: 0,
                color: "#d5e5f7",
                fontSize: "clamp(17px, 3.7vw, 21px)",
                lineHeight: 1.72,
                maxWidth: 760,
              }}
            >
              Cadastre cegonheiros, transportadores e prestadores de serviço
              para atender locadoras, empresas e operações logísticas em todo o
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
              <div style={pillStyle}>Cegonha</div>
              <div style={pillStyle}>Guincho</div>
              <div style={pillStyle}>Plataforma</div>
              <div style={pillStyle}>WhatsApp direto</div>
            </div>

            <div style={infoBox}>
              <div style={infoLabel}>ATENÇÃO</div>
              <div style={infoText}>
                Para transporte de veículos, trabalhe preferencialmente com
                prestadores que possuam seguro ativo, documentação regular e
                histórico confiável. Evite transtornos. Trabalhe sempre com
                segurança.
              </div>
            </div>

            <div style={warningBox}>
              <div style={warningLabel}>RESPONSABILIDADE</div>
              <div style={warningText}>
                A Aurora IA atua apenas como elo virtual entre empresas,
                locadoras e prestadores. A verificação de documentos, seguro,
                contratação, pagamento e responsabilidade operacional são de
                total responsabilidade da empresa contratante.
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
              <span aria-hidden="true">✍️</span>
              <span>Novo prestador</span>
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
              Cadastrar transporte
            </h2>

            <p
              style={{
                margin: "0 0 20px",
                color: "#bcd3ea",
                fontSize: 15,
                lineHeight: 1.65,
              }}
            >
              Preencha os dados principais do cegonheiro ou transportador.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="aurora-transporte-form-grid" style={formGrid}>
                <Field
                  label="Nome ou empresa"
                  value={form.nome}
                  onChange={(value) => update("nome", value)}
                  placeholder="Nome do prestador ou empresa"
                />

                <Field
                  label="Tipo"
                  value={form.tipo}
                  onChange={(value) => update("tipo", value)}
                  placeholder="Cegonha, guincho, plataforma..."
                />

                <Field
                  label="Cidade"
                  value={form.cidade}
                  onChange={(value) => update("cidade", value)}
                  placeholder="Cidade de atuação"
                />

                <Field
                  label="Estado"
                  value={form.estado}
                  onChange={(value) => update("estado", value)}
                  placeholder="Ex.: MG"
                />

                <Field
                  label="Capacidade"
                  value={form.capacidade}
                  onChange={(value) => update("capacidade", value)}
                  placeholder="Ex.: 10 veículos"
                />

                <Field
                  label="WhatsApp"
                  value={form.whatsapp}
                  onChange={(value) => update("whatsapp", value)}
                  placeholder="(31) 99999-0000"
                />
              </div>

              <div style={{ marginTop: 14 }}>
                <label style={labelStyle}>Observações</label>
                <textarea
                  value={form.observacoes}
                  onChange={(event) => update("observacoes", event.target.value)}
                  placeholder="Ex.: Somente transporte com seguro. Rotas atendidas. Horários. Detalhes importantes."
                  style={textareaStyle}
                  rows={5}
                />
              </div>

              <button
                type="submit"
                style={{
                  width: "100%",
                  height: 54,
                  border: 0,
                  borderRadius: 16,
                  marginTop: 16,
                  cursor: "pointer",
                  fontWeight: 900,
                  fontSize: 17,
                  color: "#04110a",
                  background: "linear-gradient(135deg, #22c55e, #86efac)",
                  boxShadow: "0 18px 40px rgba(34,197,94,0.25)",
                }}
              >
                Salvar transporte
              </button>
            </form>
          </aside>
        </div>
      </section>

      <style jsx global>{`
        @media (max-width: 980px) {
          .aurora-transporte-grid {
            grid-template-columns: 1fr !important;
          }

          .aurora-transporte-form-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        style={inputStyle}
      />
    </div>
  );
}

const secondaryButton: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 46,
  padding: "0 16px",
  borderRadius: 14,
  textDecoration: "none",
  fontWeight: 700,
  fontSize: 14,
  color: "#e5e7eb",
  border: "1px solid rgba(148,163,184,0.28)",
  background: "rgba(15,23,42,0.62)",
  cursor: "pointer",
};

const formGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 14,
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: 8,
  color: "#dcecff",
  fontWeight: 800,
  fontSize: 14,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 52,
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.06)",
  color: "#ffffff",
  outline: "none",
  padding: "0 16px",
  fontSize: 15,
  boxSizing: "border-box",
};

const textareaStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.06)",
  color: "#ffffff",
  outline: "none",
  padding: "14px 16px",
  fontSize: 15,
  boxSizing: "border-box",
  resize: "vertical",
};

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

const infoBox: React.CSSProperties = {
  marginTop: 28,
  padding: 18,
  borderRadius: 22,
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.07)",
};

const infoLabel: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: "0.2em",
  color: "#8db5d9",
  marginBottom: 12,
};

const infoText: React.CSSProperties = {
  color: "#f2f8ff",
  fontSize: 16,
  lineHeight: 1.7,
};

const warningBox: React.CSSProperties = {
  marginTop: 18,
  padding: 18,
  borderRadius: 22,
  background: "rgba(239,68,68,0.08)",
  border: "1px solid rgba(239,68,68,0.18)",
};

const warningLabel: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: "0.2em",
  color: "#ffb4b4",
  marginBottom: 12,
};

const warningText: React.CSSProperties = {
  color: "#ffe5e5",
  fontSize: 15,
  lineHeight: 1.7,
};