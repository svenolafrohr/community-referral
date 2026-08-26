import { Copy, Mail, MessageCircle, Send } from 'lucide-react'
import { toast } from 'sonner'

import { Popover, PopoverContent, PopoverTrigger } from '../../../components/ui/Popover'
import { usePopover } from '../../../components/ui/popover-context'
import { cn } from '../../../lib/utils'
import { env } from '../../../lib/env'
import { createReferral, type CreatedReferral } from '../api'
import { buildJobShareUrl } from '../share'

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.64h.05c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.78 2.66 4.78 6.11V21h-4v-5.62c0-1.34-.02-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.96V21h-4V9Z" />
    </svg>
  )
}

// One referral per job per session — every share channel for the same job
// reuses the same tracked code instead of minting a new `referrals` row
// per click.
const referralCache = new Map<string, Promise<CreatedReferral | null>>()

function getReferral(jobId: string): Promise<CreatedReferral | null> {
  let cached = referralCache.get(jobId)
  if (!cached) {
    cached = createReferral(jobId).catch(() => null)
    referralCache.set(jobId, cached)
  }
  return cached
}

// Falls back to an untracked job link if create-referral fails (e.g.
// Supabase isn't configured) so sharing still works.
async function resolveShareUrl(jobId: string, jobSlug: string): Promise<string> {
  const referral = await getReferral(jobId)
  return referral
    ? buildJobShareUrl(env.VITE_APP_URL, referral.jobSlug, referral.code)
    : buildJobShareUrl(env.VITE_APP_URL, jobSlug)
}

export interface ShareActionsJob {
  id: string
  slug: string
  title: string
  company: { name: string }
}

export interface ShareActionsProps {
  job: ShareActionsJob
  variant?: 'compact' | 'full'
  /** Overrides the trigger button's classes instead of the variant default. */
  triggerClassName?: string
  /** Called after a share action is taken (clipboard copied, or a channel link opened). */
  onShare?: () => void
}

function MenuItem({
  icon,
  label,
  onSelect,
}: {
  icon: React.ReactNode
  label: string
  onSelect: () => void
}) {
  const { setOpen } = usePopover()
  return (
    <button
      type="button"
      role="menuitem"
      onClick={() => {
        onSelect()
        setOpen(false)
      }}
      className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm text-foreground transition-colors hover:bg-muted"
    >
      <span className="flex size-4 shrink-0 items-center justify-center text-muted-foreground [&_svg]:size-4">
        {icon}
      </span>
      {label}
    </button>
  )
}

export function ShareActions({ job, variant = 'full', triggerClassName, onShare }: ShareActionsProps) {
  const text = `${job.title} at ${job.company.name}`

  async function copyLink() {
    const url = await resolveShareUrl(job.id, job.slug)
    try {
      await navigator.clipboard.writeText(url)
      toast.success('Link copied')
      onShare?.()
    } catch {
      toast.error('Could not copy the link. Copy it from the address bar instead.')
    }
  }

  async function openMail() {
    const url = await resolveShareUrl(job.id, job.slug)
    window.location.href = `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(`${text} — ${url}`)}`
    onShare?.()
  }

  async function openLinkedIn() {
    const popup = window.open('', '_blank', 'noopener,noreferrer')
    const url = await resolveShareUrl(job.id, job.slug)
    const target = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    if (popup) popup.location.href = target
    else window.open(target, '_blank', 'noopener,noreferrer')
    onShare?.()
  }

  async function openWhatsApp() {
    const popup = window.open('', '_blank', 'noopener,noreferrer')
    const url = await resolveShareUrl(job.id, job.slug)
    const target = `https://wa.me/?text=${encodeURIComponent(`${text} — ${url}`)}`
    if (popup) popup.location.href = target
    else window.open(target, '_blank', 'noopener,noreferrer')
    onShare?.()
  }

  const defaultTriggerClassName =
    variant === 'compact'
      ? 'flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'
      : 'flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-transform active:scale-[0.99]'

  return (
    <Popover>
      <PopoverTrigger
        className={cn(triggerClassName ?? defaultTriggerClassName)}
        aria-label="Share this job"
      >
        {variant === 'compact' ? (
          <Send className="size-4" aria-hidden="true" />
        ) : (
          <>
            <Send className="size-4" aria-hidden="true" />
            Share this job
          </>
        )}
      </PopoverTrigger>
      <PopoverContent role="menu" align={variant === 'compact' ? 'end' : 'start'}>
        <MenuItem icon={<Mail />} label="Email" onSelect={() => void openMail()} />
        <MenuItem icon={<LinkedinIcon />} label="LinkedIn" onSelect={() => void openLinkedIn()} />
        <MenuItem icon={<MessageCircle />} label="WhatsApp" onSelect={() => void openWhatsApp()} />
        <MenuItem icon={<Copy />} label="Copy link" onSelect={() => void copyLink()} />
      </PopoverContent>
    </Popover>
  )
}
