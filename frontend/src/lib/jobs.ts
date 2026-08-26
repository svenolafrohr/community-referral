import { z } from "zod"

import { getSupabaseClient } from "./supabase"

export type JobStatus = "draft" | "active" | "archived"
export type RemotePolicy = "remote" | "hybrid" | "onsite" | "flexible" | "unspecified"

export interface CompanySummary {
  id: string
  name: string
  slug: string
  logoUrl: string | null
}

export interface Job {
  id: string
  slug: string
  title: string
  description: string
  summary: string | null
  location: string | null
  remotePolicy: RemotePolicy
  seniority: string | null
  functionArea: string | null
  community: string
  referralBonusAmount: number | null
  referralBonusCurrency: string
  status: JobStatus
  publishedAt: string | null
  createdAt: string
  company: CompanySummary
}

const companyRowSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  slug: z.string().min(1),
  logo_url: z.string().url().nullable(),
})

const jobRowSchema = z.object({
  id: z.string().uuid(),
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  summary: z.string().nullable(),
  location: z.string().nullable(),
  remote_policy: z.enum(["remote", "hybrid", "onsite", "flexible", "unspecified"]),
  seniority: z.string().nullable(),
  function_area: z.string().nullable(),
  community: z.string().min(1),
  referral_bonus_amount: z.number().nonnegative().nullable(),
  referral_bonus_currency: z.string().length(3),
  status: z.enum(["draft", "active", "archived"]),
  published_at: z.string().datetime({ offset: true }).nullable(),
  created_at: z.string().datetime({ offset: true }),
  companies: companyRowSchema,
})

function mapJobRow(input: unknown): Job {
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

const rowsSchema = z.array(z.unknown())
const jobSelect =
  "id, slug, title, description, summary, location, remote_policy, seniority, function_area, community, referral_bonus_amount, referral_bonus_currency, status, published_at, created_at, companies!inner(id, name, slug, logo_url)"

export async function listActiveJobs(): Promise<Job[]> {
  const { data, error } = await getSupabaseClient()
    .from("jobs")
    .select(jobSelect)
    .eq("status", "active")
    .order("published_at", { ascending: false, nullsFirst: false })
  if (error) throw error
  return rowsSchema.parse(data).map(mapJobRow)
}

export async function getJobBySlug(slug: string): Promise<Job | null> {
  const { data, error } = await getSupabaseClient()
    .from("jobs")
    .select(jobSelect)
    .eq("status", "active")
    .eq("slug", slug)
    .maybeSingle()
  if (error) throw error
  if (!data) return null
  return mapJobRow(data)
}
