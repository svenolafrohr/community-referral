export type JobStatus = 'draft' | 'active' | 'archived'
export type RemotePolicy = 'remote' | 'hybrid' | 'onsite' | 'flexible' | 'unspecified'

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
