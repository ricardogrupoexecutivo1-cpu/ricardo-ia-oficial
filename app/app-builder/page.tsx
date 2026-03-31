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

type ProjectItem = {
  id: string;
  app_name?: string | null;
  app_type?: string | null;
  target_audience?: string | null;
  business_goal?: string | null;
  main_color?: string | null;
  secondary_color?: string | null;
  pages_text?: string | null;
  features_text?: string | null;
  contact_phone?: string | null;
  contact_email?: string | null;
  brand_description?: string | null;
};

type ModuleItem = {
  id: string;
  module_name?: string | null;
  module_slug?: string | null;
  route_path?: string | null;
  payload?: any;
};

export default function AppBuilderPage() {
  const [form, setForm] = useState(initialForm);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [modules, setModules] = useState<ModuleItem[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [loadingModules, setLoadingModules] = useState(false);
  const [savingProject, setSavingProject] = useState(false);
  const [generatingModules, setGeneratingModules] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | "info">(
    "info"
  );

  function updateField(name: string, value: string) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function loadProjects() {
    setLoadingProjects(true);
    try {
      const res = await fetch(
        `/api/app-builder/projects?ownerEmail=${encodeURIComponent(
          form.ownerEmail.trim()
        )}`,
        { cache: "no-store" }
      );
      const data = await res.json();

      if (data?.ok) {
        setProjects(data.projects || []);
      } else {
        setProjects([]);
      }
    } catch {
      setProjects([]);
    } finally {
      setLoadingProjects(false);
    }
  }

  async function loadModules(projectId: string) {
    if (!projectId) {
      setModules([]);
      return;
    }

    setLoadingModules(true);

    try {
      const res = await fetch(
        `/api/app-builder/modules?projectId=${encodeURIComponent(projectId)}`,
        { cache: "no-store" }
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

  function hydrateFormFromProject(project: ProjectItem) {
    setForm((prev) => ({
      ...prev,
      projectId: project.id || "",
      appName: project.app_name || "",
      appType: project.app_type || "personalizado",
      targetAudience: project.target_audience || "",
      mainGoal: project.business_goal || "",
      primaryColor: project.main_color || "#00d084",
      secondaryColor: project.secondary_color || "#0b1220",
      desiredPages: project.pages_text || "",
      desiredFeatures: project.features_text || "",
      contactPhone: project.contact_phone || "",
      contactEmail: project.contact_email || prev.contactEmail,
      brandDescription: project.brand_description || "",
    }));
  }

  const generatedPrompt = useMemo(() => {
    return [
      `Nome do app: ${form.appName || "-"}`,
      `Tipo de app: ${form.appType || "-"}`,
      `Público-alvo: ${form.targetAudience || "-"}`,
      `Objetivo principal: ${form.mainGoal || "-"}`,
      `Cor principal: ${form.primaryColor || "-"}`,
      `Cor secundária: ${form.secondaryColor || "-"}`,
      `Páginas desejadas: ${form.desiredPages || "-"}`,
      `Funcionalidades desejadas: ${form.desiredFeatures || "-"}`,
      `Telefone: ${form.contactPhone || "-"}`,
      `E-mail de contato: ${form.contactEmail || "-"}`,
      `Descrição da marca: ${form.brandDescription || "-"}`,
    ].join("\n");
  }, [form]);

  async function handleSaveProject() {
    setSavingProject(true);
    setFeedback("");

    try {
      if (!form.appName.trim()) {
        throw new Error("Preencha o nome do app.");
      }

      const res = await fetch("/api/app-builder/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ownerEmail: form.ownerEmail,
          appName: form.appName,
          appType: form.appType,
          businessGoal: form.mainGoal,
          targetAudience: form.targetAudience,
          mainColor: form.primaryColor,
          secondaryColor: form.secondaryColor,
          pagesText: form.desiredPages,
          featuresText: form.desiredFeatures,
          contactPhone: form.contactPhone,
          contactEmail: form.contactEmail,
          brandDescription: form.brandDescription,
          generatedPrompt,
          status: "draft",
        }),
      });

      const data = await res.json();

      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "Erro ao salvar projeto.");
      }

      setFeedbackType("success");
      setFeedback("Projeto salvo com sucesso no Aurora App Builder.");

      if (data?.project) {
        hydrateFormFromProject(data.project);
      }

      await loadProjects();
    } catch (error) {
      setFeedbackType("error");
      setFeedback(
        error instanceof Error ? error.message : "Erro inesperado ao salvar."
      );
    } finally {
      setSavingProject(false);
    }
  }

  async function handleGenerateModules() {
    setGeneratingModules(true);
    setFeedback("");

    try {
      if (!form.projectId.trim()) {
        throw new Error("Selecione ou informe um Project ID.");
      }

      if (!form.appName.trim()) {
        throw new Error("Preencha o nome do app antes de gerar módulos.");
      }

      if (!form.desiredPages.trim() && !form.desiredFeatures.trim()) {
        throw new Error(
          "Preencha páginas desejadas ou funcionalidades desejadas antes de gerar a estrutura técnica."
        );
      }

      const res = await fetch("/api/app-builder/modules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: form.projectId,
          ownerEmail: form.ownerEmail,
          appName: form.appName,
          appType: form.appType,
          targetAudience: form.targetAudience,
          businessGoal: form.mainGoal,
          mainColor: form.primaryColor,
          secondaryColor: form.secondaryColor,
          pagesText: form.desiredPages,
          featuresText: form.desiredFeatures,
          contactPhone: form.contactPhone,
          contactEmail: form.contactEmail,
          brandDescription: form.brandDescription,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "Erro ao gerar estrutura técnica.");
      }

      setFeedbackType("success");
      setFeedback(
        data?.message ||
          `Estrutura técnica gerada com sucesso. Módulos criados: ${data?.created ?? 0}.`
      );

      await loadModules(form.projectId);
      await loadProjects();
    } catch (error) {
      setFeedbackType("error");
      setFeedback(
        error instanceof Error
          ? error.message
          : "Erro inesperado ao gerar módulos."
      );
    } finally {
      setGeneratingModules(false);
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
    <main style={styles.main}>
      <div style={styles.container}>
        <div style={styles.topNav}>
          <NavLink href="/" label="Home" color="#93c5fd" />
          <NavLink href="/guardiao" label="Guardião" color="#facc15" />
          <NavLink href="/cadastro" label="Cadastro" color="#86efac" />
          <NavLink href="/chat" label="Chat Aurora" color="#c4b5fd" />
        </div>

        <section style={styles.heroCard}>
          <div style={styles.badge}>Aurora App Builder</div>
          <h1 style={styles.heroTitle}>Crie, organize e reutilize seus apps</h1>
          <p style={styles.heroText}>
            Esta área permite estruturar novos aplicativos, salvar projetos no banco
            e reaproveitar módulos já criados. Sistema em constante atualização e
            pode haver momentos de instabilidade.
          </p>

          <div style={styles.heroGrid}>
            <MiniInfo
              title="Projetos"
              value={String(projects.length)}
              text="Apps salvos e prontos para reaproveitar ou expandir."
            />
            <MiniInfo
              title="Projeto ativo"
              value={form.projectId || "-"}
              text="ID atual selecionado para leitura e geração de módulos."
            />
            <MiniInfo
              title="Módulos"
              value={String(modules.length)}
              text="Blocos do projeto atual disponíveis para abrir ou revisar."
            />
          </div>
        </section>

        <section style={styles.formCard}>
          <SectionTitle
            title="1. Estrutura do app"
            text="Monte ou ajuste o projeto principal antes de continuar com os módulos."
          />

          <div style={styles.grid2}>
            <Field
              label="E-mail do dono do projeto"
              value={form.ownerEmail}
              onChange={(value) => updateField("ownerEmail", value)}
              placeholder="Ex.: ricardogrupoexecutivo1@gmail.com"
            />
            <Field
              label="Project ID selecionado"
              value={form.projectId}
              onChange={(value) => updateField("projectId", value)}
              placeholder="Ex.: a01e064c-fa73-43b6-970a-bae444cbc096"
            />
            <Field
              label="Nome do app"
              value={form.appName}
              onChange={(value) => updateField("appName", value)}
              placeholder="Ex.: Aurora Locadora Pro"
            />
            <div style={styles.fieldWrap}>
              <label style={styles.label}>Tipo de app</label>
              <select
                value={form.appType}
                onChange={(e) => updateField("appType", e.target.value)}
                style={styles.select}
              >
                <option value="personalizado">Personalizado</option>
                <option value="marketplace">Marketplace</option>
                <option value="erp">ERP</option>
                <option value="crm">CRM</option>
                <option value="institucional">Institucional</option>
                <option value="locadora">Locadora</option>
              </select>
            </div>
            <Field
              label="Público-alvo"
              value={form.targetAudience}
              onChange={(value) => updateField("targetAudience", value)}
              placeholder="Ex.: locadoras e motoristas"
            />
            <Field
              label="Objetivo principal"
              value={form.mainGoal}
              onChange={(value) => updateField("mainGoal", value)}
              placeholder="Ex.: captar clientes, gerar leads, vender serviços"
            />
            <Field
              label="Cor principal"
              value={form.primaryColor}
              onChange={(value) => updateField("primaryColor", value)}
              placeholder="#00d084"
            />
            <Field
              label="Cor secundária"
              value={form.secondaryColor}
              onChange={(value) => updateField("secondaryColor", value)}
              placeholder="#0b1220"
            />
            <Field
              label="Páginas desejadas"
              value={form.desiredPages}
              onChange={(value) => updateField("desiredPages", value)}
              placeholder="Home, Sobre, Serviços, Contato, Painel"
            />
            <Field
              label="Funcionalidades desejadas"
              value={form.desiredFeatures}
              onChange={(value) => updateField("desiredFeatures", value)}
              placeholder="Cadastro, WhatsApp, formulário de leads, painel inicial"
            />
            <Field
              label="Telefone"
              value={form.contactPhone}
              onChange={(value) => updateField("contactPhone", value)}
              placeholder="Ex.: (31) 99999-9999"
            />
            <Field
              label="E-mail de contato"
              value={form.contactEmail}
              onChange={(value) => updateField("contactEmail", value)}
              placeholder="Ex.: ricardogrupoexecutivo1@gmail.com"
            />
          </div>

          <div style={{ marginTop: 18 }}>
            <label style={styles.label}>Descrição da marca</label>
            <textarea
              value={form.brandDescription}
              onChange={(e) => updateField("brandDescription", e.target.value)}
              placeholder="Descreva a marca, a proposta comercial e o estilo desejado."
              style={styles.textarea}
            />
          </div>

          <div style={{ marginTop: 18 }}>
            <label style={styles.label}>Estrutura técnica gerada</label>
            <textarea
              value={generatedPrompt}
              readOnly
              style={{ ...styles.textarea, minHeight: 180, opacity: 0.95 }}
            />
          </div>

          {feedback ? (
            <div
              style={{
                ...styles.feedbackBox,
                ...(feedbackType === "success"
                  ? styles.feedbackSuccess
                  : feedbackType === "error"
                  ? styles.feedbackError
                  : styles.feedbackInfo),
              }}
            >
              {feedback}
            </div>
          ) : null}

          <div style={styles.actions}>
            <button
              type="button"
              style={styles.primaryButton}
              onClick={handleSaveProject}
              disabled={savingProject}
            >
              {savingProject ? "Salvando projeto..." : "Salvar projeto"}
            </button>

            <button
              type="button"
              style={styles.primaryButtonStrong}
              onClick={handleGenerateModules}
              disabled={generatingModules}
            >
              {generatingModules
                ? "Gerando estrutura técnica..."
                : "Gerar estrutura técnica"}
            </button>

            <button
              type="button"
              style={styles.secondaryButton}
              onClick={loadProjects}
              disabled={loadingProjects}
            >
              {loadingProjects ? "Atualizando..." : "Atualizar projetos"}
            </button>
          </div>
        </section>

        <section style={styles.sectionCard}>
          <SectionTitle
            title="2. Projetos"
            text="Escolha um projeto salvo para continuar do ponto certo."
          />

          {loadingProjects ? (
            <p style={styles.mutedText}>Carregando projetos...</p>
          ) : projects.length === 0 ? (
            <p style={styles.mutedText}>Nenhum projeto encontrado.</p>
          ) : (
            <div style={styles.listGrid}>
              {projects.map((p) => (
                <div key={p.id} style={styles.listCard}>
                  <strong style={{ fontSize: 18 }}>
                    {p.app_name || "Projeto sem nome"}
                  </strong>

                  <div style={styles.listMeta}>ID: {p.id}</div>
                  <div style={styles.listMeta}>
                    Tipo: {p.app_type || "personalizado"}
                  </div>

                  <div style={styles.inlineActions}>
                    <button
                      type="button"
                      style={styles.smallButton}
                      onClick={() => hydrateFormFromProject(p)}
                    >
                      Usar projeto
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section style={styles.sectionCard}>
          <SectionTitle
            title="3. Módulos do projeto"
            text="Abrir, revisar e reaproveitar módulos gerados para o projeto selecionado."
          />

          {loadingModules ? (
            <p style={styles.mutedText}>Carregando módulos...</p>
          ) : modules.length === 0 ? (
            <p style={styles.mutedText}>Nenhum módulo encontrado para este projeto.</p>
          ) : (
            <div style={styles.listGrid}>
              {modules.map((mod) => (
                <div key={mod.id} style={styles.listCard}>
                  <strong style={{ fontSize: 18 }}>
                    {mod.module_name || "Módulo sem nome"}
                  </strong>

                  <div style={styles.listMeta}>Slug: {mod.module_slug || "-"}</div>
                  <div style={styles.listMeta}>Rota: {mod.route_path || "-"}</div>

                  <div style={styles.inlineActions}>
                    <button
                      type="button"
                      style={styles.smallButton}
                      onClick={() => {
                        if (mod.route_path) {
                          window.open(mod.route_path, "_blank");
                        }
                      }}
                    >
                      Abrir módulo
                    </button>

                    <button
                      type="button"
                      style={styles.smallButtonGhost}
                      onClick={() =>
                        alert(JSON.stringify(mod.payload || {}, null, 2))
                      }
                    >
                      Ver código
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function NavLink({
  href,
  label,
  color,
}: {
  href: string;
  label: string;
  color: string;
}) {
  return (
    <Link
      href={href}
      style={{
        color,
        textDecoration: "none",
        border: `1px solid ${color}33`,
        borderRadius: 999,
        padding: "10px 14px",
        fontWeight: 700,
      }}
    >
      {label}
    </Link>
  );
}

function SectionTitle({ title, text }: { title: string; text: string }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <h2 style={styles.sectionTitle}>{title}</h2>
      <p style={styles.sectionText}>{text}</p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div style={styles.fieldWrap}>
      <label style={styles.label}>{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={styles.input}
      />
    </div>
  );
}

function MiniInfo({
  title,
  value,
  text,
}: {
  title: string;
  value: string;
  text: string;
}) {
  return (
    <div style={styles.miniCard}>
      <div style={styles.miniLabel}>{title}</div>
      <div style={styles.miniValue}>{value}</div>
      <p style={styles.miniText}>{text}</p>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top, rgba(16,185,129,0.14), transparent 25%), #050816",
    color: "#e5eef8",
    padding: "32px 16px 80px",
  },
  container: {
    maxWidth: 1240,
    margin: "0 auto",
  },
  topNav: {
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 16,
  },
  heroCard: {
    border: "1px solid rgba(148,163,184,0.18)",
    background: "rgba(15,23,42,0.72)",
    backdropFilter: "blur(10px)",
    borderRadius: 24,
    padding: 24,
    boxShadow: "0 20px 80px rgba(0,0,0,0.35)",
    marginBottom: 24,
  },
  badge: {
    display: "inline-flex",
    padding: "8px 12px",
    borderRadius: 999,
    background: "rgba(16,185,129,0.14)",
    border: "1px solid rgba(16,185,129,0.25)",
    color: "#86efac",
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: 0.3,
    marginBottom: 14,
  },
  heroTitle: {
    fontSize: 38,
    lineHeight: 1.05,
    margin: 0,
  },
  heroText: {
    color: "#94a3b8",
    marginTop: 14,
    maxWidth: 940,
    fontSize: 16,
    lineHeight: 1.7,
  },
  heroGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 16,
    marginTop: 24,
  },
  miniCard: {
    borderRadius: 20,
    padding: 18,
    background: "rgba(2,6,23,0.45)",
    border: "1px solid rgba(148,163,184,0.16)",
  },
  miniLabel: {
    fontSize: 12,
    color: "#94a3b8",
  },
  miniValue: {
    fontWeight: 800,
    fontSize: 20,
    marginTop: 8,
    wordBreak: "break-word",
  },
  miniText: {
    color: "#cbd5e1",
    marginTop: 10,
    marginBottom: 0,
    lineHeight: 1.6,
  },
  formCard: {
    border: "1px solid rgba(148,163,184,0.18)",
    background: "rgba(15,23,42,0.72)",
    backdropFilter: "blur(10px)",
    borderRadius: 24,
    padding: 24,
    boxShadow: "0 20px 80px rgba(0,0,0,0.35)",
    marginBottom: 24,
  },
  sectionCard: {
    border: "1px solid rgba(148,163,184,0.18)",
    background: "rgba(15,23,42,0.72)",
    backdropFilter: "blur(10px)",
    borderRadius: 24,
    padding: 24,
    boxShadow: "0 20px 80px rgba(0,0,0,0.35)",
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    margin: 0,
  },
  sectionText: {
    color: "#94a3b8",
    marginTop: 8,
    marginBottom: 0,
    lineHeight: 1.7,
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 16,
  },
  fieldWrap: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: 700,
    color: "#dbeafe",
  },
  input: {
    width: "100%",
    borderRadius: 14,
    border: "1px solid rgba(148,163,184,0.18)",
    background: "rgba(2,6,23,0.55)",
    color: "#ffffff",
    padding: "14px 16px",
    outline: "none",
    fontSize: 15,
  },
  select: {
    width: "100%",
    borderRadius: 14,
    border: "1px solid rgba(148,163,184,0.18)",
    background: "rgba(2,6,23,0.55)",
    color: "#ffffff",
    padding: "14px 16px",
    outline: "none",
    fontSize: 15,
  },
  textarea: {
    minHeight: 140,
    resize: "vertical",
    borderRadius: 16,
    border: "1px solid rgba(148,163,184,0.18)",
    background: "rgba(2,6,23,0.55)",
    color: "#ffffff",
    padding: "16px",
    outline: "none",
    fontSize: 15,
    lineHeight: 1.6,
    width: "100%",
  },
  actions: {
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 18,
  },
  inlineActions: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 12,
  },
  primaryButton: {
    borderRadius: 14,
    border: "1px solid rgba(16,185,129,0.35)",
    background:
      "linear-gradient(135deg, rgba(16,185,129,0.24), rgba(59,130,246,0.18))",
    color: "#ecfeff",
    fontWeight: 800,
    cursor: "pointer",
    padding: "14px 18px",
    fontSize: 15,
  },
  primaryButtonStrong: {
    borderRadius: 14,
    border: "1px solid rgba(250,204,21,0.35)",
    background:
      "linear-gradient(135deg, rgba(250,204,21,0.24), rgba(16,185,129,0.18))",
    color: "#fefce8",
    fontWeight: 900,
    cursor: "pointer",
    padding: "14px 18px",
    fontSize: 15,
  },
  secondaryButton: {
    borderRadius: 14,
    border: "1px solid rgba(148,163,184,0.2)",
    background: "rgba(2,6,23,0.45)",
    color: "#dbeafe",
    fontWeight: 800,
    cursor: "pointer",
    padding: "14px 18px",
    fontSize: 15,
  },
  smallButton: {
    borderRadius: 12,
    border: "1px solid rgba(16,185,129,0.35)",
    background: "rgba(16,185,129,0.14)",
    color: "#86efac",
    fontWeight: 800,
    cursor: "pointer",
    padding: "10px 14px",
    fontSize: 14,
  },
  smallButtonGhost: {
    borderRadius: 12,
    border: "1px solid rgba(148,163,184,0.2)",
    background: "rgba(2,6,23,0.45)",
    color: "#dbeafe",
    fontWeight: 800,
    cursor: "pointer",
    padding: "10px 14px",
    fontSize: 14,
  },
  listGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 16,
  },
  listCard: {
    borderRadius: 18,
    padding: 18,
    background: "rgba(2,6,23,0.45)",
    border: "1px solid rgba(148,163,184,0.16)",
  },
  listMeta: {
    color: "#cbd5e1",
    lineHeight: 1.6,
    marginTop: 8,
    wordBreak: "break-word",
  },
  feedbackBox: {
    borderRadius: 16,
    padding: 14,
    marginTop: 18,
    lineHeight: 1.6,
    fontWeight: 700,
  },
  feedbackSuccess: {
    background: "rgba(16,185,129,0.12)",
    border: "1px solid rgba(16,185,129,0.35)",
    color: "#bbf7d0",
  },
  feedbackError: {
    background: "rgba(239,68,68,0.12)",
    border: "1px solid rgba(239,68,68,0.35)",
    color: "#fecaca",
  },
  feedbackInfo: {
    background: "rgba(59,130,246,0.12)",
    border: "1px solid rgba(59,130,246,0.35)",
    color: "#bfdbfe",
  },
  mutedText: {
    color: "#94a3b8",
    lineHeight: 1.7,
  },
};