"use client"

import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"

export function SearchBar({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="relative mx-auto w-full max-w-xl">
      <Search className="pointer-events-none absolute top-1/2 left-5 size-5 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Jobtitel, Firma oder Ort suchen"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-14 rounded-full border-border/70 bg-card pl-12 text-[15px] shadow-[0_1px_2px_rgba(0,0,0,0.03),0_16px_32px_-20px_rgba(0,0,0,0.16)] transition-shadow focus-visible:shadow-[0_1px_2px_rgba(0,0,0,0.03),0_16px_32px_-16px_rgba(0,0,0,0.2)]"
      />
    </div>
  )
}
