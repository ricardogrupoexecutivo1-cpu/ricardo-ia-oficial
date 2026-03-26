"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

type Corretor = {
  slug: string;
  nome: string;
  titulo: string;
  cidade: string;
  estado: string;
  whatsapp: string;
  email: string;
  descricao: string;
  foto: string;
};

type Imovel = {
  id: string;
  corretorSlug: string;
  titulo: string;
  tipo: string;
  finalidade: string;
  preco: string;
  local: string;
  area: string;
  quartos?: string;
  banheiros?: string;
  vagas?: string;
  imagem: string;
};

const corretores: Corretor[] = [
  {
    slug: "joao-silva",
    nome: "João Silva",
    titulo: "Corretor de imóveis",
    cidade: "Belo Horizonte",
    estado: "MG",
    whatsapp: "55319997490074",
    email: "joao@auroraimoveis.com",
    descricao:
      "Especialista em imóveis residenciais e comerciais, com foco em atendimento consultivo, velocidade de resposta e geração de oportunidades reais.",
    foto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
  },
  {
    slug: "mariana-costa",
    nome: "Mariana Costa",
    titulo: "Consultora imobiliária",
    cidade: "Lagoa Santa",
    estado: "MG",
    whatsapp: "55319997490074",
    email: "mariana@auroraimoveis.com",
    descricao:
      "Atuação em venda e locação com atenção total à experiência do cliente, apresentação premium dos imóveis e negociação prática.",
    foto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
  },
];

const imoveis: Imovel[] = [
  {
    id: "1",
    corretorSlug: "joao-silva",
    titulo: "Casa moderna com área gourmet",
    tipo: "Casa",
    finalidade: "Venda",
    preco: "R$ 890.000",
    local: "Pampulha, Belo Horizonte - MG",
    area: "220 m²",
    quartos: "3 quartos",
    banheiros: "3 banheiros",
    vagas: "2 vagas",
    imagem: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "2",
    corretorSlug: "joao-silva",
    titulo: "Cobertura com vista e acabamento premium",
    tipo: "Cobertura",
    finalidade: "Venda",
    preco: "R$ 1.250.000",
    local: "Centro-Sul, Belo Horizonte - MG",
    area: "260 m²",
    quartos: "4 quartos",
    banheiros: "4 banheiros",
    vagas: "3 vagas",
    imagem: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "3",
    corretorSlug: "mariana-costa",
    titulo: "Apartamento pronto para morar",
    tipo: "Apartamento",
    finalidade: "Venda",
    preco: "R$ 420.000",
    local: "Centro, Lagoa Santa - MG",
    area: "78 m²",
    quartos: "2 quartos",
    banheiros: "2 banheiros",
    vagas: "1 vaga",
    imagem: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "4",
    corretorSlug: "mariana-costa",
    titulo: "Casa com quintal e ótima iluminação",
    tipo: "Casa",
    finalidade: "Venda",
    preco: "R$ 560.000",
    local: "São Benedito, Santa Luzia - MG",
    area: "160 m²",
    quartos: "3 quartos",
    banheiros: "2 banheiros",
    vagas: "2 vagas",
    imagem: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80",
  },
];

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top, rgba(34,197,94,0.10), transparent 20%), radial-gradient(circle at top right, rgba(59,130,246,0.08), transparent 24%), linear-gradient(180deg, #050505 0%, #0b0b0b 100%)",
    color: "#ffffff",
    padding: "32px 16px",
  } as React.CSSProperties,
  container: {
    maxWidth: "1280px",
    margin: "0 auto",
  } as React.CSSProperties,
  hero: {
    display: "grid",
    gridTemplateColumns: "220px 1fr",
    gap: "24px",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: "28px",
    background: "rgba(255,255,255,0.04)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
    padding: "24px",
    marginBottom: "28px",
    alignItems: "center",
  } as React.CSSProperties,
  photo: {
    width: "100%",
    height: "220px",
    objectFit: "cover" as const,
    borderRadius: "24px",
    border: "1px solid rgba(255,255,255,0.10)",
  } as React.CSSProperties,
  badge: {
    display: "inline-block",
    padding: "8px 14px",
    borderRadius: "999px",
    border: "1px solid rgba(34,197,94,0.25)",
    background: "rgba(34,197,94,0.10)",
    color: "#86efac",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.2em",
    textTransform: "uppercase" as const,
  },
  sectionTitle: {
    fontSize: "28px",
    marginBottom: "16px",
  } as React.CSSProperties,
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "18px",
  } as React.CSSProperties,
  card: {
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: "24px",
    background: "rgba(255,255,255,0.04)",
    overflow: "hidden",
    boxShadow: "0 20px 60px rgba(0,0,0,0.30)",
  } as React.CSSProperties,
  cardImage: {
    width: "100%",
    height: "180px",
    objectFit: "cover" as const,
    display: "block",
  } as React.CSSProperties,
  cardBody: {
    padding: "16px",
  } as React.CSSProperties,
  smallBadge: {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: "999px",
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(0,0,0,0.25)",
    color: "#d4d4d8",
    fontSize: "11px",
    marginRight: "8px",
    marginBottom: "8px",
  } as React.CSSProperties,
  button: {
    display: "inline-block",
    width: "100%",
    textAlign: "center" as const,
    textDecoration: "none",
    borderRadius: "16px",
    background: "#22c55e",
    color: "#000000",
    padding: "12px 16px",
    fontWeight: 700,
    marginTop: "14px",
  } as React.CSSProperties,
  infoBoxWrap: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "16px",
    marginBottom: "28px",
  } as React.CSSProperties,
  infoBox: {
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.04)",
    borderRadius: "22px",
    padding: "18px",
  } as React.CSSProperties,
};

export default function CorretorPage() {
  const params = useParams();
  const slug = String(params?.slug ?? "");

  const corretor = corretores.find((item) => item.slug === slug);
  const imoveisDoCorretor = imoveis.filter((item) => item.corretorSlug === slug);

  if (!corretor) {
    return (
      <main style={styles.page}>
        <section style={styles.container}>
          <div style={{ ...styles.infoBox, textAlign: "center" as const }}>
            <h1>Corretor não encontrado</h1>
            <p style={{ color: "#a1a1aa" }}>
              O corretor solicitado não foi localizado.
            </p>
            <Link href="/imoveis" style={styles.button}>
              Voltar para imóveis
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <section style={styles.container}>
        <div style={{ marginBottom: "16px" }}>
          <Link
            href="/imoveis"
            style={{
              display: "inline-block",
              textDecoration: "none",
              color: "#d4d4d8",
              border: "1px solid rgba(255,255,255,0.10)",
              padding: "10px 14px",
              borderRadius: "14px",
              background: "rgba(255,255,255,0.04)",
            }}
          >
            ← Voltar para imóveis
          </Link>
        </div>

        <div style={styles.hero}>
          <img src={corretor.foto} alt={corretor.nome} style={styles.photo} />

          <div>
            <div style={styles.badge}>Página do corretor</div>

            <h1 style={{ fontSize: "40px", marginTop: "18px", marginBottom: "0" }}>
              {corretor.nome}
            </h1>

            <p style={{ marginTop: "10px", fontSize: "18px", color: "#d4d4d8" }}>
              {corretor.titulo}
            </p>

            <p style={{ marginTop: "10px", color: "#a1a1aa", lineHeight: 1.8 }}>
              {corretor.descricao}
            </p>

            <div style={{ marginTop: "18px", color: "#d4d4d8", lineHeight: 1.8 }}>
              <div><strong>Região:</strong> {corretor.cidade} - {corretor.estado}</div>
              <div><strong>E-mail:</strong> {corretor.email}</div>
              <div><strong>WhatsApp:</strong> {corretor.whatsapp}</div>
            </div>

            <a
              href={`https://wa.me/${corretor.whatsapp}?text=${encodeURIComponent(`Olá, quero falar com o corretor ${corretor.nome} sobre os imóveis anunciados.`)}`}
              target="_blank"
              rel="noreferrer"
              style={{
                ...styles.button,
                maxWidth: "320px",
                marginTop: "18px",
              }}
            >
              Falar no WhatsApp
            </a>
          </div>
        </div>

        <div style={styles.infoBoxWrap}>
          <div style={styles.infoBox}>
            <div style={{ fontSize: "11px", color: "#71717a", textTransform: "uppercase", letterSpacing: "0.2em" }}>
              Perfil
            </div>
            <div style={{ marginTop: "10px", fontSize: "18px", fontWeight: 700 }}>
              Corretor independente
            </div>
          </div>

          <div style={styles.infoBox}>
            <div style={{ fontSize: "11px", color: "#71717a", textTransform: "uppercase", letterSpacing: "0.2em" }}>
              Imóveis ativos
            </div>
            <div style={{ marginTop: "10px", fontSize: "18px", fontWeight: 700 }}>
              {imoveisDoCorretor.length} anúncios
            </div>
          </div>

          <div style={styles.infoBox}>
            <div style={{ fontSize: "11px", color: "#71717a", textTransform: "uppercase", letterSpacing: "0.2em" }}>
              Plataforma
            </div>
            <div style={{ marginTop: "10px", fontSize: "18px", fontWeight: 700 }}>
              Aurora Imóveis
            </div>
          </div>
        </div>

        <h2 style={styles.sectionTitle}>Imóveis anunciados por {corretor.nome}</h2>

        <div style={styles.cardGrid}>
          {imoveisDoCorretor.map((item) => (
            <div key={item.id} style={styles.card}>
              <img src={item.imagem} alt={item.titulo} style={styles.cardImage} />

              <div style={styles.cardBody}>
                <div>
                  <span style={styles.smallBadge}>{item.finalidade}</span>
                  <span style={styles.smallBadge}>{item.tipo}</span>
                </div>

                <h3 style={{ fontSize: "20px", marginTop: "8px", marginBottom: "10px" }}>
                  {item.titulo}
                </h3>

                <div style={{ color: "#22c55e", fontWeight: 700, fontSize: "20px" }}>
                  {item.preco}
                </div>

                <p style={{ marginTop: "10px", color: "#a1a1aa", lineHeight: 1.7 }}>
                  {item.local}
                </p>

                <div style={{ marginTop: "10px", color: "#d4d4d8", lineHeight: 1.7 }}>
                  <div>{item.area}</div>
                  {item.quartos ? <div>{item.quartos}</div> : null}
                  {item.banheiros ? <div>{item.banheiros}</div> : null}
                  {item.vagas ? <div>{item.vagas}</div> : null}
                </div>

                <Link
                  href="/imoveis"
                  style={styles.button}
                >
                  Ver imóvel
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}