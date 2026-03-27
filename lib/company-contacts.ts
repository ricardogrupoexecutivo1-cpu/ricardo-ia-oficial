export type AuroraModule =
  | "aurora_ia"
  | "locadora"
  | "imoveis"
  | "agro"
  | "marketplace"
  | "servicos";

export type CompanyContactRole =
  | "owner"
  | "manager"
  | "sales"
  | "buyer"
  | "support"
  | "finance"
  | "custom";

export type CompanyRecord = {
  id: string;
  name: string;
  slug?: string | null;
  city?: string | null;
  state?: string | null;
  whatsapp?: string | null;
  phone?: string | null;
  email?: string | null;
  logoUrl?: string | null;
  isActive?: boolean | null;
};

export type CompanyContactRecord = {
  id: string;
  companyId: string;
  name: string;
  role: CompanyContactRole;
  whatsapp?: string | null;
  phone?: string | null;
  email?: string | null;
  isPrimary?: boolean | null;
  isActive?: boolean | null;
};

export type ListingContactInput = {
  company?: CompanyRecord | null;
  contacts?: CompanyContactRecord[] | null;
  contactId?: string | null;
  whatsappOverride?: string | null;
};

export type ResolvedContact = {
  whatsapp: string | null;
  source: "override" | "contact" | "company" | "none";
  contact: CompanyContactRecord | null;
};

export function normalizePhoneNumber(value?: string | null) {
  if (!value) return null;

  const digits = value.replace(/\D/g, "");

  if (!digits) return null;

  return digits;
}

export function buildWhatsAppUrl(
  phone?: string | null,
  message?: string | null
) {
  const normalizedPhone = normalizePhoneNumber(phone);

  if (!normalizedPhone) return null;

  const encodedMessage = encodeURIComponent(message ?? "");
  return `https://wa.me/${normalizedPhone}?text=${encodedMessage}`;
}

export function resolveListingContact(
  input: ListingContactInput
): ResolvedContact {
  const whatsappOverride = normalizePhoneNumber(input.whatsappOverride);

  if (whatsappOverride) {
    return {
      whatsapp: whatsappOverride,
      source: "override",
      contact: null,
    };
  }

  const contacts = (input.contacts ?? []).filter(
    (contact) => contact && contact.isActive !== false
  );

  if (input.contactId) {
    const selectedContact =
      contacts.find((contact) => contact.id === input.contactId) ?? null;

    const selectedContactWhatsapp = normalizePhoneNumber(
      selectedContact?.whatsapp
    );

    if (selectedContact && selectedContactWhatsapp) {
      return {
        whatsapp: selectedContactWhatsapp,
        source: "contact",
        contact: selectedContact,
      };
    }
  }

  const primaryContact =
    contacts.find((contact) => contact.isPrimary === true) ?? null;

  const primaryContactWhatsapp = normalizePhoneNumber(primaryContact?.whatsapp);

  if (primaryContact && primaryContactWhatsapp) {
    return {
      whatsapp: primaryContactWhatsapp,
      source: "contact",
      contact: primaryContact,
    };
  }

  const companyWhatsapp = normalizePhoneNumber(input.company?.whatsapp);

  if (companyWhatsapp) {
    return {
      whatsapp: companyWhatsapp,
      source: "company",
      contact: null,
    };
  }

  return {
    whatsapp: null,
    source: "none",
    contact: null,
  };
}

export function buildListingWhatsAppUrl(
  input: ListingContactInput,
  message: string
) {
  const resolved = resolveListingContact(input);

  if (!resolved.whatsapp) {
    return null;
  }

  return buildWhatsAppUrl(resolved.whatsapp, message);
}

export function hasValidWhatsApp(input: ListingContactInput) {
  return Boolean(resolveListingContact(input).whatsapp);
}