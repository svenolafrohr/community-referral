import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { Badge } from '../components/ui/Badge'
import { getJobBySlug } from '../features/jobs/api'
import { formatPublishedDate, formatReferralBonus, formatRemotePolicy } from '../features/jobs/format'
import type { Job } from '../features/jobs/model'
import { ShareActions } from '../features/referrals/components/ShareActions'
import { buildJobShareUrl } from '../features/referrals/share'
import { env } from '../lib/env'
import { ConfigurationError } from '../lib/errors'

type LoadState =
  | { status: 'loading' }
  | { status: 'not-found' }
  | { status: 'error'; message: string }
  | { status: 'success'; job: Job }

export function JobDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [state, setState] = useState<LoadState>({ status: 'loading' })
  const [loadedSlug, setLoadedSlug] = useState<string | undefined>(undefined)

  if (slug !== loadedSlug) {
    setLoadedSlug(slug)
    setState(slug ? { status: 'loading' } : { status: 'not-found' })
  }

  useEffect(() => {
    if (!slug) return
    let active = true
    void getJobBySlug(slug)
      .then((job) => {
        if (!active) return
        setState(job ? { status: 'success', job } : { status: 'not-found' })
      })
      .catch((error: unknown) => {
        if (!active) return
        setState({
          status: 'error',
          message:
            error instanceof ConfigurationError
              ? 'Connect Supabase in .env.local to load this job.'
              : 'This job could not be loaded. Please try again.',
        })
      })
    return () => {
      active = false
    }
  }, [slug])

  if (state.status === 'loading') {
    return (
      <section className="py-14">
        <p role="status" className="text-sm text-muted-foreground">
          Loading job…
        </p>
      </section>
    )
  }

  if (state.status === 'not-found') {
    return (
      <section className="flex flex-col gap-3 py-14">
        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Not found</p>
        <h1 className="text-2xl font-bold text-foreground">This job is no longer available.</h1>
        <p className="text-sm text-muted-foreground">
          It may have been filled or removed. <Link to="/jobs" className="underline">Back to all jobs</Link>.
        </p>
      </section>
    )
  }

  if (state.status === 'error') {
    return (
      <section className="py-14">
        <p role="alert" className="rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground">
          {state.message}
        </p>
      </section>
    )
  }

  const { job } = state
  const shareUrl = buildJobShareUrl(env.VITE_APP_URL, job.slug)

  return (
    <section className="flex flex-col gap-8 py-10 sm:py-14">
      <Link to="/jobs" className="text-sm text-muted-foreground hover:text-foreground hover:underline">
        ← Back to all jobs
      </Link>

      <header className="flex flex-col gap-3">
        <p className="text-sm font-medium text-muted-foreground">{job.company.name}</p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{job.title}</h1>
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="neutral">{formatRemotePolicy(job.remotePolicy)}</Badge>
          {job.location && <Badge variant="outline">{job.location}</Badge>}
          {job.seniority && <Badge variant="neutral">{job.seniority}</Badge>}
          {job.functionArea && <Badge variant="neutral">{job.functionArea}</Badge>}
          <Badge variant="neutral">{job.community}</Badge>
        </div>
      </header>

      <div className="flex flex-col gap-2 rounded-2xl bg-muted px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Referral bonus</p>
          <p className="text-2xl font-bold text-foreground">
            {formatReferralBonus(job.referralBonusAmount, job.referralBonusCurrency)}
          </p>
        </div>
        <p className="max-w-sm text-xs text-muted-foreground">
          Paid once the referral leads to a hire. Amounts are set by the hiring company and are not guaranteed
          or processed by this platform.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-foreground">About this role</h2>
        <p className="text-sm leading-relaxed whitespace-pre-line text-muted-foreground">{job.description}</p>
      </div>

      <div className="flex flex-col gap-2 border-t border-border pt-6">
        <h2 className="text-sm font-semibold text-foreground">Share this role</h2>
        <p className="text-sm text-muted-foreground">{formatPublishedDate(job.publishedAt)}</p>
        <ShareActions url={shareUrl} jobTitle={job.title} companyName={job.company.name} />
      </div>
    </section>
  )
}
