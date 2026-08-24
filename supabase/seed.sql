insert into public.companies (id, name, slug, website, description)
values
  ('10000000-0000-4000-8000-000000000001', 'Example Labs', 'example-labs', 'https://example.com', 'Seed company for local development.'),
  ('10000000-0000-4000-8000-000000000002', 'Community Ventures', 'community-ventures', 'https://example.org', 'Seed company for local development.')
on conflict (id) do update set
  name = excluded.name,
  slug = excluded.slug,
  website = excluded.website,
  description = excluded.description;

insert into public.jobs (
  id, company_id, slug, title, description, summary, location, remote_policy,
  seniority, function_area, community, referral_bonus_amount,
  referral_bonus_currency, source_type, status, published_at
)
values
  ('20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 'founding-engineer', 'Founding Engineer', 'Build the first version of a community product.', 'Own product engineering from zero to one.', 'Berlin', 'hybrid', 'Senior', 'Engineering', 'CDTM', 500.00, 'EUR', 'manual', 'active', now()),
  ('20000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000001', 'product-designer', 'Product Designer', 'Shape a trusted referral experience.', 'Turn early user insight into a focused product.', 'Munich', 'hybrid', 'Mid-level', 'Design', 'CDTM', 350.00, 'EUR', 'manual', 'active', now() - interval '1 day'),
  ('20000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000002', 'venture-development-manager', 'Venture Development Manager', 'Work with founders on go-to-market and operations.', 'Help early-stage teams move from strategy to execution.', 'Remote within Germany', 'remote', 'Mid-level', 'Operations', 'WHU', 400.00, 'EUR', 'manual', 'active', now() - interval '2 days'),
  ('20000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000002', 'b2b-sales-lead', 'B2B Sales Lead', 'Own the initial enterprise sales motion.', 'Build repeatable founder-led sales into a team motion.', 'Berlin', 'flexible', 'Lead', 'Sales', 'WHU', 750.00, 'EUR', 'manual', 'active', now() - interval '3 days'),
  ('20000000-0000-4000-8000-000000000005', '10000000-0000-4000-8000-000000000001', 'working-student-growth', 'Working Student Growth', 'Support community-led experiments and content.', 'A flexible role for an entrepreneurial student.', 'Munich', 'hybrid', 'Working student', 'Growth', 'CDTM', 150.00, 'EUR', 'manual', 'active', now() - interval '4 days')
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  summary = excluded.summary,
  location = excluded.location,
  remote_policy = excluded.remote_policy,
  seniority = excluded.seniority,
  function_area = excluded.function_area,
  community = excluded.community,
  referral_bonus_amount = excluded.referral_bonus_amount,
  referral_bonus_currency = excluded.referral_bonus_currency,
  status = excluded.status,
  published_at = excluded.published_at;
