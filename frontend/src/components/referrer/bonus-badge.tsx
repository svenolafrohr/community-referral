import { cn } from "@/lib/utils"

export function formatBonus(amount: number) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount)
}

export function BonusBadge({
  amount,
  className,
  size = "default",
}: {
  amount: number
  className?: string
  size?: "default" | "lg"
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-full bg-foreground font-semibold text-background",
        size === "default" && "px-2.5 py-1 text-sm",
        size === "lg" && "px-3.5 py-1.5 text-base",
        className
      )}
    >
      {formatBonus(amount)}
    </span>
  )
}
