import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { listActiveJobs } from '../features/jobs/api'
import type { Job } from '../features/jobs/model'
import { ConfigurationError } from '../lib/errors'

type LoadState =
  | { status: 'loading' }
  | { status: 'success'; jobs: Job[] }
  | { status: 'error'; message: string }

export function JobsPage() {
  const [state, setState] = useState<LoadState>({ status: 'loading' })

  useEffect(() => {
    let active = true
    void listActiveJobs()
      .then((jobs) => { if (active) setState({ status: 'success', jobs }) })
      .catch((error: unknown) => {
        if (!active) return
        setState({
          status: 'error',
          message: error instanceof ConfigurationError
            ? 'Connect Supabase in .env.local to load jobs.'
            : 'Jobs could not be loaded. Please try again.',
        })
      })
    return () => { active = false }
  }, [])

  return (
    <section className="page-stack">
      <header>
        <p className="eyebrow">Trusted opportunities</p>
        <h1>Share the right role with the right person.</h1>
        <p>A lightweight referral board for trusted communities. Visual treatment and filters are intentionally left for the frontend handoff.</p>
      </header>
      {state.status === 'loading' && <p role="status">Loading jobs…</p>}
      {state.status === 'error' && <p role="alert">{state.message}</p>}
      {state.status === 'success' && state.jobs.length === 0 && <p>No jobs yet. Forward an opportunity to the community inbox.</p>}
      {state.status === 'success' && state.jobs.length > 0 && (
        <ul className="job-list">
          {state.jobs.map((job) => (
            <li key={job.id}>
              <article className="job-card">
                <p>{job.company.name}</p>
                <h2><Link to={`/jobs/${job.slug}`}>{job.title}</Link></h2>
                <p>{job.summary ?? job.location ?? 'Details on the job page'}</p>
                <p>
                  {job.referralBonusAmount === null
                    ? 'Referral bonus to be confirmed'
                    : new Intl.NumberFormat('en-DE', { style: 'currency', currency: job.referralBonusCurrency }).format(job.referralBonusAmount)}
                </p>
              </article>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
