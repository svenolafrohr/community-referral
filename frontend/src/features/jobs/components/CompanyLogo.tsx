import { cn } from '../../../lib/utils'
import { companyInitials } from '../format'
import type { CompanySummary } from '../model'

const sizeClasses = {
  sm: 'size-9 text-xs',
  lg: 'size-12 text-sm',
} as const

export interface CompanyLogoProps {
  company: CompanySummary
  size?: keyof typeof sizeClasses
  className?: string
}

export function CompanyLogo({ company, size = 'sm', className }: CompanyLogoProps) {
  if (company.logoUrl) {
    return (
      <img
        src={company.logoUrl}
        alt=""
        className={cn(sizeClasses[size], 'shrink-0 rounded-full object-contain ring-1 ring-border', className)}
      />
    )
  }
  return (
    <span
      aria-hidden="true"
      className={cn(
        sizeClasses[size],
        'flex shrink-0 items-center justify-center rounded-full bg-muted font-medium text-muted-foreground',
        className,
      )}
    >
      {companyInitials(company.name)}
    </span>
  )
}
