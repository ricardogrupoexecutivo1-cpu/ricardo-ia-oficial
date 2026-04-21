"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type ProdutoStatus = "Disponível" | "Pausado" | "Rascunho";

type Produto = {
  id: string;
  nome: string;
  preco: string;
  categoria: string;
  estoque: string;
  status: ProdutoStatus;
  imagem: string;
  descricao: string;
  criadoEm: string;
};

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

type PedidoMarketplace = {
  produto: Produto | null;
  entrega: EnderecoEntrega | null;
  origem: "interesse";
  criadoEm: string;
};

const STORAGE_KEY_PRODUTOS = "aurora_marketplace_produtos";
const STORAGE_KEY_ENTREGA = "aurora_marketplace_comprador_entrega";
const STORAGE_KEY_INTERESSE = "aurora_marketplace_interesse_produto";
const STORAGE_KEY_PEDIDO = "aurora_marketplace_pedido";

function normalizarProduto(item: unknown): Produto | null {
  if (!item || typeof item !== "object") return null;

  const valor = item as Partial<Produto> & { status?: string };

  return {
    id: String(valor.id ?? ""),
    nome: String(valor.nome ?? ""),
    preco: String(valor.preco ?? ""),
    categoria: String(valor.categoria ?? ""),
    estoque: String(valor.estoque ?? ""),
    status: (["Disponível", "Pausado", "Rascunho"].includes(valor.status ?? "")
      ? valor.status
      : "Disponível") as ProdutoStatus,
    imagem: String(valor.imagem ?? ""),
    descricao: String(valor.descricao ?? ""),
    criadoEm: String(valor.criadoEm ?? ""),
  };
}

function lerProdutoInteresse(): Produto | null {
  if (typeof window === "undefined") return null;

  try {
    const brutoInteresse = localStorage.getItem(STORAGE_KEY_INTERESSE);
    if (brutoInteresse) {
      const item = JSON.parse(brutoInteresse);
      const produtoNormalizado = normalizarProduto(item);
      if (produtoNormalizado) {
        return produtoNormalizado;
      }
    }

    const brutoProdutos = localStorage.getItem(STORAGE_KEY_PRODUTOS);
    if (!brutoProdutos) return null;

    const lista = JSON.parse(brutoProdutos);
    if (!Array.isArray(lista)) return null;

    const primeiroDisponivel = lista.find((item) => item?.status === "Disponível");
    return normalizarProduto(primeiroDisponivel);
  } catch {
    return null;
  }
}

function lerEntrega(): EnderecoEntrega | null {
  if (typeof window === "undefined") return null;

  try {
    const bruto = localStorage.getItem(STORAGE_KEY_ENTREGA);
    if (!bruto) return null;

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
    return null;
  }
}

function salvarPedidoMarketplace(produto: Produto | null, entrega: EnderecoEntrega | null) {
  if (typeof window === "undefined") return false;

  try {
    const payload: PedidoMarketplace = {
      produto,
      entrega,
      origem: "interesse",
      criadoEm: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY_PEDIDO, JSON.stringify(payload));
    return true;
  } catch {
    return false;
  }
}

export default function MarketplaceInteressePage() {
  const [produto, setProduto] = useState<Produto | null>(null);
  const [entrega, setEntrega] = useState<EnderecoEntrega | null>(null);
  const [mensagem] = useState(
    "Posso te ajudar a fechar esse pedido agora sem enrolação. Se quiser, siga para o pedido e deixe seu fechamento pronto."
  );
  const [aviso, setAviso] = useState("");
  const [carregandoAvanco, setCarregandoAvanco] = useState(false);

  useEffect(() => {
    setProduto(lerProdutoInteresse());
    setEntrega(lerEntrega());
  }, []);

  const entregaCompleta = useMemo(() => {
    if (!entrega) return false;

    return Boolean(
      entrega.nomeRecebedor.trim() &&
        entrega.telefone.trim() &&
        entrega.cep.trim() &&
        entrega.endereco.trim() &&
        entrega.numero.trim() &&
        entrega.bairro.trim() &&
        entrega.cidade.trim() &&
        entrega.estado.trim()
    );
  }, [entrega]);

  function avancarParaPedido() {
    if (!produto) {
      setAviso("Nenhum produto válido foi encontrado para seguir ao pedido.");
      return;
    }

    setCarregandoAvanco(true);
    setAviso("");

    let interesseSalvo = false;
    let pedidoSalvo = false;

    try {
      localStorage.setItem(STORAGE_KEY_INTERESSE, JSON.stringify(produto));
      interesseSalvo = true;
    } catch {
      interesseSalvo = false;
    }

    pedidoSalvo = salvarPedidoMarketplace(produto, entrega);

    if (!interesseSalvo && !pedidoSalvo) {
      setCarregandoAvanco(false);
      setAviso("Não foi possível preparar o pedido agora. Tente novamente.");
      return;
    }

    setAviso("Produto preparado com sucesso. Abrindo o pedido...");

    setTimeout(() => {
      window.location.assign("/marketplace/pedido");
    }, 150);
  }

  return (
    <main style={styles.page}>
      <div style={styles.bgGlowTop} />
      <div style={styles.bgGlowBottom} />

      <section style={styles.heroCard}>
        <div style={styles.heroHeader}>
          <div>
            <span style={styles.kicker}>Aurora Marketplace • Interesse</span>
            <h1 style={styles.title}>INTERESSE NO PRODUTO</h1>
            <p style={styles.lead}>
              Página isolada para iniciar o interesse do comprador sem quebrar o Marketplace. Aqui juntamos produto, entrega e o primeiro passo comercial.
            </p>
          </div>

          <div style={styles.heroActions}>
            <Link href="/marketplace/vendedor/vitrine" style={styles.linkGhost}>
              Voltar à vitrine
            </Link>
            <Link href="/marketplace/comprador/entrega" style={styles.linkPrimary}>
              Ir para entrega
            </Link>
          </div>
        </div>
      </section>

      <section style={styles.contentGrid}>
        <div style={styles.panel}>
          <div style={styles.panelHeader}>
            <div>
              <span style={styles.panelKicker}>Produto selecionado</span>
              <h2 style={styles.panelTitle}>Resumo do interesse</h2>
              <p style={styles.panelText}>
                Nesta fase, o sistema lê o produto de interesse salvo ou usa o primeiro item disponível como base de continuidade.
              </p>
            </div>
          </div>

          {!produto ? (
            <div style={styles.emptyState}>
              <strong style={styles.emptyTitle}>Nenhum produto carregado ainda</strong>
              <p style={styles.emptyText}>
                Volte à vitrine, escolha um item e siga para o fluxo de interesse.
              </p>
            </div>
          ) : (
            <div style={styles.productCard}>
              <div style={styles.productMedia}>
                {produto.imagem ? (
                  <img src={produto.imagem} alt={produto.nome} style={styles.productImage} />
                ) : (
                  <div style={styles.productFallback}>Sem imagem</div>
                )}
              </div>

              <div style={styles.badgeRow}>
                <span style={styles.statusBadge}>{produto.status}</span>
              </div>

              <h3 style={styles.productName}>{produto.nome || "Produto sem nome"}</h3>
              <div style={styles.productPrice}>{produto.preco || "Preço não informado"}</div>
              <p style={styles.productDescription}>
                {produto.descricao || "Descrição ainda não informada para este item."}
              </p>

              <div style={styles.metaList}>
                <div style={styles.metaItem}>
                  <span>Categoria</span>
                  <strong>{produto.categoria || "Não informada"}</strong>
                </div>
                <div style={styles.metaItem}>
                  <span>Estoque</span>
                  <strong>{produto.estoque || "Não informado"}</strong>
                </div>
              </div>

              <div style={styles.productActions}>
                <button
                  type="button"
                  onClick={avancarParaPedido}
                  style={styles.primaryButton}
                  disabled={carregandoAvanco}
                >
                  {carregandoAvanco ? "Preparando pedido..." : "Avançar para pedido"}
                </button>

                <Link href="/marketplace/comprador/entrega" style={styles.secondaryButton}>
                  Ajustar entrega antes
                </Link>
              </div>

              {aviso ? <p style={styles.feedbackText}>{aviso}</p> : null}
            </div>
          )}
        </div>

        <div style={styles.sideColumn}>
          <div style={styles.sideCard}>
            <span style={styles.panelKicker}>Robô vendedor Aurora</span>
            <h3 style={styles.sideTitle}>Conversa curta e elegante</h3>
            <p style={styles.sideText}>{mensagem}</p>

            <div style={styles.robotBox}>
              <strong style={styles.robotTitle}>Sugestão automática</strong>
              <p style={styles.robotText}>
                {entregaCompleta
                  ? "Este produto e a entrega já estão prontos para avanço. O melhor próximo passo agora é abrir o pedido."
                  : "Este produto já está pronto para avanço. Antes do fechamento, vale completar a entrega para acelerar o pedido."}
              </p>
            </div>
          </div>

          <div style={styles.sideCard}>
            <span style={styles.panelKicker}>Entrega do comprador</span>
            <h3 style={styles.sideTitle}>Base atual da entrega</h3>
            <p style={styles.sideText}>
              Se a entrega estiver completa, o fluxo fica pronto para evoluir para pedido e histórico.
            </p>

            <div style={styles.resumeList}>
              <div style={styles.resumeItem}>
                <span>Nome</span>
                <strong>{entrega?.nomeRecebedor || "Não informado"}</strong>
              </div>
              <div style={styles.resumeItem}>
                <span>Telefone</span>
                <strong>{entrega?.telefone || "Não informado"}</strong>
              </div>
              <div style={styles.resumeItem}>
                <span>Cidade</span>
                <strong>{entrega?.cidade || "Não informada"}</strong>
              </div>
              <div style={styles.resumeItem}>
                <span>Status</span>
                <strong>{entregaCompleta ? "Entrega pronta" : "Entrega incompleta"}</strong>
              </div>
            </div>

            <div style={styles.sideActions}>
              <Link href="/marketplace/comprador/entrega" style={styles.linkPrimaryBlock}>
                Abrir endereço de entrega
              </Link>
              <Link href="/marketplace/comprador" style={styles.linkGhostBlock}>
                Voltar ao comprador
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
  emptyState: {
    borderRadius: 24,
    padding: 28,
    background: "linear-gradient(180deg, #fbfdff 0%, #f1f8ff 100%)",
    border: "1px solid rgba(120, 170, 220, 0.18)",
  },
  emptyTitle: {
    display: "block",
    fontSize: 20,
    color: "#12314e",
    marginBottom: 10,
  },
  emptyText: {
    margin: 0,
    color: "#50708b",
    lineHeight: 1.7,
  },
  productCard: {
    borderRadius: 24,
    border: "1px solid rgba(120, 170, 220, 0.18)",
    background: "linear-gradient(180deg, #ffffff 0%, #f7fbff 100%)",
    boxShadow: "0 16px 36px rgba(31, 80, 140, 0.07)",
    padding: 18,
  },
  productMedia: {
    width: "100%",
    aspectRatio: "1 / 1",
    borderRadius: 20,
    overflow: "hidden",
    background: "#eef6fd",
    border: "1px solid rgba(120, 170, 220, 0.18)",
    marginBottom: 14,
  },
  productImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  productFallback: {
    width: "100%",
    height: "100%",
    display: "grid",
    placeItems: "center",
    color: "#67839c",
    fontWeight: 700,
    fontSize: 14,
  },
  badgeRow: {
    display: "flex",
    marginBottom: 12,
  },
  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    minHeight: 34,
    padding: "0 12px",
    borderRadius: 999,
    background: "#eaf7ff",
    color: "#0b6eb8",
    fontSize: 13,
    fontWeight: 800,
  },
  productName: {
    margin: 0,
    fontSize: 20,
    color: "#092949",
  },
  productPrice: {
    marginTop: 8,
    fontSize: 24,
    fontWeight: 900,
    color: "#0a7cd3",
  },
  productDescription: {
    margin: "12px 0 0",
    color: "#516d86",
    lineHeight: 1.65,
    minHeight: 78,
  },
  metaList: {
    display: "grid",
    gap: 10,
    marginTop: 16,
  },
  metaItem: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    borderTop: "1px solid rgba(120, 170, 220, 0.16)",
    paddingTop: 10,
    color: "#33536f",
    fontSize: 14,
  },
  productActions: {
    display: "grid",
    gap: 12,
    marginTop: 20,
  },
  primaryButton: {
    border: "none",
    cursor: "pointer",
    textAlign: "center",
    background: "linear-gradient(135deg, #0aa2ff 0%, #0b7ed6 100%)",
    color: "#fff",
    padding: "15px 18px",
    borderRadius: 16,
    fontWeight: 800,
    fontSize: 15,
    boxShadow: "0 18px 40px rgba(0, 122, 204, 0.18)",
  },
  secondaryButton: {
    textDecoration: "none",
    textAlign: "center",
    background: "#f4fbff",
    color: "#0c5d96",
    padding: "14px 18px",
    borderRadius: 16,
    fontWeight: 800,
    border: "1px solid rgba(99, 163, 214, 0.24)",
  },
  feedbackText: {
    margin: "12px 0 0",
    color: "#0c5d96",
    fontSize: 14,
    lineHeight: 1.6,
    fontWeight: 700,
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
  robotBox: {
    marginTop: 18,
    borderRadius: 18,
    border: "1px solid rgba(120, 170, 220, 0.16)",
    background: "#f8fbff",
    padding: 16,
  },
  robotTitle: {
    display: "block",
    fontSize: 14,
    color: "#0d2c49",
    marginBottom: 8,
  },
  robotText: {
    margin: 0,
    color: "#4e6a84",
    lineHeight: 1.6,
    fontSize: 14,
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