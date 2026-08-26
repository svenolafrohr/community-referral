"use client"

import { type ReactNode, useState } from "react"
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useTransform,
  type PanInfo,
} from "framer-motion"
import { MapPin, Send, X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { CompanyLogo } from "@/components/referrer/company-logo"
import { JobDetailModal } from "@/components/referrer/job-detail-modal"
import { BonusBadge } from "@/components/referrer/bonus-badge"
import { ShareMenu } from "@/components/referrer/share-menu"
import { formatPublishedDate, formatRemotePolicy } from "@/lib/format"
import type { Job } from "@/lib/jobs"

const SWIPE_THRESHOLD = 120
const STACK_HEIGHT = 560

type ExitDirection = "left" | "right"

function Pill({ children }: { children: ReactNode }) {
  return (
    <Badge className="h-auto items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-normal text-foreground/70">
      {children}
    </Badge>
  )
}

function StackCard({
  job,
  offset,
  exitDirection,
  onOpenDetails,
  onSkip,
}: {
  job: Job
  offset: number
  exitDirection: ExitDirection
  onOpenDetails: (job: Job) => void
  onSkip: () => void
}) {
  const isTop = offset === 0
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-260, 260], [-12, 12])
  const skipOpacity = useTransform(x, [-140, -20], [1, 0])

  function handleDragEnd(_event: unknown, info: PanInfo) {
    if (info.offset.x <= -SWIPE_THRESHOLD) {
      onSkip()
      return
    }
    animate(x, 0, { type: "spring", stiffness: 320, damping: 28 })
  }

  return (
    <motion.div
      className="absolute inset-0"
      style={{
        zIndex: 10 - offset,
        x: isTop ? x : 0,
        rotate: isTop ? rotate : 0,
        pointerEvents: isTop ? "auto" : "none",
      }}
      initial={{ opacity: 0, scale: 0.86, y: 56 }}
      animate={{
        opacity: offset === 2 ? 0.7 : 1,
        scale: 1 - offset * 0.045,
        y: offset * 14,
      }}
      exit={{
        x: exitDirection === "left" ? -560 : 560,
        rotate: exitDirection === "left" ? -18 : 18,
        opacity: 0,
        transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
      }}
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
      drag={isTop ? "x" : false}
      dragElastic={0.7}
      onDragEnd={isTop ? handleDragEnd : undefined}
      onClick={() => {
        if (isTop && Math.abs(x.get()) < 4) onOpenDetails(job)
      }}
    >
      <div className="relative flex h-full cursor-pointer flex-col rounded-[32px] bg-card px-7 pt-7 pb-24 shadow-[0_8px_16px_rgba(0,0,0,0.03),0_40px_80px_-32px_rgba(0,0,0,0.16)] ring-1 ring-black/[0.04]">
        {isTop && (
          <motion.span
            style={{ opacity: skipOpacity }}
            className="absolute top-6 left-6 rounded-full border-2 border-muted-foreground px-3 py-1 text-xs font-bold tracking-wide text-muted-foreground uppercase"
          >
            Weiter
          </motion.span>
        )}

        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <CompanyLogo company={job.company} size="lg" />
            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-foreground">
                {job.company.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatPublishedDate(job.publishedAt)}
              </p>
            </div>
          </div>
          <BonusBadge
            amount={job.referralBonusAmount}
            currency={job.referralBonusCurrency}
            size="lg"
            className="mt-0.5 shrink-0"
          />
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {job.functionArea && <Pill>{job.functionArea}</Pill>}
          <Pill>{formatRemotePolicy(job.remotePolicy)}</Pill>
          {job.location && (
            <Pill>
              <MapPin className="size-3" />
              {job.location}
            </Pill>
          )}
        </div>

        <h3 className="mt-5 line-clamp-2 text-2xl leading-tight font-bold tracking-tight text-foreground">
          {job.title}
        </h3>

        <p className="mt-3 line-clamp-4 flex-1 text-[15px] leading-relaxed text-muted-foreground">
          {job.summary ?? job.description}
        </p>

        {isTop && (
          <div className="absolute right-6 bottom-6 left-6 flex items-center justify-between">
            <button
              type="button"
              aria-label="Weiter"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation()
                onSkip()
              }}
              className="flex size-14 items-center justify-center rounded-full bg-muted text-foreground shadow-[0_16px_28px_-16px_rgba(0,0,0,0.22)] transition-transform duration-150 hover:scale-105 active:scale-95"
            >
              <X className="size-6" />
            </button>

            <ShareMenu
              job={job}
              trigger={
                <button
                  type="button"
                  aria-label="Position teilen"
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={(event) => event.stopPropagation()}
                  className="flex size-14 items-center justify-center rounded-full bg-foreground text-background shadow-[0_16px_28px_-16px_rgba(0,0,0,0.32)] transition-transform duration-150 hover:scale-105 active:scale-95"
                >
                  <Send className="size-6" />
                </button>
              }
            />
          </div>
        )}
      </div>
    </motion.div>
  )
}

export function JobStack({ jobs }: { jobs: Job[] }) {
  const [index, setIndex] = useState(0)
  const [trackedJobs, setTrackedJobs] = useState(jobs)
  const [exitDirection, setExitDirection] = useState<ExitDirection>("left")
  const [viewJob, setViewJob] = useState<Job | null>(null)

  if (trackedJobs !== jobs) {
    setTrackedJobs(jobs)
    setIndex(0)
  }

  const activeIndex = ((index % jobs.length) + jobs.length) % jobs.length
  const count = Math.min(3, jobs.length)
  const slots = Array.from({ length: count }, (_, offset) => ({
    job: jobs[(activeIndex + offset) % jobs.length],
    offset,
  }))

  function advance(direction: ExitDirection) {
    setExitDirection(direction)
    setIndex((i) => i + 1)
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-sm" style={{ height: STACK_HEIGHT }}>
        <AnimatePresence initial={false}>
          {slots.map(({ job, offset }) => (
            <StackCard
              key={job.id}
              job={job}
              offset={offset}
              exitDirection={exitDirection}
              onOpenDetails={setViewJob}
              onSkip={() => advance("left")}
            />
          ))}
        </AnimatePresence>
      </div>

      <JobDetailModal
        job={viewJob}
        onOpenChange={(open) => {
          if (!open) setViewJob(null)
        }}
      />
    </div>
  )
}
