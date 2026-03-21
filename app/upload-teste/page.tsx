"use client";

import { useState } from "react";
import UploadImage from "@/components/upload-image";

type UploadedAsset = {
  publicUrl: string;
  path?: string;
  fileName?: string;
  contentType?: string;
  size?: number;
};

export default function UploadTestePage() {
  const [uploaded, setUploaded] = useState<UploadedAsset | null>(null);

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "32px 16px",
        background:
          "radial-gradient(circle at top, rgba(0,255,170,0.10), transparent 30%), linear-gradient(180deg, #06110f 0%, #071a17 45%, #04100e 100%)",
        color: "#f5f7f7",
      }}
    >
      <div
        style={{
          maxWidth: 880,
          margin: "0 auto",
          display: "grid",
          gap: 20,
        }}
      >
        <section
          style={{
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: 24,
            padding: 24,
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 10px 40px rgba(0,0,0,0.25)",
          }}
        >
          <div style={{ display: "grid", gap: 10 }}>
            <div
              style={{
                display: "inline-flex",
                width: "fit-content",
                padding: "6px 12px",
                borderRadius: 999,
                border: "1px solid rgba(0,255,170,0.22)",
                background: "rgba(0,255,170,0.08)",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 0.3,
              }}
            >
              Aurora IA • Teste de Upload
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: "clamp(28px, 5vw, 44px)",
                lineHeight: 1.05,
              }}
            >
              Envie logo ou imagem para campanhas personalizadas
            </h1>

            <p
              style={{
                margin: 0,
                fontSize: 16,
                opacity: 0.82,
                maxWidth: 700,
                lineHeight: 1.6,
              }}
            >
              Esta tela valida o fluxo de upload da Aurora IA com Supabase Storage.
              Depois disso, vamos conectar o mesmo arquivo diretamente no chat e
              no editor para campanhas com base na imagem do cliente.
            </p>
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: 20,
          }}
        >
          <div
            style={{
              border: "1px solid rgba(255,255,255,0.10)",
              borderRadius: 24,
              padding: 20,
              background: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(10px)",
            }}
          >
            <UploadImage
              label="Subir logo, produto ou imagem de referência"
              buttonText="Enviar imagem"
              helpText="Use PNG, JPG ou WEBP até 10MB. Essa imagem será usada em campanhas personalizadas."
              onUploaded={(result) => {
                setUploaded(result);
              }}
            />
          </div>

          <div
            style={{
              border: "1px solid rgba(255,255,255,0.10)",
              borderRadius: 24,
              padding: 20,
              background: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(10px)",
              display: "grid",
              gap: 14,
              alignContent: "start",
            }}
          >
            <div
              style={{
                fontSize: 18,
                fontWeight: 800,
              }}
            >
              Resultado do teste
            </div>

            {!uploaded ? (
              <div
                style={{
                  borderRadius: 16,
                  padding: 16,
                  border: "1px dashed rgba(255,255,255,0.14)",
                  background: "rgba(255,255,255,0.02)",
                  opacity: 0.8,
                  lineHeight: 1.6,
                }}
              >
                Quando o upload for concluído, os dados aparecem aqui.
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    borderRadius: 16,
                    overflow: "hidden",
                    border: "1px solid rgba(255,255,255,0.10)",
                    background: "rgba(0,0,0,0.20)",
                  }}
                >
                  <img
                    src={uploaded.publicUrl}
                    alt={uploaded.fileName || "Imagem enviada"}
                    style={{
                      width: "100%",
                      maxHeight: 320,
                      objectFit: "contain",
                      display: "block",
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "grid",
                    gap: 8,
                    borderRadius: 16,
                    padding: 16,
                    background: "rgba(0,255,170,0.08)",
                    border: "1px solid rgba(0,255,170,0.18)",
                    fontSize: 14,
                  }}
                >
                  <div>
                    <strong>Arquivo:</strong> {uploaded.fileName || "-"}
                  </div>
                  <div>
                    <strong>Tipo:</strong> {uploaded.contentType || "-"}
                  </div>
                  <div>
                    <strong>Tamanho:</strong>{" "}
                    {typeof uploaded.size === "number"
                      ? `${uploaded.size} bytes`
                      : "-"}
                  </div>
                  <div style={{ wordBreak: "break-all" }}>
                    <strong>Path:</strong> {uploaded.path || "-"}
                  </div>
                  <div style={{ wordBreak: "break-all" }}>
                    <strong>URL pública:</strong> {uploaded.publicUrl}
                  </div>
                </div>

                <a
                  href={uploaded.publicUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "inline-flex",
                    width: "fit-content",
                    textDecoration: "none",
                    color: "#f5f7f7",
                    border: "1px solid rgba(255,255,255,0.14)",
                    borderRadius: 12,
                    padding: "12px 16px",
                    fontWeight: 700,
                  }}
                >
                  Abrir imagem em nova aba
                </a>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}