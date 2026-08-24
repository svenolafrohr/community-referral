import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import type { Job } from '../model'
import { JobList } from './JobList'

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

describe('JobList', () => {
  it('renders a row per job linking to its detail page', () => {
    render(
      <MemoryRouter>
        <JobList jobs={[job]} />
      </MemoryRouter>,
    )

    const link = screen.getByRole('link', { name: /founding engineer/i })
    expect(link).toHaveAttribute('href', '/jobs/founding-engineer')
    expect(screen.getByText('Example Labs')).toBeInTheDocument()
    expect(screen.getByText('Berlin')).toBeInTheDocument()
    expect(screen.getByText('€500')).toBeInTheDocument()
  })
})
