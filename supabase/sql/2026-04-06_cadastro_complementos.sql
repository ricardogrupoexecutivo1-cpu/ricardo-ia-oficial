begin;

-- =========================================================
-- CADASTRO COMPLEMENTOS
-- Base segura para salvar dados ricos do cadastro geral
-- sem quebrar a tabela principal cadastros_gerais
-- =========================================================

create table if not exists public.cadastro_complementos (
  id uuid primary key default gen_random_uuid(),
  cadastro_id uuid not null references public.cadastros_gerais(id) on delete cascade,

  perfis_selecionados text[] not null default '{}',
  segmentos text[] not null default '{}',
  produtos text[] not null default '{}',
  segmentos_especificos text[] not null default '{}',

  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- 1 complemento por cadastro
create unique index if not exists ux_cadastro_complementos_cadastro_id
  on public.cadastro_complementos (cadastro_id);

-- updated_at automático
create or replace function public.set_updated_at_cadastro_complementos()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists trg_set_updated_at_cadastro_complementos
  on public.cadastro_complementos;

create trigger trg_set_updated_at_cadastro_complementos
before update on public.cadastro_complementos
for each row
execute function public.set_updated_at_cadastro_complementos();

-- RLS
alter table public.cadastro_complementos enable row level security;

-- remove policies antigas se existirem
drop policy if exists cadastro_complementos_select_own on public.cadastro_complementos;
drop policy if exists cadastro_complementos_insert_own on public.cadastro_complementos;
drop policy if exists cadastro_complementos_update_own on public.cadastro_complementos;
drop policy if exists cadastro_complementos_delete_own on public.cadastro_complementos;

-- SELECT: dono do cadastro pode ver
create policy cadastro_complementos_select_own
on public.cadastro_complementos
for select
to authenticated
using (
  exists (
    select 1
    from public.cadastros_gerais cg
    where cg.id = cadastro_complementos.cadastro_id
      and cg.user_id = auth.uid()
  )
);

-- INSERT: dono do cadastro pode inserir
create policy cadastro_complementos_insert_own
on public.cadastro_complementos
for insert
to authenticated
with check (
  exists (
    select 1
    from public.cadastros_gerais cg
    where cg.id = cadastro_complementos.cadastro_id
      and cg.user_id = auth.uid()
  )
);

-- UPDATE: dono do cadastro pode atualizar
create policy cadastro_complementos_update_own
on public.cadastro_complementos
for update
to authenticated
using (
  exists (
    select 1
    from public.cadastros_gerais cg
    where cg.id = cadastro_complementos.cadastro_id
      and cg.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.cadastros_gerais cg
    where cg.id = cadastro_complementos.cadastro_id
      and cg.user_id = auth.uid()
  )
);

-- DELETE: dono do cadastro pode excluir
create policy cadastro_complementos_delete_own
on public.cadastro_complementos
for delete
to authenticated
using (
  exists (
    select 1
    from public.cadastros_gerais cg
    where cg.id = cadastro_complementos.cadastro_id
      and cg.user_id = auth.uid()
  )
);

commit;