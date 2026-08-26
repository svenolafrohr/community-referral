import { createContext, useContext } from 'react'

export interface PopoverContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  triggerId: string
}

export const PopoverContext = createContext<PopoverContextValue | null>(null)

export function usePopoverContext(component: string) {
  const context = useContext(PopoverContext)
  if (!context) throw new Error(`<${component} /> must be used inside <Popover>`)
  return context
}

export function usePopover() {
  return usePopoverContext('usePopover')
}
