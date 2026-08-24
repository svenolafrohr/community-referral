import { z } from 'zod'
import { getSupabaseClient } from '../../lib/supabase'
import type { Job } from './model'
import { mapJobRow } from './schemas'

const rowsSchema = z.array(z.unknown())
const jobSelect = `id, slug, title, description, summary, location, remote_policy, seniority, function_area, community, referral_bonus_amount, referral_bonus_currency, status, published_at, created_at, companies!inner(id, name, slug, logo_url)`

export async function listActiveJobs(): Promise<Job[]> {
  const { data, error } = await getSupabaseClient()
    .from('jobs')
    .select(jobSelect)
    .eq('status', 'active')
    .order('published_at', { ascending: false, nullsFirst: false })
  if (error) throw error
  return rowsSchema.parse(data).map(mapJobRow)
}

export async function getJobBySlug(slug: string): Promise<Job | null> {
  const { data, error } = await getSupabaseClient()
    .from('jobs')
    .select(jobSelect)
    .eq('status', 'active')
    .eq('slug', slug)
    .maybeSingle()
  if (error) throw error
  if (!data) return null
  return mapJobRow(data)
}
