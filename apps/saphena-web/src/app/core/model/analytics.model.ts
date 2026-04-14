export interface TrafficAnalytics {
  type: TrafficSourceType,
  count: number
}

export interface AnalyticsDTO {
  type: string,
  amount: number
}

export enum TrafficSourceType {
  WORD_OF_MOUTH = 'WORD_OF_MOUTH',
  INSTAGRAM = 'INSTAGRAM',
  TIKTOK = 'TIKTOK',
  FACEBOOK = 'FACEBOOK',
  TWO_GIS = 'TWO_GIS',
  WEBSITE = 'WEBSITE',
  DOCTOR_REFERRAL = 'DOCTOR_REFERRAL',
  OTHER = 'OTHER'
}
