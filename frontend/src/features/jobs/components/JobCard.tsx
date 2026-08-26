import { MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Badge } from '../../../components/ui/Badge'
import { ShareActions } from '../../referrals/components/ShareActions'
import { CompanyLogo } from './CompanyLogo'
import { formatPublishedDate, formatReferralBonus, formatRemotePolicy } from '../format'
import type { Job } from '../model'

export interface JobCardProps {
  job: Job
}

export function JobCard({ job }: JobCardProps) {
  return (
    <article className="flex h-full flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:border-foreground/15 hover:shadow-md">
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-x-2.5">
        <CompanyLogo company={job.company} size="sm" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{job.company.name}</p>
          <p className="text-xs text-muted-foreground">{formatPublishedDate(job.publishedAt)}</p>
        </div>
        <span className="shrink-0 rounded-full bg-primary px-3 py-1 text-sm font-semibold text-primary-foreground">
          {formatReferralBonus(job.referralBonusAmount, job.referralBonusCurrency)}
        </span>
      </div>

      <div className="min-h-[4.75rem]">
        <h2 className="line-clamp-2 min-h-[2.6em] text-[15px] leading-snug font-semibold tracking-tight text-foreground">
          <Link to={`/jobs/${job.slug}`} className="hover:underline">
            {job.title}
          </Link>
        </h2>
        <p className="mt-1.5 line-clamp-2 min-h-[2.4em] text-[13px] leading-relaxed text-muted-foreground">
          {job.summary ?? job.description}
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {job.functionArea && <Badge variant="neutral">{job.functionArea}</Badge>}
        <Badge variant="neutral">{formatRemotePolicy(job.remotePolicy)}</Badge>
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-border/60 pt-3">
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="size-3" aria-hidden="true" />
          {job.location ?? job.community}
        </span>
        <ShareActions variant="compact" job={job} />
      </div>
    </article>
  )
}
