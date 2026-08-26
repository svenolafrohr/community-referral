import { Search } from 'lucide-react'

export interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative mx-auto w-full max-w-xl">
      <Search
        className="pointer-events-none absolute top-1/2 left-5 size-5 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <input
        type="search"
        role="searchbox"
        aria-label="Search jobs"
        placeholder="Search by title, company, or location"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-14 w-full rounded-full border border-border bg-card pr-5 pl-12 text-[15px] text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.03),0_16px_32px_-20px_rgba(0,0,0,0.16)] transition-shadow placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
    </div>
  )
}
