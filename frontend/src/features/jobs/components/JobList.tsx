import { MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Badge } from '../../../components/ui/Badge'
import { formatReferralBonus, formatRemotePolicy } from '../format'
import type { Job } from '../model'

export interface JobListProps {
  jobs: Job[]
}

export function JobList({ jobs }: JobListProps) {
  return (
    <ul className="divide-y divide-border rounded-2xl border border-border bg-card">
      {jobs.map((job) => (
        <li key={job.id}>
          <Link
            to={`/jobs/${job.slug}`}
            className="flex items-center gap-4 px-4 py-4 transition-colors hover:bg-muted/60 sm:px-5"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{job.title}</p>
              <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                <span className="truncate">{job.company.name}</span>
                {job.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3" aria-hidden="true" />
                    {job.location}
                  </span>
                )}
              </div>
            </div>

            <div className="hidden items-center gap-1.5 sm:flex">
              {job.functionArea && <Badge variant="outline">{job.functionArea}</Badge>}
              <Badge variant="neutral">{formatRemotePolicy(job.remotePolicy)}</Badge>
            </div>

            <span className="ml-auto shrink-0 rounded-full bg-primary px-3 py-1 text-sm font-semibold text-primary-foreground sm:ml-0">
              {formatReferralBonus(job.referralBonusAmount, job.referralBonusCurrency)}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
