import Link from "next/link";

type CadastroSucessoPageProps = {
  searchParams?: Promise<{
    email?: string;
    id?: string;
    status?: string;
  }>;
};

export default async function CadastroSucessoPage({
  searchParams,
}: CadastroSucessoPageProps) {
  const resolvedSearchParams = searchParams
    ? await searchParams
    : undefined;

  const email = resolvedSearchParams?.email || "";
  const id = resolvedSearchParams?.id || "";

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #03110d 0%, #071712 38%, #030504 100%)",
        color: "#ecfdf5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        style={{
          maxWidth: 640,
          width: "100%",
          borderRadius: 24,
          padding: "28px",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          display: "grid",
          gap: 18,
          textAlign: "center",
          boxShadow: "0 18px 60px rgba(0,0,0,0.28)",
        }}
      >
        <div
          style={{
            fontSize: 24,
            fontWeight: 900,
            color: "#4ade80",
            lineHeight: 1.2,
          }}
        >
          ✅ Cadastro realizado com sucesso
        </div>

        <div
          style={{
            fontSize: 16,
            lineHeight: 1.7,
            color: "rgba(236,253,245,0.88)",
          }}
        >
          Seu cadastro foi salvo com segurança na Aurora.
          <br />
          Agora você já faz parte do ecossistema.
        </div>

        {email ? (
          <div
            style={{
              fontSize: 13,
              color: "rgba(236,253,245,0.72)",
              wordBreak: "break-word",
            }}
          >
            E-mail utilizado: <strong>{email}</strong>
          </div>
        ) : null}

        {id ? (
          <div
            style={{
              fontSize: 12,
              color: "rgba(236,253,245,0.52)",
              wordBreak: "break-all",
            }}
          >
            ID do cadastro: {id}
          </div>
        ) : null}

        <div
          style={{
            borderRadius: 16,
            padding: "14px",
            background: "rgba(34,197,94,0.08)",
            border: "1px solid rgba(34,197,94,0.20)",
            fontSize: 14,
            lineHeight: 1.6,
            color: "rgba(236,253,245,0.88)",
          }}
        >
          🔒 Seu cadastro permanece protegido. A publicação pública só acontece
          quando você ativar no Guardião.
        </div>

        <div
          style={{
            borderRadius: 16,
            padding: "14px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            fontSize: 14,
            lineHeight: 1.6,
            color: "rgba(236,253,245,0.78)",
          }}
        >
          Sistema em constante atualização. Pode haver momentos de instabilidade
          durante melhorias e novas liberações.
        </div>

        <div
          style={{
            display: "grid",
            gap: 10,
          }}
        >
          <Link href="/guardiao" style={primaryButtonStyle}>
            Ir para o Guardião
          </Link>

          <Link href="/chat" style={secondaryButtonStyle}>
            Abrir Aurora IA
          </Link>

          <Link href="/" style={secondaryButtonStyle}>
            Voltar para Home
          </Link>
        </div>
      </div>
    </main>
  );
}

const primaryButtonStyle: React.CSSProperties = {
  textDecoration: "none",
  padding: "14px 16px",
  borderRadius: 14,
  background: "linear-gradient(135deg, #22c55e, #4ade80)",
  color: "#04110a",
  fontWeight: 900,
  display: "inline-flex",
  justifyContent: "center",
  alignItems: "center",
};

const secondaryButtonStyle: React.CSSProperties = {
  textDecoration: "none",
  padding: "14px 16px",
  borderRadius: 14,
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.10)",
  color: "#ecfdf5",
  fontWeight: 800,
  display: "inline-flex",
  justifyContent: "center",
  alignItems: "center",
};