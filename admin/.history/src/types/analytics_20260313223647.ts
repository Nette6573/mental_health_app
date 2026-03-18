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
  format?: 'number' | 'currency' | 'percentage' | 'time'
  tooltip?: string
}

export interface TimeSeriesData {
  timestamp: string
  value: number
  category?: string
  label?: string
}

export interface UserAnalytics {
  totalUsers: number
  activeUsers: number
  newUsers: number
  churnRate: number
  retentionRate: number
  averageSessionDuration: number
  demographics: {
    ageGroups: { group: string; count: number; percentage: number }[]
    genders: { gender: string; count: number; percentage: number }[]
    locations: { country: string; count: number; percentage: number; lat?: number; lng?: number }[]
    devices: { device: string; count: number; percentage: number }[]
    browsers: { browser: string; count: number; percentage: number }[]
  }
  growthData: TimeSeriesData[]
  cohortData: {
    cohorts: { month: string; size: number; retention: number[] }[]
  }
}

export interface TherapistAnalytics {
  totalTherapists: number
  activeTherapists: number
  pendingVerification: number
  averageRating: number
  totalSessions: number
  averageSessionsPerTherapist: number
  topPerformers: {
    id: string
    name: string
    sessions: number
    rating: number
    revenue: number
    completionRate: number
  }[]
  specializationBreakdown: { specialization: string; count: number; percentage: number }[]
  sessionMetrics: {
    completed: number
    cancelled: number
    noShow: number
    averageLength: number
    completionRate: number
  }
  performanceOverTime: TimeSeriesData[]
  ratingDistribution: { rating: number; count: number }[]
}

export interface SessionAnalytics {
  totalSessions: number
  completedSessions: number
  cancelledSessions: number
  noShowSessions: number
  averageRating: number
  averageDuration: number
  totalRevenue: number
  peakHours: { hour: number; count: number; percentage: number }[]
  peakDays: { day: string; count: number; percentage: number }[]
  sessionTypes: { type: string; count: number; percentage: number }[]
  revenueByDay: TimeSeriesData[]
  revenueByTherapist: { therapistId: string; therapistName: string; amount: number }[]
  sessionDurationDistribution: { range: string; count: number }[]
  cancellationReasons: { reason: string; count: number }[]
}

export interface ResourceAnalytics {
  totalResources: number
  totalViews: number
  totalDownloads: number
  totalLikes: number
  totalShares: number
  averageEngagement: number
  popularResources: {
    id: string
    title: string
    type: string
    views: number
    likes: number
    shares: number
    completionRate?: number
  }[]
  categoryBreakdown: { category: string; count: number; views: number; percentage: number }[]
  typeBreakdown: { type: string; count: number; views: number; percentage: number }[]
  engagementOverTime: TimeSeriesData[]
  topTags: { tag: string; count: number; views: number }[]
  resourcePerformance: {
    viewsByDay: TimeSeriesData[]
    downloadsByDay: TimeSeriesData[]
    likesByDay: TimeSeriesData[]
  }
}

export interface RevenueAnalytics {
  totalRevenue: number
  revenueGrowth: number
  averageOrderValue: number
  customerLifetimeValue: number
  revenueByMonth: TimeSeriesData[]
  revenueByTherapist: { therapistId: string; therapistName: string; amount: number }[]
  revenueBySessionType: { type: string; amount: number; percentage: number }[]
  revenueByPaymentMethod: { method: string; amount: number; percentage: number }[]
  refundRate: number
  pendingPayments: number
  projectedRevenue: TimeSeriesData[]
  subscriptionMetrics: {
    activeSubscriptions: number
    newSubscriptions: number
    cancelledSubscriptions: number
    churnRate: number
    mrr: number
    arr: number
  }
}

export interface PlatformAnalytics {
  activeUsers: number
  pageViews: number
  averageLoadTime: number
  errorRate: number
  apiRequests: number
  apiResponseTime: number
  storageUsed: number
  bandwidthUsed: number
  uptime: number
  performanceMetrics: {
    cpu: number
    memory: number
    disk: number
  }
  errorsByType: { type: string; count: number }[]
  requestsByEndpoint: { endpoint: string; count: number; avgTime: number }[]
  userSatisfaction: {
    nps: number
    csat: number
    ces: number
  }
}

export interface AnalyticsFilter {
  dateRange: DateRange
  comparison?: 'previous_period' | 'previous_year' | 'none'
  groupBy?: 'hour' | 'day' | 'week' | 'month' | 'quarter'
  segments?: string[]
  metrics?: string[]
  filters?: Record<string, any>
}

export interface ExportConfig {
  format: 'csv' | 'excel' | 'pdf' | 'json'
  dateRange: DateRange
  metrics: string[]
  includeCharts: boolean
  includeRawData: boolean
  visualization?: 'table' | 'chart' | 'both'
}

export interface DashboardWidget {
  id: string
  type: 'metric' | 'chart' | 'table' | 'list'
  title: string
  size: 'small' | 'medium' | 'large' | 'full'
  dataSource: string
  config: Record<string, any>
  position: { x: number; y: number }
}