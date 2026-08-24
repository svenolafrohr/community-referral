import { describe, expect, it } from 'vitest'

import { formatPublishedDate, formatReferralBonus, formatRemotePolicy } from './format'

describe('formatReferralBonus', () => {
  it('formats a known amount as currency', () => {
    expect(formatReferralBonus(500, 'EUR')).toBe('€500')
  })

  it('falls back to a neutral label when the amount is not set', () => {
    expect(formatReferralBonus(null, 'EUR')).toBe('Bonus to be confirmed')
  })
})

describe('formatRemotePolicy', () => {
  it('maps each policy to a human label', () => {
    expect(formatRemotePolicy('remote')).toBe('Remote')
    expect(formatRemotePolicy('unspecified')).toBe('Location flexible')
  })
})

describe('formatPublishedDate', () => {
  it('returns a neutral label when there is no published date', () => {
    expect(formatPublishedDate(null)).toBe('Recently added')
  })

  it('describes today and yesterday explicitly', () => {
    const now = new Date().toISOString()
    expect(formatPublishedDate(now)).toBe('Posted today')
  })

  it('counts multiple days ago', () => {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    expect(formatPublishedDate(threeDaysAgo)).toBe('Posted 3 days ago')
  })
})
