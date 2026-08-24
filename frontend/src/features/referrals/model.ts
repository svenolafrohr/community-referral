export type ReferralStatus = 'created' | 'clicked' | 'interested' | 'applied' | 'hired' | 'paid' | 'cancelled'

export interface ReferralLink {
  code: string
  url: string
  status: ReferralStatus
}
