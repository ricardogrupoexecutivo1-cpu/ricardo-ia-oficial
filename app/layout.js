"use client"; // ESSENCIAL para usar hooks como useState

import { useState } from "react";

export default function RootLayout({ children }) {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <html lang="pt-BR">
      <body>
        {children}

        {/* Botão de Chat */}
        <div style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          zIndex: 9999
        }}>
          <button
            onClick={() => setChatOpen(!chatOpen)}
            style={{
              padding: "12px 20px",
              backgroundColor: "#4F46E5",
              color: "#fff",
              borderRadius: "50px",
              border: "none",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            {chatOpen ? "Fechar Chat" : "Chat"}
          </button>
          {chatOpen && (
            <div style={{
              marginTop: 10,
              width: 300,
              height: 400,
              backgroundColor: "#fff",
              border: "1px solid #ccc",
              borderRadius: 10,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              padding: 10
            }}>
              <p>Chat está aberto! Conecte aqui sua IA.</p>
            </div>
          )}
        </div>
      </body>
    </html>
  );
}
