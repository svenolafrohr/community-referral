import { z } from 'zod'

const publicEnvSchema = z.object({
  VITE_SUPABASE_URL: z.string().url().optional(),
  VITE_SUPABASE_PUBLISHABLE_KEY: z.string().min(1).optional(),
  VITE_APP_URL: z.string().url().default('http://localhost:5173'),
  VITE_APP_ENV: z.enum(['local', 'preview', 'production', 'test']).default('local'),
})

export const env = publicEnvSchema.parse(import.meta.env)
