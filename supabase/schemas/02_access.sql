alter table public.companies enable row level security;
alter table public.jobs enable row level security;
alter table public.job_sources enable row level security;
alter table public.referrers enable row level security;
alter table public.referrals enable row level security;
alter table public.referral_events enable row level security;
alter table public.ingestion_events enable row level security;

revoke all on table public.companies from anon, authenticated;
revoke all on table public.jobs from anon, authenticated;
revoke all on table public.job_sources from anon, authenticated;
revoke all on table public.referrers from anon, authenticated;
revoke all on table public.referrals from anon, authenticated;
revoke all on table public.referral_events from anon, authenticated;
revoke all on table public.ingestion_events from anon, authenticated;
revoke all on function public.set_updated_at() from public, anon, authenticated;

grant usage on schema public to anon, authenticated, service_role;
grant select on table public.companies, public.jobs to anon, authenticated;
grant select, insert, update, delete on table
  public.companies,
  public.jobs,
  public.job_sources,
  public.referrers,
  public.referrals,
  public.referral_events,
  public.ingestion_events
to service_role;
grant usage, select on sequence public.referral_events_id_seq to service_role;

create policy "Active jobs are publicly readable"
on public.jobs for select to anon, authenticated
using (status = 'active');

create policy "Companies with active jobs are publicly readable"
on public.companies for select to anon, authenticated
using (
  exists (
    select 1 from public.jobs
    where jobs.company_id = companies.id
      and jobs.status = 'active'
  )
);
