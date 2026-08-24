import { corsHeaders, json } from '../_shared/http.ts'
import { createAdminClient } from '../_shared/supabase.ts'

interface IncomingEmailPayload {
  providerEventId?: string
  subject: string
  from: string
  text: string
}

function isIncomingEmailPayload(value: unknown): value is IncomingEmailPayload {
  if (!value || typeof value !== 'object') return false
  const payload = value as Record<string, unknown>
  return typeof payload.subject === 'string'
    && typeof payload.from === 'string'
    && typeof payload.text === 'string'
    && (payload.providerEventId === undefined || typeof payload.providerEventId === 'string')
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders(request) })
  if (request.method !== 'POST') return json(request, { error: 'Method not allowed' }, 405)

  const expectedSecret = Deno.env.get('EMAIL_WEBHOOK_SECRET')
  if (!expectedSecret || request.headers.get('x-webhook-secret') !== expectedSecret) {
    return json(request, { error: 'Unauthorized' }, 401)
  }

  const payload: unknown = await request.json().catch(() => null)
  if (!isIncomingEmailPayload(payload)) return json(request, { error: 'Invalid email payload' }, 400)

  const { data, error } = await createAdminClient()
    .from('ingestion_events')
    .insert({
      provider_event_id: payload.providerEventId ?? null,
      raw_email_subject: payload.subject,
      raw_email_from: payload.from,
      raw_email_body: payload.text,
      status: 'received',
    })
    .select('id, status')
    .single()

  if (error) return json(request, { error: 'Could not store email' }, 500)

  // A provider-specific parser can consume this durable event and write parsed_payload.
  return json(request, { ingestionEvent: data }, 202)
})
