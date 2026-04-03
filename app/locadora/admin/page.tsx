"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { CSSProperties } from "react";

type Cliente = {
  id: string;
  nome?: string;
  whatsapp?: string;
  email?: string;
  cidade?: string;
  estado?: string;
  created_at?: string;
};

type Veiculo = {
  id: string;
  titulo?: string;
  marca?: string;
  modelo?: string;
  ano?: string;
  cor?: string;
  placa?: string;
  valor_diaria?: string | number;
  status?: string;
  created_at?: string;
};

type Proposta = {
  id: string;
  cliente_nome?: string;
  veiculo_nome?: string;
  valor?: string | number;
  status?: "aberta" | "aprovada" | "recusada" | string;
  created_at?: string;
};

function pickLocalStorageValue(keys: string[]) {
  if (typeof window === "undefined") return "";
  for (const key of keys) {
    const value = localStorage.getItem(key);
    if (value && value.trim()) return value.trim();
  }
  return "";
}

export default function LocadoraAdminPage() {
  const [email, setEmail] = useState("");
  const [projectId, setProjectId] = useState("");

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [propostas, setPropostas] = useState<Proposta[]>([]);

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const savedEmail = pickLocalStorageValue([
      "userEmail",
      "ownerEmail",
      "email",
      "usuarioEmail",
      "locadoraOwnerEmail",
    ]);

    const savedProjectId = pickLocalStorageValue([
      "projectId",
      "selectedProjectId",
      "currentProjectId",
      "locadoraProjectId",
    ]);

    setEmail(savedEmail);
    setProjectId(savedProjectId);

    if (savedEmail) {
      carregarDashboard(savedEmail, savedProjectId);
    } else {
      setCarregando(false);
      setErro(
        "E-mail do usuário não encontrado automaticamente. Preencha abaixo e clique em carregar dashboard."
      );
    }
  }, []);

  async function carregarDashboard(ownerEmail: string, savedProjectId: string) {
    if (!ownerEmail) {
      setErro("Informe o e-mail do operador para carregar o dashboard.");
      setCarregando(false);
      return;
    }

    try {
      setCarregando(true);
      setErro("");

      const [clientesRes, veiculosRes, propostasRes] = await Promise.all([
        fetch(`/api/locadora/clientes?ownerEmail=${encodeURIComponent(ownerEmail)}`),
        fetch(
          `/api/locadora/vehicles?ownerEmail=${encodeURIComponent(ownerEmail)}${
            savedProjectId ? `&projectId=${encodeURIComponent(savedProjectId)}` : ""
          }`
        ),
        fetch(`/api/locadora/propostas?ownerEmail=${encodeURIComponent(ownerEmail)}`),
      ]);

      const clientesJson = await clientesRes.json();
      const veiculosJson = await veiculosRes.json();
      const propostasJson = await propostasRes.json();

      setClientes(Array.isArray(clientesJson?.items) ? clientesJson.items : []);
      setVeiculos(Array.isArray(veiculosJson?.vehicles) ? veiculosJson.vehicles : []);
      setPropostas(Array.isArray(propostasJson) ? propostasJson : []);
    } catch {
      setErro("Não foi possível carregar o dashboard agora.");
    } finally {
      setCarregando(false);
    }
  }

  function salvarECarregar() {
    if (!email.trim()) {
      alert("Informe o e-mail do operador.");
      return;
    }

    localStorage.setItem("userEmail", email.trim());

    if (projectId.trim()) {
      localStorage.setItem("projectId", projectId.trim());
    }

    carregarDashboard(email.trim(), projectId.trim());
  }

  const totalClientes = clientes.length;
  const totalVeiculos = veiculos.length;
  const totalPropostas = propostas.length;

  const propostasAbertas = useMemo(
    () => propostas.filter((p) => (p.status || "").toLowerCase() === "aberta").length,
    [propostas]
  );

  const propostasAprovadas = useMemo(
    () => propostas.filter((p) => (p.status || "").toLowerCase() === "aprovada").length,
    [propostas]
  );

  const propostasRecusadas = useMemo(
    () => propostas.filter((p) => (p.status || "").toLowerCase() === "recusada").length,
    [propostas]
  );

  const veiculosDisponiveis = useMemo(
    () => veiculos.filter((v) => (v.status || "").toLowerCase() === "disponivel").length,
    [veiculos]
  );

  const valorTotalPropostasAprovadas = useMemo(() => {
    return propostas
      .filter((p) => (p.status || "").toLowerCase() === "aprovada")
      .reduce((acc, p) => {
        const numero = Number(
          String(p.valor ?? "0")
            .replace(/\./g, "")
            .replace(",", ".")
            .replace(/[^\d.-]/g, "")
        );
        return acc + (isNaN(numero) ? 0 : numero);
      }, 0);
  }, [propostas]);

  const propostasRecentes = [...propostas].slice(0, 5);
  const clientesRecentes = [...clientes].slice(0, 5);
  const veiculosRecentes = [...veiculos].slice(0, 5);

  return (
    <main style={mainStyle}>
      <section style={containerStyle}>
        <header style={headerStyle}>
          <div style={{ display: "grid", gap: 4 }}>
            <div style={logoStyle}>ricardoiaoficial.com</div>
            <div style={titleStyle}>Aurora Locadora • dashboard administrativo</div>
          </div>

          <div style={badgeStyle}>Sistema em evolução</div>
        </header>

        <nav style={topNavStyle}>
          <Link href="/locadora" style={topLinkStyle}>
            Voltar à locadora
          </Link>
          <Link href="/cadastro-veiculos" style={topLinkStyle}>
            Cadastro de veículos
          </Link>
          <Link href="/locadora/clientes" style={topLinkStyle}>
            Clientes
          </Link>
          <Link href="/locadora/propostas" style={topLinkStyle}>
            Propostas
          </Link>
          <Link href="/locadora/importar" style={topLinkStyle}>
            Importar CSV
          </Link>
        </nav>

        <section style={heroCardStyle}>
          <div style={pillGreenStyle}>
            <span>📊</span>
            <span>Dashboard completo da locadora</span>
          </div>

          <h1 style={heroTitleStyle}>
            Controle comercial, operacional e de propostas
          </h1>

          <p style={heroTextStyle}>
            Painel central da Aurora Locadora para acompanhar clientes, frota,
            propostas, importação e potencial de fechamento. Estamos em constante
            atualização e pode haver momentos de instabilidade.
          </p>

          <div style={heroActionsGridStyle}>
            <Link href="/locadora/propostas" style={ctaPrimaryStyle}>
              Abrir propostas
            </Link>

            <Link href="/locadora/importar" style={ctaPrimaryGreenStyle}>
              Importar frota CSV
            </Link>

            <Link href="/cadastro-veiculos" style={ctaSecondaryStyle}>
              Cadastrar veículo
            </Link>

            <Link href="/locadora/clientes" style={ctaSecondaryStyle}>
              Ver clientes
            </Link>
          </div>
        </section>

        <section style={panelCardStyle}>
          <div style={pillBlueStyle}>
            <span>🔐</span>
            <span>Identificação do operador</span>
          </div>

          <h2 style={panelTitleStyle}>Carregar dashboard do operador certo</h2>

          <div style={formGridStyle}>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mail do operador"
              style={inputStyle}
            />

            <input
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              placeholder="Project ID (opcional)"
              style={inputStyle}
            />
          </div>

          <div style={buttonRowStyle}>
            <button onClick={salvarECarregar} style={buttonPrimaryStyle}>
              Salvar e carregar dashboard
            </button>

            <button
              onClick={() => carregarDashboard(email.trim(), projectId.trim())}
              style={buttonSecondaryStyle}
            >
              Recarregar agora
            </button>
          </div>

          <p style={helperTextStyle}>
            Dica: use o e-mail <strong>ricardogrupoexecutivo1@gmail.com</strong>. Se
            quiser filtrar por projeto, use o project ID da locadora.
          </p>
        </section>

        {erro ? <div style={errorBoxStyle}>{erro}</div> : null}

        {carregando ? (
          <div style={loadingBoxStyle}>Carregando dashboard...</div>
        ) : (
          <>
            <section style={statsGridStyle}>
              <StatCard label="Clientes no banco" value={String(totalClientes)} detail="Base ativa da locadora" />
              <StatCard label="Veículos no banco" value={String(totalVeiculos)} detail="Frota total cadastrada" />
              <StatCard label="Veículos disponíveis" value={String(veiculosDisponiveis)} detail="Prontos para operação" />
              <StatCard label="Propostas totais" value={String(totalPropostas)} detail="Funil comercial geral" />
              <StatCard label="Propostas abertas" value={String(propostasAbertas)} detail="Negociações em andamento" />
              <StatCard label="Propostas aprovadas" value={String(propostasAprovadas)} detail="Fechamentos confirmados" />
              <StatCard label="Propostas recusadas" value={String(propostasRecusadas)} detail="Negócios não convertidos" />
              <StatCard
                label="Valor aprovado"
                value={formatCurrency(valorTotalPropostasAprovadas)}
                detail="Soma das propostas aprovadas"
              />
            </section>

            <section style={twoColumnGridStyle}>
              <div style={panelCardStyle}>
                <div style={pillBlueStyle}>
                  <span>🧠</span>
                  <span>Resumo estratégico</span>
                </div>

                <h2 style={panelTitleStyle}>Visão rápida do momento da locadora</h2>

                <div style={stackStyle}>
                  <InfoRow label="Operador" value={email || "Não identificado"} />
                  <InfoRow label="Projeto" value={projectId || "Sem projectId salvo"} />
                  <InfoRow label="Clientes cadastrados" value={String(totalClientes)} />
                  <InfoRow label="Frota cadastrada" value={String(totalVeiculos)} />
                  <InfoRow label="Funil em aberto" value={String(propostasAbertas)} />
                  <InfoRow
                    label="Valor aprovado"
                    value={formatCurrency(valorTotalPropostasAprovadas)}
                  />
                </div>
              </div>

              <div style={panelCardStyle}>
                <div style={pillGreenStyle}>
                  <span>🚀</span>
                  <span>Ações rápidas</span>
                </div>

                <h2 style={panelTitleStyle}>Atalhos para operação comercial</h2>

                <div style={stackStyle}>
                  <Link href="/locadora/propostas" style={ctaBlockSecondaryStyle}>
                    Criar e acompanhar propostas
                  </Link>

                  <Link href="/locadora/importar" style={ctaBlockSecondaryStyle}>
                    Importar frota em massa
                  </Link>

                  <Link href="/cadastro-veiculos" style={ctaBlockSecondaryStyle}>
                    Cadastrar novo veículo
                  </Link>

                  <Link href="/locadora/clientes" style={ctaBlockSecondaryStyle}>
                    Abrir lista de clientes
                  </Link>

                  <a
                    href="https://wa.me/5531997490074"
                    target="_blank"
                    rel="noreferrer"
                    style={ctaBlockWhatsStyle}
                  >
                    Falar no WhatsApp comercial
                  </a>
                </div>
              </div>
            </section>

            <section style={threeColumnGridStyle}>
              <div style={panelCardStyle}>
                <div style={pillGreenStyle}>
                  <span>👤</span>
                  <span>Clientes recentes</span>
                </div>

                <h3 style={subTitleStyle}>Últimos clientes carregados</h3>

                {clientesRecentes.length === 0 ? (
                  <EmptyState text="Nenhum cliente encontrado." />
                ) : (
                  <div style={stackStyle}>
                    {clientesRecentes.map((cliente) => (
                      <div key={cliente.id} style={listCardStyle}>
                        <strong style={itemTitleStyle}>
                          {cliente.nome || "Sem nome"}
                        </strong>
                        <span style={itemTextStyle}>
                          {cliente.whatsapp ? `WhatsApp: ${cliente.whatsapp}` : "Sem WhatsApp"}
                        </span>
                        <span style={itemTextStyle}>
                          {cliente.email || "Sem e-mail"}
                        </span>
                        <span style={itemTextStyle}>
                          {[cliente.cidade, cliente.estado].filter(Boolean).join(" - ") || "Local não informado"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={panelCardStyle}>
                <div style={pillBlueStyle}>
                  <span>🚗</span>
                  <span>Veículos recentes</span>
                </div>

                <h3 style={subTitleStyle}>Últimos veículos carregados</h3>

                {veiculosRecentes.length === 0 ? (
                  <EmptyState text="Nenhum veículo encontrado." />
                ) : (
                  <div style={stackStyle}>
                    {veiculosRecentes.map((veiculo) => (
                      <div key={veiculo.id} style={listCardStyle}>
                        <strong style={itemTitleStyle}>
                          {veiculo.titulo || "Sem título"}
                        </strong>
                        <span style={itemTextStyle}>
                          {[veiculo.marca, veiculo.modelo].filter(Boolean).join(" • ") || "Sem marca/modelo"}
                        </span>
                        <span style={itemTextStyle}>
                          {[veiculo.ano, veiculo.cor].filter(Boolean).join(" • ") || "Sem ano/cor"}
                        </span>
                        <span style={itemTextStyle}>
                          Placa: {veiculo.placa || "Não informada"} • Status: {veiculo.status || "Sem status"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={panelCardStyle}>
                <div style={pillGreenStyle}>
                  <span>📄</span>
                  <span>Propostas recentes</span>
                </div>

                <h3 style={subTitleStyle}>Últimas propostas do funil</h3>

                {propostasRecentes.length === 0 ? (
                  <EmptyState text="Nenhuma proposta encontrada." />
                ) : (
                  <div style={stackStyle}>
                    {propostasRecentes.map((proposta) => (
                      <div key={proposta.id} style={listCardStyle}>
                        <strong style={itemTitleStyle}>
                          {proposta.cliente_nome || "Cliente não informado"}
                        </strong>
                        <span style={itemTextStyle}>
                          Veículo: {proposta.veiculo_nome || "Não informado"}
                        </span>
                        <span style={itemTextStyle}>
                          Valor: {formatCurrency(proposta.valor)}
                        </span>
                        <span style={itemTextStyle}>
                          Status: {proposta.status || "Sem status"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </section>
    </main>
  );
}

function StatCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div style={statCardStyle}>
      <span style={statLabelStyle}>{label}</span>
      <strong style={statValueStyle}>{value}</strong>
      <span style={statDetailStyle}>{detail}</span>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={infoRowStyle}>
      <span style={infoLabelStyle}>{label}</span>
      <strong style={infoValueStyle}>{value}</strong>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return <div style={emptyBoxStyle}>{text}</div>;
}

function formatCurrency(value: string | number | undefined) {
  const numero = Number(
    String(value ?? "0")
      .replace(/\./g, "")
      .replace(",", ".")
      .replace(/[^\d.-]/g, "")
  );

  const seguro = isNaN(numero) ? 0 : numero;

  return seguro.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

const mainStyle: CSSProperties = {
  minHeight: "100vh",
  background:
    "radial-gradient(circle at top, rgba(59,130,246,0.10), transparent 18%), radial-gradient(circle at left, rgba(16,185,129,0.10), transparent 24%), linear-gradient(180deg, #eef6ff 0%, #f7fbff 36%, #edf7f3 100%)",
  color: "#0f172a",
  padding: "24px 16px 72px",
};

const containerStyle: CSSProperties = {
  maxWidth: 1240,
  margin: "0 auto",
  display: "grid",
  gap: 18,
};

const headerStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
  flexWrap: "wrap",
  border: "1px solid rgba(15,23,42,0.08)",
  background: "rgba(255,255,255,0.78)",
  backdropFilter: "blur(14px)",
  borderRadius: 24,
  padding: "14px",
  boxShadow: "0 18px 42px rgba(15,23,42,0.07)",
};

const logoStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 900,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#2563eb",
};

const titleStyle: CSSProperties = {
  fontSize: 18,
  fontWeight: 900,
  lineHeight: 1.2,
  color: "#0f172a",
};

const badgeStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 36,
  padding: "0 12px",
  borderRadius: 999,
  background: "rgba(37,99,235,0.08)",
  border: "1px solid rgba(37,99,235,0.16)",
  color: "#2563eb",
  fontSize: 12,
  fontWeight: 900,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};

const topNavStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 10,
};

const topLinkStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 42,
  padding: "0 14px",
  borderRadius: 12,
  textDecoration: "none",
  fontWeight: 700,
  fontSize: 14,
  color: "#0f172a",
  background: "rgba(255,255,255,0.78)",
  border: "1px solid rgba(15,23,42,0.08)",
  boxShadow: "0 8px 16px rgba(15,23,42,0.04)",
};

const heroCardStyle: CSSProperties = {
  borderRadius: 28,
  padding: 22,
  border: "1px solid rgba(15,23,42,0.08)",
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.80) 100%)",
  boxShadow: "0 24px 60px rgba(15,23,42,0.08)",
  display: "grid",
  gap: 14,
};

const panelCardStyle: CSSProperties = {
  borderRadius: 24,
  padding: 20,
  border: "1px solid rgba(15,23,42,0.08)",
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.82) 100%)",
  boxShadow: "0 18px 42px rgba(15,23,42,0.06)",
  display: "grid",
  gap: 12,
};

const heroTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: "clamp(32px, 6vw, 58px)",
  lineHeight: 1.02,
  fontWeight: 900,
  letterSpacing: "-0.04em",
  color: "#0f172a",
};

const heroTextStyle: CSSProperties = {
  margin: 0,
  maxWidth: 900,
  color: "rgba(15,23,42,0.74)",
  fontSize: "clamp(15px, 3vw, 19px)",
  lineHeight: 1.7,
  fontWeight: 700,
};

const heroActionsGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 12,
  marginTop: 4,
};

const formGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: 12,
  marginTop: 12,
};

const inputStyle: CSSProperties = {
  width: "100%",
  minHeight: 50,
  padding: "0 14px",
  borderRadius: 14,
  border: "1px solid rgba(15,23,42,0.10)",
  background: "rgba(255,255,255,0.96)",
  color: "#0f172a",
  boxShadow: "0 8px 20px rgba(15,23,42,0.03)",
};

const buttonRowStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 10,
  marginTop: 12,
};

const buttonPrimaryStyle: CSSProperties = {
  minHeight: 48,
  padding: "0 16px",
  borderRadius: 14,
  border: "1px solid rgba(37,99,235,0.16)",
  background: "linear-gradient(135deg, #2563eb, #3b82f6)",
  color: "#ffffff",
  fontWeight: 900,
  boxShadow: "0 14px 30px rgba(37,99,235,0.16)",
  cursor: "pointer",
};

const buttonSecondaryStyle: CSSProperties = {
  minHeight: 48,
  padding: "0 16px",
  borderRadius: 14,
  border: "1px solid rgba(15,23,42,0.08)",
  background: "rgba(255,255,255,0.78)",
  color: "#0f172a",
  fontWeight: 800,
  boxShadow: "0 10px 22px rgba(15,23,42,0.05)",
  cursor: "pointer",
};

const helperTextStyle: CSSProperties = {
  marginTop: 10,
  color: "rgba(15,23,42,0.70)",
  lineHeight: 1.6,
  fontSize: 14,
};

const ctaPrimaryStyle: CSSProperties = {
  textDecoration: "none",
  borderRadius: 16,
  padding: "14px 16px",
  background: "linear-gradient(135deg, #2563eb, #3b82f6)",
  color: "#ffffff",
  fontWeight: 900,
  textAlign: "center",
  boxShadow: "0 14px 30px rgba(37,99,235,0.16)",
};

const ctaPrimaryGreenStyle: CSSProperties = {
  textDecoration: "none",
  borderRadius: 16,
  padding: "14px 16px",
  background: "linear-gradient(135deg, #16a34a, #22c55e)",
  color: "#ffffff",
  fontWeight: 900,
  textAlign: "center",
  boxShadow: "0 12px 28px rgba(34,197,94,0.16)",
};

const ctaSecondaryStyle: CSSProperties = {
  textDecoration: "none",
  borderRadius: 16,
  padding: "14px 16px",
  background: "rgba(255,255,255,0.78)",
  border: "1px solid rgba(15,23,42,0.08)",
  color: "#0f172a",
  fontWeight: 800,
  textAlign: "center",
  boxShadow: "0 10px 22px rgba(15,23,42,0.05)",
};

const ctaBlockSecondaryStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 48,
  padding: "0 16px",
  borderRadius: 14,
  textDecoration: "none",
  fontWeight: 800,
  fontSize: 14,
  color: "#0f172a",
  background: "rgba(255,255,255,0.78)",
  border: "1px solid rgba(15,23,42,0.08)",
  boxShadow: "0 10px 22px rgba(15,23,42,0.05)",
};

const ctaBlockWhatsStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 48,
  padding: "0 16px",
  borderRadius: 14,
  textDecoration: "none",
  fontWeight: 900,
  fontSize: 14,
  color: "#ffffff",
  background: "#25D366",
};

const pillGreenStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "8px 12px",
  borderRadius: 999,
  background: "rgba(34,197,94,0.10)",
  border: "1px solid rgba(34,197,94,0.18)",
  color: "#166534",
  fontSize: 13,
  fontWeight: 800,
  width: "fit-content",
};

const pillBlueStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "8px 12px",
  borderRadius: 999,
  background: "rgba(37,99,235,0.08)",
  border: "1px solid rgba(37,99,235,0.16)",
  color: "#2563eb",
  fontSize: 13,
  fontWeight: 800,
  width: "fit-content",
};

const statsGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 14,
};

const statCardStyle: CSSProperties = {
  borderRadius: 22,
  padding: 18,
  background: "rgba(255,255,255,0.82)",
  border: "1px solid rgba(15,23,42,0.08)",
  display: "grid",
  gap: 8,
  boxShadow: "0 14px 30px rgba(15,23,42,0.05)",
};

const statLabelStyle: CSSProperties = {
  color: "#2563eb",
  fontSize: 13,
  fontWeight: 800,
};

const statValueStyle: CSSProperties = {
  color: "#0f172a",
  fontSize: 30,
  lineHeight: 1,
};

const statDetailStyle: CSSProperties = {
  color: "rgba(15,23,42,0.68)",
  fontSize: 13,
  lineHeight: 1.5,
};

const panelTitleStyle: CSSProperties = {
  margin: "14px 0 14px",
  fontSize: 28,
  lineHeight: 1.15,
  color: "#0f172a",
};

const subTitleStyle: CSSProperties = {
  margin: "14px 0 12px",
  fontSize: 22,
  lineHeight: 1.15,
  color: "#0f172a",
};

const twoColumnGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: 16,
};

const threeColumnGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: 16,
};

const stackStyle: CSSProperties = {
  display: "grid",
  gap: 10,
};

const infoRowStyle: CSSProperties = {
  display: "grid",
  gap: 6,
  padding: 12,
  borderRadius: 14,
  background: "rgba(255,255,255,0.86)",
  border: "1px solid rgba(15,23,42,0.08)",
  boxShadow: "0 10px 24px rgba(15,23,42,0.04)",
};

const infoLabelStyle: CSSProperties = {
  color: "#2563eb",
  fontSize: 12,
  fontWeight: 800,
};

const infoValueStyle: CSSProperties = {
  color: "#0f172a",
  fontSize: 15,
};

const listCardStyle: CSSProperties = {
  display: "grid",
  gap: 6,
  padding: 14,
  borderRadius: 16,
  background: "rgba(255,255,255,0.86)",
  border: "1px solid rgba(15,23,42,0.08)",
  boxShadow: "0 10px 24px rgba(15,23,42,0.04)",
};

const itemTitleStyle: CSSProperties = {
  color: "#0f172a",
  fontSize: 16,
};

const itemTextStyle: CSSProperties = {
  color: "rgba(15,23,42,0.72)",
  fontSize: 13,
  lineHeight: 1.5,
};

const loadingBoxStyle: CSSProperties = {
  padding: 18,
  borderRadius: 18,
  background: "rgba(255,255,255,0.82)",
  border: "1px solid rgba(15,23,42,0.08)",
  color: "#0f172a",
  boxShadow: "0 18px 42px rgba(15,23,42,0.06)",
};

const errorBoxStyle: CSSProperties = {
  padding: 18,
  borderRadius: 18,
  background: "rgba(239,68,68,0.08)",
  border: "1px solid rgba(239,68,68,0.18)",
  color: "#b91c1c",
};

const emptyBoxStyle: CSSProperties = {
  padding: 14,
  borderRadius: 14,
  background: "rgba(255,255,255,0.86)",
  border: "1px solid rgba(15,23,42,0.08)",
  color: "rgba(15,23,42,0.70)",
};