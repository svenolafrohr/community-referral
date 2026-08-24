import type { Job, RemotePolicy } from './model'

export type SortOption = 'recent' | 'bonus'

export const ALL_VALUE = 'all'

export interface JobFilterState {
  functionArea: string
  remotePolicy: RemotePolicy | typeof ALL_VALUE
  community: string
  sort: SortOption
}

export const defaultJobFilterState: JobFilterState = {
  functionArea: ALL_VALUE,
  remotePolicy: ALL_VALUE,
  community: ALL_VALUE,
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
  const filtered = jobs.filter((job) => {
    if (state.functionArea !== ALL_VALUE && job.functionArea !== state.functionArea) return false
    if (state.remotePolicy !== ALL_VALUE && job.remotePolicy !== state.remotePolicy) return false
    if (state.community !== ALL_VALUE && job.community !== state.community) return false
    return true
  })

  return [...filtered].sort((a, b) => {
    if (state.sort === 'bonus') {
      return (b.referralBonusAmount ?? -1) - (a.referralBonusAmount ?? -1)
    }
    return jobTimestamp(b) - jobTimestamp(a)
  })
}
