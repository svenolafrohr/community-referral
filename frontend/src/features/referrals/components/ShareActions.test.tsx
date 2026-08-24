import { fireEvent, render, screen } from '@testing-library/react'
import { toast } from 'sonner'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { ShareActions } from './ShareActions'

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

const url = 'https://example.com/jobs/founding-engineer'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('ShareActions', () => {
  it('renders copy link, WhatsApp, and email affordances by default', () => {
    render(<ShareActions url={url} jobTitle="Founding Engineer" companyName="Example Labs" />)

    expect(screen.getByRole('button', { name: /copy link/i })).toBeInTheDocument()

    const whatsapp = screen.getByRole('link', { name: /whatsapp/i })
    expect(whatsapp).toHaveAttribute('href', expect.stringContaining('https://wa.me/?text='))
    expect(whatsapp).toHaveAttribute('target', '_blank')

    const email = screen.getByRole('link', { name: /email/i })
    expect(email).toHaveAttribute('href', expect.stringContaining('mailto:?subject='))
  })

  it('copies the link to the clipboard and confirms with a toast', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, { clipboard: { writeText } })

    render(<ShareActions url={url} jobTitle="Founding Engineer" companyName="Example Labs" />)
    fireEvent.click(screen.getByRole('button', { name: /copy link/i }))
    await vi.waitFor(() => expect(writeText).toHaveBeenCalledWith(url))

    expect(toast.success).toHaveBeenCalledWith('Link copied')
  })

  it('shows an error toast when the clipboard write fails', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('denied'))
    Object.assign(navigator, { clipboard: { writeText } })

    render(<ShareActions url={url} jobTitle="Founding Engineer" companyName="Example Labs" variant="compact" />)
    fireEvent.click(screen.getByRole('button', { name: /copy link/i }))

    await vi.waitFor(() => expect(toast.error).toHaveBeenCalled())
  })

  it('renders only the copy action in the compact variant', () => {
    render(<ShareActions url={url} jobTitle="Founding Engineer" companyName="Example Labs" variant="compact" />)
    expect(screen.getByRole('button', { name: /copy link/i })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /whatsapp/i })).not.toBeInTheDocument()
  })
})
