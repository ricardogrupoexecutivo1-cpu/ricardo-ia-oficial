"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

type SearchMode = "smart" | "email" | "nome" | "empresa" | "whatsapp";

type CadastroPerfil = {
  cadastro_id: string;
  nome: string | null;
};

type CadastroSegmento = {
  cadastro_id: string;
  nome: string | null;
};

type CadastroProdutoServico = {
  cadastro_id: string;
  nome: string | null;
};

type CadastroSegmentoAtendido = {
  cadastro_id: string;
  nome: string | null;
};

type CadastroAreaCobertura = {
  cadastro_id: string;
  coverage_type: string | null;
  pais: string | null;
  estado: string | null;
  regiao: string | null;
  cidade: string | null;
  observacao: string | null;
};

type CadastroRow = {
  id: string;
  nome_responsavel: string | null;
  nome_empresa: string | null;
  email: string | null;
  whatsapp: string | null;
  cidade_base: string | null;
  estado_base: string | null;
  cidade_publica: string | null;
  estado_publico: string | null;
  nome_publico: string | null;
  coverage_type: string | null;
  atendimento_tipo: string | null;
  status: string | null;
  is_public: boolean | null;
  origem: string | null;
  cadastro_tipo: string | null;
  cadastro_completo: boolean | null;
  created_at: string | null;
  updated_at: string | null;
  perfis?: CadastroPerfil[];
  segmentos?: CadastroSegmento[];
  produtos_servicos?: CadastroProdutoServico[];
  segmentos_atendidos?: CadastroSegmentoAtendido[];
  areas_cobertura?: CadastroAreaCobertura[];
};

type AuditResponse =
  | {
      ok: true;
      mode: SearchMode;
      term: string;
      totals: {
        total: number;
        publicos: number;
        privados: number;
        rascunhos: number;
        ativos: number;
      };
      cadastros: CadastroRow[];
    }
  | {
      ok: false;
      error: string;
    };

function getStoredEmail() {
  if (typeof window === "undefined") return "";

  const candidates = [
    localStorage.getItem("aurora-cadastro-geral-email"),
    localStorage.getItem("user_email"),
    localStorage.getItem("aurora_user_email"),
    localStorage.getItem("email"),
  ];

  return (
    candidates.find((value) => typeof value === "string" && value.trim().length > 0)?.trim() ||
    ""
  );
}

function formatDate(value: string | null) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

function getCoverageLabel(value: string | null) {
  switch (value) {
    case "municipal":
      return "Municipal";
    case "regional":
      return "Regional";
    case "estadual":
      return "Estadual";
    case "nacional":
      return "Brasil";
    case "internacional":
      return "Internacional";
    default:
      return value || "Não informado";
  }
}

function getStatusTone(status: string | null, isPublic: boolean | null) {
  const normalized = (status || "").toLowerCase();

  if (normalized === "bloqueado") {
    return {
      label: "Bloqueado",
      textColor: "#b91c1c",
      bgColor: "rgba(239,68,68,0.10)",
      borderColor: "rgba(239,68,68,0.18)",
    };
  }

  if (normalized === "inativo") {
    return {
      label: "Inativo",
      textColor: "#92400e",
      bgColor: "rgba(245,158,11,0.10)",
      borderColor: "rgba(245,158,11,0.18)",
    };
  }

  if (normalized === "ativo" && isPublic) {
    return {
      label: "Ativo público",
      textColor: "#15803d",
      bgColor: "rgba(34,197,94,0.10)",
      borderColor: "rgba(34,197,94,0.18)",
    };
  }

  if (normalized === "ativo") {
    return {
      label: "Ativo privado",
      textColor: "#1d4ed8",
      bgColor: "rgba(59,130,246,0.10)",
      borderColor: "rgba(59,130,246,0.18)",
    };
  }

  return {
    label: "Rascunho",
    textColor: "#7c3aed",
    bgColor: "rgba(124,58,237,0.10)",
    borderColor: "rgba(124,58,237,0.18)",
  };
}

function getPublicVisibilityLabel(isPublic: boolean | null) {
  return isPublic ? "Público" : "Privado";
}

function getSafeDisplayName(item: CadastroRow) {
  return (
    item.nome_empresa?.trim() ||
    item.nome_publico?.trim() ||
    item.nome_responsavel?.trim() ||
    "Cadastro sem nome"
  );
}

function getLocationLabel(item: CadastroRow) {
  const city = item.cidade_publica || item.cidade_base || "";
  const state = item.estado_publico || item.estado_base || "";

  if (city && state) return `${city} • ${state}`;
  if (city) return city;
  if (state) return state;

  return "Local não informado";
}

function getModeLabel(mode: SearchMode) {
  switch (mode) {
    case "email":
      return "E-mail";
    case "nome":
      return "Nome";
    case "empresa":
      return "Empresa";
    case "whatsapp":
      return "WhatsApp";
    default:
      return "Busca inteligente";
  }
}

function getErrorMessage(error: unknown) {
  if (typeof error === "string") return error;

  if (error && typeof error === "object" && "error" in error) {
    const maybeError = (error as { error?: unknown }).error;
    if (typeof maybeError === "string") return maybeError;
  }

  return "Falha ao carregar os cadastros reais do Guardião.";
}

function buildAuditFeedback(
  total: number,
  publicos: number,
  rascunhos: number,
  term: string
) {
  if (total === 0) {
    return term.trim()
      ? `Nenhum cadastro encontrado para "${term}". Tente variar entre e-mail, nome, empresa, WhatsApp ou usar a busca inteligente.`
      : "Nenhum cadastro encontrado. Digite um termo para iniciar a auditoria.";
  }

  return term.trim()
    ? `Auditoria concluída para "${term}". Encontramos ${total} cadastro(s), sendo ${publicos} público(s) e ${rascunhos} em rascunho.`
    : `Auditoria concluída. Encontramos ${total} cadastro(s), sendo ${publicos} público(s) e ${rascunhos} em rascunho.`;
}

export default function GuardiaoPage() {
  const [searchMode, setSearchMode] = useState<SearchMode>("smart");
  const [searchTerm, setSearchTerm] = useState("");
  const [inputSearchTerm, setInputSearchTerm] = useState("");
  const [cadastros, setCadastros] = useState<CadastroRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingAudit, setLoadingAudit] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const stats = useMemo(() => {
    const total = cadastros.length;
    const publicos = cadastros.filter((item) => item.is_public).length;
    const rascunhos = cadastros.filter(
      (item) => (item.status || "rascunho").toLowerCase() === "rascunho"
    ).length;
    const ativos = cadastros.filter(
      (item) => (item.status || "").toLowerCase() === "ativo"
    ).length;
    const privados = cadastros.filter((item) => !item.is_public).length;

    return {
      total,
      publicos,
      rascunhos,
      ativos,
      privados,
    };
  }, [cadastros]);

  const loadCadastros = useCallback(async (targetTerm: string, mode: SearchMode) => {
    setLoading(true);
    setError(null);
    setFeedback(null);

    try {
      const response = await fetch("/api/guardiao/audit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({
          term: targetTerm,
          mode,
        }),
      });

      const json = (await response.json()) as AuditResponse;

      if (!response.ok || !json.ok) {
        throw new Error(getErrorMessage(json));
      }

      setCadastros(json.cadastros);
      setFeedback(
        buildAuditFeedback(
          json.totals.total,
          json.totals.publicos,
          json.totals.rascunhos,
          targetTerm
        )
      );
    } catch (loadError) {
      const message =
        loadError instanceof Error
          ? loadError.message
          : "Falha ao carregar os cadastros reais do Guardião.";

      setError(message);
      setCadastros([]);
      setFeedback(null);
    } finally {
      setLoading(false);
      setLoadingAudit(false);
    }
  }, []);

  useEffect(() => {
    const stored = getStoredEmail();
    setSearchTerm(stored);
    setInputSearchTerm(stored);

    if (!stored) {
      setLoading(false);
      setFeedback(
        "Digite um e-mail, nome, empresa ou WhatsApp para iniciar a auditoria completa dos cadastros."
      );
      return;
    }

    void loadCadastros(stored, "smart");
  }, [loadCadastros]);

  function handleAudit() {
    const normalized = inputSearchTerm.trim();

    setLoadingAudit(true);
    setSearchTerm(normalized);

    try {
      if (normalized.includes("@")) {
        localStorage.setItem("aurora-cadastro-geral-email", normalized.toLowerCase());
      }
    } catch {}

    void loadCadastros(normalized, searchMode);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(59,130,246,0.10), transparent 18%), radial-gradient(circle at left, rgba(34,197,94,0.10), transparent 24%), linear-gradient(180deg, #eef6ff 0%, #f7fbff 36%, #edf7f3 100%)",
        color: "#0f172a",
        overflow: "hidden",
      }}
    >
      <section
        style={{
          maxWidth: 1320,
          margin: "0 auto",
          padding: "18px 16px 64px",
          display: "grid",
          gap: 18,
        }}
      >
        <section
          style={{
            position: "relative",
            border: "1px solid rgba(15,23,42,0.08)",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.86), rgba(255,255,255,0.72))",
            borderRadius: 32,
            padding: "24px 18px 20px",
            boxShadow: "0 22px 70px rgba(15,23,42,0.09)",
            overflow: "hidden",
            display: "grid",
            gap: 18,
          }}
        >
          <div
            style={{
              position: "absolute",
              width: 420,
              height: 420,
              borderRadius: 999,
              background:
                "radial-gradient(circle, rgba(59,130,246,0.12) 0%, rgba(59,130,246,0.04) 44%, transparent 72%)",
              top: -150,
              left: -100,
              filter: "blur(20px)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              width: 320,
              height: 320,
              borderRadius: 999,
              background:
                "radial-gradient(circle, rgba(16,185,129,0.10) 0%, rgba(16,185,129,0.03) 45%, transparent 72%)",
              bottom: -80,
              right: -40,
              filter: "blur(18px)",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 2,
              display: "grid",
              gap: 14,
            }}
          >
            <div
              style={{
                display: "inline-flex",
                width: "fit-content",
                alignItems: "center",
                gap: 8,
                padding: "7px 11px",
                borderRadius: 999,
                background: "rgba(37,99,235,0.08)",
                border: "1px solid rgba(37,99,235,0.16)",
                color: "#2563eb",
                fontSize: 12,
                fontWeight: 800,
                boxShadow: "0 0 16px rgba(37,99,235,0.06)",
              }}
            >
              🛡️ Guardião da Aurora
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: "clamp(34px, 5.4vw, 58px)",
                lineHeight: 0.98,
                letterSpacing: "-0.05em",
                maxWidth: 960,
                color: "#0f172a",
              }}
            >
              Guardião real com auditoria completa
            </h1>

            <p
              style={{
                margin: 0,
                color: "rgba(15,23,42,0.74)",
                fontSize: 18,
                lineHeight: 1.6,
                maxWidth: 980,
                fontWeight: 700,
              }}
            >
              Agora o Guardião pode auditar os cadastros por e-mail, primeiro nome,
              nome completo, empresa ou WhatsApp. Isso ajuda a descobrir cadastro
              perdido, duplicado, privado, em rascunho ou salvo com outro dado de referência.
            </p>

            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <Link href="/" style={secondaryButtonStyle}>
                Voltar à Home
              </Link>
              <Link href="/cadastro" style={secondaryButtonStyle}>
                Ir para Cadastro
              </Link>
              <Link href="/cadastros" style={secondaryButtonStyle}>
                Busca pública
              </Link>
              <Link href="/mineracao" style={secondaryButtonStyle}>
                Mineração
              </Link>
            </div>

            <div
              style={{
                display: "grid",
                gap: 12,
                border: "1px solid rgba(37,99,235,0.14)",
                background: "rgba(255,255,255,0.72)",
                borderRadius: 22,
                padding: 16,
                boxShadow: "0 12px 28px rgba(15,23,42,0.05)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                {[
                  { value: "smart", label: "Busca inteligente" },
                  { value: "email", label: "E-mail" },
                  { value: "nome", label: "Nome" },
                  { value: "empresa", label: "Empresa" },
                  { value: "whatsapp", label: "WhatsApp" },
                ].map((item) => {
                  const active = searchMode === item.value;
                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setSearchMode(item.value as SearchMode)}
                      style={{
                        minHeight: 40,
                        padding: "0 14px",
                        borderRadius: 999,
                        cursor: "pointer",
                        fontWeight: 800,
                        fontSize: 13,
                        border: active
                          ? "1px solid rgba(37,99,235,0.22)"
                          : "1px solid rgba(15,23,42,0.08)",
                        background: active
                          ? "linear-gradient(135deg, rgba(37,99,235,0.10), rgba(59,130,246,0.04))"
                          : "rgba(255,255,255,0.66)",
                        color: active ? "#1d4ed8" : "#0f172a",
                        boxShadow: active ? "0 0 14px rgba(37,99,235,0.06)" : "none",
                      }}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(0, 1.4fr) auto",
                  gap: 12,
                  alignItems: "end",
                }}
              >
                <label
                  style={{
                    display: "grid",
                    gap: 8,
                  }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 800,
                      color: "#2563eb",
                      letterSpacing: "0.03em",
                      textTransform: "uppercase",
                    }}
                  >
                    Termo para auditoria
                  </span>
                  <input
                    value={inputSearchTerm}
                    onChange={(event) => setInputSearchTerm(event.target.value)}
                    placeholder="Digite e-mail, primeiro nome, nome completo, empresa ou WhatsApp"
                    style={{
                      width: "100%",
                      minHeight: 52,
                      borderRadius: 16,
                      border: "1px solid rgba(15,23,42,0.10)",
                      background: "rgba(255,255,255,0.92)",
                      color: "#0f172a",
                      padding: "0 14px",
                      fontSize: 15,
                      fontWeight: 700,
                      outline: "none",
                      boxShadow: "0 8px 18px rgba(15,23,42,0.04)",
                    }}
                  />
                </label>

                <button
                  type="button"
                  onClick={handleAudit}
                  disabled={loadingAudit}
                  style={{
                    minHeight: 52,
                    padding: "0 18px",
                    border: "none",
                    borderRadius: 16,
                    cursor: loadingAudit ? "wait" : "pointer",
                    background: "linear-gradient(135deg, #2563eb, #22c55e)",
                    color: "#ffffff",
                    fontSize: 14,
                    fontWeight: 900,
                    boxShadow: "0 18px 40px rgba(37,99,235,0.18)",
                  }}
                >
                  {loadingAudit ? "Auditando..." : "Auditar agora"}
                </button>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: 12,
              }}
            >
              <MiniCard label="Modo" value={getModeLabel(searchMode)} />
              <MiniCard label="Termo em uso" value={searchTerm || "Não definido"} />
              <MiniCard label="Total de cadastros" value={String(stats.total)} />
              <MiniCard label="Públicos" value={String(stats.publicos)} />
              <MiniCard label="Rascunhos" value={String(stats.rascunhos)} />
              <MiniCard label="Ativos" value={String(stats.ativos)} />
              <MiniCard label="Privados" value={String(stats.privados)} />
            </div>

            {loading ? (
              <MessageBox
                tone="info"
                title="Carregando auditoria"
                text="Estamos consultando a API segura do Guardião."
              />
            ) : null}

            {feedback ? (
              <MessageBox tone="success" title="Leitura do Guardião" text={feedback} />
            ) : null}

            {error ? (
              <MessageBox tone="danger" title="Falha de leitura" text={error} />
            ) : null}

            <MessageBox
              tone="info"
              title="Importante"
              text="Agora a leitura é server-side. Se der erro daqui para frente, o motivo real vai aparecer no retorno da API, e não mais uma falha genérica do navegador."
            />
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gap: 16,
          }}
        >
          {cadastros.length === 0 && !loading ? (
            <div
              style={{
                borderRadius: 24,
                padding: 22,
                background: "#ffffff",
                border: "1px solid rgba(15,23,42,0.08)",
                boxShadow: "0 10px 24px rgba(15,23,42,0.06)",
              }}
            >
              <h2 style={{ margin: 0, fontWeight: 900 }}>Nenhum cadastro encontrado</h2>
              <p
                style={{
                  margin: "10px 0 0",
                  color: "#475569",
                  lineHeight: 1.7,
                }}
              >
                Tente variar entre busca inteligente, e-mail, nome, empresa e WhatsApp.
                Quando o usuário não sabe exatamente qual dado usou, a busca inteligente costuma encontrar mais.
              </p>
            </div>
          ) : null}

          {cadastros.map((cadastro) => {
            const tone = getStatusTone(cadastro.status, cadastro.is_public);

            return (
              <article
                key={cadastro.id}
                style={{
                  borderRadius: 24,
                  padding: 20,
                  background: "#ffffff",
                  border: "1px solid rgba(15,23,42,0.08)",
                  boxShadow: "0 10px 24px rgba(15,23,42,0.06)",
                  display: "grid",
                  gap: 16,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 14,
                    flexWrap: "wrap",
                    alignItems: "flex-start",
                  }}
                >
                  <div style={{ display: "grid", gap: 8 }}>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 800,
                        color: "#64748b",
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                      }}
                    >
                      Cadastro real
                    </div>

                    <h2
                      style={{
                        margin: 0,
                        fontSize: "clamp(22px, 3vw, 30px)",
                        lineHeight: 1.05,
                        letterSpacing: "-0.04em",
                        color: "#0f172a",
                      }}
                    >
                      {getSafeDisplayName(cadastro)}
                    </h2>

                    <div
                      style={{
                        color: "#475569",
                        fontSize: 14,
                        fontWeight: 700,
                        wordBreak: "break-word",
                      }}
                    >
                      ID: {cadastro.id}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      flexWrap: "wrap",
                    }}
                  >
                    <Pill
                      label={tone.label}
                      textColor={tone.textColor}
                      bgColor={tone.bgColor}
                      borderColor={tone.borderColor}
                    />
                    <Pill
                      label={getPublicVisibilityLabel(cadastro.is_public)}
                      textColor={cadastro.is_public ? "#15803d" : "#92400e"}
                      bgColor={cadastro.is_public ? "rgba(34,197,94,0.10)" : "rgba(245,158,11,0.10)"}
                      borderColor={cadastro.is_public ? "rgba(34,197,94,0.18)" : "rgba(245,158,11,0.18)"}
                    />
                  </div>
                </div>

                <div
                  style={{
                    height: 1,
                    background:
                      "linear-gradient(90deg, rgba(37,99,235,0.14), rgba(15,23,42,0.06), transparent)",
                  }}
                />

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: 12,
                  }}
                >
                  <InfoItem label="Responsável" value={cadastro.nome_responsavel || "-"} />
                  <InfoItem label="Empresa" value={cadastro.nome_empresa || "-"} />
                  <InfoItem label="Nome público" value={cadastro.nome_publico || "-"} />
                  <InfoItem label="E-mail" value={cadastro.email || "-"} />
                  <InfoItem label="WhatsApp" value={cadastro.whatsapp || "-"} />
                  <InfoItem label="Cobertura" value={getCoverageLabel(cadastro.coverage_type)} />
                  <InfoItem label="Atendimento" value={cadastro.atendimento_tipo || "-"} />
                  <InfoItem label="Cidade / estado" value={getLocationLabel(cadastro)} />
                  <InfoItem label="Origem" value={cadastro.origem || "-"} />
                  <InfoItem label="Tipo" value={cadastro.cadastro_tipo || "-"} />
                  <InfoItem
                    label="Cadastro completo"
                    value={cadastro.cadastro_completo ? "SIM" : "NÃO"}
                  />
                  <InfoItem label="Criado em" value={formatDate(cadastro.created_at)} />
                  <InfoItem label="Atualizado em" value={formatDate(cadastro.updated_at)} />
                  <InfoItem
                    label="Perfis"
                    value={
                      cadastro.perfis?.map((item) => item.nome).filter(Boolean).join(" • ") || "-"
                    }
                  />
                  <InfoItem
                    label="Segmentos"
                    value={
                      cadastro.segmentos?.map((item) => item.nome).filter(Boolean).join(" • ") || "-"
                    }
                  />
                  <InfoItem
                    label="Produtos / serviços"
                    value={
                      cadastro.produtos_servicos
                        ?.map((item) => item.nome)
                        .filter(Boolean)
                        .join(" • ") || "-"
                    }
                  />
                  <InfoItem
                    label="Segmentos atendidos"
                    value={
                      cadastro.segmentos_atendidos
                        ?.map((item) => item.nome)
                        .filter(Boolean)
                        .join(" • ") || "-"
                    }
                  />
                  <InfoItem
                    label="Áreas de cobertura"
                    value={
                      cadastro.areas_cobertura
                        ?.map((item) =>
                          [item.cidade, item.estado, item.regiao, item.pais, item.coverage_type]
                            .filter(Boolean)
                            .join(" / ")
                        )
                        .filter(Boolean)
                        .join(" • ") || "-"
                    }
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    flexWrap: "wrap",
                  }}
                >
                  <Link href="/cadastro" style={secondaryButtonStyle}>
                    Novo cadastro
                  </Link>
                  <Link href="/cadastros" style={secondaryButtonStyle}>
                    Ver busca pública
                  </Link>
                </div>
              </article>
            );
          })}
        </section>
      </section>
    </main>
  );
}

function MiniCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        borderRadius: 22,
        padding: 18,
        background: "#ffffff",
        border: "1px solid rgba(15,23,42,0.08)",
        boxShadow: "0 10px 24px rgba(15,23,42,0.06)",
        display: "grid",
        gap: 8,
      }}
    >
      <div
        style={{
          fontSize: 12,
          fontWeight: 800,
          color: "#64748b",
          textTransform: "uppercase",
          letterSpacing: "0.04em",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 18,
          fontWeight: 900,
          color: "#0f172a",
          lineHeight: 1.2,
          wordBreak: "break-word",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        borderRadius: 18,
        padding: 14,
        background: "rgba(248,250,252,0.9)",
        border: "1px solid rgba(15,23,42,0.06)",
        display: "grid",
        gap: 6,
      }}
    >
      <div
        style={{
          fontSize: 12,
          fontWeight: 800,
          color: "#64748b",
          textTransform: "uppercase",
          letterSpacing: "0.04em",
        }}
      >
        {label}
      </div>
      <div
        style={{
          color: "#0f172a",
          fontSize: 14,
          lineHeight: 1.6,
          fontWeight: 700,
          wordBreak: "break-word",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function Pill({
  label,
  textColor,
  bgColor,
  borderColor,
}: {
  label: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        minHeight: 34,
        padding: "0 12px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 800,
        color: textColor,
        background: bgColor,
        border: `1px solid ${borderColor}`,
      }}
    >
      {label}
    </span>
  );
}

function MessageBox({
  tone,
  title,
  text,
}: {
  tone: "info" | "success" | "danger";
  title: string;
  text: string;
}) {
  const palette =
    tone === "success"
      ? {
          bg: "rgba(34,197,94,0.10)",
          border: "rgba(34,197,94,0.18)",
          title: "#15803d",
          text: "#166534",
        }
      : tone === "danger"
        ? {
            bg: "rgba(239,68,68,0.10)",
            border: "rgba(239,68,68,0.18)",
            title: "#b91c1c",
            text: "#7f1d1d",
          }
        : {
            bg: "rgba(37,99,235,0.08)",
            border: "rgba(37,99,235,0.18)",
            title: "#2563eb",
            text: "#1e3a8a",
          };

  return (
    <div
      style={{
        borderRadius: 18,
        padding: 14,
        background: palette.bg,
        border: `1px solid ${palette.border}`,
      }}
    >
      <div
        style={{
          fontSize: 13,
          fontWeight: 900,
          color: palette.title,
          marginBottom: 6,
          textTransform: "uppercase",
          letterSpacing: "0.03em",
        }}
      >
        {title}
      </div>
      <div
        style={{
          color: palette.text,
          lineHeight: 1.7,
          fontWeight: 700,
          fontSize: 14,
        }}
      >
        {text}
      </div>
    </div>
  );
}

const secondaryButtonStyle: React.CSSProperties = {
  minHeight: 46,
  padding: "0 16px",
  borderRadius: 14,
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 800,
  fontSize: 14,
  color: "#0f172a",
  border: "1px solid rgba(37,99,235,0.20)",
  background: "linear-gradient(180deg,#ffffff 0%,#f1f5f9 100%)",
  boxShadow: "0 8px 20px rgba(15,23,42,0.05)",
};