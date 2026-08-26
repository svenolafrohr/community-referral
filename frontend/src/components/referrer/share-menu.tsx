"use client"

import { type ReactElement, useEffect, useRef } from "react"
import { Copy, Mail, MessageCircle } from "lucide-react"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { formatReferralBonus } from "@/lib/format"
import type { Job } from "@/lib/jobs"
import { buildJobShareUrl, createReferral, type CreatedReferral } from "@/lib/referrals"

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.64h.05c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.78 2.66 4.78 6.11V21h-4v-5.62c0-1.34-.02-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.96V21h-4V9Z" />
    </svg>
  )
}

// One referral per job per session — every share channel for the same job
// reuses the same tracked code instead of minting a new `referrals` row
// per click.
const referralCache = new Map<string, Promise<CreatedReferral | null>>()

function getReferral(job: Job): Promise<CreatedReferral | null> {
  let cached = referralCache.get(job.id)
  if (!cached) {
    cached = createReferral(job.id).catch(() => null)
    referralCache.set(job.id, cached)
  }
  return cached
}

// Falls back to an untracked job link if the create-referral call fails
// (e.g. Supabase isn't configured) so sharing still works.
async function resolveShareUrl(job: Job): Promise<string> {
  const referral = await getReferral(job)
  return referral
    ? buildJobShareUrl(referral.jobSlug, referral.code)
    : buildJobShareUrl(job.slug)
}

function ShareOption({
  icon,
  label,
  onSelect,
}: {
  icon: ReactElement
  label: string
  onSelect: (button: HTMLButtonElement) => void
}) {
  // Base UI's Popover (via Floating UI's focus/portal handling) swallows the
  // click before it reaches React's delegated root, so a plain onClick prop
  // never fires here. A listener bound straight to this element works.
  const ref = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const handler = (event: MouseEvent) => {
      event.stopPropagation()
      onSelect(el)
    }
    el.addEventListener("click", handler)
    return () => el.removeEventListener("click", handler)
  }, [onSelect])

  return (
    <button
      ref={ref}
      type="button"
      className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm text-foreground transition-colors hover:bg-muted"
    >
      <span className="flex size-4 shrink-0 items-center justify-center text-muted-foreground [&_svg]:size-4">
        {icon}
      </span>
      <span className="option-label">{label}</span>
    </button>
  )
}

export function ShareMenu({
  job,
  trigger,
}: {
  job: Job
  trigger: ReactElement
}) {
  const text = `${job.title} bei ${job.company.name} — ${formatReferralBonus(job.referralBonusAmount, job.referralBonusCurrency)} Empfehlungsprämie`

  function copyLink(button: HTMLButtonElement) {
    const label = button.querySelector(".option-label")
    const iconSlot = button.querySelector("span")
    if (!label || !iconSlot) return
    const originalLabel = label.textContent
    const originalIcon = iconSlot.innerHTML

    void resolveShareUrl(job).then((url) => {
      try {
        navigator.clipboard?.writeText(url)?.catch(() => {})
      } catch {
        // clipboard unavailable — the link is still in the address the share opened
      }
      label.textContent = "Link kopiert"
      iconSlot.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-foreground"><path d="M20 6 9 17l-5-5"/></svg>'
      window.setTimeout(() => {
        label.textContent = originalLabel
        iconSlot.innerHTML = originalIcon
      }, 1800)
    })
  }

  function openMail() {
    void resolveShareUrl(job).then((url) => {
      window.location.href = `mailto:?subject=${encodeURIComponent(
        `${job.title} bei ${job.company.name}`
      )}&body=${encodeURIComponent(`${text}\n\n${url}`)}`
    })
  }

  function openLinkedIn() {
    // Popups opened after an await are blocked by most browsers unless the
    // window is opened synchronously first and redirected once ready.
    const popup = window.open("", "_blank", "noopener,noreferrer")
    void resolveShareUrl(job).then((url) => {
      const target = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
      if (popup) popup.location.href = target
      else window.open(target, "_blank", "noopener,noreferrer")
    })
  }

  function openWhatsApp() {
    const popup = window.open("", "_blank", "noopener,noreferrer")
    void resolveShareUrl(job).then((url) => {
      const target = `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`
      if (popup) popup.location.href = target
      else window.open(target, "_blank", "noopener,noreferrer")
    })
  }

  return (
    <Popover>
      <PopoverTrigger render={trigger} />
      <PopoverContent align="end" className="w-56 p-1.5">
        <p className="px-2.5 py-1.5 text-xs font-medium text-muted-foreground">
          Position teilen
        </p>
        <ShareOption icon={<Mail className="size-4" />} label="Per E-Mail" onSelect={openMail} />
        <ShareOption
          icon={<LinkedinIcon className="size-4" />}
          label="Auf LinkedIn"
          onSelect={openLinkedIn}
        />
        <ShareOption
          icon={<MessageCircle className="size-4" />}
          label="Per WhatsApp"
          onSelect={openWhatsApp}
        />
        <ShareOption icon={<Copy className="size-4" />} label="Link kopieren" onSelect={copyLink} />
      </PopoverContent>
    </Popover>
  )
}
