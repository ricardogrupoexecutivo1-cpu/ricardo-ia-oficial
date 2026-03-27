-- =========================================================
-- AURORA BASE PROFISSIONAL
-- companies
-- company_contacts
-- listings
-- listing_locations
-- preparado para AGRO, locadoras e imóveis
-- =========================================================

create extension if not exists pgcrypto;

-- =========================================================
-- 1) COMPANIES
-- =========================================================
create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique,
  module text not null check (module in ('aurora_ia', 'locadora', 'imoveis', 'agro', 'marketplace', 'servicos')),
  category text,
  description text,
  city text,
  state text,
  country text default 'Brasil',
  whatsapp text,
  phone text,
  email text,
  logo_url text,
  website_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_companies_module on public.companies(module);
create index if not exists idx_companies_city on public.companies(city);
create index if not exists idx_companies_state on public.companies(state);
create index if not exists idx_companies_is_active on public.companies(is_active);

-- =========================================================
-- 2) COMPANY CONTACTS
-- =========================================================
create table if not exists public.company_contacts (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  name text not null,
  role text not null check (role in ('owner', 'manager', 'sales', 'buyer', 'support', 'finance', 'custom')),
  whatsapp text,
  phone text,
  email text,
  is_primary boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_company_contacts_company_id on public.company_contacts(company_id);
create index if not exists idx_company_contacts_role on public.company_contacts(role);
create index if not exists idx_company_contacts_is_primary on public.company_contacts(is_primary);
create index if not exists idx_company_contacts_is_active on public.company_contacts(is_active);

-- =========================================================
-- 3) LISTINGS
-- =========================================================
create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  contact_id uuid references public.company_contacts(id) on delete set null,

  module text not null check (module in ('aurora_ia', 'locadora', 'imoveis', 'agro', 'marketplace', 'servicos')),
  category text not null,
  subcategory text,
  title text not null,
  description text,
  city text,
  state text,
  country text default 'Brasil',

  image_url text,
  price numeric(14,2),
  whatsapp_override text,

  delivery_available boolean not null default false,
  pickup_available boolean not null default false,

  is_active boolean not null default true,
  is_featured boolean not null default false,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_listings_company_id on public.listings(company_id);
create index if not exists idx_listings_contact_id on public.listings(contact_id);
create index if not exists idx_listings_module on public.listings(module);
create index if not exists idx_listings_category on public.listings(category);
create index if not exists idx_listings_city on public.listings(city);
create index if not exists idx_listings_state on public.listings(state);
create index if not exists idx_listings_is_active on public.listings(is_active);
create index if not exists idx_listings_is_featured on public.listings(is_featured);

-- =========================================================
-- 4) LISTING LOCATIONS / COVERAGE
-- =========================================================
create table if not exists public.listing_locations (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null unique references public.listings(id) on delete cascade,

  country text default 'Brasil',
  state text,
  city text,
  neighborhood text,
  postal_code text,

  latitude double precision,
  longitude double precision,

  coverage_type text not null check (coverage_type in ('local', 'regional', 'state', 'national')),
  max_radius_km numeric(10,2),

  serves_cities text[] default '{}',
  serves_states text[] default '{}',
  serves_nationally boolean not null default false,

  delivery_available boolean not null default false,
  pickup_available boolean not null default false,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_listing_locations_listing_id on public.listing_locations(listing_id);
create index if not exists idx_listing_locations_city on public.listing_locations(city);
create index if not exists idx_listing_locations_state on public.listing_locations(state);
create index if not exists idx_listing_locations_coverage_type on public.listing_locations(coverage_type);
create index if not exists idx_listing_locations_serves_nationally on public.listing_locations(serves_nationally);

-- =========================================================
-- 5) UPDATED_AT AUTOMÁTICO
-- =========================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_companies_updated_at on public.companies;
create trigger trg_companies_updated_at
before update on public.companies
for each row
execute function public.set_updated_at();

drop trigger if exists trg_company_contacts_updated_at on public.company_contacts;
create trigger trg_company_contacts_updated_at
before update on public.company_contacts
for each row
execute function public.set_updated_at();

drop trigger if exists trg_listings_updated_at on public.listings;
create trigger trg_listings_updated_at
before update on public.listings
for each row
execute function public.set_updated_at();

drop trigger if exists trg_listing_locations_updated_at on public.listing_locations;
create trigger trg_listing_locations_updated_at
before update on public.listing_locations
for each row
execute function public.set_updated_at();

-- =========================================================
-- 6) VIEW DE CONTATO RESOLVIDO DO ANÚNCIO
-- prioridade:
-- 1. whatsapp_override do listing
-- 2. whatsapp do contact_id
-- 3. whatsapp do contato primário da empresa
-- 4. whatsapp da empresa
-- =========================================================
create or replace view public.v_listing_contact_resolved as
select
  l.id as listing_id,
  l.title,
  l.module,
  l.category,
  l.company_id,
  c.name as company_name,
  l.contact_id,

  case
    when nullif(regexp_replace(coalesce(l.whatsapp_override, ''), '\D', '', 'g'), '') is not null
      then regexp_replace(l.whatsapp_override, '\D', '', 'g')
    when nullif(regexp_replace(coalesce(cc.whatsapp, ''), '\D', '', 'g'), '') is not null
      then regexp_replace(cc.whatsapp, '\D', '', 'g')
    when nullif(regexp_replace(coalesce(ccp.whatsapp, ''), '\D', '', 'g'), '') is not null
      then regexp_replace(ccp.whatsapp, '\D', '', 'g')
    when nullif(regexp_replace(coalesce(c.whatsapp, ''), '\D', '', 'g'), '') is not null
      then regexp_replace(c.whatsapp, '\D', '', 'g')
    else null
  end as resolved_whatsapp,

  case
    when nullif(regexp_replace(coalesce(l.whatsapp_override, ''), '\D', '', 'g'), '') is not null
      then 'override'
    when nullif(regexp_replace(coalesce(cc.whatsapp, ''), '\D', '', 'g'), '') is not null
      then 'contact'
    when nullif(regexp_replace(coalesce(ccp.whatsapp, ''), '\D', '', 'g'), '') is not null
      then 'primary_contact'
    when nullif(regexp_replace(coalesce(c.whatsapp, ''), '\D', '', 'g'), '') is not null
      then 'company'
    else 'none'
  end as resolved_source

from public.listings l
join public.companies c
  on c.id = l.company_id
left join public.company_contacts cc
  on cc.id = l.contact_id
left join lateral (
  select x.*
  from public.company_contacts x
  where x.company_id = l.company_id
    and x.is_primary = true
    and x.is_active = true
  order by x.created_at asc
  limit 1
) ccp on true;

-- =========================================================
-- 7) RLS
-- inicialmente liberamos leitura pública apenas dos ativos
-- escrita fica para service role / backend por enquanto
-- =========================================================
alter table public.companies enable row level security;
alter table public.company_contacts enable row level security;
alter table public.listings enable row level security;
alter table public.listing_locations enable row level security;

drop policy if exists companies_select_active on public.companies;
create policy companies_select_active
on public.companies
for select
using (is_active = true);

drop policy if exists company_contacts_select_active on public.company_contacts;
create policy company_contacts_select_active
on public.company_contacts
for select
using (is_active = true);

drop policy if exists listings_select_active on public.listings;
create policy listings_select_active
on public.listings
for select
using (is_active = true);

drop policy if exists listing_locations_select_all on public.listing_locations;
create policy listing_locations_select_all
on public.listing_locations
for select
using (true);

-- =========================================================
-- 8) OBSERVAÇÕES
-- inserts/updates/deletes ficam pelo backend com service role
-- depois podemos criar multi-tenant por owner/company_user
-- =========================================================