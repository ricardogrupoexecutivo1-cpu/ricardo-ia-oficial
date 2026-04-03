"use client";

import { useState } from "react";
import Link from "next/link";
import type { CSSProperties } from "react";

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
    alert("Cadastro de transporte salvo (mock inicial).");
  }

  return (
    <main style={mainStyle}>
      <section style={containerStyle}>
        {/* HEADER */}
        <div style={headerStyle}>
          <Link href="/locadora" style={navBtnStyle}>
            ← Voltar para Locadora
          </Link>

          <div style={badgeStyle}>🚛 Transporte Aurora</div>
        </div>

        <div style={gridStyle}>
          {/* LADO ESQUERDO */}
          <article style={cardStyle}>
            <div style={chipStyle}>Aurora Locadoras</div>

            <h1 style={titleStyle}>
              Transporte de veículos em todo o Brasil
            </h1>

            <p style={textStyle}>
              Cadastre cegonheiros, transportadores e prestadores para atender
              locadoras e empresas com mais organização e visibilidade dentro da
              Aurora.
            </p>

            <div style={pillWrapStyle}>
              <div style={pillStyle}>Cegonha</div>
              <div style={pillStyle}>Guincho</div>
              <div style={pillStyle}>Plataforma</div>
              <div style={pillStyle}>WhatsApp direto</div>
            </div>

            <div style={infoBoxStyle}>
              <strong>Atenção:</strong> Trabalhe com transportadores com seguro,
              documentação regular e histórico confiável.
            </div>

            <div style={warningBoxStyle}>
              <strong>Responsabilidade:</strong> A Aurora atua como conexão.
              A contratação e validação são responsabilidade da empresa.
            </div>
          </article>

          {/* FORM */}
          <aside style={formCardStyle}>
            <div style={chipGreenStyle}>Novo prestador</div>

            <h2 style={formTitleStyle}>Cadastrar transporte</h2>

            <form onSubmit={handleSubmit}>
              <div style={formGridStyle}>
                <Field label="Nome" value={form.nome} onChange={(v) => update("nome", v)} />
                <Field label="Tipo" value={form.tipo} onChange={(v) => update("tipo", v)} />
                <Field label="Cidade" value={form.cidade} onChange={(v) => update("cidade", v)} />
                <Field label="Estado" value={form.estado} onChange={(v) => update("estado", v)} />
                <Field label="Capacidade" value={form.capacidade} onChange={(v) => update("capacidade", v)} />
                <Field label="WhatsApp" value={form.whatsapp} onChange={(v) => update("whatsapp", v)} />
              </div>

              <textarea
                style={textareaStyle}
                placeholder="Observações..."
                value={form.observacoes}
                onChange={(e) => update("observacoes", e.target.value)}
              />

              <button style={submitBtnStyle}>Salvar transporte</button>
            </form>
          </aside>
        </div>
      </section>
    </main>
  );
}

/* COMPONENTE */
function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input style={inputStyle} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

/* ESTILOS */
const mainStyle: CSSProperties = {
  minHeight: "100vh",
  background:
    "linear-gradient(180deg, #eef6ff 0%, #f7fbff 40%, #edf7f3 100%)",
  color: "#0f172a",
};

const containerStyle: CSSProperties = {
  maxWidth: 1200,
  margin: "0 auto",
  padding: 20,
  display: "grid",
  gap: 20,
};

const headerStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  flexWrap: "wrap",
};

const navBtnStyle: CSSProperties = {
  padding: "10px 14px",
  borderRadius: 999,
  background: "#fff",
  border: "1px solid #e5e7eb",
  textDecoration: "none",
};

const badgeStyle: CSSProperties = {
  background: "#e0ecff",
  padding: "6px 12px",
  borderRadius: 999,
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 20,
};

const cardStyle: CSSProperties = {
  background: "#fff",
  padding: 20,
  borderRadius: 20,
  border: "1px solid #e5e7eb",
};

const formCardStyle: CSSProperties = {
  background: "#fff",
  padding: 20,
  borderRadius: 20,
  border: "1px solid #e5e7eb",
};

const chipStyle: CSSProperties = {
  background: "#e0ecff",
  padding: "6px 10px",
  borderRadius: 999,
};

const chipGreenStyle: CSSProperties = {
  background: "#dcfce7",
  padding: "6px 10px",
  borderRadius: 999,
};

const titleStyle: CSSProperties = {
  fontSize: 28,
  fontWeight: 900,
};

const formTitleStyle: CSSProperties = {
  fontSize: 22,
  fontWeight: 900,
};

const textStyle: CSSProperties = {
  color: "#475569",
};

const pillWrapStyle: CSSProperties = {
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
};

const pillStyle: CSSProperties = {
  background: "#f1f5f9",
  padding: "6px 10px",
  borderRadius: 999,
};

const infoBoxStyle: CSSProperties = {
  marginTop: 10,
  padding: 10,
  background: "#f8fafc",
  borderRadius: 10,
};

const warningBoxStyle: CSSProperties = {
  marginTop: 10,
  padding: 10,
  background: "#fee2e2",
  borderRadius: 10,
};

const formGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 10,
};

const labelStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
};

const inputStyle: CSSProperties = {
  padding: 10,
  borderRadius: 10,
  border: "1px solid #e5e7eb",
};

const textareaStyle: CSSProperties = {
  width: "100%",
  marginTop: 10,
  padding: 10,
  borderRadius: 10,
  border: "1px solid #e5e7eb",
};

const submitBtnStyle: CSSProperties = {
  marginTop: 12,
  width: "100%",
  background: "#22c55e",
  color: "#fff",
  padding: 12,
  borderRadius: 12,
};