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
}

async function copyToClipboard(url: string) {
  try {
    await navigator.clipboard.writeText(url)
    toast.success('Link copied')
  } catch {
    toast.error('Could not copy the link. Copy it from the address bar instead.')
  }
}

export function ShareActions({ url, jobTitle, companyName, variant = 'full' }: ShareActionsProps) {
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
          void copyToClipboard(url)
        }}
      >
        <LinkIcon className="size-4" aria-hidden="true" />
        Copy link
      </Button>
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Share this job">
      <Button type="button" variant="primary" onClick={() => void copyToClipboard(url)}>
        <LinkIcon className="size-4" aria-hidden="true" />
        Copy link
      </Button>
      <a
        className={cn(buttonVariants({ variant: 'outline' }))}
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
      >
        <MessageCircle className="size-4" aria-hidden="true" />
        WhatsApp
      </a>
      <a className={cn(buttonVariants({ variant: 'outline' }))} href={emailHref}>
        <Mail className="size-4" aria-hidden="true" />
        Email
      </a>
    </div>
  )
}
