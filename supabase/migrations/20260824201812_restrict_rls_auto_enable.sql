-- Supabase creates this SECURITY DEFINER event-trigger function to enforce RLS
-- on new public tables. It is internal infrastructure and must not be exposed
-- through the Data API as an executable RPC.
do $$
begin
  if to_regprocedure('public.rls_auto_enable()') is not null then
    execute 'revoke all on function public.rls_auto_enable() from public, anon, authenticated';
  end if;
end;
$$;
