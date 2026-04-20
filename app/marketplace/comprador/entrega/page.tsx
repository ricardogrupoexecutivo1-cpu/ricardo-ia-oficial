"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type EnderecoEntrega = {
  nomeRecebedor: string;
  telefone: string;
  email: string;
  cep: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  referencia: string;
  observacoes: string;
};

const STORAGE_KEY = "aurora_marketplace_comprador_entrega";

const ESTADO_INICIAL: EnderecoEntrega = {
  nomeRecebedor: "",
  telefone: "",
  email: "",
  cep: "",
  endereco: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
  estado: "",
  referencia: "",
  observacoes: "",
};

function lerEntrega(): EnderecoEntrega {
  if (typeof window === "undefined") return ESTADO_INICIAL;

  try {
    const bruto = localStorage.getItem(STORAGE_KEY);
    if (!bruto) return ESTADO_INICIAL;

    const dados = JSON.parse(bruto);

    return {
      nomeRecebedor: String(dados?.nomeRecebedor ?? ""),
      telefone: String(dados?.telefone ?? ""),
      email: String(dados?.email ?? ""),
      cep: String(dados?.cep ?? ""),
      endereco: String(dados?.endereco ?? ""),
      numero: String(dados?.numero ?? ""),
      complemento: String(dados?.complemento ?? ""),
      bairro: String(dados?.bairro ?? ""),
      cidade: String(dados?.cidade ?? ""),
      estado: String(dados?.estado ?? ""),
      referencia: String(dados?.referencia ?? ""),
      observacoes: String(dados?.observacoes ?? ""),
    };
  } catch {
    return ESTADO_INICIAL;
  }
}

export default function MarketplaceCompradorEntregaPage() {
  const [form, setForm] = useState<EnderecoEntrega>(ESTADO_INICIAL);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    setForm(lerEntrega());
  }, []);

  function atualizar<K extends keyof EnderecoEntrega>(campo: K, valor: EnderecoEntrega[K]) {
    setForm((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));
  }

  function salvarEntrega() {
    const nomeLimpo = form.nomeRecebedor.trim();
    const telefoneLimpo = form.telefone.trim();
    const cepLimpo = form.cep.trim();
    const enderecoLimpo = form.endereco.trim();
    const numeroLimpo = form.numero.trim();
    const bairroLimpo = form.bairro.trim();
    const cidadeLimpa = form.cidade.trim();
    const estadoLimpo = form.estado.trim();

    if (
      !nomeLimpo ||
      !telefoneLimpo ||
      !cepLimpo ||
      !enderecoLimpo ||
      !numeroLimpo ||
      !bairroLimpo ||
      !cidadeLimpa ||
      !estadoLimpo
    ) {
      setMensagem("Preencha os campos principais de entrega: nome, telefone, CEP, endereço, número, bairro, cidade e estado.");
      return;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    setMensagem("Endereço de entrega salvo localmente com sucesso. Esta base já prepara o próximo passo de pedido, checkout e histórico do comprador.");
  }

  function limparEntrega() {
    localStorage.removeItem(STORAGE_KEY);
    setForm(ESTADO_INICIAL);
    setMensagem("Endereço de entrega removido da base local do comprador.");
  }

  const resumoPreenchimento = useMemo(() => {
    const campos = Object.values(form);
    const preenchidos = campos.filter((valor) => String(valor).trim().length > 0).length;
    const total = campos.length;
    const percentual = Math.round((preenchidos / total) * 100);
    return { preenchidos, total, percentual };
  }, [form]);

  return (
    <main style={styles.page}>
      <div style={styles.bgGlowTop} />
      <div style={styles.bgGlowBottom} />

      <section style={styles.heroCard}>
        <div style={styles.heroHeader}>
          <div>
            <span style={styles.kicker}>Aurora Marketplace • Comprador • Entrega</span>
            <h1 style={styles.title}>ENDEREÇO DE ENTREGA</h1>
            <p style={styles.lead}>
              Página isolada para registrar os dados de entrega do comprador com segurança, clareza e preparação para os próximos passos do Marketplace.
            </p>
          </div>

          <div style={styles.heroActions}>
            <Link href="/marketplace/comprador" style={styles.linkGhost}>
              Voltar ao comprador
            </Link>
            <Link href="/marketplace/vendedor/vitrine" style={styles.linkPrimary}>
              Explorar vitrine
            </Link>
          </div>
        </div>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Preenchimento</span>
            <strong style={styles.statValue}>{resumoPreenchimento.percentual}%</strong>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Campos preenchidos</span>
            <strong style={styles.statValue}>
              {resumoPreenchimento.preenchidos}/{resumoPreenchimento.total}
            </strong>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Modo atual</span>
            <strong style={styles.statValueSmall}>Entrega local</strong>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Próxima camada</span>
            <strong style={styles.statValueSmall}>Pedido / checkout</strong>
          </div>
        </div>
      </section>

      <section style={styles.contentGrid}>
        <div style={styles.panel}>
          <div style={styles.panelHeader}>
            <div>
              <span style={styles.panelKicker}>Cadastro do comprador</span>
              <h2 style={styles.panelTitle}>Dados de entrega</h2>
              <p style={styles.panelText}>
                Nesta fase, o comprador já pode deixar preparado o endereço para recebimento dos produtos. Depois ligaremos isso ao pedido real.
              </p>
            </div>
          </div>

          <div style={styles.formGrid}>
            <div style={styles.field}>
              <label style={styles.label}>Nome de quem recebe</label>
              <input
                style={styles.input}
                placeholder="Ex.: Ricardo Moreira"
                value={form.nomeRecebedor}
                onChange={(e) => atualizar("nomeRecebedor", e.target.value)}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Telefone</label>
              <input
                style={styles.input}
                placeholder="Ex.: (31) 99999-9999"
                value={form.telefone}
                onChange={(e) => atualizar("telefone", e.target.value)}
              />
            </div>

            <div style={{ ...styles.field, gridColumn: "1 / -1" }}>
              <label style={styles.label}>E-mail</label>
              <input
                style={styles.input}
                placeholder="Ex.: comprador@exemplo.com"
                value={form.email}
                onChange={(e) => atualizar("email", e.target.value)}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>CEP</label>
              <input
                style={styles.input}
                placeholder="Ex.: 30110-000"
                value={form.cep}
                onChange={(e) => atualizar("cep", e.target.value)}
              />
            </div>

            <div style={{ ...styles.field, gridColumn: "span 2" }}>
              <label style={styles.label}>Endereço</label>
              <input
                style={styles.input}
                placeholder="Ex.: Rua das Flores"
                value={form.endereco}
                onChange={(e) => atualizar("endereco", e.target.value)}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Número</label>
              <input
                style={styles.input}
                placeholder="Ex.: 150"
                value={form.numero}
                onChange={(e) => atualizar("numero", e.target.value)}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Complemento</label>
              <input
                style={styles.input}
                placeholder="Ex.: Apto 202, Bloco B"
                value={form.complemento}
                onChange={(e) => atualizar("complemento", e.target.value)}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Bairro</label>
              <input
                style={styles.input}
                placeholder="Ex.: Centro"
                value={form.bairro}
                onChange={(e) => atualizar("bairro", e.target.value)}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Cidade</label>
              <input
                style={styles.input}
                placeholder="Ex.: Belo Horizonte"
                value={form.cidade}
                onChange={(e) => atualizar("cidade", e.target.value)}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Estado</label>
              <input
                style={styles.input}
                placeholder="Ex.: MG"
                value={form.estado}
                onChange={(e) => atualizar("estado", e.target.value)}
              />
            </div>

            <div style={{ ...styles.field, gridColumn: "1 / -1" }}>
              <label style={styles.label}>Referência de entrega</label>
              <input
                style={styles.input}
                placeholder="Ex.: Próximo à padaria, portão azul"
                value={form.referencia}
                onChange={(e) => atualizar("referencia", e.target.value)}
              />
            </div>

            <div style={{ ...styles.field, gridColumn: "1 / -1" }}>
              <label style={styles.label}>Observações</label>
              <textarea
                style={styles.textarea}
                rows={5}
                placeholder="Ex.: Entregar em horário comercial, chamar na portaria..."
                value={form.observacoes}
                onChange={(e) => atualizar("observacoes", e.target.value)}
              />
            </div>
          </div>

          <div style={styles.buttonRow}>
            <button type="button" onClick={salvarEntrega} style={styles.primaryButton}>
              Salvar endereço
            </button>

            <button type="button" onClick={limparEntrega} style={styles.secondaryButton}>
              Limpar endereço
            </button>
          </div>

          {mensagem ? <div style={styles.alert}>{mensagem}</div> : null}
        </div>

        <div style={styles.sideColumn}>
          <div style={styles.sideCard}>
            <span style={styles.panelKicker}>Leitura rápida</span>
            <h3 style={styles.sideTitle}>Resumo da entrega</h3>
            <p style={styles.sideText}>
              Fotografia rápida do preparo atual da base de entrega do comprador.
            </p>

            <div style={styles.resumeList}>
              <div style={styles.resumeItem}>
                <span>Nome</span>
                <strong>{form.nomeRecebedor || "Não informado"}</strong>
              </div>
              <div style={styles.resumeItem}>
                <span>Telefone</span>
                <strong>{form.telefone || "Não informado"}</strong>
              </div>
              <div style={styles.resumeItem}>
                <span>Cidade</span>
                <strong>{form.cidade || "Não informada"}</strong>
              </div>
              <div style={styles.resumeItem}>
                <span>Estado</span>
                <strong>{form.estado || "Não informado"}</strong>
              </div>
            </div>
          </div>

          <div style={styles.sideCard}>
            <span style={styles.panelKicker}>Próximo passo</span>
            <h3 style={styles.sideTitle}>Ligar entrega ao pedido</h3>
            <p style={styles.sideText}>
              Depois desta base local, o próximo avanço correto é conectar o comprador, o produto, o endereço e o histórico do pedido.
            </p>

            <div style={styles.sideActions}>
              <Link href="/marketplace/comprador" style={styles.linkGhostBlock}>
                Voltar ao comprador
              </Link>
              <Link href="/marketplace/vendedor/vitrine" style={styles.linkPrimaryBlock}>
                Explorar vitrine
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    padding: "32px 20px 56px",
    background: "linear-gradient(180deg, #eef8ff 0%, #f7fbff 40%, #ffffff 100%)",
    position: "relative",
    overflow: "hidden",
  },
  bgGlowTop: {
    position: "absolute",
    top: -120,
    right: -120,
    width: 320,
    height: 320,
    borderRadius: "50%",
    background: "rgba(0, 191, 255, 0.14)",
    filter: "blur(60px)",
    pointerEvents: "none",
  },
  bgGlowBottom: {
    position: "absolute",
    bottom: -160,
    left: -120,
    width: 360,
    height: 360,
    borderRadius: "50%",
    background: "rgba(0, 153, 255, 0.12)",
    filter: "blur(70px)",
    pointerEvents: "none",
  },
  heroCard: {
    position: "relative",
    zIndex: 1,
    maxWidth: 1280,
    margin: "0 auto 24px",
    borderRadius: 28,
    border: "1px solid rgba(120, 170, 220, 0.22)",
    background: "rgba(255,255,255,0.82)",
    boxShadow: "0 22px 60px rgba(31, 80, 140, 0.10)",
    backdropFilter: "blur(14px)",
    padding: 28,
  },
  heroHeader: {
    display: "flex",
    gap: 20,
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  kicker: {
    display: "inline-block",
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: 1.1,
    textTransform: "uppercase",
    color: "#0b74c7",
    marginBottom: 10,
  },
  title: {
    margin: 0,
    fontSize: "clamp(2rem, 4vw, 3.2rem)",
    lineHeight: 1.02,
    color: "#082849",
  },
  lead: {
    margin: "12px 0 0",
    maxWidth: 760,
    fontSize: 16,
    lineHeight: 1.7,
    color: "#42627f",
  },
  heroActions: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
  },
  linkPrimary: {
    textDecoration: "none",
    background: "linear-gradient(135deg, #0aa2ff 0%, #0b7ed6 100%)",
    color: "#fff",
    padding: "14px 18px",
    borderRadius: 16,
    fontWeight: 800,
    boxShadow: "0 18px 40px rgba(0, 122, 204, 0.22)",
  },
  linkGhost: {
    textDecoration: "none",
    background: "#f4fbff",
    color: "#0c5d96",
    padding: "14px 18px",
    borderRadius: 16,
    fontWeight: 700,
    border: "1px solid rgba(99, 163, 214, 0.24)",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 14,
    marginTop: 22,
  },
  statCard: {
    background: "linear-gradient(180deg, #fafdff 0%, #eff7ff 100%)",
    borderRadius: 20,
    padding: 18,
    border: "1px solid rgba(121, 178, 224, 0.20)",
  },
  statLabel: {
    display: "block",
    fontSize: 13,
    color: "#55738d",
    marginBottom: 8,
    fontWeight: 700,
  },
  statValue: {
    fontSize: 28,
    color: "#0a2946",
  },
  statValueSmall: {
    fontSize: 20,
    color: "#0a2946",
  },
  contentGrid: {
    position: "relative",
    zIndex: 1,
    maxWidth: 1280,
    margin: "0 auto 24px",
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.5fr) minmax(320px, 0.85fr)",
    gap: 24,
  },
  panel: {
    position: "relative",
    zIndex: 1,
    maxWidth: 1280,
    margin: "0 auto 24px",
    borderRadius: 28,
    border: "1px solid rgba(120, 170, 220, 0.22)",
    background: "rgba(255,255,255,0.90)",
    boxShadow: "0 22px 60px rgba(31, 80, 140, 0.08)",
    padding: 28,
  },
  sideColumn: {
    display: "grid",
    gap: 24,
    alignContent: "start",
  },
  sideCard: {
    borderRadius: 24,
    border: "1px solid rgba(120, 170, 220, 0.18)",
    background: "linear-gradient(180deg, #ffffff 0%, #f6fbff 100%)",
    boxShadow: "0 18px 40px rgba(31, 80, 140, 0.06)",
    padding: 24,
  },
  panelHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    alignItems: "flex-start",
    flexWrap: "wrap",
    marginBottom: 22,
  },
  panelKicker: {
    display: "inline-block",
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: "#1292ec",
    marginBottom: 8,
  },
  panelTitle: {
    margin: 0,
    fontSize: 26,
    color: "#0c2b49",
  },
  panelText: {
    margin: "10px 0 0",
    fontSize: 15,
    lineHeight: 1.7,
    color: "#4b6781",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 18,
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: 700,
    color: "#17456d",
  },
  input: {
    width: "100%",
    minHeight: 52,
    borderRadius: 16,
    border: "1px solid rgba(113, 160, 205, 0.28)",
    background: "#f9fcff",
    padding: "0 16px",
    fontSize: 15,
    color: "#14324d",
    outline: "none",
  },
  textarea: {
    width: "100%",
    borderRadius: 18,
    border: "1px solid rgba(113, 160, 205, 0.28)",
    background: "#f9fcff",
    padding: "14px 16px",
    fontSize: 15,
    color: "#14324d",
    outline: "none",
    resize: "vertical",
  },
  buttonRow: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    marginTop: 22,
  },
  primaryButton: {
    border: "none",
    borderRadius: 16,
    padding: "14px 20px",
    background: "linear-gradient(135deg, #08a2ff 0%, #0a76cf 100%)",
    color: "#fff",
    fontWeight: 800,
    fontSize: 15,
    cursor: "pointer",
    boxShadow: "0 18px 40px rgba(0, 122, 204, 0.22)",
  },
  secondaryButton: {
    border: "1px solid rgba(99, 163, 214, 0.24)",
    borderRadius: 16,
    padding: "14px 20px",
    background: "#f4fbff",
    color: "#0c5d96",
    fontWeight: 800,
    fontSize: 15,
    cursor: "pointer",
  },
  alert: {
    marginTop: 18,
    borderRadius: 18,
    padding: "16px 18px",
    background: "#eef8ff",
    border: "1px solid rgba(84, 166, 226, 0.24)",
    color: "#174b73",
    lineHeight: 1.6,
    fontWeight: 600,
  },
  sideTitle: {
    margin: 0,
    fontSize: 22,
    color: "#0d2c49",
  },
  sideText: {
    margin: "10px 0 0",
    color: "#4e6a84",
    lineHeight: 1.7,
    fontSize: 15,
  },
  resumeList: {
    display: "grid",
    gap: 12,
    marginTop: 18,
  },
  resumeItem: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    padding: "14px 16px",
    borderRadius: 16,
    background: "#f8fbff",
    border: "1px solid rgba(120, 170, 220, 0.16)",
    color: "#234764",
  },
  sideActions: {
    display: "grid",
    gap: 12,
    marginTop: 20,
  },
  linkPrimaryBlock: {
    textDecoration: "none",
    textAlign: "center",
    background: "linear-gradient(135deg, #0aa2ff 0%, #0b7ed6 100%)",
    color: "#fff",
    padding: "14px 18px",
    borderRadius: 16,
    fontWeight: 800,
  },
  linkGhostBlock: {
    textDecoration: "none",
    textAlign: "center",
    background: "#f4fbff",
    color: "#0c5d96",
    padding: "14px 18px",
    borderRadius: 16,
    fontWeight: 800,
    border: "1px solid rgba(99, 163, 214, 0.24)",
  },
};