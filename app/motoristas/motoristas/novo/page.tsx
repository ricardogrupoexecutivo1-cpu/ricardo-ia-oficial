"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type DriverFormState = {
  fotoSelecionada: string;
  nomeCompleto: string;
  tipoCadastro: "CPF" | "CNPJ";
  documento: string;
  dataNascimento: string;
  genero: string;
  telefone: string;
  whatsapp: string;
  email: string;
  loginGoogleHabilitado: boolean;
  statusCadastro: string;
  statusOperacional: string;
  disponibilidade: string;
  categoriaAtendimento: string;
  tipoServicoPrincipal: string;
  empresaLocadora: string;
  clientePrincipal: string;
  cidade: string;
  estado: string;
  enderecoBase: string;
  possuiVeiculoProprio: string;
  veiculoPrincipal: string;
  placaVeiculo: string;
  tipoCobranca: string;
  valorDiaria: string;
  valorHora: string;
  valorKm: string;
  valorFechadoBase: string;
  aceitaAdiantamento: string;
  limiteAdiantamento: string;
  centroReceita: string;
  centroDespesa: string;
  pixFavorecido: string;
  pixChave: string;
  bancoNome: string;
  bancoAgencia: string;
  bancoConta: string;
  controlePorLocadora: boolean;
  controlePorCliente: boolean;
  controlePorServico: boolean;
  controlePorMotorista: boolean;
  observacoesInternas: string;
  observacoesPublicas: string;
  documentosOk: boolean;
  fotoObrigatoriaConfirmada: boolean;
  aceiteTermosOperacionais: boolean;
};

const initialForm: DriverFormState = {
  fotoSelecionada: "",
  nomeCompleto: "",
  tipoCadastro: "CPF",
  documento: "",
  dataNascimento: "",
  genero: "",
  telefone: "",
  whatsapp: "",
  email: "",
  loginGoogleHabilitado: true,
  statusCadastro: "Em análise",
  statusOperacional: "Aguardando aprovação",
  disponibilidade: "Disponível",
  categoriaAtendimento: "Executivo",
  tipoServicoPrincipal: "Diária",
  empresaLocadora: "",
  clientePrincipal: "",
  cidade: "",
  estado: "MG",
  enderecoBase: "",
  possuiVeiculoProprio: "Não",
  veiculoPrincipal: "",
  placaVeiculo: "",
  tipoCobranca: "Diária",
  valorDiaria: "",
  valorHora: "",
  valorKm: "",
  valorFechadoBase: "",
  aceitaAdiantamento: "Sim",
  limiteAdiantamento: "",
  centroReceita: "",
  centroDespesa: "",
  pixFavorecido: "",
  pixChave: "",
  bancoNome: "",
  bancoAgencia: "",
  bancoConta: "",
  controlePorLocadora: true,
  controlePorCliente: true,
  controlePorServico: true,
  controlePorMotorista: true,
  observacoesInternas: "",
  observacoesPublicas: "",
  documentosOk: false,
  fotoObrigatoriaConfirmada: false,
  aceiteTermosOperacionais: false,
};

const metricCards = [
  {
    label: "Foto obrigatória",
    value: "Ativa",
    detail: "Base de confiança visual",
  },
  {
    label: "Controle financeiro",
    value: "4 níveis",
    detail: "Locadora, cliente, serviço e motorista",
  },
  {
    label: "Modelos de serviço",
    value: "4",
    detail: "Diária, hora, km e fechado",
  },
  {
    label: "Auditoria",
    value: "Pronta",
    detail: "Cadastro preparado para rastreio",
  },
];

const robotSuggestions = [
  "Sugerir preenchimento automático com base no perfil do motorista.",
  "Alertar quando foto obrigatória não tiver sido confirmada.",
  "Sinalizar ausência de chave PIX ou dados bancários.",
  "Recomendar tipo de cobrança conforme operação.",
  "Avisar quando cadastro estiver apto para ativação.",
  "Orientar operador sobre campos financeiros essenciais.",
];

function formatCurrencyPreview(value: string) {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "R$ 0,00";
  const number = Number(digits) / 100;
  return number.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function NovoMotoristaPage() {
  const [form, setForm] = useState<DriverFormState>(initialForm);

  const updateField = <K extends keyof DriverFormState>(
    field: K,
    value: DriverFormState[K]
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const progress = useMemo(() => {
    const checks = [
      form.nomeCompleto.trim().length > 0,
      form.documento.trim().length > 0,
      form.telefone.trim().length > 0 || form.whatsapp.trim().length > 0,
      form.email.trim().length > 0,
      form.empresaLocadora.trim().length > 0 || form.clientePrincipal.trim().length > 0,
      form.cidade.trim().length > 0,
      form.tipoCobranca.trim().length > 0,
      form.fotoObrigatoriaConfirmada,
      form.aceiteTermosOperacionais,
    ];

    const total = checks.length;
    const completed = checks.filter(Boolean).length;
    return Math.round((completed / total) * 100);
  }, [form]);

  const resumoFinanceiro = useMemo(() => {
    return {
      diaria: formatCurrencyPreview(form.valorDiaria),
      hora: formatCurrencyPreview(form.valorHora),
      km: formatCurrencyPreview(form.valorKm),
      fechado: formatCurrencyPreview(form.valorFechadoBase),
      adiantamento: formatCurrencyPreview(form.limiteAdiantamento),
    };
  }, [
    form.valorDiaria,
    form.valorHora,
    form.valorKm,
    form.valorFechadoBase,
    form.limiteAdiantamento,
  ]);

  const cadastroApto =
    form.nomeCompleto.trim() &&
    form.documento.trim() &&
    (form.telefone.trim() || form.whatsapp.trim()) &&
    form.email.trim() &&
    form.fotoObrigatoriaConfirmada &&
    form.aceiteTermosOperacionais;

  return (
    <main style={styles.page}>
      <section style={styles.heroSection}>
        <div style={styles.heroGlowLeft} />
        <div style={styles.heroGlowRight} />

        <div style={styles.heroCard}>
          <div style={styles.heroTop}>
            <div style={styles.heroTextBlock}>
              <div style={styles.eyebrow}>AURORA MOTORISTAS • NOVO CADASTRO</div>
              <h1 style={styles.heroTitle}>
                Cadastro completo de motorista com foto obrigatória, operação,
                financeiro e apoio do Robô Aurora
              </h1>
              <p style={styles.heroText}>
                Esta tela prepara o cadastro real do motorista ou da empresa
                prestadora para funcionamento global, com foco em confiança,
                rastreabilidade, flexibilidade comercial e controle financeiro
                impecável por locadora e/ou cliente.
              </p>
            </div>

            <div style={styles.heroActions}>
              <Link href="/motoristas/motoristas" style={styles.secondaryButton}>
                Voltar para motoristas
              </Link>
              <Link href="/motoristas/financeiro" style={styles.primaryButton}>
                Ir para financeiro
              </Link>
            </div>
          </div>

          <div style={styles.noticeBox}>
            O sistema está em constante atualização e pode ter momentos de
            instabilidade durante melhorias. A foto do motorista faz parte da
            base obrigatória do fluxo real.
          </div>
        </div>
      </section>

      <section style={styles.metricsSection}>
        <div style={styles.metricsGrid}>
          {metricCards.map((card) => (
            <article key={card.label} style={styles.metricCard}>
              <span style={styles.metricLabel}>{card.label}</span>
              <strong style={styles.metricValue}>{card.value}</strong>
              <span style={styles.metricDetail}>{card.detail}</span>
            </article>
          ))}
        </div>
      </section>

      <section style={styles.contentSection}>
        <div style={styles.mainGrid}>
          <div style={styles.leftColumn}>
            <div style={styles.panelCard}>
              <div style={styles.sectionHeader}>
                <div>
                  <span style={styles.sectionKicker}>PROGRESSO DO CADASTRO</span>
                  <h2 style={styles.sectionTitle}>Base principal do motorista</h2>
                </div>
                <div style={styles.progressBox}>
                  <span style={styles.progressLabel}>{progress}% concluído</span>
                  <div style={styles.progressTrack}>
                    <div style={{ ...styles.progressFill, width: `${progress}%` }} />
                  </div>
                </div>
              </div>

              <div style={styles.gridTwo}>
                <label style={styles.fieldBlock}>
                  <span style={styles.label}>Foto obrigatória do motorista</span>
                  <div style={styles.fakeUploadCard}>
                    <div style={styles.fakeAvatar}>
                      {form.nomeCompleto ? form.nomeCompleto.slice(0, 1).toUpperCase() : "F"}
                    </div>
                    <div style={styles.fakeUploadContent}>
                      <strong style={styles.fakeUploadTitle}>
                        Área visual para foto obrigatória
                      </strong>
                      <span style={styles.fakeUploadText}>
                        Nesta etapa estamos preparando a interface. No próximo
                        fluxo, vamos conectar upload real e armazenamento.
                      </span>

                      <input
                        type="text"
                        value={form.fotoSelecionada}
                        onChange={(e) => updateField("fotoSelecionada", e.target.value)}
                        placeholder="Ex.: foto-motorista-carlos.jpg"
                        style={styles.input}
                      />
                    </div>
                  </div>

                  <label style={styles.checkboxRow}>
                    <input
                      type="checkbox"
                      checked={form.fotoObrigatoriaConfirmada}
                      onChange={(e) =>
                        updateField("fotoObrigatoriaConfirmada", e.target.checked)
                      }
                    />
                    <span>Confirmo que a foto obrigatória foi recebida ou será exigida.</span>
                  </label>
                </label>

                <div style={styles.previewCard}>
                  <span style={styles.previewKicker}>STATUS DO CADASTRO</span>
                  <h3 style={styles.previewTitle}>
                    {form.nomeCompleto || "Novo motorista em preparação"}
                  </h3>

                  <div style={styles.previewGrid}>
                    <div style={styles.previewItem}>
                      <span style={styles.previewLabel}>Tipo</span>
                      <strong style={styles.previewValue}>{form.tipoCadastro}</strong>
                    </div>
                    <div style={styles.previewItem}>
                      <span style={styles.previewLabel}>Documento</span>
                      <strong style={styles.previewValue}>
                        {form.documento || "Não informado"}
                      </strong>
                    </div>
                    <div style={styles.previewItem}>
                      <span style={styles.previewLabel}>Operação</span>
                      <strong style={styles.previewValue}>{form.tipoServicoPrincipal}</strong>
                    </div>
                    <div style={styles.previewItem}>
                      <span style={styles.previewLabel}>Cobrança</span>
                      <strong style={styles.previewValue}>{form.tipoCobranca}</strong>
                    </div>
                    <div style={styles.previewItem}>
                      <span style={styles.previewLabel}>Locadora</span>
                      <strong style={styles.previewValue}>
                        {form.empresaLocadora || "Não informada"}
                      </strong>
                    </div>
                    <div style={styles.previewItem}>
                      <span style={styles.previewLabel}>Cliente</span>
                      <strong style={styles.previewValue}>
                        {form.clientePrincipal || "Não informado"}
                      </strong>
                    </div>
                  </div>

                  <div
                    style={{
                      ...styles.readyBadge,
                      ...(cadastroApto ? styles.readyBadgeSuccess : styles.readyBadgePending),
                    }}
                  >
                    {cadastroApto
                      ? "Cadastro com base mínima pronta para ativação"
                      : "Cadastro ainda depende de campos obrigatórios"}
                  </div>
                </div>
              </div>
            </div>

            <div style={styles.panelCard}>
              <div style={styles.sectionHeader}>
                <div>
                  <span style={styles.sectionKicker}>IDENTIFICAÇÃO PRINCIPAL</span>
                  <h2 style={styles.sectionTitle}>Dados do motorista ou empresa</h2>
                </div>
              </div>

              <div style={styles.formGrid}>
                <label style={styles.fieldBlock}>
                  <span style={styles.label}>Nome completo / razão social</span>
                  <input
                    type="text"
                    value={form.nomeCompleto}
                    onChange={(e) => updateField("nomeCompleto", e.target.value)}
                    placeholder="Ex.: Carlos Henrique Almeida"
                    style={styles.input}
                  />
                </label>

                <label style={styles.fieldBlock}>
                  <span style={styles.label}>Tipo de cadastro</span>
                  <select
                    value={form.tipoCadastro}
                    onChange={(e) =>
                      updateField("tipoCadastro", e.target.value as "CPF" | "CNPJ")
                    }
                    style={styles.select}
                  >
                    <option value="CPF">CPF</option>
                    <option value="CNPJ">CNPJ</option>
                  </select>
                </label>

                <label style={styles.fieldBlock}>
                  <span style={styles.label}>
                    {form.tipoCadastro === "CPF" ? "CPF" : "CNPJ"}
                  </span>
                  <input
                    type="text"
                    value={form.documento}
                    onChange={(e) => updateField("documento", e.target.value)}
                    placeholder={
                      form.tipoCadastro === "CPF"
                        ? "Ex.: 000.000.000-00"
                        : "Ex.: 00.000.000/0001-00"
                    }
                    style={styles.input}
                  />
                </label>

                <label style={styles.fieldBlock}>
                  <span style={styles.label}>Data de nascimento / abertura</span>
                  <input
                    type="date"
                    value={form.dataNascimento}
                    onChange={(e) => updateField("dataNascimento", e.target.value)}
                    style={styles.input}
                  />
                </label>

                <label style={styles.fieldBlock}>
                  <span style={styles.label}>Gênero / classificação</span>
                  <input
                    type="text"
                    value={form.genero}
                    onChange={(e) => updateField("genero", e.target.value)}
                    placeholder="Ex.: Masculino, Feminino, Empresa, Outro"
                    style={styles.input}
                  />
                </label>

                <label style={styles.fieldBlock}>
                  <span style={styles.label}>Status do cadastro</span>
                  <select
                    value={form.statusCadastro}
                    onChange={(e) => updateField("statusCadastro", e.target.value)}
                    style={styles.select}
                  >
                    <option>Em análise</option>
                    <option>Ativo</option>
                    <option>Bloqueado</option>
                    <option>Pendente documental</option>
                  </select>
                </label>
              </div>
            </div>

            <div style={styles.panelCard}>
              <div style={styles.sectionHeader}>
                <div>
                  <span style={styles.sectionKicker}>CONTATO E ACESSO</span>
                  <h2 style={styles.sectionTitle}>Telefone, e-mail e login</h2>
                </div>
              </div>

              <div style={styles.formGrid}>
                <label style={styles.fieldBlock}>
                  <span style={styles.label}>Telefone</span>
                  <input
                    type="text"
                    value={form.telefone}
                    onChange={(e) => updateField("telefone", e.target.value)}
                    placeholder="Ex.: (31) 99999-9999"
                    style={styles.input}
                  />
                </label>

                <label style={styles.fieldBlock}>
                  <span style={styles.label}>WhatsApp</span>
                  <input
                    type="text"
                    value={form.whatsapp}
                    onChange={(e) => updateField("whatsapp", e.target.value)}
                    placeholder="Ex.: (31) 99999-9999"
                    style={styles.input}
                  />
                </label>

                <label style={styles.fieldBlock}>
                  <span style={styles.label}>E-mail</span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="Ex.: motorista@empresa.com"
                    style={styles.input}
                  />
                </label>

                <label style={styles.fieldBlock}>
                  <span style={styles.label}>Login Google habilitado</span>
                  <select
                    value={form.loginGoogleHabilitado ? "Sim" : "Não"}
                    onChange={(e) =>
                      updateField("loginGoogleHabilitado", e.target.value === "Sim")
                    }
                    style={styles.select}
                  >
                    <option>Sim</option>
                    <option>Não</option>
                  </select>
                </label>
              </div>
            </div>

            <div style={styles.panelCard}>
              <div style={styles.sectionHeader}>
                <div>
                  <span style={styles.sectionKicker}>OPERAÇÃO</span>
                  <h2 style={styles.sectionTitle}>Vínculo, disponibilidade e serviço</h2>
                </div>
              </div>

              <div style={styles.formGrid}>
                <label style={styles.fieldBlock}>
                  <span style={styles.label}>Status operacional</span>
                  <select
                    value={form.statusOperacional}
                    onChange={(e) => updateField("statusOperacional", e.target.value)}
                    style={styles.select}
                  >
                    <option>Aguardando aprovação</option>
                    <option>Disponível</option>
                    <option>Em serviço</option>
                    <option>Indisponível</option>
                    <option>Bloqueado</option>
                  </select>
                </label>

                <label style={styles.fieldBlock}>
                  <span style={styles.label}>Disponibilidade</span>
                  <select
                    value={form.disponibilidade}
                    onChange={(e) => updateField("disponibilidade", e.target.value)}
                    style={styles.select}
                  >
                    <option>Disponível</option>
                    <option>Parcial</option>
                    <option>Em serviço</option>
                    <option>Somente agendado</option>
                  </select>
                </label>

                <label style={styles.fieldBlock}>
                  <span style={styles.label}>Categoria de atendimento</span>
                  <input
                    type="text"
                    value={form.categoriaAtendimento}
                    onChange={(e) => updateField("categoriaAtendimento", e.target.value)}
                    placeholder="Ex.: Executivo, Van, Apoio, Particular, Logística"
                    style={styles.input}
                  />
                </label>

                <label style={styles.fieldBlock}>
                  <span style={styles.label}>Tipo de serviço principal</span>
                  <select
                    value={form.tipoServicoPrincipal}
                    onChange={(e) => updateField("tipoServicoPrincipal", e.target.value)}
                    style={styles.select}
                  >
                    <option>Diária</option>
                    <option>Hora</option>
                    <option>KM</option>
                    <option>Fechado</option>
                    <option>Misto</option>
                  </select>
                </label>

                <label style={styles.fieldBlock}>
                  <span style={styles.label}>Locadora / empresa vinculada</span>
                  <input
                    type="text"
                    value={form.empresaLocadora}
                    onChange={(e) => updateField("empresaLocadora", e.target.value)}
                    placeholder="Ex.: Aurora Locadoras Premium"
                    style={styles.input}
                  />
                </label>

                <label style={styles.fieldBlock}>
                  <span style={styles.label}>Cliente principal</span>
                  <input
                    type="text"
                    value={form.clientePrincipal}
                    onChange={(e) => updateField("clientePrincipal", e.target.value)}
                    placeholder="Ex.: Operação Aeroporto / Cliente VIP"
                    style={styles.input}
                  />
                </label>

                <label style={styles.fieldBlock}>
                  <span style={styles.label}>Cidade base</span>
                  <input
                    type="text"
                    value={form.cidade}
                    onChange={(e) => updateField("cidade", e.target.value)}
                    placeholder="Ex.: Belo Horizonte"
                    style={styles.input}
                  />
                </label>

                <label style={styles.fieldBlock}>
                  <span style={styles.label}>Estado</span>
                  <input
                    type="text"
                    value={form.estado}
                    onChange={(e) => updateField("estado", e.target.value)}
                    placeholder="Ex.: MG"
                    style={styles.input}
                  />
                </label>

                <label style={{ ...styles.fieldBlock, gridColumn: "1 / -1" }}>
                  <span style={styles.label}>Endereço base / ponto de apoio</span>
                  <input
                    type="text"
                    value={form.enderecoBase}
                    onChange={(e) => updateField("enderecoBase", e.target.value)}
                    placeholder="Ex.: Av. principal, bairro, referência ou ponto operacional"
                    style={styles.input}
                  />
                </label>
              </div>
            </div>

            <div style={styles.panelCard}>
              <div style={styles.sectionHeader}>
                <div>
                  <span style={styles.sectionKicker}>VEÍCULO E APOIO</span>
                  <h2 style={styles.sectionTitle}>Informações complementares</h2>
                </div>
              </div>

              <div style={styles.formGrid}>
                <label style={styles.fieldBlock}>
                  <span style={styles.label}>Possui veículo próprio?</span>
                  <select
                    value={form.possuiVeiculoProprio}
                    onChange={(e) => updateField("possuiVeiculoProprio", e.target.value)}
                    style={styles.select}
                  >
                    <option>Não</option>
                    <option>Sim</option>
                    <option>Parcial</option>
                  </select>
                </label>

                <label style={styles.fieldBlock}>
                  <span style={styles.label}>Veículo principal</span>
                  <input
                    type="text"
                    value={form.veiculoPrincipal}
                    onChange={(e) => updateField("veiculoPrincipal", e.target.value)}
                    placeholder="Ex.: Corolla 2023 / Van Sprinter / Moto / Apoio"
                    style={styles.input}
                  />
                </label>

                <label style={styles.fieldBlock}>
                  <span style={styles.label}>Placa</span>
                  <input
                    type="text"
                    value={form.placaVeiculo}
                    onChange={(e) => updateField("placaVeiculo", e.target.value)}
                    placeholder="Ex.: ABC1D23"
                    style={styles.input}
                  />
                </label>

                <label style={styles.fieldBlock}>
                  <span style={styles.label}>Documentação conferida</span>
                  <select
                    value={form.documentosOk ? "Sim" : "Não"}
                    onChange={(e) => updateField("documentosOk", e.target.value === "Sim")}
                    style={styles.select}
                  >
                    <option>Não</option>
                    <option>Sim</option>
                  </select>
                </label>
              </div>
            </div>

            <div style={styles.panelCard}>
              <div style={styles.sectionHeader}>
                <div>
                  <span style={styles.sectionKicker}>FINANCEIRO OPERACIONAL</span>
                  <h2 style={styles.sectionTitle}>Cobrança, receita e repasse</h2>
                </div>
              </div>

              <div style={styles.formGrid}>
                <label style={styles.fieldBlock}>
                  <span style={styles.label}>Tipo de cobrança principal</span>
                  <select
                    value={form.tipoCobranca}
                    onChange={(e) => updateField("tipoCobranca", e.target.value)}
                    style={styles.select}
                  >
                    <option>Diária</option>
                    <option>Hora</option>
                    <option>KM</option>
                    <option>Fechado</option>
                    <option>Misto</option>
                  </select>
                </label>

                <label style={styles.fieldBlock}>
                  <span style={styles.label}>Valor por diária</span>
                  <input
                    type="text"
                    value={form.valorDiaria}
                    onChange={(e) => updateField("valorDiaria", e.target.value)}
                    placeholder="Ex.: 35000 para R$ 350,00"
                    style={styles.input}
                  />
                </label>

                <label style={styles.fieldBlock}>
                  <span style={styles.label}>Valor por hora</span>
                  <input
                    type="text"
                    value={form.valorHora}
                    onChange={(e) => updateField("valorHora", e.target.value)}
                    placeholder="Ex.: 8000 para R$ 80,00"
                    style={styles.input}
                  />
                </label>

                <label style={styles.fieldBlock}>
                  <span style={styles.label}>Valor por KM</span>
                  <input
                    type="text"
                    value={form.valorKm}
                    onChange={(e) => updateField("valorKm", e.target.value)}
                    placeholder="Ex.: 350 para R$ 3,50"
                    style={styles.input}
                  />
                </label>

                <label style={styles.fieldBlock}>
                  <span style={styles.label}>Valor fechado base</span>
                  <input
                    type="text"
                    value={form.valorFechadoBase}
                    onChange={(e) => updateField("valorFechadoBase", e.target.value)}
                    placeholder="Ex.: 120000 para R$ 1.200,00"
                    style={styles.input}
                  />
                </label>

                <label style={styles.fieldBlock}>
                  <span style={styles.label}>Aceita adiantamento?</span>
                  <select
                    value={form.aceitaAdiantamento}
                    onChange={(e) => updateField("aceitaAdiantamento", e.target.value)}
                    style={styles.select}
                  >
                    <option>Sim</option>
                    <option>Não</option>
                    <option>Somente autorizado</option>
                  </select>
                </label>

                <label style={styles.fieldBlock}>
                  <span style={styles.label}>Limite de adiantamento</span>
                  <input
                    type="text"
                    value={form.limiteAdiantamento}
                    onChange={(e) => updateField("limiteAdiantamento", e.target.value)}
                    placeholder="Ex.: 30000 para R$ 300,00"
                    style={styles.input}
                  />
                </label>

                <label style={styles.fieldBlock}>
                  <span style={styles.label}>Centro de receita</span>
                  <input
                    type="text"
                    value={form.centroReceita}
                    onChange={(e) => updateField("centroReceita", e.target.value)}
                    placeholder="Ex.: Serviços VIP / Operações aeroporto"
                    style={styles.input}
                  />
                </label>

                <label style={styles.fieldBlock}>
                  <span style={styles.label}>Centro de despesa</span>
                  <input
                    type="text"
                    value={form.centroDespesa}
                    onChange={(e) => updateField("centroDespesa", e.target.value)}
                    placeholder="Ex.: Motoristas externos / Apoio operacional"
                    style={styles.input}
                  />
                </label>
              </div>

              <div style={styles.checkboxGrid}>
                <label style={styles.checkboxCard}>
                  <input
                    type="checkbox"
                    checked={form.controlePorLocadora}
                    onChange={(e) => updateField("controlePorLocadora", e.target.checked)}
                  />
                  <span>Controlar receita e despesa por locadora</span>
                </label>

                <label style={styles.checkboxCard}>
                  <input
                    type="checkbox"
                    checked={form.controlePorCliente}
                    onChange={(e) => updateField("controlePorCliente", e.target.checked)}
                  />
                  <span>Controlar receita e despesa por cliente</span>
                </label>

                <label style={styles.checkboxCard}>
                  <input
                    type="checkbox"
                    checked={form.controlePorServico}
                    onChange={(e) => updateField("controlePorServico", e.target.checked)}
                  />
                  <span>Controlar receita e despesa por serviço</span>
                </label>

                <label style={styles.checkboxCard}>
                  <input
                    type="checkbox"
                    checked={form.controlePorMotorista}
                    onChange={(e) => updateField("controlePorMotorista", e.target.checked)}
                  />
                  <span>Controlar resultado individual do motorista</span>
                </label>
              </div>
            </div>

            <div style={styles.panelCard}>
              <div style={styles.sectionHeader}>
                <div>
                  <span style={styles.sectionKicker}>RECEBIMENTO</span>
                  <h2 style={styles.sectionTitle}>PIX e dados bancários</h2>
                </div>
              </div>

              <div style={styles.formGrid}>
                <label style={styles.fieldBlock}>
                  <span style={styles.label}>Favorecido PIX</span>
                  <input
                    type="text"
                    value={form.pixFavorecido}
                    onChange={(e) => updateField("pixFavorecido", e.target.value)}
                    placeholder="Ex.: Carlos Henrique Almeida"
                    style={styles.input}
                  />
                </label>

                <label style={styles.fieldBlock}>
                  <span style={styles.label}>Chave PIX</span>
                  <input
                    type="text"
                    value={form.pixChave}
                    onChange={(e) => updateField("pixChave", e.target.value)}
                    placeholder="Ex.: telefone, e-mail, CPF ou chave aleatória"
                    style={styles.input}
                  />
                </label>

                <label style={styles.fieldBlock}>
                  <span style={styles.label}>Banco</span>
                  <input
                    type="text"
                    value={form.bancoNome}
                    onChange={(e) => updateField("bancoNome", e.target.value)}
                    placeholder="Ex.: Caixa, Itaú, Bradesco, Inter"
                    style={styles.input}
                  />
                </label>

                <label style={styles.fieldBlock}>
                  <span style={styles.label}>Agência</span>
                  <input
                    type="text"
                    value={form.bancoAgencia}
                    onChange={(e) => updateField("bancoAgencia", e.target.value)}
                    placeholder="Ex.: 1234"
                    style={styles.input}
                  />
                </label>

                <label style={styles.fieldBlock}>
                  <span style={styles.label}>Conta</span>
                  <input
                    type="text"
                    value={form.bancoConta}
                    onChange={(e) => updateField("bancoConta", e.target.value)}
                    placeholder="Ex.: 12345-6"
                    style={styles.input}
                  />
                </label>
              </div>
            </div>

            <div style={styles.panelCard}>
              <div style={styles.sectionHeader}>
                <div>
                  <span style={styles.sectionKicker}>OBSERVAÇÕES E REGRAS</span>
                  <h2 style={styles.sectionTitle}>Notas internas e confirmação</h2>
                </div>
              </div>

              <div style={styles.formGrid}>
                <label style={{ ...styles.fieldBlock, gridColumn: "1 / -1" }}>
                  <span style={styles.label}>Observações internas</span>
                  <textarea
                    value={form.observacoesInternas}
                    onChange={(e) => updateField("observacoesInternas", e.target.value)}
                    placeholder="Ex.: preferências de serviço, regras específicas, atenção com horários, perfil comportamental e anotações internas."
                    style={styles.textarea}
                  />
                </label>

                <label style={{ ...styles.fieldBlock, gridColumn: "1 / -1" }}>
                  <span style={styles.label}>Observações públicas controladas</span>
                  <textarea
                    value={form.observacoesPublicas}
                    onChange={(e) => updateField("observacoesPublicas", e.target.value)}
                    placeholder="Ex.: descrição segura e publicável do perfil profissional."
                    style={styles.textarea}
                  />
                </label>
              </div>

              <div style={styles.checkboxGrid}>
                <label style={styles.checkboxCard}>
                  <input
                    type="checkbox"
                    checked={form.aceiteTermosOperacionais}
                    onChange={(e) =>
                      updateField("aceiteTermosOperacionais", e.target.checked)
                    }
                  />
                  <span>
                    Confirmo aceite das regras operacionais, financeiras e de uso interno.
                  </span>
                </label>

                <label style={styles.checkboxCard}>
                  <input
                    type="checkbox"
                    checked={form.documentosOk}
                    onChange={(e) => updateField("documentosOk", e.target.checked)}
                  />
                  <span>Documentação conferida ou pendência registrada no fluxo.</span>
                </label>
              </div>

              <div style={styles.formActionRow}>
                <button type="button" style={styles.primaryActionButton}>
                  Salvar cadastro do motorista
                </button>

                <button
                  type="button"
                  style={styles.secondaryActionButton}
                  onClick={() => setForm(initialForm)}
                >
                  Limpar formulário
                </button>
              </div>
            </div>
          </div>

          <aside style={styles.rightColumn}>
            <div style={styles.sidebarCard}>
              <span style={styles.sectionKicker}>RESUMO FINANCEIRO</span>
              <h2 style={styles.sidebarTitle}>Prévia da cobrança</h2>

              <div style={styles.summaryGrid}>
                <div style={styles.summaryItem}>
                  <span style={styles.summaryLabel}>Diária</span>
                  <strong style={styles.summaryValue}>{resumoFinanceiro.diaria}</strong>
                </div>
                <div style={styles.summaryItem}>
                  <span style={styles.summaryLabel}>Hora</span>
                  <strong style={styles.summaryValue}>{resumoFinanceiro.hora}</strong>
                </div>
                <div style={styles.summaryItem}>
                  <span style={styles.summaryLabel}>KM</span>
                  <strong style={styles.summaryValue}>{resumoFinanceiro.km}</strong>
                </div>
                <div style={styles.summaryItem}>
                  <span style={styles.summaryLabel}>Fechado</span>
                  <strong style={styles.summaryValue}>{resumoFinanceiro.fechado}</strong>
                </div>
                <div style={styles.summaryItemWide}>
                  <span style={styles.summaryLabel}>Limite adiantamento</span>
                  <strong style={styles.summaryValue}>{resumoFinanceiro.adiantamento}</strong>
                </div>
              </div>
            </div>

            <div style={styles.sidebarCard}>
              <span style={styles.sectionKicker}>VALIDAÇÃO ESSENCIAL</span>
              <h2 style={styles.sidebarTitle}>Checklist do cadastro</h2>

              <ul style={styles.checkList}>
                <li style={styles.checkItem}>
                  {form.nomeCompleto.trim() ? "✅" : "⬜"} Nome / razão social
                </li>
                <li style={styles.checkItem}>
                  {form.documento.trim() ? "✅" : "⬜"} CPF ou CNPJ
                </li>
                <li style={styles.checkItem}>
                  {form.email.trim() ? "✅" : "⬜"} E-mail
                </li>
                <li style={styles.checkItem}>
                  {form.telefone.trim() || form.whatsapp.trim() ? "✅" : "⬜"} Telefone ou WhatsApp
                </li>
                <li style={styles.checkItem}>
                  {form.fotoObrigatoriaConfirmada ? "✅" : "⬜"} Foto obrigatória confirmada
                </li>
                <li style={styles.checkItem}>
                  {form.aceiteTermosOperacionais ? "✅" : "⬜"} Aceite operacional
                </li>
              </ul>
            </div>

            <div style={styles.sidebarCardDark}>
              <div style={styles.robotTag}>ROBÔ AURORA</div>
              <h2 style={styles.sidebarTitleDark}>Apoio inteligente ao operador</h2>
              <p style={styles.sidebarTextDark}>
                Esta área será usada pelo Robô Aurora para interpretar dados do
                cadastro, apontar pendências, sugerir modelos de cobrança, rotas
                e decisões operacionais.
              </p>

              <div style={styles.robotSuggestionList}>
                {robotSuggestions.map((item) => (
                  <div key={item} style={styles.robotSuggestionItem}>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.sidebarCard}>
              <span style={styles.sectionKicker}>NAVEGAÇÃO</span>
              <h2 style={styles.sidebarTitle}>Próximos blocos do sistema</h2>

              <div style={styles.navList}>
                <Link href="/motoristas/servicos" style={styles.navItem}>
                  Abrir serviços
                </Link>
                <Link href="/motoristas/financeiro" style={styles.navItem}>
                  Abrir financeiro
                </Link>
                <Link href="/motoristas/robo-aurora" style={styles.navItem}>
                  Abrir Robô Aurora
                </Link>
                <Link href="/motoristas/motoristas" style={styles.navItem}>
                  Voltar para listagem
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #eef6ff 0%, #f8fbff 36%, #ffffff 100%)",
    color: "#0f172a",
    paddingBottom: 56,
  },

  heroSection: {
    position: "relative",
    overflow: "hidden",
    padding: "34px 20px 16px",
  },

  heroGlowLeft: {
    position: "absolute",
    top: -120,
    left: -100,
    width: 260,
    height: 260,
    borderRadius: "50%",
    background: "rgba(14, 165, 233, 0.16)",
    filter: "blur(42px)",
    pointerEvents: "none",
  },

  heroGlowRight: {
    position: "absolute",
    top: -100,
    right: -100,
    width: 260,
    height: 260,
    borderRadius: "50%",
    background: "rgba(37, 99, 235, 0.16)",
    filter: "blur(44px)",
    pointerEvents: "none",
  },

  heroCard: {
    position: "relative",
    maxWidth: 1280,
    margin: "0 auto",
    background: "rgba(255,255,255,0.86)",
    border: "1px solid rgba(148, 163, 184, 0.22)",
    borderRadius: 28,
    padding: "28px 22px",
    boxShadow: "0 22px 60px rgba(15, 23, 42, 0.08)",
    backdropFilter: "blur(10px)",
  },

  heroTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: 18,
    flexWrap: "wrap",
    alignItems: "flex-start",
  },

  heroTextBlock: {
    maxWidth: 900,
  },

  eyebrow: {
    display: "inline-flex",
    alignItems: "center",
    minHeight: 30,
    padding: "0 14px",
    borderRadius: 999,
    background: "rgba(2, 132, 199, 0.10)",
    color: "#0369a1",
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: "0.08em",
    marginBottom: 16,
  },

  heroTitle: {
    margin: 0,
    fontSize: "clamp(1.9rem, 3.5vw, 3.4rem)",
    lineHeight: 1.06,
    fontWeight: 900,
    letterSpacing: "-0.04em",
    maxWidth: 920,
  },

  heroText: {
    marginTop: 16,
    marginBottom: 0,
    maxWidth: 920,
    color: "#475569",
    fontSize: 16,
    lineHeight: 1.8,
  },

  heroActions: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    minWidth: 220,
  },

  primaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
    padding: "0 18px",
    borderRadius: 16,
    textDecoration: "none",
    fontWeight: 800,
    color: "#ffffff",
    background: "linear-gradient(135deg, #0284c7 0%, #2563eb 100%)",
    boxShadow: "0 14px 30px rgba(37, 99, 235, 0.22)",
  },

  secondaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
    padding: "0 18px",
    borderRadius: 16,
    textDecoration: "none",
    fontWeight: 800,
    color: "#0f172a",
    background: "#ffffff",
    border: "1px solid rgba(148, 163, 184, 0.28)",
  },

  noticeBox: {
    marginTop: 20,
    padding: "14px 16px",
    borderRadius: 16,
    background: "rgba(14, 165, 233, 0.08)",
    border: "1px solid rgba(14, 165, 233, 0.18)",
    color: "#0f172a",
    lineHeight: 1.7,
    fontSize: 14,
    fontWeight: 600,
  },

  metricsSection: {
    maxWidth: 1280,
    margin: "0 auto",
    padding: "8px 20px 4px",
  },

  metricsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 14,
  },

  metricCard: {
    background: "#ffffff",
    borderRadius: 22,
    border: "1px solid rgba(148, 163, 184, 0.18)",
    padding: 18,
    boxShadow: "0 10px 28px rgba(15, 23, 42, 0.05)",
  },

  metricLabel: {
    display: "block",
    color: "#475569",
    fontSize: 14,
    fontWeight: 700,
  },

  metricValue: {
    display: "block",
    marginTop: 8,
    fontSize: 30,
    lineHeight: 1,
    fontWeight: 900,
    letterSpacing: "-0.04em",
  },

  metricDetail: {
    display: "block",
    marginTop: 8,
    color: "#0284c7",
    fontSize: 13,
    fontWeight: 700,
  },

  contentSection: {
    maxWidth: 1280,
    margin: "0 auto",
    padding: "16px 20px 0",
  },

  mainGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.6fr) minmax(320px, 0.85fr)",
    gap: 18,
  },

  leftColumn: {
    display: "flex",
    flexDirection: "column",
    gap: 18,
    minWidth: 0,
  },

  rightColumn: {
    display: "flex",
    flexDirection: "column",
    gap: 18,
    minWidth: 0,
  },

  panelCard: {
    background: "#ffffff",
    borderRadius: 24,
    border: "1px solid rgba(148, 163, 184, 0.18)",
    padding: 22,
    boxShadow: "0 12px 34px rgba(15, 23, 42, 0.05)",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 18,
    flexWrap: "wrap",
  },

  sectionKicker: {
    display: "inline-block",
    marginBottom: 8,
    color: "#0284c7",
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: "0.08em",
  },

  sectionTitle: {
    margin: 0,
    fontSize: 26,
    lineHeight: 1.08,
    fontWeight: 900,
    letterSpacing: "-0.03em",
  },

  progressBox: {
    minWidth: 220,
  },

  progressLabel: {
    display: "block",
    marginBottom: 8,
    color: "#0f172a",
    fontSize: 13,
    fontWeight: 800,
  },

  progressTrack: {
    width: "100%",
    height: 10,
    borderRadius: 999,
    background: "#e2e8f0",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: 999,
    background: "linear-gradient(135deg, #0284c7 0%, #2563eb 100%)",
  },

  gridTwo: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.2fr) minmax(260px, 0.9fr)",
    gap: 16,
  },

  fieldBlock: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },

  label: {
    color: "#0f172a",
    fontSize: 14,
    fontWeight: 800,
  },

  input: {
    width: "100%",
    minHeight: 48,
    borderRadius: 14,
    border: "1px solid rgba(148, 163, 184, 0.28)",
    padding: "0 14px",
    fontSize: 15,
    color: "#0f172a",
    background: "#ffffff",
    outline: "none",
  },

  select: {
    width: "100%",
    minHeight: 48,
    borderRadius: 14,
    border: "1px solid rgba(148, 163, 184, 0.28)",
    padding: "0 14px",
    fontSize: 15,
    color: "#0f172a",
    background: "#ffffff",
    outline: "none",
  },

  textarea: {
    width: "100%",
    minHeight: 140,
    borderRadius: 16,
    border: "1px solid rgba(148, 163, 184, 0.28)",
    padding: "14px",
    fontSize: 15,
    color: "#0f172a",
    background: "#ffffff",
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit",
  },

  fakeUploadCard: {
    display: "flex",
    gap: 14,
    alignItems: "flex-start",
    padding: 16,
    borderRadius: 20,
    background: "linear-gradient(180deg, #f8fbff 0%, #ffffff 100%)",
    border: "1px solid rgba(148, 163, 184, 0.16)",
  },

  fakeAvatar: {
    width: 72,
    height: 72,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #0284c7 0%, #2563eb 100%)",
    color: "#ffffff",
    fontWeight: 900,
    fontSize: 28,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    boxShadow: "0 14px 30px rgba(37, 99, 235, 0.22)",
  },

  fakeUploadContent: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    flex: 1,
    minWidth: 0,
  },

  fakeUploadTitle: {
    fontSize: 16,
    fontWeight: 850,
    color: "#0f172a",
  },

  fakeUploadText: {
    color: "#475569",
    lineHeight: 1.65,
    fontSize: 14,
  },

  checkboxRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginTop: 12,
    color: "#0f172a",
    fontSize: 14,
    lineHeight: 1.5,
    fontWeight: 700,
  },

  previewCard: {
    borderRadius: 22,
    padding: 18,
    background: "linear-gradient(135deg, #082f49 0%, #0f172a 58%, #172554 100%)",
    color: "#e2e8f0",
    boxShadow: "0 20px 50px rgba(2, 6, 23, 0.24)",
  },

  previewKicker: {
    display: "inline-block",
    marginBottom: 10,
    color: "#7dd3fc",
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: "0.08em",
  },

  previewTitle: {
    margin: 0,
    fontSize: 22,
    lineHeight: 1.1,
    fontWeight: 900,
    color: "#ffffff",
  },

  previewGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
    marginTop: 16,
  },

  previewItem: {
    borderRadius: 14,
    padding: 12,
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(125, 211, 252, 0.14)",
  },

  previewLabel: {
    display: "block",
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: "#93c5fd",
  },

  previewValue: {
    display: "block",
    marginTop: 6,
    fontSize: 14,
    lineHeight: 1.5,
    fontWeight: 800,
    color: "#ffffff",
  },

  readyBadge: {
    marginTop: 16,
    borderRadius: 14,
    padding: "12px 14px",
    fontSize: 13,
    fontWeight: 800,
    lineHeight: 1.5,
  },

  readyBadgeSuccess: {
    background: "rgba(16, 185, 129, 0.14)",
    border: "1px solid rgba(16, 185, 129, 0.22)",
    color: "#d1fae5",
  },

  readyBadgePending: {
    background: "rgba(245, 158, 11, 0.14)",
    border: "1px solid rgba(245, 158, 11, 0.22)",
    color: "#fef3c7",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
    gap: 14,
  },

  checkboxGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 12,
    marginTop: 16,
  },

  checkboxCard: {
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    padding: 14,
    borderRadius: 16,
    background: "linear-gradient(180deg, #f8fbff 0%, #ffffff 100%)",
    border: "1px solid rgba(148, 163, 184, 0.16)",
    color: "#0f172a",
    fontSize: 14,
    fontWeight: 700,
    lineHeight: 1.6,
  },

  formActionRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 18,
  },

  primaryActionButton: {
    minHeight: 50,
    padding: "0 20px",
    borderRadius: 16,
    border: "none",
    fontWeight: 800,
    fontSize: 15,
    color: "#ffffff",
    background: "linear-gradient(135deg, #0284c7 0%, #2563eb 100%)",
    boxShadow: "0 14px 30px rgba(37, 99, 235, 0.22)",
    cursor: "pointer",
  },

  secondaryActionButton: {
    minHeight: 50,
    padding: "0 20px",
    borderRadius: 16,
    border: "1px solid rgba(148, 163, 184, 0.28)",
    fontWeight: 800,
    fontSize: 15,
    color: "#0f172a",
    background: "#ffffff",
    cursor: "pointer",
  },

  sidebarCard: {
    background: "#ffffff",
    borderRadius: 24,
    border: "1px solid rgba(148, 163, 184, 0.18)",
    padding: 20,
    boxShadow: "0 12px 34px rgba(15, 23, 42, 0.05)",
  },

  sidebarCardDark: {
    background: "linear-gradient(135deg, #082f49 0%, #0f172a 58%, #172554 100%)",
    borderRadius: 24,
    padding: 20,
    boxShadow: "0 20px 50px rgba(2, 6, 23, 0.24)",
  },

  sidebarTitle: {
    margin: 0,
    fontSize: 24,
    lineHeight: 1.08,
    fontWeight: 900,
    letterSpacing: "-0.03em",
    color: "#0f172a",
  },

  sidebarTitleDark: {
    margin: 0,
    fontSize: 24,
    lineHeight: 1.08,
    fontWeight: 900,
    letterSpacing: "-0.03em",
    color: "#ffffff",
  },

  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
    marginTop: 16,
  },

  summaryItem: {
    padding: 14,
    borderRadius: 16,
    background: "linear-gradient(180deg, #f8fbff 0%, #ffffff 100%)",
    border: "1px solid rgba(148, 163, 184, 0.16)",
  },

  summaryItemWide: {
    gridColumn: "1 / -1",
    padding: 14,
    borderRadius: 16,
    background: "linear-gradient(180deg, #f8fbff 0%, #ffffff 100%)",
    border: "1px solid rgba(148, 163, 184, 0.16)",
  },

  summaryLabel: {
    display: "block",
    color: "#64748b",
    fontSize: 12,
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },

  summaryValue: {
    display: "block",
    marginTop: 8,
    color: "#0f172a",
    fontSize: 18,
    lineHeight: 1.2,
    fontWeight: 900,
  },

  checkList: {
    margin: "16px 0 0",
    paddingLeft: 18,
    color: "#0f172a",
  },

  checkItem: {
    marginBottom: 10,
    lineHeight: 1.7,
    fontSize: 14,
    fontWeight: 700,
  },

  robotTag: {
    display: "inline-block",
    marginBottom: 10,
    color: "#7dd3fc",
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: "0.08em",
  },

  sidebarTextDark: {
    marginTop: 12,
    marginBottom: 0,
    color: "#cbd5e1",
    lineHeight: 1.75,
    fontSize: 15,
  },

  robotSuggestionList: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginTop: 16,
  },

  robotSuggestionItem: {
    padding: "12px 14px",
    borderRadius: 14,
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(125, 211, 252, 0.16)",
    color: "#e2e8f0",
    fontSize: 13,
    fontWeight: 700,
    lineHeight: 1.55,
  },

  navList: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginTop: 16,
  },

  navItem: {
    display: "block",
    textDecoration: "none",
    color: "#0f172a",
    fontWeight: 800,
    padding: "12px 14px",
    borderRadius: 14,
    background: "linear-gradient(180deg, #f8fbff 0%, #ffffff 100%)",
    border: "1px solid rgba(148, 163, 184, 0.16)",
  },
};