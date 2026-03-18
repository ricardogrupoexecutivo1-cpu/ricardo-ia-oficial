"use client";

import Link from "next/link";
import {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type LoadedImage = {
  src: string;
  width: number;
  height: number;
};

type EditorProject = {
  id: string;
  user_email: string;
  title: string;
  preview_image_url?: string | null;
  design_data: EditorDesignData;
  created_at: string;
  updated_at: string;
};

type EditorDesignData = {
  projectTitle: string;
  userEmail: string;
  backgroundColor: string;
  headline: string;
  subheadline: string;
  cta: string;
  headlineX: number;
  headlineY: number;
  headlineSize: number;
  headlineColor: string;
  subheadlineX: number;
  subheadlineY: number;
  subheadlineSize: number;
  subheadlineColor: string;
  ctaX: number;
  ctaY: number;
  ctaWidth: number;
  ctaHeight: number;
  ctaRadius: number;
  ctaBg: string;
  ctaColor: string;
  ctaFontSize: number;
  imageX: number;
  imageY: number;
  imageScale: number;
  overlayOpacity: number;
  overlayColor: string;
  loadedImage: LoadedImage | null;
};

type CampaignData = {
  niche: string;
  nicheLabel: string;
  commercialTitle: string;
  audience: string;
  caption: string;
  ctaText: string;
  hashtags: string[];
  fullText: string;
};

const DEFAULT_DESIGN: EditorDesignData = {
  projectTitle: "Arte Aurora",
  userEmail: "",
  backgroundColor: "#0b1020",
  headline: "Aurora IA",
  subheadline: "Crie campanhas com impacto",
  cta: "Saiba mais",
  headlineX: 60,
  headlineY: 90,
  headlineSize: 44,
  headlineColor: "#ffffff",
  subheadlineX: 60,
  subheadlineY: 150,
  subheadlineSize: 22,
  subheadlineColor: "#b8c1d9",
  ctaX: 60,
  ctaY: 230,
  ctaWidth: 220,
  ctaHeight: 56,
  ctaRadius: 16,
  ctaBg: "#22c55e",
  ctaColor: "#04110a",
  ctaFontSize: 20,
  imageX: 0,
  imageY: 0,
  imageScale: 1,
  overlayOpacity: 0.35,
  overlayColor: "#000000",
  loadedImage: null,
};

const NICHE_TEMPLATES: Array<{
  id: string;
  name: string;
  design: Partial<EditorDesignData>;
}> = [
  {
    id: "locadora",
    name: "Locadora",
    design: {
      projectTitle: "Locadora Premium",
      headline: "Seminovos Raja",
      subheadline: "Aluguel de veículos com ofertas especiais em BH",
      cta: "Venha conferir",
      ctaBg: "#22c55e",
      ctaColor: "#04110a",
      overlayOpacity: 0.42,
      headlineY: 100,
      subheadlineY: 170,
      ctaY: 270,
    },
  },
  {
    id: "restaurante",
    name: "Restaurante",
    design: {
      projectTitle: "Campanha Restaurante",
      headline: "Sabor que conquista",
      subheadline: "Peça hoje e surpreenda sua família",
      cta: "Peça agora",
      ctaBg: "#f59e0b",
      ctaColor: "#1f1300",
      overlayOpacity: 0.45,
    },
  },
  {
    id: "imobiliaria",
    name: "Imobiliária",
    design: {
      projectTitle: "Campanha Imobiliária",
      headline: "Seu novo imóvel está aqui",
      subheadline: "Mais segurança, conforto e oportunidade",
      cta: "Fale conosco",
      ctaBg: "#38bdf8",
      ctaColor: "#04131b",
      overlayOpacity: 0.38,
    },
  },
  {
    id: "oficina",
    name: "Oficina",
    design: {
      projectTitle: "Campanha Oficina",
      headline: "Seu carro merece cuidado profissional",
      subheadline: "Revisão, manutenção e confiança no mesmo lugar",
      cta: "Agendar serviço",
      ctaBg: "#ef4444",
      ctaColor: "#ffffff",
      overlayOpacity: 0.44,
    },
  },
  {
    id: "loja",
    name: "Loja",
    design: {
      projectTitle: "Campanha Loja",
      headline: "Ofertas que chamam atenção",
      subheadline: "Condições especiais por tempo limitado",
      cta: "Comprar agora",
      ctaBg: "#a855f7",
      ctaColor: "#ffffff",
      overlayOpacity: 0.4,
    },
  },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function mergeDesign(base: EditorDesignData, extra?: Partial<EditorDesignData>) {
  return {
    ...base,
    ...extra,
    loadedImage: extra?.loadedImage ?? base.loadedImage,
  };
}

function buildInstagramText(campaign: CampaignData) {
  return `${campaign.commercialTitle}

${campaign.caption}

${campaign.hashtags.join(" ")}`;
}

function buildFacebookText(campaign: CampaignData) {
  return `${campaign.commercialTitle}

${campaign.caption}

CTA: ${campaign.ctaText}

${campaign.hashtags.join(" ")}`;
}

function buildWhatsAppText(campaign: CampaignData) {
  return `${campaign.commercialTitle}

${campaign.caption}

${campaign.ctaText}`;
}

function slugifyFileName(value: string) {
  const normalized = value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return normalized || "arte-aurora";
}

export default function EditorClient() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [projectId, setProjectId] = useState<string>("");
  const [projectTitle, setProjectTitle] = useState(DEFAULT_DESIGN.projectTitle);
  const [userEmail, setUserEmail] = useState(DEFAULT_DESIGN.userEmail);

  const [loadedImage, setLoadedImage] = useState<LoadedImage | null>(
    DEFAULT_DESIGN.loadedImage
  );
  const [backgroundColor, setBackgroundColor] = useState(
    DEFAULT_DESIGN.backgroundColor
  );

  const [headline, setHeadline] = useState(DEFAULT_DESIGN.headline);
  const [subheadline, setSubheadline] = useState(DEFAULT_DESIGN.subheadline);
  const [cta, setCta] = useState(DEFAULT_DESIGN.cta);

  const [headlineX, setHeadlineX] = useState(DEFAULT_DESIGN.headlineX);
  const [headlineY, setHeadlineY] = useState(DEFAULT_DESIGN.headlineY);
  const [headlineSize, setHeadlineSize] = useState(DEFAULT_DESIGN.headlineSize);
  const [headlineColor, setHeadlineColor] = useState(
    DEFAULT_DESIGN.headlineColor
  );

  const [subheadlineX, setSubheadlineX] = useState(DEFAULT_DESIGN.subheadlineX);
  const [subheadlineY, setSubheadlineY] = useState(DEFAULT_DESIGN.subheadlineY);
  const [subheadlineSize, setSubheadlineSize] = useState(
    DEFAULT_DESIGN.subheadlineSize
  );
  const [subheadlineColor, setSubheadlineColor] = useState(
    DEFAULT_DESIGN.subheadlineColor
  );

  const [ctaX, setCtaX] = useState(DEFAULT_DESIGN.ctaX);
  const [ctaY, setCtaY] = useState(DEFAULT_DESIGN.ctaY);
  const [ctaWidth, setCtaWidth] = useState(DEFAULT_DESIGN.ctaWidth);
  const [ctaHeight, setCtaHeight] = useState(DEFAULT_DESIGN.ctaHeight);
  const [ctaRadius, setCtaRadius] = useState(DEFAULT_DESIGN.ctaRadius);
  const [ctaBg, setCtaBg] = useState(DEFAULT_DESIGN.ctaBg);
  const [ctaColor, setCtaColor] = useState(DEFAULT_DESIGN.ctaColor);
  const [ctaFontSize, setCtaFontSize] = useState(DEFAULT_DESIGN.ctaFontSize);

  const [imageX, setImageX] = useState(DEFAULT_DESIGN.imageX);
  const [imageY, setImageY] = useState(DEFAULT_DESIGN.imageY);
  const [imageScale, setImageScale] = useState(DEFAULT_DESIGN.imageScale);

  const [overlayOpacity, setOverlayOpacity] = useState(
    DEFAULT_DESIGN.overlayOpacity
  );
  const [overlayColor, setOverlayColor] = useState(DEFAULT_DESIGN.overlayColor);

  const [projects, setProjects] = useState<EditorProject[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const [campaign, setCampaign] = useState<CampaignData | null>(null);
  const [isGeneratingCampaign, setIsGeneratingCampaign] = useState(false);
  const [isDeletingProject, setIsDeletingProject] = useState(false);
  const [isDuplicatingProject, setIsDuplicatingProject] = useState(false);

  const canvasWidth = 1080;
  const canvasHeight = 1080;

  const previewInfo = useMemo(() => {
    if (!loadedImage) {
      return "Nenhuma imagem carregada.";
    }

    return `Imagem carregada: ${loadedImage.width}x${loadedImage.height}`;
  }, [loadedImage]);

  const currentDesign = useCallback((): EditorDesignData => {
    return {
      projectTitle,
      userEmail,
      backgroundColor,
      headline,
      subheadline,
      cta,
      headlineX,
      headlineY,
      headlineSize,
      headlineColor,
      subheadlineX,
      subheadlineY,
      subheadlineSize,
      subheadlineColor,
      ctaX,
      ctaY,
      ctaWidth,
      ctaHeight,
      ctaRadius,
      ctaBg,
      ctaColor,
      ctaFontSize,
      imageX,
      imageY,
      imageScale,
      overlayOpacity,
      overlayColor,
      loadedImage,
    };
  }, [
    projectTitle,
    userEmail,
    backgroundColor,
    headline,
    subheadline,
    cta,
    headlineX,
    headlineY,
    headlineSize,
    headlineColor,
    subheadlineX,
    subheadlineY,
    subheadlineSize,
    subheadlineColor,
    ctaX,
    ctaY,
    ctaWidth,
    ctaHeight,
    ctaRadius,
    ctaBg,
    ctaColor,
    ctaFontSize,
    imageX,
    imageY,
    imageScale,
    overlayOpacity,
    overlayColor,
    loadedImage,
  ]);

  const applyDesign = useCallback((design: EditorDesignData) => {
    setProjectTitle(design.projectTitle || "Arte Aurora");
    setUserEmail(design.userEmail || "");
    setBackgroundColor(design.backgroundColor);
    setHeadline(design.headline);
    setSubheadline(design.subheadline);
    setCta(design.cta);
    setHeadlineX(design.headlineX);
    setHeadlineY(design.headlineY);
    setHeadlineSize(design.headlineSize);
    setHeadlineColor(design.headlineColor);
    setSubheadlineX(design.subheadlineX);
    setSubheadlineY(design.subheadlineY);
    setSubheadlineSize(design.subheadlineSize);
    setSubheadlineColor(design.subheadlineColor);
    setCtaX(design.ctaX);
    setCtaY(design.ctaY);
    setCtaWidth(design.ctaWidth);
    setCtaHeight(design.ctaHeight);
    setCtaRadius(design.ctaRadius);
    setCtaBg(design.ctaBg);
    setCtaColor(design.ctaColor);
    setCtaFontSize(design.ctaFontSize);
    setImageX(design.imageX);
    setImageY(design.imageY);
    setImageScale(design.imageScale);
    setOverlayOpacity(design.overlayOpacity);
    setOverlayColor(design.overlayColor);
    setLoadedImage(design.loadedImage || null);
  }, []);

  const drawRoundedRect = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      width: number,
      height: number,
      radius: number
    ) => {
      const r = Math.min(radius, width / 2, height / 2);

      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + width - r, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + r);
      ctx.lineTo(x + width, y + height - r);
      ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
      ctx.lineTo(x + r, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    },
    []
  );

  const drawCanvas = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    if (loadedImage?.src) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = loadedImage.src;

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Falha ao carregar imagem."));
      }).catch(() => undefined);

      if (img.width > 0 && img.height > 0) {
        const baseScale = Math.max(
          canvasWidth / img.width,
          canvasHeight / img.height
        );
        const finalScale = baseScale * imageScale;
        const drawWidth = img.width * finalScale;
        const drawHeight = img.height * finalScale;
        const centeredX = (canvasWidth - drawWidth) / 2;
        const centeredY = (canvasHeight - drawHeight) / 2;

        ctx.drawImage(
          img,
          centeredX + imageX,
          centeredY + imageY,
          drawWidth,
          drawHeight
        );
      }
    }

    ctx.fillStyle = `${overlayColor}${Math.round(clamp(overlayOpacity, 0, 1) * 255)
      .toString(16)
      .padStart(2, "0")}`;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    const neon = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
    neon.addColorStop(0, "rgba(34,197,94,0.28)");
    neon.addColorStop(0.5, "rgba(16,185,129,0.08)");
    neon.addColorStop(1, "rgba(59,130,246,0.18)");
    ctx.fillStyle = neon;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    ctx.save();
    ctx.shadowColor = "rgba(34,197,94,0.45)";
    ctx.shadowBlur = 26;
    ctx.strokeStyle = "rgba(34,197,94,0.7)";
    ctx.lineWidth = 4;
    drawRoundedRect(ctx, 24, 24, canvasWidth - 48, canvasHeight - 48, 26);
    ctx.stroke();
    ctx.restore();

    ctx.textBaseline = "top";

    ctx.save();
    ctx.shadowColor = "rgba(34,197,94,0.28)";
    ctx.shadowBlur = 18;
    ctx.fillStyle = headlineColor;
    ctx.font = `700 ${headlineSize}px Arial`;
    wrapText(
      ctx,
      headline,
      headlineX,
      headlineY,
      canvasWidth - headlineX - 60,
      headlineSize * 1.2
    );
    ctx.restore();

    ctx.save();
    ctx.fillStyle = subheadlineColor;
    ctx.font = `500 ${subheadlineSize}px Arial`;
    wrapText(
      ctx,
      subheadline,
      subheadlineX,
      subheadlineY,
      canvasWidth - subheadlineX - 60,
      subheadlineSize * 1.35
    );
    ctx.restore();

    ctx.save();
    drawRoundedRect(ctx, ctaX, ctaY, ctaWidth, ctaHeight, ctaRadius);
    ctx.fillStyle = ctaBg;
    ctx.fill();

    ctx.fillStyle = ctaColor;
    ctx.font = `700 ${ctaFontSize}px Arial`;

    const textWidth = ctx.measureText(cta).width;
    const textX = ctaX + (ctaWidth - textWidth) / 2;
    const textY = ctaY + (ctaHeight - ctaFontSize) / 2 - 2;
    ctx.fillText(cta, textX, textY);
    ctx.restore();
  }, [
    backgroundColor,
    loadedImage,
    imageScale,
    imageX,
    imageY,
    overlayColor,
    overlayOpacity,
    headline,
    headlineColor,
    headlineSize,
    headlineX,
    headlineY,
    subheadline,
    subheadlineColor,
    subheadlineSize,
    subheadlineX,
    subheadlineY,
    cta,
    ctaBg,
    ctaColor,
    ctaFontSize,
    ctaHeight,
    ctaRadius,
    ctaWidth,
    ctaX,
    ctaY,
    drawRoundedRect,
  ]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const getPreviewImageFromCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    try {
      return canvas.toDataURL("image/jpeg", 0.72);
    } catch {
      return null;
    }
  }, []);

  const handleImageUpload = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") return;

      const img = new Image();
      img.onload = () => {
        setLoadedImage({
          src: result,
          width: img.width,
          height: img.height,
        });
      };
      img.src = result;
    };

    reader.readAsDataURL(file);
  }, []);

  const resetEditor = useCallback(() => {
    setProjectId("");
    applyDesign(DEFAULT_DESIGN);
    setCampaign(null);
    setStatusMessage("Editor resetado.");
  }, [applyDesign]);

  const downloadImage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    const fileName = slugifyFileName(projectTitle || headline || "arte-aurora");

    link.href = canvas.toDataURL("image/png");
    link.download = `${fileName}.png`;
    link.click();
  }, [headline, projectTitle]);

  const loadProjects = useCallback(async () => {
    const email = userEmail.trim().toLowerCase();

    if (!email) {
      setStatusMessage("Digite o e-mail para listar as artes salvas.");
      return;
    }

    setIsLoadingProjects(true);
    setStatusMessage("");

    try {
      const response = await fetch(
        `/api/editor/list?email=${encodeURIComponent(email)}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setStatusMessage(data?.error || "Erro ao carregar artes.");
        return;
      }

      setProjects(Array.isArray(data?.projects) ? data.projects : []);
      setStatusMessage("Artes carregadas com sucesso.");
    } catch {
      setStatusMessage("Erro de conexão ao carregar artes.");
    } finally {
      setIsLoadingProjects(false);
    }
  }, [userEmail]);

  const saveProject = useCallback(async () => {
    const email = userEmail.trim().toLowerCase();

    if (!email) {
      setStatusMessage("Digite o e-mail antes de salvar.");
      return;
    }

    setIsSaving(true);
    setStatusMessage("");

    try {
      const response = await fetch("/api/editor/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: projectId || undefined,
          email,
          title: projectTitle.trim() || "Arte Aurora",
          designData: currentDesign(),
          previewImageUrl: getPreviewImageFromCanvas(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatusMessage(data?.error || "Erro ao salvar arte.");
        return;
      }

      if (data?.project?.id) {
        setProjectId(data.project.id);
      }

      setStatusMessage(
        data?.mode === "updated"
          ? "Arte atualizada com sucesso."
          : "Arte salva com sucesso."
      );

      await loadProjects();
    } catch {
      setStatusMessage("Erro de conexão ao salvar arte.");
    } finally {
      setIsSaving(false);
    }
  }, [
    currentDesign,
    getPreviewImageFromCanvas,
    loadProjects,
    projectId,
    projectTitle,
    userEmail,
  ]);

  const loadProjectIntoEditor = useCallback(
    (project: EditorProject) => {
      setProjectId(project.id);
      applyDesign(project.design_data);
      setCampaign(null);
      setStatusMessage(`Arte carregada: ${project.title}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [applyDesign]
  );

  const applyTemplate = useCallback(
    (templateId: string) => {
      const found = NICHE_TEMPLATES.find((item) => item.id === templateId);
      if (!found) return;

      const merged = mergeDesign(currentDesign(), found.design);
      applyDesign(merged);
      setCampaign(null);
      setStatusMessage(`Template aplicado: ${found.name}`);
    },
    [applyDesign, currentDesign]
  );

  const generateCampaign = useCallback(async () => {
    setIsGeneratingCampaign(true);
    setStatusMessage("");

    try {
      const response = await fetch("/api/editor/campaign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          designData: currentDesign(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatusMessage(data?.error || "Erro ao gerar campanha.");
        return;
      }

      setCampaign(data?.campaign || null);
      setStatusMessage("Campanha gerada com sucesso.");
    } catch {
      setStatusMessage("Erro de conexão ao gerar campanha.");
    } finally {
      setIsGeneratingCampaign(false);
    }
  }, [currentDesign]);

  const copyCampaign = useCallback(async () => {
    if (!campaign?.fullText) {
      setStatusMessage("Nenhuma campanha gerada para copiar.");
      return;
    }

    try {
      await navigator.clipboard.writeText(campaign.fullText);
      setStatusMessage("Campanha copiada.");
    } catch {
      setStatusMessage("Não foi possível copiar a campanha.");
    }
  }, [campaign]);

  const copyExport = useCallback(
    async (kind: "instagram" | "facebook" | "whatsapp") => {
      if (!campaign) {
        setStatusMessage("Gere uma campanha antes de exportar.");
        return;
      }

      let text = "";

      if (kind === "instagram") {
        text = buildInstagramText(campaign);
      } else if (kind === "facebook") {
        text = buildFacebookText(campaign);
      } else {
        text = buildWhatsAppText(campaign);
      }

      try {
        await navigator.clipboard.writeText(text);
        setStatusMessage(`Texto de ${kind} copiado.`);
      } catch {
        setStatusMessage(`Não foi possível copiar o texto de ${kind}.`);
      }
    },
    [campaign]
  );

  const deleteProject = useCallback(async () => {
    const email = userEmail.trim().toLowerCase();

    if (!projectId) {
      setStatusMessage("Nenhum projeto selecionado para excluir.");
      return;
    }

    if (!email) {
      setStatusMessage("Digite o e-mail do projeto antes de excluir.");
      return;
    }

    const confirmed = window.confirm(
      "Tem certeza que deseja excluir este projeto?"
    );

    if (!confirmed) {
      return;
    }

    setIsDeletingProject(true);
    setStatusMessage("");

    try {
      const response = await fetch("/api/editor/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: projectId,
          email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatusMessage(data?.error || "Erro ao excluir projeto.");
        return;
      }

      resetEditor();
      await loadProjects();
      setStatusMessage("Projeto excluído com sucesso.");
    } catch {
      setStatusMessage("Erro de conexão ao excluir projeto.");
    } finally {
      setIsDeletingProject(false);
    }
  }, [loadProjects, projectId, resetEditor, userEmail]);

  const duplicateProject = useCallback(async () => {
    const email = userEmail.trim().toLowerCase();

    if (!projectId) {
      setStatusMessage("Salve ou carregue um projeto antes de duplicar.");
      return;
    }

    if (!email) {
      setStatusMessage("Digite o e-mail do projeto antes de duplicar.");
      return;
    }

    setIsDuplicatingProject(true);
    setStatusMessage("");

    try {
      const response = await fetch("/api/editor/duplicate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: projectId,
          email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatusMessage(data?.error || "Erro ao duplicar projeto.");
        return;
      }

      if (data?.project) {
        setProjects((prev) => [data.project, ...prev]);
        setStatusMessage("Projeto duplicado com sucesso.");
      }
    } catch {
      setStatusMessage("Erro de conexão ao duplicar projeto.");
    } finally {
      setIsDuplicatingProject(false);
    }
  }, [projectId, userEmail]);

  const chatCampaignUrl = useMemo(() => {
    if (!campaign?.fullText) {
      return "/chat";
    }

    return `/chat?prompt=${encodeURIComponent(
      `Use esta base para continuar a campanha:\n\n${campaign.fullText}`
    )}`;
  }, [campaign]);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#0f172a,_#020617_55%)] text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 md:px-6 lg:px-8">
        <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-emerald-400">
              Aurora Editor
            </p>
            <h1 className="mt-2 text-3xl font-bold md:text-4xl">
              Editor visual da Aurora IA
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-white/70 md:text-base">
              Agora com miniaturas reais dos projetos, download com nome customizado e exportação de campanhas.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Home
            </Link>

            <Link
              href="/chat"
              className="rounded-2xl border border-emerald-400/30 bg-emerald-500/15 px-4 py-3 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/20"
            >
              Abrir Aurora
            </Link>

            <Link
              href="/planos"
              className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Planos
            </Link>

            <button
              type="button"
              onClick={downloadImage}
              className="rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-bold text-slate-950 transition hover:scale-[1.02] hover:bg-emerald-400"
            >
              Baixar arte
            </button>
          </div>
        </div>

        {statusMessage ? (
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            {statusMessage}
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[420px_minmax(0,1fr)]">
          <aside className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur">
            <div className="mb-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-200">
              {previewInfo}
            </div>

            <div className="max-h-[80vh] space-y-6 overflow-y-auto pr-1">
              <section className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <h2 className="text-lg font-semibold">Projeto</h2>

                <div className="mt-4 space-y-3">
                  <EditorText
                    label="Título da arte"
                    value={projectTitle}
                    onChange={setProjectTitle}
                    placeholder="Ex.: Campanha locadora"
                  />

                  <EditorText
                    label="E-mail do usuário"
                    value={userEmail}
                    onChange={setUserEmail}
                    placeholder="seuemail@dominio.com"
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={saveProject}
                      disabled={isSaving}
                      className="rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSaving ? "Salvando..." : "Salvar arte"}
                    </button>

                    <button
                      type="button"
                      onClick={loadProjects}
                      disabled={isLoadingProjects}
                      className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isLoadingProjects ? "Carregando..." : "Minhas artes"}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={duplicateProject}
                      disabled={isDuplicatingProject}
                      className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isDuplicatingProject ? "Duplicando..." : "Duplicar"}
                    </button>

                    <button
                      type="button"
                      onClick={deleteProject}
                      disabled={isDeletingProject}
                      className="rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200 transition hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isDeletingProject ? "Excluindo..." : "Excluir"}
                    </button>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <h2 className="text-lg font-semibold">Templates por nicho</h2>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  {NICHE_TEMPLATES.map((template) => (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => applyTemplate(template.id)}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                    >
                      {template.name}
                    </button>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4">
                <h2 className="text-lg font-semibold">Campanha automática</h2>
                <p className="mt-2 text-sm leading-6 text-white/75">
                  Gere legenda, público sugerido, CTA e hashtags com base na arte que você montou.
                </p>

                <div className="mt-4 grid grid-cols-1 gap-3">
                  <button
                    type="button"
                    onClick={generateCampaign}
                    disabled={isGeneratingCampaign}
                    className="rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isGeneratingCampaign
                      ? "Gerando campanha..."
                      : "Gerar campanha automática"}
                  </button>

                  <button
                    type="button"
                    onClick={copyCampaign}
                    className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Copiar campanha completa
                  </button>

                  <Link
                    href={chatCampaignUrl}
                    className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Enviar base para o chat
                  </Link>
                </div>
              </section>

              <section className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <h2 className="text-lg font-semibold">Exportação pronta</h2>

                <div className="mt-4 grid grid-cols-1 gap-3">
                  <button
                    type="button"
                    onClick={() => copyExport("instagram")}
                    className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Copiar texto para Instagram
                  </button>

                  <button
                    type="button"
                    onClick={() => copyExport("facebook")}
                    className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Copiar texto para Facebook
                  </button>

                  <button
                    type="button"
                    onClick={() => copyExport("whatsapp")}
                    className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Copiar texto para WhatsApp
                  </button>
                </div>
              </section>

              {projects.length > 0 ? (
                <section className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <h2 className="text-lg font-semibold">Artes salvas</h2>

                  <div className="mt-4 grid grid-cols-1 gap-3">
                    {projects.map((project) => (
                      <button
                        key={project.id}
                        type="button"
                        onClick={() => loadProjectIntoEditor(project)}
                        className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 text-left transition hover:bg-white/10"
                      >
                        <div className="aspect-[16/9] w-full overflow-hidden bg-black/30">
                          {project.preview_image_url ? (
                            <img
                              src={project.preview_image_url}
                              alt={project.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 text-sm text-white/60">
                              Sem miniatura
                            </div>
                          )}
                        </div>

                        <div className="p-4">
                          <div className="text-sm font-semibold text-white">
                            {project.title}
                          </div>
                          <div className="mt-1 text-xs text-white/60">
                            {new Date(project.updated_at).toLocaleString("pt-BR")}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>
              ) : null}

              <section className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <h2 className="text-lg font-semibold">Imagem base</h2>

                <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/5 px-4 py-6 text-center text-sm text-white/70 transition hover:bg-white/10">
                  <span className="font-semibold text-white">Selecionar imagem</span>
                  <span className="mt-1">PNG, JPG ou WEBP</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>

                <div className="mt-4 space-y-3">
                  <EditorRange
                    label="Mover imagem horizontal"
                    min={-500}
                    max={500}
                    step={1}
                    value={imageX}
                    onChange={setImageX}
                  />
                  <EditorRange
                    label="Mover imagem vertical"
                    min={-500}
                    max={500}
                    step={1}
                    value={imageY}
                    onChange={setImageY}
                  />
                  <EditorRange
                    label="Zoom da imagem"
                    min={0.5}
                    max={3}
                    step={0.01}
                    value={imageScale}
                    onChange={setImageScale}
                  />
                </div>
              </section>

              <section className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <h2 className="text-lg font-semibold">Fundo e overlay</h2>

                <div className="mt-4 grid gap-4">
                  <EditorColor
                    label="Cor de fundo"
                    value={backgroundColor}
                    onChange={setBackgroundColor}
                  />
                  <EditorColor
                    label="Cor do overlay"
                    value={overlayColor}
                    onChange={setOverlayColor}
                  />
                  <EditorRange
                    label="Opacidade do overlay"
                    min={0}
                    max={1}
                    step={0.01}
                    value={overlayOpacity}
                    onChange={setOverlayOpacity}
                  />
                </div>
              </section>

              <section className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <h2 className="text-lg font-semibold">Título principal</h2>

                <div className="mt-4 space-y-3">
                  <EditorText
                    label="Texto"
                    value={headline}
                    onChange={setHeadline}
                    placeholder="Digite o título"
                  />
                  <EditorColor
                    label="Cor do título"
                    value={headlineColor}
                    onChange={setHeadlineColor}
                  />
                  <EditorRange
                    label="Posição X"
                    min={0}
                    max={900}
                    step={1}
                    value={headlineX}
                    onChange={setHeadlineX}
                  />
                  <EditorRange
                    label="Posição Y"
                    min={0}
                    max={1000}
                    step={1}
                    value={headlineY}
                    onChange={setHeadlineY}
                  />
                  <EditorRange
                    label="Tamanho da fonte"
                    min={16}
                    max={100}
                    step={1}
                    value={headlineSize}
                    onChange={setHeadlineSize}
                  />
                </div>
              </section>

              <section className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <h2 className="text-lg font-semibold">Subtítulo</h2>

                <div className="mt-4 space-y-3">
                  <EditorText
                    label="Texto"
                    value={subheadline}
                    onChange={setSubheadline}
                    placeholder="Digite o subtítulo"
                  />
                  <EditorColor
                    label="Cor do subtítulo"
                    value={subheadlineColor}
                    onChange={setSubheadlineColor}
                  />
                  <EditorRange
                    label="Posição X"
                    min={0}
                    max={900}
                    step={1}
                    value={subheadlineX}
                    onChange={setSubheadlineX}
                  />
                  <EditorRange
                    label="Posição Y"
                    min={0}
                    max={1000}
                    step={1}
                    value={subheadlineY}
                    onChange={setSubheadlineY}
                  />
                  <EditorRange
                    label="Tamanho da fonte"
                    min={12}
                    max={80}
                    step={1}
                    value={subheadlineSize}
                    onChange={setSubheadlineSize}
                  />
                </div>
              </section>

              <section className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <h2 className="text-lg font-semibold">Botão CTA</h2>

                <div className="mt-4 space-y-3">
                  <EditorText
                    label="Texto do botão"
                    value={cta}
                    onChange={setCta}
                    placeholder="Ex.: Chame agora"
                  />
                  <EditorColor
                    label="Cor do botão"
                    value={ctaBg}
                    onChange={setCtaBg}
                  />
                  <EditorColor
                    label="Cor do texto do botão"
                    value={ctaColor}
                    onChange={setCtaColor}
                  />
                  <EditorRange
                    label="Posição X"
                    min={0}
                    max={1000}
                    step={1}
                    value={ctaX}
                    onChange={setCtaX}
                  />
                  <EditorRange
                    label="Posição Y"
                    min={0}
                    max={1000}
                    step={1}
                    value={ctaY}
                    onChange={setCtaY}
                  />
                  <EditorRange
                    label="Largura"
                    min={80}
                    max={600}
                    step={1}
                    value={ctaWidth}
                    onChange={setCtaWidth}
                  />
                  <EditorRange
                    label="Altura"
                    min={36}
                    max={120}
                    step={1}
                    value={ctaHeight}
                    onChange={setCtaHeight}
                  />
                  <EditorRange
                    label="Borda arredondada"
                    min={0}
                    max={60}
                    step={1}
                    value={ctaRadius}
                    onChange={setCtaRadius}
                  />
                  <EditorRange
                    label="Tamanho da fonte"
                    min={10}
                    max={40}
                    step={1}
                    value={ctaFontSize}
                    onChange={setCtaFontSize}
                  />
                </div>
              </section>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={resetEditor}
                  className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Novo projeto
                </button>

                <button
                  type="button"
                  onClick={downloadImage}
                  className="rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-bold text-slate-950 transition hover:scale-[1.02] hover:bg-emerald-400"
                >
                  Baixar PNG
                </button>
              </div>
            </div>
          </aside>

          <section className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Preview</h2>
                  <p className="text-sm text-white/60">1080 x 1080</p>
                </div>

                <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-xs text-white/60">
                  ID: {projectId || "novo"}
                </div>
              </div>

              <div className="flex min-h-[70vh] items-center justify-center rounded-3xl border border-white/10 bg-black/30 p-4">
                <canvas
                  ref={canvasRef}
                  width={canvasWidth}
                  height={canvasHeight}
                  className="h-auto w-full max-w-[720px] rounded-3xl border border-white/10 bg-black shadow-2xl"
                />
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-emerald-300">
                    Campanha gerada
                  </p>
                  <h2 className="mt-2 text-2xl font-bold">
                    Base comercial da sua arte
                  </h2>
                </div>

                {campaign ? (
                  <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                    {campaign.nicheLabel}
                  </span>
                ) : null}
              </div>

              {campaign ? (
                <div className="mt-5 space-y-5">
                  <CampaignBlock label="Título comercial" value={campaign.commercialTitle} />
                  <CampaignBlock label="Público sugerido" value={campaign.audience} />
                  <CampaignBlock label="Legenda" value={campaign.caption} />
                  <CampaignBlock label="CTA sugerido" value={campaign.ctaText} />
                  <CampaignBlock
                    label="Hashtags"
                    value={campaign.hashtags.join(" ")}
                  />
                </div>
              ) : (
                <div className="mt-5 rounded-2xl border border-dashed border-white/15 bg-black/20 px-4 py-10 text-center">
                  <p className="text-sm text-white/70">
                    Nenhuma campanha gerada ainda.
                  </p>
                  <p className="mt-2 text-sm text-white/50">
                    Clique em “Gerar campanha automática” para transformar sua arte em texto comercial.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(" ");
  let line = "";
  let currentY = y;

  for (let n = 0; n < words.length; n += 1) {
    const testLine = `${line}${words[n]} `;
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;

    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, currentY);
      line = `${words[n]} `;
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }

  if (line.trim()) {
    ctx.fillText(line.trim(), x, currentY);
  }
}

function CampaignBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
        {label}
      </p>
      <p className="mt-3 whitespace-pre-line text-sm leading-6 text-white/80">
        {value}
      </p>
    </div>
  );
}

type EditorRangeProps = {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
};

function EditorRange({
  label,
  min,
  max,
  step,
  value,
  onChange,
}: EditorRangeProps) {
  return (
    <label className="block">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-white/85">{label}</span>
        <span className="rounded-lg bg-white/5 px-2 py-1 text-xs text-white/70">
          {value}
        </span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-emerald-400"
      />
    </label>
  );
}

type EditorTextProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

function EditorText({ label, value, onChange, placeholder }: EditorTextProps) {
  return (
    <label className="block">
      <div className="mb-2 text-sm text-white/85">{label}</div>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-emerald-400/40 focus:bg-white/10"
      />
    </label>
  );
}

type EditorColorProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

function EditorColor({ label, value, onChange }: EditorColorProps) {
  return (
    <label className="block">
      <div className="mb-2 text-sm text-white/85">{label}</div>
      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
        <input
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-10 w-14 cursor-pointer rounded-xl border border-white/10 bg-transparent"
        />
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="flex-1 bg-transparent text-sm text-white outline-none"
        />
      </div>
    </label>
  );
}