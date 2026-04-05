"use client";

import Link from "next/link";
import type { CSSProperties } from "react";

type DriverItem = {
  id: string;
  nome: string;
  cidade: string;
  estado: string;
  area: string;
  categoriaCnh: string;
  whatsapp: string;
  status: "ativo" | "inativo";
};

const mockDrivers: DriverItem[] = [
  {
    id: "1",
    nome: "Ricardo Leonardo Moreira",
    cidade: "Belo Horizonte",
    estado: "MG",
    area: "Região metropolitana e viagens",
    categoriaCnh: "B",
    whatsapp: "(31) 99999-0000",
    status: "ativo",
  },
  {
    id: "2",
    nome: "Maria Fernanda Souza",
    cidade: "Contagem",
    estado: "MG",
    area: "Entrega, apoio operacional e viagens",
    categoriaCnh: "D",
    whatsapp: "(31) 98888-2233",
    status: "ativo",
  },
  {
    id: "3",
    nome: "João Pedro Martins",
    cidade: "Lagoa Santa",
    estado: "MG",
    area: "Traslado executivo e apoio a locadoras",
    categoriaCnh: "B",
    whatsapp: "(31) 97777-4455",
    status: "inativo",
  },
];

export default function LocadoraMotoristasPage() {
  const activeDrivers = mockDrivers.filter((item) => item.status === "ativo");

  return (
    <main style={pageStyle}>
      <section style={containerStyle}>
        <header style={heroStyle}>
          <div style={heroTopStyle}>
            <div style={heroTextWrapStyle}>
              <div style={eyebrowStyle}>Voltar para cadastros</div>

              <h1 style={heroTitleStyle}>Cadastro nacional de condutores</h1>

              <p style={heroDescriptionStyle}>
                Condutores disponíveis em todo o Brasil para apoiar locadoras,
                empresas, operações, viagens e demandas estratégicas da Aurora.
              </p>
            </div>

            <div style={heroBadgeStyle}>🪪 Aurora Locadora</div>
          </div>

          <div style={heroActionsStyle}>
            <Link href="/locadora/cadastros" style={secondaryButtonStyle}>
              Voltar para cadastros
            </Link>

            <Link href="/locadora" style={secondaryButtonStyle}>
              Voltar para locadora
            </Link>

            <a href="#novo-condutor" style={primaryButtonStyle}>
              Cadastrar condutor
            </a>
          </div>

          <div style={metricGridStyle}>
            <MetricCard
              icon="🚗"
              title="Condutores disponíveis"
              value={String(activeDrivers.length)}
              text="Profissionais ativos para operação."
            />
            <MetricCard
              icon="🌎"
              title="Cobertura"
              value="Brasil"
              text="Estrutura pensada para escala nacional."
            />
            <MetricCard
              icon="🛡️"
              title="Fluxo protegido"
              value="Seguro"
              text="Tela estabilizada sem depender de API agora."
            />
            <MetricCard
              icon="⚡"
              title="Próximo passo"
              value="Backend"
              text="Depois ligamos Supabase com segurança."
            />
          </div>
        </header>

        <section style={warningStyle}>
          <strong>AVISO</strong>
          <span>
            Sistema em constante atualização. Pode haver momentos de
            instabilidade durante ajustes de performance, segurança e expansão
            comercial.
          </span>
        </section>

        <section id="novo-condutor" style={sectionCardStyle}>
          <div style={sectionHeaderStyle}>
            <div>
              <div style={sectionEyebrowStyle}>✍️ Novo condutor</div>
              <h2 style={sectionTitleStyle}>Cadastrar condutor</h2>
              <p style={sectionDescriptionStyle}>
                Estrutura visual pronta para receber a integração real do banco
                depois, sem quebrar sua produção agora.
              </p>
            </div>

            <div style={sectionPillStyle}>Modo estabilizado</div>
          </div>

          <form style={formGridStyle}>
            <Field label="Nome completo *" placeholder="Nome do condutor" />
            <Field
              label="Cidade de residência *"
              placeholder="Ex.: Belo Horizonte"
            />
            <Field label="Estado" placeholder="Ex.: MG" />
            <Field
              label="Área de atuação"
              placeholder="Ex.: BH, região metropolitana, viagens"
            />
            <Field label="WhatsApp" placeholder="(31) 99999-0000" />
            <Field label="E-mail" placeholder="email@exemplo.com" />
            <Field label="Número da CNH" placeholder="Número da habilitação" />
            <Field label="Categoria da CNH" placeholder="Ex.: B" />
            <Field label="Validade da CNH" placeholder="dd/mm/aaaa" />
            <Field label="Status" placeholder="ativo" />

            <div style={fullWidthStyle}>
              <label style={labelStyle}>Observações</label>
              <textarea
                style={textareaStyle}
                placeholder="Observações do condutor"
              />
            </div>

            <div style={fullWidthActionsStyle}>
              <button type="button" style={primaryButtonElementStyle}>
                Salvar condutor
              </button>

              <span style={helperTextStyle}>
                Tela estabilizada para evitar erro de chave/API nesta fase.
              </span>
            </div>
          </form>
        </section>

        <section style={responsibilityStyle}>
          <div style={sectionEyebrowStyle}>RESPONSABILIDADE</div>
          <p style={responsibilityTextStyle}>
            A Aurora IA atua como elo virtual entre empresas, locadoras e
            condutores. A verificação de documentos, idoneidade, experiência,
            contratação, pagamento e responsabilidade operacional são de total
            responsabilidade da empresa contratante. Sempre conferir
            documentação e idoneidade do condutor cadastrado antes de qualquer
            serviço.
          </p>
        </section>

        <section style={sectionCardStyle}>
          <div style={sectionHeaderStyle}>
            <div>
              <div style={sectionEyebrowStyle}>Buscar condutores</div>
              <h2 style={sectionTitleStyle}>Base visual de condutores</h2>
              <p style={sectionDescriptionStyle}>
                Lista demonstrativa pronta para receber filtros e conexão real
                depois.
              </p>
            </div>

            <div style={sectionPillStyle}>{mockDrivers.length} registro(s)</div>
          </div>

          <div style={filtersGridStyle}>
            <Field label="Nome" placeholder="Ex.: Ricardo" />
            <Field label="Cidade" placeholder="Ex.: Belo Horizonte" />
            <Field label="Estado" placeholder="Ex.: MG" />
            <Field label="Área de atuação" placeholder="Ex.: viagens" />
          </div>

          <div style={filterActionsStyle}>
            <button type="button" style={secondaryButtonElementStyle}>
              Limpar filtros
            </button>
            <button type="button" style={primaryButtonElementStyle}>
              Atualizar lista
            </button>
          </div>

          <div style={driversGridStyle}>
            {mockDrivers.map((driver) => (
              <article key={driver.id} style={driverCardStyle}>
                <div style={driverHeaderStyle}>
                  <div>
                    <h3 style={driverNameStyle}>{driver.nome}</h3>
                    <p style={driverLocationStyle}>
                      {driver.cidade} • {driver.estado}
                    </p>
                  </div>

                  <span
                    style={
                      driver.status === "ativo"
                        ? activeBadgeStyle
                        : inactiveBadgeStyle
                    }
                  >
                    {driver.status}
                  </span>
                </div>

                <div style={driverInfoGridStyle}>
                  <InfoLine label="Área de atuação" value={driver.area} />
                  <InfoLine label="Categoria CNH" value={driver.categoriaCnh} />
                  <InfoLine label="WhatsApp" value={driver.whatsapp} />
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

function MetricCard({
  icon,
  title,
  value,
  text,
}: {
  icon: string;
  title: string;
  value: string;
  text: string;
}) {
  return (
    <article style={metricCardStyle}>
      <div style={metricIconStyle}>{icon}</div>
      <div style={metricTitleStyle}>{title}</div>
      <div style={metricValueStyle}>{value}</div>
      <p style={metricTextStyle}>{text}</p>
    </article>
  );
}

function Field({
  label,
  placeholder,
}: {
  label: string;
  placeholder: string;
}) {
  return (
    <div style={fieldStyle}>
      <label style={labelStyle}>{label}</label>
      <input style={inputStyle} placeholder={placeholder} />
    </div>
  );
}

function InfoLine({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div style={infoLineStyle}>
      <span style={infoLabelStyle}>{label}</span>
      <span style={infoValueStyle}>{value}</span>
    </div>
  );
}

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  background:
    "linear-gradient(180deg, #eef6ff 0%, #f8fbff 38%, #eef9f2 100%)",
  color: "#0f172a",
};

const containerStyle: CSSProperties = {
  maxWidth: 1240,
  margin: "0 auto",
  padding: "24px 16px 72px",
  display: "grid",
  gap: 20,
};

const heroStyle: CSSProperties = {
  position: "relative",
  overflow: "hidden",
  borderRadius: 32,
  padding: 28,
  background:
    "radial-gradient(circle at top right, rgba(34,197,94,0.16), transparent 24%), radial-gradient(circle at left top, rgba(59,130,246,0.16), transparent 26%), linear-gradient(135deg, #ffffff 0%, #f4faff 52%, #effbf4 100%)",
  border: "1px solid rgba(148,163,184,0.18)",
  boxShadow: "0 24px 80px rgba(15,23,42,0.10)",
  display: "grid",
  gap: 24,
};

const heroTopStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 16,
  flexWrap: "wrap",
};

const heroTextWrapStyle: CSSProperties = {
  maxWidth: 820,
};

const eyebrowStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  borderRadius: 999,
  padding: "8px 12px",
  background: "#eff6ff",
  border: "1px solid #bfdbfe",
  color: "#2563eb",
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: 0.4,
  textTransform: "uppercase",
  marginBottom: 14,
};

const heroTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: "clamp(30px, 5vw, 52px)",
  lineHeight: 1.02,
  fontWeight: 900,
  color: "#0f172a",
};

const heroDescriptionStyle: CSSProperties = {
  marginTop: 16,
  marginBottom: 0,
  fontSize: 17,
  lineHeight: 1.75,
  color: "#475569",
};

const heroBadgeStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 999,
  padding: "10px 14px",
  background: "#ecfdf3",
  border: "1px solid #bbf7d0",
  color: "#15803d",
  fontWeight: 800,
  whiteSpace: "nowrap",
};

const heroActionsStyle: CSSProperties = {
  display: "flex",
  gap: 12,
  flexWrap: "wrap",
};

const primaryButtonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
  borderRadius: 14,
  padding: "13px 18px",
  fontWeight: 800,
  background: "linear-gradient(135deg, #2563eb 0%, #22c55e 100%)",
  color: "#ffffff",
  boxShadow: "0 16px 36px rgba(37,99,235,0.18)",
};

const secondaryButtonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
  borderRadius: 14,
  padding: "13px 18px",
  fontWeight: 700,
  background: "#ffffff",
  border: "1px solid #dbeafe",
  color: "#0f172a",
};

const metricGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 14,
};

const metricCardStyle: CSSProperties = {
  borderRadius: 22,
  padding: 18,
  background: "rgba(255,255,255,0.88)",
  border: "1px solid rgba(148,163,184,0.16)",
  boxShadow: "0 14px 34px rgba(15,23,42,0.06)",
  display: "grid",
  gap: 8,
};

const metricIconStyle: CSSProperties = {
  fontSize: 24,
};

const metricTitleStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: "#64748b",
};

const metricValueStyle: CSSProperties = {
  fontSize: 28,
  fontWeight: 900,
  lineHeight: 1,
  color: "#0f172a",
};

const metricTextStyle: CSSProperties = {
  margin: 0,
  color: "#475569",
  lineHeight: 1.6,
  fontSize: 14,
};

const warningStyle: CSSProperties = {
  display: "flex",
  gap: 12,
  alignItems: "flex-start",
  flexWrap: "wrap",
  borderRadius: 18,
  padding: 16,
  background: "#fff8eb",
  border: "1px solid #fde68a",
  color: "#92400e",
  boxShadow: "0 10px 26px rgba(245,158,11,0.08)",
};

const sectionCardStyle: CSSProperties = {
  borderRadius: 28,
  padding: 24,
  background: "#ffffff",
  border: "1px solid rgba(148,163,184,0.14)",
  boxShadow: "0 20px 60px rgba(15,23,42,0.06)",
  display: "grid",
  gap: 18,
};

const sectionHeaderStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 16,
  flexWrap: "wrap",
};

const sectionEyebrowStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: 0.45,
  textTransform: "uppercase",
  color: "#16a34a",
  marginBottom: 8,
};

const sectionTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 28,
  lineHeight: 1.1,
  fontWeight: 900,
  color: "#0f172a",
};

const sectionDescriptionStyle: CSSProperties = {
  marginTop: 10,
  marginBottom: 0,
  color: "#475569",
  lineHeight: 1.7,
  maxWidth: 760,
};

const sectionPillStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  borderRadius: 999,
  padding: "9px 12px",
  background: "#eff6ff",
  border: "1px solid #bfdbfe",
  color: "#2563eb",
  fontWeight: 800,
  fontSize: 13,
};

const formGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 16,
};

const fieldStyle: CSSProperties = {
  display: "grid",
  gap: 8,
};

const labelStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: "#334155",
};

const inputStyle: CSSProperties = {
  width: "100%",
  minHeight: 50,
  borderRadius: 14,
  border: "1px solid #dbeafe",
  background: "#f8fbff",
  color: "#0f172a",
  padding: "12px 14px",
  outline: "none",
};

const textareaStyle: CSSProperties = {
  width: "100%",
  minHeight: 130,
  borderRadius: 14,
  border: "1px solid #dbeafe",
  background: "#f8fbff",
  color: "#0f172a",
  padding: "12px 14px",
  outline: "none",
  resize: "vertical",
};

const fullWidthStyle: CSSProperties = {
  gridColumn: "1 / -1",
};

const fullWidthActionsStyle: CSSProperties = {
  gridColumn: "1 / -1",
  display: "flex",
  flexWrap: "wrap",
  gap: 14,
  alignItems: "center",
};

const primaryButtonElementStyle: CSSProperties = {
  border: "none",
  borderRadius: 14,
  padding: "13px 18px",
  fontWeight: 800,
  background: "linear-gradient(135deg, #2563eb 0%, #22c55e 100%)",
  color: "#ffffff",
  cursor: "pointer",
  boxShadow: "0 16px 36px rgba(37,99,235,0.18)",
};

const secondaryButtonElementStyle: CSSProperties = {
  border: "1px solid #dbeafe",
  borderRadius: 14,
  padding: "13px 18px",
  fontWeight: 700,
  background: "#ffffff",
  color: "#0f172a",
  cursor: "pointer",
};

const helperTextStyle: CSSProperties = {
  color: "#64748b",
  fontSize: 14,
};

const responsibilityStyle: CSSProperties = {
  borderRadius: 24,
  padding: 22,
  background: "linear-gradient(135deg, #ffffff 0%, #f8fbff 100%)",
  border: "1px solid rgba(148,163,184,0.14)",
  boxShadow: "0 16px 40px rgba(15,23,42,0.05)",
};

const responsibilityTextStyle: CSSProperties = {
  margin: 0,
  color: "#334155",
  lineHeight: 1.8,
};

const filtersGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: 16,
};

const filterActionsStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 12,
};

const driversGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: 16,
};

const driverCardStyle: CSSProperties = {
  borderRadius: 22,
  padding: 20,
  background: "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
  border: "1px solid rgba(148,163,184,0.14)",
  boxShadow: "0 14px 34px rgba(15,23,42,0.05)",
  display: "grid",
  gap: 16,
};

const driverHeaderStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  alignItems: "flex-start",
};

const driverNameStyle: CSSProperties = {
  margin: 0,
  fontSize: 18,
  fontWeight: 900,
  lineHeight: 1.15,
  color: "#0f172a",
};

const driverLocationStyle: CSSProperties = {
  marginTop: 8,
  marginBottom: 0,
  color: "#64748b",
};

const activeBadgeStyle: CSSProperties = {
  display: "inline-flex",
  borderRadius: 999,
  padding: "8px 10px",
  background: "#ecfdf3",
  border: "1px solid #bbf7d0",
  color: "#15803d",
  fontSize: 12,
  fontWeight: 800,
  textTransform: "uppercase",
};

const inactiveBadgeStyle: CSSProperties = {
  display: "inline-flex",
  borderRadius: 999,
  padding: "8px 10px",
  background: "#f8fafc",
  border: "1px solid #cbd5e1",
  color: "#64748b",
  fontSize: 12,
  fontWeight: 800,
  textTransform: "uppercase",
};

const driverInfoGridStyle: CSSProperties = {
  display: "grid",
  gap: 10,
};

const infoLineStyle: CSSProperties = {
  display: "grid",
  gap: 4,
};

const infoLabelStyle: CSSProperties = {
  fontSize: 12,
  color: "#64748b",
  textTransform: "uppercase",
  letterSpacing: 0.4,
  fontWeight: 700,
};

const infoValueStyle: CSSProperties = {
  color: "#0f172a",
  lineHeight: 1.6,
};