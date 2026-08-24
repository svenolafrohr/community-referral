create table public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 160),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  website text,
  logo_url text,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.jobs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete restrict,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 1 and 200),
  description text not null check (char_length(description) > 0),
  summary text,
  location text,
  remote_policy text not null default 'unspecified'
    check (remote_policy in ('remote', 'hybrid', 'onsite', 'flexible', 'unspecified')),
  seniority text,
  function_area text,
  community text not null default 'community-referral',
  referral_bonus_amount numeric(12, 2)
    check (referral_bonus_amount is null or referral_bonus_amount >= 0),
  referral_bonus_currency text not null default 'EUR'
    check (referral_bonus_currency ~ '^[A-Z]{3}$'),
  source_type text not null default 'manual'
    check (source_type in ('email', 'manual', 'url')),
  source_url text,
  status text not null default 'draft'
    check (status in ('draft', 'active', 'archived')),
  published_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (expires_at is null or expires_at > created_at)
);

create table public.job_sources (
  job_id uuid primary key references public.jobs(id) on delete cascade,
  source_email text,
  contact_name text,
  contact_email text,
  raw_source_reference text,
  created_at timestamptz not null default now()
);

create table public.referrers (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  community text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.referrals (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  referrer_id uuid references public.referrers(id) on delete set null,
  referral_code text not null unique default replace(gen_random_uuid()::text, '-', ''),
  candidate_email text,
  status text not null default 'created'
    check (status in ('created', 'clicked', 'interested', 'applied', 'hired', 'paid', 'cancelled')),
  last_clicked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.referral_events (
  id bigint generated always as identity primary key,
  referral_id uuid not null references public.referrals(id) on delete cascade,
  event_type text not null
    check (event_type in ('created', 'clicked', 'interested', 'applied', 'hired', 'paid', 'cancelled')),
  metadata jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now()
);

create table public.ingestion_events (
  id uuid primary key default gen_random_uuid(),
  provider_event_id text,
  raw_email_subject text not null,
  raw_email_from text not null,
  raw_email_body text not null,
  parsed_payload jsonb,
  status text not null default 'received'
    check (status in ('received', 'parsing', 'parsed', 'failed', 'imported')),
  error text,
  created_at timestamptz not null default now(),
  processed_at timestamptz
);

create unique index ingestion_events_provider_event_id_idx
  on public.ingestion_events (provider_event_id)
  where provider_event_id is not null;
create index jobs_company_id_idx on public.jobs (company_id);
create index jobs_active_published_at_idx on public.jobs (published_at desc)
  where status = 'active';
create index jobs_active_bonus_idx on public.jobs (referral_bonus_amount desc)
  where status = 'active';
create index referrals_job_id_idx on public.referrals (job_id);
create index referrals_referrer_id_idx on public.referrals (referrer_id)
  where referrer_id is not null;
create index referral_events_referral_id_occurred_at_idx
  on public.referral_events (referral_id, occurred_at desc);
create index ingestion_events_pending_idx on public.ingestion_events (created_at)
  where status in ('received', 'failed');

create function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger companies_set_updated_at before update on public.companies
for each row execute function public.set_updated_at();
create trigger jobs_set_updated_at before update on public.jobs
for each row execute function public.set_updated_at();
create trigger referrers_set_updated_at before update on public.referrers
for each row execute function public.set_updated_at();
create trigger referrals_set_updated_at before update on public.referrals
for each row execute function public.set_updated_at();

comment on table public.job_sources is 'Server-only source and contact details separated from public job listings.';
comment on table public.ingestion_events is 'Server-only raw email ingestion payloads and parser results.';
comment on column public.referrals.candidate_email is 'Deferred V0 field; do not collect unless explicitly required and consented.';
