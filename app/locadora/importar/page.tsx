"use client";

import { useState } from "react";
import Link from "next/link";

const COLUNAS_OBRIGATORIAS = [
  "titulo",
  "marca",
  "modelo",
  "ano",
  "cor",
  "placa",
  "valorDiaria",
  "status",
];

export default function ImportarLocadora() {
  const [csv, setCsv] = useState("");
  const [status, setStatus] = useState("");
  const [erros, setErros] = useState<string[]>([]);
  const [preview, setPreview] = useState<any[]>([]);
  const [dragActive, setDragActive] = useState(false);

  function validarCSV(texto: string) {
    const linhas = texto.split("\n").filter((l) => l.trim() !== "");

    if (linhas.length < 2) {
      setErros(["CSV precisa ter cabeçalho e pelo menos 1 linha"]);
      return false;
    }

    const headers = linhas[0].split(",").map((h) => h.trim());

    const errosEncontrados: string[] = [];

    COLUNAS_OBRIGATORIAS.forEach((col) => {
      if (!headers.includes(col)) {
        errosEncontrados.push(`Coluna obrigatória faltando: ${col}`);
      }
    });

    const previewData = linhas.slice(1, 6).map((linha) => {
      const valores = linha.split(",");
      const obj: any = {};
      headers.forEach((h, i) => {
        obj[h] = valores[i];
      });
      return obj;
    });

    setPreview(previewData);
    setErros(errosEncontrados);

    return errosEncontrados.length === 0;
  }

  async function importar() {
    const email = localStorage.getItem("userEmail");
    const projectId = localStorage.getItem("projectId");

    if (!csv) {
      alert("Selecione um CSV");
      return;
    }

    const valido = validarCSV(csv);

    if (!valido) {
      setStatus("Erro no CSV. Corrija antes de importar.");
      return;
    }

    setStatus("Importando...");

    const res = await fetch("/api/locadora/importar", {
      method: "POST",
      body: JSON.stringify({
        csv,
        ownerEmail: email,
        projectId,
      }),
    });

    const data = await res.json();

    if (data.error) {
      setStatus("Erro: " + data.error);
    } else {
      setStatus(`Importado com sucesso: ${data.total} veículos`);
      setCsv("");
      setPreview([]);
    }
  }

  function lerArquivo(file: File) {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const texto = e.target.result;
      setCsv(texto);
      validarCSV(texto);
    };

    reader.readAsText(file);
  }

  function handleFileChange(e: any) {
    const file = e.target.files[0];
    if (file) lerArquivo(file);
  }

  function handleDrop(e: any) {
    e.preventDefault();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file) lerArquivo(file);
  }

  return (
    <main style={{ padding: 20 }}>
      <Link href="/locadora">← Voltar</Link>

      <h1>📥 Importar veículos (CSV)</h1>

      <p>
        Sistema com validação automática. Pode haver instabilidade durante atualizações.
      </p>

      {/* DROP */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        style={{
          border: "2px dashed #22c55e",
          padding: 30,
          marginTop: 20,
          textAlign: "center",
          background: dragActive ? "#052e16" : "#020617",
          borderRadius: 12,
        }}
      >
        <p>Arraste o CSV aqui</p>
        <input type="file" accept=".csv" onChange={handleFileChange} />
      </div>

      {/* ERROS */}
      {erros.length > 0 && (
        <div style={{ marginTop: 20, color: "red" }}>
          <strong>Erros encontrados:</strong>
          {erros.map((e, i) => (
            <div key={i}>{e}</div>
          ))}
        </div>
      )}

      {/* PREVIEW */}
      {preview.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <strong>Preview:</strong>
          {preview.map((item, i) => (
            <pre key={i} style={{ background: "#111", padding: 10 }}>
              {JSON.stringify(item, null, 2)}
            </pre>
          ))}
        </div>
      )}

      <button
        onClick={importar}
        style={{
          marginTop: 20,
          padding: "12px 24px",
          background: "#22c55e",
          border: "none",
          fontWeight: 900,
          borderRadius: 8,
        }}
      >
        Importar veículos
      </button>

      <p style={{ marginTop: 10 }}>{status}</p>
    </main>
  );
}