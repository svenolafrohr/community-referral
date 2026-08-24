import { z } from 'zod'
import type { Job } from './model'

const companyRowSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  slug: z.string().min(1),
  logo_url: z.string().url().nullable(),
})

export const jobRowSchema = z.object({
  id: z.string().uuid(),
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  summary: z.string().nullable(),
  location: z.string().nullable(),
  remote_policy: z.enum(['remote', 'hybrid', 'onsite', 'flexible', 'unspecified']),
  seniority: z.string().nullable(),
  function_area: z.string().nullable(),
  community: z.string().min(1),
  referral_bonus_amount: z.number().nonnegative().nullable(),
  referral_bonus_currency: z.string().length(3),
  status: z.enum(['draft', 'active', 'archived']),
  published_at: z.string().datetime({ offset: true }).nullable(),
  created_at: z.string().datetime({ offset: true }),
  companies: companyRowSchema,
})

export function mapJobRow(input: unknown): Job {
  const row = jobRowSchema.parse(input)
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    summary: row.summary,
    location: row.location,
    remotePolicy: row.remote_policy,
    seniority: row.seniority,
    functionArea: row.function_area,
    community: row.community,
    referralBonusAmount: row.referral_bonus_amount,
    referralBonusCurrency: row.referral_bonus_currency,
    status: row.status,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    company: {
      id: row.companies.id,
      name: row.companies.name,
      slug: row.companies.slug,
      logoUrl: row.companies.logo_url,
    },
  }
}
