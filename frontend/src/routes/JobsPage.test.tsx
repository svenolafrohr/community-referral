import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { listActiveJobs } from '../features/jobs/api'
import type { Job } from '../features/jobs/model'
import { ConfigurationError } from '../lib/errors'
import { JobsPage } from './JobsPage'

vi.mock('../features/jobs/api', () => ({
  listActiveJobs: vi.fn(),
}))

const listActiveJobsMock = vi.mocked(listActiveJobs)

const job: Job = {
  id: '1',
  slug: 'founding-engineer',
  title: 'Founding Engineer',
  description: 'Build the product.',
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

function renderPage() {
  return render(
    <MemoryRouter>
      <JobsPage />
    </MemoryRouter>,
  )
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('JobsPage', () => {
  it('shows a loading state before the jobs resolve', () => {
    listActiveJobsMock.mockReturnValue(new Promise(() => {}))
    renderPage()
    expect(screen.getByRole('status')).toHaveTextContent('Loading jobs…')
  })

  it('shows an empty state when there are no active jobs', async () => {
    listActiveJobsMock.mockResolvedValue([])
    renderPage()
    expect(await screen.findByText(/no jobs yet/i)).toBeInTheDocument()
  })

  it('renders job cards on success', async () => {
    listActiveJobsMock.mockResolvedValue([job])
    renderPage()
    expect(await screen.findByText('Founding Engineer')).toBeInTheDocument()
    expect(screen.getByText('Example Labs')).toBeInTheDocument()
  })

  it('shows a configuration-specific error when Supabase is not connected', async () => {
    listActiveJobsMock.mockRejectedValue(new ConfigurationError('missing env'))
    renderPage()
    expect(await screen.findByRole('alert')).toHaveTextContent('Connect Supabase in .env.local')
  })

  it('shows a generic error for unexpected failures', async () => {
    listActiveJobsMock.mockRejectedValue(new Error('network down'))
    renderPage()
    expect(await screen.findByRole('alert')).toHaveTextContent('Jobs could not be loaded')
  })

  it('narrows the visible jobs when a filter excludes the only match', async () => {
    listActiveJobsMock.mockResolvedValue([job])
    renderPage()
    await waitFor(() => expect(screen.getByText('Founding Engineer')).toBeInTheDocument())

    fireEvent.click(screen.getByRole('button', { name: 'Filter' }))
    fireEvent.click(screen.getByRole('checkbox', { name: 'On-site' }))

    expect(await screen.findByText(/no jobs match these filters/i)).toBeInTheDocument()
  })

  it('narrows the visible jobs by search text', async () => {
    listActiveJobsMock.mockResolvedValue([job])
    renderPage()
    await waitFor(() => expect(screen.getByText('Founding Engineer')).toBeInTheDocument())

    fireEvent.change(screen.getByRole('searchbox', { name: /search jobs/i }), {
      target: { value: 'nonexistent role' },
    })

    expect(await screen.findByText(/no jobs match these filters/i)).toBeInTheDocument()
  })
})
