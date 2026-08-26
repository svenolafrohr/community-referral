import { MapPin } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { BonusBadge } from "@/components/referrer/bonus-badge"
import { remoteLabels, type Job } from "@/lib/jobs"

export function JobList({
  jobs,
  onSelect,
}: {
  jobs: Job[]
  onSelect: (job: Job) => void
}) {
  return (
    <div className="divide-y divide-border rounded-xl border border-border">
      {jobs.map((job) => (
        <button
          key={job.id}
          onClick={() => onSelect(job)}
          className="group flex w-full items-center gap-4 px-4 py-4 text-left transition-colors hover:bg-muted/60 focus-visible:bg-muted/60 focus-visible:outline-none sm:px-5"
        >
          <Avatar className="hidden sm:flex">
            <AvatarFallback>{job.companyInitials}</AvatarFallback>
          </Avatar>

          <div className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {job.title}
              </p>
              <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                <span className="truncate">{job.company}</span>
                <span className="flex items-center gap-1">
                  <MapPin className="size-3" />
                  {job.location}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <Badge variant="outline">{job.department}</Badge>
              <Badge variant="secondary">{remoteLabels[job.remote]}</Badge>
            </div>
          </div>

          <BonusBadge amount={job.bonus} className="ml-auto sm:ml-0" />
        </button>
      ))}
    </div>
  )
}
