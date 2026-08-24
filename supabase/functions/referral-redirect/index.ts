import { createAdminClient } from '../_shared/supabase.ts'

Deno.serve(async (request) => {
  if (request.method !== 'GET') return new Response('Method not allowed', { status: 405 })

  const code = new URL(request.url).searchParams.get('code')
  if (!code) return new Response('Missing referral code', { status: 400 })

  const appUrl = Deno.env.get('APP_URL') ?? 'http://localhost:5173'
  const supabase = createAdminClient()
  const { data: referral } = await supabase
    .from('referrals')
    .select('id, status, jobs!inner(slug, status)')
    .eq('referral_code', code)
    .eq('jobs.status', 'active')
    .maybeSingle()

  if (!referral) return Response.redirect(new URL('/jobs', appUrl), 302)

  await Promise.all([
    supabase.from('referral_events').insert({
      referral_id: referral.id,
      event_type: 'clicked',
    }),
    supabase
      .from('referrals')
      .update({
        status: referral.status === 'created' ? 'clicked' : referral.status,
        last_clicked_at: new Date().toISOString(),
      })
      .eq('id', referral.id),
  ])

  const job = referral.jobs as unknown as { slug: string }
  return Response.redirect(new URL(`/jobs/${job.slug}?ref=${encodeURIComponent(code)}`, appUrl), 302)
})
