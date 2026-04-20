"use client";

import Link from "next/link";
import { ChangeEvent, useEffect, useMemo, useState } from "react";

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

function carregarProdutos(): Produto[] {
  if (typeof window === "undefined") return [];

  try {
    const bruto = localStorage.getItem(STORAGE_KEY);
    if (!bruto) return [];

    const dados = JSON.parse(bruto);
    if (!Array.isArray(dados)) return [];

    return dados.map((item) => ({
      id: String(item?.id ?? Date.now()),
      nome: String(item?.nome ?? ""),
      preco: String(item?.preco ?? ""),
      categoria: String(item?.categoria ?? ""),
      estoque: String(item?.estoque ?? ""),
      status: (["Disponível", "Pausado", "Rascunho"].includes(item?.status)
        ? item.status
        : "Disponível") as ProdutoStatus,
      imagem: String(item?.imagem ?? ""),
      descricao: String(item?.descricao ?? ""),
      criadoEm: String(item?.criadoEm ?? new Date().toISOString()),
    }));
  } catch {
    return [];
  }
}

export default function MarketplaceVendedorProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [mensagem, setMensagem] = useState("");

  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [categoria, setCategoria] = useState("");
  const [estoque, setEstoque] = useState("");
  const [status, setStatus] = useState<ProdutoStatus>("Disponível");
  const [imagem, setImagem] = useState("");
  const [descricao, setDescricao] = useState("");

  useEffect(() => {
    setProdutos(carregarProdutos());
  }, []);

  function persistir(lista: Produto[]) {
    setProdutos(lista);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
  }

  function onSelecionarImagem(event: ChangeEvent<HTMLInputElement>) {
    const arquivo = event.target.files?.[0];
    if (!arquivo) return;

    const reader = new FileReader();
    reader.onload = () => {
      const resultado = typeof reader.result === "string" ? reader.result : "";
      setImagem(resultado);
    };
    reader.readAsDataURL(arquivo);
  }

  function salvarProduto() {
    const nomeLimpo = nome.trim();
    const precoLimpo = preco.trim();
    const categoriaLimpa = categoria.trim();
    const estoqueLimpo = estoque.trim();
    const descricaoLimpa = descricao.trim();

    if (!nomeLimpo || !precoLimpo) {
      setMensagem("Preencha pelo menos nome e preço do produto.");
      return;
    }

    const novoProduto: Produto = {
      id: crypto.randomUUID(),
      nome: nomeLimpo,
      preco: precoLimpo,
      categoria: categoriaLimpa,
      estoque: estoqueLimpo,
      status,
      imagem,
      descricao: descricaoLimpa,
      criadoEm: new Date().toISOString(),
    };

    const listaAtualizada = [novoProduto, ...produtos];
    persistir(listaAtualizada);

    setNome("");
    setPreco("");
    setCategoria("");
    setEstoque("");
    setStatus("Disponível");
    setImagem("");
    setDescricao("");
    setMensagem("Produto salvo localmente com sucesso. Esta etapa já prepara a próxima ligação com a vitrine.");
  }

  function removerProduto(id: string) {
    const listaAtualizada = produtos.filter((produto) => produto.id !== id);
    persistir(listaAtualizada);
    setMensagem("Produto removido da base local do vendedor.");
  }

  const resumo = useMemo(() => {
    const total = produtos.length;
    const disponiveis = produtos.filter((item) => item.status === "Disponível").length;
    const pausados = produtos.filter((item) => item.status === "Pausado").length;
    const rascunhos = produtos.filter((item) => item.status === "Rascunho").length;

    return { total, disponiveis, pausados, rascunhos };
  }, [produtos]);

  return (
    <main style={styles.page}>
      <div style={styles.bgGlowTop} />
      <div style={styles.bgGlowBottom} />

      <section style={styles.heroCard}>
        <div style={styles.heroHeader}>
          <div>
            <span style={styles.kicker}>Aurora Marketplace • Produtos do vendedor</span>
            <h1 style={styles.title}>PRODUTOS REAIS</h1>
            <p style={styles.lead}>
              Página isolada para cadastrar produtos reais da loja, organizar catálogo e preparar a vitrine pública com conteúdo de verdade.
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
            <span style={styles.statLabel}>Produtos</span>
            <strong style={styles.statValue}>{resumo.total}</strong>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Disponíveis</span>
            <strong style={styles.statValue}>{resumo.disponiveis}</strong>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Pausados</span>
            <strong style={styles.statValue}>{resumo.pausados}</strong>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Rascunhos</span>
            <strong style={styles.statValue}>{resumo.rascunhos}</strong>
          </div>
        </div>
      </section>

      <section style={styles.contentGrid}>
        <div style={styles.panel}>
          <div style={styles.panelHeader}>
            <div>
              <span style={styles.panelKicker}>Cadastro do produto</span>
              <h2 style={styles.panelTitle}>Monte seu catálogo real</h2>
              <p style={styles.panelText}>
                Nesta etapa, o vendedor começa a cadastrar os produtos que depois irão aparecer na vitrine.
              </p>
            </div>
          </div>

          <div style={styles.formGrid}>
            <div style={styles.field}>
              <label style={styles.label}>Nome do produto</label>
              <input
                style={styles.input}
                placeholder="Ex.: Curso Aurora Premium"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Preço</label>
              <input
                style={styles.input}
                placeholder="Ex.: R$ 197,00"
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Categoria</label>
              <input
                style={styles.input}
                placeholder="Ex.: Cursos, moda, beleza..."
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Estoque ou quantidade</label>
              <input
                style={styles.input}
                placeholder="Ex.: 12 unidades"
                value={estoque}
                onChange={(e) => setEstoque(e.target.value)}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Status</label>
              <select
                style={styles.input}
                value={status}
                onChange={(e) => setStatus(e.target.value as ProdutoStatus)}
              >
                <option value="Disponível">Disponível</option>
                <option value="Pausado">Pausado</option>
                <option value="Rascunho">Rascunho</option>
              </select>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Imagem real do produto</label>
              <label style={styles.uploadBox}>
                <span style={styles.uploadTitle}>Selecionar imagem</span>
                <span style={styles.uploadText}>
                  PNG, JPG ou WEBP. A imagem será salva localmente nesta fase.
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={onSelecionarImagem}
                  style={{ display: "none" }}
                />
              </label>
            </div>

            <div style={{ ...styles.field, gridColumn: "1 / -1" }}>
              <label style={styles.label}>Descrição do produto</label>
              <textarea
                style={styles.textarea}
                placeholder="Descreva o produto, diferenciais e detalhes importantes."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                rows={5}
              />
            </div>
          </div>

          {imagem ? (
            <div style={styles.previewWrap}>
              <span style={styles.previewLabel}>Prévia da imagem</span>
              <img src={imagem} alt="Prévia do produto" style={styles.previewImage} />
            </div>
          ) : null}

          <div style={styles.buttonRow}>
            <button type="button" onClick={salvarProduto} style={styles.primaryButton}>
              Salvar produto
            </button>

            <Link href="/marketplace/vendedor/vitrine" style={styles.secondaryButton}>
              Ver vitrine
            </Link>
          </div>

          {mensagem ? <div style={styles.alert}>{mensagem}</div> : null}
        </div>

        <div style={styles.sideColumn}>
          <div style={styles.sideCard}>
            <span style={styles.panelKicker}>Leitura rápida</span>
            <h3 style={styles.sideTitle}>Resumo do catálogo</h3>
            <p style={styles.sideText}>
              Fotografia rápida da operação atual dos produtos do vendedor.
            </p>

            <div style={styles.resumeList}>
              <div style={styles.resumeItem}>
                <span>Total de produtos</span>
                <strong>{resumo.total}</strong>
              </div>
              <div style={styles.resumeItem}>
                <span>Disponíveis</span>
                <strong>{resumo.disponiveis}</strong>
              </div>
              <div style={styles.resumeItem}>
                <span>Pausados</span>
                <strong>{resumo.pausados}</strong>
              </div>
              <div style={styles.resumeItem}>
                <span>Rascunhos</span>
                <strong>{resumo.rascunhos}</strong>
              </div>
            </div>
          </div>

          <div style={styles.sideCard}>
            <span style={styles.panelKicker}>Próximo passo</span>
            <h3 style={styles.sideTitle}>Depois desta área, ligamos os produtos reais à vitrine</h3>
            <p style={styles.sideText}>
              A sequência correta é fazer a vitrine pública ler os produtos salvos e substituir os exemplos pelos itens reais da loja.
            </p>

            <div style={styles.sideActions}>
              <Link href="/marketplace/vendedor/vitrine" style={styles.linkPrimaryBlock}>
                Voltar à vitrine
              </Link>
              <Link href="/marketplace/vendedor" style={styles.linkGhostBlock}>
                Voltar à área do vendedor
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section style={styles.panel}>
        <div style={styles.panelHeader}>
          <div>
            <span style={styles.panelKicker}>Produtos cadastrados</span>
            <h2 style={styles.panelTitle}>Sua base real de itens</h2>
            <p style={styles.panelText}>
              Aqui ficam os produtos salvos localmente enquanto estruturamos a próxima ligação com a vitrine.
            </p>
          </div>
        </div>

        {produtos.length === 0 ? (
          <div style={styles.emptyState}>
            <strong style={styles.emptyTitle}>Nenhum produto salvo ainda</strong>
            <p style={styles.emptyText}>
              Cadastre o primeiro item real da loja para começar a formar sua vitrine pública.
            </p>
          </div>
        ) : (
          <div style={styles.productsGrid}>
            {produtos.map((produto) => (
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
                    <span>Categoria:</span>
                    <strong>{produto.categoria || "Não informada"}</strong>
                  </div>
                  <div style={styles.metaItem}>
                    <span>Estoque:</span>
                    <strong>{produto.estoque || "Não informado"}</strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removerProduto(produto.id)}
                  style={styles.removeButton}
                >
                  Remover
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
  uploadBox: {
    minHeight: 110,
    borderRadius: 20,
    border: "1.5px dashed rgba(24, 146, 236, 0.35)",
    background: "linear-gradient(180deg, #fafdff 0%, #eef7ff 100%)",
    padding: 18,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    cursor: "pointer",
  },
  uploadTitle: {
    fontSize: 15,
    fontWeight: 800,
    color: "#0c4e84",
    marginBottom: 6,
  },
  uploadText: {
    fontSize: 14,
    lineHeight: 1.55,
    color: "#5c7893",
  },
  previewWrap: {
    marginTop: 20,
    background: "#f7fbff",
    borderRadius: 22,
    padding: 18,
    border: "1px solid rgba(120, 170, 220, 0.16)",
  },
  previewLabel: {
    display: "block",
    fontSize: 13,
    fontWeight: 800,
    color: "#167bc8",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  previewImage: {
    width: "100%",
    maxWidth: 320,
    height: "auto",
    objectFit: "cover",
    borderRadius: 18,
    display: "block",
    border: "1px solid rgba(120, 170, 220, 0.18)",
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
    textDecoration: "none",
    borderRadius: 16,
    padding: "14px 20px",
    background: "#f4fbff",
    color: "#0c5d96",
    fontWeight: 800,
    fontSize: 15,
    border: "1px solid rgba(99, 163, 214, 0.24)",
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
    textTransform: "uppercase",
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
  removeButton: {
    marginTop: 18,
    width: "100%",
    minHeight: 46,
    borderRadius: 14,
    border: "1px solid rgba(213, 89, 89, 0.18)",
    background: "#fff5f5",
    color: "#b54747",
    fontWeight: 800,
    cursor: "pointer",
  },
};