import type { RemotePolicy } from "./jobs"

const remotePolicyLabels: Record<RemotePolicy, string> = {
  remote: "Remote",
  hybrid: "Hybrid",
  onsite: "Vor Ort",
  flexible: "Flexibel",
  unspecified: "Ort flexibel",
}

export function formatRemotePolicy(policy: RemotePolicy): string {
  return remotePolicyLabels[policy]
}

export const remotePolicyOptions = Object.keys(remotePolicyLabels) as RemotePolicy[]

export function formatReferralBonus(amount: number | null, currency: string): string {
  if (amount === null) return "Prämie noch offen"
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function companyInitials(name: string): string {
  const [first, second] = name.split(/\s+/).filter(Boolean)
  if (!first) return "?"
  return second ? `${first[0]}${second[0]}`.toUpperCase() : first.slice(0, 2).toUpperCase()
}

export function formatPublishedDate(iso: string | null): string {
  if (!iso) return "Kürzlich hinzugefügt"
  const date = new Date(iso)
  const days = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24))
  if (days <= 0) return "Heute gepostet"
  if (days === 1) return "Vor 1 Tag gepostet"
  return `Vor ${days} Tagen gepostet`
}
