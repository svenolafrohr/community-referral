const configuredOrigins = (Deno.env.get('ALLOWED_ORIGINS') ?? '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

export function corsHeaders(request: Request): HeadersInit {
  const origin = request.headers.get('origin') ?? ''
  const allowedOrigin = configuredOrigins.includes(origin) ? origin : configuredOrigins[0]
  return {
    'Access-Control-Allow-Origin': allowedOrigin ?? 'http://localhost:5173',
    'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info, x-webhook-secret',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    Vary: 'Origin',
  }
}

export function json(request: Request, body: unknown, status = 200): Response {
  return Response.json(body, { status, headers: corsHeaders(request) })
}
