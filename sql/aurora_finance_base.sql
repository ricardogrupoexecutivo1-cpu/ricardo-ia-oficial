begin;

create extension if not exists pgcrypto;

create table if not exists public.finance_categories (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null,
  name text not null,
  description text null,
  color text null,
  icon text null,
  is_active boolean not null default true,
  created_by uuid null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.finance_activities (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null,
  category_id uuid null references public.finance_categories(id) on delete set null,
  name text not null,
  description text null,
  is_active boolean not null default true,
  created_by uuid null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.finance_cost_centers (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null,
  name text not null,
  description text null,
  code text null,
  is_active boolean not null default true,
  created_by uuid null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.finance_accounts (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null,
  name text not null,
  description text null,
  account_type text not null default 'cash',
  currency_code text not null default 'BRL',
  opening_balance numeric(14,2) not null default 0,
  current_balance numeric(14,2) not null default 0,
  is_active boolean not null default true,
  created_by uuid null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint finance_accounts_account_type_check
    check (account_type in ('cash', 'bank', 'pix', 'card', 'wallet', 'other'))
);

create table if not exists public.finance_entries (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null,
  account_id uuid null references public.finance_accounts(id) on delete set null,
  category_id uuid null references public.finance_categories(id) on delete set null,
  activity_id uuid null references public.finance_activities(id) on delete set null,
  cost_center_id uuid null references public.finance_cost_centers(id) on delete set null,

  entry_type text not null,
  title text not null,
  description text null,

  document_type text not null default 'other',
  document_number text null,

  amount numeric(14,2) not null,
  currency_code text not null default 'BRL',

  status text not null default 'open',
  payment_method text null,

  issue_date date null,
  due_date date null,
  settlement_date date null,
  competence_date date null,

  company_unit text null,
  vendor_name text null,
  customer_name text null,
  tags text[] not null default '{}',

  metadata jsonb not null default '{}'::jsonb,

  created_by uuid null,
  updated_by uuid null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint finance_entries_entry_type_check
    check (entry_type in ('income', 'expense')),
  constraint finance_entries_document_type_check
    check (document_type in ('invoice', 'receipt', 'service_order', 'contract', 'internal_note', 'other')),
  constraint finance_entries_status_check
    check (status in ('open', 'pending', 'approved', 'received', 'paid', 'cancelled')),
  constraint finance_entries_amount_check
    check (amount >= 0)
);

create table if not exists public.finance_entry_files (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null,
  finance_entry_id uuid not null references public.finance_entries(id) on delete cascade,
  file_name text not null,
  file_path text not null,
  file_url text null,
  mime_type text null,
  file_size bigint null,
  created_by uuid null,
  created_at timestamptz not null default now()
);

create table if not exists public.finance_company_settings (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null unique,
  default_currency text not null default 'BRL',
  default_locale text not null default 'pt-BR',
  fiscal_document_label text null,
  income_label text null default 'Entrada',
  expense_label text null default 'Saída',
  category_label text null default 'Categoria',
  activity_label text null default 'Atividade',
  cost_center_label text null default 'Centro de custo',
  account_label text null default 'Conta',
  allow_custom_categories boolean not null default true,
  allow_custom_activities boolean not null default true,
  allow_custom_cost_centers boolean not null default true,
  created_by uuid null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists finance_categories_company_name_idx
  on public.finance_categories(company_id, lower(name));

create unique index if not exists finance_activities_company_name_idx
  on public.finance_activities(company_id, lower(name));

create unique index if not exists finance_cost_centers_company_name_idx
  on public.finance_cost_centers(company_id, lower(name));

create unique index if not exists finance_accounts_company_name_idx
  on public.finance_accounts(company_id, lower(name));

create index if not exists finance_entries_company_id_idx
  on public.finance_entries(company_id);

create index if not exists finance_entries_account_id_idx
  on public.finance_entries(account_id);

create index if not exists finance_entries_category_id_idx
  on public.finance_entries(category_id);

create index if not exists finance_entries_activity_id_idx
  on public.finance_entries(activity_id);

create index if not exists finance_entries_cost_center_id_idx
  on public.finance_entries(cost_center_id);

create index if not exists finance_entries_status_idx
  on public.finance_entries(status);

create index if not exists finance_entries_entry_type_idx
  on public.finance_entries(entry_type);

create index if not exists finance_entries_issue_date_idx
  on public.finance_entries(issue_date);

create index if not exists finance_entries_due_date_idx
  on public.finance_entries(due_date);

create index if not exists finance_entries_settlement_date_idx
  on public.finance_entries(settlement_date);

create index if not exists finance_entries_competence_date_idx
  on public.finance_entries(competence_date);

create index if not exists finance_entry_files_company_id_idx
  on public.finance_entry_files(company_id);

create index if not exists finance_entry_files_entry_id_idx
  on public.finance_entry_files(finance_entry_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_finance_categories_updated_at on public.finance_categories;
create trigger trg_finance_categories_updated_at
before update on public.finance_categories
for each row
execute function public.set_updated_at();

drop trigger if exists trg_finance_activities_updated_at on public.finance_activities;
create trigger trg_finance_activities_updated_at
before update on public.finance_activities
for each row
execute function public.set_updated_at();

drop trigger if exists trg_finance_cost_centers_updated_at on public.finance_cost_centers;
create trigger trg_finance_cost_centers_updated_at
before update on public.finance_cost_centers
for each row
execute function public.set_updated_at();

drop trigger if exists trg_finance_accounts_updated_at on public.finance_accounts;
create trigger trg_finance_accounts_updated_at
before update on public.finance_accounts
for each row
execute function public.set_updated_at();

drop trigger if exists trg_finance_entries_updated_at on public.finance_entries;
create trigger trg_finance_entries_updated_at
before update on public.finance_entries
for each row
execute function public.set_updated_at();

drop trigger if exists trg_finance_company_settings_updated_at on public.finance_company_settings;
create trigger trg_finance_company_settings_updated_at
before update on public.finance_company_settings
for each row
execute function public.set_updated_at();

create or replace view public.finance_entries_view as
select
  fe.id,
  fe.company_id,
  fe.entry_type,
  fe.title,
  fe.description,
  fe.document_type,
  fe.document_number,
  fe.amount,
  fe.currency_code,
  fe.status,
  fe.payment_method,
  fe.issue_date,
  fe.due_date,
  fe.settlement_date,
  fe.competence_date,
  fe.company_unit,
  fe.vendor_name,
  fe.customer_name,
  fe.tags,
  fe.metadata,
  fe.account_id,
  fa.name as account_name,
  fe.category_id,
  fc.name as category_name,
  fe.activity_id,
  fact.name as activity_name,
  fe.cost_center_id,
  fcc.name as cost_center_name,
  fe.created_by,
  fe.updated_by,
  fe.created_at,
  fe.updated_at
from public.finance_entries fe
left join public.finance_accounts fa on fa.id = fe.account_id
left join public.finance_categories fc on fc.id = fe.category_id
left join public.finance_activities fact on fact.id = fe.activity_id
left join public.finance_cost_centers fcc on fcc.id = fe.cost_center_id;

insert into public.finance_company_settings (
  company_id,
  default_currency,
  default_locale,
  fiscal_document_label,
  income_label,
  expense_label,
  category_label,
  activity_label,
  cost_center_label,
  account_label
)
select
  p.company_id,
  'BRL',
  'pt-BR',
  'Documento fiscal',
  'Entrada',
  'Saída',
  'Categoria',
  'Atividade',
  'Centro de custo',
  'Conta'
from public.profiles p
where p.company_id is not null
on conflict (company_id) do nothing;

commit;