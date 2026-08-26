import { Building2 } from "lucide-react"

import { cn } from "@/lib/utils"
import type { CompanySummary } from "@/lib/jobs"

const sizeClasses = {
  sm: "size-9 rounded-xl",
  lg: "size-12 rounded-2xl",
} as const

export function CompanyLogo({
  company,
  size = "sm",
  className,
}: {
  company: CompanySummary
  size?: keyof typeof sizeClasses
  className?: string
}) {
  if (company.logoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- external, unconfigured domains
      <img
        src={company.logoUrl}
        alt=""
        className={cn(
          sizeClasses[size],
          "shrink-0 object-contain ring-1 ring-black/[0.04]",
          className
        )}
      />
    )
  }
  return (
    <div
      aria-hidden
      className={cn(
        sizeClasses[size],
        "flex shrink-0 items-center justify-center bg-muted text-muted-foreground/70 ring-1 ring-black/[0.04]",
        className
      )}
    >
      <Building2 className={size === "lg" ? "size-5" : "size-4"} />
    </div>
  )
}
