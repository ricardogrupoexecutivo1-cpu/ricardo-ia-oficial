import { NextRequest, NextResponse } from "next/server";

type LoadedImage = {
  src: string;
  width: number;
  height: number;
};

type EditorDesignData = {
  projectTitle?: string;
  userEmail?: string;
  backgroundColor?: string;
  headline?: string;
  subheadline?: string;
  cta?: string;
  headlineX?: number;
  headlineY?: number;
  headlineSize?: number;
  headlineColor?: string;
  subheadlineX?: number;
  subheadlineY?: number;
  subheadlineSize?: number;
  subheadlineColor?: string;
  ctaX?: number;
  ctaY?: number;
  ctaWidth?: number;
  ctaHeight?: number;
  ctaRadius?: number;
  ctaBg?: string;
  ctaColor?: string;
  ctaFontSize?: number;
  imageX?: number;
  imageY?: number;
  imageScale?: number;
  overlayOpacity?: number;
  overlayColor?: string;
  loadedImage?: LoadedImage | null;
};

type CampaignRequestBody = {
  designData?: EditorDesignData;
};

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function detectNiche(text: string) {
  const value = text.toLowerCase();

  if (
    value.includes("seminovos") ||
    value.includes("veículo") ||
    value.includes("veiculos") ||
    value.includes("carro") ||
    value.includes("hilux") ||
    value.includes("locadora") ||
    value.includes("aluguel")
  ) {
    return "locadora";
  }

  if (
    value.includes("restaurante") ||
    value.includes("hamburguer") ||
    value.includes("pizza") ||
    value.includes("lanche") ||
    value.includes("delivery") ||
    value.includes("prato")
  ) {
    return "restaurante";
  }

  if (
    value.includes("imóvel") ||
    value.includes("imovel") ||
    value.includes("casa") ||
    value.includes("apartamento") ||
    value.includes("lote") ||
    value.includes("imobiliária") ||
    value.includes("imobiliaria")
  ) {
    return "imobiliaria";
  }

  if (
    value.includes("oficina") ||
    value.includes("mecânica") ||
    value.includes("mecanica") ||
    value.includes("revisão") ||
    value.includes("revisao") ||
    value.includes("manutenção") ||
    value.includes("manutencao")
  ) {
    return "oficina";
  }

  if (
    value.includes("promoção") ||
    value.includes("promocao") ||
    value.includes("oferta") ||
    value.includes("loja") ||
    value.includes("produto") ||
    value.includes("comprar")
  ) {
    return "loja";
  }

  return "geral";
}

function buildCampaignByNiche(
  niche: string,
  headline: string,
  subheadline: string,
  cta: string,
  projectTitle: string
) {
  const baseTitle = headline || projectTitle || "Campanha Aurora";
  const baseSubtitle = subheadline || "Condição especial por tempo limitado";
  const action = cta || "Saiba mais";

  switch (niche) {
    case "locadora":
      return {
        nicheLabel: "Locadora / Veículos",
        audience: "Pessoas buscando aluguel, seminovos, mobilidade e oportunidade local.",
        commercialTitle: `${baseTitle} | Condições especiais para você`,
        caption:
          `${baseTitle}\n\n` +
          `${baseSubtitle}.\n` +
          `Atendimento rápido, opções atrativas e negociação facilitada para quem quer sair na frente.\n\n` +
          `Fale com nossa equipe e descubra a melhor opção para o seu momento.`,
        ctaText: action,
        hashtags: [
          "#seminovos",
          "#alugueldeveiculos",
          "#veiculos",
          "#ofertas",
          "#bh",
          "#auroraia",
        ],
      };

    case "restaurante":
      return {
        nicheLabel: "Restaurante / Delivery",
        audience: "Clientes locais buscando praticidade, sabor e compra rápida.",
        commercialTitle: `${baseTitle} | Peça hoje mesmo`,
        caption:
          `${baseTitle}\n\n` +
          `${baseSubtitle}.\n` +
          `Uma campanha feita para chamar atenção, despertar desejo e aumentar seus pedidos.\n\n` +
          `Entre em contato agora e aproveite essa oportunidade.`,
        ctaText: action,
        hashtags: [
          "#restaurante",
          "#delivery",
          "#comida",
          "#oferta",
          "#pedidoonline",
          "#auroraia",
        ],
      };

    case "imobiliaria":
      return {
        nicheLabel: "Imobiliária",
        audience: "Pessoas interessadas em moradia, investimento e oportunidades imobiliárias.",
        commercialTitle: `${baseTitle} | Seu próximo imóvel pode estar aqui`,
        caption:
          `${baseTitle}\n\n` +
          `${baseSubtitle}.\n` +
          `Mais segurança, confiança e atendimento para ajudar você a encontrar a oportunidade certa.\n\n` +
          `Converse com nossa equipe e saiba mais.`,
        ctaText: action,
        hashtags: [
          "#imoveis",
          "#imobiliaria",
          "#apartamento",
          "#casa",
          "#investimento",
          "#auroraia",
        ],
      };

    case "oficina":
      return {
        nicheLabel: "Oficina / Automotivo",
        audience: "Motoristas que precisam de revisão, manutenção e atendimento confiável.",
        commercialTitle: `${baseTitle} | Cuidado profissional para seu veículo`,
        caption:
          `${baseTitle}\n\n` +
          `${baseSubtitle}.\n` +
          `Uma comunicação direta para atrair clientes e gerar mais agendamentos para o seu negócio.\n\n` +
          `Chame agora e garanta seu atendimento.`,
        ctaText: action,
        hashtags: [
          "#oficina",
          "#mecanica",
          "#revisao",
          "#manutencao",
          "#automotivo",
          "#auroraia",
        ],
      };

    case "loja":
      return {
        nicheLabel: "Loja / Varejo",
        audience: "Consumidores interessados em promoção, novidade e compra imediata.",
        commercialTitle: `${baseTitle} | Oferta por tempo limitado`,
        caption:
          `${baseTitle}\n\n` +
          `${baseSubtitle}.\n` +
          `Campanha criada para aumentar atenção, gerar cliques e acelerar a decisão de compra.\n\n` +
          `Aproveite agora antes que acabe.`,
        ctaText: action,
        hashtags: [
          "#promocao",
          "#oferta",
          "#loja",
          "#comprar",
          "#desconto",
          "#auroraia",
        ],
      };

    default:
      return {
        nicheLabel: "Campanha geral",
        audience: "Público interessado no produto, serviço ou oportunidade apresentada na arte.",
        commercialTitle: `${baseTitle} | Destaque sua oferta`,
        caption:
          `${baseTitle}\n\n` +
          `${baseSubtitle}.\n` +
          `Uma campanha criada para chamar atenção e transformar visual em oportunidade comercial.\n\n` +
          `Entre em contato e descubra mais detalhes.`,
        ctaText: action,
        hashtags: [
          "#marketing",
          "#campanha",
          "#negocios",
          "#divulgacao",
          "#auroraia",
        ],
      };
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CampaignRequestBody;
    const design = body?.designData || {};

    const headline = normalizeText(design.headline);
    const subheadline = normalizeText(design.subheadline);
    const cta = normalizeText(design.cta);
    const projectTitle = normalizeText(design.projectTitle);

    const analysisText = [projectTitle, headline, subheadline, cta]
      .filter(Boolean)
      .join(" ");

    const niche = detectNiche(analysisText);
    const campaign = buildCampaignByNiche(
      niche,
      headline,
      subheadline,
      cta,
      projectTitle
    );

    const fullText =
      `Título comercial: ${campaign.commercialTitle}\n\n` +
      `Público sugerido: ${campaign.audience}\n\n` +
      `Legenda:\n${campaign.caption}\n\n` +
      `CTA sugerido: ${campaign.ctaText}\n\n` +
      `Hashtags: ${campaign.hashtags.join(" ")}`;

    return NextResponse.json({
      success: true,
      campaign: {
        niche: niche,
        nicheLabel: campaign.nicheLabel,
        commercialTitle: campaign.commercialTitle,
        audience: campaign.audience,
        caption: campaign.caption,
        ctaText: campaign.ctaText,
        hashtags: campaign.hashtags,
        fullText,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Erro interno ao gerar campanha.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}