-- =========================================
-- AURORA LOCADORA
-- EXPANSÃO: BUSCA NACIONAL + ASSOCIAÇÕES + MOTORISTAS
-- =========================================

-- =========================================
-- 1) EXPANSÃO DE LOCADORAS
-- =========================================
alter table public.locadora_sellers
  add column if not exists zipcode text,
  add column if not exists latitude numeric(10,7),
  add column if not exists longitude numeric(10,7),
  add column if not exists serves_brazil boolean not null default false,
  add column if not exists serves_fleet boolean not null default false,
  add column if not exists serves_small_orders boolean not null default true,
  add column if not exists serves_large_orders boolean not null default false,
  add column if not exists sindloc_member boolean not null default false,
  add column if not exists sindloc_unit text,
  add column if not exists abla_member boolean not null default false,
  add column if not exists institutional_description text;

create index if not exists idx_locadora_sellers_zipcode
  on public.locadora_sellers(zipcode);

create index if not exists idx_locadora_sellers_lat_lng
  on public.locadora_sellers(latitude, longitude);

create index if not exists idx_locadora_sellers_sindloc_abla
  on public.locadora_sellers(sindloc_member, abla_member);

-- =========================================
-- 2) EXPANSÃO DE VEÍCULOS
-- =========================================
alter table public.locadora_vehicles
  add column if not exists quantity_available integer not null default 1,
  add column if not exists min_order_quantity integer not null default 1,
  add column if not exists max_order_quantity integer,
  add column if not exists accepts_fleet boolean not null default false,
  add column if not exists accepts_small_orders boolean not null default true,
  add column if not exists accepts_large_orders boolean not null default false,
  add column if not exists search_city text,
  add column if not exists search_state text,
  add column if not exists search_zipcode text,
  add column if not exists latitude numeric(10,7),
  add column if not exists longitude numeric(10,7);

alter table public.locadora_vehicles
  drop constraint if exists locadora_vehicles_quantity_available_check;

alter table public.locadora_vehicles
  add constraint locadora_vehicles_quantity_available_check
  check (quantity_available >= 0);

alter table public.locadora_vehicles
  drop constraint if exists locadora_vehicles_min_order_quantity_check;

alter table public.locadora_vehicles
  add constraint locadora_vehicles_min_order_quantity_check
  check (min_order_quantity >= 1);

create index if not exists idx_locadora_vehicles_search_city_state
  on public.locadora_vehicles(search_city, search_state);

create index if not exists idx_locadora_vehicles_quantity
  on public.locadora_vehicles(quantity_available);

create index if not exists idx_locadora_vehicles_fleet
  on public.locadora_vehicles(accepts_fleet, accepts_large_orders);

create index if not exists idx_locadora_vehicles_lat_lng
  on public.locadora_vehicles(latitude, longitude);

-- =========================================
-- 3) TABELA DE MOTORISTAS FREELANCE
-- SEGURANÇA FORTE E VALIDAÇÃO DOCUMENTAL
-- =========================================
create table if not exists public.locadora_drivers (
  id uuid primary key default gen_random_uuid(),

  full_name text not null,
  cpf text not null unique,
  birth_date date,
  rg text,
  cnh_number text,
  cnh_category text,
  cnh_expiration_date date,

  phone text not null,
  whatsapp text,
  email text,

  zipcode text,
  address_line text,
  address_number text,
  address_complement text,
  neighborhood text,
  city text not null,
  state text not null,
  latitude numeric(10,7),
  longitude numeric(10,7),

  emergency_contact_name text,
  emergency_contact_phone text,

  owns_vehicle boolean not null default false,
  vehicle_description text,

  can_deliver boolean not null default true,
  can_pickup boolean not null default true,
  can_travel boolean not null default false,
  serves_brazil boolean not null default false,
  serves_only_local_region boolean not null default true,

  available_small_jobs boolean not null default true,
  available_large_jobs boolean not null default false,
  available_weekends boolean not null default false,
  available_nights boolean not null default false,

  status text not null default 'pending_review',
  risk_level text not null default 'medium',
  approved_by text,
  approved_at timestamptz,

  background_check_status text not null default 'pending',
  document_review_status text not null default 'pending',
  selfie_review_status text not null default 'pending',
  proof_of_address_status text not null default 'pending',

  notes_internal text,
  blocked_reason text,

  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint locadora_drivers_status_check
    check (status in (
      'pending_review',
      'under_review',
      'approved',
      'rejected',
      'blocked',
      'suspended'
    )),

  constraint locadora_drivers_risk_level_check
    check (risk_level in ('low', 'medium', 'high', 'critical')),

  constraint locadora_drivers_background_check_status_check
    check (background_check_status in ('pending', 'approved', 'rejected')),

  constraint locadora_drivers_document_review_status_check
    check (document_review_status in ('pending', 'approved', 'rejected')),

  constraint locadora_drivers_selfie_review_status_check
    check (selfie_review_status in ('pending', 'approved', 'rejected')),

  constraint locadora_drivers_proof_of_address_status_check
    check (proof_of_address_status in ('pending', 'approved', 'rejected'))
);

create index if not exists idx_locadora_drivers_city_state
  on public.locadora_drivers(city, state);

create index if not exists idx_locadora_drivers_status
  on public.locadora_drivers(status);

create index if not exists idx_locadora_drivers_risk
  on public.locadora_drivers(risk_level);

create index if not exists idx_locadora_drivers_lat_lng
  on public.locadora_drivers(latitude, longitude);

-- =========================================
-- 4) DOCUMENTOS DO MOTORISTA
-- =========================================
create table if not exists public.locadora_driver_documents (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid not null references public.locadora_drivers(id) on delete cascade,

  document_type text not null,
  file_url text not null,
  verified boolean not null default false,
  reviewed_by text,
  reviewed_at timestamptz,
  notes text,

  created_at timestamptz not null default now(),

  constraint locadora_driver_documents_type_check
    check (document_type in (
      'cnh_front',
      'cnh_back',
      'rg_front',
      'rg_back',
      'cpf',
      'selfie',
      'proof_of_address',
      'criminal_record',
      'additional'
    ))
);

create index if not exists idx_locadora_driver_documents_driver
  on public.locadora_driver_documents(driver_id);

-- =========================================
-- 5) VINCULAÇÃO DE MOTORISTA COM OPERAÇÃO
-- NEGOCIAÇÃO É ENTRE AS PARTES, MAS A PLATAFORMA REGISTRA
-- =========================================
create table if not exists public.locadora_driver_jobs (
  id uuid primary key default gen_random_uuid(),

  tenant_slug text,
  seller_id uuid references public.locadora_sellers(id) on delete set null,
  vehicle_id uuid references public.locadora_vehicles(id) on delete set null,
  driver_id uuid references public.locadora_drivers(id) on delete set null,

  job_type text not null,
  origin_city text,
  origin_state text,
  destination_city text,
  destination_state text,

  scheduled_date date,
  scheduled_time text,

  status text not null default 'open',
  amount_offered numeric(12,2),
  amount_agreed numeric(12,2),

  notes text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint locadora_driver_jobs_type_check
    check (job_type in ('pickup', 'delivery', 'transfer', 'inspection_support')),

  constraint locadora_driver_jobs_status_check
    check (status in ('open', 'assigned', 'in_progress', 'completed', 'cancelled'))
);

create index if not exists idx_locadora_driver_jobs_driver
  on public.locadora_driver_jobs(driver_id);

create index if not exists idx_locadora_driver_jobs_vehicle
  on public.locadora_driver_jobs(vehicle_id);

create index if not exists idx_locadora_driver_jobs_seller
  on public.locadora_driver_jobs(seller_id);

-- =========================================
-- 6) AUDITORIA DE MOTORISTAS
-- =========================================
create table if not exists public.locadora_driver_audit_logs (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid references public.locadora_drivers(id) on delete cascade,
  action text not null,
  performed_by text,
  details jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_locadora_driver_audit_logs_driver
  on public.locadora_driver_audit_logs(driver_id);

-- =========================================
-- 7) TRIGGERS updated_at
-- =========================================
drop trigger if exists trg_locadora_drivers_updated_at on public.locadora_drivers;
create trigger trg_locadora_drivers_updated_at
before update on public.locadora_drivers
for each row
execute function public.set_updated_at();

drop trigger if exists trg_locadora_driver_jobs_updated_at on public.locadora_driver_jobs;
create trigger trg_locadora_driver_jobs_updated_at
before update on public.locadora_driver_jobs
for each row
execute function public.set_updated_at();

-- =========================================
-- 8) RLS
-- =========================================
alter table public.locadora_drivers enable row level security;
alter table public.locadora_driver_documents enable row level security;
alter table public.locadora_driver_jobs enable row level security;
alter table public.locadora_driver_audit_logs enable row level security;

drop policy if exists locadora_drivers_deny_all on public.locadora_drivers;
create policy locadora_drivers_deny_all
on public.locadora_drivers
for all
using (false)
with check (false);

drop policy if exists locadora_driver_documents_deny_all on public.locadora_driver_documents;
create policy locadora_driver_documents_deny_all
on public.locadora_driver_documents
for all
using (false)
with check (false);

drop policy if exists locadora_driver_jobs_deny_all on public.locadora_driver_jobs;
create policy locadora_driver_jobs_deny_all
on public.locadora_driver_jobs
for all
using (false)
with check (false);

drop policy if exists locadora_driver_audit_logs_deny_all on public.locadora_driver_audit_logs;
create policy locadora_driver_audit_logs_deny_all
on public.locadora_driver_audit_logs
for all
using (false)
with check (false);