import { z } from "zod"

import { env } from "./env"
import { getSupabaseClient } from "./supabase"

const createReferralResponseSchema = z.object({
  referral: z.object({
    id: z.string().uuid(),
    referral_code: z.string().min(1),
    status: z.string(),
  }),
  jobSlug: z.string().min(1),
})

export interface CreatedReferral {
  code: string
  jobSlug: string
}

/**
 * Creates an anonymous, trackable referral for a job via the `create-referral`
 * edge function (the only write path — anon/authenticated have no direct
 * insert grant on `referrals`). No referrer identity is captured in V0.
 */
export async function createReferral(jobId: string): Promise<CreatedReferral> {
  const { data, error } = await getSupabaseClient().functions.invoke(
    "create-referral",
    { body: { jobId } }
  )
  if (error) throw error
  const parsed = createReferralResponseSchema.parse(data)
  return { code: parsed.referral.referral_code, jobSlug: parsed.jobSlug }
}

export function buildJobShareUrl(jobSlug: string, referralCode?: string): string {
  const url = new URL(`/jobs/${jobSlug}`, env.NEXT_PUBLIC_APP_URL)
  if (referralCode) url.searchParams.set("ref", referralCode)
  return url.toString()
}
