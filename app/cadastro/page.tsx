"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type CoverageType =
  | "brasil"
  | "estadual"
  | "regional"
  | "municipal"
  | "multilocal";

type AttendanceType = "todos" | "especificos";

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

function slugifyTerm(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

export default function CadastroGeralPage() {
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
  const [segmentos, setSegmentos] = useState<string[]>([]);
  const [produtos, setProdutos] = useState<string[]>([]);
  const [segmentosEspecificos, setSegmentosEspecificos] = useState<string[]>(
    []
  );
  const [segmentoEspecificoInput, setSegmentoEspecificoInput] = useState("");

  const [nomePublico, setNomePublico] = useState("");
  const [descricaoPublicaCurta, setDescricaoPublicaCurta] = useState("");
  const [cidadePublica, setCidadePublica] = useState("");
  const [estadoPublico, setEstadoPublico] = useState("");
  const [mostrarNomePublico, setMostrarNomePublico] = useState(false);
  const [mostrarDescricaoPublica, setMostrarDescricaoPublica] = useState(true);
  const [mostrarCidadePublica, setMostrarCidadePublica] = useState(true);
  const [mostrarEstadoPublico, setMostrarEstadoPublico] = useState(true);
  const [mostrarSegmentosPublicos, setMostrarSegmentosPublicos] = useState(true);
  const [mostrarProdutosPublicos, setMostrarProdutosPublicos] = useState(true);

  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string>("");
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | "info">(
    "info"
  );
  const [cadastroIdSalvo, setCadastroIdSalvo] = useState<string>("");

  const coberturaLabel = useMemo(() => {
    switch (coverageType) {
      case "brasil":
        return "Brasil inteiro";
      case "estadual":
        return "Nível estadual";
      case "regional":
        return "Nível regional";
      case "municipal":
        return "Nível municipal";
      case "multilocal":
        return "Atuação multilocal";
      default:
        return "Cobertura";
    }
  }, [coverageType]);

  function togglePerfil(perfil: string) {
    setPerfisSelecionados((prev) =>
      prev.includes(perfil)
        ? prev.filter((item) => item !== perfil)
        : [...prev, perfil]
    );
  }

  function addUniqueValue(
    rawValue: string,
    current: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) {
    const value = slugifyTerm(rawValue);
    if (!value) return;

    const exists = current.some(
      (item) => item.toLowerCase() === value.toLowerCase()
    );

    if (!exists) {
      setter([...current, value]);
    }
  }

  function removeItem(
    value: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) {
    setter((prev) => prev.filter((item) => item !== value));
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
    setSegmentos([]);
    setProdutos([]);
    setSegmentosEspecificos([]);
    setSegmentoEspecificoInput("");

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

  async function handleSubmit(e: React.FormEvent) {
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

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        throw new Error(
          "Você precisa estar logado para salvar o cadastro real no banco."
        );
      }

      if (!nomeResponsavel.trim() && !nomeEmpresa.trim()) {
        throw new Error(
          "Preencha pelo menos o nome do responsável ou o nome da empresa."
        );
      }

      const perfisLimpos = perfisSelecionados.map(slugifyTerm).filter(Boolean);
      const segmentosLimpos = segmentos.map(slugifyTerm).filter(Boolean);
      const produtosLimpos = produtos.map(slugifyTerm).filter(Boolean);
      const segmentosEspecificosLimpos = segmentosEspecificos
        .map(slugifyTerm)
        .filter(Boolean);

      const cadastroPayload = {
        user_id: user.id,
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

      const cadastroId = cadastroCriado.id;

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

      setCadastroIdSalvo(cadastroId);
      setFeedbackType("success");
      setFeedback(
        "Cadastro real salvo no Supabase com privacidade por padrão. Os campos públicos próprios também foram gravados."
      );

      clearForm();
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
          <NavLink href="/app-builder" label="Ir para App Builder" color="#86efac" />
          <NavLink href="/aurora-responde" label="Aurora Responde" color="#c4b5fd" />
          <NavLink href="/mineracao" label="Mineração" color="#f59e0b" />
        </div>

        <section style={styles.heroCard}>
          <div style={styles.badge}>Cadastro geral definitivo</div>
          <h1 style={styles.heroTitle}>Cadastro geral real da Aurora</h1>
          <p style={styles.heroText}>
            Esta é a base principal de entrada da plataforma para empresas,
            profissionais, fornecedores, compradores, parceiros e operações em
            nível Brasil, estadual, regional, municipal ou multilocal.
            Estamos em constante atualização e pode haver momentos de instabilidade.
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
          </div>
        </section>

        <form onSubmit={handleSubmit} style={styles.formCard}>
          <SectionTitle
            title="1. Identificação principal"
            text="Dados-base internos para contato, confiança e operação. Não são públicos por padrão."
          />

          <div style={styles.grid2}>
            <Field
              label="Nome do responsável"
              placeholder="Ex.: Ricardo Leonardo Moreira"
              value={nomeResponsavel}
              onChange={setNomeResponsavel}
            />
            <Field
              label="Nome da empresa ou marca"
              placeholder="Ex.: Aurora IA"
              value={nomeEmpresa}
              onChange={setNomeEmpresa}
            />
            <Field
              label="WhatsApp"
              placeholder="Ex.: (31) 99999-9999"
              value={whatsapp}
              onChange={setWhatsapp}
            />
            <Field
              label="E-mail"
              placeholder="Ex.: contato@empresa.com"
              value={email}
              onChange={setEmail}
            />
            <Field
              label="Site"
              placeholder="Ex.: https://ricardoiaoficial.com"
              value={site}
              onChange={setSite}
            />
            <Field
              label="Instagram ou rede principal"
              placeholder="Ex.: @ricardoiaoficial"
              value={instagram}
              onChange={setInstagram}
            />
          </div>

          <SectionDivider />

          <SectionTitle
            title="2. Campos públicos próprios"
            text="Aqui você define o que pode aparecer na vitrine pública. Privacidade fica protegida por padrão."
          />

          <div style={styles.grid2}>
            <Field
              label="Nome público"
              placeholder="Ex.: Aurora IA Minas"
              value={nomePublico}
              onChange={setNomePublico}
            />
            <Field
              label="Descrição pública curta"
              placeholder="Ex.: soluções de tecnologia e atendimento empresarial"
              value={descricaoPublicaCurta}
              onChange={setDescricaoPublicaCurta}
            />
            <Field
              label="Cidade pública"
              placeholder="Ex.: Lagoa Santa"
              value={cidadePublica}
              onChange={setCidadePublica}
            />
            <div style={styles.fieldWrap}>
              <label style={styles.label}>Estado público</label>
              <select
                value={estadoPublico}
                onChange={(e) => setEstadoPublico(e.target.value)}
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
              active={mostrarNomePublico}
              onClick={() => setMostrarNomePublico((prev) => !prev)}
            />
            <ToggleButton
              label="Mostrar descrição pública"
              active={mostrarDescricaoPublica}
              onClick={() => setMostrarDescricaoPublica((prev) => !prev)}
            />
            <ToggleButton
              label="Mostrar cidade pública"
              active={mostrarCidadePublica}
              onClick={() => setMostrarCidadePublica((prev) => !prev)}
            />
            <ToggleButton
              label="Mostrar estado público"
              active={mostrarEstadoPublico}
              onClick={() => setMostrarEstadoPublico((prev) => !prev)}
            />
            <ToggleButton
              label="Mostrar segmentos públicos"
              active={mostrarSegmentosPublicos}
              onClick={() => setMostrarSegmentosPublicos((prev) => !prev)}
            />
            <ToggleButton
              label="Mostrar produtos públicos"
              active={mostrarProdutosPublicos}
              onClick={() => setMostrarProdutosPublicos((prev) => !prev)}
            />
          </div>

          <SectionDivider />

          <SectionTitle
            title="3. Tipo de perfil"
            text="O cadastro pode representar mais de um papel dentro da plataforma."
          />

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
                    ...(active ? styles.choiceButtonActive : {}),
                  }}
                >
                  {perfil}
                </button>
              );
            })}
          </div>

          <SectionDivider />

          <SectionTitle
            title="4. Nível de atuação"
            text="Aqui definimos a seriedade da operação e como a busca futura vai funcionar."
          />

          <div style={styles.choiceGrid}>
            <CoverageButton
              label="Brasil inteiro"
              active={coverageType === "brasil"}
              onClick={() => setCoverageType("brasil")}
            />
            <CoverageButton
              label="Estadual"
              active={coverageType === "estadual"}
              onClick={() => setCoverageType("estadual")}
            />
            <CoverageButton
              label="Regional"
              active={coverageType === "regional"}
              onClick={() => setCoverageType("regional")}
            />
            <CoverageButton
              label="Municipal"
              active={coverageType === "municipal"}
              onClick={() => setCoverageType("municipal")}
            />
            <CoverageButton
              label="Multilocal"
              active={coverageType === "multilocal"}
              onClick={() => setCoverageType("multilocal")}
            />
          </div>

          <div style={styles.grid3}>
            <ReadOnlyField label="Cobertura selecionada" value={coberturaLabel} />

            <div style={styles.fieldWrap}>
              <label style={styles.label}>Estado-base</label>
              <select
                value={estadoBase}
                onChange={(e) => setEstadoBase(e.target.value)}
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

            <Field
              label="Região-base"
              placeholder="Ex.: Metropolitana de Belo Horizonte"
              value={regiaoBase}
              onChange={setRegiaoBase}
            />
          </div>

          <div style={styles.grid2}>
            <Field
              label="Cidade-base"
              placeholder="Ex.: Vespasiano"
              value={cidadeBase}
              onChange={setCidadeBase}
            />
            <Field
              label="Observação de cobertura"
              placeholder="Ex.: atende MG, SP e GO com operação própria"
              value={observacaoCobertura}
              onChange={setObservacaoCobertura}
            />
          </div>

          <SectionDivider />

          <SectionTitle
            title="5. Segmentos da operação"
            text="O sistema precisa crescer com o usuário. Por isso este bloco é aberto, editável e expansível."
          />

          <div style={styles.suggestionBlock}>
            {SEGMENTOS_SUGERIDOS.map((item) => (
              <button
                key={item}
                type="button"
                style={styles.suggestionChip}
                onClick={() => addUniqueValue(item, segmentos, setSegmentos)}
              >
                + {item}
              </button>
            ))}
          </div>

          <div style={styles.addRow}>
            <input
              value={segmentoInput}
              onChange={(e) => setSegmentoInput(e.target.value)}
              placeholder="Digite um segmento que ainda não exista"
              style={styles.input}
            />
            <button type="button" onClick={handleAddSegmento} style={styles.addButton}>
              Adicionar segmento
            </button>
          </div>

          <TagList
            title="Segmentos cadastrados"
            items={segmentos}
            emptyText="Nenhum segmento adicionado ainda."
            onRemove={(item) => removeItem(item, setSegmentos)}
          />

          <SectionDivider />

          <SectionTitle
            title="6. Produtos, serviços ou soluções"
            text="Nunca vamos lembrar todos. Então a entrada precisa aceitar tudo e transformar isso em inteligência de busca depois."
          />

          <div style={styles.suggestionBlock}>
            {PRODUTOS_SUGERIDOS.map((item) => (
              <button
                key={item}
                type="button"
                style={styles.suggestionChip}
                onClick={() => addUniqueValue(item, produtos, setProdutos)}
              >
                + {item}
              </button>
            ))}
          </div>

          <div style={styles.addRow}>
            <input
              value={produtoInput}
              onChange={(e) => setProdutoInput(e.target.value)}
              placeholder="Digite um produto, serviço ou solução"
              style={styles.input}
            />
            <button type="button" onClick={handleAddProduto} style={styles.addButton}>
              Adicionar produto
            </button>
          </div>

          <TagList
            title="Produtos e serviços cadastrados"
            items={produtos}
            emptyText="Nenhum produto ou serviço adicionado ainda."
            onRemove={(item) => removeItem(item, setProdutos)}
          />

          <SectionDivider />

          <SectionTitle
            title="7. Atendimento"
            text="Aqui a Aurora entende se o cadastro atende todos os segmentos ou nichos específicos."
          />

          <div style={styles.choiceGrid}>
            <button
              type="button"
              onClick={() => setAtendimentoTipo("todos")}
              style={{
                ...styles.choiceButton,
                ...(atendimentoTipo === "todos" ? styles.choiceButtonActive : {}),
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
                  : {}),
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
                  placeholder="Digite um segmento específico atendido"
                  style={styles.input}
                />
                <button
                  type="button"
                  onClick={handleAddSegmentoEspecifico}
                  style={styles.addButton}
                >
                  Adicionar específico
                </button>
              </div>

              <TagList
                title="Segmentos específicos atendidos"
                items={segmentosEspecificos}
                emptyText="Nenhum segmento específico informado."
                onRemove={(item) => removeItem(item, setSegmentosEspecificos)}
              />
            </>
          ) : null}

          <SectionDivider />

          <SectionTitle
            title="8. Descrição interna do cadastro"
            text="Resumo interno e operacional. Não é a mesma coisa que a camada pública curta."
          />

          <div style={styles.fieldWrap}>
            <label style={styles.label}>Descrição do cadastro</label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva empresa, atuação, diferenciais, produtos, serviços, regiões atendidas e objetivo comercial."
              style={styles.textarea}
            />
          </div>

          <SectionDivider />

          {feedback ? (
            <div
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
                <div style={{ marginTop: 8, wordBreak: "break-all" }}>
                  ID salvo: <strong>{cadastroIdSalvo}</strong>
                </div>
              ) : null}
            </div>
          ) : null}

          <section style={styles.resumeBox}>
            <h2 style={styles.resumeTitle}>Resumo estrutural desta base</h2>

            <div style={styles.resumeGrid}>
              <ResumeItem label="Perfis selecionados" value={perfisSelecionados.length} />
              <ResumeItem label="Segmentos cadastrados" value={segmentos.length} />
              <ResumeItem label="Produtos/serviços" value={produtos.length} />
              <ResumeItem
                label="Modelo de atendimento"
                value={
                  atendimentoTipo === "todos"
                    ? "Todos os segmentos"
                    : "Segmentos específicos"
                }
              />
              <ResumeItem label="Cobertura" value={coberturaLabel} />
              <ResumeItem
                label="Privacidade pública"
                value="Protegida por padrão"
              />
            </div>
          </section>

          <div style={styles.actions}>
            <button type="submit" style={styles.primaryButton} disabled={saving}>
              {saving ? "Salvando no Supabase..." : "Salvar cadastro real"}
            </button>

            <Link href="/guardiao" style={styles.secondaryLink}>
              Ver Guardião
            </Link>
          </div>
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

function SectionTitle({ title, text }: { title: string; text: string }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <h2 style={styles.sectionTitle}>{title}</h2>
      <p style={styles.sectionText}>{text}</p>
    </div>
  );
}

function Field({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
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

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div style={styles.fieldWrap}>
      <label style={styles.label}>{label}</label>
      <div style={styles.readOnly}>{value}</div>
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

function TagList({
  title,
  items,
  emptyText,
  onRemove,
}: {
  title: string;
  items: string[];
  emptyText: string;
  onRemove: (item: string) => void;
}) {
  return (
    <section style={styles.tagSection}>
      <div style={styles.tagTitle}>{title}</div>

      {items.length === 0 ? (
        <div style={styles.emptyBox}>{emptyText}</div>
      ) : (
        <div style={styles.tagWrap}>
          {items.map((item) => (
            <div key={item} style={styles.tag}>
              <span>{item}</span>
              <button
                type="button"
                style={styles.tagRemove}
                onClick={() => onRemove(item)}
              >
                remover
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
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

function CoverageButton({
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
      {label}
    </button>
  );
}

function ResumeItem({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div style={styles.resumeItem}>
      <div style={styles.resumeLabel}>{label}</div>
      <div style={styles.resumeValue}>{value}</div>
    </div>
  );
}

function SectionDivider() {
  return <div style={styles.divider} />;
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
    maxWidth: 1240,
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
    marginBottom: 24,
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
    maxWidth: 940,
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
  },
  miniText: {
    color: "#cbd5e1",
    marginTop: 10,
    marginBottom: 0,
    lineHeight: 1.6,
  },
  formCard: {
    border: "1px solid rgba(148,163,184,0.18)",
    background: "rgba(15,23,42,0.72)",
    backdropFilter: "blur(10px)",
    borderRadius: 24,
    padding: 24,
    boxShadow: "0 20px 80px rgba(0,0,0,0.35)",
  },
  sectionTitle: {
    fontSize: 24,
    margin: 0,
  },
  sectionText: {
    color: "#94a3b8",
    marginTop: 8,
    marginBottom: 0,
    lineHeight: 1.7,
  },
  divider: {
    height: 1,
    background: "rgba(148,163,184,0.14)",
    margin: "28px 0",
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 16,
  },
  grid3: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
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
  textarea: {
    minHeight: 140,
    resize: "vertical",
    borderRadius: 16,
    border: "1px solid rgba(148,163,184,0.18)",
    background: "rgba(2,6,23,0.55)",
    color: "#ffffff",
    padding: "16px",
    outline: "none",
    fontSize: 15,
    lineHeight: 1.6,
  },
  readOnly: {
    borderRadius: 14,
    border: "1px solid rgba(148,163,184,0.18)",
    background: "rgba(2,6,23,0.35)",
    color: "#e2e8f0",
    padding: "14px 16px",
    minHeight: 50,
    display: "flex",
    alignItems: "center",
    fontWeight: 700,
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
  suggestionBlock: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 14,
  },
  suggestionChip: {
    borderRadius: 999,
    border: "1px solid rgba(147,197,253,0.22)",
    background: "rgba(30,41,59,0.55)",
    color: "#bfdbfe",
    padding: "10px 14px",
    fontWeight: 700,
    cursor: "pointer",
  },
  addRow: {
    display: "grid",
    gridTemplateColumns: "1fr 220px",
    gap: 12,
    marginBottom: 16,
  },
  addButton: {
    borderRadius: 14,
    border: "1px solid rgba(16,185,129,0.35)",
    background: "rgba(16,185,129,0.14)",
    color: "#86efac",
    fontWeight: 800,
    cursor: "pointer",
    padding: "14px 16px",
  },
  tagSection: {
    borderRadius: 18,
    padding: 16,
    background: "rgba(2,6,23,0.35)",
    border: "1px solid rgba(148,163,184,0.14)",
  },
  tagTitle: {
    fontSize: 14,
    fontWeight: 800,
    color: "#dbeafe",
    marginBottom: 12,
  },
  emptyBox: {
    color: "#94a3b8",
    lineHeight: 1.6,
  },
  tagWrap: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
  },
  tag: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    borderRadius: 999,
    border: "1px solid rgba(148,163,184,0.16)",
    background: "rgba(15,23,42,0.8)",
    color: "#e2e8f0",
    padding: "10px 14px",
    fontWeight: 700,
  },
  tagRemove: {
    border: "none",
    background: "transparent",
    color: "#fca5a5",
    fontWeight: 800,
    cursor: "pointer",
    textTransform: "uppercase",
    fontSize: 11,
  },
  feedbackBox: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 24,
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
  resumeBox: {
    borderRadius: 20,
    padding: 20,
    background: "rgba(2,6,23,0.42)",
    border: "1px solid rgba(148,163,184,0.15)",
  },
  resumeTitle: {
    marginTop: 0,
    marginBottom: 16,
    fontSize: 22,
  },
  resumeGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 14,
  },
  resumeItem: {
    borderRadius: 16,
    padding: 16,
    background: "rgba(15,23,42,0.68)",
    border: "1px solid rgba(148,163,184,0.14)",
  },
  resumeLabel: {
    color: "#94a3b8",
    fontSize: 12,
    marginBottom: 8,
  },
  resumeValue: {
    fontWeight: 800,
    fontSize: 18,
    color: "#f8fafc",
  },
  actions: {
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 24,
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
  secondaryLink: {
    borderRadius: 14,
    border: "1px solid rgba(148,163,184,0.2)",
    background: "rgba(2,6,23,0.45)",
    color: "#dbeafe",
    fontWeight: 800,
    textDecoration: "none",
    padding: "14px 18px",
  },
};