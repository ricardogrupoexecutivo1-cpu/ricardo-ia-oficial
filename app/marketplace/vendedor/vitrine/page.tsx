"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

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

const STORAGE_KEY = "aurora_marketplace_produtos";
const STORAGE_KEY_INTERESSE = "aurora_marketplace_interesse_produto";

function carregarProdutos(): Produto[] {
  if (typeof window === "undefined") return [];

  try {
    const bruto = localStorage.getItem(STORAGE_KEY);
    if (!bruto) return [];

    const dados = JSON.parse(bruto);
    if (!Array.isArray(dados)) return [];

    return dados.map((item) => ({
      id: String(item?.id ?? ""),
      nome: String(item?.nome ?? ""),
      preco: String(item?.preco ?? ""),
      categoria: String(item?.categoria ?? ""),
      estoque: String(item?.estoque ?? ""),
      status: (["Disponível", "Pausado", "Rascunho"].includes(item?.status)
        ? item.status
        : "Disponível") as ProdutoStatus,
      imagem: String(item?.imagem ?? ""),
      descricao: String(item?.descricao ?? ""),
      criadoEm: String(item?.criadoEm ?? ""),
    }));
  } catch {
    return [];
  }
}

function formatarSlug(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function MarketplaceVendedorVitrinePage() {
  const router = useRouter();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [mensagem, setMensagem] = useState("");

  const recarregarProdutos = useCallback(() => {
    setProdutos(carregarProdutos());
  }, []);

  useEffect(() => {
    recarregarProdutos();

    function onFocus() {
      recarregarProdutos();
    }

    function onVisibilityChange() {
      if (!document.hidden) {
        recarregarProdutos();
      }
    }

    function onStorage(event: StorageEvent) {
      if (!event.key || event.key === STORAGE_KEY) {
        recarregarProdutos();
      }
    }

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("storage", onStorage);
    };
  }, [recarregarProdutos]);

  const produtosPublicos = useMemo(() => {
    return produtos.filter((item) => item.status === "Disponível");
  }, [produtos]);

  const primeiroNome = produtosPublicos[0]?.nome || "loja-aurora";
  const slugLoja = formatarSlug(`Loja ${primeiroNome}`) || "loja-aurora";
  const linkLoja = `/marketplace/loja/${slugLoja}`;

  function registrarInteresse(produto: Produto) {
    try {
      localStorage.setItem(STORAGE_KEY_INTERESSE, JSON.stringify(produto));
      setMensagem(`Interesse preparado para: ${produto.nome}`);
      router.push("/marketplace/interesse");
    } catch {
      setMensagem("Não foi possível preparar o interesse deste produto.");
    }
  }

  return (
    <main style={styles.page}>
      <div style={styles.bgGlowTop} />
      <div style={styles.bgGlowBottom} />

      <section style={styles.heroCard}>
        <div style={styles.heroHeader}>
          <div>
            <span style={styles.kicker}>Aurora Marketplace • Vitrine do vendedor</span>
            <h1 style={styles.title}>VITRINE PÚBLICA DA LOJA</h1>
            <p style={styles.lead}>
              Esta é a leitura pública inicial da loja do vendedor. Agora a vitrine já busca os produtos reais salvos localmente e substitui os exemplos fixos pelos itens verdadeiros do catálogo.
            </p>
          </div>

          <div style={styles.heroActions}>
            <Link href="/marketplace/vendedor/produtos" style={styles.linkGhost}>
              Cadastrar produtos
            </Link>
            <Link href="/marketplace/vendedor" style={styles.linkPrimary}>
              Área do vendedor
            </Link>
          </div>
        </div>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Produtos públicos</span>
            <strong style={styles.statValue}>{produtosPublicos.length}</strong>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Modo atual</span>
            <strong style={styles.statValueSmall}>Leitura local</strong>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Origem</span>
            <strong style={styles.statValueSmall}>Produtos reais</strong>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Loja pública</span>
            <strong style={styles.statValueSmall}>{slugLoja}</strong>
          </div>
        </div>
      </section>

      <section style={styles.contentGrid}>
        <div style={styles.panel}>
          <div style={styles.panelHeader}>
            <div>
              <span style={styles.panelKicker}>Leitura pública</span>
              <h2 style={styles.panelTitle}>Produtos reais da vitrine</h2>
              <p style={styles.panelText}>
                Nesta etapa, a vitrine já está lendo somente os itens marcados como <strong>Disponível</strong>. Produtos pausados ou em rascunho ficam fora da exibição pública.
              </p>
            </div>
          </div>

          <div style={styles.slugBox}>
            <span style={styles.slugLabel}>Link público da loja</span>
            <code style={styles.slugCode}>{linkLoja}</code>

            <div style={styles.slugActions}>
              <Link href={linkLoja} style={styles.linkPrimaryBlock}>
                Abrir loja pública
              </Link>
            </div>
          </div>

          {mensagem ? <div style={styles.alert}>{mensagem}</div> : null}

          {produtosPublicos.length === 0 ? (
            <div style={styles.emptyState}>
              <strong style={styles.emptyTitle}>Sua vitrine ainda está vazia</strong>
              <p style={styles.emptyText}>
                Cadastre produtos reais na área do vendedor e marque como disponível para que eles apareçam aqui com imagem, preço e descrição.
              </p>

              <div style={styles.emptyActions}>
                <Link href="/marketplace/vendedor/produtos" style={styles.linkPrimaryBlock}>
                  Cadastrar produtos agora
                </Link>
                <Link href="/marketplace/vendedor" style={styles.linkGhostBlock}>
                  Voltar à área do vendedor
                </Link>
              </div>
            </div>
          ) : (
            <div style={styles.productsGrid}>
              {produtosPublicos.map((produto) => (
                <article key={produto.id} style={styles.productCard}>
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

                  <button
                    type="button"
                    style={styles.buyButton}
                    onClick={() => registrarInteresse(produto)}
                  >
                    Tenho interesse
                  </button>
                </article>
              ))}
            </div>
          )}
        </div>

        <div style={styles.sideColumn}>
          <div style={styles.sideCard}>
            <span style={styles.panelKicker}>Status desta fase</span>
            <h3 style={styles.sideTitle}>Ligação local concluída</h3>
            <p style={styles.sideText}>
              A vitrine pública do vendedor já consegue ler a base local dos produtos reais e mostrar os itens disponíveis com imagem.
            </p>

            <div style={styles.resumeList}>
              <div style={styles.resumeItem}>
                <span>Fonte dos dados</span>
                <strong>localStorage</strong>
              </div>
              <div style={styles.resumeItem}>
                <span>Filtro público</span>
                <strong>Somente disponíveis</strong>
              </div>
              <div style={styles.resumeItem}>
                <span>Imagem real</span>
                <strong>Ativa</strong>
              </div>
              <div style={styles.resumeItem}>
                <span>Loja pronta</span>
                <strong>Link ativo</strong>
              </div>
            </div>
          </div>

          <div style={styles.sideCard}>
            <span style={styles.panelKicker}>Próximo passo</span>
            <h3 style={styles.sideTitle}>Ligar interesse ao pedido</h3>
            <p style={styles.sideText}>
              Depois desta ligação local, o próximo avanço correto é conectar o botão de interesse com pedido, dados do comprador e histórico.
            </p>

            <div style={styles.sideActions}>
              <Link href="/marketplace/vendedor/produtos" style={styles.linkPrimaryBlock}>
                Voltar para produtos
              </Link>
              <Link href={linkLoja} style={styles.linkGhostBlock}>
                Ver loja pública
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
    background:
      "linear-gradient(180deg, #eef8ff 0%, #f7fbff 40%, #ffffff 100%)",
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
  slugBox: {
    borderRadius: 20,
    border: "1px solid rgba(120, 170, 220, 0.18)",
    background: "#f8fbff",
    padding: 18,
    marginBottom: 24,
  },
  slugLabel: {
    display: "block",
    fontSize: 13,
    fontWeight: 800,
    color: "#167bc8",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  slugCode: {
    display: "block",
    fontSize: 16,
    color: "#0d2c49",
    wordBreak: "break-all",
  },
  slugActions: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    marginTop: 16,
  },
  alert: {
    marginBottom: 18,
    borderRadius: 18,
    padding: "16px 18px",
    background: "#eef8ff",
    border: "1px solid rgba(84, 166, 226, 0.24)",
    color: "#174b73",
    lineHeight: 1.6,
    fontWeight: 600,
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
  emptyActions: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    marginTop: 20,
  },
  productsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 18,
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
  buyButton: {
    marginTop: 18,
    width: "100%",
    minHeight: 46,
    borderRadius: 14,
    border: "none",
    background: "linear-gradient(135deg, #08a2ff 0%, #0a76cf 100%)",
    color: "#fff",
    fontWeight: 800,
    cursor: "pointer",
    boxShadow: "0 18px 40px rgba(0, 122, 204, 0.18)",
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