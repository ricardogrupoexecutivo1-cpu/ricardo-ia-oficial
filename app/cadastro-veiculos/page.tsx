"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type VehicleForm = {
  titulo: string;
  marca: string;
  modelo: string;
  ano: string;
  cor: string;
  placa: string;
  valorDiaria: string;
  status: string;
  observacoes: string;
};

type SavedVehicle = {
  id: string;
  project_id?: string | null;
  owner_email?: string | null;
  titulo?: string | null;
  marca?: string | null;
  modelo?: string | null;
  ano?: string | null;
  cor?: string | null;
  placa?: string | null;
  valor_diaria?: number | null;
  status?: string | null;
  observacoes?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

const initialState: VehicleForm = {
  titulo: "",
  marca: "",
  modelo: "",
  ano: "",
  cor: "",
  placa: "",
  valorDiaria: "",
  status: "disponivel",
  observacoes: "",
};

function formatMoney(value?: number | null) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "R$ 0,00";
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function formatDate(value?: string | null) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString("pt-BR");
}

function statusLabel(status?: string | null) {
  switch ((status || "").toLowerCase()) {
    case "alugado":
      return "Alugado";
    case "manutencao":
      return "Manutenção";
    case "reservado":
      return "Reservado";
    default:
      return "Disponível";
  }
}

export default function CadastroVeiculosPage() {
  const [form, setForm] = useState<VehicleForm>(initialState);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string>("");
  const [feedbackType, setFeedbackType] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [lastPayload, setLastPayload] = useState<string>("");
  const [vehicles, setVehicles] = useState<SavedVehicle[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [vehiclesError, setVehiclesError] = useState("");

  const pageTitle = useMemo(() => "Cadastro de Veículos", []);
  const appTitle = useMemo(() => "Aurora Locadora Pro", []);
  const ownerEmail = useMemo(
    () => "ricardogrupoexecutivo1@gmail.com",
    []
  );
  const projectId = useMemo(
    () => "a01e064c-fa73-43b6-970a-bae444cbc096",
    []
  );

  function updateField<K extends keyof VehicleForm>(
    field: K,
    value: VehicleForm[K]
  ) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function loadVehicles() {
    setLoadingVehicles(true);
    setVehiclesError("");

    try {
      const params = new URLSearchParams({
        ownerEmail,
        projectId,
      });

      const response = await fetch(`/api/locadora/vehicles?${params.toString()}`, {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data?.ok) {
        setVehiclesError(
          data?.error || "Não foi possível carregar os veículos salvos."
        );
        setVehicles([]);
        return;
      }

      setVehicles(Array.isArray(data?.vehicles) ? data.vehicles : []);
    } catch (error) {
      setVehiclesError(
        error instanceof Error
          ? error.message
          : "Erro de conexão ao carregar veículos."
      );
      setVehicles([]);
    } finally {
      setLoadingVehicles(false);
    }
  }

  useEffect(() => {
    loadVehicles();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setSaving(true);
    setFeedback("");
    setFeedbackType("idle");

    const payload = {
      titulo: form.titulo,
      marca: form.marca,
      modelo: form.modelo,
      ano: form.ano,
      cor: form.cor,
      placa: form.placa,
      valorDiaria: form.valorDiaria,
      status: form.status,
      observacoes: form.observacoes,
      ownerEmail,
      projectId,
    };

    setLastPayload(JSON.stringify(payload, null, 2));

    try {
      const response = await fetch("/api/locadora/vehicles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data?.ok) {
        const details =
          data?.validationErrors?.join(" | ") ||
          data?.debug?.join(" | ") ||
          data?.error ||
          "Falha ao salvar veículo.";

        setFeedback(`Erro ao salvar veículo: ${details}`);
        setFeedbackType("error");
        return;
      }

      setFeedback(
        `Veículo salvo com sucesso. Tabela utilizada: ${data?.tableUsed || "não informada"}.`
      );
      setFeedbackType("success");
      setForm(initialState);
      await loadVehicles();
    } catch (error) {
      setFeedback(
        error instanceof Error
          ? `Erro de conexão: ${error.message}`
          : "Erro de conexão ao salvar veículo."
      );
      setFeedbackType("error");
    } finally {
      setSaving(false);
    }
  }

  function handleReset() {
    setForm(initialState);
    setFeedback("");
    setFeedbackType("idle");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(34,197,94,0.18), transparent 30%), #050816",
        color: "#e5eef8",
        padding: "32px 16px 80px",
      }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: 16,
          }}
        >
          <Link
            href="/"
            style={{
              color: "#93c5fd",
              textDecoration: "none",
              border: "1px solid rgba(147,197,253,0.25)",
              borderRadius: 999,
              padding: "10px 14px",
            }}
          >
            Voltar à Home
          </Link>

          <Link
            href="/guardiao"
            style={{
              color: "#86efac",
              textDecoration: "none",
              border: "1px solid rgba(134,239,172,0.25)",
              borderRadius: 999,
              padding: "10px 14px",
            }}
          >
            Ir para o Guardião
          </Link>

          <Link
            href="/app-builder"
            style={{
              color: "#facc15",
              textDecoration: "none",
              border: "1px solid rgba(250,204,21,0.25)",
              borderRadius: 999,
              padding: "10px 14px",
            }}
          >
            Voltar ao App Builder
          </Link>
        </div>

        <section
          style={{
            border: "1px solid rgba(148,163,184,0.18)",
            background: "rgba(15,23,42,0.72)",
            backdropFilter: "blur(10px)",
            borderRadius: 24,
            padding: 24,
            boxShadow: "0 20px 80px rgba(0,0,0,0.35)",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              padding: "8px 12px",
              borderRadius: 999,
              background: "rgba(34,197,94,0.14)",
              border: "1px solid rgba(34,197,94,0.25)",
              color: "#86efac",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: 0.3,
              marginBottom: 14,
            }}
          >
            Módulo real inicial
          </div>

          <h1 style={{ fontSize: 32, lineHeight: 1.1, margin: 0 }}>
            {pageTitle}
          </h1>

          <p style={{ color: "#94a3b8", marginTop: 12, maxWidth: 820 }}>
            Primeiro arquivo real do módulo do projeto{" "}
            <strong style={{ color: "#fff" }}>{appTitle}</strong>. Estamos em
            constante atualização e pode haver momentos de instabilidade.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 14,
              marginTop: 18,
            }}
          >
            <div
              style={{
                borderRadius: 18,
                padding: 16,
                background: "rgba(15,23,42,0.72)",
                border: "1px solid rgba(148,163,184,0.16)",
              }}
            >
              <div style={{ fontSize: 12, color: "#94a3b8" }}>
                Situação do módulo
              </div>
              <div style={{ fontWeight: 700, marginTop: 8 }}>
                Cadastro e listagem reais ativos
              </div>
            </div>

            <div
              style={{
                borderRadius: 18,
                padding: 16,
                background: "rgba(15,23,42,0.72)",
                border: "1px solid rgba(148,163,184,0.16)",
              }}
            >
              <div style={{ fontSize: 12, color: "#94a3b8" }}>Rota</div>
              <div style={{ fontWeight: 700, marginTop: 8 }}>
                /cadastro-veiculos
              </div>
            </div>

            <div
              style={{
                borderRadius: 18,
                padding: 16,
                background: "rgba(15,23,42,0.72)",
                border: "1px solid rgba(148,163,184,0.16)",
              }}
            >
              <div style={{ fontSize: 12, color: "#94a3b8" }}>Contato</div>
              <div style={{ fontWeight: 700, marginTop: 8 }}>
                {ownerEmail}
              </div>
            </div>

            <div
              style={{
                borderRadius: 18,
                padding: 16,
                background: "rgba(15,23,42,0.72)",
                border: "1px solid rgba(148,163,184,0.16)",
              }}
            >
              <div style={{ fontSize: 12, color: "#94a3b8" }}>Veículos salvos</div>
              <div style={{ fontWeight: 700, marginTop: 8 }}>
                {loadingVehicles ? "Carregando..." : vehicles.length}
              </div>
            </div>
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(320px, 460px) minmax(320px, 1fr)",
            gap: 24,
            alignItems: "start",
          }}
        >
          <div
            style={{
              border: "1px solid rgba(148,163,184,0.18)",
              background: "rgba(15,23,42,0.72)",
              backdropFilter: "blur(10px)",
              borderRadius: 24,
              padding: 24,
              boxShadow: "0 20px 80px rgba(0,0,0,0.35)",
            }}
          >
            <h2 style={{ fontSize: 24, marginTop: 0 }}>
              Cadastro inicial de veículo
            </h2>

            <p style={{ color: "#94a3b8", marginTop: 10 }}>
              Esta tela já está ligada à API real do módulo e agora também lista
              os veículos salvos no banco.
            </p>

            {feedback ? (
              <div
                style={{
                  marginTop: 18,
                  marginBottom: 18,
                  borderRadius: 16,
                  padding: "14px 16px",
                  border:
                    feedbackType === "success"
                      ? "1px solid rgba(34,197,94,0.35)"
                      : "1px solid rgba(239,68,68,0.35)",
                  background:
                    feedbackType === "success"
                      ? "rgba(34,197,94,0.12)"
                      : "rgba(239,68,68,0.12)",
                  color: feedbackType === "success" ? "#bbf7d0" : "#fecaca",
                  whiteSpace: "pre-wrap",
                }}
              >
                {feedback}
              </div>
            ) : null}

            <form
              onSubmit={handleSubmit}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: 14,
                marginTop: 20,
              }}
            >
              {[
                ["titulo", "Título do veículo"],
                ["marca", "Marca"],
                ["modelo", "Modelo"],
                ["ano", "Ano"],
                ["cor", "Cor"],
                ["placa", "Placa"],
                ["valorDiaria", "Valor da diária"],
              ].map(([field, label]) => (
                <label
                  key={field}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  <span style={{ fontSize: 14, color: "#cbd5e1" }}>{label}</span>
                  <input
                    value={form[field as keyof VehicleForm] as string}
                    onChange={(e) =>
                      updateField(
                        field as keyof VehicleForm,
                        e.target.value as never
                      )
                    }
                    style={{
                      borderRadius: 14,
                      border: "1px solid rgba(148,163,184,0.2)",
                      background: "rgba(2,6,23,0.65)",
                      color: "#fff",
                      padding: "14px 16px",
                      outline: "none",
                    }}
                  />
                </label>
              ))}

              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <span style={{ fontSize: 14, color: "#cbd5e1" }}>Status</span>
                <select
                  value={form.status}
                  onChange={(e) => updateField("status", e.target.value)}
                  style={{
                    borderRadius: 14,
                    border: "1px solid rgba(148,163,184,0.2)",
                    background: "rgba(2,6,23,0.65)",
                    color: "#fff",
                    padding: "14px 16px",
                    outline: "none",
                  }}
                >
                  <option value="disponivel">Disponível</option>
                  <option value="alugado">Alugado</option>
                  <option value="manutencao">Manutenção</option>
                  <option value="reservado">Reservado</option>
                </select>
              </label>

              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <span style={{ fontSize: 14, color: "#cbd5e1" }}>
                  Observações
                </span>
                <textarea
                  value={form.observacoes}
                  onChange={(e) => updateField("observacoes", e.target.value)}
                  rows={5}
                  style={{
                    borderRadius: 14,
                    border: "1px solid rgba(148,163,184,0.2)",
                    background: "rgba(2,6,23,0.65)",
                    color: "#fff",
                    padding: "14px 16px",
                    outline: "none",
                    resize: "vertical",
                  }}
                />
              </label>

              <div
                style={{
                  display: "flex",
                  gap: 12,
                  flexWrap: "wrap",
                  marginTop: 8,
                }}
              >
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    border: 0,
                    borderRadius: 999,
                    padding: "14px 22px",
                    background:
                      "linear-gradient(90deg, rgba(34,197,94,1) 0%, rgba(59,130,246,1) 100%)",
                    color: "#04111f",
                    fontWeight: 800,
                    cursor: saving ? "not-allowed" : "pointer",
                    opacity: saving ? 0.7 : 1,
                  }}
                >
                  {saving ? "Salvando..." : "Salvar rascunho"}
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  style={{
                    borderRadius: 999,
                    padding: "14px 22px",
                    background: "transparent",
                    border: "1px solid rgba(148,163,184,0.25)",
                    color: "#e5eef8",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Limpar
                </button>

                <button
                  type="button"
                  onClick={loadVehicles}
                  style={{
                    borderRadius: 999,
                    padding: "14px 22px",
                    background: "transparent",
                    border: "1px solid rgba(34,197,94,0.25)",
                    color: "#86efac",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Atualizar lista
                </button>
              </div>
            </form>

            <div
              style={{
                marginTop: 24,
                borderRadius: 18,
                padding: 16,
                background: "rgba(2,6,23,0.45)",
                border: "1px solid rgba(148,163,184,0.16)",
              }}
            >
              <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 10 }}>
                Payload enviado para a API
              </div>
              <pre
                style={{
                  margin: 0,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  color: "#cbd5e1",
                  fontSize: 13,
                }}
              >
                {lastPayload || "Ainda não enviado."}
              </pre>
            </div>
          </div>

          <div
            style={{
              border: "1px solid rgba(148,163,184,0.18)",
              background: "rgba(15,23,42,0.72)",
              backdropFilter: "blur(10px)",
              borderRadius: 24,
              padding: 24,
              boxShadow: "0 20px 80px rgba(0,0,0,0.35)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                alignItems: "center",
                flexWrap: "wrap",
                marginBottom: 16,
              }}
            >
              <div>
                <h2 style={{ fontSize: 24, margin: 0 }}>Veículos salvos</h2>
                <p style={{ color: "#94a3b8", marginTop: 8, marginBottom: 0 }}>
                  Listagem real da tabela aurora_locadora_vehicles.
                </p>
              </div>

              <div
                style={{
                  borderRadius: 999,
                  padding: "8px 12px",
                  background: "rgba(59,130,246,0.12)",
                  border: "1px solid rgba(59,130,246,0.24)",
                  color: "#bfdbfe",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                {loadingVehicles ? "Carregando..." : `${vehicles.length} registro(s)`}
              </div>
            </div>

            {vehiclesError ? (
              <div
                style={{
                  marginBottom: 16,
                  borderRadius: 16,
                  padding: "14px 16px",
                  border: "1px solid rgba(239,68,68,0.35)",
                  background: "rgba(239,68,68,0.12)",
                  color: "#fecaca",
                  whiteSpace: "pre-wrap",
                }}
              >
                Erro ao carregar veículos: {vehiclesError}
              </div>
            ) : null}

            {loadingVehicles ? (
              <div
                style={{
                  borderRadius: 18,
                  padding: 18,
                  background: "rgba(2,6,23,0.45)",
                  border: "1px solid rgba(148,163,184,0.16)",
                  color: "#cbd5e1",
                }}
              >
                Carregando veículos salvos...
              </div>
            ) : vehicles.length === 0 ? (
              <div
                style={{
                  borderRadius: 18,
                  padding: 18,
                  background: "rgba(2,6,23,0.45)",
                  border: "1px solid rgba(148,163,184,0.16)",
                  color: "#cbd5e1",
                }}
              >
                Nenhum veículo salvo ainda.
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gap: 14,
                }}
              >
                {vehicles.map((vehicle) => (
                  <article
                    key={vehicle.id}
                    style={{
                      borderRadius: 20,
                      padding: 18,
                      background: "rgba(2,6,23,0.45)",
                      border: "1px solid rgba(148,163,184,0.16)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                        alignItems: "flex-start",
                        flexWrap: "wrap",
                      }}
                    >
                      <div>
                        <h3 style={{ margin: 0, fontSize: 20 }}>
                          {vehicle.titulo || "Sem título"}
                        </h3>
                        <p
                          style={{
                            marginTop: 8,
                            marginBottom: 0,
                            color: "#94a3b8",
                          }}
                        >
                          {vehicle.marca || "-"} • {vehicle.modelo || "-"} •{" "}
                          {vehicle.ano || "-"}
                        </p>
                      </div>

                      <div
                        style={{
                          borderRadius: 999,
                          padding: "8px 12px",
                          background: "rgba(34,197,94,0.14)",
                          border: "1px solid rgba(34,197,94,0.25)",
                          color: "#bbf7d0",
                          fontSize: 13,
                          fontWeight: 700,
                        }}
                      >
                        {statusLabel(vehicle.status)}
                      </div>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                        gap: 12,
                        marginTop: 16,
                      }}
                    >
                      <div>
                        <div style={{ fontSize: 12, color: "#94a3b8" }}>Placa</div>
                        <div style={{ marginTop: 6, fontWeight: 700 }}>
                          {vehicle.placa || "-"}
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: 12, color: "#94a3b8" }}>Cor</div>
                        <div style={{ marginTop: 6, fontWeight: 700 }}>
                          {vehicle.cor || "-"}
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: 12, color: "#94a3b8" }}>
                          Valor da diária
                        </div>
                        <div style={{ marginTop: 6, fontWeight: 700 }}>
                          {formatMoney(vehicle.valor_diaria)}
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: 12, color: "#94a3b8" }}>
                          Criado em
                        </div>
                        <div style={{ marginTop: 6, fontWeight: 700 }}>
                          {formatDate(vehicle.created_at)}
                        </div>
                      </div>
                    </div>

                    <div style={{ marginTop: 16 }}>
                      <div style={{ fontSize: 12, color: "#94a3b8" }}>
                        Observações
                      </div>
                      <div
                        style={{
                          marginTop: 6,
                          color: "#e2e8f0",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {vehicle.observacoes || "-"}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}