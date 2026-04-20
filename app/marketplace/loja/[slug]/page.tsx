"use client";

import Link from "next/link";
import { use, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

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

const STORAGE_KEY_PRODUTOS = "aurora_marketplace_produtos";
const STORAGE_KEY_INTERESSE = "aurora_marketplace_interesse_produto";

function formatarSlug(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function lerProdutos(): Produto[] {
  try {
    const bruto = localStorage.getItem(STORAGE_KEY_PRODUTOS);
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

export default function LojaSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const slugAtual = resolvedParams?.slug || "loja-aurora";

  const [montado, setMontado] = useState(false);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    setMontado(true);
    setProdutos(lerProdutos());
  }, []);

  const produtosDisponiveis = useMemo(() => {
    return produtos.filter((item) => item.status === "Disponível");
  }, [produtos]);

  const nomesBase = produtosDisponiveis.map((item) => item.nome).filter(Boolean);
  const nomeLojaBase = nomesBase[0] ? `Loja ${nomesBase[0]}` : "Loja Aurora";
  const slugEsperado = formatarSlug(nomeLojaBase) || "loja-aurora";

  const tituloLoja =
    slugAtual === slugEsperado
      ? nomeLojaBase
      : slugAtual.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

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
            <span style={styles.kicker}>Aurora Marketplace • Loja pública</span>
            <h1 style={styles.title}>{tituloLoja.toUpperCase()}</h1>
            <p style={styles.lead}>
              Página pública inicial da loja do vendedor. Esta camada já prepara o
              caminho para divulgação com link próprio e leitura real dos produtos disponíveis.
            </p>
          </div>

          <div style={styles.heroActions}>
            <Link href="/marketplace/vendedor/vitrine" style={styles.linkGhost}>
              Voltar à vitrine
            </Link>
            <Link href="/marketplace/vendedor" style={styles.linkPrimary}>
              Área do vendedor
            </Link>
          </div>
        </div>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Slug atual</span>
            <strong style={styles.statValueSmall}>{slugAtual}</strong>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Produtos públicos</span>
            <strong style={styles.statValue}>{montado ? produtosDisponiveis.length : "—"}</strong>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Modo atual</span>
            <strong style={styles.statValueSmall}>Leitura local</strong>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Próxima camada</span>
            <strong style={styles.statValueSmall}>Pedido / interesse</strong>
          </div>
        </div>
      </section>

      <section style={styles.panel}>
        <div style={styles.panelHeader}>
          <div>
            <span style={styles.panelKicker}>Link da loja</span>
            <h2 style={styles.panelTitle}>Página pública compartilhável</h2>
            <p style={styles.panelText}>
              Agora a loja já tem uma rota própria dentro do Marketplace. Nesta fase
              a leitura ainda usa os produtos locais disponíveis.
            </p>
          </div>
        </div>

        <div style={styles.slugBox}>
          <span style={styles.slugLabel}>Rota pública atual</span>
          <code style={styles.slugCode}>{`/marketplace/loja/${slugAtual}`}</code>
        </div>

        {mensagem ? <div style={styles.alert}>{mensagem}</div> : null}

        {!montado ? (
          <div style={styles.emptyState}>
            <strong style={styles.emptyTitle}>Carregando loja pública...</strong>
            <p style={styles.emptyText}>
              Estamos lendo os produtos reais da loja para montar a vitrine pública.
            </p>
          </div>
        ) : produtosDisponiveis.length === 0 ? (
          <div style={styles.emptyState}>
            <strong style={styles.emptyTitle}>Nenhum produto disponível nesta loja</strong>
            <p style={styles.emptyText}>
              Cadastre produtos e marque como disponível para publicar esta loja com vitrine real.
            </p>
          </div>
        ) : (
          <div style={styles.productsGrid}>
            {produtosDisponiveis.map((produto) => (
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
    wordBreak: "break-word",
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
};