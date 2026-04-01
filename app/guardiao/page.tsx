"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getPublicCompanyShareText } from "@/lib/public-links";

type CadastroBase = {
  id: string;
  user_id: string | null;
  nome_responsavel: string | null;
  nome_empresa: string | null;
  whatsapp: string | null;
  email: string | null;
  site: string | null;
  instagram: string | null;
  coverage_type: "brasil" | "estadual" | "regional" | "municipal" | "multilocal";
  estado_base: string | null;
  regiao_base: string | null;
  cidade_base: string | null;
  observacao_cobertura: string | null;
  atendimento_tipo: "todos" | "especificos";
  descricao_publica: string | null;
  status: "rascunho" | "ativo" | "inativo" | "bloqueado";
  is_public: boolean;
  origem: string | null;
  created_at: string;
  updated_at: string;

  nome_publico: string | null;
  descricao_publica_curta: string | null;
  cidade_publica: string | null;
  estado_publico: string | null;
  mostrar_nome_publico: boolean;
  mostrar_descricao_publica: boolean;
  mostrar_cidade_publica: boolean;
  mostrar_estado_publico: boolean;
  mostrar_segmentos_publicos: boolean;
  mostrar_produtos_publicos: boolean;
};

type CadastroPerfil = {
  cadastro_id: string;
  perfil: string;
};

type CadastroSegmento = {
  cadastro_id: string;
  nome: string;
};

type CadastroProdutoServico = {
  cadastro_id: string;
  nome: string;
};

type CadastroSegmentoAtendido = {
  cadastro_id: string;
  nome: string;
};

type CadastroAreaCobertura = {
  cadastro_id: string;
  coverage_type: string;
  pais: string | null;
  estado: string | null;
  regiao: string | null;
  cidade: string | null;
  observacao: string | null;
};

type CadastroCompleto = CadastroBase & {
  perfis: string[];
  segmentos: string[];
  produtos_servicos: string[];
  segmentos_atendidos: string[];
  areas_cobertura: CadastroAreaCobertura[];
};

type PublicEditState = {
  nome_publico: string;
  descricao_publica_curta: string;
  cidade_publica: string;
  estado_publico: string;
  mostrar_nome_publico: boolean;
  mostrar_descricao_publica: boolean;
  mostrar_cidade_publica: boolean;
  mostrar_estado_publico: boolean;
  mostrar_segmentos_publicos: boolean;
  mostrar_produtos_publicos: boolean;
};

const ESTADOS_BR = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
];

function normalizeSlugPart(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " e ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function buildSlug(input: {
  name?: string | null;
  city?: string | null;
  state?: string | null;
}) {
  const base = [
    input.name ? normalizeSlugPart(input.name) : "",
    input.city ? normalizeSlugPart(input.city) : "",
    input.state ? normalizeSlugPart(input.state) : "",
  ]
    .filter(Boolean)
    .join("-");

  return base || "empresa";
}

function getSupabaseBrowserClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return createClient(url, anonKey);
}

function formatCoverageLabel(value: CadastroBase["coverage_type"]) {
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

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function toPublicEditState(cadastro: CadastroCompleto): PublicEditState {
  return {
    nome_publico: cadastro.nome_publico || "",
    descricao_publica_curta: cadastro.descricao_publica_curta || "",
    cidade_publica: cadastro.cidade_publica || "",
    estado_publico: cadastro.estado_publico || "",
    mostrar_nome_publico: cadastro.mostrar_nome_publico,
    mostrar_descricao_publica: cadastro.mostrar_descricao_publica,
    mostrar_cidade_publica: cadastro.mostrar_cidade_publica,
    mostrar_estado_publico: cadastro.mostrar_estado_publico,
    mostrar_segmentos_publicos: cadastro.mostrar_segmentos_publicos,
    mostrar_produtos_publicos: cadastro.mostrar_produtos_publicos,
  };
}

export default function GuardiaoPage() {
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState<"info" | "error" | "success">(
    "info"
  );
  const [cadastros, setCadastros] = useState<CadastroCompleto[]>([]);
  const [userEmail, setUserEmail] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState<string>("");
  const [editingId, setEditingId] = useState<string>("");
  const [editState, setEditState] = useState<Record<string, PublicEditState>>({});

  const totais = useMemo(() => {
    return {
      cadastros: cadastros.length,
      ativos: cadastros.filter((item) => item.status === "ativo").length,
      rascunhos: cadastros.filter((item) => item.status === "rascunho").length,
      publicos: cadastros.filter((item) => item.is_public).length,
    };
  }, [cadastros]);

  const carregar = useCallback(async () => {
    setLoading(true);

    try {
      const supabase = getSupabaseBrowserClient();

      if (!supabase) {
        throw new Error(
          "Variáveis NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY não configuradas."
        );
      }

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) {
        throw new Error("Você precisa estar logado para acessar o Guardião real.");
      }

      setUserEmail(user.email ?? "");

      const { data: baseRows, error: baseError } = await supabase
        .from("cadastros_gerais")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (baseError) throw baseError;

      const bases = (baseRows ?? []) as CadastroBase[];

      if (bases.length === 0) {
        setCadastros([]);
        setFeedbackType("info");
        setFeedback(
          "Nenhum cadastro encontrado ainda. O Guardião já está ligado ao banco real."
        );
        return;
      }

      const cadastroIds = bases.map((item) => item.id);

      const [
        perfisResp,
        segmentosResp,
        produtosResp,
        segmentosAtendidosResp,
        areasResp,
      ] = await Promise.all([
        supabase
          .from("cadastro_perfis")
          .select("cadastro_id, perfil")
          .in("cadastro_id", cadastroIds),
        supabase
          .from("cadastro_segmentos")
          .select("cadastro_id, nome")
          .in("cadastro_id", cadastroIds),
        supabase
          .from("cadastro_produtos_servicos")
          .select("cadastro_id, nome")
          .in("cadastro_id", cadastroIds),
        supabase
          .from("cadastro_segmentos_atendidos")
          .select("cadastro_id, nome")
          .in("cadastro_id", cadastroIds),
        supabase
          .from("cadastro_areas_cobertura")
          .select("cadastro_id, coverage_type, pais, estado, regiao, cidade, observacao")
          .in("cadastro_id", cadastroIds),
      ]);

      if (perfisResp.error) throw perfisResp.error;
      if (segmentosResp.error) throw segmentosResp.error;
      if (produtosResp.error) throw produtosResp.error;
      if (segmentosAtendidosResp.error) throw segmentosAtendidosResp.error;
      if (areasResp.error) throw areasResp.error;

      const perfis = (perfisResp.data ?? []) as CadastroPerfil[];
      const segmentos = (segmentosResp.data ?? []) as CadastroSegmento[];
      const produtos = (produtosResp.data ?? []) as CadastroProdutoServico[];
      const segmentosAtendidos = (segmentosAtendidosResp.data ??
        []) as CadastroSegmentoAtendido[];
      const areas = (areasResp.data ?? []) as CadastroAreaCobertura[];

      const completos: CadastroCompleto[] = bases.map((base) => ({
        ...base,
        perfis: perfis
          .filter((item) => item.cadastro_id === base.id)
          .map((item) => item.perfil),
        segmentos: segmentos
          .filter((item) => item.cadastro_id === base.id)
          .map((item) => item.nome),
        produtos_servicos: produtos
          .filter((item) => item.cadastro_id === base.id)
          .map((item) => item.nome),
        segmentos_atendidos: segmentosAtendidos
          .filter((item) => item.cadastro_id === base.id)
          .map((item) => item.nome),
        areas_cobertura: areas.filter((item) => item.cadastro_id === base.id),
      }));

      setCadastros(completos);
      setEditState((prev) => {
        const next = { ...prev };
        for (const cadastro of completos) {
          if (!next[cadastro.id]) {
            next[cadastro.id] = toPublicEditState(cadastro);
          }
        }
        return next;
      });
      setFeedbackType("success");
      setFeedback("Guardião conectado aos cadastros reais do Supabase.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Falha ao carregar o Guardião.";

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

  async function recarregarCadastroAtualizado(cadastroId: string, userId: string) {
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      throw new Error(
        "Variáveis NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY não configuradas."
      );
    }

    const { data: row, error } = await supabase
      .from("cadastros_gerais")
      .select("*")
      .eq("id", cadastroId)
      .eq("user_id", userId)
      .single();

    if (error) throw error;

    return row as CadastroBase;
  }

  async function updateCadastro(
    cadastroId: string,
    patch: Partial<Pick<CadastroBase, "status" | "is_public">>,
    successMessage: string
  ) {
    try {
      setActionLoadingId(cadastroId);
      setFeedbackType("info");
      setFeedback("Processando ação no Guardião...");

      const supabase = getSupabaseBrowserClient();

      if (!supabase) {
        throw new Error(
          "Variáveis NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY não configuradas."
        );
      }

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) throw new Error("Usuário não autenticado.");

      const { error: updateError, count } = await supabase
        .from("cadastros_gerais")
        .update(patch, { count: "exact" })
        .eq("id", cadastroId)
        .eq("user_id", user.id);

      if (updateError) throw updateError;
      if (!count || count < 1) {
        throw new Error("Nenhum registro foi atualizado.");
      }

      const atualizado = await recarregarCadastroAtualizado(cadastroId, user.id);

      setCadastros((prev) =>
        prev.map((item) => (item.id === cadastroId ? { ...item, ...atualizado } : item))
      );

      setEditState((prev) => ({
        ...prev,
        [cadastroId]: {
          ...(prev[cadastroId] ??
            toPublicEditState({
              ...(atualizado as CadastroCompleto),
              perfis: [],
              segmentos: [],
              produtos_servicos: [],
              segmentos_atendidos: [],
              areas_cobertura: [],
            })),
          ...toPublicEditState({
            ...(atualizado as CadastroCompleto),
            perfis: [],
            segmentos: [],
            produtos_servicos: [],
            segmentos_atendidos: [],
            areas_cobertura: [],
          }),
        },
      }));

      setFeedbackType("success");
      setFeedback(
        `${successMessage} Status: ${atualizado.status} | Público: ${
          atualizado.is_public ? "SIM" : "NÃO"
        }`
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Falha ao atualizar cadastro.";

      setFeedbackType("error");
      setFeedback(message);
    } finally {
      setActionLoadingId("");
    }
  }

  function startEditing(cadastro: CadastroCompleto) {
    setEditingId(cadastro.id);
    setEditState((prev) => ({
      ...prev,
      [cadastro.id]: toPublicEditState(cadastro),
    }));
  }

  function cancelEditing(cadastro: CadastroCompleto) {
    setEditingId("");
    setEditState((prev) => ({
      ...prev,
      [cadastro.id]: toPublicEditState(cadastro),
    }));
  }

  function patchEditState(cadastroId: string, patch: Partial<PublicEditState>) {
    setEditState((prev) => ({
      ...prev,
      [cadastroId]: {
        ...(prev[cadastroId] ?? {
          nome_publico: "",
          descricao_publica_curta: "",
          cidade_publica: "",
          estado_publico: "",
          mostrar_nome_publico: false,
          mostrar_descricao_publica: true,
          mostrar_cidade_publica: true,
          mostrar_estado_publico: true,
          mostrar_segmentos_publicos: true,
          mostrar_produtos_publicos: true,
        }),
        ...patch,
      },
    }));
  }

  async function savePublicLayer(cadastroId: string) {
    try {
      setActionLoadingId(cadastroId);
      setFeedbackType("info");
      setFeedback("Salvando camada pública controlada...");

      const supabase = getSupabaseBrowserClient();

      if (!supabase) {
        throw new Error(
          "Variáveis NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY não configuradas."
        );
      }

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) throw new Error("Usuário não autenticado.");

      const state = editState[cadastroId];

      if (!state) {
        throw new Error("Estado de edição não encontrado.");
      }

      const payload = {
        nome_publico: state.nome_publico.trim() || null,
        descricao_publica_curta: state.descricao_publica_curta.trim() || null,
        cidade_publica: state.cidade_publica.trim() || null,
        estado_publico: state.estado_publico || null,
        mostrar_nome_publico: state.mostrar_nome_publico,
        mostrar_descricao_publica: state.mostrar_descricao_publica,
        mostrar_cidade_publica: state.mostrar_cidade_publica,
        mostrar_estado_publico: state.mostrar_estado_publico,
        mostrar_segmentos_publicos: state.mostrar_segmentos_publicos,
        mostrar_produtos_publicos: state.mostrar_produtos_publicos,
      };

      const { error: updateError, count } = await supabase
        .from("cadastros_gerais")
        .update(payload, { count: "exact" })
        .eq("id", cadastroId)
        .eq("user_id", user.id);

      if (updateError) throw updateError;
      if (!count || count < 1) {
        throw new Error("Nenhum registro foi atualizado na camada pública.");
      }

      const atualizado = await recarregarCadastroAtualizado(cadastroId, user.id);

      setCadastros((prev) =>
        prev.map((item) => (item.id === cadastroId ? { ...item, ...atualizado } : item))
      );

      setEditState((prev) => ({
        ...prev,
        [cadastroId]: {
          ...(prev[cadastroId] ?? state),
          nome_publico: atualizado.nome_publico || "",
          descricao_publica_curta: atualizado.descricao_publica_curta || "",
          cidade_publica: atualizado.cidade_publica || "",
          estado_publico: atualizado.estado_publico || "",
          mostrar_nome_publico: atualizado.mostrar_nome_publico,
          mostrar_descricao_publica: atualizado.mostrar_descricao_publica,
          mostrar_cidade_publica: atualizado.mostrar_cidade_publica,
          mostrar_estado_publico: atualizado.mostrar_estado_publico,
          mostrar_segmentos_publicos: atualizado.mostrar_segmentos_publicos,
          mostrar_produtos_publicos: atualizado.mostrar_produtos_publicos,
        },
      }));

      setEditingId("");
      setFeedbackType("success");
      setFeedback("Camada pública atualizada com sucesso no Guardião.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Falha ao salvar a camada pública.";
      setFeedbackType("error");
      setFeedback(message);
    } finally {
      setActionLoadingId("");
    }
  }

  return (
    <main style={styles.main}>
      <div style={styles.container}>
        <div style={styles.topNav}>
          <NavLink href="/" label="Voltar à Home" color="#93c5fd" />
          <NavLink href="/cadastro" label="Ir para Cadastro" color="#86efac" />
          <NavLink href="/cadastros" label="Busca pública" color="#c4b5fd" />
          <NavLink href="/mineracao" label="Mineração" color="#f59e0b" />
        </div>

        <section style={styles.heroCard}>
          <div style={styles.badge}>Guardião real</div>
          <h1 style={styles.heroTitle}>Guardião da Aurora</h1>
          <p style={styles.heroText}>
            Painel de leitura, controle e edição da camada pública dos cadastros reais do usuário logado.
          </p>

          <div style={styles.heroGrid}>
            <MiniInfo
              title="Usuário atual"
              value={userEmail || "Carregando usuário"}
              text="Leitura protegida com autenticação real."
            />
            <MiniInfo
              title="Cadastros"
              value={String(totais.cadastros)}
              text="Quantidade total carregada no Guardião."
            />
            <MiniInfo
              title="Rascunhos"
              value={String(totais.rascunhos)}
              text="Cadastros ainda não publicados e não ativados."
            />
            <MiniInfo
              title="Públicos"
              value={String(totais.publicos)}
              text="Cadastros marcados como públicos no banco."
            />
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

        <section style={styles.toolbar}>
          <button
            type="button"
            style={styles.primaryButton}
            onClick={carregar}
            disabled={loading || !!actionLoadingId}
          >
            {loading ? "Atualizando Guardião..." : "Atualizar Guardião"}
          </button>

          <Link href="/cadastro" style={styles.secondaryLink}>
            Novo cadastro
          </Link>
        </section>

        {loading ? (
          <section style={styles.loadingCard}>
            Carregando dados reais do Guardião...
          </section>
        ) : cadastros.length === 0 ? (
          <section style={styles.emptyCard}>
            Nenhum cadastro encontrado ainda. O Guardião está pronto para mostrar tudo que entrar no Supabase.
          </section>
        ) : (
          <section style={styles.listWrap}>
            {cadastros.map((cadastro) => {
              const loadingThis = actionLoadingId === cadastro.id;
              const isEditing = editingId === cadastro.id;
              const state = editState[cadastro.id] ?? toPublicEditState(cadastro);

              const slug = buildSlug({
                name:
                  cadastro.nome_publico ||
                  cadastro.nome_empresa ||
                  cadastro.nome_responsavel,
                city: cadastro.cidade_publica || cadastro.cidade_base,
                state: cadastro.estado_publico || cadastro.estado_base,
              });

              const baseUrl =
                typeof window !== "undefined" ? window.location.origin : "";

              const publicUrl = `${baseUrl}/empresa/${slug}`;

              const shareText = getPublicCompanyShareText({
                publicName:
                  cadastro.nome_publico ||
                  cadastro.nome_empresa ||
                  cadastro.nome_responsavel,
                city: cadastro.cidade_publica || cadastro.cidade_base,
                state: cadastro.estado_publico || cadastro.estado_base,
              });

              return (
                <article key={cadastro.id} style={styles.card}>
                  <div style={styles.cardHeader}>
                    <div>
                      <div style={styles.cardTitle}>
                        {cadastro.nome_empresa?.trim() ||
                          cadastro.nome_responsavel?.trim() ||
                          "Cadastro sem nome"}
                      </div>
                      <div style={styles.cardSubtitle}>ID: {cadastro.id}</div>
                    </div>

                    <div style={styles.statusWrap}>
                      <Badge label={cadastro.status.toUpperCase()} />
                      <Badge label={cadastro.is_public ? "PÚBLICO" : "PRIVADO"} />
                    </div>
                  </div>

                  <div style={styles.actionRow}>
                    <button
                      type="button"
                      style={styles.actionButtonPrimary}
                      disabled={loadingThis}
                      onClick={() =>
                        updateCadastro(
                          cadastro.id,
                          { status: "ativo", is_public: true },
                          "Cadastro ativado e publicado com sucesso."
                        )
                      }
                    >
                      {loadingThis ? "Processando..." : "Ativar e publicar"}
                    </button>

                    <button
                      type="button"
                      style={styles.actionButton}
                      disabled={loadingThis}
                      onClick={() =>
                        updateCadastro(
                          cadastro.id,
                          { status: "rascunho", is_public: false },
                          "Cadastro voltou para rascunho privado."
                        )
                      }
                    >
                      Voltar para rascunho
                    </button>

                    <button
                      type="button"
                      style={styles.actionButton}
                      disabled={loadingThis}
                      onClick={() =>
                        updateCadastro(
                          cadastro.id,
                          { status: "inativo", is_public: false },
                          "Cadastro marcado como inativo."
                        )
                      }
                    >
                      Inativar
                    </button>

                    <button
                      type="button"
                      style={styles.actionButtonDanger}
                      disabled={loadingThis}
                      onClick={() =>
                        updateCadastro(
                          cadastro.id,
                          { status: "bloqueado", is_public: false },
                          "Cadastro marcado como bloqueado."
                        )
                      }
                    >
                      Bloquear
                    </button>
                  </div>

                  <div style={styles.metaGrid}>
                    <InfoItem label="Responsável" value={cadastro.nome_responsavel || "-"} />
                    <InfoItem label="Empresa" value={cadastro.nome_empresa || "-"} />
                    <InfoItem
                      label="Cobertura"
                      value={formatCoverageLabel(cadastro.coverage_type)}
                    />
                    <InfoItem label="Cidade-base" value={cadastro.cidade_base || "-"} />
                    <InfoItem label="Estado-base" value={cadastro.estado_base || "-"} />
                    <InfoItem
                      label="Atendimento"
                      value={
                        cadastro.atendimento_tipo === "todos"
                          ? "Todos os segmentos"
                          : "Segmentos específicos"
                      }
                    />
                    <InfoItem label="Criado em" value={formatDate(cadastro.created_at)} />
                    <InfoItem label="Atualizado em" value={formatDate(cadastro.updated_at)} />
                  </div>

                  <div style={styles.publicLayerCard}>
                    <div style={styles.publicLayerHeader}>
                      <div style={styles.blockTitle}>Camada pública controlada</div>

                      {!isEditing ? (
                        <button
                          type="button"
                          style={styles.actionButton}
                          disabled={loadingThis}
                          onClick={() => startEditing(cadastro)}
                        >
                          Editar camada pública
                        </button>
                      ) : (
                        <div style={styles.inlineActions}>
                          <button
                            type="button"
                            style={styles.actionButtonPrimary}
                            disabled={loadingThis}
                            onClick={() => savePublicLayer(cadastro.id)}
                          >
                            {loadingThis ? "Salvando..." : "Salvar edição pública"}
                          </button>
                          <button
                            type="button"
                            style={styles.actionButton}
                            disabled={loadingThis}
                            onClick={() => cancelEditing(cadastro)}
                          >
                            Cancelar
                          </button>
                        </div>
                      )}
                    </div>

                    {!isEditing ? (
                      <div style={styles.metaGrid}>
                        <InfoItem label="Nome público" value={cadastro.nome_publico || "-"} />
                        <InfoItem
                          label="Descrição pública curta"
                          value={cadastro.descricao_publica_curta || "-"}
                        />
                        <InfoItem label="Cidade pública" value={cadastro.cidade_publica || "-"} />
                        <InfoItem label="Estado público" value={cadastro.estado_publico || "-"} />
                        <InfoItem
                          label="Mostrar nome público"
                          value={cadastro.mostrar_nome_publico ? "SIM" : "NÃO"}
                        />
                        <InfoItem
                          label="Mostrar descrição pública"
                          value={cadastro.mostrar_descricao_publica ? "SIM" : "NÃO"}
                        />
                        <InfoItem
                          label="Mostrar cidade pública"
                          value={cadastro.mostrar_cidade_publica ? "SIM" : "NÃO"}
                        />
                        <InfoItem
                          label="Mostrar estado público"
                          value={cadastro.mostrar_estado_publico ? "SIM" : "NÃO"}
                        />
                        <InfoItem
                          label="Mostrar segmentos públicos"
                          value={cadastro.mostrar_segmentos_publicos ? "SIM" : "NÃO"}
                        />
                        <InfoItem
                          label="Mostrar produtos públicos"
                          value={cadastro.mostrar_produtos_publicos ? "SIM" : "NÃO"}
                        />
                      </div>
                    ) : (
                      <>
                        <div style={styles.grid2}>
                          <Field
                            label="Nome público"
                            value={state.nome_publico}
                            onChange={(value) =>
                              patchEditState(cadastro.id, { nome_publico: value })
                            }
                            placeholder="Ex.: Aurora IA Minas"
                          />
                          <Field
                            label="Descrição pública curta"
                            value={state.descricao_publica_curta}
                            onChange={(value) =>
                              patchEditState(cadastro.id, {
                                descricao_publica_curta: value,
                              })
                            }
                            placeholder="Ex.: soluções empresariais com IA"
                          />
                          <Field
                            label="Cidade pública"
                            value={state.cidade_publica}
                            onChange={(value) =>
                              patchEditState(cadastro.id, { cidade_publica: value })
                            }
                            placeholder="Ex.: Lagoa Santa"
                          />
                          <div style={styles.fieldWrap}>
                            <label style={styles.label}>Estado público</label>
                            <select
                              value={state.estado_publico}
                              onChange={(e) =>
                                patchEditState(cadastro.id, {
                                  estado_publico: e.target.value,
                                })
                              }
                              style={styles.select}
                            >
                              <option value="">Selecione</option>
                              {ESTADOS_BR.map((uf) => (
                                <option key={uf} value={uf}>
                                  {uf}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div style={styles.choiceGrid}>
                          <ToggleButton
                            label="Mostrar nome público"
                            active={state.mostrar_nome_publico}
                            onClick={() =>
                              patchEditState(cadastro.id, {
                                mostrar_nome_publico: !state.mostrar_nome_publico,
                              })
                            }
                          />
                          <ToggleButton
                            label="Mostrar descrição pública"
                            active={state.mostrar_descricao_publica}
                            onClick={() =>
                              patchEditState(cadastro.id, {
                                mostrar_descricao_publica:
                                  !state.mostrar_descricao_publica,
                              })
                            }
                          />
                          <ToggleButton
                            label="Mostrar cidade pública"
                            active={state.mostrar_cidade_publica}
                            onClick={() =>
                              patchEditState(cadastro.id, {
                                mostrar_cidade_publica: !state.mostrar_cidade_publica,
                              })
                            }
                          />
                          <ToggleButton
                            label="Mostrar estado público"
                            active={state.mostrar_estado_publico}
                            onClick={() =>
                              patchEditState(cadastro.id, {
                                mostrar_estado_publico: !state.mostrar_estado_publico,
                              })
                            }
                          />
                          <ToggleButton
                            label="Mostrar segmentos públicos"
                            active={state.mostrar_segmentos_publicos}
                            onClick={() =>
                              patchEditState(cadastro.id, {
                                mostrar_segmentos_publicos:
                                  !state.mostrar_segmentos_publicos,
                              })
                            }
                          />
                          <ToggleButton
                            label="Mostrar produtos públicos"
                            active={state.mostrar_produtos_publicos}
                            onClick={() =>
                              patchEditState(cadastro.id, {
                                mostrar_produtos_publicos:
                                  !state.mostrar_produtos_publicos,
                              })
                            }
                          />
                        </div>
                      </>
                    )}
                  </div>

                  <div
                    style={{
                      marginTop: 20,
                      marginBottom: 16,
                      padding: 16,
                      borderRadius: 18,
                      background: "rgba(34,197,94,0.08)",
                      border: "1px solid rgba(34,197,94,0.18)",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 800,
                        marginBottom: 10,
                        color: "#86efac",
                      }}
                    >
                      Página pública pronta para compartilhar
                    </div>

                    <div
                      style={{
                        color: "#cbd5e1",
                        lineHeight: 1.6,
                        marginBottom: 12,
                        wordBreak: "break-word",
                      }}
                    >
                      {publicUrl}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: 10,
                        flexWrap: "wrap",
                      }}
                    >
                      <a
                        href={publicUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          ...styles.actionButtonPrimary,
                          textDecoration: "none",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        Ver página pública
                      </a>

                      <button
                        type="button"
                        style={styles.actionButton}
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(publicUrl);
                            setFeedbackType("success");
                            setFeedback("Link público copiado com sucesso.");
                          } catch {
                            setFeedbackType("error");
                            setFeedback("Não foi possível copiar o link público.");
                          }
                        }}
                      >
                        Copiar link
                      </button>

                      <button
                        type="button"
                        style={styles.actionButton}
                        onClick={async () => {
                          const content = `${shareText} ${publicUrl}`;
                          try {
                            await navigator.clipboard.writeText(content);
                            setFeedbackType("success");
                            setFeedback("Mensagem de compartilhamento copiada com sucesso.");
                          } catch {
                            setFeedbackType("error");
                            setFeedback(
                              "Não foi possível copiar a mensagem de compartilhamento."
                            );
                          }
                        }}
                      >
                        Compartilhar
                      </button>
                    </div>
                  </div>

                  <div style={styles.sectionGrid}>
                    <TagBlock
                      title="Perfis"
                      items={cadastro.perfis}
                      emptyText="Nenhum perfil cadastrado."
                    />
                    <TagBlock
                      title="Segmentos"
                      items={cadastro.segmentos}
                      emptyText="Nenhum segmento cadastrado."
                    />
                    <TagBlock
                      title="Produtos e serviços"
                      items={cadastro.produtos_servicos}
                      emptyText="Nenhum produto ou serviço cadastrado."
                    />
                    <TagBlock
                      title="Segmentos atendidos"
                      items={cadastro.segmentos_atendidos}
                      emptyText="Atende todos os segmentos."
                    />
                  </div>

                  <div style={styles.coverageCard}>
                    <div style={styles.blockTitle}>Áreas de cobertura</div>

                    {cadastro.areas_cobertura.length === 0 ? (
                      <div style={styles.emptyText}>
                        Nenhuma área detalhada cadastrada.
                      </div>
                    ) : (
                      <div style={styles.areaList}>
                        {cadastro.areas_cobertura.map((area, index) => (
                          <div key={`${cadastro.id}-${index}`} style={styles.areaItem}>
                            <div style={styles.areaStrong}>
                              {formatCoverageLabel(
                                area.coverage_type as CadastroBase["coverage_type"]
                              )}
                            </div>
                            <div style={styles.areaText}>
                              País: {area.pais || "Brasil"} | Estado: {area.estado || "-"} |
                              Região: {area.regiao || "-"} | Cidade: {area.cidade || "-"}
                            </div>
                            <div style={styles.areaObs}>
                              Observação: {area.observacao || "-"}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div style={styles.descBox}>
                    <div style={styles.blockTitle}>Descrição interna</div>
                    <div style={styles.descText}>
                      {cadastro.descricao_publica || "Sem descrição interna ainda."}
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

function MiniInfo({
  title,
  value,
  text,
}: {
  title: string;
  value: string;
  text: string;
}) {
  return (
    <div style={styles.miniCard}>
      <div style={styles.miniLabel}>{title}</div>
      <div style={styles.miniValue}>{value}</div>
      <p style={styles.miniText}>{text}</p>
    </div>
  );
}

function Badge({ label }: { label: string }) {
  return <div style={styles.badgeMini}>{label}</div>;
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
    <div style={styles.blockCard}>
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
    </div>
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
    <div style={styles.fieldWrap}>
      <label style={styles.label}>{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={styles.input}
      />
    </div>
  );
}

function ToggleButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        ...styles.choiceButton,
        ...(active ? styles.choiceButtonActive : {}),
      }}
    >
      {label}: {active ? "SIM" : "NÃO"}
    </button>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top, rgba(59,130,246,0.16), transparent 24%), #050816",
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
    background: "rgba(59,130,246,0.14)",
    border: "1px solid rgba(59,130,246,0.25)",
    color: "#93c5fd",
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
  heroGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 16,
    marginTop: 24,
  },
  miniCard: {
    borderRadius: 20,
    padding: 18,
    background: "rgba(2,6,23,0.45)",
    border: "1px solid rgba(148,163,184,0.16)",
  },
  miniLabel: {
    fontSize: 12,
    color: "#94a3b8",
  },
  miniValue: {
    fontWeight: 800,
    fontSize: 20,
    marginTop: 8,
    wordBreak: "break-word",
  },
  miniText: {
    color: "#cbd5e1",
    marginTop: 10,
    marginBottom: 0,
    lineHeight: 1.6,
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
  toolbar: {
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20,
  },
  primaryButton: {
    borderRadius: 14,
    border: "1px solid rgba(59,130,246,0.35)",
    background:
      "linear-gradient(135deg, rgba(59,130,246,0.22), rgba(16,185,129,0.18))",
    color: "#eff6ff",
    fontWeight: 800,
    cursor: "pointer",
    padding: "14px 18px",
    fontSize: 15,
  },
  secondaryLink: {
    borderRadius: 14,
    border: "1px solid rgba(148,163,184,0.2)",
    background: "rgba(2,6,23,0.45)",
    color: "#dbeafe",
    fontWeight: 800,
    textDecoration: "none",
    padding: "14px 18px",
  },
  loadingCard: {
    borderRadius: 20,
    padding: 24,
    background: "rgba(15,23,42,0.72)",
    border: "1px solid rgba(148,163,184,0.16)",
    color: "#cbd5e1",
  },
  emptyCard: {
    borderRadius: 20,
    padding: 24,
    background: "rgba(15,23,42,0.72)",
    border: "1px solid rgba(148,163,184,0.16)",
    color: "#cbd5e1",
  },
  listWrap: {
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
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
    marginBottom: 18,
    flexWrap: "wrap",
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 800,
    lineHeight: 1.2,
  },
  cardSubtitle: {
    marginTop: 6,
    color: "#94a3b8",
    fontSize: 13,
    wordBreak: "break-all",
  },
  statusWrap: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
  },
  badgeMini: {
    borderRadius: 999,
    padding: "8px 12px",
    background: "rgba(30,41,59,0.9)",
    border: "1px solid rgba(148,163,184,0.16)",
    color: "#e2e8f0",
    fontWeight: 800,
    fontSize: 12,
  },
  actionRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 18,
  },
  actionButtonPrimary: {
    borderRadius: 12,
    border: "1px solid rgba(16,185,129,0.35)",
    background: "rgba(16,185,129,0.14)",
    color: "#bbf7d0",
    fontWeight: 800,
    cursor: "pointer",
    padding: "12px 14px",
    fontSize: 14,
  },
  actionButton: {
    borderRadius: 12,
    border: "1px solid rgba(148,163,184,0.2)",
    background: "rgba(2,6,23,0.55)",
    color: "#dbeafe",
    fontWeight: 700,
    cursor: "pointer",
    padding: "12px 14px",
    fontSize: 14,
  },
  actionButtonDanger: {
    borderRadius: 12,
    border: "1px solid rgba(239,68,68,0.35)",
    background: "rgba(239,68,68,0.12)",
    color: "#fecaca",
    fontWeight: 800,
    cursor: "pointer",
    padding: "12px 14px",
    fontSize: 14,
  },
  inlineActions: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
  },
  metaGrid: {
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
  publicLayerCard: {
    borderRadius: 18,
    padding: 16,
    background: "rgba(16,185,129,0.08)",
    border: "1px solid rgba(16,185,129,0.16)",
    marginBottom: 16,
  },
  publicLayerHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
    flexWrap: "wrap",
    marginBottom: 12,
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 16,
    marginBottom: 16,
  },
  fieldWrap: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: 700,
    color: "#dbeafe",
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
  select: {
    width: "100%",
    borderRadius: 14,
    border: "1px solid rgba(148,163,184,0.18)",
    background: "rgba(2,6,23,0.55)",
    color: "#ffffff",
    padding: "14px 16px",
    outline: "none",
    fontSize: 15,
  },
  choiceGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 12,
  },
  choiceButton: {
    borderRadius: 16,
    border: "1px solid rgba(148,163,184,0.18)",
    background: "rgba(2,6,23,0.45)",
    color: "#e5eef8",
    padding: "15px 16px",
    textAlign: "left",
    fontWeight: 700,
    cursor: "pointer",
  },
  choiceButtonActive: {
    border: "1px solid rgba(16,185,129,0.45)",
    background: "rgba(16,185,129,0.12)",
    color: "#86efac",
  },
  sectionGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 14,
    marginBottom: 16,
  },
  blockCard: {
    borderRadius: 18,
    padding: 16,
    background: "rgba(2,6,23,0.4)",
    border: "1px solid rgba(148,163,184,0.14)",
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
  coverageCard: {
    borderRadius: 18,
    padding: 16,
    background: "rgba(2,6,23,0.4)",
    border: "1px solid rgba(148,163,184,0.14)",
    marginBottom: 16,
  },
  areaList: {
    display: "grid",
    gap: 12,
  },
  areaItem: {
    borderRadius: 16,
    padding: 14,
    background: "rgba(15,23,42,0.8)",
    border: "1px solid rgba(148,163,184,0.14)",
  },
  areaStrong: {
    fontWeight: 800,
    color: "#f8fafc",
    marginBottom: 6,
  },
  areaText: {
    color: "#cbd5e1",
    lineHeight: 1.6,
  },
  areaObs: {
    color: "#94a3b8",
    lineHeight: 1.6,
    marginTop: 6,
  },
  descBox: {
    borderRadius: 18,
    padding: 16,
    background: "rgba(2,6,23,0.4)",
    border: "1px solid rgba(148,163,184,0.14)",
  },
  descText: {
    color: "#cbd5e1",
    lineHeight: 1.7,
    whiteSpace: "pre-wrap",
  },
};