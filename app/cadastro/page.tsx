"use client";

import { useState } from "react";

const segmentosFixos = [
  "Locadora / Rental",
  "Agro / Agriculture",
  "Mineração / Mining",
  "Imóveis / Real Estate",
  "Financeiro / Finance",
  "Transportes / Transport",
  "Logística / Logistics",
  "Construção / Construction",
  "Indústria / Industry",
  "Comércio / Commerce",
  "Tecnologia / Technology",
  "Marketing / Marketing",
  "Saúde / Healthcare",
  "Educação / Education",
  "Turismo / Tourism",
  "Jurídico / Legal",
  "Energia / Energy",
  "Alimentação / Food",
  "Motoristas / Drivers",
  "Prestação de Serviços / Services",
];

const atividadesFixas = [
  "Motorista fixo / Dedicated driver",
  "Motorista eventual / On-demand driver",
  "Fornecedor / Supplier",
  "Prestador de serviço / Service provider",
  "Vendas / Sales",
  "Compras / Purchasing",
  "Representação comercial / Sales representation",
  "Consultoria / Consulting",
  "Operação / Operations",
  "Manutenção / Maintenance",
  "Transporte / Transport",
  "Logística / Logistics",
  "Atendimento / Customer service",
  "Administração / Administration",
  "Financeiro / Finance",
];

const abrangencias = [
  "Local / Local",
  "Municipal / City",
  "Estadual / State",
  "Regional / Regional",
  "Nacional / National",
  "Internacional / International",
];

const initialForm = {
  area: [] as string[],
  atividades: [] as string[],
  abrangencia: "",
  segmentoPersonalizado: "",
  atividadePersonalizada: "",
  responsavel: "",
  empresa: "",
  cnpj: "",
  whatsapp: "",
  email: "",
  descricao: "",
};

export default function CadastroPage() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState<null | {
    empresa: string;
    responsavel: string;
    abrangencia: string;
  }>(null);

  function update(field: string, value: any) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function toggleArrayItem(field: "area" | "atividades", item: string, checked: boolean) {
    const atual = Array.isArray(form[field]) ? form[field] : [];

    if (checked) {
      update(field, [...atual, item]);
      return;
    }

    update(
      field,
      atual.filter((i: string) => i !== item)
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...form,
        area: Array.isArray(form.area) ? form.area : [],
        atividades: Array.isArray(form.atividades) ? form.atividades : [],
      };

      const res = await fetch("/api/cadastro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Erro ao salvar");
        setLoading(false);
        return;
      }

      setSuccessData({
        empresa: form.empresa || "Sua empresa",
        responsavel: form.responsavel || "Responsável",
        abrangencia: form.abrangencia || "Abrangência não informada",
      });

      setForm(initialForm);
    } catch {
      alert("Erro inesperado");
    } finally {
      setLoading(false);
    }
  }

  if (successData) {
    return (
      <main style={{ padding: "24px 0 60px", color: "#fff" }}>
        <section
          style={{
            maxWidth: 760,
            margin: "0 auto",
            background: "#12182b",
            borderRadius: 20,
            border: "1px solid rgba(255,255,255,0.08)",
            padding: 24,
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 74,
              height: 74,
              borderRadius: 999,
              background: "rgba(0,255,136,0.12)",
              border: "1px solid rgba(0,255,136,0.25)",
              fontSize: 34,
              marginBottom: 18,
            }}
          >
            ✅
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "clamp(28px, 5vw, 38px)",
              fontWeight: 800,
              lineHeight: 1.15,
            }}
          >
            Cadastro realizado com sucesso
          </h1>

          <p
            style={{
              marginTop: 14,
              fontSize: 16,
              lineHeight: 1.75,
              color: "rgba(255,255,255,0.82)",
            }}
          >
            Sua empresa já entrou na base da Aurora.
            <br />
            <span style={{ fontWeight: 700 }}>{successData.empresa}</span>
            {" • "}
            <span>{successData.abrangencia}</span>
          </p>

          <div
            style={{
              marginTop: 18,
              padding: 14,
              borderRadius: 14,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              textAlign: "left",
            }}
          >
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>
              Próximo passo
            </div>

            <div
              style={{
                fontSize: 14,
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.78)",
              }}
            >
              Para acessar depois, editar informações, acompanhar oportunidades e
              organizar usuários da sua empresa, crie seu login e senha pessoal.
            </div>

            <div
              style={{
                marginTop: 10,
                fontSize: 12,
                lineHeight: 1.6,
                color: "rgba(255,255,255,0.58)",
              }}
            >
              Create your personal access to manage your company later.
              <br />
              Crea tu acceso personal para administrar tu empresa después.
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 12,
              marginTop: 22,
            }}
          >
            <a
              href="/login"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 56,
                borderRadius: 14,
                textDecoration: "none",
                background: "#00ff88",
                color: "#04110b",
                fontWeight: 800,
                padding: "14px 18px",
                textAlign: "center",
              }}
            >
              <span>
                Criar meu acesso pessoal
                <br />
                <span style={{ fontSize: 12, opacity: 0.72 }}>
                  Create my personal access
                </span>
              </span>
            </a>

            <a
              href="/explorar"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 56,
                borderRadius: 14,
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.04)",
                color: "#ffffff",
                fontWeight: 700,
                padding: "14px 18px",
                textAlign: "center",
              }}
            >
              <span>
                Continuar explorando
                <br />
                <span style={{ fontSize: 12, opacity: 0.72 }}>
                  Continue exploring
                </span>
              </span>
            </a>
          </div>

          <button
            type="button"
            onClick={() => setSuccessData(null)}
            style={{
              marginTop: 16,
              background: "transparent",
              border: "none",
              color: "rgba(255,255,255,0.72)",
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            Fazer novo cadastro
          </button>
        </section>
      </main>
    );
  }

  return (
    <main style={{ padding: "24px 0 60px", color: "#fff" }}>
      <section style={{ textAlign: "center", marginBottom: 30 }}>
        <h1 style={{ fontSize: "clamp(26px, 5vw, 36px)", fontWeight: 800 }}>
          Cadastro empresarial
        </h1>

        <p style={{ opacity: 0.75, marginTop: 10, lineHeight: 1.7 }}>
          Cadastre sua empresa e comece a gerar oportunidades reais
          <br />
          <span style={{ fontSize: 12, opacity: 0.7 }}>
            Register your business and start generating opportunities
          </span>
          <br />
          <span style={{ fontSize: 12, opacity: 0.6 }}>
            Registra tu empresa y comienza a generar oportunidades
          </span>
        </p>
      </section>

      <form onSubmit={handleSubmit} style={formStyle}>
        <Input
          label="Nome do responsável"
          sub="Responsible name / Nombre del responsable"
          value={form.responsavel}
          onChange={(v: string) => update("responsavel", v)}
        />

        <Input
          label="Empresa"
          sub="Company name / Empresa"
          value={form.empresa}
          onChange={(v: string) => update("empresa", v)}
        />

        <Input
          label="CNPJ"
          sub="Company ID / Identificación empresarial"
          value={form.cnpj}
          onChange={(v: string) => update("cnpj", v)}
        />

        <Input
          label="WhatsApp"
          sub="Phone / WhatsApp / Teléfono"
          value={form.whatsapp}
          onChange={(v: string) => update("whatsapp", v)}
        />

        <Input
          label="Email"
          sub="Email / Correo electrónico"
          value={form.email}
          onChange={(v: string) => update("email", v)}
        />

        <div>
          <label style={labelStyle}>
            Segmentos de atuação
            <div style={subStyle}>
              Business segments / Segmentos de negocio
            </div>
          </label>

          <div style={checkGridStyle}>
            {segmentosFixos.map((item) => (
              <label key={item} style={checkItemStyle}>
                <input
                  type="checkbox"
                  checked={form.area.includes(item)}
                  onChange={(e) => toggleArrayItem("area", item, e.target.checked)}
                />
                <span style={{ marginLeft: 8 }}>{item}</span>
              </label>
            ))}
          </div>

          <div style={{ marginTop: 12 }}>
            <Input
              label="Segmento adicional"
              sub="Additional segment / Segmento adicional"
              placeholder="Ex.: Peças automotivas / Auto parts / Insumos industriais"
              value={form.segmentoPersonalizado}
              onChange={(v: string) => update("segmentoPersonalizado", v)}
            />
          </div>
        </div>

        <div>
          <label style={labelStyle}>
            Atividades e funções
            <div style={subStyle}>
              Activities and roles / Actividades y funciones
            </div>
          </label>

          <div style={checkGridStyle}>
            {atividadesFixas.map((item) => (
              <label key={item} style={checkItemStyle}>
                <input
                  type="checkbox"
                  checked={form.atividades.includes(item)}
                  onChange={(e) =>
                    toggleArrayItem("atividades", item, e.target.checked)
                  }
                />
                <span style={{ marginLeft: 8 }}>{item}</span>
              </label>
            ))}
          </div>

          <div style={{ marginTop: 12 }}>
            <Input
              label="Atividade adicional"
              sub="Additional activity / Actividad adicional"
              placeholder="Ex.: Motorista executivo, operador de máquinas, corretor, vendedor técnico"
              value={form.atividadePersonalizada}
              onChange={(v: string) => update("atividadePersonalizada", v)}
            />
          </div>
        </div>

        <div>
          <label style={labelStyle}>
            Abrangência de atendimento
            <div style={subStyle}>
              Service coverage / Cobertura de atención
            </div>
          </label>

          <select
            value={form.abrangencia}
            onChange={(e) => update("abrangencia", e.target.value)}
            style={inputStyle}
          >
            <option value="">Selecione a abrangência</option>
            {abrangencias.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={labelStyle}>
            Descrição da empresa
            <div style={subStyle}>
              Company description / Descripción de la empresa
            </div>
          </label>

          <textarea
            placeholder="Descreva sua empresa, seus serviços, produtos e diferenciais"
            value={form.descricao}
            onChange={(e) => update("descricao", e.target.value)}
            style={{
              ...inputStyle,
              minHeight: 120,
              resize: "vertical" as const,
            }}
          />
        </div>

        <div
          style={{
            padding: 12,
            borderRadius: 12,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            fontSize: 12,
            lineHeight: 1.6,
            color: "rgba(255,255,255,0.72)",
          }}
        >
          Dados sensíveis como CNPJ não devem ser exibidos publicamente. Eles ficam
          reservados para propostas, cobranças, contratos e operação interna,
          respeitando a proteção de dados.
        </div>

        <button type="submit" style={btn} disabled={loading}>
          {loading ? "Salvando cadastro..." : "Criar cadastro"}
          <div style={subStyle}>
            {loading
              ? "Saving registration... / Guardando registro..."
              : "Create account / Crear cuenta"}
          </div>
        </button>
      </form>
    </main>
  );
}

function Input({
  label,
  sub,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  sub: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label style={labelStyle}>
        {label}
        <div style={subStyle}>{sub}</div>
      </label>

      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={inputStyle}
      />
    </div>
  );
}

const formStyle = {
  maxWidth: 720,
  margin: "0 auto",
  display: "grid",
  gap: 18,
  background: "#12182b",
  padding: 22,
  borderRadius: 18,
  border: "1px solid rgba(255,255,255,0.08)",
  boxSizing: "border-box" as const,
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.1)",
  background: "#0b1020",
  color: "#fff",
  outline: "none",
  boxSizing: "border-box" as const,
};

const labelStyle = {
  fontSize: 14,
  fontWeight: 600,
  display: "block" as const,
  marginBottom: 8,
};

const subStyle = {
  fontSize: 11,
  opacity: 0.6,
};

const btn = {
  padding: "14px",
  borderRadius: 12,
  background: "#00ff88",
  color: "#04110b",
  fontWeight: 800,
  border: "none",
  cursor: "pointer",
};

const checkGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 8,
  marginTop: 8,
};

const checkItemStyle = {
  display: "flex",
  alignItems: "center",
  padding: "10px 12px",
  borderRadius: 10,
  background: "#0b1020",
  border: "1px solid rgba(255,255,255,0.08)",
  fontSize: 13,
};