export const AGRO_WHATSAPP_NUMBER = "5531997490074";

export function buildAgroWhatsAppLink(message: string) {
  const cleanNumber = AGRO_WHATSAPP_NUMBER.replace(/\D/g, "");
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
}