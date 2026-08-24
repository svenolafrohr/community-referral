import { MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Badge } from '../../../components/ui/Badge'
import { env } from '../../../lib/env'
import { buildJobShareUrl } from '../../referrals/share'
import { ShareActions } from '../../referrals/components/ShareActions'
import { formatPublishedDate, formatReferralBonus, formatRemotePolicy } from '../format'
import type { Job } from '../model'

export interface JobCardProps {
  job: Job
}

export function JobCard({ job }: JobCardProps) {
  const shareUrl = buildJobShareUrl(env.VITE_APP_URL, job.slug)

  return (
    <article className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-muted-foreground">{job.company.name}</p>
          <h2 className="mt-0.5 text-lg leading-tight font-semibold text-foreground">
            <Link to={`/jobs/${job.slug}`} className="hover:underline">
              {job.title}
            </Link>
          </h2>
        </div>
        <span className="shrink-0 rounded-full bg-primary px-3 py-1 text-sm font-semibold text-primary-foreground">
          {formatReferralBonus(job.referralBonusAmount, job.referralBonusCurrency)}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <Badge variant="neutral">{formatRemotePolicy(job.remotePolicy)}</Badge>
        {job.location && (
          <Badge variant="outline" className="gap-1">
            <MapPin className="size-3" aria-hidden="true" />
            {job.location}
          </Badge>
        )}
        {job.functionArea && <Badge variant="neutral">{job.functionArea}</Badge>}
        <Badge variant="neutral">{job.community}</Badge>
      </div>

      <p className="line-clamp-2 text-sm text-muted-foreground">
        {job.summary ?? job.description}
      </p>

      <div className="mt-auto flex items-center justify-between pt-1">
        <span className="text-xs text-muted-foreground">{formatPublishedDate(job.publishedAt)}</span>
        <ShareActions
          variant="compact"
          url={shareUrl}
          jobTitle={job.title}
          companyName={job.company.name}
        />
      </div>
    </article>
  )
}
