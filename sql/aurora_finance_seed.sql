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
on conflict (company_id) do update
set
  default_currency = excluded.default_currency,
  default_locale = excluded.default_locale,
  fiscal_document_label = excluded.fiscal_document_label,
  income_label = excluded.income_label,
  expense_label = excluded.expense_label,
  category_label = excluded.category_label,
  activity_label = excluded.activity_label,
  cost_center_label = excluded.cost_center_label,
  account_label = excluded.account_label,
  updated_at = now();

insert into public.finance_categories (company_id, name, description, is_active)
select p.company_id, x.name, x.description, true
from public.profiles p
cross join (
  values
    ('Receitas', 'Entradas financeiras e faturamento'),
    ('Operações', 'Custos operacionais da empresa'),
    ('Logística', 'Fretes, deslocamentos e entregas'),
    ('Comercial', 'Comissões, apoio comercial e relacionamento'),
    ('Administrativo', 'Rotina administrativa e estrutura'),
    ('Financeiro', 'Taxas, repasses, ajustes e controle financeiro')
) as x(name, description)
where p.company_id is not null
on conflict (company_id, lower(name)) do nothing;

insert into public.finance_activities (company_id, category_id, name, description, is_active)
select
  p.company_id,
  fc.id,
  x.name,
  x.description,
  true
from public.profiles p
join public.finance_categories fc
  on fc.company_id = p.company_id
join (
  values
    ('Operações', 'Apoio de campo', 'Atividade operacional externa'),
    ('Operações', 'Caixa viagem', 'Controle de caixa de viagem'),
    ('Logística', 'Frete local', 'Frete e entregas locais'),
    ('Comercial', 'Comissão interna', 'Comissões e apoio ao fechamento'),
    ('Financeiro', 'Repasse', 'Repasse financeiro interno ou externo'),
    ('Administrativo', 'Custo operacional', 'Controle geral de custo operacional'),
    ('Receitas', 'Contrato empresarial', 'Receita por contrato ou prestação'),
    ('Comercial', 'Apoio comercial', 'Suporte de equipe comercial')
) as x(category_name, name, description)
  on lower(fc.name) = lower(x.category_name)
where p.company_id is not null
on conflict (company_id, lower(name)) do nothing;

insert into public.finance_cost_centers (company_id, name, description, code, is_active)
select
  p.company_id,
  x.name,
  x.description,
  x.code,
  true
from public.profiles p
cross join (
  values
    ('Operação externa', 'Custos ligados a campo e atendimento externo', 'OPEXT'),
    ('Vendas', 'Centro de custo da área comercial', 'VENDAS'),
    ('Administrativo', 'Centro de custo administrativo', 'ADM'),
    ('Financeiro', 'Centro de custo financeiro', 'FIN'),
    ('Logística', 'Centro de custo logístico', 'LOG')
) as x(name, description, code)
where p.company_id is not null
on conflict (company_id, lower(name)) do nothing;

insert into public.finance_accounts (
  company_id,
  name,
  description,
  account_type,
  currency_code,
  opening_balance,
  current_balance,
  is_active
)
select
  p.company_id,
  x.name,
  x.description,
  x.account_type,
  'BRL',
  x.opening_balance,
  x.current_balance,
  true
from public.profiles p
cross join (
  values
    ('Caixa', 'Conta física de caixa da operação', 'cash', 0.00::numeric, 0.00::numeric),
    ('Banco principal', 'Conta bancária principal da empresa', 'bank', 0.00::numeric, 0.00::numeric),
    ('PIX principal', 'Conta principal de recebimento via PIX', 'pix', 0.00::numeric, 0.00::numeric)
) as x(name, description, account_type, opening_balance, current_balance)
where p.company_id is not null
on conflict (company_id, lower(name)) do nothing;