set local check_function_bodies = off;

create table "public"."companies" (
  "id"          uuid                     not null default gen_random_uuid(),
  "name"        text                     not null,
  "slug"        text                     not null,
  "website"     text,
  "logo_url"    text,
  "description" text,
  "created_at"  timestamp with time zone not null default now(),
  "updated_at"  timestamp with time zone not null default now(),
  constraint "companies_name_check" check (((char_length(name) >= 1) AND (char_length(name) <= 160))),
  constraint "companies_pkey" primary key (id),
  constraint "companies_slug_check" check ((slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'::text)),
  constraint "companies_slug_key" unique (slug)
);

alter table "public"."companies"
  enable row level security;

create table "public"."ingestion_events" (
  "id"                uuid                     not null default gen_random_uuid(),
  "provider_event_id" text,
  "raw_email_subject" text                     not null,
  "raw_email_from"    text                     not null,
  "raw_email_body"    text                     not null,
  "parsed_payload"    jsonb,
  "status"            text                     not null default 'received'::text,
  "error"             text,
  "created_at"        timestamp with time zone not null default now(),
  "processed_at"      timestamp with time zone,
  constraint "ingestion_events_pkey" primary key (id),
  constraint "ingestion_events_status_check" check ((status = ANY (ARRAY['received'::text, 'parsing'::text, 'parsed'::text, 'failed'::text, 'imported'::text])))
);

alter table "public"."ingestion_events"
  enable row level security;

create table "public"."job_sources" (
  "job_id"               uuid                     not null,
  "source_email"         text,
  "contact_name"         text,
  "contact_email"        text,
  "raw_source_reference" text,
  "created_at"           timestamp with time zone not null default now(),
  constraint "job_sources_pkey" primary key (job_id)
);

alter table "public"."job_sources"
  enable row level security;

create table "public"."jobs" (
  "id"                      uuid                     not null default gen_random_uuid(),
  "company_id"              uuid                     not null,
  "slug"                    text                     not null,
  "title"                   text                     not null,
  "description"             text                     not null,
  "summary"                 text,
  "location"                text,
  "remote_policy"           text                     not null default 'unspecified'::text,
  "seniority"               text,
  "function_area"           text,
  "community"               text                     not null default 'community-referral'::text,
  "referral_bonus_amount"   numeric(12,2),
  "referral_bonus_currency" text                     not null default 'EUR'::text,
  "source_type"             text                     not null default 'manual'::text,
  "source_url"              text,
  "status"                  text                     not null default 'draft'::text,
  "published_at"            timestamp with time zone,
  "expires_at"              timestamp with time zone,
  "created_at"              timestamp with time zone not null default now(),
  "updated_at"              timestamp with time zone not null default now(),
  constraint "jobs_check" check (((expires_at IS NULL) OR (expires_at > created_at))),
  constraint "jobs_description_check" check ((char_length(description) > 0)),
  constraint "jobs_pkey" primary key (id),
  constraint "jobs_referral_bonus_amount_check" check (((referral_bonus_amount IS NULL) OR (referral_bonus_amount >= (0)::numeric))),
  constraint "jobs_referral_bonus_currency_check" check ((referral_bonus_currency ~ '^[A-Z]{3}$'::text)),
  constraint "jobs_remote_policy_check" check ((remote_policy = ANY (ARRAY['remote'::text, 'hybrid'::text, 'onsite'::text, 'flexible'::text, 'unspecified'::text]))),
  constraint "jobs_slug_check" check ((slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'::text)),
  constraint "jobs_slug_key" unique (slug),
  constraint "jobs_source_type_check" check ((source_type = ANY (ARRAY['email'::text, 'manual'::text, 'url'::text]))),
  constraint "jobs_status_check" check ((status = ANY (ARRAY['draft'::text, 'active'::text, 'archived'::text]))),
  constraint "jobs_title_check" check (((char_length(title) >= 1) AND (char_length(title) <= 200)))
);

alter table "public"."jobs"
  enable row level security;

create table "public"."referral_events" (
  "id"          bigint                   generated always as identity not null,
  "referral_id" uuid                     not null,
  "event_type"  text                     not null,
  "metadata"    jsonb                    not null default '{}'::jsonb,
  "occurred_at" timestamp with time zone not null default now(),
  constraint "referral_events_event_type_check"
    check ((event_type = ANY (ARRAY['created'::text, 'clicked'::text, 'interested'::text, 'applied'::text, 'hired'::text, 'paid'::text, 'cancelled'::text]))),
  constraint "referral_events_pkey" primary key (id)
);

alter table "public"."referral_events"
  enable row level security;

create table "public"."referrals" (
  "id"              uuid                     not null default gen_random_uuid(),
  "job_id"          uuid                     not null,
  "referrer_id"     uuid,
  "referral_code"   text                     not null default replace((gen_random_uuid())::text, '-'::text, ''::text),
  "candidate_email" text,
  "status"          text                     not null default 'created'::text,
  "last_clicked_at" timestamp with time zone,
  "created_at"      timestamp with time zone not null default now(),
  "updated_at"      timestamp with time zone not null default now(),
  constraint "referrals_pkey" primary key (id),
  constraint "referrals_referral_code_key" unique (referral_code),
  constraint "referrals_status_check"
    check ((status = ANY (ARRAY['created'::text, 'clicked'::text, 'interested'::text, 'applied'::text, 'hired'::text, 'paid'::text, 'cancelled'::text])))
);

alter table "public"."referrals"
  enable row level security;

create table "public"."referrers" (
  "id"         uuid                     not null default gen_random_uuid(),
  "name"       text,
  "email"      text,
  "community"  text,
  "created_at" timestamp with time zone not null default now(),
  "updated_at" timestamp with time zone not null default now(),
  constraint "referrers_pkey" primary key (id)
);

alter table "public"."referrers"
  enable row level security;

create or replace function public.set_updated_at()
  returns trigger
  language plpgsql
  set search_path to ''
  AS $function$
begin
  new.updated_at = now();
  return new;
end;
$function$;

alter table "public"."jobs"
  add constraint "jobs_company_id_fkey" foreign key (company_id) references public.companies(id) on delete restrict;

alter table "public"."job_sources"
  add constraint "job_sources_job_id_fkey" foreign key (job_id) references public.jobs(id) on delete cascade;

alter table "public"."referrals"
  add constraint "referrals_job_id_fkey" foreign key (job_id) references public.jobs(id) on delete cascade;

alter table "public"."referral_events"
  add constraint "referral_events_referral_id_fkey" foreign key (referral_id) references public.referrals(id) on delete cascade;

alter table "public"."referrals"
  add constraint "referrals_referrer_id_fkey" foreign key (referrer_id) references public.referrers(id) on delete set null;

create index ingestion_events_pending_idx on public.ingestion_events using btree (created_at)
  where (status = ANY (ARRAY['received'::text, 'failed'::text]));

create unique index ingestion_events_provider_event_id_idx on public.ingestion_events using btree (provider_event_id)
  where (provider_event_id is not null);

create index jobs_active_bonus_idx on public.jobs using btree (referral_bonus_amount desc)
  where (status = 'active'::text);

create index jobs_active_published_at_idx on public.jobs using btree (published_at desc)
  where (status = 'active'::text);

create index jobs_company_id_idx on public.jobs using btree (company_id);

create index referral_events_referral_id_occurred_at_idx on public.referral_events using btree (referral_id, occurred_at desc);

create index referrals_job_id_idx on public.referrals using btree (job_id);

create index referrals_referrer_id_idx on public.referrals using btree (referrer_id)
  where (referrer_id is not null);

create trigger companies_set_updated_at
  before update on public.companies
  for each row
  execute function public.set_updated_at();

create trigger jobs_set_updated_at
  before update on public.jobs
  for each row
  execute function public.set_updated_at();

create trigger referrals_set_updated_at
  before update on public.referrals
  for each row
  execute function public.set_updated_at();

create trigger referrers_set_updated_at
  before update on public.referrers
  for each row
  execute function public.set_updated_at();

create policy "Companies with active jobs are publicly readable" on "public"."companies"
  for select
  to "anon", "authenticated"
  using ((exists ( select 1
   from public.jobs
  where ((jobs.company_id = companies.id) AND (jobs.status = 'active'::text)))));

create policy "Active jobs are publicly readable" on "public"."jobs"
  for select
  to "anon", "authenticated"
  using ((status = 'active'::text));

comment on column "public"."referrals"."candidate_email" is 'Deferred V0 field; do not collect unless explicitly required and consented.';

comment on table "public"."ingestion_events" is 'Server-only raw email ingestion payloads and parser results.';

comment on table "public"."job_sources" is 'Server-only source and contact details separated from public job listings.';

revoke all on function "public"."set_updated_at"() from public;

grant execute on function "public"."set_updated_at"() to "postgres";

revoke all on table "public"."companies" from "anon";

grant select on table "public"."companies" to "anon";

revoke all on table "public"."companies" from "authenticated";

grant select on table "public"."companies" to "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."companies" to "postgres", "service_role";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."ingestion_events" to "postgres", "service_role";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."job_sources" to "postgres", "service_role";

revoke all on table "public"."jobs" from "anon";

grant select on table "public"."jobs" to "anon";

revoke all on table "public"."jobs" from "authenticated";

grant select on table "public"."jobs" to "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."jobs" to "postgres", "service_role";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."referral_events" to "postgres", "service_role";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."referrals" to "postgres", "service_role";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."referrers" to "postgres", "service_role";
