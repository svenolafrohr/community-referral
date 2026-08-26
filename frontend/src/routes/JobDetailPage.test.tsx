import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { getJobBySlug } from '../features/jobs/api'
import type { Job } from '../features/jobs/model'
import { ConfigurationError } from '../lib/errors'
import { JobDetailPage } from './JobDetailPage'

vi.mock('../features/jobs/api', () => ({
  getJobBySlug: vi.fn(),
}))

const getJobBySlugMock = vi.mocked(getJobBySlug)

const job: Job = {
  id: '1',
  slug: 'founding-engineer',
  title: 'Founding Engineer',
  description: 'Build the product from zero to one.',
  summary: 'Own product engineering.',
  location: 'Berlin',
  remotePolicy: 'hybrid',
  seniority: 'Senior',
  functionArea: 'Engineering',
  community: 'CDTM',
  referralBonusAmount: 500,
  referralBonusCurrency: 'EUR',
  status: 'active',
  publishedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  company: { id: 'c1', name: 'Example Labs', slug: 'example-labs', logoUrl: null },
}

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/jobs/:slug" element={<JobDetailPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('JobDetailPage', () => {
  it('shows a loading state before the job resolves', () => {
    getJobBySlugMock.mockReturnValue(new Promise(() => {}))
    renderAt('/jobs/founding-engineer')
    expect(screen.getByRole('status')).toHaveTextContent('Loading job…')
  })

  it('renders the full job on success', async () => {
    getJobBySlugMock.mockResolvedValue(job)
    renderAt('/jobs/founding-engineer')
    expect(await screen.findByRole('heading', { name: 'Founding Engineer' })).toBeInTheDocument()
    expect(screen.getByText('Example Labs')).toBeInTheDocument()
    expect(screen.getByText('€500')).toBeInTheDocument()
    expect(screen.getByText('Build the product from zero to one.')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /share this job/i }))
    expect(screen.getByRole('menuitem', { name: /linkedin/i })).toBeInTheDocument()
  })

  it('shows a not-found state when the job does not exist', async () => {
    getJobBySlugMock.mockResolvedValue(null)
    renderAt('/jobs/missing-role')
    expect(await screen.findByText(/no longer available/i)).toBeInTheDocument()
  })

  it('shows a configuration-specific error when Supabase is not connected', async () => {
    getJobBySlugMock.mockRejectedValue(new ConfigurationError('missing env'))
    renderAt('/jobs/founding-engineer')
    expect(await screen.findByRole('alert')).toHaveTextContent('Connect Supabase in .env.local')
  })
})
