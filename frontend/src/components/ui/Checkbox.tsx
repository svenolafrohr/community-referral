import type { InputHTMLAttributes } from 'react'
import { Check } from 'lucide-react'

import { cn } from '../../lib/utils'

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

export function Checkbox({ checked, onCheckedChange, className, ...props }: CheckboxProps) {
  return (
    <span className={cn('relative inline-flex size-4 shrink-0', className)}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onCheckedChange(event.target.checked)}
        className="peer absolute inset-0 size-4 cursor-pointer appearance-none rounded border border-border bg-card checked:border-primary checked:bg-primary"
        {...props}
      />
      <Check
        aria-hidden="true"
        className="pointer-events-none relative size-4 scale-0 text-primary-foreground transition-transform peer-checked:scale-100"
      />
    </span>
  )
}
