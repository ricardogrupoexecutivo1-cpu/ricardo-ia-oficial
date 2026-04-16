"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ImoveisPage() {
  const [isLogged, setIsLogged] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const imobiliariaId = localStorage.getItem("imobiliaria_id");
    setIsLogged(!!imobiliariaId);
    setLoading(false);
  }, []);

  if (loading) {
    return <div style={{ padding: 60, textAlign: "center" }}>Carregando...</div>;
  }

  return (
    <div style={mainStyle}>
      <div style={containerStyle}>
        <h1 style={titleStyle}>🏡 Aurora Imóveis</h1>
        <p style={subtitleStyle}>
          Publique seus imóveis, encontre oportunidades e gere negócios com mais inteligência.
        </p>

        <div style={cardsGrid}>
          {!isLogged ? (
            <>
              <Link href="/imobiliarias/cadastrar" style={cardStyle}>
                <div style={iconStyle}>🏢</div>
                <h3>Cadastrar Imobiliária</h3>
                <p>Cadastre sua imobiliária para começar a anunciar</p>
                <span style={actionBtn}>Cadastrar Imobiliária →</span>
              </Link>

              <Link href="/imoveis/busca" style={cardStyle}>
                <div style={iconStyle}>🔍</div>
                <h3>Buscar Imóveis</h3>
                <p>Encontre apartamentos, casas e oportunidades</p>
                <span style={actionBtn}>Explorar Imóveis →</span>
              </Link>
            </>
          ) : (
            <>
              <Link href="/imoveis/imovel/cadastrar" style={cardStyle}>
                <div style={iconStyle}>🏠</div>
                <h3>Cadastrar Novo Imóvel</h3>
                <p>Publique seu imóvel agora</p>
                <span style={actionBtn}>Cadastrar Imóvel →</span>
              </Link>

              <Link href="/imoveis/busca" style={cardStyle}>
                <div style={iconStyle}>🔍</div>
                <h3>Buscar Imóveis</h3>
                <p>Encontre oportunidades</p>
                <span style={actionBtn}>Explorar Imóveis →</span>
              </Link>

              <Link href="/imobiliarias/minha" style={cardStyle}>
                <div style={iconStyle}>👤</div>
                <h3>Minha Imobiliária</h3>
                <p>Gerencie seus imóveis</p>
                <span style={actionBtn}>Ver Minha Área →</span>
              </Link>
            </>
          )}
        </div>

        {!isLogged && (
          <p style={noteStyle}>
            Primeiro cadastre sua imobiliária para liberar todas as funcionalidades.
          </p>
        )}
      </div>
    </div>
  );
}

/* ==================== ESTILOS ==================== */
const mainStyle = {
  minHeight: "100vh",
  background: "#f8fafc",
  padding: "60px 20px",
  color: "#0f172a",
};

const containerStyle = { maxWidth: 1100, margin: "0 auto" };

const titleStyle = { 
  fontSize: 42, 
  fontWeight: 900, 
  marginBottom: 12, 
  textAlign: "center" as const 
};

const subtitleStyle = { 
  fontSize: 19, 
  color: "#475569", 
  textAlign: "center" as const, 
  marginBottom: 50 
};

const cardsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
  gap: 24,
};

const cardStyle = {
  background: "#ffffff",
  borderRadius: 20,
  padding: 32,
  border: "1px solid #e2e8f0",
  textDecoration: "none",
  color: "#0f172a",
  boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
  textAlign: "center" as const,
};

const iconStyle = { fontSize: 48, marginBottom: 16 };

const actionBtn = {
  display: "inline-block",
  marginTop: 20,
  padding: "10px 20px",
  background: "#0f172a",
  color: "#fff",
  borderRadius: 999,
  fontWeight: 700,
};

const noteStyle = {
  textAlign: "center" as const,
  marginTop: 50,
  color: "#64748b",
  fontSize: 15,
};