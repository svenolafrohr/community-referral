import { cn } from "@/lib/utils"
import { formatReferralBonus } from "@/lib/format"

export function BonusBadge({
  amount,
  currency,
  className,
  size = "default",
}: {
  amount: number | null
  currency: string
  className?: string
  size?: "default" | "lg"
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-full bg-foreground font-semibold text-background",
        size === "default" && "px-2.5 py-1 text-sm",
        size === "lg" && "px-3.5 py-1.5 text-base",
        amount === null && "bg-muted text-muted-foreground",
        className
      )}
    >
      {formatReferralBonus(amount, currency)}
    </span>
  )
}
