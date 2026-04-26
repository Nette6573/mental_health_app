export interface DateRange {
  start: Date
  end: Date
  label: string
}

export interface MetricCard {
  id: string
  title: string
  value: number | string
  change: number
  trend: 'up' | 'down' | 'neutral'
  icon: string
  color: string
  format?: 'number' | 'currency' | 'percentage'
}

export interface TimeSeriesData {
  timestamp: string
  value: number
  category?: string
}

export interface UserMetrics {
  totalUsers: number
  activeUsers: number
  newUsers: number
  churnRate: number
  retentionRate: number
  averageSessionDuration: number
  demographics: {
    ageGroups: { group: string; count: number }[]
    genders: { gender: string; count: number }[]
    locations: { country: string; count: number; lat?: number; lng?: number }[]
  }
  growthData: TimeSeriesData[]
}