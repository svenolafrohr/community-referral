import { Link as LinkIcon, Mail, MessageCircle } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '../../../components/ui/Button'
import { buttonVariants } from '../../../components/ui/variants'
import { cn } from '../../../lib/utils'

export interface ShareActionsProps {
  url: string
  jobTitle: string
  companyName: string
  variant?: 'compact' | 'full'
  /** Called after a share action is taken (clipboard copied, or a WhatsApp/email link opened). */
  onShare?: () => void
}

async function copyToClipboard(url: string, onShare?: () => void) {
  try {
    await navigator.clipboard.writeText(url)
    toast.success('Link copied')
    onShare?.()
  } catch {
    toast.error('Could not copy the link. Copy it from the address bar instead.')
  }
}

export function ShareActions({ url, jobTitle, companyName, variant = 'full', onShare }: ShareActionsProps) {
  const shareMessage = `${jobTitle} at ${companyName} — ${url}`
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`
  const emailHref = `mailto:?subject=${encodeURIComponent(`${jobTitle} at ${companyName}`)}&body=${encodeURIComponent(shareMessage)}`

  if (variant === 'compact') {
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        aria-label="Copy link to this job"
        onClick={(event) => {
          event.preventDefault()
          void copyToClipboard(url, onShare)
        }}
      >
        <LinkIcon className="size-4" aria-hidden="true" />
        Copy link
      </Button>
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Share this job">
      <Button type="button" variant="primary" onClick={() => void copyToClipboard(url, onShare)}>
        <LinkIcon className="size-4" aria-hidden="true" />
        Copy link
      </Button>
      <a
        className={cn(buttonVariants({ variant: 'outline' }))}
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => onShare?.()}
      >
        <MessageCircle className="size-4" aria-hidden="true" />
        WhatsApp
      </a>
      <a className={cn(buttonVariants({ variant: 'outline' }))} href={emailHref} onClick={() => onShare?.()}>
        <Mail className="size-4" aria-hidden="true" />
        Email
      </a>
    </div>
  )
}
