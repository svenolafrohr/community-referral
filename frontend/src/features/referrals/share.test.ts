import { describe, expect, it } from 'vitest'
import { buildJobShareUrl } from './share'

describe('buildJobShareUrl', () => {
  it('adds an optional referral code without string concatenation', () => {
    expect(buildJobShareUrl('https://example.com', 'founding-engineer', 'ref_123')).toBe('https://example.com/jobs/founding-engineer?ref=ref_123')
  })
})
