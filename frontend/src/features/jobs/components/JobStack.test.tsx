import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { toast } from 'sonner'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type { Job } from '../model'
import { JobStack } from './JobStack'

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

function makeJob(overrides: Partial<Job>): Job {
  return {
    id: overrides.id ?? crypto.randomUUID(),
    slug: overrides.slug ?? 'role',
    title: overrides.title ?? 'Role',
    description: 'Description',
    summary: null,
    location: 'Berlin',
    remotePolicy: 'hybrid',
    seniority: null,
    functionArea: 'Engineering',
    community: 'CDTM',
    referralBonusAmount: 100,
    referralBonusCurrency: 'EUR',
    status: 'active',
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    company: { id: 'c1', name: 'Company', slug: 'company', logoUrl: null },
    ...overrides,
  }
}

const jobs: Job[] = [
  makeJob({ id: '1', slug: 'founding-engineer', title: 'Founding Engineer' }),
  makeJob({ id: '2', slug: 'product-designer', title: 'Product Designer' }),
]

afterEach(() => {
  vi.restoreAllMocks()
})

describe('JobStack', () => {
  it('renders the first job on top', () => {
    render(<JobStack jobs={jobs} onOpenDetails={vi.fn()} />)
    expect(screen.getByText('Founding Engineer')).toBeInTheDocument()
  })

  it('advances to the next job when "Next job" is clicked', () => {
    render(<JobStack jobs={jobs} onOpenDetails={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: 'Next job' }))
    expect(screen.getByText('Product Designer')).toBeInTheDocument()
  })

  it('opens the share menu instead of a form when "Share this job" is clicked', () => {
    render(<JobStack jobs={jobs} onOpenDetails={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: 'Share this job' }))

    expect(screen.getByRole('menuitem', { name: /whatsapp/i })).toBeInTheDocument()
    expect(screen.queryByLabelText('Name')).not.toBeInTheDocument()
  })

  it('advances to the next job after the link is copied', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, { clipboard: { writeText } })

    render(<JobStack jobs={jobs} onOpenDetails={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: 'Share this job' }))
    fireEvent.click(screen.getByRole('menuitem', { name: /copy link/i }))

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Link copied'))
    await waitFor(() => expect(screen.getByText('Product Designer')).toBeInTheDocument())
  })

  it('opens the job detail page when the card body is clicked', () => {
    const onOpenDetails = vi.fn()
    render(<JobStack jobs={jobs} onOpenDetails={onOpenDetails} />)
    fireEvent.click(screen.getByText('Founding Engineer'))
    expect(onOpenDetails).toHaveBeenCalledWith(expect.objectContaining({ slug: 'founding-engineer' }))
  })
})
