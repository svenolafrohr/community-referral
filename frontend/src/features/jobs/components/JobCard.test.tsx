import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import type { Job } from '../model'
import { JobCard } from './JobCard'

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

function renderCard(overrides: Partial<Job> = {}) {
  return render(
    <MemoryRouter>
      <JobCard job={{ ...job, ...overrides }} />
    </MemoryRouter>,
  )
}

describe('JobCard', () => {
  it('shows the company, title, bonus, and key attributes', () => {
    renderCard()
    expect(screen.getByText('Example Labs')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Founding Engineer' })).toHaveAttribute(
      'href',
      '/jobs/founding-engineer',
    )
    expect(screen.getByText('€500')).toBeInTheDocument()
    expect(screen.getByText('Hybrid')).toBeInTheDocument()
    expect(screen.getByText('Berlin')).toBeInTheDocument()
  })

  it('falls back to the description when there is no summary', () => {
    renderCard({ summary: null, description: 'Full description text.' })
    expect(screen.getByText('Full description text.')).toBeInTheDocument()
  })

  it('shows a neutral label when the bonus is not confirmed', () => {
    renderCard({ referralBonusAmount: null })
    expect(screen.getByText('Bonus to be confirmed')).toBeInTheDocument()
  })
})
