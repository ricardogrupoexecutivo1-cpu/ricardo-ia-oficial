export type AuroraReferenceImageInput = {
  referenceImageUrl?: string | null;
  referenceImageName?: string | null;
};

export function buildAuroraReferenceContext(
  input: AuroraReferenceImageInput
) {
  const imageUrl = String(input.referenceImageUrl || "").trim();
  const imageName = String(input.referenceImageName || "").trim();

  if (!imageUrl) {
    return {
      hasReferenceImage: false,
      promptBlock: "",
      shortLabel: null,
    };
  }

  const safeImageName = imageName || "imagem-enviada-pelo-usuario";

  const promptBlock = `
CONTEXTO VISUAL DO USUÁRIO:
- O usuário enviou uma imagem de referência para orientar a resposta.
- Nome do arquivo: ${safeImageName}
- URL da imagem: ${imageUrl}

INSTRUÇÕES IMPORTANTES:
- Considere que a imagem pode ser uma logo, produto, fachada, veículo, arte, identidade visual, post, anúncio ou referência criativa.
- Ao responder, leve em conta que o usuário quer campanhas, ideias, posicionamento, criativos, anúncios, copies, variações visuais ou orientação comercial com base nessa referência.
- Se o usuário pedir campanha, anúncio, criativo, identidade visual, legenda, texto de vendas, oferta, branding, roteiro ou post, adapte a resposta usando a imagem como base visual e estratégica.
- Se o usuário pedir geração de imagem, trate a imagem enviada como referência principal de estilo, tema, produto, marca ou composição.
- Não invente detalhes específicos que não possam ser confirmados pela imagem; trate a imagem como referência visual geral.
- Quando fizer sentido, mencione que a resposta foi estruturada com base na imagem de referência enviada pelo usuário.
`.trim();

  return {
    hasReferenceImage: true,
    promptBlock,
    shortLabel: safeImageName,
  };
}

export function appendReferenceContextToUserMessage(
  userMessage: string,
  input: AuroraReferenceImageInput
) {
  const baseMessage = String(userMessage || "").trim();
  const reference = buildAuroraReferenceContext(input);

  if (!reference.hasReferenceImage) {
    return baseMessage;
  }

  return `${reference.promptBlock}

PEDIDO DO USUÁRIO:
${baseMessage}`.trim();
}