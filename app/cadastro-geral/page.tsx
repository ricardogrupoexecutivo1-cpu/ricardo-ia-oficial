"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { useMemo, useState, type CSSProperties, type FormEvent } from "react";

type CoverageType =
  | "brasil"
  | "estadual"
  | "regional"
  | "municipal"
  | "multilocal";

type AttendanceType = "todos" | "especificos";
type FeedbackType = "success" | "error" | "info";

const PERFIS_BASE = [
  "Empresa",
  "Profissional",
  "Fornecedor",
  "Comprador",
  "Prestador de serviço",
  "Parceiro",
  "Autônomo",
  "Representante comercial",
];

const SEGMENTOS_SUGERIDOS = [
  "AGRO",
  "Mineração",
  "Imóveis",
  "Imobiliárias",
  "Locadora",
  "Transportes",
  "Indústria",
  "Comércio",
  "Tecnologia",
  "Serviços",
  "Financeiro",
  "Marketing",
  "Saúde",
  "Educação",
  "Turismo",
  "Construção civil",
  "Automotivo",
];

const PRODUTOS_SUGERIDOS = [
  "Consultoria",
  "Venda de produtos",
  "Prestação de serviço",
  "Locação",
  "Distribuição",
  "Representação",
  "Manutenção",
  "Atendimento técnico",
  "Software",
  "Aplicativo",
];

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

function getSupabaseBrowserClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return createClient(url, anonKey);
}

function sanitizeValue(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[^\p{L}\p{N}\s\-_/&.]/gu, "")
    .trim();
}

function addUniqueValue(
  rawValue: string,
  currentList: string[],
  setter: (next: string[]) => void
) {
  const value = sanitizeValue(rawValue);

  if (!value) return;

  const alreadyExists = currentList.some(
    (item) => item.toLowerCase() === value.toLowerCase()
  );

  if (alreadyExists) return;

  setter([...currentList, value]);
}

function removeValue(
  value: string,
  currentList: string[],
  setter: (next: string[]) => void
) {
  setter(currentList.filter((item) => item !== value));
}

function formatCoverageLabel(value: CoverageType) {
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

export default function CadastroGeralPage() {
  const router = useRouter();

  const [nomeResponsavel, setNomeResponsavel] = useState("");
  const [nomeEmpresa, setNomeEmpresa] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [site, setSite] = useState("");
  const [instagram, setInstagram] = useState("");

  const [perfisSelecionados, setPerfisSelecionados] = useState<string[]>([]);
  const [coverageType, setCoverageType] = useState<CoverageType>("brasil");
  const [estadoBase, setEstadoBase] = useState("");
  const [regiaoBase, setRegiaoBase] = useState("");
  const [cidadeBase, setCidadeBase] = useState("");
  const [observacaoCobertura, setObservacaoCobertura] = useState("");

  const [atendimentoTipo, setAtendimentoTipo] =
    useState<AttendanceType>("todos");
  const [descricao, setDescricao] = useState("");

  const [segmentoInput, setSegmentoInput] = useState("");
  const [produtoInput, setProdutoInput] = useState("");
  const [segmentoEspecificoInput, setSegmentoEspecificoInput] = useState("");

  const [segmentos, setSegmentos] = useState<string[]>([]);
  const [produtos, setProdutos] = useState<string[]>([]);
  const [segmentosEspecificos, setSegmentosEspecificos] = useState<string[]>(
    []
  );

  const [nomePublico, setNomePublico] = useState("");
  const [descricaoPublicaCurta, setDescricaoPublicaCurta] = useState("");
  const [cidadePublica, setCidadePublica] = useState("");
  const [estadoPublico, setEstadoPublico] = useState("");

  const [mostrarNomePublico, setMostrarNomePublico] = useState(false);
  const [mostrarDescricaoPublica, setMostrarDescricaoPublica] = useState(true);
  const [mostrarCidadePublica, setMostrarCidadePublica] = useState(true);
  const [mostrarEstadoPublico, setMostrarEstadoPublico] = useState(true);
  const [mostrarSegmentosPublicos, setMostrarSegmentosPublicos] =
    useState(true);
  const [mostrarProdutosPublicos, setMostrarProdutosPublicos] = useState(true);

  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState<FeedbackType>("info");
  const [cadastroIdSalvo, setCadastroIdSalvo] = useState("");

  const progresso = useMemo(() => {
    const checks = [
      nomeResponsavel.trim() || nomeEmpresa.trim(),
      whatsapp.trim() || email.trim(),
      perfisSelecionados.length > 0,
      coverageType,
      segmentos.length > 0 || produtos.length > 0,
      descricao.trim(),
    ];

    const filled = checks.filter(Boolean).length;
    return Math.round((filled / checks.length) * 100);
  }, [
    nomeResponsavel,
    nomeEmpresa,
    whatsapp,
    email,
    perfisSelecionados,
    coverageType,
    segmentos,
    produtos,
    descricao,
  ]);

  function togglePerfil(perfil: string) {
    const exists = perfisSelecionados.includes(perfil);

    if (exists) {
      setPerfisSelecionados(perfisSelecionados.filter((item) => item !== perfil));
      return;
    }

    setPerfisSelecionados([...perfisSelecionados, perfil]);
  }

  function handleAddSegmento() {
    addUniqueValue(segmentoInput, segmentos, setSegmentos);
    setSegmentoInput("");
  }

  function handleAddProduto() {
    addUniqueValue(produtoInput, produtos, setProdutos);
    setProdutoInput("");
  }

  function handleAddSegmentoEspecifico() {
    addUniqueValue(
      segmentoEspecificoInput,
      segmentosEspecificos,
      setSegmentosEspecificos
    );
    setSegmentoEspecificoInput("");
  }

  function clearForm() {
    setNomeResponsavel("");
    setNomeEmpresa("");
    setWhatsapp("");
    setEmail("");
    setSite("");
    setInstagram("");
    setPerfisSelecionados([]);
    setCoverageType("brasil");
    setEstadoBase("");
    setRegiaoBase("");
    setCidadeBase("");
    setObservacaoCobertura("");
    setAtendimentoTipo("todos");
    setDescricao("");
    setSegmentoInput("");
    setProdutoInput("");
    setSegmentoEspecificoInput("");
    setSegmentos([]);
    setProdutos([]);
    setSegmentosEspecificos([]);
    setNomePublico("");
    setDescricaoPublicaCurta("");
    setCidadePublica("");
    setEstadoPublico("");
    setMostrarNomePublico(false);
    setMostrarDescricaoPublica(true);
    setMostrarCidadePublica(true);
    setMostrarEstadoPublico(true);
    setMostrarSegmentosPublicos(true);
    setMostrarProdutosPublicos(true);
  }

  async function insertVocabulary(
    supabase: SupabaseClient,
    tipo: "segmento" | "produto_servico" | "perfil" | "segmento_atendido",
    termos: string[]
  ) {
    if (!termos.length) return;

    const payload = termos.map((termo) => ({
      tipo,
      termo,
      primeira_origem: "cadastro_geral",
    }));

    await supabase
      .from("cadastro_vocabulario")
      .upsert(payload, { onConflict: "tipo,termo" });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setFeedback("");
    setCadastroIdSalvo("");

    try {
      const supabase = getSupabaseBrowserClient();

      if (!supabase) {
        throw new Error(
          "Variáveis NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY não configuradas."
        );
      }

      let userId: string | null = null;

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        userId = session?.user?.id ?? null;
      } catch {
        userId = null;
      }

      if (!nomeResponsavel.trim() && !nomeEmpresa.trim()) {
        throw new Error(
          "Preencha pelo menos o nome do responsável ou o nome da empresa."
        );
      }

      const perfisLimpos = perfisSelecionados.map(sanitizeValue).filter(Boolean);
      const segmentosLimpos = segmentos.map(sanitizeValue).filter(Boolean);
      const produtosLimpos = produtos.map(sanitizeValue).filter(Boolean);
      const segmentosEspecificosLimpos = segmentosEspecificos
        .map(sanitizeValue)
        .filter(Boolean);

      const cadastroPayload = {
        user_id: userId,
        nome_responsavel: nomeResponsavel.trim() || null,
        nome_empresa: nomeEmpresa.trim() || null,
        whatsapp: whatsapp.trim() || null,
        email: email.trim() || null,
        site: site.trim() || null,
        instagram: instagram.trim() || null,
        coverage_type: coverageType,
        estado_base: estadoBase || null,
        regiao_base: regiaoBase.trim() || null,
        cidade_base: cidadeBase.trim() || null,
        observacao_cobertura: observacaoCobertura.trim() || null,
        atendimento_tipo: atendimentoTipo,
        descricao_publica: descricao.trim() || null,
        status: "rascunho",
        is_public: false,
        origem: "cadastro_geral",
        nome_publico: nomePublico.trim() || null,
        descricao_publica_curta: descricaoPublicaCurta.trim() || null,
        cidade_publica: cidadePublica.trim() || null,
        estado_publico: estadoPublico || null,
        mostrar_nome_publico: mostrarNomePublico,
        mostrar_descricao_publica: mostrarDescricaoPublica,
        mostrar_cidade_publica: mostrarCidadePublica,
        mostrar_estado_publico: mostrarEstadoPublico,
        mostrar_segmentos_publicos: mostrarSegmentosPublicos,
        mostrar_produtos_publicos: mostrarProdutosPublicos,
      };

      const { data: cadastroCriado, error: cadastroError } = await supabase
        .from("cadastros_gerais")
        .insert(cadastroPayload)
        .select("id")
        .single();

      if (cadastroError) {
        throw cadastroError;
      }

      const cadastroId = cadastroCriado.id as string;

      if (perfisLimpos.length > 0) {
        const { error } = await supabase.from("cadastro_perfis").insert(
          perfisLimpos.map((perfil) => ({
            cadastro_id: cadastroId,
            perfil,
          }))
        );

        if (error) throw error;
      }

      if (segmentosLimpos.length > 0) {
        const { error } = await supabase.from("cadastro_segmentos").insert(
          segmentosLimpos.map((nome) => ({
            cadastro_id: cadastroId,
            nome,
          }))
        );

        if (error) throw error;
      }

      if (produtosLimpos.length > 0) {
        const { error } = await supabase
          .from("cadastro_produtos_servicos")
          .insert(
            produtosLimpos.map((nome) => ({
              cadastro_id: cadastroId,
              nome,
            }))
          );

        if (error) throw error;
      }

      if (
        atendimentoTipo === "especificos" &&
        segmentosEspecificosLimpos.length > 0
      ) {
        const { error } = await supabase
          .from("cadastro_segmentos_atendidos")
          .insert(
            segmentosEspecificosLimpos.map((nome) => ({
              cadastro_id: cadastroId,
              nome,
            }))
          );

        if (error) throw error;
      }

      const { error: coberturaError } = await supabase
        .from("cadastro_areas_cobertura")
        .insert({
          cadastro_id: cadastroId,
          coverage_type: coverageType,
          pais: "Brasil",
          estado: estadoBase || null,
          regiao: regiaoBase.trim() || null,
          cidade: cidadeBase.trim() || null,
          observacao: observacaoCobertura.trim() || null,
        });

      if (coberturaError) {
        throw coberturaError;
      }

      await insertVocabulary(supabase, "perfil", perfisLimpos);
      await insertVocabulary(supabase, "segmento", segmentosLimpos);
      await insertVocabulary(supabase, "produto_servico", produtosLimpos);

      if (atendimentoTipo === "especificos") {
        await insertVocabulary(
          supabase,
          "segmento_atendido",
          segmentosEspecificosLimpos
        );
      }

      try {
        localStorage.setItem(
          "aurora-cadastro-geral-email",
          email.trim() || ""
        );
      } catch {}

      setCadastroIdSalvo(cadastroId);
      setFeedbackType("success");
      setFeedback(
        "Cadastro real salvo no Supabase com privacidade por padrão."
      );

      const emailSafe = encodeURIComponent(email.trim() || "");
      clearForm();

      router.push(`/cadastro/sucesso?next=/chat&email=${emailSafe}`);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Falha ao salvar o cadastro real.";

      setFeedbackType("error");
      setFeedback(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main style={styles.main}>
      <div style={styles.container}>
        <div style={styles.topNav}>
          <NavLink href="/" label="Voltar à Home" color="#93c5fd" />
          <NavLink href="/guardiao" label="Ir para o Guardião" color="#facc15" />
          <NavLink
            href="/app-builder"
            label="Ir para App Builder"
            color="#86efac"
          />
          <NavLink
            href="/aurora-responde"
            label="Aurora Responde"
            color="#c4b5fd"
          />
          <NavLink href="/mineracao" label="Mineração" color="#f59e0b" />
        </div>

        <section style={styles.heroCard}>
          <div style={styles.badge}>Cadastro geral definitivo</div>
          <h1 style={styles.heroTitle}>Cadastro geral real da Aurora</h1>
          <p style={styles.heroText}>
            Esta é a base principal de entrada da plataforma para empresas,
            profissionais, fornecedores, compradores, parceiros e operações em
            nível Brasil, estadual, regional, municipal ou multilocal. Estamos em
            constante atualização e pode haver momentos de instabilidade.
          </p>

          <div style={styles.heroGrid}>
            <MiniInfo
              title="Objetivo"
              value="Base definitiva"
              text="Evitar retrabalho, perda de dados e mudanças estruturais com o sistema já em uso."
            />
            <MiniInfo
              title="Estratégia"
              value="Super editável"
              text="Segmentos, produtos e serviços podem crescer junto com a plataforma."
            />
            <MiniInfo
              title="Privacidade"
              value="Por padrão"
              text="Dados públicos e dados internos agora ficam separados para proteger pessoas e empresas."
            />
            <MiniInfo
              title="Progresso"
              value={`${progresso}%`}
              text="Preencha os blocos principais e grave a base real no Supabase."
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
            {cadastroIdSalvo ? (
              <div style={{ marginTop: 8, fontSize: 13 }}>
                ID salvo: {cadastroIdSalvo}
              </div>
            ) : null}
          </section>
        ) : null}

        <form onSubmit={handleSubmit} style={styles.formWrap}>
          <SectionCard
            title="1. Identificação principal"
            text="Dados-base do cadastro para contato, confiança e operação."
          >
            <div style={styles.grid2}>
              <Field
                label="Nome do responsável"
                value={nomeResponsavel}
                onChange={setNomeResponsavel}
                placeholder="Ex.: Ricardo Leonardo Moreira"
              />
              <Field
                label="Nome da empresa ou marca"
                value={nomeEmpresa}
                onChange={setNomeEmpresa}
                placeholder="Ex.: Aurora IA"
              />
              <Field
                label="WhatsApp"
                value={whatsapp}
                onChange={setWhatsapp}
                placeholder="Ex.: (31) 99999-9999"
              />
              <Field
                label="E-mail"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="Ex.: contato@empresa.com"
              />
              <Field
                label="Site"
                value={site}
                onChange={setSite}
                placeholder="Ex.: https://ricardoiaoficial.com"
              />
              <Field
                label="Instagram ou rede principal"
                value={instagram}
                onChange={setInstagram}
                placeholder="Ex.: @ricardoiaoficial"
              />
            </div>
          </SectionCard>

          <SectionCard
            title="2. Tipo de perfil"
            text="O cadastro pode representar mais de um papel dentro da plataforma."
          >
            <div style={styles.choiceGrid}>
              {PERFIS_BASE.map((perfil) => {
                const active = perfisSelecionados.includes(perfil);
                return (
                  <button
                    key={perfil}
                    type="button"
                    onClick={() => togglePerfil(perfil)}
                    style={{
                      ...styles.choiceButton,
                      ...(active ? styles.choiceButtonActive : null),
                    }}
                  >
                    {perfil}
                  </button>
                );
              })}
            </div>
          </SectionCard>

          <SectionCard
            title="3. Nível de atuação"
            text="Aqui definimos a seriedade da operação e como a busca futura vai funcionar."
          >
            <div style={styles.choiceGrid}>
              {(
                [
                  ["brasil", "Brasil inteiro"],
                  ["estadual", "Estadual"],
                  ["regional", "Regional"],
                  ["municipal", "Municipal"],
                  ["multilocal", "Multilocal"],
                ] as Array<[CoverageType, string]>
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setCoverageType(value)}
                  style={{
                    ...styles.choiceButton,
                    ...(coverageType === value ? styles.choiceButtonActive : null),
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            <div style={styles.inlineInfo}>
              Cobertura selecionada: <strong>{formatCoverageLabel(coverageType)}</strong>
            </div>

            <div style={styles.grid2}>
              <SelectField
                label="Estado-base"
                value={estadoBase}
                onChange={setEstadoBase}
                options={ESTADOS_BR}
              />
              <Field
                label="Região-base"
                value={regiaoBase}
                onChange={setRegiaoBase}
                placeholder="Ex.: Metropolitana de Belo Horizonte"
              />
              <Field
                label="Cidade-base"
                value={cidadeBase}
                onChange={setCidadeBase}
                placeholder="Ex.: Vespasiano"
              />
              <Field
                label="Observação de cobertura"
                value={observacaoCobertura}
                onChange={setObservacaoCobertura}
                placeholder="Ex.: atende MG, SP e GO com operação própria"
              />
            </div>
          </SectionCard>

          <SectionCard
            title="4. Segmentos da operação"
            text="O sistema precisa crescer com o usuário. Por isso este bloco é aberto, editável e expansível."
          >
            <SuggestionRow
              title="Sugestões"
              items={SEGMENTOS_SUGERIDOS}
              onAdd={(item) => addUniqueValue(item, segmentos, setSegmentos)}
            />

            <div style={styles.addRow}>
              <input
                value={segmentoInput}
                onChange={(e) => setSegmentoInput(e.target.value)}
                placeholder="Digite um segmento e clique para adicionar"
                style={styles.input}
              />
              <button type="button" onClick={handleAddSegmento} style={styles.addButton}>
                Adicionar segmento
              </button>
            </div>

            <TagList
              items={segmentos}
              emptyText="Nenhum segmento adicionado ainda."
              onRemove={(item) => removeValue(item, segmentos, setSegmentos)}
            />
          </SectionCard>

          <SectionCard
            title="5. Produtos e serviços"
            text="Cadastre o que a empresa vende, entrega, representa, opera ou presta."
          >
            <SuggestionRow
              title="Sugestões"
              items={PRODUTOS_SUGERIDOS}
              onAdd={(item) => addUniqueValue(item, produtos, setProdutos)}
            />

            <div style={styles.addRow}>
              <input
                value={produtoInput}
                onChange={(e) => setProdutoInput(e.target.value)}
                placeholder="Digite um produto ou serviço e clique para adicionar"
                style={styles.input}
              />
              <button type="button" onClick={handleAddProduto} style={styles.addButton}>
                Adicionar produto/serviço
              </button>
            </div>

            <TagList
              items={produtos}
              emptyText="Nenhum produto ou serviço adicionado ainda."
              onRemove={(item) => removeValue(item, produtos, setProdutos)}
            />
          </SectionCard>

          <SectionCard
            title="6. Atendimento da operação"
            text="Defina se a empresa atende todos os segmentos ou apenas segmentos específicos."
          >
            <div style={styles.choiceGrid}>
              <button
                type="button"
                onClick={() => setAtendimentoTipo("todos")}
                style={{
                  ...styles.choiceButton,
                  ...(atendimentoTipo === "todos" ? styles.choiceButtonActive : null),
                }}
              >
                Atende todos os segmentos
              </button>

              <button
                type="button"
                onClick={() => setAtendimentoTipo("especificos")}
                style={{
                  ...styles.choiceButton,
                  ...(atendimentoTipo === "especificos"
                    ? styles.choiceButtonActive
                    : null),
                }}
              >
                Atende segmentos específicos
              </button>
            </div>

            {atendimentoTipo === "especificos" ? (
              <>
                <div style={styles.addRow}>
                  <input
                    value={segmentoEspecificoInput}
                    onChange={(e) => setSegmentoEspecificoInput(e.target.value)}
                    placeholder="Digite um segmento atendido"
                    style={styles.input}
                  />
                  <button
                    type="button"
                    onClick={handleAddSegmentoEspecifico}
                    style={styles.addButton}
                  >
                    Adicionar segmento atendido
                  </button>
                </div>

                <TagList
                  items={segmentosEspecificos}
                  emptyText="Nenhum segmento específico informado ainda."
                  onRemove={(item) =>
                    removeValue(item, segmentosEspecificos, setSegmentosEspecificos)
                  }
                />
              </>
            ) : (
              <div style={styles.inlineInfo}>
                A empresa será tratada como atendimento amplo no cadastro inicial.
              </div>
            )}
          </SectionCard>

          <SectionCard
            title="7. Descrição principal"
            text="Explique a operação para dar clareza ao cadastro real."
          >
            <label style={styles.label}>Descrição pública interna</label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Ex.: empresa focada em transporte executivo, logística corporativa e locação com atuação em MG e SP."
              style={styles.textarea}
              rows={6}
            />
          </SectionCard>

          <SectionCard
            title="8. Camada pública controlada"
            text="Esses campos ajudam a preparar a vitrine pública com privacidade por padrão."
          >
            <div style={styles.grid2}>
              <Field
                label="Nome público"
                value={nomePublico}
                onChange={setNomePublico}
                placeholder="Ex.: Grupo Executivo Service"
              />
              <Field
                label="Descrição pública curta"
                value={descricaoPublicaCurta}
                onChange={setDescricaoPublicaCurta}
                placeholder="Ex.: operação de transporte executivo e logística"
              />
              <Field
                label="Cidade pública"
                value={cidadePublica}
                onChange={setCidadePublica}
                placeholder="Ex.: Belo Horizonte"
              />
              <SelectField
                label="Estado público"
                value={estadoPublico}
                onChange={setEstadoPublico}
                options={ESTADOS_BR}
              />
            </div>

            <div style={styles.checkGrid}>
              <CheckboxField
                label="Mostrar nome público"
                checked={mostrarNomePublico}
                onChange={setMostrarNomePublico}
              />
              <CheckboxField
                label="Mostrar descrição pública"
                checked={mostrarDescricaoPublica}
                onChange={setMostrarDescricaoPublica}
              />
              <CheckboxField
                label="Mostrar cidade pública"
                checked={mostrarCidadePublica}
                onChange={setMostrarCidadePublica}
              />
              <CheckboxField
                label="Mostrar estado público"
                checked={mostrarEstadoPublico}
                onChange={setMostrarEstadoPublico}
              />
              <CheckboxField
                label="Mostrar segmentos públicos"
                checked={mostrarSegmentosPublicos}
                onChange={setMostrarSegmentosPublicos}
              />
              <CheckboxField
                label="Mostrar produtos públicos"
                checked={mostrarProdutosPublicos}
                onChange={setMostrarProdutosPublicos}
              />
            </div>
          </SectionCard>

          <section style={styles.submitCard}>
            <div style={styles.submitTextWrap}>
              <div style={styles.submitTitle}>Salvar cadastro geral real</div>
              <div style={styles.submitText}>
                O registro será salvo no Supabase em rascunho privado, com base
                preparada para publicação depois no Guardião.
              </div>
            </div>

            <div style={styles.submitActions}>
              <button type="submit" style={styles.primarySubmit} disabled={saving}>
                {saving ? "Salvando cadastro real..." : "Salvar cadastro geral"}
              </button>

              <button
                type="button"
                style={styles.secondarySubmit}
                onClick={clearForm}
                disabled={saving}
              >
                Limpar formulário
              </button>
            </div>
          </section>
        </form>
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
        ...styles.topLink,
        borderColor: color,
        color,
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
    <div style={styles.infoCard}>
      <div style={styles.infoTitle}>{title}</div>
      <div style={styles.infoValue}>{value}</div>
      <div style={styles.infoText}>{text}</div>
    </div>
  );
}

function SectionCard({
  title,
  text,
  children,
}: {
  title: string;
  text: string;
  children: React.ReactNode;
}) {
  return (
    <section style={styles.sectionCard}>
      <div style={{ display: "grid", gap: 6 }}>
        <div style={styles.sectionTitle}>{title}</div>
        <div style={styles.sectionText}>{text}</div>
      </div>
      <div style={{ display: "grid", gap: 14 }}>{children}</div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <div style={{ display: "grid", gap: 8 }}>
      <label style={styles.label}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={styles.input}
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div style={{ display: "grid", gap: 8 }}>
      <label style={styles.label}>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={styles.select}
      >
        <option value="">Selecione</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function CheckboxField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label style={styles.checkboxLabel}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>{label}</span>
    </label>
  );
}

function SuggestionRow({
  title,
  items,
  onAdd,
}: {
  title: string;
  items: string[];
  onAdd: (item: string) => void;
}) {
  return (
    <div style={{ display: "grid", gap: 10 }}>
      <div style={styles.label}>{title}</div>
      <div style={styles.suggestionWrap}>
        {items.map((item) => (
          <button
            key={item}
            type="button"
            style={styles.suggestionButton}
            onClick={() => onAdd(item)}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

function TagList({
  items,
  emptyText,
  onRemove,
}: {
  items: string[];
  emptyText: string;
  onRemove: (item: string) => void;
}) {
  if (items.length === 0) {
    return <div style={styles.emptyTagBox}>{emptyText}</div>;
  }

  return (
    <div style={styles.tagWrap}>
      {items.map((item) => (
        <div key={item} style={styles.tag}>
          <span>{item}</span>
          <button
            type="button"
            style={styles.tagRemove}
            onClick={() => onRemove(item)}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  main: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top, rgba(34,197,94,0.12), transparent 18%), radial-gradient(circle at right top, rgba(59,130,246,0.10), transparent 22%), linear-gradient(180deg, #03110d 0%, #071712 38%, #030504 100%)",
    color: "#ecfdf5",
    padding: "24px 16px 80px",
  },
  container: {
    maxWidth: 1240,
    margin: "0 auto",
    display: "grid",
    gap: 18,
  },
  topNav: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
  },
  topLink: {
    textDecoration: "none",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.04)",
    borderRadius: 14,
    padding: "10px 14px",
    fontWeight: 800,
  },
  heroCard: {
    border: "1px solid rgba(255,255,255,0.08)",
    background:
      "linear-gradient(180deg, rgba(7,18,13,0.90), rgba(7,18,13,0.78))",
    borderRadius: 28,
    padding: "26px 22px",
    boxShadow: "0 18px 60px rgba(0,0,0,0.22)",
    display: "grid",
    gap: 18,
  },
  badge: {
    display: "inline-flex",
    width: "fit-content",
    alignItems: "center",
    gap: 8,
    padding: "8px 12px",
    borderRadius: 999,
    background: "rgba(34,197,94,0.10)",
    border: "1px solid rgba(34,197,94,0.26)",
    color: "#86efac",
    fontSize: 13,
    fontWeight: 800,
  },
  heroTitle: {
    margin: 0,
    fontSize: "clamp(30px, 6vw, 52px)",
    lineHeight: 1.02,
    letterSpacing: "-0.03em",
  },
  heroText: {
    margin: 0,
    color: "rgba(236,253,245,0.84)",
    fontSize: 18,
    lineHeight: 1.7,
    maxWidth: 980,
  },
  heroGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 12,
  },
  infoCard: {
    borderRadius: 18,
    padding: "16px",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.06)",
    display: "grid",
    gap: 8,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: 900,
    color: "#86efac",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  infoValue: {
    fontSize: 22,
    fontWeight: 900,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 1.6,
    color: "rgba(236,253,245,0.72)",
  },
  feedbackBox: {
    borderRadius: 18,
    padding: "16px 18px",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  feedbackSuccess: {
    background: "rgba(34,197,94,0.12)",
    borderColor: "rgba(34,197,94,0.26)",
  },
  feedbackError: {
    background: "rgba(239,68,68,0.12)",
    borderColor: "rgba(239,68,68,0.26)",
  },
  feedbackInfo: {
    background: "rgba(59,130,246,0.12)",
    borderColor: "rgba(59,130,246,0.26)",
  },
  formWrap: {
    display: "grid",
    gap: 16,
  },
  sectionCard: {
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(7, 18, 13, 0.84)",
    borderRadius: 24,
    padding: "22px 18px",
    boxShadow: "0 18px 60px rgba(0,0,0,0.20)",
    display: "grid",
    gap: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 900,
    lineHeight: 1.2,
  },
  sectionText: {
    fontSize: 14,
    lineHeight: 1.7,
    color: "rgba(236,253,245,0.74)",
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: 800,
    color: "#d1fae5",
  },
  input: {
    width: "100%",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.05)",
    color: "#ecfdf5",
    padding: "14px 14px",
    outline: "none",
    fontSize: 15,
  },
  select: {
    width: "100%",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "#0c1713",
    color: "#ecfdf5",
    padding: "14px 14px",
    outline: "none",
    fontSize: 15,
  },
  textarea: {
    width: "100%",
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.05)",
    color: "#ecfdf5",
    padding: "14px 14px",
    outline: "none",
    fontSize: 15,
    resize: "vertical",
  },
  choiceGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 10,
  },
  choiceButton: {
    cursor: "pointer",
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.04)",
    color: "#ecfdf5",
    padding: "14px 16px",
    fontWeight: 800,
    textAlign: "left",
  },
  choiceButtonActive: {
    background:
      "linear-gradient(135deg, rgba(34,197,94,0.22), rgba(74,222,128,0.18))",
    borderColor: "rgba(34,197,94,0.34)",
    color: "#d1fae5",
  },
  inlineInfo: {
    borderRadius: 14,
    padding: "12px 14px",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.06)",
    color: "rgba(236,253,245,0.78)",
    fontSize: 14,
  },
  suggestionWrap: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },
  suggestionButton: {
    cursor: "pointer",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.05)",
    color: "#ecfdf5",
    padding: "8px 12px",
    fontWeight: 700,
  },
  addRow: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    gap: 10,
    alignItems: "center",
  },
  addButton: {
    cursor: "pointer",
    borderRadius: 14,
    border: "1px solid rgba(34,197,94,0.28)",
    background: "linear-gradient(135deg, #22c55e, #4ade80)",
    color: "#04110a",
    padding: "14px 16px",
    fontWeight: 900,
  },
  emptyTagBox: {
    borderRadius: 14,
    padding: "14px 16px",
    background: "rgba(255,255,255,0.03)",
    border: "1px dashed rgba(255,255,255,0.10)",
    color: "rgba(236,253,245,0.62)",
    fontSize: 14,
  },
  tagWrap: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    borderRadius: 999,
    padding: "9px 12px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.10)",
    fontSize: 14,
    fontWeight: 700,
  },
  tagRemove: {
    cursor: "pointer",
    border: "none",
    background: "transparent",
    color: "#fca5a5",
    fontSize: 18,
    lineHeight: 1,
    padding: 0,
  },
  checkGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
    gap: 10,
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    borderRadius: 14,
    padding: "12px 14px",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.06)",
    fontSize: 14,
    color: "#ecfdf5",
  },
  submitCard: {
    border: "1px solid rgba(255,255,255,0.08)",
    background:
      "linear-gradient(135deg, rgba(34,197,94,0.12), rgba(59,130,246,0.10))",
    borderRadius: 24,
    padding: "22px 18px",
    display: "grid",
    gap: 14,
  },
  submitTextWrap: {
    display: "grid",
    gap: 6,
  },
  submitTitle: {
    fontSize: 22,
    fontWeight: 900,
  },
  submitText: {
    fontSize: 14,
    lineHeight: 1.7,
    color: "rgba(236,253,245,0.82)",
  },
  submitActions: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
  },
  primarySubmit: {
    cursor: "pointer",
    borderRadius: 16,
    border: "1px solid rgba(34,197,94,0.28)",
    background: "linear-gradient(135deg, #22c55e, #4ade80)",
    color: "#04110a",
    padding: "14px 18px",
    fontWeight: 900,
  },
  secondarySubmit: {
    cursor: "pointer",
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.05)",
    color: "#ecfdf5",
    padding: "14px 18px",
    fontWeight: 800,
  },
};