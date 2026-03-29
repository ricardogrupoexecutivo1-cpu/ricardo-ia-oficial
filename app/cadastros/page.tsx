"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type CadastroPublicoBase = {
  id: string;
  nome_empresa: string | null;
  coverage_type: "brasil" | "estadual" | "regional" | "municipal" | "multilocal";
  estado_base: string | null;
  regiao_base: string | null;
  cidade_base: string | null;
  atendimento_tipo: "todos" | "especificos";
  descricao_publica: string | null;
  status: "rascunho" | "ativo" | "inativo" | "bloqueado";
  is_public: boolean;
  created_at: string;
  updated_at: string;
};

type CadastroSegmento = {
  cadastro_id: string;
  nome: string;
};

type CadastroProdutoServico = {
  cadastro_id: string;
  nome: string;
};

type CadastroPublico = CadastroPublicoBase & {
  segmentos: string[];
  produtos_servicos: string[];
};

function getSupabaseBrowserClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return createClient(url, anonKey);
}

function formatCoverageLabel(value: CadastroPublicoBase["coverage_type"]) {
  switch (value) {
    case "brasil":
      return "Brasil inteiro";
    case "estadual":
      return "Estadual";
    case "regional":
      return "Regional";
    case "municipal":
      return "Municipal";
    case "multilocal":
      return "Multilocal";
    default:
      return value;
  }
}

function getSafePublicName(item: CadastroPublico) {
  const nomeEmpresa = item.nome_empresa?.trim();
  if (nomeEmpresa) return nomeEmpresa;
  return "Cadastro público Aurora";
}

export default function CadastrosPublicosPage() {
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState<"info" | "error" | "success">(
    "info"
  );
  const [cadastros, setCadastros] = useState<CadastroPublico[]>([]);
  const [busca, setBusca] = useState("");

  const carregar = useCallback(async () => {
    setLoading(true);
    setFeedback("");

    try {
      const supabase = getSupabaseBrowserClient();

      if (!supabase) {
        throw new Error(
          "Variáveis NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY não configuradas."
        );
      }

      const { data: baseRows, error: baseError } = await supabase
        .from("cadastros_gerais")
        .select(
          "id, nome_empresa, coverage_type, estado_base, regiao_base, cidade_base, atendimento_tipo, descricao_publica, status, is_public, created_at, updated_at"
        )
        .eq("status", "ativo")
        .eq("is_public", true)
        .order("updated_at", { ascending: false });

      if (baseError) {
        throw baseError;
      }

      const bases = (baseRows ?? []) as CadastroPublicoBase[];

      if (bases.length === 0) {
        setCadastros([]);
        setFeedbackType("info");
        setFeedback(
          "Nenhum cadastro público ativo encontrado ainda. Esta área está em constante atualização e pode haver momentos de instabilidade."
        );
        return;
      }

      const ids = bases.map((item) => item.id);

      const [segmentosResp, produtosResp] = await Promise.all([
        supabase
          .from("cadastro_segmentos")
          .select("cadastro_id, nome")
          .in("cadastro_id", ids),
        supabase
          .from("cadastro_produtos_servicos")
          .select("cadastro_id, nome")
          .in("cadastro_id", ids),
      ]);

      if (segmentosResp.error) throw segmentosResp.error;
      if (produtosResp.error) throw produtosResp.error;

      const segmentos = (segmentosResp.data ?? []) as CadastroSegmento[];
      const produtos = (produtosResp.data ?? []) as CadastroProdutoServico[];

      const completos: CadastroPublico[] = bases.map((base) => ({
        ...base,
        segmentos: segmentos
          .filter((item) => item.cadastro_id === base.id)
          .map((item) => item.nome),
        produtos_servicos: produtos
          .filter((item) => item.cadastro_id === base.id)
          .map((item) => item.nome),
      }));

      setCadastros(completos);
      setFeedbackType("success");
      setFeedback(
        "Busca pública segura carregada com sucesso. Apenas dados públicos estão sendo exibidos."
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Falha ao carregar os cadastros públicos.";

      setCadastros([]);
      setFeedbackType("error");
      setFeedback(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    if (!termo) return cadastros;

    return cadastros.filter((item) => {
      const conteudo = [
        item.nome_empresa ?? "",
        item.cidade_base ?? "",
        item.estado_base ?? "",
        item.regiao_base ?? "",
        item.descricao_publica ?? "",
        item.segmentos.join(" "),
        item.produtos_servicos.join(" "),
        formatCoverageLabel(item.coverage_type),
      ]
        .join(" ")
        .toLowerCase();

      return conteudo.includes(termo);
    });
  }, [busca, cadastros]);

  return (
    <main style={styles.main}>
      <div style={styles.container}>
        <div style={styles.topNav}>
          <NavLink href="/" label="Voltar à Home" color="#93c5fd" />
          <NavLink href="/guardiao" label="Ir para o Guardião" color="#facc15" />
          <NavLink href="/cadastro" label="Novo cadastro" color="#86efac" />
          <NavLink href="/mineracao" label="Mineração" color="#f59e0b" />
        </div>

        <section style={styles.heroCard}>
          <div style={styles.badge}>Busca pública segura</div>
          <h1 style={styles.heroTitle}>Cadastros públicos da Aurora</h1>
          <p style={styles.heroText}>
            Esta vitrine mostra apenas cadastros ativos e públicos, com exibição
            segura. Dados pessoais, dados internos e informações sensíveis não são
            expostos nesta área. Estamos em constante atualização e pode haver
            momentos de instabilidade.
          </p>

          <div style={styles.searchRow}>
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por empresa, cidade, segmento, produto ou cobertura"
              style={styles.input}
            />
            <button type="button" onClick={carregar} style={styles.primaryButton}>
              Atualizar busca
            </button>
          </div>
        </section>

        {feedback ? (
          <section
            style={{
              ...styles.feedbackBox,
              ...(feedbackType === "success"
                ? styles.feedbackSuccess
                : feedbackType === "error"
                ? styles.feedbackError
                : styles.feedbackInfo),
            }}
          >
            <strong style={{ display: "block", marginBottom: 6 }}>
              {feedbackType === "success"
                ? "Sucesso"
                : feedbackType === "error"
                ? "Falha"
                : "Aviso"}
            </strong>
            <div>{feedback}</div>
          </section>
        ) : null}

        <section style={styles.statsRow}>
          <StatCard label="Cadastros públicos" value={String(cadastros.length)} />
          <StatCard label="Resultado da busca" value={String(filtrados.length)} />
          <StatCard label="Privacidade" value="Protegida" />
        </section>

        {loading ? (
          <section style={styles.emptyCard}>Carregando busca pública...</section>
        ) : filtrados.length === 0 ? (
          <section style={styles.emptyCard}>
            Nenhum cadastro público encontrado para esta busca.
          </section>
        ) : (
          <section style={styles.grid}>
            {filtrados.map((item) => {
              const nomeExibicao = getSafePublicName(item);
              const localidade = [item.cidade_base, item.estado_base]
                .filter(Boolean)
                .join(" • ");

              return (
                <article key={item.id} style={styles.card}>
                  <div style={styles.cardTop}>
                    <div>
                      <h2 style={styles.cardTitle}>{nomeExibicao}</h2>
                      <div style={styles.cardMeta}>
                        {localidade || "Localidade não informada"}
                      </div>
                    </div>

                    <div style={styles.publicBadge}>Público</div>
                  </div>

                  <div style={styles.infoGrid}>
                    <InfoItem
                      label="Cobertura"
                      value={formatCoverageLabel(item.coverage_type)}
                    />
                    <InfoItem
                      label="Atendimento"
                      value={
                        item.atendimento_tipo === "todos"
                          ? "Todos os segmentos"
                          : "Segmentos específicos"
                      }
                    />
                    <InfoItem
                      label="Estado-base"
                      value={item.estado_base || "-"}
                    />
                    <InfoItem
                      label="Cidade-base"
                      value={item.cidade_base || "-"}
                    />
                  </div>

                  <TagBlock
                    title="Segmentos"
                    items={item.segmentos}
                    emptyText="Nenhum segmento público informado."
                  />

                  <TagBlock
                    title="Produtos e serviços"
                    items={item.produtos_servicos}
                    emptyText="Nenhum produto ou serviço público informado."
                  />

                  <div style={styles.descriptionBox}>
                    <div style={styles.blockTitle}>Descrição pública</div>
                    <div style={styles.descriptionText}>
                      {item.descricao_publica || "Sem descrição pública ainda."}
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}

function NavLink({
  href,
  label,
  color,
}: {
  href: string;
  label: string;
  color: string;
}) {
  return (
    <Link
      href={href}
      style={{
        color,
        textDecoration: "none",
        border: `1px solid ${color}33`,
        borderRadius: 999,
        padding: "10px 14px",
        fontWeight: 700,
      }}
    >
      {label}
    </Link>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div style={styles.statCard}>
      <div style={styles.statLabel}>{label}</div>
      <div style={styles.statValue}>{value}</div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div style={styles.infoItem}>
      <div style={styles.infoLabel}>{label}</div>
      <div style={styles.infoValue}>{value}</div>
    </div>
  );
}

function TagBlock({
  title,
  items,
  emptyText,
}: {
  title: string;
  items: string[];
  emptyText: string;
}) {
  return (
    <section style={styles.blockCard}>
      <div style={styles.blockTitle}>{title}</div>

      {items.length === 0 ? (
        <div style={styles.emptyText}>{emptyText}</div>
      ) : (
        <div style={styles.tagWrap}>
          {items.map((item) => (
            <div key={`${title}-${item}`} style={styles.tag}>
              {item}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top, rgba(16,185,129,0.14), transparent 25%), #050816",
    color: "#e5eef8",
    padding: "32px 16px 80px",
  },
  container: {
    maxWidth: 1280,
    margin: "0 auto",
  },
  topNav: {
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 16,
  },
  heroCard: {
    border: "1px solid rgba(148,163,184,0.18)",
    background: "rgba(15,23,42,0.72)",
    backdropFilter: "blur(10px)",
    borderRadius: 24,
    padding: 24,
    boxShadow: "0 20px 80px rgba(0,0,0,0.35)",
    marginBottom: 20,
  },
  badge: {
    display: "inline-flex",
    padding: "8px 12px",
    borderRadius: 999,
    background: "rgba(16,185,129,0.14)",
    border: "1px solid rgba(16,185,129,0.25)",
    color: "#86efac",
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: 0.3,
    marginBottom: 14,
  },
  heroTitle: {
    fontSize: 38,
    lineHeight: 1.05,
    margin: 0,
  },
  heroText: {
    color: "#94a3b8",
    marginTop: 14,
    maxWidth: 980,
    fontSize: 16,
    lineHeight: 1.7,
  },
  searchRow: {
    display: "grid",
    gridTemplateColumns: "1fr 220px",
    gap: 12,
    marginTop: 20,
  },
  input: {
    width: "100%",
    borderRadius: 14,
    border: "1px solid rgba(148,163,184,0.18)",
    background: "rgba(2,6,23,0.55)",
    color: "#ffffff",
    padding: "14px 16px",
    outline: "none",
    fontSize: 15,
  },
  primaryButton: {
    borderRadius: 14,
    border: "1px solid rgba(16,185,129,0.35)",
    background:
      "linear-gradient(135deg, rgba(16,185,129,0.24), rgba(59,130,246,0.18))",
    color: "#ecfeff",
    fontWeight: 800,
    cursor: "pointer",
    padding: "14px 18px",
    fontSize: 15,
  },
  feedbackBox: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
    border: "1px solid rgba(148,163,184,0.18)",
    lineHeight: 1.6,
  },
  feedbackSuccess: {
    background: "rgba(16,185,129,0.12)",
    border: "1px solid rgba(16,185,129,0.35)",
    color: "#bbf7d0",
  },
  feedbackError: {
    background: "rgba(239,68,68,0.12)",
    border: "1px solid rgba(239,68,68,0.35)",
    color: "#fecaca",
  },
  feedbackInfo: {
    background: "rgba(59,130,246,0.12)",
    border: "1px solid rgba(59,130,246,0.35)",
    color: "#bfdbfe",
  },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 16,
    marginBottom: 20,
  },
  statCard: {
    borderRadius: 20,
    padding: 18,
    background: "rgba(15,23,42,0.72)",
    border: "1px solid rgba(148,163,184,0.16)",
  },
  statLabel: {
    fontSize: 12,
    color: "#94a3b8",
  },
  statValue: {
    fontWeight: 800,
    fontSize: 22,
    marginTop: 8,
  },
  emptyCard: {
    borderRadius: 20,
    padding: 24,
    background: "rgba(15,23,42,0.72)",
    border: "1px solid rgba(148,163,184,0.16)",
    color: "#cbd5e1",
  },
  grid: {
    display: "grid",
    gap: 18,
  },
  card: {
    borderRadius: 24,
    padding: 22,
    background: "rgba(15,23,42,0.72)",
    border: "1px solid rgba(148,163,184,0.16)",
    boxShadow: "0 20px 80px rgba(0,0,0,0.28)",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
    marginBottom: 18,
    flexWrap: "wrap",
  },
  cardTitle: {
    margin: 0,
    fontSize: 24,
    fontWeight: 800,
    lineHeight: 1.2,
  },
  cardMeta: {
    marginTop: 6,
    color: "#94a3b8",
    fontSize: 14,
  },
  publicBadge: {
    borderRadius: 999,
    padding: "8px 12px",
    background: "rgba(16,185,129,0.14)",
    border: "1px solid rgba(16,185,129,0.25)",
    color: "#bbf7d0",
    fontWeight: 800,
    fontSize: 12,
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
    gap: 12,
    marginBottom: 16,
  },
  infoItem: {
    borderRadius: 16,
    padding: 14,
    background: "rgba(2,6,23,0.4)",
    border: "1px solid rgba(148,163,184,0.14)",
  },
  infoLabel: {
    color: "#94a3b8",
    fontSize: 12,
    marginBottom: 8,
  },
  infoValue: {
    color: "#f8fafc",
    fontWeight: 700,
    lineHeight: 1.5,
    wordBreak: "break-word",
  },
  blockCard: {
    borderRadius: 18,
    padding: 16,
    background: "rgba(2,6,23,0.4)",
    border: "1px solid rgba(148,163,184,0.14)",
    marginBottom: 16,
  },
  blockTitle: {
    fontSize: 14,
    fontWeight: 800,
    color: "#dbeafe",
    marginBottom: 12,
  },
  emptyText: {
    color: "#94a3b8",
    lineHeight: 1.6,
  },
  tagWrap: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
  },
  tag: {
    borderRadius: 999,
    border: "1px solid rgba(148,163,184,0.16)",
    background: "rgba(15,23,42,0.85)",
    color: "#e2e8f0",
    padding: "10px 14px",
    fontWeight: 700,
  },
  descriptionBox: {
    borderRadius: 18,
    padding: 16,
    background: "rgba(2,6,23,0.4)",
    border: "1px solid rgba(148,163,184,0.14)",
  },
  descriptionText: {
    color: "#cbd5e1",
    lineHeight: 1.7,
    whiteSpace: "pre-wrap",
  },
};