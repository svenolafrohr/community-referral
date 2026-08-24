import { useState } from 'react'
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useTransform,
  type PanInfo,
} from 'framer-motion'
import { Check, MapPin, X } from 'lucide-react'

import { env } from '../../../lib/env'
import { buildJobShareUrl } from '../../referrals/share'
import { ShareActions } from '../../referrals/components/ShareActions'
import { Badge } from '../../../components/ui/Badge'
import {
  companyInitials,
  formatPublishedDate,
  formatReferralBonus,
  formatRemotePolicy,
} from '../format'
import type { Job } from '../model'

const SWIPE_THRESHOLD = 120
const STACK_HEIGHT = 520

type ExitDirection = 'left' | 'right'

function StackCard({
  job,
  offset,
  exitDirection,
  sharing,
  onOpenDetails,
  onSkip,
  onEnterShare,
  onExitShare,
  onShared,
}: {
  job: Job
  offset: number
  exitDirection: ExitDirection
  sharing: boolean
  onOpenDetails: (job: Job) => void
  onSkip: () => void
  onEnterShare: () => void
  onExitShare: () => void
  onShared: () => void
}) {
  const isTop = offset === 0
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-260, 260], [-12, 12])
  const shareHintOpacity = useTransform(x, [20, 140], [0, 1])
  const skipHintOpacity = useTransform(x, [-140, -20], [1, 0])
  const shareUrl = buildJobShareUrl(env.VITE_APP_URL, job.slug)

  function handleDragEnd(_event: unknown, info: PanInfo) {
    if (info.offset.x <= -SWIPE_THRESHOLD) {
      onSkip()
      return
    }
    if (info.offset.x >= SWIPE_THRESHOLD) {
      onEnterShare()
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
      drag={isTop && !sharing ? 'x' : false}
      dragElastic={0.7}
      {...(isTop && !sharing ? { onDragEnd: handleDragEnd } : {})}
      onClick={() => {
        if (isTop && !sharing && Math.abs(x.get()) < 4) onOpenDetails(job)
      }}
    >
      <div className="relative flex h-full cursor-pointer flex-col rounded-[32px] border border-border bg-card p-7 shadow-[0_8px_16px_rgba(0,0,0,0.03),0_40px_80px_-32px_rgba(0,0,0,0.16)]">
        {isTop && !sharing && (
          <>
            <motion.span
              style={{ opacity: shareHintOpacity }}
              className="absolute top-6 right-6 rounded-full border-2 border-foreground px-3 py-1 text-xs font-bold tracking-wide text-foreground uppercase"
            >
              Share
            </motion.span>
            <motion.span
              style={{ opacity: skipHintOpacity }}
              className="absolute top-6 left-6 rounded-full border-2 border-muted-foreground px-3 py-1 text-xs font-bold tracking-wide text-muted-foreground uppercase"
            >
              Next
            </motion.span>
          </>
        )}

        <div className="flex items-start gap-3.5">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground">
            {companyInitials(job.company.name)}
          </span>
          <div className="min-w-0 flex-1 pt-0.5">
            <p className="truncate text-base font-semibold text-foreground">{job.company.name}</p>
            <p className="text-sm text-muted-foreground">{formatPublishedDate(job.publishedAt)}</p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <Badge variant="neutral">{formatRemotePolicy(job.remotePolicy)}</Badge>
          {job.location && (
            <Badge variant="outline" className="gap-1">
              <MapPin className="size-3" aria-hidden="true" />
              {job.location}
            </Badge>
          )}
          <Badge variant="neutral">{job.community}</Badge>
        </div>

        <h3 className="mt-5 line-clamp-2 text-2xl leading-tight font-bold tracking-tight text-foreground">
          {job.title}
        </h3>

        {sharing ? (
          <div className="mt-4 flex flex-1 flex-col justify-between">
            <p className="text-sm text-muted-foreground">
              Send this role to someone who would be a great fit.
            </p>
            <div className="flex flex-col items-start gap-3">
              <ShareActions
                url={shareUrl}
                jobTitle={job.title}
                companyName={job.company.name}
                onShare={onShared}
              />
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  onExitShare()
                }}
                className="text-sm text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
              >
                Back
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="mt-3 line-clamp-4 flex-1 text-[15px] leading-relaxed text-muted-foreground">
              {job.summary ?? job.description}
            </p>
            <div className="mt-5 border-t border-border/60 pt-5">
              <span className="text-2xl font-bold tracking-tight text-foreground">
                {formatReferralBonus(job.referralBonusAmount, job.referralBonusCurrency)}
              </span>
              <p className="mt-0.5 text-xs text-muted-foreground">Referral bonus</p>
            </div>
          </>
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
  const [sharing, setSharing] = useState(false)
  const [sharingResetIndex, setSharingResetIndex] = useState(0)

  if (trackedJobs !== jobs) {
    setTrackedJobs(jobs)
    setIndex(0)
  }

  const activeIndex = jobs.length === 0 ? 0 : ((index % jobs.length) + jobs.length) % jobs.length

  if (sharingResetIndex !== activeIndex) {
    setSharingResetIndex(activeIndex)
    setSharing(false)
  }

  if (jobs.length === 0) return null

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
              sharing={offset === 0 && sharing}
              onOpenDetails={onOpenDetails}
              onSkip={() => advance('left')}
              onEnterShare={() => setSharing(true)}
              onExitShare={() => setSharing(false)}
              onShared={() => advance('right')}
            />
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-6 flex items-center gap-6">
        <button
          type="button"
          aria-label="Next job"
          onClick={() => advance('left')}
          className="flex size-14 items-center justify-center rounded-full bg-muted text-foreground shadow-[0_16px_28px_-16px_rgba(0,0,0,0.22)] transition-transform duration-150 hover:scale-105 active:scale-95"
        >
          <X className="size-6" aria-hidden="true" />
        </button>

        {jobs.length <= 8 ? (
          <div className="flex items-center gap-1.5">
            {jobs.map((job, i) => (
              <span
                key={job.id}
                className={
                  i === activeIndex
                    ? 'h-1.5 w-5 rounded-full bg-foreground transition-all duration-300'
                    : 'h-1.5 w-1.5 rounded-full bg-muted-foreground/30 transition-all duration-300'
                }
              />
            ))}
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">
            {activeIndex + 1} / {jobs.length}
          </span>
        )}

        <button
          type="button"
          aria-label="Share this job"
          onClick={() => setSharing(true)}
          className="flex size-14 items-center justify-center rounded-full bg-foreground text-background shadow-[0_16px_28px_-16px_rgba(0,0,0,0.32)] transition-transform duration-150 hover:scale-105 active:scale-95"
        >
          <Check className="size-6" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
