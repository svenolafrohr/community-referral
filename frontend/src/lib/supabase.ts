import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { ConfigurationError } from './errors'
import { env } from './env'

let client: SupabaseClient | undefined

export function getSupabaseClient(): SupabaseClient {
  if (!env.VITE_SUPABASE_URL || !env.VITE_SUPABASE_PUBLISHABLE_KEY) {
    throw new ConfigurationError('Supabase public environment variables are not configured.')
  }
  client ??= createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_PUBLISHABLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  })
  return client
}
