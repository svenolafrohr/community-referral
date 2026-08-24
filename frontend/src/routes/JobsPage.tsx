import { useEffect, useMemo, useState } from 'react'

import { JobCard } from '../features/jobs/components/JobCard'
import { JobFilters } from '../features/jobs/components/JobFilters'
import { listActiveJobs } from '../features/jobs/api'
import { defaultJobFilterState, deriveFilterOptions, filterAndSortJobs, type JobFilterState } from '../features/jobs/filters'
import type { Job } from '../features/jobs/model'
import { ConfigurationError } from '../lib/errors'

type LoadState =
  | { status: 'loading' }
  | { status: 'success'; jobs: Job[] }
  | { status: 'error'; message: string }

export function JobsPage() {
  const [state, setState] = useState<LoadState>({ status: 'loading' })
  const [filters, setFilters] = useState<JobFilterState>(defaultJobFilterState)

  useEffect(() => {
    let active = true
    void listActiveJobs()
      .then((jobs) => {
        if (active) setState({ status: 'success', jobs })
      })
      .catch((error: unknown) => {
        if (!active) return
        setState({
          status: 'error',
          message:
            error instanceof ConfigurationError
              ? 'Connect Supabase in .env.local to load jobs.'
              : 'Jobs could not be loaded. Please try again.',
        })
      })
    return () => {
      active = false
    }
  }, [])

  const jobs = useMemo(() => (state.status === 'success' ? state.jobs : []), [state])
  const options = useMemo(() => deriveFilterOptions(jobs), [jobs])
  const visibleJobs = useMemo(() => filterAndSortJobs(jobs, filters), [jobs, filters])

  return (
    <section className="flex flex-col gap-8 py-10 sm:py-14">
      <header className="flex flex-col gap-2">
        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Trusted opportunities
        </p>
        <h1 className="max-w-xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Share the right role with the right person.
        </h1>
        <p className="max-w-xl text-sm text-muted-foreground sm:text-base">
          A lightweight referral board for trusted communities.
        </p>
      </header>

      {state.status === 'loading' && (
        <p role="status" className="text-sm text-muted-foreground">
          Loading jobs…
        </p>
      )}

      {state.status === 'error' && (
        <p role="alert" className="rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground">
          {state.message}
        </p>
      )}

      {state.status === 'success' && jobs.length === 0 && (
        <p className="rounded-2xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
          No jobs yet. Forward an opportunity to the community inbox.
        </p>
      )}

      {state.status === 'success' && jobs.length > 0 && (
        <>
          <JobFilters state={filters} options={options} onChange={setFilters} />

          {visibleJobs.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
              No jobs match these filters. Try a different combination.
            </p>
          ) : (
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {visibleJobs.map((job) => (
                <li key={job.id}>
                  <JobCard job={job} />
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  )
}
