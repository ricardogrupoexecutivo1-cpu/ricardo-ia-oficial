"use client";

import { useState } from "react";

export default function CadastroPage() {
  const [form, setForm] = useState<any>({});

  function update(field: string, value: any) {
    setForm((prev: any) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: any) {
    e.preventDefault();
    console.log(form);
    alert("Cadastro enviado (modo teste)");
  }

  return (
    <main style={{ padding: "24px 0 60px" }}>
      <h1 style={{ fontSize: 28, marginBottom: 10 }}>
        Cadastro empresarial
      </h1>

      <p style={{ opacity: 0.7, marginBottom: 20 }}>
        Cadastre sua empresa e comece a gerar oportunidades reais dentro da Aurora.
        <br />
        <span style={{ fontSize: 12 }}>
          Register your business and start generating opportunities
        </span>
      </p>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gap: 14,
          maxWidth: 600,
        }}
      >
        {/* IDENTIFICAÇÃO */}
        <input placeholder="Nome do responsável / Responsible name"
          onChange={(e) => update("responsavel", e.target.value)} />

        <input placeholder="Nome da empresa / Company name"
          onChange={(e) => update("empresa", e.target.value)} />

        <input placeholder="CNPJ / Company ID"
          onChange={(e) => update("cnpj", e.target.value)} />

        <input placeholder="WhatsApp"
          onChange={(e) => update("whatsapp", e.target.value)} />

        <input placeholder="Email"
          onChange={(e) => update("email", e.target.value)} />

        {/* TIPO */}
        <select onChange={(e) => update("tipo", e.target.value)}>
          <option>Tipo de cadastro</option>
          <option>Empresa</option>
          <option>Prestador</option>
          <option>Fornecedor</option>
          <option>Comprador</option>
        </select>

        {/* ÁREA */}
        <select onChange={(e) => update("area", e.target.value)}>
          <option>Área de atuação</option>
          <option>Locadora</option>
          <option>Agro</option>
          <option>Mineração</option>
          <option>Imóveis</option>
          <option>Financeiro</option>
          <option>Serviços gerais</option>
        </select>

        {/* ÁREA INTERNA */}
        <select onChange={(e) => update("setor", e.target.value)}>
          <option>Área interna</option>
          <option>Financeiro</option>
          <option>Comercial</option>
          <option>Operacional</option>
          <option>Marketing</option>
        </select>

        {/* OBJETIVO */}
        <select onChange={(e) => update("objetivo", e.target.value)}>
          <option>O que você busca</option>
          <option>Clientes</option>
          <option>Fornecedores</option>
          <option>Parcerias</option>
          <option>Vendas</option>
        </select>

        <textarea
          placeholder="Descreva sua empresa ou serviço"
          onChange={(e) => update("descricao", e.target.value)}
        />

        <button
          type="submit"
          style={{
            padding: "14px",
            background: "#00ff88",
            border: "none",
            borderRadius: 10,
            fontWeight: 700,
          }}
        >
          Criar cadastro
          <div style={{ fontSize: 12 }}>
            Create account
          </div>
        </button>
      </form>
    </main>
  );
}