import type { ReactNode } from "react";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default function EditorLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(34,197,94,0.12), transparent 24%), radial-gradient(circle at right top, rgba(59,130,246,0.10), transparent 22%), #07111a",
        color: "#eef6ff",
        padding: "24px 16px 80px",
      }}
    >
      <div
        style={{
          maxWidth: 1320,
          margin: "0 auto",
          display: "grid",
          gap: 20,
        }}
      >
        <section
          style={{
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(8,16,24,0.82)",
            borderRadius: 28,
            padding: "24px 20px",
            boxShadow: "0 24px 80px rgba(0,0,0,0.32)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div
            style={{
              display: "grid",
              gap: 10,
            }}
          >
            <div
              style={{
                display: "inline-flex",
                width: "fit-content",
                alignItems: "center",
                gap: 8,
                padding: "8px 12px",
                borderRadius: 999,
                background: "rgba(126,231,184,0.12)",
                border: "1px solid rgba(126,231,184,0.22)",
                color: "#baf7d3",
                fontSize: 12,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              Aurora Editor
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: "clamp(28px, 4vw, 46px)",
                lineHeight: 1.05,
                color: "#ffffff",
              }}
            >
              Editor visual da Aurora IA
            </h1>

            <p
              style={{
                margin: 0,
                maxWidth: 860,
                color: "rgba(238,246,255,0.76)",
                lineHeight: 1.65,
                fontSize: 16,
              }}
            >
              Monte artes, campanhas e materiais prontos para vender com uma
              experiência mais bonita, mais clara e melhor para uso no celular.
              Estamos em constante atualização e pode haver momentos de
              instabilidade.
            </p>
          </div>
        </section>

        <section
          style={{
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(8,16,24,0.90)",
            borderRadius: 28,
            padding: 18,
            boxShadow: "0 24px 80px rgba(0,0,0,0.28)",
          }}
        >
          {children}
        </section>
      </div>
    </div>
  );
}