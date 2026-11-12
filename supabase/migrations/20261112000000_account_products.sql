create table if not exists public.account_products (
  user_id uuid primary key references auth.users (id) on delete cascade,
  products jsonb not null default '[]'::jsonb
    check (jsonb_typeof(products) = 'array'),
  updated_at timestamptz not null default now()
);

alter table public.account_products enable row level security;

revoke all on table public.account_products from anon, authenticated;
grant select, insert, update on table public.account_products to authenticated;

drop policy if exists "Users can read their own products" on public.account_products;
create policy "Users can read their own products"
  on public.account_products for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert their own products" on public.account_products;
create policy "Users can insert their own products"
  on public.account_products for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own products" on public.account_products;
create policy "Users can update their own products"
  on public.account_products for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create or replace function public.get_my_products()
returns jsonb
language sql
stable
set search_path = ''
as $$
  select coalesce(
    (
      select account_products.products
      from public.account_products
      where account_products.user_id = (select auth.uid())
    ),
    '[]'::jsonb
  );
$$;

create or replace function public.save_my_products(p_products jsonb)
returns void
language plpgsql
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
begin
  if current_user_id is null then
    raise exception 'Authentication is required to save inventory.'
      using errcode = '42501';
  end if;

  if p_products is null or jsonb_typeof(p_products) <> 'array' then
    raise exception 'Products must be a JSON array.'
      using errcode = '22023';
  end if;

  insert into public.account_products (user_id, products, updated_at)
  values (current_user_id, p_products, now())
  on conflict (user_id) do update
    set products = excluded.products,
        updated_at = excluded.updated_at;
end;
$$;

revoke all on function public.get_my_products() from public, anon;
revoke all on function public.save_my_products(jsonb) from public, anon;
grant execute on function public.get_my_products() to authenticated;
grant execute on function public.save_my_products(jsonb) to authenticated;
