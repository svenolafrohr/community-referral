import { describe, expect, it } from 'vitest'

import { defaultJobFilterState, deriveFilterOptions, filterAndSortJobs } from './filters'
import type { Job } from './model'

function makeJob(overrides: Partial<Job>): Job {
  return {
    id: overrides.id ?? crypto.randomUUID(),
    slug: 'role',
    title: 'Role',
    description: 'Description',
    summary: null,
    location: 'Berlin',
    remotePolicy: 'hybrid',
    seniority: null,
    functionArea: 'Engineering',
    community: 'CDTM',
    referralBonusAmount: 100,
    referralBonusCurrency: 'EUR',
    status: 'active',
    publishedAt: '2026-08-20T12:00:00+00:00',
    createdAt: '2026-08-20T12:00:00+00:00',
    company: { id: 'c1', name: 'Company', slug: 'company', logoUrl: null },
    ...overrides,
  }
}

describe('deriveFilterOptions', () => {
  it('collects unique, sorted function areas and communities', () => {
    const jobs = [
      makeJob({ id: '1', functionArea: 'Sales', community: 'WHU' }),
      makeJob({ id: '2', functionArea: 'Engineering', community: 'CDTM' }),
      makeJob({ id: '3', functionArea: 'Engineering', community: 'CDTM' }),
      makeJob({ id: '4', functionArea: null, community: 'WHU' }),
    ]
    expect(deriveFilterOptions(jobs)).toEqual({
      functionAreas: ['Engineering', 'Sales'],
      communities: ['CDTM', 'WHU'],
    })
  })
})

describe('filterAndSortJobs', () => {
  const jobs = [
    makeJob({
      id: '1',
      functionArea: 'Engineering',
      community: 'CDTM',
      remotePolicy: 'remote',
      referralBonusAmount: 500,
      publishedAt: '2026-08-20T12:00:00+00:00',
    }),
    makeJob({
      id: '2',
      functionArea: 'Sales',
      community: 'WHU',
      remotePolicy: 'onsite',
      referralBonusAmount: 100,
      publishedAt: '2026-08-22T12:00:00+00:00',
    }),
    makeJob({
      id: '3',
      functionArea: 'Engineering',
      community: 'WHU',
      remotePolicy: 'hybrid',
      referralBonusAmount: null,
      publishedAt: '2026-08-21T12:00:00+00:00',
    }),
  ]

  it('returns every job unfiltered and sorted by recency by default', () => {
    const result = filterAndSortJobs(jobs, defaultJobFilterState)
    expect(result.map((job) => job.id)).toEqual(['2', '3', '1'])
  })

  it('filters by function area, remote policy, and community together', () => {
    const result = filterAndSortJobs(jobs, {
      ...defaultJobFilterState,
      functionArea: 'Engineering',
      community: 'CDTM',
    })
    expect(result.map((job) => job.id)).toEqual(['1'])
  })

  it('sorts by bonus, treating a missing bonus as lowest', () => {
    const result = filterAndSortJobs(jobs, { ...defaultJobFilterState, sort: 'bonus' })
    expect(result.map((job) => job.id)).toEqual(['1', '2', '3'])
  })
})
