"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

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
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(34,197,94,0.12), transparent 20%), linear-gradient(180deg, #020617 0%, #03111f 45%, #000000 100%)",
        color: "#ffffff",
        padding: "24px 16px 72px",
      }}
    >
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            marginBottom: 18,
          }}
        >
          <Link href="/locadora" style={topLink}>
            Voltar à locadora
          </Link>

          <Link href="/cadastro-veiculos" style={topLink}>
            Cadastro de veículos
          </Link>

          <Link href="/locadora/clientes" style={topLink}>
            Clientes
          </Link>

          <Link href="/locadora/propostas" style={topLink}>
            Propostas
          </Link>

          <Link href="/locadora/importar" style={topLink}>
            Importar CSV
          </Link>
        </div>

        <header style={heroBox}>
          <div style={{ display: "grid", gap: 14 }}>
            <div style={pillGreen}>
              <span>📊</span>
              <span>Dashboard completo da locadora</span>
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: "clamp(32px, 6vw, 58px)",
                lineHeight: 1.02,
                fontWeight: 900,
                letterSpacing: "-0.04em",
              }}
            >
              Controle comercial, operacional e de propostas
            </h1>

            <p
              style={{
                margin: 0,
                maxWidth: 900,
                color: "rgba(226,232,240,0.82)",
                fontSize: "clamp(15px, 3vw, 19px)",
                lineHeight: 1.7,
              }}
            >
              Painel central da Aurora Locadora para acompanhar clientes, frota,
              propostas, importação e potencial de fechamento. Estamos em constante
              atualização e pode haver momentos de instabilidade.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 12,
                marginTop: 4,
              }}
            >
              <Link href="/locadora/propostas" style={ctaGreen}>
                Abrir propostas
              </Link>

              <Link href="/locadora/importar" style={ctaBlue}>
                Importar frota CSV
              </Link>

              <Link href="/cadastro-veiculos" style={ctaDark}>
                Cadastrar veículo
              </Link>

              <Link href="/locadora/clientes" style={ctaDark}>
                Ver clientes
              </Link>
            </div>
          </div>
        </header>

        <section style={panelForm}>
          <div style={pillBlue}>
            <span>🔐</span>
            <span>Identificação do operador</span>
          </div>

          <h2 style={panelTitle}>Carregar dashboard do operador certo</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 12,
              marginTop: 12,
            }}
          >
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mail do operador"
              style={input}
            />

            <input
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              placeholder="Project ID (opcional)"
              style={input}
            />
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              marginTop: 12,
            }}
          >
            <button onClick={salvarECarregar} style={buttonGreen}>
              Salvar e carregar dashboard
            </button>

            <button
              onClick={() => carregarDashboard(email.trim(), projectId.trim())}
              style={buttonDark}
            >
              Recarregar agora
            </button>
          </div>

          <p style={helperText}>
            Dica: use o e-mail <strong>ricardogrupoexecutivo1@gmail.com</strong>. Se
            quiser filtrar por projeto, use o project ID da locadora.
          </p>
        </section>

        {erro ? <div style={errorBox}>{erro}</div> : null}

        {carregando ? (
          <div style={loadingBox}>Carregando dashboard...</div>
        ) : (
          <>
            <section
              style={{
                marginTop: 18,
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 14,
              }}
            >
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

            <section
              style={{
                marginTop: 18,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
              <div style={panel}>
                <div style={pillBlue}>
                  <span>🧠</span>
                  <span>Resumo estratégico</span>
                </div>

                <h2 style={panelTitle}>Visão rápida do momento da locadora</h2>

                <div style={{ display: "grid", gap: 10 }}>
                  <InfoRow
                    label="Operador"
                    value={email || "Não identificado"}
                  />
                  <InfoRow
                    label="Projeto"
                    value={projectId || "Sem projectId salvo"}
                  />
                  <InfoRow
                    label="Clientes cadastrados"
                    value={String(totalClientes)}
                  />
                  <InfoRow
                    label="Frota cadastrada"
                    value={String(totalVeiculos)}
                  />
                  <InfoRow
                    label="Funil em aberto"
                    value={String(propostasAbertas)}
                  />
                  <InfoRow
                    label="Valor aprovado"
                    value={formatCurrency(valorTotalPropostasAprovadas)}
                  />
                </div>
              </div>

              <div style={panel}>
                <div style={pillGreen}>
                  <span>🚀</span>
                  <span>Ações rápidas</span>
                </div>

                <h2 style={panelTitle}>Atalhos para operação comercial</h2>

                <div style={{ display: "grid", gap: 10 }}>
                  <Link href="/locadora/propostas" style={ctaDarkBlock}>
                    Criar e acompanhar propostas
                  </Link>

                  <Link href="/locadora/importar" style={ctaDarkBlock}>
                    Importar frota em massa
                  </Link>

                  <Link href="/cadastro-veiculos" style={ctaDarkBlock}>
                    Cadastrar novo veículo
                  </Link>

                  <Link href="/locadora/clientes" style={ctaDarkBlock}>
                    Abrir lista de clientes
                  </Link>

                  <a
                    href="https://wa.me/5531997490074"
                    target="_blank"
                    rel="noreferrer"
                    style={whatsBlock}
                  >
                    Falar no WhatsApp comercial
                  </a>
                </div>
              </div>
            </section>

            <section
              style={{
                marginTop: 18,
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 16,
              }}
            >
              <div style={panel}>
                <div style={pillGreen}>
                  <span>👤</span>
                  <span>Clientes recentes</span>
                </div>

                <h3 style={subTitle}>Últimos clientes carregados</h3>

                {clientesRecentes.length === 0 ? (
                  <EmptyState text="Nenhum cliente encontrado." />
                ) : (
                  <div style={{ display: "grid", gap: 10 }}>
                    {clientesRecentes.map((cliente) => (
                      <div key={cliente.id} style={listCard}>
                        <strong style={itemTitle}>
                          {cliente.nome || "Sem nome"}
                        </strong>
                        <span style={itemText}>
                          {cliente.whatsapp ? `WhatsApp: ${cliente.whatsapp}` : "Sem WhatsApp"}
                        </span>
                        <span style={itemText}>
                          {cliente.email || "Sem e-mail"}
                        </span>
                        <span style={itemText}>
                          {[cliente.cidade, cliente.estado].filter(Boolean).join(" - ") || "Local não informado"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={panel}>
                <div style={pillBlue}>
                  <span>🚗</span>
                  <span>Veículos recentes</span>
                </div>

                <h3 style={subTitle}>Últimos veículos carregados</h3>

                {veiculosRecentes.length === 0 ? (
                  <EmptyState text="Nenhum veículo encontrado." />
                ) : (
                  <div style={{ display: "grid", gap: 10 }}>
                    {veiculosRecentes.map((veiculo) => (
                      <div key={veiculo.id} style={listCard}>
                        <strong style={itemTitle}>
                          {veiculo.titulo || "Sem título"}
                        </strong>
                        <span style={itemText}>
                          {[veiculo.marca, veiculo.modelo].filter(Boolean).join(" • ") || "Sem marca/modelo"}
                        </span>
                        <span style={itemText}>
                          {[veiculo.ano, veiculo.cor].filter(Boolean).join(" • ") || "Sem ano/cor"}
                        </span>
                        <span style={itemText}>
                          Placa: {veiculo.placa || "Não informada"} • Status: {veiculo.status || "Sem status"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={panel}>
                <div style={pillGreen}>
                  <span>📄</span>
                  <span>Propostas recentes</span>
                </div>

                <h3 style={subTitle}>Últimas propostas do funil</h3>

                {propostasRecentes.length === 0 ? (
                  <EmptyState text="Nenhuma proposta encontrada." />
                ) : (
                  <div style={{ display: "grid", gap: 10 }}>
                    {propostasRecentes.map((proposta) => (
                      <div key={proposta.id} style={listCard}>
                        <strong style={itemTitle}>
                          {proposta.cliente_nome || "Cliente não informado"}
                        </strong>
                        <span style={itemText}>
                          Veículo: {proposta.veiculo_nome || "Não informado"}
                        </span>
                        <span style={itemText}>
                          Valor: {formatCurrency(proposta.valor)}
                        </span>
                        <span style={itemText}>
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
      </div>
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
    <div style={statCard}>
      <span style={statLabel}>{label}</span>
      <strong style={statValue}>{value}</strong>
      <span style={statDetail}>{detail}</span>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={infoRow}>
      <span style={infoLabel}>{label}</span>
      <strong style={infoValue}>{value}</strong>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return <div style={emptyBox}>{text}</div>;
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

const heroBox = {
  borderRadius: 28,
  padding: 22,
  border: "1px solid rgba(74,222,128,0.16)",
  background:
    "linear-gradient(180deg, rgba(7,18,30,0.98) 0%, rgba(3,12,23,0.98) 100%)",
  boxShadow: "0 24px 80px rgba(0,0,0,0.38)",
};

const panel = {
  borderRadius: 24,
  padding: 20,
  border: "1px solid rgba(148,163,184,0.12)",
  background:
    "linear-gradient(180deg, rgba(8,18,32,0.98) 0%, rgba(6,13,24,0.98) 100%)",
};

const panelForm = {
  marginTop: 18,
  borderRadius: 24,
  padding: 20,
  border: "1px solid rgba(148,163,184,0.12)",
  background:
    "linear-gradient(180deg, rgba(8,18,32,0.98) 0%, rgba(6,13,24,0.98) 100%)",
};

const input = {
  width: "100%",
  minHeight: 50,
  padding: "0 14px",
  borderRadius: 14,
  border: "1px solid rgba(148,163,184,0.20)",
  background: "rgba(255,255,255,0.03)",
  color: "#ffffff",
};

const buttonGreen = {
  minHeight: 48,
  padding: "0 16px",
  borderRadius: 14,
  border: "none",
  background: "linear-gradient(135deg, #22c55e, #4ade80)",
  color: "#04130a",
  fontWeight: 900,
};

const buttonDark = {
  minHeight: 48,
  padding: "0 16px",
  borderRadius: 14,
  border: "1px solid rgba(148,163,184,0.20)",
  background: "rgba(15,23,42,0.72)",
  color: "#e5e7eb",
  fontWeight: 800,
};

const helperText = {
  marginTop: 10,
  color: "rgba(226,232,240,0.72)",
  lineHeight: 1.6,
  fontSize: 14,
};

const topLink = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 42,
  padding: "0 14px",
  borderRadius: 12,
  textDecoration: "none",
  fontWeight: 700,
  fontSize: 14,
  color: "#dbeafe",
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(148,163,184,0.14)",
};

const ctaGreen = {
  textDecoration: "none",
  borderRadius: 16,
  padding: "14px 16px",
  background: "linear-gradient(135deg, #22c55e, #4ade80)",
  color: "#04130a",
  fontWeight: 900,
  textAlign: "center" as const,
};

const ctaBlue = {
  textDecoration: "none",
  borderRadius: 16,
  padding: "14px 16px",
  background: "linear-gradient(135deg, #3b82f6, #60a5fa)",
  color: "#eff6ff",
  fontWeight: 900,
  textAlign: "center" as const,
};

const ctaDark = {
  textDecoration: "none",
  borderRadius: 16,
  padding: "14px 16px",
  background: "rgba(15,23,42,0.72)",
  border: "1px solid rgba(148,163,184,0.20)",
  color: "#e5e7eb",
  fontWeight: 800,
  textAlign: "center" as const,
};

const ctaDarkBlock = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 48,
  padding: "0 16px",
  borderRadius: 14,
  textDecoration: "none",
  fontWeight: 800,
  fontSize: 14,
  color: "#e5e7eb",
  background: "rgba(15,23,42,0.72)",
  border: "1px solid rgba(148,163,184,0.20)",
};

const whatsBlock = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 48,
  padding: "0 16px",
  borderRadius: 14,
  textDecoration: "none",
  fontWeight: 900,
  fontSize: 14,
  color: "#04110a",
  background: "#25D366",
};

const pillGreen = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "8px 12px",
  borderRadius: 999,
  background: "rgba(34,197,94,0.12)",
  border: "1px solid rgba(74,222,128,0.22)",
  color: "#bbf7d0",
  fontSize: 13,
  fontWeight: 800,
};

const pillBlue = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "8px 12px",
  borderRadius: 999,
  background: "rgba(59,130,246,0.12)",
  border: "1px solid rgba(96,165,250,0.22)",
  color: "#dbeafe",
  fontSize: 13,
  fontWeight: 800,
};

const statCard = {
  borderRadius: 22,
  padding: 18,
  background:
    "linear-gradient(180deg, rgba(8,18,32,0.98) 0%, rgba(6,13,24,0.98) 100%)",
  border: "1px solid rgba(148,163,184,0.12)",
  display: "grid",
  gap: 8,
};

const statLabel = {
  color: "#93c5fd",
  fontSize: 13,
  fontWeight: 800,
};

const statValue = {
  color: "#f8fffb",
  fontSize: 30,
  lineHeight: 1,
};

const statDetail = {
  color: "rgba(226,232,240,0.68)",
  fontSize: 13,
  lineHeight: 1.5,
};

const panelTitle = {
  margin: "14px 0 14px",
  fontSize: 28,
  lineHeight: 1.15,
  color: "#f8fffb",
};

const subTitle = {
  margin: "14px 0 12px",
  fontSize: 22,
  lineHeight: 1.15,
  color: "#f8fffb",
};

const infoRow = {
  display: "grid",
  gap: 6,
  padding: 12,
  borderRadius: 14,
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(148,163,184,0.10)",
};

const infoLabel = {
  color: "#93c5fd",
  fontSize: 12,
  fontWeight: 800,
};

const infoValue = {
  color: "#f8fffb",
  fontSize: 15,
};

const listCard = {
  display: "grid",
  gap: 6,
  padding: 14,
  borderRadius: 16,
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(148,163,184,0.10)",
};

const itemTitle = {
  color: "#f8fffb",
  fontSize: 16,
};

const itemText = {
  color: "rgba(226,232,240,0.72)",
  fontSize: 13,
  lineHeight: 1.5,
};

const loadingBox = {
  marginTop: 18,
  padding: 18,
  borderRadius: 18,
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(148,163,184,0.10)",
};

const errorBox = {
  marginTop: 18,
  padding: 18,
  borderRadius: 18,
  background: "rgba(127,29,29,0.22)",
  border: "1px solid rgba(248,113,113,0.28)",
  color: "#fecaca",
};

const emptyBox = {
  padding: 14,
  borderRadius: 14,
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(148,163,184,0.10)",
  color: "rgba(226,232,240,0.70)",
};