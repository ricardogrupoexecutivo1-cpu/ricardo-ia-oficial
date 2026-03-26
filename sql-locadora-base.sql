-- =========================================
-- AURORA LOCADORA - BASE INICIAL
-- multi-tenant + sellers + vehicles + audit
-- =========================================

create extension if not exists pgcrypto;

-- =========================================
-- 1) LOCADORAS / EMPRESAS (TENANTS)
-- =========================================
create table if not exists public.locadora_sellers (
  id uuid primary key default gen_random_uuid(),
  tenant_slug text not null unique,
  company_name text not null,
  trade_name text not null,
  type text not null default 'locadora',
  tagline text,
  phone text,
  whatsapp text,
  logo_text text,
  logo_url text,
  city text,
  state text,
  active boolean not null default true,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint locadora_sellers_type_check
    check (type in ('locadora', 'revenda', 'parceiro'))
);

create index if not exists idx_locadora_sellers_active
  on public.locadora_sellers(active);

create index if not exists idx_locadora_sellers_city_state
  on public.locadora_sellers(city, state);

-- =========================================
-- 2) VEÍCULOS
-- =========================================
create table if not exists public.locadora_vehicles (
  id uuid primary key default gen_random_uuid(),
  tenant_slug text not null,
  seller_id uuid not null references public.locadora_sellers(id) on delete cascade,

  slug text not null unique,
  title text not null,
  brand text not null,
  model text not null,
  year integer not null,
  category text not null,
  fuel text not null,
  transmission text not null,
  mode text[] not null default array['venda']::text[],
  status text not null default 'disponivel',

  price_sale numeric(12,2),
  price_rent_daily numeric(12,2),

  location text not null,
  city text,
  state text,
  image text not null,
  featured boolean not null default false,
  description text not null,
  badge text,
  platform_commission_percent numeric(5,2),

  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint locadora_vehicles_status_check
    check (status in ('disponivel', 'reservado', 'vendido', 'alugado', 'inativo')),

  constraint locadora_vehicles_year_check
    check (year >= 1980 and year <= 2100),

  constraint locadora_vehicles_commission_check
    check (
      platform_commission_percent is null
      or (platform_commission_percent >= 0 and platform_commission_percent <= 100)
    )
);

create index if not exists idx_locadora_vehicles_seller_id
  on public.locadora_vehicles(seller_id);

create index if not exists idx_locadora_vehicles_tenant_slug
  on public.locadora_vehicles(tenant_slug);

create index if not exists idx_locadora_vehicles_status
  on public.locadora_vehicles(status);

create index if not exists idx_locadora_vehicles_featured
  on public.locadora_vehicles(featured);

-- =========================================
-- 3) LEADS
-- =========================================
create table if not exists public.locadora_leads (
  id uuid primary key default gen_random_uuid(),
  tenant_slug text not null,
  seller_id uuid references public.locadora_sellers(id) on delete set null,
  vehicle_id uuid references public.locadora_vehicles(id) on delete set null,

  customer_name text not null,
  customer_phone text,
  customer_whatsapp text,
  customer_email text,
  interest_type text not null default 'venda',
  message text,
  source text default 'site',
  status text not null default 'novo',

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint locadora_leads_interest_type_check
    check (interest_type in ('venda', 'aluguel', 'financiamento', 'geral')),

  constraint locadora_leads_status_check
    check (status in ('novo', 'em_atendimento', 'convertido', 'perdido'))
);

create index if not exists idx_locadora_leads_tenant_slug
  on public.locadora_leads(tenant_slug);

create index if not exists idx_locadora_leads_vehicle_id
  on public.locadora_leads(vehicle_id);

create index if not exists idx_locadora_leads_status
  on public.locadora_leads(status);

-- =========================================
-- 4) USUÁRIOS ADMIN DA LOCADORA
-- =========================================
create table if not exists public.locadora_admin_users (
  id uuid primary key default gen_random_uuid(),
  tenant_slug text not null,
  seller_id uuid references public.locadora_sellers(id) on delete cascade,

  auth_user_id uuid,
  full_name text,
  email text not null,
  role text not null default 'tenant_admin',
  active boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint locadora_admin_users_email_unique unique (email),
  constraint locadora_admin_users_role_check
    check (role in ('platform_admin', 'tenant_admin', 'seller', 'finance'))
);

create index if not exists idx_locadora_admin_users_tenant_slug
  on public.locadora_admin_users(tenant_slug);

-- =========================================
-- 5) REGRAS DE COMISSÃO
-- =========================================
create table if not exists public.locadora_commissions (
  id uuid primary key default gen_random_uuid(),
  tenant_slug text not null,
  seller_id uuid references public.locadora_sellers(id) on delete cascade,

  operation_type text not null,
  percent numeric(5,2) not null,
  active boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint locadora_commissions_operation_type_check
    check (operation_type in ('sale', 'rent')),

  constraint locadora_commissions_percent_check
    check (percent >= 0 and percent <= 100)
);

create index if not exists idx_locadora_commissions_tenant_slug
  on public.locadora_commissions(tenant_slug);

-- =========================================
-- 6) AUDITORIA
-- =========================================
create table if not exists public.locadora_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_slug text not null,
  seller_id uuid references public.locadora_sellers(id) on delete set null,
  admin_user_id uuid references public.locadora_admin_users(id) on delete set null,

  action text not null,
  entity text not null,
  entity_id text not null,
  details jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_locadora_audit_logs_tenant_slug
  on public.locadora_audit_logs(tenant_slug);

create index if not exists idx_locadora_audit_logs_entity
  on public.locadora_audit_logs(entity, entity_id);

-- =========================================
-- 7) updated_at automático
-- =========================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_locadora_sellers_updated_at on public.locadora_sellers;
create trigger trg_locadora_sellers_updated_at
before update on public.locadora_sellers
for each row
execute function public.set_updated_at();

drop trigger if exists trg_locadora_vehicles_updated_at on public.locadora_vehicles;
create trigger trg_locadora_vehicles_updated_at
before update on public.locadora_vehicles
for each row
execute function public.set_updated_at();

drop trigger if exists trg_locadora_leads_updated_at on public.locadora_leads;
create trigger trg_locadora_leads_updated_at
before update on public.locadora_leads
for each row
execute function public.set_updated_at();

drop trigger if exists trg_locadora_admin_users_updated_at on public.locadora_admin_users;
create trigger trg_locadora_admin_users_updated_at
before update on public.locadora_admin_users
for each row
execute function public.set_updated_at();

drop trigger if exists trg_locadora_commissions_updated_at on public.locadora_commissions;
create trigger trg_locadora_commissions_updated_at
before update on public.locadora_commissions
for each row
execute function public.set_updated_at();

-- =========================================
-- 8) RLS
-- =========================================
alter table public.locadora_sellers enable row level security;
alter table public.locadora_vehicles enable row level security;
alter table public.locadora_leads enable row level security;
alter table public.locadora_admin_users enable row level security;
alter table public.locadora_commissions enable row level security;
alter table public.locadora_audit_logs enable row level security;

-- leitura pública inicial somente para vitrine ativa
drop policy if exists locadora_sellers_public_select on public.locadora_sellers;
create policy locadora_sellers_public_select
on public.locadora_sellers
for select
using (active = true);

drop policy if exists locadora_vehicles_public_select on public.locadora_vehicles;
create policy locadora_vehicles_public_select
on public.locadora_vehicles
for select
using (active = true);

-- restante fechado por enquanto
drop policy if exists locadora_leads_deny_all on public.locadora_leads;
create policy locadora_leads_deny_all
on public.locadora_leads
for all
using (false)
with check (false);

drop policy if exists locadora_admin_users_deny_all on public.locadora_admin_users;
create policy locadora_admin_users_deny_all
on public.locadora_admin_users
for all
using (false)
with check (false);

drop policy if exists locadora_commissions_deny_all on public.locadora_commissions;
create policy locadora_commissions_deny_all
on public.locadora_commissions
for all
using (false)
with check (false);

drop policy if exists locadora_audit_logs_deny_all on public.locadora_audit_logs;
create policy locadora_audit_logs_deny_all
on public.locadora_audit_logs
for all
using (false)
with check (false);

-- sellers e vehicles também ficam fechados para escrita pública
drop policy if exists locadora_sellers_deny_write on public.locadora_sellers;
create policy locadora_sellers_deny_write
on public.locadora_sellers
for all
using (active = true)
with check (false);

drop policy if exists locadora_vehicles_deny_write on public.locadora_vehicles;
create policy locadora_vehicles_deny_write
on public.locadora_vehicles
for all
using (active = true)
with check (false);