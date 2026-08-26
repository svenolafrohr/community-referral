import type { Job, RemotePolicy } from './model'

export type SortOption = 'recent' | 'bonus'

export interface JobFilterState {
  search: string
  functionAreas: string[]
  remotePolicies: RemotePolicy[]
  communities: string[]
  sort: SortOption
}

export const defaultJobFilterState: JobFilterState = {
  search: '',
  functionAreas: [],
  remotePolicies: [],
  communities: [],
  sort: 'recent',
}

function uniqueSorted(values: string[]): string[] {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b))
}

export interface JobFilterOptions {
  functionAreas: string[]
  communities: string[]
}

export function deriveFilterOptions(jobs: Job[]): JobFilterOptions {
  return {
    functionAreas: uniqueSorted(jobs.flatMap((job) => (job.functionArea ? [job.functionArea] : []))),
    communities: uniqueSorted(jobs.map((job) => job.community)),
  }
}

function jobTimestamp(job: Job): number {
  return new Date(job.publishedAt ?? job.createdAt).getTime()
}

export function filterAndSortJobs(jobs: Job[], state: JobFilterState): Job[] {
  const search = state.search.trim().toLowerCase()

  const filtered = jobs.filter((job) => {
    if (search) {
      const matchesSearch =
        job.title.toLowerCase().includes(search) || job.company.name.toLowerCase().includes(search)
      if (!matchesSearch) return false
    }
    if (state.functionAreas.length > 0 && (!job.functionArea || !state.functionAreas.includes(job.functionArea))) {
      return false
    }
    if (state.remotePolicies.length > 0 && !state.remotePolicies.includes(job.remotePolicy)) return false
    if (state.communities.length > 0 && !state.communities.includes(job.community)) return false
    return true
  })

  return [...filtered].sort((a, b) => {
    if (state.sort === 'bonus') {
      return (b.referralBonusAmount ?? -1) - (a.referralBonusAmount ?? -1)
    }
    return jobTimestamp(b) - jobTimestamp(a)
  })
}
