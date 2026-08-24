import { describe, expect, it } from 'vitest'
import { mapJobRow } from './schemas'

describe('mapJobRow', () => {
  it('validates and maps a joined Supabase job row', () => {
    const job = mapJobRow({
      id: '11111111-1111-4111-8111-111111111111',
      slug: 'founding-engineer',
      title: 'Founding Engineer',
      description: 'Build the product.',
      summary: 'Own product engineering.',
      location: 'Berlin',
      remote_policy: 'hybrid',
      seniority: 'Senior',
      function_area: 'Engineering',
      community: 'CDTM',
      referral_bonus_amount: 500,
      referral_bonus_currency: 'EUR',
      status: 'active',
      published_at: '2026-08-24T12:00:00+00:00',
      created_at: '2026-08-24T12:00:00+00:00',
      companies: { id: '22222222-2222-4222-8222-222222222222', name: 'Example Labs', slug: 'example-labs', logo_url: null },
    })
    expect(job.company.name).toBe('Example Labs')
    expect(job.referralBonusAmount).toBe(500)
  })
})
