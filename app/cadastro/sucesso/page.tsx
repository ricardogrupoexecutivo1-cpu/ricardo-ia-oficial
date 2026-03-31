import Link from "next/link";

type SearchParams = Promise<{
  next?: string;
  email?: string;
}>;

function isSafeInternalPath(value?: string) {
  if (!value) return false;
  return value.startsWith("/") && !value.startsWith("//");
}

export default async function CadastroSucessoPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const nextPath = isSafeInternalPath(params?.next)
    ? params.next!
    : "/chat";

  const email = params?.email?.trim() || "";

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(16,185,129,0.20), transparent 22%), linear-gradient(180deg, #07111f 0%, #08101a 35%, #05080f 100%)",
        color: "#f8fafc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: 760,
          borderRadius: 28,
          padding: "32px 24px",
          background: "rgba(8, 15, 28, 0.9)",
          border: "1px solid rgba(34, 197, 94, 0.22)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.30)",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 14px",
            borderRadius: 999,
            background: "rgba(15, 23, 42, 0.72)",
            border: "1px solid rgba(148, 163, 184, 0.18)",
            fontSize: 13,
            color: "#cbd5e1",
            marginBottom: 18,
          }}
        >
          <span>✅</span>
          <span>AURORA IA • CADASTRO REALIZADO</span>
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: "clamp(2rem, 5vw, 3.2rem)",
            lineHeight: 1.05,
            fontWeight: 900,
            letterSpacing: "-0.03em",
          }}
        >
          Cadastro realizado com sucesso
        </h1>

        <p
          style={{
            marginTop: 18,
            marginBottom: 0,
            color: "#dbeafe",
            fontSize: 17,
            lineHeight: 1.75,
            maxWidth: 680,
          }}
        >
          Seu acesso inicial já foi criado. Agora você pode continuar e
          completar seus dados para liberar mais recursos, organizar melhor seu
          perfil e fortalecer sua presença na plataforma.
        </p>

        {email ? (
          <div
            style={{
              marginTop: 18,
              padding: "14px 16px",
              borderRadius: 16,
              background: "rgba(15, 23, 42, 0.72)",
              border: "1px solid rgba(148, 163, 184, 0.16)",
              color: "#e2e8f0",
              fontSize: 15,
              lineHeight: 1.6,
            }}
          >
            <strong>E-mail cadastrado:</strong> {email}
          </div>
        ) : null}

        <div
          style={{
            display: "grid",
            gap: 12,
            marginTop: 22,
            color: "#e2e8f0",
            fontSize: 15,
          }}
        >
          <div>⚡ Entrada rápida feita com sucesso</div>
          <div>🔥 Agora é hora de completar os dados</div>
          <div>
            🌍 ricardoiaoficial.com em constante atualização e expansão
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 14,
            marginTop: 28,
          }}
        >
          <Link
            href={nextPath}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 54,
              padding: "0 22px",
              borderRadius: 16,
              background: "linear-gradient(135deg, #22c55e 0%, #14b8a6 100%)",
              color: "#03130d",
              textDecoration: "none",
              fontWeight: 900,
              boxShadow: "0 20px 50px rgba(20,184,166,0.28)",
            }}
          >
            👉 CLIQUE AQUI PARA COMPLETAR SEUS DADOS
          </Link>

          <Link
            href="/chat"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 54,
              padding: "0 22px",
              borderRadius: 16,
              background: "transparent",
              color: "#f8fafc",
              textDecoration: "none",
              fontWeight: 900,
              border: "1px solid rgba(248,250,252,0.24)",
            }}
          >
            💬 IR PARA O CHAT
          </Link>
        </div>

        <div
          style={{
            marginTop: 26,
            padding: "16px 18px",
            borderRadius: 18,
            background: "rgba(34, 197, 94, 0.10)",
            border: "1px solid rgba(34, 197, 94, 0.18)",
            color: "#dcfce7",
            lineHeight: 1.75,
            fontSize: 15,
          }}
        >
          <strong>Importante:</strong> use esta tela após o cadastro inicial.
          Quando for ligar no formulário, basta redirecionar para:
          <br />
          <strong>
            /cadastro/sucesso?next=/chat
          </strong>
          <br />
          ou para a rota completa que você quiser continuar depois.
        </div>
      </section>
    </main>
  );
}