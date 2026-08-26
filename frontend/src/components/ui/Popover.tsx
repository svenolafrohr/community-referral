import {
  type ButtonHTMLAttributes,
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'

import { cn } from '../../lib/utils'
import { PopoverContext, usePopoverContext } from './popover-context'

export function Popover({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const triggerId = useId()
  return (
    <PopoverContext.Provider value={{ open, setOpen, triggerId }}>
      <span className="relative inline-block">{children}</span>
    </PopoverContext.Provider>
  )
}

export function PopoverTrigger({
  children,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  const { open, setOpen, triggerId } = usePopoverContext('PopoverTrigger')
  return (
    <button
      type="button"
      id={triggerId}
      aria-haspopup="menu"
      aria-expanded={open}
      onClick={(event) => {
        event.stopPropagation()
        setOpen(!open)
      }}
      className={className}
      {...props}
    >
      {children}
    </button>
  )
}

export function PopoverContent({
  children,
  align = 'end',
  className,
  role = 'dialog',
}: {
  children: ReactNode
  align?: 'start' | 'end'
  className?: string
  role?: 'menu' | 'dialog'
}) {
  const { open, setOpen, triggerId } = usePopoverContext('PopoverContent')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handlePointerDown(event: PointerEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false)
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, setOpen])

  if (!open) return null

  return (
    <div
      ref={ref}
      role={role}
      aria-labelledby={triggerId}
      onClick={(event) => event.stopPropagation()}
      className={cn(
        'absolute top-full z-50 mt-2 min-w-48 rounded-xl border border-border bg-card p-1.5 shadow-lg',
        align === 'end' ? 'right-0' : 'left-0',
        className,
      )}
    >
      {children}
    </div>
  )
}
