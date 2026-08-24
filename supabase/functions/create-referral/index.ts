import { corsHeaders, json } from '../_shared/http.ts'
import { createAdminClient } from '../_shared/supabase.ts'

function hasJobId(value: unknown): value is { jobId: string } {
  return Boolean(value && typeof value === 'object' && typeof (value as Record<string, unknown>).jobId === 'string')
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders(request) })
  if (request.method !== 'POST') return json(request, { error: 'Method not allowed' }, 405)

  const payload: unknown = await request.json().catch(() => null)
  if (!hasJobId(payload)) return json(request, { error: 'jobId is required' }, 400)

  const supabase = createAdminClient()
  const { data: job } = await supabase
    .from('jobs')
    .select('id, slug')
    .eq('id', payload.jobId)
    .eq('status', 'active')
    .maybeSingle()

  if (!job) return json(request, { error: 'Active job not found' }, 404)

  const { data: referral, error } = await supabase
    .from('referrals')
    .insert({ job_id: job.id })
    .select('id, referral_code, status')
    .single()

  if (error) return json(request, { error: 'Could not create referral' }, 500)

  await supabase.from('referral_events').insert({ referral_id: referral.id, event_type: 'created' })
  return json(request, { referral, jobSlug: job.slug }, 201)
})
