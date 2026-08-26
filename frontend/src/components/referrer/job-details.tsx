import { MapPin, Send } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { BonusBadge } from "@/components/referrer/bonus-badge"
import { CompanyLogo } from "@/components/referrer/company-logo"
import { ShareMenu } from "@/components/referrer/share-menu"
import { formatPublishedDate, formatRemotePolicy } from "@/lib/format"
import type { Job } from "@/lib/jobs"

export function JobDetails({ job }: { job: Job }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start gap-3">
        <CompanyLogo company={job.company} size="lg" />
        <div className="min-w-0">
          <p className="text-base font-medium text-foreground">{job.title}</p>
          <p className="text-sm text-muted-foreground">{job.company.name}</p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <Badge variant="outline">{formatRemotePolicy(job.remotePolicy)}</Badge>
            {job.location && <Badge variant="secondary">{job.location}</Badge>}
            {job.seniority && <Badge variant="secondary">{job.seniority}</Badge>}
            {job.functionArea && <Badge variant="secondary">{job.functionArea}</Badge>}
            <Badge variant="outline" className="gap-1">
              <MapPin className="size-3" />
              {job.community}
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-lg bg-muted/60 px-4 py-3">
        <span className="text-sm text-muted-foreground">Deine Empfehlungsprämie</span>
        <BonusBadge
          amount={job.referralBonusAmount}
          currency={job.referralBonusCurrency}
          size="lg"
        />
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-medium text-foreground">Über die Rolle</h3>
        <p className="text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
          {job.description}
        </p>
      </div>

      <div className="flex flex-col gap-2 border-t border-border pt-4">
        <h3 className="text-sm font-medium text-foreground">Position teilen</h3>
        <p className="text-xs text-muted-foreground">{formatPublishedDate(job.publishedAt)}</p>
        <ShareMenu
          job={job}
          trigger={
            <button
              type="button"
              className="mt-1 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-foreground text-sm font-semibold text-background transition-transform duration-150 hover:bg-foreground/90 active:scale-[0.99] sm:w-auto sm:px-5"
            >
              <Send className="size-4" />
              Deinen Link teilen
            </button>
          }
        />
      </div>
    </div>
  )
}
