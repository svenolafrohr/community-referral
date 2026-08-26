"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { MapPin, Send } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { BonusBadge } from "@/components/referrer/bonus-badge"
import { CompanyLogo } from "@/components/referrer/company-logo"
import { ShareMenu } from "@/components/referrer/share-menu"
import { formatPublishedDate, formatRemotePolicy } from "@/lib/format"
import type { Job } from "@/lib/jobs"

function Pill({ children }: { children: ReactNode }) {
  return (
    <Badge className="h-auto rounded-full bg-muted px-2.5 py-1 text-xs font-normal text-foreground/70">
      {children}
    </Badge>
  )
}

export function JobCardGrid({
  jobs,
  onSelect,
}: {
  jobs: Job[]
  onSelect: (job: Job) => void
}) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {jobs.map((job, index) => (
        <motion.div
          key={job.id}
          layout
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{
            duration: 0.3,
            delay: index * 0.03,
            ease: [0.22, 1, 0.36, 1],
          }}
          whileHover={{ y: -2 }}
          onClick={() => onSelect(job)}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault()
              onSelect(job)
            }
          }}
          className="group flex h-full cursor-pointer flex-col gap-4 rounded-2xl border border-border/70 bg-card p-5 outline-none transition-all duration-300 hover:border-border/90 hover:shadow-[0_2px_4px_rgba(0,0,0,0.02),0_20px_32px_-22px_rgba(0,0,0,0.18)] focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          <div className="grid grid-cols-[36px_1fr_auto] items-center gap-x-2.5">
            <CompanyLogo company={job.company} size="sm" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">
                {job.company.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatPublishedDate(job.publishedAt)}
              </p>
            </div>
            <BonusBadge amount={job.referralBonusAmount} currency={job.referralBonusCurrency} />
          </div>

          <div className="min-h-[4.75rem]">
            <h3 className="line-clamp-2 min-h-[2.6em] text-[15px] leading-snug font-semibold tracking-tight text-foreground">
              {job.title}
            </h3>
            <p className="mt-1.5 line-clamp-2 min-h-[2.4em] text-[13px] leading-relaxed text-muted-foreground">
              {job.summary ?? job.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {job.functionArea && <Pill>{job.functionArea}</Pill>}
            <Pill>{formatRemotePolicy(job.remotePolicy)}</Pill>
          </div>

          <div className="mt-auto flex items-center justify-between border-t border-border/60 pt-3">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="size-3" />
              {job.location ?? job.community}
            </span>
            <ShareMenu
              job={job}
              trigger={
                <button
                  type="button"
                  aria-label="Position teilen"
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={(event) => event.stopPropagation()}
                  className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Send className="size-4" />
                </button>
              }
            />
          </div>
        </motion.div>
      ))}
    </div>
  )
}
