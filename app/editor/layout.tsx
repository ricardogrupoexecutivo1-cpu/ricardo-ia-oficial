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
      <style>{`
        .aurora-editor-shell * {
          box-sizing: border-box;
        }

        .aurora-editor-shell h1,
        .aurora-editor-shell h2,
        .aurora-editor-shell h3,
        .aurora-editor-shell h4 {
          color: #ffffff;
          line-height: 1.15;
        }

        .aurora-editor-shell p,
        .aurora-editor-shell label,
        .aurora-editor-shell span,
        .aurora-editor-shell strong,
        .aurora-editor-shell small,
        .aurora-editor-shell div {
          color: inherit;
        }

        .aurora-editor-shell > div > div:last-child,
        .aurora-editor-shell main,
        .aurora-editor-shell section,
        .aurora-editor-shell article,
        .aurora-editor-shell form {
          color: #eef6ff;
        }

        .aurora-editor-shell button,
        .aurora-editor-shell a[href] {
          border-radius: 14px !important;
          border: 1px solid rgba(255,255,255,0.10) !important;
          background: rgba(255,255,255,0.05) !important;
          color: #eef6ff !important;
          font-weight: 800 !important;
          transition: all 0.2s ease;
          box-shadow: none;
        }

        .aurora-editor-shell button:hover,
        .aurora-editor-shell a[href]:hover {
          transform: translateY(-1px);
          background: rgba(255,255,255,0.08) !important;
          border-color: rgba(126,231,184,0.35) !important;
        }

        .aurora-editor-shell button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .aurora-editor-shell input,
        .aurora-editor-shell textarea,
        .aurora-editor-shell select {
          width: 100%;
          border-radius: 14px !important;
          border: 1px solid rgba(255,255,255,0.10) !important;
          background: rgba(8,16,24,0.88) !important;
          color: #eef6ff !important;
          padding: 12px 14px !important;
          outline: none;
          box-shadow: none;
        }

        .aurora-editor-shell input::placeholder,
        .aurora-editor-shell textarea::placeholder {
          color: rgba(238,246,255,0.45);
        }

        .aurora-editor-shell input:focus,
        .aurora-editor-shell textarea:focus,
        .aurora-editor-shell select:focus {
          border-color: rgba(126,231,184,0.45) !important;
          box-shadow: 0 0 0 3px rgba(34,197,94,0.12);
        }

        .aurora-editor-shell input[type="color"] {
          min-height: 52px;
          padding: 6px !important;
          background: rgba(8,16,24,0.88) !important;
        }

        .aurora-editor-shell input[type="range"] {
          padding: 0 !important;
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
        }

        .aurora-editor-shell input[type="file"] {
          padding: 10px !important;
        }

        .aurora-editor-shell hr {
          border: none;
          border-top: 1px solid rgba(255,255,255,0.08);
          margin: 18px 0;
        }

        .aurora-editor-shell img,
        .aurora-editor-shell canvas {
          max-width: 100%;
          border-radius: 20px;
        }

        .aurora-editor-shell > div {
          max-width: 1320px;
          margin: 0 auto;
          display: grid;
          gap: 20px;
        }

        .aurora-editor-hero {
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(8,16,24,0.82);
          border-radius: 28px;
          padding: 24px 20px;
          box-shadow: 0 24px 80px rgba(0,0,0,0.32);
          backdrop-filter: blur(10px);
        }

        .aurora-editor-badge {
          display: inline-flex;
          width: fit-content;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(126,231,184,0.12);
          border: 1px solid rgba(126,231,184,0.22);
          color: #baf7d3;
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 10px;
        }

        .aurora-editor-stage {
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(8,16,24,0.90);
          border-radius: 28px;
          padding: 18px;
          box-shadow: 0 24px 80px rgba(0,0,0,0.28);
        }

        .aurora-editor-stage > * {
          color: #eef6ff !important;
        }

        .aurora-editor-stage section,
        .aurora-editor-stage article,
        .aurora-editor-stage form,
        .aurora-editor-stage > div,
        .aurora-editor-stage > main {
          background: transparent !important;
          color: #eef6ff !important;
        }

        .aurora-editor-stage h1,
        .aurora-editor-stage h2,
        .aurora-editor-stage h3 {
          margin-top: 0;
        }

        .aurora-editor-stage [class*="card"],
        .aurora-editor-stage [class*="panel"],
        .aurora-editor-stage [class*="box"],
        .aurora-editor-stage [class*="section"],
        .aurora-editor-stage [class*="block"] {
          border-radius: 20px !important;
          border: 1px solid rgba(255,255,255,0.08) !important;
          background: rgba(255,255,255,0.03) !important;
        }

        @media (max-width: 768px) {
          .aurora-editor-shell {
            padding-top: 12px;
          }

          .aurora-editor-hero {
            padding: 18px 16px;
            border-radius: 22px;
          }

          .aurora-editor-stage {
            padding: 14px;
            border-radius: 22px;
          }
        }
      `}</style>

      <div className="aurora-editor-shell">
        <section className="aurora-editor-hero">
          <div className="aurora-editor-badge">Aurora Editor</div>

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
              margin: "12px 0 0",
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
        </section>

        <section className="aurora-editor-stage">{children}</section>
      </div>
    </div>
  );
}