import { useState } from 'react'
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useTransform,
  type PanInfo,
} from 'framer-motion'
import { MapPin, X } from 'lucide-react'

import { Badge } from '../../../components/ui/Badge'
import { ShareActions } from '../../referrals/components/ShareActions'
import { CompanyLogo } from './CompanyLogo'
import { formatPublishedDate, formatReferralBonus, formatRemotePolicy } from '../format'
import type { Job } from '../model'

const SWIPE_THRESHOLD = 120
const STACK_HEIGHT = 560

type ExitDirection = 'left' | 'right'

function StackCard({
  job,
  offset,
  exitDirection,
  onOpenDetails,
  onSkip,
  onShared,
}: {
  job: Job
  offset: number
  exitDirection: ExitDirection
  onOpenDetails: (job: Job) => void
  onSkip: () => void
  onShared: () => void
}) {
  const isTop = offset === 0
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-260, 260], [-12, 12])
  const skipHintOpacity = useTransform(x, [-140, -20], [1, 0])

  function handleDragEnd(_event: unknown, info: PanInfo) {
    if (info.offset.x <= -SWIPE_THRESHOLD) {
      onSkip()
      return
    }
    animate(x, 0, { type: 'spring', stiffness: 320, damping: 28 })
  }

  return (
    <motion.div
      className="absolute inset-0"
      style={{
        zIndex: 10 - offset,
        x: isTop ? x : 0,
        rotate: isTop ? rotate : 0,
        pointerEvents: isTop ? 'auto' : 'none',
      }}
      initial={{ opacity: 0, scale: 0.86, y: 56 }}
      animate={{ opacity: offset === 2 ? 0.7 : 1, scale: 1 - offset * 0.045, y: offset * 14 }}
      exit={{
        x: exitDirection === 'left' ? -560 : 560,
        rotate: exitDirection === 'left' ? -18 : 18,
        opacity: 0,
        transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
      }}
      transition={{ type: 'spring', stiffness: 260, damping: 26 }}
      drag={isTop ? 'x' : false}
      dragElastic={0.7}
      {...(isTop ? { onDragEnd: handleDragEnd } : {})}
      onClick={() => {
        if (isTop && Math.abs(x.get()) < 4) onOpenDetails(job)
      }}
    >
      <div className="relative flex h-full cursor-pointer flex-col rounded-[32px] border border-border bg-card px-7 pt-7 pb-24 shadow-[0_8px_16px_rgba(0,0,0,0.03),0_40px_80px_-32px_rgba(0,0,0,0.16)]">
        {isTop && (
          <motion.span
            style={{ opacity: skipHintOpacity }}
            className="absolute top-6 left-6 rounded-full border-2 border-muted-foreground px-3 py-1 text-xs font-bold tracking-wide text-muted-foreground uppercase"
          >
            Next
          </motion.span>
        )}

        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <CompanyLogo company={job.company} size="lg" />
            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-foreground">{job.company.name}</p>
              <p className="text-xs text-muted-foreground">{formatPublishedDate(job.publishedAt)}</p>
            </div>
          </div>
          <span className="mt-0.5 shrink-0 rounded-full bg-primary px-3.5 py-1.5 text-base font-semibold text-primary-foreground">
            {formatReferralBonus(job.referralBonusAmount, job.referralBonusCurrency)}
          </span>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {job.functionArea && <Badge variant="neutral">{job.functionArea}</Badge>}
          <Badge variant="neutral">{formatRemotePolicy(job.remotePolicy)}</Badge>
          {job.location && (
            <Badge variant="outline" className="gap-1">
              <MapPin className="size-3" aria-hidden="true" />
              {job.location}
            </Badge>
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
              aria-label="Next job"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation()
                onSkip()
              }}
              className="flex size-14 items-center justify-center rounded-full bg-muted text-foreground shadow-[0_16px_28px_-16px_rgba(0,0,0,0.22)] transition-transform duration-150 hover:scale-105 active:scale-95"
            >
              <X className="size-6" aria-hidden="true" />
            </button>

            <span
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => event.stopPropagation()}
            >
              <ShareActions
                job={job}
                variant="compact"
                onShare={onShared}
                triggerClassName="flex size-14 items-center justify-center rounded-full bg-foreground text-background shadow-[0_16px_28px_-16px_rgba(0,0,0,0.32)] transition-transform duration-150 hover:scale-105 active:scale-95 [&_svg]:size-6"
              />
            </span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export interface JobStackProps {
  jobs: Job[]
  onOpenDetails: (job: Job) => void
}

export function JobStack({ jobs, onOpenDetails }: JobStackProps) {
  const [index, setIndex] = useState(0)
  const [trackedJobs, setTrackedJobs] = useState(jobs)
  const [exitDirection, setExitDirection] = useState<ExitDirection>('left')

  if (trackedJobs !== jobs) {
    setTrackedJobs(jobs)
    setIndex(0)
  }

  if (jobs.length === 0) return null

  const activeIndex = ((index % jobs.length) + jobs.length) % jobs.length
  const count = Math.min(3, jobs.length)
  const slots = Array.from({ length: count }, (_, offset) => ({
    job: jobs[(activeIndex + offset) % jobs.length],
    offset,
  })).filter((slot): slot is { job: Job; offset: number } => slot.job !== undefined)

  function advance(direction: ExitDirection) {
    setExitDirection(direction)
    setIndex((current) => current + 1)
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
              onOpenDetails={onOpenDetails}
              onSkip={() => advance('left')}
              onShared={() => advance('right')}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
