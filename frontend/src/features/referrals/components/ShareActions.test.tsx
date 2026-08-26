import { fireEvent, render, screen } from '@testing-library/react'
import { toast } from 'sonner'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { ShareActions } from './ShareActions'

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

let jobCounter = 0
function makeJob(overrides: Partial<{ id: string; slug: string }> = {}) {
  jobCounter += 1
  return {
    id: overrides.id ?? `job-${jobCounter}`,
    slug: overrides.slug ?? 'founding-engineer',
    title: 'Founding Engineer',
    company: { name: 'Example Labs' },
  }
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('ShareActions', () => {
  it('opens a menu with email, LinkedIn, WhatsApp, and copy link options', () => {
    render(<ShareActions job={makeJob()} />)
    fireEvent.click(screen.getByRole('button', { name: /share this job/i }))

    expect(screen.getByRole('menu', { name: /share this job/i })).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: /email/i })).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: /linkedin/i })).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: /whatsapp/i })).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: /copy link/i })).toBeInTheDocument()
  })

  it('copies the link to the clipboard and confirms with a toast', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, { clipboard: { writeText } })
    const onShare = vi.fn()

    render(<ShareActions job={makeJob()} onShare={onShare} />)
    fireEvent.click(screen.getByRole('button', { name: /share this job/i }))
    fireEvent.click(screen.getByRole('menuitem', { name: /copy link/i }))

    await vi.waitFor(() => expect(writeText).toHaveBeenCalled())
    expect(toast.success).toHaveBeenCalledWith('Link copied')
    expect(onShare).toHaveBeenCalled()
  })

  it('shows an error toast when the clipboard write fails', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('denied'))
    Object.assign(navigator, { clipboard: { writeText } })

    render(<ShareActions job={makeJob()} variant="compact" />)
    fireEvent.click(screen.getByRole('button', { name: /share this job/i }))
    fireEvent.click(screen.getByRole('menuitem', { name: /copy link/i }))

    await vi.waitFor(() => expect(toast.error).toHaveBeenCalled())
  })

  it('closes the menu after a channel is selected', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, { clipboard: { writeText } })

    render(<ShareActions job={makeJob()} />)
    fireEvent.click(screen.getByRole('button', { name: /share this job/i }))
    fireEvent.click(screen.getByRole('menuitem', { name: /copy link/i }))

    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('renders an icon-only trigger in the compact variant', () => {
    render(<ShareActions job={makeJob()} variant="compact" />)
    const trigger = screen.getByRole('button', { name: /share this job/i })
    expect(trigger).toHaveAccessibleName('Share this job')
    expect(trigger.textContent).toBe('')
  })
})
