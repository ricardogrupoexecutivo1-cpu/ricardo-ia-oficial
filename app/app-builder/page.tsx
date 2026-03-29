"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const initialForm = {
  ownerEmail: "ricardogrupoexecutivo1@gmail.com",
  projectId: "a01e064c-fa73-43b6-970a-bae444cbc096",
  appName: "",
  appType: "personalizado",
  targetAudience: "",
  mainGoal: "",
  primaryColor: "#00d084",
  secondaryColor: "#0b1220",
  desiredPages: "",
  desiredFeatures: "",
  contactPhone: "",
  contactEmail: "ricardogrupoexecutivo1@gmail.com",
  brandDescription: "",
};

export default function AppBuilderPage() {
  const [form, setForm] = useState(initialForm);
  const [projects, setProjects] = useState<any[]>([]);
  const [modules, setModules] = useState<any[]>([]);
  const [loadingModules, setLoadingModules] = useState(false);

  function updateField(name: string, value: string) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function loadProjects() {
    const res = await fetch("/api/app-builder/projects");
    const data = await res.json();
    if (data?.ok) setProjects(data.projects || []);
  }

  async function loadModules(projectId: string) {
    if (!projectId) return;

    setLoadingModules(true);

    try {
      const res = await fetch(
        `/api/app-builder/modules?projectId=${projectId}`
      );
      const data = await res.json();

      if (data?.ok) {
        setModules(data.modules || []);
      } else {
        setModules([]);
      }
    } catch {
      setModules([]);
    } finally {
      setLoadingModules(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (form.projectId) {
      loadModules(form.projectId);
    }
  }, [form.projectId]);

  return (
    <main style={{ padding: 30 }}>
      <h1>Aurora App Builder</h1>

      {/* PROJETOS */}
      <h2>Projetos</h2>

      {projects.map((p) => (
        <div key={p.id} style={{ border: "1px solid #333", padding: 10, marginBottom: 10 }}>
          <strong>{p.app_name}</strong>
          <div>ID: {p.id}</div>

          <button
            onClick={() => {
              setForm({
                ...form,
                projectId: p.id,
              });
            }}
          >
            Usar projeto
          </button>
        </div>
      ))}

      {/* MÓDULOS */}
      <h2>Módulos do projeto</h2>

      {loadingModules ? (
        <p>Carregando...</p>
      ) : modules.length === 0 ? (
        <p>Nenhum módulo encontrado</p>
      ) : (
        modules.map((mod) => (
          <div key={mod.id} style={{ border: "1px solid #444", padding: 10, marginBottom: 10 }}>
            <strong>{mod.module_name}</strong>

            <div>Slug: {mod.module_slug}</div>
            <div>Rota: {mod.route_path}</div>

            <button onClick={() => window.open(mod.route_path)}>
              Abrir módulo
            </button>

            <button
              onClick={() =>
                alert(JSON.stringify(mod.payload, null, 2))
              }
            >
              Ver código
            </button>
          </div>
        ))
      )}
    </main>
  );
}