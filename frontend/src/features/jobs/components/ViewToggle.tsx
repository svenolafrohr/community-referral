import { Layers, LayoutGrid, List } from 'lucide-react'

import { cn } from '../../../lib/utils'

export type ViewMode = 'stack' | 'grid' | 'list'

const options: { mode: ViewMode; label: string; Icon: typeof List }[] = [
  { mode: 'stack', label: 'Show as cards', Icon: Layers },
  { mode: 'grid', label: 'Show as tiles', Icon: LayoutGrid },
  { mode: 'list', label: 'Show as list', Icon: List },
]

export interface ViewToggleProps {
  value: ViewMode
  onChange: (mode: ViewMode) => void
}

export function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <div
      role="group"
      aria-label="Switch view"
      className="inline-flex items-center gap-0.5 rounded-xl border border-border bg-card p-0.5"
    >
      {options.map(({ mode, label, Icon }) => (
        <button
          key={mode}
          type="button"
          aria-label={label}
          aria-pressed={value === mode}
          onClick={() => onChange(mode)}
          className={cn(
            'flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors',
            value === mode ? 'bg-muted text-foreground' : 'hover:text-foreground',
          )}
        >
          <Icon className="size-4" aria-hidden="true" />
        </button>
      ))}
    </div>
  )
}
