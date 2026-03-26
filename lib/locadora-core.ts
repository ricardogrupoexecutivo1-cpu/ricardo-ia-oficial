export type Tenant = {
  id: string;
  slug: string;
  name: string;
  active: boolean;
  createdAt: string;
};

export type PlatformUserRole =
  | "platform_admin"
  | "tenant_admin"
  | "seller"
  | "finance";

export type PlatformUser = {
  id: string;
  tenantId: string;
  email: string;
  role: PlatformUserRole;
  active: boolean;
};

export type CommissionRule = {
  id: string;
  tenantId: string;
  type: "sale" | "rent";
  percent: number;
  active: boolean;
};

export type AuditLog = {
  id: string;
  tenantId: string;
  userId?: string;
  action: string;
  entity: string;
  entityId: string;
  createdAt: string;
};

export function requireTenantId(value?: string | null) {
  if (!value) {
    throw new Error("tenantId obrigatório.");
  }
  return value;
}

export function ensureActive(value: boolean | undefined) {
  return value !== false;
}