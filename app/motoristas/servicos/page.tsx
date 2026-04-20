"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type ServiceFormState = {
  cliente: string;
  locadora: string;
  motorista: string;
  tipoServico: string;
  statusServico: string;
  origem: string;
  destino: string;
  distanciaKm: string;
  valorKmCliente: string;
  valorKmReduzido: string;
  usarValorKmReduzido: boolean;
  valorBaseServico: string;
  pedagio: string;
  combustivel: string;
  alimentacao: string;
  hospedagem: string;
  estacionamento: string;
  outrasDespesas: string;
  reembolsoExtra: string;
  modeloPagamentoMotorista: string;
  valorMotoristaFixoMensal: string;
  valorMotoristaDiaria: string;
  valorMotoristaSalario: string;
  observacoes: string;
};

const initialForm: ServiceFormState = {
  cliente: "Cliente Executivo BH",
  locadora: "Aurora Locadoras Premium",
  motorista: "Carlos Henrique Almeida",
  tipoServico: "Cotação por KM",
  statusServico: "Em cotação",
  origem: "Belo Horizonte - MG",
  destino: "São Paulo - SP",
  distanciaKm: "58600",
  valorKmCliente: "420",
  valorKmReduzido: "350",
  usarValorKmReduzido: false,
  valorBaseServico: "0",
  pedagio: "18000",
  combustivel: "45000",
  alimentacao: "12000",
  hospedagem: "0",
  estacionamento: "3000",
  outrasDespesas: "0",
  reembolsoExtra: "0",
  modeloPagamentoMotorista: "Diária",
  valorMotoristaFixoMensal: "0",
  valorMotoristaDiaria: "35000",
  valorMotoristaSalario: "0",
  observacoes:
    "Cotação inicial BH x São Paulo. Valores totalmente editáveis conforme combinado com o cliente.",
};

const serviceCards = [
  {
    label: "Serviços em cotação",
    value: "12",
    detail: "Clientes aguardando retorno",
  },
  {
    label: "Em andamento",
    value: "8",
    detail: "Operações ativas hoje",
  },
  {
    label: "Concluídos",
    value: "34",
    detail: "Serviços finalizados no período",
  },
  {
    label: "Cancelados",
    value: "3",
    detail: "Controle total do fluxo",
  },
];

const serviceList = [
  {
    id: "SER-0001",
    cliente: "Cliente Executivo BH",
    rota: "BH x São Paulo",
    tipo: "Cotação por KM",
    motorista: "Carlos Henrique Almeida",
    status: "Em cotação",
    total: "R$ 2.790,00",
  },
  {
    id: "SER-0002",
    cliente: "Operação Aeroporto Confins",
    rota: "Confins x Savassi",
    tipo: "Transfer executivo",
    motorista: "Rogério Matos Silva",
    status: "Confirmado",
    total: "R$ 380,00",
  },
  {
    id: "SER-0003",
    cliente: "Contrato Corporativo Nacional",
    rota: "Campinas x São Paulo",
    tipo: "Diária corporativa",
    motorista: "Transporte Águia Executiva LTDA",
    status: "Em andamento",
    total: "R$ 1.850,00",
  },
];

const flowSteps = [
  "Cotação",
  "Aguardando aprovação",
  "Confirmado",
  "Em andamento",
  "Concluído",
  "Cancelado",
];

function toCurrencyFromDigits(value: string) {
  const digits = value.replace(/\D/g, "");
  if (!digits) return 0;
  return Number(digits) / 100;
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function getStatusStyle(status: string): React.CSSProperties {
  if (status === "Concluído") {
    return {
      background: "rgba(16, 185, 129, 0.12)",
      color: "#047857",
      border: "1px solid rgba(16, 185, 129, 0.22)",
    };
  }

  if (status === "Confirmado" || status === "Em andamento") {
    return {
      background: "rgba(37, 99, 235, 0.10)",
      color: "#1d4ed8",
      border: "1px solid rgba(37, 99, 235, 0.18)",
    };
  }

  if (status === "Cancelado") {
    return {
      background: "rgba(239, 68, 68, 0.10)",
      color: "#b91c1c",
      border: "1px solid rgba(239, 68, 68, 0.18)",
    };
  }

  return {
    background: "rgba(245, 158, 11, 0.12)",
    color: "#b45309",
    border: "1px solid rgba(245, 158, 11, 0.22)",
  };
}

export default function ServicosMotoristasPage() {
  const [form, setForm] = useState<ServiceFormState>(initialForm);

  const updateField = <K extends keyof ServiceFormState>(
    field: K,
    value: ServiceFormState[K]
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const calculo = useMemo(() => {
    const distanciaKm = toCurrencyFromDigits(form.distanciaKm);
    const valorKmNormal = toCurrencyFromDigits(form.valorKmCliente);
    const valorKmReduzido = toCurrencyFromDigits(form.valorKmReduzido);
    const valorKmAplicado = form.usarValorKmReduzido ? valorKmReduzido : valorKmNormal;

    const valorBaseServico = toCurrencyFromDigits(form.valorBaseServico);
    const pedagio = toCurrencyFromDigits(form.pedagio);
    const combustivel = toCurrencyFromDigits(form.combustivel);
    const alimentacao = toCurrencyFromDigits(form.alimentacao);
    const hospedagem = toCurrencyFromDigits(form.hospedagem);
    const estacionamento = toCurrencyFromDigits(form.estacionamento);
    const outrasDespesas = toCurrencyFromDigits(form.outrasDespesas);
    const reembolsoExtra = toCurrencyFromDigits(form.reembolsoExtra);

    const valorTransporteKm = distanciaKm * valorKmAplicado;
    const totalDespesas =
      pedagio +
      combustivel +
      alimentacao +
      hospedagem +
      estacionamento +
      outrasDespesas +
      reembolsoExtra;

    const totalServico = valorBaseServico + valorTransporteKm + totalDespesas;

    const pagamentoMotorista =
      form.modeloPagamentoMotorista === "Fixo mensal"
        ? toCurrencyFromDigits(form.valorMotoristaFixoMensal)
        : form.modeloPagamentoMotorista === "Salário"
        ? toCurrencyFromDigits(form.valorMotoristaSalario)
        : toCurrencyFromDigits(form.valorMotoristaDiaria);

    const margemPrevista = totalServico - pagamentoMotorista;

    return {
      distanciaKm,
      valorKmAplicado,
      valorTransporteKm,
      totalDespesas,
      totalServico,
      pagamentoMotorista,
      margemPrevista,
      pedagio,
      combustivel,
      alimentacao,
      hospedagem,
      estacionamento,
      outrasDespesas,
      reembolsoExtra,
    };
  }, [form]);

  return (
    <main style={styles.page}>
      <section style={styles.heroSection}>
        <div style={styles.heroGlowLeft} />
        <div style={styles.heroGlowRight} />

        <div style={styles.heroCard}>
          <div style={styles.heroTop}>
            <div style={styles.heroTextBlock}>
              <div style={styles.eyebrow}>AURORA MOTORISTAS • SERVIÇOS</div>
              <h1 style={styles.heroTitle}>
                Cotação, confirmação, execução e fechamento completo do serviço
              </h1>
              <p style={styles.heroText}>
                Esta área foi desenhada para controlar o ciclo inteiro do
                serviço: cotação por cliente, rota, valor por km, despesas,
                reembolso, pagamento do motorista e valor final da operação.
              </p>
            </div>

            <div style={styles.heroActions}>
              <Link href="/motoristas/financeiro" style={styles.secondaryButton}>
                Ver financeiro
              </Link>
              <Link href="/motoristas/motoristas" style={styles.primaryButton}>
                Ver motoristas
              </Link>
            </div>
          </div>

          <div style={styles.noticeBox}>
            Aqui já estamos incluindo a lógica de cotação por trajeto, como
            exemplo BH x São Paulo, com valor por km configurável, despesas
            editáveis e fechamento total do serviço sem depender da API nesta
            fase.
          </div>
        </div>
      </section>

      <section style={styles.statsSection}>
        <div style={styles.statsGrid}>
          {serviceCards.map((card) => (
            <article key={card.label} style={styles.statCard}>
              <span style={styles.statLabel}>{card.label}</span>
              <strong style={styles.statValue}>{card.value}</strong>
              <span style={styles.statDetail}>{card.detail}</span>
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
                  <span style={styles.sectionKicker}>NOVA COTAÇÃO / SERVIÇO</span>
                  <h2 style={styles.sectionTitle}>Montagem da operação</h2>
                </div>
              </div>

              <div style={styles.formGrid}>
                <label style={styles.fieldBlock}>
                  <span style={styles.label}>Cliente</span>
                  <input
                    type="text"
                    value={form.cliente}
                    onChange={(e) => updateField("cliente", e.target.value)}
                    style={styles.input}
                  />
                </label>

                <label style={styles.fieldBlock}>
                  <span style={styles.label}>Locadora / empresa</span>
                  <input
                    type="text"
                    value={form.locadora}
                    onChange={(e) => updateField("locadora", e.target.value)}
                    style={styles.input}
                  />
                </label>

                <label style={styles.fieldBlock}>
                  <span style={styles.label}>Motorista</span>
                  <input
                    type="text"
                    value={form.motorista}
                    onChange={(e) => updateField("motorista", e.target.value)}
                    style={styles.input}
                  />
                </label>

                <label style={styles.fieldBlock}>
                  <span style={styles.label}>Tipo de serviço</span>
                  <select
                    value={form.tipoServico}
                    onChange={(e) => updateField("tipoServico", e.target.value)}
                    style={styles.select}
                  >
                    <option>Cotação por KM</option>
                    <option>Transfer executivo</option>
                    <option>Diária corporativa</option>
                    <option>Serviço fechado</option>
                    <option>Viagem interestadual</option>
                  </select>
                </label>

                <label style={styles.fieldBlock}>
                  <span style={styles.label}>Status do serviço</span>
                  <select
                    value={form.statusServico}
                    onChange={(e) => updateField("statusServico", e.target.value)}
                    style={styles.select}
                  >
                    {flowSteps.map((step) => (
                      <option key={step}>{step}</option>
                    ))}
                  </select>
                </label>

                <label style={styles.fieldBlock}>
                  <span style={styles.label}>Origem</span>
                  <input
                    type="text"
                    value={form.origem}
                    onChange={(e) => updateField("origem", e.target.value)}
                    placeholder="Ex.: Belo Horizonte - MG"
                    style={styles.input}
                  />
                </label>

                <label style={styles.fieldBlock}>
                  <span style={styles.label}>Destino</span>
                  <input
                    type="text"
                    value={form.destino}
                    onChange={(e) => updateField("destino", e.target.value)}
                    placeholder="Ex.: São Paulo - SP"
                    style={styles.input}
                  />
                </label>

                <label style={styles.fieldBlock}>
                  <span style={styles.label}>Distância total em KM</span>
                  <input
                    type="text"
                    value={form.distanciaKm}
                    onChange={(e) => updateField("distanciaKm", e.target.value)}
                    placeholder="Ex.: 58600 para 586,00 km"
                    style={styles.input}
                  />
                </label>
              </div>
            </div>

            <div style={styles.panelCard}>
              <div style={styles.sectionHeader}>
                <div>
                  <span style={styles.sectionKicker}>COTAÇÃO POR KM</span>
                  <h2 style={styles.sectionTitle}>Valor editável por cliente</h2>
                </div>
              </div>

              <div style={styles.formGrid}>
                <label style={styles.fieldBlock}>
                  <span style={styles.label}>Valor do KM acordado com o cliente</span>
                  <input
                    type="text"
                    value={form.valorKmCliente}
                    onChange={(e) => updateField("valorKmCliente", e.target.value)}
                    placeholder="Ex.: 420 para R$ 4,20"
                    style={styles.input}
                  />
                </label>

                <label style={styles.fieldBlock}>
                  <span style={styles.label}>Valor do KM mais baixo</span>
                  <input
                    type="text"
                    value={form.valorKmReduzido}
                    onChange={(e) => updateField("valorKmReduzido", e.target.value)}
                    placeholder="Ex.: 350 para R$ 3,50"
                    style={styles.input}
                  />
                </label>

                <label style={styles.checkboxCard}>
                  <input
                    type="checkbox"
                    checked={form.usarValorKmReduzido}
                    onChange={(e) =>
                      updateField("usarValorKmReduzido", e.target.checked)
                    }
                  />
                  <span>Usar valor do KM mais baixo nesta cotação</span>
                </label>

                <label style={styles.fieldBlock}>
                  <span style={styles.label}>Valor base do serviço</span>
                  <input
                    type="text"
                    value={form.valorBaseServico}
                    onChange={(e) => updateField("valorBaseServico", e.target.value)}
                    placeholder="Ex.: 5000 para R$ 50,00"
                    style={styles.input}
                  />
                </label>
              </div>
            </div>

            <div style={styles.panelCard}>
              <div style={styles.sectionHeader}>
                <div>
                  <span style={styles.sectionKicker}>DESPESAS E REEMBOLSOS</span>
                  <h2 style={styles.sectionTitle}>Tudo totalmente editável</h2>
                </div>
              </div>

              <div style={styles.formGrid}>
                <label style={styles.fieldBlock}>
                  <span style={styles.label}>Pedágio</span>
                  <input
                    type="text"
                    value={form.pedagio}
                    onChange={(e) => updateField("pedagio", e.target.value)}
                    placeholder="Ex.: 18000 para R$ 180,00"
                    style={styles.input}
                  />
                </label>

                <label style={styles.fieldBlock}>
                  <span style={styles.label}>Combustível</span>
                  <input
                    type="text"
                    value={form.combustivel}
                    onChange={(e) => updateField("combustivel", e.target.value)}
                    placeholder="Ex.: 45000 para R$ 450,00"
                    style={styles.input}
                  />
                </label>

                <label style={styles.fieldBlock}>
                  <span style={styles.label}>Alimentação</span>
                  <input
                    type="text"
                    value={form.alimentacao}
                    onChange={(e) => updateField("alimentacao", e.target.value)}
                    placeholder="Ex.: 12000 para R$ 120,00"
                    style={styles.input}
                  />
                </label>

                <label style={styles.fieldBlock}>
                  <span style={styles.label}>Hospedagem</span>
                  <input
                    type="text"
                    value={form.hospedagem}
                    onChange={(e) => updateField("hospedagem", e.target.value)}
                    placeholder="Ex.: 25000 para R$ 250,00"
                    style={styles.input}
                  />
                </label>

                <label style={styles.fieldBlock}>
                  <span style={styles.label}>Estacionamento</span>
                  <input
                    type="text"
                    value={form.estacionamento}
                    onChange={(e) => updateField("estacionamento", e.target.value)}
                    placeholder="Ex.: 3000 para R$ 30,00"
                    style={styles.input}
                  />
                </label>

                <label style={styles.fieldBlock}>
                  <span style={styles.label}>Outras despesas</span>
                  <input
                    type="text"
                    value={form.outrasDespesas}
                    onChange={(e) => updateField("outrasDespesas", e.target.value)}
                    placeholder="Ex.: 5000 para R$ 50,00"
                    style={styles.input}
                  />
                </label>

                <label style={{ ...styles.fieldBlock, gridColumn: "1 / -1" }}>
                  <span style={styles.label}>Reembolso extra</span>
                  <input
                    type="text"
                    value={form.reembolsoExtra}
                    onChange={(e) => updateField("reembolsoExtra", e.target.value)}
                    placeholder="Ex.: 10000 para R$ 100,00"
                    style={styles.input}
                  />
                </label>
              </div>
            </div>

            <div style={styles.panelCard}>
              <div style={styles.sectionHeader}>
                <div>
                  <span style={styles.sectionKicker}>PAGAMENTO DO MOTORISTA</span>
                  <h2 style={styles.sectionTitle}>Modelo fixo, diária ou salário</h2>
                </div>
              </div>

              <div style={styles.formGrid}>
                <label style={styles.fieldBlock}>
                  <span style={styles.label}>Modelo de pagamento</span>
                  <select
                    value={form.modeloPagamentoMotorista}
                    onChange={(e) =>
                      updateField("modeloPagamentoMotorista", e.target.value)
                    }
                    style={styles.select}
                  >
                    <option>Diária</option>
                    <option>Fixo mensal</option>
                    <option>Salário</option>
                  </select>
                </label>

                <label style={styles.fieldBlock}>
                  <span style={styles.label}>Valor fixo mensal</span>
                  <input
                    type="text"
                    value={form.valorMotoristaFixoMensal}
                    onChange={(e) =>
                      updateField("valorMotoristaFixoMensal", e.target.value)
                    }
                    placeholder="Ex.: 450000 para R$ 4.500,00"
                    style={styles.input}
                  />
                </label>

                <label style={styles.fieldBlock}>
                  <span style={styles.label}>Valor por diária</span>
                  <input
                    type="text"
                    value={form.valorMotoristaDiaria}
                    onChange={(e) =>
                      updateField("valorMotoristaDiaria", e.target.value)
                    }
                    placeholder="Ex.: 35000 para R$ 350,00"
                    style={styles.input}
                  />
                </label>

                <label style={styles.fieldBlock}>
                  <span style={styles.label}>Valor salário</span>
                  <input
                    type="text"
                    value={form.valorMotoristaSalario}
                    onChange={(e) =>
                      updateField("valorMotoristaSalario", e.target.value)
                    }
                    placeholder="Ex.: 280000 para R$ 2.800,00"
                    style={styles.input}
                  />
                </label>

                <label style={{ ...styles.fieldBlock, gridColumn: "1 / -1" }}>
                  <span style={styles.label}>Observações operacionais</span>
                  <textarea
                    value={form.observacoes}
                    onChange={(e) => updateField("observacoes", e.target.value)}
                    style={styles.textarea}
                    placeholder="Ex.: regras especiais do cliente, prazo de pagamento, particularidades da rota e ajustes do motorista."
                  />
                </label>
              </div>

              <div style={styles.formActionRow}>
                <button type="button" style={styles.primaryActionButton}>
                  Salvar serviço
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

            <div style={styles.panelCard}>
              <div style={styles.sectionHeader}>
                <div>
                  <span style={styles.sectionKicker}>BASE DE SERVIÇOS</span>
                  <h2 style={styles.sectionTitle}>Lista demonstrativa</h2>
                </div>
              </div>

              <div style={styles.serviceList}>
                {serviceList.map((item) => (
                  <article key={item.id} style={styles.serviceCard}>
                    <div style={styles.serviceTop}>
                      <div>
                        <h3 style={styles.serviceTitle}>{item.rota}</h3>
                        <p style={styles.serviceSubline}>
                          {item.id} • {item.tipo} • {item.cliente}
                        </p>
                      </div>

                      <div style={styles.serviceTopRight}>
                        <strong style={styles.serviceValue}>{item.total}</strong>
                        <span style={{ ...styles.badge, ...getStatusStyle(item.status) }}>
                          {item.status}
                        </span>
                      </div>
                    </div>

                    <div style={styles.serviceDataGrid}>
                      <div style={styles.dataItem}>
                        <span style={styles.dataLabel}>Motorista</span>
                        <strong style={styles.dataValue}>{item.motorista}</strong>
                      </div>

                      <div style={styles.dataItem}>
                        <span style={styles.dataLabel}>Cliente</span>
                        <strong style={styles.dataValue}>{item.cliente}</strong>
                      </div>

                      <div style={styles.dataItem}>
                        <span style={styles.dataLabel}>Tipo</span>
                        <strong style={styles.dataValue}>{item.tipo}</strong>
                      </div>

                      <div style={styles.dataItem}>
                        <span style={styles.dataLabel}>Status</span>
                        <strong style={styles.dataValue}>{item.status}</strong>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <aside style={styles.rightColumn}>
            <div style={styles.sidebarCard}>
              <span style={styles.sectionKicker}>SIMULAÇÃO FINANCEIRA</span>
              <h2 style={styles.sidebarTitle}>Fechamento do serviço</h2>

              <div style={styles.summaryGrid}>
                <div style={styles.summaryItem}>
                  <span style={styles.summaryLabel}>Distância</span>
                  <strong style={styles.summaryValue}>
                    {calculo.distanciaKm.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    km
                  </strong>
                </div>

                <div style={styles.summaryItem}>
                  <span style={styles.summaryLabel}>KM aplicado</span>
                  <strong style={styles.summaryValue}>
                    {formatCurrency(calculo.valorKmAplicado)}
                  </strong>
                </div>

                <div style={styles.summaryItem}>
                  <span style={styles.summaryLabel}>Valor transporte</span>
                  <strong style={styles.summaryValue}>
                    {formatCurrency(calculo.valorTransporteKm)}
                  </strong>
                </div>

                <div style={styles.summaryItem}>
                  <span style={styles.summaryLabel}>Total despesas</span>
                  <strong style={styles.summaryValue}>
                    {formatCurrency(calculo.totalDespesas)}
                  </strong>
                </div>

                <div style={styles.summaryItem}>
                  <span style={styles.summaryLabel}>Pagamento motorista</span>
                  <strong style={styles.summaryValue}>
                    {formatCurrency(calculo.pagamentoMotorista)}
                  </strong>
                </div>

                <div style={styles.summaryItem}>
                  <span style={styles.summaryLabel}>Margem prevista</span>
                  <strong
                    style={{
                      ...styles.summaryValue,
                      color: calculo.margemPrevista >= 0 ? "#047857" : "#b91c1c",
                    }}
                  >
                    {formatCurrency(calculo.margemPrevista)}
                  </strong>
                </div>

                <div style={styles.summaryItemWide}>
                  <span style={styles.summaryLabel}>Valor final do serviço</span>
                  <strong style={styles.summaryValueBig}>
                    {formatCurrency(calculo.totalServico)}
                  </strong>
                </div>
              </div>
            </div>

            <div style={styles.sidebarCard}>
              <span style={styles.sectionKicker}>FLUXO OPERACIONAL</span>
              <h2 style={styles.sidebarTitle}>Etapas do serviço</h2>

              <div style={styles.flowList}>
                {flowSteps.map((step) => (
                  <div
                    key={step}
                    style={{
                      ...styles.flowItem,
                      ...(step === form.statusServico ? styles.flowItemActive : {}),
                    }}
                  >
                    {step}
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.sidebarCardDark}>
              <div style={styles.robotTag}>ROBÔ AURORA</div>
              <h2 style={styles.sidebarTitleDark}>Leitura inteligente da cotação</h2>
              <p style={styles.sidebarTextDark}>
                O Robô Aurora vai sugerir rota, avisar quando o valor por km
                estiver abaixo do ideal, detectar margem apertada, apontar
                despesas elevadas e ajudar o operador a decidir antes de
                confirmar o serviço.
              </p>

              <div style={styles.robotMiniList}>
                <div style={styles.robotMiniItem}>Sugerir valor por km</div>
                <div style={styles.robotMiniItem}>Analisar custo da rota</div>
                <div style={styles.robotMiniItem}>Ler margem do serviço</div>
                <div style={styles.robotMiniItem}>Apontar risco operacional</div>
              </div>
            </div>

            <div style={styles.sidebarCard}>
              <span style={styles.sectionKicker}>NAVEGAÇÃO</span>
              <h2 style={styles.sidebarTitle}>Próximos blocos</h2>

              <div style={styles.navList}>
                <Link href="/motoristas/financeiro" style={styles.navItem}>
                  Abrir financeiro
                </Link>
                <Link href="/motoristas/pagamentos" style={styles.navItem}>
                  Abrir pagamentos
                </Link>
                <Link href="/motoristas/relatorios" style={styles.navItem}>
                  Abrir relatórios
                </Link>
                <Link href="/motoristas/robo-aurora" style={styles.navItem}>
                  Abrir Robô Aurora
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
    fontSize: "clamp(1.9rem, 3.5vw, 3.2rem)",
    lineHeight: 1.06,
    fontWeight: 900,
    letterSpacing: "-0.04em",
    maxWidth: 940,
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

  statsSection: {
    maxWidth: 1280,
    margin: "0 auto",
    padding: "8px 20px 4px",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 14,
  },

  statCard: {
    background: "#ffffff",
    borderRadius: 22,
    border: "1px solid rgba(148, 163, 184, 0.18)",
    padding: 18,
    boxShadow: "0 10px 28px rgba(15, 23, 42, 0.05)",
  },

  statLabel: {
    display: "block",
    color: "#475569",
    fontSize: 14,
    fontWeight: 700,
  },

  statValue: {
    display: "block",
    marginTop: 8,
    fontSize: 30,
    lineHeight: 1,
    fontWeight: 900,
    letterSpacing: "-0.04em",
  },

  statDetail: {
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

  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
    gap: 14,
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
    minHeight: 120,
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

  checkboxCard: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: 14,
    borderRadius: 16,
    background: "linear-gradient(180deg, #f8fbff 0%, #ffffff 100%)",
    border: "1px solid rgba(148, 163, 184, 0.16)",
    color: "#0f172a",
    fontSize: 14,
    fontWeight: 700,
    lineHeight: 1.5,
    minHeight: 48,
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

  serviceList: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },

  serviceCard: {
    borderRadius: 22,
    padding: 18,
    background: "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
    border: "1px solid rgba(148, 163, 184, 0.18)",
    boxShadow: "0 10px 28px rgba(15, 23, 42, 0.04)",
  },

  serviceTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
    alignItems: "flex-start",
  },

  serviceTitle: {
    margin: 0,
    fontSize: 20,
    fontWeight: 900,
  },

  serviceSubline: {
    marginTop: 8,
    marginBottom: 0,
    color: "#475569",
    lineHeight: 1.6,
    fontSize: 14,
    fontWeight: 600,
  },

  serviceTopRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 8,
  },

  serviceValue: {
    fontSize: 24,
    lineHeight: 1,
    fontWeight: 900,
    color: "#0284c7",
  },

  badge: {
    display: "inline-flex",
    alignItems: "center",
    minHeight: 28,
    padding: "0 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
  },

  serviceDataGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 12,
    marginTop: 16,
  },

  dataItem: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    padding: 14,
    borderRadius: 16,
    background: "#ffffff",
    border: "1px solid rgba(148, 163, 184, 0.16)",
  },

  dataLabel: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  },

  dataValue: {
    color: "#0f172a",
    fontSize: 15,
    lineHeight: 1.5,
    fontWeight: 800,
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

  summaryValueBig: {
    display: "block",
    marginTop: 8,
    color: "#0284c7",
    fontSize: 28,
    lineHeight: 1.1,
    fontWeight: 900,
  },

  flowList: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginTop: 16,
  },

  flowItem: {
    padding: "12px 14px",
    borderRadius: 14,
    background: "linear-gradient(180deg, #f8fbff 0%, #ffffff 100%)",
    border: "1px solid rgba(148, 163, 184, 0.16)",
    color: "#0f172a",
    fontSize: 14,
    fontWeight: 800,
  },

  flowItemActive: {
    background: "rgba(37, 99, 235, 0.10)",
    border: "1px solid rgba(37, 99, 235, 0.18)",
    color: "#1d4ed8",
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

  robotMiniList: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
    marginTop: 18,
  },

  robotMiniItem: {
    padding: "12px 14px",
    borderRadius: 14,
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(125, 211, 252, 0.16)",
    color: "#e2e8f0",
    fontSize: 13,
    fontWeight: 700,
    lineHeight: 1.5,
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