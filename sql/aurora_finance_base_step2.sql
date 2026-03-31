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

update public.finance_company_settings
set
  expense_label = 'Saída',
  updated_at = now()
where expense_label = 'SaÃ­da';

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

alter table public.finance_categories enable row level security;
alter table public.finance_activities enable row level security;
alter table public.finance_cost_centers enable row level security;
alter table public.finance_accounts enable row level security;
alter table public.finance_entries enable row level security;
alter table public.finance_entry_files enable row level security;
alter table public.finance_company_settings enable row level security;

drop policy if exists finance_categories_select_company on public.finance_categories;
create policy finance_categories_select_company
on public.finance_categories
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.company_id = finance_categories.company_id
  )
);

drop policy if exists finance_categories_insert_company on public.finance_categories;
create policy finance_categories_insert_company
on public.finance_categories
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.company_id = finance_categories.company_id
  )
);

drop policy if exists finance_categories_update_company on public.finance_categories;
create policy finance_categories_update_company
on public.finance_categories
for update
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.company_id = finance_categories.company_id
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.company_id = finance_categories.company_id
  )
);

drop policy if exists finance_activities_select_company on public.finance_activities;
create policy finance_activities_select_company
on public.finance_activities
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.company_id = finance_activities.company_id
  )
);

drop policy if exists finance_activities_insert_company on public.finance_activities;
create policy finance_activities_insert_company
on public.finance_activities
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.company_id = finance_activities.company_id
  )
);

drop policy if exists finance_activities_update_company on public.finance_activities;
create policy finance_activities_update_company
on public.finance_activities
for update
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.company_id = finance_activities.company_id
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.company_id = finance_activities.company_id
  )
);

drop policy if exists finance_cost_centers_select_company on public.finance_cost_centers;
create policy finance_cost_centers_select_company
on public.finance_cost_centers
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.company_id = finance_cost_centers.company_id
  )
);

drop policy if exists finance_cost_centers_insert_company on public.finance_cost_centers;
create policy finance_cost_centers_insert_company
on public.finance_cost_centers
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.company_id = finance_cost_centers.company_id
  )
);

drop policy if exists finance_cost_centers_update_company on public.finance_cost_centers;
create policy finance_cost_centers_update_company
on public.finance_cost_centers
for update
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.company_id = finance_cost_centers.company_id
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.company_id = finance_cost_centers.company_id
  )
);

drop policy if exists finance_accounts_select_company on public.finance_accounts;
create policy finance_accounts_select_company
on public.finance_accounts
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.company_id = finance_accounts.company_id
  )
);

drop policy if exists finance_accounts_insert_company on public.finance_accounts;
create policy finance_accounts_insert_company
on public.finance_accounts
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.company_id = finance_accounts.company_id
  )
);

drop policy if exists finance_accounts_update_company on public.finance_accounts;
create policy finance_accounts_update_company
on public.finance_accounts
for update
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.company_id = finance_accounts.company_id
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.company_id = finance_accounts.company_id
  )
);

drop policy if exists finance_entries_select_company on public.finance_entries;
create policy finance_entries_select_company
on public.finance_entries
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.company_id = finance_entries.company_id
  )
);

drop policy if exists finance_entries_insert_company on public.finance_entries;
create policy finance_entries_insert_company
on public.finance_entries
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.company_id = finance_entries.company_id
  )
);

drop policy if exists finance_entries_update_company on public.finance_entries;
create policy finance_entries_update_company
on public.finance_entries
for update
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.company_id = finance_entries.company_id
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.company_id = finance_entries.company_id
  )
);

drop policy if exists finance_entry_files_select_company on public.finance_entry_files;
create policy finance_entry_files_select_company
on public.finance_entry_files
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.company_id = finance_entry_files.company_id
  )
);

drop policy if exists finance_entry_files_insert_company on public.finance_entry_files;
create policy finance_entry_files_insert_company
on public.finance_entry_files
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.company_id = finance_entry_files.company_id
  )
);

drop policy if exists finance_company_settings_select_company on public.finance_company_settings;
create policy finance_company_settings_select_company
on public.finance_company_settings
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.company_id = finance_company_settings.company_id
  )
);

drop policy if exists finance_company_settings_insert_company on public.finance_company_settings;
create policy finance_company_settings_insert_company
on public.finance_company_settings
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.company_id = finance_company_settings.company_id
  )
);

drop policy if exists finance_company_settings_update_company on public.finance_company_settings;
create policy finance_company_settings_update_company
on public.finance_company_settings
for update
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.company_id = finance_company_settings.company_id
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.company_id = finance_company_settings.company_id
  )
);