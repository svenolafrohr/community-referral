import { z } from 'zod'

export const parsedJobEmailSchema = z.object({
  title: z.string().min(1),
  company: z.string().min(1),
  description: z.string().min(1),
  location: z.string().nullable(),
  remotePolicy: z.enum(['remote', 'hybrid', 'onsite', 'flexible', 'unspecified']),
  sourceUrl: z.string().url().nullable(),
  contactName: z.string().nullable(),
  contactEmail: z.string().email().nullable(),
  referralBonusAmount: z.number().nonnegative().nullable(),
  referralBonusCurrency: z.string().length(3).default('EUR'),
  seniority: z.string().nullable(),
  functionArea: z.string().nullable(),
})

export type ParsedJobEmail = z.infer<typeof parsedJobEmailSchema>
