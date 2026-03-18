import { DateRange, MetricCard } from '@/types/analytics'

export const DATE_RANGES: DateRange[] = [
  {
    start: new Date(new Date().setDate(new Date().getDate() - 1)),
    end: new Date(),
    label: 'Last 24 Hours',
  },
  {
    start: new Date(new Date().setDate(new Date().getDate() - 7)),
    end: new Date(),
    label: 'Last 7 Days',
  },
  {
    start: new Date(new Date().setDate(new Date().getDate() - 30)),
    end: new Date(),
    label: 'Last 30 Days',
  },
  {
    start: new Date(new Date().setMonth(new Date().getMonth() - 3)),
    end: new Date(),
    label: 'Last 3 Months',
  },
  {
    start: new Date(new Date().setMonth(new Date().getMonth() - 6)),
    end: new Date(),
    label: 'Last 6 Months',
  },
  {
    start: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
    end: new Date(),
    label: 'Last 12 Months',
  },
  {
    start: new Date(new Date().getFullYear(), 0, 1),
    end: new Date(),
    label: 'Year to Date',
  },
  {
    start: new Date(new Date().getFullYear() - 1, 0, 1),
    end: new Date(new Date().getFullYear() - 1, 11, 31),
    label: 'Previous Year',
  },
]

export const COMPARISON_OPTIONS = [
  { value: 'none', label: 'No Comparison' },
  { value: 'previous_period', label: 'Previous Period' },
  { value: 'previous_year', label: 'Previous Year' },
]

export const GROUP_BY_OPTIONS = [
  { value: 'hour', label: 'Hour' },
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'quarter', label: 'Quarter' },
]

export const CHART_COLORS = [
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
  '#14b8a6',
  '#f97316',
  '#6366f1',
  '#6b7280',
  '#94a3b8',
  '#475569',
]

export const CHART_GRADIENTS = {
  blue: ['#3b82f6', '#93c5fd'],
  green: ['#10b981', '#6ee7b7'],
  yellow: ['#f59e0b', '#fcd34d'],
  red: ['#ef4444', '#fca5a5'],
  purple: ['#8b5cf6', '#c4b5fd'],
  pink: ['#ec4899', '#fbcfe8'],
}

export const METRIC_CATEGORIES = {
  users: ['totalUsers', 'activeUsers', 'newUsers', 'churnRate', 'retentionRate'],
  therapists: ['totalTherapists', 'activeTherapists', 'averageRating', 'sessionCompletion'],
  sessions: ['totalSessions', 'completedSessions', 'revenue', 'averageRating'],
  resources: ['totalResources', 'totalViews', 'engagement', 'downloads'],
  revenue: ['totalRevenue', 'mrr', 'arr', 'averageOrderValue'],
  platform: ['uptime', 'apiRequests', 'errorRate', 'averageLoadTime'],
}

export const MOCK_METRICS: MetricCard[] = [
  {
    id: 'totalUsers',
    title: 'Total Users',
    value: 15432,
    change: 12.5,
    trend: 'up',
    icon: 'users',
    color: 'blue',
    format: 'number',
    tooltip: 'Total registered users',
  },
  {
    id: 'activeUsers',
    title: 'Active Users',
    value: 8765,
    change: 8.2,
    trend: 'up',
    icon: 'activity',
    color: 'green',
    format: 'number',
    tooltip: 'Users active in last 30 days',
  },
  {
    id: 'totalSessions',
    title: 'Total Sessions',
    value: 3421,
    change: -2.4,
    trend: 'down',
    icon: 'calendar',
    color: 'orange',
    format: 'number',
    tooltip: 'Total therapy sessions',
  },
  {
    id: 'revenue',
    title: 'Revenue',
    value: 128450,
    change: 15.8,
    trend: 'up',
    icon: 'dollar',
    color: 'purple',
    format: 'currency',
    tooltip: 'Total revenue this period',
  },
  {
    id: 'avgRating',
    title: 'Avg. Rating',
    value: 4.8,
    change: 0.3,
    trend: 'up',
    icon: 'star',
    color: 'yellow',
    format: 'percentage',
    tooltip: 'Average session rating',
  },
  {
    id: 'retentionRate',
    title: 'Retention Rate',
    value: 76,
    change: 5.2,
    trend: 'up',
    icon: 'users',
    color: 'pink',
    format: 'percentage',
    tooltip: 'User retention rate',
  },
]

export const MOCK_USER_GROWTH = Array.from({ length: 30 }, (_, i) => ({
  timestamp: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString(),
  value: Math.floor(Math.random() * 100) + 15000,
  label: `Day ${i + 1}`,
}))

export const MOCK_REVENUE_DATA = Array.from({ length: 12 }, (_, i) => ({
  timestamp: new Date(2025, i, 1).toISOString(),
  value: Math.floor(Math.random() * 50000) + 100000,
  label: new Date(2025, i, 1).toLocaleString('default', { month: 'short' }),
}))

export const MOCK_SESSIONS_DATA = Array.from({ length: 30 }, (_, i) => ({
  timestamp: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString(),
  value: Math.floor(Math.random() * 50) + 100,
}))

export const MOCK_USER_DEMOGRAPHICS = {
  ageGroups: [
    { group: '18-24', count: 2345, percentage: 15.2 },
    { group: '25-34', count: 5678, percentage: 36.8 },
    { group: '35-44', count: 4321, percentage: 28.0 },
    { group: '45-54', count: 2345, percentage: 15.2 },
    { group: '55+', count: 743, percentage: 4.8 },
  ],
  genders: [
    { gender: 'Female', count: 8765, percentage: 56.8 },
    { gender: 'Male', count: 6543, percentage: 42.4 },
    { gender: 'Other', count: 124, percentage: 0.8 },
  ],
  locations: [
    { country: 'Jamaica', count: 5678, percentage: 36.8, lat: 18.1096, lng: -77.2975 },
    { country: 'USA', count: 4321, percentage: 28.0, lat: 37.0902, lng: -95.7129 },
    { country: 'Canada', count: 2345, percentage: 15.2, lat: 56.1304, lng: -106.3468 },
    { country: 'UK', count: 1234, percentage: 8.0, lat: 55.3781, lng: -3.4360 },
    { country: 'Australia', count: 876, percentage: 5.7, lat: -25.2744, lng: 133.7751 },
    { country: 'Other', count: 978, percentage: 6.3 },
  ],
  devices: [
    { device: 'Mobile', count: 9876, percentage: 64.0 },
    { device: 'Desktop', count: 4321, percentage: 28.0 },
    { device: 'Tablet', count: 1235, percentage: 8.0 },
  ],
  browsers: [
    { browser: 'Chrome', count: 8765, percentage: 56.8 },
    { browser: 'Safari', count: 4321, percentage: 28.0 },
    { browser: 'Firefox', count: 1234, percentage: 8.0 },
    { browser: 'Edge', count: 876, percentage: 5.7 },
    { browser: 'Other', count: 236, percentage: 1.5 },
  ],
}

export const MOCK_THERAPIST_ANALYTICS = {
  totalTherapists: 45,
  activeTherapists: 38,
  pendingVerification: 4,
  averageRating: 4.7,
  totalSessions: 3421,
  averageSessionsPerTherapist: 90,
  topPerformers: [
    { id: 'th1', name: 'Dr. Sarah Johnson', sessions: 245, rating: 4.9, revenue: 29400, completionRate: 98 },
    { id: 'th2', name: 'Dr. Michael Brown', sessions: 198, rating: 4.8, revenue: 23760, completionRate: 95 },
    { id: 'th3', name: 'Dr. Emily White', sessions: 167, rating: 4.9, revenue: 20040, completionRate: 97 },
    { id: 'th4', name: 'Dr. David Chen', sessions: 156, rating: 4.7, revenue: 18720, completionRate: 94 },
    { id: 'th5', name: 'Dr. Maria Garcia', sessions: 145, rating: 4.8, revenue: 17400, completionRate: 96 },
  ],
  specializationBreakdown: [
    { specialization: 'Anxiety', count: 12, percentage: 26.7 },
    { specialization: 'Depression', count: 10, percentage: 22.2 },
    { specialization: 'Trauma', count: 8, percentage: 17.8 },
    { specialization: 'Relationships', count: 7, percentage: 15.6 },
    { specialization: 'Faith-Based', count: 5, percentage: 11.1 },
    { specialization: 'Other', count: 3, percentage: 6.6 },
  ],
  sessionMetrics: {
    completed: 3210,
    cancelled: 156,
    noShow: 55,
    averageLength: 52,
    completionRate: 93.8,
  },
  performanceOverTime: Array.from({ length: 12 }, (_, i) => ({
    timestamp: new Date(2025, i, 1).toISOString(),
    value: Math.floor(Math.random() * 50) + 200,
  })),
  ratingDistribution: [
    { rating: 5, count: 1876 },
    { rating: 4, count: 876 },
    { rating: 3, count: 234 },
    { rating: 2, count: 45 },
    { rating: 1, count: 12 },
  ],
}

export const MOCK_SESSION_ANALYTICS = {
  totalSessions: 3421,
  completedSessions: 3210,
  cancelledSessions: 156,
  noShowSessions: 55,
  averageRating: 4.7,
  averageDuration: 52,
  totalRevenue: 384250,
  // ✅ FIX: Added sessionMetrics object — was missing, causing crash at page.tsx line 375
  sessionMetrics: {
    completionRate: 93.8,
    cancellationRate: 4.6,
    noShowRate: 1.6,
    averageLength: 52,
  },
  peakHours: [
    { hour: 10, count: 456, percentage: 14.2 },
    { hour: 14, count: 423, percentage: 13.2 },
    { hour: 11, count: 398, percentage: 12.4 },
    { hour: 15, count: 376, percentage: 11.7 },
    { hour: 9, count: 345, percentage: 10.8 },
  ],
  peakDays: [
    { day: 'Monday', count: 587, percentage: 18.3 },
    { day: 'Tuesday', count: 543, percentage: 16.9 },
    { day: 'Wednesday', count: 521, percentage: 16.2 },
    { day: 'Thursday', count: 498, percentage: 15.5 },
    { day: 'Friday', count: 467, percentage: 14.5 },
    { day: 'Saturday', count: 321, percentage: 10.0 },
    { day: 'Sunday', count: 273, percentage: 8.5 },
  ],
  sessionTypes: [
    { type: 'Individual', count: 2456, percentage: 76.5 },
    { type: 'Couples', count: 543, percentage: 16.9 },
    { type: 'Family', count: 187, percentage: 5.8 },
    { type: 'Group', count: 235, percentage: 7.3 },
  ],
  revenueByDay: Array.from({ length: 30 }, (_, i) => ({
    timestamp: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString(),
    value: Math.floor(Math.random() * 5000) + 10000,
  })),
  revenueByTherapist: [
    { therapistId: 'th1', therapistName: 'Dr. Sarah Johnson', amount: 29400 },
    { therapistId: 'th2', therapistName: 'Dr. Michael Brown', amount: 23760 },
    { therapistId: 'th3', therapistName: 'Dr. Emily White', amount: 20040 },
  ],
  sessionDurationDistribution: [
    { range: '0-30 min', count: 234 },
    { range: '30-45 min', count: 876 },
    { range: '45-60 min', count: 1543 },
    { range: '60-90 min', count: 654 },
    { range: '90+ min', count: 114 },
  ],
  cancellationReasons: [
    { reason: 'Client scheduling conflict', count: 67 },
    { reason: 'Therapist emergency', count: 34 },
    { reason: 'Client no-show', count: 55 },
    { reason: 'Technical issues', count: 23 },
    { reason: 'Other', count: 32 },
  ],
}

export const MOCK_RESOURCE_ANALYTICS = {
  totalResources: 156,
  totalViews: 45321,
  totalDownloads: 12345,
  totalLikes: 8765,
  totalShares: 4321,
  averageEngagement: 4.2,
  popularResources: [
    { id: 'res1', title: 'Understanding Anxiety', type: 'book', views: 5432, likes: 876, shares: 432 },
    { id: 'res2', title: 'Daily Devotionals', type: 'book', views: 4876, likes: 765, shares: 387 },
    { id: 'res3', title: 'Meditation for Stress', type: 'audio', views: 3987, likes: 654, shares: 298 },
    { id: 'res4', title: 'Faith & Mental Health Podcast', type: 'podcast', views: 3456, likes: 543, shares: 276 },
    { id: 'res5', title: 'Coping with Grief', type: 'video', views: 2987, likes: 432, shares: 198 },
  ],
  categoryBreakdown: [
    { category: 'Anxiety & Stress', count: 34, views: 12345, percentage: 27.2 },
    { category: 'Faith & Spirituality', count: 28, views: 10987, percentage: 24.2 },
    { category: 'Depression', count: 22, views: 8765, percentage: 19.3 },
    { category: 'Relationships', count: 19, views: 6543, percentage: 14.4 },
    { category: 'Trauma & PTSD', count: 15, views: 4321, percentage: 9.5 },
    { category: 'Other', count: 38, views: 2360, percentage: 5.2 },
  ],
  typeBreakdown: [
    { type: 'article', count: 45, views: 12345, percentage: 27.2 },
    { type: 'book', count: 23, views: 15678, percentage: 34.6 },
    { type: 'video', count: 28, views: 8765, percentage: 19.3 },
    { type: 'audio', count: 19, views: 4321, percentage: 9.5 },
    { type: 'podcast', count: 15, views: 2987, percentage: 6.6 },
    { type: 'worksheet', count: 26, views: 1225, percentage: 2.7 },
  ],
  engagementOverTime: Array.from({ length: 30 }, (_, i) => ({
    timestamp: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString(),
    value: Math.floor(Math.random() * 500) + 1000,
  })),
  topTags: [
    { tag: 'anxiety', count: 45, views: 12345 },
    { tag: 'faith', count: 38, views: 10987 },
    { tag: 'depression', count: 32, views: 9876 },
    { tag: 'meditation', count: 28, views: 8765 },
    { tag: 'stress', count: 25, views: 7654 },
  ],
  resourcePerformance: {
    viewsByDay: Array.from({ length: 30 }, (_, i) => ({
      timestamp: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString(),
      value: Math.floor(Math.random() * 200) + 500,
    })),
    downloadsByDay: Array.from({ length: 30 }, (_, i) => ({
      timestamp: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString(),
      value: Math.floor(Math.random() * 50) + 100,
    })),
    likesByDay: Array.from({ length: 30 }, (_, i) => ({
      timestamp: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString(),
      value: Math.floor(Math.random() * 30) + 50,
    })),
  },
}

export const MOCK_REVENUE_ANALYTICS = {
  totalRevenue: 384250,
  revenueGrowth: 15.8,
  averageOrderValue: 112.50,
  customerLifetimeValue: 1250.75,
  revenueByMonth: Array.from({ length: 12 }, (_, i) => ({
    timestamp: new Date(2025, i, 1).toISOString(),
    value: Math.floor(Math.random() * 50000) + 100000,
  })),
  revenueByTherapist: [
    { therapistId: 'th1', therapistName: 'Dr. Sarah Johnson', amount: 67250 },
    { therapistId: 'th2', therapistName: 'Dr. Michael Brown', amount: 54320 },
    { therapistId: 'th3', therapistName: 'Dr. Emily White', amount: 48760 },
    { therapistId: 'th4', therapistName: 'Dr. David Chen', amount: 42340 },
    { therapistId: 'th5', therapistName: 'Dr. Maria Garcia', amount: 38980 },
  ],
  revenueBySessionType: [
    { type: 'Individual', amount: 294500, percentage: 76.6 },
    { type: 'Couples', amount: 65150, percentage: 17.0 },
    { type: 'Family', amount: 22400, percentage: 5.8 },
    { type: 'Group', amount: 28200, percentage: 7.3 },
  ],
  revenueByPaymentMethod: [
    { method: 'Credit Card', amount: 268975, percentage: 70.0 },
    { method: 'Insurance', amount: 76850, percentage: 20.0 },
    { method: 'PayPal', amount: 38425, percentage: 10.0 },
  ],
  refundRate: 2.3,
  pendingPayments: 23450,
  projectedRevenue: Array.from({ length: 6 }, (_, i) => ({
    timestamp: new Date(2025, 6 + i, 1).toISOString(),
    value: Math.floor(Math.random() * 50000) + 120000,
  })),
  subscriptionMetrics: {
    activeSubscriptions: 876,
    newSubscriptions: 123,
    cancelledSubscriptions: 45,
    churnRate: 5.1,
    mrr: 21900,
    arr: 262800,
  },
}

export const MOCK_PLATFORM_ANALYTICS = {
  activeUsers: 8765,
  pageViews: 234567,
  averageLoadTime: 1.2,
  errorRate: 0.5,
  apiRequests: 45678,
  apiResponseTime: 234,
  storageUsed: 1572864000,
  bandwidthUsed: 524288000,
  uptime: 99.98,
  performanceMetrics: {
    cpu: 45,
    memory: 62,
    disk: 58,
  },
  errorsByType: [
    { type: '404 Not Found', count: 234 },
    { type: '500 Server Error', count: 56 },
    { type: 'Rate Limit Exceeded', count: 123 },
    { type: 'Authentication Failed', count: 89 },
    { type: 'Validation Error', count: 167 },
  ],
  requestsByEndpoint: [
    { endpoint: '/api/users', count: 12345, avgTime: 145 },
    { endpoint: '/api/sessions', count: 9876, avgTime: 234 },
    { endpoint: '/api/resources', count: 8765, avgTime: 156 },
    { endpoint: '/api/therapists', count: 6543, avgTime: 189 },
    { endpoint: '/api/auth', count: 4321, avgTime: 98 },
  ],
  userSatisfaction: {
    nps: 72,
    csat: 4.5,
    ces: 3.8,
  },
}